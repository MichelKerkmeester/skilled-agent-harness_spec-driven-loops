---
title: "Feature Specification: Advisor defect and hardening fixes: suite failures, diagnostics, bootstrap, daemon recycle and stress suite"
description: "Small advisor defects and gaps fixed one at a time after the routing work shipped."
trigger_phrases:
  - "advisor defect fixes"
  - "advisor suite failures"
  - "empty recommendation diagnostic"
  - "fresh clone bootstrap"
  - "stale build daemon recycle"
  - "advisor stress suite ci"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/026-defect-and-hardening-fixes"
    last_updated_at: "2026-10-06T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Group the 6 packets under one phase parent"
    next_safe_action: "Plan or resume a child phase folder"
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

# Feature Specification: Advisor defect and hardening fixes: suite failures, diagnostics, bootstrap, daemon recycle and stress suite

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-12 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | None, track root `specs/system-skill-advisor/` |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Every child validates strict at its slot, every live reference points at the child path and the timeline names each packet's first and last commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Small advisor defects and gaps surfaced one at a time. Five suites had failed for a long time under the label pre-existing without anyone checking why. An empty recommendation and an unreachable advisor produced the same diagnostic. A half-landed Pi dedup fix made the directive call throw. The MCP launcher could not build on a fresh clone. The long-lived daemon never checked whether it predated the current build. Nothing ran the stress suite in CI.

### Purpose
Close each gap with its own small packet and keep them under one parent: every suite failure explained or fixed, an empty recommendation told apart from an unreachable advisor, the Pi directive path repaired, a fresh clone that builds, a daemon that recycles on a stale build and a stress suite that runs in CI.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Pre-existing advisor suite failures
- The empty-recommendation diagnostic
- Remaining advisor defects
- Fresh-clone bootstrap, stale-build daemon recycle and the stress suite in CI

### Out of Scope
- Routing research and refinement
- The advisor status truthfulness work
- Runtime code alignment with sk-code-opencode

### Files to Change
Each child keeps its own plan and file list. This table is the audit trail of the phases.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-pre-existing-suite-failures/` | Existing packet | 001 | Explain and fix the five long-failing advisor suites |
| `002-empty-recommendation-diagnostic/` | Existing packet | 002 | Tell an empty recommendation from an unreachable advisor |
| `003-fix-remaining-advisor-defects/` | Existing packet | 003 | Finish the half-landed Pi dedup fix and the other remaining defects |
| `004-fresh-clone-bootstrap/` | Existing packet | 004 | Make the advisor launcher build on a fresh clone |
| `005-stale-build-daemon-recycle/` | Existing packet | 005 | Recycle a daemon that predates the current build |
| `006-stress-suite-ci/` | Existing packet | 006 | Run the stress suite in CI |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-pre-existing-suite-failures/` | Explain and fix the five long-failing advisor suites | Complete |
| 2 | `002-empty-recommendation-diagnostic/` | Tell an empty recommendation from an unreachable advisor | Complete |
| 3 | `003-fix-remaining-advisor-defects/` | Finish the half-landed Pi dedup fix and the other remaining defects | Complete |
| 4 | `004-fresh-clone-bootstrap/` | Make the advisor launcher build on a fresh clone | Complete |
| 5 | `005-stale-build-daemon-recycle/` | Recycle a daemon that predates the current build | Complete |
| 6 | `006-stress-suite-ci/` | Run the stress suite in CI | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-pre-existing-suite-failures` | `002-empty-recommendation-diagnostic` | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
| `002-empty-recommendation-diagnostic` | `003-fix-remaining-advisor-defects` | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
| `003-fix-remaining-advisor-defects` | `004-fresh-clone-bootstrap` | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
| `004-fresh-clone-bootstrap` | `005-stale-build-daemon-recycle` | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
| `005-stale-build-daemon-recycle` | `006-stress-suite-ci` | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
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
