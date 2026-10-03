---
title: "Feature Specification: Five DeepSeek iterations per kept Jev feature on how to improve, refine and expand it"
description: "Ten research phases, one per kept or near-kept Jev feature from 047, each running a DeepSeek and a Luna research lineage on how to improve, refine and expand that feature."
trigger_phrases:
  - "jev feature improvement research"
  - "jev feature refinement"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research"
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

# Feature Specification: Five DeepSeek iterations per kept Jev feature on how to improve, refine and expand it

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-03 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/048-jev-feature-improvement-research |
| **Predecessor** | 047-measure-every-jev-feature |
| **Successor** | None |
| **Handoff Criteria** | Validator + template + generator changes ship so parent validates under tolerant policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 047 measured every Jev feature. Nine came out keep or adopt and one stopped just under its margin, but each result raises the same open questions: what drove it, how to make it better or cheaper, how far to trust it, where else it applies and what a default-on integration would take. None of these features is wired into a live workflow yet.

### Purpose
Each child researches one feature with two lineages from two model families, DeepSeek V4.1 Flash for 5 iterations and GPT-6 Luna for 3, and merges them into a ranked `research.md`. The children are independent, so they run in parallel.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Ten research runs, one per feature: 030, 017, 032, 035, 024, 025, 020, 022, 037 and 026
- Ranked recommendations to improve, refine and expand each feature

### Out of Scope
- Building any recommendation. A later phase picks from the results
- The features 047 killed or found without headroom

### Files to Change
Each child writes only its own `research/` folder.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `NNN-*/research/` | Create | every child | Lineage state, iterations and `research.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-fanout-merge-research/ | Research how to improve, refine and expand the Jev fan-out merge (feature 030) | Complete |
| 2 | 002-track-narrowing-research/ | Research how to improve, refine and expand the Jev spec-track narrowing (feature 017) | Complete |
| 3 | 003-citation-drift-research/ | Research how to improve, refine and expand the Jev citation drift scan (feature 032) | Complete |
| 4 | 004-injection-screen-research/ | Research how to improve, refine and expand the Jev fetched-text injection screen (feature 035) | Complete |
| 5 | 005-hallucination-grader-research/ | Research how to improve, refine and expand the Jev hallucination grader (feature 024) | Complete |
| 6 | 006-verdict-fallback-research/ | Research how to improve, refine and expand the Jev reviewer verdict fallback (feature 025) | Complete |
| 7 | 007-clarify-default-research/ | Research how to improve, refine and expand the Jev routing clarify default (feature 020) | Complete |
| 8 | 008-folder-suggestion-research/ | Research how to improve, refine and expand the Jev spec-folder suggestion (feature 022) | Complete |
| 9 | 009-pi-transport-research/ | Research how to improve, refine and expand the Jev Pi native classifier transport (feature 037) | Complete |
| 10 | 010-completion-claims-research/ | Research how to improve, refine and expand the Jev completion-claim audit (feature 026) | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-fanout-merge-research | 002-track-narrowing-research | Independent of its predecessor. The phases run in parallel | `validate.sh --strict` on the phase |
| 002-track-narrowing-research | 003-citation-drift-research | Independent of its predecessor. The phases run in parallel | `validate.sh --strict` on the phase |
| 003-citation-drift-research | 004-injection-screen-research | Independent of its predecessor. The phases run in parallel | `validate.sh --strict` on the phase |
| 004-injection-screen-research | 005-hallucination-grader-research | Independent of its predecessor. The phases run in parallel | `validate.sh --strict` on the phase |
| 005-hallucination-grader-research | 006-verdict-fallback-research | Independent of its predecessor. The phases run in parallel | `validate.sh --strict` on the phase |
| 006-verdict-fallback-research | 007-clarify-default-research | Independent of its predecessor. The phases run in parallel | `validate.sh --strict` on the phase |
| 007-clarify-default-research | 008-folder-suggestion-research | Independent of its predecessor. The phases run in parallel | `validate.sh --strict` on the phase |
| 008-folder-suggestion-research | 009-pi-transport-research | Independent of its predecessor. The phases run in parallel | `validate.sh --strict` on the phase |
| 009-pi-transport-research | 010-completion-claims-research | Independent of its predecessor. The phases run in parallel | `validate.sh --strict` on the phase |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
