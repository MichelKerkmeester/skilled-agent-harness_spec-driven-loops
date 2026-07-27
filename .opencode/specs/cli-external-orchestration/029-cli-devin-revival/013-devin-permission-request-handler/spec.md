---
title: "Feature Specification: Devin PermissionRequest handler"
description: "Build a real PermissionRequest adapter for Devin CLI, replacing the explicit-empty registration now that live testing confirmed the event fires and silently rejects every approval-needing tool call."
trigger_phrases:
  - "devin permission request handler"
  - "devin permission request adapter"
  - "devin approval gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/013-devin-permission-request-handler"
    last_updated_at: "2026-07-27T07:00:00Z"
    last_updated_by: "claude"
    recent_action: "Phase re-scaffolded (Planned)."
    next_safe_action: "Build permission-request-policy.mjs; register in .devin/hooks.v1.json."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "devin-permission-request-handler"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Live probe (backed-up hooks.v1.json, temporary unconditional-log hook) confirmed PermissionRequest fires with a real payload ({hook_event_name, tool_name, tool_input, tool_use_id, session_id, prompt_id}) under devin -p with default --permission-mode auto."
      - "Today's registration is an explicit empty array (\"PermissionRequest\": []), so every approval-needing tool call is silently rejected -- the CLI's own message confirms this: the write was rejected because the session runs non-interactively without dangerous permission mode."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Devin PermissionRequest handler

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../012-devin-hook-hardening/spec.md` (dependency — the trim-and-fallback pattern and process-test-suite shape this phase reuses); `../008-devin-hook-parity/spec.md` (dependency — built the adapters and shared cores this phase composes) |
| **Successor** | `../014-hook-adapter-shared-boilerplate-and-claude-codex-fix/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A controlled live probe (temporary unconditional-log hook wired into `.devin/hooks.v1.json`, backed up first and restored after) confirmed that `devin -p "Create a new file at /tmp/..."` under the CLI's default `--permission-mode auto` dispatches a real `PermissionRequest` event with payload `{hook_event_name, tool_name, tool_input, tool_use_id, session_id, prompt_id}`. Today `.devin/hooks.v1.json` registers `"PermissionRequest": []` — an explicit empty array — so every tool call that needs approval is silently rejected. The CLI's own runtime message confirms this: "the write was rejected — the session is running in non-interactive mode without dangerous permission mode, so tool calls that need approval can't be auto-approved." Every other runtime (Claude, Codex, Cursor) has a real approval-decision adapter for its equivalent event; Devin does not.

### Purpose
Build `permission-request-policy.mjs`: a real adapter that classifies the incoming `tool_name`/`tool_input` as write-class (delegating to `guardCore.isExemptTargetPath`) or exec-class (delegating to `dispatch-rule-checks.mjs`'s `readHardRules`/`evaluate`), and defaults to deny for anything it cannot classify — never widening approval beyond what the shared cores already permit for other runtimes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs`.
- Classify write-class tool calls (`write`, `edit`, or equivalent) via `guardCore.isExemptTargetPath(filePath, projectDir)`, reusing the exact function the spec-gate adapters already call.
- Classify exec-class tool calls (`bash`/`run_command` or equivalent) via `dispatch-rule-checks.mjs`'s `readHardRules`/`evaluate`.
- Default-deny anything that does not match a recognized tool-name/shape — an unclassifiable call must never fall through to allow.
- Register the new adapter into `.devin/hooks.v1.json`'s `PermissionRequest` array, replacing the current `[]`.
- Add a process-level test suite (`permission-request-policy.test.mjs`) mirroring the discriminating matrix shape used in `spec-gate-devin.test.mjs` (phase 012).

### Out of Scope
- Modifying `spec-gate-core.mjs`, `dispatch-rule-checks.mjs`, or any other shared core — this phase composes existing cores, it does not change their policy.
- Live-verifying `PostCompaction` — that requires a genuinely long session and cannot be forced by a single probe command; tracked separately (open question in the parent `spec.md`).
- Building approval UX or prompting — the adapter is a pure allow/deny decision function; there is no interactive prompt path in non-interactive `devin -p` sessions.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs` | Create | Real `PermissionRequest` adapter: write-class via `isExemptTargetPath`, exec-class via `dispatch-rule-checks`, default-deny otherwise. |
| `system-spec-kit/runtime/hooks/devin/permission-request-policy.test.mjs` | Create | Process-level discriminating test matrix. |
| `.devin/hooks.v1.json` | Modify | Register the new adapter in the `PermissionRequest` array (currently `[]`). |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The adapter classifies write-class tool calls using the same `isExemptTargetPath` function the spec-gate adapters already call. | Grep confirms a single shared import, not a re-implementation; a non-exempt write path denies. |
| REQ-002 | The adapter classifies exec-class tool calls using `dispatch-rule-checks.mjs`'s `readHardRules`/`evaluate`. | A hard-blocked exec pattern denies; an allowed one approves. |
| REQ-003 | Any tool call the adapter cannot classify defaults to deny. | A synthetic unknown `tool_name` produces a deny decision, never a silent allow. |
| REQ-004 | The adapter is registered in `.devin/hooks.v1.json`'s `PermissionRequest` array. | `.devin/hooks.v1.json` no longer contains `"PermissionRequest": []`; the array references the new adapter under the documented nested `{matcher, hooks:[{type,command,timeout}]}` shape. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | A process-level discriminating test suite covers write-allow, write-deny, exec-allow, exec-deny, and unclassifiable-deny rows. | `permission-request-policy.test.mjs` passes all rows; at least one row fails against a naive always-allow stub, proving the suite is discriminating. |
| REQ-006 | The fix is verified against a real Devin CLI dispatch, not only the process-test suite. | A live `devin -p` probe (mirroring the phase's original discovery methodology) shows an approval-needing call now resolves through the new adapter instead of the empty-array silent rejection. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `permission-request-policy.test.mjs` passes all discriminating rows.
- **SC-002**: The shared spec-gate core suite and `dispatch-rule-checks` suite remain green (no regression from composing them).
- **SC-003**: A live `devin -p` probe confirms the new adapter resolves a real approval-needing call.
- **SC-004**: Phase 013 strict validation passes with 0 errors and 0 warnings.
- **SC-005**: Recursive parent strict validation (029-cli-devin-revival) passes with 0 errors and 0 warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Default-deny is too strict and blocks a legitimate, currently-silently-rejected workflow | Low — strictly better than today's blanket silent rejection | Live-probe verification (REQ-006) before claiming completion. |
| Risk | Composing two shared cores' decision functions introduces a precedence bug (write-class check masking an exec-class deny or vice versa) | Medium | Discriminating test matrix (REQ-005) exercises both classes independently and in combination. |
| Dependency | Phase 008 (devin-hook-parity) | Provides the shared-core composition pattern and the live nested-schema registration this phase follows | Complete. |
| Dependency | Phase 012 (devin-hook-hardening) | Provides the trim-and-fallback `projectDir` pattern and the process-test-suite shape this phase reuses | Complete. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The adapter fails closed (deny) on malformed input, missing identity, or internal error — the opposite fail-direction from the other Devin adapters, because a `PermissionRequest` denial is the safe default while a spec-gate/dispatch-guard denial-by-default would break unrelated correctly-routed work.
- **NFR-R02**: Classification never mutates state; it is a pure decision function over the payload and the shared cores it composes.

### Security
- **NFR-S01**: No adapter logs or transmits raw payload contents (file contents, command strings) that could contain user secrets.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Malformed or non-JSON stdin denies (fail-closed), unlike the other Devin adapters' fail-open convention.
- A `tool_name` that matches neither the write-class nor exec-class recognized set denies.
- Whitespace-only or missing `cwd` falls back via the trim-and-fallback pattern established in phase 012.

### State Transitions
- No persistent state is written by this adapter; it is a stateless allow/deny decision.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 1 new adapter + 1 new test file + 1 registration edit. |
| Risk | 12/25 | Fail-closed-by-default is the safe direction, but composing two shared cores' decisions needs a discriminating test matrix to avoid a precedence bug. |
| Research | 6/20 | Live event shape and rejection behavior already confirmed by the phase's own discovery probe; classification pattern precedented by existing spec-gate/dispatch-guard adapters. |
| **Total** | **28/70** | **Level 2 — new adapter composing existing shared cores, with a live-verification requirement.** |
<!-- /ANCHOR:complexity -->

---

## 7. OPEN QUESTIONS

- None currently blocking. `PostCompaction` live-verification remains a separate open question tracked in the parent `spec.md`, not this phase.
<!-- /ANCHOR:questions -->

---

## Related Documents
- `plan.md`, `tasks.md`, `checklist.md`
- `../012-devin-hook-hardening/spec.md` (predecessor — trim-and-fallback pattern and process-test-suite shape)
- `../008-devin-hook-parity/spec.md` (predecessor — shared-core composition pattern, live nested-schema registration)
- `../hook-testing-results.md` §7c (Q3 PermissionRequest live-fire finding this phase acts on)
