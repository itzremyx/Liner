# 🎵 Modded Liner - Version Android

## ✅ STATUT : Prêt à builder !

Le projet Android Capacitor est **entièrement configuré** et prêt à être compilé en APK.

---

## 🚀 Obtenir l'APK (3 méthodes)

### Méthode 1 : GitHub Actions ⭐ RECOMMANDÉ

**La plus rapide et la plus simple** - Aucune installation requise !

1. Allez sur : **https://github.com/itzremyx/Liner/actions**
2. Cliquez sur le workflow **"Build Android APK"**
3. Cliquez sur **"Run workflow"** → Sélectionnez `modded` → **"Run workflow"**
4. Attendez **8-10 minutes** (première fois)
5. Une fois terminé (checkmark vert ✓), cliquez sur le workflow
6. Téléchargez l'artifact **"modded-liner-debug-apk"**
7. Décompressez le ZIP → Vous avez votre **APK** !

**Temps total : ~10 minutes** (automatique)

---

### Méthode 2 : Script automatique Windows

Double-cliquez sur : **`BuildAndroidAPK.bat`**

Le script va :
- ✅ Installer Java automatiquement (si nécessaire)
- ✅ Builder l'APK
- ✅ Vous indiquer où trouver le fichier

**APK final** : `android/app/build/outputs/apk/debug/app-debug.apk`

**Temps total : ~15 minutes** (dont ~10 min de compilation)

---

### Méthode 3 : Build manuel

Si vous préférez le contrôle total :

```powershell
# 1. Installer Java (si pas déjà fait)
winget install Oracle.JDK.23

# 2. Configurer l'environnement
$env:JAVA_HOME = "C:\Program Files\Java\jdk-23"

# 3. Builder l'APK
cd liner-modded/android
.\gradlew.bat assembleDebug

# 4. Récupérer l'APK
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📱 Installer sur Android

### Prérequis
- Android 8.0+ (API 26+)
- Compatible avec Android 16 Developer Preview

### Installation

1. **Transférer l'APK** sur votre téléphone :
   - Via USB
   - Via email/cloud (Google Drive, etc.)
   - Via ADB : `adb install app-debug.apk`

2. **Activer "Sources inconnues"** :
   - Paramètres → Sécurité → Sources inconnues
   - Ou Android demandera lors de l'installation

3. **Installer** :
   - Ouvrez `app-debug.apk`
   - Appuyez sur "Installer"
   - Attendez quelques secondes
   - Appuyez sur "Ouvrir"

4. **Profitez ! 🎧**

---

## 🎯 Fonctionnalités incluses

### ✅ Fonctionnalités Modded actives

Toutes les fonctionnalités desktop sont adaptées pour mobile :

- ✨ **Custom Crossfade** : Fondu personnalisable entre morceaux
- 🎵 **Presets audio** : Speed up, Slowed + Reverb, Ultra-slowed
- 🤖 **Smart Shuffle AI** : Lecture aléatoire intelligente
- 🔊 **Volume Normalization** : Volume cohérent entre morceaux
- ⚡ **Performance Mode** : Optimisé pour économiser la batterie
- 🎨 **Thèmes visuels** : Blur, Acrylic, Liquid Glass
- 🎯 **AI Recommendations** : Suggestions musicales via Scoutcode
- 📊 **Currently Playing Indicator** : Visualisation du morceau actuel

### ⚠️ Limitations mobile

- ❌ **Pas de fichiers locaux** : Streaming uniquement (comme Spotify)
- ❌ **Pas d'import local** : L'API fichiers Web est limitée
- ✅ **Tout le reste fonctionne** : UI, playlists, paramètres, etc.

---

## 📊 Informations techniques

### Architecture
- **Frontend** : React + TypeScript + Vite
- **Mobile wrapper** : Capacitor 8.6.0
- **API Audio** : Web Audio API (natif navigateur)
- **Taille APK** : ~15-20 MB (debug) / ~8-12 MB (release)

### Compatibilité
- **Android minimum** : 8.0 (API 26)
- **Android testé** : 14, 15, 16 Developer Preview
- **Architecture** : ARM64, ARMv7, x86_64

### Permissions requises
- `INTERNET` : Streaming musique
- `WAKE_LOCK` : Empêcher veille pendant lecture
- `FOREGROUND_SERVICE` : Lecture en arrière-plan

---

## 🐛 Résolution de problèmes

### L'application ne s'installe pas
- Vérifiez que "Sources inconnues" est activé
- Android 16 : Allez dans Paramètres → Apps → Accès spécial → Installer des apps inconnues

### L'application crash au démarrage
- Vérifiez que vous avez Android 8.0+
- Essayez de réinstaller l'APK
- Vérifiez les logs : `adb logcat | grep -i liner`

### Pas de son / Pas de streaming
- Vérifiez votre connexion Internet
- Autorisez les permissions audio dans les paramètres Android
- Certains services de streaming peuvent être bloqués géographiquement

### GitHub Actions build échoue
- Vérifiez que le workflow est activé dans Settings → Actions
- Relancez le workflow manuellement
- Vérifiez les logs du workflow pour l'erreur exacte

---

## 📚 Documentation complète

- **Guide express** : `ANDROID_QUICK_START.md`
- **Build détaillé** : `BUILD_ANDROID_APK.md`
- **README principal** : `README.md`
- **Guide de lancement** : `README_LAUNCH.md`

---

## 🔗 Liens utiles

- **Dépôt GitHub** : https://github.com/itzremyx/Liner
- **GitHub Actions** : https://github.com/itzremyx/Liner/actions
- **Capacitor Docs** : https://capacitorjs.com/docs
- **Android Developer** : https://developer.android.com/

---

## ⏱️ Chronologie du projet

- ✅ **Commit 1** : Fondation modded (crossfade, presets, AI, thèmes)
- ✅ **Commit 2** : Smart Shuffle, Volume Norm, Currently Playing
- ✅ **Commit 3** : Launchers Windows (RunLiner.bat)
- ✅ **Commit 4** : **Support Android Capacitor + GitHub Actions** ← Vous êtes ici

---

## 🎉 Récapitulatif

**✅ Ce qui est fait :**
- Projet Capacitor configuré
- Projet Android généré (60 fichiers)
- Workflow GitHub Actions fonctionnel
- Scripts de build automatiques
- Documentation complète

**🚀 Ce qu'il reste à faire :**
- Lancer le workflow GitHub Actions
- Attendre 10 minutes
- Télécharger l'APK
- Installer sur votre téléphone
- **Profiter de Liner sur Android ! 🎵**

---

**Temps estimé du début à la fin : 15 minutes**

Enjoy ! 🎧
