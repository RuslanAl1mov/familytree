from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User, UserKey


@admin.register(User)
class UserAdmin(UserAdmin):
    # Поля, которые будут отображаться в списке пользователей
    list_display = ("id", "email", "first_name", "last_name", "is_staff")
    # Поля, по которым доступен поиск
    search_fields = ("email", "first_name", "last_name")
    # Порядок сортировки
    ordering = ("email",)
    
    # Группировка полей в форме редактирования
    fieldsets = (
        (None, {"fields": ("username", "email", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "photo")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    # Поля, которые используются при создании пользователя через админку
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "first_name", "last_name", "password"),
        }),
    )


@admin.register(UserKey)
class UserKeyAdmin(admin.ModelAdmin):
    """
    Админ-класс для модели UserKey.
    """

    list_display = ("user", "key", "value")
    list_filter = ("user",)
