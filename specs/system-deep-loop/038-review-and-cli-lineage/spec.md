---
title: "Feature Specification: Deep-loop review and CLI lineage: gateway, state init, opencode-go route, bookkeeping and findings contract"
description: "Deep-review and deep-research state, dispatch and findings handled through one gateway."
trigger_phrases:
  - "deep loop review gateway"
  - "review state init and dispatch"
  - "cli pi opencode go route"
  - "read only research bookkeeping"
  - "cli lineage findings contract"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-review-and-cli-lineage"
    last_updated_at: "2026-10-06T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Group the 5 packets under one phase parent"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 80
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

# Feature Specification: Deep-loop review and CLI lineage: gateway, state init, opencode-go route, bookkeeping and findings contract

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-02 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | None, track root `specs/system-deep-loop/` |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Every child validates strict at its slot, every live reference points at the child path and the timeline names each packet's first and last commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-review and deep-research loops disagreed with their own gateway. The review iteration record the agent was told to send was one the gateway rejected. Both review workflows opened a run by writing a config row straight into the state file, so later gateway appends failed. The cli-pi executor had no supported route to opencode-go. The graph scripts claimed to be read-only and still created and migrated the database. A CLI lineage in a fan-out claimed 46 findings and enumerated 22, so closeout failed.

### Purpose
Make review and research state, dispatch and findings go through the gateway the way the agents are told they do: an iteration record the gateway accepts, a run opened through the ledger, a supported opencode-go route for cli-pi, read-only commands that leave the machine unchanged, and a findings contract a lineage cannot undercount.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The review gateway iteration record
- Review state initialisation and dispatch
- The pi CLI opencode-go route
- Read-only and research bookkeeping, and the CLI lineage findings contract

### Out of Scope
- New deep-loop modes
- The innovation and graph engineering research packets
- Executor model selection

### Files to Change
Each child keeps its own plan and file list. This table is the audit trail of the phases.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-review-gateway-iteration-record/` | Existing packet | 001 | Accept the review iteration record at the gateway |
| `002-review-state-init-and-dispatch/` | Existing packet | 002 | Open review runs through the gateway and fix child dispatch |
| `003-cli-pi-opencode-go-route/` | Existing packet | 003 | Add an opencode-go route for cli-pi |
| `004-read-only-and-research-bookkeeping/` | Existing packet | 004 | Make graph commands read-only and fix research bookkeeping |
| `005-cli-lineage-findings-contract/` | Existing packet | 005 | Stop a lineage undercounting findings at closeout |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-review-gateway-iteration-record/` | Accept the review iteration record at the gateway | Complete |
| 2 | `002-review-state-init-and-dispatch/` | Open review runs through the gateway and fix child dispatch | Complete |
| 3 | `003-cli-pi-opencode-go-route/` | Add an opencode-go route for cli-pi | Draft |
| 4 | `004-read-only-and-research-bookkeeping/` | Make graph commands read-only and fix research bookkeeping | Complete |
| 5 | `005-cli-lineage-findings-contract/` | Stop a lineage undercounting findings at closeout | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-review-gateway-iteration-record` | `002-review-state-init-and-dispatch` | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
| `002-review-state-init-and-dispatch` | `003-cli-pi-opencode-go-route` | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
| `003-cli-pi-opencode-go-route` | `004-read-only-and-research-bookkeeping` | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
| `004-read-only-and-research-bookkeeping` | `005-cli-lineage-findings-contract` | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Timeline**: See `timeline.md` for the order the phases shipped in and the number map
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
