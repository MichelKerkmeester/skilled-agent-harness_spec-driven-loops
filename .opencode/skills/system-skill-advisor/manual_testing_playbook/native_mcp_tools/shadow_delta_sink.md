---
title: "NC-010 Shadow-Delta Sink Opt-In"
description: "Manual validation that advisor_recommend writes a durable shadow-delta record only when the opt-in flag or path is set, and never echoes raw prompt text into the sink."
trigger_phrases:
  - "nc-010"
  - "shadow delta sink"
  - "shadow delta opt-in"
  - "advisor shadow recording"
version: 0.8.0.0
---

# NC-010 Shadow-Delta Sink Opt-In

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `advisor_recommend` keeps shadow-delta comparison response-visible while durable recording stays default-off. The handler calls the sink only when `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` is set or `SPECKIT_ADVISOR_SHADOW_DELTA_ENABLED=1` / `true`, and the recorded prompt field is an HMAC digest rather than raw prompt text.

---

## 2. SCENARIO CONTRACT

- Repo root is the working directory.
- MCP server built. Daemon reachable.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` unset.
- Use a disposable workspace copy or a scratch sink path so the live `mcp_server/data/shadow-deltas.jsonl` file is not mutated.

---

## 3. TEST EXECUTION

1. Confirm default-off behavior. With both `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` and `SPECKIT_ADVISOR_SHADOW_DELTA_ENABLED` unset, call:

```text
advisor_recommend({"prompt":"build a typescript handler with vitest coverage","options":{"topK":3}})
```

2. Inspect the response envelope and confirm no new shadow-delta file was written for this call.

3. Enable the sink at a scratch path under the workspace root and re-run:

```bash
SPECKIT_ADVISOR_SHADOW_DELTA_PATH=/tmp/skill-advisor-playbook/shadow-deltas.jsonl advisor_recommend({"prompt":"build a typescript handler with vitest coverage","options":{"topK":3}})
```

4. Read the scratch JSONL file and inspect each record's `prompt` field.

5. Run the shadow-sink contract test:

```bash
cd .opencode/skills/system-skill-advisor/mcp_server && npm exec -- vitest run tests/shadow-sink.vitest.ts --reporter=default
```

### Expected Signals

- With the flag and path unset, `shadowDeltaSinkEnabled()` is false and no durable JSONL record is written.
- With `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` set under the workspace root, one JSONL record per shadow recommendation is appended to the scratch path.
- Each written record's `prompt` field is an `hmac:` digest, not raw prompt text.
- A `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` that resolves outside the workspace root is rejected with an error and no write.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Durable write with the flag off | A new JSONL record appears when no path or enable flag is set | Inspect `shadowDeltaSinkEnabled()` in `lib/shadow/shadow-sink.ts`. |
| Raw prompt text in the sink | Record `prompt` field is not an `hmac:` digest | Block release. Audit the `recordShadowDelta` call site in `handlers/advisor-recommend.ts`. |
| Out-of-workspace path accepted | A path outside the workspace root writes a file | Inspect `resolveShadowDeltaPath` boundary check. |

---

## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/mcp_server/lib/shadow/shadow-sink.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts`
- Feature [`mcp-surface/advisor-recommend.md`](../../feature_catalog/mcp-surface/advisor-recommend.md).

---

## 5. SOURCE METADATA

- Group: Native MCP Tools
- Playbook ID: NC-010
- Canonical root source: manual_testing_playbook.md
- Feature file path: native-mcp-tools/shadow-delta-sink.md

---

## 6. EVIDENCE

Precondition/env check command:

```bash
pwd; printenv SPECKIT_ADVISOR_SHADOW_DELTA_PATH; printenv SPECKIT_ADVISOR_SHADOW_DELTA_ENABLED; printenv SPECKIT_SKILL_ADVISOR_HOOK_DISABLED
```

Output:

```text
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
```

Live sink file presence check:

```text
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/data/shadow-deltas.jsonl
```

Shadow sink contract test file presence check:

```text
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/tests/shadow-sink.vitest.ts
```

Live sink metadata before default-off MCP call:

```bash
stat -f '%N %z %m' '.opencode/skills/system-skill-advisor/mcp_server/data/shadow-deltas.jsonl'
```

Output:

```text
.opencode/skills/system-skill-advisor/mcp_server/data/shadow-deltas.jsonl 300200 1779564968
```

Default-off MCP call:

```text
advisor_recommend({"prompt":"build a typescript handler with vitest coverage","options":{"topK":3}})
```

Observed MCP response:

```json
{
  "status": "ok",
  "data": {
    "workspaceRoot": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public",
    "effectiveThresholds": {
      "confidenceThreshold": 0,
      "uncertaintyThreshold": 1,
      "confidenceOnly": false
    },
    "recommendations": [],
    "ambiguous": false,
    "freshness": "unavailable",
    "trustState": {
      "state": "unavailable",
      "reason": "advisor_unavailable",
      "generation": 9476,
      "checkedAt": "2026-07-03T01:49:40.277Z",
      "lastLiveAt": null
    },
    "generatedAt": "2026-07-03T01:49:40.277Z",
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

Live sink metadata after default-off MCP call and scratch path existence check:

```bash
stat -f '%N %z %m' '.opencode/skills/system-skill-advisor/mcp_server/data/shadow-deltas.jsonl'; test -e '/tmp/skill-advisor-playbook/shadow-deltas.jsonl' && stat -f '%N %z %m' '/tmp/skill-advisor-playbook/shadow-deltas.jsonl'
```

Output:

```text
.opencode/skills/system-skill-advisor/mcp_server/data/shadow-deltas.jsonl 300200 1779564968
```

Advisor status check:

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
      "checkedAt": "2026-07-03T01:50:48.128Z",
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

The enabled-sink command and shadow-sink contract test were not run after the precondition failure. The scenario requires "MCP server built. Daemon reachable." but the real MCP response reported `advisor_unavailable`, and `advisor_status` reported `freshness: "unavailable"` with `trustState.reason: "SIGTERM"`.

---

## 7. PASS/FAIL

BLOCKED - The daemon reachable precondition is not satisfied: `advisor_recommend` returned `warnings: ["advisor_unavailable"]`, and `advisor_status` returned `freshness: "unavailable"` with `trustState.reason: "SIGTERM"`.
