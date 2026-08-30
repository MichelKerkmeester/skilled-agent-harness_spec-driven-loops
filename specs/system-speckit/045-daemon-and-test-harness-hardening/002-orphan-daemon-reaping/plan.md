---
title: "Implementation Plan: Phase 2: Orphan Daemon Reaping"
description: "Give the launcher two self-exit triggers it currently lacks, make respawn-lock staleness orphan-aware, and attach an apply path and lifecycle trigger to the sweep that already classifies orphans correctly."
trigger_phrases:
  - "orphan daemon reaping plan"
  - "sweep apply path"
  - "launcher self exit"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: Orphan Daemon Reaping

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS (launcher, supervision lib), TypeScript (sweep, harness) |
| **Framework** | None; process supervision over unix sockets and pid locks |
| **Storage** | Lock and socket files under `/tmp/system-hf-embed/` |
| **Testing** | Vitest, plus a negative control that orphans a real launcher |

### Overview
Nothing here needs new classification logic. The work is to attach triggers to correct logic that currently never runs: two self-exit paths in the launcher, an orphan-aware staleness test, and an apply path plus lifecycle trigger for the sweep.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- The autonomous-versus-confirmed apply question is answered
- The lifecycle event that invokes the sweep is chosen
- Phase 001 has landed

### Definition of Done
- A deliberately orphaned launcher terminates on its own
- Its respawn lock is reclaimable by another session
- The sweep can act, and its README no longer claims otherwise
- No live daemon belonging to another session is ever signalled in testing
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Defence in depth with three independent triggers, so no single missed signal recreates a 2-day orphan: the launcher notices its own stdin, the launcher notices its own reparenting, and an external sweep notices what the launcher missed.

### Key Components
- `system-spec-memory-launcher.cjs` — owns stdio, the heartbeat timer, and its child
- `model-server-supervision.cjs` — owns `shouldAbortRelaunchOnFire()` and `isRespawnLockStale()`
- `process-sweep.ts` — emits termination plans from ownership evidence, sends no signals today
- `process-memory-harness.ts` — owns classification; unchanged by this phase

### Data Flow
Client closes stdin, or the parent dies and the process reparents to init. Either condition should reach the same shutdown path the launcher already runs correctly on `SIGTERM`. Where it does not, the sweep observes the surviving process and applies the same outcome from outside.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Capture the negative control by orphaning a launcher deliberately and recording that it survives, that its lock stays valid, and that the sweep declines to act.

### Phase 2: Implementation
Add the stdin-close handler, add the orphan predicate to the existing heartbeat, make staleness orphan-aware, then add the guarded apply path and its lifecycle trigger.

### Phase 3: Verification
Re-run the negative control. Confirm termination, lock release, and that a launcher with a live parent is never touched.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `isRespawnLockStale()` with an orphaned holder; the orphan predicate | Vitest |
| Integration | Orphan a real launcher, assert self-exit and lock release | Vitest + spawned process |
| Negative control | The pre-fix orphan survives; the post-fix one does not | Manual, recorded |
| Safety | A launcher with a live parent is never signalled | Vitest |

The safety test matters more than the others: the failure mode of this phase is killing a working session's daemon, which is worse than the leak it fixes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 | Internal | Green | Reaping tests could otherwise reach the production database |
| Packet 035 classification | Internal | Green | Already complete and correct; this phase consumes it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any live daemon terminated that was not an orphan
- **Procedure**: Revert the commit; the apply path is the only destructive addition and reverting removes it entirely
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `system-spec-memory-launcher.cjs` | Owns stdio and child lifecycle | update | Orphan negative control |
| `model-server-supervision.cjs` | Owns staleness and orphan predicates | update | Unit tests on both predicates |
| `process-sweep.ts` | Emits plans, sends no signals | update | Apply-path test with dry-run parity |
| `process-memory-harness.ts` | Owns classification | unchanged | Existing suite stays green |
| Other launchers (advisor, code mode) | Same supervision library | not a consumer this phase | Confirm no behaviour change via grep and suite |
| `ops/README.md` | States no apply command exists | update | Statement matches shipped reality |

Required inventories:
- Same-class producers: `rg -n 'isRespawnLockStale|shouldAbortRelaunchOnFire' .opencode/bin`
- Consumers of changed symbols: `rg -n 'process-sweep|processSweep' . --glob '*.ts' --glob '*.cjs' --glob '*.md'`
- Algorithm invariant: a process is reapable only with exact ownership evidence AND no live parent AND no connected socket peer. State the adversarial case of a recycled pid explicitly.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (negative control) ──► Core (self-exit + staleness) ──► Apply path ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001 landed | Core |
| Core | Setup | Apply path |
| Apply path | Core, open question answered | Verify |
| Verify | Apply path | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Med | 3-5 hours |
| Apply path and trigger | High | 3-5 hours |
| Verification | Med | 2 hours |
| **Total** | | **9-13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Dry-run output reviewed against a live process list
- [ ] Apply path gated behind the answered open question
- [ ] Safety test proves a parented launcher is never signalled

### Rollback Procedure
1. Disable the lifecycle trigger so the sweep stops being invoked
2. Revert the commit
3. Confirm launchers start and stop normally in a fresh session
4. Note in the packet whether any live daemon was wrongly terminated

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — lock and socket files are recreated on next start
<!-- /ANCHOR:enhanced-rollback -->

---
