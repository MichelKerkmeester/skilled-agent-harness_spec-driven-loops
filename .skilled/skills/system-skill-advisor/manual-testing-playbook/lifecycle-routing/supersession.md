---
title: "LC-002 Asymmetric Supersession Redirects"
description: "Manual validation that supersession metadata in lib/lifecycle/supersession.ts applies asymmetric routing with redirect_from and redirect_to and that superseded skills forward correctly."
trigger_phrases:
  - "lc-002"
  - "supersession"
  - "redirect_from redirect_to"
  - "asymmetric routing"
version: 0.8.1.0
id: LC-002
category: lifecycle_routing
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# LC-002 Asymmetric Supersession Redirects

Prompt: Manual validation that supersession metadata in lib/lifecycle/supersession.ts applies asymmetric routing with redirect_from and redirect_to and that superseded skills forward correctly.


---

## 1. OVERVIEW

Validate that `lib/lifecycle/supersession.ts` implements asymmetric routing: a superseded skill redirects queries forward via `redirect_to` and the successor exposes `redirect_from` metadata without overriding the successor's own recommendations.

---

## 2. SCENARIO CONTRACT

- A workspace containing a known superseded-successor pair in skill metadata (or a disposable copy with a synthetic pair).
- Advisor runtime built. Daemon reachable.
- `includeAttribution: true` and `topK >= 2` on recommendation calls.

---

## 3. TEST EXECUTION

### Commands

1. Identify the superseded-successor pair from `graph-metadata.json` supersession fields.
2. Call `advisor_recommend` with a prompt that historically mapped to the superseded skill:

```text
node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "<prompt mapping to superseded skill>" --options '{"topK":2,"includeAttribution":true}' --format json
```

3. Inspect the response for redirect metadata.
4. Call `advisor_recommend` with a prompt matching the successor and inspect metadata.

### Expected Signals

- Superseded skill is no longer the top recommendation. Successor wins routing.
- Response contains `lifecycle.redirect_to` pointing at the successor for the first call.
- Successor's response carries `lifecycle.redirect_from` (or equivalent) referencing the superseded skill.
- Redirect is asymmetric: the successor does not redirect back to the superseded skill.

### Evidence

- Capture the output and exit status from both advisor_recommend calls.
- Record the superseded-successor pair, the top recommendation, lifecycle.redirect_to, lifecycle.redirect_from and whether the successor redirects back.

### Pass / Fail

- **Pass**: Every expected signal holds.
- **Fail**: Any expected signal differs.

### Failure Triage

| Symptom | Detection | Action |
| --- | --- | --- |
| Superseded skill still wins | Top-1 matches superseded slug | Inspect `supersession.ts` demotion logic. |
| Missing redirect_to | Response omits redirect metadata | Audit `lib/compat/redirect-metadata.ts`. |
| Bidirectional redirect | Successor redirects back | Block release. Asymmetry is contract. |

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Scenario [NC-005](../../manual-testing-playbook/native-cli-tools/lifecycle-redirect-metadata.md), native redirect metadata.
- Scenario [LC-005](../../manual-testing-playbook/lifecycle-routing/rollback-lifecycle.md), lifecycle-level rollback.
- Feature [`lifecycle-routing/supersession.md`](../../feature-catalog/lifecycle-routing/supersession.md).
- Source: `.skilled/skills/system-skill-advisor/runtime/lib/lifecycle/supersession.ts`.

---

## 5. SOURCE METADATA

- Group: Lifecycle Routing
- Playbook ID: LC-002
- Canonical root source: manual-testing-playbook.md
- Feature file path: lifecycle-routing/supersession.md
