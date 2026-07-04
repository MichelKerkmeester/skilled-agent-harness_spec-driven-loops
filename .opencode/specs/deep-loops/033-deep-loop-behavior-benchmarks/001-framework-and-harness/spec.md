---
title: "Feature Specification: Behavioral-Benchmark Framework & Shared Harness"
description: "Build the shared foundation every behavior_benchmark package runs on: scenario schema, 5-dimension scoring rubric, 11-bucket classification taxonomy, budget + rerun policy, the shared scenario runner over opencode run --format json (timeout, no-progress watchdog, checkpoint + delegation-evidence extraction, fixture-isolation assertion), frozen fixture packets, and the two de-risking probes (baseline executor availability; end-to-end smoke)."
trigger_phrases:
  - "behavior benchmark framework"
  - "behavior bench harness"
  - "benchmark runner watchdog"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/033-deep-loop-behavior-benchmarks/001-framework-and-harness"
    last_updated_at: "2026-07-02T07:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase complete: framework + runner + fixtures shipped, exit gate passed"
    next_safe_action: "Proceed to phase 002 (pilot deep-review)"
    blockers: []
    key_files:
      - "decision-record.md"
      - "../../031-deep-loop-gpt-reliability/004-benchmarks-and-verification/002-gpt-claude-benchmark/benchmark-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-001-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "OPEN-001 resolved: claude CLI baseline leg (no Anthropic provider in opencode; D-007, confound stated)."
      - "OPEN-002 resolved: deep-loop-workflows/shared/behavior-benchmark/ (D-008)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Behavioral-Benchmark Framework & Shared Harness

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-02 |
| **Parent Packet** | `033-deep-loop-behavior-benchmarks` |
| **Successor** | `../002-pilot-deep-review/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The five per-skill benchmark packages (phases 002-004) need one shared, trustworthy measurement substrate. Without it, each package would fork its own scoring rules and spawn mechanics, making cross-mode comparison meaningless — and without fixture isolation and a watchdog built FIRST, live LLM runs could contaminate production spec folders or hang unattended. Two environmental facts are also unverified and gate everything downstream: whether a Claude baseline can run through the same opencode host (OPEN-001), and where the shared runner should live (OPEN-002).

### Purpose

Ship the framework reference (scenario schema, rubric, taxonomy, budget/rerun policy), the shared runner, and the frozen fixtures — then prove the whole chain with one end-to-end smoke scenario on the resolved baseline leg before any package authoring begins.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- OPEN-001 probe: check Anthropic provider availability in this repo's opencode (`opencode models`); record the baseline-executor decision and any stated confound.
- OPEN-002 resolution and runner scaffold: spawn `opencode run --format json --dir <repo-root>` per scenario (command-form or natural-language prompt per entry surface), hard timeout, 120s no-progress watchdog (no new event AND no artifact mtime change), checkpoint extraction (t_first_output / t_setup / t_first_dispatch / t_terminal), delegation-evidence extraction (task events with subagent identity + `Agent:`/`Deep Route:` prompt lines, route-proof JSONL fields, mk-deep-loop-guard warnings), fixture-isolation pre/post assertion, per-run result JSON + transcript.
- Framework reference (single source all packages link): scenario contract schema, 5-dimension rubric (0/1/2 each), 11-bucket taxonomy, budget policy (max(3x baseline, 180s), 15min cap, 25min for ai-council/improvement), rerun policy (single-sample default; manual 3-sample for contested cells).
- Frozen fixture packets under the parent packet's `fixtures/` tree with a git-clean restore procedure.
- Hermetic runner unit checks against a canned event-stream fixture.

### Out of Scope

- Any scenario package authoring (phases 002-004).
- Any GPT-leg execution (phase 002 onward).

### Files Likely to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| Runner script (home per OPEN-002) | Create | Shared scenario runner |
| Framework reference doc (same home) | Create | Schema, rubric, taxonomy, budgets, rerun policy |
| `../fixtures/**` | Create | Frozen fixture spec-folders |
| `decision-record.md` (this folder) | Modify | OPEN-001/OPEN-002 resolutions recorded |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Baseline executor resolved by probe, not assumption | OPEN-001 answered with live command evidence; the chosen leg's confound (if any) documented where ratios will cite it. |
| REQ-002 | Runner never hangs and never contaminates | Every spawn carries hard timeout + no-progress watchdog; pre/post isolation assertion fails the run loudly if any path outside fixtures + results changed. |
| REQ-003 | Single-source scoring rules | Rubric, taxonomy, and budget policy live in ONE framework reference; packages link, never fork. |
| REQ-004 | End-to-end proof before rollout | Exit gate: one smoke scenario on the baseline leg produces a valid scored result JSON with all four checkpoints and delegation evidence extracted. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: OPEN-001 and OPEN-002 recorded as resolved decisions with evidence.
- **SC-002**: Hermetic runner unit checks pass (checkpoint extraction, watchdog trigger, isolation assertion).
- **SC-003**: Smoke scenario end-to-end on the baseline leg — valid scored result JSON.
- **SC-004**: `validate.sh --strict` passes for this phase folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | No Anthropic provider in opencode (OPEN-001 option a unavailable) | Baseline confounded by host differences | Fallback order (b) cli-claude-code then (c) Claude Code native leg, confound stated on every affected ratio |
| Risk | Event-stream format drifts across opencode versions | Checkpoint extraction breaks silently | Runner pins extraction to a canned-fixture unit test; version recorded per run |
| Dependency | cli-opencode dispatch surface | All later GPT legs | Proven in packet 031; `OPENCODE_PID`-free precondition re-verified per session |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- See `decision-record.md` OPEN-001 (baseline executor) and OPEN-002 (runner home).
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: A runner-internal bug classifies the run as `crash` and continues the batch — it never silently blocks the program.

### Maintainability
- **NFR-M01**: Scenario contracts stay self-contained markdown — any scenario re-runnable by hand without the runner.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Event stream ends without a terminal message (watchdog kill): partial evidence still scores D1-D3; D4=0 with the watchdog bucket.

### Error Scenarios
- Fixture restore fails between runs: batch halts before the next spawn (never run against a dirty fixture).

### State Transitions
- Runner result JSON schema is versioned from day one so phase-005 aggregation can trust mixed-phase results.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One runner + one reference doc + fixtures + probes |
| Risk | 12/25 | Isolation/watchdog engineering removes the scary failure modes |
| Research | 8/20 | Methodology proven by 031 phase 012; probes are environmental |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## RELATED DOCUMENTS

- **Decisions**: `decision-record.md` (D-001..D-006, OPEN-001, OPEN-002)
- **Parent Spec**: `../spec.md`
- **Predecessor evidence**: `../../031-deep-loop-gpt-reliability/004-benchmarks-and-verification/002-gpt-claude-benchmark/benchmark-results.md`
