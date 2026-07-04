---
title: "Tasks: Phase 4: embedding-coverage-and-vector-shard-consistency"
description: "Task breakdown for embedding coverage repair and vector shard consistency: verify-first battery, four fix batteries, and gate re-measurement. Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "embedding coverage tasks"
  - "vector shard consistency"
  - "pending vectors drain"
  - "verify first battery"
  - "embedding reconcile tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/004-embedding-coverage-and-vector-shard-consistency"
    last_updated_at: "2026-07-04T14:08:37.334Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored task breakdown with verify-first battery and finding metadata"
    next_safe_action: "Program complete (016 shipped + pushed)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-016-004-embedding-coverage"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: embedding-coverage-and-vector-shard-consistency

<!-- SPECKIT_LEVEL: 3 -->

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

Finding refs cite the program sources: report §3 numbering (#N), report §4 items, and ledger tags (L#, Agent F). 🟡 = agent-verified finding, confirm-before-fix required (finding-is-a-hypothesis rule). 🟢 = live-reproduced or code-verified by the primary session; no re-verification needed.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:ai-protocol -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [ ] Read spec.md requirements (REQ table) and the plan.md battery that owns the task's REQ
- [ ] Confirm the finding's 🟡 verify-first task is complete before implementing its fix
- [ ] Confirm baselines (T001 SQL snapshot, T002 vitest gate) exist before any Phase 2 change

### Execution Rules

| Rule | Meaning |
|------|---------|
| TASK-SEQ | Respect blocked-by metadata; verify-first tasks always precede their fixes |
| TASK-SCOPE | Touch only files named in spec.md Files-to-Change or located by T007; no adjacent cleanup |
| TASK-EVIDENCE | Every completed task records evidence (command, file:line, or test name) in checklist.md |

### Status Reporting

Report per battery: `Battery <A-D>: <done>/<total> - <blocker or next task>`; from Phase 3 onward include gate deltas vs the T001 baseline.

### Blocked Task Protocol

Mark the task `[B]` with the blocking reason inline, surface it in the session summary, and never skip past a blocked P0 task; escalate with 2-3 options after two failed unblock attempts.
<!-- /ANCHOR:ai-protocol -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture baseline live counts to scratch/ via read-only SQL: embedding_status split (18,833 success / 8,761 pending / 4,247 failed / 1,260 retry), 367 success-without-vector, 27,706 empty embedding_model, spelling counts (1,405 vs 3,990) <!-- source: report §1 + ledger L3, all 🟢; baseline-before-delta rule -->
- [ ] T002 [P] Capture the FULL vitest gate baseline for mcp_server suites (record pass/fail/skip counts, incl. currently skipped chunking update-path tests) <!-- source: program cross-cutting rule; regression-baseline-and-delta -->
- [ ] T003 🟡 VERIFY-FIRST: confirm drain writes only `vec_memories`, never the active `vec_<dim>` shard (.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:747-765); ALSO assert a non-default `vec_<dim>` shard is active (prod = 768 shard) before trusting the REQ-002 tests, because `activeDimVectorSource` returns null under the DEFAULT embedder (vector-index-mutations.ts:75-79) so `writeActiveVectorPayload` writes only `vec_memories` there and the REQ-002 tests false-pass under the default embedder <!-- finding: report §3 #16 | ledger Agent F P1 | class: cross-consumer | precondition: non-default dim shard active -->
- [ ] T004 🟡 VERIFY-FIRST: confirm drain embeds different weighted text than the sync path AND poisons the shared embedding cache under the same key <!-- finding: ledger Agent F P2 x2 | class: class-of-bug -->
- [ ] T005 🟡 [P] VERIFY-FIRST: confirm rows at max retries are invisible to BOTH scan reindex and the retry queue (24h dead-end) <!-- finding: ledger Agent F P2 | class: instance-only until disproven -->
- [ ] T006 🟡 [P] VERIFY-FIRST: confirm the 'auto' embedder shard-repair sentinel counts `vec_<dim>` while writes go to `vec_memories`, so it never clears <!-- finding: ledger Agent F contract | class: cross-consumer -->
- [ ] T007 🟡 [P] VERIFY-FIRST: confirm scan coalescing is scope-blind, a cancelled scan arms the 30s cooldown, and a heartbeat can resurrect a released lease; record the exact owning files/lines for the Files-to-Change table <!-- finding: ledger Agent F P2 x3 | class: test-isolation/matrix -->
- [ ] T008 🟡 [P] VERIFY-FIRST: confirm pendingVectors undercounts updated files <!-- finding: decomposition §004 (Agent F P2) | class: instance-only -->
- [ ] T009 [P] ADR-001 spike: enumerate the 39 docs >50KB (max 193KB), demonstrate tail invisibility on one 193KB doc (vector-channel query for tail-only content), estimate chunk-row growth and scan-latency cost of Option A <!-- finding: ledger L9 🟢 | feeds decision-record.md ADR-001; #3 mechanism is 🟢 verified, no re-verification needed -->
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 REQ-001 Fix safe-swap self-delete: append-only staging or oldChildIds = old minus new (.opencode/skills/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:488-553) <!-- finding: report §3 P0 #3 🟢 | class: algorithmic -->
- [ ] T011 REQ-001 Add parent-aware dedup lookup feeding the swap (.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1857-1873) <!-- finding: ledger L9 🟢 | class: algorithmic -->
- [ ] T012 REQ-001 Un-skip and extend the chunked update-path tests; add adversarial re-save-of-chunked-memory test <!-- finding: report §3 #3 remediation contract -->
- [ ] T013 REQ-002 Route drain writes through `writeActiveVectorPayload` so drained rows land in the active `vec_<dim>` shard (.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:747-765; symbol lives in mcp_server/lib/search/vector-index-mutations.ts); the REQ-002 test must run with a non-default `vec_<dim>` shard active (T003 precondition) or it false-passes under the default embedder <!-- finding: report §3 #16 | blocked-by: T003 confirmation -->
- [ ] T014 REQ-007 Drain embeds the same weighted text as the sync path; embedding cache key includes the embedded-text projection; add poisoning regression test <!-- finding: ledger Agent F P2 x2 | blocked-by: T004 -->
- [ ] T015 REQ-004 Scale drain batch/interval by queue size (default 5 rows/5min -> adaptive or raised; target: 8.7k backlog < 24h, no event-loop lag) <!-- finding: report §4 item 9 🟢(config)/🟡(rate) -->
- [ ] T016 REQ-006 Retry@max dead-end rescue: rows at cap re-enter reconcile pickup or scan reindex <!-- finding: ledger Agent F P2 | blocked-by: T005 -->
- [ ] T017 REQ-003 Run `memory_embedding_reconcile` once (clears the 367), then wire a maintenance cadence + /memory:manage entry point (.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts) <!-- finding: ledger L3 🟢; maintenance.lastRunAt null | sequence: after T013 so reconciled rows hit the active shard -->
- [ ] T018 REQ-008 Provenance migration: normalize the two nomic spellings to one canonical form; backfill 27,706 empty embedding_model rows from shard provenance; log before-values for reversal; dry-run diff first <!-- finding: ledger L3 🟢 | class: matrix/evidence -->
- [ ] T019 REQ-009 Assert embedder identity at query time: on model mismatch exclude or re-queue with telemetry, never silently score across vector spaces <!-- finding: decomposition §004 | depends: T018 canonical attribution -->
- [ ] T020 REQ-010 Fix the 'auto' embedder shard-repair sentinel to count the shard the writes actually target <!-- finding: ledger Agent F contract | blocked-by: T006 -->
- [ ] T021 REQ-011 Scan lifecycle: scope-aware coalescing; cancelled scan does not arm cooldown; heartbeat cannot resurrect a released lease (files per T007) <!-- finding: ledger Agent F P2 x3 | blocked-by: T007 -->
- [ ] T022 REQ-012 Fix pendingVectors undercount on updated files <!-- finding: decomposition §004 (Agent F P2) | blocked-by: T008 -->
- [ ] T023 REQ-005 Execute the ADR-001 accepted option: EITHER wire `indexChunkedMemoryFile` into the scan path for over-threshold docs behind a flag (today's only call site: mcp_server/handlers/memory-save.ts:2511) OR write the single-vector truncation policy + FTS-only tail coverage documentation; flip ADR-001 to Accepted with the T009 spike evidence <!-- finding: decomposition §004 decision | blocked-by: T009, T010-T012 -->
- [ ] T030 REQ-013 (Battery D) Fix the stale-delete cascade double-count: delete children before parents (sort stale ids DESC) or treat an already-gone row as a successful delete, so cascade-removed chunk children stop inflating `failed` (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:596-658; cascade at .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1927,3742) <!-- finding: Agent F P2 via plan-review Systemic #4 | class: algorithmic | scan-lifecycle scope -->
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T024 Re-measure live counts vs T001 baseline: SC-001 success-row == vector-row (367 -> 0), SC-004 embedding_model empties == 0 with one spelling; enumerate the embed-path x shard x row-state matrix rows from the FIX ADDENDUM <!-- gates: decomposition §004 -->
- [ ] T025 Measure drain throughput over a bounded window; project full-drain time for the pending backlog; assert < 24h (SC-002) and no event-loop lag warnings (NFR-P02)
- [ ] T026 SC-003 check per ADR-001 outcome: Option A - query the tail of a >50KB doc and confirm a vector-channel hit; Option B - confirm the policy doc states the truncation limit and FTS-only tail coverage
- [ ] T027 Run the adversarial scan-lifecycle tests (scoped-scan-during-scan, cancel-then-scan, lease-release-heartbeat), the safe-swap re-save test, and the stale-delete cascade test (delete a chunked parent + its children, assert failed==0 for cascade-removed rows, REQ-013); all green
- [ ] T028 Re-run the FULL vitest gate; compare to T002 baseline; report the numeric delta (SC-005); no unexplained regressions
- [ ] T029 Sync docs: checklist.md evidence filled, spec/plan/tasks statuses reconciled, ADR-001 Accepted recorded; clean scratch/; run validate.sh --strict on this folder (exit 0)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] SC-001..SC-005 evidenced in checklist.md; ADR-001 Accepted
- [ ] Manual verification passed (T024-T027 gate evidence)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (REQ-001..REQ-013, SC-001..SC-005)
- **Plan**: See `plan.md` (batteries, FIX ADDENDUM inventories, rollback)
- **Decision Record**: See `decision-record.md` (ADR-001)
- **Sources**: `../research/phase-decomposition.md` §004; `../research/deep-dive-report.md` §1, §3 (#3, #16), §4 item 9; `../research/findings-ledger.md` L3, L9, Agent F
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3 TASKS
- Verify-first battery before any fix (finding-is-a-hypothesis)
- Finding refs live here in tasks.md, never in code comments (comment-hygiene HARD BLOCK)
-->
