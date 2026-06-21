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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/015-c2-prodmode-recall-gate"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase task breakdown for C2 prod-mode recall gate scaffold"
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
- [ ] T002 Confirm the gate reuses the line-361 export and the harness gains no second `export {}` (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs`)
- [ ] T003 Define the gold-set ingestion path, either extend the harness ground-truth source (`GROUND_TRUTH_QUERIES`/`GROUND_TRUTH_RELEVANCES` in `dist/lib/eval/ground-truth-data.js`) or build a gate-side loader producing `relevancesByQuery` (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-spec-recall-gate.mjs`)
- [ ] T004 [P] Enumerate the measurability classes the gold set must cover
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Author the multi-target gold set with one relevance set per query across the measurability classes and no single-target query (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-corpus-golden.json`)
- [ ] T006 Build the gate reading only the prod completeRecall@3 column, with PROMOTION mode, REGRESSION mode, and a recall-verdict exit code distinct from the line 357 crash code (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-spec-recall-gate.mjs`)
- [ ] T007 Refuse an eval-lens input and reject a gold set carrying an empty relevance set at load (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-spec-recall-gate.mjs`)
- [ ] T008 Write the first baseline from a non-saturating prod run, with per-class and overall completeRecall@3 plus a generated-at stamp and source DB path (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-recall-baseline.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Confirm a degraded scratch prod profile fails REGRESSION mode with the recall-verdict exit code and a measured prod rise passes PROMOTION mode while an unchanged profile does not
- [ ] T010 Confirm the gold set has no single-target query, every query carries a class tag, and a missing baseline seeds a first baseline rather than scoring as complete
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
