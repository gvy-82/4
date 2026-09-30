#!/bin/bash

echo "========================================"
echo " Сборка Release APK"
echo "========================================"
echo ""

# Проверка ключа подписи
if [ ! -f "android/release-key.jks" ]; then
    echo "ОШИБКА: Ключ подписи не найден!"
    echo ""
    echo "Создайте ключ подписи командой:"
    echo "keytool -genkey -v -keystore android/release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key"
    echo ""
    exit 1
fi

echo "[1/3] Переход в папку android..."
cd android || exit

echo "[2/3] Сборка Release APK..."
echo ""
./gradlew assembleRelease
if [ $? -ne 0 ]; then
    echo ""
    echo "ОШИБКА: Сборка не удалась!"
    exit 1
fi

echo ""
echo "[3/3] APK собран!"
echo ""
echo "========================================"
echo " Release APK успешно собран!"
echo "========================================"
echo ""
echo "Расположение APK:"
echo "android/app/build/outputs/apk/release/app-release.apk"
echo ""
echo "ВАЖНО: Этот APK подписан вашим ключом"
echo "и готов для публикации в Google Play Store"
echo ""
