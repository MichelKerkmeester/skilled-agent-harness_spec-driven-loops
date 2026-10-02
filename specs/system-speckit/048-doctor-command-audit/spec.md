---
title: "Feature Specification: Doctor command audit and /doctor:env"
description: "Every doctor command checked against the current system, one phase per target, and a new /doctor:env command that guides environment setup."
trigger_phrases:
  - "doctor command audit"
  - "doctor command relevance"
  - "doctor env command"
  - "doctor mcp code mode"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit"
    last_updated_at: "2026-10-02T18:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fd6197bf-4447-484a-82b8-d9015d93169d"
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

# Feature Specification: Doctor command audit and /doctor:env

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-02 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Every phase closes with its acceptance criteria Met, Waived or Superseded, and route validation exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The doctor commands are the operator's way to check and repair the system: `/doctor:mcp` (install, debug), `/doctor:update`, and ten `/doctor:speckit` targets. Each runs a workflow asset under `.skilled/commands/doctor/assets/` that was written against an earlier state of the system. Since then paths have moved from `.opencode` to `.skilled`, runtime databases have been renamed and subsystems retired, and no command has been checked end to end against the current checkout. A doctor that checks the wrong things reports health that is not there. Separately, the switches that turn hooks, gates and runtime features off live only as rows in `ENV-REFERENCE.md`, with no guided way to set them.

### Purpose
Leave every doctor command matched to the current system, kept, fixed or retired on evidence, with `/doctor:mcp` narrowed to MCP Code Mode and its `.utcp_config.json`, and add a `/doctor:env` command that walks an operator through the environment switches.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One audit phase for each of the 13 existing doctor targets: an inventory of what it names, one safe run, and a keep, fix or retire verdict applied.
- `/doctor:mcp` install and debug narrowed to MCP Code Mode and `.utcp_config.json` setup.
- A new `/doctor:env` command, built through sk-create-command.

### Out of Scope
- Fixing the subsystems a doctor inspects. A defect found there is recorded as a finding.
- MCP servers other than Code Mode.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/commands/doctor/assets/doctor-*.yaml` | Modify or Delete | 001-013 | Apply each verdict |
| `.skilled/commands/doctor/_routes.yaml` | Modify | 004-013 | Only when a route or its flags change |
| `.skilled/commands/doctor/mcp.md` | Modify | 001-002 | Code Mode scope |
| `.skilled/commands/doctor/env.md` and its assets | Create | 014 | New command |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-mcp-install-code-mode/ | `/doctor:mcp install`, narrowed to Code Mode and `.utcp_config.json` setup | Pending |
| 2 | 002-mcp-debug-code-mode/ | `/doctor:mcp debug`, narrowed to Code Mode and `.utcp_config.json` | Pending |
| 3 | 003-update/ | `/doctor:update` database rebuild | Pending |
| 4 | 004-deep-loop/ | `/doctor:speckit deep-loop` | Pending |
| 5 | 005-embeddings/ | `/doctor:speckit embeddings` | Pending |
| 6 | 006-fable-mode/ | `/doctor:speckit fable-mode` | Pending |
| 7 | 007-parent-skill/ | `/doctor:speckit parent-skill` | Pending |
| 8 | 008-router-reach/ | `/doctor:speckit router-reach` | Pending |
| 9 | 009-runtime-mirrors/ | `/doctor:speckit runtime-mirrors` | Pending |
| 10 | 010-skill-advisor/ | `/doctor:speckit skill-advisor` | Pending |
| 11 | 011-skill-budget/ | `/doctor:speckit skill-budget` | Pending |
| 12 | 012-skill-graph-freshness/ | `/doctor:speckit skill-graph-freshness` | Pending |
| 13 | 013-speckit-retrieval/ | `/doctor:speckit speckit-retrieval` | Pending |
| 14 | 014-doctor-env/ | New `/doctor:env` guided environment setup | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-mcp-install-code-mode | 002-mcp-debug-code-mode | The earlier phase's acceptance criteria are Met, Waived or Superseded | `validate.sh <phase> --strict` prints RESULT: PASSED |
| 002-mcp-debug-code-mode | 003-update | The earlier phase's acceptance criteria are Met, Waived or Superseded | `validate.sh <phase> --strict` prints RESULT: PASSED |
| 003-update | 004-deep-loop | The earlier phase's acceptance criteria are Met, Waived or Superseded | `validate.sh <phase> --strict` prints RESULT: PASSED |
| 004-deep-loop | 005-embeddings | The earlier phase's acceptance criteria are Met, Waived or Superseded | `validate.sh <phase> --strict` prints RESULT: PASSED |
| 005-embeddings | 006-fable-mode | The earlier phase's acceptance criteria are Met, Waived or Superseded | `validate.sh <phase> --strict` prints RESULT: PASSED |
| 006-fable-mode | 007-parent-skill | The earlier phase's acceptance criteria are Met, Waived or Superseded | `validate.sh <phase> --strict` prints RESULT: PASSED |
| 007-parent-skill | 008-router-reach | The earlier phase's acceptance criteria are Met, Waived or Superseded | `validate.sh <phase> --strict` prints RESULT: PASSED |
| 008-router-reach | 009-runtime-mirrors | The earlier phase's acceptance criteria are Met, Waived or Superseded | `validate.sh <phase> --strict` prints RESULT: PASSED |
| 009-runtime-mirrors | 010-skill-advisor | The earlier phase's acceptance criteria are Met, Waived or Superseded | `validate.sh <phase> --strict` prints RESULT: PASSED |
| 010-skill-advisor | 011-skill-budget | The earlier phase's acceptance criteria are Met, Waived or Superseded | `validate.sh <phase> --strict` prints RESULT: PASSED |
| 011-skill-budget | 012-skill-graph-freshness | The earlier phase's acceptance criteria are Met, Waived or Superseded | `validate.sh <phase> --strict` prints RESULT: PASSED |
| 012-skill-graph-freshness | 013-speckit-retrieval | The earlier phase's acceptance criteria are Met, Waived or Superseded | `validate.sh <phase> --strict` prints RESULT: PASSED |
| 013-speckit-retrieval | 014-doctor-env | The earlier phase's acceptance criteria are Met, Waived or Superseded | `validate.sh <phase> --strict` prints RESULT: PASSED |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None at the parent level. Each phase records its own.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
