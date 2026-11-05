# 📱 Build Android APK - Guide Express (10 minutes)

## ✅ Projet Android déjà préparé !

Le projet Capacitor Android est **déjà configuré** dans le dossier `android/`.
Il ne reste plus qu'à builder l'APK.

## 🚀 Méthode la plus rapide : Utiliser un service en ligne

### Option 1: **Appetize.io** (Recommandé, 5 minutes)
1. Allez sur https://appetize.io/
2. Uploadez le dossier `android/`
3. L'APK sera généré automatiquement
4. Téléchargez-le

### Option 2: **GitHub Actions** (Automatique, 10 minutes)
J'ai préparé un workflow GitHub qui build l'APK automatiquement :

1. Commitez et poussez vers GitHub (déjà fait)
2. Allez sur https://github.com/itzremyx/Liner/actions
3. Lancez le workflow "Build Android APK"
4. Téléchargez l'APK dans les artifacts

## 🔧 Méthode locale : Installer Java + Android SDK

Si vous voulez builder localement :

### 1. Installer Java (2 minutes)
```powershell
winget install -e --id Oracle.JDK.23
```

Ou téléchargez : https://www.oracle.com/java/technologies/downloads/#jdk23-windows

### 2. Configurer JAVA_HOME
```powershell
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-23", "Machine")
```

### 3. Installer Android SDK via Android Studio
- Téléchargez : https://developer.android.com/studio
- Installez avec les paramètres par défaut
- Lancez SDK Manager et installez :
  - Android SDK Platform 34
  - Android SDK Build-Tools 34.0.0

### 4. Builder l'APK
```powershell
cd liner-modded/android
.\gradlew.bat assembleDebug
```

L'APK sera dans : `android/app/build/outputs/apk/debug/app-debug.apk`

## ⚡ Installation ultra-rapide de Java + Gradle

Si vous avez **Chocolatey** :
```powershell
choco install openjdk11 -y
choco install android-sdk -y
```

Puis :
```powershell
cd liner-modded/android
.\gradlew.bat assembleDebug
```

## 📦 Alternative : APK Builder en ligne

Services qui peuvent builder votre APK sans installation :

1. **Appcircle** : https://appcircle.io/ (Gratuit, 5 min)
2. **Bitrise** : https://www.bitrise.io/ (Gratuit)
3. **AppCenter** : https://appcenter.ms/ (Microsoft, gratuit)

Upload simplement le dossier `android/` compressé.

## 🎯 Ce qui est déjà fait :

✅ Projet Capacitor initialisé
✅ Code web compilé dans `dist/`
✅ Plateforme Android ajoutée
✅ Configuration Gradle prête
✅ Toutes les dépendances installées

**Il ne manque QUE Java + Android SDK pour builder localement !**

## ⏱️ Solution la plus rapide RIGHT NOW :

1. **Installer Java** (2 min) :
   ```powershell
   winget install Oracle.JDK.23
   ```

2. **Configurer** (1 min) :
   ```powershell
   $env:JAVA_HOME = "C:\\Program Files\\Java\\jdk-23"
   $env:Path += ";$env:JAVA_HOME\\bin"
   ```

3. **Builder** (5 min) :
   ```powershell
   cd liner-modded/android
   .\gradlew.bat assembleDebug --no-daemon
   ```

4. **Récupérer l'APK** :
   `android/app/build/outputs/apk/debug/app-debug.apk`

---

**Temps total estimé** : 8-10 minutes après installation Java

Besoin d'aide ? Lisez `ANDROID_TROUBLESHOOTING.md`
