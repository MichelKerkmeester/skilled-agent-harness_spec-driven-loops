---
title: "Tasks: C2 Prod-Mode Recall Gate [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "prod mode recall gate"
  - "complete recall at 3"
  - "spec corpus golden"
  - "run spec recall gate"
  - "retrieval regression gate"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-spec-data-quality/003-retrieval-gated-tuning/015-prodmode-recall-gate"
    last_updated_at: "2026-07-04T17:11:50.789Z"
    last_updated_by: "markdown-agent"
    recent_action: "Round-2 remediation: retasked gate for @3/@5/@8 plus order-sensitive metric"
    next_safe_action: "Hold for implementation, no task has started yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-corpus-golden.json"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-spec-recall-gate.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-recall-baseline.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: C2 Prod-Mode Recall Gate

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

- [ ] T001 Verify the existing export at `run-eval-v2.mjs:361` covers `buildSearchLenses`, `meanCompleteRecallProfile`, and `MEASURABILITY_CLASSES`, with no lens-body edit (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs`)
- [ ] T002 Confirm the gate reuses the line-361 export plus the pure `computeNDCG` and `computeMRR` from `dist/lib/eval/eval-metrics.js`, and the harness gains no second `export {}` (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs`)
- [ ] T003 Define the gold-set ingestion path, either extend the harness ground-truth source (`GROUND_TRUTH_QUERIES`/`GROUND_TRUTH_RELEVANCES` in `dist/lib/eval/ground-truth-data.js`) or build a gate-side loader producing `relevancesByQuery` (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-spec-recall-gate.mjs`)
- [ ] T004 [P] Enumerate the citable measurability classes the gold set must cover and confirm `hard_negative` is excluded from the completeRecall pool
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Author the multi-target gold set with one relevance set per citable-class query and no single-target citable query, the `hard_negative` class excluded from the completeRecall pool (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-corpus-golden.json`)
- [ ] T006 Build the gate reading only the prod completeRecall@3/@5/@8 columns plus the order-sensitive NDCG@K and a top1 guard, run ceiling-aware, with PROMOTION mode, REGRESSION mode, and a recall-verdict exit code distinct from the line 357 crash code (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-spec-recall-gate.mjs`)
- [ ] T007 Refuse an eval-lens input and reject a gold set carrying an empty citable-class relevance set at load (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-spec-recall-gate.mjs`)
- [ ] T008 Write the first baseline from a non-saturating prod run, with per-class and overall completeRecall@3/@5/@8, NDCG@K and top1, a per-class headline-K plus a generated-at stamp and source DB path (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-recall-baseline.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Confirm a degraded scratch prod profile fails REGRESSION mode with the recall-verdict exit code, a measured prod @3/@5/@8 rise that holds NDCG@K and top1 passes PROMOTION mode while an unchanged profile and a top1-degrading window-membership rise both fail, and a class at its K/N ceiling does not trip REGRESSION
- [ ] T010 Confirm the gold set has no single-target citable query, every citable query carries a class tag, `hard_negative` is excluded from the completeRecall pool, and a missing baseline seeds a first baseline rather than scoring as complete
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
