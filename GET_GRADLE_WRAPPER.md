# 📦 Получение Gradle Wrapper

Gradle Wrapper (`gradle-wrapper.jar`) необходим для сборки проекта. Это бинарный файл, который нужно скачать отдельно.

## Способ 1: Скачать через браузер (самый простой)

1. Откройте ссылку: https://github.com/gradle/gradle/raw/v8.2.0/gradle/wrapper/gradle-wrapper.jar
2. Файл скачается автоматически
3. Переместите файл в папку: `android/gradle/wrapper/gradle-wrapper.jar`

## Способ 2: Через PowerShell (Windows)

Откройте PowerShell в корне проекта и выполните:

```powershell
Invoke-WebRequest -Uri "https://github.com/gradle/gradle/raw/v8.2.0/gradle/wrapper/gradle-wrapper.jar" -OutFile "android/gradle/wrapper/gradle-wrapper.jar"
```

## Способ 3: Через curl (Mac/Linux)

Откройте терминал в корне проекта и выполните:

```bash
curl -L "https://github.com/gradle/gradle/raw/v8.2.0/gradle/wrapper/gradle-wrapper.jar" -o "android/gradle/wrapper/gradle-wrapper.jar"
```

## Способ 4: Через wget (Linux)

```bash
wget -O "android/gradle/wrapper/gradle-wrapper.jar" "https://github.com/gradle/gradle/raw/v8.2.0/gradle/wrapper/gradle-wrapper.jar"
```

## Способ 5: Сгенерировать через Gradle

Если у вас установлен Gradle глобально:

```bash
cd android
gradle wrapper --gradle-version 8.2
```

Это автоматически создаст `gradle-wrapper.jar` и обновит скрипты.

## Проверка

После скачивания проверьте, что файл существует:

**Windows:**
```cmd
dir android\gradle\wrapper\gradle-wrapper.jar
```

**Mac/Linux:**
```bash
ls -lh android/gradle/wrapper/gradle-wrapper.jar
```

Размер файла должен быть около 60-70 KB.

## Что делать дальше?

После получения `gradle-wrapper.jar`:

1. Создайте файл `android/local.properties` (см. `QUICK_START.md`)
2. Запустите сборку:
   - **Windows:** `build.bat`
   - **Mac/Linux:** `./build.sh`

## Альтернатива: Использовать глобальный Gradle

Если не хотите скачивать wrapper, установите Gradle глобально:

**Windows (через Chocolatey):**
```powershell
choco install gradle
```

**Mac (через Homebrew):**
```bash
brew install gradle
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt install gradle
```

Затем используйте команду `gradle` вместо `gradlew`:

```bash
cd android
gradle assembleDebug
```

## Проблемы?

### Ошибка: "Could not find or load main class org.gradle.wrapper.GradleWrapperMain"

**Решение:** Файл `gradle-wrapper.jar` отсутствует или поврежден. Скачайте его заново (см. способы выше).

### Ошибка: "gradlew: Permission denied" (Mac/Linux)

**Решение:**
```bash
chmod +x android/gradlew
```

### Ошибка: "gradlew.bat is not recognized" (Windows)

**Решение:** Убедитесь, что вы запускаете скрипт из папки `android/`:
```cmd
cd android
gradlew.bat assembleDebug
```

## Дополнительная информация

- Версия Gradle: 8.2
- Документация: https://docs.gradle.org/8.2/userguide/gradle_wrapper.html
- Исходный код: https://github.com/gradle/gradle/tree/v8.2.0/gradle/wrapper
