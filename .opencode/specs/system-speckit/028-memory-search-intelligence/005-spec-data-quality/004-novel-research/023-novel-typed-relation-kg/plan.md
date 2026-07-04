---
title: "Implementation Plan: Novel typed-relation KG auto-extracted [template:level_2/plan.md]"
description: "Wire an LLM typed-relation extractor onto the shipped rule-based extractor so high-value docs gain semantic typed edges. Close the unwired registerLlmBackfillFn seam, persist LLM-derived edges against the six canonical RELATION_TYPES with a distinct provenance marker and expose a read-only navigation surface."
trigger_phrases:
  - "typed relation kg"
  - "llm graph backfill"
  - "knowledge graph navigation"
  - "causal edges provenance"
  - "deterministic extractor"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "028-memory-search-intelligence/005-spec-data-quality/004-novel-research/023-novel-typed-relation-kg"
    last_updated_at: "2026-07-04T17:12:08.656Z"
    last_updated_by: "markdown-agent"
    recent_action: "Author plan for the typed-relation KG build"
    next_safe_action: "Author tasks and checklist for the build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Novel typed-relation KG auto-extracted

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, inside the spec-kit MCP server |
| **Framework** | None, one extractor module wired into the shipped graph-lifecycle scheduler |
| **Storage** | The shipped SQLite `causal_edges` table, read and write through the existing storage layer |
| **Testing** | vitest for the bounded parse and the cap enforcement, a parse fixture for the relation vocabulary |

### Overview
The build wires an LLM typed-relation extractor onto the shipped rule-based extractor so high-value docs gain semantic typed edges, then exposes those edges as a read-only navigation and provenance surface. It closes the unwired `registerLlmBackfillFn` seam at `graph-lifecycle.ts:635`, persists LLM-derived edges to `causal_edges` against the six canonical `RELATION_TYPES` with a distinct provenance marker and adds a ranking-neutral typed-edge accessor over `causal_edges`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One new extractor module plus four touched files, all inside the shipped graph-lifecycle and causal-edges seams. No new flag, no new scheduler and no ranking change.

### Key Components
- **llm-relation-extractor.ts**: the net-new module. It prompts an LLM to type document prose into the six canonical relations, parses the result, drops out-of-vocabulary relations and applies the reused strength and per-node caps before write.
- **registerLlmBackfillFn wiring**: the extractor registers as the backfill callback at MCP bootstrap in `context-server.ts`, closing the null-callback seam so `_scheduleLlmBackfill` fires for real.
- **provenance write path**: `causal-edges.ts` persists LLM-derived edges with a distinct `created_by` value and an LLM `evidence` marker so they stay separable from deterministic `explicit_only` edges and `manual` edges.
- **navigation accessor**: `graph-search-fn.ts` gains a read-only accessor that returns a result node's typed edges (relation, target, provenance, strength) without touching result order or the truncation floor.

### Data Flow
On a high-value doc save with the flag on, the shipped `_scheduleLlmBackfill` fires the registered extractor on the fire-and-forget `setImmediate` path. The extractor types the prose, validates each relation against the frozen `RELATION_TYPES` enum, caps the edge set and writes the survivors to `causal_edges` with the LLM provenance marker. On read, the navigation accessor reads those edges back for a result node and returns them alongside the result without re-ranking.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `graph-lifecycle.ts` | Owns the `_scheduleLlmBackfill` scheduler and the null `registerLlmBackfillFn` seam | Not a consumer, the wiring calls its existing register fn | grep the register call lands once and the scheduler fires the callback |
| `context-server.ts` | Owns MCP bootstrap | Modify, call `registerLlmBackfillFn` once at startup | grep the bootstrap call after build |
| `causal-edges.ts` (`RELATION_TYPES` at `:28-35`) | Owns the canonical relation enum and the insert path | Modify, add the LLM provenance write, never widen the enum | grep the new `created_by` and `evidence` markers, confirm the CHECK constraint is untouched |
| `graph-search-fn.ts` | Owns the read-side result assembly | Modify, add a read-only typed-edge accessor | a before-and-after ranking comparison shows identical order |

Required inventories:
- Same-class producers: `rg -n 'createTypedEdges|created_by|RELATION_TYPES' .opencode/skills/system-spec-kit/mcp_server/lib`.
- Consumers of changed symbols: `rg -n 'registerLlmBackfillFn|_scheduleLlmBackfill' .opencode/skills/system-spec-kit/mcp_server`.
- Matrix axes: flag-on versus flag-off, in-vocabulary versus out-of-vocabulary relation and edge-count under versus over the per-node cap are the axes the fixtures must cover.
- Algorithm invariant: every persisted relation is one of the six canonical `RELATION_TYPES`, no insert fails the CHECK constraint and the navigation read never changes result order.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the `SPECKIT_LLM_GRAPH_BACKFILL` flag and the `_scheduleLlmBackfill` scheduler are callable as the shipped gating path
- [ ] Confirm the frozen `RELATION_TYPES` enum and the `causal_edges` CHECK constraint as the write target
- [ ] Confirm the reused `MAX_AUTO_STRENGTH` and `MAX_EDGES_PER_NODE` caps in `relation-backfill.ts`
- [ ] Stand up a parse fixture with one in-vocabulary relation and one out-of-vocabulary relation

### Phase 2: Core Implementation
- [ ] Build `llm-relation-extractor.ts` to prompt, parse and map prose onto the six canonical relations
- [ ] Drop every out-of-vocabulary relation before write and apply the reused strength and per-node caps
- [ ] Persist LLM-derived edges in `causal-edges.ts` with a distinct `created_by` and an LLM `evidence` marker
- [ ] Call `registerLlmBackfillFn` once at bootstrap in `context-server.ts` to close the unwired seam
- [ ] Add the read-only typed-edge navigation accessor in `graph-search-fn.ts`

### Phase 3: Verification
- [ ] The registered callback fires for a high-value doc whose `qualityScore` clears the threshold under the flag
- [ ] No `causal_edges` insert fails the relation CHECK constraint and an invalid relation yields zero rows
- [ ] LLM edges partition cleanly by `created_by` and `evidence` and never mislabel as deterministic
- [ ] With the flag off an indexed high-value doc writes zero LLM-derived rows
- [ ] The navigation accessor returns typed edges and a before-and-after comparison shows identical ranking
- [ ] Documentation updated (spec/plan/tasks/checklist)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The bounded parse, the out-of-vocabulary drop, the strength and per-node cap enforcement | vitest |
| Integration | The save-to-edge path on a high-value fixture doc with the flag on | fixture corpus, the shipped scheduler |
| Manual | A flag-on index of a real high-value doc to confirm typed edges land and ranking is unchanged | local shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `SPECKIT_LLM_GRAPH_BACKFILL` flag and `_scheduleLlmBackfill` (`graph-lifecycle.ts`) | Internal | Green | No shipped gating path, the extractor has no scheduler to wire into |
| `RELATION_TYPES` enum and the `causal_edges` CHECK constraint (`causal-edges.ts`) | Internal | Green | The write-target enum is gone, the extractor cannot map relations |
| Reused caps in `relation-backfill.ts` | Internal | Green | The bounded-safety caps are gone, the LLM layer could densify the graph |
| `015-prodmode-recall-gate` | Internal | Green | Recorded only to assert it does not apply, this is navigation not retrieval |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The first flag-on run writes hallucinated or densifying edges, or any insert trips the CHECK constraint.
- **Procedure**: Unset `SPECKIT_LLM_GRAPH_BACKFILL` so the extractor lands dark again. LLM edges carry a distinct provenance so they delete as a class with no effect on deterministic or manual edges.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Fixture) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Flag, scheduler, enum, caps | Core, Fixture |
| Fixture | Setup | Verify |
| Core | Setup | Verify |
| Verify | Core, Fixture | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 5-9 hours |
| Verification | Med | 2-4 hours |
| **Total** | | **8-15 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Strength and per-node caps confirmed wired before the flag is enabled on the live corpus
- [ ] The distinct `created_by` and LLM `evidence` markers confirmed so LLM edges delete as a class
- [ ] The default-off flag confirmed to skip the extractor when unset

### Rollback Procedure
1. Unset `SPECKIT_LLM_GRAPH_BACKFILL` so the extractor skips on the next index
2. Delete LLM-derived edges by their distinct provenance if the edges must be purged
3. Run a flag-off index to confirm deterministic-only behavior is unchanged
4. No stakeholder notification needed, the extractor is internal graph infra

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Delete `causal_edges` rows carrying the LLM provenance marker. Deterministic and manual edges are untouched.
<!-- /ANCHOR:enhanced-rollback -->
