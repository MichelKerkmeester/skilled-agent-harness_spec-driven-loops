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

- [ ] T001 Read `design-md-format.md` sections 3 to 5 and the four bundled example Style References; record the headings and columns the parser keys on in `scratch/parse-contract.md`
- [ ] T002 Read `check-corpus.cjs` palette-source families, `canonicalBlock`, `canonicalDarkBlock` and `checkPaletteSource`; record the gate names and the exact byte-equality path in `scratch/checker-notes.md`
- [ ] T003 [P] Confirm phase 15 is committed (`git log -1 -- .opencode/skills/sk-design/sk-design-chart` is the phase 15 commit) before editing any template-derived file
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Write `scripts/apply-design-md.cjs`: parser, mapper, gate, writer, CLI (`--forms`, `--all`, `--out`, `--scheme`, `--tokens`); print one mapping line per role and end with `RESULT: PASSED` or `RESULT: FAILED`
- [ ] T005 Add the `design-md` branch to `check-corpus.cjs`: provenance comment with hash, inline gates in both themes, every other family unchanged; add `--extra <dir>`; prove with a mutated hash and a failing inline ratio recorded in `scratch/mutations.md`
- [ ] T006 Generate the proof delivery from the stripe example into `assets/examples/`; run the static and render gates on the corpus
- [ ] T007 Write `references/design-md-theming.md`; update `template-contract.md`, `color-system.md`, `scripts/README.md`; add `changelog/v1.4.0.0.md`; bump the version in `SKILL.md` and `README.md`
- [ ] T008 Add the activation trigger, keyword triggers and routing branch to `SKILL.md`; rewrite the boundary sentence so extraction goes to `sk-design-md-generator` and application stays here
- [ ] T009 Write `scripts/tests/apply-design-md.test.cjs`: the four examples parse and derive, one refusal, one byte-identity diff; run with `node --test`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 `node --test` passes; `check-corpus.cjs` and `--render` print `RESULT: PASSED` with the proof delivery; `--extra` prints `RESULT: PASSED` on a themed output directory
- [ ] T011 Stock forms still fail on a one-byte palette edit (byte equality intact); record the failure line
- [ ] T012 Independent review of the mapping on two example Style References and of the checker branch for any weakening
- [ ] T013 `validate.sh <this folder> --strict` prints `RESULT: PASSED`; all packet docs reflect what shipped
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Tests, static, render and byte-identity verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->

---
