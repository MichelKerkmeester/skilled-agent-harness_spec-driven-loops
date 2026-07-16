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
    packet_pointer: "system-speckit/029-memory-search-intelligence/013-drift-marker-pipeline-resilience"
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
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

- [x] T019 [P1] Lock staleness is mtime-only and release is unconditional, so an owner paused past the stale threshold deletes its successor's lock on resume (`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh:103,:140`). Store an ownership token + PID, heartbeat long-held locks, reclaim only dead/unknown owners, release only when the on-disk token matches. Reconcile `spec.md:252-256` recovery claims with the actual threshold behavior. DONE 2026-07-10 — PID+random-token ownership record, 15s heartbeat, reclaim only on confirmed-dead owner (kill -0) or missing+stale record with fail-closed stat handling, token-checked release; atomic temp+rename marker write and 5s give-up preserved; every failure path exits 0 (memory-drift-marker.sh). Bash harness proves paused-owner-non-reclaim + token-checked release (run twice by verifier). SC-001/SC-002 now hold as written (dead owners reclaimed immediately, live owners never). Sonnet-max verified ACCEPT.
- [x] T020 [P1] `post-commit` deletes the code-graph SQLite/WAL/SHM with no live-owner check, creating a split-brain/corruption window against a running daemon (`.opencode/scripts/git-hooks/post-commit:72`). Write an atomic invalidation marker instead; let the launcher reset the DB only under exclusive ownership with connections closed. DONE 2026-07-10 — post-commit now writes an atomic invalidation marker (umask-077 temp + mv), no destructive fallback remains; launcher consumeCodeGraphInvalidation resets the DB only under exclusive owner-lease + connections-closed + independent lsof liveness check (mk-code-index-launcher.cjs:1344-1387); split-brain walkthrough closed by verifier; red-baseline harness 3/3 (verifier reproduced the red via scoped git stash). Sonnet-max verified ACCEPT.
- [x] T021 [P2] The hook producer resolves the marker dir without the consumer's symlink canonicalization and project/home/temp boundary checks (`memory-drift-marker.sh:59` vs `mcp_server/core/config.ts:79-91`). Share one resolver or duplicate the checks exactly. DONE 2026-07-10 — producer mirrors the consumer path validation (symlink canonicalization + project/home/temp boundary checks per core/config.ts:79-91 parity, verifier compared side-by-side); harness proves env-override symlinked dir lands the marker where resolveMemoryDriftMarkerPath reads. Sonnet-max verified.
- [x] T022 [P2] Any marker read error — including transient I/O — deletes the claimed processing file instead of restoring it (`mcp_server/startup-checks.ts:274`). Retain/restore on read errors; reserve deletion for proven-malformed content. DONE 2026-07-10 — transient marker read errors (EACCES/EISDIR) restore/retain the claimed marker; only proven-malformed/empty content deleted (startup-checks.ts:331-365); composes with repairStatus consumption; startup-checks 27/27. Sonnet-max verified.
- [x] T023 [P2] The hook installer breaks in linked worktrees (`.git` is a file) and ignores `core.hooksPath` (`.opencode/scripts/install-git-hooks.sh:26`). Resolve via `git rev-parse --git-path hooks`. DONE 2026-07-10 — installer resolves hooks dir via git rev-parse --git-path hooks incl. relative core.hooksPath normalization; worktree harness 2/2 (linked worktree + custom hooksPath), re-run by verifier with global-config isolation confirmed. Note: repo-local core.hooksPath override now points at .git/hooks so installed hooks execute despite the global ~/.config/git/hooks setting — disclosed to operator.
- [x] T024 [P2] No committed automated test covers this packet's F3/F4 producer fixes (completion evidence is scratch/harness-only). Add durable producer tests: paused live owner past the stale threshold, future/old mtimes, three concurrent writers, failed writes, token-checked release. DONE 2026-07-10 — committed 7-scenario producer lock suite (symlink parity, paused live owner, old/future mtimes, three concurrent writers with all-entries-survive assertion, failed-write cleanup, token-checked release), one-command runnable. First attempt REJECTED for missing global-git-config isolation in fixture calls — redo adds GIT_CONFIG_GLOBAL/SYSTEM=/dev/null; verifier ran it with before/after ~/.config/git snapshots identical. Sonnet-max ACCEPT after redo.
