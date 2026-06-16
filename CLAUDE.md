# CLAUDE.md - AI Harness & Vault Guidelines

This document serves as the guide and instruction manual for Antigravity (and other AI agents) when working with this Obsidian Vault.

## User Persona & Context
- **User:** Kang Seung-hoon (강승훈)
- **Role:** Marketing Planner (마케팅 기획자)
- **Focus:** Digital marketing, O2O strategy, business planning, project management.
- **Language Preference:** Korean (한국어) for all interactions and note content.

---

## Vault Structure & Mapping

- `00_System/`
  - `Daily_Notes/`: Daily logs, tasks, and journals (named `YYYY-MM-DD.md`).
  - `계획_및_캘린더/`: Calendar databases and tasks (e.g., `tasks.js`, `캘린더_인쇄용.html`).
- `01_Business/`
  - `Meetings/`: Meeting notes, summaries, and action checklists.
  - Business files, proposals, and marketing planning documents.
- `02_Projects/`
  - Active and passive projects (e.g., development folders, draft materials).
- `03_Personal/`
  - Personal reflections, logs, and private tasks.
- `04_Archive/`
  - Archived notes, completed projects, and historic documents.

---

## AI Agent Guidelines & Coding Standards

### 1. Document Format & Formatting Rules
- **Markdown standard:** Always use clean, standard Markdown with proper heading hierarchies (`#`, `##`, etc.).
- **Wikilinks:** Use `[[Note Name]]` for linking between pages. Do not use standard markdown links for internal links unless specifically requested.
- **Bilingual File Names:** Some files have Korean names (e.g. `캘린더_인쇄용.html`, `기획부_캘린더_열기.bat`). Maintain their exact casing and Unicode representation. Do not modify filename patterns unless asked.
- **Frontmatter/Properties:** Follow YAML frontmatter conventions in daily notes and project notes if they exist.

### 2. Task Management & Carry-over Rules
- **Unfinished Tasks:** In daily notes (`00_System/Daily_Notes/YYYY-MM-DD.md`), unfinished tasks (`- [ ]`) from previous days must be logged and either:
  1. Carried over to the current day's note.
  2. Scheduled in the main task tracker (`00_System/계획_및_캘린더/tasks.js`).
  3. Marked as cancelled or completed if resolved.
- **Verification:** When modifying tasks, ensure consistency across the daily note and any active HTML/JS calendars.

### 3. File & Memory Constraints
- **Do NOT track heavy files:** Never stage or add media files (`.mp4`, `.mov`, `.mts`, raw photos) to Git.
- **Direct Editing:** Write modifications directly (e.g., using `rsync --inplace` or writing directly to files on `/Volumes/Kangs_Lexar/Shkang_Obsidian/`).
