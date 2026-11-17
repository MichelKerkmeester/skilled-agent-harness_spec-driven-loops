---
title: "Implementation Plan: Close the out-of-contract review dimension gap (D10)"
description: "Build review dimension coverage from the configured list so custom dimensions work, as the operator decided on 2026-11-17. Default four-dimension runs stay unchanged."
trigger_phrases:
  - "review dimension coverage plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Close the out-of-contract review dimension gap (D10)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS Node scripts (`convergence.cjs`, `reduce-state.cjs`) and the review workflow YAML |
| **Framework** | system-deep-loop review loop: reducer, convergence script, divergent review pivot |
| **Storage** | `deep-review-config.json` and the review findings registry (JSON) |
| **Testing** | Vitest, run from `.skilled/skills/system-deep-loop/runtime` with `npm test -- <file>` |

### Overview
The operator chose to support custom dimensions (`decision-record.md` ADR-001, 2026-11-17). The plan replaces the reducer's fixed four-name iteration with the configured list, defaulting to the four when the config has none, and relaxes the workflow's prose rule. A custom dimension case proves it; the existing suites prove default runs did not move.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `decision-record.md` ADR-001 is `Accepted` with support named
- [ ] `rg -n "REQUIRED_DIMENSIONS" .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` still lists the sites at :24, :1215, :1225, :1246, :2173, :2178, :2185, :2272, :2301 and :2763
- [ ] The REQ-004 suites pass on the unchanged tree (baseline captured)

### Definition of Done
- [ ] Every P0 requirement in `spec.md` is met
- [ ] `npm test -- tests/integration/review-depth-convergence.vitest.ts tests/integration/review-stop-path-replay.vitest.ts tests/unit/deep-review-state-reducer.vitest.ts` passes with the new case
- [ ] The workflow line at `deep-review.yaml:654` matches the code (REQ-006)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Config-driven coverage keys.

### Key Components
- **Convergence reader** (`convergence.cjs:1541`): unchanged. It counts every configured name as missing until the coverage map marks it covered, which the reducer change now makes possible.
- **Review reducer** (`reduce-state.cjs`): seeds `buildDimensionCoverage` from the configured list and routes the strategy rendering (:2173, :2178), both Next Focus fallbacks (:2185, :2272) and the dashboard rows (:2301) through the same list.
- **Workflow init** (`deep-review.yaml:654`): relaxes the four-name prose rule to allow configured custom names.

### Data Flow
Init writes `reviewDimensions` into the config. Each iteration record lists the dimensions it addressed. The reducer projects `dimensionCoverage` into the registry, convergence reads the configured list and the coverage map to compute `missingDimensions`, and the review pivot reads both to seed unswept dimensions. The change makes the coverage map's keys match the configured list.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the operator's decision in `decision-record.md` and captures the REQ-004 baseline. Implementation edits `reduce-state.cjs` and `deep-review.yaml`. Verification runs the custom dimension case, the review-pivot case and the REQ-004 suites. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Proving tests from parent `research.md` §20 Slice H: the review reducer suite (`deep-review-state-reducer.vitest.ts`) and `review-depth-convergence.vitest.ts`, plus one custom dimension case. `review-stop-path-replay.vitest.ts` guards default runs. A review-pivot case is added to `divergent-pivot.vitest.ts`, because no review-pivot suite exists today.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The operator decision on parent §12 item 7 is recorded (ADR-001 Accepted, support). No other slice must land first. Slice K (`../011-review-frontier-mode/`) depends on this slice.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a contract-compliant review run fails the new check, or its registry differs from the baseline. Revert the slice's commit; the change does not alter a stored format that older code cannot read.
<!-- /ANCHOR:rollback -->

---
