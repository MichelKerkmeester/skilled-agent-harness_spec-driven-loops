---
title: "Spec: OFF baseline audit + WEIGHT_RERANKER penalty removal [template:level_1/spec.md]"
description: "Phase 1 of the rerank decision arc. Quantify the OFF baseline (no reranker) on the existing 50-probe fixture and decide whether reranking is actually load-bearing. If positional fallback hit-rate and ranking are acceptable, remove the boolean WEIGHT_RERANKER=0.20 confidence penalty so requestQuality stops reporting 'weak' on clean retrievals. May close the entire decision arc."
trigger_phrases:
  - "011/001 off baseline audit"
  - "weight reranker penalty removal"
  - "spec-memory off baseline"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/001-off-baseline-audit"
    last_updated_at: "2026-05-21T12:57:39Z"
    last_updated_by: "cli-codex"
    recent_action: "OFF baseline measured; verdict OFF_DEFICIENT"
    next_safe_action: "Dispatch Phase 2 bge-v2-m3 trial with Phase 1 targets"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: OFF baseline audit + WEIGHT_RERANKER penalty removal

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Complete (OFF_DEFICIENT; no scoring patch) |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `011-spec-memory-rerank-decision-arc` |
| **Position in arc** | Phase 011 of 013 (decision gate to Phase 2) |
| **Executor** | cli-codex gpt-5.5 high fast |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`mk-spec-memory` reports `requestQuality: 'weak'` on every `memory_search` because the local reranker provider slot in `cross-encoder.ts:54` has no sidecar to talk to. The `WEIGHT_RERANKER=0.20` confidence factor is BOOLEAN — `hasReranker ? 1.0 : 0.0` — so max achievable result confidence drops from 1.00 to 0.80 across the board regardless of retrieval quality.

This penalty was added on the assumption that reranking is load-bearing. The arc 008 benchmarks haven't actually validated that assumption against the OFF baseline; they've validated specific rerankers (Qwen, ms-marco) against each other. The ms-marco bench's −6 hits below OFF is the strongest signal that **positional fallback may already be good enough** for this corpus.

### Purpose

Determine whether the entire rerank arc is worth executing. If OFF baseline hit-rate, NDCG@10, and recall@5 on the 50-probe fixture are within acceptable bounds, the right action is removing the `WEIGHT_RERANKER` penalty (so confidence reflects retrieval quality, not reranker presence) and closing the arc. If OFF is genuinely deficient — bad ordering, low recall, or specific corpus regions where positional fallback fails — Phase 2 fires next with a real target metric to beat.

### Why this is the right starting point

Cost: ~1 hour wall-clock. Single source-code change candidate (the `WEIGHT_RERANKER` constant). No new models, no training data, no sidecar config. The work is mostly running a benchmark we already have and inspecting the output. If the answer is "OFF is fine," we save Phases 2-3 entirely.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Run the existing 50-probe spec-memory rerank fixture with `SPECKIT_CROSS_ENCODER=false`. Output: hit-rate, NDCG@10, recall@5, per-probe wins/losses.
- Compare against the prior Phase 004 bench's OFF rows where available.
- If hit-rate ≥ 0.70 and NDCG@10 ≥ 0.65 (these are starting thresholds; phase plan may revise based on what's already in the fixture spec): identify the `WEIGHT_RERANKER` penalty in `lib/search/scoring/` (or wherever `requestQuality` is computed) and propose the removal/conditional patch.
- Land the patch + a focused unit test that confirms `requestQuality` reflects retrieval quality, not reranker presence.
- Document the OFF baseline numbers as the reference for Phases 2 and 3 (or as the arc's terminus if Phase 1 succeeds).

### Out of Scope

- Adding new probes to the fixture (use existing 50 probes only; fixture extension is a separate Phase 0 if needed).
- Touching `cross-encoder.ts` or the sidecar — this phase is purely about whether the penalty is justified.
- Removing the rerank pipeline code itself (keep it for Phases 2-3 if Phase 1 escalates).
- Updating `RERANKER_LOCAL` legacy shim behavior.

### Files likely to be modified

- `.opencode/skills/system-spec-kit/mcp_server/lib/search/scoring/` (find `WEIGHT_RERANKER` constant) — single conditional or removal
- `.opencode/skills/system-spec-kit/mcp_server/tests/` — new vitest validating `requestQuality` calculation
- `.opencode/specs/.../011-spec-memory-rerank-decision-arc/001-off-baseline-audit/implementation-summary.md` — baseline numbers table
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | OFF baseline measured on the 50-probe fixture | hit-rate, NDCG@10, recall@5 captured in implementation-summary §Baseline Numbers |
| REQ-002 | Comparison against arc 008 Phase 004's OFF row if it exists | Side-by-side table; deltas explained or marked N/A |
| REQ-003 | Penalty location identified | File:line citation in implementation-summary §Penalty Site |
| REQ-004 | Patch landed: `WEIGHT_RERANKER` no longer penalizes when reranker is unconfigured | Diff fits the conditional pattern (don't penalize when sidecar absent + provider != 'cloud'); rationale recorded |
| REQ-005 | Vitest passes that asserts `requestQuality` reflects retrieval quality not reranker presence | Test file path captured in implementation-summary; `npx vitest run <test>` exit 0 |
| REQ-006 | Strict-validate exit 0 | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` |
| REQ-007 | Phase verdict | Either `OFF_ACCEPTABLE` (arc terminates after this phase) or `OFF_DEFICIENT` (escalate to Phase 2 with target metrics) — recorded in implementation-summary §Verdict |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Per-probe failure analysis if OFF_DEFICIENT | List the probe IDs where OFF underperforms; categorize by failure type (ranking inversion, recall miss, etc.) |
| REQ-009 | Update arc parent continuity to reflect Phase 1 outcome | `_memory.continuity.recent_action` and `next_safe_action` updated in `011-spec-memory-rerank-decision-arc/spec.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Baseline numbers exist and are reproducible (`SPECKIT_CROSS_ENCODER=false` env, fixture path, command in implementation-summary)
- **SC-002**: Verdict (OFF_ACCEPTABLE or OFF_DEFICIENT) is supported by the data, not by intuition
- **SC-003**: If OFF_ACCEPTABLE: the penalty patch is shipped + tested + Phase 2/3 are marked superseded
- **SC-004**: If OFF_DEFICIENT: failure mode categorization gives Phase 2 a concrete target
- **SC-005**: Strict-validate exit 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| 50-probe fixture is too small to be diagnostic | Medium | Verdict is statistically weak | Note in §Verdict the sample-size caveat; if borderline, recommend Phase 0 fixture extension before Phase 2 |
| `WEIGHT_RERANKER` is wired through multiple call sites | Medium | Patch becomes larger than expected | Constrain to the boolean penalty path only; do not refactor confidence calculation |
| Existing Phase 004 OFF row uses a different fixture version | Low | Cross-arc comparison meaningless | Mark prior data as N/A in the comparison table; rely on this phase's run as the canonical baseline |

Dependencies:

- Existing 50-probe fixture at `004-spec-memory-rerank-benchmark/` (read-only)
- `SPECKIT_CROSS_ENCODER` flag plumbing in `search-flags.ts` (already supports `false`)
- `requestQuality` calculation site (TBD — identified during Phase 1)
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Q1**: What hit-rate / NDCG floor counts as "acceptable" without a reranker? Plan §Thresholds proposes 0.70 / 0.65 as starting points; final values may shift after seeing the actual numbers.
- **Q2**: Should the penalty be **removed** or **made conditional on `provider=='local' && sidecar_present'`**? The conditional path leaves room for Phase 2/3 to reinstate the penalty when a real reranker ships. Default recommendation: conditional.
- **Q3**: Are there probe categories in the fixture where OFF is known-weak (e.g., short queries against long docs)? Inspect the fixture spec to find out before running, so failure analysis has a structural lens.
<!-- /ANCHOR:questions -->
