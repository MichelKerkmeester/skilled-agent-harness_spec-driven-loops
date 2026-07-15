---
title: "Feature Specification: Boot-Time journal_mode Force-WAL SIGBUS Regression"
description: "A T076-era startup health check in context-server.ts silently reverts the deliberate journal_mode=DELETE fix (commit 8807393bea) back to WAL on every daemon boot, re-exposing the WAL/mmap'd -shm SIGBUS class that fix was written to close."
trigger_phrases:
  - "boot wal shm sigbus fix"
  - "journal_mode force wal regression"
  - "walIndexReadHdr sigbus"
  - "journal_mode was not WAL forcing WAL mode"
  - "post-crash integrity probe sigbus"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/033-boot-wal-shm-sigbus-fix"
    last_updated_at: "2026-07-08T18:45:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented and live-verified the journal_mode boot check"
    next_safe_action: "None required; SC-003 SIGBUS monitoring stays observational"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/startup-checks.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-033-boot-wal-shm-sigbus-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should the now-inert 300s checkpointAllWal() interval (context-server.ts:2483) be guarded to skip the wal_checkpoint pragma call once journal_mode stays DELETE, or left as harmless best-effort dead weight?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Boot-Time journal_mode Force-WAL SIGBUS Regression

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-08 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Background: related prior art (do not duplicate)
This packet's parent (`007-mcp-daemon-reliability`) has 32 prior children covering daemon
lifecycle, lease/reap, and boot-integrity bugs. This packet and its sibling
`034-rebuild-sentinel-corruption-handling` were both opened from the same test pass and share
a boot-time-database-reliability theme, but they are independent root causes with no
overlapping mechanism — this one is a single PRAGMA contradiction fully contained in a ~7-line
block; 034 is an error-handling/sentinel-design gap spanning three files. They are documented
as separate packets rather than merged (see 034's spec.md Background section for the full
non-overlap rationale).

**Commit `8807393bea`** (2026-07-05, "fix(spec-memory): use rollback journal to stop WAL -shm
SIGBUS") set `journal_mode = DELETE` on the main DB and the attached vector shard specifically
to avoid a WAL-mode `-shm` mmap fault. Confirmed via `git show --stat 8807393bea`: it touched
only `lib/search/vector-index-store.ts` (+8/-3 lines) and its commit message states verbatim:
*"WAL mode memory-maps a -shm index that intermittently faults (SIGBUS, FS pagein error 22) in
walIndexReadHdr on this macOS + better-sqlite3 build, crashing the daemon stochastically during
heavy indexing. Switch the main DB and attached vector shard to journal_mode=DELETE, which uses
no shared-memory mapping."* Confirmed the three DELETE-mode writers are real and correctly
placed on the current tree: `vector-index-store.ts:817` (attached vector schema), `:1575`
(vector shard rebuild path), `:2130` (checkpoint restore path) — all set `journal_mode = DELETE`,
and `:819`/`:2134` set a plain (non-`-shm`) `mmap_size`.

### Problem Statement
A boot-time health check in context-server.ts silently reverts the deliberate journal-mode-DELETE fix back to WAL on every daemon restart, re-exposing the WAL/mmap'd -shm SIGBUS class that fix was written to close.

This older, unrelated startup health check — confirmed unchanged by commit `8807393bea` via
`git log -L 2204,2213:.../context-server.ts` (its logic predates that commit and was never
touched by it) — runs immediately after `initializeDb()` and **unconditionally reverts
`journal_mode` back to `WAL`** whenever it finds anything other than `wal`:

```ts
// context-server.ts:2207-2213 (current tree, re-read and line-confirmed 2026-07-08)
// Verify WAL mode is active for operational concurrency guarantees.
const walRow = database.prepare('PRAGMA journal_mode').get() as { journal_mode?: string } | undefined;
const journalMode = String(walRow?.journal_mode ?? '').toLowerCase();
if (journalMode !== 'wal') {
  database.pragma('journal_mode = WAL');
  console.warn('[context-server] journal_mode was not WAL; forcing WAL mode');
}
```

`database` here is the same singleton connection (`vectorIndex.getDb()`) returned by the same
`initializeDb()` call that just set `DELETE` moments earlier in the same boot. So on **every
single daemon start**, the main DB is flipped straight back into the exact SIGBUS-exposed
WAL/mmap'd-`-shm` path the July 5 commit tried to close — with `mmap_size=268435456` (line
2134) still set from the DELETE-mode init block, and a periodic `checkpointAllWal()`
(`context-server.ts:2483` → `vector-index-store.ts:2325-2329`, `wal_checkpoint(TRUNCATE)` every
300s per daemon process) now running uncoordinated across every concurrent Claude
Code/OpenCode process sharing the same file — the classic truncate-vs-mmap'd-reader race, only
reachable because this block re-opens the exposure DELETE mode had closed.

**Evidence this is a live, not theoretical, exposure:** of 5 recent crash reports reviewed by
the source investigation, `node-2026-07-01-174410.ips` is a confirmed SIGBUS whose faulting
thread (thread 0, main) matches exactly: `_platform_memmove ← walIndexReadHdr ←
walTryBeginRead ← sqlite3PagerSharedLock ← btreeBeginTrans ← sqlite3VdbeExec ← sqlite3_step ←
Statement::JS_get`, subtype "FS pagein error: 22 Invalid argument" — a synchronous `.get()`
faulting while reading the WAL-index (`-shm`) header. (The 4 other reviewed reports that same
day were `SIGQUIT`/`EXC_CRASH` hang-kills during dyld/V8 startup, unrelated to this bug — noted
so they are not conflated with the SIGBUS class this packet fixes.)

### Purpose
Make the July 5 DELETE-mode fix actually hold across a full daemon boot by no longer treating
`DELETE` as an error condition to silently correct — closing the self-defeating loop where the
codebase fixes this bug and then undoes its own fix on every restart.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the unconditional `if (journalMode !== 'wal') { forceWAL() }` block
  (`context-server.ts:2207-2213`) with a check that treats `DELETE` (the deliberately-chosen
  rollback journal mode) as the valid/expected state, and only *warns* — never force-switches to
  WAL — for any other, truly unexpected mode.
- A durable-WHY code comment on the replaced block, citing the WAL/`-shm` SIGBUS class by
  mechanism (not by commit hash or spec/packet id, per this repo's comment-hygiene rule) so a
  future contributor does not reintroduce this exact regression by "fixing" journal_mode back to
  WAL again.
- A focused regression test (new `it(...)` in the existing `context-server.vitest.ts`
  databaseMock harness) asserting: given a mocked `PRAGMA journal_mode` result of `'delete'`,
  `database.pragma('journal_mode = WAL')` is never called.
- Two-part verification: (a) same-session — start/restart the daemon, run `PRAGMA journal_mode`
  after each boot, confirm it reads `delete` and never reverts to `wal`; (b) observational,
  documented as ongoing rather than closed — monitor crash reports for new `walIndexReadHdr`
  SIGBUS entries over the days following deploy.

### Out of Scope
- Any change to `vector-index-store.ts`'s DELETE-mode writers (`:817`, `:1575`, `:2130`) — they
  are already correct; this packet only stops something else from undoing them.
- Widening/removing the periodic `checkpointAllWal()` call (`context-server.ts:2483`) — it
  becomes an inert, already-try/catch-wrapped no-op once journal_mode stays DELETE (SQLite
  documents `wal_checkpoint` as a no-op on a non-WAL database); an optional interval-skip
  micro-optimization is noted as an open question, not required for this fix.
- `034-rebuild-sentinel-corruption-handling`'s sentinel/error-handling gap — a distinct root
  cause, sibling packet.
- Any change to `checkSqliteVersion()` or other unrelated startup health checks in the same
  function.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | Replace the unconditional force-WAL block (`:2207-2213`) with a DELETE-aware check |
| `.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts` | Modify | Add a dedicated regression test for the DELETE-mode boot path (today only incidentally covered by a generic `'wal'`-returning boot mock) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The boot-time journal-mode check no longer force-switches `journal_mode` back to `WAL` when it finds the deliberately-chosen `DELETE` mode. | With `DELETE` set at init (per `vector-index-store.ts:817`/`:1575`/`:2130`), `database.pragma('journal_mode = WAL')` is never invoked during boot; `PRAGMA journal_mode` continues to read `delete` immediately after the check runs. |
| REQ-002 | Any journal_mode other than the two known-valid values (`delete`, the deliberate choice, and `wal`, a legacy/back-compat allowance) still produces an explicit warning log — visibility is preserved even though the forced mutation is removed. | A boot with a mocked/unexpected journal_mode (e.g., `'truncate'`) logs a warning and does not call `.pragma('journal_mode = WAL')`. |
| REQ-003 | A durable-WHY comment explains why WAL is deliberately not forced, without embedding spec/packet/commit ids (comment-hygiene rule). | Code review of the diff finds no spec path, packet number, ADR/REQ/task id, or commit hash inside the comment. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A regression test encodes the contract directly, so it fails red if the old unconditional-WAL-force logic is reintroduced. | New `context-server.vitest.ts` test: given a `journal_mode: 'delete'` boot mock, assert the WAL-forcing pragma call is never made; test fails when run against a reverted (pre-fix) copy of the block. |
| REQ-005 | Post-deploy verification is explicitly split into a same-session check (closed) and an observational check (ongoing), never conflated. | `implementation-summary.md` states the `PRAGMA journal_mode` restart-loop result as confirmed, and states the crash-report monitoring window as inferred/observational with an explicit "not yet observed over N days" caveat until it actually has been. |

### Acceptance Criteria (Given/When/Then)

- **Given** a fresh boot where `journal_mode` was set to `delete` at init time, **When** the
  post-init health check runs, **Then** `database.pragma('journal_mode = WAL')` is never invoked
  and `PRAGMA journal_mode` continues to report `delete`.
- **Given** a boot where `journal_mode` is unexpectedly neither `delete` nor `wal` (e.g., a
  mis-set pragma from an unrelated code path), **When** the health check runs, **Then** it logs
  an explicit warning but does not force a pragma change.
- **Given** the regression test's guard is reverted to the original unconditional-force logic,
  **When** the same test runs, **Then** it fails red — proving the test actually discriminates
  fixed vs. unfixed behavior, not just asserts presence of a code path.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A full daemon boot sequence — cold start through the post-init health check —
  leaves `journal_mode = delete`, confirmed via `PRAGMA journal_mode` immediately after boot
  completes, across multiple consecutive warm restarts.
- **SC-002**: The new regression test (REQ-004) passes on the fixed code and fails red against
  the original unconditional-force block.
- **SC-003** *(observational, not same-session-closeable)*: no new SIGBUS crash reports
  attributable to `walIndexReadHdr` appear in the days following deploy. Treated as
  inferred-until-observed at close-out, per this repo's Iron Law (no completion claims beyond
  what was verified).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Verification of the actual crash-fix outcome is inherently observational — "no new SIGBUS reports" can only be confirmed over subsequent days of real usage, not in the same implementation session. | Med | State explicitly as inferred/ongoing in `implementation-summary.md`; do not claim SC-003 closed without a dated observation window. |
| Risk | An undiscovered code path elsewhere still assumes WAL mode and silently degrades under DELETE. | Low | DELETE has been the active init-time choice for the main DB + vector shard since 2026-07-05 (`8807393bea`); this fix only stops something else from reverting it, it does not change what mode is chosen at init. |
| Dependency | Commit `8807393bea`'s DELETE-mode writers (`vector-index-store.ts:817`,`:1575`,`:2130`) must remain in place and unchanged. | Low | Out of scope for this packet to modify; confirmed present and correctly placed at spec time. |
| Risk | This packet and `context-server.ts`'s boot sequence are shared with an already-shipped neighbor (`032-boot-integrity-rebuild-maintenance-marker`) and an extensive launcher test suite. | Low | Re-run the full boot-path test suite (`context-server.vitest.ts`, `launcher-*.vitest.ts`) as the regression gate for this change, not just the new/changed test. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the now-inert 300s `checkpointAllWal()` interval (`context-server.ts:2483`) be guarded
  to skip the `wal_checkpoint` pragma call once `journal_mode` stays `DELETE` (SQLite documents
  this as a harmless no-op on a non-WAL database, and the call is already try/catch-wrapped
  best-effort), or is the wasted call every 5 minutes acceptable dead weight not worth the extra
  diff? Deferred to `plan.md` as an optional, non-blocking cleanup.
<!-- /ANCHOR:questions -->
