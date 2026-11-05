# Status APK Build

## Build réussi

- Dernier workflow : https://github.com/itzremyx/Liner/actions/runs/42087441180
- Commit : `4ab0edc`
- APK local : [`app-debug.apk`](./app-debug.apk) (6,04 Mo)
- SHA-256 : `A052BECED1ACD14B6691930B27FE1206B3BCB3EA6C3FD299AC09F6946B75C018`

## Télécharger / reconstruire

Le workflow se relance automatiquement à chaque push sur `modded` touchant
`src/**`, `android/**` ou `capacitor.config.ts`.

Méthode manuelle : https://github.com/itzremyx/Liner/actions/workflows/build-android.yml
→ « Run workflow » → branche `modded` → télécharger l'artifact
`modded-liner-debug-apk`.

## Installation Android

1. Transférez `app-debug.apk` sur le téléphone.
2. Paramètres → Sécurité → activer « Sources inconnues ».
3. Ouvrez le fichier APK et installez.
4. Lancez Modded Liner et ouvrez le centre de contrôle via l'icône étincelle.

## Build local

Java 21 et Android SDK 36 sont requis (Capacitor 8). GitHub Actions reste la
méthode recommandée.
