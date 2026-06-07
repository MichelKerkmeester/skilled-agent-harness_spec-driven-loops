---
title: "Implementation Plan: RC-2 daemon ownership re-election (foundation)"
description: "Flag-gated, default-off detached spawn + release-on-shutdown so the shared daemon can outlive its owner; pure decision helpers + flag-off-identity regression guard."
trigger_phrases:
  - "RC-2 re-election plan"
  - "daemon outlives owner plan"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/022-daemon-ownership-reelection"
    last_updated_at: "2026-06-07T17:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented + tested the flag-gated RC-2 foundation"
    next_safe_action: "Runtime-validate before enabling the flag"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-022-daemon-ownership-reelection"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: RC-2 daemon ownership re-election (foundation)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS launcher) |
| **Framework** | None |
| **Storage** | Owner lease + daemon lease (files) |
| **Testing** | vitest |

### Overview
A flag (`SPECKIT_DAEMON_REELECTION`, default off) drives three pure helpers: `daemonReelectionEnabled`, `contextServerSpawnIo` (detached vs tied), and `shouldReleaseDaemonForReelection`. The launcher gates the daemon spawn on the first two and adds a release branch in `shutdownLauncherForSignal` on the third. Flag-off reproduces today's behavior exactly.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Flag-gated structural capability behind pure decision helpers; default-off = no behavior change.

### Key Components
- **`daemonReelectionEnabled` / `contextServerSpawnIo` / `shouldReleaseDaemonForReelection`**: pure decisions.
- **spawn gate** + **shutdown release branch**: the wiring.

### Data Flow
spawn: `contextServerSpawnIo(enabled)` -> detached vs tied. shutdown: `shouldReleaseDaemonForReelection` -> release (keep daemon lease, drop owner lease, exit) | existing kill path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| context-server spawn | tied, killed on shutdown | gate detached/stdio on flag | spawn-io identity test |
| `shutdownLauncherForSignal` | always kills the daemon | add release branch (flag on) | release-predicate test + suite |
| owner lease vs daemon lease | both cleared on shutdown | release clears ONLY owner lease | code review + adversarial gpt-5.5 review |

Required inventories:
- Consumers of the shutdown path: crash/recycle paths are separate (release is graceful-shutdown only).
- Matrix axes: {flag on/off} x {live daemon?} x {spawn/shutdown}.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Verify the root cause: shutdown explicitly `child.kill(signal)`s the daemon
- [x] Verify current spawn options + the owner-vs-daemon lease helpers

### Phase 2: Core Implementation
- [x] Add flag + `contextServerSpawnIo` + `shouldReleaseDaemonForReelection` (pure)
- [x] Gate the spawn (detached + unref when on); add the shutdown release branch; export helpers

### Phase 3: Verification
- [x] `node --check` + 12-assertion smoke (incl. flag-off identity)
- [x] re-election tests + full launcher suite (79 tests) green
- [x] gpt-5.5 adversarial review of the diff (flag-off identity, leak/split-brain, adoption gap)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | flag / spawn-io (identity) / release predicate | vitest |
| Regression | full launcher suite | vitest |
| Review | adversarial diff review | gpt-5.5-fast HIGH (cli-opencode) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| owner/daemon lease helpers | Internal | Green | reused (clearOwnerLeaseFile) |
| phase-021 orphan sweeper | Internal | Green | bounds a released-daemon leak |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any flag-on instability, or doubt about flag-off identity.
- **Procedure**: keep the flag unset (default; zero effect) or `git revert` the packet.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Core ──► Verify
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
| Setup | Med | 1-2 hours |
| Core Implementation | Med | 2-3 hours |
| Verification | Med | 1-2 hours (incl. adversarial review) |
| **Total** | | **~5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Flag default-off (no behavior change)
- [x] Flag-off identity regression-tested
- [x] Leak bounded by the orphan sweeper

### Rollback Procedure
1. Leave `SPECKIT_DAEMON_REELECTION` unset (default; zero effect).
2. `git revert` the packet if the flag-off path is ever in doubt.
3. Re-run the launcher suite.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
