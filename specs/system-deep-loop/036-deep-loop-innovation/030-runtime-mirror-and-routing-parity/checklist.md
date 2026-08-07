---
title: "Verification Checklist: Make Runtime-Mirror and Routing Parity Gates Compare What Actually Differs"
description: "Verification checklist for 030-runtime-mirror-and-routing-parity: baseline-before-delta evidence, a negative test per confirmed finding, and independent adversarial verification."
trigger_phrases:
  - "runtime mirror parity"
  - "mirror sync verify ordering"
  - "registry compiler unresolved identity"
  - "codex agent parity coverage"
  - "deep loop 030 parity"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/030-runtime-mirror-and-routing-parity"
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
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Make Runtime-Mirror and Routing Parity Gates Compare What Actually Differs

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

- [ ] CHK-010 [P0] Load-bearing instruction set enumerated per mirrored agent
  - **Evidence**: Enumeration reviewed before order sensitivity is implemented
- [ ] CHK-011 [P1] OD-2 status recorded and REQ-008 gated on it
  - **Evidence**: Recorded status; REQ-008 marked deferred if unanswered
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-020 [P0] Mirror comparison is not a Set comparison
  - **Evidence**: Grep of the comparison implementation
- [ ] CHK-021 [P1] The Codex sandbox mode is derived, not hardcoded
  - **Evidence**: Grep for the literal mode string in `sync-agents.cjs` returns none
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

- [ ] CHK-030 [P0] A reordered load-bearing sequence fails the mirror gate
  - **Evidence**: The exact `F-028-04` probe, inverted
- [ ] CHK-031 [P0] A tool-surface difference fails the mirror gate
  - **Evidence**: Named test with a body-mandated tool absent from the allowlist
- [ ] CHK-032 [P0] A ghost packet or missing leaf fails compilation
  - **Evidence**: Named test with a `deep-ghost` packet
- [ ] CHK-033 [P1] The orphaned-alias vocabulary check is clean
  - **Evidence**: Vocabulary check output
- [ ] CHK-034 [P1] All three improvement modes remain distinct in a replay test
  - **Evidence**: Replay test output showing three distinct routes
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each of the 8 scoped findings has a finding class recorded (`CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED`) from T001
  - **Evidence**: T001 output table in `tasks.md` lists all 8 IDs with a classification and a cited probe
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for Set-based/unordered comparisons in mirror-checking code
  - **Evidence**: `rg -n "Set|includes|sort" .opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs` reviewed; no remaining unordered comparison over a load-bearing instruction sequence
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the hardcoded two-runtime capability matrices
  - **Evidence**: Every reader of `runtime-capabilities.json` and `review-mode-contract.yaml` enumerated, so the OD-2 reconciliation covers all of them, not just the two files directly edited
- [ ] CHK-FIX-004 [P0] The registry compiler has an adversarial case combining both identity failures in one probe
  - **Evidence**: Named test with a `deep-ghost` packet AND a missing leaf in the same probe; compilation fails and names which identity is unresolved
- [ ] CHK-FIX-005 [P1] The {8 findings} x {fixed, REFUTED, ALREADY-FIXED} matrix is listed before completion is claimed
  - **Evidence**: T001 classification table cross-tabulated against the scope table in `implementation-summary.md`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-007 [P1] Severity calibration carried into the spec and not re-escalated
  - **Evidence**: `spec.md` §2 contains the calibration block verbatim

- [ ] CHK-040 [P1] No generated mirror grants a write capability its source denies
  - **Evidence**: Sandbox mode derived from the deny list; generated body and setting agree
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-006 [P0] No evidence string cites a bare run count or raw line number
  - **Evidence**: Every evidence string carries a test name + suite digest + candidate SHA
- [ ] CHK-008 [P0] `validate.sh --strict` exits 0 for this child
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child> --strict` -> exit 0

- [ ] CHK-050 [P0] Exactly one ai-council writer authority is documented, and the leaf can execute it
  - **Evidence**: Agent definition and orchestrator agree; the leaf has the required tool surface
- [ ] CHK-051 [P1] Docs no longer instruct readers to reinterpret a wrong leaf identity
  - **Evidence**: `smart-routing.md` diff
- [ ] CHK-052 [P1] The OD-2 position is recorded and the shipped mirrors are covered either way
  - **Evidence**: Recorded position with the matrices reflecting it
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

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 0/16 |
| P1 Items | 13 | 0/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: not yet run
**Verified By**: not yet assigned
**Status**: Planned — no item may be marked `[x]` without a test name, a suite-content digest, and a candidate SHA.
<!-- /ANCHOR:summary -->
