 ## Команды для работы с Линтером

Все команды запускаются из корня проекта (там, где **backend.toml**).

Линт проекта
```
ruff check .
```

Линт конкретного файла/папки
```
ruff check app/
ruff check core/views.py
```

Автоисправления (fix)
```
ruff check . --fix
```

Посмотреть дифф исправлений (без записи)
```
ruff check . --fix --diff
```

Форматирование
```
ruff format .
```

Форматирование конкретного файла/папки
```
ruff format app/
ruff format core/views.py
```

Посмотреть дифф форматирования (без записи)
```
ruff format . --diff
```

Быстрый “привести проект в порядок”
```
ruff format . && ruff check . --fix
```