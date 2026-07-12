---
title: "CR-023 -- Review-depth alias"
description: "This scenario validates the review-depth alias for `CR-023`. It focuses on the reviewing agent honoring SK_CODE_REVIEW_DEPTH=lite|full|ultra resolved env over config over default, without relaxing any floor or skipping a sensitive path."
version: 1.5.0.1
---

# CR-023 -- Review-depth alias

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-023`.

---

## 1. OVERVIEW

This scenario validates the review-depth alias for `CR-023`. It focuses on the reviewing agent honoring `SK_CODE_REVIEW_DEPTH=lite|full|ultra` resolved env over config over default, without relaxing any floor or skipping a sensitive path.

### Why This Matters

Callers who want a consistently deep, or consistently light, review previously had to repeat "comprehensive" or "full review" on every run. The §9.3 `SK_CODE_REVIEW_DEPTH` alias added in v1.4.0.0 names and persists routing that already existed: `full` (the unset default) is normal ALWAYS plus CONDITIONAL plus ON_DEMAND routing, `ultra` biases intent selection toward the existing ON_DEMAND deep-dive reference set, and `lite` maps to the existing M-2 conservative skip. It is an alias the reviewing agent honors in-loop, resolved env over config over default in the same idiom as `SK_CODE_REVIEW_MIN_CHANGED_LINES`, and it adds no tier and relaxes no floor. CR-023 proves the resolution order holds and that `lite` never lowers the ALWAYS tier, the security and correctness minimums, or the P0/P1/P2 contract, and can never skip a review on a sensitive path.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-023` and confirm the expected signals without contradictory evidence.

- Objective: Confirm SK_CODE_REVIEW_DEPTH resolves env over config over default, ultra biases ON_DEMAND deep-dive refs, lite maps to the M-2 conservative skip, and no value relaxes the floor or skips a sensitive path.
- Real user request: `Reviewer wants a consistently deep, then consistently light, review without repeating depth wording each run.`
- Prompt: `Run a review with SK_CODE_REVIEW_DEPTH set to ultra, then lite, and confirm ultra pulls in the on-demand deep-dive references while lite maps to the conservative skip, and that neither lowers the security and correctness floor or skips a sensitive-path diff.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: depth resolves env over config over default; Step 2: ultra biases intent toward the ON_DEMAND deep-dive set and lite maps to the M-2 conservative skip; Step 3: a sensitive-path diff is still reviewed under lite.
- Desired user-visible outcome: a session whose review depth matches the requested alias without ever dropping a baseline minimum or skipping a sensitive change.
- Pass/fail: PASS if depth resolution and routing match references-backed SKILL.md section 9.3 and lite never skips a sensitive path or lowers the floor; FAIL if a depth value relaxes a baseline minimum or skips a sensitive diff.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the depth request in plain review-scope language.
2. Confirm the resolution inputs present: SK_CODE_REVIEW_DEPTH env, any config default, and the unset fallback.
3. Execute the deterministic steps exactly as written.
4. Compare the observed routing against the cited review reference files.
5. Return a concise final verdict that names any relaxed floor or skipped sensitive path when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-023 | Review-depth alias | Confirm SK_CODE_REVIEW_DEPTH resolves env over config over default, ultra biases ON_DEMAND deep-dive refs, lite maps to the M-2 conservative skip, and no value relaxes the floor or skips a sensitive path. | `Run a review with SK_CODE_REVIEW_DEPTH set to ultra, then lite, and confirm ultra pulls in the on-demand deep-dive references while lite maps to the conservative skip, and that neither lowers the security and correctness floor or skips a sensitive-path diff.` | bash: SK_CODE_REVIEW_DEPTH=ultra agent: @review the diff -> bash: SK_CODE_REVIEW_DEPTH=lite agent: @review the diff -> bash: SK_CODE_REVIEW_DEPTH=lite agent: @review a sensitive-path (auth or config) diff | Step 1: depth resolves env over config over default; Step 2: ultra biases ON_DEMAND deep-dive set, lite maps to M-2 conservative skip; Step 3: sensitive-path diff still reviewed under lite | Two routing transcripts plus the sensitive-path transcript and loaded-reference lists | PASS if depth resolution and routing match SKILL.md section 9.3 and lite never skips a sensitive path or lowers the floor; FAIL if a depth value relaxes a baseline minimum or skips a sensitive diff | 1. Verify env over config over default order; 2. Check the M-2 sensitive-path exclusion list; 3. Confirm ALWAYS tier and security minimums held |

### Optional Supplemental Checks

If the primary run passes, repeat with SK_CODE_REVIEW_DEPTH unset and confirm the session behaves as `full` (the default). Keep supplemental evidence separate from the primary verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Section 9.3 SK_CODE_REVIEW_DEPTH alias, section 9.2 min-changed gate idiom, and section 3 M-1/M-2 skip contract |
| `../../README.md` | Efficiency-gate description surfacing the depth alias |

---

## 5. SOURCE METADATA

- Group: Efficiency And Restraint
- Playbook ID: CR-023
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `efficiency_and_restraint/review_depth_alias.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
