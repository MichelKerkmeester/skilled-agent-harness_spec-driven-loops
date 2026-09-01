---
title: "Feature Specification: Give the frontmatter contract an owning mode by building sk-create-frontmatter"
description: "Six modes emit frontmatter and none of them owns the contract, so the spec that governs it sits in a shared tier where nobody is accountable for it. This decomposition gives it an owning mode."
trigger_phrases:
  - "sk-create-frontmatter mode"
  - "frontmatter contract ownership"
  - "frontmatter templates owning mode"
  - "frontmatter versioning mode"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "planning"
    recent_action: "Authored the parent scope and the phase map"
    next_safe_action: "Execute phase 001, the read-only inventory"
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

# Feature Specification: Give the frontmatter contract an owning mode by building sk-create-frontmatter

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
| **Parent Packet** | scaffold/001-sk-create-frontmatter |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Validator + template + generator changes ship so parent validates under tolerant policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Six modes emit frontmatter. Their templates all defer to one spec for the canonical rules, and
that spec sits in a shared tier that no mode is accountable for. Shared means every mode may
reach it, which is the right reach and the wrong ownership: a contract that everyone reads and
nobody owns gets edited by whoever is passing, and drifts from the validators that enforce it.

The same shape has already been corrected twice in this hub. A voice standard moved into the
mode that applies it. A document template moved into the mode named after it, and doing so
deleted an alias that had existed only to paper over the mismatch. Frontmatter is the third and
largest instance, and the only one with no candidate owner today, because no mode is the
frontmatter mode.

### Purpose

Frontmatter has an owner, and every producer cites that owner rather than a shared tier.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A new `sk-create-frontmatter` mode under the sk-doc hub, built to the create-skill templates.
- The frontmatter template spec and the frontmatter versioning rules, moved into it.
- Every consumer repointed, including the two validators that read the spec at run time.
- Full routing integration, so the mode is reachable rather than merely registered.

### Out of Scope

- Changing what the frontmatter contract says. This decomposition moves ownership, not rules.
  A change to the rules while they are moving would make both impossible to review.
- The eight other sk-doc modes that carry no manual testing playbook. Three of thirteen have
  one, which is a real gap and its own piece of work. Only the voice mode is picked up here,
  and only because the authoring setup is already paid for by phase 005.
- The other shared-tier files. Each was measured and found to be a convention with many
  producers and no owner, which is the case for staying shared. Frontmatter is different only
  because it is large enough and central enough to deserve a mode of its own.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-doc/sk-create-frontmatter/**` | Create | 002, 005 | The mode packet, its references, assets and playbook |
| `.opencode/skills/sk-doc/shared/assets/frontmatter-templates.md` | Delete | 003 | Moves into the mode |
| `.opencode/skills/sk-doc/shared/references/frontmatter-versioning.md` | Delete | 003 | Moves into the mode |
| Consumers across six modes, the hub, commands and doctor scripts | Modify | 003 | Repointed to the owning mode |
| `.opencode/skills/sk-doc/{mode-registry,hub-router,leaf-manifest,ROUTER.md}` | Modify | 004 | Registration and both routing stages |
| `specs/.../009-parent-hub-rollout/007-sk-doc/**` | Modify | 004, 006 | Canary coverage and its pinned digests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-inventory-and-contract/ | Read only. Enumerate every consumer of the frontmatter spec, and decide what the mode owns versus what stays shared | Pending |
| 2 | 002-mode-scaffold/ | Build the mode packet to the create-skill templates, with no content in it yet | Pending |
| 3 | 003-content-migration/ | Move the spec into the mode and repoint every consumer | Pending |
| 4 | 004-routing-integration/ | Registry, hub vocabulary, router intents, leaf manifest, advisor identity, canary coverage | Pending |
| 5 | 005-command-and-playbook/ | The command surface, its workflow assets, and the mode's manual testing playbook | Pending |
| 6 | 006-verification-and-closeout/ | Whole-fleet gates from the final state, and the packet's own closure | Pending |
| 7 | 007-human-voice-playbook/ | The sibling voice mode has no playbook either, and the setup for authoring one is paid in phase 005 | Pending |

| 7 | 007-human-voice-playbook/ | [Phase 7 scope] | Pending |
### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-inventory-and-contract | 002-mode-scaffold | Every consumer is listed with its exact reference form, and each is marked owned or shared with a reason | The inventory count matches a fresh scan, and no consumer is unclassified |
| 002-mode-scaffold | 003-content-migration | The empty packet passes the packaging gate and the hub check | `package_skill.py --check --strict` reports PASS and `parent-skill-check` stays OK |
| 003-content-migration | 004-routing-integration | The spec lives in the mode, every consumer resolves, and no alias was added to make it work | A repo scan finds no surviving reference to the old path outside frozen history |
| 004-routing-integration | 005-command-and-playbook | The mode is reachable in both routing stages, not merely registered | The advisor selects the hub, the hub router selects the mode, and the canary covers it with a single-route case |
| 005-command-and-playbook | 006-verification-and-closeout | The playbook package validates and its scenarios load | The playbook package validator passes and the loader reports the authored scenario count |
| 006-verification-and-closeout | 007-human-voice-playbook | The fleet is green, so a second playbook is authored against a settled tree | Every gate in the phase 006 sweep passes |
| 006-verification-and-closeout | 007-human-voice-playbook | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None. Phase 001 exists precisely to answer the one open question worth asking, which is where
the boundary falls between what the mode owns and what stays shared. It is read only, so the
answer costs nothing to change.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
