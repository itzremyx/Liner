# 📦 Releases - Modded Liner APK

## 🚀 Obtenir l'APK Android

L'APK Android est buildé automatiquement via **GitHub Actions**.

### Méthode 1 : Télécharger depuis GitHub Actions ⭐ RECOMMANDÉ

1. **Allez sur** : https://github.com/itzremyx/Liner/actions/workflows/build-android.yml
2. **Cliquez sur** le dernier workflow réussi (checkmark vert ✅)
3. **Scrollez** vers le bas jusqu'à "Artifacts"
4. **Téléchargez** : `modded-liner-debug-apk.zip`
5. **Décompressez** : Vous avez `app-debug.apk` !

### Méthode 2 : Lancer un nouveau build

1. **Allez sur** : https://github.com/itzremyx/Liner/actions/workflows/build-android.yml
2. **Cliquez sur** "Run workflow"
3. **Sélectionnez** la branche `modded`
4. **Cliquez sur** "Run workflow" (bouton vert)
5. **Attendez** ~8-10 minutes
6. **Téléchargez** l'artifact une fois terminé

---

## 📱 Installation sur Android

1. **Transférez** `app-debug.apk` sur votre téléphone
2. **Activez** "Sources inconnues" dans Paramètres → Sécurité
3. **Ouvrez** le fichier APK
4. **Installez** et profitez ! 🎵

---

## 🛠️ Build local (nécessite Android SDK)

Si vous voulez builder localement :

### Prérequis
- Java JDK 17 ou 23 ✅ (déjà installé)
- Android SDK ❌ (pas installé)

### Installation Android SDK

**Option 1 : Android Studio** (Recommandé)
1. Téléchargez : https://developer.android.com/studio
2. Installez avec les paramètres par défaut
3. Ouvrez SDK Manager
4. Installez :
   - Android SDK Platform 34
   - Android SDK Build-Tools 34.0.0

**Option 2 : Command Line Tools**
1. Téléchargez : https://developer.android.com/studio#command-tools
2. Décompressez dans `C:\Android\`
3. Configurez :
   ```powershell
   $env:ANDROID_HOME = "C:\Android"
   $env:Path += ";$env:ANDROID_HOME\cmdline-tools\latest\bin"
   ```

### Builder l'APK

```powershell
cd liner-modded/android
.\gradlew.bat assembleDebug
```

L'APK sera dans : `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📊 Informations APK

- **Nom** : `modded-liner-debug-apk`
- **Package** : `com.itzremyx.liner`
- **Version** : 0.2.12-modded
- **Min Android** : 8.0 (API 26)
- **Target Android** : 16 (API 35)
- **Taille** : ~15-20 MB (debug)
- **Architecture** : ARM64, ARMv7, x86_64

---

## 🔗 Liens utiles

- **GitHub Actions** : https://github.com/itzremyx/Liner/actions
- **Documentation** : `README_ANDROID.md`, `ANDROID_QUICK_START.md`
- **Guide express** : `GET_YOUR_APK.md`

---

## ⚠️ Note importante

**GitHub Actions est la méthode recommandée** car :
- ✅ Pas besoin d'Android SDK localement
- ✅ Build propre et reproductible
- ✅ Gratuit et rapide (~10 minutes)
- ✅ Toujours à jour

**Build local** nécessite :
- ❌ Android SDK (~3-4 GB)
- ❌ Installation et configuration complexes
- ❌ Plus de temps de setup

---

**Pour obtenir l'APK RIGHT NOW** : https://github.com/itzremyx/Liner/actions 🚀
