---
title: "Implementation Plan: Phase 8: Loop-Lock Single-Flight Decision"
description: "Plan for the completed ADR and opt-in host-local socket-bind single-flight guard."
trigger_phrases:
  - "loop-lock socket-bind"
  - "single-flight lock decision"
  - "host-local single flight"
  - "durable packet lock adr"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/002-deep-loop-runtime/008-loop-lock-single-flight-decision"
    last_updated_at: "2026-07-01T21:34:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold plan with shipped single-flight ADR content from spec.md"
    next_safe_action: "Use this plan as documentation for the completed opt-in socket-bind decision"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts"
    session_dedup:
      fingerprint: "sha256:008a5e7c9d2b4f6081c3e5a7890b2d4f6a8c0e2d4f6b8a0c2e4d6f8a1b3c5d9f"
      session_id: "scaffold-content-remediation-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: Loop-Lock Single-Flight Decision

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
| **Language/Stack** | TypeScript deep-loop runtime lock helper plus ADR documentation |
| **Framework** | Advisory file-lock baseline with optional UNIX socket-bind guard |
| **Storage** | Lock metadata plus optional host-local socket path; no multi-host store |
| **Testing** | Spec acceptance requires live-holder protection with `hostLocalSingleFlight: true`, unchanged behavior when false, and stale-socket connect-before-unlink review; no dedicated test file is named in spec.md |

### Overview
This completed ADR records that `durablePacketLock` advisory file-lock remains the default and `hostLocalSingleFlight` socket-bind is an opt-in host-local hard guard. The corresponding `loop-lock.ts` implementation probes stale sockets by attempting a connection before unlinking, and explicitly leaves multi-host distributed locking out of scope.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: advisory file locks can be raced in tight same-host windows, while socket-bind has stale-socket complexity.
- [x] Success criteria measurable: opt-in socket guard rejects a second live same-host holder; disabled flag preserves advisory-only behavior.
- [x] Dependencies identified: phase 007 heartbeat hardening should precede this optional layer.

### Definition of Done
- [x] ADR records `durablePacketLock` as always-on baseline.
- [x] ADR records `hostLocalSingleFlight` as opt-in and default false.
- [x] Multi-host distributed locking explicitly remains unsolved/out of scope.
- [x] `loop-lock.ts` implements stale-socket probing with connect-before-unlink behavior.
- [x] Unconditional startup socket unlink is prohibited by design and review criteria.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered lock strategy: durable advisory file-lock baseline plus opt-in host-local socket single-flight guard.

### Key Components
- **`durablePacketLock`**: Default advisory file-lock behavior that remains unchanged for baseline deployments.
- **`hostLocalSingleFlight`**: Optional socket-bind guard that relies on the OS preventing two live processes from binding the same socket path.
- **Stale socket probe**: Connection attempt that distinguishes a live holder from a stale socket file before any unlink.

### Data Flow
When `hostLocalSingleFlight` is false or absent, lock acquisition stays advisory-file-only and creates no socket. When enabled, the lock path additionally attempts to bind a host-local socket; on existing socket paths, it first tries to connect. A successful connection means a live holder exists and acquisition is rejected; a failed connection indicates a stale socket that may be unlinked before retry.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts` | Owns lock acquisition | Add opt-in socket-bind probe and stale-socket detection | Spec acceptance checks enabled/disabled behavior and connect-before-unlink |
| Same-host socket holder | Optional hard single-flight guard | Reject second live acquisition | Integration-style acceptance with two process instances |
| Multi-host locking | Cross-machine coordination | Explicitly unchanged/out of scope | ADR states distributed locking is unsolved |

Required inventories:
- Same-class producers: inspect lock acquisition paths before layering socket-bind behavior.
- Consumers of changed symbols: no other modules change; the config flag controls behavior in `loop-lock.ts`.
- Matrix axes: flag absent/false, flag true with no socket, flag true with live holder, flag true with stale socket, and multi-host non-guarantee.
- Algorithm invariant: never unlink a socket path until a connection attempt proves no live holder is listening there.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm phase 007 heartbeat hardening is the baseline prerequisite.
- [x] Capture the ADR decision: advisory file-lock default, socket-bind opt-in.
- [x] Explicitly scope out multi-host distributed locking.

### Phase 2: Core Implementation
- [x] Add `hostLocalSingleFlight` opt-in branch in `loop-lock.ts`.
- [x] Implement socket bind as a same-host single-flight guard.
- [x] Implement stale socket detection with connection attempt before unlink.
- [x] Preserve advisory-only behavior when `hostLocalSingleFlight` is absent or false.

### Phase 3: Verification
- [x] Verify a second same-host holder is rejected when the socket guard is enabled.
- [x] Verify a live holder's socket is not unlinked during stale-socket probing.
- [x] Verify disabled/default behavior creates no socket and matches pre-phase advisory locking.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | Two same-host processes with `hostLocalSingleFlight: true`; second acquisition rejected without unlinking live holder | Spec acceptance criteria; no dedicated test file named |
| Regression | `hostLocalSingleFlight` absent/false keeps advisory-only behavior and creates no socket | Spec acceptance criteria |
| Code review | No `fs.unlink(socketPath)` path runs without prior `net.connect` probe | Manual review of `loop-lock.ts` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 007 heartbeat hardening | Internal | Complete | Baseline advisory lock should be robust before layering socket-bind guard |
| Host-local socket support | Runtime | Available where UNIX socket binding is supported | Required only when `hostLocalSingleFlight` is enabled |
| Multi-host distributed lock service | External/future | Out of scope | No cross-machine lock guarantee is provided by this phase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Socket-bind probing unlinks a live holder socket, rejects valid baseline locks, or introduces startup failures.
- **Procedure**: Disable or remove the `hostLocalSingleFlight` branch in `loop-lock.ts`; keep `durablePacketLock` advisory file-lock as the default baseline while the socket probe is corrected.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
