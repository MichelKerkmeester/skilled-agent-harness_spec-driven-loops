---
title: "List Default"
description: "cupt config --default-list <id> — persist a default list ID."
---

# List Default

---

## 1. OVERVIEW

Saves a ClickUp list ID as the workspace default. Useful when most agent work targets a single sprint or project list.

---

## 2. CURRENT REALITY

Stored in `~/.cupt/config.yaml`. Used by commands that accept a list context when none is provided.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/config.py` | CLI | Persistent config storage |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Authentication
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `01--cupt-authentication/04-list-default.md`
