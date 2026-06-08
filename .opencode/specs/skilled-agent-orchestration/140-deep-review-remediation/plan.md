---
title: "Implementation Plan: Deep-review remediation"
description: "Serialize the stale-reclaim reap+spawn under the respawn lock, refuse respawn on unconfirmed kill, fix comment hygiene + checker, harden the test, and sync the launcher fixes to Barter."
trigger_phrases:
  - "deep review remediation plan"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/140-deep-review-remediation"
    last_updated_at: "2026-06-08T11:05:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Fixes implemented and verified"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-140-deep-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Deep-review remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js launcher (CommonJS), Python checker, TypeScript vitest |
| **Framework** | mk-spec-memory launcher, vitest durability suite |
| **Storage** | SQLite (WAL) via the daemon |
| **Testing** | Durability adoption suite, launcher-lease unit suite, hygiene self-test |

### Overview
The stale-reclaim reap+spawn is wrapped in the existing exclusive respawn lock so two fresh launchers racing a crashed-not-released owner cannot both reap and respawn. The reap refuses to hand off when a child outlives SIGKILL. Two perishable `096 packet` comments are rewritten and the hygiene checker gains a reversed-ordering pattern. The live test's shell `execSync` helpers become `spawnSync` with args. The launcher fixes sync to the Barter mirror.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] P1 round-2 verified against code
- [x] Respawn lock identified as the serialization primitive
- [x] Deferrals triaged

### Definition of Done
- [x] Fixes implemented and parse-clean
- [x] Durability + lease suites green; hygiene self-test green
- [x] Packet validated, committed, synced to Barter
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reuse the exclusive respawn lock (the dead-socket respawn path's primitive) to serialize the stale-reclaim critical section, releasing it once the spawn completes.

### Key Components
- **`main()` stale-reclaim branch**: acquires/releases the respawn lock around reap+spawn.
- **`reapLeaseChildBeforeRespawn`**: returns not-allowed on unconfirmed SIGKILL.
- **`check-comment-hygiene.sh`**: reversed-ordering pattern.
- **adoption vitest**: spawnSync helpers.

### Data Flow
A fresh launcher with a stale owner lease takes the respawn lock, reaps the recorded child, spawns the single replacement, then releases the lock and runs as owner.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Launcher stale-reclaim branch | Reaps+spawns without exclusive serialization | Wrap in respawn lock; bail on loss | Adoption single-writer case green |
| `reapLeaseChildBeforeRespawn` | Returns allowed after SIGKILL regardless | Refuse on unconfirmed exit | Reused by both reclaim callers |
| Two launcher comments | Carry `096 packet` label | Rewrite to durable WHY | Hygiene clean |
| Hygiene checker | Misses reversed `NNN packet` | Add pattern | Self-test green; pattern catches |
| Adoption test helpers | `execSync` shell strings | `spawnSync` with args | Suite green |

Required inventories:
- Producers: the stale-reclaim branch was the only non-exclusive reap path; the dead-socket branch already serializes.
- Consumers: `reapLeaseChildBeforeRespawn` is shared by both reclaim callers; the not-allowed return is handled by each.
- Invariant: at most one daemon writes the database after a fresh cold start, including under the crashed-owner race.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Round-2 verify the P1 against `acquireOwnerLeaseFile`
- [x] Confirm the respawn lock is the right serialization primitive

### Phase 2: Core Implementation
- [x] F1: respawn-lock serialization + comment
- [x] F1c: refuse respawn on unconfirmed kill
- [x] F2: comments + checker pattern
- [x] F3: spawnSync test helpers

### Phase 3: Verification
- [x] Parse, hygiene, self-test
- [x] Durability + launcher-lease suites green
- [x] Packet validated, committed, synced to Barter
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Lease reclaim not regressed | launcher-lease vitest |
| Integration | Single-writer under fresh reap | durability adoption vitest |
| Static | Comment hygiene + checker | check-comment-hygiene self-test |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Respawn lock helpers | Internal | Green | No serialization primitive |
| `reapLeaseChildBeforeRespawn` | Internal | Green | Reap path |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The respawn lock blocks a legitimate fresh reclaim.
- **Procedure**: `git revert` the remediation commit; the prior (racy but functional) stale-reclaim returns.
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
| Setup | Medium | Round-2 verification |
| Core Implementation | Low | One branch + helper + comments + test |
| Verification | Low | Suite runs |
| **Total** | | Part of one session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Launcher parse-checked
- [x] Suites green
- [x] Packet validated before commit

### Rollback Procedure
1. `git revert` the remediation commit.
2. Start a fresh session so the launcher reads the reverted code.
3. Confirm the durability suite still passes on the reverted code.
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
