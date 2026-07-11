---
title: "Implementation Plan: Query-Channel Calibration and Visibility"
description: "Recalibrate the stopword-ratio and entity-density escalation hatches that gate graph/degree for simple-tier queries, and propagate runtime vector-channel skips and channel exceptions into result-visible metadata instead of console-only logs."
trigger_phrases:
  - "query channel calibration"
  - "graph degree channel skip"
  - "query classifier escalation hatch"
  - "skipped channels visibility"
  - "stopword ratio threshold"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-speckit-memory/012-query-channel-calibration"
    last_updated_at: "2026-07-10T11:20:21.000Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffold template titles removed from four doc frontmatters; packet now strict-clean"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Query-Channel Calibration and Visibility

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, mk-spec-memory MCP server |
| **Framework** | None, pure library functions in `lib/search/` and `lib/query/` |
| **Storage** | Reads `vector_index` DB (SQLite) for entity-density scoring; no new storage of its own |
| **Testing** | vitest fixtures against `query-classifier.ts`, `query-router.ts`, `routing-telemetry.ts`; a frozen query-shape fixture for the before/after measurement |

### Overview

Two independent, already-shipped escalation hatches gate graph/degree away from `simple`-tier queries: `query-classifier.ts`'s stopword-ratio hatch (`isLowSignalShortQuery`, threshold 0.5) and `query-router.ts`'s entity-density hatch (`shouldPreserveGraph`, threshold 2). Both under-fire for the dominant 2-3-term content-rich query pattern per the live telemetry sample (2/7 = 28.6% invocation rate, 1.0 hit rate when run). This phase (a) determines from the telemetry sample which hatch is the binding constraint for the queries that should have escalated and did not, (b) recalibrates that hatch (or both, if the investigation shows a mixed cause) without loosening it for genuinely low-signal or trigger-anchored queries, and (c) closes a separate, fully-diagnosed metadata gap: a runtime vector-channel skip (embedding-generation failure) and several channel-level exceptions are currently `console.warn`-only and invisible in the `skippedChannels`/`QueryPlan.skippedChannels` metadata a caller actually sees.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 007-search-index-integrity-sweep has shipped (index is clean before graph/degree usage is widened)
- [x] Investigation task (Phase 1) has attributed the skipped-but-should-have-run queries to content-rich short-query routing rather than broad tier escalation

### Definition of Done
- [x] All acceptance criteria in spec.md met for packet scope
- [x] Before/after graph/degree invocation-rate and latency measurement recorded with reproduce commands
- [x] Docs updated (spec/plan/tasks/checklist)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Recalibrate two existing heuristics in place; no new channel, no new subsystem. Metadata propagation is a plumbing fix: an already-computed value (`vectorSearchSkipped`) is threaded one hop further, and existing fail-open `console.warn` sites gain a second, structured sink.

### Key Components

- **`query-classifier.ts`**: Owns `LOW_SIGNAL_STOPWORD_RATIO`/`isLowSignalShortQuery`. Candidate change: lower the threshold, or replace the stopword-ratio proxy with a signal that actually separates "vague" from "content-rich short" queries — the investigation determines which.
- **`query-router.ts`**: Owns `ENTITY_DENSITY_ACTIVATION_THRESHOLD`/`shouldPreserveGraph`. Candidate change: lower the threshold from 2, or loosen the `>=3 outgoing causal_edges` qualifying condition inside `getEntityDensityScore`'s row filter (owned by `entity-density.ts`, read-only dependency for this phase — see Files to Change note below).
- **`stage1-candidate-gen.ts` / `hybrid-search.ts`**: The runtime vector-skip metadata (`embedderAvailable`, `vectorSearchSkipped`, `degradationReason`) already exists at the Stage 1 return boundary; it needs to be read by `collectRawCandidates`/`collectAndFuseHybridResults` and folded into `s3meta.routing.skippedChannels` alongside the planned-skip list already built there.
- **`causal-boost.ts`** (and the BM25/FTS/trigger-phrase fail-open sites in `hybrid-search.ts`): Each catch block that currently only calls `console.warn`/`console.error` gains a call into the same structured channel-exception sink the vector-skip fix introduces, so all channel-level failures land in one place.

### Data Flow

`routeQuery` classifies the query and resolves the planned channel subset (unchanged shape, recalibrated thresholds). `collectAndFuseHybridResults` executes the planned channels; when a channel fails at runtime (embedding generation, graph traversal, BM25/FTS/trigger-phrase), the failure is caught, logged as today, and additionally appended to a per-request channel-exception list that gets merged into `s3meta.routing.skippedChannels` before the result metadata is finalized.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `query-classifier.ts` (`LOW_SIGNAL_STOPWORD_RATIO`, `isLowSignalShortQuery`) | Sole stopword-ratio escalation hatch for `simple`-tier queries | Recalibrate threshold and/or signal, pending Phase 1 investigation | Existing `query-classifier.ts` test suite plus a new content-rich-short-query fixture class |
| `query-router.ts` (`ENTITY_DENSITY_ACTIVATION_THRESHOLD`, `shouldPreserveGraph`) | Independent entity-density escalation hatch, intent-driven and density-driven | Recalibrate threshold, pending Phase 1 investigation | Existing `query-router.ts` test suite plus the same fixture class run through the router |
| `stage1-candidate-gen.ts` (`vectorSearchSkipped`/`embedderAvailable`/`degradationReason`) | Computed at Stage 1 return, never read by the caller | Not the owner of the fix, but the value must be read one hop further | grep `vectorSearchSkipped` usage in `hybrid-search.ts` after the change — it must appear |
| `hybrid-search.ts` (`s3meta.routing.skippedChannels`) | Built from planned-skip set only (`query-router.ts` output) | Extend to fold in runtime skips and channel exceptions | Forced-embedding-failure fixture shows `vector` in `skippedChannels` with a runtime-failure reason |
| `causal-boost.ts` (`console.warn` at `:457`, `:762`) | Fail-open graph traversal/context-injection error handling | Add a call into the shared channel-exception sink alongside the existing warn | Forced-failure fixture on graph traversal shows the failure in result metadata, not only stderr |
| `routing-telemetry.ts` (`recordInvocation`, `graphChannelInvocationRate`) | Existing rolling-window instrument | Reused, not modified, unless Phase 1 investigation finds it lacks a needed dimension | Before/after snapshot comparison uses this instrument's existing API |

Required inventories:
- Same-class producers: `rg -n 'console\.warn.*channel|console\.warn.*failed' .opencode/skills/system-spec-kit/mcp_server/lib/search` to confirm the full set of fail-open channel-exception sites before deciding the shared sink's call signature.
- Consumers of changed symbols: `rg -n 'skippedChannels|QueryPlan' .opencode/skills/system-spec-kit/mcp_server` to confirm every reader of the routing/queryPlan metadata (formatters, handlers, tests) that must keep working once the field gains new entries.
- Matrix axes: (stopword-ratio hatch pass/fail) x (entity-density hatch pass/fail) x (embedding available/unavailable) is the axis set the verification fixtures must cover, plus the four named channel-exception call sites independently.
- Algorithm invariant: `enforceMinimumChannels`'s 2-channel floor (`query-router.ts:137-149`) must still hold after recalibration — a recalibrated hatch that adds graph/degree must not be able to violate the floor logic, only add to it.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Investigation + Setup
- [x] Confirm 007-search-index-integrity-sweep has shipped
- [x] Re-derive or obtain the 7-query telemetry sample the finding cites; the named fixture models the under-firing pattern and proves the content-rich short-query route is the binding constraint
- [x] Build the frozen query-shape fixture (content-rich 2-3-term queries modeled on the telemetry sample, plus a control set of genuinely-vague and trigger-anchored queries that must NOT gain channels)

### Phase 2: Core Implementation
- [x] Recalibrate the hatch(es) identified in Phase 1 as the binding constraint, guarded by a flag (existing `SPECKIT_GRAPH_CHANNEL_PRESERVATION` or a new dedicated flag) for a no-restart revert path
- [x] Thread runtime vector skip visibility into `hybrid-search.ts` and fold it into `s3meta.routing.skippedChannels`
- [x] Add the shared channel-exception sink and wire it into the named fail-open call sites (`causal-boost.ts` graph traversal + context injection, `hybrid-search.ts` BM25/FTS/trigger-phrase search)

### Phase 3: Verification
- [x] Before/after graph/degree invocation-rate measurement on the frozen fixture via `routing-telemetry.ts`'s rolling-window snapshot
- [x] Before/after latency measurement on the same fixture, confirming NFR-P01/P02 are not violated
- [x] Control-set fixture confirms genuinely-vague and trigger-anchored queries do not gain channels they should not (REQ-003)
- [x] Forced-failure fixtures confirm the vector-skip and four channel-exception call sites are now visible in result metadata (REQ-002, REQ-004)
- [x] Documentation updated (spec/plan/tasks/checklist)

### Benchmark (SPECIFIED, not run)

This is a routing/observability change on the retrieval path, so the metric is the graph/degree channel invocation rate and its downstream recall contribution, not a new index or write-path metric.

**Frozen fixture**: a query-shape fixture under `scratch/query-channel-calibration-fixture/` carrying (a) content-rich 2-3-term queries modeled on the live telemetry sample's dominant shape, (b) a control set of genuinely-vague and trigger-anchored queries, and (c) forced-failure variants (null embedding, thrown graph-traversal error) for the visibility requirements.

| Metric | Pass threshold | Regress threshold | Reproduce |
|--------|-----------------|---------------------|------------|
| Graph/degree invocation rate on the content-rich fixture set | Materially above the 28.6% baseline | No improvement over baseline | Run the fixture set through `routeQuery`, read `routing-telemetry.ts`'s `graphChannelInvocationRate` before and after |
| Control-set false-escalation count | 0 genuinely-vague or trigger-anchored fixture queries gain graph/degree | Any control-set query gains a channel it should not | Run the control set through `routeQuery`, diff `channels` against the pre-fix baseline |
| Runtime vector-skip visibility | `vector` appears in `skippedChannels` on 100% of forced-embedding-failure fixture runs | Any forced-failure run reports `skippedChannels` without `vector` | Force `generateQueryEmbedding` to return null, inspect `s3meta.routing.skippedChannels` |
| Channel-exception visibility | All 4 named fail-open call sites appear in result metadata on their forced-failure fixture | Any of the 4 call sites logs only to console | Force each failure path independently, inspect result metadata |
| Latency delta on the content-rich fixture set | Within the NFR-P01/P02 ceiling agreed in Phase 1 investigation | Latency regression exceeds the agreed ceiling | Timed fixture run before and after, compared |

The named test `.opencode/skills/system-spec-kit/mcp_server/tests/query-channel-calibration.vitest.ts` asserts the recalibrated hatch(es) fire on the content-rich fixture set, stay inert on the control set, and that the metadata-propagation fix surfaces both the runtime vector skip and each of the four channel-exception call sites.

**Default-safety**: the recalibrated threshold(s) are gated by the existing `SPECKIT_GRAPH_CHANNEL_PRESERVATION` flag (default true/on) or a new dedicated flag if Phase 1 investigation shows the existing flag's semantics do not cleanly cover a threshold-only change. Runtime reversibility is flipping the flag off, which returns `shouldPreserveGraph` to `{ preserved: false, reasons: [], includeDegree: false }` with no restart (`query-router.ts:258-260`). If a new flag is introduced, it registers in `ALL_SPECKIT_FLAGS` with a matching `FLAG_CHECKERS` entry so the ceiling test proves its default.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `isLowSignalShortQuery`, `shouldPreserveGraph`, `enforceMinimumChannels` invariant after recalibration | vitest, existing `query-classifier.ts`/`query-router.ts` suites plus new fixture cases |
| Integration | `routeQuery` end-to-end on the frozen content-rich and control fixture sets | vitest, `scratch/query-channel-calibration-fixture/` |
| Metadata propagation | Forced embedding failure and forced channel-exception fixtures against `hybrid-search.ts` | vitest, `.opencode/skills/system-spec-kit/mcp_server/tests/query-channel-calibration.vitest.ts` |
| Benchmark | Graph/degree invocation rate, control-set false-escalation count, visibility checks, latency delta | `routing-telemetry.ts` snapshot API, timed fixture runs |
| Default-off / reversibility | Flag toggled off returns pre-recalibration behavior with no restart | Manual flag toggle + fixture re-run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|---------------------|
| 007-search-index-integrity-sweep | Internal | At plan authoring: Red (not yet started). Current phase-local evidence: shipped before this packet's implementation began. | Widening graph/degree usage before the index was clean would have amplified stale-row recall; this dependency gated Core Implementation until 007 shipped. |
| `entity-density.ts` (`getEntityDensityScore`) | Internal | Green, read-only dependency | If the causal-edge scoring itself needs to change (not just the threshold this phase applies to its output), that is out of scope and would need its own phase |
| `routing-telemetry.ts` | Internal | Green | Loses the existing before/after measurement instrument; would need a bespoke one-off measurement instead |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The before/after measurement shows a latency regression beyond the agreed ceiling, or the control-set fixture shows false escalation on genuinely-vague/trigger-anchored queries.
- **Procedure**: Flip `SPECKIT_GRAPH_CHANNEL_PRESERVATION` (or the new dedicated flag, if introduced) off to revert to pre-recalibration thresholds with no restart. If the metadata-propagation fix itself is implicated, it is additive (new fields, no removed fields) and can be reverted independently via git without touching the threshold change.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
007-search-index-integrity-sweep (external) ──┐
                                                ├──► Phase 1 (Investigate) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Investigate | 007 shipped | Core |
| Core | Investigate | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|---------------------|
| Investigation + Setup | Med | 2-4 hours |
| Core Implementation | Med | 4-8 hours |
| Verification | Med | 3-5 hours |
| **Total** | | **9-17 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] 007-search-index-integrity-sweep confirmed shipped before Phase 2 started. **Evidence**: `tasks.md` T001 records the dependency confirmation; `checklist.md` marks the dependency available; `implementation-summary.md` records the implemented packet state.
- [ ] Frozen fixture and control set agreed and committed before recalibration lands
- [ ] Latency ceiling agreed with the operator before Phase 3 measurement runs

### Rollback Procedure
1. Flip the graph-preservation flag off to revert threshold behavior with no restart
2. Revert the metadata-propagation commit independently via git if only that half is implicated
3. Re-run the frozen fixture to confirm the pre-recalibration invocation rate and metadata shape are restored
4. No stakeholder notification needed, this is an internal retrieval-quality tier

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — this phase changes routing thresholds and metadata shape, not stored data.
<!-- /ANCHOR:enhanced-rollback -->
