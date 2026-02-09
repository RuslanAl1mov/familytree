from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import UserKeyManager, UserManager


class User(AbstractUser):
    first_name = models.CharField(
        verbose_name="First name", max_length=250, null=False, blank=False
    )
    email = models.EmailField(verbose_name="Email", unique=True)
    photo = models.ImageField(
        upload_to="profile/user_image/",
        verbose_name="Avatar",
        null=True,
        blank=True,
        default=None,
    )

    objects: UserManager = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def save(self, *args, **kwargs):
        if not self.username and self.email:
            self.username = self.email.split("@")[0]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} (ID: {self.id})"


class UserKey(models.Model):
    class KeyType(models.TextChoices):
        EMAIL_CONFIRM = "email_confirm", "Email confirmation"
        FORGOT_PASSWORD = "forgot_passwrod", "Password recover"
        REGISTERATION = "registeration", "Registration"

    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="User")
    key = models.CharField(max_length=60, unique=True, verbose_name="Key")
    value = models.CharField(
        max_length=255, verbose_name="Value", null=True, blank=True
    )
    expire_date = models.DateField(verbose_name="Expire date")
    key_type = models.CharField(
        max_length=20, choices=KeyType.choices, verbose_name="Key type"
    )

    objects: UserKeyManager = UserKeyManager()

    class Meta:
        verbose_name = "User key"
        verbose_name_plural = "Users keys"

    def __str__(self):
        return f"#{self.id} {self.user_id}: {self.key_type}"
