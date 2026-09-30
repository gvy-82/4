@echo off
echo ========================================
echo  Сборка Release APK
echo ========================================
echo.

REM Проверка ключа подписи
if not exist android\release-key.jks (
    echo ОШИБКА: Ключ подписи не найден!
    echo.
    echo Создайте ключ подписи командой:
    echo keytool -genkey -v -keystore android\release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key
    echo.
    pause
    exit /b 1
)

echo [1/3] Переход в папку android...
cd android
if errorlevel 1 (
    echo ОШИБКА: Папка android не найдена!
    pause
    exit /b 1
)

echo [2/3] Сборка Release APK...
echo.
call gradlew.bat assembleRelease
if errorlevel 1 (
    echo.
    echo ОШИБКА: Сборка не удалась!
    pause
    exit /b 1
)

echo.
echo [3/3] APK собран!
echo.
echo ========================================
echo  Release APK успешно собран!
echo ========================================
echo.
echo Расположение APK:
echo android\app\build\outputs\apk\release\app-release.apk
echo.
echo ВАЖНО: Этот APK подписан вашим ключом
echo и готов для публикации в Google Play Store
echo.
pause
