---
title: "Decision Record: Phase 8: write-containment-scoping"
description: "Decisions taken without an operator while scoping write containment: how far the out-of-folder half of V24 goes, the split of package_skill.py to phase 016, and every worker and review call."
trigger_phrases:
  - "write containment scoping decision record"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/008-write-containment-scoping"
    last_updated_at: "2026-11-09T00:00:00Z"
    last_updated_by: "remediation-orchestrator-a"
    recent_action: "Closed the phase with every worker, review and adjudication recorded"
    next_safe_action: "Start phase 015"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "orchestrator-a-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 8: write-containment-scoping

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Record unowned out-of-folder writes, do not auto-move them

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation Orchestrator A (operator unavailable; goal G3 and G7 pre-authorize the call) |

---

<!-- ANCHOR:adr-001-context -->
### Context

V24 has two halves. The zips at the repository root were recorded and preserved, because containment keeps a new untracked file in place by design (`revertOutOfScopeViolations` reports it as `preserved_untracked`). The untracked `specs/001-test-feature/` left no record at all; a read-only investigation found no path, size or directory filter in the library that would skip it and could not confirm whether that iteration's scan saw the folder. The `package_skill.py` default that wrote the zips moved to phase 016 by the lead's ruling.

### Constraints

- This worktree is shared with another orchestrator whose workers create new files while deep loops run.
- A new untracked file at the repository root has no owner a lock can prove.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: keep unowned out-of-folder writes attributed and recorded, exclude only paths a live run's lock owns, and pin with a test that a new file in a new nested folder is recorded.

**How it works**: the library discovers live sibling runs from their locks and drops their folders from attribution. Everything else, the repository root included, is detected and recorded as before, and quarantine keeps a copy.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Record and pin** | No live work lost; the folder-miss path is covered by a test | A stray untracked file still sits in the tree until someone moves it | 8/10 |
| Move every new untracked out-of-scope file into quarantine | The tree returns to its starting state | Moves another writer's live file in a shared worktree; the zips came from a sibling run, so the wrong run would have moved them | 3/10 |

**Why this one**: the move option punishes the run that happens to look, which is the attribution bug V09 describes.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A live sibling's writes stop landing in this run's record.

**What it costs**:
- The folder-miss cause stays UNKNOWN; if the nested-folder test passes, the miss was not in the library.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A write the library cannot see goes unrecorded again | M | The nested-folder test fails if the library stops seeing one |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | V09 and V24 are verified P1s |
| 2 | **Beyond Local Maxima?** | PASS | The move option was weighed and its cost named |
| 3 | **Sufficient?** | PASS | Attribution and recording are both covered by tests |
| 4 | **Fits Goal?** | PASS | Goal G3 fixes verified findings |
| 5 | **Open Horizons?** | PASS | A later opt-in move can build on the same record |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `write-containment.ts`, `fanout-run.cjs`, `write-containment.vitest.ts`.

**How to roll back**: revert the phase commit.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:run-decisions -->
## Run Decisions Log

| ID | Decision | Why | Evidence |
|----|----------|-----|----------|
| D-01 | Fix only the containment half of V24; the `package_skill.py` default moved to phase 016 | sk-doc is orchestrator B's area | lead message: "(a). Fix only the write-containment side in 008" |
| D-02 | Plan step 5 inline fallback; skip the continuity writer; commit with the lead-approved remint bypass | Same constraints as phase 007 D-01 to D-03 | phase 007 decision record |
| D-03 | Read-only Luna investigation before planning | The folder miss had no stated cause; the plan needed the callers and the untracked-file behavior first | worker report: callers, `preserved_untracked`, no filter found, cause UNKNOWN |
| D-04 | Take the runtime baseline from the phase 007 final gate instead of a fresh run | The tree in this area is unchanged since that gate; it ran minutes before | 174 files, 2880 passed, 8 skipped, exit 0 |
| D-05 | Workers: cli-codex `gpt-6-luna` high fast for the read-only investigation, the discovery move, the nested-folder test and two fix rounds; cli-pi `opencode-go/deepseek-v4.1-flash` max for the test assertion correction and the cross-family review | Goal G4 tiers | worker logs in the orchestrator scratchpad |
| D-06 | Keep the default preserve mode and pin it: a new untracked out-of-scope file is recorded in the event and the state log and returned as an advisory, not a fatal violation | The first nested-folder test expected a fatal violation and failed; the library recorded both files in the event, and preserve mode routes untracked paths to advisories by design | test run: `violations []`, event names both files; corrected test passes |
| D-07 | The `specs/001-test-feature/` miss stays UNKNOWN | The library records such a folder in a hermetic repo. One host-level candidate: the global git excludes file ignores a top-level `/specs`, and containment cannot see an ignored write; this repository re-includes `specs` in `.gitignore`, so the candidate does not explain the miss here | `git check-ignore -v` in a bare temp repo: `.gitignore_global:11:/specs`; in this repository: not ignored |
| D-08 | Fix a typecheck regression phase 007 introduced in `deep-research-ledger-types.ts` | Optional `focus` and `answeredQuestions` on a `JsonObject` interface fail TS2411; phase 007's gate ran vitest, which does not typecheck, so it passed. The type is now a union of the persisted shapes | `npm run typecheck` before: 2 errors at `:186-187`; after: exit 0, no output |
| D-09 | Load `isStaleLoopLock` with `createRequire(import.meta.url)('./loop-lock.ts')` | The library is loaded natively by Node from `.cjs` and YAML heredocs, which needs the `.ts` specifier, while tsc rejects a `.ts` specifier in a static import; a `.js` specifier broke 7 fan-out-driven tests | typecheck exit 0; 318 tests pass across containment, ledger schema and fan-out |
| D-10 | Review adjudication (DeepSeek reviewer, verdict CONDITIONAL, 3 P1 and 4 P2): fixed the typecheck import, the lost WHY comments, the run-dir resolution (deepest existing ancestor) and the four-field lock mapping; accepted three | Accepted: a leaf could plant a live lock to exempt a sibling folder, which fan-out already allowed and needs a live foreign pid; discovery runs on every scope resolution, bounded at 2000 directories and unmeasured; a sibling that releases its lock mid-iteration is re-attributed, which under preserve mode is advisory noise. All three are recorded as known limitations | reviewer report; known limitations in `implementation-summary.md` |
<!-- /ANCHOR:run-decisions -->
