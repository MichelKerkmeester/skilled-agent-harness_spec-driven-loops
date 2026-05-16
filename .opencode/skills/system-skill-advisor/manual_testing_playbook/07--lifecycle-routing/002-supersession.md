---
title: "LC-002 Asymmetric Supersession Redirects"
description: "Manual validation that supersession metadata in lib/lifecycle/supersession.ts applies asymmetric routing with redirect_from and redirect_to and that superseded skills forward correctly."
trigger_phrases:
  - "lc-002"
  - "supersession"
  - "redirect_from redirect_to"
  - "asymmetric routing"
---

# LC-002 Asymmetric Supersession Redirects

<!-- sk-doc-template: manual_testing_playbook -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

Validate that `lib/lifecycle/supersession.ts` implements asymmetric routing: a superseded skill redirects queries forward via `redirect_to` and the successor exposes `redirect_from` metadata without overriding the successor's own recommendations.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-scenario-contract -->
## 2. SCENARIO CONTRACT

- A workspace containing a known superseded-successor pair in skill metadata (or a disposable copy with a synthetic pair).
- MCP server built. Daemon reachable.
- `includeAttribution: true` and `topK >= 2` on recommendation calls.

---

<!-- /ANCHOR:2-scenario-contract -->

<!-- ANCHOR:3-test-execution -->
## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/deferred-decisions.md` §F34 for rationale.

1. Identify the superseded-successor pair from `graph-metadata.json` supersession fields.
2. Call `advisor_recommend` with a prompt that historically mapped to the superseded skill:

```text
advisor_recommend({"prompt":"<prompt mapping to superseded skill>","options":{"topK":2,"includeAttribution":true}})
```

3. Inspect the response for redirect metadata.
4. Call `advisor_recommend` with a prompt matching the successor and inspect metadata.

### Expected Signals

- Superseded skill is no longer the top recommendation. Successor wins routing.
- Response contains `lifecycle.redirect_to` pointing at the successor for the first call.
- Successor's response carries `lifecycle.redirect_from` (or equivalent) referencing the superseded skill.
- Redirect is asymmetric: the successor does not redirect back to the superseded skill.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Superseded skill still wins | Top-1 matches superseded slug | Inspect `supersession.ts` demotion logic. |
| Missing redirect_to | Response omits redirect metadata | Audit `lib/compat/redirect-metadata.ts`. |
| Bidirectional redirect | Successor redirects back | Block release. Asymmetry is contract. |

---

<!-- /ANCHOR:3-test-execution -->

<!-- ANCHOR:4-source-files -->
## 4. SOURCE FILES

- Scenario [NC-005](../01--native-mcp-tools/005-lifecycle-redirect-metadata.md), native MCP redirect metadata.
- Scenario [LC-005](./005-rollback-lifecycle.md), lifecycle-level rollback.
- Feature [`03--lifecycle-routing/02-supersession.md`](../../feature_catalog/03--lifecycle-routing/02-supersession.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/lifecycle/supersession.ts`.

---

<!-- /ANCHOR:4-source-files -->

<!-- ANCHOR:5-source-metadata -->
## 5. SOURCE METADATA

- Group: Lifecycle Routing
- Playbook ID: LC-002
- Canonical root source: manual_testing_playbook.md
- Feature file path: 07--lifecycle-routing/002-supersession.md

<!-- /ANCHOR:5-source-metadata -->
