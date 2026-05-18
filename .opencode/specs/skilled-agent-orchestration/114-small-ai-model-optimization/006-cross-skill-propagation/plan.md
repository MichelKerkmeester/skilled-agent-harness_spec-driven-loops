---
title: "Implementation Plan: cross-skill propagation"
description: "Phase E plan: propagate budget patterns to cli-opencode + sk-prompt. ~6 hours."
trigger_phrases: ["cross-skill propagation plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization/006-cross-skill-propagation"
    last_updated_at: "2026-05-18T15:02:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 006 plan.md L2"
    next_safe_action: "Author 006 tasks.md"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000026"
      session_id: "114-006-plan-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: cross-skill propagation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | Pure markdown |
| **No runtime** | Doc-only changes |

### Overview

Mirror Phase C's budget reference + truncation marker pattern to cli-opencode and sk-prompt. Sentinel pattern-index updated with 2 new rows.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 004 shipped (Phase C reference docs exist)
- [ ] spec.md L2 validates

### Definition of Done
- [ ] cli-opencode/references/context-budget.md exists
- [ ] sk-prompt cli_prompt_quality_card.md has "Budget Awareness" subsection
- [ ] sk-small-model pattern-index has 2 new rows
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Pattern: cross-reference + minimal mirror. Don't duplicate; point at canonical Phase C source. Sentinel-style pointer docs (<200 LOC each).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Path | Type |
|------|------|
| `cli-opencode/references/context-budget.md` | Create |
| `sk-prompt/assets/cli_prompt_quality_card.md` | Modify |
| `cli-opencode/assets/prompt_templates.md` | Modify (if exists) |
| `sk-small-model/references/pattern-index.md` | Modify (2 rows) |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: cli-opencode mirror (~2 hours)

- Create cli-opencode/references/context-budget.md (sentinel doc pointing at cli-devin canonical)
- If cli-opencode/assets/prompt_templates.md exists, add truncation marker syntax

### Phase 2: sk-prompt update (~2 hours)

- Update sk-prompt/assets/cli_prompt_quality_card.md §3 with "Budget Awareness" subsection

### Phase 3: Cross-references (~1 hour)

- Update sk-small-model/references/pattern-index.md with 2 new rows
- Smoke-test that cross-references resolve correctly
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

- Manual: read each new/modified doc; verify cross-references resolve
- Smoke: dispatch cli-opencode with sample prompt; check that truncation marker appears (manual visual inspection)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| 004 shipped | High | Block start; Phase C source must exist |
| cli-opencode/assets/prompt_templates.md exists | Low | Conditional task; skip if absent |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

git revert; pure docs change, no behavior to roll back.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 ──┐
          ├─→ Phase 3
Phase 2 ──┘
```

Phases 1+2 parallel; Phase 3 needs both done.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Effort |
|-------|--------|
| 1 cli-opencode mirror | ~2 hours |
| 2 sk-prompt update | ~2 hours |
| 3 cross-refs | ~1 hour |
| **Total** | **~5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- Revert any single file independently
- No state corruption possible
<!-- /ANCHOR:enhanced-rollback -->
