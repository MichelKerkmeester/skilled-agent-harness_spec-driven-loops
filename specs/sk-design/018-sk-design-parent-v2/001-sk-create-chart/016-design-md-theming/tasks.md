---
title: "Tasks: DESIGN.md theming"
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
# Tasks: DESIGN.md theming

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

- [x] T001 Read `design-md-format.md` sections 3 to 5 and the four bundled example Style References; record the headings and columns the parser keys on in `scratch/parse-contract.md`. Evidence: `scratch/parse-contract.md` records the three v3 heading/table contracts and all four fixtures.
- [x] T002 Read `check-corpus.cjs` palette-source families, `canonicalBlock`, `canonicalDarkBlock` and `checkPaletteSource`; record the gate names and the exact byte-equality path in `scratch/checker-notes.md`. Evidence: `scratch/checker-notes.md` lists all six gate keys and the separate design-md branch.
- [x] T003 [P] Confirm phase 15 is committed (`git log -1 -- .opencode/skills/sk-design/sk-design-chart` is the phase 15 commit) before editing any template-derived file. Evidence: `416827fd10 feat(sk-design): bring the chart corpus to the shadcn visual register and plan DESIGN.md theming`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write `scripts/apply-design-md.cjs`: parser, mapper, gate, writer, CLI (`--forms`, `--all`, `--out`, `--scheme`, `--tokens`); print one mapping line per role and end with `RESULT: PASSED` or `RESULT: FAILED`. Evidence: exact Stripe run wrote two files and printed 18 mapping lines followed by `RESULT: PASSED`.
- [x] T005 Add the `design-md` branch to `check-corpus.cjs`: provenance comment with hash, inline gates in both themes, every other family unchanged; add `--extra <dir>`; prove with a mutated hash and a failing inline ratio recorded in `scratch/mutations.md`. Evidence: `design-md` 156 assertions passed in the extra scan; two design-md mutation failures are recorded.
- [x] T006 Generate the proof delivery from the stripe example into `assets/examples/`; run the static and render gates on the corpus. Evidence: `assets/examples/grouped-bars-stripe-style.html` is present; static printed `RESULT: PASSED`; render was attempted and returned the sandbox's 82 no-document failures.
- [x] T007 Write `references/design-md-theming.md`; update `template-contract.md`, `color-system.md`, `scripts/README.md`; add `changelog/v1.4.0.0.md`; bump the version in `SKILL.md` and `README.md`. Evidence: all named references are present and carry the 1.4.0.0 documentation update.
- [x] T008 Add the activation trigger, keyword triggers and routing branch to `SKILL.md`; rewrite the boundary sentence so extraction goes to `sk-design-md-generator` and application stays here. Evidence: `SKILL.md` contains the local DESIGN.md, style-reference and measured-site triggers and the applicator route.
- [x] T009 Write `scripts/tests/apply-design-md.test.cjs`: the four examples parse and derive, one refusal, one byte-identity diff; run with `node --test`. Evidence: `node --test scripts/tests/` passed 4 tests with 0 failures.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 `node --test` passes; `check-corpus.cjs` and `--render` print `RESULT: PASSED` with the proof delivery; `--extra` prints `RESULT: PASSED` on a themed output directory. Evidence: tests, static and extra runs print `RESULT: PASSED`; render was run but Chrome returned no document and printed `RESULT: FAILED` with `Summary: errors: 82`.
- [x] T011 Stock forms still fail on a one-byte palette edit (byte equality intact); record the failure line. Evidence: the restored mutation and exact `FAIL [palette-block]` line are in `scratch/mutations.md`.
- [x] T012 Independent review of the mapping on two example Style References and of the checker branch for any weakening. Evidence: a Sonnet review of the diff returned FAIL on three findings; its determinism finding was refuted on a stable tree (three separate processes produced byte-identical output, recorded in `implementation-summary.md`), its meta-tag finding was fixed (themed copies now declare `design-md` in the meta and the checker exception was removed), and the delivery was renamed to the spec's path with the chromatic threshold documented
- [x] T013 `validate.sh <this folder> --strict` prints `RESULT: PASSED`; all packet docs reflect what shipped. Evidence: final metadata regeneration and strict validation are recorded after the close-out edits.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] Tests, static, render and byte-identity verification passed — render remains unverified because Chrome aborts before returning a document in this sandbox.
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

- [x] CHK-001 [P0] Requirements documented in spec.md — sections 3 to 5 define the scope, requirements and success criteria.
- [x] CHK-002 [P0] Technical approach defined in plan.md — parser, gate, checker branch, proof delivery and verification are specified.
- [x] CHK-003 [P1] Dependencies identified and available — the v3 format, four local fixtures, palette source and phase 15 commit were read.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `node --check` passed for the applicator, checker and shared gate module.
- [x] CHK-011 [P0] No console errors or warnings — static and extra corpus checks report 0 failures; the render failure is the browser no-document condition recorded separately.
- [x] CHK-012 [P1] Error handling implemented — malformed sections, URLs, failed gates, malformed provenance and inline gate failures refuse or report without weakening stock checks.
- [x] CHK-013 [P1] Code follows project patterns — CommonJS scripts use strict mode, shared exports, deterministic local I/O and node:test coverage.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met — AC-006 remains Unmet pending a Chrome-capable render run.
- [ ] CHK-021 [P0] Manual testing complete — static files were inspected, but render interaction walks could not run in this sandbox.
- [x] CHK-022 [P1] Edge cases tested — missing section, URL refusal path, light-only dark fallback, radius ceiling and outside-directory checks are covered or observed.
- [x] CHK-023 [P1] Error scenarios validated — the three exact mutation failures are in `scratch/mutations.md` and the refusal fixture exits 1 without creating output.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class — parser, gate, provenance, byte-identity and render-environment findings are named in the packet evidence.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep — the four fixture families and both palette themes are covered by the tests and checker.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests — the shared gate module is required by both scripts and the outside scan runs file-level consumers.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases — local-only input, URL refusal, output-root guard, no-write refusal and `--extra` are covered.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed — fixture by theme by role and internal versus extra corpus counts are recorded in the packet evidence.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state — no process-wide mutable state is used; each CLI run reads local inputs and gates afresh.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range — phase 15 is pinned to `416827fd10` and final commands are recorded by path.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — no secrets or credentials were added.
- [x] CHK-031 [P0] Input validation implemented — local path, URL, CLI, section, form, output-root and provenance inputs are validated.
- [x] CHK-032 [P1] Auth/authz working correctly — not applicable to local static files; no network or account boundary is introduced.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — packet scope stays frozen and the render limitation is reflected in acceptance, tasks, goal and summary.
- [x] CHK-041 [P1] Code comments adequate — comments explain durable checker and palette-boundary reasons without packet identifiers.
- [x] CHK-042 [P2] README updated (if applicable) — package README and scripts README carry the 1.4.0.0 route and option.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — themed proof outputs and mutation notes are under the packet scratch directory.
- [x] CHK-051 [P1] scratch/ cleaned before completion — mutation targets were restored and no temporary output remains outside the required scratch proof files.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 10/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-08; render remains environment-blocked and is tracked as AC-006 Unmet.
<!-- /ANCHOR:summary -->

---
