from django.conf import settings
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.settings import api_settings as jwt_settings

from services.auth_service import SetCookieService
from services.localize_error_messages import get_localized_error_message

from .errors import UserAuthErrors
from .models import User
from .serializers import (
    UserSerializer,
    UserLoginSerializer,
    UserRegisterSerializer,
    CookieTokenRefreshSerializer,
)


class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = (AllowAny,)

    def _authenticate_user(self, email: str, password: str) -> User | None:
        try:
            user = User.objects.get(
                email=email,
                is_active=True,
            )
        except User.DoesNotExist:
            return
        is_correct_pass = user.check_password(password)
        return user if is_correct_pass else None

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = self._authenticate_user(
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
        )
        if not user:
            return Response(
                {
                    "detail": get_localized_error_message(
                        UserAuthErrors.WRONG_EMAIL_OR_PASSWORD, request
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])
                  
        refresh = RefreshToken.for_user(user)
        user_serialized_data = UserSerializer(user).data
        resp = Response(user_serialized_data, status=status.HTTP_200_OK)

        origin = request.headers.get("Origin", "")
        cookie_service = SetCookieService(origin)
        cookie_service.set_response_cookie(resp, refresh)
        return resp


class UserRegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = (AllowAny,)
    

class RefreshViewWithCookieSupport(TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        origin = request.headers.get("Origin", "")
        cookie_service = SetCookieService(origin)

        if response.status_code == status.HTTP_200_OK and "access" in response.data:
            cookie_service.set_access_token_to_cookie(response, response.data["access"])
            response.data["access_expiration"] = (
                timezone.now() + jwt_settings.ACCESS_TOKEN_LIFETIME
            )

        if response.status_code == status.HTTP_200_OK and "refresh" in response.data:
            cookie_service.set_refresh_token_to_cookie(
                response, response.data["refresh"]
            )
            if settings.REST_AUTH.get("JWT_AUTH_HTTPONLY"):
                del response.data["refresh"]
            else:
                response.data["refresh_expiration"] = (
                    timezone.now() + jwt_settings.REFRESH_TOKEN_LIFETIME
                )
        return super().finalize_response(request, response, *args, **kwargs)


class LogoutView(generics.GenericAPIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        response = Response(
            {"detail": "Successfully logged out."},
            status=status.HTTP_200_OK,
        )

        refresh_token_name = settings.REST_AUTH.get("JWT_AUTH_REFRESH_COOKIE")
        access_token_name = settings.REST_AUTH.get("JWT_AUTH_COOKIE")

        response.delete_cookie(
            access_token_name,
            samesite=settings.CSRF_COOKIE_SAMESITE,
        )
        response.delete_cookie(
            refresh_token_name,
            samesite=settings.CSRF_COOKIE_SAMESITE,
        )
        return response
    

class UserMeView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        serialized_data = UserSerializer(request.user).data
        return Response(serialized_data, status=status.HTTP_200_OK)