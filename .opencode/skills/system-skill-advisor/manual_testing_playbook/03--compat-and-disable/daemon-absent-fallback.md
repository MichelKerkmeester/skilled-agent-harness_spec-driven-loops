---
title: "CP-004 Daemon Absent Fallback"
description: "Manual validation for daemon-absent local fallback and native fail-open behavior."
trigger_phrases:
  - "cp-004"
  - "daemon absent fallback"
  - "daemon absent"
  - "daemon"
version: 0.8.0.13
---

# CP-004 Daemon Absent Fallback

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate two fallback paths: the Python shim routes to local scoring when native daemon probing is unavailable and native `advisor_recommend` fails open with empty recommendations when freshness is absent.

---

## 2. SCENARIO CONTRACT

- Use a disposable copy or controlled environment override to simulate absent native generation/artifact state.
- Do not move the live repository database without a restore plan.

---

## 3. TEST EXECUTION

1. Python local fallback:

```bash
SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "help me commit my changes"
```

2. Native absent check in disposable workspace:

```text
advisor_recommend({"prompt":"help me commit my changes","options":{"topK":1,"includeAbstainReasons":true}})
```

3. Inspect `freshness`, `trustState` and recommendations.

### Expected Signals

- Forced-local shim returns a JSON array from the Python scorer.
- Native absent response returns `recommendations: []`, `freshness: "absent"` and a prompt-safe abstain reason.
- The absence path does not throw and does not block prompt handling.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Native absent throws | MCP call errors instead of JSON envelope | Inspect absent freshness branch. |
| Shim cannot route locally | Forced-local exits nonzero | Check Python scorer imports and skill metadata. |
| Live DB was moved and not restored | `advisor_status` remains absent in real repo | Restore database or run rebuild before continuing. |

---

## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`

---

## 5. SOURCE METADATA

- Group: Compat And Disable
- Playbook ID: CP-004
- Canonical root source: manual_testing_playbook.md
- Feature file path: 03--compat-and-disable/daemon-absent-fallback.md

---

## 6. EVIDENCE

Command:

```bash
SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "help me commit my changes"
```

Output:

```text
Skill graph: loaded from SQLite
[
  {
    "skill": "sk-git",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !changes(multi), !commit, !commit(keyword), !commit(signal), branch",
    "_graph_boost_count": 0,
    "source": "local"
  }
]
```

MCP call:

```text
advisor_recommend({"prompt":"help me commit my changes","options":{"topK":1,"includeAbstainReasons":true}})
```

Observed response:

```json
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
      "checkedAt": "2026-07-03T02:02:56.797Z",
      "lastLiveAt": null
    },
    "generatedAt": "2026-07-03T02:02:56.797Z",
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

Comparison against Expected Signals:

- Forced-local shim returned a JSON array from the Python scorer.
- Native response returned `recommendations: []` and a prompt-safe abstain reason.
- Native response did not throw and did not block prompt handling.
- Native response returned `freshness: "unavailable"`, not the expected `freshness: "absent"`.
- The required disposable workspace or controlled environment override for absent native generation/artifact state was not available under the allowed write constraints for this run.

---

## 7. PASS/FAIL

BLOCKED - The scenario could not establish the required absent native generation/artifact precondition; the real native response was fail-open but reported `freshness: "unavailable"` instead of the expected `freshness: "absent"`.
