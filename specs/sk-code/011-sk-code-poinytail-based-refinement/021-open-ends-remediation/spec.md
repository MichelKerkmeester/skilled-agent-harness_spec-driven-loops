---
title: "Feature Specification: Open ends remediation"
description: "Phase parent for four build phases that implement every recommendation the open ends research kept: typo-proof parsers, onboarding fixes, doc and catalog truth, and routing parity in CI."
trigger_phrases:
  - "open ends remediation phase parent spec"
  - "open ends remediation"
  - "implement open ends recommendations"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation"
    last_updated_at: "2026-10-12T09:00:00Z"
    last_updated_by: "rem-integration"
    recent_action: "Merged the four build branches and marked every phase Complete"
    next_safe_action: "Operator reviews the integration branch before any push"
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

# Feature Specification: Open ends remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/111-open-ends-integration` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-code/011-sk-code-poinytail-based-refinement |
| **Predecessor** | 020-open-ends-research |
| **Successor** | None |
| **Handoff Criteria** | Every child goal's criteria pass and recursive strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The open ends research in `../020-open-ends-research/` ended with ranked recommendations and one review report, and only 006 built any of them. The operator asked to implement every recommendation on all tracks: 64 confirmed parser findings plus 4 unreproduced ones, the onboarding fixes, the doc-version and catalog fixes, and the routing parity CI steps.

### Purpose
Close every recommendation, Fixed with a command proof or Closed with a written reason, across four phases that four builders can run in parallel.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 001: every confirmed finding in `005-silent-input-sweep/review/review-report.md` and its four unreproduced rows, 68 ledger rows.
- 002: R1 to R14 of `002-fresh-clone-onboarding/research/research.md`, 14 ledger rows.
- 003: R1 to R7 of `001-doc-version-contract/research/research.md` and R1 to R10 of `003-playbook-catalog-truth/research/research.md`, 17 ledger rows.
- 004: R1 to R9 of `004-routing-evaluation/research/research.md`, 9 ledger rows.

### Out of Scope
- Any change to `.claude/settings.json`. Onboarding R3 is closed by an operator decision on 2026-10-11.
- The build-nothing rows each child lists. They are recorded as Closed, not built.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| CLI scripts under `.skilled/` | Modify | 001 | Reject unknown options; exit non-zero on detected problems |
| `README.md`, `CONTRIBUTING.md`, Pi and Codex session-start, sk-vision, mirror checker | Modify | 002 | Onboarding fixes |
| sk-doc version engine, packager, standard, catalog and playbook checks, post-edit router | Modify | 003 | Doc and catalog truth |
| `.github/workflows/routing-registry-drift.yml`, advisor parity tests | Modify | 004 | Routing parity in CI |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-typo-proof-parsers/ | Reject unknown options with exit 2 and exit non-zero on detected problems, 68 rows | Complete |
| 2 | 002-onboarding-fixes/ | Fresh-clone onboarding fixes R1, R2 and R4 to R11; R3 and R12 to R14 closed | Complete |
| 3 | 003-doc-and-catalog-truth/ | Version on `SKILL.md` only, and catalog, citation and playbook checks | Complete |
| 4 | 004-routing-parity-ci/ | Divergence ratchet blocking in CI, pinned clock, wider holdout check | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-typo-proof-parsers | 002-onboarding-fixes | None; the four children are independent and build in parallel | Each child's goal criteria |
| 002-onboarding-fixes | 003-doc-and-catalog-truth | None; see the row above | Each child's goal criteria |
| 003-doc-and-catalog-truth | 004-routing-parity-ci | None; see the row above | Each child's goal criteria |
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
- **Research**: See `../020-open-ends-research/` for the five sources
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
