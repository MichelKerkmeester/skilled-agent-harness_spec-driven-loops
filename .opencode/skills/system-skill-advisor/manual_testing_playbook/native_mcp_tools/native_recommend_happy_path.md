---
title: "NC-001 Native advisor_recommend Happy Path"
description: "Manual validation that advisor_recommend returns prompt-safe native recommendations for an existing skill."
trigger_phrases:
  - "nc-001"
  - "native advisor_recommend happy path"
  - "native advisor_recommend"
  - "native"
version: 0.8.0.6
---

# NC-001 Native advisor_recommend Happy Path

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate the native MCP `advisor_recommend` tool with a prompt that should map to `system-spec-kit`.

> Absorbed from former SAD-001 at 2026-05-07.

---

## 2. SCENARIO CONTRACT

- Repo root is the working directory.
- MCP server has been built with `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build`.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` is unset.

---

## 3. TEST EXECUTION

1. Call the MCP tool:

```text
advisor_recommend({"prompt":"save this conversation context to memory","options":{"topK":1,"includeAttribution":true,"includeAbstainReasons":true}})
```

2. Save the JSON response.
3. Inspect `data.workspaceRoot`, `data.effectiveThresholds` and `data.recommendations[0]`.

### Absorbed Legacy Test Row

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SAD-001 | Native recommendation happy path | Confirm `advisor_recommend` returns a prompt-safe recommendation envelope | `Role: Skill Advisor MCP operator. Context: repo root with a current MCP build and a memory-oriented request. Action: call advisor_recommend with attribution enabled and inspect thresholds, freshness, recommendation fields and prompt-safety boundaries. Format: return PASS or FAIL with top skill ID, confidence, freshness and one prompt-safety note.` | 1. `bash: mkdir -p /tmp/skill-advisor-playbook` -> 2. `advisor_recommend({"prompt":"Save this conversation context to memory so the next session can resume from the current packet.","options":{"topK":1,"includeAttribution":true,"includeAbstainReasons":true}})` -> 3. Save JSON to `/tmp/skill-advisor-playbook/sad-001.json` -> 4. Search captured JSON for the raw prompt literal | Envelope status is `ok`; `data.effectiveThresholds` is present. Recommendations are non-empty. Top recommendation is appropriate for memory/spec-kit work. Lane attribution has numeric contribution metadata only | `/tmp/skill-advisor-playbook/sad-001.json` plus terminal transcript and final verdict | PASS if response is ok, recommendation is appropriate, thresholds are present and raw prompt text is absent from metadata. FAIL otherwise | 1. Run `advisor_status`; 2. Rebuild with `advisor_rebuild` if freshness is absent or unavailable; 3. Confirm disable flag is unset; 4. Inspect scorer tests for changed routing expectations |

### Expected Signals

- Response envelope has `status: "ok"`.
- `data.workspaceRoot` is the absolute repository root for the current checkout.
- `data.effectiveThresholds` is present and, for this exact call with no overrides, equals:

```json
{
  "confidenceThreshold": 0.8,
  "uncertaintyThreshold": 0.35,
  "confidenceOnly": false
}
```

- `data.freshness` is `live` or `stale`.
- First recommendation has `skillId: "system-spec-kit"`.
- `laneBreakdown[]` contains lane contribution metadata only: `lane`, `rawScore`, `weightedScore`, `weight`, `shadowOnly`.
- Raw prompt text is not present in `laneBreakdown`, `trustState`, `cache`, `warnings` or `abstainReasons`.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Empty recommendations with `freshness: "absent"` | Response has `recommendations: []` and `trustState.state: "absent"` | Run `advisor_status`, rebuild the skill graph and repeat. |
| Disabled response | `warnings` contains `ADVISOR_DISABLED` | Unset `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`. |
| Prompt text appears in attribution | Search captured JSON for the prompt literal | Treat as privacy failure and block release. |

---

## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts`

---

## 5. SOURCE METADATA

- Group: Native MCP Tools
- Playbook ID: NC-001
- Canonical root source: manual_testing_playbook.md
- Feature file path: native-mcp-tools/native-recommend-happy-path.md
