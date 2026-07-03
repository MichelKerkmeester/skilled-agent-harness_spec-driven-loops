---
title: "PC-001 Python Shim --stdin Round-Trip"
description: "Manual validation that skill_advisor.py reads exactly one prompt from stdin, routes through native-first compatibility and returns the legacy JSON-array shape."
trigger_phrases:
  - "pc-001"
  - "python shim stdin"
  - "skill_advisor.py stdin"
  - "compat shim stdin"
version: 0.8.0.13
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
- Feature [`08--python-compat/cli-shim.md`](../../feature_catalog/08--python-compat/cli-shim.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`.

---

## 5. SOURCE METADATA

- Group: Python Compat
- Playbook ID: PC-001
- Canonical root source: manual_testing_playbook.md
- Feature file path: 10--python-compat/stdin-mode.md

---

## 6. EVIDENCE

Precondition checks:

```bash
python3 --version
```

```text
Python 3.9.6
```

```bash
printenv SPECKIT_SKILL_ADVISOR_HOOK_DISABLED
```

```text

```

Skill advisor MCP availability observed before scenario execution:

```text
{
  "status": "ok",
  "data": {
    "workspaceRoot": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public",
    "effectiveThresholds": {
      "confidenceThreshold": 0.8,
      "uncertaintyThreshold": 0.35,
      "confidenceOnly": false
    },
    "recommendations": [],
    "ambiguous": false,
    "freshness": "unavailable",
    "trustState": {
      "state": "unavailable",
      "reason": "advisor_unavailable",
      "generation": 9476,
      "checkedAt": "2026-07-03T02:38:31.796Z",
      "lastLiveAt": null
    },
    "generatedAt": "2026-07-03T02:38:31.796Z",
    "cache": {
      "hit": false,
      "sourceSignaturePresent": false
    },
    "warnings": [
      "advisor_unavailable"
    ],
    "abstainReasons": [
      "Skill advisor freshness is unavailable; returning fail-open empty recommendations."
    ]
  }
}
```

Scenario command 1:

```bash
printf '%s' "save this conversation context to memory" | python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --stdin --threshold 0.8
```

Observed output:

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

Scenario command 2:

```bash
printf '' | python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --stdin --threshold 0.8
```

Observed output:

```text
[]
```

---

## 7. PASS/FAIL

FAIL: The prompted stdin run returned the expected top skill slug and empty stdin returned `[]`, but the first result used `"source": "local"` rather than `"source": "native"`; the advisor availability check also reported `"freshness": "unavailable"` and `"reason": "advisor_unavailable"`.
