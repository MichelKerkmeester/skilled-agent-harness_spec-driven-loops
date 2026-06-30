---
title: "Plan: sk-design checked-in routing-benchmark fixtures"
description: "Completed execution plan for the benchmark fixtures: capture a checked-in Mode-A report pair per mode from each manual_testing_playbook and run the skill-benchmark for all five modes."
trigger_phrases:
  - "sk-design benchmark fixtures plan"
  - "motion benchmark report plan"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/020-benchmark-fixtures"
    last_updated_at: "2026-06-27T07:45:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Mode A reports captured"
    next_safe_action: "Use the checked-in reports as the reproducible routing baseline"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-020-benchmark-fixtures"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: sk-design checked-in routing-benchmark fixtures

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope and remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Benchmark fixture files (JSON or the 014 report-pair shape) plus the skill-benchmark harness |
| **Framework** | sk-design five mode packets and the routing-benchmark harness |
| **Storage** | `<mode>/skill-benchmark-report.json` and `<mode>/skill-benchmark-report.md` under this packet |
| **Testing** | The skill-benchmark run against the fixtures for all five modes, `validate.sh --strict` |

### Overview
Turn oral routing scores into reproducible evidence. Capture a checked-in report pair per mode from each mode's manual_testing_playbook scenarios, carrying scenario rows, expected intent and expected resources. Persist a motion-labelled benchmark report so motion has its own checked-in proof. Run the skill-benchmark in deterministic Mode-A router-replay mode for all five modes and capture the reports as the baseline. This phase measures only, it does not change routing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The missing-fixtures finding and the audit, foundations, and motion per-mode shapes read
- [x] The report-pair shape confirmed from the benchmark runner
- [x] Each mode's manual_testing_playbook scenarios and their expected metadata consumed by the runner

### Definition of Done
- [x] Each of the five modes has a checked-in report pair derived from its playbook scenarios
- [x] Motion has its own checked-in benchmark report artifact
- [x] The skill-benchmark runs in Mode-A router-replay mode for all five modes and produces reports
- [x] `validate.sh --strict` passes on this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fixture-seeding-and-baseline: derive reproducible fixtures from the scenarios that already exist, run the benchmark against them, and store the captured reports as the standing evidence.

### Key Components
- **per-mode report pair**: scenario id, prompt, expected intent and expected resources, derived from the manual playbook.
- **motion benchmark report**: the first motion-labelled checked-in artifact under the motion benchmark path.
- **skill-benchmark run**: executes in Mode-A router-replay mode for all five modes and captures the reports.

### Data Flow
`per-mode manual_testing_playbook scenarios` -> run the deterministic skill-benchmark -> capture the five report pairs -> record the reproducible baseline.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase adds checked-in reports under this packet. It changes no routing config and no design content.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `<mode>/skill-benchmark-report.json` | absent per mode | create | valid report JSON per mode traceable to playbook scenarios |
| `<mode>/skill-benchmark-report.md` | absent per mode | create | markdown report per mode with motion under `design-motion/` |
| packet docs | scaffolded | update | completed task, checklist and summary evidence |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the missing-fixtures finding and the audit (R2), foundations (P2-3), and motion (P2) per-mode shapes
- [x] Confirm the report-pair shape from the benchmark runner
- [x] Consume each mode's manual_testing_playbook scenarios and their expected-intent and expected-resources metadata through the runner

### Phase 2: Core Implementation
- [x] Capture a checked-in report pair per mode from the playbook scenarios
- [x] Persist a motion-labelled benchmark report artifact under `design-motion/`
- [x] Capture the report set for all five modes under this packet

### Phase 3: Verification
- [x] Run the skill-benchmark in Mode-A router-replay mode for all five modes and capture the reports
- [x] Confirm motion has its own labelled report artifact and each report cites its source scenario rows
- [x] Run `validate.sh --strict` on this packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Benchmark | All five modes against the manual playbook scenarios | The skill-benchmark harness |
| Traceability | Each report row to its source scenario | Report scenario-row cross-check |
| Static | This packet's spec docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The missing-fixtures finding and per-mode research | Internal | Green | The fixture scope cannot be grounded |
| `../014-routing-benchmark` report-pair shape | Internal | Green | The fixtures may not align with the harness |
| Each mode's manual_testing_playbook scenarios | Internal | Green | The fixtures cannot be derived |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:phase-deps -->
## 7. PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|-----------|-----|
| Phase 1 Setup | `../015-per-skill-improvement-research`, `../014-routing-benchmark` | The fixture shapes and harness format come from these |
| Phase 2 Implementation | Phase 1 | The fixtures derive from the confirmed playbook scenarios |
| Phase 3 Verification | Phase 2 | The benchmark run needs the fixtures seeded first |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 8. EFFORT ESTIMATE

| Phase | Effort | Notes |
|-------|--------|-------|
| Phase 1 Setup | S | Read the findings, the 014 shape, and the five playbooks |
| Phase 2 Implementation | M | Derive five fixture sets and the motion report |
| Phase 3 Verification | S | Run the skill-benchmark and `validate.sh --strict` |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:rollback -->
## 9. ROLLBACK PLAN

- **Trigger**: The reports drift from the scenarios, the harness rejects them, or the motion report is mislabelled.
- **Procedure**: The reports are additive checked-in files. To revert, delete them. No routing config or design content is mutated, so rollback is a file delete.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

| Trigger | Detection | Action | Owner |
|---------|-----------|--------|-------|
| Report drifts from its source scenario | Cross-check finds a report row with no matching scenario id | Rerun the benchmark from the scenario corpus | implementing subagent |
| Harness rejects a report shape | The skill-benchmark errors before writing reports | Match the runner contract and rerun | implementing subagent |
| Motion report mislabelled or misplaced | The report is not under `design-motion/` | Relabel and move the report under the motion path | implementing subagent |
<!-- /ANCHOR:enhanced-rollback -->
