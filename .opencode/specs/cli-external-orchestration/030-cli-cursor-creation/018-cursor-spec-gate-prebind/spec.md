---
title: "Feature Specification: Cursor session-start spec-gate prebinding"
description: "Activate Cursor's existing pre-tool mutation gate through a guarded session-start prebind while preserving fail-open behavior and autonomous child exemptions."
trigger_phrases:
  - "Cursor spec gate prebind"
  - "Cursor Gate-3 enforcement"
  - "sessionStart gate state"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/018-cursor-spec-gate-prebind"
    last_updated_at: "2026-07-26T06:02:44Z"
    last_updated_by: "opencode"
    recent_action: "Phase and recursive strict validation pass with zero errors and warnings."
    next_safe_action: "Pin final evidence to the resulting commit SHA after an explicit commit request."
    blockers: ["Final P1 evidence requires a commit SHA; no commit has been requested."]
    key_files: [".opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs", ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs", ".cursor/hooks.json"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cursor-spec-gate-prebind"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Wire Cursor session-start spec gate prebinding

<!-- SPECKIT_LEVEL: 2 -->
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
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-25 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../017-codex-claude-hooks-discovery-mirrors/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Cursor's deny-capable `preToolUse` adapter is wired, but it only enforces when session gate state is already `open`. The prompt classifier that normally opens that state is registered on `beforeSubmitPrompt`, an event that does not fire under the installed Cursor CLI, so top-level Cursor sessions never activate the guard even with `MK_SPEC_GATE_ENFORCE=1`.

An untracked startup prebind draft can bridge that event gap, but its current form writes shared fallback state when `session_id` is absent, opens state for autonomous child sessions, and can overwrite a previously satisfied or skipped state on a repeated start.

### Purpose
Wire a fail-open `sessionStart` prebind that activates opt-in enforcement only for identifiable top-level sessions, accepts a validated `MK_SPEC_FOLDER`, and leaves disabled or dispatched child sessions behaviorally unchanged.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Harden `spec-gate-prebind.mjs` around session identity, child exemption, state preservation, and validated folder binding.
- Resolve the autonomous-child Gate-3 contract: a dispatched/child session is now a COMPLETE no-op in the shared core (`spec-gate-core.mjs`) — it never denies, never advises, and never reads or writes gate state. This expands scope to the shared core because `AGENTS.md` §2 (autonomous-child exemption) and the prior core behavior (advise-only) contradicted each other; `AGENTS.md` prevails.
- Add process-level tests for every environment and state transition in the startup matrix, plus padded-session-id, child-classify, and child-with-pre-existing-state rows.
- Register the hook in `.cursor/hooks.json` and its discovery mirror.
- Update authoritative Cursor hook documentation and packet continuity.

### Out of Scope
- Changing the shared `evaluateMutation()` deny/exemption policy for interactive sessions. The deny predicate and path exemptions remain authoritative.
- Making `beforeSubmitPrompt` work in Cursor CLI. That is a runtime event-delivery limitation.
- Enabling enforcement by default. `MK_SPEC_GATE_ENFORCE=1` remains an explicit operator opt-in.
- Multi-root Cursor workspace support. Both spec-gate adapters use only `workspace_roots[0]`, like every other Cursor hook in this repo; writes under a secondary root read as out-of-repo and are not enforced. This is tracked as a separate all-Cursor-hooks follow-up rather than a partial fix here.
- Live destructive editor testing. The shared Cursor CLI/editor config makes automated process tests the safe primary gate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` | Create | Guarded session-start state initialization; session id preserved verbatim. |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.test.mjs` | Create | Process-level behavior matrix, including padded-id and enforce-off-binding rows. |
| `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs` | Modify | Make a dispatched/child session a complete Gate-3 no-op in `classifyIntent()` and `evaluateMutation()`. |
| `.opencode/plugins/tests/mk-spec-gate.test.cjs` | Modify | Pin no question, state creation, telemetry, or denial through the OpenCode consumer. |
| `.cursor/hooks.json` | Modify | Register the prebind on `sessionStart`. |
| `.cursor/hooks/spec-gate-prebind.mjs` | Create symlink | Add discovery-only mirror coverage. |
| Runtime, orchestration, and manual-playbook references | Modify | Document active wiring, boundaries, and the shared child no-op contract. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A valid `MK_SPEC_FOLDER` pre-satisfies the session gate. | Persisted state is `satisfied` with source `flags` and the validated absolute path. |
| REQ-002 | `MK_SPEC_GATE_ENFORCE=1` opens an otherwise-unbound top-level session. | The next in-repo Cursor `Write` is denied by the unchanged enforce adapter. |
| REQ-003 | Disabled and autonomous child sessions remain full no-ops. | `MK_SPEC_GATE_DISABLED=1` writes nothing; an `AI_SESSION_CHILD=1` session never opens/reads/writes gate state, never receives the Gate-3 question, and never denies or advises through the shared core. |
| REQ-004 | Missing or malformed startup identity fails open. | Invalid JSON and missing/empty `session_id` return allow without state files. |
| REQ-005 | Repeated startup cannot regress terminal gate state. | Existing `satisfied` and `skipped` records remain byte-equivalent. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Invalid folder declarations never satisfy the gate. | Invalid binding stays absent when enforce is off and opens only when enforce is explicitly on. |
| REQ-007 | Runtime registration and documentation match the implementation. | Config path resolves, mirror resolves, inventories count it, and validators pass. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The process-level matrix passes every startup state and environment row.
- **SC-002**: A prebound valid folder allows the existing enforce adapter to permit mutation, while an enforce-only top-level session denies it.
- **SC-003**: Cursor hook configuration, mirror inventory, and canonical hook references all identify the prebind as active.
- **SC-004**: Phase 018 and packet 030 pass strict validation with no ghost child metadata.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shared gate-state core | State persistence and the child no-op contract are shared across every runtime adapter | The child no-op is enforced in `classifyIntent()`/`evaluateMutation()` so all consumers (Cursor, Codex, Claude, OpenCode) behave identically; the full core suite re-runs. |
| Dependency | Compiled Gate-3 classifier | Folder binding must inspect live metadata | Fail open when import or validation fails. |
| Risk | Cursor editor shares `.cursor/hooks.json` | A bad hook could affect editor startup | Hook always emits allow and swallows internal errors. |
| Risk | Repeated `sessionStart` delivery | Terminal state could be reopened | Preserve existing `satisfied` and `skipped` records. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Perform at most one folder validation and one atomic state write per startup.
- **NFR-P02**: Add no work to the per-tool path beyond the already-wired enforce adapter.

### Security
- **NFR-S01**: Accept a folder only through filesystem-backed `validateSpecFolderBinding()`.
- **NFR-S02**: Never write state for a missing session identity or an autonomous child session.

### Reliability
- **NFR-R01**: Every malformed payload, missing dependency, invalid path, and persistence failure must fail open.
- **NFR-R02**: Re-running startup for the same terminal state must be idempotent.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty or invalid stdin returns the Cursor allow envelope and writes nothing.
- Missing or whitespace-only `session_id` returns allow and writes nothing.
- An invalid, ambiguous, or out-of-tree folder never becomes satisfied state.

### Error Scenarios
- Classifier or filesystem failure is swallowed by the entrypoint and leaves mutation behavior unchanged.
- Atomic state-write failure returns allow; enforcement remains inactive for that session.
- A repeated startup reads terminal state before deciding whether to write.

### State Transitions
- No declaration + enforce off: no state.
- Valid declaration: `satisfied` (regardless of the enforce flag).
- No valid declaration + enforce on: `open` for top-level sessions only.
- Existing `satisfied` or `skipped`: unchanged.
- Autonomous child (`AI_SESSION_CHILD=1`): complete no-op — no state read, write, question, deny, or advise.

### Limitation: Multi-root Workspaces
- Both spec-gate adapters and every other Cursor hook in this repo resolve `workspace_roots[0]` only. A mutation under a secondary Cursor workspace root reads as out-of-repo and is not enforced. This is not fixed here; a single root-set policy across all Cursor adapters is tracked as a separate follow-up to avoid a partial, inconsistent fix.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | One hook, one test, one config entry, and bounded docs. |
| Risk | 12/25 | Shared CLI/editor startup and mutation authorization state. |
| Research | 6/20 | Existing core and live event contract are known but required audit. |
| **Total** | **25/70** | **Level 2 due to policy risk and verification needs.** |
<!-- /ANCHOR:complexity -->

---

## 7. OPEN QUESTIONS

- **Autonomous-child Gate-3 contract — RESOLVED.** `AGENTS.md` §2 (autonomous-child exemption: "must not emit Gate-3 questions") and the shared core's prior advise-only child behavior contradicted. Resolution: `AGENTS.md` prevails; a child session is a complete no-op in the shared core.
- **Multi-root Cursor workspaces — RESOLVED as deferred.** Both spec-gate adapters use `workspace_roots[0]`, like every other Cursor hook here. Rather than partially fix only the gate adapters, a single root-set policy across all Cursor adapters is tracked as a separate follow-up.
<!-- /ANCHOR:questions -->

---

## Related Documents
- `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`
- `../handover.md`
- `.opencode/skills/sk-code/code-opencode/references/shared/hooks.md`
