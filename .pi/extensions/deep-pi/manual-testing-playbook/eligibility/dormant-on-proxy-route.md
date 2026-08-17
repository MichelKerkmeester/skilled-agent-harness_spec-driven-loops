---
title: "DEEP-003 -- Dormant on a proxy route"
description: "This scenario validates dormancy for `DEEP-003`. It focuses on confirming that a proxied DeepSeek route leaves DeepPi dormant."
stage: negative
version: 1.0.0.0
---

# DEEP-003 -- Dormant on a proxy route

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DEEP-003`.

---

## 1. OVERVIEW

This scenario validates dormancy for `DEEP-003`. It focuses on confirming that a proxied route such as `openrouter/deepseek/deepseek-v4-pro` leaves DeepPi dormant: no `deeppi` footer and the default tool set unchanged.

### Why This Matters

DeepPi can only measure direct DeepSeek cache economics. On a proxy route the numbers would be wrong, so it must stay dormant rather than report misleading data.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DEEP-003` and confirm the expected signals without contradictory evidence.

- Objective: confirm DeepPi is dormant on a proxied DeepSeek route.
- Real user request: `I'm using DeepSeek through OpenRouter.`
- Prompt: select the `openrouter/deepseek/deepseek-v4-pro` route.
- Expected execution process: launch Pi on the proxy route and observe the tool set and footer at session start.
- Expected signals: the `deeppi` footer is unset and the tool set stays `read, edit, bash`.
- Desired user-visible outcome: DeepPi does not activate on an indirect route it cannot measure.
- Pass/fail: PASS if the footer is unset and `edit_lines` is not added; FAIL if DeepPi activates.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: use DeepSeek through a proxy.
2. Launch Pi on the proxy route.
3. Observe the tool set and footer at session start.
4. Confirm DeepPi stays dormant.
5. Record the footer value and the tool set.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DEEP-003 | Dormant on a proxy route | Verify dormancy on a proxied DeepSeek route | `select openrouter/deepseek/deepseek-v4-pro` | 1. `bash: pi --model openrouter/deepseek/deepseek-v4-pro` -> 2. observe the tool set and footer | Step 2: the `deeppi` footer is unset and the tool set stays `read, edit, bash` | The footer value and the active tool set | PASS if the footer is unset and `edit_lines` is not added; FAIL if DeepPi activates | 1. Confirm the provider is `openrouter`, not direct `deepseek`. 2. Compare against DEEP-002, where the direct route activates. 3. Confirm no stale `deeppi` footer carried over from a previous model. |

### Optional Supplemental Checks

Switch from this proxy route to the direct `deepseek/deepseek-v4-pro` and confirm DeepPi then activates.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../extensions/deeppi/eligibility.ts` | `isDeepPiModel` rejection of proxy routes |
| `../../tests/eligibility.test.ts` | Regression anchor for rejected models |
| `../../tests/deeppi.integration.test.ts` | Regression anchor for dormancy |

---

## 5. SOURCE METADATA

- Group: Eligibility
- Playbook ID: DEEP-003
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `eligibility/dormant-on-proxy-route.md`
