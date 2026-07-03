---
title: "CP-001 Python Shim --stdin Mode"
description: "Manual validation for the pre-027 Python shim stdin regression path."
trigger_phrases:
  - "cp-001"
  - "python shim --stdin mode"
  - "python shim"
  - "python"
version: 0.8.0.13
---

# CP-001 Python Shim --stdin Mode

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `skill_advisor.py --stdin` reads exactly one prompt from stdin and still routes through native-first compatibility.

---

## 2. SCENARIO CONTRACT

- Repo root is the working directory.
- Python 3 is available.
- Native build exists. Fallback is acceptable only when native status is unavailable.

---

## 3. TEST EXECUTION

1. Run:

```bash
printf '%s' "save this conversation context to memory" | python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --stdin --threshold 0.8
```

2. Repeat with native required:

```bash
printf '%s' "save this conversation context to memory" | python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --stdin --force-native --threshold 0.8
```

### Expected Signals

- Output is a JSON array.
- Native path entries include `source: "native"` when native is available.
- Top skill for the prompt is `system-spec-kit`.
- Prompt text is not echoed into metadata fields.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Empty stdin ignored | Result routes argv or errors unexpectedly | Check stdin mode parser. |
| Native required fails | JSON error says native unavailable | Run `advisor_status`. If unavailable, record environment blocker. |
| Prompt leak | Prompt literal appears outside expected command transcript | Block release. |

---

## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/compat/shim.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Compat And Disable
- Playbook ID: CP-001
- Canonical root source: manual_testing_playbook.md
- Feature file path: 03--compat-and-disable/python-shim-stdin.md

---

## 6. EVIDENCE

Command 1:

```bash
printf '%s' "save this conversation context to memory" | python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --stdin --threshold 0.8
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

Command 2:

```bash
printf '%s' "save this conversation context to memory" | python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --stdin --force-native --threshold 0.8
```

Output:

```json
{
  "error": "Native advisor unavailable",
  "reason": "SIGTERM",
  "freshness": "unavailable"
}
```

Failure-mode advisor_status check:

```json
{
  "status": "ok",
  "data": {
    "freshness": "unavailable",
    "generation": 9476,
    "trustState": {
      "state": "stale",
      "reason": "SIGTERM",
      "generation": 9476,
      "checkedAt": "2026-07-03T02:07:24.081Z",
      "lastLiveAt": null
    },
    "lastGenerationBump": "2026-07-02T05:27:14.803Z",
    "lastScanAt": "2026-07-02T05:27:14.803Z",
    "skillCount": 26,
    "laneWeights": {
      "explicit_author": 0.42,
      "lexical": 0.28,
      "graph_causal": 0.13,
      "derived_generated": 0.12,
      "semantic_shadow": 0.05
    }
  }
}
```

Observed comparison:

- Command 1 output included a non-JSON prefix line: `Skill graph: loaded from SQLite`.
- Command 1 top skill was `system-spec-kit`.
- Command 1 entries used `source: "local"`, not `source: "native"`.
- Command 2 reported `Native advisor unavailable` with `reason: "SIGTERM"` and `freshness: "unavailable"`.
- `advisor_status` reported `freshness: "unavailable"` and `trustState.reason: "SIGTERM"`.

---

## 7. PASS/FAIL

BLOCKED - Native advisor is unavailable in the current environment: forced-native stdin mode returned `Native advisor unavailable` with `reason: "SIGTERM"`, and `advisor_status` reported `freshness: "unavailable"`.
