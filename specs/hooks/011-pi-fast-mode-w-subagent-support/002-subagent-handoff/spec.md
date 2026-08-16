---
title: "Feature Specification: Phase 2: subagent-handoff [template:level-2/spec.md]"
description: "Add pi-gpt-fast-mode-style environment-based subagent handoff to pi-fast-mode-w-subagent-support: preference exported as PI_FAST_MODE_W_SUBAGENT_SUPPORT=1|0 and inherited by child pi processes."
trigger_phrases:
  - "subagent-handoff"
  - "fast mode handoff"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff"
    last_updated_at: "2026-08-16T09:20:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Authored phase docs from scaffold"
    next_safe_action: "Execute phase plan: add handoff.ts, wire index.ts, write handoff unit tests"
    blockers: []
    key_files:
      - "context/pi-gpt-fast-mode/src/handoff.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Precedence between --fast flag, inherited handoff env, and explicit /fast toggle in a child session"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: subagent-handoff

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
| **Status** | Draft |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-fork-and-package |
| **Successor** | 003-integration-and-tests |
| **Handoff Criteria** | Handoff unit tests pass; parent → child process preference propagation verified manually |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the pi-fast-mode-w-subagent-support specification.

**Scope Boundary**: Add the subagent handoff mechanism to the phase-1 fork. New file `src/handoff.ts` (env read/write), wiring in `src/index.ts` (write on toggle/flag, apply on `session_start`), identity constant `HANDOFF_ENV` in `src/types.ts`, and new unit tests for the handoff contract. No changes to target matching, config format, or indicator behavior.

**Dependencies**:
- Phase 1 fork (renamed package baseline)
- Reference implementation: `context/pi-gpt-fast-mode/src/handoff.ts` (commit `2ac61e0`) — env-export pattern; `PI_GPT_FAST_MODE=1|0` → ours `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1|0`

**Deliverables**:
- `src/handoff.ts` with `readHandoff` / `writeHandoff`
- `src/index.ts` wiring: handoff write on state change; handoff apply + precedence resolution on `session_start`
- `tests/handoff.test.ts` (vitest) covering read/write and precedence
- Updated README section documenting the handoff env contract

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

When a parent pi session runs with fast mode enabled and spawns subagents (via pi-subagents or any child pi process), the children start with fast mode **off** unless manually toggled — the preference is not inherited. pi-gpt-fast-mode solves this by exporting the desired state into `process.env`; child processes inherit the environment and confirm the preference on `session_start`. The forked engine (phase 1) has no such mechanism.

### Purpose

Give `pi-fast-mode-w-subagent-support` the same environment-inheritance handoff: one env var, written by the parent whenever the desired state changes, read and applied by each child at session start, gated by the child's own target matching so injection still only happens on supported models.

### Non-Goals

- No changes to how `before_provider_request` matches targets or injects `service_tier`
- No IPC/network handoff (env inheritance is the mechanism; it is the deliberate, simple contract)
- No tier handoff (children inherit the parent's on/off preference; the tier stays per-target from config)
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `src/handoff.ts`: `HANDOFF_ENV = "PI_FAST_MODE_W_SUBAGENT_SUPPORT"`, `readHandoff(env)` → `boolean | undefined`, `writeHandoff(desired, env)` → sets `"1"|"0"` (pattern from `context/pi-gpt-fast-mode/src/handoff.ts`)
- `src/types.ts`: export `HANDOFF_ENV`
- `src/index.ts` wiring:
  - after `/fast` toggle and `--fast` flag application: `writeHandoff(config.enabled)`
  - on `session_start`: resolve effective desired state = explicit `--fast` flag > inherited handoff env > persisted `config.enabled`; write the resolved value back to env; persist if changed
- `tests/handoff.test.ts`: read/write round-trip, invalid values → undefined, precedence resolution, env write on toggle
- README: document the handoff env contract and subagent behavior

### Out of Scope

- Handoff for non-OpenAI providers (target matching already restricts injection)
- Toggling the parent's own session from a child's state change (one-directional inheritance)
- In-session install/verification (phase 3)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `src/handoff.ts` | Create | env read/write helpers |
| `src/types.ts` | Modify | add HANDOFF_ENV constant |
| `src/index.ts` | Modify | write handoff on state change; apply + resolve precedence on session_start |
| `tests/handoff.test.ts` | Create | handoff unit tests |
| `README.md` | Modify | handoff contract section |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional Requirements

| ID | Requirement | Verification |
|----|-------------|--------------|
| REQ-FUNC-1 | `writeHandoff(true/false)` sets `PI_FAST_MODE_W_SUBAGENT_SUPPORT` to `"1"`/`"0"` in the given env object | unit test |
| REQ-FUNC-2 | `readHandoff` returns `true`/`false` for `"1"`/`"0"`, `undefined` for unset/invalid | unit test |
| REQ-FUNC-3 | Toggling `/fast` or applying `--fast` rewrites the handoff env immediately | unit test (mock env) |
| REQ-FUNC-4 | Child `session_start`: handoff env present → effective desired state = handoff value (unless `--fast` flag overrides); env absent → persisted config | unit test (precedence) |
| REQ-FUNC-5 | Injection remains gated by target matching — handoff only sets the desired state, never bypasses `isSupportedModel`-equivalent matching | existing payload tests stay green |
| REQ-FUNC-6 | Child processes spawned later inherit the current env value (no per-child API) | manual two-process check |

### Non-Functional Requirements

| ID | Requirement | Verification |
|----|-------------|--------------|
| REQ-NFR-1 | No new runtime dependencies | package.json unchanged |
| REQ-NFR-2 | Handoff code does not touch provider payloads directly (single responsibility, matching upstream pattern) | code review + tests |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] `npm test` exit 0 including the new `tests/handoff.test.ts`
- [ ] `npm run typecheck` exit 0
- [ ] Manual two-process check: parent with fast mode on → spawned child process env shows `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1`; child session reports fast mode enabled on a supported model
- [ ] `rg -n "PI_FAST_MODE_W_SUBAGENT_SUPPORT" src/` covers types, handoff, index wiring, and README consistently
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Precedence ambiguity (flag vs env vs persisted config) confuses users | Medium | Medium | Documented precedence order; unit tests pin it; README example |
| Env var name collision with another tool | Low | Low | Namespaced name `PI_FAST_MODE_W_SUBAGENT_SUPPORT`; grep before finalizing |
| Child applies handoff then user toggles off — env write from child leaks to sibling subagents | Medium | Low | Accept: child env is copy-on-spawn; document that children do not rewrite the parent's env, only their own process env |
| `session_start` ordering vs pi-subagents env injection | Low | Medium | Manual two-process test in handoff criteria |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

| Question | Impact | Decision Needed By |
|----------|--------|-------------------|
| Should `/fast status` also display the inherited handoff source (flag/env/persisted)? | UX clarity | Phase 2 execution |
| Keep upstream's exact `writeHandoff` mutation style (mutates env in place) vs return a copy? | API shape of handoff.ts | Phase 2 execution |
<!-- /ANCHOR:questions -->
