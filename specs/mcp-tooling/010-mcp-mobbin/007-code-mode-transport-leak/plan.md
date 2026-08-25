---
title: "Implementation Plan: Release Code Mode transports so remote MCP children stop accumulating"
description: "Release idle transports after startup discovery and all transports before exit, proving both against a pre-fix control build."
trigger_phrases:
  - "code mode transport release plan"
  - "mcp child reaping plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/007-code-mode-transport-leak"
    last_updated_at: "2026-08-25T06:55:22Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Plan authored; both releases implemented and measured"
    next_safe_action: "Validate and close phase"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-code-mode/mcp-server/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-010-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Release Code Mode transports so remote MCP children stop accumulating

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, compiled to the bundle the runtime loads |
| **Framework** | Code Mode server over the vendored UTCP client and its MCP protocol plugin |
| **Storage** | None; the contended state is a shared credential store outside the repo |
| **Testing** | Spawn-and-kill leak probe against pre-fix and fixed builds, plus a discovery-survival probe |

### Overview
Transports are opened per manual at registration to read tool lists, cached for the process lifetime, and never closed on exit. Close them once discovery is done, and again before exiting. The protocol reopens a transport on first real use, so tools stay usable.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Symptom reproduced and attributed: concurrent instances of one remote transport contending over shared credential state
- [x] Teardown entry point confirmed in the shipped protocol implementation
- [x] Manual roster audited so the teardown's authorization side effect is known to be inert

### Definition of Done
- [x] Idle transports released after discovery; none held at rest
- [x] All transports released before exit, bounded so exit cannot block
- [x] Pre-fix control leaks and fixed build does not, under the same probe
- [x] Tools remain searchable and callable after release
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Bounded resource release at two lifecycle points: after discovery, and before exit.

### Key Components
- **Server entry point**: owns startup and the exit path, and is the only place that knows when a session is ending.
- **Client teardown entry point**: cascades into each protocol, which closes its cached sessions and ends their child processes.
- **Protocol session cache**: reopens a transport on demand, which is what makes releasing idle ones safe.

### Data Flow
Startup registers each manual, which opens a transport, reads its tools into the repository, and caches the session. Releasing the client closes those sessions and ends their children while the repository keeps the tools. A later call finds no cached session and opens a fresh one.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Same-class inventory of every surface governing transport lifetime:

- The server entry point's startup path — where idle transports were retained (root fix).
- The server entry point's exit path — where transports were abandoned (root fix).
- The compiled bundle, which is what the runtime actually loads.
- The vendored protocol plugin was inventoried and **excluded**: it already closes every cached session when asked; nothing called it.
- The shared Code Mode configuration was inventoried and **excluded**: the roster is correct, and pruning it would trade capability for a symptom.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Diagnose
- [x] Attribute the running transport processes to their spawning runtime through the process ancestry
- [x] Establish that the exit path never closes the client
- [x] Establish that registration opens a transport per manual and caches it

### Phase 2: Fix
- [x] Release all transports on shutdown, bounded, before exiting
- [x] Release idle transports once startup discovery completes

### Phase 3: Verify
- [x] Prove the pre-fix build leaks and the fixed build does not, under one probe
- [x] Prove tools stay searchable and callable after release
- [x] Confirm steady-state idle transport children is zero
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Negative control | Pre-fix build leaks its child | Spawn-and-kill probe over a local stdio manual |
| Positive control | Fixed build leaves nothing behind | Same probe, fixed build |
| Behavior preservation | Discovery and invocation survive release | Direct client probe measuring children, search results, and a call |
| Steady state | No idle transport child after startup | Same probe, sampled twice |
| Type integrity | Source compiles | Project typecheck and build |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Client teardown cascades into protocol sessions | External | Green | Without it the fix could not reach the children |
| Protocol reopens a session on demand | External | Green | Without it releasing idle transports would break calls |
| Runtime loads the compiled bundle | Internal | Green | The build must be regenerated for the fix to take effect |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A manual becomes unreachable or noticeably slower in a way that matters.
- **Procedure**: Revert this phase's commit and rebuild. The change is confined to two lifecycle calls in one entry point; no configuration, credential, or tool definition is touched, so reverting restores the previous behavior exactly, including its leak.
<!-- /ANCHOR:rollback -->
