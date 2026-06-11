---
title: "Feature Specification: Skill Advisor Cross-Session Reconnect Hardening"
description: "Hardens the mk-skill-advisor launcher so a live but unresponsive advisor daemon can be adopted or safely replaced without spawning a second writer. The phase brings the advisor launcher to parity with the simpler code-index launcher shape while preserving inherited stdio and non-detached child behavior."
trigger_phrases:
  - "skill advisor launcher respawn"
  - "cross session reconnect"
  - "dead socket recovery"
  - "owner lease single writer"
  - "advisor replay classifier"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/019-skill-advisor-cross-session-reconnect"
    last_updated_at: "2026-06-11T10:05:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Applied launcher reconnect hardening."
    next_safe_action: "Use deferrals for future follow-up."
    blockers: []
    key_files:
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-launcher-orphan-reaping.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-session-proxy.vitest.ts"
    session_dedup:
      fingerprint: "sha256:5a8b9fdfb3cf8de6e93f693cc9f79e2d78c409f7bce40d3dbad8f7f4d3a6c019"
      session_id: "skill-advisor-cross-session-reconnect-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The advisor launcher follows the simpler code-index reference shape, not the spec-memory re-election architecture."
      - "Release-without-kill and child-exit relaunch are deferred because B-parity is the acceptance bar for this phase."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Skill Advisor Cross-Session Reconnect Hardening

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| Level | 1 |
| Priority | P0 |
| Status | Complete |
| Created | 2026-06-11 |
| Parent Spec | `../spec.md` |
| Phase | 19 of 19 |
| Predecessor | `018-xce-feature-adoption-advisor-codegraph` |
| Successor | None |
| Handoff Criteria | Launcher parity fixes, sandbox tests, docs, and strict packet validation all pass. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase closes review findings in the skill-advisor launcher after the initial cross-session reconnect implementation. The launcher remains intentionally shaped like the simpler code-index launcher: inherited stdio, non-detached child, rebuild-on-start, one bootstrap lock, one owner lease, and reconnecting session proxy for secondary clients.

Scope boundary: repair dead-socket recovery, stale launcher lease cleanup, bootstrap-lock stale reclaim, model-server root cleanup, and skill-advisor replay classification. Do not introduce the spec-memory re-election architecture in this phase.

Dependencies:
- `.opencode/bin/lib/launcher-ipc-bridge.cjs` supplies the bridge decision and deep-probe respawn signal.
- `.opencode/bin/lib/launcher-session-proxy.cjs` supplies reconnecting MCP stdio bridging.
- `.opencode/bin/lib/model-server-supervision.cjs` supplies model-server control and process-tree helpers.
- The skill-advisor MCP package owns `npm run typecheck` and Vitest execution.

Deliverables:
- Dead or hung advisor sockets trigger a serialized respawn path instead of a silent launcher exit.
- Stale launcher leases with live child pids are adopted when responsive or reaped before replacement spawn.
- Bootstrap lock stale reclamation uses a five-minute stale window and atomic rename claim.
- The launcher terminates the Hugging Face model-server root process before clearing the shared pid.
- `advisor_validate` is not replayed across reconnect; `advisor_recommend` remains replayable.
- Packet docs describe the shipped state and the deliberate C2/C5 deferrals.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The first skill-advisor reconnect implementation added owner-lease and bridge happy paths, but it dropped the bridge module's `{ action: "respawn" }` decision. A daemon that still held a lease but stopped answering the deep probe could leave later sessions with no stdout response and no replacement daemon.

The stale launcher lease path also reclaimed the dead launcher pid without checking the recorded child pid. That could spawn a replacement while a wedged child still held resources, eroding the single-writer guarantee that the owner lease was added to protect.

### Purpose

Bring the skill-advisor launcher to code-index launcher parity for reconnect recovery: bridge responsive owners, respawn confirmed-dead sockets under serialization, and leave clear evidence in tests and packet docs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. Scope

### In Scope

- Handle bridge respawn decisions by reaping the recorded advisor child pid under the bootstrap lock and launching a replacement.
- Read stale launcher lease `childPid` and `socketPath` to adopt responsive children or defer cleanup until the bootstrap lock is held.
- Replace non-atomic bootstrap lock removal with atomic stale-claim rename and a 300 second stale threshold.
- Terminate the model-server root process and descendants on launcher exit and model-server RSS breach before clearing the shared pid.
- Move `advisor_validate` to the unsafe replay set while keeping `advisor_recommend` replayable.
- Add sandboxed Vitest coverage for dead-socket respawn, stale wedged child cleanup, and stale owner-lease serialization.
- Fill packet documentation with current shipped-state content.

### Out of Scope

- C2 release-not-kill behavior is deferred. This launcher remains B-shaped and does not release a detached advisor daemon for another owner.
- C5 relaunch-on-child-exit behavior is deferred. A child exit still ends the launcher rather than scheduling an in-process relaunch loop.
- Host daemon or live socket manipulation is out of scope. Tests must use temp database and socket directories.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify | Add respawn handling, stale lease cleanup, atomic lock reclaim, model-server root shutdown, and replay classifier hardening. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-launcher-orphan-reaping.vitest.ts` | Modify | Add sandboxed launcher recovery tests and strengthen stale lease serialization coverage. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/019-skill-advisor-cross-session-reconnect/spec.md` | Modify | Replace scaffold with current feature specification. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/019-skill-advisor-cross-session-reconnect/plan.md` | Modify | Replace scaffold with shipped implementation plan. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/019-skill-advisor-cross-session-reconnect/tasks.md` | Modify | Replace scaffold with completed task evidence. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/019-skill-advisor-cross-session-reconnect/implementation-summary.md` | Modify | Replace scaffold with final implementation summary and verification evidence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. Requirements

### P0 - Blocking Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| P0-1 | Dead or hung advisor socket recovery | A live lease holder whose socket fails the deep probe causes a serialized respawn and the requesting client receives a valid MCP initialize response. |
| P0-2 | Stale launcher lease safety | A stale launcher lease with a live wedged child pid does not produce two advisor daemons; the old child is reaped before replacement spawn. |
| P0-3 | Bootstrap serialization | Competing reclaimers serialize on the bootstrap lock and only one launcher remains as writer. |
| P0-4 | Replay classifier safety | `advisor_validate` is not replayable because it can persist outcome events; `advisor_recommend` remains replayable. |
| P0-5 | Model-server root cleanup | Launcher exit and model-server RSS breach signal the model-server root before process-tree reap and pid clear. |

### P1 - Required or Deliberately Deferred

| ID | Requirement | Resolution |
|----|-------------|------------|
| P1-1 | C2 release-not-kill behavior | Deferred. It belongs to the more complex re-election architecture, not this B-parity phase. |
| P1-2 | C5 relaunch-on-child-exit behavior | Deferred. The advisor launcher keeps the code-index lifecycle where child exit terminates the launcher. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Dead-socket respawn is covered by an end-to-end test that asserts stdout response, not only logs.
- Stale launcher lease handling reaps a live wedged child before replacement spawn.
- Two stale owner-lease reclaimers converge to one live writer.
- Skill-advisor typecheck passes through `npm run typecheck`.
- The launcher orphan-reaping and session-proxy Vitest files pass.
- CLI offline smoke remains `37/8/9`.
- Strict spec validation exits 0 for this packet.
- Comment-hygiene checks on changed code are clean.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | PID reuse during stale cleanup | A stale pid could identify a different process if enough time passes. | Tests use controllable live processes; runtime only reaps pids recorded in the current lease and guarded by liveness checks. |
| Risk | Bootstrap lock reclaim while a slow build is active | A live cold build could be interrupted by stale lock cleanup. | Use a 300 second stale threshold and atomic rename claim before deletion. |
| Risk | Replay of mutating validation calls | Duplicate outcome events could be persisted after reconnect. | Classify `advisor_validate` unsafe; keep only accepted low-risk `advisor_recommend` duplication. |
| Dependency | Bridge liveness semantics | Respawn depends on the bridge returning `{ action: "respawn" }` after consecutive deep-probe failures. | Mirror the code-index bridge handling and add launcher-level tests. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The review blueprint explicitly chose code-index parity for this phase and deferred the spec-memory-only lifecycle features.
<!-- /ANCHOR:questions -->
