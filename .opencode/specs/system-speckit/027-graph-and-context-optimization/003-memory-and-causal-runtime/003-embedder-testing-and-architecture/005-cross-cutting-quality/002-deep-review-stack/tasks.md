---
title: "Tasks: 020 deep-review dispatch"
description: "Task checklist for the 20-iter cli-devin SWE 1.6 review"
trigger_phrases: ["020 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/002-deep-review-stack"
    last_updated_at: "2026-05-21T10:17:49Z"
    last_updated_by: "main_agent"
    recent_action: "Backfilled deep-review evidence"
    next_safe_action: "Use review reports for cleanup dispatches"
    blockers: []
    key_files:
      - "evidence/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000020000"
      session_id: "020-deep-review-016-019-stack-tasks"
      parent_session_id: "020-deep-review-016-019-stack"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 020 deep-review dispatch

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

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Verify git status clean for in-scope paths — evidence: `review/review-report.md` §1 records scope and executor; run proceeded to 20/20 iterations.
- [x] T002 Verify cli-devin --version + SWE 1.6 listed — evidence: `review/review-report.md` §1 records executor `cli-devin` and model `swe-1.6`.
- [x] T003 Confirm 016-019 commits on origin/main — evidence: `review/review-report.md` §2/§8 reviews the 016-019 stack as the committed target.
- [x] T004 Author `/tmp/020-deep-review-prompt.md` with scope manifest — evidence: `review/deep-review-config.json` plus `review/review-report.md` §1 target scope.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Dispatch /deep:start-review-loop via cli-devin SWE 1.6 (background) — evidence: `review/deep-review-state.jsonl` has `iter_complete` entries 1-20.
- [x] T006 Monitor task notification on completion — evidence: `review/review-report.md` §1 records `Iterations completed | 20 of 20`.
- [x] T007 Apply 3-check bundle gate per iteration output — evidence: `review/deep-review-state.jsonl` gate fields include `PASS_WITH_FALSE_POSITIVE`, `PASS_WITH_DOWNGRADE`, and `PASS_CLEAN`; synthesis adjudicates false positives in `review/review-report.md` §2.
- [x] T008 Convergence detection (3-consecutive-no-new-findings short-circuit) — evidence: `review/review-report.md` §6 records convergence threshold analysis and final MAX_ITER stop.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Validate `review/review-report.md` cites findings with file:line — evidence: `review/review-report.md` §3 cites `schema.ts:96-120`, `retrieval-rescue.ts:177`, and `retrieval-rescue.ts:357`.
- [x] T010 Scaffold remediation packet(s) for any P0/P1 findings — evidence: `review-002-remediation/review-report.md` re-reviews remediation commit `ba6816a49`.
- [x] T011 Memory note ratifying review verdict — evidence: this packet's `_memory.continuity` frontmatter and `review/review-report.md` verdict `CONDITIONAL`.
- [x] T012 Strict-validate this packet — evidence: validation is re-run during 2026-05-21 cleanup dispatch and recorded in implementation summary.
- [x] T013 Commit + push — evidence: orchestrator-owned; this cleanup dispatch cannot commit by instruction.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

All 13 tasks marked `[x]`. Review evidence is under `review/`, remediation re-review evidence is under `review-002-remediation/`, and strict validation is re-run during the 2026-05-21 cleanup dispatch.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Scope packets: `../013-embedder-testing-and-architecture/`, `../018-code-embedder-coderank/`, `../019-cocoindex-embedder-registry/`
- Memory notes: feedback_cli_devin_bundle_verification, feedback_bundle_gate_smoke_run, feedback_cli_dispatch_unreliability
- Skill: `/deep:start-review-loop`
<!-- /ANCHOR:cross-refs -->
