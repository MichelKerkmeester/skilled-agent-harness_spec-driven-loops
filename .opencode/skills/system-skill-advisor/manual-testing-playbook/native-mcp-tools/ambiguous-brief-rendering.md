---
title: "NC-004 Ambiguous Brief Rendering"
description: "Manual validation of top-two ambiguity rendering when recommendations are within 0.05 confidence."
trigger_phrases:
  - "nc-004"
  - "ambiguous brief rendering"
  - "ambiguous brief"
  - "ambiguous"
version: 0.8.0.13
id: NC-004
category: native_mcp_tools
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources:
  - workflow_mode: system-skill-advisor
    leaf_resource_id: references/scoring/advisor-scorer.md
---

# NC-004 Ambiguous Brief Rendering

Prompt: Manual validation of top-two ambiguity rendering when recommendations are within 0.05 confidence.


<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that ambiguous advisor results surface as ambiguity rather than a false single-skill certainty.

> Absorbed from former SAD-002 at 2026-05-07.

---

## 2. SCENARIO CONTRACT

- Repo root is the working directory.
- MCP server build is current.
- Hook renderer is available from the native package.

---

## 3. TEST EXECUTION

1. Run the ambiguity-focused unit test:

```bash
cd .opencode/skills/system-skill-advisor/mcp-server && npm exec -- vitest run tests/handlers/advisor-recommend.vitest.ts tests/legacy/advisor-renderer.vitest.ts --reporter=default
```

2. Call a broad prompt likely to place two skills close together:

```text
advisor_recommend({"prompt":"review opencode docs and improve the prompt package","options":{"topK":2,"includeAttribution":true}})
```

3. Inspect `data.ambiguous`.

### Absorbed Legacy Test Row

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SAD-002 | Ambiguous recommendation rendering | Confirm close recommendations are surfaced as ambiguity instead of false certainty | `Role: Skill Advisor MCP operator. Context: cross-domain prompt spanning documentation review, prompt improvement and OpenCode system work. Action: call advisor_recommend with topK 2 and attribution enabled, then inspect top-two confidence values and the ambiguity flag. Format: return PASS, PARTIAL or FAIL with top-two skill IDs, confidence values and ambiguity state.` | 1. `advisor_recommend({"prompt":"Review the OpenCode docs and improve the prompt package for a release note workflow.","options":{"topK":2,"includeAttribution":true,"includeAbstainReasons":true}})` -> 2. Save JSON to `/tmp/skill-advisor-playbook/sad-002.json` -> 3. Compare `data.recommendations[0].confidence`, `data.recommendations[1].confidence` and `data.ambiguous` | Envelope status is `ok`. Top recommendations are plausible for the prompt. Close top-two results set `ambiguous: true`. Lane attribution remains prompt-safe | Unit test command output: `RUN  v4.1.6 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp-server`; `✓ tests/handlers/advisor-recommend.vitest.ts (22 tests) 20ms`; `✓ tests/legacy/advisor-renderer.vitest.ts (13 tests) 4ms`; `Test Files  2 passed (2)`; `Tests  35 passed (35)`; `Start at  03:42:49`; `Duration  444ms (transform 207ms, setup 19ms, import 279ms, tests 24ms, environment 0ms)`. Broad prompt advisor output values: `status: "ok"`, `recommendations: []`, `ambiguous: false`, `freshness: "unavailable"`, `trustState.reason: "advisor_unavailable"`, `generation: 9476`, `checkedAt: "2026-07-03T01:43:04.878Z"`, `warnings: ["advisor_unavailable"]`, `abstainReasons: ["Skill advisor freshness is unavailable; returning fail-open empty recommendations."]`. Legacy prompt advisor output values: `status: "ok"`, `recommendations: []`, `ambiguous: false`, `freshness: "unavailable"`, `trustState.reason: "advisor_unavailable"`, `generation: 9476`, `checkedAt: "2026-07-03T01:43:05.041Z"`, `warnings: ["advisor_unavailable"]`, `abstainReasons: ["Skill advisor freshness is unavailable; returning fail-open empty recommendations."]`. `/tmp/skill-advisor-playbook/sad-002.json` was not created because this run's allowed write paths were restricted to this scenario file only. | BLOCKED - native advisor freshness was `unavailable` with `reason: "advisor_unavailable"`, so no top-two recommendations existed to compare and `ambiguous: true` could not be evaluated. | 1. Inspect scorer ambiguity threshold; 2. Re-run handler and renderer tests; 3. Check lane attribution for prompt leakage; 4. Review feature catalog ambiguity entry |

### Expected Signals

- Tests pass.
- MCP output includes `ambiguous: true` when the top two passing candidates are within 0.05 confidence.
- Rendered brief does not overstate certainty.
- Lane breakdown remains prompt-safe.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| `ambiguous` missing for close top two | Top two scores differ by <= 0.05 but flag is false | Inspect scorer ambiguity threshold. |
| Brief names only one route without ambiguity | Renderer output omits ambiguity context | Re-run renderer tests and block release. |
| Attribution leaks prompt text | Prompt literal appears in lane fields | Treat as privacy failure. |

---

## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/ambiguity.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts`

---

## 5. SOURCE METADATA

- Group: Native MCP Tools
- Playbook ID: NC-004
- Canonical root source: manual-testing-playbook.md
- Feature file path: native-mcp-tools/ambiguous-brief-rendering.md
