---
title: "Feature Specification: Bring the lieflat-charts skill into this repository as sk-create-chart"
description: "An external data-visualization skill is worth having here, but it arrives with its primary documentation in Chinese, its own conventions, and no manual testing playbook. It has to become one of ours without losing what makes it good."
trigger_phrases:
  - "sk-create-chart"
  - "lieflat charts adoption"
  - "import an external skill"
  - "chart template skill"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/051-sk-create-chart"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "planning"
    recent_action: "Authored the parent scope and the phase map"
    next_safe_action: "Execute phase 001, the read-only inventory and placement decision"
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

# Feature Specification: Bring the lieflat-charts skill into this repository as sk-create-chart

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-02 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/001-sk-create-chart |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Validator + template + generator changes ship so parent validates under tolerant policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`lieflat-charts` is a data-visualization skill built elsewhere: 51 chart and report templates
in three families, a colour system, two validation scripts, and 26,500 lines of content. It is
already shaped like a skill, with its own `SKILL.md`, and it is good at something this
repository has no answer for.

It also cannot come here. It is PolyForm Noncommercial and this repository is MIT and public,
and those two grants contradict each other for the same bytes. The operator ruled on 2026-09-02
that nothing is copied. So the packet builds `sk-create-chart` natively, using the reference for
what to build rather than for what to move.

That leaves the original problems intact and adds one. The reference's documentation is Chinese,
so understanding it takes a translation pass. It follows its own conventions rather than the
create-skill templates. It has no manual testing playbook. And now the corpus that made it worth
studying has to be written here instead of moved.

### Purpose

A chart skill that was written here, informed by a good reference and carrying none of it.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A `sk-create-chart` packet built to the create-skill templates, with its own chart corpus,
  colour system and validator.
- English throughout, as the primary and only language of the authored documents.
- A manual testing playbook, to the operator-scenario contract.
- Full routing integration, so the skill is reachable rather than merely present.

### Out of Scope

- Copying anything from the reference. Not a template, not a fragment, not a snippet. This is
  the operator's ruling and it is the constraint the whole packet is shaped around.
- Matching the reference's chart count as a target. The corpus is sized by what is worth
  having here.
- The upstream repository. This is a repository we learn from, not one we fork or track.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/**` | Create | 3, 4, 6 | The mode, its authored corpus and its playbook |
| Hub registry, router, vocabulary and leaf manifest | Modify | 5 | Registration and stage-two routing |
| Canary fixtures and pinned digests | Modify | 5, 6 | Single-route coverage for the new surface |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-source-inventory-and-placement/ | Read only. Inventory every source file, and decide with evidence whether this is an sk-doc mode or a standalone skill | Complete |
| 2 | 002-translation-and-voice/ | Read the Chinese documents into English so the reference can be understood, and describe what it does | Complete |
| 3 | 003-packet-scaffold/ | Build the packet shape from the create-skill templates | Pending |
| 4 | 004-native-chart-build/ | Author the colour system and the chart corpus here, and prove each template renders | Pending |
| 5 | 005-routing-integration/ | Registration and both routing stages, plus canary coverage | Pending |
| 6 | 006-playbook-and-closeout/ | The manual testing playbook, then the whole-fleet gates | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Every source file is classified as port, translate, adapt or drop, with a reason per drop | The inventory count matches a fresh scan of the clone, and nothing is unclassified |
| 002 | 003 | The reference is described well enough to build from without opening it | A capability description exists per chart family, and the voice scanner is clean |
| 003 | 004 | The empty packet passes the packaging gate | `package_skill.py --check --strict` reports PASS |
| 004 | 005 | Every authored template renders, and nothing from the reference is present | The corpus validator exits 0 after being shown it can fail, and a scan for reference strings returns nothing |
| 005 | 006 | The skill is reachable in both routing stages, not merely registered | The advisor selects it, the router resolves it, and its leaves resolve on disk |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

Both of the packet's original questions are answered. Placement is a workflow mode under the
documentation hub, recorded as ADR-001, decided on tie-break machinery rather than on size.
Licensing is settled by ADR-002: nothing is copied, and the skill is built from the ideas.

What stays open is a matter of size rather than direction. Phase 4 has to decide how many chart
types the first corpus carries. The reference ships 49 in its primary tier by its own count,
which is a reference point and not a target.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
