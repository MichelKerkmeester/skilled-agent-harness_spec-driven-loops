---
title: "mcp-click-up Manual Testing Playbook"
description: "Manual test guide for the mcp-click-up skill. Covers cupt lifecycle, task operations, time/notes, MCP advanced ops, and failure recovery."
---

# mcp-click-up Manual Testing Playbook

End-to-end manual test guide for verifying the mcp-click-up skill.

---

## Overview

| Phase | Focus | Tests |
|-------|-------|-------|
| [01: cupt Lifecycle](#01) | Install, auth, status, version | 4 |
| [02: Task Operations](#02) | list, show, done (with dry-run) | 4 |
| [03: Time and Notes](#03) | time start/stop/add, note, notes | 3 |
| [04: MCP Advanced](#04) | Documents, goals via official MCP | 2 |
| [05: Recovery and Failure](#05) | Auth fail, empty queue, status error | 3 |

**Prerequisites:** cupt installed (`cupt --version`) and authenticated (`cupt status`)

---

## Phase 01: cupt Lifecycle {#01}

- `01--cupt-lifecycle/001-install-version.md`
- `01--cupt-lifecycle/002-session-auth.md`
- `01--cupt-lifecycle/003-status-json.md`
- `01--cupt-lifecycle/004-config-show.md`

## Phase 02: Task Operations {#02}

- `02--task-operations/001-list-today.md`
- `02--task-operations/002-show-task.md`
- `02--task-operations/003-statuses-dry-run.md`
- `02--task-operations/004-done-with-note.md`

## Phase 03: Time and Notes {#03}

- `03--time-and-notes/001-time-start-stop.md`
- `03--time-and-notes/002-time-add-manual.md`
- `03--time-and-notes/003-note-and-notes.md`

## Phase 04: MCP Advanced {#04}

- `04--mcp-advanced/001-create-document.md`
- `04--mcp-advanced/002-manage-goals.md`

## Phase 05: Recovery and Failure {#05}

- `05--recovery-and-failure/001-missing-auth.md`
- `05--recovery-and-failure/002-empty-queue.md`
- `05--recovery-and-failure/003-status-error.md`
