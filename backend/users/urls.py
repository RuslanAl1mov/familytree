from django.urls import path

from .views import (
    LogoutView,
    RefreshViewWithCookieSupport,
    UserLoginView,
    UserMeView,
    UserRegisterView,
)

urlpatterns = [
    # auth path
    path("login/", UserLoginView.as_view(), name="user-auth-login"),
    path("logout/", LogoutView.as_view(), name="user-auth-logout"),
    path("register/", UserRegisterView.as_view(), name="user-auth-register"),
    path(
        "token/refresh/",
        RefreshViewWithCookieSupport.as_view(),
        name="user-auth-token-refresh",
    ),
    path("me/", UserMeView.as_view(), name="user-auth-me"),
]
