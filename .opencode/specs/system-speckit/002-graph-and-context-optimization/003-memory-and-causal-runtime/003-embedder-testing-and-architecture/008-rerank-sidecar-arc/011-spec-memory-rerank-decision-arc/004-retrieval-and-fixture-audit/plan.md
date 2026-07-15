---
title: "Plan: retrieval + fixture audit [template:level_1/plan.md]"
description: "5-phase audit + branch decision. Wall clock ~1-2 hours."
trigger_phrases:
  - "011/004 plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/004-retrieval-and-fixture-audit"
    last_updated_at: "2026-05-21T14:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan scaffolded"
    next_safe_action: "Execute Phase A first; serializable"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: retrieval + fixture audit

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

5 sequential phases; ~1-2 hours total wall clock; single cli-codex dispatch.

| Phase | Step | Wall clock |
|---|---|---|
| A | Gold ID resolution (all 50 probes) | ~15-20 min |
| B | Candidate coverage logging (FTS / vector / fused) | ~30-40 min |
| C | Handler-parity check (5 sample probes through both paths) | ~15-20 min |
| D | Rerank score effect logging | ~15-20 min |
| E | Recompute metrics + branch decision + impl-summary | ~10-15 min |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

```
COMPLETE iff
  5 evidence files exist + parseable AND
  §Branch Decision names ONE of {RETRIEVAL_WORK, SCORING_INTEGRATION_WORK, PHASE_3_JUSTIFIED} AND
  each branch claim cites a specific evidence file + numeric value AND
  zero production source changes (git diff lib/search/ shows zero) AND
  strict-validate exit 0
ELSE PARTIAL — at minimum REQ-001 (probe classification) + REQ-006 (branch decision OR "deferred" with reason) must complete
```

Auxiliary:
- Phase 1 + Phase 2 evidence remains untouched
- Audit doesn't restart or reconfigure the sidecar
- Memory watchdog from Phase 2 retry-3 stays armed (sidecar < 6GB, codex < 4GB)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Phase A: Probe classification

Input: fixture's 50 probes, each with `gold_memory_id` + `gold_doc_id`.

Algorithm (per probe):

```python
def classify(probe, memory_index_db):
    mid_ok = memory_index_db.exists(memory_id=probe.gold_memory_id)
    did_ok = memory_index_db.exists(doc_id=probe.gold_doc_id)
    replacement_mid = memory_index_db.find_by_doc_id(probe.gold_doc_id) if did_ok else None

    if mid_ok:
        return ("valid", probe.gold_memory_id)
    elif did_ok and replacement_mid:
        return ("replaced", replacement_mid)
    elif did_ok and not replacement_mid:
        return ("stale", None)
    else:
        return ("unusable", None)
```

Output: `evidence/probe-classification-2026-05-21.json` with shape:

```json
[
  {"probe_id":"fixture-001","class":"valid","resolved_memory_id":12345,"category":"arc-context"},
  {"probe_id":"fixture-004","class":"replaced","resolved_memory_id":99999,"original_gold_memory_id":1404,...}
]
```

### Phase B: Candidate coverage

For each `valid` or `replaced` probe, instrument the search pipeline to capture per-lane candidate sets BEFORE Stage 3 rerank.

Approach: wrap `dist/handlers/memory-search.js` (or its internal stages) with a hook that exposes pre-rerank candidates. If the handler doesn't expose them cleanly, write a thin Python or Node wrapper that calls into `lib/search/` stages directly:

- Stage 1 FTS5 → top-100 doc IDs
- Stage 1 vector → top-100 doc IDs
- Stage 2 RRF/fusion → top-100 doc IDs
- Final candidate pool entering Stage 3 → top-N (whatever the pipeline's K is — typically 30 or 50)

For each probe, check whether the resolved gold_memory_id appears in:
- FTS5 top-20 / 50 / 100
- Vector top-20 / 50 / 100
- Fused/RRF top-20 / 50 / 100
- Final pool

Output: `evidence/candidate-coverage-2026-05-21.json`:

```json
[
  {"probe_id":"fixture-001","resolved_memory_id":12345,
   "fts5_top_20":false,"fts5_top_50":false,"fts5_top_100":true,
   "vector_top_20":true,"vector_top_50":true,"vector_top_100":true,
   "fused_top_20":true,"fused_top_50":true,"fused_top_100":true,
   "final_pool":true,
   "fts5_rank":67,"vector_rank":8,"fused_rank":12}
]
```

### Phase C: Handler-path parity

Pick 5 probes (≥1 per category: arc-context, paraphrase, terminology).

Run each through:
1. The direct-handler-replay path Phase 1+2 used (`import dist/handlers/memory-search.js`)
2. The canonical daemon IPC socket (if reachable from the codex sandbox; if not, document and skip with REQ-003 marked P1)

Compare top-20 result lists. Note position differences, ID differences, score differences.

Output: `evidence/handler-parity-2026-05-21.md` — narrative table per probe.

### Phase D: Rerank score effect

For each `valid`/`replaced` probe (or a sample of 30+ if all valid+replaced > 30):

1. Run the bench with reranker enabled (bge-v2-m3 OR Qwen, doesn't matter — pick whichever the sidecar already has warm).
2. Capture per-candidate:
   - Pre-rerank position (from Phase B's fused/RRF rank)
   - Raw rerank sigmoid score [0,1]
   - Final blended score (raw_rerank * WEIGHT_RERANKER + other_weights * other_signals)
   - Post-rerank position
3. Compute: position delta (post - pre) per candidate, max absolute delta per probe.

Output: `evidence/rerank-effect-2026-05-21.json`:

```json
[
  {"probe_id":"fixture-001","candidates":[
    {"memory_id":12345,"pre_pos":12,"raw_rerank":0.7293,"blended":0.5821,"post_pos":3,"delta":-9}
  ],
  "max_abs_delta":9,"reranker_caused_top5_change":true}
]
```

Aggregate metric: `% of probes where reranker changed top-5`. If <10%, rerank scores aren't moving final order — that's the SCORING_INTEGRATION_WORK branch.

### Phase E: Branch decision

Compute on the `valid` + `replaced` subset:
- hit-rate@5_v / NDCG@10_v / recall@5_v
- pre-rerank-coverage_v (% of valid probes where gold appears in pre-rerank candidate pool)
- rerank-effect_v (% of valid probes where rerank changed top-5)

Branch logic:

```
if pre-rerank-coverage_v < 0.30:
    BRANCH = RETRIEVAL_WORK
    next_arc_recommendation = "new arc 012-retrieval-pipeline-audit (FTS / vector / RRF / chunking)"
elif rerank-effect_v < 0.10:
    BRANCH = SCORING_INTEGRATION_WORK
    next_packet_recommendation = "new packet 011/005-scoring-integration-fix (WEIGHT_RERANKER + score blending)"
else:
    BRANCH = PHASE_3_JUSTIFIED
    sharp_target = "rerank surfaces gold candidates correctly N% of time but ranks them at position M; train to flip"
```

Output to implementation-summary.md §Branch Decision with all 3 numbers + the chosen branch + the next-action recommendation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Each phase produces 1 evidence file + a short summary in implementation-summary.md.

- Phase A → §Probe Classification table (50-row summary table by class)
- Phase B → §Candidate Coverage table (per-lane top-20/50/100 hit rates aggregated across valid+replaced probes)
- Phase C → §Handler Parity narrative
- Phase D → §Rerank Effect table (% probes where rerank moved top-5; max-delta histogram)
- Phase E → §Valid-Only Subset Metrics + §Branch Decision
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

This phase IS the test. No new vitest/pytest required.

Sanity checks during audit:
- Phase A's classification function: run on 3 hand-picked probes and verify by inspection
- Phase B's candidate logger: verify total candidate count matches the pipeline's K (typically 50 or 100)
- Phase D's rerank logger: verify sum of raw_rerank + blended is consistent with the scoring formula in `confidence-scoring.ts`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 1 evidence (read-only)
- Phase 2 evidence (read-only)
- Fixture (read-only)
- memory_index SQLite DB (read-only)
- `dist/handlers/memory-search.js` for direct-replay path
- Daemon IPC socket (if sandbox permits)
- Sidecar (already configured; running canonical multi-model is fine)
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase modifies NOTHING in production. Rollback = delete the audit evidence/scripts/ directory.

```bash
rm -rf .opencode/specs/.../011/004-retrieval-and-fixture-audit/evidence/
rm -rf .opencode/specs/.../011/004-retrieval-and-fixture-audit/scripts/
```

No daemon restart, no env changes, no source code edits to revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dispatch -->
## 8. DISPATCH (cli-codex gpt-5.5 high fast)

**Pre-flight:** main agent reads `.opencode/skills/cli-codex/SKILL.md` (already loaded this session). Sidecar healthy at :8765. Memory watchdog optional — audit is read-mostly so memory shouldn't spike, but armable.

**Dispatch prompt** lives in the codex invocation block below.

**Invocation:**

```bash
codex exec \
  --model gpt-5.5 \
  -c model_reasoning_effort="high" \
  -c service_tier="fast" \
  -c approval_policy=never \
  --sandbox workspace-write \
  -c sandbox_workspace_write.network_access=true \
  -c sandbox_workspace_write.writable_roots='["/path/to/Public"]' \
  --cd /path/to/Public \
  -o /tmp/codex-audit-output.txt \
  --prompt-file /tmp/codex-audit-prompt.txt
```

- `network_access=true` so daemon IPC socket is reachable (Phase C parity check needs this; sandbox blocked it in Phase 2 retry).
- `workspace-write` so audit scripts + evidence files can be written.
- DO NOT touch `lib/search/**`, `cross-encoder.ts`, `stage3-rerank.ts`, `confidence-scoring.ts`, the sidecar, or the fixture.
<!-- /ANCHOR:dispatch -->
