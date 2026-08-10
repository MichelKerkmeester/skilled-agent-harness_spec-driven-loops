---
title: "Implementation Plan: Pi and Runtime Goal Bindings"
description: "Wire native runtime identity through injection and management surfaces, with Pi first and retained runtimes following the same contract."
trigger_phrases:
  - "pi runtime binding plan"
  - "goal adapter isolation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/042-goal-isolation/003-pi-and-runtime-bindings"
    last_updated_at: "2026-08-10T14:34:30Z"
    last_updated_by: "codex"
    recent_action: "Verified native runtime bindings, command safety, and registration truth"
    next_safe_action: "Start the legacy cutover and documentation phase"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Pi and Runtime Goal Bindings

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Pi** | TypeScript extension context and native session manager |
| **Cursor/Devin** | ESM hook payloads and JSON registrations |
| **Core** | Phase 2 scoped CommonJS API |
| **Testing** | Fake contexts/payloads plus live current-session canaries |

### Overview

Implement Pi first because it is the reported failure and exposes a direct native id. Then apply the same adapter rule to every runtime retained by the research verdict. A runtime is supported only when both injection and management bind to the current session.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 2 core API and test matrix pass.
- [x] Per-runtime identity fields and management APIs are cited from current source.
- [x] Pi remains disabled in settings during implementation.

### Definition of Done

- [x] Every retained adapter passes native identity to the core.
- [x] Every retained management surface binds the same identity or is explicitly unsupported.
- [x] Missing-id, resume, fork, and cross-runtime tests pass.
- [x] Registrations and tracked files agree.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Thin native adapter over one shared scope contract.

### Key Components

- **Identity extractor**: obtains the runtime's native current-session id.
- **Scope adapter**: combines native id with runtime/workspace and calls the core.
- **Management bridge**: exposes set/show/mutate from the same session context.
- **Registration**: activates only adapters with complete tested behavior.

### Data Flow

```text
native event or command -> extract current-session id -> shared scope resolver -> scoped core operation
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Pi goal extension | Unscoped lifecycle calls | Supply session id everywhere | Fake-context matrix and live canaries |
| Pi goal prompt/tool | Global CLI invocation | Move to native identity-aware bridge | Set-then-inject canary |
| Cursor adapter/command | Unscoped read/global manage | Bind verified payload/tool identity | Payload and user-flow tests |
| Devin adapter/config | Historical/current drift | Restore scoped support or remove claim | Tracked-file and registration inventory |
| OpenCode plugin | Existing isolated control | Unchanged | Plugin regression suite |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Pi Binding

- [x] Thread session id through all Pi lifecycle calls.
- [x] Build the verified identity-aware management surface.
- [x] Pass fake-context and current-session canaries.

### Phase 2: Runtime Parity

- [x] Bind Cursor hook reads to native identity; bind management only if the same native identity is available.
- [x] Remove stale Devin support claims and confirm registration remains absent.
- [x] Keep Claude/Codex out unless the research proves complete parity.

### Phase 3: Integration Verification

- [x] Run same-id/different-runtime, missing-id, resume, fork, and registration matrices.
- [x] Record whether Pi is safe to re-enable; leave actual rollout to Phase 5.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Adapter unit | Identity extraction and scoped calls | Existing runtime harnesses |
| Management integration | Set/show/mutate in current session | Native command/tool harness |
| Isolation | A/B canaries and cross-runtime same-id | Temp state plus transcript inspection |
| Registration | Tracked file/config agreement | JSON parse and path checks |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| Phase 2 scoped core | Required | No adapter may invent its own store. |
| Pi management API | Confirmed: `registerCommand` handler context | Implement before Pi can be re-enabled. |
| Cursor management | Unsupported in current prompt path | Keep the command disabled/unclaimed unless a native bridge is proven. |
| Devin goal adapter | Decommissioned | Remove stale support claims; do not restore. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any adapter cannot bind current-session management, cross-session canary leaks, or registration loads an unscoped path.
- **Procedure**: keep or restore that runtime's goal extension disablement, revert adapter/registration together, retain scoped data, and continue no goal injection until the matrix passes.
<!-- /ANCHOR:rollback -->
