---
title: "Task Summary"
description: "cupt summary — workspace-wide task state overview."
trigger_phrases:
  - "task summary"
  - "cupt summary"
  - "workspace overview"
  - "task count by status"
  - "situational awareness dashboard"
version: 1.0.0.3
---

# Task Summary

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Generates a high-level summary of the workspace task state: counts by status, counts by assignee, and counts by priority.

---

## 2. HOW IT WORKS

Output is human-readable. Useful for situational awareness at the start of an agent session. No `--json` flag.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/summary.py` | CLI | Workspace task summary |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Workspace
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `09--cupt-workspace/task-summary.md`
Related references:
- [list-teams.md](list-teams.md) — List Teams
- [prefetch.md](prefetch.md) — Prefetch Cache
