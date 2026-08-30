---
title: "Feature Specification: Reduce and optimize spec-kit doc templates; merge tasks and checklist; less bloat, better historic context and small-model legibility"
description: "Phase parent for Reduce and optimize spec-kit doc templates; merge tasks and checklist; less bloat, better historic context and small-model legibility"
trigger_phrases:
  - "036-spec-doc-template-reduction"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-spec-doc-template-reduction"
    last_updated_at: "2026-08-27T10:22:45Z"
    last_updated_by: "codex"
    recent_action: "Executed and verified all nine template phases"
    next_safe_action: "Review the scoped diff and close out the packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-27-036-spec-doc-template-reduction"
      parent_session_id: null
    completion_pct: 95
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

# Feature Specification: Reduce and optimize spec-kit doc templates; merge tasks and checklist; less bloat, better historic context and small-model legibility

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-26 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-speckit/036-spec-doc-template-reduction |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Validator + template + generator changes ship so parent validates under tolerant policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This phased decomposition tracks Reduce and optimize spec-kit doc templates; merge tasks and checklist; less bloat, better historic context and small-model legibility across independently executable child phase folders.

### Purpose
Keep parent documentation lean while child phases own detailed plans, tasks, checklists, and continuity.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and child phase manifest for Reduce and optimize spec-kit doc templates; merge tasks and checklist; less bloat, better historic context and small-model legibility
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
| 1 | 001-analysis/ | Analysis and recommendations for template reduction | Complete |
| 2 | 002-tasks-checklist-merge/ | Merge tasks.md and checklist.md into one level-gated document | Complete |
| 3 | 003-template-dedup/ | Deduplicate decision-record frontmatter across levels | Complete |
| 4 | 004-continuity-single-source/ | Establish single-source continuity and remove template duplication | Complete |
| 5 | 005-comment-extraction/ | Strip instructional template comments from authored documents | Complete |
| 6 | 006-verify-rollout/ | Verify the rollout and close out the packet | Complete |
| 7 | 007-lazy-addon-docs/ | Add on-demand before/after, timeline and roadmap docs; decouple the decision record | Complete |
| 8 | 008-plan-and-contract-optimization/ | Make the summary lifecycle-required and trim duplicated plan checkboxes | Complete |
| 9 | 009-template-folder-restructure/ | Split templates into core, addons and packet-types folders | Complete |
| 10 | 010-checklist-full-retirement/ | Retire the standalone verification checklist across producers, contract, read-paths, templates and packets | Complete |
| 11 | 011-checklist-reference-cleanup/ | Remove the dead links the deletion left behind in the corpus | Complete |
| 12 | 012-fingerprint-docset-enforcement/ | Make the drift marker mandatory beside a fingerprint, and stamp the fleet without recomputing digests | Draft |
| 13 | 013-retirement-read-path-closure/ | Close the read-paths the retirement left reporting green while doing nothing | Draft |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-analysis | 002-tasks-checklist-merge | Recommendations recorded as requirements | Spec carries research-backed requirements |
| 002-tasks-checklist-merge | 003-template-dedup | Merged document validates for old and new packets | Legacy checklist packets still derive status |
| 003-template-dedup | 004-continuity-single-source | Shared frontmatter renders per level | Golden snapshots pass |
| 004-continuity-single-source | 005-comment-extraction | Continuity reads from the canonical host | Legacy packets still validate |
| 005-comment-extraction | 006-verify-rollout | Templates render with markers intact | Golden snapshots pass |
| 006-verify-rollout | 007-lazy-addon-docs | Reductions verified against a real scaffold | validate.sh passes on a fresh packet |
| 007-lazy-addon-docs | 008-plan-and-contract-optimization | On-demand docs scaffold behind the opt-in flag | Opt-in scaffold carries all four docs |
| 008-plan-and-contract-optimization | 009-template-folder-restructure | Lifecycle contract holds in all three states | Planned, started and restored packets validate |
| 009-template-folder-restructure | 010-checklist-full-retirement | [Criteria TBD] | [Verification TBD] |
| 010-checklist-full-retirement | 011-checklist-reference-cleanup | The document is gone from the corpus | No dead link points at it |
| 011-checklist-reference-cleanup | 012-fingerprint-docset-enforcement | None; different surfaces | Each phase validates on its own |
| 012-fingerprint-docset-enforcement | 013-retirement-read-path-closure | None; the two are independent | Each phase validates on its own |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which child phase should execute first?
- What handoff criteria must each child satisfy?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
