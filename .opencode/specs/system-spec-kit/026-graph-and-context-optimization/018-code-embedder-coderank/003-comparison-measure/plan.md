---
title: "Plan: 018/003 comparison measure"
description: "Implementation phases for the comparison + ADR-001"
trigger_phrases: ["018/003 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/018-code-embedder-coderank/003-comparison-measure"
    last_updated_at: "2026-05-17T18:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored implementation phases"
    next_safe_action: "Wait for 018/001 + 018/002 to land"
    blockers:
      - "depends on 018/001"
      - "depends on 018/002"
    key_files:
      - "evidence/cocoindex-embedder-comparison.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000018003"
      session_id: "018-003-comparison-measure-plan"
      parent_session_id: "018-003-comparison-measure"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 018/003 comparison measure

<!-- ANCHOR:summary -->
## 1. SUMMARY

For each candidate (gemma baseline, CodeRankEmbed, optional jina-code + bge-code): swap, reindex, run fixture pairs, capture top-3 + latency. Aggregate, ratify in ADR-001.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Reindex | Each candidate completes without errors |
| Sanity | Non-zero, non-100% scores across candidates (fixture isn't broken) |
| Evidence | Per-pair JSONL + aggregate CSV committed |
| ADR | ADR-001 cites specific numbers |
| Strict-validate | Returns PASSED |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
For each candidate:
  COCOINDEX_CODE_EMBEDDING_MODEL=<candidate>  ──▶  reindex  ──▶  fixture probe  ──▶  per-pair row

Aggregator:
  jsonl  ──▶  per-difficulty + per-embedder summary  ──▶  csv  ──▶  ADR-001 verdict
```
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Pre-flight
- Verify 018/001 + 018/002 shipped
- Confirm fixture validator passes

### Phase 2: Per-candidate sweep
For each candidate:
- Swap via env var, reindex, wait for completion
- Run each fixture pair, capture per-pair JSONL row
- Capture reindex wall-clock per candidate

### Phase 3: Aggregate
- Compute per-embedder: top-3 hits, per-difficulty, median + p95 latency
- Write `evidence/cocoindex-embedder-comparison.csv`

### Phase 4: ADR
- Author ADR-001 in `decision-record.md`
- Update memory note ratifying choice

### Phase 5: Follow-up
- If winner ≠ `_DEFAULT_MODEL` from 018/001, ship config update commit
- Strict-validate + commit + push
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Each reindex must complete without error
- After each reindex, a single smoke query confirms the embedder loaded
- Non-zero, non-100% scores across candidates sanity-check the fixture
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 018/001 swap mechanism (BLOCKING)
- 018/002 fixture (BLOCKING)
- Disk space for embedder caches (~1GB total)
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Trigger | Action |
|---|---|
| All candidates score identically | Fixture problem — review 018/002 |
| Reindex crashes for a candidate | Skip that candidate; document in ADR |
| MPS crashes | Fall back to CPU; document latency penalty |
| Winner has worse hard-difficulty score than gemma | Consider stratified verdict |
<!-- /ANCHOR:rollback -->
