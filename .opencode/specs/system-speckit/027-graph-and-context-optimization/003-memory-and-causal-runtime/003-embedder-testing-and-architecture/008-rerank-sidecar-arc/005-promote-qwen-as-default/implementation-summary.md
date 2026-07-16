---
title: "Implementation Summary: Promote Qwen3-Reranker-0.6B as the spec-memory default [template:level_1/implementation-summary.md]"
description: "Phase 005 executed the HOLD path from phase 004's benchmark verdict. Qwen remains opt-in; docs and arc metadata were updated without source-code or runtime-config changes."
trigger_phrases:
  - "005 implementation summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/005-promote-qwen-as-default"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "HOLD path executed per phase 004 verdict"
    next_safe_action: "Arc 008 closed; follow-on requires CPU to MPS device tuning before re-benchmark"
    blockers: []
    completion_state: "complete"
---
# Implementation Summary: Promote Qwen3-Reranker-0.6B as the spec-memory default

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: COMPLETE (HOLD).** Phase 004's benchmark report directed HOLD, so phase 005 documents the opt-in Qwen sidecar path and leaves defaults unchanged.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Complete (HOLD) |
| **Created** | 2026-05-20 |
| **Completed** | 2026-05-20 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` |
| **Position in arc** | Phase 005 of 5 — final HOLD decision |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 004 §8 RECOMMENDATIONS, quoted verbatim:

````markdown
## 8. RECOMMENDATIONS

**Phase 005 verdict: `HOLD`.**

Promotion rule:

```text
PROMOTE if:
  (hit_rate_delta_pp >= +6 OR MRR_delta >= +0.10 with non-overlapping CIs)
  AND p95_delta_ms <= +400
Else HOLD.
```

Observed:

```text
hit_rate_delta_pp = +0.4
MRR_delta = +0.004
p95_delta_ms = +9832.7
```

Recommendation for phase 005: `HOLD`.

Do not promote Qwen-backed reranking as the spec-memory default from this run. Phase 005 should keep Qwen available as an opt-in sidecar path, document the env toggle, and treat cross-encoder timeout/device tuning as a prerequisite before any future promotion attempt.
````

### Path executed: HOLD

- `SPECKIT_CROSS_ENCODER` remains default-off.
- `cross-encoder.ts:55` remains `cross-encoder/ms-marco-MiniLM-L-6-v2`.
- The 4 runtime configs remain unchanged.
- `ENV_REFERENCE.md` now describes Qwen sidecar reranking as opt-in, with the p95 and fallback findings from phase 004.
- `embedder_architecture.md` now documents Stage 3 Qwen sidecar reranking as opt-in and links the benchmark report.
- `system-rerank-sidecar/SKILL.md` now names spec-memory as an opt-in consumer and records the CPU sustained-load latency limitation.
- The arc parent now marks phase 005 `Complete (HOLD)` and `graph-metadata.json.derived.status` as `complete`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

- Phase A read `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/benchmark_report.md` §8 and consumed its `HOLD` verdict mechanically.
- Phase B applied only doc/metadata edits: `ENV_REFERENCE.md`, `embedder_architecture.md`, `system-rerank-sidecar/SKILL.md`, this packet's docs, and arc-parent docs/metadata.
- Phase C closed the phase parent by setting the phase-map row to `Complete (HOLD)` and `derived.last_active_child_id` to `005-promote-qwen-as-default`.

No source code, launcher scripts, or runtime configs were edited.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001: HOLD path executed
**Decision:** Follow phase 004's `HOLD` verdict without re-litigating the benchmark.
**Rationale:** The promotion rule failed on both quality and latency: `hit_rate_delta_pp = +0.4`, `MRR_delta = +0.004`, and `p95_delta_ms = +9832.7`.

### D-002: Qwen sidecar ships opt-in only
**Decision:** Document `SPECKIT_CROSS_ENCODER=true` as the opt-in path for development and single-query use.
**Rationale:** The sidecar infrastructure from phases 001-003 is still useful, but sustained-load CPU latency is not fit for default-on behavior.

### D-003: Defaults stay unchanged
**Decision:** Keep `cross-encoder.ts:55` and all runtime configs unchanged.
**Rationale:** Phase 004 made CPU-to-MPS device tuning a prerequisite before any future promotion attempt.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Evidence |
|-------|---------|----------|
| ENV doc opt-in row | `grep -n "Default OFF (opt-in)" .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | One hit at line 212 |
| Source no-touch audit | `git diff HEAD~1 -- .opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` | Empty output |
| Runtime config no-touch audit | `git diff HEAD~1 -- .mcp.json opencode.json .gemini/settings.json .codex/config.toml` | Empty output |
| Phase packet strict validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/005-promote-qwen-as-default --strict` | Exit 0; `RESULT: PASSED` |
| Arc parent strict validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc --strict` | Exit 0; `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

| Limitation | Impact | Follow-up |
|------------|--------|-----------|
| Qwen-on-CPU sustained-load latency | Phase 004 measured p95 around 11s and all Arm B probes fell back after sidecar timeout. | Tune CPU-to-MPS device selection before any re-benchmark. |
| HOLD keeps the feature opt-in | Operators must set `SPECKIT_CROSS_ENCODER=true` to exercise the Qwen sidecar path. | ENV_REFERENCE.md and the sidecar skill now document the toggle. |
| CocoIndex still has its own Qwen path | Shared-sidecar deduplication is not complete across MCPs. | Track separately after device tuning; not part of phase 005. |
<!-- /ANCHOR:limitations -->

## Commit Handoff

Subject: `feat(016/008/005): arc 008 closes — HOLD path (sidecar ships opt-in)`

Paths:

- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`
- `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md`
- `.opencode/skills/system-rerank-sidecar/SKILL.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/005-promote-qwen-as-default/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/005-promote-qwen-as-default/plan.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/005-promote-qwen-as-default/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/005-promote-qwen-as-default/implementation-summary.md`

Notes:

- HOLD path executed per phase 004.
- `cross-encoder.ts:55` default unchanged.
- `SPECKIT_CROSS_ENCODER` stays default-off in runtime configs.
- Orchestrator handles `git add`, commit, and push.
