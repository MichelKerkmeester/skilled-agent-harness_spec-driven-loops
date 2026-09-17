---
title: "JSON Output"
description: "cupt list --json — machine-readable JSON array. Required for agent workflows."
trigger_phrases:
  - "json output"
  - "cupt list --json"
  - "machine-readable task list"
  - "json task array"
  - "agent-parseable output"
version: 1.0.0.3
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
| `manual-testing-playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Listing
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cupt-task-listing/json-output.md`
Related references:
- [verbose.md](verbose.md) — Verbose Output
- [offline.md](offline.md) — Offline Listing
