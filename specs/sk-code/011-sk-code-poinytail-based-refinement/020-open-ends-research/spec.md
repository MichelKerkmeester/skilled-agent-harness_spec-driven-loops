---
title: "Feature Specification: Open ends research"
description: "Phase parent for five independent ten-iteration investigations into the open ends the sk-code Ponytail refinement epic left: doc versions, fresh-clone onboarding, playbook and catalog truth, routing evaluation and silent CLI input."
trigger_phrases:
  - "open ends research phase parent spec"
  - "open ends research"
  - "sk-code epic open ends"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research"
    last_updated_at: "2026-10-12T10:00:00Z"
    last_updated_by: "rem-integration"
    recent_action: "All five loops synthesized; 021-open-ends-remediation built every kept recommendation"
    next_safe_action: "None; the research is closed and its recommendations shipped through 021"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Open ends research

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/104-open-ends-scaffold` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-code/011-sk-code-poinytail-based-refinement |
| **Predecessor** | 018-create-sh-unknown-options |
| **Successor** | None |
| **Handoff Criteria** | Every child goal's criteria pass and recursive strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The refinement epic closed its own ledger, but five questions came out of it that no phase owned. Doc-version verification fails on every skill it checks. A fresh clone hits several setup stumbles before its first routed request. Playbooks and feature catalogs drift from the code with nothing to catch it. The skill advisor is scored on a small battery, and its two code paths can disagree. Several CLI scripts accept bad input or report success on a detected problem.

### Purpose
Answer each question with evidence and a ranked list of the smallest fixes, so later fix phases start from cited lines rather than from memory.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Four deep-research runs (children 001 to 004) and one deep-review run (child 005), ten iterations each.
- One synthesis per child: `research/research.md`, or `review/review-report.md` for 005, with a ranked table that cites path:line.

### Out of Scope
- Changing any product file in 001 to 005. Those children are read-only; 006 is the one build child.
- Probes P4 and P7 and admission scenario DOC-331. A separate fix for them is in flight.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `00N-*/research/` | Create | 001 to 004 | Loop state, iterations and synthesis |
| `005-silent-input-sweep/review/` | Create | 005 | Loop state, iterations and review report |
| `.github/workflows/sk-doc-script-tests.yml`, `cite-drift-gate.mjs` | Modify, Create | 006 | Catalog and citation CI checks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-doc-version-contract/ | Why doc-version verify fails on every skill, and the smallest contract or none | Complete |
| 2 | 002-fresh-clone-onboarding/ | Every stumble from fresh clone to first routed request and spec packet, ranked by user impact | Complete |
| 3 | 003-playbook-catalog-truth/ | The lightest self-check for playbook scenarios and catalog entries against the code | Complete |
| 4 | 004-routing-evaluation/ | A held-out evaluation set and a Python and Node parity check for the advisor | Complete |
| 5 | 005-silent-input-sweep/ | Deep review of CLI scripts for silently accepted options and false exit 0 | Complete |
| 6 | 006-ci-truth-checks/ | Build 003's R1 and R2: the catalog validator and a new-citation gate block pull requests in CI | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-doc-version-contract | 002-fresh-clone-onboarding | None; the five children are independent and run in parallel | Each child's goal criteria |
| 002-fresh-clone-onboarding | 003-playbook-catalog-truth | None; see the row above | Each child's goal criteria |
| 003-playbook-catalog-truth | 004-routing-evaluation | None; see the row above | Each child's goal criteria |
| 004-routing-evaluation | 005-silent-input-sweep | None; see the row above | Each child's goal criteria |
| 005-silent-input-sweep | 006-ci-truth-checks | None; 006 builds on 003's synthesis only | 006's goal criteria |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None blocking. Each child's questions are in its own spec.md.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
