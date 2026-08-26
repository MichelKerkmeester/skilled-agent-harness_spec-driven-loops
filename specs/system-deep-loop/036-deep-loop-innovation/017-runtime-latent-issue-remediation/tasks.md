---
title: "Tasks: System-Deep-Loop Runtime Latent-Issue Remediation"
description: "The task breakdown for the 016-audit remediation: baseline, verify-then-fix fan-out across eight disjoint-file workstreams, conductor review, whole-suite regression check, and packet reconciliation."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/017-runtime-latent-issue-remediation"
    last_updated_at: "2026-08-26T06:00:00Z"
    last_updated_by: "claude"
    recent_action: "Recorded the remediation task breakdown"
    next_safe_action: "Reconcile docs and validate --strict"
---
# Tasks: System-Deep-Loop Runtime Latent-Issue Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file) [effort]`


<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the full vitest baseline failing set (`10 files / 14 tests`) [~18m]
- [x] T002 Scaffold the packet as bound write authority (`spec.md`) [15m]
- [x] T003 [P] Resolve every workstream's exact file + test paths (`runtime/scripts/`, `runtime/tests/`) [10m]


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Verify-then-fix fan-out (8 Sonnet-5 xhigh workstreams)
- [x] T004 [P] WS-GATEWAY: F-029 (P0) fail-closed + F-032 binding refusal (`append-mode-event.ts`/`.cjs`) [fix]
- [x] T005 [P] WS-MERGE: F-010 severity, F-011 per-lineage isolation, buildAttributionMd, F-009 (`fanout-merge.cjs`) [fix]
- [x] T006 [P] WS-REDUCER: F-012/F-013 availability, P1-3, F-014, F-016 (`reduce-state.cjs`, `reduce-alignment-state.cjs`) [fix]
- [x] T007 [P] WS-SALVAGE: F-034 repair, F-039 clone, F-038 alignment, F-003 lock (`fanout-salvage.cjs`, `jsonl-repair.ts`) [fix]
- [x] T008 [P] WS-POOL: P1-2 budget base-spend, F-007 retry credit, F-022 sandbox flag (`fanout-run.cjs`, `fanout-pool.cjs`, `executor-config.ts`) [fix]
- [x] T009 [P] WS-CONTAINMENT: P1-5 packet-scoped fatality, P1-6 scoped exemption (`write-containment.ts`) [fix]
- [x] T010 [P] WS-CONVERGENCE: F-024 loop-type + opt-in gateway-bypass advisory (`convergence.cjs`, `verify-iteration.cjs`) [fix]
- [x] T011 [P] WS-DOCS: P1-4/P1-7/P1-9 + gateway-adherence hardening across packs + mirrors (`deep-review/SKILL.md`) [fix]

### Recovery
- [x] T012 Recover six workstreams' misplaced edits from the main checkout into the worktree (patch-transfer) (`ws6-recovery.patch`) [20m]


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Conductor review of every diff against source + comment-hygiene sweep (clean) (`git diff`) [30m]
- [x] T014 Whole-suite re-run; triage new failures vs baseline (`vitest run`) [~18m]
- [x] T015 Fix gateway over-scope regression (attempted-refresh discriminator) (`append-mode-event.ts`) [fix]
- [x] T016 Implement operator option C: default-on fatal ledger-backing gate + kill-switch (`verify-iteration.cjs`) [fix]
- [x] T017 Isolate containment tests from the global gitignore (`write-containment.vitest.ts`) [fix]
- [x] T018 Update cli-codex budget test to over-budget-by-base semantics (`cli-codex.vitest.ts`) [fix]
- [x] T019 Confirm model-benchmark timeout is load-flaky and independent (passes 13/13 quiet) [check]
- [x] T020 Clean whole-suite run (157 files, 2590 passed): only new failure is the load-flaky `model-benchmark` timeout; baseline unchanged [~18m]
- [x] T021 Reconcile packet docs; regen metadata; `validate.sh --strict` clean [30m]


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The P0 is fixed with a negative-control test
- [x] Every in-scope P1 is fixed with a test OR recorded as a verified false positive
- [x] Regression proof complete: targeted changed-code tests pass; baseline failures independent; DB failures are an env `better-sqlite3` ABI break
- [x] `validate.sh --strict` clean; packet docs reconciled
- [ ] Operator go-ahead obtained before any push to shipped runtime


<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Checklist**: See `checklist.md`
- **Source audit**: See `../016-system-deep-loop-review/`

<!-- /ANCHOR:cross-refs -->
