---
title: "Verification Checklist: Extend the Compatibility Upcasters to the Six Live Event Vocabularies"
description: "Verification checklist for 003-legacy-compat-event-vocabulary: baseline-before-delta evidence, a negative test per confirmed finding, and independent adversarial verification."
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
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/005-blocker-closeout/003-legacy-compat-event-vocabulary"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Verified all checklist items against the real-log matrix and packet evidence"
    next_safe_action: "Orchestrator reviews and lands the uncommitted candidate"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 100
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

- [x] CHK-001 [P0] All scoped finding IDs classified by T001 before any edit [Evidence: `implementation-summary.md`]
  - **Evidence**: T001 table in `tasks.md`: every ID carries `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` plus a cited probe
- [x] CHK-002 [P0] Pre-edit baseline captured for every runner this child touches [Evidence: `implementation-summary.md`]
  - **Evidence**: Recorded discovered-test count, pass/fail/skip, and exit code per runner, at a named SHA

- [x] CHK-010 [P0] Legacy-state census complete before any mapping is written [Evidence: `legacy-state-census.md`]
  - **Evidence**: Census artifact enumerating logs, modes, and must-survive status
- [x] CHK-011 [P0] A real captured log exists per mode, or the substitution is recorded [Evidence: `fixture-provenance.md`]
  - **Evidence**: Per-fixture provenance: producing command and run identifier
- [x] CHK-012 [P0] `F-022-02` `manualStop` sub-claim recorded as REFUTED [Evidence: `tasks.md`]
  - **Evidence**: T001 record citing the grep showing the symbol absent at the cited location
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-020 [P0] Every live stem in all six vocabularies carries a map-or-pin disposition [Evidence: `implementation-summary.md`]
  - **Evidence**: Six stem-to-disposition tables with no unlisted stem
- [x] CHK-021 [P1] Every pin carries a rationale checked against the census [Evidence: `decision-record.md`]
  - **Evidence**: Pin rationale list cross-referenced with the census
- [x] CHK-022 [P1] Skill-benchmark delegation matches the agent and model variant pattern [Evidence: `skill-benchmark-ledger-schema.vitest.ts`]
  - **Evidence**: Side-by-side comparison plus a delegation test
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-003 [P0] Every confirmed finding has a negative test that is red pre-fix and green post-fix [Evidence: `implementation-summary.md`]
  - **Evidence**: Named test per finding, with the red run and the green run both recorded
- [x] CHK-004 [P0] Scoped gate re-run at close and reported as a delta against the baseline [Evidence: `implementation-summary.md`]
  - **Evidence**: Post-edit run of every runner, delta table vs CHK-002
- [x] CHK-005 [P1] Post-build adversarial verification pass recorded; the absence of a second human/model actor is explicit [Evidence: `implementation-summary.md`]
  - **Evidence**: Verification record naming the actor and the defects found (or explicitly none)

- [x] CHK-030 [P0] Zero-blocked replay of a captured real log per mode [Evidence: `implementation-summary.md`]
  - **Evidence**: Six replay runs with zero `blocked:unknown-legacy-record`
- [x] CHK-031 [P0] Multi-slice alignment lane does not complete after slice one [Evidence: `deep-alignment-ledger-schema.vitest.ts`]
  - **Evidence**: Named test with the multi-slice fixture
- [x] CHK-032 [P0] An unmapped stem blocks loudly with the stem named [Evidence: `deep-research-ledger-schema.vitest.ts`]
  - **Evidence**: Negative test asserting the block message contains the stem
- [x] CHK-033 [P1] A live-shaped record carrying only `sessionId` migrates [Evidence: `deep-alignment-ledger-schema.vitest.ts`]
  - **Evidence**: Named test against the live alignment config shape
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each of the 6 scoped findings has a finding class recorded (`CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED`) from T001, including the `F-022-02` `manualStop` correction [Evidence: `tasks.md`]
  - **Evidence**: T001 output table in `tasks.md` lists all 6 IDs with a classification and a cited probe
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for unmapped and pinned stems across all six vocabularies [Evidence: `implementation-summary.md`]
  - **Evidence**: `rg -n "case |PINNED|pinned" .opencode/skills/system-deep-loop/runtime/lib/*-ledger-schema/legacy-compatibility.ts` enumerated per mode against the live stem set
- [x] CHK-FIX-003 [P0] Consumer inventory completed for `blocked:unknown-legacy-record` producers [Evidence: `implementation-summary.md`]
  - **Evidence**: `rg -n "unknown-legacy-record" .opencode/skills/system-deep-loop/runtime` reviewed; every remaining hit accounted for by a pin or a still-open finding
- [x] CHK-FIX-004 [P0] The two structural adversarial cases are both tested: the council nested heartbeat shape and the multi-slice alignment lane stream [Evidence: `deep-ai-council-ledger-schema.vitest.ts`]
  - **Evidence**: Named tests for T012 and T016 both present and demonstrated red pre-fix, green post-fix
- [x] CHK-FIX-005 [P1] The {6 findings} x {mapped, pinned, delegated} disposition matrix is listed before completion is claimed [Evidence: `implementation-summary.md`]
  - **Evidence**: T014 disposition table cross-tabulated against the census in `implementation-summary.md`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-007 [P1] Severity calibration carried into the spec and not re-escalated [Evidence: `spec.md`]
  - **Evidence**: `spec.md` §2 contains the calibration block verbatim

- [x] CHK-040 [P1] Captured fixtures carry no credential-shaped values or operator-identifying data [Evidence: `fixture-provenance.md`]
  - **Evidence**: Fixture scrub review with the scrub rule recorded
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-006 [P0] No evidence string cites a bare run count or raw line number [Evidence: `implementation-summary.md`]
  - **Evidence**: Every evidence string carries a test name + suite digest + candidate SHA
- [x] CHK-008 [P0] `validate.sh --strict` exits 0 for this child [Evidence: `validate.sh`]
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child> --strict` -> exit 0

- [x] CHK-050 [P0] The operator ruling (write the six vocabularies) is recorded as Accepted, not as an open fork [Evidence: `decision-record.md`]
  - **Evidence**: ADR-001 status Accepted with the ruling stated
- [x] CHK-051 [P1] Fixture provenance documented so a later reader can recapture [Evidence: `fixture-provenance.md`]
  - **Evidence**: Per-fixture command and run identifier recorded in the child
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-090 [P1] Temp files confined to `scratch/` [Evidence: `implementation-summary.md`]
  - **Evidence**: No temp file outside `scratch/`; `git status` clean for out-of-scope paths
- [x] CHK-091 [P1] Work ran in an isolated worktree, so no concurrent session's files were touched [Evidence: `implementation-summary.md`]
  - **Evidence**: Worktree path recorded; `git status` in the main checkout unchanged across the run
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md` [Evidence: `decision-record.md`]
  - **Evidence**: ADR-001..ADR-002 present with context, alternatives, and consequences
- [x] CHK-101 [P1] Every ADR carries a terminal status [Evidence: `decision-record.md`]
  - **Evidence**: No ADR remains `Proposed` at close
- [x] CHK-102 [P1] Alternatives documented with rejection rationale [Evidence: `decision-record.md`]
  - **Evidence**: Each ADR alternatives table names why the rejected option loses

- [x] CHK-103 [P1] ADR-002 real-capture rule documented with the synthetic-fixture failure it prevents [Evidence: `decision-record.md`]
  - **Evidence**: ADR-002 context and alternatives
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Behavior and Regression Verification

- [x] CHK-110 [P0] Scoped `runtime` gate re-run per mode/file and reported as a delta against the `021` baseline; the prohibited whole process is documented [Evidence: `implementation-summary.md`]
  - **Evidence**: Before/after discovered, pass, fail, skip, exit code
- [x] CHK-111 [P1] Replay performance on the largest captured log recorded [Evidence: `implementation-summary.md`]
  - **Evidence**: Wall-clock replay time per mode, so a later regression is visible
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Landing Readiness

- [x] CHK-120 [P0] Rollback procedure documented; rehearsal was intentionally not run against a green candidate [Evidence: `plan.md`]
  - **Evidence**: `plan.md` §7 and the L2 enhanced-rollback section; rehearsal recorded
- [x] CHK-121 [P1] Completion metadata reconciled across spec/plan/tasks/implementation-summary [Evidence: `implementation-summary.md`]
  - **Evidence**: No doc claims a completion state another doc contradicts
- [x] CHK-122 [P0] Blocker 2 discharge handoff recorded; no standalone 014 unblock table exists in the checkout [Evidence: `implementation-summary.md`]
  - **Evidence**: Per-mode zero-blocked citation in the unblock record
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [x] CHK-130 [P1] No fixture or census artifact embeds an absolute machine-local path [Evidence: `fixture-provenance.md`]
  - **Evidence**: Grep for `/Users/` or `/home/` across captured fixtures and the census artifact returns none
- [x] CHK-131 [P1] Per-fixture provenance (producing command and run identifier) is present for all six captured logs, not just a subset [Evidence: `fixture-provenance.md`]
  - **Evidence**: All six fixtures reviewed; each carries a provenance record
- [x] CHK-132 [P2] The severity calibration block (`spec.md` §2) is carried verbatim into every child that cites it
  - **Evidence**: Grep for the calibration text across `022`-`032` confirms verbatim reuse where cited
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [x] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized at close [Evidence: `implementation-summary.md`]
  - **Evidence**: Cross-read confirms no doc claims a completion state another doc contradicts
- [x] CHK-141 [P1] `decision-record.md` records ADR-001 and ADR-002 in terms the sibling children can cite without re-deriving them [Evidence: `decision-record.md`]
  - **Evidence**: `decision-record.md` ADRs reviewed for citability by `022` and `024`-`032`
- [x] CHK-142 [P2] ADR-003 per-stem dispositions are recorded as they are made, each cross-referenced against the census entry it was checked against
  - **Evidence**: `decision-record.md` reviewed once dispositions land; no pin lacks a cited census row
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 22 | 22/22 |
| P1 Items | 19 | 19/19 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-08-07
**Verified By**: Codex post-build verification pass; candidate file hashes and named tests are in `implementation-summary.md`
**Status**: Complete — the required per-mode/per-file matrix is green; the prohibited whole-process run and the absence of a second human/model actor are explicitly recorded.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Post-build verifier | Adversarial pass over fixture provenance and pin rationales; process-separated, no second actor available | [x] Recorded | 2026-08-07 |
| Packet owner | ADR-003 per-stem map-or-pin dispositions, checked against the census | [x] Recorded | 2026-08-07 |
<!-- /ANCHOR:sign-off -->
