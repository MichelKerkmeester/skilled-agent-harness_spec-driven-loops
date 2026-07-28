---
title: "Feature Specification: Cursor goal hooks"
description: "Port the runtime-neutral goal core to Cursor: sessionStart injection (prebind-style), an optional preToolUse agent_message refresh gated on phase 002's capability matrix, and sessionEnd verify, with fail-open behavior everywhere since Cursor hooks are shared with the editor, not just CLI dispatch."
trigger_phrases:
  - "cursor goal hooks"
  - "cursor sessionStart goal injection"
  - "cursor goal fail-open"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/004-cursor-goal-hooks"
    last_updated_at: "2026-07-28T20:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored phase spec, plan, tasks, checklist, implementation-summary"
    next_safe_action: "Wait for phase 002's capability matrix before starting Phase 1"
    blockers:
      - "Depends on phase 002's capability-probe matrix for the preToolUse refresh cadence decision."
    key_files:
      - ".opencode/hooks/goal/lib/goal-core.cjs"
      - ".cursor/hooks.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether phase 002 confirms preToolUse agent_message refresh is worth adding, or sessionStart-only is the honest tier."
    answered_questions:
      - "Cursor's beforeSubmitPrompt/prompt-submit path is confirmed non-delivery, same workaround class as spec-gate-prebind."
      - "Cursor hooks are shared with the editor, so fail-open is a hard requirement, not a preference."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Cursor goal hooks

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-28 |
| **Branch** | `skilled/v4.0.0.0` (direct, per parent packet's operator choice) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | `003-devin-goal-hooks` |
| **Successor** | `005-pi-goal-hooks` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A goal set for the work does not survive into a Cursor session. OpenCode has passive per-turn goal injection via `mk-goal.js`; Cursor has nothing, and its most natural injection surface (`beforeSubmitPrompt`) is confirmed non-delivery, ruling out the straightforward per-turn approach used elsewhere.

### Purpose

Port the runtime-neutral goal core (built in phase 001) to Cursor using its two working hook surfaces — `sessionStart` for injection and `sessionEnd` for verify — with `sessionStart` injection built prebind-style (the same workaround class already used for `spec-gate-prebind`) since there is no reliable per-turn re-injection surface. An optional `preToolUse` `agent_message` refresh is added only if phase 002's capability probe confirms Cursor's realistic injection cadence supports it. Because Cursor hooks are shared with the editor (not just CLI dispatch), every adapter must fail open: a goal-core error must never block or degrade the editor experience.

### User Story

As an operator working inside a Cursor session (editor or `cursor-agent -p`), I need the active goal to be visible to the agent at session start and verified at session end, without any risk that a goal-hook bug ever blocks or degrades my editor session.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `sessionStart` adapter: injects the `[active_goal]` block, prebind-style, built on phase 001's `lib/goal-core.cjs`.
- Optional `preToolUse` `agent_message` refresh adapter, added conditionally — only if phase 002's matrix confirms Cursor's realistic injection cadence supports a mid-session refresh; otherwise this spec's scope narrows to `sessionStart` + `sessionEnd` only, and that narrowing is documented rather than silently dropped.
- `sessionEnd` adapter: runs the ported heuristic verifier against the shared goal state.
- Registration of all adapters in `.cursor/hooks.json`.
- Fail-open behavior in every adapter: any goal-core read/write/render error is caught and the hook exits as a no-op success, never a block, never a degraded editor response.
- Adapter files at `.opencode/hooks/goal/cursor/`.
- Co-located `node --test` suite per adapter.
- A live smoke proof: goal text reaching the model in a real `cursor-agent -p` session, or an editor session if CLI auth is unavailable (documented honestly if the fallback is used).

### Out of Scope

- Building `lib/goal-core.cjs` itself (phase 001).
- The capability-probe methodology and matrix itself (phase 002) — this spec only consumes its output.
- Devin and Pi adapters (phases 003, 005).
- Any change to `mk-goal.js`'s own OpenCode-only behavior or state file.
- Dispatch-shape coverage and OpenCode plugin symlinks (phases 006, 007).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/hooks/goal/cursor/session-start.cjs` | Create | sessionStart adapter: prebind-style injection |
| `.opencode/hooks/goal/cursor/pre-tool-use.cjs` | Create (conditional) | Optional agent_message refresh, only if phase 002 confirms cadence |
| `.opencode/hooks/goal/cursor/session-end.cjs` | Create | sessionEnd adapter: heuristic verify |
| `.cursor/hooks.json` | Modify | Register the new adapters |
| `.opencode/hooks/goal/cursor/*.test.cjs` | Create | Co-located adapter tests, including fail-open simulation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `sessionStart` injects the goal brief, prebind-style. | A live `cursor-agent -p` (or editor, if noted as fallback) session shows the `[active_goal]` block reaching the model at session start. |
| REQ-002 | Every adapter fails open on a goal-core error. | A simulated goal-core error (forced exception/corrupt state) does not block, error, or visibly degrade the Cursor session; the hook exits as a no-op success. |
| REQ-003 | `sessionEnd` runs the ported heuristic verifier. | A test session with a clearly-met and a clearly-unmet goal both produce the expected verifier output without throwing. |
| REQ-004 | Adapters are registered correctly in `.cursor/hooks.json`. | JSON parses; hook entries point at real files under `.opencode/hooks/goal/cursor/`; a live session confirms each configured hook actually fires. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Optional `preToolUse` refresh is built only if phase 002 confirms cadence support. | If phase 002's matrix says no, this spec ships without it and documents the narrowing in `implementation-summary.md`; if yes, the refresh adapter is built and tested. |
| REQ-006 | Adapters are dependency-free of anything but phase 001's `lib/goal-core.cjs` and Node builtins. | Manual import-graph trace confirms no other skill-owned dependency. |
| REQ-007 | Co-located tests cover the happy path and the fail-open path for each adapter. | `node --test` on each adapter's test file passes, including at least one forced-error fail-open case per adapter. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `sessionStart` injection is verified live in a real Cursor session (CLI or editor fallback, documented either way).
- **SC-002**: `sessionEnd` verify is tested against both a met and an unmet goal.
- **SC-003**: Fail-open behavior is explicitly tested per adapter by simulating a goal-core error and confirming the Cursor session proceeds unaffected.
- **SC-004**: `.cursor/hooks.json` registration is confirmed correct — JSON valid, paths real, hooks observed firing live.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Cursor hooks are shared with the editor, not just CLI dispatch. | A goal-hook bug could block or degrade every Cursor editor session on this machine, not just dispatched CLI runs. | Fail-open is a P0 requirement on every adapter; explicit fail-open regression test per adapter before merge. |
| Risk | `beforeSubmitPrompt`/prompt-submit confirmed non-delivery. | No reliable per-turn re-injection surface exists; the goal brief may go stale mid-session without the optional refresh. | `sessionStart` prebind-style injection as the honest baseline tier; optional `preToolUse` refresh only if phase 002 proves it viable. |
| Dependency | Phase 001's `lib/goal-core.cjs`. | Adapters cannot render/read/write goal state without it. | This spec starts only after phase 001 ships. |
| Dependency | Phase 002's capability-probe matrix. | The `preToolUse` refresh scope decision (REQ-005) is unresolved without it. | This spec's Phase 1 (Setup) explicitly gates on reading phase 002's matrix before implementation begins. |
| Dependency | `cursor-agent -p` CLI auth availability for the live smoke proof. | If unavailable, the live proof must fall back to an editor session. | Documented honestly in `implementation-summary.md` rather than skipped or overclaimed. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether phase 002 confirms `preToolUse` `agent_message` refresh is worth adding, or `sessionStart`-only is the honest tier for this runtime.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability

- **NFR-R01**: Fail-open is non-negotiable — no goal-hook error path may ever surface as a block, error, or visible degradation in the shared editor session.

### Security

- **NFR-S01**: The shared `active-goal.json` state file is read-only from the Cursor adapters' perspective except through phase 001's `lib/goal-core.cjs` write path (same atomic temp+rename, 0600 hygiene as `mk-goal.js`).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Error Scenarios

- **goal-core throws on read**: Adapter catches, logs (if a safe log surface exists), exits as no-op success; session proceeds with no goal block injected.
- **Corrupt or missing `active-goal.json`**: Treated the same as "no active goal" — silent no-op, not an error surfaced to the editor.
- **`.cursor/hooks.json` misconfigured (wrong path)**: Cursor itself fails to find the hook; this is a registration bug caught by REQ-004's live-firing check, not a runtime fail-open case.

### Session Boundaries

- **No active goal set**: `sessionStart` injects nothing; `sessionEnd` verify is a no-op.
- **Goal set mid-session by another runtime (shared state file)**: `sessionStart` reads whatever is current at session start; no re-read occurs unless the optional `preToolUse` refresh (REQ-005) is built.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:related -->
## RELATED DOCUMENTS

- **Parent packet**: `.opencode/specs/cli-external-orchestration/032-goal-hooks-cross-runtime/spec.md`
- **Phase 001**: `.opencode/specs/cli-external-orchestration/032-goal-hooks-cross-runtime/001-goal-core-and-state/spec.md` — the goal core this phase builds on
- **Phase 002**: `.opencode/specs/cli-external-orchestration/032-goal-hooks-cross-runtime/002-capability-probes/spec.md` — the capability matrix this phase's REQ-005 depends on
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
<!-- /ANCHOR:related -->
