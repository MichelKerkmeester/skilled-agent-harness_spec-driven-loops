---
title: "Implementation Summary: Rescue-Layer Ranking Authority Decision"
description: "Built eval-production parity so the benchmark measures the real pipeline, made the rescue-layer ranking mode selectable and benchmarkable (overwrite/additive/floor), and recorded an A/B/C benchmark — while deferring the ADR-002 authority decision because the current numbers are confounded by sparse vectors and stale eval ground truth."
trigger_phrases:
  - "rescue layer ranking authority"
  - "eval production parity harness"
  - "rescue mode benchmark"
  - "signal ordering contract"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/006-rescue-layer-ranking-authority-decision"
    last_updated_at: "2026-07-04T17:51:13.246Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built eval-parity harness + benchmarkable rescue modes; operator deferred ADR-002"
    next_safe_action: "Phase 007 ranking-filter-bypass (parity harness now unblocks 007/008)"
    blockers: []
    key_files:
      - "mcp_server/handlers/eval-reporting.ts"
      - "mcp_server/lib/search/rerank/retrieval-rescue.ts"
      - "mcp_server/core/db-state.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-016-006-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "ADR-002 rescue-authority: deferred by operator pending a clean re-benchmark (vectors reconciled + ground truth refreshed)"
    answered_questions:
      - "Operator chose to ship the parity harness + modes and defer the ADR-002 accept decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-rescue-layer-ranking-authority-decision |
| **Completed** | 2026-07-04 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The benchmark can finally measure the real system. Eval reporting and ablation used to run a legacy `hybridSearch` path, so any ranking conclusion was drawn from a composition the daemon never actually runs. That is fixed: eval and ablation now execute the production `executePipeline` (channels, co-activation, render-floor K=3 truncation), the ablation DB swap-and-restore rebinds every consumer including `graphSearchFn` to the restored production connection, and the eval DB path resolves from `import.meta.url` rather than the current directory. This parity harness is the prerequisite that unblocks the later ranking phases.

### Selectable, benchmarkable rescue authority

The retrieval-rescue layer's score rewrite is now a selectable mode — `overwrite` (the current `0.03*base + 0.78*lexical`), `additive` fold-in, or `floor` threshold — behind `SPECKIT_RETRIEVAL_RESCUE_MODE`, so the ranking authority can be A/B/C benchmarked instead of argued. The signal-ordering contract is pinned by a test, the stage2-fusion step header and pipeline README now describe the actual composition, and the two computed-but-discarded surfaces (the composite five-factor ranking surface and the interference-score write-path recompute) are dispositioned: the interference recompute is now an explicit no-op with a durable rationale, so no stage2 signal is silently computed and thrown away.

### The decision, deliberately deferred

The A/B/C benchmark ran on the parity harness and, surprisingly, favored the current overwrite (A) at completeRecall@3 0.40 versus 0.20 for additive and floor — the opposite of the deep-dive's "signal theater" hypothesis. But those numbers are confounded: the live vector shards are sparse (the phase-004 reconcile of 12,226 vector-missing rows is still daemon-side-pending), so the semantic signal the additive/floor modes lean on is degraded, and the eval ground truth is stale (142 missing relevances across 128 IDs). Rather than change live ranking on confounded data — or rubber-stamp the status quo — the operator chose to ship the harness and modes and leave ADR-002 Proposed, to be re-benchmarked once the system is healthy.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-5.5-fast (high) implemented. Its first pass correctly halted on a logic-sync scope conflict — REQ-001's ablation needs to disable the production trigger channel, which lives in `hybrid-search.ts`, a file outside the phase's Files-to-Change list — rather than silently touch it. Opus 4.8 authorized the minimal scope extension (an ablation-driven trigger-channel skip), and the re-dispatch built the harness, the benchmarkable modes, the contract test, the doc parity, and the dead-surface disposition. Opus 4.8 self-verified the harness (eval now calls `executePipeline`, db-state rebinds on swap/restore, path is `import.meta`-based), confirmed build clean and 31 tests green, and — after presenting the confounded benchmark — recorded the operator's decision to defer ADR-002.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| ADR-001: eval-production parity is a prerequisite (Accepted) | A ranking decision drawn from a non-production path is meaningless; the harness now runs the real pipeline |
| ADR-002: rescue-layer authority DEFERRED (operator) | The benchmark favors the overwrite but is confounded by sparse vectors + stale ground truth; changing live ranking on that data, or accepting it uncritically, both risk being wrong — re-benchmark when healthy |
| Authorize the minimal `hybrid-search.ts` scope extension | REQ-001's ablation genuinely needs to disable the production trigger lane; the change is a config-driven channel skip, flagged as a scope extension |
| Make rescue authority a config-selectable mode | Turns an argument into an experiment: overwrite/additive/floor are A/B/C-benchmarkable and reversible |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` (integrated main) | PASS (clean) |
| 006 vitest (eval-reporting + retrieval-rescue) | PASS (31/31, 1 skipped) |
| REQ-001 eval runs executePipeline | PASS (eval-reporting.ts imports + calls executePipeline) |
| REQ-002 swap/restore rebinds consumers | PASS (db-state rebindDatabaseConsumers) |
| REQ-003 cwd-independent path | PASS (import.meta.url) |
| REQ-004 A/B/C benchmark on parity harness | PASS (A 0.40, B 0.20, C 0.20 completeRecall@3) |
| REQ-005 ADR-002 authority | DEFERRED (operator; confounded benchmark) |
| REQ-006..010 contract test, doc parity, dead-surface | PASS |
| `validate.sh --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **ADR-002 is unresolved by design.** The rescue authority stays in `overwrite` mode (config-flippable); the accept decision waits for a re-benchmark once the phase-004 vector reconcile has run daemon-side and the eval ground truth is refreshed. This is a tracked follow-up, not a silent gap.
2. **The benchmark is vector-starved.** completeRecall@3 tops out at 0.40 because much of the corpus lacks vectors right now; the numbers will shift after the reconcile, which is why the decision is deferred.
3. **Harness effects need the daemon running this code.** Like the earlier phases, the eval-parity behavior applies when the daemon restarts with the new dist.
<!-- /ANCHOR:limitations -->
