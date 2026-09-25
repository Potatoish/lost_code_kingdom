# Speaker 3 - Technical Features (3-4 minutes)

---

## 💾 HOW PROGRESS SAVES (45 seconds)
"We use something called 'useProgress hook.' Think of it as a progress tracker.

When a student completes Chapter 1, the app:
1. Marks chapter1Complete = true
2. Automatically saves to browser storage (localStorage)
3. That's it. No manual save button.

Even if they close the browser, the progress stays there. When they come back tomorrow, progress is restored automatically."

---

## 👥 MULTIPLE ACCOUNTS (45 seconds)
"We support multiple student accounts on the same computer.

Student 'Alex' has progress: Chapter 1 ✅, Chapter 2 ❌
Student 'Jordan' has progress: Chapter 1 ❌, Chapter 2 ❌

Each student's data is separate. When Alex switches to Jordan's account, Jordan's progress loads. No mix-up.

How? Each account gets its own storage slot. Simple."

---

## ⚡ REAL-TIME UPDATES (30 seconds)
"When student solves a puzzle:
- Code gets checked ✅
- Progress updates instantly
- Confetti explodes
- Progress bar shows 25%
- Next chapter button unlocks

All happens in real-time. No lag. No page refresh needed."

---

## 🐍 PYTHON IN THE BROWSER (45 seconds)
"We use Pyodide. It's Python compiled to run in the browser.

When student clicks 'Run Code':
1. Python code executes in the browser (not on a server)
2. Output appears instantly
3. No installation needed
4. Works offline

This is huge because:
- Students don't install Python locally
- No compatibility issues
- Zero setup friction
- Fast execution"

---

## 🎨 COLOR THEMES (30 seconds)
"Each chapter has its own color theme:
- Forest: Emerald green
- River: Sky blue
- Cavern: Amber
- Labyrinth: Fuchsia

The colors apply to borders, buttons, Pip's glow, everything. Visual consistency helps students remember which chapter is which."

---

## 🏗️ REUSABLE COMPONENTS (45 seconds)
"We build the app from reusable pieces:

- **AccountPanel**: Switch accounts
- **ChapterAdventurePage**: Template used for all 4 chapters
- **PipDialogue**: Pip's messages (intro, hints, success)
- **PythonPlayground**: Code editor + runner
- **ConfettiBurst**: Celebration animation

Why reusable? Because if we want to add Chapter 5, we just add data. No rewriting components. Just configure it and go."

---

## 🎯 HOW PUZZLES VALIDATE (45 seconds)
"When student submits code:

1. System runs the code
2. Captures the output
3. Compares to expected output
4. If match → Success ✅ Confetti!
5. If no match → Show what went wrong

Error handling is smart:
- Syntax error? Show Python error
- Wrong output? Show 'Expected X, got Y'
- Students learn to read errors naturally"

---

## 📊 DATA STORAGE (30 seconds)
"Progress lives in browser storage:
- Stored as JSON (simple data format)
- One entry per account
- Survives browser restarts
- Works offline

Later: We can add cloud sync (Firebase) so progress follows students across devices."

---

## 🔮 FUTURE SCALE (30 seconds)
"Right now: 4 chapters, 100% local.

Later:
- Add 20+ more chapters (easy—it's config-driven)
- Add backend for cloud sync
- Teacher dashboards
- Class management
- Mobile app

The architecture is built for scale. No major rewrites needed."

---

## TECH SUMMARY (30 seconds)
"Built with:
- React (frontend framework)
- Next.js (server-side rendering)
- Tailwind CSS (styling)
- Pyodide (Python in browser)
- localStorage (data storage)
- Future: Firebase or similar backend

All modern, industry-standard tools."

---

## That's it. Clean architecture, solid engineering.
