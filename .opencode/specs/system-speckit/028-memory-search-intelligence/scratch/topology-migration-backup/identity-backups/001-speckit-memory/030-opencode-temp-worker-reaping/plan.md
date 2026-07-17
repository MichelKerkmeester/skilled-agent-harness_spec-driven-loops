---
title: "Implementation Plan: Phase 30: opencode-temp-worker-reaping"
description: "Root-cause fix for daemon-process accumulation: default-off re-election in the launcher-lease test harness plus afterEach hard-kill (Layer 0), and orphan-mcp-sweeper classification of the embedder sidecar (Layer 1). Activation, sweeper hardening, and the embedder demand-listener fix remain."
trigger_phrases:
  - "implementation"
  - "plan"
  - "opencode temp worker reaping"
  - "daemon reaper"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/030-opencode-temp-worker-reaping"
    last_updated_at: "2026-07-11T09:30:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Rewrote plan to Level 2 covering shipped fixes and staged remaining phases"
    next_safe_action: "Await operator go-ahead on activation, then scope sweeper hardening"
    blockers:
      - "Operator approval needed for stop-hook live flip and launchd install"
    key_files:
      - "plan.md"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts"
      - ".opencode/scripts/orphan-mcp-sweeper.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doc-update-030-daemon-reaper"
      parent_session_id: null
    completion_pct: 55
    open_questions:
      - "Should REQ-005 (demand-listener re-arm) ship in this packet or a new one?"
    answered_questions:
      - "Which lifecycle hook owns the reap? -> existing stop-hook (SPECKIT_STOP_HOOK_ORPHAN_SWEEP), not a new mechanism."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 30: opencode-temp-worker-reaping

<!-- SPECKIT_LEVEL: 2 -->
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
| **Language/Stack** | Node.js / TypeScript (test harness), Bash (sweeper script) |
| **Framework** | Vitest |
| **Storage** | SQLite (`better-sqlite3`) behind the spec-memory daemon |
| **Testing** | Vitest: `launcher-lease.vitest.ts`, `orphan-sweeper-ipc-preserve.vitest.ts`, `launcher-stop-hook-orphan-sweep.vitest.ts` |

### Overview
Fix the daemon-accumulation root cause at its source (the launcher-lease test's detached-child lifecycle) instead of building a generic reaper or concurrency guard, and extend the existing orphan sweeper so it knows about the embedder sidecar and doesn't become a future leak vector itself. The remaining phases activate mechanisms that already exist (stop-hook, launchd cron) and harden the sweeper's process-killing logic; they do not require new infrastructure.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (two root causes traced with file:line evidence)
- [x] Success criteria measurable (suite pass rate, zero-leak verification, live dry-run behavior)
- [x] Dependencies identified (daemon re-election flag, stop-hook flag, launchd, native ABI)

### Definition of Done
- [x] Shipped-layer acceptance criteria met (REQ-001, REQ-002)
- [x] Tests passing for shipped layers (vitest suite + unit tests)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary, this pass)
- [ ] Remaining-layer acceptance criteria met (REQ-003, REQ-004, REQ-005) - **not met, staged/pending**
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Defense-in-depth lifecycle fix at the source, reusing existing sweep infrastructure rather than adding new mechanisms.

### Key Components
- **`spawnLauncher` test helper** (`launcher-lease.vitest.ts`): now defaults `SPECKIT_DAEMON_REELECTION=0` so the launcher owns and kills its own daemon child on exit - the deterministic single-owner contract these lifecycle tests actually assert.
- **`afterEach` hard-kill** (same file): defense-in-depth - hard-kills each workspace's lease-recorded `childPid`/`modelServerPid` before the temp root is removed, so any test that overrides re-election back on still can't leak.
- **`orphan-mcp-sweeper.sh`**: classifies the `hf-model-server` sidecar and extends the existing >1-unix-socket-FD busy-preserve rule to count `hf-embed.sock` connections.
- **`session-cleanup.sh`** (existing, unchanged this phase): gates the stop-hook fallback behind `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` (default `off`).
- **launchd plist** (existing template, not installed): cron-based reaper fallback for orphans outside any session lifecycle.

### Data Flow
Test spawns launcher -> launcher spawns daemon detached+unref'd -> with re-election off by default in the test harness, the launcher kills its own daemon child on exit; `afterEach` additionally hard-kills any lease-recorded pid as defense-in-depth before deleting the temp workspace, so no stub `context-server.js` survives the test run. Separately, `orphan-mcp-sweeper.sh` (invoked by the stop-hook or cron, neither yet activated live) enumerates candidate orphan processes, classifies `hf-model-server` via the new detection, and reaps only a sidecar without an active `hf-embed.sock` connection.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Investigation
- [x] Census of live `context-server.js` processes (51 live, start times spanning Jul 8-9)
- [x] Root cause A traced: `launcher-lease.vitest.ts` detached daemon + re-election release semantics (`mk-spec-memory-launcher.cjs:1539`, default at `:206-207`)
- [x] Root cause B traced: embedder wedge via `hf-model-server` sidecar + demand-listener ownership gap (`mk-spec-memory-launcher.cjs:1781`, `hf-local.ts:501-504,718-785`)

### Phase 2: Core Implementation (shipped)
- [x] Layer 0: default `SPECKIT_DAEMON_REELECTION=0` in `spawnLauncher` test helper (commit `90a2462721`)
- [x] Layer 0: `afterEach` hard-kill of lease-recorded `childPid`/`modelServerPid` (commit `90a2462721`)
- [x] Layer 1: `orphan-mcp-sweeper.sh` classifies `hf-model-server`, extends busy-preserve rule to `hf-embed.sock` (commit `d4be07abbc`)
- [x] Operational: killed 32 accumulated zombie daemons (manual, this session, not a repo change)
- [x] Operational: restarted the wedged daemon and rebuilt native `better-sqlite3` to the Node-22/MODULE_VERSION-127 ABI (manual, this session)

### Phase 3: Remaining (staged, not started)
- [ ] Activate `SPECKIT_STOP_HOOK_ORPHAN_SWEEP=dry-run` then `live` (`session-cleanup.sh:30`) - operator-gated
- [ ] Install the launchd cron reaper via `launchctl load` (`com.michelkerkmeester.orphan-sweep.plist`, currently `--dry-run`, template-only) - operator-gated
- [ ] Sweeper hardening: maintenance-marker respect, singleton rule, pid-reuse re-check before SIGKILL escalation
- [ ] Embedder demand-listener re-arm on daemon adoption + `hf-local.ts` fail-fast when socket absent and no live owner lease - recommended as a separate packet

### Phase 4: Verification (shipped-layer scope)
- [x] `launcher-lease.vitest.ts` re-run: 6/11 -> 10/11, zero stub daemon leaks confirmed
- [x] Non-regression baseline captured: unmodified test failed the same 5 assertions
- [x] Sweeper unit tests: `orphan-sweeper-ipc-preserve.vitest.ts` (3/3), `launcher-stop-hook-orphan-sweep.vitest.ts` (4/4)
- [x] Live `--dry-run --verbose` sweep verified against the real daemon (pid 42293 preserved, genuinely orphaned ~2.4h helpers flagged)
- [x] DB integrity verified post-rebuild (`PRAGMA integrity_check = ok`, 12,801 memories intact)
- [ ] Stop-hook live-mode and launchd cron verification - pending activation (Phase 3)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Launcher-lease lifecycle (re-election default, afterEach hard-kill) | Vitest (`launcher-lease.vitest.ts`) |
| Unit | Orphan sweeper classification (busy-preserve rule, stop-hook gate) | Vitest (`orphan-sweeper-ipc-preserve.vitest.ts`, `launcher-stop-hook-orphan-sweep.vitest.ts`) |
| Manual | Live dry-run sweep against the real daemon | `orphan-mcp-sweeper.sh --dry-run --verbose` |
| Operational | Zombie cleanup + daemon rebuild + DB integrity check | Manual `pkill`, `rebuild-native-modules.sh`, `sqlite3 PRAGMA integrity_check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `SPECKIT_DAEMON_REELECTION` test default | Internal | Green | Now overridden to `0` inside the test harness; no further action needed for the shipped layers |
| `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` | Internal | Yellow | Still default `off` in production; Phase 3 activation blocked on operator dry-run log review |
| launchd (macOS) | External/OS | Yellow | Cron plist template exists but is not installed; blocked on operator approval |
| `hf-model-server` / native `better-sqlite3` ABI | Internal | Green | Rebuilt and verified this session; no current blocker |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The `afterEach` hard-kill or default-off re-election regresses another test relying on cross-test daemon adoption, or the sweeper's `hf-model-server` classification wrongly reaps a busy production sidecar.
- **Procedure**: Revert `90a2462721` and/or `d4be07abbc`; if a specific test needs cross-test adoption, re-enable `SPECKIT_DAEMON_REELECTION` per-test rather than reverting the harness default globally.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Investigation ──┬──> Layer 0 fix ──┐
                 └──> Layer 1 fix ──┴──> Verification ──> Operational cleanup
                                                                │
                                                                v
                                    Remaining: Activation (stop-hook + launchd)
                                                                │
                                                                v
                                              Remaining: Sweeper hardening
                                                                │
                                                                v
                              Remaining: Embedder demand-listener fix (separate packet recommended)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Investigation | None | Layer 0 fix, Layer 1 fix |
| Layer 0 fix | Investigation (root cause A) | Verification |
| Layer 1 fix | Investigation (root cause B) | Verification |
| Verification | Layer 0 + Layer 1 | Operational cleanup |
| Operational cleanup | Verification | None (this session's slice complete) |
| Activation (stop-hook/launchd) | Layer 1 shipped + operator dry-run review | Sweeper hardening |
| Sweeper hardening | Activation | None |
| Embedder demand-listener fix | Independently scoped (not blocked by the above) | Unblocks reliable `memory_index_scan` |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Investigation (process census + root-cause tracing) | Medium | This session |
| Layer 0 fix + verification | Low-Medium | This session (commit `90a2462721`) |
| Layer 1 fix + verification | Low | This session (commit `d4be07abbc`) |
| Operational cleanup | Low | This session |
| Remaining: activation | Low | Follow-up, operator-staged |
| Remaining: sweeper hardening | Medium | Follow-up |
| Remaining: embedder demand-listener fix | Medium-High | Follow-up, separate packet recommended |
| **This session's slice** | | **Complete** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured before Layer 0 fix (unmodified test failed the same 5 assertions)
- [x] Non-regression confirmed (suite 6/11 -> 10/11; only the 4 cleanup-assertion tests flipped)
- [ ] Feature flag configured - N/A, both fixes changed test-harness defaults and a shell script directly, not a production runtime toggle

### Rollback Procedure
1. **Immediate**: None required in production - both shipped fixes are test-harness/shell-script scoped; no deployed runtime service was changed.
2. **Revert code**: `git revert d4be07abbc 90a2462721`
3. **Verify**: Re-run `launcher-lease.vitest.ts` and confirm it returns to the pre-fix 6/11 (documents the regression, does not itself fix anything).
4. **Notify**: N/A - no deployed service was touched by the shipped layers.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: This packet's only data-adjacent action was the operational recovery (killing zombies, rebuilding the native module, verifying DB integrity). That recovery returned a wedged system to health; reversing it would mean re-wedging a healthy daemon, which is not a desired rollback target.

<!-- /ANCHOR:l2-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Phase dependencies and effort estimation reflect shipped vs remaining work
- Enhanced rollback procedure
-->
