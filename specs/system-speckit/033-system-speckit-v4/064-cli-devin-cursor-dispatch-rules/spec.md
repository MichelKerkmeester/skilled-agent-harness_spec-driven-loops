---
title: "Feature Specification: Phase 64: cli-devin and cli-cursor dispatch rules"
description: "cli-devin's and cli-cursor's ALWAYS rule 2 sent every orchestrated dispatch through the deep-loop fan-out runner, which accepts only research and review loops, the same defect phase 63 fixed in cli-codex."
trigger_phrases:
  - "cli devin dispatch rules"
  - "cli cursor dispatch rules"
  - "cli devin cursor fanout rule scope"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 64: cli-devin and cli-cursor dispatch rules

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-24 |
| **Branch** | `worktrees/064-save-writer-continuity-fields` |
| **Parent Spec** | ../spec.md |
| **Phase** | 64 of 65 |
| **Predecessor** | 063-cli-codex-dispatch-rules |
| **Successor** | 065-cli-hermes-pi-dispatch-rules |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 64** of the system-spec-kit v4 specification. Phase 63 scoped cli-codex's fan-out rule and reported that cli-devin and cli-cursor carry the same wording; the operator asked for the same fix in both.

**Scope Boundary**: the two packets' `SKILL.md` and one new changelog entry each. The fan-out runner and cli-codex are not changed.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
ALWAYS rule 2 and the Execution Ownership section in cli-devin and cli-cursor told an orchestrator to delegate every orchestrated dispatch to `fanout-run.cjs`. That runner accepts only the `research` and `review` loop types (`ACTIVE_FANOUT_LOOP_TYPES`), so a single build or doc dispatch cannot follow the rule and has to use the child dispatch envelope in each packet's `references/providers-and-models.md` §5.

### Purpose
An orchestrator reading cli-devin or cli-cursor knows which dispatches go through the fan-out runner and which use the child envelope, as cli-codex now says.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- ALWAYS rule 2 and Execution Ownership in both packets, scoped to research and review lineages, pointing one-shot dispatches at the child envelope.
- Each packet's version and a changelog entry.

### Out of Scope
- cli-codex's sandbox gotcha. It rests on a Codex sandbox observation, and neither packet runs children under that sandbox.
- The success-criteria line and the Execution summary line that name the shared runtime, which cli-codex also kept.
- The fan-out runner itself.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-devin/SKILL.md` | Modify | Rule 2, Execution Ownership, version 1.4.3.0 |
| `.skilled/skills/cli-external-orchestration/cli-devin/changelog/v1.4.3.0.md` | Create | Changelog entry |
| `.skilled/skills/cli-external-orchestration/cli-cursor/SKILL.md` | Modify | Rule 2, Execution Ownership, version 1.4.2.0 |
| `.skilled/skills/cli-external-orchestration/cli-cursor/changelog/v1.4.2.0.md` | Create | Changelog entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The fan-out rule names what it covers in both packets. | Rule 2 and Execution Ownership limit the runner to research and review lineages and send one-shot dispatches to the child envelope. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Each change is versioned and routing stays fresh. | cli-devin `version: 1.4.3.0` and cli-cursor `version: 1.4.2.0`, each with a matching changelog; `compiled-route-guard.cjs` reports every hub fresh. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The old wording is gone from both packets and sk-doc validation passes on both `SKILL.md`.
- **SC-002**: Every compiled-routing hub stays fresh and the Hermes copies stay in sync.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The runner's accepted loop types | Medium | The rule names the two types the runner's own constant lists |
| Dependency | Each packet's envelope section | Low | Both `providers-and-models.md` hold "Dispatch envelope (child / detached sessions)" under §5 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
