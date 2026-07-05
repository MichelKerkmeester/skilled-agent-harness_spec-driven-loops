---
title: "Implementation Plan: Behavioral-Benchmark Framework & Shared Harness"
description: "Probe-first plan: resolve the baseline-executor and runner-home decisions, then build the framework reference, runner, and fixtures, closing on an end-to-end smoke gate."
trigger_phrases:
  - "implementation"
  - "plan"
  - "behavior benchmark framework"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/033-deep-loop-behavior-benchmarks/001-framework-and-harness"
    last_updated_at: "2026-07-02T07:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "All plan gates met; exit gate passed"
    next_safe_action: "Proceed to phase 002"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-001-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Behavioral-Benchmark Framework & Shared Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | One Node runner (`.cjs`) + one markdown framework reference + fixture spec-folders |
| **Framework** | `opencode run --format json` event streams; packet 031's route-proof fields + mk-deep-loop-guard signals as delegation evidence |
| **Storage** | Runner + reference at the OPEN-002 home; fixtures under the parent packet's `fixtures/`; run results in executing phase folders |
| **Testing** | Hermetic unit checks (canned event-stream fixture) + one live end-to-end smoke on the baseline leg |

### Overview

Probe-first: resolve OPEN-001 (baseline executor) and OPEN-002 (runner home) before building. Then author the single-source framework reference (scenario schema, 5-dimension rubric, 11-bucket taxonomy, budget + rerun policy), build the runner (spawn, hard timeout, 120s no-progress watchdog, checkpoint extraction, delegation-evidence extraction, fixture-isolation assertion, versioned result JSON), build frozen fixtures with a git-clean restore procedure, and prove the chain with one smoke scenario end-to-end on the baseline leg. Reuses deep-loop-runtime spawn/timeout utilities where they fit rather than reimplementing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] cli-opencode SKILL.md read in the executing session (CLI dispatch rule).
- [x] `OPENCODE_PID`-free shell precondition verified (unset).

### Definition of Done
- [x] OPEN-001 + OPEN-002 resolved with evidence in `decision-record.md` (D-007, D-008).
- [x] Runner enforces timeout + watchdog + isolation reporting; hermetic unit checks pass (exit 0).
- [x] Framework reference published at `shared/behavior-benchmark/framework.md`.
- [x] Fixture fx-001-review-target frozen with restore procedure (FIXTURE.md).
- [x] SMOKE-001 end-to-end on claude-cli -> valid scored result JSON, classification pass.
- [x] Comment-hygiene + alignment-drift clean; `validate.sh --strict` run at closeout.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One shared runner + one framework reference + N thin per-skill packages (built in later phases). Contract/evidence separation throughout.

### Key Components

- **Runner** (`behavior-bench-run.cjs`): scenario-contract-driven spawn of `opencode run --format json`; watchdog kills at 120s of no new event AND no artifact mtime change; extracts t_first_output / t_setup / t_first_dispatch / t_terminal; extracts delegation evidence (task events, route-proof JSONL, guard warnings); asserts fixture isolation pre/post; emits versioned result JSON + transcript.
- **Framework reference**: scenario schema (verbatim prompt, entry surface E1-E4, clarity C1-C3, expected interaction outcome, presentation markers, delegation expectations, budget, fixture target); rubric D1-D5; taxonomy (pass, partial, setup_misbind, phase0_block, route_mismatch, role_absorption, stuck_no_progress, timeout_latency, refused, missing_artifact, crash); budget policy; rerun policy.
- **Fixtures**: frozen tiny spec-folders (review target first; research/context/council/improvement targets as later phases need them).

### Data Flow

Scenario contract -> runner spawns the leg -> event stream + filesystem observed under watchdog -> terminal (natural or killed) -> checkpoints + evidence extracted -> bucket + 5-dim score emitted against the contract -> result JSON accumulates in the executing phase folder.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] OPEN-001 probe done; D-007 recorded.
- [x] OPEN-002 resolved; home scaffolded.

### Phase 2: Core Implementation
- [x] Framework reference authored (GLM-5.2-max, COSTAR contract).
- [x] Runner built (GLM-5.2-max; orchestrator applied one d4 calibration fix post-smoke).
- [x] Fixture built with seeded findings verified.

### Phase 3: Verification
- [x] Hermetic checks green.
- [x] Live smoke pass on claude-cli.
- [x] Hygiene + drift clean; strict validation at closeout.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Hermetic unit | Checkpoint extraction, watchdog trigger, isolation assertion | Canned event-stream fixture, node test |
| Live smoke | Full chain on the baseline leg (exit gate) | Real `opencode run` |
| Static | Runner hygiene | `check-comment-hygiene.sh`, `verify_alignment_drift.py` |
| Spec | Phase docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Anthropic provider in opencode (OPEN-001 option a) | Environmental | Unverified — first task | Fallback (b)/(c) with stated confound |
| deep-loop-runtime spawn/timeout utilities | Reuse | Available | Runner implements its own (small) |
| Route-proof + guard signals | Evidence infra | Shipped (031) | Evidence degrades to task events + artifacts |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Runner proves unreliable or the baseline leg unusable.
- **Procedure**: Delete the runner + reference + fixtures (all additive); no production surface depends on them.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Predecessor phase gate | Core |
| Core | Setup | Verify |
| Verify | Core | Next program phase |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low | Small |
| Core Implementation | Medium | Medium |
| Verification | Low-Medium | Small-Medium |
| **Total** | | **Medium** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Fixture-isolation assertion active before any live run this phase performs.
- [ ] All outputs land in additive-only locations (package dirs, this phase folder).

### Rollback Procedure
1. Delete this phase's additive package directories / analysis docs.
2. Run evidence in this folder remains as the record.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Directory/file deletion only.
<!-- /ANCHOR:enhanced-rollback -->

---
