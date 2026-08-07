---
title: "Feature Specification: Per-mode providers, models and invocation reference files for the cli-external-orchestration hub, plus de-duplication of scattered provider/model docs"
description: "Phase parent for Per-mode providers, models and invocation reference files for the cli-external-orchestration hub, plus de-duplication of scattered provider/model docs"
trigger_phrases:
  - "033-per-mode-provider-model-reference"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/033-per-mode-provider-model-reference"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Per-mode providers, models and invocation reference files for the cli-external-orchestration hub, plus de-duplication of scattered provider/model docs

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-29 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/033-per-mode-provider-model-reference |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Validator + template + generator changes ship so parent validates under tolerant policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `cli-external-orchestration` hub has six workflow modes, and each one documents "which providers, which models, which personas/effort tiers, how to invoke" in several places at once — the mode's `SKILL.md` roster, its `references/cli-reference.md` model section, and scattered model pins across `integration-patterns.md`, `assets/prompt-templates.md`, and playbooks. There is no single dedicated home per mode, so readers reconstruct model facts from multiple files and the copies drift.

### Purpose
Give each of the six modes ONE dedicated `references/providers-and-models.md` file, wire it as an advisor-routable leaf, then trim the now-redundant enumerations out of the other files — without weakening a mode's ability to dispatch on its own or degrading advisor routing signal.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and child phase manifest for Per-mode providers, models and invocation reference files for the cli-external-orchestration hub, plus de-duplication of scattered provider/model docs
- Per-phase implementation details in child folders

### Out of Scope
- Detailed per-phase implementation plans at the parent level

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| [Per-child files] | Modify/Create | Child phases | Detailed file scope lives in each child phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-author-per-mode-references/ | Author `references/providers-and-models.md` in all six modes (additive) | Pending |
| 2 | 002-register-and-wire/ | Regenerate `leaf-manifest.json`; expand `smart-routing.md` from 3 to 6 modes; add pointer links | Pending |
| 3 | 003-trim-duplicates/ | Trim redundant model enumerations from mode `cli-reference.md` + `SKILL.md` to compact residue + pointer | Pending |
| 4 | 004-hub-reconcile-and-validate/ | Parent SKILL/README pointers; version-skew + stale-`scripts/` fixes; changelogs; run all gates | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-author-per-mode-references | 002-register-and-wire | All 6 `providers-and-models.md` exist on disk with valid 5-field frontmatter and template structure | `validate.sh 001-* --strict`; frontmatter present in all six |
| 002-register-and-wire | 003-trim-duplicates | 6 new leaves registered in `leaf-manifest.json`; `smart-routing.md` covers 6 modes; pointer links added | `generate-leaf-manifest.cjs --check`; grep pointer links in each SKILL.md |
| 003-trim-duplicates | 004-hub-reconcile-and-validate | Redundant enumerations trimmed; each mode SKILL.md still has a concrete default model + runnable invocation; JSON routing tokens untouched | Self-sufficiency grep per mode; `git diff` shows no JSON token changes |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None open. Execution order is fixed 001, then 002, then 003, then 004 (author must precede wiring; wiring must precede trim so pointers resolve; hub reconcile + validation last). Handoff criteria are defined in the Phase Handoff Criteria table above.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
