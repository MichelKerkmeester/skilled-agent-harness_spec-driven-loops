---
title: "PC-002 --force-native and --force-local Toggles"
description: "Manual validation that --force-native requires the native advisor and fails when unavailable and that --force-local bypasses delegation and uses Python scoring."
trigger_phrases:
  - "pc-002"
  - "force-native flag"
  - "force-local flag"
  - "compat force toggles"
version: 0.8.0.13
id: PC-002
category: python_compat
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# PC-002 --force-native and --force-local Toggles

Prompt: Manual validation that --force-native requires the native advisor and fails when unavailable and that --force-local bypasses delegation and uses Python scoring.


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
python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py --force-native "save this conversation context to memory" --threshold 0.8
```

2. Run local-forced:

```bash
python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py --force-local "save this conversation context to memory" --threshold 0.8
```

3. Disable native and re-run `--force-native`:

```bash
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py --force-native "save this conversation context to memory"
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

- Scenario [CP-002](../../manual-testing-playbook/compat-and-disable/force-local-force-native.md), original toggles scenario.
- Scenario [PC-003](../../manual-testing-playbook/python-compat/threshold-flag.md), threshold flag.
- Feature [`python-compat/cli-shim.md`](../../feature-catalog/python-compat/cli-shim.md).
- Source: `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py` and `scripts/skill_advisor_runtime.py`.

---

## 5. SOURCE METADATA

- Group: Python Compat
- Playbook ID: PC-002
- Canonical root source: manual-testing-playbook.md
- Feature file path: python-compat/force-native-force-local.md

---

## 6. EVIDENCE

Command 1:

```bash
python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py --force-native "save this conversation context to memory" --threshold 0.8
```

Output:

```json
{
  "error": "Native advisor unavailable",
  "reason": "SIGTERM",
  "freshness": "unavailable"
}
```

Command 2:

```bash
python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py --force-local "save this conversation context to memory" --threshold 0.8
```

Output:

```text
Skill graph: loaded from SQLite
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !context, !context(multi), !memory, !save this conversation context(phrase), !save(multi) [boundary: owns memory/context preservation]",
    "_graph_boost_count": 0,
    "source": "local"
  },
  {
    "skill": "memory:save",
    "kind": "skill",
    "confidence": 0.88,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !intent:memory, !save this conversation context(phrase), context, memory(name), save(name)",
    "_graph_boost_count": 0,
    "source": "local"
  },
  {
    "skill": "command-memory-save",
    "kind": "command",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !save this conversation context(phrase), command_penalty, context, conversation, memory(name)",
    "_graph_boost_count": 0,
    "source": "local"
  }
]
```

Command 3:

```bash
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py --force-native "save this conversation context to memory"
```

Output:

```json
{
  "error": "Native advisor unavailable",
  "reason": "ADVISOR_DISABLED",
  "freshness": "native-unavailable"
}
```

Comparison to Expected Signals:

- Step 1 expected entries tagged `source: "native"`; actual output was `Native advisor unavailable` with `reason: "SIGTERM"` and `freshness: "unavailable"`.
- Step 2 expected entries tagged `source: "local"`; actual output contained three entries with `"source": "local"`.
- Step 3 expected non-zero exit or explicit native unavailable error; actual output emitted `"error": "Native advisor unavailable"` with `"reason": "ADVISOR_DISABLED"`.
- Prompt text appeared only in expected match/reason fields from the scorer output; no unexpected metadata field was observed in the command output.

---

## 7. PASS/FAIL

BLOCKED: The precondition `MCP server built (native available)` is missing or broken in the current repo state because the native-required command returned `"error": "Native advisor unavailable"`, `"reason": "SIGTERM"`, and `"freshness": "unavailable"` instead of native results.
