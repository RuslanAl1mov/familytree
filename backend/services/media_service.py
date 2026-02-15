import os
import requests
from pathlib import Path
from urllib.parse import urlparse

from django.conf import settings
from django.core.files.base import ContentFile
from rest_framework.request import Request

from users.models import User


class AvatarService:
    def __init__(self, http_client=requests, storage_root: Path | None = None):
        self.http = http_client
        self.storage_root = storage_root or Path(settings.MEDIA_ROOT)

    def sync_user_photo(self, user: User, url: str | None) -> None:
        if not url:
            return
        if user.photo and user.photo.name:
            local_path = self.storage_root / user.photo.name
            if local_path.exists():
                return

        content = self.fetch_content(url)
        if not content:
            return

        ext = os.path.splitext(urlparse(url).path)[1] or ".jpg"
        filename = f"{user.username}{ext}"
        self.save_to_user(user, content, filename)

    def fetch_content(self, url: str) -> bytes | None:
        try:
            resp = self.http.get(url, timeout=5)
            resp.raise_for_status()
            return resp.content
        except Exception:
            return None

    @staticmethod
    def save_to_user(user: User, content: bytes, filename: str) -> None:
        user.photo.save(filename, ContentFile(content), save=True)
        

def get_media_url(
    request: Request | None, instance: object, field_name: str
) -> str | None:
    media = getattr(instance, field_name, None)
    if not media:
        return None
    medial_url = media.url
    if request:
        return request.build_absolute_uri(medial_url)
    return f"{settings.BACKEND_DOMAIN}{medial_url}"
