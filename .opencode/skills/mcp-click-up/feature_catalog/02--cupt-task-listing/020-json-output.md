---
title: "JSON Output"
description: "cupt list --json — machine-readable JSON array. Required for agent workflows."
trigger_phrases:
  - "json output"
  - "cupt list --json"
  - "machine-readable task list"
  - "json task array"
  - "agent-parseable output"
---

# JSON Output

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Returns a JSON array of task objects. Each object includes: id, name, status, due_date, tags, assignees, url. Required for any agent that parses cupt output programmatically.

---

## 2. HOW IT WORKS

Never parse human-readable cupt output in agent code. Always use `--json`. Empty result is `[]` (valid, not an error).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/tasks.py` | CLI | JSON serialization of task list |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Listing
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `02--cupt-task-listing/020-json-output.md`
Related references:
- [019-verbose.md](019-verbose.md) — Verbose Output
- [021-offline.md](021-offline.md) — Offline Listing
