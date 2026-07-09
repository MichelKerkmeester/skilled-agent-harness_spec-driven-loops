---
title: "Verification Checklist: Drift-Marker Producer/Consumer Resilience"
description: "Implementation complete. All P0/P1/P2 items verified with concrete evidence from a real scratch git repo and two source-code harness tests."
trigger_phrases:
  - "drift marker pipeline resilience checklist"
  - "stale lock breaking checklist"
  - "marker path resolution checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/013-drift-marker-pipeline-resilience"
    last_updated_at: "2026-07-09T19:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented F3+F4 in memory-drift-marker.sh, all checklist items verified"
    next_safe_action: "None -- packet complete"
    blockers: []
    key_files:
      - ".opencode/scripts/git-hooks/lib/memory-drift-marker.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-013-drift-marker-pipeline-resilience"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Drift-Marker Producer/Consumer Resilience

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` REQUIREMENTS section (REQ-001 through REQ-006)
- [x] CHK-002 [P0] Technical approach defined in `plan.md` ARCHITECTURE section
- [x] CHK-003 [P1] Dependencies identified and available. Status: none required -- both fixes are
  self-contained edits to `memory-drift-marker.sh`. Confirmed: no other file references
  `MEMORY_DRIFT_MARKER_PATH`, `marker_dir`, or sources this lib besides `post-commit`/`post-merge`/
  `post-rewrite` (`rg` swept, no other call sites).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `shellcheck .opencode/scripts/git-hooks/lib/memory-drift-marker.sh` -> exit 0,
  zero warnings (same as the pre-change baseline)
- [x] CHK-011 [P0] Confirmed via `run_hook.sh` scratch-repo smoke test: normal rename+commit with
  no override writes the marker silently, exit code 0, no stderr output
- [x] CHK-012 [P1] Confirmed via harness test with `fs.statSync` monkeypatched to throw for the
  lock dir (real shipped code, not reimplemented): falls back to the existing 5s wait-and-retry,
  exit 0, elapsed 5020ms -- no crash, no hang
- [x] CHK-013 [P1] `LOCK_STALE_MS` named constant with an inline comment explaining the SIGKILL-orphan
  reasoning (mirrors `spec-folder-mutex.ts`'s naming); `reclaimStaleLock()` uses rename-then-remove,
  confirming the rename succeeded before `rmSync`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] REQ-001 through REQ-006 each met by a dedicated shell-level smoke test (see
  `CHK-060`-`CHK-069` below for per-requirement evidence)
- [x] CHK-021 [P0] Manual testing complete: stale-lock reclaim (Test 4), DB-path-override marker
  placement under `SPEC_KIT_DB_DIR`, `MEMORY_DB_PATH`, and both-set-precedence (Test 2/3) all run
  against a real scratch git repo with the actual hook script
- [x] CHK-022 [P1] Edge cases tested: fresh-lock non-reclaim (Test 5, elapsed 5s exit 0, marker
  hash unchanged), `statSync`-failure fallback (Test 6, monkeypatch harness), DB-path-override
  directory auto-created via `fs.mkdirSync(markerDir, {recursive:true})` (confirmed in every
  override test -- the scratch override dirs did not pre-exist)
- [x] CHK-023 [P1] Error scenarios validated: two hook invocations launched truly concurrently
  against the same pre-backdated stale lock both exited with code 0, the resulting
  `.memory-drift-dirty-paths.json` was valid with both entries present (no truncation/corruption),
  and the lock dir was fully released at the end (Test 9)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded for both: F3 (stale-lock recovery) is
  `class-of-bug` -- every future SIGKILL between acquire and release reproduces it, not a one-time
  instance. F4 (hardcoded marker path) is `class-of-bug` -- every session running under a
  DB-path override reproduces it. Both fixed at the mechanism level, not patched per-instance.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. `rg -n
  "mkdirSync|marker_dir|MEMORY_DRIFT_MARKER" .opencode/scripts/git-hooks` confirms
  `memory-drift-marker.sh` is the only writer of `.memory-drift-dirty-paths.json` and its `.lock`
  sibling; only `post-commit`/`post-merge`/`post-rewrite` source this lib.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. `rg -n "resolveMemoryDriftMarkerPath"
  mcp_server` confirms `resolveMemoryDriftMarkerPath()` (`memory-drift-healing.ts:199-201`) has
  exactly one production call site (`startup-checks.ts:246`, itself called from
  `context-server.ts:2229-2230`) -- F4's fix target is complete once it matches that one resolver.
- [x] CHK-FIX-004 [P0] Concurrency-sensitive adversarial tests run: two hook invocations racing to
  reclaim the same stale lock (`Test 9` -- both exited 0, marker JSON valid and uncorrupted, lock
  released); a fresh (non-stale) lock proven never reclaimed under both synthetic (`Test 5`) and
  real-orphan (`Test 7`, immediately post-kill) conditions.
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed (plan.md Affected Surfaces): lock state
  (fresh-live / stale-abandoned / stat-unreadable) x DB-path env (unset / `SPEC_KIT_DB_DIR` set /
  `MEMORY_DB_PATH` set) -- six rows. Exercised: fresh-live+unset (Test 1), stale+unset (Test 4),
  stat-unreadable+unset (Test 6), fresh-live+`SPEC_KIT_DB_DIR` (Test 7 immediate), fresh-live+real
  orphan aged to stale+unset (Test 7 recovery), unset/`SPEC_KIT_DB_DIR`/`MEMORY_DB_PATH`/both
  (Tests 2/3). All six axis combinations covered across the test set.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed: `SPEC_KIT_DB_DIR` and
  `MEMORY_DB_PATH` set simultaneously (Test 3, precedence sub-case) -- `SPEC_KIT_DB_DIR`'s
  directory received the marker, `MEMORY_DB_PATH`'s parent directory stayed empty, confirming the
  documented precedence is honored, not silently ignored or reversed.
- [x] CHK-FIX-007 [P1] Evidence pinned to this session's actual uncommitted diff: `git status
  --short .opencode/scripts/git-hooks/` shows only `lib/memory-drift-marker.sh` as the file this
  packet's implementation touched (the sibling `post-commit`/`post-merge`/`post-rewrite`/`README.md`
  changes pre-date this session, shipped uncommitted by `011-automatic-drift-self-healing`).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (diff to `memory-drift-marker.sh` is lock/path-resolution
  logic only)
- [x] CHK-031 [P0] `reclaimStaleLock()` renames first, then checks `!fs.existsSync(dir) &&
  fs.existsSync(reclaimedDir)` before `rmSync` -- never deletes without confirming the rename
  moved the actual lock, matching `spec-folder-mutex.ts:101-122`'s confirm-before-delete pattern
- [x] CHK-032 [P1] Both `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR` and `MEMORY_DB_PATH` are `.trim()`-ed
  and checked for truthiness before use; an unset or empty value falls through to
  `defaultMarkerDir`. Confirmed by Test 1 (no override set -> default path used, no crash).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `tasks.md` and `checklist.md` updated to reflect final implementation state;
  `spec.md`/`plan.md` required no edits (already correct from the prior correction round)
- [x] CHK-041 [P1] Code comments adequate: `LOCK_STALE_MS`'s reasoning and the marker-dir
  resolution precedence are explained inline with durable WHY only -- no spec/packet/task IDs in
  the comments (comment-hygiene rule honored)
- [x] CHK-042 [P2] Reviewed `install-git-hooks.sh` -- its hook-list comment and bypass-env-var
  documentation describe the marker/lock behavior generically (no path or threshold specifics), so
  no update needed; still accurate after this fix
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] All scratch smoke-test repos/harnesses created under the session scratchpad
  directory (`/private/tmp/claude-501/.../scratchpad/013-drift/`), never inside the source tree
- [x] CHK-051 [P1] Scratchpad directory `rm -rf`'d after the test session; confirmed removed
  before finishing (`ls` on the path returned "No such file or directory")
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:finding-verification -->
## Finding-Specific Verification Evidence

**F3 -- stale-lock breaking**
- [x] CHK-060 [P0] Test 4: lock dir backdated 60s (older than `LOCK_STALE_MS=45000`), no live
  owner -- reclaimed, hook wrote the marker in 0s, well inside the 5s wait budget (REQ-001)
- [x] CHK-061 [P0] Test 5: fresh (just-created, ~19ms old) `lockDir` -- never reclaimed; hook
  waited the full ~5s, exited 0, marker file hash unchanged (REQ-002)
- [x] CHK-062 [P1] `LOCK_STALE_MS = 45_000` is a named top-level constant in the embedded node
  block with an inline comment; not an inline magic number at the check site (REQ-005)
- [x] CHK-063 [P1] Test 6: `fs.statSync` monkeypatched (via `--require` preload against the same
  fs module singleton) to throw for the lock dir when the real shipped code runs -- fell back to
  the existing wait-and-retry, exit 0, elapsed 5020ms, lock dir left untouched (NFR-R02)

**F4 -- live DB-path-aware marker location**
- [x] CHK-064 [P0] Test 2/3: `SPEC_KIT_DB_DIR` and, separately, `MEMORY_DB_PATH` each set to a
  non-default directory -- marker written inside the resolved directory in both cases; the
  unrelated default-path marker was untouched (REQ-003)
- [x] CHK-065 [P0] Test 1: no override set -- marker written to the exact pre-fix hardcoded path
  (`.../mcp_server/database/.memory-drift-dirty-paths.json`), confirmed byte-identical (REQ-004)
- [x] CHK-066 [P1] `lockDir = \`${markerPath}.lock\`` is the only lock-path assignment in the
  file; `markerPath` itself is now the resolved (not hardcoded) directory, so the lock path moves
  with it automatically (REQ-006)
- [x] CHK-067 [P1] Test 3 (precedence sub-case): both `SPEC_KIT_DB_DIR` and `MEMORY_DB_PATH` set
  simultaneously -- marker landed under `SPEC_KIT_DB_DIR`'s directory only, `MEMORY_DB_PATH`'s
  parent directory stayed empty, confirming the documented precedence is honored

**F3 -- stale-lock breaking (continued, adversarial-review-verified)**
- [x] CHK-068 [P0] Test 7 (the real repro): a genuine `node` process acquired the lock via the
  same `mkdirSync` mechanism, was `kill -9`'d before any release, leaving a real orphaned lock
  (confirmed via `kill -0` returning ESRCH). An invocation immediately after correctly did NOT
  reclaim it (still fresh, matches REQ-002). Once real elapsed time pushed the lock's age past
  `LOCK_STALE_MS`, the next invocation reclaimed it and wrote the marker in <1s -- the exact
  previously-permanent failure mode now self-heals (REQ-001; supplements CHK-060's synthetic test
  with the actual kill-driven repro)

**F4 -- live DB-path-aware marker location (continued, adversarial-review-verified)**
- [x] CHK-069 [P0] Test 8: with `SPEC_KIT_DB_DIR` set, ran the hook, then independently invoked
  the REAL compiled consumer resolver (`resolveMemoryDriftMarkerPath()` from
  `mcp_server/dist/lib/storage/memory-drift-healing.js`, fed the real `resolveDatabasePaths()`
  from `mcp_server/dist/core/config.js`) under the same override. Non-symlinked override dir:
  byte-identical path strings. `/var`-symlinked macOS tmp dir: path *strings* differed (`/var/...`
  vs. realpath-canonicalized `/private/var/...`) but `fs.statSync().ino` was identical on both and
  the consumer's own `fs.existsSync()` on its resolved path found the hook's write -- confirmed
  functionally identical (same file, same inode), which is the correct equivalence test on a
  symlink-containing filesystem (REQ-003; supplements CHK-064). Noted as a residual observation in
  implementation-summary.md, not a fix gap: REQ-003 asks for precedence-order matching, not
  symlink canonicalization, and the file is provably the same one the consumer will read.
<!-- /ANCHOR:finding-verification -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-09. All items verified against a real scratch git repo running the
actual (post-fix) hook script, plus two harness tests (statSync-failure monkeypatch, real compiled
consumer resolver) that exercise the exact shipped/consumer code without reimplementing it.

Status: implementation complete, all checklist items verified with concrete evidence (see
Finding-Specific Verification Evidence above and implementation-summary.md for full detail).
`validate.sh --strict` result recorded in implementation-summary.md.
<!-- /ANCHOR:summary -->
