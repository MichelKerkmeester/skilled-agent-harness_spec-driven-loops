---
title: "PC-002 --force-native and --force-local Toggles"
description: "Manual validation that --force-native requires the native advisor and fails when unavailable and that --force-local bypasses delegation and uses Python scoring."
trigger_phrases:
  - "pc-002"
  - "force-native flag"
  - "force-local flag"
  - "compat force toggles"
---

# PC-002 --force-native and --force-local Toggles

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate `--force-native` (requires native. Fails if unavailable) and `--force-local` (bypasses native. Uses Python scorer in `skill_advisor_runtime.py`).

---

## 2. SCENARIO CONTRACT

- Repo root. Python 3 available.
- MCP server built (native available).
- Ability to disable native via `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` to simulate unavailability for the `--force-native` failure branch.

---

## 3. TEST EXECUTION

1. Run native-required:

```bash
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --force-native "save this conversation context to memory" --threshold 0.8
```

2. Run local-forced:

```bash
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --force-local "save this conversation context to memory" --threshold 0.8
```

3. Disable native and re-run `--force-native`:

```bash
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --force-native "save this conversation context to memory"
```

### Expected Signals

- Step 1 output: entries tagged `source: "native"`.
- Step 2 output: entries tagged `source: "local"` (Python scorer).
- Step 3: exits non-zero or emits explicit "native unavailable" error (not a silent fallback).
- No prompt text in unexpected metadata fields.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| --force-native silently falls back | Entries show `source: "local"` when native was required | Block release. Force toggle contract broken. |
| --force-local uses native | Entries show `source: "native"` | Inspect shim delegation guard. |
| Source tag missing | Neither `"native"` nor `"local"` in response | Audit legacy-shape adapter. |

---

## 4. SOURCE FILES

- Scenario [CP-002](../03--compat-and-disable/force-local-force-native.md), original toggles scenario.
- Scenario [PC-003](./threshold-flag.md), threshold flag.
- Feature [`08--python-compat/cli-shim.md`](../../feature_catalog/08--python-compat/cli-shim.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` and `scripts/skill_advisor_runtime.py`.

---

## 5. SOURCE METADATA

- Group: Python Compat
- Playbook ID: PC-002
- Canonical root source: manual_testing_playbook.md
- Feature file path: 10--python-compat/force-native-force-local.md
