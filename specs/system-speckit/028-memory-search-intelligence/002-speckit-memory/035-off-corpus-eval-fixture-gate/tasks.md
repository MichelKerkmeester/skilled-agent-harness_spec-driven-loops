---
title: "Tasks: Off-Corpus Eval Fixture and False-Confirm Gate [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "off corpus eval fixture"
  - "false confirm gate"
  - "kubernetes regression anchor"
  - "false good on hard negatives"
  - "off corpus hard negative class"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-speckit-memory/035-off-corpus-eval-fixture-gate"
    last_updated_at: "2026-07-04T17:50:58.258Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped off-corpus fixture, driver and default-off gate, all tests green"
    next_safe_action: "Hand the fixture to the downstream lexical-grounding floor phase that this guard validates"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-false-confirm-eval.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/false-confirm-eval.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-025-off-corpus-eval-fixture-gate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Off-Corpus Eval Fixture and False-Confirm Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Verified `computeCitabilityConfusionMetrics` and `falseGoodOnHardNegatives` are exported from `eval-metrics.ts:885-902` with shape `{ ...GateVerdictMetrics, hardNegativeCount, falseGoodOnHardNegatives }`, read via `CitabilityConfusionSample { predicted, expectedCitable, isHardNegative }` (`.opencode/skills/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts`)
- [x] T002 Confirmed the six in-corpus hard-negative decoys (ids 92-97) each carry a real relevance-3 target, so the new class is separate, not a mutation. The actual ground-truth source is `lib/eval/data/ground-truth.json`, copied to dist by finalize-dist (`.opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json`)
- [x] T003 [P] The `off_corpus` class reaches the search path through the ground-truth source, surfaced by `GROUND_TRUTH_QUERIES`, with zero relevance rows and no fabricated targets (`.opencode/skills/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts`)
- [x] T004 [P] Confirmed the active embedder name is readable from `vec_metadata`, the driver records `nomic-embed-text-v1.5` in the report
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Added the `off_corpus` class (ids 98-103) with kubernetes, oauth, kafka, terraform, graphql and webpack, every query carrying zero relevance rows, kubernetes pinned as the permanent anchor a deletion guard asserts (`.opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json`)
- [x] T006 Surfaced the `off_corpus` class through the `QueryCategory` union so the harness loads the absent-term queries with no fabricated targets, and exempted the class from the per-query target gates in the generator (`.opencode/skills/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts`)
- [x] T007 Built the driver scoring the `off_corpus` class through the production verdict path (`computeResultConfidence` then `assessRequestQuality`), calling the existing `computeCitabilityConfusionMetrics`, reading `falseGoodOnHardNegatives` and recording the active embedder, on a read-only copy DB (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-false-confirm-eval.mjs`)
- [x] T008 Added the default-off `SPECKIT_FALSE_CONFIRM_MAX_RATE` gate with a `SPECKIT_FALSE_CONFIRM_GRANDFATHER` report mode, failing only when explicitly enabled and exceeded, rejecting a non-numeric or out-of-range env at parse (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-false-confirm-eval.mjs`)
- [x] T009 Emits a re-runnable report carrying `falseConfirmRate`, the embedder block, the scored off-corpus terms, the per-query top-hit doc name and a generated-at stamp (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-false-confirm-eval.mjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 The vitest confirms every `off_corpus` query has zero relevance rows, no fabricated targets, the class is disjoint from the in-corpus decoys, the kubernetes anchor is present and `resolveOffCorpusClass` throws on a drifted target (`.opencode/skills/system-spec-kit/mcp_server/tests/false-confirm-eval.vitest.ts`)
- [x] T011 Verified live: env unset exits 0, grandfather at a 0.0 bar exits 0, the env below the measured 0.833 rate exits 1, a non-numeric env exits 1 at parse, and grep confirms no edit to `confidence-scoring` or the citation policy (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-false-confirm-eval.mjs`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (live driver report falseConfirmRate 0.833 on nomic, all gate modes confirmed)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
