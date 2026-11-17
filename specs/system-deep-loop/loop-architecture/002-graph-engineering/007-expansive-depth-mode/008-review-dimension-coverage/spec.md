---
title: "Feature Specification: Close the out-of-contract review dimension gap (D10)"
description: "A reviewDimensions entry outside the four canonical names can never be marked covered, so the clean review stop and the review pivot become unreachable. The workflow forbids such entries only in prose. This phase supports custom dimensions in the reducer, the option the operator chose."
trigger_phrases:
  - "review dimension coverage"
  - "custom review dimensions"
  - "slice h d10"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Close the out-of-contract review dimension gap (D10)

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned. Operator decision recorded in `decision-record.md` (support custom dimensions, 2026-11-17) |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | None. This slice ships in any order with the other defect slices. |
| **Successor** | `../011-review-frontier-mode/spec.md`, which depends on this slice because the operator chose to support custom dimensions |
| **Source** | Parent `research/research.md` §6, §12 item 7, §13 row D10, §18 items 1 and 4, §20 Slice H |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The review reducer's `buildDimensionCoverage` (`runtime/scripts/reduce-state.cjs:1223-1250`) seeds and marks only the four `REQUIRED_DIMENSIONS` keys, while `convergence.cjs:1541-1556` counts every configured `reviewDimensions` entry as missing until covered. A config with any other name therefore never reaches `all_dimensions_clean`, the review pivot (which fires only on that reason, `divergent-review-pivot.ts:338-340`) is dead, and the pivot seeds a permanent `unswept-dimension` that can never close. The workflow forbids such names only through a prose line the orchestrating model executes (`deep-review.yaml:654`); no code checks it.

### Purpose
A configured custom dimension is covered like any canonical one, so no review run can silently lose its clean stop.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run from `.skilled/skills/system-deep-loop` (the YAML from the repository root).
```text
$ rg -n "^const REQUIRED_DIMENSIONS" runtime/scripts/reduce-state.cjs
24:const REQUIRED_DIMENSIONS = ['correctness', 'security', 'traceability', 'maintainability'];
$ rg -n "missingDimensions:" runtime/scripts/convergence.cjs
1556:    missingDimensions: dimensions.filter((dimension) => coverage[dimension] !== true),
$ rg -n "Every element MUST be one of the four" .skilled/commands/deep/assets/deep-review.yaml
654:          Every element MUST be one of the four canonical dimension names.
```
The reducer knows four names; convergence checks every configured name against that four-key map; the only guard is a prose line.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record the operator's choice, support custom dimensions, in `decision-record.md`.
- Build `dimensionCoverage` from the configured list, and make Next Focus, the dashboard and the strategy rendering iterate that list.
- Add a custom dimension test case.

### Out of Scope
- The review frontier (`../011-review-frontier-mode/`). It consumes this slice's configured-list coverage.
- Changing the four canonical names or their coverage threshold.
- The D5 Next Focus hijack in the same review chain. That is Slice D.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modify | Seed `buildDimensionCoverage` (:1223-1250) and the consumers at :2173, :2178, :2185, :2272 and :2301 from the configured list |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modify | Relax the four-name rule at :654 to allow configured custom names |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/review-depth-convergence.vitest.ts` | Modify | Add the custom dimension case |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | Modify | Add the custom dimension reducer case |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The operator's choice is recorded before any code changes. | `decision-record.md` ADR-001 shows `Accepted` and names support, with one Operator Decisions row. |
| REQ-003 | A configured custom dimension can be covered. | After an iteration record with `dimensions: ["performance"]`, `registry.dimensionCoverage.performance` is `true`, `missingDimensions` excludes it, and a stop-path fixture reaches `all_dimensions_clean`. |
| REQ-004 | Default four-dimension runs do not change. | `review-depth-convergence`, `review-stop-path-replay` and `deep-review-state-reducer` pass unchanged on their existing fixtures. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The review pivot can fire on a custom-dimension run. | A new case in `runtime/tests/integration/divergent-pivot.vitest.ts` (no review-pivot suite exists today) with a covered custom dimension accepts the `all_dimensions_clean` trigger and seeds no `unswept-dimension` for it. |
| REQ-006 | The workflow text matches the code. | `deep-review.yaml:654` names configured custom dimensions as allowed. `rg -n 'canonical dimension' .skilled/commands/deep/assets/deep-review.yaml` shows the new wording. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The custom dimension case passes in `review-depth-convergence.vitest.ts`.
- **SC-002**: The REQ-004 suites pass with no fixture edits.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Operator decision on parent §12 item 7 | No code task can start until ADR-001 is Accepted | ADR-001 is Accepted (support) |
| Dependency | Slice K (`../011-review-frontier-mode/`) | K depends on this slice landing first | ADR-001 records the dependency so 011's plan can cite it |
| Risk | The reducer's four-name lists are used in five places, and one missed site keeps a custom dimension invisible | Low-Med | Grep every `REQUIRED_DIMENSIONS` use in `reduce-state.cjs` before and after; the stop-path fixture fails if one is missed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Answered 2026-11-17: the operator chose support. See `decision-record.md` ADR-001.
<!-- /ANCHOR:questions -->

---
