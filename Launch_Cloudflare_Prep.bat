@echo off
title Cloudflare Senior Customer Engineer Interview Prep Portal
echo ========================================================================
echo   Launching Cloudflare Senior Customer Engineer Interview Prep Portal
echo   Public Edition: Candidate Preparation & Architecture Hub
echo   Target Job: Cloudflare Greenhouse #7778747 (Calgary, AB)
echo ========================================================================
echo.

set TARGET="%~dp0cloudflare-ce-prep\index.html"

echo Opening Portal in web browser...
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" "%~dp0cloudflare-ce-prep\index.html"
) else (
    start "" %TARGET%
)

echo.
echo Successfully opened: %TARGET%
timeout /t 2 >nul
exit
