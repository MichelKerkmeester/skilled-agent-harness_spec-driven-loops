---
title: "Feature Specification: Summary Fusion and World-Summary Grounding"
description: "The Spec-Kit Memory MCP already builds community and per-chunk summaries but only exposes them as a weak-result post-pipeline fallback and a stage-1 candidate source, neither participates in the main weighted RRF blend, and there is no coarse-to-fine summary grounding prelude. This phase promotes those built summaries into a first-class weighted fusion lane and adds a two-tier world-summary grounding prelude."
trigger_phrases:
  - "fused summary channel"
  - "community summary rrf lane"
  - "world summary grounding prelude"
  - "coarse to fine retrieval grounding"
  - "summary hierarchy memory"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/021-summary-fusion-grounding"
    last_updated_at: "2026-07-04T17:51:04.196Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented shadow-gated lane/prelude"
    next_safe_action: "Run the broad verification suite, then capture benchmark deltas before any promotion."
    blockers:
      - "Benchmark delta and RRF retune remain pending because live benchmark/reindex/scan was explicitly out of scope."
      - "Persistent world-summary hierarchy remains pending because it requires schema migration."
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-015-summary-fusion-grounding"
      parent_session_id: null
    completion_pct: 70
    open_questions:
      - "Final RRF weight for the fused summary lane (ablation-tuned, needs the baseline-and-delta retune)."
      - "Whether the world-summary prelude is computed on a cadence or on demand."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Summary Fusion and World-Summary Grounding

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/028-xce-research-based-refinement` |
| **Parent Spec** | `../spec.md` (028 / 001-speckit-memory research phase) |
| **Parent Packet** | system-speckit/029-memory-search-intelligence |
| **Wave** | Wave-2 (intelligence-class, shadow-gated, needs baseline-and-delta) |
| **Candidates** | `MEM-fused-summary-channel`, `CG-global-context-summary-hierarchy` |
| **Predecessor** | ../020-self-healing-internals-hardening/spec.md |
| **Successor** | ../022-iterative-agentic-recall/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is the first implementation sub-phase under the `001-speckit-memory` research phase of packet 028 (the PRIMARY subsystem). It implements two paired retrieval-intelligence candidates that both operate on the already-built summary/community substrate:

- **`MEM-fused-summary-channel`**: promote the built community/summaries from a weak-result post-pipeline fallback (and a stage-1 candidate source) into a first-class *weighted RRF fusion lane*.
- **`CG-global-context-summary-hierarchy`**: add a two-tier world-summary (root world-summary + top-k subsections) prepended as a coarse-to-fine grounding prelude *before* retrieved context.

Both were PENDING in the flat Wave-0 record. Since then, the fused summary lane was built and shipped shadow-gated (§9: `MEM-fused-summary-channel` DONE), while the world-summary candidate has a read-only grounding prelude shipped but its persistent hierarchy remains pending. Both are intelligence-class (they change recall ordering and prompt content), so they shipped behind a default-off shadow flag and required a captured before/after retrieval baseline per the regression-baseline rule.

**CORRECTION (2026-07-01, drift audit remediation):** the fused summary lane described above did not survive. A repo-wide search (glob + grep across the whole repository, not just the paths named in this spec) found no summary/community RRF fusion lane anywhere in `hybrid-search.ts` or elsewhere - `allPossibleChannels` is hardcoded to `['vector','fts','bm25','graph','degree']` with no summary/community entry. `.opencode/skills/system-spec-kit/changelog/v3.7.0.0.md` §"Built, Measured, and Cut" confirms this directly: "summary fusion" is listed among the features that were "built in full, measured against the corpus, and then declined because it did not earn its place." So the correct current state is BUILT, MEASURED, AND CUT, not "shipped shadow-gated" as the paragraph above (and the checklist items verifying it) described at the time they were written. The world-summary grounding-prelude claim is unaffected by this correction and was not re-verified here.

**CORRECTION (2026-07-01, drift-audit remediation -- pass 2 / git-history reconciliation):** the measured rejection reason missing from the pass-1 correction is: `Recall@20 -0.036, displacement-only -- the lane only pushes a real channel hit out of the list`; source: `001-speckit-memory/022-kept-off-flag-resolution/implementation-summary.md`, corroborated in `../../benchmark-status.md`. This packet's own `implementation-summary.md` stated before that cut that "No measured benefit number exists for either candidate" and that "All leverage estimates are structural inference," so the measured `Recall@20 -0.036` result may partly reflect the lane shipping with a guessed, never ablation-tuned weight rather than proving the summary/community signal is fundamentally weak.

**Scope Boundary**: This phase wires the existing summary/community substrate into fusion and adds the grounding prelude. It does NOT build new summary/community computation, new embedding collections or the Wave-2 "semantic edge layer". Weight re-tuning is in scope (the inline RRF weights are ablation-derived and must be re-tuned), but a full ablation re-derivation campaign is deferred to its own benchmark.

**Dependencies**:
- `searchCommunities` community retrieval (`lib/search/community-search.ts:101`), already built, currently consumed only as a weak-result fallback.
- `querySummaryEmbeddings` summary-embedding retrieval (`lib/search/memory-summaries.ts:213`, gated by `isMemorySummariesEnabled`), already built, currently a stage-1 candidate source.
- `applyCommunityBoost` (`lib/search/pipeline/stage2-fusion.ts:1193`), existing stage-2 community inject (one of the two paths to retire to avoid double-count).
- The shared RRF fuser and `ChannelName` union (`lib/search/query-router.ts:36`) and the adaptive-weight model (`artifact-routing.ts`).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Memory MCP already computes community and per-chunk summaries, but that evidence never participates in the main ranked blend, and there is no coarse-to-fine grounding prelude:

- **Summary/community evidence is second-class.** The RRF fusion channel list is hardcoded to `['vector','fts','bm25','graph','degree']` (`hybrid-search.ts:1310`). Community members are injected only as a *weak-result post-pipeline fallback* (`memory-search.ts:1158-1228`), calibrated below the quality floor, appended rather than fused, and per-chunk summaries are a stage-1 candidate source (`stage1-candidate-gen.ts:44` via `querySummaryEmbeddings`). Neither carries a tuned RRF weight, so high-signal summary evidence is either dropped or under-weighted. [CONFIRMED: `hybrid-search.ts:1310`, `memory-search.ts:1158-1228`, `stage1-candidate-gen.ts:44`]
- **Summaries are flat and never used as grounding.** The summary index is a single flat collection, there is no hierarchical root world-summary + subsection index, and no pre-fetch-and-prepend grounding prelude before retrieved context. Multi-hop/broad questions retrieve fragments without a coarse anchor. [CONFIRMED-by-absence, external template: cognee `global_context.py:1-73`, `graph_completion_retriever.py:78-79`]

### Purpose
Make the already-built summary/community evidence a first-class weighted RRF lane and anchor retrieval with a two-tier world-summary grounding prelude, without double-counting the existing inject paths and without regressing primary recall order, validated against a captured baseline.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Capture a before/after retrieval baseline on the ~1000-memory corpus (precision/recall/order deltas) per the regression-baseline rule, before any ranking change.
- Add a `summary`/`community` channel to the `ChannelName` union and all hardcoded channel-list sites so the lane is routable.
- Add the fused summary/community lane to the RRF `lists.push` fusion site with its own tuned weight (reusing `searchCommunities` + `querySummaryEmbeddings` data, no new computation).
- Retire the two existing inject paths (community post-pipeline fallback and the summary stage-1 candidate inject) so the same evidence is not counted twice.
- Extend the adaptive-weight model so it carries a per-channel slot for the summary/community lane (it currently has collapsed buckets with no slot).
- Re-tune the affected ablation-derived inline RRF weights so the new lane does not distort survivors.
- Build a two-tier world-summary index (root world-summary + top-k subsections) and a coarse-to-fine grounding prelude that prepends the relevant slice before retrieved context.
- Gate both candidates behind default-off shadow flags. Report a shadow comparison before promotion.
- Add tests for lane fusion, double-count avoidance, weight-model wiring and the grounding prelude.

### Out of Scope
- Building new summary or community *computation* (reuse the existing `searchCommunities` / `querySummaryEmbeddings` data only).
- The Wave-2 "semantic edge layer" (per-edge embeddings, edge vector index, triplet search), separate initiative.
- A full ablation re-derivation campaign for all RRF weights (this phase re-tunes only the weights the new lane perturbs, full re-derivation is a separate benchmark).
- Changing the other three subsystems (code-graph, skill-advisor, deep-loop), sibling phases.
- Touching host daemons or live `mcp_server/database/**` shards.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Modify | Add the fused summary/community lane at the RRF `lists.push` site (~`:1394-1495`). Update the hardcoded channel lists (`:1310`, `:951`). |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts` | Modify | Add `summary`/`community` to the `ChannelName` union (`:36`) and the channel-list sites (`:68`, `:74`, `:106-107`). |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/routing-telemetry.ts` | Modify | Add the new channel to the telemetry channel list (`:17`). |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modify | Retire the community weak-result post-pipeline fallback (`:1158-1228`) once the lane is fused. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Modify | Retire/redirect the summary stage-1 candidate inject (`~:1304-1326`) into the fused lane to avoid double-count. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/artifact-routing.ts` | Modify | Add a per-channel weight slot for the summary/community lane (currently collapsed buckets). |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts` | Modify | Adapt `searchCommunities` output into the fused-lane ranked-list shape. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts` | Modify | Build/read the two-tier world-summary hierarchy. Expose a prelude provider. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | Modify | Prepend the coarse-to-fine world-summary grounding prelude before retrieved context. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Modify | Add default-off shadow flags for the fused lane and the grounding prelude. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/**` | Create | Lane-fusion, double-count-avoidance, weight-wiring and prelude tests (temp/in-memory fixtures only). |
| `.opencode/specs/system-speckit/029-memory-search-intelligence/001-speckit-memory/015-summary-fusion-grounding/*` | Create | This phase's documentation. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A retrieval baseline is captured before any ranking change. | Pre-change precision/recall/order numbers on the ~1000-memory corpus are recorded, the post-change delta is reported (regression-baseline rule). [research: roadmap BROADENING §6 "no measured benefit number", iter-022 "needs a baseline-and-delta retune plan"] |
| REQ-002 | Summary/community is a first-class weighted RRF lane. | The fused lane is added at the `hybrid-search.ts` RRF `lists.push` site (~`:1394-1495`) with its own tuned weight. The `ChannelName` union and all hardcoded channel-list sites include it. [research: iter-022 SIZE-L correction] |
| REQ-003 | No double-counting of summary/community evidence. | Both pre-existing inject paths are retired: the community weak-result fallback (`memory-search.ts:1158-1228`) and the summary stage-1 candidate inject (`~:1304-1326`). A test asserts evidence is counted once. [research: iter-022 "retire 2 inject paths to avoid double-count"] |
| REQ-004 | The adaptive-weight model carries a per-channel slot for the lane. | `artifact-routing.ts` exposes a tuned weight slot for the summary/community lane instead of a collapsed bucket. [research: iter-022 "weight-model mismatch" trap] |
| REQ-005 | A two-tier world-summary grounding prelude is prepended before retrieved context. | A root world-summary + top-k subsection index exists. The relevant slice is prepended as a coarse-to-fine prelude in `memory-context.ts`. [research: synthesis/06 #13, iter-019 candidate 3, cognee `global_context.py:1-73`] |
| REQ-006 | Both candidates are shadow-gated default-off. | The fused lane and the grounding prelude are behind default-off flags. With flags off, recall output is byte-identical to baseline. [research: roadmap §3 "shadow-gated, needs baseline-and-delta"] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Re-tuned RRF weights do not distort survivors. | The ablation-derived inline weights perturbed by the new lane are re-tuned. A fusion test shows survivors keep stable relative order vs baseline. [research: iter-022 "ablation-tuned retune obligation"] |
| REQ-008 | Existing summary/community computation is reused, not rebuilt. | The lane consumes `searchCommunities` (`community-search.ts:101`) and `querySummaryEmbeddings` (`memory-summaries.ts:213`). No new summary/community computation is added. [research: iter-022 "strong data-side reuse"] |
| REQ-009 | Verification avoids live shards and host daemons. | Tests use temp/in-memory fixtures and do not access `mcp_server/database/**`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With the shadow flags ON, summary/community evidence is fused alongside vector/keyword/graph signals with its own tuned weight, and the captured baseline delta shows no regression on primary recall order.
- **SC-002**: With both shadow flags OFF, recall serialization is byte-identical to the pre-change baseline.
- **SC-003**: A test proves summary/community evidence is counted exactly once (both legacy inject paths retired).
- **SC-004**: The world-summary grounding prelude is prepended coarse-to-fine before retrieved context when its flag is ON.
- **SC-005**: TypeScript, targeted vitest files, the fusion/summary suite, strict spec validation and comment-hygiene checks pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Double-counting | Summary/community evidence fused AND injected via the legacy paths inflates its rank. | Retire both inject paths in the same change, assert single-count in a test (REQ-003). |
| Risk | Weight-model mismatch | The adaptive-weight model has collapsed buckets and no per-channel slot for the lane. | Add an explicit per-channel slot (REQ-004) before fusing. |
| Risk | Ablation-retune obligation | Inline RRF weights are ablation-derived, a new lane perturbs survivors. | Capture a baseline (REQ-001) and re-tune only the perturbed weights (REQ-007). |
| Risk | Unmeasured leverage | No benefit number exists, the win is structural inference only. | Ship shadow-gated default-off, promote only after the baseline-and-delta shows a real gain. |
| Risk | Effort drift (L, not M/M) | Cross-cutting fusion + retune is larger than the original finder estimate. | Sequence as: baseline → lane wiring → inject-path retirement → weight slot → retune → prelude. |
| Dependency | `searchCommunities` / `querySummaryEmbeddings` | Lane has no data if these are unavailable. | Both confirmed present and built, lane reuses them read-only. |
| Dependency | Shared RRF fuser + `ChannelName` union | Lane is not routable without union + channel-list updates. | Update all 5 hardcoded channel-list sites (REQ-002). |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The fused lane reuses already-computed summary/community data. It must not add a new per-query summary computation pass.
- **NFR-P02**: The world-summary prelude must read a precomputed hierarchy, not recompute summaries inline per recall.

### Reliability
- **NFR-R01**: With shadow flags off, the change is a strict no-op on recall ordering and serialization.
- **NFR-R02**: The community/summary retrieval remains fail-open (a lane error degrades to the remaining channels, never throws).

### Maintainability
- **NFR-M01**: The summary/community lane must route through the shared RRF fuser, not a bespoke summary-specific fuser.
- **NFR-M02**: New code comments must avoid ephemeral artifact labels (spec paths, candidate ids, phase numbers).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **No communities/summaries for the query**: the lane contributes an empty ranked list and fusion proceeds on the remaining channels (degrade-to-remaining, not skew-down).
- **Summary hierarchy missing/stale**: the grounding prelude is omitted, retrieval proceeds without a prelude rather than blocking.
- **Lane returns the same row as another channel**: the convergence/overlap bonus applies once, the legacy inject paths are retired so it is not double-credited.

### Flag Combinations
- **Both flags off**: byte-identical to baseline (no-op).
- **Fused lane on, prelude off**: ranked blend includes the lane, no prelude prepended.
- **Prelude on, fused lane off**: prelude prepended, ranked blend unchanged.

### Failure Scenarios
- **`searchCommunities` fail-open**: a failed community search logs and yields an empty lane, fusion is unaffected.
- **World-summary index unavailable**: prelude provider returns null, `memory-context.ts` prepends nothing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Cross-cutting fusion: ~5 channel-list sites + RRF push + 2 inject-path retirements + weight model + a new prelude path. |
| Risk | 17/25 | Changes recall ordering and prompt content, double-count and weight-distortion traps, unmeasured leverage. |
| Research | 8/20 | Seams confirmed, the open item is the empirical weight re-tune and prelude cadence. |
| Multi-Agent | 0/15 | Single-stream implementation. |
| Coordination | 8/15 | Shares the RRF/weight surface with sibling determinism candidates, must avoid live shards. |
| **Total** | **51/100** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:candidate-status -->
## 9. CANDIDATE STATUS

Per-candidate status. The fused summary lane has shadow-gated code and deterministic unit coverage. Benchmark promotion remains pending. The world-summary candidate has a read-only prelude over existing summaries, but the persistent two-tier hierarchy remains pending because that needs a schema migration.

| Candidate | Status | Gate | Evidence / Notes |
|-----------|--------|------|------------------|
| `MEM-fused-summary-channel` | **DONE (shadow-gated code)** | benchmark-promotion pending | Implemented behind `SPECKIT_SUMMARY_FUSION_LANE` (default off): channel union/list registration, telemetry slots, fused summary/community ranked-list adapters, RRF lane push, handler fallback stand-down, stage-1 summary stand-down, per-channel weight slot, cache identity split and deterministic unit coverage. No benchmark delta or RRF retune was run under this turn's constraints. |
| `CG-global-context-summary-hierarchy` | **PENDING** | schema-migration + benchmark pending | Implemented a default-off read-only grounding prelude over existing `memory_summaries` via `SPECKIT_WORLD_SUMMARY_PRELUDE`. Left the persistent root + subsection hierarchy/index pending because it requires schema migration, which was explicitly out of scope. |
<!-- /ANCHOR:candidate-status -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- What is the final RRF weight for the fused summary/community lane? (Ablation-derived, resolved by the REQ-001 baseline-and-delta retune.)
- Is the world-summary hierarchy computed on a cadence (background) or on demand at recall time? (Affects NFR-P02.)
- Does the prelude slice from the root world-summary, the top-k subsections or both, and how is the relevant subsection selected?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`.
- **Task Breakdown**: See `tasks.md`.
- **Parent Spec**: See `../spec.md`.
- **Source research**: `../../research/roadmap.md` (MEMORY-SYSTEMS ADDENDUM #5/#13), `../../research/synthesis/06-memory-systems-findings.md`, `../research/external-memory-systems/iterations/iteration-{017,018,019,022}.md`.
- **Wave-0 shipped record**: Wave-0 record (neither candidate listed → PENDING).
<!-- /ANCHOR:related-docs -->
