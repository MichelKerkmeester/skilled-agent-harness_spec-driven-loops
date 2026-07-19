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
| `references/cdp_patterns.md` §5 | Reference | Console log analysis workflow |
| `INSTALL-GUIDE.md` §6 | Guide | Console pattern and MCP equivalent |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/console_and_network/console_list.md` | Manual | BDG-011 scenario contract |

---

## 4. SOURCE METADATA

- Group: Console and Network
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `console_and_network/console_logs.md`
Related references:
- [eval_javascript.md](../dom_and_screenshot/eval_javascript.md) — Eval JavaScript
- [har_export.md](../console_and_network/har_export.md) — HAR Export
