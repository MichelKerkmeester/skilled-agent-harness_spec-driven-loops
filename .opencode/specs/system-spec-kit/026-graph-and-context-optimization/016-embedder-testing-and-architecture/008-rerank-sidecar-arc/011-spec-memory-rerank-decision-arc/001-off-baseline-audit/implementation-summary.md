---
title: "Implementation Summary: OFF baseline audit + penalty removal [template:level_1/implementation-summary.md]"
description: "Phase-1 evidence. Filled by cli-codex execution: §Baseline Numbers, §Penalty Site, §Verdict, optional §Failure Analysis, §Commit Handoff."
trigger_phrases:
  - "011/001 summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/001-off-baseline-audit"
    last_updated_at: "2026-05-21T13:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffold authored"
    next_safe_action: "Cli-codex dispatch to fill"
    blockers: []
    completion_state: "scaffold-only"
---
# Implementation Summary: OFF baseline audit + penalty removal

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: SCAFFOLD.** Filled by cli-codex execution per `plan.md` §Dispatch.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Scaffold (execution pending) |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `011-spec-memory-rerank-decision-arc` |
| **Position in arc** | Phase 1 of 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

To be filled by execution. Expected sections:

- §Baseline Numbers: hit-rate@5 / NDCG@10 / recall@5 / per-category breakdown on the 50-probe fixture with `SPECKIT_CROSS_ENCODER=false`
- §Penalty Site: file:line citation of the `WEIGHT_RERANKER` constant + the boolean penalty expression
- §Verdict: OFF_ACCEPTABLE or OFF_DEFICIENT with the supporting threshold check
- §Failure Analysis (if OFF_DEFICIENT): per-category counts + probe IDs
- §Patch (if OFF_ACCEPTABLE): diff summary + new helper `isRerankerExpected()` signature
- §Tests Added (if OFF_ACCEPTABLE): test file path + assertions
- §Commit Handoff: exact paths modified
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

To be filled. Expected: cli-codex gpt-5.5 high fast single dispatch per plan.md §Dispatch. Network access disabled.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001 (scaffolded): Phase 1 measures before any code change
**Rationale:** The arc 008 benchmarks compared rerankers to each other; none of them quantitatively validated whether reranking is load-bearing. Removing the penalty without measurement risks shipping a permanent quality regression. Measurement first, patch second.

### D-002 (scaffolded): Conditional penalty, not unconditional removal
**Rationale:** Phases 2-3 may reintroduce a real reranker. The penalty should fire when reranking is INTENDED but UNAVAILABLE (cloud provider configured, sidecar down), not when reranking is correctly unconfigured. A `isRerankerExpected()` helper makes the intent explicit.

### D-003 (scaffolded): No fixture extension in this phase
**Rationale:** Phase invariant #1 (same fixture across all phases) requires Phase 0 fixture extension as a separate concern. If 50 probes is statistically too thin, escalation is documented but not silently expanded.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

To be filled. Commands the executor must run + paste output for:

```bash
# Baseline measurement
cd .opencode/skills/system-spec-kit/mcp_server
SPECKIT_CROSS_ENCODER=false RERANKER_LOCAL=false \
  npm run <bench-target> -- --fixture <path> --mode off-baseline 2>&1 | tee /tmp/off-baseline.log

# New vitest (if Patch path)
npx vitest run tests/<new-test-file>

# Strict-validate
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/001-off-baseline-audit --strict
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc --strict
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **50 probes is a small sample.** Verdicts close to the threshold should be marked as low-confidence and the §Verdict section should recommend a Phase 0 fixture extension before Phase 2.
2. **No code regression coverage outside scoring.** This phase doesn't touch cross-encoder.ts or sidecar code; rerank pipeline behavior remains untested by this phase.
3. **OFF_ACCEPTABLE supersedes Phases 2-3 but doesn't delete them.** The scaffolds remain available for future re-evaluation (e.g., corpus grows, OFF baseline degrades).
<!-- /ANCHOR:limitations -->
