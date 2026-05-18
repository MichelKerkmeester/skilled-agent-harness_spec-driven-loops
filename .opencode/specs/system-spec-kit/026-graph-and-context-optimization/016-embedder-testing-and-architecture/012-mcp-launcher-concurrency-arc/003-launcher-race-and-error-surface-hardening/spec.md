---
title: "Lease Hardening From Review — 9 P1 Findings Across 006+007"
description: "Address 9 P1 review findings: launcher check-and-write race, EPERM mishandling, EACCES error-surface mismatch, env-var parsing, child SIGTERM ordering, test isolation, layer drift."
trigger_phrases:
  - "008/008 lease hardening"
  - "review remediation 006 007"
  - "P1 launcher race fix"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/012-mcp-launcher-concurrency-arc/003-launcher-race-and-error-surface-hardening"
    last_updated_at: "2026-05-18T08:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Filed packet for 9 P1 review findings from 006+007"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high fast for implementation"
    blockers: []
    key_files:
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-lease-hardening-from-review"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Scope — 9 P1s, skip 14 P2s"
      - "Approach — inline mechanical fixes; no architectural change"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Lease Hardening From Review

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-18 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-cross-launcher-lease-propagation |
| **Successor** | None |
| **Handoff Criteria** | 9 P1 findings closed with evidence; both existing test suites still pass; new skill-advisor subprocess test added; strict validate PASS. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the 008-skill-advisor track, addressing P1 findings from the 3-reviewer parallel audit of packets 006 and 007. The shipped code works on the happy path (typecheck + 9 vitest tests + manual probes all PASS), but reviewers surfaced 9 latent correctness gaps. This packet closes them.

**Scope boundary** — fixes are mostly mechanical (5 are 2-4 line changes); two larger items are the spec-memory SIGTERM ordering refactor and the new skill-advisor subprocess test file. Out of scope: 14 P2 findings (logged as known issues), architectural redesign, schema changes.

**Dependencies** — none. All changes inline in files already touched by 006 + 007.

**Deliverables**:
- Re-probe after write in code-graph + spec-memory launchers (race close)
- SIGTERM child-exit handler in spec-memory launcher (replace 5s unconditional timeout)
- Env-var parsing consistency across all 3 launchers
- EPERM → `held: true` in lease.ts `isLeaseHeld()`
- `busy_timeout` set BEFORE `journal_mode = WAL` in skill-graph-db.ts
- Broaden EACCES predicate to include SqliteError codes
- Stdout-close gate before exit assertion in spawn-twice tests
- Strip `MK_*_STRICT_SINGLE_WRITER` from inherited env in spawnLauncher helpers
- New `launcher-lease.vitest.ts` for skill-advisor mirroring 007 shape

**Changelog**: `016-embedder-testing-and-architecture/012-mcp-launcher-concurrency-arc/changelog/003-launcher-race-and-error-surface-hardening.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 006 + 007 packets shipped working lease enforcement, but reviewers identified 9 P1 correctness gaps clustered in three themes: (1) **race-window correctness** — code-graph and spec-memory launchers can both pass the lease check then race the write, the SIGTERM handler in spec-memory clears the lease 5s after signal regardless of whether the child has exited, and env-var parsing accepts `'no'`/`'off'`/`'FALSE'`/empty as "enabled"; (2) **error-surface correctness** — `isLeaseHeld()` re-throws EPERM (different uid → guard bypass), `busy_timeout=5000` is set AFTER `journal_mode=WAL` (the WAL switch race is unprotected), and the EACCES catch in skill-graph-db.ts misses `SqliteError(code='SQLITE_READONLY')` so the DELETE-mode fallback is dead code for the case it claims to handle; (3) **test isolation** — spawn-twice asserts depend on stdout arriving before the 'exit' event, env vars leak from host shell, and skill-advisor has no subprocess spawn-twice test (only in-process lease lib test).

### Purpose

Close the 9 P1s in one focused pass so the lease enforcement contract holds under adversarial conditions (different uid, read-only mount, fast double-spawn, slow child shutdown) — not just the happy path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Race-window fixes (3 launchers)**: re-probe lease after write; replace spec-memory SIGTERM 5s unconditional timeout with `child.on('exit')` handler + SIGKILL backstop; unify env-var parsing helper across all 3 launchers.
- **Error-surface fixes (TS)**: EPERM → `held: true` in `isLeaseHeld()`; swap pragma order to `busy_timeout` before `journal_mode`; broaden EACCES predicate to include `SQLITE_READONLY`, `SQLITE_CANTOPEN`, `SQLITE_IOERR_WRITE`, `EROFS`.
- **Test hygiene**: gate spawn-twice exit assertions on stdout 'close' (or `waitFor(stdout.includes(...))`) BEFORE asserting exit code; strip `MK_*_STRICT_SINGLE_WRITER` from inherited env in `spawnLauncher` helpers across both 007 test files; add a parallel `launcher-lease.vitest.ts` for skill-advisor mirroring the 007 shape (3 cases: spawn-twice, dead-PID reclaim, env-disable).

### Out of Scope

- 14 P2 findings — log against this packet's `implementation-summary.md` as known-deferred; no code changes this pass.
- Architectural redesign (no shared `lib/daemon/lease.ts` propagation to other skills; the inline-primitive decision from 007 stands).
- Mocking better-sqlite3 to add a true EACCES-fallback test (chmod-tempdir approach is acceptable but optional; defer if it flakes).
- Lease-file format changes (no `startedAt` in stdout, no JSON wrapping, no schema additions).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify | Re-probe after `writeLeaseFile()`; env-var parsing helper. |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | Re-probe after `writeLeaseFile()`; SIGTERM child-exit handler + SIGKILL backstop; env-var parsing helper. |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify | Env-var parsing helper (single-source consistency). |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts` | Modify | EPERM branch in `isLeaseHeld()` returns `{held: true, ...}`. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` | Modify | Swap pragma order; broaden EACCES predicate to include SqliteError codes. |
| `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` | Modify | Stdout-close gate; strip env var in `spawnLauncher`. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts` | Modify | Same. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts` | Create | New subprocess-level spawn-twice/stale-reclaim/env-disable suite mirroring 007 shape. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/012-mcp-launcher-concurrency-arc/changelog/003-launcher-race-and-error-surface-hardening.md` | Create | Changelog entry. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Re-probe after lease write closes check-and-write race | After `writeLeaseFile()`, code-graph + spec-memory launchers `readLeaseFile()` and check `parsed.pid === process.pid`; if mismatch, log + `process.exit(0)`. |
| REQ-002 | SIGTERM handler waits for child exit | spec-memory launcher attaches `childProcess.on('exit', () => { clearLeaseFile(); process.exit(128); })`; the 5s `setTimeout` is replaced with a SIGKILL backstop that escalates to SIGKILL on the child first, then clears + exits. |
| REQ-003 | Env-var parsing accepts standard falsy strings | `MK_*_STRICT_SINGLE_WRITER` recognizes `0`, `false`, `FALSE`, `False`, `no`, `off`, empty string as disabled. Identical helper across all 3 launchers. |
| REQ-004 | EPERM treated as `held: true` | `lease.ts` `isLeaseHeld()`: `if (code === 'EPERM') return { held: true, ownerPid: snapshot.pid, staleReclaimable: false };` |
| REQ-005 | `busy_timeout` set BEFORE `journal_mode` | `skill-graph-db.ts` `initDb()`: `db.pragma('busy_timeout = 5000')` runs FIRST, then `journal_mode = WAL`. |
| REQ-006 | EACCES catch broadened | Catch matches `EACCES`, `EROFS`, `SQLITE_READONLY`, `SQLITE_CANTOPEN`, `SQLITE_IOERR_WRITE` and falls back to `journal_mode = DELETE`. |
| REQ-007 | Spawn-twice tests gate on stdout 'close' before asserting exit | Both 007 test files wait for stdout buffer to flush before checking `exit.code === 0` AND `stdout.includes('LEASE_HELD_BY:')`. |
| REQ-008 | Host env vars stripped in tests | `spawnLauncher` helpers explicitly delete `MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER`, `MK_CODE_INDEX_STRICT_SINGLE_WRITER`, `MK_SPEC_MEMORY_STRICT_SINGLE_WRITER` from baseline env before merging test-specific env. |
| REQ-009 | Skill-advisor subprocess spawn-twice test exists | New `system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts` carries 3 cases mirroring 007: spawn-twice exit-0 + dead-PID reclaim + env-var disable. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | All existing tests still pass | `vitest --run` across both packages exits 0; no regression in 006 + 007 cases. |
| REQ-011 | Typecheck clean | Both `npm run typecheck` invocations exit 0. |
| REQ-012 | Strict spec validate green | `bash .../validate.sh <packet> --strict` returns 0 errors. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 9 P1 findings closed with evidence in `implementation-summary.md` verification table.
- **SC-002**: Cross-launcher behavioral parity unchanged — `grep -c LEASE_HELD_BY .opencode/bin/mk-*-launcher.cjs` still returns 3.
- **SC-003**: Existing test counts hold — 3 cases per skill in launcher-lease.vitest.ts × 3 skills (with the new skill-advisor file) = 9 cases minimum across the 3 packages.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Re-probe could deadlock if `readLeaseFile()` blocks | Low | `readLeaseFile()` uses synchronous fs reads with try/catch; no IO can block indefinitely. |
| Risk | SIGTERM child-exit handler could leak if child never exits | Med | SIGKILL backstop at 5s ensures forward progress. |
| Risk | Broader EACCES predicate accidentally catches valid errors | Low | Predicate enumeration is explicit; non-matching codes still throw. |
| Risk | Env-var helper drift across 3 launchers | Med | Reviewer to manually diff the three helpers; ensure they accept the same set. |
| Risk | New skill-advisor subprocess test introduces flake | Low | Mirror exactly the working 007 test shape (with the test-isolation fixes from REQ-007/008). |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — all reviewer findings are concrete and self-contained.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| NFR | Target | How Verified |
|-----|--------|--------------|
| Re-probe latency | <50ms added per launcher start | manual timing |
| SIGTERM-to-clean-exit latency | <5s typical (child exits cleanly), <6s worst (SIGKILL backstop fires) | vitest timing assertion |
| Env-var helper uniformity | Same accepted-values set across all 3 launchers | manual diff |
| New skill-advisor test isolation | No host env leak, no temp-dir leak, deterministic dead-PID selection | `beforeEach`/`afterEach` cleanup, spawn-and-kill child for guaranteed dead PID |
| Cross-launcher parity grep | `grep -c LEASE_HELD_BY .opencode/bin/mk-*-launcher.cjs` returns 3 | post-edit shell check |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- **Re-probe sees own write but PID mismatch** — race confirmed; exit clean.
- **Re-probe sees own write and matching PID** — happy path; proceed.
- **Re-probe fails (file deleted between write and read)** — treat as "we lost"; exit clean.
- **SIGTERM child exits in <100ms** — handler fires `'exit'` event quickly; clean.
- **SIGTERM child hangs past 5s** — SIGKILL backstop fires; child dies; lease cleared; exit.
- **EPERM probe with no permission** — held: true; launcher exits. Acceptable.
- **`SQLITE_IOERR_WRITE` on populated DB** — different from read-only; treat conservatively, fall back to DELETE with warning. Operator can investigate.
- **Env var set to single space `' '`** — strip whitespace before compare; treat as empty → enabled. Acceptable.
- **Test runs with MK_*_STRICT_SINGLE_WRITER=0 in host env** — `spawnLauncher` strips before merging; test runs as expected.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY

| Dimension | Score | Rationale |
|-----------|------:|-----------|
| Lines of code | 200-300 | ~5 LOC × 5 mechanical fixes + ~30 LOC × 2 SIGTERM refactor + child-exit handler + ~150 LOC new test file |
| Files touched | 9 | 3 launchers + 2 TS files + 3 test files + 1 changelog |
| Cross-skill blast radius | Low | Same files as 006 + 007; no new modules |
| Test surface | Medium | Existing tests must stay green; new tests must isolate properly |
| Reviewer hours | 1-2 | Mechanical; high evidence quality from 3-reviewer audit |
| Risk of regression | Low | All changes narrow + gated by env vars (with default-true preserving current behavior) |
<!-- /ANCHOR:complexity -->
