---
title: "Tasks: shadcn visual upgrade"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: shadcn visual upgrade

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run `check-corpus.cjs --render` and record the baseline per-family assertion counts into `scratch/baseline.md`; run `node --check` on the checker. Evidence: `scratch/baseline.md`; `node --check` exit 0
- [x] T002 Measure every value in spec section 3 from the frozen copy under `../013-shadcn-reference-research/scratch/shadcn/` and write a value table with file and line cites into `scratch/measurements.md`. Evidence: `scratch/measurements.md`, 24 rows with frozen-file cites
- [x] T003 [P] Inventory which forms have an axis, bars, a time path, an area, a tooltip and more than one series; write the matrix into `scratch/inventory.md`. Evidence: `scratch/inventory.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the `legend` and `tooltip-card` assertions in `check-corpus.cjs`; prove each with a mutated copy under `scratch/` and record the exact failure line in `scratch/mutations.md`. Evidence: `check-corpus.cjs:1446` and `:1487`; `scratch/mutations.md` lines 13 and 14
- [x] T005 Retune `type-scale`, `radius`, `card-parts` and `interaction-hygiene` to the measured values, keeping every existing check and count. Evidence: card-parts 140 to 172, radius 70 to 102, type-scale 393 to 457, interaction-hygiene 140 to 140
- [x] T006 Move the shared style vocabulary in one template to the new system (card anatomy, ticks, grid, radius, gradient, tooltip card, legend chips), pass the gate, then carry it to the other 25 forms one at a time with the checker after each. Evidence: 26 templates changed; static gate `RESULT: PASSED` after each form (executor handback)
- [x] T007 Apply the single-series colour rule to cartesian forms and keep the emphasis mark; confirm every contrast gate still passes without a palette change. Evidence: `color-system.md` single-series rule, amended to the form's own system; palette diff empty
- [x] T008 Bring the four deliveries under `assets/examples/` to their templates; fix the gallery's per-frame scheme pin in `build-gallery.cjs` and regenerate `assets/gallery.html`. Evidence: six deliveries changed; `build-gallery.cjs` and every template now pin the scheme; `assets/gallery.html` regenerated
- [x] T009 Write the visual system into `references/template-contract.md` and the single-series rule into `references/color-system.md`; add `changelog/v1.3.0.0.md`; bump the version in `SKILL.md` and `README.md`. Evidence: `template-contract.md` "The shadcn visual register"; `color-system.md`; `changelog/v1.3.0.0.md`; `SKILL.md` and `README.md` at 1.3.0.0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 `check-corpus.cjs --render` prints `RESULT: PASSED` with zero errors and lists `legend` and `tooltip-card`; paste the family list into `implementation-summary.md`. Evidence: `--render` printed `RESULT: PASSED`, `Summary: errors: 0`, with `legend` and `tooltip-card` listed
- [x] T011 Compare per-family counts against `scratch/baseline.md`; no family fell; record the table. Evidence: no family fell; table in `implementation-summary.md`
- [x] T012 Regenerate `screenshots/` for every form and delivery in both schemes plus `gallery.png`; open the gallery capture and confirm the light column is light. Evidence: `rendered 36, failed 0`; `gallery.png` light column is light
- [x] T013 Independent review of three template captures against three shadcn examples of the same form, plus a diff review confirming no palette value, gate or phase 14 contract changed. Evidence: Sonnet review of the diff and captures recorded in `implementation-summary.md`; palette diff empty; phase 14 families unchanged
- [x] T014 `validate.sh <this folder> --strict` prints `RESULT: PASSED`; all packet docs reflect what shipped. Evidence: `validate.sh --strict` printed `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Static, mutation, render and visual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — spec.md sections 3 to 5.
- [x] CHK-002 [P0] Technical approach defined in plan.md — plan.md sections 1 to 3.
- [x] CHK-003 [P1] Dependencies identified and available — frozen copy and local Chrome available.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `node --check` exit 0; `script-parses` 67 assertions, 0 failures.
- [x] CHK-011 [P0] No console errors or warnings — render pass printed no console errors; `settled-render` 70 assertions, 0 failures.
- [x] CHK-012 [P1] Error handling implemented — both new families fail closed on their mutations.
- [x] CHK-013 [P1] Code follows project patterns — sentinel and assertion conventions followed.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — AC-001 to AC-009 Met.
- [x] CHK-021 [P0] Manual testing complete — captures read for daily-line, grouped-bars, stacked-area and the gallery.
- [x] CHK-022 [P1] Edge cases tested — narrow-viewport 105 assertions, 0 failures; empty-notice 96, 0 failures.
- [x] CHK-023 [P1] Error scenarios validated — exact failure lines in `scratch/mutations.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class — visual-contract work, checker-held.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep — `scratch/inventory.md` covers all 26 forms by part.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests — six deliveries, gallery builder, four references and the changelog reviewed.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases — N/A; local static assets only.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed — form by scheme by part matrix in `scratch/inventory.md`.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state — N/A; the checker reads local files only.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range — evidence is the working-tree diff committed with this packet.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — no secrets added.
- [x] CHK-031 [P0] Input validation implemented — both families reject missing or SVG-bound registers.
- [x] CHK-032 [P1] Auth/authz working correctly — N/A; local corpus.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — packet docs reflect the shipped scope and the one amendment.
- [x] CHK-041 [P1] Code comments adequate — checker comments state the durable why without packet identifiers.
- [x] CHK-042 [P2] README updated (if applicable) — `README.md` version and visual register updated.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — scratch holds baseline, measurements, inventory, mutations and the dispatch prompt.
- [x] CHK-051 [P1] scratch/ cleaned before completion — mutation copies removed; no output left outside the package.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-08
<!-- /ANCHOR:summary -->

---
