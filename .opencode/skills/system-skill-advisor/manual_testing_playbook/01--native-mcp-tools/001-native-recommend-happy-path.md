---
title: "NC-001 Native advisor_recommend Happy Path"
description: "Manual validation scaffold for stable advisor_recommend behavior after the standalone MCP cutover."
trigger_phrases:
  - "nc-001"
  - "native advisor_recommend happy path"
  - "native advisor_recommend"
  - "system_skill_advisor advisor_recommend"
---

# NC-001 Native advisor_recommend Happy Path

---

## 1. OVERVIEW

Validate that the standalone MCP `advisor_recommend` tool returns prompt-safe recommendations for an existing skill.

This is a package-local scaffold of the legacy NC-001 scenario. Runtime execution remains legacy-owned until child 003 moves source and child 004 registers `system_skill_advisor`.

---

## 2. SCENARIO CONTRACT

- Repo root is the working directory.
- The standalone `system_skill_advisor` MCP server is registered.
- `advisor_status` reports `live` or `stale`.
- The package-local DB path is `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`.

---

## 3. TEST EXECUTION

Call the MCP tool:

```text
advisor_recommend({"prompt":"save this conversation context to memory","options":{"topK":1,"includeAttribution":true,"includeAbstainReasons":true}})
```

Expected signals:

- Response envelope has `status: "ok"`.
- `data.workspaceRoot` is the absolute repository root.
- `data.effectiveThresholds` is present.
- `data.freshness` is `live` or `stale`.
- First recommendation is appropriate for memory/spec-kit work.
- `laneBreakdown[]` contains lane contribution metadata only.
- Raw prompt text is absent from attribution, trust state, cache, warnings, and abstain reasons.

Scenario row:

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NC-001 | Native recommendation happy path | Confirm `advisor_recommend` returns a prompt-safe recommendation envelope from the standalone server | `Role: Skill Advisor MCP operator. Context: repo root with a current standalone advisor build and a memory-oriented request. Action: call advisor_recommend with attribution enabled and inspect thresholds, freshness, recommendation fields, and prompt-safety boundaries. Format: return PASS or FAIL with top skill ID, confidence, freshness, and one prompt-safety note.` | 1. `advisor_status({})` -> 2. `advisor_recommend({"prompt":"Save this conversation context to memory so the next session can resume from the current packet.","options":{"topK":1,"includeAttribution":true,"includeAbstainReasons":true}})` -> 3. Save JSON evidence -> 4. Search captured JSON for the raw prompt literal | Envelope status is `ok`; thresholds are present; recommendations are non-empty; top recommendation is appropriate for memory/spec-kit work; lane attribution has numeric contribution metadata only | MCP JSON response plus final verdict | PASS if response is ok, recommendation is appropriate, thresholds are present, and raw prompt text is absent from metadata; FAIL otherwise | 1. Run `advisor_status`; 2. Rebuild with `advisor_rebuild` if freshness is absent; 3. Confirm standalone MCP registration; 4. Inspect scorer tests |

---

## 4. SOURCE FILES

Current legacy anchors:

- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts`

Future standalone anchors:

- `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts`

---

## 5. SOURCE METADATA

- Group: Native MCP Tools
- Playbook ID: NC-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--native-mcp-tools/001-native-recommend-happy-path.md`
- ADR source: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/001-design-and-decision-record/decision-record.md`
