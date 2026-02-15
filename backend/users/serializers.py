import bleach
from django.conf import settings
from django.utils import timezone
from rest_framework import serializers
from django.utils.translation import gettext_lazy
from django.db import IntegrityError, transaction
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from services.localize_error_messages import get_localized_error_message
from services.mixins.dynamic_fields_mixin import DynamicFieldsModelSerializer
from services.media_service import get_media_url

from .errors import UserAuthErrors
from .models import (
    User,
    UserKey
)


class UserRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=250)
    last_name = serializers.CharField(max_length=250)

    class Meta:
        model = User
        fields = ("email", "first_name", "last_name")

    def validate_first_name(self, value):
        return bleach.clean(value, tags=[], strip=True)

    def validate_last_name(self, value):
        return bleach.clean(value, tags=[], strip=True)

    def create(self, validated_data):
        email = validated_data["email"]
        first_name = validated_data["first_name"]
        last_name = validated_data["last_name"]
        try:
            with transaction.atomic():
                user = User.objects.create_user(
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    username=email.split("@")[0],
                    role=User.AccountType.CLIENT,
                    last_login=timezone.now()
                )
                UserKey.objects.create_key(user, UserKey.KeyType.REGISTRATION)
                # key_obj = UserKey.objects.create_key(user, UserKey.KeyType.REGISTRATION)

        except IntegrityError as e:
            raise ValidationError(
                get_localized_error_message(
                    UserAuthErrors.USER_WITH_EMAIL_EXITS, self.context.get("request")
                )
            ) from e
        # Отправка письма
        # send_welcome_email.delay(email, first_name, key_obj.key)

        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = serializers.CharField(
        required=False, help_text=gettext_lazy("WIll override cookie.")
    )

    def extract_refresh_token(self):
        request = self.context["request"]
        if request.data.get("refresh"):
            return request.data["refresh"]

        cookie_name = settings.REST_AUTH.get("JWT_AUTH_REFRESH_COOKIE")
        if cookie_name and cookie_name in request.COOKIES:
            refresh_token = request.COOKIES.get(cookie_name)

            return refresh_token
        else:
            raise InvalidToken(gettext_lazy("No valid refresh token found"))

    def validate(self, attrs):
        attrs["refresh"] = self.extract_refresh_token()
        return super().validate(attrs)


class UserSerializer(DynamicFieldsModelSerializer):
    photo = serializers.SerializerMethodField(read_only=True)

    def get_photo(self, instance):
        request = self.context.get("request")
        return get_media_url(request, instance, "photo")

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "language",
            "is_active",
            "is_staff",
            "is_superuser",
            "phone_number",
            "photo",
            "role",
            "username",
        )
