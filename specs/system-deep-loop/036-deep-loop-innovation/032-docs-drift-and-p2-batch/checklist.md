---
title: "Verification Checklist: Batch the P2 Backlog and the Three Doc-Contract P1s"
description: "Verification checklist for 032-docs-drift-and-p2-batch: baseline-before-delta evidence, a negative test per confirmed finding, and independent adversarial verification."
trigger_phrases:
  - "docs drift p2 batch"
  - "registry roster drift readme"
  - "derive counts from registry"
  - "p2 backlog deep loop"
  - "deep loop 032 docs"
importance_tier: "normal"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/032-docs-drift-and-p2-batch"
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

# Verification Checklist: Batch the P2 Backlog and the Three Doc-Contract P1s

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

- [ ] CHK-010 [P0] Four merge groups collapsed into single work units with all IDs still mapped
  - **Evidence**: Merge-group table with the collapsed work unit per group
- [ ] CHK-011 [P0] Authoritative source named for each duplicated fact
  - **Evidence**: Source list; every other mention marked as a link target
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-020 [P0] No duplicated fact is fixed in two places instead of being single-sourced
  - **Evidence**: Grep for the duplicated roster strings returns exactly one authoritative statement each
- [ ] CHK-021 [P1] Lane B adopts `027`'s validator rather than patching the legacy gates locally
  - **Evidence**: Diff shows the shared import, not a local reimplementation
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

- [ ] CHK-030 [P0] The drift check fails against a deliberately mismatched roster
  - **Evidence**: Named negative run
- [ ] CHK-031 [P1] The folder-versus-index check fails on a missing report entry
  - **Evidence**: Named negative run
- [ ] CHK-032 [P1] A hostile-locale determinism test produces stable policy digests
  - **Evidence**: Named test across two collations
- [ ] CHK-033 [P1] Unknown top-level keys and malformed rollback-window rows are rejected in the legacy gates
  - **Evidence**: Named tests, parity with the newer modes
- [ ] CHK-034 [P1] A run persists convergence snapshots and accumulates a baseline
  - **Evidence**: Recorded run with the snapshot files present
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each of the 29 scoped findings has a finding class recorded (`CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED`) from T001, and the four merge groups are collapsed into single work units with every ID still mapped
  - **Evidence**: T001 output table in `tasks.md` lists all 29 IDs with a classification and a cited probe; T002 shows the four merge groups collapsed
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for every duplicated roster fact (family, lane, adapter, backend-kind, scenario-count strings)
  - **Evidence**: `rg -n "four (families|lanes)|five families|three lanes" .opencode/skills/system-deep-loop --glob "*.md"` reviewed and every hit resolved to exactly one authoritative statement
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for every document, script, and asset that reads or displays the affected rosters
  - **Evidence**: `spec.md` §3 Files to Change table cross-checked against a repo-wide grep for each roster string; no consumer left un-enumerated
- [ ] CHK-FIX-004 [P0] The registry-derived drift check has an adversarial case: a roster entry added to the registry with no document update
  - **Evidence**: Negative test run: a deliberately mismatched roster makes the check fail, not warn-and-continue
- [ ] CHK-FIX-005 [P1] The {29 findings} x {fixed, `REFUTED`, `ALREADY-FIXED`} matrix, with the four merge groups shown as collapsed single work units, is listed before completion is claimed
  - **Evidence**: T001 classification table cross-tabulated against the T002 merge-group collapse in `tasks.md`
- [ ] CHK-FIX-006 [P1] Lane B's mode-gate fix adopts `027`'s shared strict validator against the same file `027` touches, not a local reimplementation
  - **Evidence**: Diff of `mode-gate.ts` shows the shared validator import, not a re-derived permissiveness check
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-007 [P1] Severity calibration carried into the spec and not re-escalated
  - **Evidence**: `spec.md` §2 contains the calibration block verbatim

- [ ] CHK-040 [P2] No documentation change exposes an internal path or credential-shaped value
  - **Evidence**: Diff review of the touched documents
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-006 [P0] No evidence string cites a bare run count or raw line number
  - **Evidence**: Every evidence string carries a test name + suite digest + candidate SHA
- [ ] CHK-008 [P0] `validate.sh --strict` exits 0 for this child
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child> --strict` -> exit 0

- [ ] CHK-050 [P0] Zero broken local links across the touched documents
  - **Evidence**: Link scan output
- [ ] CHK-051 [P0] Help text is generated from the real tables, not retyped
  - **Evidence**: Help output compared against the tables
- [ ] CHK-052 [P1] The council completion resolution (gate or advisory) is recorded
  - **Evidence**: Recorded decision with its effect on existing callers
- [ ] CHK-053 [P1] The Level-2-to-Level-3 promotion question is resolved or explicitly deferred
  - **Evidence**: Recorded answer on whether the drift check became real tooling
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
| P1 Items | 14 | 0/14 |
| P2 Items | 1 | 0/1 |

**Verification Date**: not yet run
**Verified By**: not yet assigned
**Status**: Planned — no item may be marked `[x]` without a test name, a suite-content digest, and a candidate SHA.
<!-- /ANCHOR:summary -->
