---
title: "Feature Specification: Spec-Kit Template Optimization"
description: "Phase parent for spec-kit document-template optimization: level-gated template contracts, context-cost reduction, and a canonical acceptance-criteria document that gates packet closure at Levels 2, 3 and 3+."
trigger_phrases:
  - "spec kit template optimization"
  - "acceptance criteria template"
  - "spec doc closure gate"
  - "level 2 3 3+ template contract"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-spec-kit-template-optimization"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Established phase parent and opened the acceptance-criteria template phase"
    next_safe_action: "Execute 002-acceptance-criteria-template"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-033-spec-kit-template-optimization"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Spec-Kit Template Optimization

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-speckit/033-spec-kit-template-optimization |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each phase validates independently under `validate.sh --strict` before the next begins |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The spec-kit document templates carry two unresolved costs. First, they spend context on content that most packets never read, which makes every packet more expensive to load than the work it describes warrants. Second, acceptance criteria have no single home: they are authored inline in `spec.md` (a requirements-table column plus prose user-story blocks) and traced separately in `checklist.md`, so nothing in the contract can state — or check — what must be true before a packet is allowed to close. Coverage is measured today only as a non-blocking advisory, which means a packet can be declared complete with acceptance criteria that were never met and never consciously waived.

### Purpose

Make the template contract carry its own weight at every level. Reduce what packets pay to load, and give acceptance criteria one canonical, level-gated document that acts as the closure gate: a packet at Level 2, 3 or 3+ may not be marked complete while an acceptance criterion is unmet, unless a decision record explicitly waives or supersedes it.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The Level contract in `templates/spec-kit-docs.json` for Levels 1, 2, 3 and 3+.
- The document templates under `templates/core/` and `templates/addons/`.
- The validation rules in `scripts/rules/` and their registry entries.
- The reference surfaces that publish the Level contract to humans and agents.

### Out of Scope

- Packet `036-spec-doc-template-reduction` and any other adjacent packet.
- Retroactive rewriting of already-closed spec packets.
- The memory/indexing pipeline beyond what the template contract requires.

### Files to Change

Summary for audit trail only; per-phase detail lives in each child's `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json` | Modify | 001, 002 | Level contract: document set, gates and versions |
| `.opencode/skills/system-spec-kit/templates/` | Modify/Create | 001, 002 | Document templates for the gated levels |
| `.opencode/skills/system-spec-kit/scripts/rules/` | Modify/Create | 001, 002 | Validation rules enforcing the contract |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Modify | 001, 002 | Rule registration, severity and flags |
| Reference and README surfaces | Modify | 001, 002 | Publish the contract to humans and agents |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-spec-template-context-optimization/ | Level-gated research templates, single-sourced templates, rendered-view read guard, acceptance-coverage advisory, scope-adherence validator, and a `memory_search` token budget | Complete |
| 2 | 002-acceptance-criteria-template/ | A canonical `acceptance-criteria.md` for Levels 2, 3 and 3+ that gates packet closure, with ADR-backed waiver and supersede paths | In Progress |

| 3 | 003-restore-level-upgrade-and-vocabulary-invariance/ | Restore the level-upgrade path after the template restructure and clear the public-surface vocabulary invariance | Complete |
### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Acceptance-coverage advisory exists and is registered, giving phase 2 a rule to promote rather than invent | `AC_COVERAGE` present in `scripts/lib/validator-registry.json` |
| 002 | — | Closure gate blocks an unmet, unwaived acceptance criterion under `--strict`, and the Level contract requires the document at Levels 2, 3 and 3+ | `validate.sh <folder> --strict` exit code, negative control included |
| 002 | 003 | The closure gate exists, so an upgrade that omits its document is a real defect worth fixing | Upgrade to Level 2 creates acceptance-criteria.md |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None open. Rollout scope, canonical acceptance-criteria location, and the packet-restructure shape were settled by operator decision on 2026-08-29 and are recorded in `002-acceptance-criteria-template/decision-record.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
