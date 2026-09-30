#!/bin/bash

echo "========================================"
echo " Сборка APK через VS Code"
echo "========================================"
echo ""

# Проверка Java
echo "[1/4] Проверка Java..."
if ! command -v java &> /dev/null; then
    echo "ОШИБКА: Java не найдена!"
    echo "Установите JDK 17 с https://adoptium.net/"
    exit 1
fi
java -version
echo ""

# Проверка Android SDK
echo "[2/4] Проверка Android SDK..."
if [ -z "$ANDROID_HOME" ]; then
    echo "ОШИБКА: ANDROID_HOME не установлена!"
    echo "Установите Android SDK и добавьте переменную окружения"
    exit 1
fi
echo "Android SDK: $ANDROID_HOME"
echo ""

# Переход в папку android
echo "[3/4] Переход в папку android..."
cd android || exit
echo ""

# Делаем gradlew исполняемым
chmod +x gradlew

# Сборка APK
echo "[4/4] Сборка APK..."
echo ""
./gradlew assembleDebug
if [ $? -ne 0 ]; then
    echo ""
    echo "ОШИБКА: Сборка не удалась!"
    echo "Проверьте логи выше"
    exit 1
fi

echo ""
echo "========================================"
echo " APK успешно собран!"
echo "========================================"
echo ""
echo "Расположение APK:"
echo "android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "Для установки на телефон:"
echo "1. Подключите телефон через USB"
echo "2. Включите 'Отладка по USB' в настройках"
echo "3. Выполните: adb install app/build/outputs/apk/debug/app-debug.apk"
echo ""
