---
title: "Implementation Plan: Phase 22: review-remediation"
description: "Fix the sweep/archive TOCTOU in mk-goal.js with a deterministic interleaving regression test, then reconcile packet statuses, refresh the audit dossier, correct parent narrative counts, and sync both feature catalogs."
trigger_phrases:
  - "goal plugin review remediation plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/022-review-remediation"
    last_updated_at: "2026-07-04T08:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Authored plan from spec and adjudicated review findings"
    next_safe_action: "Dispatch implementation to cli-opencode executor"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-022-review-remediation-20260704"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 22: review-remediation

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM plugin (`.opencode/plugins/mk-goal.js`) + packet markdown docs |
| **Framework** | None - flat plugin module |
| **Storage** | Flat JSON state files; no schema change |
| **Testing** | `node:test` subtests via `node --test` |

### Overview
One narrow concurrency fix plus a mechanical documentation sweep. The code fix closes the review's single confirmed runtime bug: sweep-initiated archives currently decide staleness outside the per-session mutation queue and never re-check inside it. Everything else is text reconciliation - status rows, dossier markers, narrative counts, catalog rows - verified by greps and a fresh full-suite run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted fix within the existing mutation-queue seam; no new abstraction. All line numbers below verified 2026-07-04 - re-locate via grep before editing, the file shifts between phases.

### Key Components
- **`sweepOrphanedActiveStates` (mk-goal.js:~1231)**: keeps its out-of-queue read as a cheap pre-filter, but the decision it produces becomes advisory. It passes the observed `updatedAtMs` (or the staleness threshold) into the archive call.
- **`archiveGoalStateFile` (mk-goal.js:~1205)**: gains a sweep-only re-validation path. Inside the enqueued operation, before `rename`, it re-reads the file's `updatedAtMs` and skips the archive when the file is no longer stale. Explicit archives (session.deleted handler, goal clear) pass no staleness option and remain unconditional. Implementation freedom: either an options flag (e.g. a staleness predicate/threshold) on `archiveGoalStateFile`, or a dedicated sweep-archive function that wraps the same enqueued body - whichever reads cleaner, provided the explicit-archive behavior is byte-identical.
- **Regression test (mk-goal-lifecycle.test.cjs)**: deterministic interleave via promise ordering, not timers: (1) write a goal state file with `updatedAtMs` older than the active-retention threshold (env overrides: MK_GOAL_STATE_ACTIVE_RETENTION_DAYS, MK_GOAL_STATE_SWEEP_INTERVAL_MS; inject `nowMs` via options); (2) block the session's mutation queue with a deferred mutator; (3) invoke the sweep so its out-of-queue read sees the stale file and its archive enqueues behind the deferred mutator; (4) resolve the mutator so it writes a fresh active goal; (5) await the sweep. Pre-fix: the fresh goal is archived (RED). Post-fix: the archive skips, the fresh goal survives (GREEN).

### Data Flow
No change to stored state shape or tool output. The only behavior change: a sweep-initiated archive becomes a no-op when the target was refreshed mid-sweep - which is the correctness fix itself.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sweepOrphanedActiveStates` (:~1231) | Decides staleness outside the queue, archives via enqueued rename | Pass staleness context into the archive; decision re-validated in-queue | Interleaving test GREEN; explicit-archive tests unchanged |
| `archiveGoalStateFile` (:~1205) | Unconditional enqueued rename | Sweep-only in-queue re-validation before rename | Same test; session.deleted/clear paths byte-identical |
| 8 child spec.md Status rows (009-speckit, 012, 015-019, 021) | Planned/Draft while impl-summary says Complete | Flip to Complete after verifying each impl-summary documents real shipped work | Status-drift grep reports zero disagreements |
| Parent `spec.md` phase-map + narrative | Stale statuses, "6-file"/"16-seam" counts, "(not cited)" annotation | Update rows and counts from fresh evidence | Grep for retired claims returns nothing |
| Audit dossier (`scratch/2026-07-03-four-reviewer-audit-findings.md`) | Presents F4/F5/DOC-2/e-2.2 as open | Refresh header + RESOLVED markers with current file:line evidence | Dossier grep shows RESOLVED markers; cited lines verified live |
| Both feature catalogs | Missing `speckit-goal-offer-contract.test.cjs`; divergent mk-goal-state descriptions | Add row to both; make descriptions identical | Grep both files for the filename; string-compare the two description cells |

Required inventories:
- Every `archiveGoalStateFile` call site (`rg -n "archiveGoalStateFile" .opencode/plugins/`) classified as sweep-initiated vs explicit before adding the re-validation, so no explicit path silently gains a staleness guard.
- Every phase folder's spec.md + implementation-summary.md Status pair enumerated fresh at implementation time (the authoring-time inventory is in spec.md REQ-002; re-verify, especially 020).
- Algorithm invariant: for every input where no concurrent write occurs between the sweep's read and its archive, behavior is unchanged; the skip fires only on the refreshed-mid-sweep interleave.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline
- [ ] Run the full plugin suite fresh (`node --test .opencode/plugins/tests/*.test.cjs`), paste output as the pre-fix baseline
- [ ] Inventory `archiveGoalStateFile` call sites and classify sweep-initiated vs explicit
- [ ] Re-verify the status-drift set with a fresh spec-vs-impl grep across all phase folders (including 020)

### Phase 2: Core Implementation
- [ ] REQ-001: write the deterministic interleaving test first; run it against current code and paste the RED failure
- [ ] REQ-001: implement the sweep-only in-queue re-validation; paste the GREEN run
- [ ] REQ-002: flip the verified-drifted spec.md Status rows; update the parent phase-map rows to match
- [ ] REQ-003: refresh the audit dossier (dated refresh note; RESOLVED markers with current file:line evidence for F4, F5, DOC-2, e-2.2)
- [ ] REQ-004: correct the parent spec.md narrative counts and drop the stale "(not cited)" annotation
- [ ] REQ-005: add the missing test row to both catalogs; align the mk-goal-state descriptions to one identical string

### Phase 3: Verification
- [ ] Fresh full-suite run; confirm zero regressions vs baseline plus the new passing regression test
- [ ] Status-drift grep across all phases reports zero disagreements
- [ ] Grep for retired narrative claims ("6-file", "16-seam", "(not cited)") returns nothing in the parent spec
- [ ] Catalog greps confirm REQ-005; syntax-check touched JS (`node --check`); comment hygiene + alignment drift checks on `mk-goal.js`
- [ ] Write `implementation-summary.md` with evidence; flip THIS phase's spec.md Status to Complete (do not recreate the drift this phase fixes)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression (new) | Sweep vs concurrent-write interleave (REQ-001) | `node:test`, deferred-promise queue control, env retention overrides |
| Regression (existing) | Full plugin suite incl. explicit-archive paths | `node --test .opencode/plugins/tests/*.test.cjs` |
| Static | Status-drift grep, retired-claim greps, catalog greps | `rg`/`grep` invariants per REQ |
| Manual | Dossier RESOLVED citations verified against live code lines | Direct read + comparison |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 009-021 landed | Internal | Complete | None - this phase reconciles their residue |
| Orchestrator metadata refresh (backfill-graph-metadata.js) | Internal, post-dispatch | Pending | Strict validation warns on stale generated metadata until run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any existing test fails post-fix, or the re-validation suppresses an explicit archive path
- **Procedure**: Targeted `git checkout` of the `mk-goal.js` hunk and the test file; doc edits are independently revertible per file
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:sequencing -->
## 8. SEQUENCING

Single phase, internally ordered: code fix with RED/GREEN proof first (highest risk), then the mechanical doc sweep (statuses -> dossier -> narrative -> catalogs), then verification. The orchestrator follows with generated-metadata refresh, the orphan-folder relocation, and strict validation across touched folders.
<!-- /ANCHOR:sequencing -->
