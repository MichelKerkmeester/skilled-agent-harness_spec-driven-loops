---
title: "Exclude by Tag"
description: "cupt list --no-tag <name> — exclude tasks carrying the specified tag."
---

# Exclude by Tag

---

## 1. OVERVIEW

Filters out tasks that carry the named tag. Useful for removing already-processed work from agent queues (e.g., `--no-tag processed`).

---

## 2. CURRENT REALITY

Runs client-side. Combine with server-side `--tag` to narrow before filtering: `cupt list --tag ai_ready --no-tag in_progress --json`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/tasks.py` | CLI | Tag exclusion filter |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Listing
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `02--cupt-task-listing/06-exclude-tag.md`
