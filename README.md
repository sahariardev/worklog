# 🕒 Worklog

A clean and focused desktop app built with **React** + **Wails (Golang)** to help you track task sessions, checkpoints, and reflect on your work — no external database required.

---

## 🚀 Features

- ✅ Start, pause, resume, and finish tasks
- 🧠 Write notes and document lessons learned
- 🔖 Add/edit/delete **checkpoints** with optional notes
- ✅ Click to mark checkpoints as completed
- ⏱ See real-time clock, date, and worked minutes
- 📊 Auto-generated task summary with all details

---

## ⚙️ Built With

- [React](https://reactjs.org/) — UI logic
- [Wails](https://wails.io/) — Golang-powered desktop shell
- Inline CSS — Minimal, modern look

---

## 🔧 Setup & Build Instructions

### 1. Install Prerequisites

- [Go](https://golang.org/dl/) 1.21+
- [Node.js](https://nodejs.org/) 16+
- Wails CLI:

```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
git clone https://github.com/sahariardev/worklog
cd worklog
wails dev     # Start in development mode
wails build   # Build a native desktop binary
```
