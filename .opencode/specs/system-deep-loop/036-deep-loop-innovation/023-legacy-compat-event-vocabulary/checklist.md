---
title: "Verification Checklist: Extend the Compatibility Upcasters to the Six Live Event Vocabularies"
description: "Verification checklist for 023-legacy-compat-event-vocabulary: baseline-before-delta evidence, a negative test per confirmed finding, and independent adversarial verification."
trigger_phrases:
  - "legacy compat event vocabulary"
  - "blocker 2 upcaster coverage"
  - "unknown legacy record migration"
  - "live event vocabulary upcaster"
  - "deep loop 023 compat"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/023-legacy-compat-event-vocabulary"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the verification checklist from the WS1 phase-tree proposal"
    next_safe_action: "Run checklist items after phase execution completes"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

# Verification Checklist: Extend the Compatibility Upcasters to the Six Live Event Vocabularies

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

Evidence strings must name a **test name + suite-content digest + candidate SHA**. A bare run count is not evidence: reconciling exactly that failure is what child `021` exists for.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] All scoped finding IDs classified by T001 before any edit
  - **Evidence**: T001 table in `tasks.md`: every ID carries `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` plus a cited probe
- [ ] CHK-002 [P0] Pre-edit baseline captured for every runner this child touches
  - **Evidence**: Recorded discovered-test count, pass/fail/skip, and exit code per runner, at a named SHA

- [ ] CHK-010 [P0] Legacy-state census complete before any mapping is written
  - **Evidence**: Census artifact enumerating logs, modes, and must-survive status
- [ ] CHK-011 [P0] A real captured log exists per mode, or the substitution is recorded
  - **Evidence**: Per-fixture provenance: producing command and run identifier
- [ ] CHK-012 [P0] `F-022-02` `manualStop` sub-claim recorded as REFUTED
  - **Evidence**: T001 record citing the grep showing the symbol absent at the cited location
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-020 [P0] Every live stem in all six vocabularies carries a map-or-pin disposition
  - **Evidence**: Six stem-to-disposition tables with no unlisted stem
- [ ] CHK-021 [P1] Every pin carries a rationale checked against the census
  - **Evidence**: Pin rationale list cross-referenced with the census
- [ ] CHK-022 [P1] Skill-benchmark delegation matches the agent and model variant pattern
  - **Evidence**: Side-by-side comparison plus a delegation test
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-003 [P0] Every confirmed finding has a negative test that is red pre-fix and green post-fix
  - **Evidence**: Named test per finding, with the red run and the green run both recorded
- [ ] CHK-004 [P0] Whole gate re-run at close and reported as a delta against the baseline
  - **Evidence**: Post-edit run of every runner, delta table vs CHK-002
- [ ] CHK-005 [P1] Independent adversarial verification pass by a different actor than the builder
  - **Evidence**: Verification record naming the actor and the defects found (or explicitly none)

- [ ] CHK-030 [P0] Zero-blocked replay of a captured real log per mode
  - **Evidence**: Six replay runs with zero `blocked:unknown-legacy-record`
- [ ] CHK-031 [P0] Multi-slice alignment lane does not complete after slice one
  - **Evidence**: Named test with the multi-slice fixture
- [ ] CHK-032 [P0] An unmapped stem blocks loudly with the stem named
  - **Evidence**: Negative test asserting the block message contains the stem
- [ ] CHK-033 [P1] A live-shaped record carrying only `sessionId` migrates
  - **Evidence**: Named test against the live alignment config shape
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each of the 6 scoped findings has a finding class recorded (`CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED`) from T001, including the `F-022-02` `manualStop` correction
  - **Evidence**: T001 output table in `tasks.md` lists all 6 IDs with a classification and a cited probe
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for unmapped and pinned stems across all six vocabularies
  - **Evidence**: `rg -n "case |PINNED|pinned" .opencode/skills/system-deep-loop/runtime/lib/*-ledger-schema/legacy-compatibility.ts` enumerated per mode against the live stem set
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for `blocked:unknown-legacy-record` producers
  - **Evidence**: `rg -n "unknown-legacy-record" .opencode/skills/system-deep-loop/runtime` reviewed; every remaining hit accounted for by a pin or a still-open finding
- [ ] CHK-FIX-004 [P0] The two structural adversarial cases are both tested: the council nested heartbeat shape and the multi-slice alignment lane stream
  - **Evidence**: Named tests for T012 and T016 both present and demonstrated red pre-fix, green post-fix
- [ ] CHK-FIX-005 [P1] The {6 findings} x {mapped, pinned, delegated} disposition matrix is listed before completion is claimed
  - **Evidence**: T014 disposition table cross-tabulated against the census in `implementation-summary.md`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-007 [P1] Severity calibration carried into the spec and not re-escalated
  - **Evidence**: `spec.md` §2 contains the calibration block verbatim

- [ ] CHK-040 [P1] Captured fixtures carry no credential-shaped values or operator-identifying data
  - **Evidence**: Fixture scrub review with the scrub rule recorded
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-006 [P0] No evidence string cites a bare run count or raw line number
  - **Evidence**: Every evidence string carries a test name + suite digest + candidate SHA
- [ ] CHK-008 [P0] `validate.sh --strict` exits 0 for this child
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child> --strict` -> exit 0

- [ ] CHK-050 [P0] The operator ruling (write the six vocabularies) is recorded as Accepted, not as an open fork
  - **Evidence**: ADR-001 status Accepted with the ruling stated
- [ ] CHK-051 [P1] Fixture provenance documented so a later reader can recapture
  - **Evidence**: Per-fixture command and run identifier recorded in the child
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-090 [P1] Temp files confined to `scratch/`
  - **Evidence**: No temp file outside `scratch/`; `git status` clean for out-of-scope paths
- [ ] CHK-091 [P1] Work ran in an isolated worktree, so no concurrent session's files were touched
  - **Evidence**: Worktree path recorded; `git status` in the main checkout unchanged across the run
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in `decision-record.md`
  - **Evidence**: ADR-001..ADR-002 present with context, alternatives, and consequences
- [ ] CHK-101 [P1] Every ADR carries a terminal status
  - **Evidence**: No ADR remains `Proposed` at close
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
  - **Evidence**: Each ADR alternatives table names why the rejected option loses

- [ ] CHK-103 [P1] ADR-002 real-capture rule documented with the synthetic-fixture failure it prevents
  - **Evidence**: ADR-002 context and alternatives
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Behavior and Regression Verification

- [ ] CHK-110 [P0] Whole `runtime` suite re-run and reported as a delta against the `021` baseline
  - **Evidence**: Before/after discovered, pass, fail, skip, exit code
- [ ] CHK-111 [P1] Replay performance on the largest captured log recorded
  - **Evidence**: Wall-clock replay time per mode, so a later regression is visible
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Landing Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and rehearsed
  - **Evidence**: `plan.md` §7 and the L2 enhanced-rollback section; rehearsal recorded
- [ ] CHK-121 [P1] Completion metadata reconciled across spec/plan/tasks/implementation-summary
  - **Evidence**: No doc claims a completion state another doc contradicts
- [ ] CHK-122 [P0] Blocker 2 discharge recorded in the `014` unblock table with per-mode replay evidence
  - **Evidence**: Per-mode zero-blocked citation in the unblock record
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [ ] CHK-130 [P1] No fixture or census artifact embeds an absolute machine-local path
  - **Evidence**: Grep for `/Users/` or `/home/` across captured fixtures and the census artifact returns none
- [ ] CHK-131 [P1] Per-fixture provenance (producing command and run identifier) is present for all six captured logs, not just a subset
  - **Evidence**: All six fixtures reviewed; each carries a provenance record
- [ ] CHK-132 [P2] The severity calibration block (`spec.md` §2) is carried verbatim into every child that cites it
  - **Evidence**: Grep for the calibration text across `022`-`032` confirms verbatim reuse where cited
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [ ] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized at close
  - **Evidence**: Cross-read confirms no doc claims a completion state another doc contradicts
- [ ] CHK-141 [P1] `decision-record.md` records ADR-001 and ADR-002 in terms the sibling children can cite without re-deriving them
  - **Evidence**: `decision-record.md` ADRs reviewed for citability by `022` and `024`-`032`
- [ ] CHK-142 [P2] ADR-003 per-stem dispositions are recorded as they are made, each cross-referenced against the census entry it was checked against
  - **Evidence**: `decision-record.md` reviewed once dispositions land; no pin lacks a cited census row
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 22 | 0/22 |
| P1 Items | 19 | 0/19 |
| P2 Items | 2 | 0/2 |

**Verification Date**: not yet run
**Verified By**: not yet assigned
**Status**: Planned — no item may be marked `[x]` without a test name, a suite-content digest, and a candidate SHA.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Independent verifier | REQ-U04 adversarial pass over fixture provenance and pin rationales | [ ] Approved | |
| Packet owner | ADR-003 per-stem map-or-pin dispositions, checked against the census | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
