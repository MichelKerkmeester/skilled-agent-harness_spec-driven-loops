---
title: "Feature Specification: Phase 20: fork-session-guards"
description: "A forked sub-agent shares its parent's session id, so session-prime handed a compacting fork the parent's cached brief and a fork could run the relaunch CLI against the parent's handoff note. This phase closes both."
trigger_phrases:
  - "fork session guards"
  - "phase 20 fork session guards"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 20: fork-session-guards

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-22 |
| **Branch** | `worktrees/197-fork-compact-pointer-fix` |
| **Parent Spec** | ../spec.md |
| **Phase** | 20 of 20 |
| **Predecessor** | 019-fork-compact-pointer-research |
| **Successor** | None |
| **Handoff Criteria** | Both guards ship with tests that fail first, and an end-to-end run of each built hook behaves as specified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 20** of the session relaunch loop specification.

**Scope Boundary**: the Claude `session-prime` compact path and a new Claude PreToolUse guard for the relaunch CLI.

**Dependencies**:
- Phase 019, which found both hazards and built the fork check this phase reuses.

**Deliverables**:
- `claude/subagent-guard.mjs`, its registry row and its tests.
- `forkCompactedRecently` in the spec-kit `hooks/claude/shared.ts`, the skip in `session-prime.ts`, and their tests.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On 2026-10-21 fork `ae7668a35ed03d742` compacted, and `session-prime` injected "Recovered Context (Post-Compaction)" from a cache keyed by the parent's session id, then cleared that cache. A fork also runs the relaunch CLI with its parent's session id, so `claim`, `complete`, `keep` or `prepare` from a fork would act on the parent's handoff note, and `claimHandoff` accepts any well-formed id.

### Purpose
A fork's compaction leaves the parent's cached brief alone, and a fork cannot run the relaunch lifecycle commands.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Skip `session-prime` compact recovery, without clearing the cache, when a fork compacted in the last 5 seconds.
- A Claude PreToolUse guard that denies `session-relaunch.cjs` `claim`, `complete`, `keep` and `prepare` from a call that carries `agent_id`.

### Out of Scope
- The PreCompact cache write in `compact-inject.ts`. A fork's PreCompact reads the parent's transcript, so it refreshes the parent's brief rather than corrupting it, and whether its payload carries `agent_id` is unverified.
- The context nudge on PostToolUse inside a fork. It is the same kind of hazard and was not part of this request.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs` | Create | PreToolUse guard |
| `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` | Create | Guard tests |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Modify | Guard registration, rendered into `.claude/settings.json` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts` | Modify | Pinned binding count 99 to 100 |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts` | Modify | `forkCompactedRecently` |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts` | Modify | Skip on a fork compaction |
| `.skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts` | Modify | Helper tests |
| Two READMEs | Modify | Session-relaunch and spec-kit Claude hooks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A fork's compaction neither injects nor clears the parent's cached brief | Helper tests pass and failed first. The built hook stays silent and logs the skip for a fresh fork boundary |
| REQ-002 | A sub-agent cannot run the relaunch lifecycle commands | Guard tests pass and failed first. The guard denies a fork's `claim` and allows the main session's |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The guard is registered on every Claude checkout | `sync-hook-registrations.cjs --check` passes and the sync test passes |
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
| Dependency | Claude Code keeps sending `agent_id` for sub-agent tool calls | If it stops, the guard allows a fork's claim again | Observed on 2.1.306; a guard test pins the payload shape |
| Risk | The live `session-prime` runs from gitignored `dist` | The change has no effect until the runtime is rebuilt | Rebuild after merging |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether PreCompact and SessionStart payloads inside a fork carry `agent_id`. The tool-call payloads do.
<!-- /ANCHOR:questions -->

---


