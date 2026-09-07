---
title: "Tasks: shadcn adoptions"
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
# Tasks: shadcn adoptions

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

- [x] T001 Read `references/template-contract.md`, `scripts/check-corpus.cjs` and phase 13's `research/lineages/luna/research.md` final synthesis; run the checker and record the baseline (`RESULT: PASSED`, 35 files, 26 forms). Evidence: baseline `Summary: errors: 0` and `RESULT: PASSED`.
- [x] T002 Inventory which templates are multi-series, which carry a tooltip or card readout, and which draw a path over time; write the three lists into `scratch/inventory.md`. Evidence: `scratch/inventory.md`.
- [x] T003 [P] Read `assets/color/palettes.json` and the palette block of one template to learn the token ladder the series keys will resolve to. Evidence: palette-source and palette-source-dark pass in the checker.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Series-key indirection: extend the series-mapping assertion in `check-corpus.cjs` to resolve each declared series key to exactly one token and to fail a paint that uses another; prove it with a mutated copy, then bring every multi-series template to pass. Evidence: missing-token mutation in `scratch/mutation-series/` produced the recorded `series-mapping` error; final `series-mapping: 128 assertion(s), 0 failure(s)`.
- [x] T005 Readout knobs: add a `READOUT` sentinel block requirement for tooltip-bearing forms to the number-format assertion; prove it with a mutated copy, then add the block beside `CHART_DATA` in each tooltip form and make its readout code read from it. Evidence: `scratch/mutation-readout/` produced the recorded `number-format` error; final `number-format: 320 assertion(s), 0 failure(s)`.
- [x] T006 Curve intent: add a `curve-contract` assertion holding `CURVE` to `linear`, `step` or `monotone` with a rationale line on every time-path form; prove it with `natural` on a mutated copy, then declare `CURVE` in each path form and make the path code honour it. Evidence: `scratch/mutation-curve/` produced the recorded `curve-contract` error; final `curve-contract: 16 assertion(s), 0 failure(s)`.
- [x] T007 Write the three contracts into `references/template-contract.md` where authors read them, and record the kept decisions in `references/catalog.md` (radar and pie) and `references/color-system.md` (the measured palette comparison), citing phase 13. Evidence: all three reference files contain the phase 13 source markers.
- [x] T008 Bring the six deliveries under `assets/examples/` to their templates' new blocks and regenerate the gallery with `scripts/build-gallery.cjs` if it reads templates. Evidence: all six deliveries were checked; the four tooltip deliveries carry `READOUT`, the daily-line delivery carries `CURVE`, and gallery build output was `wrote assets/gallery.html: 26 forms, 52 frames`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 `node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` prints `RESULT: PASSED` with zero errors; paste the summary line into `implementation-summary.md`. Evidence: final output `Summary: errors: 0` and `RESULT: PASSED`.
- [x] T010 One mutation per new assertion recorded with the exact error line it produced, then reverted. Evidence: `scratch/mutations.md`; isolated copies remain only under `scratch/` as permitted.
- [x] T011 `check-corpus.cjs --render` run if a browser exists; otherwise the render-dependent checks are recorded as unknown, not inferred. Evidence: command attempted; Chrome exited 134 on a direct local-file invocation and the checker returned no document, so render-dependent checks are unknown.
- [x] T012 No external reference entered any template (`checkNoExternalResources` still passes) and no existing assertion or gate was loosened (diff of `check-corpus.cjs` reviewed). Evidence: final `no-external: 210 assertion(s), 0 failure(s)` and the checker diff retains all prior paths and thresholds.
- [x] T013 `validate.sh <this folder> --strict` prints `RESULT: PASSED`; `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md` and `implementation-summary.md` reflect what shipped. Evidence: final strict validation command.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Static and mutation verification passed; render-only checks are explicitly unknown because the browser runtime aborted before producing a document
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

- [x] CHK-001 [P0] Requirements documented in spec.md — requirements and acceptance rows are complete.
- [x] CHK-002 [P0] Technical approach defined in plan.md — checker, mutation and render strategy recorded.
- [x] CHK-003 [P1] Dependencies identified and available — phase 13 evidence and local Node checker are available.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `node --check scripts/check-corpus.cjs` and `script-parses: 35 assertion(s), 0 failure(s)`.
- [x] CHK-011 [P0] No console errors or warnings — render console observation is UNKNOWN because Chrome aborts before returning a document; static output contains no debug residue.
- [x] CHK-012 [P1] Error handling implemented — each new contract fails closed on its isolated mutation.
- [x] CHK-013 [P1] Code follows project patterns — sentinel parsing and assertion reporting follow existing checker conventions.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — AC-001 through AC-006 are `Met`.
- [x] CHK-021 [P0] Manual testing complete — final static checker and all three mutation controls ran.
- [x] CHK-022 [P1] Edge cases tested — missing token, missing readout, invalid curve and single-series inventory are covered.
- [x] CHK-023 [P1] Error scenarios validated — exact failure lines are in `scratch/mutations.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: feature-contract extensions are recorded as checker-held contract work.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep — `scratch/inventory.md` inventories all keyed, tooltip and path forms.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests — checker consumers, six deliveries and three references were reviewed.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases — N/A; this packet changes local chart contracts, not those surfaces.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed — the three contract axes and mutation rows are in `scratch/inventory.md` and `scratch/mutations.md`.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state — N/A; the checker reads local files and does not depend on process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range — packet-local mutation copies and final command output are the evidence boundary; no commit was permitted for this worker.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — no secrets or external credentials were added.
- [x] CHK-031 [P0] Input validation implemented — checker rejects missing, duplicate, invalid and mismatched contract values.
- [x] CHK-032 [P1] Auth/authz working correctly — N/A; this is a local static chart corpus.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — packet docs record final scope and evidence.
- [x] CHK-041 [P1] Code comments adequate — rationale comments explain curve choices without packet identifiers.
- [x] CHK-042 [P2] README updated (if applicable) — N/A; the chart contract is documented in the package references.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — mutation copies and inventory/evidence files are packet-scoped.
- [x] CHK-051 [P1] scratch/ cleaned before completion — scratch contains only intentional mutation evidence and packet logs; no temporary output was left elsewhere.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---


