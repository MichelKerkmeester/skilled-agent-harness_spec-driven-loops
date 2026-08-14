---
title: "Feature Specification: fanout containment sibling lineage scope"
description: "Stop the fan-out write-containment guard from reverting sibling lineages' artifacts: under concurrency a sibling's concurrent writes are unattributable to the leaf that trips the guard, and reverting them destroys completed research runs."
trigger_phrases:
  - "fanout containment sibling scope"
  - "containment reverted sibling lineage"
  - "write containment concurrency bug"
  - "lineage artifacts deleted by containment"
  - "042 fanout containment"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-write-containment-hardening/002-fanout-containment-sibling"
    last_updated_at: "2026-07-27T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Scoped fan-out containment away from sibling lineages"
    next_safe_action: "Re-run the research fan-out now that siblings are protected"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-042-fanout-containment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: fanout containment sibling lineage scope

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-deep-loop/036-deep-loop-innovation/003-write-containment-hardening |
| **Predecessor** | `001-cli-codex-write-containment` |
| **Successor** | `003-write-containment-concurrent-safety` |
| **Handoff Criteria** | A leaf tripping containment reverts only its own out-of-scope writes; sibling lineage artifacts survive, proven by regression test |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The fan-out worker calls the write-containment guard with `artifactDir` set to the single lineage's own directory, so every sibling lineage's directory is out of scope. The pre-dispatch baseline is captured when the leaf starts, before concurrent siblings have written anything. When a leaf writes outside its directory, the guard therefore classifies **every file its siblings produced since dispatch** as that leaf's violation and reverts it — restoring tracked files from HEAD and deleting untracked ones.

This is not theoretical. On a three-lane research fan-out, one `cli-codex` lineage wrote to 16 repository paths; the guard reverted 55 paths, of which **39 were the two sibling lineages' artifacts**. A lineage that had already completed all five of its iterations lost its `research.md`, state log, findings registry, deltas, and every iteration file. A second lineage was rolled back from three iterations to one. Both had done nothing wrong.

The underlying error is one of attribution: under concurrency the guard cannot distinguish a write made by the leaf it is policing from one made by a sibling running at the same time, yet it acts as though it can.

### Purpose
Confine the guard to writes it can actually attribute. Sibling lineage directories become explicitly unattributable — excluded from both detection and revert — while every path outside the leaf's directory and its siblings' stays fully guarded.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An `unattributableDirs` option on the containment surface, resolved with the same repo-relative rules as `artifactDir`.
- Exclusion of those directories from the pre-dispatch snapshot and from post-dispatch violation detection.
- The fan-out worker passing its sibling lineage directories on both calls.
- Regression coverage proving a sibling's completed artifacts survive a leaf's violation.

### Out of Scope
- Changing which executor kinds are guarded — containment stays enabled for `cli-codex` only.
- Preventing a leaf from writing into a sibling's directory; that write is now unattributable and therefore untouched rather than mis-reverted.
- Recovering the artifacts already destroyed by the observed failure.
- Any change to how the guard treats genuine out-of-scope repository writes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/lib/deep-loop/write-containment.ts` | Modify | `unattributableDirs` option, scope resolution, exclusion in snapshot and detect |
| `runtime/scripts/fanout-run.cjs` | Modify | Compute sibling lineage dirs; pass on snapshot and enforce |
| `runtime/tests/unit/write-containment.vitest.ts` | Modify | Concurrent-sibling regression block |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A sibling's writes are never reported as this leaf's violation | Detection returns empty when only a sibling wrote |
| REQ-002 | A sibling's completed artifacts survive a leaf's violation | The sibling file still exists with original content after enforce |
| REQ-003 | Genuine out-of-scope writes are still caught and reverted | A repo write by the leaf is detected and restored from HEAD |
| REQ-004 | The fan-out worker passes sibling dirs on both calls | Snapshot and enforce receive the same exclusion set |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Exclusions that are not repo-relative subpaths are ignored | An absolute outside path does not widen or break scope |
| REQ-006 | The leaf's own dir is never treated as unattributable | Passing it as an exclusion is a no-op |
| REQ-007 | Typecheck and affected suites stay green | `npm run typecheck` clean; affected unit files pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The observed failure is reproducible without the fix and absent with it.
- **SC-002**: A three-lane fan-out can survive one lane tripping containment with the other two intact.
- **SC-003**: No reduction in coverage of genuine repository writes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Excluding sibling dirs hides a leaf writing into a sibling | A cross-lineage write goes unreported | Accepted: the write is unattributable under concurrency, and mis-reverting is strictly worse than not reverting |
| Risk | Over-broad exclusion weakens the guard | Real violations missed | Exclusions are an explicit list of sibling dirs, never a prefix of the whole repo |
| Risk | Fix masks the separate problem that a research lane wrote to the repo at all | Stray writes keep happening, just unreverted elsewhere | Out of scope here; the guard still catches and reverts those repository writes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should a research-mode lineage run under a read-only sandbox so stray repository writes are impossible rather than reverted after the fact?
- Should the guard emit a distinct advisory event when it observes activity in a sibling directory, so cross-lineage writes are still visible without being reverted?
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
