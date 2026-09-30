# 🚀 Быстрый старт: Сборка APK через VS Code

## ⚡ Самый быстрый способ (5 минут)

### 1. Установите необходимое

**Windows:**
```powershell
# Установите Chocolatey (менеджер пакетов)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Установите JDK и Android SDK
choco install temurin17
choco install androidsdk
```

**Mac:**
```bash
# Установите Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Установите JDK и Android SDK
brew install openjdk@17
brew install --cask android-sdk
```

### 2. Настройте переменные окружения

**Windows:**
1. Нажмите `Win + R`, введите `sysdm.cpl`
2. Вкладка "Дополнительно" → "Переменные среды"
3. Добавьте:
   - `JAVA_HOME` = `C:\Program Files\Eclipse Adoptium\jdk-17.0.0.0-hotspot`
   - `ANDROID_HOME` = `C:\Android\Sdk`
   - В `Path` добавьте: `%JAVA_HOME%\bin` и `%ANDROID_HOME%\cmdline-tools\latest\bin`

**Mac/Linux:**
```bash
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin' >> ~/.zshrc
source ~/.zshrc
```

### 3. Установите компоненты Android SDK

```bash
sdkmanager --install "platform-tools"
sdkmanager --install "platforms;android-34"
sdkmanager --install "build-tools;34.0.0"
```

### 4. Создайте local.properties

Скопируйте файл:
```bash
cp android/local.properties.example android/local.properties
```

Отредактируйте `android/local.properties` и укажите путь к SDK:

**Windows:**
```properties
sdk.dir=C:\\Android\\Sdk
```

**Mac:**
```properties
sdk.dir=/Users/ВАШ_ПОЛЬЗОВАТЕЛЬ/Library/Android/sdk
```

### 5. Скачайте Gradle Wrapper

Скачайте файл `gradle-wrapper.jar`:
```bash
# Windows PowerShell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/gradle/gradle/v8.2.0/gradle/wrapper/gradle-wrapper.jar" -OutFile "android/gradle/wrapper/gradle-wrapper.jar"

# Mac/Linux
curl -L "https://raw.githubusercontent.com/gradle/gradle/v8.2.0/gradle/wrapper/gradle-wrapper.jar" -o "android/gradle/wrapper/gradle-wrapper.jar"
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
# Подключите телефон через USB и включите "Отладка по USB"
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📱 Альтернатива: Онлайн-конвертер

Если не хотите устанавливать SDK, используйте онлайн-сервис:

1. Откройте https://www.webintoapp.com
2. Загрузите файл `radio.html`
3. Настройте:
   - App Name: Russian Radio
   - Package Name: com.russianradio.app
   - Min Android Version: 4.0
4. Нажмите "Build"
5. Скачайте готовый APK

---

## ✅ Готово!

APK находится в: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🐛 Проблемы?

Смотрите подробную инструкцию: `BUILD_VSCODE.md`
