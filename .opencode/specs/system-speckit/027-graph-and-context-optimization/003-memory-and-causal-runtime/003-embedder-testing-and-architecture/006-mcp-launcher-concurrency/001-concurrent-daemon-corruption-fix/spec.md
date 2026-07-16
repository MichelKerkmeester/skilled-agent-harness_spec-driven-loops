---
title: "Concurrent Daemon Corruption Fix — Single-Writer Lease at Launcher Boundary"
description: "Three concurrent skill-advisor daemons spawned ~1005 .corrupt SQLite quarantines in 6 hours. Lease scope is too narrow (watcher-role only). Hoist to launcher process and add WAL+busy_timeout defenses."
trigger_phrases:
  - "skill-advisor concurrent daemon"
  - "skill-graph sqlite corruption"
  - "single-writer lease launcher"
  - "advisor .corrupt files"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/001-concurrent-daemon-corruption-fix"
    last_updated_at: "2026-05-18T04:48:00Z"
    last_updated_by: "main_agent"
    recent_action: "Filed packet from root-cause diagnosis"
    next_safe_action: "Decide on implementation approach (lease-hoist vs WAL-only)"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lifecycle.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts"
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/database/.mk-skill-advisor-launcher.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-concurrent-daemon-corruption-fix"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Lease-hoist vs WAL-only vs both — which approach ships first?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Concurrent Daemon Corruption Fix

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-18 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-skill-advisor-documentation |
| **Successor** | None |
| **Handoff Criteria** | Single daemon writer enforced at launcher boundary; SQLite opens use WAL + busy_timeout; zero `.corrupt` files generated in a 24-hour soak with concurrent-launch attempts blocked. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the 006-skill-advisor track. Phases 1–5 (`001-skill-graph`, `002-skill-advisor-scoring-engine`, `003-skill-advisor-routing-engine`, `004-skill-advisor-production-hardening`, `005-skill-advisor-documentation`) built the advisor. This phase hardens its concurrency boundary, which `004-skill-advisor-production-hardening` did not cover.

**Scope Boundary**: changes are limited to the launcher + daemon-lifecycle + skill-graph DB open path. No scorer, schema, or query-surface changes.

**Dependencies**: none. The existing lease primitive in `lib/daemon/lease.ts` is reused; only its scope of effect is broadened.

**Deliverables**:
- Launcher exits cleanly when a sibling launcher is alive.
- Every DB open sets `PRAGMA journal_mode=WAL` and `PRAGMA busy_timeout=5000`.
- 24-hour soak with deliberate duplicate-launch attempts produces zero `.corrupt` files.

**Changelog**: when this phase closes, add `changelog/006-concurrent-daemon-corruption-fix.md` to the 006-skill-advisor parent changelog folder.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Between 2026-05-17 16:42 UTC and 22:51 UTC (~6 hours), the skill-advisor's `mcp_server/database/` accumulated **1005 `skill-graph.sqlite.<ms-timestamp>.corrupt` quarantine files** — a rate of ~167/hour. The on-disk diagnostic revealed three `mk-skill-advisor-launcher.cjs` processes running simultaneously (PIDs `86491` started Fri 3PM, `52320` Sat 2PM, `60515` Sat 4PM). All three shared the same `skill-graph.sqlite` file. Concurrent writes from `advisor_rebuild`, schema migrations, or daemon-side index work corrupted the file repeatedly; each subsequent open triggered `recoverMalformedDatabase()` (`lib/skill-graph/skill-graph-db.ts:224-236`), which renames the broken file to `.corrupt` and starts fresh. The cycle re-corrupts the new DB immediately. The corruption was amplified by a parallel benchmark hitting advisor surfaces.

The single-writer lease primitive exists (`lib/daemon/lease.ts`, documented in `references/daemon-lease-contract.md`) but its scope is too narrow. `lib/daemon/lifecycle.ts:43` only sets `daemonAvailable: lease.acquired` and continues the process when the lease is held by another. The launcher does not exit. MCP query handlers keep serving and can still issue writes.

### Purpose

A single skill-advisor daemon owns the SQLite file at any time. Sibling launchers detect the live owner, exit cleanly, and the `.corrupt` quarantine path becomes a real-bug indicator instead of a daily-noise stream.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Hoist the lease check to the launcher process boundary so a non-owner exits before opening the DB.
- Apply `PRAGMA journal_mode=WAL` + `PRAGMA busy_timeout=5000` at every DB open path.
- Add ignore for `*.corrupt` under `mcp_server/database/` (already landed in commit `f077225ae`).
- 24-hour soak with deliberate duplicate-launch attempts to prove zero `.corrupt` generation.
- Document the new launcher contract in `references/daemon-lease-contract.md` (update §2 to cover the launcher-level enforcement).

### Out of Scope

- Switching to a different concurrency model (e.g. shared connection pool, dedicated writer process via IPC) — would require IPC channel design; defer.
- Migrating to a non-SQLite store — out of phase; SQLite is appropriate at this corpus size.
- Changes to the scorer, router, or skill-graph schema — separate phases.
- Auto-killing duplicate daemons from the launcher — too destructive; the launcher should exit itself, not signal others.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify | Read `.mk-skill-advisor-launcher.json` for `pid`; if `kill -0 <pid>` succeeds, log + exit `0`. |
| `mcp_server/lib/daemon/lease.ts` | Modify | Expose `isLeaseHeld()` helper for the launcher to call before MCP server bootstrap. |
| `mcp_server/lib/daemon/lifecycle.ts` | Modify | When lease fails to acquire AND `MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER=1` (default true going forward), trigger `process.exit(0)` instead of degraded-mode continuation. |
| `mcp_server/lib/skill-graph/skill-graph-db.ts` | Modify | In `openDb()` (or equivalent init function), set `PRAGMA journal_mode=WAL` + `PRAGMA busy_timeout=5000`. |
| `references/daemon-lease-contract.md` | Modify | §2 — document launcher-level enforcement + WAL pragma. |
| `mcp_server/tests/launcher-bootstrap.vitest.ts` | Modify | Add test: spawn-then-spawn-again → second exits with code 0 and "LEASE_HELD_BY_OTHER" log. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Launcher refuses to start when a live sibling launcher is detected. | Spawning launcher #2 while #1 is alive: #2 exits with code 0 within 2 seconds, prints `LEASE_HELD_BY:<owner-pid>`, does NOT open the SQLite file. |
| REQ-002 | DB open sets WAL + busy_timeout. | `PRAGMA journal_mode` returns `wal` and `PRAGMA busy_timeout` returns `5000` after any handler-triggered DB open. |
| REQ-003 | No `.corrupt` files generated under expected operation. | 24-hour soak with default benchmark load produces zero `skill-graph.sqlite.*.corrupt` files. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Stale-PID launcher state is reclaimed. | If `.mk-skill-advisor-launcher.json` lists a PID that no longer exists, launcher #2 reclaims and starts. Log line: `staleReclaimed: true`. |
| REQ-005 | Existing tests still pass. | `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` + targeted vitest suites green. |
| REQ-006 | Reference doc updated. | `references/daemon-lease-contract.md §2` describes launcher-boundary enforcement + WAL pragma. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero `.corrupt` files generated during a 24-hour soak with the benchmark load active.
- **SC-002**: Attempting `node .opencode/bin/mk-skill-advisor-launcher.cjs` while a live owner exists exits with code 0 in <2s and never touches `skill-graph.sqlite`.
- **SC-003**: All three DB-open paths in the codebase (handler boot, watcher refresh, rebuild-from-source) set WAL + busy_timeout — verified by a vitest assertion that opens then reads the pragmas.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Hoisting the lease too aggressively breaks legitimate dev workflows (e.g. running tests with a separate launcher) | Med | Gate via `MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER` env var (default true). Tests set it false. |
| Risk | WAL mode requires the SQLite file's directory to be writable. CI environments with read-only mounts would break. | Low | Detect EACCES on WAL switch and fall back to `journal_mode=DELETE` with a logged warning. |
| Dependency | The existing lease primitive in `lib/daemon/lease.ts` is correct; we only widen its enforcement. | Low | If the primitive has bugs, fix them in this packet. |
| Risk | The benchmarking AI (running on packet 016 / 113) might still hold an old launcher PID. | Med | Document the kill-and-restart procedure in the packet's implementation-summary. Operator runs it manually before declaring complete. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `process.exit(0)` (graceful, looks-like-success) or `process.exit(1)` (signals "not me") be used when the lease is held? Lean `exit(0)` so MCP-config retry loops don't restart-storm.
- Does the watcher inside the winning daemon also benefit from WAL, or does it only read? Verify whether the watcher writes during freshness updates.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| NFR | Target | How Verified |
|-----|--------|--------------|
| Launcher-exit latency on lease-held | <2 seconds from spawn to exit code 0 | vitest timing assertion |
| Zero false-positive on liveness probe | `kill -0` only; no other signals issued | code grep + review |
| Backward compat with existing tests | All current advisor/daemon/skill-graph suites green | `vitest --run` summary |
| WAL fallback for read-only filesystems | EACCES on WAL switch → `journal_mode=DELETE` with logged warning | mocked test or manual verify |
| Soak result reproducibility | Zero `.corrupt` files over 24h with benchmark load | `find -name '*.corrupt'` after soak |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- **Stale PID in lease file.** `.mk-skill-advisor-launcher.json` lists a PID whose process is gone. → New launcher reclaims and logs `staleReclaimed: true`.
- **PID reuse collision.** OS recycles the recorded PID to an unrelated process (rare on macOS due to PID-space size). → `kill -0` returns success, new launcher exits silently. Acceptable false-negative; operator can `rm` the lease file to recover.
- **Lease file missing entirely.** No `.mk-skill-advisor-launcher.json`. → New launcher claims fresh, no exit.
- **Lease file corrupt JSON.** → New launcher reclaims as if stale, logs `staleReclaimed: true` with reason `corrupt-lease-file`.
- **Concurrent spawn race.** Two launchers spawn within 100ms of each other; both see no owner. → SQLite-level lock via the new WAL+busy_timeout absorbs the race for short windows; lease primitive must use atomic file write (already does per existing `lease.ts`).
- **Read-only `database/` directory** (CI sandbox). → WAL switch falls back to `journal_mode=DELETE` with warning. Test pass.
- **Symlink in DB path.** Launcher's standalone-storage guard already rejects external absolute paths; symlinks within workspace OK.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY

| Dimension | Score | Rationale |
|-----------|------:|-----------|
| Lines of code | 80–150 | Launcher CJS edit + 1 lib helper + pragma in DB-open + 1 vitest case |
| Files touched | 5–6 | launcher.cjs, lease.ts, lifecycle.ts, skill-graph-db.ts, daemon-lease-contract.md, launcher-bootstrap.vitest.ts |
| Cross-skill blast radius | Low | All edits inside `.opencode/skills/system-skill-advisor/`; no spec-kit / code-graph touches |
| Test surface | Medium | New spawn-twice test + WAL assertion + soak script |
| Reviewer hours | 1–2 | Single reviewer pass; logic is local and well-scoped |
| Risk of regression | Low | Lease primitive already tested; only its enforcement scope widens |
<!-- /ANCHOR:complexity -->
