---
title: "Implementation Plan: cli-devin quality optimization"
description: "Phase C plan: budget engine + verification pipeline + recipe updates. ~28 hours."
trigger_phrases:
  - "cli-devin quality plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/004-sk-prompt-small-model-optimization/004-budget-and-output-verification"
    last_updated_at: "2026-05-18T14:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 004 plan.md L3"
    next_safe_action: "Author 004 tasks.md"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000014"
      session_id: "114-004-plan-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: cli-devin quality optimization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | TypeScript (post-dispatch-validate.ts) + JSON (assets) + Markdown |
| **Smallcode source** | src/context/budget.ms + src/governor/{verifier,hard_fail}.ms |

### Overview

Ship budget engine + verification pipeline patterns into cli-devin agent-config recipes + reference docs + post-dispatch-validate.ts. Verification OFF by default for backward compat; opt-in per iter via recipe config.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] 002 shipped
- [ ] spec.md + ADRs strict-validate

### Definition of Done

- [ ] per-model-budgets.json validates against any standard JSON Schema
- [ ] truncation marker present in prompt_templates.md §2
- [ ] 3 agent-config recipes have verification opt-in block
- [ ] post-dispatch-validate.ts extended with verification step (unit tested)
- [ ] sk-small-model pattern-index updated with 2 new rows
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Configurable verification pipeline + per-model token budgets. Both patterns are opt-in via agent-config recipe fields. No runtime behavior change unless a recipe explicitly enables.

### Key Components

- per-model-budgets.json (data)
- prompt_templates.md (template embedding truncation syntax)
- agent-config recipes (consumers of budget defaults + verification opt-in)
- confidence-scoring-rubric.md (rubric for verification scoring)
- post-dispatch-validate.ts (runtime verification gate)
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Surface | Path | Type |
|---------|------|------|
| Budget defaults | `cli-devin/assets/per-model-budgets.json` | Create |
| Budget reference | `cli-devin/references/context-budget.md` | Create |
| Verification reference | `cli-devin/references/output-verification.md` | Create |
| Verification rubric | `cli-devin/assets/confidence-scoring-rubric.md` | Create |
| Prompt template | `cli-devin/assets/prompt_templates.md` | Modify |
| 3 agent-configs | `cli-devin/assets/agent-config-*.json` | Modify |
| SKILL.md | `cli-devin/SKILL.md` | Modify |
| Validator | `system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` | Modify |
| Pattern index | `sk-small-model/references/pattern-index.md` | Modify |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Budget Engine (~10 hours)

- Author per-model-budgets.json (5+ models, 4 fields each)
- Author references/context-budget.md (smallcode-derived patterns, integration notes)
- Update prompt_templates.md §2 with truncation marker syntax

### Phase 2: Verification Pipeline (~12 hours)

- Author references/output-verification.md
- Author assets/confidence-scoring-rubric.md
- Extend post-dispatch-validate.ts with verification step
- Unit tests for verification logic

### Phase 3: Recipe Integration (~4 hours)

- Update 3 agent-config recipes with verification opt-in block
- Update cli-devin/SKILL.md §3 with cross-references
- Update sk-small-model/references/pattern-index.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

### Unit (Phase 2)

- Verification step on sample iter produces confidence score in [0,1]
- Confidence below threshold marks iter degraded
- Confidence above threshold passes iter through

### Integration (Phase 3)

- Test iter with verification enabled: degraded marking on hallucinated code
- Test iter with verification disabled: backward compat preserved

### Empirical (Phase 1)

- Truncation marker visible when prompt context > 70% of SWE-1.6 window
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| 002-foundation-routing | Medium | Block start until 002 merged |
| post-dispatch-validate.ts | Medium | Sibling-step pattern; existing function unmodified |
| Token-count tokenizer (for empirical validation) | Low | Use approximate 4-char heuristic; compare against tokenizer for sample prompts |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

### Per-Component

- Disable verification: set recipe field `verification_enabled: false`
- Disable budget engine: revert prompt_templates.md
- Revert post-dispatch-validate.ts changes

### Full Rollback

- git revert packet commit
- Backward compat preserved throughout — no operator action needed
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (budget) ──┐
                   ├─→ Phase 3 (recipes)
Phase 2 (verification) ──┘
```

Phases 1 and 2 can run in parallel. Phase 3 needs both.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Effort |
|-------|--------|
| Phase 1 (budget) | ~10 hours |
| Phase 2 (verification) | ~12 hours |
| Phase 3 (recipes) | ~4 hours |
| **Total** | **~28 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Selective

- Disable verification only (keep budget engine)
- Disable budget engine only (keep verification)
- Revert single recipe only (other 2 stay updated)

### Forward Recovery

- Opt-in design means baseline behavior never changes
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

### Upstream

- 001-research-smallcode §RQ1 + §RQ2 + iter-006 + iter-007
- 002-foundation-routing

### Downstream

- 005-shared-intelligence (consumes per-model-budgets pattern for model-profile registry)
- 006-cross-skill-propagation (cli-opencode mirrors the budget engine)
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Phase 2 (verification pipeline) is the longest. Phase 1 (budget) finishes faster but Phase 3 needs both.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Trigger | Verification |
|-----------|---------|--------------|
| M1: Budget defaults shipped | Phase 1 | per-model-budgets.json present + valid |
| M2: Verification logic ready | Phase 2 | post-dispatch-validate.ts unit tests pass |
| M3: Recipes integrated | Phase 3 | jq audit confirms recipe additions |
| M4: Empirical validation | Phase 3 | truncation marker visible in sample iter |
<!-- /ANCHOR:milestones -->
