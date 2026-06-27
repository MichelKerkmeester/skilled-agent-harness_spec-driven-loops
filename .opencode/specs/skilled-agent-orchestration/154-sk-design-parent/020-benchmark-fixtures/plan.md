---
title: "Plan: sk-design checked-in routing-benchmark fixtures"
description: "Execution plan for the benchmark fixtures: derive a checked-in fixture set per mode from each manual_testing_playbook, persist a motion-labelled benchmark report, and run the skill-benchmark against the fixtures for all five modes. Not started."
trigger_phrases:
  - "sk-design benchmark fixtures plan"
  - "motion benchmark report plan"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/020-benchmark-fixtures"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Drafted the fixture-seeding approach across five modes"
    next_safe_action: "Derive fixtures from the manual playbooks, then run the skill-benchmark"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-020-benchmark-fixtures"
      parent_session_id: null
    completion_pct: 0
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
- Match phases to the stated scope; remove setup theater that does not change the outcome.
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
| **Storage** | `014-routing-benchmark/<mode>/` fixtures and reports |
| **Testing** | The skill-benchmark run against the fixtures for all five modes, `validate.sh --strict` |

### Overview
Turn oral routing scores into reproducible evidence. Derive a checked-in fixture set per mode from each mode's manual_testing_playbook scenarios, carrying scenario id, prompt, expected mode, expected intent, and expected resources. Persist a motion-labelled benchmark report so motion has its own checked-in proof. Then run the skill-benchmark against the fixtures for all five modes and capture the reports as the baseline. This phase seeds and measures, it does not change routing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The missing-fixtures finding and the audit, foundations, and motion per-mode shapes read
- [ ] The 014 report-pair shape confirmed so the fixtures align with the harness
- [ ] Each mode's manual_testing_playbook scenarios and their expected metadata confirmed

### Definition of Done
- [ ] Each of the five modes has a checked-in fixture set derived from its playbook scenarios
- [ ] Motion has its own checked-in benchmark report artifact
- [ ] The skill-benchmark runs against the fixtures for all five modes and produces reports
- [ ] `validate.sh --strict` passes on this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fixture-seeding-and-baseline: derive reproducible fixtures from the scenarios that already exist, run the benchmark against them, and store the captured reports as the standing evidence.

### Key Components
- **per-mode fixture set**: scenario id, prompt, expected mode, expected intent, expected resources, derived from the manual playbook.
- **motion benchmark report**: the first motion-labelled checked-in artifact under the motion benchmark path.
- **skill-benchmark run**: executes against the fixtures for all five modes and captures the reports.

### Data Flow
`per-mode manual_testing_playbook scenarios` -> derive the per-mode fixture set -> run the skill-benchmark against the fixtures -> capture the five reports plus the motion-labelled report -> record the reproducible baseline.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase adds checked-in fixtures and reports under the 014 benchmark tree. It changes no routing config and no design content.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `014-routing-benchmark/<mode>/` fixtures | absent per mode | create | a fixture set per mode traceable to playbook scenarios |
| `014-routing-benchmark/design-motion/` report | only the interface report existed | create | a motion-labelled report artifact present |
| the five skill-benchmark report outputs | first pairs from 014 | create | reports captured from the fixture run for all five modes |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read the missing-fixtures finding and the audit (R2), foundations (P2-3), and motion (P2) per-mode shapes
- [ ] Confirm the 014 report-pair shape so the fixtures align with the harness
- [ ] Read each mode's manual_testing_playbook scenarios and their expected-intent and expected-resources metadata

### Phase 2: Core Implementation
- [ ] Derive a checked-in fixture set per mode from the playbook scenarios (id, prompt, expected mode, expected intent, expected resources)
- [ ] Persist a motion-labelled benchmark report artifact under the motion benchmark path
- [ ] Capture the fixture set for all five modes in the 014 benchmark tree

### Phase 3: Verification
- [ ] Run the skill-benchmark against the seeded fixtures for all five modes and capture the reports
- [ ] Confirm motion has its own labelled report artifact and each fixture cites its source scenario
- [ ] Run `validate.sh --strict` on this packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Benchmark | All five modes against the seeded fixtures | The skill-benchmark harness |
| Traceability | Each fixture to its source scenario | Fixture-to-playbook scenario-id cross-check |
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

- **Trigger**: The fixtures drift from the scenarios, the harness rejects them, or the motion report is mislabelled.
- **Procedure**: The fixtures and reports are additive checked-in files. To revert, delete them. No routing config or design content is mutated, so rollback is a file delete.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

| Trigger | Detection | Action | Owner |
|---------|-----------|--------|-------|
| Fixture drifts from its source scenario | Cross-check finds a fixture with no matching scenario id | Re-derive the fixture from the scenario and cite the id | implementing subagent |
| Harness rejects a fixture shape | The skill-benchmark errors on a fixture | Match the existing 014 report-pair shape and rerun | implementing subagent |
| Motion report mislabelled or misplaced | The report is not under the motion benchmark path | Relabel and move the report under the motion path | implementing subagent |
<!-- /ANCHOR:enhanced-rollback -->
