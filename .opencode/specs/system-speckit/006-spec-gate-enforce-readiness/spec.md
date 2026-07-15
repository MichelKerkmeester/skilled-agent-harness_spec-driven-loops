---
title: "Feature Specification: Spec-gate enforce-readiness remediation"
description: "Phase parent for the fixes that make the Spec Mutation Gate's opt-in enforce mode viable and measurable before an operator flips it on."
trigger_phrases:
  - "006-spec-gate-enforce-readiness"
  - "spec gate enforce readiness"
  - "spec mutation gate remediation"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/006-spec-gate-enforce-readiness"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored phase-parent root purpose, phase map, and handoff criteria"
    next_safe_action: "Implement phase 001 (advise telemetry), the foundation the enforce-flip decision depends on"
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

# Feature Specification: Spec-gate enforce-readiness remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-speckit/006-spec-gate-enforce-readiness` |
| **Predecessor** | `skilled-agent-orchestration/132-plugin-hook-implementation/006-spec-mutation-gate` (the shipped guard this remediates) |
| **Successor** | None |
| **Handoff Criteria** | Each phase ships its code + tests green + `validate.sh --strict` clean; every change preserves fail-open, the kill-switch no-op, and deny staying opt-in + default-off before the next phase begins |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Spec Mutation Gate ships advise-only and harmless, but a fresh independent review reproduced three structural "stuck-open" defects in its close path plus a telemetry gap: if an operator set `MK_SPEC_GATE_ENFORCE=1` today, it would block the common happy paths — a prompt that names a valid folder in the same breath, answering "new folder" before a save writes the metadata trio, and dispatched/headless sessions that have no user to answer. Worse, denied agents route writes through never-denied Bash heredocs, making the guard counterproductive with less visibility than advise mode. And there is currently no per-event telemetry to measure the would-be-deny rate the flip decision needs.

### Purpose
Make the gate's opt-in enforce mode viable and measurable — fix the close-path defects and add per-event telemetry — so an operator can stage the flip (Claude interactive first) on real data. This packet changes NOTHING about the default advise-only behavior; deny stays opt-in and default-off throughout.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Per-event advise/would-deny telemetry (session, tool, path, decision) on both runtimes, so the enforce-flip decision has a measurable rate.
- Close-path fixes so an answered or self-evident gate actually closes: same-turn self-binding, scaffolded-folder acceptance, and answer-grammar hardening.
- Headless/subagent enforce scoping so dispatched sessions never deny even with the enforce env set.

### Out of Scope
- Flipping `MK_SPEC_GATE_ENFORCE=1` on — that stays an operator decision, staged on the telemetry this packet produces.
- Changing the shared Gate-3 classifier's `MANDATORY_SPEC_METADATA_FILES` contract (other consumers depend on it); the scaffolded-folder relaxation is local to the spec-gate binding path.
- Widening the deny predicate beyond Write/Edit, or adding any new blocking surface.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec-gate-core.mjs` | Modify | 002/003/004/005 | Close-path logic, child-session predicate, answer grammar (the shared core) |
| `mk-spec-gate.js` + the two Claude adapters | Modify | 001 | Structured per-event advise/would-deny telemetry |
| `.claude/settings.json` + cli-external dispatch wrappers | Modify | 004 | Scope the first enforce flip to Claude interactive; force `MK_SPEC_GATE_ENFORCE=0` in headless children |
| `spec-gate-core.test.mjs` + adapter tests | Create/Modify | Each phase | Regression + corpus tests for each fix |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-advise-telemetry/ | FOUNDATION: per-event advise/would-deny telemetry (session \| tool \| path \| decision) on both runtimes, so the would-be-deny rate the flip decision needs becomes measurable. Built first. | Planned |
| 2 | 002-trigger-turn-self-binding/ | Bind on the triggering turn when it already names a valid folder (and thread ClassificationOptions), so "fix X, use `<folder>`" and `/speckit:implement <folder>` do not open-then-deny. | Planned |
| 3 | 003-scaffolded-folder-acceptance/ | Accept a scaffolded folder (spec.md present) as a closing answer without the save-time metadata trio — a local relaxation in the spec-gate binding path; the shared classifier contract stays untouched. | Planned |
| 4 | 004-headless-enforce-scoping/ | Suppress deny for dispatched/child sessions (`AI_SESSION_CHILD`) inside the core predicate; scope the operator's first flip to Claude interactive; dispatch wrappers force `MK_SPEC_GATE_ENFORCE=0`. | Planned |
| 5 | 005-answer-grammar-hardening/ | Tighten the skip match so mid-prompt "skip" does not silently close the gate; broaden natural answer forms; reword the deny detail for the model audience. Conservative: ambiguous stays open. | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-advise-telemetry | 002-trigger-turn-self-binding | Both runtimes log one structured advise/would-deny line per open-gate mutation; the would-be-deny rate is computable | 001 telemetry tests green; a source Write with an open gate produces a parseable session\|tool\|path\|decision line |
| 002-trigger-turn-self-binding | 003-scaffolded-folder-acceptance | A single triggering prompt naming a valid folder binds to satisfied on that turn; a folder-less trigger still opens | 002 self-bind tests green; enforce-off still never denies |
| 003-scaffolded-folder-acceptance | 004-headless-enforce-scoping | Answer "B" after a spec.md scaffold closes the gate without the save-time trio; the shared classifier contract is unchanged | 003 acceptance tests green; classifier `MANDATORY_SPEC_METADATA_FILES` byte-identical |
| 004-headless-enforce-scoping | 005-answer-grammar-hardening | A child/dispatched session never denies even with the enforce env set; the deny predicate is only narrowed, never widened | 004 child-session matrix green; interactive Claude still denies when enforce on |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **The flip criteria:** what measured would-be-deny rate (and how long observed) gates setting `MK_SPEC_GATE_ENFORCE=1`? The plan's stance: zero would-be-denies in autonomous/dispatched sessions, and interactive denies resolvable by a single A–E answer.
- **Scaffolded-folder approach (003):** the recommended fix is a local relaxation (accept `spec.md`-present) over a new `pending` gate status; confirm before implementing.
- **First flip scope (004):** Claude Code interactive only, with headless children forced to `MK_SPEC_GATE_ENFORCE=0` — confirm the operator wants OpenCode deny deferred to a later, separate decision.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Review that motivated this packet**: the fresh Fable-5 review of `132-plugin-hook-implementation/006-spec-mutation-gate`
- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md, checklist.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
