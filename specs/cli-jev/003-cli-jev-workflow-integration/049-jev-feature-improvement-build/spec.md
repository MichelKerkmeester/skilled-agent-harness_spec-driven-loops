---
title: "Feature Specification: Build the recommendations from 048's research for each kept Jev feature, and fix the deep-research workflow faults found while running it"
description: "Twelve build phases: one per Jev feature 048 researched, building the recommendations that need no new labels, corpus or default-on switch, plus two that fix the deep-research workflow faults 048 hit."
trigger_phrases:
  - "jev feature improvement build"
  - "deep research run init fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build"
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

# Feature Specification: Build the recommendations from 048's research for each kept Jev feature, and fix the deep-research workflow faults found while running it

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-03 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/049-jev-feature-improvement-build |
| **Predecessor** | 048-jev-feature-improvement-research |
| **Successor** | None |
| **Handoff Criteria** | Validator + template + generator changes ship so parent validates under tolerant policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 048 gave ten kept or near-kept Jev features a ranked list of ways to improve, refine and expand them. Most of the cheap wins are scorer and report changes nobody has built: honest baselines, self-describing records, fewer calls for the same picks, and a few defects. Running 048 also exposed deep-research workflow faults that stopped Luna lineages and needed manual repair.

### Purpose
Each feature child builds the recommendations from its 048 research that need no new labels, corpus or default-on switch, then records a re-measure where the protocol changed. Two more children fix the workflow faults at their source. The children touch disjoint files, so they can run in parallel.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Ten feature children, one per feature 048 researched: 030, 017, 032, 035, 024, 025, 020, 022, 037 and 026
- The deep-research run open, through the append gateway
- The fan-out runner, merge and iteration prompt faults

### Out of Scope
- New corpora and new labels, per 003 D4
- Any default-on switch, per 047 D6
- Recommendations each child lists as out of scope, with its reason

### Files to Change
Each child names its exact files in its own spec.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| Each feature's scorer and its tests | Modify | 001 to 010 | The ranked recommendations in scope |
| `.skilled/commands/deep/assets/deep-research-*.yaml` and the research ledger types | Modify | 011 | Run open through the gateway |
| `fanout-merge.cjs`, `fanout-run.cjs` and the research iteration prompt pack | Modify | 012 | Merge fields, retry class, prompt lines |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-fanout-merge-improvements/ | Build 048's ranked fixes for the Jev fan-out merge (030): honest baselines, two-call early stop, self-describing report | Complete |
| 2 | 002-track-narrowing-improvements/ | Build 048's ranked fixes for the Jev spec-track narrowing (017): pinned record, no `--out` overwrite, per-track and slack reporting | Complete |
| 3 | 003-citation-drift-improvements/ | Build 048's ranked fixes for the Jev citation drift scan (032): min-rerun flag, live column, hash checks, one read per document | Complete |
| 4 | 004-injection-screen-improvements/ | Build 048's ranked fixes for the Jev injection screen (035): corpus provenance, trust package, flag line 0.6, fewer calls | Planned |
| 5 | 005-hallucination-grader-improvements/ | Build 048's ranked fixes for the Jev hallucination grader (024): allowlists, unmeasured failures, shared context | Planned |
| 6 | 006-verdict-fallback-improvements/ | Build 048's ranked fixes for the Jev verdict fallback (025): typed verdict, wider parser, abstain outcome | Planned |
| 7 | 007-clarify-default-improvements/ | Build 048's ranked fixes for the Jev clarify default (020): replay-verified rows, digests, class and hub baselines | Planned |
| 8 | 008-folder-suggestion-improvements/ | Build 048's ranked fixes for the Jev folder suggestion (022): path-resolved descriptions, candidate recall, pins | Planned |
| 9 | 009-pi-transport-improvements/ | Build 048's ranked fixes for the Pi classifier transport (037): provider intent, kill switch, cached runtime, paired benchmark | Planned |
| 10 | 010-completion-claims-improvements/ | Build 048's ranked fixes for the completion-claim audit (026): sentinel regex, scorer repairs, Cursor wiring | Complete |
| 11 | 011-research-run-init-via-gateway/ | Fix the deep-research run open: record `run_initialized` through the gateway so a run's first append projects | Complete |
| 12 | 012-fanout-runner-and-prompt-fixes/ | Fix the fan-out runner, merge and lineage prompt faults 048 hit | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-fanout-merge-improvements | 002-track-narrowing-improvements | Independent of its predecessor. The phases run in parallel | `validate.sh --strict` on the phase |
| 002-track-narrowing-improvements | 003-citation-drift-improvements | Independent of its predecessor. The phases run in parallel | `validate.sh --strict` on the phase |
| 003-citation-drift-improvements | 004-injection-screen-improvements | Independent of its predecessor. The phases run in parallel | `validate.sh --strict` on the phase |
| 004-injection-screen-improvements | 005-hallucination-grader-improvements | Independent of its predecessor. The phases run in parallel | `validate.sh --strict` on the phase |
| 005-hallucination-grader-improvements | 006-verdict-fallback-improvements | Independent of its predecessor. The phases run in parallel | `validate.sh --strict` on the phase |
| 006-verdict-fallback-improvements | 007-clarify-default-improvements | Independent of its predecessor. The phases run in parallel | `validate.sh --strict` on the phase |
| 007-clarify-default-improvements | 008-folder-suggestion-improvements | Independent of its predecessor. The phases run in parallel | `validate.sh --strict` on the phase |
| 008-folder-suggestion-improvements | 009-pi-transport-improvements | Independent of its predecessor. The phases run in parallel | `validate.sh --strict` on the phase |
| 009-pi-transport-improvements | 010-completion-claims-improvements | Independent of its predecessor. The phases run in parallel | `validate.sh --strict` on the phase |
| 010-completion-claims-improvements | 011-research-run-init-via-gateway | Independent of its predecessor. The phases run in parallel | `validate.sh --strict` on the phase |
| 011-research-run-init-via-gateway | 012-fanout-runner-and-prompt-fixes | Independent of its predecessor. The phases run in parallel | `validate.sh --strict` on the phase |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. The operator released these phases for build on 2026-10-03, and 003 D3 now runs 019 to 049.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
