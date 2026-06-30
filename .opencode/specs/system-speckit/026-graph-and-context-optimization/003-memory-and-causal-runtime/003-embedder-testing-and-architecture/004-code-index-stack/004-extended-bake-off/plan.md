---
title: "Plan: 016/006/004 Extended Code-Embedder Bake-Off"
description: "Phases for nomic + stella benchmark"
trigger_phrases:
  - "016/006/004 plan"
  - "extended bake-off plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off"
    last_updated_at: "2026-05-18T00:40:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored phases"
    next_safe_action: "Phase 1 T001"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000006004"
      session_id: "016-006-004-extended-bake-off-plan"
      parent_session_id: "016-006-004-extended-bake-off"
    completion_pct: 5
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 016/006/004 Extended Code-Embedder Bake-Off

<!-- ANCHOR:summary -->
## 1. SUMMARY

Author reusable benchmark harness (extends 018/003 ad-hoc approach). Pre-pull models, then loop: reset → reindex → probe 18-pair fixture → record. Run nomic-CodeRankEmbed + stella_en_400M_v5. Document daemon-crash workarounds. Compare to 018/003 baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Harness exists | `evidence/run-extended-bake-off.sh` is executable + idempotent |
| Pre-pull works | Both models load locally before benchmark loop starts |
| Reindex completes | Each candidate produces 127K-ish chunks without daemon crash |
| Hit-rate recorded | CSV + JSONL emitted with same columns as 018/003 |
| Comparison table | `evidence/comparison-table.md` lists all 4 candidates |
| Strict-validate | PASSED |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
Harness: bash script (evidence/run-extended-bake-off.sh)
  ├─ Pre-pull models via Python (sentence-transformers SentenceTransformer(model_name))
  │   ├─ Fail-fast if model can't load before benchmark loop
  │   └─ Workaround for daemon-crash issue: avoid first-load race
  ├─ For each candidate in [nomic-CodeRankEmbed, stella]:
  │   ├─ Kill daemon if running
  │   ├─ Set COCOINDEX_CODE_EMBEDDING_MODEL=<candidate>
  │   ├─ ccc reset --force
  │   ├─ ccc index (capture exit code + stderr)
  │   ├─ On failure: 1 retry with --foreground flag
  │   ├─ ccc search <query> --limit 5 (per fixture pair)
  │   └─ Record hit/miss, latency, top-1
  └─ Emit CSV + JSONL + runlog
```
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- T001 Pre-pull both models (verify load before benchmark)
- T002 Snapshot CocoIndex state (current jina-code index for restore)
- T003 Author `evidence/run-extended-bake-off.sh`

### Phase 2: Implementation
- T004 Run benchmark for nomic-CodeRankEmbed (with retry if daemon crashes)
- T005 Run benchmark for stella_en_400M_v5 (verify vec_1024 schema created)
- T006 Capture results to CSV/JSONL/runlog

### Phase 3: Verification
- T007 Generate `evidence/comparison-table.md` (4-row table)
- T008 If any candidate beats jina-code 38.9%: author ADR-002 in `decision-record.md`
- T009 Restore CocoIndex to jina-code baseline (rollback)
- T010 Strict-validate + commit
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Use same 18-pair fixture from 006/002-baseline-fixture
- Same hit normalization (across `.opencode/.claude/.codex/.gemini` mirror trees)
- Same median + p95 latency capture
- Same fixture-validate.sh contract (10-20 pairs)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 018/003 fixture file (read-only)
- `ccc` CLI + CocoIndex daemon
- sentence-transformers Python install
- MPS-active config (verified via _resolve_device(None) == "mps")
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Trigger | Action |
|---|---|
| Both candidates fail | Restore CocoIndex to jina-code baseline; document blocker; ADR records "no improvement candidate found" |
| stella succeeds but worse than jina-code | Restore jina-code; document; no ADR-002 |
| nomic succeeds + beats jina-code | Author ADR-002 recommending swap |
| Daemon stuck after benchmark | `ccc reset --force` + manual daemon kill |
<!-- /ANCHOR:rollback -->
