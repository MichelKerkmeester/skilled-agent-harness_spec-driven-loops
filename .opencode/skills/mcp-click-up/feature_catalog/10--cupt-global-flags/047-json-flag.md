---
title: "JSON Output Flag"
description: "--json — structured JSON output on all read commands. Required for agent workflows."
trigger_phrases:
  - "json output flag"
  - "--json"
  - "structured output mode"
  - "parseable json format"
  - "agent-safe output flag"
---

# JSON Output Flag

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Switches the output format from human-readable to JSON on all read commands: `cupt list --json`, `cupt show <id> --json`, `cupt statuses <id> --json`. JSON output is stable and parseable.

---

## 2. HOW IT WORKS

Always use `--json` in agent code. Never parse human-readable cupt output — it is not a stable format and may change between versions. Empty list result is `[]` (valid JSON array).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/utils.py` | CLI | JSON serialization across all read commands |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Global Flags
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `10--cupt-global-flags/047-json-flag.md`
Related references:
- [048-offline-flag.md](048-offline-flag.md) — Offline Mode Flag
