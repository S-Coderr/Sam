@echo off
setlocal
set "URL=http://127.0.0.1:8123"

rem 1) start the local server silently if it is not already running
netstat -ano | findstr /C:":8123" | findstr /C:"LISTENING" >nul 2>&1
if errorlevel 1 (
  start "" /b pythonw -m http.server 8123 --bind 127.0.0.1 --directory "E:\SHL"
  ping -n 2 127.0.0.1 >nul
)

rem 2) find Chrome, fall back to Edge
set "BROWSER="
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "BROWSER=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined BROWSER if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "BROWSER=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not defined BROWSER if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" set "BROWSER=%LocalAppData%\Google\Chrome\Application\chrome.exe"
if not defined BROWSER if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "BROWSER=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not defined BROWSER if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "BROWSER=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"

rem 3) open the portal fullscreen (kiosk) in its own window
start "" "%BROWSER%" --kiosk --user-data-dir="%LocalAppData%\SHLPortalKiosk" --no-first-run --no-default-browser-check "%URL%"
endlocal
