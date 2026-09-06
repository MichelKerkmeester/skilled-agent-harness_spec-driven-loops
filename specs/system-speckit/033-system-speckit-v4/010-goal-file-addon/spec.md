---
title: "Feature Specification: Nested Goal Addon"
description: "Phase parent for a goal.md addon: a short durable parent directive that references per-phase child goal files, entering the Level contract as a lazy add-on and reaching the speckit command surface runtime-neutrally."
trigger_phrases:
  - "nested goal addon"
  - "goal.md template"
  - "parent goal child phases"
  - "durable slice cap"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/010-goal-file-addon"
    last_updated_at: "2026-08-30T04:17:55Z"
    last_updated_by: "claude-code"
    recent_action: "Verified the research synthesis and decomposed it into four phases"
    next_safe_action: "Execute 001-manifest-and-goal-template"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:13f24557f6acee3201bbc9978cfe8136ee71253c80c00f9f4bc5aeb7a817fd21"
      session_id: "2026-08-29-042-nested-goal-template-addon"
      parent_session_id: null
    completion_pct: 10
    open_questions:
      - "Whether a live Claude goal surface re-reads a referenced file path; unprovable from this repository"
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Nested Goal Addon

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-speckit/033-system-speckit-v4/010-goal-file-addon |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each phase validates independently under `validate.sh --strict` before the next begins |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

An operator sets one session objective, and whatever they set is frozen at that moment. A packet's real directive outgrows it: packet 033's `goal.md` reached 15,028 bytes across three phases while the objective an operator had set still described two. The runtime goal surfaces cap what they will hold, so the whole directive cannot simply be pasted in. There is also no goal document in the Level contract at all, so nothing about this is scaffolded, validated, or reachable from the commands that offer to set a goal.

### Purpose

Give a packet a short durable directive that names its phases, so the string an operator sets stays small and stays true while the detail it points at is free to grow and change.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The Level contract and template set for a new `goal.md` add-on document.
- A present-file validator for the durable slice, the binding block and child paths.
- The speckit command surface's goal offer, made runtime-neutral.
- The operator-facing playbook for what actually gets set as the objective.

### Out of Scope

- Any adapter under `hooks/goal/` for Claude, Codex or Devin. The core records their absence as by-design; adding one is a different decision.
- Teaching any runtime to dereference a path inside a goal string. Every surface is string-in, string-out.
- A size cap on the whole `goal.md`. Only the durable slice is capped, because a progress log is not a defect.
- Claiming anything about a live Claude goal surface's internals that this repository cannot prove.

### Files to Change

Summary for audit trail only; per-phase detail lives in each child's `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `templates/spec-kit-docs.json` | Modify | 001 | Document entry, version, section gates, lazy add-on listing |
| `templates/addons/goal.md.tmpl` | Create | 001 | The gated document with its durable and log split |
| `scripts/utils/template-structure.js` | Modify | 001 | Document-to-template mapping |
| `scripts/rules/` | Create | 002 | Present-file validator for the durable slice and binding |
| `.opencode/commands/speckit/assets/*.yaml` | Modify | 003 | Runtime-neutral dispatch for the goal offer |
| `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` | Modify | 003 | Stale-filename assertion made path-specific |
| Reference and playbook surfaces | Modify | 004 | What an operator sets, and why it is short |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-manifest-and-goal-template/ | Put `goal.md` in the Level contract as a lazy add-on for Levels 1, 2, 3, 3+ and phase, and author the gated template with its durable directive, binding block and optional log | Complete |
| 2 | 002-durable-slice-validator/ | A present-file rule: durable and log headings, a binding block on phase parents, listed child paths that exist, and a durable slice within its character budget | Complete |
| 3 | 003-runtime-neutral-goal-dispatch/ | Make the speckit goal offer dispatch per runtime instead of calling one runtime's tool, and make the stale-filename assertion path-specific so a spec document named `goal.md` stops colliding with it | Complete |
| 4 | 004-parent-set-string-playbook/ | The operator-facing contract for what gets set: a short pointer plus the completion bullets copied out, because no stop evaluator opens the file | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | The document resolves through the contract and renders per level | `resolveTemplatePath` returns a path for the gated levels and null elsewhere |
| 002 | 003 | The validator reports a violation on a deliberately broken file | Negative control: an over-budget durable slice and a missing child path both fail |
| 003 | 004 | The goal offer no longer hard-codes one runtime's tool, and the contract test passes | `speckit-goal-offer-contract.test.cjs` exits 0 |
| 004 | — | An operator can set a packet goal from the playbook without reading the packet | The set string carries the pointer and the completion bullets |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Whether a live Claude goal surface re-reads a referenced file path at evaluation time. This repository cannot answer it, and the design deliberately does not depend on the answer: the parent carries its own completion criteria so a string-only evaluator can still judge the packet.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
- **Research synthesis**: See `research/research.md`
