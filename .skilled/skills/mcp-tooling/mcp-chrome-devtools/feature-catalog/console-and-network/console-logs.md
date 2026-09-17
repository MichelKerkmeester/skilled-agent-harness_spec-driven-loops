---
title: "Console Logs"
description: "bdg console --list — JSON array of console messages from the active page."
trigger_phrases:
  - "bdg console"
  - "get console logs cli"
  - "browser console errors"
version: 1.0.0.0
---

# Console Logs

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`bdg console --list 2>&1` returns a JSON array of console messages from the active page. Filter with `jq '.[] | select(.level == "error")'` to isolate errors; retrieval target is under 1 second.

---

## 2. HOW IT WORKS

Enable the Runtime domain first (`bdg cdp Runtime.enable`) for full coverage, then list and filter. The console-log-analysis workflow counts errors and extracts `level: text` pairs for reports. On the MCP path the equivalent tool is `list_console_messages`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `SKILL.md` §7 | CLI | Helper command list (`bdg console --list`) |
| `references/cdp-patterns.md` §5 | Reference | Console log analysis workflow |
| `INSTALL-GUIDE.md` §6 | Guide | Console pattern and MCP equivalent |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/console-and-network/console-list.md` | Manual | BDG-011 scenario contract |

---

## 4. SOURCE METADATA

- Group: Console and Network
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `console-and-network/console-logs.md`
Related references:
- [eval-javascript.md](../dom-and-screenshot/eval-javascript.md) — Eval JavaScript
- [har-export.md](../console-and-network/har-export.md) — HAR Export
