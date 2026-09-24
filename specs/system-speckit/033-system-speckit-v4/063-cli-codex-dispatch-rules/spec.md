---
title: "Feature Specification: Phase 63: cli-codex dispatch rules"
description: "cli-codex's ALWAYS rule 2 sent every orchestrated dispatch through the deep-loop fan-out runner, which accepts only research and review loops, and nothing warned that a sandboxed child cannot run checks that start tsx."
trigger_phrases:
  - "cli codex dispatch rules"
  - "cli codex fanout rule scope"
  - "codex sandbox listen eperm"
  - "codex child envelope one-shot dispatch"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 63: cli-codex dispatch rules

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
| **Phase** | 63 of 64 |
| **Predecessor** | 062-v4-parent-data-repairs |
| **Successor** | 064-cli-devin-cursor-dispatch-rules |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 63** of the system-spec-kit v4 specification. It applies two amendments to the cli-codex skill that the fix phases 056 to 062 surfaced while dispatching their implementation to Codex; the operator asked for them after reading the program's final report.

**Scope Boundary**: cli-codex's `SKILL.md` and a new changelog entry. The sibling cli packets that carry the same rule wording are not changed.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
ALWAYS rule 2 and the Execution Ownership section told an orchestrator to delegate every orchestrated Codex dispatch to `fanout-run.cjs`. That runner accepts only the `research` and `review` loop types (`ACTIVE_FANOUT_LOOP_TYPES`), so each single build dispatch in phases 056 to 062 had to break the rule and use the child dispatch envelope in `references/providers-and-models.md` §5 instead.

In phase 060, a Codex child under `--sandbox workspace-write` reported spec-kit's `npm --prefix runtime/cli run check` as failed: `tsx` could not open its IPC socket (`listen EPERM`), also with `TMPDIR` pointed elsewhere. The same check passed outside the sandbox. Nothing in the skill warned of this.

### Purpose
An orchestrator reading cli-codex knows which dispatches go through the fan-out runner, which use the child envelope, and which checks to run itself.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- ALWAYS rule 2 and Execution Ownership scoped to research and review lineages, pointing one-shot dispatches at the child envelope.
- A fifth dispatch gotcha for the sandbox IPC limit.
- The packet version and a changelog entry.

### Out of Scope
- cli-devin and cli-cursor, whose `SKILL.md` carry the same rule 2 wording. Reported to the operator.
- The fan-out runner itself.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` | Modify | Rule 2, Execution Ownership, a fifth gotcha, version |
| `.skilled/skills/cli-external-orchestration/cli-codex/changelog/v1.9.4.0.md` | Create | Changelog entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The fan-out rule names what it covers. | Rule 2 and Execution Ownership limit the runner to research and review lineages and send one-shot dispatches to the child envelope. |
| REQ-002 | The sandbox limit is recorded. | A gotcha names `listen EPERM`, the observation, and what the orchestrator does about it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The change is versioned and routing stays fresh. | `version: 1.9.4.0` with a matching changelog; `compiled-route-guard.cjs` reports the cli-external-orchestration hub fresh. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The old wording is gone and sk-doc validation passes on `SKILL.md`.
- **SC-002**: Every compiled-routing hub stays fresh.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The sandbox note rests on one observation | Low | It states the date, the codex-cli version and the check, so a reader can retest it |
| Dependency | The runner's accepted loop types | Medium | The rule names the two types the runner's own constant lists |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should cli-devin and cli-cursor get the same rule 2 change? Reported to the operator.
<!-- /ANCHOR:questions -->

---
