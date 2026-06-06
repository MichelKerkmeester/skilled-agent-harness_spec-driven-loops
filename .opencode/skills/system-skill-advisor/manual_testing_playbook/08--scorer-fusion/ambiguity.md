---
title: "SC-003 Top-2 Ambiguity Window"
description: "Manual validation that when the top two candidates are within 0.05 confidence, the advisor returns an ambiguous brief rather than a single top-1 recommendation."
trigger_phrases:
  - "sc-003"
  - "ambiguity window"
  - "top-2 within 0.05"
  - "ambiguous brief"
---

# SC-003 Top-2 Ambiguity Window

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `lib/scorer/ambiguity.ts` returns an ambiguous brief when the top two candidates are within a 0.05 confidence window and that downstream rendering reflects ambiguity rather than arbitrarily selecting one winner.

---

## 2. SCENARIO CONTRACT

- Repo root. MCP server built.
- A curated prompt known to produce near-tied candidates (from routing-accuracy corpus ambiguous set).
- `includeAttribution: true` and `topK: 2`.

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred_decisions.md` §F34 for rationale.

1. Call `advisor_recommend` with the ambiguous prompt:

```text
advisor_recommend({"prompt":"<ambiguous prompt from corpus>","options":{"topK":2,"includeAttribution":true}})
```

2. Inspect the response for an `ambiguous: true` flag or equivalent ambiguity brief field.
3. Record the top-1 and top-2 aggregate scores and confirm delta <= 0.05.
4. Cross-check behavior against scenario NC-004.

### Expected Signals

- Response carries an explicit ambiguity signal when the top-2 delta <= 0.05.
- Both candidates are exposed (not hidden behind a single top-1).
- Rendering path (for hook output) presents both candidates with lane attribution.
- When delta > 0.05, ambiguity flag is absent and top-1 is singular.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Ambiguity missed | Delta <= 0.05 but single top-1 returned | Inspect `ambiguity.ts` delta check. |
| Ambiguity over-triggered | Delta > 0.05 flagged as ambiguous | Verify threshold constant. |
| Ambiguity hides top-1 | Both candidates suppressed | Rendering bug. Confirm `lib/render.ts`. |

---

## 4. SOURCE FILES

- Scenario [NC-004](../01--native-mcp-tools/ambiguous-brief-rendering.md), ambiguous brief rendering.
- Scenario [SC-004](./lane-attribution.md), lane attribution.
- Feature [`04--scorer-fusion/ambiguity.md`](../../feature_catalog/04--scorer-fusion/ambiguity.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts`.

---

## 5. SOURCE METADATA

- Group: Scorer Fusion
- Playbook ID: SC-003
- Canonical root source: manual_testing_playbook.md
- Feature file path: 08--scorer-fusion/ambiguity.md
