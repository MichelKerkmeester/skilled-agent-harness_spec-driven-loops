---
title: "Implementation Plan: Drift-Marker Producer/Consumer Resilience"
description: "Two additive, independent fixes to memory-drift-marker.sh: mtime-based stale-lock breaking mirroring the existing spec-folder-mutex.ts reclaim pattern (F3), and a live, override-aware marker write path mirroring the existing getUncleanShutdownMarkerPath()/resolveMemoryDriftMarkerPath() pattern (F4). No TypeScript surface changes; no schema changes."
trigger_phrases:
  - "drift marker pipeline resilience plan"
  - "stale lock breaking git hook plan"
  - "memory drift marker path divergence plan"
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
# Implementation Plan: Drift-Marker Producer/Consumer Resilience

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
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
| **Language/Stack** | Bash (`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh`) with an embedded `node <<'NODE'` heredoc for the JSON marker read/write and lock acquisition |
| **Framework** | None — direct edits to the existing shared hook helper; no new file, no new abstraction layer |
| **Storage** | A plain JSON dotfile (`.memory-drift-dirty-paths.json`) plus a sibling `.lock` directory, both currently under `mcp_server/database/` |
| **Testing** | Shell-level smoke test extending `011`'s existing hook smoke discipline (unrelated commit, rename, delete, concurrent writers) plus two new scenarios: stale-lock reclaim and DB-path-override marker placement |

### Overview
Both fixes are surgical, additive changes to the same 97-line bash file, each independent of the
other and each independent of every other phase in this packet. F3 adds an mtime check to the
existing lock-acquisition retry loop before it gives up. F4 replaces one hardcoded path assignment
with a resolution step that mirrors logic this repo already has, twice, on the TypeScript side
(`core/config.ts`'s `computeDatabasePaths()` and `context-server.ts`'s
`getUncleanShutdownMarkerPath()`). Neither fix touches the JSON marker schema, the lock's
temp-file-plus-rename write mechanism, or anything on the consumer side
(`consumeMemoryDriftDirtyMarker`, `resolveMemoryDriftMarkerPath`) — those are already correct and
are being aligned with, not modified.

**Ready to implement directly** (mechanism confirmed against the live tree, direct precedent
exists for both): F3's mtime-based reclaim mirrors `spec-folder-mutex.ts:86-122`'s
`isReclaimableLock()`/`reclaimInterprocessLock()` pattern, simplified because this lock has no
long-running heartbeat requirement. F4's live-path resolution mirrors
`context-server.ts:372-380`'s `getUncleanShutdownMarkerPath()`, which already solved the identical
class of bug for a sibling marker file.

**Needs a decision during implementation, not a redesign**: whether F4's resolution shells out to
a small embedded-node snippet versus re-deriving the env-var precedence directly in bash is an
implementation-time decision within the constraints REQ-003/REQ-004 already set. F3's staleness
threshold is no longer an open implementation-time choice: a follow-up adversarial review
confirmed the real failure shape via real SIGKILL-mid-acquisition testing (spec.md §10 Resolved
Questions) and resolved the threshold to 30-60 seconds.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md, grounded in direct reads of the hook
  script, the consumer-side resolver, and the DB-path config module)
- [x] Success criteria measurable
- [x] Dependencies identified (none — both fixes are self-contained)

### Definition of Done
- [x] F3 stale-lock breaking implemented, with a named staleness-threshold constant (REQ-001,
  REQ-002, REQ-005)
- [x] F4 live-DB-path-aware marker directory resolution implemented, no-override behavior
  byte-identical to today (REQ-003, REQ-004, REQ-006)
- [x] Shell-level smoke tests added for both new behaviors
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two independent, additive edits inside the existing `mark_memory_drift_from_diff()` function and
its embedded node heredoc — no new abstraction, no new file, no new process. Either fix can ship
and be verified on its own; they touch different, non-overlapping regions of the same function
(the lock-acquisition loop at `:54-64` for F3, the marker-directory assignment at `:21-22` for
F4) and share no state dependency on each other.

### Key Components

**F3 — lock-acquisition loop (`:54-64`).** Confirmed empirically, not just read off the source:
SIGKILLing a lock-holder process mid-acquisition (after `mkdirSync` succeeds, before the `finally`
release block runs) in a throwaway directory reproduces the real failure shape — each individual
lock-acquisition attempt still fails fast (~5 seconds, unchanged), but the stale lock is never
recovered on any subsequent attempt, so Layer 2 goes silently and permanently dead after exactly
one killed hook process; no single git operation hangs. Today: `mkdirSync(lockDir)` in a `try`,
retry on `EEXIST` every 25ms via `Atomics.wait`, give up and `process.exit(0)` after 5 seconds
(`Date.now() - started > 5000`). The plan adds one branch inside the `catch`: before deciding
to keep waiting, `fs.statSync(lockDir)` and compare `Date.now() - stats.mtimeMs` against a new
named constant (`LOCK_STALE_MS`, mirroring the naming already used for the identical concept
in `spec-folder-mutex.ts:18`, resolved to 30-60 seconds — comfortably above the confirmed
sub-second normal lock lifetime and the existing 5-second wait budget). If the lock is older than
that threshold, attempt a
rename-then-remove reclaim (mirroring `spec-folder-mutex.ts:101-122`'s
`reclaimInterprocessLock()`: rename `lockDir` to a unique `.reclaiming-<pid>-<ts>` path first,
confirm the rename succeeded and the original `lockDir` no longer exists, only then `rmSync` the
renamed copy) and retry `mkdirSync` immediately rather than waiting out the remaining timeout. If
the lock is not yet stale, the existing wait-and-retry loop is unchanged. If `statSync` itself
fails (lock dir vanished between the `EEXIST` and the stat, or a permissions issue), the code
falls back to the existing behavior unchanged (NFR-R02) — no new failure mode is introduced by
the staleness check itself.

This git-hook lock does not need `spec-folder-mutex.ts`'s owner-PID-liveness probe
(`getLockOwnerState()`, `process.kill(pid, 0)`) or its heartbeat mechanism
(`startHeartbeat()`/`stopHeartbeat()`): that mutex protects a potentially long-running save
operation across process boundaries and needs to distinguish "still alive but slow" from
"abandoned." This lock is held only for the lifetime of a single short git-hook subprocess doing
a JSON read-modify-write — under normal operation it is acquired and released within
milliseconds, so a pure mtime-age threshold set comfortably above that normal lifetime (and above
the existing 5-second wait budget) is sufficient without the added complexity of a PID probe.

**F4 — marker directory resolution (`:21-22`).** Today: a single hardcoded assignment,
`marker_dir="$repo_root/.opencode/skills/system-spec-kit/mcp_server/database"`. The plan replaces
this with a resolution step that produces the same directory `resolveMemoryDriftMarkerPath()`
(`memory-drift-healing.ts:199-201`) would derive for the live, currently-configured DB — i.e. it
mirrors `core/config.ts:63-101`'s `computeDatabasePaths()` precedence: `SPEC_KIT_DB_DIR` (or
`SPECKIT_DB_DIR`) wins if set; else `MEMORY_DB_PATH`'s parent directory if set; else the existing
default (`mcp_server/database/`). Since the hook already shells out to `node` for the JSON
marker read/write (`:32-96`), the cleanest way to avoid re-deriving this precedence a second time
in pure bash is to compute it inside that same embedded node block, reading
`process.env.SPEC_KIT_DB_DIR` / `process.env.SPECKIT_DB_DIR` / `process.env.MEMORY_DB_PATH`
directly (these are plain env vars, no import needed to read them — only the *precedence order*
needs to match `core/config.ts`, not a shared import) and writing to the resolved directory
instead of the bash-computed default. This keeps the resolution logic in one place (the embedded
node block) rather than duplicating it across both a bash pre-check and a node write step.

The lock directory (`${markerPath}.lock`) is derived from the marker path (`:54`, already
`${markerPath}.lock`), so once the marker path resolution changes, the lock path moves with it
automatically — no separate F4 change is needed for the lock directory itself (REQ-006).

### Data Flow
F3: hook invoked -> attempts `mkdirSync(lockDir)` -> on `EEXIST`, `statSync(lockDir)` -> mtime
younger than threshold -> existing wait-and-retry (unchanged) -> mtime older than threshold ->
rename-then-remove reclaim -> retry `mkdirSync` immediately -> proceeds to marker write. F4: hook
invoked -> embedded node reads `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR`/`MEMORY_DB_PATH` from its
environment -> resolves the same directory `resolveMemoryDriftMarkerPath()` would resolve for
that same environment -> marker (and its `.lock` sibling) written there instead of the hardcoded
default.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `memory-drift-marker.sh` lock-acquisition loop (`:54-64`) | Retries on `EEXIST` for 5s, then fails fast (exits 0) with no self-recovery -- confirmed via real SIGKILL-mid-acquisition testing that every subsequent invocation repeats the same fast, silent failure once the lock is orphaned | Add mtime-based staleness check (30-60s, resolved) and rename-then-remove reclaim before giving up | Synthetic stale lock (old mtime, no live owner) reclaimed and hook proceeds; synthetic fresh lock (recent mtime) never reclaimed; real SIGKILL-mid-acquisition repro recovers on the next invocation |
| `memory-drift-marker.sh` marker-directory assignment (`:21-22`) | Hardcoded `mcp_server/database/`, ignores any DB-path override | Resolve the same directory `resolveMemoryDriftMarkerPath()` would derive for the live env | With no override: byte-identical path to today. With `SPEC_KIT_DB_DIR`/`MEMORY_DB_PATH` set: marker lands in the resolved directory, matching what the consumer would look for |
| `resolveMemoryDriftMarkerPath()` (`memory-drift-healing.ts:199-201`) | Consumer-side derivation from the live opened DB path | Not modified — this phase aligns the producer with it | No change; existing behavior is the fix's target, not its subject |
| `consumeMemoryDriftDirtyMarker()` (`startup-checks.ts:243-320`) | Reads the marker at boot from the consumer-resolved path | Not modified | No change |

Required inventories:
- Existing lock-acquisition call sites in this file:
  `rg -n "mkdirSync|lockDir|LOCK_STALE" .opencode/scripts/git-hooks/lib/memory-drift-marker.sh` —
  confirms this is the only lock in the file; no second lock site needs the same fix applied in
  parallel.
- Existing marker-directory consumers across the tree:
  `rg -n "resolveMemoryDriftMarkerPath|MEMORY_DRIFT_MARKER_FILENAME" .opencode/skills/system-spec-kit/mcp_server`
  — confirms the consumer side is a single resolver function with a single call site
  (`context-server.ts:2229-2230`), so there is exactly one derivation this fix needs to match, not
  several independently-drifted ones.
- Existing DB-path override precedent:
  `rg -n "SPEC_KIT_DB_DIR|SPECKIT_DB_DIR|MEMORY_DB_PATH" .opencode/skills/system-spec-kit/mcp_server/core/config.ts`
  — confirms the exact precedence order (`SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR` wins, else
  `MEMORY_DB_PATH`'s parent dir, else default) this fix's resolution must reproduce.
- Matrix axes: lock state (fresh-live / stale-abandoned / stat-unreadable) x DB-path env
  (unset / `SPEC_KIT_DB_DIR` set / `MEMORY_DB_PATH` set) — six independent rows, each with an
  expected outcome captured in checklist.md's Layer-Specific Verification Evidence section.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-confirm the hook's current line numbers and the consumer-side resolver against the live
  tree in case a concurrent session has touched these files since this plan was written
  (`rg -n "mkdirSync|marker_dir" .opencode/scripts/git-hooks/lib/memory-drift-marker.sh`)
- [x] Apply the resolved stale-lock staleness-threshold constant (30-60 seconds, resolved in
  spec.md §10 Resolved Questions via real SIGKILL-mid-acquisition testing) at the implementation
  site, documenting the reasoning inline
- [x] Decide the F4 resolution implementation approach: embedded-node env-var precedence (matches
  `core/config.ts` order without an import) vs. importing the compiled resolver (spec.md Open
  Questions)

### Phase 2: F3 — Stale-Lock Breaking
- [x] Add the named staleness-threshold constant near the top of the embedded node block
  (REQ-005)
- [x] Add the mtime-check-and-reclaim branch to the lock-acquisition loop, mirroring
  `spec-folder-mutex.ts:101-122`'s rename-then-remove pattern (REQ-001)
- [x] Confirm a fresh (non-stale) lock is never reclaimed (REQ-002)
- [x] Confirm a `statSync` failure on the lock dir falls back to existing wait-and-retry behavior
  (NFR-R02)
- [x] Shell-level smoke test: pre-create a stale lock dir, run the hook, confirm it proceeds and
  writes the marker within the existing wait budget
- [x] Real-process smoke test (the adversarial-review-verified repro): SIGKILL a lock-holder
  process mid-acquisition (`mkdirSync` succeeded, the `finally` release block not yet reached) in
  a throwaway directory; confirm the NEXT invocation, after this fix, successfully acquires the
  lock instead of failing again (REQ-001)

### Phase 3: F4 — Live DB-Path-Aware Marker Location
- [x] Implement the directory resolution inside the existing embedded node block, matching
  `core/config.ts`'s `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR`/`MEMORY_DB_PATH` precedence (REQ-003)
- [x] Confirm no-override behavior is byte-identical to today's hardcoded path (REQ-004)
- [x] Confirm the lock directory path is derived from the resolved marker path, not
  independently hardcoded (REQ-006)
- [x] Shell-level smoke test: run the hook with `SPEC_KIT_DB_DIR` (or `MEMORY_DB_PATH`) set to a
  scratch directory, confirm the marker lands there; run again with no override set, confirm the
  marker lands at today's default path
- [x] Cross-process consumer-match test (the adversarial-review-verified repro): with a DB-path
  override set (`SPEC_KIT_DB_DIR` or `MEMORY_DB_PATH`, the same override mechanism this repo
  already uses for the skill-advisor daemon), confirm the git hook's marker-write path and the
  daemon's marker-read path (`resolveMemoryDriftMarkerPath()`, `memory-drift-healing.ts:199-201`,
  called from `context-server.ts:2229-2230`) resolve to the same file, not just structurally
  similar paths (REQ-003)

### Phase 4: Verification
- [x] `bash validate.sh --strict` run, evidence captured
- [x] Documentation updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual/Shell | Stale-lock reclaim (pre-created old-mtime lock dir), fresh-lock non-reclaim, DB-path-override marker placement, no-override marker placement unchanged | Direct `git commit` against a scratch repo/worktree, matching `011`'s existing hook smoke discipline |
| Regression | `validate.sh --strict` sweep after implementation | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `memory-drift-marker.sh` (shipped by `011-automatic-drift-self-healing`) | Internal | Green (shipped, working) | Without it, there is no lock or marker-write logic to harden — this phase would have nothing to modify |
| `spec-folder-mutex.ts`'s reclaim pattern (precedent only, not a code dependency) | Internal | Green (shipped, working) | Without this precedent, F3 would need to design a reclaim strategy from scratch instead of mirroring a proven one |
| `getUncleanShutdownMarkerPath()` (precedent only, not a code dependency) | Internal | Green (shipped, working) | Without this precedent, F4 would need to independently justify the live-path-resolution approach instead of pointing at an already-shipped fix for the identical class of bug |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The stale-lock reclaim incorrectly breaks a lock still held by a live writer in
  production usage, or the live-path resolution produces a wrong directory under some untested
  env-var combination.
- **Procedure**: Both fixes live in one bash file with no schema or state migration — `git revert`
  the commit restores the exact prior hardcoded-path, no-stale-recovery behavior immediately, with
  no data-loss risk (the marker file itself is advisory, not authoritative data; Layer 3's
  full-sweep backstop continues to heal drift independent of Layer 2's health). No flag or config
  toggle is needed since a plain revert is sufficient for a single self-contained file.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (F3) ──► Phase 4 (Verify)
                └──► Phase 3 (F4) ──►
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | F3, F4 |
| F3 | Setup | Verify |
| F4 | Setup | Verify |
| Verify | F3, F4 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5-1 hour |
| F3 (stale-lock breaking) | Low-Med | 2-3 hours |
| F4 (live-path resolution) | Low-Med | 2-3 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **5.5-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] F3's staleness threshold confirmed comfortably above normal lock lifetime and the existing
  5-second wait budget before merge
- [x] F4's no-override path confirmed byte-identical to today's default before merge (REQ-004)

### Rollback Procedure
1. `git revert` the implementation commit — a single bash file, no dependent state to unwind
2. Confirm reverted behavior matches pre-fix hardcoded path and no-stale-recovery loop via the
   same shell smoke tests used to verify the fix
3. Re-run `validate.sh --strict` to confirm the revert restored expected baseline

### Data Reversal
- **Has data migrations?** No — no schema change, no new table/column, no marker-format change.
- **Reversal procedure**: Not applicable. A stray marker written under the new (correct) resolved
  path after a revert is harmless — it simply sits unconsumed until Layer 3's backstop or a manual
  scan picks up the underlying drift by other means.
<!-- /ANCHOR:enhanced-rollback -->
