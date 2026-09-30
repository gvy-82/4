@echo off
echo ========================================
echo  Сборка APK через VS Code
echo ========================================
echo.

REM Проверка Java
echo [1/4] Проверка Java...
java -version
if errorlevel 1 (
    echo ОШИБКА: Java не найдена!
    echo Установите JDK 17 с https://adoptium.net/
    pause
    exit /b 1
)
echo.

REM Проверка Android SDK
echo [2/4] Проверка Android SDK...
if not defined ANDROID_HOME (
    echo ОШИБКА: ANDROID_HOME не установлена!
    echo Установите Android SDK и добавьте переменную окружения
    pause
    exit /b 1
)
echo Android SDK: %ANDROID_HOME%
echo.

REM Переход в папку android
echo [3/4] Переход в папку android...
cd android
if errorlevel 1 (
    echo ОШИБКА: Папка android не найдена!
    pause
    exit /b 1
)
echo.

REM Сборка APK
echo [4/4] Сборка APK...
echo.
call gradlew.bat assembleDebug
if errorlevel 1 (
    echo.
    echo ОШИБКА: Сборка не удалась!
    echo Проверьте логи выше
    pause
    exit /b 1
)

echo.
echo ========================================
echo  APK успешно собран!
echo ========================================
echo.
echo Расположение APK:
echo android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo Для установки на телефон:
echo 1. Подключите телефон через USB
echo 2. Включите "Отладка по USB" в настройках
echo 3. Выполните: adb install app\build\outputs\apk\debug\app-debug.apk
echo.
pause
