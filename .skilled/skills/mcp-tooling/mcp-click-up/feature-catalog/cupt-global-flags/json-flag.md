---
title: "JSON Output Flag"
description: "--json — per-command flag (not global) on list, show, statuses, and teams. Required for agent workflows on those commands."
trigger_phrases:
  - "json output flag"
  - "--json"
  - "structured output mode"
  - "parseable json format"
  - "agent-safe output flag"
version: 1.0.0.3
---

# JSON Output Flag

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`--json` is a per-command option, not a global flag — it exists on exactly four commands: `cupt list --json`, `cupt show <id> --json`, `cupt statuses <id> --json`, and `cupt teams --json`. It is NOT available on `notes`, `attach list`, `summary`, `context`, or `cupt time status`. JSON output is stable and parseable where supported.

---

## 2. HOW IT WORKS

Use `--json` in agent code on the four commands that support it. Never parse human-readable cupt output — it is not a stable format and may change between versions. Empty list result is `[]` (valid JSON array).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/utils.py` | CLI | JSON serialization across all read commands |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Global Flags
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cupt-global-flags/json-flag.md`
Related references:
- [offline-flag.md](../../feature-catalog/cupt-global-flags/offline-flag.md) — Offline Mode Flag
