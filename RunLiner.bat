@echo off
:: ===================================================
:: Modded Liner - Lancement rapide
:: ===================================================
echo.
echo ========================================
echo   Modded Liner - Lancement
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

:: Lancer en mode développement
echo [INFO] Lancement de Liner en mode developpement...
echo [INFO] L'application va s'ouvrir dans quelques secondes...
echo.
echo Pour arreter : Appuyez sur Ctrl+C dans cette fenetre
echo.

call pnpm dev

pause
