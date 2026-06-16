import os
import shutil
import glob

# Source and destination base paths
src_base = r"D:\Ksh_work\260611_충청남도 부여군 규암면 오수리 552번지\03.원본"
dest_base = os.path.join(src_base, "편집순서_정리")

# Define target folders
folders = [
    "01_외관", "02_현관", "03_중문", "04_중문앞복도", "05_침실2", "06_침실앞복도",
    "07_욕실", "08_욕실앞복도", "09_침실3", "10_앞복도", "11_거실", "12_거실 포인트전체",
    "13_중정", "14_주방", "15_주방포인트전체", "16_세탁실가는 복도", "17_세탁실", "18_세탁실앞복도",
    "19_드레스룸", "20_드레스룸복도", "21_욕실1", "22_욕실앞복도", "23_침실", "24_침실전체",
    "25_침실에서 보이는 중정", "26_현관까지 이어지는느낌"
]

# Create target directories
print("Creating target directories...")
os.makedirs(dest_base, exist_ok=True)
for folder in folders:
    folder_path = os.path.join(dest_base, folder)
    os.makedirs(folder_path, exist_ok=True)

# Locate all source files
print("Locating raw video files...")
a7c_files = glob.glob(os.path.join(src_base, "a7c", "*.MP4"))
drone_files = glob.glob(os.path.join(src_base, "01.외관", "*.MP4"))
a7m4_files = glob.glob(os.path.join(src_base, "a7m4", "영상", "*.MP4"))

all_raw_files = a7c_files + drone_files + a7m4_files
print(f"Found {len(all_raw_files)} raw video files to move.")

# Define mapping function
def get_dest_folder(fpath):
    fname = os.path.basename(fpath)
    parent_dir = os.path.basename(os.path.dirname(fpath))
    grandparent_dir = os.path.basename(os.path.dirname(os.path.dirname(fpath)))
    
    # 1. Drone clips
    if parent_dir == "01.외관":
        if fname in ["DJI_0308.MP4", "DJI_0314.MP4", "DJI_0315.MP4", "DJI_0317.MP4"]:
            return "01_외관"
        elif fname in ["DJI_0321.MP4", "DJI_0323.MP4", "DJI_0324.MP4", "DJI_0331.MP4", "DJI_0332.MP4"]:
            return "13_중정"
        else:
            return "26_현관까지 이어지는느낌"
            
    # 2. A7M4 clips
    if parent_dir == "영상" and grandparent_dir == "a7m4":
        if fname in ["C9939.MP4", "C9940.MP4"]:
            return "15_주방포인트전체"
        else: # C9941.MP4
            return "25_침실에서 보이는 중정"
            
    # 3. A7C clips
    if parent_dir == "a7c":
        clip_num = int(fname[1:5])
        
        if clip_num == 129:
            return "01_외관"
        elif 130 <= clip_num <= 133:
            return "01_외관"
        elif 134 <= clip_num <= 135:
            return "02_현관"
        elif 136 <= clip_num <= 145:
            return "03_중문"
        elif 146 <= clip_num <= 151:
            return "04_중문앞복도"
        elif 152 <= clip_num <= 158:
            return "05_침실2"
        elif clip_num == 159:
            return "06_침실앞복도"
        elif 160 <= clip_num <= 162:
            return "07_욕실"
        elif 163 <= clip_num <= 164:
            return "08_욕실앞복도"
        elif 165 <= clip_num <= 167:
            return "07_욕실"
        elif 168 <= clip_num <= 169:
            return "08_욕실앞복도"
        elif 170 <= clip_num <= 174:
            return "07_욕실"
        elif 175 <= clip_num <= 179:
            return "10_앞복도"
        elif 180 <= clip_num <= 181:
            return "09_침실3"
        elif clip_num == 182:
            return "10_앞복도"
        elif 183 <= clip_num <= 188:
            return "13_중정"
        elif 189 <= clip_num <= 199:
            return "11_거실"
        elif 200 <= clip_num <= 220:
            return "14_주방"
        elif 221 <= clip_num <= 222:
            return "16_세탁실가는 복도"
        elif 223 <= clip_num <= 225:
            return "20_드레스룸복도"
        elif clip_num == 226:
            return "16_세탁실가는 복도"
        elif clip_num == 227:
            return "19_드레스룸"
        elif clip_num == 228:
            return "21_욕실1"
        elif clip_num == 229:
            return "22_욕실앞복도"
        elif 230 <= clip_num <= 239:
            return "23_침실"
        elif 240 <= clip_num <= 245:
            return "26_현관까지 이어지는느낌"
            
        # Session 3: Living room with sheer curtains
        elif 246 <= clip_num <= 252:
            return "12_거실 포인트전체"
            
        # Session 4: Detail Inserts
        elif 253 <= clip_num <= 258:
            return "15_주방포인트전체"
        elif 259 <= clip_num <= 262:
            return "07_욕실"
        elif 263 <= clip_num <= 269:
            return "08_욕실앞복도"
        elif 270 <= clip_num <= 274:
            return "15_주방포인트전체"
        elif 275 <= clip_num <= 282:
            return "21_욕실1"
            
        # Session 5: Lifestyle and Sky
        elif clip_num in [284, 285]:
            return "15_주방포인트전체"
        elif clip_num == 286:
            return "12_거실 포인트전체"
        elif clip_num == 290:
            return "25_침실에서 보이는 중정"
        elif clip_num in [283, 287, 288, 289, 291, 292, 293, 294, 295, 296, 297]:
            return "25_침실에서 보이는 중정"

    return None

# Perform moves and write log
moved_count = 0
log_lines = []

print("Moving files...")
for fpath in all_raw_files:
    fname = os.path.basename(fpath)
    target_folder = get_dest_folder(fpath)
    
    if target_folder:
        dest_path = os.path.join(dest_base, target_folder, fname)
        try:
            shutil.move(fpath, dest_path)
            log_lines.append(f"MOVED: {fpath} -> {dest_path}")
            moved_count += 1
        except Exception as e:
            log_lines.append(f"ERROR moving {fname}: {e}")
            print(f"Error moving {fname}: {e}")
    else:
        log_lines.append(f"SKIP (unmapped): {fpath}")

# Write log file
log_path = os.path.join(dest_base, "organization_log.txt")
with open(log_path, "w", encoding="utf-8") as log_file:
    log_file.write("=== Video Organization Log ===\n\n")
    log_file.write(f"Total files moved: {moved_count} / {len(all_raw_files)}\n\n")
    log_file.write("\n".join(log_lines))

print(f"Finished moving. Total moved: {moved_count}")
print(f"Log written to {log_path}")

# Write readme.txt placeholders in empty folders
print("Creating readme placeholders for empty folders...")
empty_folders = []
for folder in folders:
    folder_path = os.path.join(dest_base, folder)
    # Check if folder is empty (only files, ignoring directories)
    contents = os.listdir(folder_path)
    if not contents:
        empty_folders.append(folder)
        readme_path = os.path.join(folder_path, "readme.txt")
        with open(readme_path, "w", encoding="utf-8") as readme:
            readme.write(f"=== {folder} ===\n\n")
            readme.write("이 폴더에 해당하는 원본 영상 클립이 이번 촬영본에 존재하지 않습니다.\n")
            readme.write("편집 동선의 연속성을 유지하기 위해 폴더 구조는 비어 있는 상태로 생성해 두었습니다.\n")

print(f"Created readme placeholders in {len(empty_folders)} empty folders: {empty_folders}")
