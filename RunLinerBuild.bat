@echo off
:: ===================================================
:: Modded Liner - Build et Lancement
:: ===================================================
echo.
echo ========================================
echo   Modded Liner - Build Production
echo ========================================
echo.

:: Vérifier si node_modules existe
if not exist "node_modules" (
    echo [ERREUR] Les dependances ne sont pas installees.
    echo.
    echo Installation en cours avec pnpm...
    call pnpm install
    if errorlevel 1 (
        echo [ERREUR] L'installation a echoue.
        pause
        exit /b 1
    )
)

:: Build complet
echo [INFO] Compilation de l'application...
call pnpm build
if errorlevel 1 (
    echo [ERREUR] La compilation a echoue.
    pause
    exit /b 1
)

:: Build Electron pour Windows
echo.
echo [INFO] Creation du package Electron pour Windows...
call pnpm electron:build:win
if errorlevel 1 (
    echo [ERREUR] Le build Electron a echoue.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Build termine avec succes !
echo ========================================
echo.
echo L'executable se trouve dans : release\
echo.

:: Lancer l'application si elle existe
if exist "release\Liner-*-x64.exe" (
    echo Lancement de l'application...
    start "" "release\Liner-*-x64.exe"
) else (
    echo [INFO] Executable non trouve. Verifiez le dossier release\
)

pause
