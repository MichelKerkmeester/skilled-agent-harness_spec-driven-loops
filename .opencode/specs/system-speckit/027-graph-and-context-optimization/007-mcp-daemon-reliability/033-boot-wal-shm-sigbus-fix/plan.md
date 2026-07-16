---
title: "Implementation Plan: Boot-Time journal_mode Force-WAL SIGBUS Regression"
description: "Replace the unconditional 'force WAL on boot' health check with a DELETE-aware check, so the 2026-07-05 rollback-journal SIGBUS fix actually survives a full daemon restart. One-block logic fix, no native-layer change required."
trigger_phrases:
  - "boot wal shm sigbus fix plan"
  - "journal_mode force wal regression plan"
  - "delete-aware journal mode check"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/033-boot-wal-shm-sigbus-fix"
    last_updated_at: "2026-07-08T16:02:23Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored planning-only technical approach"
    next_safe_action: "Plan approval, then implement per Phase 2"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-033-boot-wal-shm-sigbus-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Boot-Time journal_mode Force-WAL SIGBUS Regression

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`mcp_server/context-server.ts`) |
| **Framework** | None (MCP stdio server + `better-sqlite3`) |
| **Storage** | SQLite (`better-sqlite3`), main DB + attached vector shard |
| **Testing** | vitest (`context-server.vitest.ts` databaseMock harness) |

### Overview
This is a one-block logic fix, not a native-layer change: `context-server.ts:2207-2213` reads
`PRAGMA journal_mode` right after `initializeDb()` and force-reverts anything that isn't `wal`
back to `WAL` — silently undoing the July 5 `journal_mode=DELETE` SIGBUS mitigation on every
single boot. The fix makes that check DELETE-aware: treat `DELETE` as the expected, deliberately
chosen state (no mutation), and only warn — never mutate — for any other unexpected mode. No
change is required to `vector-index-store.ts`'s DELETE-mode writers, `mmap_size`, or the
periodic `checkpointAllWal()` call; they already become correct/inert once this block stops
undoing them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md, grounded in `git show`/`git log -L`
  verification of commit `8807393bea` plus direct re-reads of all cited line numbers against the
  live tree)
- [x] Success criteria measurable
- [x] Dependencies identified (the July 5 DELETE-mode writers, confirmed unchanged and correctly
  placed)

### Definition of Done
- [x] `journalMode !== 'wal'` unconditional-force block replaced with a DELETE-aware check —
  implemented as `checkJournalMode(db)` in `startup-checks.ts`, called from `context-server.ts`
- [x] Regression test added and shown to fail red against the original (pre-fix) block — 5 new
  tests in `startup-checks.vitest.ts` (deviation from `context-server.vitest.ts`, see
  implementation-summary.md); 4/5 confirmed red against the reverted logic
- [x] Same-session restart-loop verification passed (`PRAGMA journal_mode` stays `delete`) — 3
  real warm restarts via a live MCP handshake against an isolated scratch DB
- [x] Docs updated (spec/plan/tasks); observational SIGBUS-monitoring caveat stated honestly, not
  claimed closed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Narrow a startup health check's failure condition; no new abstraction, no new call site.

### Key Components
- **`context-server.ts`'s post-`initializeDb()` health check** (`:2207-2213`): today, a leftover
  "T076-era" WAL-assertion check (unchanged since before commit `8807393bea`, confirmed via
  `git log -L 2204,2213:.../context-server.ts`) that predates the DELETE-mode decision and was
  never updated to reflect it. This plan updates its condition only — the surrounding
  `registerInitTasks` flow, `checkSqliteVersion()` call, and everything downstream are untouched.
- **`vector-index-store.ts`'s DELETE-mode writers** (`:817`, `:1575`, `:2130`, unchanged): the
  intended fix this plan protects. Confirmed correct and unmodified by this plan.
- **`checkpointAllWal()`** (`vector-index-store.ts:2325-2329`, called every 300s from
  `context-server.ts:2483`, unchanged): already try/catch-wrapped best-effort; becomes an inert
  no-op once `journal_mode` stably stays `DELETE` (SQLite's `wal_checkpoint` pragma is documented
  as a no-op against a non-WAL database). No functional risk from leaving it as-is; see Open
  Questions for the optional cleanup.

### Data Flow
`initializeDb()` (sets `journal_mode = DELETE` on the main DB + attached vector shard, per the
July 5 fix) → the post-init health check reads `PRAGMA journal_mode`, sees `delete`, and — after
this fix — takes no action (today it silently reverts to `WAL`) → boot proceeds with the
database still in the SIGBUS-safe rollback-journal mode for its entire lifetime, instead of only
for the few milliseconds between `initializeDb()` returning and this check running.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `context-server.ts:2207-2213` (post-init health check) | Unconditionally force-reverts any non-`wal` journal_mode to `WAL` | Update: DELETE-aware condition, warn-only for other modes | New regression test + live `PRAGMA journal_mode` restart-loop |
| `vector-index-store.ts` DELETE-mode writers (`:817`,`:1575`,`:2130`) | Set `journal_mode = DELETE` at three init/rebuild/restore call sites | Unchanged — this plan's entire point is to stop something else from undoing them | Confirmed present/correct via direct read at plan time; no diff expected here |
| `checkpointAllWal()` / 300s interval (`context-server.ts:2483`) | Periodic `wal_checkpoint(TRUNCATE)`, currently exercising the SIGBUS-exposed truncate-vs-mmap'd-reader race because WAL gets re-forced | Unchanged in this pass (becomes inert once the force-WAL block is fixed); optional interval-skip guard noted as a deferred cleanup | Inspection only; no test changes planned unless the optional cleanup is taken |

Required inventories:
- All `journal_mode` pragma call sites: `rg -n "journal_mode" .opencode/skills/system-spec-kit/mcp_server` — confirms exactly 4 writers (`:817`,`:1575`,`:2130` DELETE, `:2211` the one this plan fixes) and one reader (`:2208`) on the current tree.
- Consumers of the DB connection this check runs against: the same singleton returned by `vectorIndex.getDb()`/`initializeDb()` — no other component re-reads or re-asserts journal_mode elsewhere in the boot path (confirmed via the same grep).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-confirm the current call graph (`journal_mode` writers/readers) against the working
  tree immediately before implementation, in case a concurrent session has touched
  `context-server.ts` or `vector-index-store.ts` since this plan was written
- [ ] Re-confirm commit `8807393bea`'s intent and diff via `git show 8807393bea` (already done
  at plan time; re-verify only if the file has since changed)

### Phase 2: Core Implementation
- [ ] Replace `context-server.ts:2207-2213`'s unconditional force-WAL block with a check that
  treats `delete` as valid (no mutation) and warns (does not mutate) on any other unexpected
  mode
- [ ] Add a durable-WHY comment explaining the SIGBUS mechanism this deliberately avoids
  reintroducing, without embedding any spec/packet/commit id

### Phase 3: Verification
- [ ] Add the REQ-004 regression test to `context-server.vitest.ts`; confirm it fails red
  against a stashed/reverted copy of the original block, then passes against the fix
- [ ] Start the daemon fresh and warm-restart it multiple times, running `PRAGMA journal_mode`
  after each boot to confirm it reads `delete` every time
- [ ] Run the full boot-path regression set — `context-server.vitest.ts`, plus
  `launcher-*.vitest.ts` — to confirm no shared-state regression from this change
- [ ] `validate.sh --strict` for this packet
- [ ] Document the SIGBUS-monitoring window as ongoing/observational in
  `implementation-summary.md`, not as a closed success criterion
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Boot health check never calls `.pragma('journal_mode = WAL')` when the mocked pragma returns `delete`; still warns (no mutation) on an unexpected third value | vitest, existing databaseMock harness |
| Regression | Full `context-server.vitest.ts` + `launcher-*.vitest.ts` suites, unmodified tests must remain green | vitest |
| Live/manual | Multiple warm daemon restarts, `PRAGMA journal_mode` read after each | Manual, real daemon process |
| Observational (post-deploy, not same-session) | Crash-report monitoring for new `walIndexReadHdr` SIGBUS entries | `~/Library/Logs/DiagnosticReports/node-*.ips` inspection over subsequent days |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Commit `8807393bea` DELETE-mode writers | Internal | Green | This packet is moot without them; confirmed present and unchanged at plan time |
| `context-server.vitest.ts` databaseMock harness | Internal | Green | Reused unchanged as the test scaffold for the new regression case |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the DELETE-aware check itself misbehaves (e.g., an unforeseen caller genuinely
  depends on the boot-time force-WAL side effect) or the regression test proves flaky against
  real boot timing.
- **Procedure**: `git revert` the `context-server.ts` change. This reverts to the current,
  known-buggy-but-documented state (force-WAL on every boot); no daemon/DB state involved, no
  data migration.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
