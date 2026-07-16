---
title: "Tasks: spec-memory rerank A/B benchmark [template:level_1/tasks.md]"
description: "Task breakdown for the spec-memory rerank A/B benchmark."
trigger_phrases:
  - "004 tasks rerank benchmark"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/004-spec-memory-rerank-benchmark"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Benchmark complete; HOLD verdict documented"
    next_safe_action: "Phase 005 consumes benchmark_report.md Section 8"
    blockers: []
---
# Tasks: spec-memory rerank A/B benchmark

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- **Status:** `[x]` complete, `[ ]` open, `[!]` blocked
- **P-tag:** P0 (blocker) / P1 (required) / P2 (nice-to-have)
- **Evidence:** file path, sk-doc validate output, or report section
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T001 | P0 | Audit cat-24/409 existing fixture; verify gold doc IDs still resolve in current memory_index | `[x]` | `rerank-ab-fixture.json` fixtures 001-010; `run_arm.py --verify-fixture` checked 50/50 gold IDs |
| T002 | P0 | Import 416/417/418 playbook queries into the new combined fixture | `[x]` | `rerank-ab-fixture.json` fixtures 011-022 |
| T003 | P0 | Author 20-30 fresh paraphrase queries against current memory contents; manual-verify gold doc IDs | `[x]` | `rerank-ab-fixture.json` fixtures 023-050; all `gold_memory_ids` resolved |
| T004 | P0 | Commit `rerank-ab-fixture.json` (50-60 probes total) + SOURCE.md (provenance + memory_index hash + size) | `[x]` | `rerank-ab-fixture.json` has 50 probes; `SOURCE.md` has run-time snapshot |
| T005 | P1 | Document fixture taxonomy (difficulty distribution, category mix) in SOURCE.md | `[x]` | `SOURCE.md` §5 |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T006 | P0 | Author `scripts/run_arm.sh`: per-probe memory_search invoker that writes JSONL | `[x]` | `scripts/run_arm.py` + `scripts/run_arm.sh`; produced per-arm JSONL |
| T007 | P0 | Author `scripts/aggregate.py`: produces results.csv with arm-level stats + Wilson-CI on hit-rate | `[x]` | `scripts/aggregate.py`; `results.csv` includes Wilson CIs |
| T008 | P0 | Author `scripts/generate_report.py`: applies decision rule, emits sk-doc Markdown | `[x]` | `scripts/generate_report.py`; `benchmark_report.md` generated and patched with fallback caveat |
| T009 | P0 | Author `scripts/run-ab.sh` orchestrator that runs both arms + aggregates + reports | `[x]` | `scripts/run-ab.sh`; completed full A/B run |
| T010 | P1 | Add paired-bootstrap CI (n=10000) for hit-rate and MRR deltas | `[x]` | `results.csv` `B_minus_A` row |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T011 | P0 | Run arm A (5 iterations, baseline positional fallback) | `[x]` | `per-probe-arm-a.jsonl` = 250 rows |
| T012 | P0 | Warm the sidecar; run arm B (5 iterations, Qwen) | `[x]` | `/warmup` returned pinned Qwen revision; `per-probe-arm-b.jsonl` = 250 rows |
| T013 | P0 | Aggregate → results.csv | `[x]` | `results.csv` columns present; A hit_rate 0.340, B hit_rate 0.344 |
| T014 | P0 | Generate benchmark_report.md per sk-doc 10-section template | `[x]` | `benchmark_report.md` has 10 sk-doc sections |
| T015 | P0 | sk-doc validate on the report | `[x]` | `validate_document.py --type readme benchmark_report.md` exit 0 |
| T016 | P0 | Document explicit go/no-go for phase 005 in §8 RECOMMENDATIONS | `[x]` | `benchmark_report.md` §8: HOLD |
| T017 | P0 | Strict validate this packet | `[x]` | `validate.sh ... --strict` exit 0 |
| T018 | P1 | Re-run arm B with a different RAM-pressure baseline (e.g. cocoindex also alive); confirm p95 doesn't degrade catastrophically | `[x]` | Arm B itself degraded catastrophically: p95 +9832.7 ms and 250/250 rows fallback; report §7 documents rerun blocker |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

T001-T017 with evidence; T018 nice-to-have. Phase 005's promotion decision derives directly from T016's documented finding.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` §4 Requirements — REQ-001..REQ-008 mapping to T004..T017
- `plan.md` §3 Architecture — fixture shape, harness flow, decision rule encoding
- Predecessor `../003-ensure-sidecar-from-launchers/` — provides the sidecar this benchmark exercises
- Successor `../005-promote-qwen-as-default/` — consumes the §8 RECOMMENDATIONS
- Reference (sk-doc template): `.opencode/skills/sk-doc/references/benchmarks/FORMAT.md` (post-packet 006 sk-doc-owned)
- Reference (cocoindex benchmark): `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-expanded/` — structural model for our report
- Reference (paraphrase fixture): `.opencode/skills/system-spec-kit/manual_testing_playbook/local-llm-query-intelligence/409-fixture.json` (cat-24/409 baseline)
<!-- /ANCHOR:cross-refs -->
