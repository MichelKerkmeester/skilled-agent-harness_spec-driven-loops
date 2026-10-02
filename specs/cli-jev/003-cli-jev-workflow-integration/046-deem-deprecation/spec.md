---
title: "Feature Specification: Phase 46: deem-deprecation"
description: "Deem lost on every task it was measured on, so cli-deem and every scorer's Deem arm go, cli-jev stays the only classifier, and cli-classifier stays a parent hub for a future one."
trigger_phrases:
  - "deem deprecation"
  - "remove cli-deem"
  - "jev only classifier"
  - "one-mode classifier hub"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation"
    last_updated_at: "2026-10-02T10:30:00Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Planned four phases for the Deem removal"
    next_safe_action: "Run phase 001's inventory and decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-046-deem-deprecation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 46: deem-deprecation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-02 |
| **Branch** | `worktrees/071-cli-jev-sk-alignment` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | cli-jev/003-cli-jev-workflow-integration |
| **Predecessor** | 045-deem-live-runs |
| **Successor** | None |
| **Handoff Criteria** | The five completion criteria in `goal.md` pass from the final state |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator chose on 2026-10-02 to keep only Jev as the classifier. Deem reaches the `cli-deem` mode packet, the `cli-classifier` hub's registry and routing, about 20 scorers' `--deem` arms with their tests, and the catalogs, playbooks and READMEs that describe them. Each of the two Deem arms measured on the real server answered `kill`.

### Purpose
`cli-jev` is the only classifier, no file outside history names a Deem arm, and `cli-classifier` stays a valid parent hub so a future classifier is one new mode.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `cli-deem` packet, its Hermes copy and its place in the hub's registry, routers, metadata, benchmark and playbook.
- Every scorer's `--deem` switch, arm, tests and docs.
- Every other live reference: catalogs, playbooks, READMEs, routing fixtures and the advisor graph.
- A new changelog entry in each skill whose behavior changes.

### Out of Scope
- `specs/` history and released changelog entries.
- The local Deem server and `~/.local/share/deem`.
- Any change to a scorer's default run or `--jev` arm.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/*/**/score-*`, `cite-drift-scan.mjs`, `judge-agreement.mjs`, `hvr_reader_lens.py` and their tests | Modify | 002-scorer-deem-arms | Remove each `--deem` arm |
| `.skilled/skills/cli-classifier/cli-deem/`, `.hermes/skills/cli-deem/` | Delete | 003-cli-deem-mode-removal | The mode packet and its copy |
| `.skilled/skills/cli-classifier/` hub files, routing fixtures, advisor graph | Modify | 003-cli-deem-mode-removal | One-mode hub |
| Catalogs, playbooks, READMEs, changelogs | Modify, Create | 004-references-sweep-and-verification | Remaining references and new entries |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-removal-plan/ | Sort every real Deem reference by the phase that removes it, and record the removal decisions | In Progress |
| 2 | 002-scorer-deem-arms/ | Remove each scorer's `--deem` arm, tests and docs, with default and `--jev` output unchanged | Planned |
| 3 | 003-cli-deem-mode-removal/ | Delete the `cli-deem` packet and leave `cli-classifier` a valid one-mode hub | Planned |
| 4 | 004-references-sweep-and-verification/ | Clear the remaining references, add changelog entries, run every gate and the review | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- 002 and 003 touch disjoint files and may run in parallel after 001
- Parent spec tracks aggregate progress via this map
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-removal-plan | 002-scorer-deem-arms | The inventory names each scorer, its tests and docs | The inventory file and `validate.sh --strict` on 001 |
| 001-removal-plan | 003-cli-deem-mode-removal | The inventory names each hub, routing and advisor file | The same |
| 002 and 003 | 004-references-sweep-and-verification | Both Complete | `validate.sh --strict` on 002 and 003 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. The operator set the scope on 2026-10-02.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
