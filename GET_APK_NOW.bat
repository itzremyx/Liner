@echo off
:: ===================================================
:: GET APK NOW - Monitor and download automatically
:: ===================================================
cls
echo.
echo ==========================================
echo    MODDED LINER - APK AUTO-DOWNLOAD
echo ==========================================
echo.
echo Ce script va :
echo 1. Surveiller le build en cours
echo 2. Telecharger automatiquement l'APK
echo 3. Le placer dans releases\app-debug.apk
echo.
echo Temps estime : 8-10 minutes
echo.
pause

:: Get latest workflow run
for /f "tokens=*" %%i in ('gh run list --repo itzremyx/Liner --workflow build-android.yml --branch modded --limit 1 --json databaseId --jq ".[0].databaseId"') do set RUN_ID=%%i

if "%RUN_ID%"=="" (
    echo [ERREUR] Aucun workflow trouve. Lancez-en un d'abord :
    echo https://github.com/itzremyx/Liner/actions/workflows/build-android.yml
    pause
    exit /b 1
)

echo.
echo [INFO] Build ID : %RUN_ID%
echo [INFO] URL : https://github.com/itzremyx/Liner/actions/runs/%RUN_ID%
echo.
echo [INFO] Surveillance en cours...
echo.

setlocal enabledelayedexpansion
set "COUNT=0"

:WAIT
set /a COUNT+=1
timeout /t 30 /nobreak >nul

:: Check status
for /f "tokens=*" %%s in ('gh run view %RUN_ID% --repo itzremyx/Liner --json status --jq ".status"') do set STATUS=%%s
for /f "tokens=*" %%c in ('gh run view %RUN_ID% --repo itzremyx/Liner --json conclusion --jq ".conclusion"') do set CONCLUSION=%%c

echo [!TIME!] [Check !COUNT!] Status: !STATUS! - Conclusion: !CONCLUSION!

if "!STATUS!"=="completed" (
    if "!CONCLUSION!"=="success" (
        goto DOWNLOAD
    ) else (
        echo.
        echo [ERREUR] Build echoue. Verifiez les logs :
        echo https://github.com/itzremyx/Liner/actions/runs/%RUN_ID%
        pause
        exit /b 1
    )
)

goto WAIT

:DOWNLOAD
echo.
echo ==========================================
echo    BUILD TERMINE ! Telechargement...
echo ==========================================
echo.

if not exist "releases" mkdir releases

gh run download %RUN_ID% --repo itzremyx/Liner --name modded-liner-debug-apk --dir releases\

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==========================================
    echo    APK PRET !
    echo ==========================================
    echo.
    echo Fichier : releases\app-debug.apk
    echo.
    for %%A in ("releases\app-debug.apk") do echo Taille : %%~zAoctets (%%~zA bytes)
    echo.
    echo ETAPES SUIVANTES :
    echo 1. Transferez releases\app-debug.apk sur votre telephone
    echo 2. Parametres Android ^> Securite ^> Activer "Sources inconnues"
    echo 3. Ouvrez le fichier APK et installez
    echo 4. Profitez de Modded Liner ! 🎵
    echo.
    echo Documentation : README_ANDROID.md
    echo.
) else (
    echo [ERREUR] Telechargement echoue.
)

pause
