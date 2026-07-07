---
title: "Implementation Plan: deep-research reference split and router alignment"
description: "Execution plan for splitting deep-research convergence/state references, slimming hubs, updating navigation, and validating sk-doc router alignment."
trigger_phrases:
  - "deep-research reference split plan"
  - "deep-research router alignment plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/000-release-cleanup/006-deep-research-reference-split"
    last_updated_at: "2026-05-24T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "implementation-complete"
    next_safe_action: "optional-commit"
    blockers: []
    key_files: ["plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000012013"
      session_id: "131-000-012-reference-split"
      parent_session_id: "131-000-012-reference-split"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2 | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: deep-research reference split and router alignment

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | Markdown documentation |
| **Framework** | sk-doc reference quality and smart-router resilience pattern |
| **Target** | `.opencode/skills/deep-research/` |

### Overview

Use the existing YAML workflow and current live docs as source of truth. Split long references into hubs plus focused files, remove deep-review bulk from deep-research, then update `SKILL.md`, `README.md`, and `quick_reference.md` navigation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Operator selected `.opencode/specs/.../012-deep-research-reference-split/`.
- [x] Operator selected split-and-slim.
- [x] Current convergence source of truth identified: deep-research YAML + live `convergence.md`.

### Definition of Done

- [x] Split references created and hubs slimmed.
- [x] SKILL smart router matches sk-doc resilience mechanics.
- [x] README and quick reference navigation updated.
- [x] sk-doc validations and grep checks complete; strict spec validation recorded in `implementation-summary.md`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Approach

Use hub-and-spoke references. The hubs (`convergence.md`, `state_format.md`) carry live contract summaries and route deeper readers to focused files. `SKILL.md` uses the sk-doc resilient-router pattern so resource moves do not break loading.

### Data Flow

```text
convergence.md -> convergence_signals / recovery / graph / reference_only
state_format.md -> state_jsonl / state_outputs / state_reducer_registry
SKILL.md router -> quick_reference + intent-mapped focused references
README.md + quick_reference.md -> operator navigation
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Packet Setup

- Create Level 2 packet docs and metadata.

### Phase 2: Reference Split

- Replace `convergence.md` with a concise hub.
- Add `convergence_signals.md`, `convergence_recovery.md`, `convergence_graph.md`, and `convergence_reference_only.md`.
- Replace `state_format.md` with a concise hub.
- Add `state_jsonl.md`, `state_outputs.md`, and `state_reducer_registry.md`.

### Phase 3: Routing And Navigation

- Rewrite the `SKILL.md` smart router with dynamic discovery, guarded loading, scoring, ambiguity handling, and fallback notices.
- Update `README.md` and `quick_reference.md` to point to the new layout.

### Phase 4: Verification

- Run sk-doc structure extraction and validators.
- Run grep checks for stale weights and review-mode bulk sections.
- Run strict spec validation and update checklist/summary evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool |
|-----------|-------|------|
| Structure extraction | Changed/new deep-research docs | `extract_structure.py` |
| Markdown validation | SKILL, README, references | `validate_document.py --blocking-only` |
| Skill package validation | deep-research skill folder | `quick_validate.py --json` |
| Drift grep | stale weights and review-mode bulk | `rg` |
| Spec validation | phase 012 packet | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Impact |
|------------|--------|--------|
| sk-doc smart-router template | Available | Router alignment source |
| sk-doc validators | Available | Blocking doc validation |
| system-spec-kit strict validator | Available | Packet validation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All edits are documentation-only. Revert changed deep-research docs and remove the new focused references if validation reveals an unsafe contract loss. The new spec folder is additive and can be removed if the packet is abandoned.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 -> Phase 2 -> Phase 3 -> Phase 4
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 2 |
| Phase 2 | Phase 1 | Phase 3 |
| Phase 3 | Phase 2 | Phase 4 |
| Phase 4 | Phase 3 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Packet setup | Low | <1 hour |
| Reference split | Medium | 1-2 hours |
| Router/navigation | Low | <1 hour |
| Verification | Low | <1 hour |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- Changed deep-research docs can be reverted file-by-file.
- New focused references are additive and can be removed as a group.
- Runtime files were not modified, so rollback is documentation-only.
<!-- /ANCHOR:enhanced-rollback -->
