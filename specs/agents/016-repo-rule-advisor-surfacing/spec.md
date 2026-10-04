---
title: "Feature Specification: Repo rule surfacing, concision and loading"
description: "Repo rules reach the model through Gate 5 alone, cost about 27k tokens in full, and measurably fail to change behaviour once loaded. These phases decide what should surface them, how to write them shorter without losing force, and how to load them without flooding context."
trigger_phrases:
  - "repo rule surfacing"
  - "repo rule concision"
  - "repo rule loading"
  - "gate 5 rule loading"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "agents/016-repo-rule-advisor-surfacing"
    last_updated_at: "2026-10-04T13:20:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Planned build phases 003 to 008 from the 002 verdict"
    next_safe_action: "Implement 003, then 004 and 005 in parallel"
    blockers: []
    key_files:
      - "001-advisor-surfacing/research/research.md"
      - "002-rule-concision-and-loading/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "repo-rule-advisor-2026-10-04"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Repo rule surfacing, concision and loading

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-04 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | agents |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each phase validates strict on its own before the next starts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Repo rules in `.skilled/repo-rules/` reach the model only through Gate 5 and the reply-time load line in `AGENTS.md`. The 13 rules total about 27k tokens. Across 82 sessions from 2026-09-02 to 2026-10-04, long replies broke the no-table rule about 23% of the time whether or not `communication.md` had been read, so loading a rule does not measurably change behaviour.

### Purpose
Decide, from repository evidence, what should surface repo rules, how to write them shorter without losing what enforces them, and how `AGENTS.md`, Gate 5 or a hook should load them without flooding or poisoning context.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Research on which surface should suggest repo rules (phase 001).
- Research on rule concision, rule compliance, and the loading design for `AGENTS.md`, Gate 5 and a once-per-compaction hook (phase 002).
- Build phases 003 to 008 that apply the 002 verdict: the `AGENTS.md` delivery prefix, delivery instrumentation, a trigger coverage check, rule concision, and two pre-registered experiments.

### Out of Scope
- A once-per-compaction rule hook - deferred by the 002 verdict until a measured miss rate justifies it.
- Moving rule `trigger_phrases` to a sidecar - its only consumer is the repo-rule checker, and the saving is about 6.8 KB read only when a rule loads.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-advisor-surfacing/research/` | Create | 001 | Two-lineage surfacing research |
| `002-rule-concision-and-loading/research/` | Create | 002 | Four-lineage concision and loading research |
| `AGENTS.md`, `check-rule-copies.js` | Modify | 003 | Delivery prefix and its guard |
| `sk-create-repo-rule/scripts/measure-rule-compliance.py` | Create | 004 | Offline delivery and compliance analyzer |
| `sk-create-repo-rule/scripts/check-repo-rules.cjs`, `REPO RULES.md` | Modify | 005, 008 | Checks 10 and 11, router edits and pilot variants |
| `.skilled/repo-rules/*.md` | Modify | 006, 007 | Concision rewrites and the wording experiment |
| `sk-create-repo-rule/scripts/build-rule-cards.cjs`, `.skilled/repo-rules/cards/` | Create | 008 | Card generator and generated cards |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-advisor-surfacing/` | Whether the advisor, trigger index or a hook should suggest repo rules | Complete |
| 2 | `002-rule-concision-and-loading/` | Rule concision, why loaded rules are ignored, and the AGENTS.md, Gate 5 and hook loading design | Complete |
| 3 | `003-agents-md-delivery-prefix/` | Move every hard blocker and the §8 load line inside Devin's 16,384-byte cut, with a CI guard | Complete |
| 4 | `004-rule-delivery-instrumentation/` | Offline analyzer for Gate 5 and §8 miss rates and rule-version compliance, plus a committed baseline | Complete |
| 5 | `005-trigger-coverage-check/` | Tenth repo-rule check: router rows cover each rule's Fires-when bullets | Planned |
| 6 | `006-rule-concision-rewrites/` | Apparatus-only cuts to all 13 rules with keep and drop ledgers | Planned |
| 7 | `007-table-wording-experiment/` | Pre-registered ABAB test of short versus current no-table wording | Planned |
| 8 | `008-gate5-card-pilot/` | Card generator and a three-arm pilot: full files, cards at Gate 5, resident reply-rule cards | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-advisor-surfacing | 002-rule-concision-and-loading | 001 synthesis complete and validated | `validate.sh 001-advisor-surfacing --strict` returns RESULT: PASSED |
| 002-rule-concision-and-loading | 003-agents-md-delivery-prefix | 002 verdict complete and validated | `validate.sh 002-rule-concision-and-loading --strict` returns RESULT: PASSED |
| 003-agents-md-delivery-prefix | 004-rule-delivery-instrumentation | Guard in CI; 004 may start in parallel since it reads transcripts only | `check-rule-copies.js` passes with the guard |
| 004-rule-delivery-instrumentation | 005-trigger-coverage-check | Analyzer tests pass; 005 may start in parallel | pytest passes for the analyzer |
| 005-trigger-coverage-check | 006-rule-concision-rewrites | Ten checks in CI and the 004 baseline committed | `check-repo-rules.cjs` 10/10 and `baselines/` in git |
| 006-rule-concision-rewrites | 007-table-wording-experiment | All 13 rewrites shipped and one week of post-change window measured | Ten checks pass and the 004 analyzer report exists |
| 007-table-wording-experiment | 008-gate5-card-pilot | Wording decision committed, so the windows never overlap | `results/` decision recorded in 007 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Does the shorter no-table wording lower the table rate when nothing else changes? Phase 007 answers it.
- Should Gate 5 load card plus self-check, and should the reply-rule cards sit resident in `AGENTS.md` §8? Phase 008 answers it.
- Which runtimes besides Claude Code and Codex keep a readable transcript? Phase 004 T002 probes it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
