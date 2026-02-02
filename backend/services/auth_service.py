from datetime import timedelta
from django.conf import settings
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


class SetCookieService:
    """
    Main set cookie service
    """

    def __init__(self):
        self.refresh_token_name = settings.REST_AUTH.get("JWT_AUTH_REFRESH_COOKIE")
        self.access_token_name = settings.REST_AUTH.get("JWT_AUTH_COOKIE")

    @staticmethod
    def _seconds(v: int | timedelta):
        return int(v.total_seconds()) if isinstance(v, timedelta) else int(v)

    def set_access_token(self, response: Response, token: str) -> None:
        response.set_cookie(
            key=self.access_token_name,
            value=token,
            httponly=settings.REST_AUTH.get("JWT_AUTH_HTTPONLY"),
            secure=settings.SESSION_COOKIE_SECURE,
            samesite=settings.CSRF_COOKIE_SAMESITE,
            max_age=self._seconds(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"]),
        )

    def set_refresh_token(self, response: Response, token: str) -> None:
        response.set_cookie(
            key=self.refresh_token_name,
            value=token,
            httponly=settings.REST_AUTH.get("JWT_AUTH_HTTPONLY"),
            secure=settings.SESSION_COOKIE_SECURE,
            samesite=settings.CSRF_COOKIE_SAMESITE,
            max_age=self._seconds(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]),
        )

    def set_cookie(self, response: Response, token: RefreshToken) -> None:
        self.set_access_token(response, str(token.access_token))
        self.set_refresh_token(response, str(token))
