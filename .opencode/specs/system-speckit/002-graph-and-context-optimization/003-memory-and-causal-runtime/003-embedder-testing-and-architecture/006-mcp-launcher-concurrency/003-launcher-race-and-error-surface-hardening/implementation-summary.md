---
title: "Lease Hardening From Review — Implementation Summary"
description: "9 P1 review findings closed via cli-codex gpt-5.5 high fast + main-agent Phase-9 race fix + Phase-10 changelog. 15 tests green, all typechecks clean."
trigger_phrases:
  - "008/008 implementation"
  - "lease hardening shipped"
  - "review remediation done"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/003-launcher-race-and-error-surface-hardening"
    last_updated_at: "2026-05-18T08:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Closed packet 008 with 9 P1 review fixes shipped"
    next_safe_action: "Commit packet 008 + push origin main"
    blockers: []
    key_files:
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-lease-hardening-from-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Dispatch shape — cli-codex gpt-5.5 high fast RCAF medium pre-plan"
      - "Phase 9 race fix — wait for lease pid to change from deadPid before reading new owner"
      - "P2s — 14 deferred to future packets, logged in changelog"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-launcher-race-and-error-surface-hardening |
| **Completed** | 2026-05-18 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

9 P1 review findings from the 3-reviewer audit of packets 006 + 007 are closed. The lease enforcement contract now holds under conditions the original code missed: different uid (EPERM is correctly treated as "lease held"), read-only filesystem (better-sqlite3's `SqliteError(code='SQLITE_READONLY')` now triggers the DELETE-mode fallback), fast double-spawn race (a re-probe after `writeLeaseFile()` catches the loser), and slow child shutdown in spec-memory (SIGTERM now waits for `child.on('exit')` instead of clearing the lease after a fixed 5s timer). Test isolation also tightened — host shell env vars no longer leak in, the spawn-twice exit assertion now gates on stdout-close, and skill-advisor gained a subprocess-level test mirroring 007's shape (closing the cross-skill coverage drift).

### Re-probe after lease write (REQ-001)

`mk-code-index-launcher.cjs` and `mk-spec-memory-launcher.cjs` now re-read the lease file immediately after writing it. If `parsed.pid !== process.pid`, the launcher emits `LEASE_HELD_BY:<winner>` and exits 0. Closes the race window where two launchers both pass the initial check and both write — atomic rename picks a winner, but the loser previously didn't know.

### SIGTERM child-exit handler (REQ-002, spec-memory)

The signal handler now attaches `childProcess.once('exit', () => { clearLeaseFile(); process.exit(128); })` before sending SIGTERM to the child. A 5s `setTimeout` escalates to SIGKILL if the child doesn't exit. Replaces the previous unconditional 5s timer that could clear the lease while the child was still flushing the SQLite WAL.

### Env-var helper parity (REQ-003)

A shared `isStrictModeDisabled(value)` helper is now defined in each of the 3 launchers. It accepts `0`, `false`, `FALSE`, `False`, `no`, `off`, and empty string as disabled values. Closes the surprise where `MK_*_STRICT_SINGLE_WRITER=no` silently kept strict mode enabled.

### EPERM → `held: true` (REQ-004)

`isLeaseHeld()` in `lease.ts` now handles `EPERM` as a separate branch alongside `ESRCH`. EPERM means the process exists but signal isn't permitted (different uid, or stricter signal ACLs) — logically the lease IS held, but the previous code re-threw, which the launcher catch swallowed, bypassing the guard.

### `busy_timeout` before `journal_mode` (REQ-005)

In `skill-graph-db.ts` `initDb()`, `db.pragma('busy_timeout = 5000')` now runs FIRST, before the `journal_mode = WAL` switch. The WAL switch itself is a write that needs the lock — setting busy_timeout after left the riskiest moment uncovered (0ms default wait).

### Broader EACCES predicate (REQ-006)

The catch in `initDb()` now matches `EACCES | EROFS | SQLITE_READONLY | SQLITE_CANTOPEN | SQLITE_IOERR_WRITE` before falling back to `journal_mode = DELETE`. The previous `EACCES`-only check missed better-sqlite3's actual error surface (`SqliteError(code='SQLITE_READONLY')`), so the DELETE-mode fallback was dead code for the case it claimed to handle.

### Stdout-close gate (REQ-007)

Both 007 test files now `await waitForStdoutClose(second)` before asserting `exit.code === 0` + `stdout.includes('LEASE_HELD_BY:')`. Closes the race where 'exit' could arrive before the final stdout flush. Test timeout bumped from 2s → 5s for cold-start headroom.

### Host env strip in `spawnLauncher` (REQ-008)

Both 007 test files' `spawnLauncher` helpers now delete `MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER`, `MK_CODE_INDEX_STRICT_SINGLE_WRITER`, `MK_SPEC_MEMORY_STRICT_SINGLE_WRITER` from the inherited env before merging test-specific values. Closes the silent inversion where a developer with these set in their shell would see different test outcomes.

### New skill-advisor subprocess test (REQ-009)

`.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts` is new — 285 lines, 3 cases mirroring 007: spawn-twice exit-0, dead-PID reclaim, env-var-disable. Uses `describe`-scoped arrays (not module-scoped, fixing a drift from 007) and a `createDeadPid()` helper that spawns-then-kills a child for guaranteed-dead PID (no PID-range scanning). Closes the coverage drift where skill-advisor had only in-process lease lib tests; no subprocess assertion. Phase-9 race: initial codex output had the test reading the pre-written deadPid before the launcher's stub server overwrote it; main agent patched with `waitFor(pid !== deadPid)` before reading the new owner.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify (+24) | Re-probe + env-var helper |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify (+59) | Re-probe + child-exit handler + env-var helper |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify (+8) | Env-var helper for parity |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts` | Modify (+5) | EPERM branch in isLeaseHeld() |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` | Modify (+7/-3) | Pragma order swap + broader EACCES predicate |
| `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` | Modify (+16) | Stdout-close gate + env strip |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts` | Modify (+16) | Same |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts` | Create (+289) | New subprocess test (3 cases) |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/changelog/003-launcher-race-and-error-surface-hardening.md` | Create (+115) | Changelog with upgrade notes + verification evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

cli-codex `gpt-5.5` with `-c model_reasoning_effort="high" -c service_tier="fast" --sandbox workspace-write` (continuing the pattern from 007). RCAF prompt, 10 phases with per-step acceptance + verification. Codex completed Phases 1-8 cleanly. Phase 9 (new skill-advisor test) hit a race where the stale-reclaim test read the pre-written deadPid before the launcher's stub server overwrote it; main agent patched with a `waitFor(pid !== deadPid)` gate. Main agent also authored Phase 10 (this changelog + this implementation-summary). All 4 vitest targets independently re-run after the patch — 15 tests total green.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Inline `isStrictModeDisabled()` helper in each launcher (not a shared `lib/`) | Three CommonJS launchers in different skills; introducing a shared module would couple them, contradicting the 007 inline-primitive decision. ~8 LOC duplication is acceptable. |
| `waitFor(pid !== deadPid)` fix for Phase-9 race (instead of refactoring `waitForLeaseOwner`) | Local fix; preserves the helper's "return the first non-null pid found" semantics for the other 2 tests. Adds 4 lines, no regression. |
| Stop codex on Phase 9 failure (per the prompt's stop-on-failure instruction) | Failure was a test fixture race, not a bug in shipped code. Main-agent patch is faster than re-dispatching codex with a corrected prompt. |
| Bump spawn-twice test timeout 2s → 5s (REQ-007 carrier) | Cold-start Node + npm-install lockfile race can push the second launcher past 2s on loaded CI. 5s leaves comfortable headroom without inflating the happy-path test cost (still <500ms typical). |
| Defer 14 P2 findings to future packets | None are correctness blockers; each is a hardening opportunity. Closing them all in one packet would balloon scope. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` | PASS — exit 0 |
| `npm --prefix .opencode/skills/system-code-graph run typecheck` | PASS — exit 0 |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` | PASS — exit 0 |
| `vitest --run launcher-lease` (skill-advisor, NEW) | PASS — 3 tests, 481ms |
| `vitest --run launcher-bootstrap` (skill-advisor, existing) | PASS — 6 tests, 171ms (no regression) |
| `vitest --run launcher-lease` (code-graph) | PASS — 3 tests, 367ms |
| `vitest --run launcher-lease` (spec-memory) | PASS — 3 tests, 367ms |
| Cross-launcher parity grep | `grep -c LEASE_HELD_BY .opencode/bin/mk-*-launcher.cjs` → skill-advisor:1, code-index:2 (orig + re-probe), spec-memory:2 (orig + re-probe). Byte-identical string contract preserved. |
| Strict spec validate | PASS — 0 errors, 1 advisory PRIORITY_TAGS warning |
| Scope discipline | All 9 modified files appear in spec.md §3 Files to Change. Zero drive-by edits. |
| Total test count delta | 12 (before) → 15 (after) across the 3 packages |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **14 P2 findings remain open** — logged in `changelog/008-lease-hardening-from-review.md` "P2 Findings Deferred" section. None are correctness blockers; each is a hardening opportunity.
2. **24-hour zero-zombie soak (carryover from 007 SC-002)** — still operator-deferred. The new launchers are now in place; the soak just needs wall-clock time across all 6 runtime configs.
3. **`recoverMalformedDatabase` quick_check timeout (P2 from review)** — `checkSqliteIntegrity` still runs with default 0ms `busy_timeout`. A transient lock during integrity probe can still false-positive into a `.corrupt` rename. The new lease guard reduces the probability (fewer concurrent writers), but the unguarded read path remains. Worth a small follow-on if `.corrupt` files appear again post-007/008.
4. **No EACCES-fallback test (P2 from review)** — broader predicate is wired, but no chmod-tempdir test asserts the `journal_mode = DELETE` branch fires. A regression that removes the fallback would not be caught by current test coverage. Easy follow-on.
5. **PID-reuse false-positive remains** — operator removes the lease file to recover. Could be mitigated with `startedAt` cross-check; deferred per spec §3 Out of Scope.
<!-- /ANCHOR:limitations -->
