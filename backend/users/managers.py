from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.hashers import make_password
from datetime import date, timedelta
from django.db import models
import secrets


class UserManager(BaseUserManager):

    def _create_user(self, email, password, **extra_fields):
        """
        Create and save a user with the given username, email, and password.
        """
        if not email:
            raise ValueError("The Email field is required.")

        email = self.normalize_email(email)
        # Extract username from email if not set
        if not extra_fields.get("username"):
            extra_fields.setdefault("username", email.split("@")[0])

        user = self.model(email=email, **extra_fields)
        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email: str, password: str | None = None, **extra_fields):
        """
        User create function.
        """
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email: str, password: str | None = None, **extra_fields):
        """
        Superuser create function.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)


class UserKeyManager(models.Manager):
    def create_key(self, user, key_type, value=None):
        today = date.today()
        expire_date = today + timedelta(hours=10)
        exist_key = self.model.objects.filter(
            user=user,
            key_type=key_type,
            expire_date__gte=today,
        ).first()
        if exist_key:
            if value != exist_key.value:
                exist_key.value = value
                exist_key.expire_date = expire_date
                exist_key.save(update_fields=("value", "expire_date"))
            return exist_key
        key = self.generate_key(user.id)
        user_key_obj = self.model(
            user=user, key_type=key_type, key=key, expire_date=expire_date, value=value
        )
        user_key_obj.save()
        return user_key_obj

    @staticmethod
    def generate_key() -> str:
        # key lenght = 54 letters
        return secrets.token_urlsafe(40)
