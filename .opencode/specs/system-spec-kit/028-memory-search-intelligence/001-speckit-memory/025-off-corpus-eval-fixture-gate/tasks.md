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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/025-off-corpus-eval-fixture-gate"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tasked the off-corpus fixture and false-confirm gate build"
    next_safe_action: "Hold for implementation, no task has started yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/ground-truth.json"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/lib/eval/ground-truth-data.js"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-false-confirm-eval.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/lib/eval/eval-metrics.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-025-off-corpus-eval-fixture-gate"
      parent_session_id: null
    completion_pct: 0
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

- [ ] T001 Verify `computeCitabilityConfusionMetrics` and `falseGoodOnHardNegatives` are exported from `dist/lib/eval/eval-metrics.js` (lines 885-902) and confirm the read shape (`.opencode/skills/system-spec-kit/mcp_server/dist/lib/eval/eval-metrics.js`)
- [ ] T002 Confirm the six existing in-corpus hard-negative decoys each carry a real relevance-3 target so the new class must be separate, not a mutation (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/ground-truth.json`)
- [ ] T003 [P] Define how the `off_corpus` class reaches the search path, either extend the ground-truth source or a driver-side loader, with no fabricated targets (`.opencode/skills/system-spec-kit/mcp_server/dist/lib/eval/ground-truth-data.js`)
- [ ] T004 [P] Confirm the active embedder name is readable so the driver can record it in the report
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add the `off_corpus` class with kubernetes, oauth, kafka and terraform, every query carrying zero relevance rows and kubernetes pinned as the anchor (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/ground-truth.json`)
- [ ] T006 Surface the `off_corpus` class so the harness loads the absent-term queries with no fabricated targets (`.opencode/skills/system-spec-kit/mcp_server/dist/lib/eval/ground-truth-data.js`)
- [ ] T007 Build the driver scoring the `off_corpus` class, calling the existing `computeCitabilityConfusionMetrics`, reading `falseGoodOnHardNegatives` and recording the active embedder (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-false-confirm-eval.mjs`)
- [ ] T008 Add the default-off `SPECKIT_FALSE_CONFIRM_MAX_RATE` gate with a grandfather report mode, failing only when explicitly enabled and exceeded, rejecting a non-numeric env at parse (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-false-confirm-eval.mjs`)
- [ ] T009 Emit a re-runnable report carrying `falseConfirmRate`, the embedder name, the scored off-corpus terms and a generated-at stamp (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-false-confirm-eval.mjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Confirm every `off_corpus` query has zero relevance rows, no fabricated targets, the kubernetes anchor is present and a deletion-guard test fails when it is removed (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/ground-truth.json`)
- [ ] T011 Confirm the env unset and grandfather report mode record the rate and exit zero, the env below the rate exits non-zero, a non-numeric env is rejected, the verdict and scoring path are untouched (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-false-confirm-eval.mjs`)
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
