---
title: "Feature Specification: Phase 8: spawn process-group hardening"
description: "The external-cli spawn boundary runs each CLI as its own process-group leader and tears down the whole group on timeout or abort, so a tool that forks background helpers cannot orphan them or hold the parent open on an inherited stdout pipe."
trigger_phrases:
  - "spawn process group hardening"
  - "cli process group kill"
  - "orphaned subprocess teardown"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/008-spawn-process-group-hardening"
    last_updated_at: "2026-08-20T05:52:00.000Z"
    last_updated_by: "claude"
    recent_action: "Hardened the spawn boundary to group-kill on timeout and abort with real-subprocess tests"
    next_safe_action: "Validate the packet recursively"
    blockers: []
    key_files:
      - ".opencode/skills/sk-communication/cli-communication-projection/src/transports/cli.ts"
      - ".opencode/skills/sk-communication/cli-communication-projection/test/transports/cli.test.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-spawn-process-group-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The child spawns detached so it leads its own process group; a negative-pid SIGKILL then tears down the whole group on POSIX, with a direct-child fallback where process groups are unavailable."
      - "The real spawn boundary is covered by subprocess tests that fork a background helper and assert it does not survive a timeout or an abort."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: spawn process-group hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-20 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 9 |
| **Predecessor** | 007-command-namespace-rename |
| **Successor** | (parent closeout) |
| **Handoff Criteria** | The default spawn boundary group-kills on timeout and abort, a forked helper does not survive either, the normal path is unchanged, and the package gate is green. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the sk-communication trigger commands packet.

**Scope Boundary**: A hardening of the phase-006 child-process spawn boundary only. No provider, transport wiring, engine table, entrypoint, or command behavior changes; only how the subprocess is grouped and torn down.

**Dependencies**:
- Phase 006 shipped `defaultChildProcessSpawn` with a stdin-close fix and a timeout that killed the direct child.

**Deliverables**:
- The spawn boundary runs the child detached and kills the whole process group on timeout and on abort.
- Real-subprocess tests that prove a forked helper does not outlive the dispatch.

**Changelog**:
- On phase close, refresh the matching parent changelog entry.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The phase-006 spawn boundary killed only the direct child on timeout. A CLI that forks a background helper (a model server, a language server) would orphan that helper, leaving it running after the dispatch. Worse, because a forked helper inherits the stdout pipe, the parent never observes `close`, so the whole projection hangs until the helper exits on its own.

### Purpose
Run each CLI as its own process-group leader and tear down the entire group on timeout or abort, so no forked helper survives the dispatch and no inherited pipe can keep the projection open, while leaving the normal completion path — stdout capture, stdin close, exit-code propagation — unchanged.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Spawning the child detached so it leads its own process group.
- Killing the whole group with a negative-pid SIGKILL on timeout and on abort, with a direct-child fallback where process groups are unavailable.
- Real-subprocess tests for the timeout, abort, and normal paths.
- A catalog and playbook note documenting the process-group teardown guarantee.

### Out of Scope
- Any change to the provider family, engine table, projection module, entrypoint, or command behavior.
- Windows process-group semantics beyond the direct-child fallback.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.../src/transports/cli.ts` | Modify | Spawn detached; group-kill on timeout and abort with a direct-child fallback. |
| `.../test/transports/cli.test.ts` | Modify | Real-subprocess tests for group teardown and the unchanged normal path. |
| `.../feature-catalog/provider-and-privacy/external-cli-provider.md` | Modify | Document the process-group teardown guarantee. |
| `.../manual-testing-playbook/fidelity-and-privacy/external-cli-provider-fallback.md` | Modify | Note the teardown coverage in the transport-test anchor. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A forked helper is killed when the dispatch times out. | A subprocess that forks a background helper and then trips the timeout leaves the helper dead, and the outcome reports `timedOut`. |
| REQ-002 | A forked helper is killed when the dispatch is aborted. | Aborting mid-run leaves the forked helper dead. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The normal completion path is unchanged. | A normal run still closes stdin (a stdin reader reaches EOF), captures stdout, and propagates exit code 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npm run check` (typecheck, build, test, import smoke) exits 0.
- **SC-002**: The timeout and abort tests fail against the pre-hardening code and pass after it.
- **SC-003**: The normal-path test passes both before and after, confirming no regression.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Detached spawn changes stdio or completion behavior | Low | stdio stays piped and the child is not unref'd, so the parent still awaits close; the normal-path test guards this. |
| Risk | Process groups are unavailable on some platform | Low | A direct-child SIGKILL fallback runs where a negative-pid signal does not apply. |
| Dependency | The phase-006 spawn boundary | Low | Shipped; this phase modifies it in place. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
