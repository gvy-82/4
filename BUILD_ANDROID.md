# 📱 Сборка Android-приложения Russian Radio

## 📋 Что вам нужно

1. **Android Studio** (скачать: https://developer.android.com/studio)
2. **Java JDK 8 или выше**
3. **Android SDK** (устанавливается вместе с Android Studio)

## 🚀 Пошаговая инструкция

### Шаг 1: Установите Android Studio

1. Скачайте Android Studio с https://developer.android.com/studio
2. Установите и запустите
3. При первом запуске выберите "Standard" установку
4. Дождитесь загрузки всех компонентов SDK

### Шаг 2: Откройте проект

1. Запустите Android Studio
2. Выберите **"Open an existing project"**
3. Найдите папку `android/` в вашем проекте
4. Нажмите **"OK"**
5. Дождитесь синхронизации Gradle (может занять 2-5 минут)

### Шаг 3: Скопируйте HTML файл

Скопируйте файл `radio.html` в папку:
```
android/app/src/main/assets/www/radio.html
```

Если папка `assets/www/` не существует, создайте её.

**Или выполните команду в терминале:**
```bash
# Windows
copy radio.html android\app\src\main\assets\www\radio.html

# Mac/Linux
cp radio.html android/app/src/main/assets/www/radio.html
```

### Шаг 4: Соберите APK

#### Вариант А: Через Android Studio (рекомендуется)

1. В меню выберите **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Дождитесь завершения сборки (2-3 минуты)
3. После завершения появится уведомление **"APK(s) generated successfully"**
4. Нажмите **"locate"** чтобы найти APK файл
5. APK будет в папке: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Вариант Б: Через командную строку

Откройте терминал в папке `android/` и выполните:

**Windows:**
```bash
gradlew.bat assembleDebug
```

**Mac/Linux:**
```bash
./gradlew assembleDebug
```

APK будет в папке: `android/app/build/outputs/apk/debug/app-debug.apk`

### Шаг 5: Установите APK на телефон

#### Метод 1: Через USB кабель

1. Включите **"Режим разработчика"** на телефоне:
   - Настройки → О телефоне → Нажмите 7 раз на "Номер сборки"
2. Включите **"Отладка по USB"**:
   - Настройки → Для разработчиков → Отладка по USB
3. Подключите телефон к компьютеру через USB
4. Разрешите отладку на телефоне
5. В Android Studio нажмите кнопку **"Run"** (зелёная стрелка ▶)
6. Выберите ваш телефон и нажмите OK

#### Метод 2: Копирование APK файла

1. Скопируйте файл `app-debug.apk` на телефон (через USB, email, облако)
2. На телефоне откройте файловый менеджер
3. Найдите файл APK и нажмите на него
4. Разрешите установку из неизвестных источников
5. Нажмите **"Установить"**

## 📦 Создание релизной версии (Release APK)

Для создания финальной версии для публикации:

### Шаг 1: Создайте ключ подписи

Откройте терминал в папке `android/` и выполните:

**Windows:**
```bash
keytool -genkey -v -keystore release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key
```

**Mac/Linux:**
```bash
keytool -genkey -v -keystore release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key
```

Запомните пароль, который вы установили!

### Шаг 2: Настройте подписывание

Откройте файл `android/app/build.gradle` и добавьте в секцию `android`:

```gradle
signingConfigs {
    release {
        storeFile file('../release-key.jks')
        storePassword 'ВАШ_ПАРОЛЬ'
        keyAlias 'my-key'
        keyPassword 'ВАШ_ПАРОЛЬ'
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### Шаг 3: Соберите Release APK

В Android Studio:
1. Выберите **Build → Generate Signed Bundle / APK**
2. Выберите **"APK"**
3. Укажите путь к файлу `release-key.jks` и введите пароль
4. Выберите **"release"**
5. Нажмите **"Finish"**

Release APK будет в папке: `android/app/build/outputs/apk/release/app-release.apk`

## 🔧 Решение проблем

### Проблема: "Gradle sync failed"

**Решение:**
1. Проверьте интернет-соединение
2. В Android Studio: **File → Invalidate Caches / Restart**
3. Дождитесь полной индексации

### Проблема: "SDK location not found"

**Решение:**
1. Создайте файл `android/local.properties`
2. Добавьте строку (путь к вашему Android SDK):
   ```
   # Windows
   sdk.dir=C:\\Users\\ВАШ_ПОЛЬЗОВАТЕЛЬ\\AppData\\Local\\Android\\Sdk
   
   # Mac
   sdk.dir=/Users/ВАШ_ПОЛЬЗОВАТЕЛЬ/Library/Android/sdk
   
   # Linux
   sdk.dir=/home/ВАШ_ПОЛЬЗОВАТЕЛЬ/Android/Sdk
   ```

### Проблема: "Installation failed" на телефоне

**Решение:**
1. Удалите старую версию приложения (если есть)
2. Включите **"Неизвестные источники"** в настройках телефона
3. Попробуйте установить через ADB:
   ```bash
   adb install app-debug.apk
   ```

### Проблема: Приложение не загружает радио

**Решение:**
1. Проверьте интернет-соединение на телефоне
2. Убедитесь, что файл `radio.html` скопирован в `assets/www/`
3. Проверьте логи в Android Studio: **View → Tool Windows → Logcat**

## 📊 Характеристики приложения

- **Минимальная версия Android:** 4.0 (Ice Cream Sandwich, API 14)
- **Целевая версия:** Android 14 (API 34)
- **Размер APK:** ~2-3 MB
- **Разрешения:** Интернет, состояние сети
- **Архитектура:** Universal (armeabi-v7a, arm64-v8a, x86, x86_64)

## 🎯 Альтернативные способы сборки

### Способ 2: Apache Cordova

Если не хотите использовать Android Studio:

1. Установите Node.js: https://nodejs.org
2. Установите Cordova:
   ```bash
   npm install -g cordova
   ```
3. Создайте проект:
   ```bash
   cordova create russian-radio com.russianradio.app RussianRadio
   cd russian-radio
   ```
4. Скопируйте `radio.html` в папку `www/`
5. Добавьте Android платформу:
   ```bash
   cordova platform add android
   ```
6. Соберите APK:
   ```bash
   cordova build android
   ```

APK будет в папке: `platforms/android/app/build/outputs/apk/debug/app-debug.apk`

### Способ 3: Онлайн-сервисы

Используйте онлайн-конвертеры:
- **WebIntoApp** (https://www.webintoapp.com)
- **AppsGeyser** (https://appsgeyser.com)
- **Gonative** (https://gonative.io)

Загрузите `radio.html` и получите готовый APK.

## ✅ Проверка работоспособности

После установки приложения:

1. Откройте приложение
2. Должен появиться список из 108 радиостанций
3. Нажмите на любую станцию
4. Должна начаться трансляция
5. Проверьте фильтры и поиск

## 📝 Примечания

- **Debug APK** — для тестирования (можно установить на любой телефон)
- **Release APK** — для публикации (нужно подписать ключом)
- Приложение работает на **Android 4.0+** (99% устройств)
- Размер APK минимален (~2-3 MB)
- Все данные хранятся в HTML файле внутри APK

## 🎉 Готово!

Теперь у вас есть полноценное Android-приложение с 108 радиостанциями!

Если возникли вопросы или проблемы, проверьте раздел "Решение проблем" выше.
