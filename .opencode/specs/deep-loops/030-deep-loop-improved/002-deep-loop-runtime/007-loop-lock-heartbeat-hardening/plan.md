---
title: "Implementation Plan: Phase 7: Loop-Lock Heartbeat Hardening"
description: "Plan for the shipped owner-scoped loop-lock heartbeat driver and liveness metadata fields."
trigger_phrases:
  - "loop-lock heartbeat"
  - "refresh-loop-lock cadence"
  - "lock heartbeat hardening"
  - "loop lock liveness"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/002-deep-loop-runtime/007-loop-lock-heartbeat-hardening"
    last_updated_at: "2026-07-01T21:32:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold plan with shipped loop-lock heartbeat content from spec.md"
    next_safe_action: "Use this plan as documentation for the completed lock heartbeat hardening"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts"
    session_dedup:
      fingerprint: "sha256:007a5e7c9d2b4f6081c3e5a7890b2d4f6a8c0e2d4f6b8a0c2e4d6f8a1b3c5d9e"
      session_id: "scaffold-content-remediation-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: Loop-Lock Heartbeat Hardening

<!-- SPECKIT_LEVEL: 1 -->
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
| **Language/Stack** | TypeScript deep-loop runtime lock helper |
| **Framework** | File-backed advisory lock with owner-token refresh |
| **Storage** | Loop lock metadata record containing phase and activity timestamp |
| **Testing** | Spec acceptance requires mocked heartbeat cadence, lock metadata readback, 3x TTL retention, and paused-vs-dead distinction; no dedicated test file is named in spec.md |

### Overview
This phase hardened `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts` by adding an owner-scoped heartbeat driver around the existing `refreshLoopLock` helper. The lock record now carries `phase` and `lastActivityIso` metadata so a live paused loop can be distinguished from an expired dead process.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: live slow loops could let advisory locks expire.
- [x] Success criteria measurable: heartbeat refreshes fire on cadence and preserve lock ownership across multiple TTLs.
- [x] Dependencies identified: `refreshLoopLock` already existed and accepted the owner token.

### Definition of Done
- [x] `startHeartbeat(ownerToken, intervalMs)` added and refreshes the lock on cadence.
- [x] `stopHeartbeat()` added and cancels the heartbeat timer.
- [x] Default heartbeat interval set below the default 60 s TTL.
- [x] Lock metadata includes `phase` and `lastActivityIso` updated on heartbeat ticks.
- [x] Scope remains confined to `loop-lock.ts`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Owner-scoped liveness heartbeat for a file-backed advisory lock.

### Key Components
- **`startHeartbeat`**: Starts a cadence timer that calls `refreshLoopLock` using the owner token while dispatch is active.
- **`stopHeartbeat`**: Stops the heartbeat timer so ownership is not refreshed after dispatch ends.
- **Lock metadata fields**: `phase` records loop state such as `paused`; `lastActivityIso` records the latest heartbeat time.

### Data Flow
A loop owner starts the heartbeat with its owner token. Each tick calls `refreshLoopLock`, updates metadata with the current phase/activity timestamp, and keeps the advisory lock fresh. External readers can inspect `phase` and `lastActivityIso`; if the lock expires entirely, they can treat the owner as dead rather than merely paused.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts` | Owns lock acquisition and refresh | Add heartbeat driver and metadata fields | Spec acceptance covers cadence, stop, metadata, and TTL retention |
| Fanout/convergence runners | Execute loops that rely on locks | Unchanged in this phase | Spec explicitly excludes runner/convergence changes |

Required inventories:
- Same-class producers: inspect `refreshLoopLock` and existing lock metadata before adding heartbeat fields.
- Consumers of changed symbols: no fanout or convergence callers are migrated in this phase.
- Matrix axes: active heartbeat, stopped heartbeat, paused phase metadata, dead expired lock, heartbeat error logging, and 3x TTL elapsed time.
- Algorithm invariant: only the current owner token may refresh the lock, and heartbeat metadata must not make an expired dead lock look live.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm heartbeat scope is limited to `loop-lock.ts`.
- [x] Confirm `refreshLoopLock` already accepts the owner token and needs no signature change.
- [x] Choose a default heartbeat interval of 15 seconds, below the default 60 second lock TTL.

### Phase 2: Core Implementation
- [x] Added `startHeartbeat(ownerToken, intervalMs)` cadence driver.
- [x] Added `stopHeartbeat()` timer cancellation.
- [x] Added `phase` and `lastActivityIso` fields to lock metadata.
- [x] Updated heartbeat ticks to refresh owner-scoped lock metadata and log heartbeat errors without throwing.

### Phase 3: Verification
- [x] Verified cadence calls to `refreshLoopLock` with the owner token.
- [x] Verified `stopHeartbeat()` cancels the timer.
- [x] Verified lock metadata contains `phase` and fresh `lastActivityIso` after a tick.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/timer | Mock `refreshLoopLock`, advance timers by 3 intervals, assert 3 calls and cancellation by `stopHeartbeat` | Spec acceptance criteria; no dedicated test file named |
| Integration/clock | Loop remains owner after 3x lock TTL while heartbeat is active | Spec acceptance criteria |
| Metadata | Lock file includes `phase` and recent `lastActivityIso` after heartbeat | Lock record readback |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing `refreshLoopLock` helper | Internal | Available | Heartbeat is built on owner-token scoped refresh |
| Socket-bind single-flight guard | Internal follow-up | Deferred to phase 008 | Heartbeat hardens liveness but does not add supplementary single-flight decision ownership |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Heartbeat refreshes the wrong owner, leaks timers, or makes dead locks appear live.
- **Procedure**: Revert heartbeat driver and metadata-field additions in `loop-lock.ts`; return to existing TTL-only advisory-lock behavior until the heartbeat implementation is corrected.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
