---
title: "Tasks: Eval Benchmark Fidelity Remediation"
description: "PENDING task list for the flag-eval driver fix and criterion-4 re-run."
trigger_phrases:
  - "028 eval benchmark fidelity tasks"
  - "flag eval driver fix tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/004-review-remediation/001-eval-benchmark-fidelity"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created PENDING eval-benchmark-fidelity tasks"
    next_safe_action: "Reproduce the prior benchmark"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-tasks-006-001-eval-benchmark-fidelity"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Eval Benchmark Fidelity Remediation

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

- [x] T001 Reproduce the prior criterion-4 run and save its per-flag deltas as baseline. Evidence: prior output copied to `/tmp/speckit-retrieval-flag-eval.PRIOR-baseline.json` (summary_fusion_lane delta -0.0528, cardinality_penalty 0, trigger row delta 0 / pValue null / unchanged 60).
- [x] T002 Confirm the `routeQuery()` vs `forceAllChannels` contract at `hybrid-search.ts:1394-1396`. Evidence: `activeChannels = options.forceAllChannels ? new Set(allPossibleChannels) : new Set(routeResult.channels)`. Complexity router is default-on (`isComplexityRouterEnabled` returns `raw !== 'false'`), so default queries route to a restricted subset.
- [x] T003 Confirm the `exactTriggerSearch` call site at `hybrid-search.ts:1504` lacks the trigger guard. Evidence: line 1504 calls `exactTriggerSearch(query, options)` unconditionally (no `activeChannels.has('trigger')` guard) and `exactTriggerSearch` (783-826) only reads `{limit, specFolder, includeArchived}`, ignoring `triggerPhrases`. `'trigger'` is not a production `ChannelName`.
- [x] T004 Confirm embedding coverage is healthy before any re-run. Evidence: corrected run on ollama nomic-embed-text-v1.5 (768) reported 0 query-embedding failures and vector-ablation delta +0.256. `runAblation` produced a report, so its embedding-coverage assertion passed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Replace the forced all-channels path with default `routeQuery()` routing in `run-retrieval-flag-eval.mjs`. Evidence: per-flag `search()` now uses `buildPerFlagSearchOptions()` with no `forceAllChannels`. Per-flag deltas now measure the routed default path.
- [x] T006 Make the trigger ablation honest. Evidence: implemented via removing the meaningless trigger row (`selectAblationChannels()` filters `'trigger'` out of `ALL_CHANNELS`, the inert `triggerPhrases: []` lever removed). DECISION: chose the "remove the meaningless trigger row" option over a production `activeChannels.has('trigger')` guard because gating the lane requires changes to `hybrid-search.ts`/`query-router.ts` (adding `'trigger'` to the `ChannelName` union + channel sets), which §3 Out-of-Scope forbids and which would risk default-off byte-identity. The corrected channel report now contains no trigger row, so no identical-by-construction noise feeds any flip decision.
- [x] T007 Keep all production routing code unchanged. Evidence: only `run-retrieval-flag-eval.mjs` (driver) + a new test changed. No `.ts` lib files touched (`git status` shows driver + benchmark-status.md + new test only).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Re-run the criterion-4 per-flag benchmark on the corrected driver. Evidence: `/tmp/speckit-retrieval-flag-eval.CORRECTED.json` (exit 0). Corrected per-flag deltas summary_fusion_lane -0.0361, cardinality_penalty 0.0000. Channel report now `vector/bm25/fts5/graph` (no trigger row).
- [x] T009 Re-derive the criterion-4 flip verdict from the new deltas. Evidence: NO default-off flag earns a flip, summary_fusion_lane ON hurts recall (-0.0361 on the production routing path), cardinality_penalty shows zero Recall@20 movement. All other flags are `runSearch:false`. Recommendation: keep default-off. Orchestrator decides.
- [x] T010 Update `benchmark-status.md` with the new deltas and a supersession note. Evidence: added "Driver-fidelity correction - supersedes the per-flag measurement below" section with corrected tables and flip verdict. Prior section relabeled "Prior measurement (superseded ...)".
- [x] T011 Run strict validation for this child folder. Evidence: `validate.sh --strict` → RESULT: PASSED, Errors 0 / Warnings 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Benchmark re-run evidence is recorded (`/tmp/speckit-retrieval-flag-eval.CORRECTED.json`, deltas in `benchmark-status.md`).
- [x] Strict validation exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: See `../spec.md`
- **Source review**: See `../../archive/review-report.md`
<!-- /ANCHOR:cross-refs -->
