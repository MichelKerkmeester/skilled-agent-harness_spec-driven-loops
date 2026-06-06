---
title: "PC-001 Python Shim --stdin Round-Trip"
description: "Manual validation that skill_advisor.py reads exactly one prompt from stdin, routes through native-first compatibility and returns the legacy JSON-array shape."
trigger_phrases:
  - "pc-001"
  - "python shim stdin"
  - "skill_advisor.py stdin"
  - "compat shim stdin"
---

# PC-001 Python Shim --stdin Round-Trip

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `scripts/skill_advisor.py --stdin` reads exactly one prompt from stdin, delegates to the native advisor when available and emits the legacy JSON-array shape that pre-027 consumers expect.

---

## 2. SCENARIO CONTRACT

- Repo root. Python 3 available.
- MCP server built so the native daemon can be probed.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` unset.

---

## 3. TEST EXECUTION

1. Run the shim with a prompt piped into stdin:

```bash
printf '%s' "save this conversation context to memory" | python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --stdin --threshold 0.8
```

2. Inspect the JSON-array output.
3. Repeat with an empty stdin (just `printf ''`) and record the error or empty-array behavior.

### Expected Signals

- Output is a JSON array (not a wrapped envelope).
- First element has `source: "native"` when native is available.
- Top entry corresponds to the expected skill slug for the prompt.
- Empty stdin is handled deterministically (either empty array or an explicit error, not a crash).

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Shim reads argv instead of stdin | Output mirrors argv prompt | Inspect `--stdin` parser. |
| JSON shape mismatch | Output is envelope, not array | Audit shim's legacy-shape adapter. |
| Prompt echoed in metadata | Prompt substring appears in fields outside expected output | Block release as privacy failure. |

---

## 4. SOURCE FILES

- Scenario [CP-001](../03--compat-and-disable/python-shim-stdin.md), original shim stdin scenario.
- Scenario [PC-002](./force-native-force-local.md), force toggles.
- Feature [`08--python-compat/038-cli-shim.md`](../../feature_catalog/08--python-compat/038-cli-shim.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`.

---

## 5. SOURCE METADATA

- Group: Python Compat
- Playbook ID: PC-001
- Canonical root source: manual_testing_playbook.md
- Feature file path: 10--python-compat/stdin-mode.md
