---
title: "Feature Specification: Give every sk-doc mode the manual testing playbook it lacks"
description: "Three of fifteen sk-doc modes carry a manual testing playbook. The other nine have no written statement of what the mode doing its job looks like, so a regression in any of them has nothing to fail against."
trigger_phrases:
  - "sk-doc playbook coverage"
  - "modes with no manual testing playbook"
  - "author playbooks for every mode"
  - "playbook gap sk-doc"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/050-sk-doc-playbook-coverage"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "planning"
    recent_action: "Authored the parent scope and the phase map"
    next_safe_action: "Author the three phases, which are independent"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019ahF7gmhZy3Bo2bKRKK2i7"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 3 -->
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

# Feature Specification: Give every sk-doc mode the manual testing playbook it lacks

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-01 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/001-sk-doc-playbook-coverage |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Validator + template + generator changes ship so parent validates under tolerant policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Three of the fifteen sk-doc modes carry a manual testing playbook. Nine do not, and one of
those nine is the mode whose entire job is authoring playbooks.

With no playbook there is no written statement of what a mode doing its job looks like, so a
regression in it has nothing to fail against and an operator asked to check it has nothing to
follow. The three that do have one show exactly what the other nine are missing.

### Purpose

Every mode states what correct behaviour looks like, in a form an operator can follow.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A manual testing playbook package for each of the nine sk-doc modes that has none.
- Scenario frontmatter written to the operator-scenario contract, which is what a mode playbook
  is. The Lane C benchmark fields are deliberately omitted: the authoring template requires them
  only when a playbook also serves as a hub corpus, and no mode playbook is a declared corpus.
- Coverage in both directions per mode: what it must catch, and what it must leave alone.

### Out of Scope

- Changing any mode's behaviour. A playbook records what a mode already does. Editing the mode
  while writing its first test is how a test ends up asserting a bug.
- The three modes that already have one, plus the two authored alongside the frontmatter work.
  They are the reference shape, not the work.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-doc/sk-create-{agent,command,readme}/manual-testing-playbook/**` | Create | 1 | Playbooks for the authoring surfaces |
| `.opencode/skills/sk-doc/sk-create-{benchmark,changelog,feature-catalog}/manual-testing-playbook/**` | Create | 2 | Playbooks for the artifact producers |
| `.opencode/skills/sk-doc/sk-create-{manual-testing-playbook,quality-control,skill}/manual-testing-playbook/**` | Create | 3 | Playbooks for the meta and quality modes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-authoring-surfaces/ | Modes that author a component: agent, command, readme | Pending |
| 2 | 002-artifact-producers/ | Modes that derive an artifact from a source: benchmark, changelog, feature-catalog | Pending |
| 3 | 003-meta-and-quality/ | Modes that act on another mode's output: manual-testing-playbook, quality-control, skill | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-authoring-surfaces | 002-artifact-producers | Each package validates as an operator-scenario package | `validate-playbook-package.cjs` reports `PASS` with `operator=N routing_gold_excluded=0` |
| 002-artifact-producers | 003-meta-and-quality | Same, for its three | Same |

> The phases are independent. No mode's playbook depends on another's, so they may be authored
> at the same time. The grouping exists so one author holds one kind of thinking at a time.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None. One trap is already known and written into every child: a package whose scenarios carry
the routing-gold signature is excluded from the operator contract, which drives `operator=0`
and a `SKIP` status at exit zero. A sweep grepping for failure reads that as clean. Every phase
asserts the operator count, not merely the absence of a failure.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
