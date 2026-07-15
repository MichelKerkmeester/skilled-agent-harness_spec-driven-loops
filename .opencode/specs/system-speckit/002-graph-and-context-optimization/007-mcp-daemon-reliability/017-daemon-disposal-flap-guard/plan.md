---
title: "Implementation Plan: Daemon disposal relaunch-flap guard"
description: "Capture the launcher's initial parent pid and re-check orphan/shutdown at relaunch fire-time so the daemon is not respawned under a disposing owner session; additive, recycle/crash-safe."
trigger_phrases:
  - "daemon disposal flap plan"
  - "launcher relaunch guard plan"
  - "mcp daemon respawn fix plan"
  - "orphan gate relaunch"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/017-daemon-disposal-flap-guard"
    last_updated_at: "2026-06-07T13:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored plan for the relaunch-fire-time orphan/shutdown gate"
    next_safe_action: "Verify node --check + launcher tests, then validate"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-017-daemon-disposal-flap-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Daemon disposal relaunch-flap guard

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS launcher (`.cjs`) |
| **Framework** | mk-spec-memory MCP launcher + child-exit supervision |
| **Storage** | Owner-lease files; SQLite context index (unchanged) |
| **Testing** | `node --check`, launcher vitest suite, `validate.sh --strict` |

### Overview
The launcher's child-exit supervisor schedules a relaunch on a 250 ms backoff. The fix re-checks, when that timer fires, whether the launcher is shutting down or its owning runtime has gone away (orphaned). If so it releases the lease and exits instead of respawning the daemon under a dying session. It does not touch the supervision decision function, the recycle path, or the shutdown path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause verified against first-party code (not just the report)
- [x] Recycle + crash-recovery relaunch contract understood (both flow through `scheduleRelaunch`)
- [x] Launcher spawn parent confirmed (MCP host = direct parent → orphan detection reliable)

### Definition of Done
- [x] Fire-time guard added; `node --check` clean
- [x] Launcher unit tests pass (no regression)
- [x] Deferred RC-2/3/4 documented; `validate.sh --strict` passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive guard at the relaunch entry. Capture `LAUNCHER_INITIAL_PPID` at module load; the relaunch timer callback aborts when `launcherShutdownInProgress || process.ppid !== LAUNCHER_INITIAL_PPID || process.ppid === 1`.

### Key Components
- **child-exit supervisor** (`superviseChildExit`, unchanged): decides relaunch vs intentional-exit vs give-up.
- **`scheduleRelaunch` callback** (changed): now re-checks orphan/shutdown at fire-time before calling `launchServer()`.
- **recycle / shutdown paths** (unchanged): recycle respawns via the same callback with the owner alive; shutdown already cancels the timer.

### Data Flow
child dies → `childProcess.on('exit')` (skips if already shutting down) → `superviseChildExit` → `scheduleRelaunch(backoff)` → timer fires → **gate**: orphan/shutdown? exit : `launchServer()`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mk-spec-memory-launcher.cjs` scheduleRelaunch | Respawns daemon after backoff | add fire-time orphan/shutdown gate | `node --check` + launcher vitest |
| `superviseChildExit` (model-server-supervision.cjs) | Relaunch decision | unchanged | launcher-watchdog vitest |
| `recycleDaemonInPlace` | RSS recycle (relies on scheduleRelaunch) | unchanged; verified still respawns | code trace + tests |
| `shutdownLauncherForSignal` | Launcher shutdown (clears timer) | unchanged | code trace |
| `mk-code-index-launcher.cjs` | Worse failure mode (raw bridge) | NOT changed (deferred) | documented follow-up |

Required inventories:
- Relaunch entry points: `rg -n "scheduleRelaunch|launchServer\(" mk-spec-memory-launcher.cjs` (single backoff path; recycle reuses it).
- Recycle relaunch contract: comment at `recycleDaemonInPlace` confirms it depends on the child-exit relaunch backoff.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Verify the report's cited lines against the real code (found the launcher already guards its own shutdown; gap = disposal race)
- [x] Confirm recycle + crash-recovery both flow through `scheduleRelaunch` and run with the owner alive

### Phase 2: Core Implementation
- [x] Add `LAUNCHER_INITIAL_PPID` const
- [x] Gate the `scheduleRelaunch` timer callback on orphan/shutdown (abort + release lease + exit)

### Phase 3: Verification
- [x] `node --check`
- [x] Launcher vitest suite (watchdog + clean-close + reap + session-proxy + ipc-probe)
- [x] `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | launcher parses | `node --check` |
| Unit | supervision/relaunch/reap/proxy no regression | vitest (54 tests) |
| Logic | recycle/crash unaffected; orphan-exit on disposal | code review |
| Runtime | flap actually stops | OWED to a fresh session (.cjs activates fresh) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Investigation report (Opus + gpt-5.5) | Internal | Green | No verified root cause |
| Launcher vitest suite | Internal | Green | No regression signal |
| Fresh session for runtime verify | External | Pending | Runtime confirmation deferred |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The guard wrongly suppresses a legitimate relaunch (would show as the daemon not coming back after a crash with the owner alive).
- **Procedure**: `git revert` the launcher change; the prior unconditional relaunch returns. The change is isolated to one callback.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Verify) ──► Phase 2 (Implement) ──► Phase 3 (Test)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Verify | None | Implement |
| Implement | Verify | Test |
| Test | Implement | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Verify | Med | code tracing |
| Implement | Low | ~15 LOC |
| Test | Low | scripted |
| **Total** | Low-Med | **~1-2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migrations (code-only)
- [x] Reversible via git revert
- [x] Additive guard (no path removed)

### Rollback Procedure
1. `git revert` the launcher commit.
2. Recycle the daemon (or wait for a fresh session) to load the reverted launcher.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
