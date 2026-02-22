---
title: "Tasks: 006-hybrid-rag-fusion-logic-improvements [template:level_3+/tasks.md]"
description: "Task format uses task id, priority tag, optional parallel marker, description, and file path with measurable acceptance and dependency mapping."
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "tasks"
  - "hybrid rag"
  - "fusion improvements"
  - "cross-system hardening"
  - "bug prevention"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: 006-hybrid-rag-fusion-logic-improvements

<!-- SPECKIT_LEVEL: 3+ -->
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
| `[P0]`/`[P1]`/`[P2]` | Priority |

**Task Format**: `T### [priority] [P optional] Description (file path)`
<!-- /ANCHOR:notation -->

---

## Prior-Work Carry-Forward

| Prior Spec | Required Carry-Forward in 006 | Expansion in 006 Tasks |
|------------|-------------------------------|-------------------------|
| `002-hybrid-rag-fusion` | Preserve tri-hybrid + MMR/TRM baseline | Extend with graph-contract calibration and cognitive weighting controls |
| `003-index-tier-anomalies` | Keep canonical path and tier precedence as hard invariants | Add parser/index automation and storage-ledger reliability gates |
| `004-frontmatter-indexing` | Keep normalized frontmatter + idempotent reindex | Add CRUD re-embed metadata consistency and docs/schema governance checks |
| `005-auto-detected-session-bug` | Keep low-confidence routing safeguards and archive exclusion behavior | Extend to session-learning quality/performance and runbook automation |

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Cross-System Audit and Continuity Lock

- [ ] T001 [P0] Build ten-subsystem contract map across retrieval, graph, cognitive, session, CRUD, parser/index, storage, telemetry, tests, and operations (`spec.md`, audit artifacts)
- [ ] T002 [P0] Capture baseline fixture corpus and metrics (latency, quality, misroute, stale-embed backlog, recovery timing) (`mcp_server/tests/*`, benchmark scripts)
- [ ] T003 [P0] Create ranked seam-risk register with owner and mitigation for each subsystem (`spec.md`, `plan.md`, `decision-record.md`)
- [ ] T004 [P1] Validate continuity assumptions from `002/003/004/005` and map to 006 requirement IDs (`spec.md`, `plan.md`, `tasks.md`)
<!-- /ANCHOR:phase-1 -->

### Phase 1 Task Matrix

| Task ID | Depends On | Acceptance Criteria |
|---------|------------|---------------------|
| T001 | None | Contract map includes input/output invariants for all ten subsystem areas. |
| T002 | T001 | Baseline metrics are reproducible with command references and fixture versioning. |
| T003 | T001, T002 | Top risks are ranked by impact/likelihood and have named owner + mitigation path. |
| T004 | T001 | All inherited assumptions from `002`-`005` map to explicit controls in `006` artifacts. |

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Ranking and Channel Contract Hardening

- [ ] T005 [P0] Implement bounded retrieval/fusion guardrails with deterministic tie and fallback behavior (`lib/search/adaptive-fusion.ts`, `lib/search/hybrid-search.ts`)
- [ ] T006 [P0] Formalize graph/causal channel contracts and calibrate relation scoring (`lib/search/co-activation.ts`, `lib/scoring/*`, tests)
- [ ] T007 [P0] Integrate cognitive/attention-decay and FSRS modifiers with bounded contribution (`lib/scoring/*`, `lib/search/*`)
- [ ] T008 [P1] [P] Emit debug diagnostics for channel contributions, cognitive modifiers, and low-confidence rationale (`handlers/memory-search.ts`, telemetry interfaces)
<!-- /ANCHOR:phase-2 -->

### Phase 2 Task Matrix

| Task ID | Depends On | Acceptance Criteria |
|---------|------------|---------------------|
| T005 | T002, T003 | Deterministic regression fixtures pass with stable ranked outputs and fallback order. |
| T006 | T002, T003 | Graph contract tests pass and relation ordering reaches Kendall tau >= 0.75 on adjudicated fixture. |
| T007 | T002, T005 | NDCG@5 improves >= 8% on long-tail fixture with <= 3% regression on primary fixture and 5-25% cognitive weight bound. |
| T008 | T005, T006, T007 | Debug metadata includes ranked-channel/cognitive rationale without sensitive data leakage. |

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Session and State Integrity Hardening

- [ ] T009 [P0] Improve session manager selection quality and latency with ambiguity handling (`lib/session/*`, folder/session selection handlers)
- [ ] T010 [P0] Harden session-learning pipeline freshness, feedback hygiene, and performance instrumentation (`lib/session-learning/*`, tests)
- [ ] T011 [P0] Enforce memory CRUD to re-embedding consistency workflow with backlog SLA guards (`handlers/memory-crud.ts`, embedding queue orchestration)
- [ ] T012 [P0] Add parser/indexing invariant checks and index-health automation hooks (`lib/parsing/memory-parser.ts`, `handlers/memory-index.ts`)
- [ ] T013 [P0] Implement transaction recovery and mutation-ledger consistency checks (`lib/storage/sqlite-transaction-recovery.ts`, `lib/storage/mutation-ledger.ts`)
- [ ] T014 [P1] [P] Add auto-reconcile hooks for index/ledger divergence with bounded retry policy (`scripts/ops/*`, storage/index handlers)
<!-- /ANCHOR:phase-3 -->

### Phase 3 Task Matrix

| Task ID | Depends On | Acceptance Criteria |
|---------|------------|---------------------|
| T009 | T004, T008 | Session misroute rate <= 1% and p95 selection <= 250ms on 500-candidate fixture. |
| T010 | T004, T009 | Session-learning freshness checks prevent stale updates and batch p95 <= 400ms. |
| T011 | T004, T010 | 100% CRUD mutations trigger re-embed reconciliation; stale backlog >15m remains zero in validation run. |
| T012 | T004, T011 | CI fails on canonical path, tier precedence, or metadata invariant violations with actionable diagnostics. |
| T013 | T012 | Recovery replay preserves committed mutations (RPO 0) and completes <= 120s in simulation. |
| T014 | T012, T013 | Divergence auto-reconcile executes deterministic retry and escalates after bounded attempts. |

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Telemetry Governance and Operational Automation

- [ ] T015 [P0] Define canonical telemetry/trace schema and enforce payload validation (`lib/telemetry/trace-schema.ts`, emitters, tests)
- [ ] T016 [P0] Implement documentation drift prevention checks for telemetry and operational contracts (`scripts/spec-folder/alignment-validator.ts`, docs validation hooks)
- [ ] T017 [P1] Draft and verify runbooks for index drift, session ambiguity, ledger mismatch, and telemetry drift (`plan.md`, `checklist.md`, ops docs)
- [ ] T018 [P1] [P] Wire self-healing automation loops and operational checks into CI/scheduled runs (`scripts/ops/*`, CI config)
<!-- /ANCHOR:phase-4 -->

### Phase 4 Task Matrix

| Task ID | Depends On | Acceptance Criteria |
|---------|------------|---------------------|
| T015 | T008, T012 | All trace payloads validate against schema registry in tests and CI checks. |
| T016 | T015 | Schema/doc mismatch fails validation with field-level diffs and remediation hints. |
| T017 | T013, T016 | Four runbook drill classes documented with trigger, command set, owner, and escalation path. |
| T018 | T014, T017 | Self-healing checks detect/remediate four known failure classes with simulated MTTR <= 10 minutes. |

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification Hardening and Governance Closure

- [ ] T019 [P0] Expand and close deferred/skipped-path tests from `002`/`003`/`004`/`005` lineage (`mcp_server/tests/*`, script tests)
- [ ] T020 [P0] Run consolidated performance/reliability verification (retrieval, session, recovery, automation) against required thresholds
- [ ] T021 [P1] Execute failure-injection drills for recovery and self-healing paths and capture evidence (`scripts/ops/*`, verification artifacts)
- [ ] T022 [P1] Synchronize checklist evidence and sign-off model across all Level 3+ docs (`checklist.md`, `spec.md`)
- [ ] T023 [P1] Finalize decision record and implementation summary with delivered subsystem evidence (`decision-record.md`, `implementation-summary.md`)
- [ ] T024 [P2] Save context snapshot after implementation completion (`memory/` via generate-context script)
<!-- /ANCHOR:phase-5 -->

### Phase 5 Task Matrix

| Task ID | Depends On | Acceptance Criteria |
|---------|------------|---------------------|
| T019 | T015, T018 | Deferred/skipped inventory is closed or explicitly approved with owner and re-entry condition. |
| T020 | T005, T007, T009, T010, T013, T018 | Thresholds met: retrieval p95, session p95, recovery timing, and automation overhead budgets. |
| T021 | T017, T018 | Failure-injection drill results include pass/fail, remediation time, and follow-up action entries. |
| T022 | T019, T020 | All P0 checklist items complete; P1 items complete or approved deferred with rationale. |
| T023 | T022 | ADRs, implementation summary, and sign-off status are synchronized and evidence-backed. |
| T024 | T023 | Context snapshot saved with final status, blockers, and next-step handoff. |

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Performance, recovery, and automation gates passed
- [ ] Governance approval workflow updated to approved state
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
TASKS FILE
Actionable task breakdown with dependency and acceptance matrices across all scoped subsystems.
-->
