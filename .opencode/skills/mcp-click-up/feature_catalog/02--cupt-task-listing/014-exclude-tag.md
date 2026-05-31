---
title: "Exclude by Tag"
description: "cupt list --no-tag <name> — exclude tasks carrying the specified tag."
trigger_phrases:
  - "exclude by tag"
  - "cupt list --no-tag"
  - "exclude tag filter"
  - "tag exclusion"
  - "remove tagged tasks from results"
---

# Exclude by Tag

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Filters out tasks that carry the named tag. Useful for removing already-processed work from agent queues (e.g., `--no-tag processed`).

---

## 2. HOW IT WORKS

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
- Feature file path: `02--cupt-task-listing/014-exclude-tag.md`
Related references:
- [013-filter-tag.md](013-filter-tag.md) — Filter by Tag
- [015-filter-team.md](015-filter-team.md) — Filter by Team
