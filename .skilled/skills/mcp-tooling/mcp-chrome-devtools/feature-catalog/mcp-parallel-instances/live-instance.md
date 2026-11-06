---
title: "Live Instance (Your Own Chrome)"
description: "chrome_devtools_live attaches to the user's running Chrome for signed-in work, in background tabs it opens and closes itself."
trigger_phrases:
  - "chrome_devtools_live"
  - "chrome devtools live"
  - "my own signed-in chrome"
version: 1.0.0.0
---

# Live Instance (Your Own Chrome)

---

## 1. OVERVIEW

`chrome_devtools_live` runs `chrome-devtools-mcp --autoConnect` and attaches to the Chrome the user already has open, with its logins. It exists for signed-in work an isolated browser cannot do, such as the ClickUp editor pass, because an isolated instance starts logged out on every run. The isolated manuals stay the default for every other MCP task.

---

## 2. HOW IT WORKS

The user turns on remote debugging once at `chrome://inspect/#remote-debugging`, and Chrome may ask them to allow each new connection. The manual opens pages with `new_page({ url, background: true })`, which leaves the user's view as it is and selects the new page for later calls. It records the page ID that appears in `list_pages` after that call, selects that ID with `select_page({ pageId })` before navigating again, and closes only that ID in a `finally` block. It never finds its tab by URL, because the user may have the same page open, and it never navigates, presses keys in or closes a tab it did not open.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `SKILL.md` §3 "Live Instance (Your Own Chrome)" | MCP | Setup, background-tab and own-tab rules |
| `assets/utcp-chrome-devtools-manuals.md` | Config | Registered `chrome_devtools_live` entry |
| `../mcp-click-up/references/mcp-tools.md` §3 and §8 | Consumer | Readiness check and Chrome gap-pass programs that use it |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `../mcp-click-up/manual-testing-playbook/mcp-documents/divider-gap-pass.md` | Manual playbook | Chrome live run of the divider gap pass (MCP-M020) |

---

## 4. SOURCE METADATA

- Group: MCP Parallel Instances
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `mcp-parallel-instances/live-instance.md`
Related references:
- [session-cleanup.md](../../feature-catalog/mcp-parallel-instances/session-cleanup.md): Session Cleanup (MCP)
- [page-management.md](../../feature-catalog/mcp-parallel-instances/page-management.md): Page Management
