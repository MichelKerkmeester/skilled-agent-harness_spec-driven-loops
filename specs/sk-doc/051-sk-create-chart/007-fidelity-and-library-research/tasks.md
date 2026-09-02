---
title: "Tasks: Fidelity and library research for sk-create-chart"
description: "Ordered work for the renumbering, the ten-iteration research loop and the applied template improvements, with the verification each one owes."
trigger_phrases:
  - "chart fidelity tasks"
  - "chart research tasks"
  - "renumber tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Fidelity and library research for sk-create-chart

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

- [x] T001 Scaffold the phase folder and stage it immediately (specs/sk-doc/051-sk-create-chart/007-fidelity-and-library-research)
- [x] T002 Capture the baseline corpus check before any edit (.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs)
- [x] T003 Record the before-state grep for section numbering and for every citation of a numbered section
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Shift every numbered H2 up by one in the three reference overviews (references/catalog.md, references/color-system.md, references/template-contract.md)
- [x] T005 Update every citation that named a shifted section (references/catalog.md, manual-testing-playbook/**)
- [x] T006 Dispatch the ten-iteration research loop with convergence disabled (research/)
- [x] T007 Apply the template improvements the research proves and the contract allows (assets/templates/*.html)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Re-run the corpus check with `--render` from the final state and read the `RESULT:` line
- [x] T009 Re-run the section-number greps and confirm both the absence of `## 0.` and that every citation resolves
- [x] T010 Reconcile spec, plan, tasks, acceptance criteria and implementation summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Second read over the twelve unapplied items

Each item was re-decided against the template contract and the restraint ladder, then applied
or refused in writing. The research re-run is deliberately not in this phase.

- [x] T011 Capture the corpus check and the full rendered label list before any edit (scratchpad `validator-before.txt`, `labels-before.txt`)
- [x] T012 T2: add one number formatter per template and route every printed figure through it (assets/templates/*.html)
- [x] T013 T2: give each numeric ladder a decimal count derived from its own step, and fix the character-count width estimate the formatter breaks (assets/templates/progress-single.html)
- [x] T014 T3: break the mark at a missing reading in the three path builders, and report the count in the figure (daily-line, daily-range, stacked-area)
- [x] T015 T5: write the series-to-swatch mapping into the description of every form whose colours are only resolvable through a detached key (candlestick, grouped-bars, stacked-bars, stacked-area, waterfall)
- [x] T016 T6: give every asset file a pannable figure region and a drawing floor (assets/templates, assets/examples, assets/color)
- [x] T017 T7: write the numeric budget behind each gutter, thinning divisor and axis spacing as an author comment (bar-rows, distribution-strip, heat-matrix, parallel-axes, daily-line, stacked-area, calendar-grid)
- [x] T018 T8: add the missing ramp legend to heat-matrix, as five discrete steps rather than a gradient (assets/templates/heat-matrix.html)
- [x] T019 T10: refuse pattern fills in writing (references/color-system.md)
- [x] T020 C1: implement `narrow-viewport` as an assertion the check can make without a browser, and prove it can fail three ways (scripts/check-corpus.cjs)
- [x] T021 C2: state in the catalog that time labels arrive display-ready and numbers do not (references/catalog.md)
- [x] T022 C3: name the computed-value exception beside the contract's "never computes" sentence (references/template-contract.md)
- [x] T023 C4: print an in-figure notice when a form is given more than its documented shape (heat-matrix, scatter)
- [x] T024 C5: refuse the diverging system in writing, and name what would reopen it (references/color-system.md)
- [x] T025 Bump the packet version and write the changelog entry (SKILL.md, README.md, references/, scripts/README.md, changelog/v1.1.0.0.md)
- [x] T026 Re-run the corpus check with `--render` from the final state and read the `RESULT:` line
- [ ] T027 Re-run the library half of the research on an executor with live web search (blocked: out of scope for this pass, see goal.md)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`. T027 stays open: the upstream re-verification is a separate run and was excluded from this pass
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every touched template passes all sixteen corpus checks
- [x] CHK-011 [P0] No script in a touched template throws on open, proven by the render check
- [x] CHK-012 [P1] No template gained a remote dependency or a runtime fetch
- [x] CHK-013 [P1] Every touched template still follows the four-part card order and the palette-block rule
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] `check-corpus.cjs --render` run and its `RESULT:` line read
- [x] CHK-022 [P1] A render failure was classified as browser flake or as a chart drawing nothing before being acted on
- [x] CHK-023 [P1] The before-and-after greps for section numbering both recorded
- [x] CHK-024 [P0] Every behavioural change proved against a fixture that exercises it, not against demo data that never triggers it
- [x] CHK-025 [P1] The new `narrow-viewport` check shown to fail three ways and then restored
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The renumbering is classed `cross-consumer`: the section numbers have citing consumers outside the three files
- [x] CHK-FIX-002 [P0] Producer inventory completed by `grep -rn '^## [0-9]' references/`
- [x] CHK-FIX-003 [P0] Consumer inventory completed by `grep -rniE 'section [0-9]' .` over the whole mode, before and after
- [x] CHK-FIX-004 [P0] Not applicable. No security, path, parser or redaction surface is touched
- [x] CHK-FIX-005 [P1] The axes are the three reference files and the citing files, both enumerated in plan.md
- [x] CHK-FIX-006 [P1] Not applicable. Nothing here reads process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to the working-tree state, since this phase commits nothing
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Templates carry literal chart data and nothing else
- [x] CHK-031 [P0] Not applicable. A template takes no input at runtime
- [x] CHK-032 [P1] Not applicable. There is no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] No ephemeral artifact label entered any code comment
- [x] CHK-042 [P2] References README checked against the shifted numbering
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 18 | 18/18 |
| P2 Items | 6 | 6/6 |

**Verification Date**: 2026-09-03
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] Not applicable. Nothing here migrates
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] A touched template still opens with no build step and no network
- [x] CHK-111 [P2] Not applicable. There is no throughput target
- [x] CHK-112 [P2] Not applicable. There is no load to test
- [x] CHK-113 [P2] Not applicable. There is no benchmark surface
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback is a checkout of the affected file, documented in plan.md
- [x] CHK-121 [P0] Not applicable. There is no feature flag
- [x] CHK-122 [P1] Not applicable. Nothing here is deployed or monitored
- [x] CHK-123 [P1] The manual testing playbook already carries the runbook for this mode
- [x] CHK-124 [P2] Not applicable
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] The licensing constraint is stated in spec.md and bound into the research brief
- [x] CHK-131 [P1] Only MIT-class sources are permitted, and no code was taken from any of them
- [x] CHK-132 [P2] Not applicable. There is no web application surface
- [x] CHK-133 [P2] Not applicable. A template holds only the data its author pasted into it
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized
- [x] CHK-141 [P2] Not applicable. There is no API
- [x] CHK-142 [P2] The mode README and references README read correctly after the shift
- [x] CHK-143 [P2] The implementation summary carries what a later reader needs
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved | |
| Operator | Product Owner | [ ] Approved | |
| Corpus check | QA Lead | [x] Approved | 2026-09-02 |
<!-- /ANCHOR:sign-off -->
