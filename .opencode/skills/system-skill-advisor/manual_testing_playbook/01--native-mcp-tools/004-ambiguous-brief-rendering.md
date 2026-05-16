---
title: "NC-004 Ambiguous Brief Rendering"
description: "Manual validation of top-two ambiguity rendering when recommendations are within 0.05 confidence."
trigger_phrases:
  - "nc-004"
  - "ambiguous brief rendering"
  - "ambiguous brief"
  - "ambiguous"
---

# NC-004 Ambiguous Brief Rendering

<!-- sk-doc-template: manual_testing_playbook -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

Validate that ambiguous advisor results surface as ambiguity rather than a false single-skill certainty.

> Absorbed from former SAD-002 at 2026-05-07.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-scenario-contract -->
## 2. SCENARIO CONTRACT

- Repo root is the working directory.
- MCP server build is current.
- Hook renderer is available from the native package.

---

<!-- /ANCHOR:2-scenario-contract -->

<!-- ANCHOR:3-test-execution -->
## 3. TEST EXECUTION

1. Run the ambiguity-focused unit test:

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp_server exec -- vitest run skill-advisor/tests/handlers/advisor-recommend.vitest.ts skill-advisor/tests/legacy/advisor-renderer.vitest.ts --reporter=default
```

2. Call a broad prompt likely to place two skills close together:

```text
advisor_recommend({"prompt":"review opencode docs and improve the prompt package","options":{"topK":2,"includeAttribution":true}})
```

3. Inspect `data.ambiguous`.

### Absorbed Legacy Test Row

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SAD-002 | Ambiguous recommendation rendering | Confirm close recommendations are surfaced as ambiguity instead of false certainty | `Role: Skill Advisor MCP operator. Context: cross-domain prompt spanning documentation review, prompt improvement and OpenCode system work. Action: call advisor_recommend with topK 2 and attribution enabled, then inspect top-two confidence values and the ambiguity flag. Format: return PASS, PARTIAL or FAIL with top-two skill IDs, confidence values and ambiguity state.` | 1. `advisor_recommend({"prompt":"Review the OpenCode docs and improve the prompt package for a release note workflow.","options":{"topK":2,"includeAttribution":true,"includeAbstainReasons":true}})` -> 2. Save JSON to `/tmp/skill-advisor-playbook/sad-002.json` -> 3. Compare `data.recommendations[0].confidence`, `data.recommendations[1].confidence` and `data.ambiguous` | Envelope status is `ok`. Top recommendations are plausible for the prompt. Close top-two results set `ambiguous: true`. Lane attribution remains prompt-safe | `/tmp/skill-advisor-playbook/sad-002.json` plus top-two confidence notes | PASS if ambiguity matches close top-two scoring and prompt-safety holds. PARTIAL if only one skill passes threshold with a clear reason. FAIL if close candidates are shown as certain or prompt text leaks | 1. Inspect scorer ambiguity threshold; 2. Re-run handler and renderer tests; 3. Check lane attribution for prompt leakage; 4. Review feature catalog ambiguity entry |

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

<!-- /ANCHOR:3-test-execution -->

<!-- ANCHOR:4-source-files -->
## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts`

---

<!-- /ANCHOR:4-source-files -->

<!-- ANCHOR:5-source-metadata -->
## 5. SOURCE METADATA

- Group: Native MCP Tools
- Playbook ID: NC-004
- Canonical root source: manual_testing_playbook.md
- Feature file path: 01--native-mcp-tools/004-ambiguous-brief-rendering.md

<!-- /ANCHOR:5-source-metadata -->
