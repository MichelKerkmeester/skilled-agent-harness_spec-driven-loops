---
title: "Feature Specification: create-skill contract + repo-wide SKILL.md conformance"
description: "Phase parent: packet 000 holds the machine-readable create-skill contract; phases 001-006 bring all 46 SKILL.md files (7 parent hubs to parent-hub canon, 39 children/standalones to the contract) into conformance, each file freshly updated by GPT-5.6 LUNA MAX and verified by a fresh Sonnet-5 xhigh agent."
trigger_phrases:
  - "create-skill contract conformance"
  - "repo-wide SKILL.md conformance sweep"
  - "parent hub canon"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/028-create-skill-contract-unification"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/028-create-skill-contract-unification"
    last_updated_at: "2026-07-14T06:57:22Z"
    last_updated_by: "claude-opus"
    recent_action: "Wired phase 007 remediation record into parent map"
    next_safe_action: "Run advisor re-baseline for trimmed descriptions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + child list + outcome only. Per-phase mechanics live in each child's plan.md. -->

# Feature Specification: create-skill contract + repo-wide SKILL.md conformance

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-doc/014-sk-doc-parent |
| **Predecessor** | `027-catalog-naming-convention` |
| **Successor** | None |
| **Handoff Criteria** | Every child batch's validator is green and its files carry a fresh LUNA update + fresh Sonnet-5 verify |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repo has 46 SKILL.md files — 7 parent hubs, 34 hub-mode children, 5 standalones. Phase `000` defined one
machine-readable create-skill contract, but the fleet has never been measured against it in one pass, so SKILL.md
files drift on section order, smart-router markers, description budget, RULES subsections, `allowed-tools` shape,
and version format.

### Purpose
Enforce the contract fleet-wide: children and standalones conform to the create-skill contract; parent hubs conform
to the parent-hub canon (`parent-skill-check.cjs`). Every file is updated by a fresh GPT-5.6 LUNA MAX agent and
independently verified by a fresh Sonnet-5 xhigh agent, then must pass its validator.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All 46 SKILL.md files, batched across phases 001-006.
- Each file's own resource-doc frontmatter where its validator requires it.

### Out of Scope
- Behavioral/routing redesign — conformance to structure and contract only.
- The advisor scorer, skill-graph, and benchmark corpora — untouched (no re-baseline gate).
- Phase `000` (the contract itself) — complete; the record, not re-executed.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/*/SKILL.md` (7 hubs) | Modify | 001 | parent-hub canon |
| `.opencode/skills/*/*/SKILL.md` (39 children + standalones) | Modify | 002-006 | create-skill contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 000 | `000-create-skill-contract` | Machine-readable create-skill contract + validators | Complete |
| 001 | `001-parent-hub-canon` | 7 parent hubs -> parent-hub canon | Complete |
| 002 | `002-sk-doc-children` | 11 skills -> create-skill contract | Complete |
| 003 | `003-sk-design-children` | 6 skills -> create-skill contract | Complete |
| 004 | `004-deep-loop-children` | 5 skills -> create-skill contract | Complete |
| 005 | `005-code-cli-mcp-prompt-children` | 12 skills -> create-skill contract | Complete |
| 006 | `006-standalones` | 5 skills -> create-skill contract | Complete |
| 007 | `007-fresh-verify-remediation` | Remediate 11 fresh-verify FAIL defects + surface validator | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before it is claimed complete.
- Parent tracks aggregate progress via this map + `graph-metadata.json.derived.last_active_child_id`.
- Run `validate.sh --recursive` on this parent to validate all phases as one unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 000 | 001 | batch validator green + Sonnet sign-off | `validate.sh --strict` |
| 001 | 002 | batch validator green + Sonnet sign-off | `validate.sh --strict` |
| 002 | 003 | batch validator green + Sonnet sign-off | `validate.sh --strict` |
| 003 | 004 | batch validator green + Sonnet sign-off | `validate.sh --strict` |
| 004 | 005 | batch validator green + Sonnet sign-off | `validate.sh --strict` |
| 005 | 006 | batch validator green + Sonnet sign-off | `validate.sh --strict` |
| 006 | 007 | fresh Sonnet-5 fleet verify -> all 11 defects remediated + re-verified | `validate.sh --strict` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Execution complete: every file was updated by a fresh GPT-5.6 LUNA MAX agent and verified by a fresh Sonnet-5 xhigh agent, then passed its validator. Follow-ups (out of scope): teach `package_skill.py` to branch on `packetKind: surface` (code-opencode + code-webflow were exempted manually); run an advisor re-baseline for the ~17 trimmed descriptions.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: sub-folders `000-*/` .. `006-*/` for per-phase spec/plan/tasks/checklist
- **Contract**: `./000-create-skill-contract/` (the shipped create-skill contract work)
- **Graph Metadata**: `graph-metadata.json` for `derived.last_active_child_id`
