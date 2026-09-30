# 📱 Сборка Android APK через VS Code

Полное руководство по созданию Android-приложения из HTML-файла с помощью VS Code.

## 🎯 Что вы получите

- ✅ Android-приложение с 108 радиостанциями
- ✅ Совместимость с Android 4.0+ (99% устройств)
- ✅ Размер APK: ~2-3 MB
- ✅ Работает офлайн (кроме потоков радио)

## 📚 Документация

### 🚀 Быстрый старт (5 минут)
**Файл:** `QUICK_START.md`

Для тех, кто хочет быстро собрать APK без лишних деталей.

### 📖 Полная инструкция
**Файл:** `BUILD_VSCODE.md`

Подробное руководство с решением всех возможных проблем.

### 📦 Gradle Wrapper
**Файл:** `GET_GRADLE_WRAPPER.md`

Инструкция по получению необходимого файла `gradle-wrapper.jar`.

## 🗂️ Структура проекта

```
project/
├── radio.html                          ← Ваше приложение
├── build.bat                           ← Скрипт сборки (Windows)
├── build.sh                            ← Скрипт сборки (Mac/Linux)
├── build-release.bat                   ← Релизная сборка (Windows)
├── build-release.sh                    ← Релизная сборка (Mac/Linux)
├── QUICK_START.md                      ← Быстрый старт
├── BUILD_VSCODE.md                     ← Полная инструкция
├── GET_GRADLE_WRAPPER.md               ← Получение Gradle Wrapper
└── android/                            ← Android проект
    ├── app/
    │   ├── src/main/
    │   │   ├── java/.../MainActivity.java
    │   │   ├── res/...
    │   │   ├── assets/www/radio.html
    │   │   └── AndroidManifest.xml
    │   ├── build.gradle
    │   └── proguard-rules.pro
    ├── gradle/
    │   └── wrapper/
    │       ├── gradle-wrapper.jar      ← Нужно скачать!
    │       └── gradle-wrapper.properties
    ├── gradlew                         ← Unix скрипт
    ├── gradlew.bat                     ← Windows скрипт
    ├── build.gradle
    ├── settings.gradle
    └── local.properties.example        ← Пример конфигурации
```

## ⚡ Быстрый старт

### 1. Установите необходимое

**Windows:**
```powershell
choco install temurin17 androidsdk
```

**Mac:**
```bash
brew install openjdk@17 android-sdk
```

### 2. Настройте переменные окружения

**Windows:**
- `JAVA_HOME` = путь к JDK 17
- `ANDROID_HOME` = путь к Android SDK
- Добавьте в `Path`: `%JAVA_HOME%\bin` и `%ANDROID_HOME%\cmdline-tools\latest\bin`

**Mac/Linux:**
```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin
```

### 3. Установите компоненты SDK

```bash
sdkmanager --install "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

### 4. Создайте local.properties

```bash
cp android/local.properties.example android/local.properties
```

Отредактируйте `android/local.properties` и укажите путь к SDK.

### 5. Скачайте Gradle Wrapper

**Windows:**
```powershell
Invoke-WebRequest -Uri "https://github.com/gradle/gradle/raw/v8.2.0/gradle/wrapper/gradle-wrapper.jar" -OutFile "android/gradle/wrapper/gradle-wrapper.jar"
```

**Mac/Linux:**
```bash
curl -L "https://github.com/gradle/gradle/raw/v8.2.0/gradle/wrapper/gradle-wrapper.jar" -o "android/gradle/wrapper/gradle-wrapper.jar"
```

### 6. Соберите APK

**Windows:**
```bash
build.bat
```

**Mac/Linux:**
```bash
chmod +x build.sh
./build.sh
```

### 7. Установите на телефон

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## 🎉 Готово!

APK находится в: `android/app/build/outputs/apk/debug/app-debug.apk`

## 🔄 Альтернативные способы

### Способ 1: Онлайн-конвертер

Если не хотите устанавливать SDK:

1. Откройте https://www.webintoapp.com
2. Загрузите `radio.html`
3. Настройте параметры
4. Скачайте готовый APK

### Способ 2: Apache Cordova

```bash
npm install -g cordova
cordova create russian-radio com.russianradio.app RussianRadio
cd russian-radio
# Скопируйте radio.html в папку www/
cordova platform add android
cordova build android
```

### Способ 3: Android Studio

Если предпочитаете графический интерфейс:

1. Установите Android Studio
2. Откройте папку `android/`
3. Build → Build APK(s)

## 📊 Характеристики приложения

| Параметр | Значение |
|----------|----------|
| Минимальная версия Android | 4.0 (Ice Cream Sandwich) |
| Целевая версия | Android 14 (API 34) |
| Размер APK | ~2-3 MB |
| Количество станций | 108 |
| Разрешения | Интернет, состояние сети |
| Архитектура | Universal (все процессоры) |

## 🐛 Решение проблем

### Java не найдена
```bash
java -version
```
Если ошибка - установите JDK 17 и настройте `JAVA_HOME`

### SDK location not found
Создайте файл `android/local.properties` с путем к SDK

### Gradle Wrapper не найден
Скачайте `gradle-wrapper.jar` (см. `GET_GRADLE_WRAPPER.md`)

### Установка на телефон не работает
Включите "Отладка по USB" в настройках телефона

### Подробные решения
Смотрите `BUILD_VSCODE.md`

## 📦 Создание Release APK

Для публикации в Google Play:

1. Создайте ключ подписи:
```bash
keytool -genkey -v -keystore android/release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key
```

2. Отредактируйте `android/app/build.gradle`:
```gradle
signingConfigs {
    release {
        storeFile file('../release-key.jks')
        storePassword 'ВАШ_ПАРОЛЬ'
        keyAlias 'my-key'
        keyPassword 'ВАШ_ПАРОЛЬ'
    }
}
```

3. Соберите Release APK:
```bash
build-release.bat  # Windows
./build-release.sh # Mac/Linux
```

## 📝 Полезные команды

**Очистка проекта:**
```bash
cd android
gradlew.bat clean  # Windows
./gradlew clean    # Mac/Linux
```

**Просмотр задач:**
```bash
cd android
gradlew.bat tasks
```

**Просмотр логов:**
```bash
adb logcat
```

**Удаление приложения:**
```bash
adb uninstall com.russianradio.app
```

## 🎓 Дополнительная информация

- **Официальная документация Android:** https://developer.android.com/docs
- **Gradle User Guide:** https://docs.gradle.org/8.2/userguide/userguide.html
- **Android Studio:** https://developer.android.com/studio
- **Java JDK:** https://adoptium.net/

## ✅ Чек-лист перед сборкой

- [ ] Установлен JDK 17
- [ ] Установлен Android SDK
- [ ] Настроены переменные окружения (JAVA_HOME, ANDROID_HOME)
- [ ] Установлены компоненты SDK (platform-tools, platforms;android-34, build-tools;34.0.0)
- [ ] Создан файл `android/local.properties`
- [ ] Скачан файл `android/gradle/wrapper/gradle-wrapper.jar`
- [ ] Файл `radio.html` скопирован в `android/app/src/main/assets/www/`

## 🎉 Успехов в разработке!

Если возникли вопросы или проблемы, смотрите подробную инструкцию в `BUILD_VSCODE.md`.
