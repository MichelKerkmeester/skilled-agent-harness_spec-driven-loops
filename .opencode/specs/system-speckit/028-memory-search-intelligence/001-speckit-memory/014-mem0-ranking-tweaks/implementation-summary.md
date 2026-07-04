---
title: "Implementation Summary: Mem0 Ranking + Extraction Bundle (028 Memory impl phase 014)"
description: "Partial-implementation summary for the 06 external-memory-systems cheap ranking + extraction bundle. Candidates 4 and 2 shipped (declarative regex entity config always-on, entity-cardinality penalty default-off). Candidate 8 resolved NO-TRANSFER. Candidates 1, 3, 5, 6 and 7 remain PENDING on their gates."
trigger_phrases:
  - "mem0 ranking tweaks summary 028"
  - "bm25 calibration implementation status"
  - "cascade extraction summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/014-mem0-ranking-tweaks"
    last_updated_at: "2026-07-04T17:51:00.375Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped candidates 4 always-on and 2 default-off. Closed 8 NO-TRANSFER"
    next_safe_action: "Run gate-zero corpus reindex"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-014-mem0-ranking-tweaks"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Mem0 Ranking + Extraction Bundle (028 Memory impl phase 014)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

> **Status: PARTIAL IMPLEMENTATION.** Candidate 4 (declarative regex entity config) shipped always-on with a parity test. Candidate 2 (entity-cardinality penalty) shipped behind the default-off `SPECKIT_CARDINALITY_PENALTY` flag with byte-identical default. Candidate 8 closed NO-TRANSFER because changed content already re-enters the save and indexing path. Candidates 1, 3, 5, 6 and 7 remain PENDING on their benchmark, dependency and schema gates. Shipped via commit `0cf96409d8`.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-memory-search-intelligence/001-speckit-memory/014-mem0-ranking-tweaks |
| **Completed** | Partial implementation 2026-06-19 |
| **Level** | 2 |
| **Actual Effort** | 2 shipped, 1 NO-TRANSFER and 5 pending |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This pass shipped two of the bundle's cheap candidates and closed a third as NO-TRANSFER. Candidate 4 moved the 5 inline entity rules into a declarative `EntityExtractionRule[]` plus a shipped JSON asset, loaded via `SPECKIT_ENTITY_CONFIG_PATH` with fail-closed fallback to the built-ins (always-on, parity-proven). Candidate 2 added the quadratic `cardinalityPenalty(n)=1/(1+0.001·(n−1)²)` on the degree channel in `graph-search-fn.ts`, gated by the default-off `SPECKIT_CARDINALITY_PENALTY` flag so the default path stays byte-identical. Candidate 8 closed NO-TRANSFER. The recall candidates (1, 3, 7) and the LLM-dependent extraction candidates (5, 6) remain pending behind their gates.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/extraction/entity-extractor.ts` | Modified | Declarative `EntityExtractionRule[]` + config loader with fail-closed fallback |
| `mcp_server/lib/extraction/entity-extraction-rules.json` | Created | Shipped JSON asset reproducing the built-in 5 rules byte-identically |
| `mcp_server/lib/search/graph-search-fn.ts` | Modified | Default-off quadratic cardinality penalty on the degree channel |
| `mcp_server/lib/search/search-flags.ts` | Modified | Register `SPECKIT_CARDINALITY_PENALTY` (default-off) |
| `mcp_server/tests/mem0-ranking-tweaks.vitest.ts` | Created | Config parity + cardinality-penalty default-off coverage |

> The recall-ranking candidates (1, 3, 7) plus `shared/algorithms/rrf-fusion.ts` are named in the spec/plan seams but remain unmodified until the gate-zero reindex enables a recall baseline.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The two shipped candidates landed as additive, separately reversible changes. Candidate 4 followed the correctness-class config refactor: lift the inline rules into a JSON asset, load with a fail-closed fallback and prove byte-identical extraction with a parity test. Candidate 2 followed the 027 default-off doctrine: wire the penalty at the non-excluded degree-channel seam behind a flag so the default path is unchanged. Candidate 8 was verified against the existing `memory_index_scan` reindex path and closed NO-TRANSFER. The recall and LLM-dependent candidates were not built. They wait on the gate-zero reindex (1, 3, 7), a lemmatizer-dependency decision (3), a live LLM extraction stage (5, 6) and a new entity vector index (7).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Ship candidates 4 and 2, defer the rest | Candidate 4 is a parity-proven config refactor and candidate 2 is a default-off flag, both cheap and reversible. The recall and LLM-dependent candidates need gates the bundle does not yet satisfy |
| 11 requested IDs collapse to 8 distinct candidates | `M0-`/`M-` prefix duplicates name the same 3 ranking candidates (BM25 calibration, cardinality penalty, lemmatization) |
| Gate-zero reindex precedes ranking work | Recall is unmeasurable against a ~25%-cold index (synthesis/06 + 07, regression-baseline rule) |
| Ranking tweaks flag-gated default-off | 027 doctrine: new results-affecting intelligence ships shadow-gated, earns activation on live evidence |
| Declarative regex config ships always-on | Correctness/config-class refactor, parity-proven equivalence to the inline 5 rules |
| Candidate 7 treated as shared-infra | No entity *vector* index exists, a scoring-only attempt is impossible (iter-6 REFINE) |
| Candidate 8 is verify-first | May collapse to NO-TRANSFER vs the existing `memory_index_scan` reindex path (iter-19 needs-verify) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Typecheck | Pass | - | 0 errors |
| Unit | Pass | - | 81 affected tests pass (`mem0-ranking-tweaks` 17 plus extractor and graph-search-fn) |
| Parity | Pass | - | Candidate 4 config extraction byte-identical to the built-ins |
| Recall benchmark | Not run | - | Gated on the gate-zero reindex (candidates 1, 3, 7) |
| Checklist | Partial | - | Shipped-candidate items checked, pending candidates left unverified |
| Strict validation | Pass | - | `validate.sh --strict` 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | Default-off path adds zero recall latency | Byte-identical default proven (candidate 2) | Met for shipped, pending for the rest |
| NFR-P02 | Cascade + linking bound extra LLM passes | Not measured | Pending (candidates 5, 6 unbuilt) |
| NFR-C01 | Config reproduces 5 rules exactly | Verified | Parity test green (candidate 4) |
| NFR-C02 | No ranking default-on without reindexed baseline | Enforced | Candidate 2 ships default-off |
| NFR-R01 | Every candidate independently reversible | Proven for shipped | Candidate 4 additive, candidate 2 flag-gated |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No benefit numbers**, every leverage/effort tag is structural inference, none is benchmarked (028 roadmap caveat).
2. **Gate-zero dependency**, no recall candidate (1-3, 7) can be measured until the corpus reindex restores the ~25% cold rows.
3. **Candidate 7 blocked**, the entity-store boost needs a new entity vector index (shared-infra) and may belong to the Wave-2 semantic-edge-layer initiative.
4. **Candidate 8 resolved.** Content-hash reprocessing closed NO-TRANSFER because changed content already re-enters the save and indexing path.
5. **spaCy dependency open**, candidate 3's lemmatizer choice (heavy spaCy vs lightweight) is unresolved.
6. **Memory-ID-graph constraint**, the causal graph is memory-ID → memory-ID (not entity-node), so candidate 6 needs a reframe before build (iter-6 systemic finding).
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Build the bundle after the gate-zero reindex | Shipped the two gate-free candidates first (4, 2) | The config refactor and the default-off penalty need no reindex, so they landed ahead of the recall work |
<!-- /ANCHOR:deviations -->
