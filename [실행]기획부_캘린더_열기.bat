@echo off
chcp 65001 > nul
cd /d "%~dp000_System\계획_및_캘린더"
uv run python editor_server.py
