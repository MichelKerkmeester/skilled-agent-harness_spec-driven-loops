---
title: "Feature Specification: Phase 65: cli-hermes and cli-pi dispatch rules"
description: "cli-hermes and cli-pi told an orchestrator to delegate every dispatch to the shared deep-loop runtime, whose runner accepts only research and review loops, the defect phases 63 and 64 fixed in the other cli packets."
trigger_phrases:
  - "cli hermes dispatch rules"
  - "cli pi dispatch rules"
  - "cli hermes pi runtime delegation scope"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 65: cli-hermes and cli-pi dispatch rules

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
| **Phase** | 65 of 65 |
| **Predecessor** | 064-cli-devin-cursor-dispatch-rules |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 65** of the system-spec-kit v4 specification. Phase 64 reported that cli-hermes states the rule phases 63 and 64 fixed in other words; the operator asked for the remaining packets like it to be fixed. A search of all seven cli packets found one more, cli-pi. The `SKILL.md` of cli-claude-code and of cli-opencode never mention the shared runtime.

**Scope Boundary**: the two packets' `SKILL.md` and one new changelog entry each. The fan-out runner is not changed.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
cli-hermes and cli-pi told an orchestrator, in five places each, to send every dispatch to the shared deep-loop runtime: the core principle, Execution Ownership, Dispatch Lifecycle step 4, ALWAYS rule 2 and a success criterion. The runtime's runner accepts only the `research` and `review` loop types (`ACTIVE_FANOUT_LOOP_TYPES`, checked for every executor kind), so a single build or doc dispatch runs the CLI directly with the child environment. Every MiMo dispatch in this program ran `pi -p` that way.

### Purpose
An orchestrator reading cli-hermes or cli-pi knows which dispatches go through the shared runtime and how to run the rest.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The core principle, Execution Ownership, Dispatch Lifecycle step 4, ALWAYS rule 2 and the success criterion in both packets, scoped to research and review lineages.
- A one-shot pointer per packet: cli-pi to the child dispatch envelope in `references/providers-and-models.md` §5; cli-hermes to the dispatch shape in its own `SKILL.md` §3, run in the child environment its ALWAYS rule 11 sets, since it has no envelope section.
- Each packet's version and a changelog entry.

### Out of Scope
- The Deep-Loop Integration sections, which describe the runtime inside deep-loop lineages and stay true.
- cli-claude-code and cli-opencode, whose `SKILL.md` never mention the shared runtime.
- The fan-out runner itself.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md` | Modify | Five rule sites, version 1.0.4.0 |
| `.skilled/skills/cli-external-orchestration/cli-hermes/changelog/v1.0.4.0.md` | Create | Changelog entry |
| `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md` | Modify | Five rule sites, version 1.5.11.0 |
| `.skilled/skills/cli-external-orchestration/cli-pi/changelog/v1.5.11.0.md` | Create | Changelog entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The runtime rule names what it covers in both packets. | No line in either `SKILL.md` sends every dispatch to the shared runtime; each rule site limits it to research and review lineages and names how a one-shot dispatch runs. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Each change is versioned and routing stays fresh. | cli-hermes `version: 1.0.4.0` and cli-pi `version: 1.5.11.0`, each with a matching changelog; `compiled-route-guard.cjs` reports every hub fresh. |
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
| Risk | cli-hermes points at a rule number | Low | Rule 11 is the child-environment rule today; a renumbering would need the pointer moved |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
