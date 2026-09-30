# 📱 Сборка APK через VS Code

## 📋 Что нужно установить

### 1. Node.js и npm
Скачайте с https://nodejs.org (версия 18 или выше)

### 2. Java JDK 11 или 17
Скачайте с https://adoptium.net/
- Выберите **Temurin 17 (LTS)**
- Установите, запомните путь (обычно `C:\Program Files\Eclipse Adoptium\jdk-17...`)

### 3. Android SDK Command Line Tools
Скачайте с https://developer.android.com/studio#command-tools
- Выберите **"Command line tools only"**
- Распакуйте в папку, например: `C:\Android\Sdk`

### 4. VS Code расширения
Установите в VS Code:
- **Android iOS Emulator** (для тестирования)
- **Gradle for Java** (опционально)

---

## 🚀 Пошаговая инструкция

### Шаг 1: Настройка переменных окружения

#### Windows:
1. Нажмите `Win + R`, введите `sysdm.cpl`, нажмите Enter
2. Вкладка **"Дополнительно"** → **"Переменные среды"**
3. В разделе **"Системные переменные"** создайте/измените:

**JAVA_HOME:**
```
C:\Program Files\Eclipse Adoptium\jdk-17.0.0.0-hotspot
```
(замените на ваш путь к JDK)

**ANDROID_HOME:**
```
C:\Android\Sdk
```
(замените на ваш путь к Android SDK)

**Path** (добавьте в конец):
```
%JAVA_HOME%\bin
%ANDROID_HOME%\cmdline-tools\latest\bin
%ANDROID_HOME%\platform-tools
```

4. Перезапустите VS Code

#### Mac/Linux:
Добавьте в `~/.bashrc` или `~/.zshrc`:
```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
```

### Шаг 2: Установка компонентов Android SDK

Откройте терминал в VS Code (`Ctrl + ~`) и выполните:

```bash
sdkmanager --install "platform-tools"
sdkmanager --install "platforms;android-34"
sdkmanager --install "build-tools;34.0.0"
```

### Шаг 3: Создание local.properties

Создайте файл `android/local.properties` с путём к SDK:

**Windows:**
```properties
sdk.dir=C:\\Android\\Sdk
```

**Mac:**
```properties
sdk.dir=/Users/ВАШ_ПОЛЬЗОВАТЕЛЬ/Library/Android/sdk
```

**Linux:**
```properties
sdk.dir=/home/ВАШ_ПОЛЬЗОВАТЕЛЬ/Android/Sdk
```

### Шаг 4: Сборка APK

#### Автоматическая сборка (рекомендуется):

**Windows:**
```bash
build.bat
```

**Mac/Linux:**
```bash
chmod +x build.sh
./build.sh
```

#### Ручная сборка:

Откройте терминал в VS Code в папке `android/` и выполните:

**Windows:**
```bash
cd android
gradlew.bat assembleDebug
```

**Mac/Linux:**
```bash
cd android
./gradlew assembleDebug
```

### Шаг 5: Найдите APK

APK будет в папке:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Шаг 6: Установка на телефон

#### Метод 1: Через USB
1. Включите **"Режим разработчика"** на телефоне:
   - Настройки → О телефоне → Нажмите 7 раз на "Номер сборки"
2. Включите **"Отладка по USB"**:
   - Настройки → Для разработчиков → Отладка по USB
3. Подключите телефон через USB
4. Выполните в терминале:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

#### Метод 2: Копирование файла
1. Скопируйте `app-debug.apk` на телефон
2. Откройте файл на телефоне
3. Разрешите установку из неизвестных источников
4. Нажмите "Установить"

---

## 🐛 Решение проблем

### Проблема: "JAVA_HOME is not set"

**Решение:**
1. Проверьте переменные окружения (см. Шаг 1)
2. Перезапустите VS Code
3. Проверьте в терминале:
```bash
java -version
```

### Проблема: "SDK location not found"

**Решение:**
Создайте файл `android/local.properties` с правильным путём к SDK (см. Шаг 3)

### Проблема: "Could not find tools.jar"

**Решение:**
Убедитесь, что установлен JDK (не JRE):
```bash
javac -version
```

### Проблема: "Failed to install Android SDK components"

**Решение:**
Примите лицензии:
```bash
sdkmanager --licenses
```
Нажмите `y` для всех лицензий.

### Проблема: "Gradle sync failed"

**Решение:**
1. Удалите папку `android/.gradle`
2. Удалите файл `android/app/build`
3. Перезапустите VS Code
4. Повторите сборку

### Проблема: "Installation failed" на телефоне

**Решение:**
1. Удалите старую версию приложения
2. Попробуйте установить через ADB:
```bash
adb uninstall com.russianradio.app
adb install app-debug.apk
```

---

## 📦 Создание Release APK

Для создания финальной версии:

### Шаг 1: Создайте ключ подписи

```bash
keytool -genkey -v -keystore android/release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key
```

Запомните пароль!

### Шаг 2: Соберите Release APK

**Windows:**
```bash
build-release.bat
```

**Mac/Linux:**
```bash
./build-release.sh
```

Или вручную:
```bash
cd android
gradlew.bat assembleRelease
```

Release APK будет в:
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎯 Быстрый старт (Windows)

1. Установите Node.js, JDK 17, Android SDK
2. Настройте переменные окружения
3. Откройте проект в VS Code
4. Откройте терминал (`Ctrl + ~`)
5. Выполните:
```bash
build.bat
```
6. Готово! APK в папке `android/app/build/outputs/apk/debug/`

---

## 🎯 Быстрый старт (Mac/Linux)

1. Установите Node.js, JDK 17, Android SDK
2. Настройте переменные окружения
3. Откройте проект в VS Code
4. Откройте терминал (`Ctrl + ~`)
5. Выполните:
```bash
chmod +x build.sh
./build.sh
```
6. Готово! APK в папке `android/app/build/outputs/apk/debug/`

---

## 📊 Полезные команды

**Очистка проекта:**
```bash
cd android
gradlew.bat clean
```

**Проверка конфигурации:**
```bash
cd android
gradlew.bat tasks
```

**Запуск на эмуляторе:**
```bash
cd android
gradlew.bat installDebug
```

**Просмотр логов:**
```bash
adb logcat
```

---

## ✅ Проверка работоспособности

После установки приложения:
1. Откройте приложение на телефоне
2. Должен появиться список из 108 радиостанций
3. Нажмите на любую станцию
4. Должна начаться трансляция
5. Проверьте фильтры и поиск

---

## 🎉 Готово!

Теперь вы можете собирать APK прямо из VS Code без Android Studio!
