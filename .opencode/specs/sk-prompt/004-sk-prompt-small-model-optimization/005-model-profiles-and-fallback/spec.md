---
title: "Feature Specification: shared model intelligence — registry + bayesian scoring + quota fallback"
description: "Phase D of 114 roadmap. Ship unified model-profile registry (sk-prompt/assets/) + bayesian per-tool scoring in cli-devin recipes + quota-pool-aware fallback."
trigger_phrases:
  - "model profile registry"
  - "bayesian tool scoring"
  - "quota-pool-aware fallback"
  - "small-only fallback"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/004-sk-prompt-small-model-optimization/005-model-profiles-and-fallback"
    last_updated_at: "2026-05-18T16:58:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented Phase 005 shared intelligence scope"
    next_safe_action: "Review diffs and commit the explicit Phase 005 path list"
    blockers: []
    key_files:
      - "../001-research-smallcode/research/research.md"
      - ".opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000019"
      session_id: "114-005-spec-init"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Bayesian tool-scoring state: per-iter scratch (ephemeral) vs persisted across iters?"
      - "Optional separate-pool fallback targets remain unadopted until Haiku or Gemini Flash is verified."
    answered_questions:
      - "Registry location: sk-prompt/assets/model-profiles.json (per research iter-008 verdict)"
      - "Bayesian placement: cli-* iter recipes (per research iter-008 verdict)"
---

# Feature Specification: shared model intelligence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase D of 114 roadmap. Ship three shared-intelligence patterns scoped to the user's actual small-model ecosystem (SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6, optional Haiku + Gemini Flash): (1) unified `model-profiles.json` registry at `sk-prompt/assets/` covering the 4 in-scope models + 2 optional; (2) bayesian per-tool scoring in cli-devin agent-config recipes (Laplace-smoothed, demote tools >50% failure); (3) Quota-aware fallback engine that handles SWE-1.6 free-tier exhaustion + Cognition Pro pool exhaustion (DeepSeek/Kimi/Qwen share one pool) — NOT a small→frontier escalator since the user doesn't run frontier models. Effort: ~20 hours (down from ~26 hr; bloat removed by dropping GLM/gpt-5.5/Opus/Sonnet from scope).

**Bloat-avoidance note (2026-05-18)**: Original plan included 8 models + a small→large escalation chain to gpt-5.5/Opus. User confirmed they only run small models, so registry slimmed to 4 required (SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6) + 2 optional (Haiku, Gemini Flash). The escalation engine was reworked into a quota-aware fallback (between small models with different quota pools), not a tier-escalator.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 (depends on 004 first) |
| **Status** | Implemented |
| **Created** | 2026-05-18 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | 002 + at least one packet from 004 (verification signal needed for fallback triggers) |
| **Successor** | 006-cross-skill-propagation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Today cli-* skills repeat model-selection guidance per skill (cli-devin §3, cli-opencode §3, sk-prompt cli_prompt_quality_card.md). No unified registry, no shared fallback logic. Tool failure tracking is informal — no demotion of consistently-failing tools. On Pro-quota exhaustion operators must remember WHICH model is free-tier (SWE-1.6) vs Pro-shared (DeepSeek/Kimi/Qwen all share the same pool).

### Purpose

Ship a single source-of-truth model registry + bayesian scoring inside cli-devin recipes + quota-pool-aware fallback that consults the registry's quota fields.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- New asset `sk-prompt/assets/model-profiles.json` covering the 4 in-scope small models: SWE-1.6 (Cognition free tier), DeepSeek-v4-pro / Kimi-k2.6 / Qwen3.6 (all share Cognition Pro pool). PLUS 2 optional stubs for Haiku (Anthropic separate quota) and Gemini Flash (Google separate quota) — populated only if/when adopted.
- New reference `sk-prompt/references/model-profiles.md` (schema + update protocol for adding the optional models later)
- Update cli-devin + cli-opencode SKILL.md §3 Model Selection tables to defer to model-profiles.json
- Update 3 cli-devin agent-config recipes (research/review/synthesis) with bayesian scoring block + per-iter tool-score state
- New reference `cli-devin/references/quota-fallback.md` (quota-aware fallback matrix between small models with DIFFERENT quota pools — NOT a tier-escalator to frontier models)
- Update agent-config recipes with fallback triggers (consume model-profiles.json `fallback_target` field; default: fail-fast to operator if no separate-quota target available)
- Update `sk-small-model/references/pattern-index.md` with 3 new rows

### Out of Scope

- Frontier-model entries (Opus, Sonnet, gpt-5.5) — user confirmed not in scope; registry stays small
- GLM-5.1 — dropped per user direction (not in their actual rotation)
- Small→frontier escalation chains — user doesn't run frontier; fail-fast to operator instead
- Persisting bayesian state across packets (per-iter scratch state only; cross-packet persistence is future work)
- Auto-updating model-profiles.json on new model launches (manual update process documented)

### Files to Change

| Path | Change |
|------|--------|
| `sk-prompt/assets/model-profiles.json` | Create |
| `sk-prompt/references/model-profiles.md` | Create |
| `cli-devin/references/quota-fallback.md` | Create |
| `cli-devin/assets/agent-config-*.json` (×3) | Modify |
| `cli-devin/SKILL.md` | Modify (§3 cross-ref) |
| `cli-opencode/SKILL.md` | Modify (§3 cross-ref) |
| `sk-prompt/assets/cli_prompt_quality_card.md` | Modify (cross-ref) |
| `sk-small-model/references/pattern-index.md` | Modify (3 rows) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | model-profiles.json covers the 4 in-scope models (SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6) with fields {id, provider, context_length, tool_calling, chat_template, strengths, weaknesses, free_tier, pro_tier_share_pool, fallback_target, avg_iter_wall_clock_min}. Optional stubs for Haiku + Gemini Flash (with fields=null if not adopted). | jq audit shows 4 required + 2 optional entries |
| REQ-002 | Bayesian scoring block in 3 agent-config recipes; uses Laplace smoothing (success+1)/(total+2); demote at >50% failure on 3+ calls | jq audit + sample iter test |
| REQ-003 | Quota-aware fallback engine consumes model-profiles.json; on hard-fail picks a fallback only if the target has a DIFFERENT quota pool (e.g. SWE-1.6 free → Haiku separate, NOT DeepSeek/Kimi/Qwen since they share the Pro pool). If no different-pool fallback available, fail-fast to operator. | Unit test simulating SWE-1.6 exhaustion + Pro pool exhaustion |
| REQ-004 | cli-devin + cli-opencode SKILL.md §3 defer to model-profiles.json as source-of-truth | grep audit |

### P1

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-005 | sk-small-model pattern-index has 3 new rows (model-profiles + tool-scoring + fallback) | grep audit |
| REQ-006 | Per-iter tool-score state persisted in research/agent-state/iter-NNN.json (ephemeral; cleaned on packet completion) | file present after iter; absent after packet done |
| REQ-007 | Reference doc explains schema + update protocol + fallback matrix | manual review |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Simulated SWE-1.6 free-tier exhaustion → if Haiku/Gemini-Flash adopted, fallback to one of them (separate quota pool); else fail-fast to operator with clear message naming the exhaustion
- **SC-002**: Simulated Pro pool exhaustion (DeepSeek/Kimi/Qwen all fail) → fail-fast to operator (no silent fallback to a same-pool sibling)
- **SC-003**: Tool with >50% failure on 3+ calls in one iter is demoted in the next iter's tool list
- **SC-004**: All 4 required + 2 optional model entries in model-profiles.json validate against schema
- **SC-005**: cli-* SKILL.md §3 tables reference model-profiles.json; manual content removed
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fallback logic picks a same-pool target (e.g. DeepSeek when SWE-1.6 free out, while Pro pool also constrained) | Pro pool burn cascades | Unit test every {failed_model, fallback_target} pair; pool-membership-aware logic |
| Risk | No separate-pool fallback available (user hasn't adopted Haiku/Gemini-Flash) | Loops fail more often without auto-recovery | Fail-fast to operator with clear message; user opts in to Haiku or Flash if they want auto-fallback |
| Risk | Bayesian state corruption between iters | Tool list drifts incorrectly | Per-iter state in scratch file; reset between packets |
| Risk | model-profiles.json gets stale on new model launch | Manual update process | Reference doc has explicit update checklist |
| Dependency | 002 + 004 shipped | model-profiles.json migrates content from 004's per-model-budgets.json | Block 005 start until 004 ships |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Registry lookup <5ms per dispatch
- **NFR-P02**: Bayesian scoring overhead <10ms per tool-call

### Maintainability

- **NFR-M01**: Schema versioned (`version: "1.0"`)
- **NFR-M02**: Reference doc explains how to add a new model without breaking existing dispatches
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- SWE-1.6 free exhausted, no Haiku/Flash adopted: fail-fast to operator (no auto-fallback path exists)
- Both SWE-1.6 free + Cognition Pro pool exhausted: fail-fast to operator (no silent fallback within same quota universe)
- Provider rate-limit error vs hard-fail: distinguish in fallback logic; retry-with-backoff on rate-limit before considering fallback
- Tool scoring with single failure: don't demote on 1-of-1; need ≥3 calls for statistically meaningful score
- Haiku/Gemini-Flash adopted post-implementation: registry has optional stubs ready; reference doc explains how to populate without re-shipping the packet
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | 3 features (registry + scoring + fallback) |
| Risk | 17/25 | Fallback rules brittle across providers |
| Research | 8/20 | Done in 001 iter-008 |
| Coordination | 16/25 | Touches sk-prompt + cli-devin + cli-opencode |
| Reversibility | 11/15 | Each feature independently disable-able |
| **Total** | **69/110** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| ID | Description | Likelihood | Impact | Mitigation | Owner |
|----|-------------|-----------|--------|------------|-------|
| R-001 | Fallback picks wrong target | M | H | Unit tests per pair | impl |
| R-002 | Pro-pool exhaustion misdetected | M | M | Provider-specific health checks | impl |
| R-003 | model-profiles.json stale | H | L | Explicit update protocol in ref doc | docs |
| R-004 | Bayesian state corruption | L | M | Per-iter ephemeral state | impl |
| R-005 | Cross-skill cross-ref drift | M | L | Single source-of-truth in sk-prompt/assets/ | reviewer |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

- **US-001 — As an operator using only small models**, I want SWE-1.6 free-tier exhaustion to fall back to a separate-quota target (Haiku/Flash if adopted, else fail-fast) — NOT to a same-Pro-pool model that would just burn more shared quota.
- **US-002 — As a cli-devin user**, I want consistently-failing tools demoted in subsequent iters so the model stops wasting tool calls.
- **US-003 — As a sk-prompt maintainer**, I want one source-of-truth for per-model facts so cli-* docs stay in sync.
- **US-004 — As someone considering Haiku or Gemini Flash later**, I want the registry to have ready-to-populate optional stubs so adoption doesn't require re-shipping this packet.
- **US-005 — As an operator**, I want the fail-fast message to clearly name which quota pool exhausted (Cognition Pro, Cognition free, etc.) so I know which provider to top up or wait on.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Bayesian state persistence: per-iter ephemeral or cross-packet aggregated? Start ephemeral, add aggregation later if needed.
- Fallback chains: cap depth (don't fall back forever)? Set to 1 level max (one separate-pool fallback, else fail-fast).
- Provider rate-limit handling: distinct from hard-fail? Yes, retry-with-backoff before considering fallback.
- Should we ship empty Haiku/Flash stubs in the registry now or wait? Recommendation: ship empty stubs so adopters can fill in 1 PR without packet ceremony.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase parent**: `../spec.md`
- **Predecessor**: `../002-foundation-routing/spec.md`, `../004-cli-devin-quality/spec.md` (must ship first)
- **Research**: `../001-research-smallcode/research/research.md` §RQ3 + iter-008
- **Sibling docs**: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md
