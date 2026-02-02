"""
Настройки Jazzmin админ-панели

Для получения информации о настройке панели: https://django-jazzmin.readthedocs.io/configuration
"""

JAZZMIN_SETTINGS = {
    "site_title": "FamilyTree",
    "site_header": "FamilyTree",
    "site_brand": "FamilyTree",
    "site_logo": None,
    "login_logo": "media/images/project/familytree-logo.png",
    "login_logo_dark": None,
    "site_logo_classes": "",
    "site_icon": None,
    "welcome_sign": "Добро пожаловать в FamilyTree",
    "copyright": "FamilyTree",
    "user_avatar": None,

    "topmenu_links": [
        # {"name": "Home", "url": "admin:index", "permissions": ["auth.view_user"]},
    ],

    "show_sidebar": True,
    "navigation_expanded": True,
    "hide_apps": [],
    "hide_models": [],
    "custom_css": None,
    "custom_js": None,
    "use_google_fonts_cdn": True,
    "show_ui_builder": False,
    "changeform_format": "horizontal_tabs",
}


JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": True,
    "footer_small_text": True,
    "body_small_text": True,
    "brand_small_text": False,
    "accent": "accent-primary",
    "navbar": "navbar-white navbar-light",
    "no_navbar_border": True,
    "navbar_fixed": True,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": True,
    "sidebar_nav_small_text": True,
    "sidebar_disable_expand": True,
    "sidebar_nav_child_indent": False,
    "sidebar_nav_compact_style": True,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": True,
    "theme": "default",
    "dark_mode_theme": None,
    "button_classes": {
        "primary": "btn-outline-primary",
        "secondary": "btn-outline-secondary",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success",
    },
    "actions_sticky_top": False,
}
