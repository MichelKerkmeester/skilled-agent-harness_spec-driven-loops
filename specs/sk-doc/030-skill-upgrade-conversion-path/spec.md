---
title: "Feature Specification: Skill Upgrade / Single-to-Parent Conversion Path"
description: "Adopter-facing conversion path for reconciling a customized skill to the v4 parent-skill format."
trigger_phrases:
  - "skill upgrade"
  - "single to parent"
  - "parent skill conversion"
  - "adopter upgrade guide"
  - "sk-code sk-git reconcile"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/030-skill-upgrade-conversion-path"
    last_updated_at: "2026-08-15T11:59:34Z"
    last_updated_by: "claude-code"
    recent_action: "Phase 1 guide shipped and verified"
    next_safe_action: "Phase 2 promote op if adopter demand appears"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Skill Upgrade / Single-to-Parent Conversion Path

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-15 |
| **Branch** | `skilled/0150-hook-flag-coverage` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This repo is a framework others adopt and customize. Adopters keep their own `sk-code` (their stack, their patterns) and `sk-git` (their conventions). v4 reshaped `sk-code` into a parent skill (workflow modes plus read-only surface packets) and kept `sk-git` as a single skill. When an adopter pulls v4, their customized skills must be reconciled with the new skill format, but there was no guided path for it. `/create:skill-parent` had `create` and `update`, and `/create:skill` had `full-update`, but nothing migrated a flat skill's content into mode/surface packets, and no adopter-facing guide existed.

### Purpose
Give adopters a real, documented conversion path so they can align their own skills to the v4 format without hand-reverse-engineering the parent-hub layout.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Phase 1 — Adopter upgrade guide (core, doc-only).** A reference doc under `sk-create-skill/references/` covering the convert-vs-keep-single decision; the single→parent procedure using existing commands; the `sk-code` and `sk-git` adopter cases; the "most skills are repo-agnostic" note; and validation. Cross-linked from `sk-create-skill/SKILL.md` and `README.md`.
- **Phase 2 — `promote` operation (optional, code).** Extend `/create:skill-parent` with a `promote` operation that scaffolds a hub and seeds its first workflow-mode packet from an existing single skill's `SKILL.md`. Gated behind Phase 1 landing; not required for packet completion.

### Out of Scope
- Rewriting `sk-code` or `sk-git` themselves — they already shipped in v4.
- Auto-editing an adopter's repo — the guide instructs; it does not mutate downstream trees.
- Any change to the one-identity invariant (exactly one `graph-metadata.json`, at the hub root only).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md | Create | The adopter upgrade guide |
| .opencode/skills/sk-doc/sk-create-skill/SKILL.md | Modify | Cross-link the guide (references) |
| .opencode/skills/sk-doc/sk-create-skill/README.md | Modify | Cross-link the guide |
| .opencode/skills/sk-doc/leaf-manifest.json | Modify | Register the new reference as a declared leaf |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The guide states the decision rule: promote when a skill has ≥2 distinct jobs/modes; keep single when it has one; an adopter may replace the repo's parent `sk-code` with their own single skill. | Decision rule present and unambiguous |
| REQ-002 | The guide gives an ordered single→parent procedure using existing tooling (`/create:skill-parent create`, move content into a mode/surface packet, wire `mode-registry.json`, validate), obeying the one-identity invariant. | Copy-pasteable steps, each using a real command |
| REQ-003 | The guide names the concrete adopter cases: `sk-code` (convert-to-parent OR keep-own-single) and `sk-git` (single OR promote), and lists that most other skills are repo-agnostic. | All three cases present |
| REQ-004 | The guide's final step is `validate_skill_package.py` (exit clean) and names the exact failure each step prevents. | Validation step present with named failure modes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The guide is cross-linked from `sk-create-skill/SKILL.md` and `README.md`, and the changelog Upgrade Notes point at it. | Cross-links present in both files + changelog |
| REQ-006 | (Phase 2, deferred) `/create:skill-parent promote <existing-skill>` scaffolds the hub and seeds one workflow-mode packet, never writing a nested `graph-metadata.json`. | Deferred — tracked in tasks.md Phase 2 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 1 guide exists under `sk-create-skill/references/`, satisfies REQ-001–REQ-005, and cites only real commands/flags/paths.
- **SC-002**: `validate_skill_package.py` passes on the sk-doc package after the doc addition.
- **SC-003**: Changelog Upgrade Notes reference the guide (adopter reconciliation of `sk-code`/`sk-git`).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing `/create:skill-parent` command surface | Guide cites a non-existent flag | Verified every command/flag/path before shipping |
| Dependency | sk-doc `leaf-manifest.json` | New leaf fails the hub `parent-skill-check` 10b gate | Refreshed leaf-manifest after adding the reference |
| Risk | Over-migration by adopters | Adopters convert repo-agnostic skills needlessly | Guide explicitly lists the repo-agnostic case |
| Risk | One-identity invariant violated during conversion | Advisor sees two identities | Procedure keeps exactly one hub `graph-metadata.json` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The guide is a static reference doc; no runtime cost.
- **NFR-P02**: Validation completes within the standard `validate_skill_package.py` budget.

### Security
- **NFR-S01**: The guide instructs only; it never mutates an adopter's tree.
- **NFR-S02**: No secrets or credentials referenced.

### Reliability
- **NFR-R01**: Every command/flag/path cited exists in the repo (no invented surface).
- **NFR-R02**: The procedure preserves the one-identity invariant.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Skill with exactly one job**: Guide says keep single — do not promote.
- **Skill with many modes already flattened**: Guide's ordered procedure seeds one mode packet per job.
- **Adopter forked `sk-code`**: Guide covers convert-to-parent OR keep-own-single.

### Error Scenarios
- **Adopter adds a nested `graph-metadata.json`**: `validate_skill_package.py` fails; guide's final step catches it.
- **Missing `mode-registry.json` entry**: Router defers; guide's wiring step prevents it.

### State Transitions
- **Partial conversion**: Resume from the next unwired mode packet; validation gate is idempotent.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should Phase 2's `promote` seed surface packets too, or only workflow-mode packets? **RESOLVED: workflow-mode only for the first cut; surface packets are manual.**
- Is a `promote` command worth building given the doc covers the manual path? **OPEN: deferred until adopter demand is observed.**
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Guide shipped**: `.opencode/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md`
<!-- /ANCHOR:related-docs -->
