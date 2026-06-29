---
title: "Implementation Plan: model-benchmark reducer ledger [template:level_1/plan.md]"
description: "Add explicit state-log forwarding to the autonomous model-benchmark workflow so run-benchmark can append reducer-visible benchmark_run rows even when benchmark outputs live outside the improvement runtime folder."
trigger_phrases:
  - "implementation"
  - "model-benchmark"
  - "state-log"
  - "reducer ledger"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/009-loop-systems-remediation/003-model-benchmark-reducer-ledger"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed explicit state-log forwarding plan"
    next_safe_action: "Consider confirm-mode parity if requested"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_model-benchmark_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "model-benchmark-reducer-ledger-2026-06-29"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The simplest fix is command wiring, not reducer or runner code."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: model-benchmark reducer ledger

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML workflow plus Node.js runner scripts |
| **Framework** | Deep-loop command workflow assets |
| **Storage** | Append-only JSONL state log |
| **Testing** | Node structural checks, YAML parse check, direct Node runtime check |

### Overview
The benchmark runner already writes the reducer ledger row when it receives `--state-log`, and `loop-host.cjs` already forwards that option. The autonomous workflow omitted the flag for the non-reviewer branch while writing outputs outside the improvement runtime folder, so the plan is a one-line command wiring fix plus verification that the parsed workflow and runtime path behave correctly.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified from actual YAML and Node runner code.

### Definition of Done
- [x] All acceptance criteria met by targeted checks.
- [x] YAML parse verification passed.
- [x] Direct runtime check confirmed `benchmark_run` ledger emission.
- [x] Spec, plan, tasks, and implementation summary updated.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Workflow command wiring over existing runner-owned persistence.

### Key Components
- **Auto workflow YAML**: Owns the command that invokes model-benchmark mode.
- **`loop-host.cjs`**: Forwards `--state-log` to the benchmark runner.
- **`run-benchmark.cjs`**: Owns the `benchmark_run` JSONL append when a state log path is supplied.
- **`reduce-state.cjs`**: Reads the improvement state log to build reducer rollups.

### Data Flow
The auto workflow invokes `loop-host.cjs --mode=model-benchmark` with benchmark outputs under `.opencode/skills/sk-prompt-models/benchmarks/{run_label}` and the explicit state log under `{spec_folder}/improvement/agent-improvement-state.jsonl`. `loop-host.cjs` forwards both paths to `run-benchmark.cjs`, which writes the report and appends a `benchmark_run` row for reducer consumption.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml` | Produces autonomous benchmark workflow commands | Add explicit `--state-log` to the non-reviewer branch | YAML parse/assertion check passed |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/loop-host.cjs` | Forwards model-benchmark options | Unchanged consumer | Direct Node check confirmed forwarding |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs` | Appends `benchmark_run` when state log is present | Unchanged producer | Direct runtime check appended a row |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs` | Consumes improvement state log | Unchanged consumer | Runtime state log contains reducer-visible row |

Required inventories:
- Same-class producers checked with `rg -n "status_ledger|single-loop-telemetry|orchestration-status|appendJsonlIfChangedAtomic" .opencode/commands/deep/assets/deep_*_auto.yaml`.
- Consumers and producers checked with `rg -n "benchmark_run|state-log|agent-improvement-state" .opencode/skills/deep-loop-workflows/deep-improvement/scripts .opencode/commands/deep/assets`.
- Matrix axes: reviewer versus non-reviewer scoring path, inferred versus explicit state log path, outputs inside versus outside the improvement runtime folder.
- Algorithm invariant: benchmark reports and reducer-visible `benchmark_run` rows must be produced by the same runner path; the orchestrator must not append duplicate rows.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the target auto workflow.
- [x] Read sibling research/review workflow ledger patterns.
- [x] Read `loop-host.cjs`, `run-benchmark.cjs`, `reviewer-scorer.cjs`, and reducer references.

### Phase 2: Core Implementation
- [x] Add explicit `--state-log "{spec_folder}/improvement/agent-improvement-state.jsonl"` to the non-reviewer model-benchmark branch.
- [x] Update the ledger step text to explain explicit state-log ownership.
- [x] Fix existing same-file YAML quoting that prevented parse verification.

### Phase 3: Verification
- [x] Parse the workflow YAML with `js-yaml`.
- [x] Assert the parsed benchmark command contains the explicit state-log flag.
- [x] Confirm `loop-host.cjs` forwards `--state-log`.
- [x] Run a direct model-benchmark check and verify the appended JSONL row.
- [x] Attempt targeted Vitest runtime suites and record the runner availability blocker.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Parse | Workflow syntax and command extraction | `PATH=/opt/homebrew/bin:$PATH node` with bundled `js-yaml` |
| Runtime | `loop-host --mode=model-benchmark` state-log behavior | `PATH=/opt/homebrew/bin:$PATH node` |
| Existing tests | Lane B benchmark and reducer suites | `npx vitest`, blocked because no local Vitest runner was installed and network access is unavailable |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `/opt/homebrew/bin/node` | Local runtime | Green | Required for parse and runtime verification |
| Bundled `js-yaml` under system-spec-kit scripts | Local parser | Green | Required for YAML parse verification without network |
| Local Vitest binary | Test runner | Red | Existing suites cannot run without installing or restoring the runner |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Auto model-benchmark workflow rejects the command or writes duplicate ledger rows.
- **Procedure**: Revert the `deep_model-benchmark_auto.yaml` command and ledger text changes, then rerun the YAML parse check and direct runtime check to confirm prior behavior.
<!-- /ANCHOR:rollback -->
