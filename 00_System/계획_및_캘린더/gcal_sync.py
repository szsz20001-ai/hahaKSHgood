import os
import re
import json
import urllib.request
import sys
from datetime import datetime

DIRECTORY = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(DIRECTORY, "gcal_config.json")
EVENTS_JS_PATH = os.path.join(DIRECTORY, "events.js")

# Default config template
DEFAULT_CONFIG = {
    "ics_url": "YOUR_GOOGLE_CALENDAR_SECRET_ICAL_URL_HERE",
    "sync_enabled": True
}

def load_config():
    if not os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump(DEFAULT_CONFIG, f, ensure_ascii=False, indent=4)
        return DEFAULT_CONFIG
    try:
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"설정 파일 읽기 오류: {e}")
        return DEFAULT_CONFIG

def fetch_ics(url):
    try:
        print("구글 캘린더 데이터를 가져오는 중...")
        headers = {'User-Agent': 'Mozilla/5.0'}
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            return response.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"구글 캘린더 가져오기 실패: {e}")
        return None

def parse_ics(ics_content):
    events = []
    # Find all VEVENT blocks
    vevents = re.findall(r'BEGIN:VEVENT([\s\S]*?)END:VEVENT', ics_content)
    
    print(f"총 {len(vevents)}개의 일정을 파싱하는 중...")
    for vevent in vevents:
        # Extract Summary (Title)
        summary_match = re.search(r'SUMMARY:(.*)', vevent)
        if not summary_match:
            continue
        summary = summary_match.group(1).strip()
        # Clean up ESCAPED characters in ICS
        summary = summary.replace('\\,', ',').replace('\\;', ';').replace('\\\\', '\\')
        
        # Extract DTSTART
        # DTSTART can be DTSTART;VALUE=DATE:20260601 or DTSTART:20260601T090000Z
        dtstart_match = re.search(r'DTSTART(?:;VALUE=DATE)?:(\d{8})', vevent)
        if not dtstart_match:
            # Try date-time format (e.g. 20260601T123000)
            dtstart_match = re.search(r'DTSTART:(\d{8})T', vevent)
            
        if not dtstart_match:
            continue
            
        date_str = dtstart_match.group(1) # YYYYMMDD
        
        # Check if it's a recurring event modification or exception
        # (Ignore cancel events if they have STATUS:CANCELLED)
        status_match = re.search(r'STATUS:CANCELLED', vevent, re.IGNORECASE)
        if status_match:
            continue
            
        events.append({
            "date": date_str,
            "text": summary,
            "type": "open", # Set to blue ("open") to match Google Calendar style
            "source": "google"
        })
        
    return events

def merge_and_save_events(google_events):
    if not os.path.exists(EVENTS_JS_PATH):
        print(f"오류: {EVENTS_JS_PATH} 파일이 없습니다.")
        return False
        
    try:
        with open(EVENTS_JS_PATH, "r", encoding="utf-8") as f:
            js_content = f.read()
            
        # Extract JSON from JS file
        match = re.search(r'const calendarEvents\s*=\s*(\{[\s\S]*?\});', js_content)
        if not match:
            print("오류: events.js 파일 형식이 잘못되었습니다.")
            return False
            
        events_data = json.loads(match.group(1))
        
        # 1. Clean existing google-sourced events to prevent duplication
        cleaned_events_data = {}
        for date_key, event_list in events_data.items():
            # Filter out events that came from Google
            filtered = [evt for evt in event_list if evt.get("source") != "google"]
            if filtered:
                cleaned_events_data[date_key] = filtered
                
        # 2. Append new google events
        added_count = 0
        for evt in google_events:
            date_key = evt["date"]
            event_obj = {
                "type": evt["type"],
                "text": evt["text"],
                "source": "google"
            }
            if date_key not in cleaned_events_data:
                cleaned_events_data[date_key] = []
            
            # Avoid duplicate texts on the same day
            if not any(e["text"] == event_obj["text"] for e in cleaned_events_data[date_key]):
                cleaned_events_data[date_key].append(event_obj)
                added_count += 1
                
        # 3. Save back to JS file
        new_js_content = (
            "// 더존하우징 기획부 일정 데이터 파일\n"
            f"const calendarEvents = {json.dumps(cleaned_events_data, ensure_ascii=False, indent=4)};\n"
        )
        with open(EVENTS_JS_PATH, "w", encoding="utf-8") as f:
            f.write(new_js_content)
            
        print(f"동기화 성공! {added_count}개의 구글 캘린더 일정이 events.js에 추가/갱신되었습니다.")
        return True
    except Exception as e:
        print(f"이벤트 병합 저장 실패: {e}")
        return False

def main():
    config = load_config()
    url = config.get("ics_url", "")
    
    if not url or url == "YOUR_GOOGLE_CALENDAR_SECRET_ICAL_URL_HERE":
        print("="*60)
        print("구글 캘린더 연동 설정이 필요합니다.")
        print(f"설정 파일 경로: {CONFIG_PATH}")
        print("설정 파일의 'ics_url'에 구글 캘린더의 '비공개 주소(iCal 형식)'를 적어주세요.")
        print("="*60)
        return
        
    if not config.get("sync_enabled", True):
        print("구글 캘린더 동기화가 비활성화되어 있습니다.")
        return
        
    ics_content = fetch_ics(url)
    if not ics_content:
        return
        
    google_events = parse_ics(ics_content)
    if google_events:
        merge_and_save_events(google_events)
    else:
        print("파싱된 구글 캘린더 일정이 없습니다.")

if __name__ == "__main__":
    main()
