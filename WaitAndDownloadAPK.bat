@echo off
:: ===================================================
:: Wait for build to finish and download APK
:: ===================================================
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   Attendre et telecharger APK
echo ========================================
echo.

:: Get the latest workflow run ID
echo [INFO] Recherche du dernier workflow...
for /f "tokens=*" %%i in ('gh run list --repo itzremyx/Liner --workflow build-android.yml --branch modded --limit 1 --json databaseId --jq ".[0].databaseId"') do set RUN_ID=%%i

if "%RUN_ID%"=="" (
    echo [ERREUR] Aucun workflow trouve.
    pause
    exit /b 1
)

echo [OK] Workflow ID : %RUN_ID%
echo [INFO] Lien : https://github.com/itzremyx/Liner/actions/runs/%RUN_ID%
echo.

:: Wait for completion
echo [INFO] Attente de la fin du build...
echo [INFO] Cela peut prendre 8-10 minutes...
echo.

:WAIT_LOOP
timeout /t 30 /nobreak >nul

:: Check status
for /f "tokens=*" %%i in ('gh run view %RUN_ID% --repo itzremyx/Liner --json status,conclusion --jq ".status + \" \" + .conclusion"') do set STATUS=%%i

echo [%TIME%] Status : !STATUS!

:: Check if completed
echo !STATUS! | findstr /C:"completed" >nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo !STATUS! | findstr /C:"success" >nul
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Build reussi !
        goto DOWNLOAD
    ) else (
        echo [ERREUR] Build echoue.
        echo Verifiez les logs : https://github.com/itzremyx/Liner/actions/runs/%RUN_ID%
        pause
        exit /b 1
    )
)

goto WAIT_LOOP

:DOWNLOAD
echo.
echo ========================================
echo   Telechargement de l'APK
echo ========================================
echo.

:: Create releases directory
if not exist "releases" mkdir releases

:: Download artifact
echo [INFO] Telechargement en cours...
gh run download %RUN_ID% --repo itzremyx/Liner --name modded-liner-debug-apk --dir releases\

if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Telechargement echoue.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   APK pret !
echo ========================================
echo.
echo Fichier : releases\app-debug.apk
echo.
for %%A in ("releases\app-debug.apk") do echo Taille : %%~zA octets
echo.
echo Pour installer :
echo 1. Transferez sur votre telephone Android
echo 2. Activez "Sources inconnues"
echo 3. Installez
echo.

pause
