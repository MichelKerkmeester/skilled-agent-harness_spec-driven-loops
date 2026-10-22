---
title: "Feature Specification: Phase 21: fork-nudge-and-precompact-guards"
description: "A forked sub-agent's tool calls carry agent_id with its parent's session and transcript, so the context nudge told forks to write the parent's handoff note, and a fork's PreCompact wrote the parent's compact cache. This phase skips both for sub-agents."
trigger_phrases:
  - "fork nudge and precompact guards"
  - "phase 21 fork nudge and precompact guards"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 21: fork-nudge-and-precompact-guards

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-22 |
| **Branch** | `worktrees/197-fork-compact-pointer-fix` |
| **Parent Spec** | ../spec.md |
| **Phase** | 21 of 21 |
| **Predecessor** | 020-fork-session-guards |
| **Successor** | None |
| **Handoff Criteria** | Both skips ship with tests that fail first, and the built hooks behave as specified end to end |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 21** of the session relaunch loop specification.

**Scope Boundary**: the Claude context-nudge hook and the spec-kit PreCompact hook `compact-inject.ts`.

**Dependencies**:
- Phases 019 and 020, which found the fork hazards and confirmed `agent_id` on sub-agent tool calls.

**Deliverables**:
- The `agent_id` skip in `claude/context-nudge.mjs` and its tests.
- `isSubagentPayload` and the PreCompact skip in `compact-inject.ts`, its tests, and a log line that records when the field is absent.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A probe on Claude Code 2.1.306 showed that a fork's PostToolUse payload carries `agent_id` and `agent_type` with the parent's session id and transcript path. The context nudge then measured the parent's fill and asked the fork to write a handoff note under the parent's session. A fork's PreCompact also wrote the parent-keyed compact cache and signalled a compact boundary for the parent.

### Purpose
A sub-agent's activity no longer drives the parent's nudge, note or compact cache.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `context-nudge.mjs` exits with no output and no state write when the payload carries a non-empty `agent_id`.
- `compact-inject.ts` skips its cache write and boundary signal for such a payload, and logs `agent_id: absent` on every main-session compaction.

### Out of Scope
- Confirming that PreCompact payloads carry `agent_id`. The log line records the answer at the next real fork compaction.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/claude/context-nudge.mjs` | Modify | Sub-agent skip |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modify | Two nudge tests |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` | Modify | `isSubagentPayload`, skip and log line |
| `.skilled/skills/system-spec-kit/runtime/tests/hook-precompact.vitest.ts` | Modify | Helper tests |
| Two READMEs | Modify | Session-relaunch and spec-kit Claude hooks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A sub-agent's tool call never nudges | The fork nudge test passes and failed first. The empty-id test still nudges |
| REQ-002 | A sub-agent's PreCompact writes no parent cache and signals no boundary | Helper tests pass and failed first. The built hook logs the skip for an `agent_id` payload |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The unknown is recorded | Every main-session PreCompact logs `agent_id: absent` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Relaunch suite and the touched spec-kit suites pass in full.
- **SC-002**: Drift guards pass with no warning on the changed files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | PreCompact payloads carry `agent_id` for a fork | If not, the PreCompact skip never fires | Low harm: a fork's PreCompact reads the parent's transcript. The log line records the answer |
| Risk | The live `compact-inject` runs from gitignored `dist` | No effect until the runtime is rebuilt | Rebuild after merging |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether PreCompact payloads inside a fork carry `agent_id`.
<!-- /ANCHOR:questions -->

---


