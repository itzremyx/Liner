# 🤖 Guide Dependabot - Gestion des PRs

## 📋 État actuel des PRs

Dependabot a créé plusieurs PRs avec des **mises à jour majeures** qui introduisent des breaking changes et font échouer le CI.

### ❌ PRs problématiques (à fermer)

1. **#3 - TypeScript 5.9.3 → 7.0.2** 🔴 MAJOR
   - Breaking changes majeurs dans TS 7
   - Nécessite refactoring de code
   - **Action** : Fermer et attendre stabilité

2. **#4 - ESLint 9.39.5 → 10.14.0** 🔴 MAJOR
   - Nouvelles règles et breaking changes
   - Nécessite configuration
   - **Action** : Fermer et attendre stabilité

3. **#5 - @mingcute/react 1.4.1 → 3.0.2** 🔴 MAJOR
   - Breaking changes dans l'API des icônes
   - Nécessite mise à jour du code
   - **Action** : Fermer

4. **#6 - framer-motion 12.43.0 → 14.9.0** 🔴 MAJOR
   - Breaking changes dans l'API animations
   - Nécessite refactoring
   - **Action** : Fermer

### ⚠️ PRs à vérifier

5. **#2 - minor-and-patch group (7 updates)** 🟡
   - Mises à jour mineures/patches normalement sûres
   - **Action** : Vérifier localement puis merger si OK

6. **#1 - GitHub Actions group (7 updates)** ✅
   - **Action** : Déjà corrigé manuellement (commit 6940df9)
   - **Action** : Fermer cette PR

---

## 🔧 Actions à prendre maintenant

### 1. Fermer les PRs majeures

```bash
# Fermer les PRs de breaking changes
gh pr close 3 -c "TypeScript 7 introduces breaking changes. Will update later when stable."
gh pr close 4 -c "ESLint 10 introduces breaking changes. Will update later when stable."
gh pr close 5 -c "@mingcute/react 3.x introduces breaking changes. Will update manually."
gh pr close 6 -c "framer-motion 14.x introduces breaking changes. Will update manually."
gh pr close 1 -c "Already fixed manually in commit 6940df9"
```

### 2. Tester la PR #2 (minor-and-patch)

```bash
# Checkout la PR
gh pr checkout 2

# Tester localement
pnpm install
pnpm check

# Si OK, merger
gh pr merge 2 --squash

# Si KO, fermer
gh pr close 2 -c "Some updates cause issues. Will investigate individually."
```

---

## 📜 Configuration Dependabot mise à jour

J'ai créé `.github/dependabot.yml` qui :

✅ **Limite aux mises à jour MINOR et PATCH uniquement**  
✅ **Ignore les mises à jour MAJOR** (breaking changes)  
✅ **Groupe les mises à jour** pour réduire le bruit  
✅ **Limite à 5 PRs npm max**  
✅ **Vérifie hebdomadairement**

Cela évitera ces problèmes à l'avenir !

---

## 🎯 Stratégie de mise à jour

### Mises à jour automatiques ✅
- **Patch** (1.2.3 → 1.2.4) : Corrections de bugs, toujours sûr
- **Minor** (1.2.3 → 1.3.0) : Nouvelles features, généralement sûr

### Mises à jour manuelles ⚠️
- **Major** (1.2.3 → 2.0.0) : Breaking changes, nécessite tests
  - Lire le CHANGELOG
  - Tester localement
  - Corriger le code si nécessaire
  - Merger manuellement

### Mises à jour à éviter 🚫
- **Alpha/Beta/RC** : Versions instables
- **Grandes migrations** : TypeScript 5→7, React 17→19, etc.
  - Attendre la stabilité
  - Planifier un sprint dédié

---

## 🔍 Vérifier une PR Dependabot

### Checklist avant merge

```bash
# 1. Checkout la PR
gh pr checkout <PR_NUMBER>

# 2. Installer les dépendances
pnpm install

# 3. Vérifier le build
pnpm build

# 4. Vérifier TypeScript
pnpm exec tsc -b --pretty false

# 5. Vérifier le linter
pnpm lint

# 6. Vérifier les tests
pnpm test

# 7. Tester l'app
pnpm dev
# Ouvrir l'app et tester les fonctionnalités principales

# 8. Si tout OK, merger
gh pr merge <PR_NUMBER> --squash
```

---

## 📊 Dépendances critiques à surveiller

### Ne PAS mettre à jour sans test approfondi :

- **React** : Utilisé partout, breaking changes fréquents
- **TypeScript** : Affecte tout le code
- **Vite** : Peut casser le build
- **Electron** : Peut casser l'app desktop
- **Capacitor** : Peut casser l'app Android
- **Zustand** : Stores de state management
- **Framer Motion** : Animations partout

### Peut être mis à jour facilement :

- **@types/\*** : Définitions TypeScript (généralement sûr)
- **prettier** : Formatage (pas d'impact sur le code)
- **oxlint** : Linting (configuration peut nécessiter ajustements mineurs)
- **Petites libs utilitaires**

---

## 🚨 En cas de problème après merge

```bash
# Revenir en arrière
git revert <COMMIT_SHA>
git push origin modded

# Ou reset (DANGER - perte d'historique)
git reset --hard HEAD~1
git push --force origin modded  # UNIQUEMENT si vous êtes seul sur la branche
```

---

## 📚 Ressources

- **Dependabot docs** : https://docs.github.com/en/code-security/dependabot
- **Semantic Versioning** : https://semver.org/
- **GitHub CLI** : https://cli.github.com/manual/

---

## ✅ Actions recommandées RIGHT NOW

```bash
# 1. Fermer les PRs problématiques
gh pr close 1 3 4 5 6 -c "Closing major updates that introduce breaking changes"

# 2. Tester la PR #2
gh pr checkout 2
pnpm install
pnpm check

# 3. Si OK, merger
gh pr merge 2 --squash --delete-branch

# 4. Revenir sur modded
git checkout modded
git pull
```

**Temps estimé : 10 minutes**

Enjoy des dépendances à jour et sans breaking changes ! 🎉
