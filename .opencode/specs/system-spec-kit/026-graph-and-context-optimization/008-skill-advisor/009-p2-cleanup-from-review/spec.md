---
title: "P2 Cleanup From Review — Close All 14 Deferred Findings"
description: "Close every P2 finding from the 3-reviewer audit of 006+007: diagnostics, signal coverage, readonly probe, DELETE-mode log, integrity-check timeout, test hygiene. No deferrals."
trigger_phrases:
  - "008/009 p2 cleanup"
  - "review remediation all p2"
  - "close all deferred findings"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/009-p2-cleanup-from-review"
    last_updated_at: "2026-05-18T08:42:00Z"
    last_updated_by: "main_agent"
    recent_action: "Filed packet for all 14 P2 review findings"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high fast for implementation"
    blockers: []
    key_files:
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/freshness/sqlite-integrity.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-p2-cleanup-from-review"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Scope — all 14 P2s; no deferrals per operator directive"
      - "Approach — mechanical fixes (1-30 lines each); one design choice (MK_*_DB_DIR override) documented in references"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# P2 Cleanup From Review

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-18 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-lease-hardening-from-review |
| **Successor** | None |
| **Handoff Criteria** | All 14 P2 review findings closed with evidence; existing 15 tests still pass; new coverage tests pass; strict validate PASS. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

**Phase 9** of the 008-skill-advisor track. Operator directive: "don't defer anything" — close every P2 from the 3-reviewer audit that 008 deferred. None are correctness blockers; collectively they tighten diagnostics, signal coverage, and test discrimination.

**Scope boundary** — same files as 006/007/008 plus `sqlite-integrity.ts` (touched for one P2). Out of scope: new infrastructure, architectural redesign.

**Dependencies** — none.

**Deliverables**:
- Diagnostics: `LEASE_HELD_BY:<pid> startedAt=<iso>` line in all 3 launchers
- Signal coverage: SIGQUIT + uncaughtException cleanup hooks in all 3 launchers
- `lib/daemon/lease.ts` readonly-probe path for `isLeaseHeld()` (no schema mutation on every probe)
- DELETE-mode warn message names the concurrency tradeoff
- `checkSqliteIntegrity` sets `busy_timeout=5000` before `quick_check`
- code-index `stateFile` write removed (collided with lease file)
- `references/daemon-lease-contract.md` documents `MK_*_DB_DIR` override constraint
- Test hygiene: launcher path constants exported + imported; terminate try/catch for SIGKILL race; stale-reclaim assert tightened; findDeadPid uses spawn-then-kill child; new clean-exit test asserts PID file removed
- Timing margin: bump spawn-twice timeout 5s → 8s for loaded CI

**Changelog**: `008-skill-advisor/changelog/009-p2-cleanup-from-review.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 3-reviewer audit of packets 006+007 surfaced 14 P2 findings — none blockers, each a hardening opportunity. Operator directive: close all of them. Themes: PID-reuse triage needs `startedAt` in stdout, atypical exit signals (SIGQUIT, uncaughtException) leak lease files, `isLeaseHeld()` probe path opens+mutates+closes the SQLite lease DB on every call (overhead + lock-thrash risk), DELETE-mode fallback log doesn't communicate the concurrency tradeoff, `checkSqliteIntegrity` still runs with 0ms `busy_timeout` so the auto-quarantine path can still false-positive, code-index has a vestigial `stateFile` write that briefly collides with the lease file, `MK_*_DB_DIR` override can disconnect lease check from DB write (must be documented), and 6 test-hygiene gaps (loose substring assert, PID range scan, missing clean-exit assertion, hardcoded path constants, terminate zombie path, tight CI timing).

### Purpose

Tightest possible diagnostics, signal coverage, and test discrimination across the 3 MCP launchers. No outstanding P2s after this packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

14 P2 findings, fixed inline. Files listed in the change table.

### Out of Scope

- Architectural redesign (no new lib modules; no shared lease primitive).
- Lease-file schema changes beyond emitting existing `startedAt`.
- Refactoring `recoverMalformedDatabase` itself (only its read-path integrity check).
- Hardening `MK_*_DB_DIR` to fail-closed in strict mode (documented as known constraint; design decision deferred to its own packet if ever needed).

### Files to Change

| File Path | Change Type | P2 Address |
|-----------|-------------|-----------|
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify | A1 (startedAt), A2 (SIGQUIT/uncaughtException) |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify | A1, A2, A4 (stateFile collision) |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | A1, A2 |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts` | Modify | B1 (readonly probe path) |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/freshness/sqlite-integrity.ts` | Modify | B4 (`busy_timeout=5000` before `quick_check`) |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` | Modify | B3 (DELETE-mode warn message) |
| `.opencode/skills/system-skill-advisor/references/daemon-lease-contract.md` | Modify | A3 (document `MK_*_DB_DIR` constraint) |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts` | Modify | C-stale-substring, C-findDeadPid, C-clean-exit-test, C-terminate-race, C-timing-margin |
| `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` | Modify | Same C-* set |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts` | Modify | Same C-* set |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/changelog/009-p2-cleanup-from-review.md` | Create | Changelog |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `LEASE_HELD_BY:<pid> startedAt=<iso>` in all 3 launchers | All 3 launcher stdout shapes match the new format. Existing assertions still pass (they use `.includes('LEASE_HELD_BY:')`). |
| REQ-002 | SIGQUIT + uncaughtException cleanup in all 3 launchers | New signal handlers added alongside SIGTERM/SIGINT/SIGHUP; uncaughtException clears lease then re-throws. |
| REQ-003 | `isLeaseHeld()` opens lease DB readonly | `openLeaseDatabase` called with `{ readonly: true, fileMustExist: true }`; ENOENT → returns `{held: false}` directly; no schema mutation on every probe. |
| REQ-004 | `checkSqliteIntegrity` sets busy_timeout | Function applies `db.pragma('busy_timeout = 5000')` before `PRAGMA quick_check`. |
| REQ-005 | code-index `stateFile` collision removed | Either rename `stateFile` to a separate path, OR remove the intermediate `writeState({command, start, end, status, actions, server})` payload entirely (status info goes through `log()` instead). |
| REQ-006 | DELETE-mode warn message expanded | Warn now includes `Concurrent readers may stall during writes; performance degraded vs WAL mode.` |
| REQ-007 | `references/daemon-lease-contract.md` documents `MK_*_DB_DIR` constraint | New §6 (or extension of existing section): override disconnects lease check from DB write; operators using overrides must coordinate or accept the risk. |
| REQ-008 | Test stale-reclaim assertion tightened | Match a more discriminative substring or anchored regex (e.g., line start + `staleReclaimed: true` + lookahead) across all 3 tests. |
| REQ-009 | `findDeadPid` replaced with spawn-then-kill helper | Helper spawns `node -e 'setInterval(() => {}, 1000);'` then `kill('SIGTERM')`, awaits exit, returns the pid. Same approach across all 3 test files. |
| REQ-010 | New test case: clean-exit removes PID file | Spawn launcher → wait for lease pid match → SIGTERM → wait for exit → assert `!existsSync(leaseFilePath)`. Added to all 3 test files. |
| REQ-011 | `terminate()` SIGKILL race wrapped in try/catch | Second `waitForExit` (post-SIGKILL) wrapped so an exception doesn't fail teardown across all 3 test files. |
| REQ-012 | Spawn-twice timeout 5s → 8s | All spawn-twice cases across the 3 test files. |
| REQ-013 | Test launcher path constants exported | Production-relative path constants exported from the launcher (or a shared lib) and imported in tests, OR explicit comment marking them as test fixtures. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-014 | All existing tests still pass | `vitest --run` exits 0 across all 3 packages; 15 existing tests still green. |
| REQ-015 | New test cases pass | 3 new clean-exit cases (one per test file); total test count → 18 (15+3). |
| REQ-016 | Typecheck clean | All 3 `npm run typecheck` invocations exit 0. |
| REQ-017 | Strict spec validate green | `validate.sh --strict` returns 0 errors. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 14 P2 findings closed with evidence.
- **SC-002**: Test count goes 15 → 18.
- **SC-003**: No new P3+ findings introduced (verify by re-running the 3-reviewer audit pattern would not surface new gaps in the touched files).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `startedAt=<iso>` breaks existing assertions | Low | Existing tests use `.includes('LEASE_HELD_BY:')` (substring), so adding a suffix is backward-compat. |
| Risk | readonly probe path silently fails on first launch (no lease file yet) | Low | `fileMustExist: true` → ENOENT → handled as `{held: false}`. |
| Risk | uncaughtException handler swallows errors | Med | Handler clears lease THEN re-throws, preserving Node's default crash semantics. |
| Risk | spawn-then-kill helper races (kill before pid available) | Low | `await child.once('spawn')` first, then read `child.pid`, then kill. |
| Risk | DELETE-mode warn message change confuses log consumers | Low | Additive only; old substring still present. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| NFR | Target | How Verified |
|-----|--------|--------------|
| Probe overhead reduction | `isLeaseHeld()` no longer triggers `PRAGMA journal_mode=WAL` + CREATE TABLE IF NOT EXISTS on every call | code review; integration smoke |
| Signal coverage | All 3 launchers handle SIGTERM/SIGINT/SIGHUP/SIGQUIT/uncaughtException | manual signal-by-signal probe across 3 launchers |
| Test discrimination | Stale-reclaim assert would fail if regression changes log line format | code review + intentional log-format mutation test |
| Cross-launcher parity | LEASE_HELD_BY format byte-identical across 3 launchers | `grep -A0 'LEASE_HELD_BY' .opencode/bin/mk-*-launcher.cjs` shows identical format string |
| Spec doc consistency | `daemon-lease-contract.md` references the `MK_*_DB_DIR` override constraint | grep for the new section heading |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- **First-ever launch (no lease file)** — readonly probe gets ENOENT → returns `{held: false}` directly. Bypass schema check, no overhead.
- **uncaughtException during lease write** — handler clears lease, re-throws, Node default-crashes with non-zero exit.
- **SIGQUIT (Ctrl-\\)** — same path as SIGTERM/SIGINT: clear lease, exit 128.
- **spawn-then-kill helper's child outlives `await child.once('spawn')`** — `child.pid` is set; `child.kill('SIGTERM')` always succeeds.
- **Test-host has `MK_*_STRICT_SINGLE_WRITER=0` set** — already handled by REQ-008 in 008/008.
- **Clean-exit test on a slow CI** — increase timeout if needed; assert is just `!existsSync(leaseFilePath)` post-exit.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY

| Dimension | Score | Rationale |
|-----------|------:|-----------|
| Lines of code | 250-400 | 14 fixes, most 2-5 LOC; 3 new test cases ~40 LOC each |
| Files touched | 10 | 3 launchers + 3 TS files + 3 test files + 1 ref doc + 1 changelog |
| Cross-skill blast radius | Low | Same files as 006/007/008 + sqlite-integrity.ts |
| Test surface | Medium | 18 tests after this packet (15 + 3 new) |
| Reviewer hours | 1-2 | Mechanical; high evidence quality from 3-reviewer audit |
| Risk of regression | Low | All changes additive or narrowly scoped; existing tests should pass unchanged |
<!-- /ANCHOR:complexity -->
