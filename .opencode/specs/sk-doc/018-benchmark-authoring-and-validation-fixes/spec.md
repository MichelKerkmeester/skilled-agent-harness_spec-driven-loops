---
title: "Feature Specification: Benchmark Authoring and Validation Fixes"
description: "Make sk-doc/create-benchmark the single home for benchmark-document authoring across all repo benchmark families, then harden it through path, documentation, routing, runtime-alignment, registry-gate, and design-command validation fixes. Run and scoring logic stays owned by the deep-loop lanes."
trigger_phrases:
  - "benchmark authoring centralization"
  - "create-benchmark single home"
  - "benchmark validation fixes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-benchmark-authoring-and-validation-fixes"
    last_updated_at: "2026-07-20T09:23:08Z"
    last_updated_by: "claude-code"
    recent_action: "Lean phase parent; centralization is child 000, fixes are children 001-006"
    next_safe_action: "Resume a child phase folder or run recursive validation"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Benchmark Authoring and Validation Fixes

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-12 |
| **Track** | sk-doc |
| **Predecessor** | None |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Benchmark-document authoring standards and templates lived scattered inside the `system-deep-loop/deep-improvement/` lanes, duplicated per family, with no single home. After centralization, the create-benchmark resources still carried path, documentation, routing, runtime-contract, registry-gate, and design-command validation drift that had to be closed before the packet could be trusted.

### Purpose
Make `create-benchmark` the single home for benchmark-document creation across all families, and keep it correct: authored resources, routing vocabulary, runtime contracts, registry checks, and design-command validation all stay aligned. Run and scoring logic remains owned by the deep-loop lanes.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The single-home centralization of benchmark-document templates, guides, and authoring standards in create-benchmark (child 000).
- Follow-on resource grouping and routing vocabulary, authoring-guide completion and cross-links, path/documentation/routing repair, runtime-contract alignment, registry-gate checks, and design-command validation fixes (children 001-006).

### Out of Scope
- Deep-loop run and scoring logic, scorers, runners, and scoring contracts (cross-linked, never moved out of the lanes).
- The Lane C skill-benchmark report `.md`, which is a renderer-owned anti-drift build and is never templated.
- `system-deep-loop/deep-alignment/**`, a live concurrent workstream.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This packet is a phase parent. Each child phase is an independently executable child spec folder; all implementation detail (plan, tasks, checklist, decisions, continuity) lives inside the children. Run `validate.sh --recursive` on this parent to validate the set.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 000 | `000-benchmark-authoring-centralization/` | Make create-benchmark the single home for benchmark-document templates, guides, and the family-disambiguation table; rewire deep-improvement consumers pointer-only | Complete |
| 001 | `001-organize-benchmark-resources-and-routing/` | Group create-benchmark resources into per-family subfolders and add durable behavior/skill/model/fixture routing vocabulary | Complete |
| 002 | `002-complete-benchmark-guides-and-links/` | Author the Lane A guide, complete the create-benchmark ↔ deep-loop cross-links, and land the fixtureDir/metadata/sibling corrections | Complete |
| 003 | `003-fix-benchmark-paths-docs-and-routing/` | Fix benchmark resource paths, authoring docs, and routing drift found by the create-benchmark audit | Complete |
| 004 | `004-align-benchmark-docs-and-runtime/` | Align benchmark documentation, templates, and runtime contracts | Complete |
| 005 | `005-enable-registry-checks-and-repair-tests/` | Enable registry-gate checks and repair relocated CLI benchmark tests | Complete |
| 006 | `006-fix-design-command-validation/` | Fix design-command choreography validation, fixtures, and tests | Complete |

### Phase Transition Rules

- Each child phase MUST pass `validate.sh --strict` independently.
- This parent spec tracks aggregate progress via the map above.
- Use `/speckit:resume` on a specific `NNN-phase/` child to resume it.
- Run `validate.sh --recursive` on this parent to validate all phases as an integrated unit.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None. Whether to CI-wire `package_skill.py --check` is a documented optional follow-up, not in scope.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Graph Metadata**: See `graph-metadata.json` for the `derived.last_active_child_id` pointer.
