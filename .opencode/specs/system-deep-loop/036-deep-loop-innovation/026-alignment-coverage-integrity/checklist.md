---
title: "Verification Checklist: Make Alignment Coverage, Seal State and Lane Identity Provable"
description: "Verification checklist for 026-alignment-coverage-integrity: baseline-before-delta evidence, a negative test per confirmed finding, and independent adversarial verification."
trigger_phrases:
  - "alignment coverage integrity"
  - "coverage fails open corpus"
  - "lane identity injective normalizer"
  - "unearned coverage credit alignment"
  - "deep loop 026 alignment"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/026-alignment-coverage-integrity"
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

# Verification Checklist: Make Alignment Coverage, Seal State and Lane Identity Provable

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

- [ ] CHK-010 [P0] The 5 pre-existing command-contract failures named and excluded from this child's delta
  - **Evidence**: `021` RED baseline citation plus the named failure list
- [ ] CHK-011 [P0] ADRs derived for `F-SOL-04`, `F-SOL-06`, `F-SOL-07` before any code targets them
  - **Evidence**: Three ADRs present with derived recommended actions
- [ ] CHK-012 [P0] `024`'s closed record parser confirmed available before the slice-binding layer starts
  - **Evidence**: Named parser export cited from `024`'s hand-off note
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-020 [P0] One normalizer module; neither reader normalizes locally
  - **Evidence**: Grep for `.trim()` and whitespace-collapse regexes in both readers returns only the shared module
- [ ] CHK-021 [P0] This child does not restructure leaf publication (that is `024`'s)
  - **Evidence**: Diff review of `leaf-artifact-writer.ts`: additive slice-binding only
- [ ] CHK-022 [P1] No ephemeral artifact labels embedded in shipped code comments
  - **Evidence**: Comment hygiene review of the diff
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

- [ ] CHK-030 [P0] Shared-normalizer differential test green across the full adversarial fixture set
  - **Evidence**: Duplicate IDs, orphan lanes, repeated whitespace, `paths` versus `globs`, comma-containing values
- [ ] CHK-031 [P0] Four corpus states distinguishable, none defaulting to full coverage
  - **Evidence**: One named test per state
- [ ] CHK-032 [P0] Unearned credit earns zero; out-of-slice claims are excluded
  - **Evidence**: Named tests for both cases
- [ ] CHK-033 [P0] The `F-SOL-04` over-tightening regression is fixed and covered
  - **Evidence**: Honest-corpus-lane test that the in-run fix rejects and this child accepts
- [ ] CHK-034 [P0] Lane identity injective across scope types, separators, orderings and adapters
  - **Evidence**: Named tests for `paths` versus `globs`, comma values, and the two `sk-design` adapters
- [ ] CHK-035 [P1] A count-only record equal to corpus size does not strand the loop
  - **Evidence**: Named test
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each of the 20 scoped findings has a finding class recorded (`CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED`) from T001, including the 15 already carrying a review `CONFIRMED` mark re-confirmed at HEAD rather than inherited
  - **Evidence**: T001 output table in `tasks.md` lists all 20 IDs with a classification and a cited probe
- [ ] CHK-FIX-002 [P0] Producer inventory completed for every fail-open coverage-ratio site (`discovered>0 ? checked/discovered : 1.0` and its analogues)
  - **Evidence**: `rg -n "checked.*discovered|discovered.*checked" .opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs` enumerated and every site reconciled to the four-state model
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for `laneKey`/lane identity and for the `sealed` flag
  - **Evidence**: `rg -n "laneKey|laneId|sealed" .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs .opencode/skills/system-deep-loop/deep-alignment/scripts .opencode/skills/system-deep-loop/commands/deep/assets` and every caller reconciled to the shared normalizer and seal gate
- [ ] CHK-FIX-004 [P0] Adversarial case: a corpus fixture combining a duplicate lane ID with a comma-containing scope value in the same case
  - **Evidence**: Named test exercising both conditions together, not just each condition separately
- [ ] CHK-FIX-005 [P1] The {20 findings} x {fix, refute, already-fixed, moved} matrix is listed before completion is claimed
  - **Evidence**: T001 classification table cross-tabulated against the reopen/fix set in `implementation-summary.md`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-007 [P1] Severity calibration carried into the spec and not re-escalated
  - **Evidence**: `spec.md` §2 contains the calibration block verbatim

- [ ] CHK-040 [P1] The adapter cannot be told it passed by a caller-supplied string
  - **Evidence**: Named test: no measurements means no clean result
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-006 [P0] No evidence string cites a bare run count or raw line number
  - **Evidence**: Every evidence string carries a test name + suite digest + candidate SHA
- [ ] CHK-008 [P0] `validate.sh --strict` exits 0 for this child
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child> --strict` -> exit 0

- [ ] CHK-050 [P1] Alignment registered against its actual convergence backend
  - **Evidence**: `mode-registry.json` and hub docs updated; registry-versus-implementation check
- [ ] CHK-051 [P1] The rekeying consequence of the lane-identity change is documented
  - **Evidence**: Landing note stating that in-flight runs need a fresh start
- [ ] CHK-052 [P1] The generalization intent for evidence binding is recorded
  - **Evidence**: ADR-003 states the fan-out fabrication mode it also addresses
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
  - **Evidence**: ADR-001..ADR-003 present with context, alternatives, and consequences
- [ ] CHK-101 [P1] Every ADR carries a terminal status
  - **Evidence**: No ADR remains `Proposed` at close
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
  - **Evidence**: Each ADR alternatives table names why the rejected option loses

- [ ] CHK-103 [P1] Three derived ADRs carry the reasoning for actions the register did not supply
  - **Evidence**: ADRs for `F-SOL-04`, `F-SOL-06`, `F-SOL-07`
- [ ] CHK-104 [P1] The `024` file-ownership boundary is respected and documented
  - **Evidence**: Ownership note in this child and in WS1 `MANIFEST.md`
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Behavior and Regression Verification

- [ ] CHK-110 [P0] Alignment script suite delta reported against the `021` RED baseline
  - **Evidence**: Before/after with the 5 pre-existing failures excluded and named
- [ ] CHK-111 [P0] `runtime` suite delta reported against the `021` baseline
  - **Evidence**: Before/after discovered, pass, fail, skip, exit code
- [ ] CHK-112 [P1] Normalizer performance on the largest real corpus recorded
  - **Evidence**: Wall-clock normalization time, so a later regression is visible
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Landing Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and rehearsed
  - **Evidence**: `plan.md` §7 and the L2 enhanced-rollback section; rehearsal recorded
- [ ] CHK-121 [P1] Completion metadata reconciled across spec/plan/tasks/implementation-summary
  - **Evidence**: No doc claims a completion state another doc contradicts
- [ ] CHK-122 [P0] The alignment-lane gate for `014` is recorded with its evidence
  - **Evidence**: Gate citation naming the differential test and the unearned-credit test
- [ ] CHK-123 [P1] `031` sequencing on `reduce-alignment-state.cjs` recorded
  - **Evidence**: Ordering note in this child and in WS1 `MANIFEST.md`
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [ ] CHK-130 [P1] No fixture, corpus sample, or evidence citation embeds a credential, token, or absolute machine-local path
  - **Evidence**: Manifest/fixture contents reviewed; only repo-relative tracked paths present
- [ ] CHK-131 [P1] The evidence-bound credit mechanism reads only leaf-authored artifacts already in the repo, no network access
  - **Evidence**: `leaf-artifact-writer.ts` diff reviewed; no fetch/network calls introduced
- [ ] CHK-132 [P2] The severity calibration block (`spec.md` §2) is carried verbatim into every child that cites it
  - **Evidence**: Grep for the calibration text across sibling children confirms verbatim reuse where cited
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [ ] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized at close
  - **Evidence**: Cross-read confirms no doc claims a completion state another doc contradicts
- [ ] CHK-141 [P1] `decision-record.md` records ADR-001 through ADR-003, plus ADR-004/005/006 for the three derived findings, in terms sibling children can cite without re-deriving them
  - **Evidence**: `decision-record.md` ADRs reviewed for citability by `022`-`032`, in particular `031`'s sequenced reducer work
- [ ] CHK-142 [P2] The rekeying consequence of the lane-identity change is stated once and referenced, not repeated inconsistently across docs
  - **Evidence**: Landing note cross-checked against CHK-051
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 25 | 0/25 |
| P1 Items | 22 | 0/22 |
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
| Packet owner | ADR-001..ADR-006 acceptance, including the three findings-register-derived ADRs | [ ] Approved | |
| Independent verifier | REQ-U04 adversarial pass over the reopened evidence set | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
