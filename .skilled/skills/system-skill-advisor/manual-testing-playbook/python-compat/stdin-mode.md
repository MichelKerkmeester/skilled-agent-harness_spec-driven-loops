---
title: "PC-001 Python Shim --stdin Round-Trip"
description: "Manual validation that skill_advisor.py reads exactly one prompt from stdin, routes through native-first compatibility and returns the legacy JSON-array shape."
trigger_phrases:
  - "pc-001"
  - "python shim stdin"
  - "skill_advisor.py stdin"
  - "compat shim stdin"
version: 0.8.2.0
id: PC-001
category: python_compat
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# PC-001 Python Shim --stdin Round-Trip

Prompt: Manual validation that skill_advisor.py reads exactly one prompt from stdin, routes through native-first compatibility and returns the legacy JSON-array shape.


---

## 1. OVERVIEW

Validate that `scripts/skill_advisor.py --stdin` reads exactly one prompt from stdin, delegates to the native advisor when available and emits the legacy JSON-array shape that pre-027 consumers expect.

---

## 2. SCENARIO CONTRACT

- Repo root. Python 3 available.
- Advisor runtime built so the native daemon can be probed.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` unset.

---

## 3. TEST EXECUTION

### Commands

1. Run the shim with a prompt piped into stdin:

```bash
printf '%s' "save this conversation context to memory" | python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --stdin --threshold 0.8
```

2. Inspect the JSON-array output.
3. Repeat with an empty stdin (just `printf ''`) and record the error or empty-array behavior.

### Expected Signals

- Output is a JSON array (not a wrapped envelope).
- First element has `source: "native"` when native is available.
- Top entry corresponds to the expected skill slug for the prompt.
- Empty stdin is handled deterministically (either empty array or an explicit error, not a crash).

### Evidence

- The prompted and empty-stdin command outputs and exit statuses.
- The output shape, first result's `source`, top skill slug, empty-input behavior, and whether prompt text appears in unexpected metadata fields.

### Pass / Fail

- **Pass**: Every expected signal holds.
- **Fail**: Any expected signal differs.

### Failure Triage

| Symptom | Detection | Action |
| --- | --- | --- |
| Shim reads argv instead of stdin | Output mirrors argv prompt | Inspect `--stdin` parser. |
| JSON shape mismatch | Output is envelope, not array | Audit shim's legacy-shape adapter. |
| Prompt echoed in metadata | Prompt substring appears in fields outside expected output | Block release as privacy failure. |

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Scenario [CP-001](../../manual-testing-playbook/compat-and-disable/python-shim-stdin.md), original shim stdin scenario.
- Scenario [PC-002](../../manual-testing-playbook/python-compat/force-native-force-local.md), force toggles.
- Feature [`feature-catalog/python-compat/cli-shim.md`](../../feature-catalog/python-compat/cli-shim.md).
- Source: `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`.

---

## 5. SOURCE METADATA

- Group: Python Compat
- Playbook ID: PC-001
- Canonical root source: manual-testing-playbook.md
- Feature file path: python-compat/stdin-mode.md
