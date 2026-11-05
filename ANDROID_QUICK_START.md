# 📱 Android APK - Démarrage Ultra-Rapide

## 🎯 SOLUTION LA PLUS RAPIDE : GitHub Actions (5 minutes)

Le projet Android est **déjà configuré et prêt**. L'APK sera buildé automatiquement sur GitHub !

### Étapes :

1. **Les fichiers sont déjà poussés sur GitHub** ✅
   - Le projet Capacitor est configuré
   - Le workflow GitHub Actions est prêt

2. **Lancer le build automatique** :
   - Allez sur : https://github.com/itzremyx/Liner/actions
   - Cliquez sur "Build Android APK"
   - Cliquez "Run workflow" → "Run workflow"
   - Attendez 8-10 minutes

3. **Télécharger l'APK** :
   - Une fois terminé (checkmark vert), cliquez sur le workflow
   - Téléchargez l'artifact "modded-liner-debug-apk"
   - Décompressez le fichier ZIP
   - **Vous avez votre APK !**

4. **Installer sur Android** :
   - Transférez `app-debug.apk` sur votre téléphone
   - Activez "Sources inconnues" dans Paramètres
   - Ouvrez le fichier et installez

---

## 💻 Build LOCAL (si vous voulez le faire vous-même)

### Méthode 1 : Script automatique (10 minutes)

Double-cliquez sur **`BuildAndroidAPK.bat`** :
- Il installe Java automatiquement
- Build l'APK
- L'APK sera dans `android/app/build/outputs/apk/debug/app-debug.apk`

### Méthode 2 : Installation manuelle

#### 1. Installer Java JDK (2 minutes)

**Option A - Avec winget (Recommandé)** :
```powershell
winget install Oracle.JDK.23
```

**Option B - Téléchargement manuel** :
- https://www.oracle.com/java/technologies/downloads/#jdk23-windows
- Installer avec paramètres par défaut

#### 2. Configurer l'environnement
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-23"
$env:Path += ";$env:JAVA_HOME\bin"
```

#### 3. Builder l'APK
```powershell
cd liner-modded/android
.\gradlew.bat assembleDebug
```

#### 4. Récupérer l'APK
L'APK est dans : `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📦 Ce qui est DÉJÀ FAIT :

✅ **Projet Capacitor configuré**
✅ **Code web compilé**
✅ **Projet Android généré**
✅ **Workflow GitHub Actions créé**
✅ **Script de build automatique (`BuildAndroidAPK.bat`)**

**Il ne reste QUE le build final !**

---

## 🚨 Problèmes courants

### "JAVA_HOME is not set"
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-23"
```

### "gradlew: command not found"
```powershell
cd liner-modded/android
.\gradlew.bat assembleDebug
```
(Notez le `.\` devant gradlew.bat)

### "Android SDK not found"
Deux options :
1. **Recommandé** : Utilisez GitHub Actions (pas besoin d'Android SDK localement)
2. Installez Android Studio : https://developer.android.com/studio

### Build trop long
La première build prend ~10 minutes (télécharge les dépendances)
Les suivantes : ~2-3 minutes

---

## 📊 Comparaison des méthodes

| Méthode | Temps | Difficulté | Prérequis |
|---------|-------|------------|-----------|
| **GitHub Actions** | 10 min | ★☆☆☆☆ | Compte GitHub |
| **BuildAndroidAPK.bat** | 15 min | ★★☆☆☆ | Windows + winget |
| **Manuel** | 20 min | ★★★☆☆ | Java + Android SDK |

---

## 🎯 RECOMMANDATION

**Utilisez GitHub Actions** :
1. C'est gratuit
2. Pas d'installation locale
3. Build propre et reproductible
4. Vous aurez l'APK en 10 minutes

👉 https://github.com/itzremyx/Liner/actions

---

## 📱 Installation de l'APK sur Android 16

### Prérequis
- Android 16 Developer Preview ou Android 15+
- Activer "Sources inconnues"

### Étapes

1. **Transférer l'APK** :
   - USB : Copiez `app-debug.apk` dans le téléphone
   - Cloud : Uploadez sur Google Drive et téléchargez
   - Email : Envoyez-vous l'APK par email

2. **Activer les sources inconnues** :
   - Paramètres → Sécurité → Sources inconnues
   - OU : lors de l'installation, Android demandera l'autorisation

3. **Installer** :
   - Ouvrez le fichier `app-debug.apk`
   - Appuyez sur "Installer"
   - Attendez quelques secondes
   - "Ouvrir"

4. **Profiter ! 🎵**

---

## ⚡ TL;DR - La version la plus rapide

```bash
# Sur votre PC
git push origin modded

# Sur GitHub
# https://github.com/itzremyx/Liner/actions
# → Run workflow "Build Android APK"
# → Wait 10 minutes
# → Download artifact

# Sur Android
# Installer app-debug.apk
```

**Temps total : 15 minutes** (dont 10 min d'attente GitHub)

---

Besoin d'aide ? Lisez `BUILD_ANDROID_APK.md` pour plus de détails.
