---
title: "Implementation Plan: shared model intelligence"
description: "Phase D plan: registry + bayesian + quota-pool-aware fallback. ~20 hours."
trigger_phrases: ["shared intelligence plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/004-sk-prompt-small-model-optimization/005-model-profiles-and-fallback"
    last_updated_at: "2026-05-18T16:58:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented Phase 005 plan"
    next_safe_action: "Review diffs and commit the explicit Phase 005 path list"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000020"
      session_id: "114-005-plan-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Plan: shared model intelligence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | JSON (registry) + Markdown (refs) + minor TS (fallback logic) |
| **Source** | smallcode-master src/model/profiles.ms + src/governor/tool_scorer.ms + bin/escalation.js |

### Overview

Ship unified registry at sk-prompt/assets/ scoped to the user's actual small-model rotation (4 required + 2 optional stubs), bayesian scoring in 3 cli-devin recipes, and a quota-pool-aware fallback engine (NOT a tier escalator). All three opt-in / non-breaking. Effort revised down to ~20 hours after removing frontier-model bloat (was ~26 hr).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] 002 + 004 shipped
- [ ] spec.md L3 strict-validates

### Definition of Done

- [x] Registry validates with 4 required active models + 2 optional stubs
- [x] Bayesian scoring in 3 recipes
- [x] Fallback unit tests cover all 4×4 required {failed_model, target} pairs plus optional adoption paths
- [x] cli-* SKILL.md §3 defer to registry
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Three loosely-coupled features sharing the registry as anchor:

- **Registry** (data): sk-prompt/assets/model-profiles.json
- **Bayesian scoring** (recipe logic): cli-devin agent-config system_instructions blocks
- **Fallback** (reference + recipe logic): cli-devin/references/quota-fallback.md + recipe fallback_chain field
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Surface | Path | Type |
|---------|------|------|
| Registry | `sk-prompt/assets/model-profiles.json` | Create |
| Registry doc | `sk-prompt/references/model-profiles.md` | Create |
| Fallback doc | `cli-devin/references/quota-fallback.md` | Create |
| 3 agent-configs | `cli-devin/assets/agent-config-*.json` | Modify |
| cli-devin SKILL.md | | Modify (§3) |
| cli-opencode SKILL.md | | Modify (§3) |
| sk-prompt quality card | `assets/cli_prompt_quality_card.md` | Modify (cross-ref) |
| Pattern index | `sk-small-model/references/pattern-index.md` | Modify (3 rows) |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Registry (~4 hours)

- Author model-profiles.json (4 required: SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6 + 2 optional empty stubs for Haiku + Gemini Flash with `fallback_target: null`)
- Author references/model-profiles.md (schema + update protocol + Haiku/Flash adoption checklist)
- Update cli-* SKILL.md §3 to defer to registry

### Phase 2: Bayesian Scoring (~8 hours)

- Update 3 cli-devin agent-config recipes with scoring block (Laplace-smoothed)
- Define per-iter scratch-state file format
- Demote logic in system_instructions

### Phase 3: Quota-Pool-Aware Fallback (~6 hours)

- Author cli-devin/references/quota-fallback.md (matrix + adoption checklist)
- Update agent-config recipes with `fallback_chain` field (1-step max)
- Unit tests for SWE-1.6 free exhaustion (expect fail-fast since no Haiku/Flash adopted today)
- Unit test for Cognition Pro pool exhaustion (expect fail-fast across DeepSeek/Kimi/Qwen)
- Adoption test: when Haiku registry entry populated, SWE-1.6 exhaustion routes to Haiku

### Phase 4: Cross-references (~2 hours)

- Update sk-small-model pattern-index (3 rows)
- Update sk-prompt cli_prompt_quality_card.md cross-ref to registry
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

- Unit: bayesian scoring with synthetic success/failure sequences
- Unit: fallback routing — for each {failed_model, fallback_target} pair confirm same-pool fallback REJECTED, different-pool fallback ACCEPTED
- Unit: fail-fast path when fallback_target is null
- Integration: live sample dispatch with verification + scoring + fallback enabled
- Empirical: simulated SWE-1.6 free exhaustion → fail-fast today; route to Haiku if registry stub populated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| 002 + 004 shipped | High | Hard-block; sequencing matters |
| Provider rate-limit health checks | Medium | Build provider-agnostic detector |
| Persistent state | Low | Per-iter ephemeral; no cross-packet state in v1 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

- Disable bayesian scoring: remove block from recipes
- Disable fallback: remove fallback_chain field
- Registry can stay (read-only data; no breaking effect)
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (registry) ──┐
                     ├─→ Phase 3 (fallback needs registry's fallback_target fields)
                     │
Phase 2 (bayesian) ──┘
                     └─→ Phase 4 (cross-refs need 1 + 2 + 3 done)
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Effort |
|-------|--------|
| 1 Registry (4 required + 2 optional stubs) | ~4 hours |
| 2 Bayesian | ~8 hours |
| 3 Quota-pool-aware fallback (was: small→frontier escalation) | ~6 hours |
| 4 Cross-refs | ~2 hours |
| **Total** | **~20 hours** (down from ~26 hr; frontier-tier scope removed) |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- Disable any single feature without touching others
- Registry-only state stays valid if scoring + fallback are removed
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

Upstream: 002, 004, research §RQ3, iter-008. Downstream: 006-cross-skill (consumes registry).
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Phase 3 (fallback) is critical-path — needs Phase 1 (registry) to consume + Phase 2 (bayesian) to trigger on hard-fail.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Trigger | Verification |
|-----------|---------|--------------|
| M1 Registry shipped | Phase 1 | jq audit + 4 required + 2 optional present |
| M2 Bayesian shipped | Phase 2 | scoring block in 3 recipes |
| M3 Fallback shipped | Phase 3 | all pairs unit-tested |
| M4 Cross-refs live | Phase 4 | grep audit |
<!-- /ANCHOR:milestones -->
