---
title: "Implementation Plan: Live two-session daemon re-election adoption test"
description: "Build an isolated two-launcher live test, fix the fresh-session double-writer it uncovers via reap-before-respawn, and reconcile the docs to the proven behavior."
trigger_phrases:
  - "live reelection validation plan"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/028-live-session-reelection-validation"
    last_updated_at: "2026-06-08T05:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Live test built, reap fix shipped, docs reconciled"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-028-live-session-reelection-validation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Live two-session daemon re-election adoption test

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js launcher (CommonJS), TypeScript vitest, Markdown docs |
| **Framework** | Vitest stress/durability suite |
| **Storage** | SQLite (WAL) via the context-server daemon |
| **Testing** | Live two-launcher durability test, launcher-lease unit suite, standalone repro |

### Overview
A live durability test spawns two real mk-spec-memory launchers against an isolated fake-root (real-copied launcher and daemon dist, symlinked deps, fresh lease/DB, short socket dir). It proved live-secondary survival but exposed a fresh-session double-writer. The fix reaps the live released daemon on the stale-lease reclaim branch before respawn, restoring the single-writer invariant. The changelog, RELEASE_NOTES, and ENV_REFERENCE are reconciled to the proven behavior.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Isolation mechanism proven (single-launcher probe)
- [x] Root cause confirmed by four independent perspectives
- [x] Fix approach chosen (option a, reap-before-respawn)

### Definition of Done
- [x] Live test passes all three cases
- [x] Launcher-lease suite still passes
- [x] Docs reconciled, packet validated, committed, pushed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Isolated real-launcher harness: a temp fake-root makes the launcher and daemon resolve their lease, DB, and workspace root to throwaway paths, so two real launchers exercise the real lease, bridge, and reclaim logic without touching production.

### Key Components
- **Launcher reclaim branch**: `mk-spec-memory-launcher.cjs` `main()` stale-lease handling.
- **Reap helper**: `reapLeaseChildBeforeRespawn`, reused from the dead-socket path.
- **Live test**: `daemon-reelection-adoption-live.vitest.ts` in the durability suite.

### Data Flow
A fresh launcher reads the stale lease, finds the recorded daemon childPid alive, reaps it under the owner-lease mutex, then spawns a single replacement that owns the database.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Launcher stale-reclaim branch | Spawns a replacement without reaping the live orphan | Reap the recorded childPid first, bail on EPERM | Live test single-writer case green; repro shows orphan reaped within 1s |
| Durability suite | Covered the release-vs-kill decision only (sleeper) | Add a live two-launcher adoption test, three cases | `npm run stress:durability` 18/18 |
| v3.5.0.4 changelog + RELEASE_NOTES | Hedged adoption as observation-only | Replace with proven behavior and the fix | grep shows no remaining observation hedge; HVR clean |
| ENV_REFERENCE re-election row | Said adoption under live observation | Update to live-proven plus the reap | Row reflects the new posture |

Required inventories:
- Same-class producers: only the stale-owner reclaim branch lacked the reap; the dead-socket branch already reaps via the same helper.
- Consumers of changed symbols: `reapLeaseChildBeforeRespawn` reused unchanged, one new caller, no other consumers.
- Matrix axes: flag {on, off} by session {connected-secondary, fresh-after-dispose}.
- Algorithm invariant: exactly one daemon holds the database open after a fresh cold start.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Prove the isolated single-launcher harness (probe)
- [x] Build the two-session live test and reproduce the finding

### Phase 2: Core Implementation
- [x] Convene the council to verify and choose the fix
- [x] Implement reap-before-respawn on the stale-reclaim branch
- [x] Add the fresh-session-after-dispose test case

### Phase 3: Verification
- [x] Durability suite and launcher-lease suite green
- [x] Docs reconciled, packet validated
- [x] Commit, push
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Lease reclaim not regressed | launcher-lease vitest |
| Integration | Two real launchers, three cases | vitest stress durability |
| Manual | Orphan reaped within 1s | standalone harness + lsof |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `reapLeaseChildBeforeRespawn` helper | Internal | Green | Without it the reap would need reimplementation |
| Owner-lease O_EXCL acquisition | Internal | Green | Without it two fresh launchers could race the spawn |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The reap-before-respawn fix causes a fresh session to fail spawning.
- **Procedure**: Revert the launcher commit; the prior spawn-without-reap behavior returns. The code default for re-election stays off, so configs are a further one-character revert.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | Isolation harness design |
| Core Implementation | Low | A ~15-line launcher branch plus one test case |
| Verification | Low | Suite runs plus repro |
| **Total** | | One session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Launcher parse-checked
- [x] Live and unit suites green
- [x] Packet validated before commit

### Rollback Procedure
1. `git revert` the launcher commit.
2. Start a fresh session so the launcher reads the reverted code.
3. Confirm cold-start behavior returns to the prior spawn path.
4. No data reversal needed.

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
