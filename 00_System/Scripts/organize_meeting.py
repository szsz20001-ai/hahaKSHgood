import os
import shutil
import re
import json
import sqlite3

print("Starting organize_meeting.py...")

# Define paths
meeting_dir = r"D:\Ksh_work\03.기획부 회의\260612_기획부회의"
html_src = r"D:\Ksh_work\01.계획\260612_회의록.html"
html_dst = os.path.join(meeting_dir, "260612_회의록.html")

kakao_dir = r"C:\Users\jh\Documents\카카오톡 받은 파일"
scratch_dir = r"C:\Users\jh\.gemini\antigravity\scratch\meeting_minutes_project"

# 1. Create directory
if not os.path.exists(meeting_dir):
    os.makedirs(meeting_dir)
    print(f"Created directory: {meeting_dir}")
else:
    print(f"Directory already exists: {meeting_dir}")

# 2. Copy HTML minutes
if os.path.exists(html_src):
    shutil.copy2(html_src, html_dst)
    print(f"Copied HTML minutes to: {html_dst}")
    # Remove from 01.계획 to keep it clean, but keep a copy just in case
    # os.remove(html_src)
else:
    print(f"HTML source not found at: {html_src}")

# 3. Locate and copy audio file
audio_file = None
if os.path.exists(kakao_dir):
    for f in os.listdir(kakao_dir):
        if "260612" in f and (f.endswith(".m4a") or f.endswith(".mp3") or f.endswith(".wav")):
            audio_file = os.path.join(kakao_dir, f)
            break

if audio_file and os.path.exists(audio_file):
    audio_dst = os.path.join(meeting_dir, os.path.basename(audio_file))
    shutil.copy2(audio_file, audio_dst)
    print(f"Copied audio file to: {audio_dst}")
else:
    print("Audio file containing '260612' not found in KakaoTalk folder.")

# 4. Copy raw transcription text if exists
txt_src = os.path.join(scratch_dir, "transcript_260612.txt")
if os.path.exists(txt_src):
    txt_dst = os.path.join(meeting_dir, "260612_회의록_전체텍스트.txt")
    shutil.copy2(txt_src, txt_dst)
    print(f"Copied raw transcript to: {txt_dst}")

# 5. Update events.js link
events_path = r"D:\Ksh_work\01.계획\events.js"
if os.path.exists(events_path):
    with open(events_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Parse JSON
    match = re.search(r'const calendarEvents\s*=\s*(\{[\s\S]*?\});', content)
    if match:
        events_data = json.loads(match.group(1))
        # Update link for today's meeting
        updated = False
        if "20260612" in events_data:
            for evt in events_data["20260612"]:
                if evt.get("type") == "meeting" and "기획부 회의" in evt.get("text"):
                    evt["link"] = "../03.기획부 회의/260612_기획부회의/260612_회의록.html"
                    updated = True
                    print("Updated events.js relative link to: ../03.기획부 회의/260612_기획부회의/260612_회의록.html")
                    
        if updated:
            js_content = f"// 더존하우징 기획부 일정 데이터 파일\nconst calendarEvents = {json.dumps(events_data, indent=4, ensure_ascii=False)};\n"
            with open(events_path, "w", encoding="utf-8") as f:
                f.write(js_content)
            print("Successfully saved updated events.js.")
            
            # Sync to calendar.db
            db_path = r"C:\Users\jh\AppData\Roaming\CalendarTask\Db\calendar.db"
            if os.path.exists(db_path):
                conn = sqlite3.connect(db_path)
                cursor = conn.cursor()
                
                # Check if 20260612 exists
                unique_id = "dkcal_mdays_20260612"
                cursor.execute("SELECT it_id, it_content FROM item_table WHERE it_unique_id = ?", (unique_id,))
                row = cursor.fetchone()
                if row:
                    it_id, current_content = row
                    lines = [line.strip() for line in current_content.split("\n") if line.strip()]
                    
                    new_lines = []
                    for line in lines:
                        # We don't need to change the content string for the Desktop Calendar since it doesn't show the clickable link in its text directly,
                        # but it's good to keep it updated if there's any.
                        new_lines.append(line)
                    # No changes needed in DB because it only stores the text description like [회의/마감] 기획부 회의 (회의록).
                    # The web UI is the one that parses the link property from events.js.
                    print("Desktop Calendar DB does not store raw links, keeping DB text intact.")
                    conn.close()
    else:
        print("Could not parse events.js JSON.")
else:
    print("events.js not found.")

print("Finished organize_meeting.py.")
