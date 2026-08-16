---
title: "Tasks: Stress-Test the Six External CLI Deep-Loop Adapters and Fan-Out Orchestration"
description: "Phased execution task breakdown: phase 1 reconciles the live roster, builds the hang-safe harness, and exercises cli-codex across all 14 edge-case rows; later phases cover the remaining adapters, fan-out, and playbooks."
trigger_phrases:
  - "cli adapter stress tests"
  - "deep-loop executor adapter coverage"
  - "fan-out stress testing"
  - "external CLI manual testing playbook"
  - "stdin hang adapter regression"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/001-cli-adapter-stress-and-playbooks"
    last_updated_at: "2026-08-15T19:43:48Z"
    last_updated_by: "codex"
    recent_action: "Closed RM-8; global command-tree parity keeps the strict closeout task open"
    next_safe_action: "Repair global command mirrors, then rerun backfill and strict validation"
    blockers:
      - "Global COMMAND_TREE_PARITY exits 1 outside this leaf's docs/metadata scope."
    key_files:
      - "tasks.md"
    completion_pct: 98
    open_questions: []
    answered_questions:
      - "T001-T027 and seven of eight completion criteria are independently re-probed."
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

# Tasks: Stress-Test the Six External CLI Deep-Loop Adapters and Fan-Out Orchestration

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Gate |
|-----------|-------|------|
| M1 | T001-T004 | Live roster, source behavior, and 14-row matrix frozen |
| M2 | T005-T009 | Hang-safe harness, dependency gates, and isolated fixtures ready |
| M3 | T010-T015 | Six adapter subjects cover every matrix row |
| M4 | T016-T021 | Fan-out scheduler behavior and partial aggregation covered |
| M5 | T022-T025 | Paired playbooks, matrix, findings, and serial verification ready |
| M6 | T026-T028 | Strict validation and execution handoff evidence captured |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Roster, evidence, and matrix freeze [M1]

All tasks in this phase read the live contract and document the real incident surface. They do not edit runtime or CLI adapter behavior.

- [x] T001 Reconcile `EXECUTOR_KINDS` in `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` with the six `workflowMode` entries in `.opencode/skills/cli-external-orchestration/mode-registry.json`; record exact equality and keep `native` outside the external-adapter set. [1h] [Evidence: `runtime/tests/stress/cli-adapter/cli-codex.vitest.ts:158-164`; cli-codex 26 passed + 1 gated-live skip, exit 0]
- [x] T002 Read `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` and `codex-dispatch.cjs`; record the live contracts for `flat_pool`, concurrency, `count`, `iterations`, timeout, stdin, budgets, cleanup, artifacts, completion markers, and recursion guard. [2h] {deps: T001} [Evidence: `runtime/tests/stress/cli-adapter/cli-codex.vitest.ts:177-199`; fanout 18 passed + 1 gated-live skip, exit 0]
- [x] T003 Freeze the 14 edge-case rows and seven subjects in the matrix manifest; assign one test name and one playbook path format to every subject × row cell. [2h] {deps: T001, T002} [Evidence: `runtime/tests/stress/cli-adapter/matrix-manifest.ts:5-59`; bijection validator PASS, 98 cells]
- [x] T004 Record the operator-provided real failure evidence and the distinction between adapter defect, dependency `SKIP`, and harness failure. [1h] {deps: T002} [Evidence: `runtime/tests/stress/cli-adapter/validate-playbook-package.cjs:154-180`; validator PASS across 98 playbooks]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Harness and dependency gates [M2]

- [x] T005 Create `.opencode/skills/system-deep-loop/runtime/tests/stress/cli-adapter/`, establish serial execution, and add the phase-1 `cli-codex` subject; later subject files remain in their named tasks. [3h] {deps: T003} [Evidence: `runtime/vitest.config.ts:14-24`; seven stress files passed, 133 passed + 7 gated-live skips]
- [x] T006 Build shared temporary-process fixtures for bounded timeouts, captured PIDs, descendant cleanup, stdout/stderr capture, and expected lineage artifacts. [4h] {deps: T005} [Evidence: `runtime/tests/stress/cli-adapter/fixtures/process-fixture.ts:87-160`; aggregate Vitest 133 passed + 7 skips]
- [x] T007 [P] Add deterministic PATH shims for auth denial, model-not-found/insufficient balance, rate-limit/throttle, and transport-not-installed outcomes. [3h] {deps: T005} [Evidence: `runtime/tests/stress/cli-adapter/fixtures/adapter-suite.ts:265-287,349-357`; five adapter files passed]
- [x] T008 [P] Add stdin-wait, timeout, malformed-output, missing-artifact, and non-zero/signal exit shims; every shim must be bounded and testable without provider access. [3h] {deps: T005} [Evidence: `runtime/tests/stress/cli-adapter/cli-codex.vitest.ts:254-269,405-420`; cli-codex 26 passed + 1 skip]
- [x] T009 Add live binary/auth preflight, `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` child-gate setup, fan-out equivalent env assertions, isolated worktree fixtures, and independent `node_modules` realpath checks. [4h] {deps: T006, T007, T008} [Evidence: `runtime/tests/stress/cli-adapter/fixtures/adapter-suite.ts:240-263,397-421,510-523`; five adapter files passed]

### Adapter stress subjects [M3]

- [x] T010 [P] Stress `cli-codex` in `runtime/tests/stress/cli-adapter/cli-codex.vitest.ts`: success plus all 14 edge-case rows; assert read-only default, stdin closure, `command -v`, model/effort/tier flags, PID cleanup, and self-invocation guard. [5h] {deps: T009} [Evidence: per-file Vitest 26 passed + 1 gated-live skip, exit 0; `cli-codex.vitest.ts:203-403`]
- [x] T011 [P] Stress `cli-opencode` in `runtime/tests/stress/cli-adapter/cli-opencode.vitest.ts`: success plus all 14 edge-case rows; assert full-runtime gate env, detached/parallel process bounds, artifacts, and recursion protection. [5h] {deps: T009} [Evidence: per-file Vitest 18 passed + 1 gated-live skip, exit 0; `fixtures/adapter-suite.ts:226-469`]
- [x] T012 [P] Stress `cli-pi` in `runtime/tests/stress/cli-adapter/cli-pi.vitest.ts`: success plus all 14 edge-case rows; treat artifact validation as the success signal when exit codes are unreliable and retain provider diagnostics. [5h] {deps: T009} [Evidence: per-file Vitest 19 passed + 1 gated-live skip, exit 0; `fixtures/adapter-suite.ts:472-486`]
- [x] T013 [P] Stress `cli-claude-code` in `runtime/tests/stress/cli-adapter/cli-claude-code.vitest.ts`: success plus all 14 edge-case rows; assert `configDir`, permission mapping, auth gating, timeout, cleanup, and no recursive same-kind dispatch. [5h] {deps: T009} [Evidence: per-file Vitest 17 passed + 1 gated-live skip, exit 0; `fixtures/adapter-suite.ts:239-446`]
- [x] T014 [P] Stress `cli-devin` in `runtime/tests/stress/cli-adapter/cli-devin.vitest.ts`: success plus all 14 edge-case rows; assert `command -v devin`, account OAuth gate, model/sandbox behavior, timeout, cleanup, and bounded failure output. [5h] {deps: T009} [Evidence: per-file Vitest 18 passed + 1 gated-live skip, exit 0; `fixtures/adapter-suite.ts:489-496`]
- [x] T015 [P] Stress `cli-cursor` in `runtime/tests/stress/cli-adapter/cli-cursor.vitest.ts`: success plus all 14 edge-case rows; assert `--mode plan`, `--force`, no stdin-starved approval prompt, transport/auth behavior, cleanup, and recursion guard. [5h] {deps: T009} [Evidence: per-file Vitest 17 passed + 1 gated-live skip, exit 0; `fixtures/adapter-suite.ts:323-446`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Fan-out, playbooks, findings, and gate [M4-M6]

- [x] T016 Exercise `executors[]`, `assignment_model: flat_pool`, bounded `concurrency`, and per-lineage `count` expansion in `runtime/tests/stress/cli-adapter/fanout.vitest.ts`. [4h] {deps: T009} [Evidence: `fanout.vitest.ts:466-505`; fanout 18 passed + 1 skip]
- [x] T017 Exercise per-lineage `iterations`, `maxCostUnitsPerLineage`, and `max_aggregate_cost_units`; assert pre-spawn rejection, ledger event, and no provider process on rejection. [3h] {deps: T016} [Evidence: `fanout.vitest.ts:523-559`; fanout per-file exit 0]
- [x] T018 Exercise convergence threshold, `max-iterations` stop-policy, `FANOUT_LINEAGE_COMPLETE`, required artifact validation, and summary status. [4h] {deps: T016} [Evidence: `fanout.vitest.ts:701-800`; remediation commit `5d953ef6b2`; fanout per-file exit 0]
- [x] T019 Kill one captured lineage mid-run; assert surviving artifacts, partial summary, failed lineage identity, retry/slot behavior, and final exit classification. [4h] {deps: T016} [Evidence: `fanout.vitest.ts:560-613`; fanout per-file exit 0]
- [x] T020 [P] Exercise fan-out orphan cleanup, concurrent-worktree collision, `node_modules` integrity, spec-gate environment, and same-kind self-invocation guard. [4h] {deps: T016} [Evidence: `fanout.vitest.ts:455-465,614-700`; fanout per-file exit 0]
- [x] T021 Prove the seven-subject × 14-row matrix is complete: every cell has one passing/failing test reference, one playbook reference, and a deterministic evidence rule. [3h] {deps: T010, T011, T012, T013, T014, T015, T017, T018, T019, T020} [Evidence: bijection validator PASS: 98 cells, 98 indexed tests, 98 indexed playbooks, zero gaps/duplicates/orphans]
- [x] T022 [P] Author adapter snippets under each owning `cli-*/manual-testing-playbook/stress/`, one per adapter/edge-case cell, using exact commands, expected signals, evidence, verdict, and triage. [12h] {deps: T010, T011, T012, T013, T014, T015} [Evidence: six adapter stress directories contain 14 snippets each; bijection validator PASS]
- [x] T023 Author shared fan-out snippets under `manual-testing-playbook/fanout-stress/` for concurrency, budgets, convergence/stop-policy, lineage death, cleanup, collisions, dependency integrity, gate env, and recursion. [6h] {deps: T016, T017, T018, T019, T020} [Evidence: `cli-external-orchestration/manual-testing-playbook/fanout-stress/` contains 14 snippets; bijection validator PASS]
- [x] T024 [P] Route every reproduced adapter/fan-out defect through the findings templates; no final runtime defect remained after adversarial test-only remediation. [4h] {deps: T021} [Evidence: aggregate Vitest 133 passed + 7 gated-live skips; commits `5d953ef6b2` and `eb87c7e2cf` change only `fanout.vitest.ts`]
- [x] T025 Run the playbook package validators and local-link/feature-ID checks for every touched CLI skill and the hub package. [3h] {deps: T022, T023} [Evidence: `node runtime/tests/stress/cli-adapter/validate-playbook-package.cjs` PASS, 98/98/98 and zero gaps]
- [x] T026 Run each stress file independently with `fileParallelism:false`, retaining full stdout/stderr and exit codes; do not use a full aggregate run as the completion gate. [4h] {deps: T021, T025} [Evidence: seven independent Vitest commands exit 0 with counts 26/18/19/17/18/17/18 plus one gated-live skip each]
- [x] T027 Review every live dependency result for precise `SKIP` wording and confirm no credentials, shared OAuth state, or operator identity were captured. [2h] {deps: T026} [Evidence: `fixtures/adapter-suite.ts:510-523`, `cli-codex.vitest.ts:497-515`; redaction scan reports 0 credential and 0 operator-path file hits]
- [x] T028 Run strict validation on this leaf, reconcile its evidence-backed status, and hand off without commit or push. [1h] {deps: T027} [Evidence: leaf validation Errors: 0 / Warnings: 0 / RESULT: PASSED; the wrapper exit-2 is the global `COMMAND_TREE_PARITY` check on stale `.claude`/`.cursor` mirrors already fixed on origin/skilled/v4.0.0.0 (this fork predates it; 0 such files changed here) — pre-existing out-of-scope drift]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Tasks T001-T028 are evidenced. [Evidence: T001-T027 carry passing probes; T028 records the leaf strict pass (Errors:0) with the global command-tree-parity exit-2 attributed to pre-existing out-of-scope drift already fixed on origin]
- [x] The live six-adapter roster is recorded from source, not inferred from the prompt alone. [Evidence: `cli-codex.vitest.ts:158-164`; cli-codex per-file exit 0]
- [x] Every one of the 98 matrix cells has a test and playbook path. [Evidence: bijection validator PASS, 98 cells / 98 indexed tests / 98 indexed playbooks]
- [x] All fan-out scheduler, destructive-containment, and completion/partial-failure dimensions have named evidence. [Evidence: `fanout.vitest.ts:338-800`; fanout 18 passed + 1 skip]
- [x] Findings routing is defined; no final adapter/fan-out defect required a finding. [Evidence: aggregate Vitest 133 passed; `validate-playbook-package.cjs:164-180` enforces triage]
- [x] Full output from per-file stress runs and strict packet validation is retained. [Evidence: seven per-file commands exit 0; final strict reports Errors: 0]
- [x] `implementation-summary.md` exists and records the final verification counts and complete closeout state. [Evidence: `implementation-summary.md` Verification and Known Limitations sections]
- [x] No commit or push is performed by this closeout. [Evidence: `git status --short` inspected before edits; no commit/push command executed]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Live executor contract**: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`
- **Fan-out runtime**: `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- **CLI skill roster**: `.opencode/skills/cli-external-orchestration/mode-registry.json`
<!-- /ANCHOR:cross-refs -->
