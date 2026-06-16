#!/bin/bash
# 캘린더 로컬 에디터 서버 시작 스크립트 (macOS 용)

DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIRECTORY"

echo "=================================================="
echo "더존하우징 캘린더 로컬 에디터 서버를 시작합니다 (Port: 8000)..."
echo "웹 브라우저에서 http://localhost:8000/캘린더_인쇄용.html 로 접속하세요."
echo "=================================================="

python3 editor_server.py
