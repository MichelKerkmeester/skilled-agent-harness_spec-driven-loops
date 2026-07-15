---
title: "Tasks: Drift-Marker Native Consolidation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "drift marker native consolidation"
  - "git hook embedded heredoc duplication"
  - "drift marker lock staleness constant mismatch"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation"
    last_updated_at: "2026-07-11T17:47:04Z"
    last_updated_by: "openai-gpt-5.6-sol"
    recent_action: "Reconciled completed task evidence and the migrated validator path"
    next_safe_action: "No implementation task remains; checklist.md retains one open commit-evidence pin"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Drift-Marker Native Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Re-confirm all cited line ranges (heredoc body, `computeDatabasePaths`, `memoryDriftMarkerEntryKey`, `atomicWriteFile`, `isReclaimableLock`/`reclaimInterprocessLock`) against the live tree in case a concurrent session has touched any of the five files since planning (`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh`, `.opencode/skills/system-spec-kit/mcp_server/core/config.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts`)
- [x] T002 Add the `staleMs` parameter to `isReclaimableLock(lockDir, staleMs = LOCK_STALE_MS)`, default preserving today's 5-minute behavior with zero call-site edits (`.opencode/skills/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts`)
- [x] T003 Run `spec-folder-mutex-liveness.vitest.ts` unchanged to confirm zero regression from T002 before writing any new code (`.opencode/skills/system-spec-kit/mcp_server/tests/spec-folder-mutex-liveness.vitest.ts`)
- [x] T004 Add re-exports for `resolveDatabasePaths`, `resolveMemoryDriftMarkerPath`, `memoryDriftMarkerEntryKey`, `atomicWriteFile`, `isReclaimableLock`, `reclaimInterprocessLock`, `createInterprocessLock`/equivalent lock-acquire helper, and `releaseInterprocessLock` to the `@public` barrel, following the `computeMemoryQualityScore` precedent (`.opencode/skills/system-spec-kit/mcp_server/api/index.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### New Entrypoint

- [x] T005 Create `drift-marker-write.ts` following the `generate-description.ts`/`backfill-graph-metadata.ts` CLI-script convention, reading `MEMORY_DRIFT_DIFF`/`MEMORY_DRIFT_REPO_ROOT`/`MEMORY_DRIFT_SOURCE` from `process.env` (`.opencode/skills/system-spec-kit/scripts/git-hooks/drift-marker-write.ts`)
- [x] T006 Port the diff-tree text-parsing step verbatim (the one piece of logic with no existing TS equivalent) from `memory-drift-marker.sh:38-48` into the new entrypoint
- [x] T007 Wire marker-path resolution through `resolveDatabasePaths()` and `resolveMemoryDriftMarkerPath()` (boundary check included, no shell re-derivation of override precedence)
- [x] T008 Wire lock acquire through the parameterized `isReclaimableLock(lockDir, 45_000)`/`reclaimInterprocessLock(lockDir)` pair, writing an `owner.json` at acquire time (mirroring `createInterprocessLock`'s shape) so dead-owner reclaim works immediately, not only after the 45s mtime fallback
- [x] T009 Wire existing-marker read with the same malformed-JSON-falls-back-to-empty tolerance as `memory-drift-marker.sh:112-121` (NFR-R02)
- [x] T010 Wire dedup via the imported `memoryDriftMarkerEntryKey`, replacing the hand-written `keyFor` closure
- [x] T011 Wire the atomic write via the imported `atomicWriteFile`, replacing the hand-written temp-plus-rename block, inside the acquired-lock window exactly as today
- [x] T012 Wire lock release in a `finally`, matching `memory-drift-marker.sh:139-141` exactly

### Hook Shrink

- [x] T013 Replace `memory-drift-marker.sh:28-142`'s heredoc with one delegated call to the compiled entrypoint (`node "$repo_root/.opencode/skills/system-spec-kit/scripts/dist/git-hooks/drift-marker-write.js"`), preserving `:1-23`'s git-plumbing/early-exit logic and `:25-27`'s env-var exports verbatim (`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh`)
- [x] T014 Confirm `post-commit`, `post-merge`, and `post-rewrite` need zero edits — `mark_memory_drift_from_diff`'s call-site contract is unchanged (`.opencode/scripts/git-hooks/post-commit`, `post-merge`, `post-rewrite`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 [P] New vitest: dedup-key collapsing of a repeated rename/delete entry matches today's shell output byte-for-byte
- [x] T016 [P] New vitest: atomic-write crash-mid-write leaves no partial marker file (reuses `transaction-manager.ts`'s existing recovery guarantee)
- [x] T017 [P] New vitest: lock-reclaim dead-owner-immediate-reclaim path (no 45s wait when the owner PID is provably dead)
- [x] T018 [P] New vitest: lock-reclaim 45s-stale-mtime-fallback path (owner state unknown, age-based reclaim uses the entrypoint's 45,000ms, not the mutex's 5-minute default)
- [x] T019 [P] New vitest: boundary-violation override throws the same message `config.ts:88-91` produces, no marker written, non-fatal to the caller (REQ-002)
- [x] T020 [P] New vitest: byte-identical output with no DB-path override set, same marker path/format/dedup as today's post-013 behavior (REQ-003)
- [x] T021 Re-run `spec-folder-mutex-liveness.vitest.ts`, confirm the mutex's own 5-minute default and existing callers are unaffected (REQ-004c, NFR-C02)
- [x] T022 Run `npx tsx evals/check-no-mcp-lib-imports.ts` and `bash check-api-boundary.sh` against the new file; the entrypoint has zero violations, while the full scanner retains 17 unrelated baseline findings (REQ-005) (`.opencode/skills/system-spec-kit/scripts/evals/check-no-mcp-lib-imports.ts`, `.opencode/skills/system-spec-kit/scripts/check-api-boundary.sh`)
- [x] T023 Run `npx tsx evals/check-source-dist-alignment.ts` to confirm the compiled `dist/` output the git hook actually calls matches the checked-in `.ts` source
- [x] T024 Manual smoke test: a real commit touching `.opencode/specs`, run through the actual `post-commit` hook, confirms the marker is written exactly as before
- [x] T025 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation --strict`
- [x] T026 Update documentation (spec/plan/tasks/checklist/implementation-summary) [evidence: implementation-summary.md:113]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
