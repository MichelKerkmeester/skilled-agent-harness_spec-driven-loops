---
title: "Tabs, cookies and sessions"
description: "`state` lists and switches tabs, reads and sets cookies and web storage, saves and loads named sessions, and sets resource blocking."
trigger_phrases:
  - "tabs, cookies and sessions"
  - "bladebro state"
  - "bladebro state tabs"
  - "bladebro named sessions"
version: 1.0.0.0
---

# Tabs, cookies and sessions (state)

## 1. OVERVIEW

`state` lists and switches tabs, reads and sets cookies and web storage, saves and loads named sessions, and sets resource blocking.

`state` reads are sensitive. Cookie values, storage contents and saved sessions stay out of the repository and out of replies, and a capture redacts them.

---

## 2. HOW IT WORKS

### Tabs

`state tabs` lists the open tabs and marks the current one with `*`. `open-tab`, `switch-tab <id>` and `close-tab <id>` change the tab set, and the ids come from `state tabs`. A ref taken before a tab switch is stale afterwards.

### Cookies and Storage

`state cookies` lists cookies for a URL or the current page, and `set-cookie` and `del-cookie` change them. `ls` and `ss` list local and session storage, with matching set, remove and clear operations.

### Sessions and Control

`state save <name>` and `state load <name>` persist and restore cookies and storage as a named session in the data root. `state block` sets resource blocking for images, fonts, media and trackers, and `state compress` controls output compression. A named session is checked for before the data root is removed.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md` | Shared | The `state` tool and its operations |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md` | Shared | The rule to keep cookies, storage and sessions out of replies |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/agent-browser/tabs-and-run-plan.md` | Manual playbook | Lists tabs before a step plan |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md` | Benchmark | Recorded tab list with the current tab marked |

---

## 4. SOURCE METADATA

- Group: Agent Browser
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `agent-browser/tabs-cookies-and-sessions.md`

Related references:
- [agent-browser-isolation.md](agent-browser-isolation.md) - Keeping one task's state apart
- [step-plans.md](step-plans.md) - State operations as plan steps
