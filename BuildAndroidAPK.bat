@echo off
:: ===================================================
:: Build Android APK - Installation et Build Auto
:: ===================================================
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   Modded Liner - Android APK Builder
echo ========================================
echo.

:: Check if Java is installed
java -version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Java n'est pas installe. Installation en cours...
    echo.
    echo Tentative d'installation avec winget...
    winget install -e --id Oracle.JDK.23 --accept-package-agreements --accept-source-agreements
    
    if !ERRORLEVEL! NEQ 0 (
        echo.
        echo [ERREUR] Installation automatique echouee.
        echo.
        echo Veuillez installer Java manuellement :
        echo 1. Telechargez JDK : https://www.oracle.com/java/technologies/downloads/
        echo 2. Installez-le
        echo 3. Relancez ce script
        pause
        exit /b 1
    )
    
    :: Refresh environment
    echo.
    echo [INFO] Java installe ! Actualisation de l'environnement...
    call refreshenv.cmd 2>nul
    
    :: Set JAVA_HOME
    for /f "tokens=*" %%i in ('where java 2^>nul') do (
        set JAVA_PATH=%%i
        set JAVA_HOME=!JAVA_PATH:\bin\java.exe=!
        echo [INFO] JAVA_HOME defini : !JAVA_HOME!
    )
)

:: Verify Java again
java -version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Java n'est toujours pas disponible.
    echo Redemarrez votre terminal et relancez ce script.
    pause
    exit /b 1
)

echo [OK] Java est installe
java -version
echo.

:: Check if Android project exists
if not exist "android\gradlew.bat" (
    echo [ERREUR] Le projet Android n'existe pas.
    echo Executez d'abord : pnpm add @capacitor/android
    pause
    exit /b 1
)

echo [INFO] Construction de l'APK Android...
echo.

cd android

:: Clean previous builds
if exist "app\build" (
    echo [INFO] Nettoyage des builds precedents...
    rmdir /s /q app\build 2>nul
)

:: Build APK
echo [INFO] Compilation en cours... (cela peut prendre 5-10 minutes)
echo.
call gradlew.bat assembleDebug --no-daemon --stacktrace

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERREUR] La compilation a echoue.
    echo.
    echo Solutions :
    echo 1. Verifiez que Java est correctement installe
    echo 2. Verifiez que ANDROID_HOME est defini
    echo 3. Lisez les erreurs ci-dessus
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo   BUILD REUSSIE !
echo ========================================
echo.
echo L'APK se trouve dans :
echo   android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo Taille de l'APK :
for %%A in ("android\app\build\outputs\apk\debug\app-debug.apk") do echo   %%~zA octets
echo.
echo Pour installer sur votre telephone Android :
echo 1. Activez "Sources inconnues" dans les parametres
echo 2. Transferez app-debug.apk sur votre telephone
echo 3. Ouvrez le fichier et installez
echo.

pause
