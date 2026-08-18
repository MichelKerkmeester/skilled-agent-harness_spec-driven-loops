---
title: "Feature Specification: Write-Containment Concurrent-Writer Safety"
description: "Stop the deep-loop write-containment guard from irreversibly deleting untracked out-of-scope files it cannot attribute to the leaf, so deep-loop fan-out can run safely on a dirty, multi-actor working tree."
status: complete
completion_pct: 100
trigger_phrases:
  - "write containment deletes untracked files"
  - "deep-loop containment data loss"
  - "run research on dirty tree"
importance_tier: "critical"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/003-write-containment-hardening/003-write-containment-concurrent-safety"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reconciled spec to Complete after write-containment fix 6d762f4393 landed"
    next_safe_action: "No further action required for this completed packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts"
    session_dedup:
      fingerprint: "sha256:edd0ec9c96342c7c3ba1e8e653376448de9adf863a93052d4292100eb1e32569"
      session_id: "2026-08-06-deep-loop-046"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Not-in-HEAD (untracked) out-of-scope paths are now preserved, never deleted; in-HEAD out-of-scope paths are still reverted from HEAD and remain fatal"
      - "fanout-run.cjs fails the codex iteration only on fatal violations; advisory-only outcomes are logged and do not fail the run"
      - "The 8 previously-deleted operator files cannot be recovered from git or worktrees; recorded as out of scope"
---
# Feature Specification: Write-Containment Concurrent-Writer Safety

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-06 |
| **Branch** | `skilled/v4.0.0.0` (recorded directly; no dedicated packet branch was created for this doc-only pass) |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `002-fanout-containment-sibling` |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-loop codex write-containment guard (`write-containment.ts`) confines a `cli-codex` leaf's writes to its artifact directory by diffing the git working tree after each dispatch: any out-of-scope path that is dirty after the dispatch but was not in the pre-dispatch baseline is treated as a leaf violation, reverted, and used to fail the iteration fail-closed.

For an out-of-scope path that is **not in HEAD** (an untracked or newly-added file), the only available "revert" is a hard `rmSync` delete. On a long-running fan-out over a **dirty, multi-actor working tree**, files created during the dispatch window by *other* actors — the parent orchestrator, a concurrent session, or the operator — appear as new out-of-scope paths and are indistinguishable from the leaf's own writes. The guard therefore **irreversibly deletes files it cannot attribute to the leaf**.

Observed impact (2026-08-06): a 15-iteration research run deleted 12 untracked files at end-of-run — 4 belonging to this session and **8 belonging to the operator's parallel workstreams** (`mcp-tooling/.../026-*`, `sk-doc/027-*`), none in git, no backup, unrecoverable. The run itself had completed all 15 iterations successfully; only the containment revert failed it.

This is the previously-deferred review finding on dirty-path containment. The design already documents this unsoundness for sibling lineages (it excludes `unattributableDirs`) but does not generalize it to arbitrary concurrent writers.

### Purpose
Make the containment guard incapable of irreversible data loss while preserving its high-value protection, so deep-loop fan-out (research/review) runs safely on a dirty tree: never delete a not-in-HEAD path (deletion is the only revert for such a path and it is irreversible, and such paths are exactly the ones that cannot be proven to be the leaf's); keep reverting in-HEAD out-of-scope modifications/deletions via `git checkout HEAD` (recoverable and the genuine high-value protection against a leaf corrupting tracked source); and split the outcome so in-HEAD reverts are fatal (fail the iteration) while not-in-HEAD paths are preserved and logged as advisories (non-fatal).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `write-containment.ts`: `revertOutOfScopeViolations` preserves not-in-HEAD paths (`preserved_untracked`, no delete); `enforceWriteContainment` partitions detected violations into fatal (in-HEAD) `violations` and non-fatal `advisories`; `EnforceResult` gains `advisories`.
- `fanout-run.cjs`: log the containment event whenever present (fatal or advisory); fail the iteration only on fatal `violations`.
- `write-containment.vitest.ts`: assert preservation of untracked out-of-scope files; add a concurrent-writer regression that reproduces the data-loss scenario.

### Out of Scope
- Recovering the 8 already-deleted operator files - unrecoverable from git/worktrees.
- Per-write process attribution of the codex subprocess - not feasible with the current adapter.
- Changing which leaf kinds are guarded - `cli-codex` only stays as-is.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modify | Removed the `rmSync` import and delete branch; preserve not-in-HEAD paths; split violations into fatal/advisory |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Log containment events (fatal or advisory); fail the iteration only on fatal violations |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | Modify | Flipped untracked-delete assertions to preservation; added concurrent-writer and mixed fatal/advisory regressions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `revertOutOfScopeViolations` never deletes a file | A not-in-HEAD out-of-scope path is preserved on disk with action `preserved_untracked` |
| REQ-002 | An in-HEAD out-of-scope modification/deletion is still reverted | Reverted from HEAD and reported as a fatal violation |
| REQ-003 | `enforceWriteContainment` partitions detected violations | Not-in-HEAD paths return in `advisories` (non-fatal); in-HEAD paths return in `violations` (fatal); the event logs both |
| REQ-004 | `fanout-run.cjs` fails a codex iteration only on fatal outcomes | Iteration fails only when `containment.violations.length > 0`; advisory-only outcomes are logged and do not fail the run |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The unit suite proves the fix and the regression it closes | `write-containment.vitest.ts` passes, including a new regression proving a concurrent untracked out-of-scope file is preserved, not deleted, plus a mixed fatal-tracked + advisory-untracked case |
| REQ-006 | TypeScript typecheck passes for the runtime package | `npx tsc --noEmit -p tsconfig.json` reports 0 errors attributable to this change |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A negative control reproduced the pre-fix bug (4 assertions failed: expected `preserved_untracked`, got `removed_untracked`; advisories empty) before the fix landed.
- **SC-002**: Post-fix, `npx vitest run tests/unit/write-containment.vitest.ts` (cwd `.opencode/skills/system-deep-loop/runtime`) passes 18/18.
- **SC-003**: `npx tsc --noEmit -p tsconfig.json` reports 0 errors attributable to this change (the sole remaining diagnostic is a pre-existing `tsconfig` `moduleResolution=node10` deprecation).
- **SC-004**: `rg rmSync write-containment.ts` returns no match, proving the module can no longer delete a file.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Preserving not-in-HEAD paths as advisories means a malicious or buggy leaf's untracked write no longer fails the run by itself | Low - advisory-only, no data loss | In-HEAD violations still fail closed; advisories are logged for operator review, and not-in-HEAD deletion was the only unsound path to begin with |
| Risk | The 8 already-deleted operator files remain unrecoverable | High for the affected workstreams, already realized and irreversible | None available; documented as out of scope, not remediated by this fix |
| Dependency | Detection still relies on a git diff against the pre-dispatch baseline | If the baseline capture is wrong, both the fatal and advisory paths are affected | Unchanged by this fix; only the revert action for not-in-HEAD paths changed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->
