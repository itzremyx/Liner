@echo off
:: ===================================================
:: Download Android APK from GitHub Actions
:: ===================================================
echo.
echo ========================================
echo   Download Modded Liner APK
echo ========================================
echo.

echo [INFO] Recherche du dernier workflow reussi...
echo.

:: Get latest successful workflow run
for /f "tokens=*" %%i in ('gh run list --repo itzremyx/Liner --workflow build-android.yml --branch modded --status success --limit 1 --json databaseId --jq ".[0].databaseId"') do set RUN_ID=%%i

if "%RUN_ID%"=="" (
    echo [ERREUR] Aucun workflow reussi trouve.
    echo.
    echo Solutions :
    echo 1. Lancez un build : https://github.com/itzremyx/Liner/actions/workflows/build-android.yml
    echo 2. Attendez que le build en cours termine
    echo 3. Verifiez que vous avez acces au depot
    pause
    exit /b 1
)

echo [OK] Workflow trouve : %RUN_ID%
echo.

:: Create releases directory if it doesn't exist
if not exist "releases" mkdir releases

:: Download artifact
echo [INFO] Telechargement de l'APK...
gh run download %RUN_ID% --repo itzremyx/Liner --name modded-liner-debug-apk --dir releases\

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERREUR] Le telechargement a echoue.
    echo.
    echo Verifiez :
    echo 1. Que vous etes connecte : gh auth status
    echo 2. Que le workflow est termine : https://github.com/itzremyx/Liner/actions/runs/%RUN_ID%
    pause
    exit /b 1
)

echo.
echo ========================================
echo   APK telecharge avec succes !
echo ========================================
echo.
echo L'APK se trouve dans : releases\app-debug.apk
echo.
echo Taille :
for %%A in ("releases\app-debug.apk") do echo   %%~zA octets
echo.
echo Pour installer sur Android :
echo 1. Transferez releases\app-debug.apk sur votre telephone
echo 2. Activez "Sources inconnues" dans les parametres
echo 3. Ouvrez le fichier et installez
echo.

pause
