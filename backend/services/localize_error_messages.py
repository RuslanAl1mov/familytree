from rest_framework.request import Request

from users.models import User

"""
Классы с ошибками кладутся в errors.py общего компонента
(например, access_app/errors.py)
Пример написания класса с ошибками:

class ErrorMessage:
    class OfferSource:
        OFFER_CHANGE_SAME_CLIENT_ID_REQUIRED = {
            "ru": "Изменять оффер можно только в рамках одного клиента",
            "en": "Changing offer is allowed only between offers with same client"
        }
"""


def get_localized_error_message(error_message: dict, request: Request) -> str:
    """
    Функция для локализации кастомных сообщений об ошибках с бэкенда
    На вход принимается словарь с языками и текстами ошибок, а также объект пользователя

    :param error_message: Словарь с языками и текстами ошибок
    :type error_message: dict
    :param user: Объект пользователя
    :type user: User
    """
    user = getattr(request, "user", None)
    user_language = getattr(user, "language", User.Languages.EN)
    headers = getattr(request, "headers", None)
    language = (
        headers.get("Accept-Language", user_language) if headers else user_language
    )
    return error_message.get(language, error_message.get(User.Languages.EN))
