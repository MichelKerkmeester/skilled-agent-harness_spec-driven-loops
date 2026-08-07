---
title: "Implementation Plan: deep-ai-council deep-mode docs + script tests (001)"
description: "Execution plan to close the five deferred 004 phase-5 follow-ons: two new references, a graph_support cross-link, DAC-001 narrative reconciliation, and vitest coverage for five scripts."
trigger_phrases:
  - "deep-ai-council follow-on plan"
  - "deep-mode docs plan"
  - "findings-registry reference plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/001-release-cleanup/012-deep-ai-council-deep-mode-docs-and-tests"
    last_updated_at: "2026-05-24T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-plan-authored"
    next_safe_action: "author-tasks-checklist-then-execute"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000011002"
      session_id: "131-000-011-followon"
      parent_session_id: "131-000-011-followon"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2 | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: deep-ai-council deep-mode docs + script tests

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | Markdown (sk-doc references), TypeScript (vitest) |
| **Framework** | sk-doc `skill_reference_template.md` + HVR; vitest (matching the 4 existing test files) |
| **Target** | `.opencode/skills/deep-ai-council/` (v2.1.0.0 → v2.1.1.0) |

### Overview

Read the deep-mode scripts and document them accurately, then add tests. Doc items (F-002/F-003/F-004 + DAC-001) are native authoring; the 5 vitest files (F-006) match the existing test harness. No existing `.cjs` logic changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 5 deferred items scoped from 004 convergence-summary
- [x] Source scripts identified for each item
- [x] Operator approved scope (all 5) + mode (plan + execute)

### Definition of Done
- [ ] All 5 items resolved
- [ ] Strict validate 0/0; sk-doc package valid; HVR ≥85 on new refs
- [ ] 5 vitest files present + syntax-clean; existing scripts unchanged
- [ ] New refs wired into SKILL §3/§6 + README §9; changelog v2.1.1.0 authored
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Approach

Documentation-first per item, sourced from the scripts (cite file:line). Tests mirror the existing `scripts/tests/*.vitest.ts` import/style so they run under the same harness. Smart Router §3 gets RESOURCE_MAP additions only (no pseudocode change).

### Data Flow

```
004 convergence-summary (F-002/003/004/006 + DAC-001)
  ├─ F-002 → references/deep_mode.md (new)
  ├─ F-003 → references/findings_registry.md (new)
  ├─ F-004 → references/graph_support.md (edit: replay cross-link)
  ├─ DAC-001 → feature_catalog/01-- + playbook/01-- (narrative reconcile)
  └─ F-006 → scripts/tests/*.vitest.ts (5 new)
        ↓
  SKILL §3/§6 + README §9 wire new refs → changelog v2.1.1.0 → validate
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Action | Verification |
|---------|--------|--------------|
| `references/deep_mode.md` (new) | Create | template diff + HVR |
| `references/findings_registry.md` (new) | Create | template diff + HVR |
| `references/graph_support.md` | Edit (replay xref) | grep replay ref present |
| `feature_catalog/01--` + `playbook/01--` | Edit (narrative) | no `deep-ai-council`-file-identity claims |
| `scripts/tests/*.vitest.ts` (5 new) | Create | `node -c` + vitest run |
| `SKILL.md` §3/§6, `README.md` §9 | Edit (wire refs) | grep both refs |
| `changelog/v2.1.1.0.md` (new) | Create | schema + convention |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Author packet docs + strict-validate.

### Phase 2: Implementation
- [ ] Read deep-mode scripts (orchestrate-session/topic, findings-registry, replay-graph, persist-artifacts, rollback, audit-trail, advise-council-completion).
- [ ] F-002: author `references/deep_mode.md`.
- [ ] F-003: author `references/findings_registry.md`.
- [ ] F-004: edit `references/graph_support.md` (replay cross-link).
- [ ] DAC-001: reconcile `01--runtime-routing-and-rename` catalog + playbook narrative.
- [ ] F-006: author 5 vitest files.
- [ ] Wire new refs into SKILL §3/§6 + README §9.
- [ ] Author `changelog/v2.1.1.0.md`; bump SKILL version 2.1.0.0 → 2.1.1.0.

### Phase 3: Verification
- [ ] Strict validate 0/0; sk-doc package valid; HVR scan on new refs.
- [ ] `node -c` on test files; run vitest (or document skip).
- [ ] Advisor parity (deep-ai-council at 0.8).
- [ ] Fill implementation-summary.md; present for commit.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool |
|-----------|-------|------|
| Spec-folder strict validate | After authoring + at end | `validate.sh --strict` |
| sk-doc package | After ref additions | `quick_validate.py` |
| HVR | New references | manual rubric per `hvr_rules.md` |
| Script tests | 5 new vitest | `node -c` + `vitest run` |
| Advisor parity | End | `skill_advisor.py ... --threshold 0.8` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Impact if blocked |
|------------|--------|-------------------|
| `skill_reference_template.md` + `hvr_rules.md` | Green | Reference authoring |
| vitest harness (matches existing tests) | Verify | F-006 tests may be authored-but-not-run |
| `validate.sh` / `quick_validate.py` | Green | Phase exits |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a new reference or test introduces an error, or the DAC-001 edit misreads the rename history.
- **Procedure**: `git checkout HEAD -- <file>` for any regressed doc/test; new files can be deleted. The spec folder is additive and can be removed wholesale if abandoned.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (refs + edits + tests + wiring) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 2, 3 |
| Phase 2 | Phase 1 | Phase 3 |
| Phase 3 | Phase 2 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (Setup) | Low | <1 hour |
| Phase 2 (Implementation) | Med | 2-3 hours (2 refs + edits + 5 tests) |
| Phase 3 (Verification) | Low | <1 hour |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- All work on `main` (no feature branch).
- New files (`deep_mode.md`, `findings_registry.md`, 5 test files, `v2.1.1.0.md`) are additive and deletable without affecting the skill.
- Edits (`graph_support.md`, DAC-001 catalog/playbook, SKILL/README) revert via `git checkout HEAD -- <file>`.
<!-- /ANCHOR:enhanced-rollback -->
