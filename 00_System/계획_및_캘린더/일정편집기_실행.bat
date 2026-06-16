@echo off
chcp 65001 >nul
title 기획부 일정 편집기 실행기
cd /d "%~dp0"
echo =======================================================
echo  더존하우징 기획부 일정 편집기 (서버 모드) 실행 중...
echo =======================================================
echo.
echo  * 서버 포트: 8000
echo  * 브라우저창이 자동으로 열립니다. 
echo  * 달력 칸을 클릭하면 일정을 쉽게 수정/추가할 수 있습니다.
echo  * 작업을 마치려면 이 창을 닫아주세요.
echo.
echo =======================================================
echo.

where python >nul 2>nul
if %errorlevel% equ 0 (
    python editor_server.py
) else (
    echo [안내] 시스템 파이썬을 찾을 수 없어 uv 환경을 사용합니다.
    "%USERPROFILE%\.local\bin\uv.exe" run python editor_server.py
)

pause
