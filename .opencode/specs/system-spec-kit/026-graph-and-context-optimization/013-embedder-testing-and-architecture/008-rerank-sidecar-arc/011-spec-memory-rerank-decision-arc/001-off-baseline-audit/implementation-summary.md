---
title: "Implementation Summary: OFF baseline audit + penalty removal [template:level_1/implementation-summary.md]"
description: "Phase-1 evidence. Filled by cli-codex execution: §Baseline Numbers, §Penalty Site, §Verdict, optional §Failure Analysis, §Commit Handoff."
trigger_phrases:
  - "011/001 summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/001-off-baseline-audit"
    last_updated_at: "2026-05-21T12:57:39Z"
    last_updated_by: "cli-codex"
    recent_action: "OFF baseline measured; verdict OFF_DEFICIENT"
    next_safe_action: "Dispatch Phase 2 bge-v2-m3 trial"
    blockers: []
    completion_state: "complete"
---
# Implementation Summary: OFF baseline audit + penalty removal

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: COMPLETE. Verdict: OFF_DEFICIENT.**

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Complete (OFF_DEFICIENT; no scoring patch) |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `011-spec-memory-rerank-decision-arc` |
| **Position in arc** | Phase 011 of 013 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Baseline Numbers

The OFF baseline was measured on the existing 50-probe fixture from `mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/rerank-ab-fixture.json` with `SPECKIT_CROSS_ENCODER=false` and `RERANKER_LOCAL=false`.

The normal JSON-RPC harness could not bind `daemon-ipc.sock` in this Codex sandbox (`listen EPERM`), and the fixture's frozen `gold_memory_ids` had 16 stale ids in the current `memory_index`. I therefore imported `dist/handlers/memory-search.js` directly, kept the same fixture/search arguments, and scored against `gold_doc_ids` plus any still-valid `gold_memory_ids`.

Evidence file: `evidence/off-baseline-2026-05-21.json`.

| Metric | Value | Threshold | Result |
|---|---:|---:|---|
| Fixture probes | 50 | 50 | PASS |
| Hit-rate@5 | 0.12 | >= 0.70 | FAIL |
| NDCG@10 | 0.11 | >= 0.65 | FAIL |
| Recall@5 | 0.12 | diagnostic | FAIL |
| Zero-recall categories | 0 | 0 | PASS |
| p50 latency | 469.904 ms | diagnostic | n/a |
| p95 latency | 557.529 ms | diagnostic | n/a |

Per-category breakdown:

| Category | Probes | Hit-rate@5 | Recall@5 | NDCG@10 | Zero-recall category |
|---|---:|---:|---:|---:|---|
| arc-context | 12 | 0.083 | 0.083 | 0.083 | no |
| paraphrase | 27 | 0.148 | 0.148 | 0.148 | no |
| terminology | 11 | 0.091 | 0.091 | 0.045 | no |

### Penalty Site

The penalty remains unpatched because the OFF baseline failed the decision gate.

- `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:38` defines `const WEIGHT_RERANKER = 0.20`.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:250` sets `rerankerFactor = hasReranker ? 1.0 : 0`.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:258` applies `WEIGHT_RERANKER * rerankerFactor`.

### Verdict

`OFF_DEFICIENT`.

The threshold rule was `OFF_ACCEPTABLE iff hit-rate@5 >= 0.70 AND NDCG@10 >= 0.65 AND no probe category has zero recall`. The OFF baseline only reached hit-rate@5 `0.12` and NDCG@10 `0.11`, so the reranker penalty removal is not justified by this fixture. No source-code patch was made.

### Failure Analysis

Failure mode counts:

| Failure type | Count | Probe IDs |
|---|---:|---|
| Recall miss | 44 | fixture-001, fixture-002, fixture-004, fixture-005, fixture-007, fixture-008, fixture-011, fixture-012, fixture-013, fixture-014, fixture-015, fixture-016, fixture-017, fixture-018, fixture-019, fixture-020, fixture-021, fixture-022, fixture-023, fixture-024, fixture-025, fixture-026, fixture-027, fixture-028, fixture-029, fixture-030, fixture-031, fixture-032, fixture-033, fixture-034, fixture-035, fixture-036, fixture-037, fixture-038, fixture-041, fixture-042, fixture-043, fixture-044, fixture-045, fixture-046, fixture-047, fixture-048, fixture-049, fixture-050 |
| Ranking inversion | 0 | none |
| Empty result | 0 | none |

Phase 2 target update written to `002-bge-v2-m3-trial/spec.md`: bge-v2-m3 must lift Recall@5 from `0.12` to at least `0.17`, cut probe-level recall misses from `44` to `<=22`, and keep ranking inversions at `0`.

### Patch

No patch. OFF failed the threshold gate, so `WEIGHT_RERANKER` stays unchanged.

### Tests Added

No vitest added. The patch path did not execute.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Executed as cli-codex gpt-5.5 high fast via `codex exec`. Network access remained disabled. The work stayed inside the pre-approved packet and OFF_DEFICIENT write paths.
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

### D-004: Do not patch `WEIGHT_RERANKER` on an OFF_DEFICIENT baseline
**Rationale:** The measured OFF baseline failed both numeric quality gates by a wide margin. Removing the reranker confidence penalty would make request quality look healthier while the fixture shows the retrieval path is not actually finding the target docs.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Baseline measurement:

```bash
cd .opencode/skills/system-spec-kit/mcp_server
SPECKIT_CROSS_ENCODER=false RERANKER_LOCAL=false \
  python3 benchmarks/benchmark-2026-05-20-rerank-ab/scripts/run_arm.py \
  --fixture benchmarks/benchmark-2026-05-20-rerank-ab/rerank-ab-fixture.json \
  --out /tmp/off-baseline-2026-05-21.jsonl \
  --arm A --runs 1 --cross-encoder false --reranker-local false --query-timeout 180
```

Output:

```text
Fixture gold_memory_ids missing from memory_index: [{'probe': 'fixture-004', 'memory_id': 1404}, {'probe': 'fixture-005', 'memory_id': 1047}, {'probe': 'fixture-008', 'memory_id': 1007}, {'probe': 'fixture-013', 'memory_id': 8184}, {'probe': 'fixture-014', 'memory_id': 8183}, {'probe': 'fixture-015', 'memory_id': 8189}, {'probe': 'fixture-016', 'memory_id': 8186}, {'probe': 'fixture-017', 'memory_id': 8192}, {'probe': 'fixture-023', 'memory_id': 8553}, {'probe': 'fixture-027', 'memory_id': 8551}, {'probe': 'fixture-028', 'memory_id': 8552}, {'probe': 'fixture-029', 'memory_id': 8547}, {'probe': 'fixture-031', 'memory_id': 8544}, {'probe': 'fixture-033', 'memory_id': 8543}, {'probe': 'fixture-037', 'memory_id': 4546}, {'probe': 'fixture-050', 'memory_id': 8551}]
```

Fallback direct-handler replay:

```bash
cd .opencode/skills/system-spec-kit/mcp_server
SPECKIT_CROSS_ENCODER=false RERANKER_LOCAL=false \
SPECKIT_SKIP_API_VALIDATION=true SPECKIT_RESPONSE_PROFILE_V1=false \
SPECKIT_INTENT_AUTO_PROFILE=false SPECKIT_PROGRESSIVE_DISCLOSURE_V1=false \
SPECKIT_FILE_WATCHER=false MEMORY_DB_PATH="$PWD/database/context-index.sqlite" \
node --input-type=module <direct handleMemorySearch fixture replay>
```

Output:

```json
{
  "status": "ok",
  "summary": {
    "fixture_count": 50,
    "hit_rate_at_5": 0.12,
    "ndcg_at_10": 0.11,
    "recall_at_5": 0.12,
    "zero_recall_categories": [],
    "verdict": "OFF_DEFICIENT"
  }
}
```

Vitest:

```text
Not run. No patch path executed because verdict is OFF_DEFICIENT.
```

Strict validation:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/001-off-baseline-audit --strict
```

Output:

```text
Spec Folder Validation v3.0.0
Folder: .../011-spec-memory-rerank-decision-arc/001-off-baseline-audit
Level:  1
Summary: Errors: 0  Warnings: 0
RESULT: PASSED
```

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc --strict
```

Output:

```text
Auto-enabled recursive validation: phase child folders detected.
Spec Folder Validation v3.0.0
Folder: .../011-spec-memory-rerank-decision-arc
Level:  phase
Summary: Errors: 0  Warnings: 0
RESULT: PASSED
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **50 probes is a small sample.** Verdicts close to the threshold should be marked as low-confidence and the §Verdict section should recommend a Phase 0 fixture extension before Phase 2.
2. **No code regression coverage outside scoring.** This phase doesn't touch cross-encoder.ts or sidecar code; rerank pipeline behavior remains untested by this phase.
3. **OFF_ACCEPTABLE supersedes Phases 2-3 but doesn't delete them.** The scaffolds remain available for future re-evaluation (e.g., corpus grows, OFF baseline degrades).
4. **Direct handler replay differs from the original harness startup path.** The normal benchmark harness could not bind the MCP daemon IPC socket inside this sandbox, so the evidence uses the same handler/search arguments without the stdio server wrapper.
<!-- /ANCHOR:limitations -->

## Commit Handoff

Files modified:

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/001-off-baseline-audit/evidence/off-baseline-2026-05-21.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/001-off-baseline-audit/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/001-off-baseline-audit/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/001-off-baseline-audit/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/001-off-baseline-audit/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial/spec.md`

Source-code files modified: none.

Suggested commit subject:

```text
docs(011/001): record off baseline deficient verdict
```
