# 🚀 Lancer Modded Liner

## Méthodes de lancement

### 1. **RunLiner.bat** (Recommandé pour développement)
- Double-cliquez sur `RunLiner.bat`
- Lance l'application en mode développement avec hot reload
- Plus rapide, idéal pour tester les modifications
- Nécessite que le terminal reste ouvert

### 2. **RunLinerBuild.bat** (Version production)
- Double-cliquez sur `RunLinerBuild.bat`
- Compile et crée un exécutable Windows dans le dossier `release\`
- Prend plus de temps (~5-10 minutes pour la première build)
- Crée une application standalone

### 3. **Ligne de commande manuelle**

#### Mode développement :
```powershell
cd liner-modded
pnpm install  # Première fois seulement
pnpm dev
```

#### Build production :
```powershell
cd liner-modded
pnpm install  # Première fois seulement
pnpm electron:build:win
```

L'exécutable sera dans `release\Liner-[version]-x64.exe`

## Prérequis

- **Node.js** (version 18 ou supérieure)
- **pnpm** : `npm install -g pnpm`
- **Git** (pour cloner le dépôt)

## Première installation

Si c'est votre première fois :

1. Installez pnpm si pas déjà fait :
   ```powershell
   npm install -g pnpm
   ```

2. Double-cliquez sur `RunLiner.bat` - il installera automatiquement les dépendances

## Résolution de problèmes

### "pnpm n'est pas reconnu"
- Installez pnpm : `npm install -g pnpm`
- Redémarrez votre terminal/PowerShell

### "Les dépendances ne sont pas installées"
- Le script les installera automatiquement
- Ou lancez manuellement : `pnpm install`

### L'application ne se lance pas
- Vérifiez que les dépendances sont installées : `pnpm install`
- Vérifiez la console pour les erreurs
- Essayez de supprimer `node_modules` et relancer `pnpm install`

### Build échoue sur Windows
- Installez les outils de build Windows :
  ```powershell
  npm install -g windows-build-tools
  ```

## Fonctionnalités Modded

Une fois lancé, allez dans **Paramètres → Playback** pour configurer :
- ✨ Crossfade personnalisé
- 🎵 Presets audio (Slowed + Reverb, etc.)
- 🤖 Smart Shuffle avec IA
- 🔊 Normalisation du volume
- ⚡ Mode performance
- 🎨 Thèmes visuels (Blur, Acrylic, Liquid Glass)
- 🖼️ Arrière-plan et logo personnalisés
- 🎯 Recommandations IA Scoutcode

Enjoy ! 🎧
