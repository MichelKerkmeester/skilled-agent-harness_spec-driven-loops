---
title: "Loop-Lock Optional Socket-Bind Single-Flight (ADR)"
description: "Record the architecture decision to keep advisory file-lock as the baseline and expose socket-bind as an opt-in host-local hard guard, explicitly deferring multi-host locking."
trigger_phrases:
  - "loop-lock socket-bind"
  - "single-flight lock decision"
  - "host-local single flight"
  - "durable packet lock adr"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/002-deep-loop-runtime/008-loop-lock-single-flight-decision"
    last_updated_at: "2026-06-28T14:01:57Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec.md from research.md §5.1"
    next_safe_action: "Create plan.md and tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-loop-lock-single-flight-decision"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Loop-Lock Optional Socket-Bind Single-Flight (ADR)

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 18 |
| **Predecessor** | 007-loop-lock-heartbeat-hardening |
| **Successor** | 009-byte-offset-log-regions |
| **Handoff Criteria** | ADR written and merged; opt-in socket probe implemented behind `hostLocalSingleFlight` flag; stale-socket probe (not unconditional unlink) documented |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the deep-loop-runtime recs specification.

**Scope Boundary**: Decision and opt-in implementation confined to `loop-lock.ts`; no changes to other modules; multi-host distributed locking explicitly out of scope.

**Dependencies**:
- Phase 007 heartbeat hardening should land first so the baseline advisory lock is robust before the socket-bind layer is layered on.

**Deliverables**:
- ADR section in this spec recording the decision: advisory file-lock is the baseline (`durablePacketLock`); socket-bind is opt-in (`hostLocalSingleFlight`).
- Opt-in socket probe implementation with stale-socket detection (connection attempt before unlink) in `loop-lock.ts`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The current file-lock is advisory and can be raced under specific host conditions where two processes check the lock in a very tight window before either acquires it. A UNIX socket-bind would provide a harder host-local guard because the OS prevents two processes from binding the same socket path simultaneously; however, adding it as a default requires a resident socket holder and introduces stale-socket complexity that must be resolved at startup.

### Purpose
Record the authoritative decision: advisory file-lock remains the default baseline; socket-bind is exposed as an opt-in host-local hard guard behind a config flag, with stale-socket probing implemented correctly (connect attempt before unlink, never unconditional unlink).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- ADR section documenting the two guard modes: `durablePacketLock` (advisory file-lock, always-on) and `hostLocalSingleFlight` (socket-bind, opt-in).
- Opt-in socket probe in `loop-lock.ts`: attempt connection first; only unlink if connect fails; document the stale-socket detection logic.
- Explicit statement that multi-host distributed locking is unsolved and out of scope.

### Out of Scope
- Multi-host distributed locking — explicitly deferred; no cross-machine guard is introduced here.
- Making socket-bind the default — remains opt-in only to avoid requiring a resident holder in baseline deployments.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts` | Modify | Add opt-in `hostLocalSingleFlight` socket probe with stale-socket detection |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | ADR records the two guard modes (`durablePacketLock` vs `hostLocalSingleFlight`) and explicitly states multi-host locking is unsolved | ADR section present in this spec; code comment in `loop-lock.ts` references ADR by phase number |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Opt-in socket probe performs a connection attempt before any unlink; unconditional socket unlink on startup is prohibited | Code review confirms no `fs.unlink(socketPath)` without a prior `net.connect` attempt; unit test verifies live holder is not killed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With `hostLocalSingleFlight: true`, a second process attempting to acquire the lock on the same host while the first holder is alive receives a rejection without the first holder's socket being unlinked (verified by integration test with two process instances).
- **SC-002**: With `hostLocalSingleFlight` absent or `false`, behaviour is identical to pre-phase advisory file-lock only — no socket file is created.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Unconditional socket unlink on startup would kill a live holder's socket, silently removing its guard | High | Stale-socket probing requires a `net.connect` attempt before any `fs.unlink`; this is explicitly enforced in REQ-002 |
| Evidence | `external/loop-cli-main/src/daemon/server.ts:28,39`; `index.ts:24`; `ARCHITECTURE.md:393` | Low | Read-only citation from research.md §5.1 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

> **DECISION**: Should `hostLocalSingleFlight` be exposed as a config flag (opt-in) or permanently advisory-file-lock only?
> **Resolution**: opt-in, not default. The socket-bind guard adds value on shared-host deployments but its stale-socket complexity should not be imposed on all users. Expose via `hostLocalSingleFlight: boolean` config field, defaulting to `false`.
<!-- /ANCHOR:questions -->

---

> **Provenance:** research.md §5.1, (iters 18, 47)

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
