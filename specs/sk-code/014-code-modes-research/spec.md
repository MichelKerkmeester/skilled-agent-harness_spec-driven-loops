---
title: "Feature Specification: sk-code Quality and Review Modes Research"
description: "Two independent ten-iteration deep-research runs on how to make sk-code-quality and sk-code-review more repo-agnostic, more useful and better integrated with sibling modes and with modes an outside user adds. Findings only."
trigger_phrases:
  - "sk-code modes research"
  - "sk-code quality mode research"
  - "sk-code review mode research"
  - "repo-agnostic sk-code modes"
  - "user-authored sk-code mode"
  - "sk-code mode registry extension"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-code/014-code-modes-research"
    last_updated_at: "2026-10-25T08:50:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Scaffolded the phased research packet and wrote every document with status Planned"
    next_safe_action: "Confirm the executor alternation unit, then launch the 001 research run and the 002 research run"
    blockers: []
    key_files:
      - "spec.md"
      - "goal.md"
      - "001-quality-mode-research/spec.md"
      - "002-review-mode-research/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-25-skcode-014"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the executor alternation run per iteration or per child?"
    answered_questions:
      - "Packet shape: a phased parent with two children, chosen as Gate 3 option B on 2026-10-25."
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge, migration or consolidation narratives (consolidate*, merged from, renamed from, collapsed, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md. These belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: sk-code Quality and Review Modes Research

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-25 |
| **Executor** | Luna max fast via cli-codex and DeepSeek flash max 1017 via cli-pi through llmgateway, alternating |
| **Parent Spec** | None (top-level packet) |
| **Parent Packet** | sk-code track |
| **Predecessor** | 013-private-surface-skills |
| **Successor** | None |
| **Handoff Criteria** | Both children validate `--strict`, each child holds a ranked `research/research.md` built from ten iterations and no file under `.skilled/` changed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-code hub ships two workflow modes that code work passes through. `sk-code-quality` is the author-side gate that runs before a completion claim. `sk-code-review` is the findings-first review baseline. Both were written against this framework's own layout. Quality maps target paths such as `.skilled/skills/` and `.skilled/agents/` to checklists and names three enforcement layers under `.skilled/` and `.github/`. Review takes its surface evidence from one `.skilled/` path marker and names the `@review` agent file under `.skilled/agents/`.

In a repository without that layout both modes fall back to a generic baseline. Neither mode says how a repository extends it, and neither says how it meets a mode that someone outside the maintainers adds to the hub. A user can register their own mode packet in `mode-registry.json`, so that meeting point matters.

### Purpose

When both runs are done, each mode has a ranked list of evidence-labelled recommendations that make it more repo-agnostic, more useful and better integrated with its sibling modes and with user-authored modes. A later packet can implement the top recommendations. This packet changes nothing in the hub.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level apart from `goal.md`. All detailed planning, task breakdowns, checklists and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Two independent deep-research runs of ten iterations each, one per mode, run later by other agents inside the children's `research/` folders.
- Each mode read as it stands in this checkout under `.skilled/skills/sk-code/`, together with the hub files that route to it: `SKILL.md`, `mode-registry.json`, `ROUTER.md`, `hub-router.json` and `leaf-manifest.json`.
- The extension path for a user-authored mode: the eleven-row integration list in section 7 and the workflow-versus-surface choice in section 6 of `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md`.
- A ranked recommendation list per mode, each row labelled OBSERVED, DERIVED or INFERRED.

### Out of Scope

- Any edit to `.skilled/skills/sk-code/` or to any other skill, router, registry, advisor or hook. Recommendations are ranked here and applied by a later packet.
- `sk-code-skilled` and `sk-code-ci` as subjects. Both are read as siblings only.
- Implementing a recommendation, adding tests or running a benchmark.
- A combined hub-level redesign. A later packet may reconcile the two lists.

### Frozen Decisions

Both children cite these rows. Changing one is an amendment to this parent first.

| ID | Decision |
|----|----------|
| D1 | Findings only. No file under `.skilled/` changes. Each run writes under its own `research/` folder and makes only the bounded `spec.md` edits the deep-research protocol allows. |
| D2 | The subjects are `sk-code-quality` (phase 1) and `sk-code-review` (phase 2). Each run answers the same three questions: how to make the mode repo-agnostic, more useful and better integrated. |
| D3 | Each run holds exactly ten iterations, one angle each. Early convergence cannot stop a run before iteration ten. The stop reason is recorded. |
| D4 | Luna max fast via cli-codex and DeepSeek flash max 1017 via cli-pi through llmgateway alternate by iteration, odd on Luna and even on DeepSeek. Nothing in this packet runs either. Open question 1 asks the operator to confirm the unit. |
| D5 | Every finding carries OBSERVED, DERIVED or INFERRED and a source tag with a repository path and line. Nothing is fetched from the network, so outside knowledge is INFERRED. |
| D6 | The runs are independent. Neither run reads the other child's `research/` folder before its own synthesis is written. |

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-quality-mode-research/research/` | Create | quality-mode-research | Ten iteration records, loop state and the ranked `research.md` |
| `002-review-mode-research/research/` | Create | review-mode-research | Ten iteration records, loop state and the ranked `research.md` |
| `specs/sk-code/graph-metadata.json` | Modify | both | The track root lists this packet. The creation script wrote that row. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-quality-mode-research/ | Ten-iteration research on sk-code-quality: repo-bound assumptions, usefulness and its contract with review, the surface packets and user-authored modes | Planned |
| 2 | 002-review-mode-research/ | Ten-iteration research on sk-code-review: repo-bound assumptions, usefulness and its contract with quality, the surface packets and user-authored modes | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-quality-mode-research | 002-review-mode-research | None. The runs read nothing from each other, so either may go first | `grep -rc "001-quality-mode-research/research" 002-review-mode-research/research` prints 0 for every file |
| 002-review-mode-research | Parent close | Both `research/research.md` files hold a Ranked Recommendations section of at least eight rows | `grep -c "Ranked Recommendations"` on each file prints 1 or more |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Does the executor alternation run per iteration or per child? The default here is per iteration, which needs one relaunch from saved state per iteration. If the operator wants one executor per child, change D4 and the matching rows in both children.
- Is a user-authored mode judged against the registry route only, or also against the private `local-*` skill route packet 013 introduced? The default here is the registry route, with the `local-*` route noted where it differs.
- Does a later packet reconcile the two ranked lists into one hub-level plan? This packet does not decide that.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Goal**: See `goal.md`
- **Parent Spec**: None, this is a top-level packet in the sk-code track
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
