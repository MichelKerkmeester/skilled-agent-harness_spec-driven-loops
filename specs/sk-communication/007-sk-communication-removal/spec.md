---
title: "Feature Specification: Retire sk-communication and strengthen repository communication rules"
description: "Remove the standalone communication projection skill and its linked commands, plugin, mirrors and live references. Give the repository communication rules a self-contained plain-language reply instruction that preserves the Human Voice Rules as the wording authority."
trigger_phrases:
  - "sk-communication removal"
  - "communication skill removal"
  - "rewrite command removal"
  - "communication rule upgrade"
  - "plain-language reply rules"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/007-sk-communication-removal"
    last_updated_at: "2026-10-02T06:08:21Z"
    last_updated_by: "codex"
    recent_action: "Marked both phases complete after the final packet gates passed"
    next_safe_action: "Choose whether and when to commit the completed packet."
    blockers: []
    key_files:
      - ".skilled/repo-rules/communication.md"
      - ".skilled/repo-rules/communication-prose.md"
      - "REPO RULES.md"
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:c1d5e5b7cd8d546569786d885836e3eba75d22c743e22c059b0e765479189b62"
      session_id: "codex-074-sk-communication-removal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Retire sk-communication and strengthen repository communication rules

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-02 |
| **Branch** | `worktrees/074-sk-communication-removal` |
| **Parent Spec** | None, this is the parent |
| **Parent Packet** | sk-communication/007-sk-communication-removal |
| **Predecessor** | `../006-sk-communication-clarity` |
| **Successor** | None |
| **Handoff Criteria** | Both child phases and all acceptance criteria are complete; trigger-index regeneration/check and recursive strict validation passed for the parent and both children |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The repository's plain-language projection behavior is spread across a skill, two rewrite commands, runtime mirrors and an OpenCode plugin. Active documentation and routing still refer to those surfaces, while the communication rules do not yet provide the direct, self-contained instruction needed after the skill is removed.

### Purpose

Remove the skill and every active integration that depends on it, then make the repository communication rules directly guide clear replies while keeping the Human Voice Rules under sk-doc as the wording standard.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Remove the sk-communication skill, its changelog directory and Hermes mirror.
- Remove `/rewrite:response` and `/rewrite:response-by-external-agent`, including their runtime prompts and command mirrors.
- Remove the OpenCode projection plugin and its test.
- Remove live references from active repository documentation, routing, CI and integration surfaces.
- Upgrade the communication repo rules to supply plain-language reply guidance without copying the Human Voice Rules.
- Keep the advisor route-exclusion mechanism and its test while removing the skill-specific exclusion entry.

### Out of Scope

- Historical records under `specs/` outside the nine explicitly authorized packet documents, and all historical `changelog/` files, remain untouched. The phase 1 removal set separately includes the skill-specific `.skilled/changelog/sk-communication/` package directory.
- The operator's global `~/.claude/CLAUDE.md`, which is outside this repository.
- The Human Voice Rules and the sk-doc `sk-create-with-human-voice` mode, which remain the wording authority.
- New reply-rewrite commands, a successor skill, or unrelated changes to communication rules.

### Files to Change

Aggregate file scope only; per-phase details live in the child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/sk-communication/`, `.skilled/changelog/sk-communication/`, `.hermes/skills/sk-communication/` | Delete | 001 | Remove the skill package, its package changelog and Hermes skill mirror |
| `.skilled/commands/rewrite/`, runtime rewrite prompts and command mirrors | Delete | 001 | Remove both rewrite commands from supported runtimes |
| `.opencode/plugins/sk-communication-projection.js`, `.opencode/plugins/tests/sk-communication-projection.test.cjs` | Delete | 001 | Remove the OpenCode chat-message projection plugin and its test |
| Active sk-doc, advisor, sk-git, CI and README surfaces | Modify | 001 | Remove stale references and installation or routing support |
| `.skilled/repo-rules/communication.md` | Modify | 002 | Make §4 self-contained for a plain-language re-render and preserve content fidelity |
| `.skilled/repo-rules/communication-prose.md` | Modify | 002 | Add sentence-level guidance that prevents terse machine-register prose |
| `REPO RULES.md`, `AGENTS.md` | Modify if a sentence became false | 002 | Correct only the affected trigger rows or §8 wording |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-skill-and-command-removal/` | Remove skill, command, plugin and live integration surfaces; verify mirrors and routing cleanup | complete |
| 2 | `002-communication-rule-upgrade/` | Make communication rules the direct, self-contained source for plain-language replies | complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| `001-skill-and-command-removal` | `002-communication-rule-upgrade` | The skill, commands and plugin are absent; the route-exclusion mechanism remains; prompt and Hermes skill mirrors pass their checks. Rule files remain for phase 002 to update. | Run the four mirror-sync commands in phase 001 `acceptance-criteria.md` and the advisor route-exclusions Vitest command there; inspect `git diff --name-status ecf2897455 --` for the scoped deletion set. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None. The phase split, ownership boundaries and historical-record exclusions are fixed by the operator's brief.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: `001-skill-and-command-removal/` and `002-communication-rule-upgrade/` contain their own specs, plans, tasks and acceptance criteria.
- **Parent Packet**: This document is the coordination spec for `sk-communication/007-sk-communication-removal`.
- **Graph Metadata**: See `graph-metadata.json` for the structured child list and active-child pointer.
