---
title: "Workspace Default"
description: "cupt config --workspace-id <id> — persist a default workspace ID."
trigger_phrases:
  - "workspace default"
  - "cupt config --workspace-id"
  - "set default workspace"
  - "persist workspace id"
  - "team_id default"
---

# Workspace Default

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Saves a workspace (ClickUp `team_id`) as the default for all subsequent commands. The workspace ID appears in `cupt status` output as 'Workspace ID'.

---

## 2. HOW IT WORKS

Stored in `~/.cupt/config.yaml`. All commands that need a workspace use this value when none is explicitly passed.

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
- Feature file path: `01--cupt-authentication/003-workspace-default.md`
Related references:
- [002-direct-token.md](002-direct-token.md) — Direct API Token
- [004-list-default.md](004-list-default.md) — List Default
