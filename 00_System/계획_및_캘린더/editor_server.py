import http.server
import json
import os
import webbrowser
import datetime
import re

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def update_obsidian_tasks(date_str, updated_tasks):
    vault_dir = os.path.abspath(os.path.join(DIRECTORY, "..", "Daily_Notes"))
    file_path = os.path.join(vault_dir, f"{date_str}.md")
    if not os.path.exists(file_path):
        content = f"# {date_str} 오늘 할 일\n\n"
        for t in updated_tasks:
            status = "x" if t["completed"] else " "
            content += f"- [{status}] {t['text']}\n"
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        return
    
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        lines = f.readlines()
    
    new_lines = []
    task_map = {t["text"].strip(): t["completed"] for t in updated_tasks}
    matched_texts = set()
    
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("- [ ]") or stripped.startswith("- [x]"):
            task_text = stripped[5:].strip()
            matched = False
            for key, val in task_map.items():
                if key == task_text or key.replace("**", "") == task_text.replace("**", "") or key == task_text.replace("**", ""):
                    status = "x" if val else " "
                    idx = line.find("-")
                    indent = line[:idx] if idx != -1 else ""
                    new_lines.append(f"{indent}- [{status}] {task_text}\n")
                    matched_texts.add(key)
                    matched = True
                    break
            # Omit deleted tasks
            if not matched:
                pass
        else:
            new_lines.append(line)
            
    # Add newly created tasks
    unmatched = [t for t in updated_tasks if t["text"].strip() not in matched_texts]
    if unmatched:
        if new_lines and not new_lines[-1].endswith("\n"):
            new_lines.append("\n")
        new_lines.append("\n## 추가 등록된 할 일\n")
        for t in unmatched:
            status = "x" if t["completed"] else " "
            new_lines.append(f"- [{status}] {t['text']}\n")
            
    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(new_lines)

def update_tasks_js(date_str, tasks):
    tasks_js_path = os.path.join(DIRECTORY, "tasks.js")
    existing_tasks_data = {}
    if os.path.exists(tasks_js_path):
        try:
            with open(tasks_js_path, "r", encoding="utf-8") as f:
                content = f.read()
            match = re.search(r'const savedTasks\s*=\s*(\{[\s\S]*?\});', content)
            if match:
                existing_tasks_data = json.loads(match.group(1))
        except Exception:
            existing_tasks_data = {}
    
    existing_tasks_data[date_str] = tasks
    
    js_content = (
        "// 더존하우징 기획부 오늘 할일 데이터 파일\n"
        "// editor_server.py가 자동으로 업데이트합니다\n"
        f"const savedTasks = {json.dumps(existing_tasks_data, ensure_ascii=False, indent=4)};\n"
    )
    with open(tasks_js_path, "w", encoding="utf-8") as f:
        f.write(js_content)

def carry_over_uncompleted_tasks(target_date_str):
    vault_dir = os.path.abspath(os.path.join(DIRECTORY, "..", "Daily_Notes"))
    date_pattern = re.compile(r'^\d{4}-\d{2}-\d{2}$')
    
    # List all daily notes in vault_dir
    files = []
    try:
        if os.path.exists(vault_dir):
            for filename in os.listdir(vault_dir):
                if filename.endswith(".md"):
                    name_without_ext = filename[:-3]
                    if date_pattern.match(name_without_ext):
                        files.append(name_without_ext)
    except Exception as e:
        print("Error listing vault directory for carryover:", e)
        return
        
    # Sort dates
    files.sort()
    
    # Filter dates before target_date_str
    prev_dates = [d for d in files if d < target_date_str]
    if not prev_dates:
        return
        
    carried_tasks = []
    
    # We will read previous files, extract uncompleted tasks, and update them
    for prev_date in prev_dates:
        prev_file_path = os.path.join(vault_dir, f"{prev_date}.md")
        if not os.path.exists(prev_file_path):
            continue
            
        try:
            with open(prev_file_path, "r", encoding="utf-8", errors="ignore") as f:
                lines = f.readlines()
        except Exception as e:
            print(f"Error reading prev date file {prev_file_path}:", e)
            continue
            
        prev_tasks = []
        for line in lines:
            stripped = line.strip()
            if stripped.startswith("- [ ]") or stripped.startswith("- [x]"):
                completed = stripped.startswith("- [x]")
                text = stripped[5:].strip()
                prev_tasks.append({ "text": text, "completed": completed })
                
        uncompleted = [t for t in prev_tasks if not t["completed"]]
        completed = [t for t in prev_tasks if t["completed"]]
        
        if uncompleted:
            # Add to carried tasks list
            for t in uncompleted:
                carried_tasks.append(t["text"])
                
            # Update previous daily note to only contain completed tasks
            try:
                update_obsidian_tasks(prev_date, completed)
                update_tasks_js(prev_date, completed)
            except Exception as e:
                print(f"Error updating prev date file {prev_file_path}:", e)
                
    if not carried_tasks:
        return
        
    # Now, append carried tasks to target_date daily note
    target_file_path = os.path.join(vault_dir, f"{target_date_str}.md")
    existing_tasks = []
    if os.path.exists(target_file_path):
        try:
            with open(target_file_path, "r", encoding="utf-8", errors="ignore") as f:
                lines = f.readlines()
            for line in lines:
                stripped = line.strip()
                if stripped.startswith("- [ ]") or stripped.startswith("- [x]"):
                    completed = stripped.startswith("- [x]")
                    text = stripped[5:].strip()
                    existing_tasks.append({ "text": text, "completed": completed })
        except Exception as e:
            print(f"Error reading target file {target_file_path}:", e)
            
    existing_texts = {t["text"].strip() for t in existing_tasks}
    updated_tasks = list(existing_tasks)
    
    changed = False
    for task_text in carried_tasks:
        if task_text.strip() not in existing_texts:
            updated_tasks.append({ "text": task_text, "completed": False })
            changed = True
            
    if changed or not os.path.exists(target_file_path):
        try:
            update_obsidian_tasks(target_date_str, updated_tasks)
            update_tasks_js(target_date_str, updated_tasks)
        except Exception as e:
            print(f"Error updating target file {target_file_path}:", e)
def load_events_from_js():
    events_file_path = os.path.join(DIRECTORY, "events.js")
    if os.path.exists(events_file_path):
        try:
            with open(events_file_path, "r", encoding="utf-8") as f:
                content = f.read()
            match = re.search(r'const calendarEvents\s*=\s*(\{[\s\S]*?\});', content)
            if match:
                return json.loads(match.group(1))
        except Exception as e:
            print("Error parsing events.js:", e)
    return {}

class CalendarRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        if self.path.startswith('/api/fetch_ics'):
            from urllib.parse import urlparse, parse_qs
            import urllib.request
            parsed_url = urlparse(self.path)
            query_params = parse_qs(parsed_url.query)
            ics_url = query_params.get('url', [None])[0]
            
            if not ics_url:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b"Missing url parameter")
                return
            
            try:
                req = urllib.request.Request(
                    ics_url, 
                    headers={'User-Agent': 'Mozilla/5.0'}
                )
                with urllib.request.urlopen(req, timeout=10) as response:
                    ics_data = response.read()
                
                self.send_response(200)
                self.send_header('Content-Type', 'text/calendar; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(ics_data)
            except Exception as e:
                self.send_response(500)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
        elif self.path.startswith('/api/read_local_ics'):
            from urllib.parse import urlparse, parse_qs
            parsed_url = urlparse(self.path)
            query_params = parse_qs(parsed_url.query)
            file_path = query_params.get('path', [None])[0]
            
            if not file_path:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b"Missing path parameter")
                return
                
            try:
                if os.path.exists(file_path):
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        data = f.read()
                    self.send_response(200)
                    self.send_header('Content-Type', 'text/calendar; charset=utf-8')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(data.encode('utf-8'))
                else:
                    self.send_response(404)
                    self.end_headers()
                    self.wfile.write(b"File not found")
            except Exception as e:
                self.send_response(500)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
        elif self.path.startswith('/api/load_events'):
            try:
                events_data = load_events_from_js()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(events_data, ensure_ascii=False).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}, ensure_ascii=False).encode('utf-8'))
        elif self.path.startswith('/03.기획부 회의') or self.path.startswith('/03.%EA%B8%B0%ED%9A%8D%EB%B6%80%20%ED%9A%8C%EC%9D%98'):
            from urllib.parse import unquote
            decoded_path = unquote(self.path)
            rel_path = decoded_path.replace('/03.기획부 회의', '', 1).lstrip('/')
            full_path = os.path.join(r"E:\Shkang_Obsidian\01_Business\기획부 회의", rel_path)
            if os.path.exists(full_path) and os.path.isfile(full_path):
                self.send_response(200)
                if full_path.endswith('.html'):
                    self.send_header('Content-Type', 'text/html; charset=utf-8')
                elif full_path.endswith('.m4a'):
                    self.send_header('Content-Type', 'audio/mp4')
                elif full_path.endswith('.txt'):
                    self.send_header('Content-Type', 'text/plain; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                try:
                    with open(full_path, 'rb') as f:
                        self.wfile.write(f.read())
                except Exception as e:
                    self.wfile.write(str(e).encode('utf-8'))
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b"Meeting file not found")
        elif self.path.startswith('/기획진행_중') or self.path.startswith('/%EA%B8%B0%ED%9A%8D%EC%A7%84%ED%96%89_%EC%A4%91'):
            from urllib.parse import unquote
            decoded_path = unquote(self.path)
            rel_path = decoded_path.replace('/기획진행_중', '', 1).lstrip('/')
            full_path = os.path.join(r"E:\기획진행_중", rel_path)
            if os.path.exists(full_path) and os.path.isfile(full_path):
                self.send_response(200)
                if full_path.endswith('.html'):
                    self.send_header('Content-Type', 'text/html; charset=utf-8')
                elif full_path.endswith('.css'):
                    self.send_header('Content-Type', 'text/css; charset=utf-8')
                elif full_path.endswith('.js'):
                    self.send_header('Content-Type', 'application/javascript; charset=utf-8')
                elif full_path.endswith('.png'):
                    self.send_header('Content-Type', 'image/png')
                elif full_path.endswith('.jpg') or full_path.endswith('.jpeg'):
                    self.send_header('Content-Type', 'image/jpeg')
                elif full_path.endswith('.webp'):
                    self.send_header('Content-Type', 'image/webp')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                try:
                    with open(full_path, 'rb') as f:
                        self.wfile.write(f.read())
                except Exception as e:
                    self.wfile.write(str(e).encode('utf-8'))
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b"File not found")
        elif self.path.startswith('/api/get_tasks'):
            from urllib.parse import urlparse, parse_qs
            parsed_url = urlparse(self.path)
            query_params = parse_qs(parsed_url.query)
            date_str = query_params.get('date', [None])[0]
            
            if not date_str:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b"Missing date parameter")
                return
                
            # Run server-side carryover first
            try:
                carry_over_uncompleted_tasks(date_str)
            except Exception as e:
                print("Error carrying over tasks on server:", e)
                
            vault_dir = os.path.abspath(os.path.join(DIRECTORY, "..", "Daily_Notes"))
            file_path = os.path.join(vault_dir, f"{date_str}.md")
            
            tasks = []
            if os.path.exists(file_path):
                try:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        lines = f.readlines()
                    for line in lines:
                        stripped = line.strip()
                        if stripped.startswith("- [ ]") or stripped.startswith("- [x]"):
                            completed = stripped.startswith("- [x]")
                            text = stripped[5:].strip()
                            tasks.append({ "text": text, "completed": completed })
                except Exception as e:
                    print("Error reading Obsidian file:", e)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(tasks).encode('utf-8'))
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/save':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                
                # Format as events.js content
                js_content = f"// 더존하우징 기획부 일정 데이터 파일\nconst calendarEvents = {json.dumps(data, indent=4, ensure_ascii=False)};\n"
                
                events_file_path = os.path.join(DIRECTORY, "events.js")
                with open(events_file_path, "w", encoding="utf-8") as f:
                    f.write(js_content)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
        elif self.path == '/api/save_shoot_list':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                js_content = f"const shootListData = {json.dumps(data, indent=4, ensure_ascii=False)};\n"
                with open(os.path.join(DIRECTORY, "shoot_list.js"), "w", encoding="utf-8") as f:
                    f.write(js_content)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
        elif self.path == '/api/add_shoot_event':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                date_str = data.get('date')
                text = data.get('text')
                events_file_path = os.path.join(DIRECTORY, "events.js")
                events_data = load_events_from_js()
                if date_str not in events_data:
                    events_data[date_str] = []
                events_data[date_str].append({"type": "shoot", "text": text, "completed": False})
                js_content = f"// 더존하우징 기획부 일정 데이터 파일\nconst calendarEvents = {json.dumps(events_data, indent=4, ensure_ascii=False)};\n"
                with open(events_file_path, "w", encoding="utf-8") as f:
                    f.write(js_content)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
        elif self.path == '/api/sync_desktopcal':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                active_events = json.loads(post_data.decode('utf-8'))
                
                db_path = r"C:\Users\jh\AppData\Roaming\CalendarTask\Db\calendar.db"
                u_mid = "101102046c187b859b545e4d651e926b77ef89"
                
                if not os.path.exists(db_path):
                    self.send_response(400)
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": f"바탕화면 달력 DB 파일이 없습니다. 경로: {db_path}"}, ensure_ascii=False).encode('utf-8'))
                    return
                
                import sqlite3
                import datetime
                import time
                
                conn = sqlite3.connect(db_path)
                cursor = conn.cursor()
                
                now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                
                type_prefixes = {
                    "exhibit": "[박람회] ",
                    "open": "[오픈하우스] ",
                    "shoot": "[출장/촬영] ",
                    "build": "[공사/착공] ",
                    "meeting": "[회의/마감] ",
                    "edit": "[편집] ",
                    "plan": "[기획] ",
                    "task": "[할일] "
                }
                
                updated_count = 0
                inserted_count = 0
                
                # Cleanup days that are not in active_events or have no events
                cursor.execute("SELECT it_id, it_unique_id, it_content FROM item_table WHERE it_unique_id LIKE 'dkcal_mdays_%'")
                db_rows = cursor.fetchall()
                for it_id, unique_id, current_content in db_rows:
                    date_key = unique_id.replace("dkcal_mdays_", "")
                    if date_key not in active_events or not active_events[date_key]:
                        existing_lines = [line.strip() for line in current_content.split("\n") if line.strip()]
                        preserved_lines = []
                        has_our_event = False
                        for line in existing_lines:
                            is_our_event = False
                            for prefix in type_prefixes.values():
                                if line.startswith(prefix):
                                    is_our_event = True
                                    has_our_event = True
                                    break
                            if not is_our_event:
                                preserved_lines.append(line)
                        
                        if has_our_event:
                            event_text = "\r\n".join(preserved_lines)
                            cursor.execute(
                                "UPDATE item_table SET it_content = ?, it_mdate = ? WHERE it_id = ?",
                                (event_text, now_str, it_id)
                            )
                            updated_count += 1
                
                for date_str, evts in active_events.items():
                    if not evts:
                        continue
                        
                    unique_id = f"dkcal_mdays_{date_str}"
                    
                    new_lines = []
                    for evt in evts:
                        prefix = type_prefixes.get(evt.get("type"), "")
                        completed_str = "✅ " if evt.get("completed") else ""
                        new_lines.append(f"{prefix}{completed_str}{evt.get('text')}")
                        
                    try:
                        yr, mo, dy = int(date_str[:4]), int(date_str[4:6]), int(date_str[6:])
                        dt = datetime.datetime(yr, mo, dy, 12, 0, 0)
                        stime = int(time.mktime(dt.timetuple()))
                    except Exception:
                        stime = int(time.time())
                        
                    cursor.execute("SELECT it_id, it_content FROM item_table WHERE it_unique_id = ?", (unique_id,))
                    row = cursor.fetchone()
                    
                    if row:
                        it_id, current_content = row
                        existing_lines = [line.strip() for line in current_content.split("\n") if line.strip()]
                        
                        preserved_lines = []
                        for line in existing_lines:
                            is_our_event = False
                            for prefix in type_prefixes.values():
                                if line.startswith(prefix):
                                    is_our_event = True
                                    break
                            if not is_our_event:
                                preserved_lines.append(line)
                                
                        combined_lines = preserved_lines + new_lines
                        event_text = "\r\n".join(combined_lines)
                        
                        cursor.execute(
                            "UPDATE item_table SET it_content = ?, it_mdate = ?, it_stime = ? WHERE it_id = ?",
                            (event_text, now_str, stime, it_id)
                        )
                        updated_count += 1
                    else:
                        event_text = "\r\n".join(new_lines)
                        cursor.execute(
                            """INSERT INTO item_table 
                               (u_id, pj_id, u_mid, it_unique_id, it_bgcolor, it_content, it_history, it_appinfo, it_cdate, it_mdate, it_stime, it_mtime, group_id)
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                            (0, 0, u_mid, unique_id, "", event_text, "", "", now_str, now_str, stime, 0, "")
                        )
                        inserted_count += 1
                        
                conn.commit()
                conn.close()
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "status": "success", 
                    "message": f"바탕화면 달력 동기화 완료: {updated_count}일 수정, {inserted_count}일 추가됨."
                }, ensure_ascii=False).encode('utf-8'))
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}, ensure_ascii=False).encode('utf-8'))
        elif self.path == '/api/save_tasks':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                payload = json.loads(post_data.decode('utf-8'))
                date_str = payload.get('date')
                tasks = payload.get('tasks', [])
                
                if not date_str:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(b"Missing date parameter")
                    return
                
                # 1. Obsidian 파일 업데이트
                update_obsidian_tasks(date_str, tasks)
                
                # 2. tasks.js 파일 업데이트
                update_tasks_js(date_str, tasks)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def run():
    # Change working directory to script location
    os.chdir(DIRECTORY)
    
    # Run carryover for today's date on startup
    try:
        today_str = datetime.date.today().strftime("%Y-%m-%d")
        carry_over_uncompleted_tasks(today_str)
        print(f"Completed initial task carryover for today ({today_str}).")
    except Exception as e:
        print("Error during initial task carryover:", e)
        
    server_address = ('', PORT)
    httpd = http.server.HTTPServer(server_address, CalendarRequestHandler)
    print(f"Starting server on port {PORT}...")
    webbrowser.open(f"http://localhost:{PORT}/캘린더_인쇄용.html")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    print("Server stopped.")

if __name__ == '__main__':
    run()
