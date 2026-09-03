---
title: "Tasks: A dark theme for the chart corpus"
description: "Ordered work for the contract amendment, the dark palette derivation, the checker extension and the twenty-nine second blocks, with the verification each one owes."
trigger_phrases:
  - "chart dark theme tasks"
  - "dark palette tasks"
  - "palette block amendment tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->
# Tasks: A dark theme for the chart corpus

<!-- SPECKIT_LEVEL: 3 -->

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

- [ ] T001 [B] Put the drafted contract amendment from spec section 12 to the operator, and record the answer in `goal.md` before anything else starts
- [ ] T002 Capture the baseline corpus check before any edit, and read its `RESULT:` line (.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs)
- [ ] T003 Record the before-state colour inventory with `grep -rn '#[0-9A-Fa-f]\{6\}' assets/ references/` (scratch/)
- [ ] T004 Confirm phase 002 is closed, so the light values the dark twin answers are final
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Amend the colour-system derivation rule to say when a hue may be re-chosen across a theme boundary (references/color-system.md)
- [ ] T006 Amend contract rule 4 from one palette block to one per theme, with a ceiling of two (references/template-contract.md)
- [ ] T007 Derive the dark chrome: surface, ink, muted and rule, with the rule as ink at an alpha rather than a solid grey (assets/color/palettes.json)
- [ ] T008 Derive the dark series and emphasis values for `neutral`, checking each against the dark surface by hand before the checker sees them (assets/color/palettes.json)
- [ ] T009 Derive the dark series and emphasis values for `ordered`, keeping the ramp monotonic against the dark ground (assets/color/palettes.json)
- [ ] T010 Derive the dark series and emphasis values for `categorical`, keeping the four hues separated in luminance so the set survives greyscale (assets/color/palettes.json)
- [ ] T011 Teach `palette-source` to compute every gate twice, once per surface, and to print the dark run as its own line (scripts/check-corpus.cjs)
- [ ] T012 Fix the ramp end the lightest-step gate tests, so it tests the end nearest that theme's own surface (scripts/check-corpus.cjs)
- [ ] T013 Teach `palette-block` to expect exactly two regions, each matched against its own projection in both directions (scripts/check-corpus.cjs)
- [ ] T014 Teach `colour-literals` that a value inside either region is allowed and a value outside both is not (scripts/check-corpus.cjs)
- [ ] T015 Prove the dark section can fail: mutate one dark value below its gate, mutate one template's dark block, and confirm the check reports each (scratch/)
- [ ] T016 Restore both mutations and confirm the check is green again (scratch/)
- [ ] T017 Paste the dark block into the three palette proof sheets first, since one of them is the skeleton every future template copies (assets/color/palette-sheet-*.html)
- [ ] T018 [P] Paste the dark block into the twenty chart forms, taking the exact text the check prints (assets/templates/*.html)
- [ ] T019 [P] Paste the dark block into the six family deliveries (assets/examples/*.html)
- [ ] T020 State the gate table per theme in the colour-system document, so a reader sees two runs rather than one (references/color-system.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T021 Re-run the corpus check with `--render` from the final state and read the `RESULT:` line
- [ ] T022 Confirm both gate lines report a nonzero assertion count and zero failures
- [ ] T023 Confirm `grep -c 'CHART_PALETTE_DARK:BEGIN'` returns 20 under templates, 6 under examples and 3 under color
- [ ] T024 Open one delivery in a browser with the operating system preference set to dark, and read it
- [ ] T025 Print the same delivery from the dark browser and confirm the light block paints, since the media query does not apply to print
- [ ] T026 Re-run the colour inventory grep and confirm no literal escaped a palette region
- [ ] T027 Run `hvr_scan.py` over every document in this folder and record zero hard blockers on each
- [ ] T028 Reconcile spec, plan, tasks, acceptance criteria and goal
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:architecture-tasks -->
## Phase 4: Architecture Tasks

- [ ] T029 Record ADR-001 as accepted or rejected once the dark values are derived and gated, since the re-hue rule is only proven when the values clear their gates
- [ ] T030 Record the operator's answer on the contract amendment as a decision, whichever way it goes, so a later reader sees the reasoning rather than the outcome alone
<!-- /ANCHOR:architecture-tasks -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
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
- [ ] CHK-003 [P0] The operator answered the contract amendment before any file changed
- [ ] CHK-004 [P1] Phase 002 closed, so the light palette is final
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every touched asset file passes all corpus checks
- [ ] CHK-011 [P0] No colour literal appears outside a palette region
- [ ] CHK-012 [P0] Every dark projection matches its source in both directions
- [ ] CHK-013 [P1] No file gained a remote dependency, a runtime fetch or a second style element
- [ ] CHK-014 [P1] The dark sentinel pair is used once per file, like the light one
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] `check-corpus.cjs --render` run and its `RESULT:` line read
- [ ] CHK-022 [P0] Both gate lines report zero failures, and neither reports zero assertions
- [ ] CHK-023 [P0] The dark section proved able to fail on a below-gate value and on a drifted block, then restored
- [ ] CHK-024 [P1] One delivery read on a dark system by eye
- [ ] CHK-025 [P1] The print path confirmed to paint the light block
- [ ] CHK-026 [P1] The ordered ramp confirmed monotonic on both grounds
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The dark theme is classed `cross-consumer`: the palette source has twenty-nine projections and one checker reading it
- [ ] CHK-FIX-002 [P0] Producer inventory completed by reading `palettes.json` for dark fields on chrome and on all three systems
- [ ] CHK-FIX-003 [P0] Consumer inventory completed by `grep -c 'CHART_PALETTE_DARK:BEGIN'` across `assets/`
- [ ] CHK-FIX-004 [P1] Not applicable. No security, path, parser or redaction surface is touched
- [ ] CHK-FIX-005 [P1] The axes are the palette source, the twenty-nine assets, the checker and two references, all enumerated in plan.md
- [ ] CHK-FIX-006 [P1] Nothing here reads process-wide state. The media query is the browser's own resolution
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the working-tree state, since this phase commits nothing
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Asset files carry literal chart data and colour values
- [ ] CHK-031 [P1] Not applicable. A template takes no input at runtime
- [ ] CHK-032 [P1] Not applicable. There is no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks synchronized
- [ ] CHK-041 [P1] No ephemeral artifact label entered any code comment
- [ ] CHK-042 [P1] Contract rule 4 and the colour-system derivation rule both state the new position rather than implying it
- [ ] CHK-043 [P1] The gate table appears per theme, so nobody reads one run as covering both
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P0] Both mutations from the failure proof restored, confirmed by a green run
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 17 | 0/17 |
| P2 Items | 0 | 0/0 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 recorded with a status once the dark values are gated
- [ ] CHK-101 [P0] The operator's answer on the contract amendment recorded as a decision, whichever way it went
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Not applicable. Nothing here migrates
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] A themed file still opens with no build step and no network
- [ ] CHK-111 [P2] Not applicable. There is no throughput target
- [ ] CHK-112 [P2] Not applicable. There is no load to test
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback is a checkout of the affected files, documented in plan.md
- [ ] CHK-121 [P1] Not applicable. There is no feature flag
- [ ] CHK-122 [P1] Not applicable. Nothing here is deployed or monitored
- [ ] CHK-123 [P1] The manual testing playbook covers reading a delivery on a dark system
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Nothing was copied from the vendored source. The construction was read and re-authored
- [ ] CHK-131 [P1] The accessibility floor holds on both grounds, computed rather than restated
- [ ] CHK-132 [P2] Not applicable. There is no web application surface
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P2] Not applicable. There is no API
- [ ] CHK-142 [P2] The mode README and references README read correctly after the amendment
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Contract amendment | [ ] Approved | |
| Operator | Technical Lead | [ ] Approved | |
| Corpus check | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
