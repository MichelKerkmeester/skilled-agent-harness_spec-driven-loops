---
title: "Tasks: Drift-Marker Producer/Consumer Resilience"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "drift marker pipeline resilience tasks"
  - "stale lock breaking tasks"
  - "marker path resolution tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/013-drift-marker-pipeline-resilience"
    last_updated_at: "2026-07-09T19:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented F3+F4, all 18 tasks complete with verified evidence"
    next_safe_action: "None -- packet complete"
    blockers: []
    key_files:
      - ".opencode/scripts/git-hooks/lib/memory-drift-marker.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-013-drift-marker-pipeline-resilience"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Drift-Marker Producer/Consumer Resilience

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

- [x] T001 Re-confirmed line numbers matched spec.md exactly (`:21-22` marker_dir, `:54-64`
  lock-acquisition loop) against the live tree before editing
  (`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh`)
- [x] T002 Applied `LOCK_STALE_MS = 45_000` (mid-point of the resolved 30-60s range) with an
  inline comment explaining the SIGKILL-orphan reasoning
  (`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh`)
- [x] T003 Decided: embedded-node env-var precedence (reads `process.env.SPEC_KIT_DB_DIR` /
  `SPECKIT_DB_DIR` / `MEMORY_DB_PATH` directly inside the existing node heredoc, no import of
  compiled `core/config.ts` output into a git hook) -- documented inline in the script comment
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### F3 -- Stale-Lock Breaking

- [x] T004 Added `LOCK_STALE_MS` constant to the embedded node block
  (`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh`)
- [x] T005 Added mtime-based staleness check inside the lock-acquisition retry loop's `catch`
  branch, gated on `error.code === 'EEXIST'` so non-contention errors are unaffected
  (`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh`)
- [x] T006 Implemented `reclaimStaleLock()` (rename-then-remove), mirroring
  `spec-folder-mutex.ts:101-122`'s non-destructive pattern: rename first, confirm the source is
  gone and the renamed copy exists, only then `rmSync` (`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh`)
- [x] T007 Confirmed via harness test (real shipped code, monkeypatched `fs.statSync` to throw for
  the lock dir): falls back to the existing 5s-timeout/exit-0 behavior, elapsed 5020ms, lock dir
  left untouched -- no crash, no hang, no destructive reclaim
- [x] T008 [P] Shell smoke test: pre-created a lock dir backdated 60s (stale), ran `run_hook.sh` --
  reclaimed and wrote the marker in 0s (well within the 5s wait budget)
- [x] T009 [P] Shell smoke test: pre-created a fresh (just-created) lock dir, ran `run_hook.sh` --
  NOT reclaimed; hook waited the full ~5s and exited with code 0 exactly as before the fix (marker
  file hash unchanged)

### F4 -- Live DB-Path-Aware Marker Location

- [x] T010 Implemented directory resolution mirroring `core/config.ts:63-101`'s
  `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR`/`MEMORY_DB_PATH` precedence inside the existing embedded node
  block (`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh`)
- [x] T011 Replaced the hardcoded `marker_dir` bash assignment; bash now only computes `repo_root`
  and passes it to node, which resolves `markerDir`/`markerPath` internally
  (`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh`)
- [x] T012 Confirmed: `lockDir` is still `` `${markerPath}.lock` ``, derived from the (now
  resolved) `markerPath` -- no separate hardcoded lock-path assignment exists
- [x] T013 [P] Shell smoke test: no override set, marker landed at the exact pre-fix default
  `mcp_server/database/` path (byte-identical string match confirmed, REQ-004)
- [x] T014 [P] Shell smoke tests: `SPEC_KIT_DB_DIR` alone, `MEMORY_DB_PATH` alone, and both set
  together (precedence) -- each landed in the correctly-resolved directory; `SPEC_KIT_DB_DIR` wins
  when both are set (CHK-067)

### Adversarial-Review-Verified Acceptance Tests

- [x] T015 [P] F3: spawned a real `node` process that ran the identical `mkdirSync(lockDir)`
  acquisition, confirmed it held the lock, then `kill -9`'d it before any release. Confirmed two
  things against the SAME real orphaned lock: (a) an invocation immediately after the kill
  correctly does NOT reclaim it (lock still fresh, REQ-002 holds even for a real orphan) and waits
  the full ~5s exiting 0 as before; (b) once the lock aged past `LOCK_STALE_MS` (real elapsed
  time, not backdated), the next invocation reclaimed it and wrote the marker in <1s, with the
  new entry present in the JSON and old entries preserved by the dedup merge
  (`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh`)
- [x] T016 [P] F4: with `SPEC_KIT_DB_DIR` set to a scratch dir, ran the hook, then called the REAL
  compiled consumer resolver (`resolveMemoryDriftMarkerPath()` from
  `mcp_server/dist/lib/storage/memory-drift-healing.js`, fed `DATABASE_PATH` from the real compiled
  `resolveDatabasePaths()` in `mcp_server/dist/core/config.js`) with the same override. On a
  non-symlinked override dir the two paths were byte-identical strings. On a `/var`-symlinked
  macOS tmp dir the strings differed (`/var/...` vs realpath-resolved `/private/var/...`) but
  `fs.statSync().ino` on both was identical and the consumer's `fs.existsSync()` on its own
  resolved path found the hook's write -- confirmed functionally identical (same inode), which is
  the correct equivalence test on a symlink-containing filesystem, not string equality
  (`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh`,
  `.opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Ran `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict`,
  evidence captured in implementation-summary.md
- [x] T018 Updated `tasks.md`/`checklist.md`/`implementation-summary.md` to reflect final
  implementation state (`spec.md`/`plan.md` needed no further edit)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] REQ-001 through REQ-006 verified per checklist.md
- [x] `validate.sh --strict` passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

## Phase R: Audit Remediation (2026-07-09 GPT-5.6 review wave)

- [ ] T019 [P1] Lock staleness is mtime-only and release is unconditional, so an owner paused past the stale threshold deletes its successor's lock on resume (`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh:103,:140`). Store an ownership token + PID, heartbeat long-held locks, reclaim only dead/unknown owners, release only when the on-disk token matches. Reconcile `spec.md:252-256` recovery claims with the actual threshold behavior.
- [ ] T020 [P1] `post-commit` deletes the code-graph SQLite/WAL/SHM with no live-owner check, creating a split-brain/corruption window against a running daemon (`.opencode/scripts/git-hooks/post-commit:72`). Write an atomic invalidation marker instead; let the launcher reset the DB only under exclusive ownership with connections closed.
- [ ] T021 [P2] The hook producer resolves the marker dir without the consumer's symlink canonicalization and project/home/temp boundary checks (`memory-drift-marker.sh:59` vs `mcp_server/core/config.ts:79-91`). Share one resolver or duplicate the checks exactly.
- [ ] T022 [P2] Any marker read error — including transient I/O — deletes the claimed processing file instead of restoring it (`mcp_server/startup-checks.ts:274`). Retain/restore on read errors; reserve deletion for proven-malformed content.
- [ ] T023 [P2] The hook installer breaks in linked worktrees (`.git` is a file) and ignores `core.hooksPath` (`.opencode/scripts/install-git-hooks.sh:26`). Resolve via `git rev-parse --git-path hooks`.
- [ ] T024 [P2] No committed automated test covers this packet's F3/F4 producer fixes (completion evidence is scratch/harness-only). Add durable producer tests: paused live owner past the stale threshold, future/old mtimes, three concurrent writers, failed writes, token-checked release.
