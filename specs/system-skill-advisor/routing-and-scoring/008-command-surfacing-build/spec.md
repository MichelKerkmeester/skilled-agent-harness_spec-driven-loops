---
title: "Feature Specification: Build command surfacing in the skill advisor so every tracked slash command reaches the model with a run-or-ask policy and a chat-only request reaches a proper workflow"
description: "Six phases that make the skill advisor surface every tracked slash command with a run-or-ask policy and bring a chat-only request onto a proper workflow."
trigger_phrases:
  - "command surfacing build phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
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

# Feature Specification: Build command surfacing in the skill advisor so every tracked slash command reaches the model with a run-or-ask policy and a chat-only request reaches a proper workflow

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-skill-advisor/routing-and-scoring/008-command-surfacing-build |
| **Predecessor** | 007-command-surfacing-and-workflow-enforcement |
| **Successor** | None |
| **Handoff Criteria** | Each phase meets its exit check in the Phase Handoff Criteria table before the next phase starts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repository ships 44 tracked slash commands that own complete workflows, but the skill advisor reaches the model with skills. Only `/doctor:*` commands arrive as a runnable line, 22 of 62 command bridge rows are off in the TypeScript scorer, the recommendation carries no command field and no rule tells a model what to do with a surfaced command. A user who chats without typing a command therefore gets an improvised approach where a command workflow exists. The evidence is in `../007-command-surfacing-and-workflow-enforcement/research/research.md` and the independent review `../007-command-surfacing-and-workflow-enforcement/research/synthesis-review.md`.

### Purpose
Deliver the review's recommendation set (R1 to R10, L1 to L12, G1 to G7) in the order its build plan gives, under the operator decisions D1 to D5 recorded in section 13 of `../007-command-surfacing-and-workflow-enforcement/research/research.md`. When the last phase closes, a plain chat request surfaces the matching command beside its skill with a run, start or ask policy, the model picks between the command path and the skill path, and a measured baseline shows what changed.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Measure command routing before changing it: a command prompt corpus and a baseline for the 44 tracked commands.
- Generate one command inventory with a risk class and a derived policy per command and per doctor route.
- Make plain chat reach a command: attach the command to its owner skill for hub commands, and author intent phrases for commands with no hub mode.
- Extend the recommendation and the brief with the command, its policy and its owner skill.
- Bind the behaviour in `AGENTS.md` Gate 2 and in a generated pointer for runtimes with no brief.
- Prove the behaviour per runtime from transcripts.

### Out of Scope
- Changing how skills are scored against each other. The four existing accuracy numbers are a floor in every phase.
- Surfacing the private, untracked `/local-skilled-alignment` command (decision D5).
- Forcing the command path. Decision D2 keeps the model free to pick the skill path.
- Adding a command front door to a skill that has none.

### Files to Change
Audit trail only. Each child's `plan.md` holds the detail, and phases 2 to 6 are not planned yet, so their rows name the area the review points at.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/` | Create | 001 | Command prompt corpus, its scorer and a baseline file |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/` | Modify | 002 | One generated inventory, risk class and policy, retired ids |
| `.skilled/skills/*/command-metadata.json`, `.skilled/commands/doctor/_routes.yaml` | Modify, Create | 002 | Risk class and write target per command and route |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/`, `advisor/handlers/` | Modify | 003 | Command attached to the owner skill, authored phrases, one row per command |
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts`, `lib/render.ts` | Modify | 004 | New recommendation fields and the brief line |
| `AGENTS.md`, generated runtime pointer blocks | Modify | 005 | The Gate 2 sentence, the Gate 4 retirement and the static pointer |
| Per-runtime transcript checks | Create | 006 | Behaviour proof and the started-command-is-followed check |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-command-routing-baseline-corpus/ | Command prompt corpus and baseline, no scorer change (R8, L8, L9) | Complete |
| 2 | 002-command-inventory-and-risk-metadata/ | One generated inventory, risk class and derived policy, private command excluded (R1, R4, G4) | Complete |
| 3 | 003-plain-chat-command-reach/ | Attach commands to owner skills, authored phrases, one activation source (R2, L2, L3, R10 precedence) | Pending |
| 4 | 004-recommendation-contract-and-brief/ | Recommendation fields, brief line, degraded path, retired ids (R3, L6, L12, G6, L1, L7) | Pending |
| 5 | 005-gate-2-binding-and-runtime-pointers/ | Gate 2 sentence, typed override, static pointer, child authority (R6, L5, R5, L4, G1, G3, L10) | Pending |
| 6 | 006-per-runtime-behaviour-proof/ | Transcript proof per runtime and the started-command-is-followed check (R8 transcripts, G2, G5) | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-command-routing-baseline-corpus | 002-command-inventory-and-risk-metadata | Corpus rows exist for all 44 tracked commands and a baseline records per-command recall, with the four existing numbers unchanged | The baseline file exists and the existing routing-accuracy run still reports 158/195, 50/66 and 20/24 |
| 002-command-inventory-and-risk-metadata | 003-plain-chat-command-reach | Every tracked command and doctor route has a risk class and a derived policy | The deriver's check mode is fresh and exits 1 on a fixture command with no metadata |
| 003-plain-chat-command-reach | 004-recommendation-contract-and-brief | Command recall rises against the phase 1 baseline with no drop in the four existing numbers | The phase 1 scorer run, and no typed command is ambiguous with its own owner |
| 004-recommendation-contract-and-brief | 005-gate-2-binding-and-runtime-pointers | The recommendation and the brief carry the command and its policy | Schema test and golden briefs pass, and `save context` returns one entry |
| 005-gate-2-binding-and-runtime-pointers | 006-per-runtime-behaviour-proof | The Gate 2 sentence and the generated pointer are in place | `/doctor:agents-md check` passes and the pointer generator's check exits 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Phase 6 needs runs on runtimes the research never exercised live (Pi, Cursor, Devin, DSH, Codex, OpenCode). Which of them the operator wants proven is decided when phase 6 is planned.
- The review's G2 check, that a started command actually runs its own setup, is a condition of decision D1. If phase 6 shows setup being skipped, D1 returns to the operator.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
