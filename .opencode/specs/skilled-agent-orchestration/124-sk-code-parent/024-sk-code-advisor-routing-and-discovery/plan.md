---
title: "Implementation Plan: sk-code advisor-routing discovery + Lane-C D3 proxy fix"
description: "Retrospective Level 2 plan for the sk-code-local routing discovery increment, D3 empty-gold scoring fix, stale parent-hub schema doc refresh, playbook expected-asset repairs, and benchmark report regeneration shipped in commit ec014f95c6."
trigger_phrases:
  - "phase 24 plan"
  - "sk-code advisor routing discovery plan"
  - "Lane-C D3 proxy plan"
importance_tier: "high"
contextType: "implementation"
status: "Complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/024-sk-code-advisor-routing-and-discovery"
    last_updated_at: "2026-07-06T12:00:00.000Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Retrospective plan recorded for shipped commit ec014f95c6"
    next_safe_action: "None; implementation packet is shipped and pushed"
---
# Implementation Plan: sk-code advisor-routing discovery + Lane-C D3 proxy fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill references, JavaScript benchmark scripts, markdown playbooks, benchmark report artifacts |
| **Framework** | sk-code surface-primary parent hub, smart-routing INTENT_SIGNALS/RESOURCE_MAP, deep-loop skill-benchmark router replay and scoring, sk-doc parent-hub schema documentation |
| **Storage** | Repository filesystem: `.opencode/skills/sk-code/`, `.opencode/skills/deep-loop-workflows/`, `.opencode/skills/sk-doc/`, benchmark folders, and manual testing playbooks |
| **Testing** | sk-code parent-skill-check STRICT, vocab-sync, router drift-guards, skill-benchmark vitest suite, markdown link checks, JSON example parsing, benchmark delta reports |

### Overview
This phase completed the sk-code-local, advisor-scorer-independent Layer 1 routing increment in commit `ec014f95c6`. It fixed discovery gaps by adding CWV and accessibility vocabulary to existing smart-routing resource maps, constrained short CWV acronyms to word-boundary matching in router replay, changed D3 efficiency scoring so empty positive-resource gold is not applicable instead of zero, refreshed the stale sk-code parent-hub schema example, repaired dead expected-asset paths in two cross-stack playbooks, and regenerated benchmark reports without overwriting frozen baselines.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 024 scope was bounded to sk-code-local, advisor-scorer-independent changes shipped in commit `ec014f95c6`.
- [x] Root cause was identified: missing keyword coverage for existing RESOURCE_MAP references, not missing reference paths.
- [x] D3 scoring issue was identified: scenarios with no positive-resource gold were treated as waste instead of not-applicable.
- [x] Downstream advisor-scorer and projection-vocabulary work was explicitly excluded from this packet.

### Definition of Done
- [x] `smart_routing.md` fires PERFORMANCE for CWV vocabulary and ACCESSIBILITY for reduced-motion/a11y vocabulary.
- [x] Router replay treats `lcp`, `inp`, and `cls` as word-boundary keywords.
- [x] D3 returns null/not-applicable for empty positive-resource gold and mode A excludes null D3 from weighted normalization.
- [x] Parent-hub router schema docs match the current sk-code four-mode surface-primary model and allow `defaultMode: null`.
- [x] Two cross-stack playbooks point expected assets to real on-disk homes.
- [x] Benchmarks record sk-code 71 to 84 PASS, sk-design 69 to 100, and deep-loop-workflows 71 to 100.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Local router-discovery and benchmark-scoring correction: fix intent firing at the sk-code smart-routing layer, keep replay keyword matching deterministic for short acronyms, and adjust benchmark scoring so missing positive-resource gold removes D3 from the denominator rather than fabricating waste.

### Key Components
- **Smart routing resource map**: `sk-code/shared/references/smart_routing.md` owns the CWV PERFORMANCE vocabulary, ACCESSIBILITY intent, and MOTION_DEV cross-listing.
- **Router replay keyword matching**: `router-replay.cjs` owns word-boundary matching for short CWV acronyms.
- **D3 scoring**: `score-skill-benchmark.cjs` owns null/not-applicable D3, mode A weighted normalization, recipe-cap blocking, and diagnostic average guarding.
- **Schema documentation**: `sk-doc/references/skill_creation/parent_hub_router_schema.md` documents the current sk-code surface-primary two-axis model.
- **Playbook and benchmark artifacts**: the two cross-stack playbooks and regenerated benchmark folders carry verification evidence for the shipped effect.

### Data Flow
Prompt text enters smart routing through intent keywords. CWV vocabulary now triggers PERFORMANCE and accessibility vocabulary triggers ACCESSIBILITY, both mapping to existing resources. Router replay uses word-boundary matching for short acronyms before scoring benchmark scenarios. During scoring, scenarios with positive-resource gold compute D3 normally; scenarios with no positive-resource gold produce null D3, and mode A normalizes the weighted score without that dimension. Benchmark artifacts then record the resulting aggregate and dimension deltas.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Readiness and Baseline Inventory
- [x] Confirm phase-024 scope as sk-code-local and advisor-scorer-independent.
- [x] Confirm every reference needed by the failing discovery scenarios already existed in RESOURCE_MAP.
- [x] Identify missing PERFORMANCE vocabulary for CWV acronyms and phrases.
- [x] Identify missing ACCESSIBILITY vocabulary for reduced-motion and a11y prompts.

### Phase 2: Fresh Benchmark Packages
- [x] Add CWV vocabulary to PERFORMANCE in `smart_routing.md`.
- [x] Add ACCESSIBILITY intent in `smart_routing.md` and map it to existing Webflow animation and verification references.
- [x] Cross-list `animation/performance_and_pitfalls.md` into MOTION_DEV.
- [x] Add `lcp`, `inp`, and `cls` to router replay word-boundary keywords.

### Phase 3: Validator Promotion
- [x] Update D3 scoring to return null/not-applicable for scenarios with no positive-resource gold.
- [x] Update mode A weighted normalization to exclude null D3.
- [x] Guard recipe-cap blocking and D3 diagnostic averages against null.
- [x] Refresh the sk-doc parent-hub router schema worked example to the four-mode surface-primary two-axis sk-code model.
- [x] Verify all six JSON examples in the refreshed schema doc parse.

### Phase 4: Parent Rollup and Optional Catalogs
- [x] Repair dead expected-asset paths in `cwv-gates-animation-heavy.md` and `prefers-reduced-motion.md`.
- [x] Regenerate `sk-code/benchmark/router-final` as the current/regenerable benchmark folder.
- [x] Write `sk-design/benchmark/after-d3-proxy` as a sibling report instead of overwriting frozen `baseline/`.
- [x] Write `deep-loop-workflows/benchmark/after-d3-proxy` as a sibling report instead of overwriting frozen `baseline/`.
- [x] Record downstream scorer and projection-vocabulary work as out of scope.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Parent hub invariants | sk-code parent hub strict shape | sk-code parent-skill-check STRICT |
| Vocabulary drift | sk-code routing vocabulary | vocab-sync with sk-code `hub-router.json` unchanged |
| Router drift | sk-code router and surface slice guards | `sk-code-router-sync` and surface-slice-sync drift guards |
| Benchmark suite | Skill benchmark harness | skill-benchmark vitest suite |
| Link integrity | Four changed docs | markdown-links on changed docs |
| Schema examples | Refreshed parent-hub schema doc | JSON parsing for all six examples |
| Benchmark deltas | sk-code, sk-design, deep-loop-workflows | regenerated benchmark reports |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing sk-code RESOURCE_MAP references | Internal | Available | Discovery fix would require new resource paths instead of keyword coverage |
| Router replay keyword classifier | Internal | Updated in scope | Short CWV acronyms could substring-match unrelated words |
| Skill benchmark scorer | Internal | Updated in scope | Empty positive-resource gold would continue to score spurious D3 zero |
| Benchmark README artifact conventions | Internal | Available | Frozen `baseline/` directories could be overwritten incorrectly |
| Advisor TypeScript scorer lane | External | Gated downstream | Shared advisor-scorer root fixes stay deferred to a separate packet |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: sk-code discovery benchmark regresses, router drift guards fail, D3 null handling misnormalizes scores, schema examples fail to parse, markdown links break, or benchmark artifacts overwrite frozen baselines.
- **Procedure**: Revert commit `ec014f95c6`, restore the affected smart-routing, router replay, scoring, schema doc, playbook, and benchmark artifact paths from the previous branch tip, then re-run parent-skill-check STRICT, vocab-sync, router drift-guards, skill-benchmark vitests, markdown-links, schema JSON parsing, and benchmark report generation before attempting a smaller patch.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Readiness and Baseline Inventory | Existing RESOURCE_MAP and benchmark failure evidence | Smart-routing and replay edits |
| Fresh Benchmark Packages | Confirmed vocabulary gaps and acronym boundary issue | D3 scoring and schema doc promotion |
| Validator Promotion | Updated router replay and scoring logic | Playbook path repairs and benchmark reports |
| Parent Rollup and Optional Catalogs | Green local gates and README artifact conventions | Retrospective close-out documentation |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Readiness and Baseline Inventory | Medium | Root-cause work crossed smart-routing, benchmark gold, and scoring semantics |
| Fresh Benchmark Packages | Medium | Vocabulary additions were local but needed deterministic acronym handling |
| Validator Promotion | High | D3 normalization affected aggregate benchmark interpretation across skills |
| Parent Rollup and Optional Catalogs | Medium | Benchmark artifact conventions required preserving frozen baselines through sibling folders |
| **Total** | | **Medium sk-code-local routing and benchmark-scoring increment** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirm discovery root cause was keyword coverage, not missing RESOURCE_MAP paths.
- [x] Confirm D3 empty positive-resource gold should be not-applicable rather than zero.
- [x] Confirm sk-design and deep-loop-workflows `baseline/` directories are frozen comparison anchors.

### Rollback Procedure
1. Revert commit `ec014f95c6`.
2. Restore smart-routing vocabulary, router replay keyword matching, D3 scoring, schema documentation, playbook expected assets, and benchmark artifacts from the previous branch tip.
3. Remove sibling `after-d3-proxy/` reports if reverting the D3 proxy fix.
4. Re-run parent-skill-check STRICT, vocab-sync, router drift-guards, skill-benchmark vitests, markdown-links, schema JSON parsing, and benchmark generation before re-promotion.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Filesystem-only revert of markdown references, JavaScript benchmark scripts, playbook expected paths, and benchmark artifact folders; no persisted data migration is involved.

<!-- /ANCHOR:enhanced-rollback -->
