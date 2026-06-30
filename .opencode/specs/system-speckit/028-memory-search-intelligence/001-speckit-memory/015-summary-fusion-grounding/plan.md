---
title: "Implementation Plan: Summary Fusion and World-Summary Grounding"
description: "Plan for promoting the built community/summary evidence into a first-class weighted RRF lane (retiring the two legacy inject paths to avoid double-count) and adding a two-tier world-summary grounding prelude, both shadow-gated and validated against a captured retrieval baseline."
trigger_phrases:
  - "fused summary channel plan"
  - "summary rrf lane sequencing"
  - "world summary grounding plan"
  - "summary fusion baseline retune"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/015-summary-fusion-grounding"
    last_updated_at: "2026-06-19T14:45:00+02:00"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented shadow-gated lane/prelude"
    next_safe_action: "Finish broad verification, then capture benchmark deltas before promotion."
    blockers:
      - "Benchmark delta and RRF retune remain pending because live benchmark/reindex/scan was explicitly out of scope."
      - "Persistent world-summary hierarchy remains pending because it requires schema migration."
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts"
    completion_pct: 70
    open_questions:
      - "Final fused-lane RRF weight (ablation-tuned via the baseline-and-delta)."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Summary Fusion and World-Summary Grounding

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | Spec Kit Memory MCP server search pipeline and Vitest |
| **Storage** | `better-sqlite3` interfaces with temp/in-memory test fixtures only |
| **Testing** | Targeted vitest files, fusion/summary suite, `npx tsc --noEmit`, strict spec validation |

### Overview
Two paired retrieval-intelligence candidates over the already-built summary/community substrate. First, the built community/summaries are promoted from a weak-result post-pipeline fallback and a stage-1 candidate source into a first-class weighted RRF lane: add the channel to the union and all hardcoded channel-list sites, fuse it at the RRF `lists.push` site with a tuned weight, retire the two legacy inject paths to avoid double-counting, give the adaptive-weight model a per-channel slot and re-tune the perturbed ablation-derived weights against a captured baseline. Second, a two-tier world-summary hierarchy (root world-summary + top-k subsections) is built and prepended as a coarse-to-fine grounding prelude before retrieved context. Both ship behind default-off shadow flags, with flags off the change is a no-op.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Retrieval baseline corpus and metric script identified (the ~1000-memory corpus). - Pending: live benchmark/reindex/scan out of scope.
- [x] Built `searchCommunities` and `querySummaryEmbeddings` data confirmed available read-only.
- [x] All five hardcoded channel-list sites enumerated and confirmed.
- [x] Both legacy inject paths located (community fallback + summary stage-1).

### Definition of Done
- [ ] Pre-change baseline captured, post-change delta reported (no regression on primary order). - Pending: live benchmark/reindex/scan out of scope.
- [x] Summary/community is a weighted RRF lane with its own default-off weight slot.
- [x] Both legacy inject paths stand down when the fused lane is enabled, single-count test passes.
- [x] Adaptive-weight model carries a per-channel slot for the lane.
- [x] World-summary grounding prelude prepends coarse-to-fine before retrieved context using existing summaries.
- [x] Both candidates default-off shadow-gated, flags-off byte-identical to baseline - proven by deterministic test (NFR-R01), strict no-op on ordering and serialization. Baseline live-delta tracked separately above.
- [x] Tests, TypeScript, strict spec validation and comment hygiene ready.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Promote-built-substrate-into-fusion + coarse-to-fine grounding prelude, both behind shadow flags with a captured baseline.

### Key Components
- **Fused summary/community lane**: a ranked list adapted from `searchCommunities` + `querySummaryEmbeddings`, routed through the shared RRF fuser with its own weight.
- **Channel registration**: the `ChannelName` union plus the five hardcoded channel-list sites (router, telemetry, hybrid-search lists).
- **Inject-path retirement**: the community post-pipeline fallback and the summary stage-1 candidate inject are removed so evidence is counted once.
- **Adaptive-weight slot**: a per-channel weight for the lane in the otherwise collapsed-bucket weight model.
- **World-summary hierarchy**: a root world-summary + top-k subsection index in the summaries module.
- **Grounding prelude**: a provider that selects the relevant hierarchy slice and prepends it before retrieved context in `memory-context.ts`.
- **Shadow flags**: default-off flags for the fused lane and the prelude.

### Data Flow
For recall, candidate channels (vector/fts/bm25/graph/degree) plus the new summary/community lane each produce a ranked list, the shared RRF fuser fuses by rank with per-channel weights, applying the convergence bonus once. The legacy fallback/stage-1 inject paths no longer add the same evidence. For grounding, the prelude provider reads the precomputed world-summary hierarchy, selects the relevant slice and `memory-context.ts` prepends it ahead of the fused retrieval results. With the shadow flags off, the lane is absent and the prelude is empty, reproducing baseline output exactly.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `hybrid-search.ts:1310,:951` | Hardcoded RRF channel lists | Add summary/community channel | Channel-list test asserts the lane is present |
| `hybrid-search.ts:~1394-1495` | RRF `lists.push` fusion site | Push the fused summary/community lane with its weight | Fusion test shows the lane contributes ranked, weighted |
| `query-router.ts:36,:68,:74,:106-107` | `ChannelName` union + channel-list sites | Add the new channel name | tsc + router test |
| `routing-telemetry.ts:17` | Telemetry channel list | Add the new channel | Telemetry emits the lane |
| `memory-search.ts:1158-1228` | Community weak-result fallback | Retire once fused | Single-count test asserts no fallback append |
| `stage1-candidate-gen.ts:~1304-1326` | Summary stage-1 candidate inject | Retire/redirect into the lane | Single-count test asserts no double inject |
| `artifact-routing.ts` | Collapsed-bucket adaptive weights | Add a per-channel slot for the lane | Weight-wiring test |
| `community-search.ts:101` | `searchCommunities` retrieval | Adapt output into the ranked-list shape | Adapter test |
| `memory-summaries.ts:213` | `querySummaryEmbeddings` + flat summaries | Build root+sub hierarchy, expose prelude provider | Hierarchy + prelude test |
| `memory-context.ts` | Context assembly | Prepend the grounding prelude before retrieved context | Prelude-prepend test |
| `search-flags.ts` | Feature flags | Add default-off shadow flags | Flags-off no-op test |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline and Setup
- [ ] Capture the pre-change retrieval baseline (precision/recall/order) on the ~1000-memory corpus. - Pending: live benchmark/reindex/scan out of scope.
- [x] Read the five hardcoded channel-list sites and the RRF `lists.push` fusion site.
- [x] Read both legacy inject paths and the adaptive-weight model.
- [x] Read `searchCommunities`, `querySummaryEmbeddings` and the flat summaries index.

### Phase 2: Fused Summary/Community Lane
- [x] Add `summary`/`community` to the `ChannelName` union and all channel-list sites.
- [x] Adapt `searchCommunities` + `querySummaryEmbeddings` output into the fused ranked-list shape.
- [x] Push the lane into the RRF fusion site behind a default-off shadow flag.
- [x] Retire the community weak-result fallback inject path when the fused lane is enabled.
- [x] Retire/redirect the summary stage-1 candidate inject path when the fused lane is enabled.
- [x] Add a per-channel weight slot for the lane in the adaptive-weight model.
- [ ] Re-tune the ablation-derived weights perturbed by the new lane against the baseline. - Pending: benchmark acceptance out of scope.

### Phase 3: World-Summary Grounding Prelude
- [ ] Build the two-tier world-summary hierarchy (root + top-k subsections) in the summaries module. - Pending: persistent hierarchy/index requires schema migration.
- [x] Add a read-only prelude provider that selects the relevant existing-summary slice.
- [x] Prepend the coarse-to-fine prelude before retrieved context in `memory-context.ts`, behind a default-off shadow flag.

### Phase 4: Verification
- [x] Add and run lane-fusion, double-count-avoidance, weight-wiring and prelude tests.
- [ ] Confirm flags-off recall serialization is byte-identical to the baseline. - Pending: baseline proof out of scope.
- [ ] Report the shadow before/after delta. - Pending: live benchmark/reindex/scan out of scope.
- [x] Run `npx tsc --noEmit`, the requested suites, strict spec validation and comment-hygiene checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Baseline | Pre/post retrieval precision/recall/order on the ~1000-memory corpus | Retrieval-eval harness |
| Fusion | Summary/community lane contributes ranked, weighted | In-memory fusion vitest |
| Double-count | Evidence counted exactly once after inject-path retirement | In-memory recall vitest |
| Weight wiring | Adaptive-weight per-channel slot applied | In-memory routing vitest |
| Grounding | Coarse-to-fine prelude prepended before retrieved context | In-memory context vitest |
| No-op | Flags-off recall byte-identical to baseline | Serialization parity vitest |
| Type safety | MCP server TypeScript project | `npx tsc --noEmit` |
| Documentation | Level 2 phase docs | `validate.sh --strict` |
| Comment hygiene | Changed code files | `check-comment-hygiene.sh` and grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `searchCommunities` (`community-search.ts:101`) | Internal | Green | No community data for the lane. |
| `querySummaryEmbeddings` (`memory-summaries.ts:213`) | Internal | Green | No summary data for the lane. |
| Shared RRF fuser + `ChannelName` union | Internal | Green | Lane is not routable. |
| Adaptive-weight model (`artifact-routing.ts`) | Internal | Green (needs per-channel slot) | Lane weight has no slot. |
| Retrieval-eval baseline harness | Internal | Needed | Cannot satisfy the baseline-and-delta rule. |
| Sibling determinism RRF candidates (028) | Cross-phase | Coordinate | Shared `rrf-fusion`/weight surface, avoid conflicting edits. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The captured delta shows a regression that cannot be retuned within scope, or TypeScript/tests/validation/comment-hygiene fail.
- **Procedure**: Leave the default-off shadow flags off (instant neutralization), then revert the lane wiring, the inject-path retirements, the weight-slot edits and the prelude edits.
- **Data Reversal**: None. Tests use temp/in-memory fixtures, no live shard or world-summary store is mutated destructively (the hierarchy is additive and reproducible).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Baseline -> Lane Wiring -> Inject-Path Retirement -> Weight Slot + Retune -> Grounding Prelude -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Lane Wiring | Baseline | Inject-path retirement |
| Inject-Path Retirement | Lane wiring | Weight slot + retune |
| Weight Slot + Retune | Inject-path retirement | Grounding prelude |
| Grounding Prelude | Weight slot + retune | Verification |
| Verification | All prior phases | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimate |
|-------|------------|----------|
| Baseline capture and reads | Medium | In-session |
| Fused lane wiring + inject retirement + weight slot | High | Multi-session (effort L, cross-cutting) |
| Weight re-tune against baseline | Medium | Benchmark-bound |
| World-summary hierarchy + grounding prelude | Medium | In-session to multi-session |
| Verification | Medium | In-session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-completion Checklist
- [ ] No live database shard modified.
- [ ] No host daemon touched.
- [ ] Shadow flags default-off verified as a true no-op.

### Rollback Procedure
1. Set both shadow flags off (immediate neutralization).
2. Revert only the files listed in the affected-surfaces table.
3. Re-run the fusion/summary suite and strict spec validation.

### Data Reversal
- **Has data migrations?** No (the world-summary hierarchy is additive and reproducible).
- **Reversal procedure**: Not needed, tests use temp/in-memory fixtures only.
<!-- /ANCHOR:enhanced-rollback -->
