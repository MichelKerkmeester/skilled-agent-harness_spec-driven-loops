---
title: "Feature Specification: Tell Claude Code sessions to dispatch native subagents instead of the cli-claude-code CLI"
description: "The cli-claude-code self-invocation guard said to use native capabilities but not how, so a Claude Code session tried the CLI route before dispatching a subagent."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Tell Claude Code sessions to dispatch native subagents instead of the cli-claude-code CLI

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-03 |
| **Branch** | `scaffold/079-claude-code-native-dispatch` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The guard in `.skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md` refuses self-invocation and says only "use native capabilities". It never says that native means an Agent-tool subagent, or that an effort level is pinned through an agent definition. A session needing Sonnet 5.5 at xhigh therefore checked the CLI route first, which the guard had already ruled out.

### Purpose
A Claude Code session reading the guard knows to dispatch a native subagent and how to pin its model and effort.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extend the "You ARE Claude Code already" bullet with the native route.
- Reword the guard comment in the prerequisite block.
- Reword the `$CLAUDECODE` dispatch rule to route to a native subagent.

### Out of Scope
- The guard logic itself - its detection is correct, only the guidance was missing.
- Other cli-* skills - none carries this Claude-specific guidance.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md` | Modify | Three guidance lines |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The guard text names the native route and how to pin model and effort | The three lines in `SKILL.md` say so |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Skill routing gates still pass | `parent-skill-check.cjs` and the compiled route guard exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No remaining guard line ends at "use native capabilities" without saying how.
- **SC-002**: The packet validates strict with `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Agent definitions in `~/.claude/agents/` | A pinned effort needs a matching definition | Name the definition pattern so a session can add one |
| Risk | The routing manifest hashes the skill text | Low | The pre-commit route remint re-mints it, and the route guard runs before commit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


