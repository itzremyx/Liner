# 🎯 OBTENIR VOTRE APK ANDROID - GUIDE EXPRESS

## ⚡ MÉTHODE LA PLUS RAPIDE (10 minutes)

### 🚀 GitHub Actions - Build Automatique

**Votre APK sera prêt dans 10 minutes !**

---

## 📋 ÉTAPES SIMPLES

### 1️⃣ Aller sur GitHub Actions
👉 **https://github.com/itzremyx/Liner/actions**

### 2️⃣ Lancer le build
1. Cliquez sur **"Build Android APK"** (dans la liste des workflows)
2. Cliquez sur le bouton **"Run workflow"** (à droite)
3. Sélectionnez la branche **`modded`**
4. Cliquez sur **"Run workflow"** (bouton vert)

### 3️⃣ Attendre (8-10 minutes)
- Le build se lance automatiquement
- Vous verrez un badge jaune 🟡 pendant la compilation
- Puis un checkmark vert ✅ quand c'est terminé

### 4️⃣ Télécharger l'APK
1. Cliquez sur le workflow qui vient de terminer (celui avec ✅)
2. Scrollez vers le bas jusqu'à **"Artifacts"**
3. Cliquez sur **"modded-liner-debug-apk"**
4. Un fichier ZIP se télécharge

### 5️⃣ Installer sur Android
1. Décompressez le ZIP
2. Vous avez **`app-debug.apk`** !
3. Transférez-le sur votre téléphone Android
4. Activez "Sources inconnues" dans les paramètres
5. Ouvrez le fichier et installez
6. **Profitez ! 🎵**

---

## 🖼️ VISUAL GUIDE

```
GitHub → Actions → "Build Android APK" → Run workflow
    ↓
Attendez 10 min ⏱️
    ↓
Workflow terminé ✅
    ↓
Téléchargez "modded-liner-debug-apk.zip"
    ↓
Décompressez → app-debug.apk
    ↓
Transférez sur Android → Installez → Enjoy! 🎧
```

---

## ⏱️ TIMELINE

- **0 min** : Lancement du workflow GitHub
- **2 min** : Installation des dépendances
- **5 min** : Compilation TypeScript + Build web
- **8 min** : Build APK Android
- **10 min** : ✅ **APK prêt !**

---

## 📱 Configuration Android requise

- ✅ Android 8.0+ (API 26+)
- ✅ Compatible Android 16 Developer Preview
- ✅ ~20 MB d'espace libre
- ✅ Connexion Internet (pour streaming)

---

## 🔗 LIENS DIRECTS

- **Build APK** : https://github.com/itzremyx/Liner/actions/workflows/build-android.yml
- **Derniers builds** : https://github.com/itzremyx/Liner/actions
- **Code source** : https://github.com/itzremyx/Liner/tree/modded

---

## 💡 ALTERNATIVES

### Build local (si vous avez Java)
```powershell
cd liner-modded
.\BuildAndroidAPK.bat
```

### Build manuel
```powershell
cd liner-modded/android
.\gradlew.bat assembleDebug
```

**Mais GitHub Actions est plus simple et plus rapide !**

---

## ❓ PROBLÈMES ?

### Le workflow n'apparaît pas
- Attendez 30 secondes, rafraîchissez la page
- Vérifiez que vous êtes sur le bon dépôt : `itzremyx/Liner`

### Le build échoue
- Relancez le workflow (cela arrive parfois)
- Vérifiez les logs pour l'erreur

### L'APK ne s'installe pas
- Activez "Sources inconnues"
- Android 16 : Paramètres → Apps → Installer apps inconnues

---

## 📚 Documentation complète

- **README Android** : `README_ANDROID.md`
- **Guide détaillé** : `ANDROID_QUICK_START.md`
- **Build local** : `BUILD_ANDROID_APK.md`

---

## 🎉 C'EST TOUT !

**Temps total : 15 minutes**
- 10 min de build automatique
- 5 min pour télécharger et installer

**Aucune compétence technique requise !**

👉 **Commencez maintenant : https://github.com/itzremyx/Liner/actions**

Enjoy votre Modded Liner sur Android ! 🎵🚀
