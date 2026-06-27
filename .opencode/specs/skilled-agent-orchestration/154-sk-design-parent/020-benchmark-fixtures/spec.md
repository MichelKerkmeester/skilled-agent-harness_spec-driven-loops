---
title: "Feature Specification: sk-design checked-in routing-benchmark fixtures"
description: "Completed Level-2 implementation phase: captured deterministic Mode-A routing-benchmark reports per mode from each mode's manual_testing_playbook scenarios, so every claimed score is reproducible from checked-in artifacts."
trigger_phrases:
  - "sk-design benchmark fixtures phase"
  - "routing benchmark fixture set per mode"
  - "motion benchmark report artifact"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/020-benchmark-fixtures"
    last_updated_at: "2026-06-27T07:45:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Mode A reports captured"
    next_safe_action: "Use the checked-in reports as the reproducible routing baseline"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-020-benchmark-fixtures"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-design checked-in routing-benchmark fixtures

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../019-handoff-card/spec.md |
| **Successor** | ../021-content-topups/spec.md |
| **Handoff Criteria** | A checked-in routing-benchmark report pair exists per mode, derived from each mode's manual_testing_playbook scenarios, the deterministic Mode-A skill-benchmark runs for all five modes, motion has its own report artifact, and `validate.sh --strict` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
No mode has its claimed routing score backed by checked-in fixtures, so the scores are not reproducible. Every lineage noted its expected `014-routing-benchmark/<mode>` artifact was absent in its own checkout and treated the operator-supplied score as context (`../015-per-skill-improvement-research/implementation-summary.md`, "No mode has its claimed score backed by checked-in fixtures"). The audit lineage found no checked-in `014-routing-benchmark/design-audit` report and recommended seeding fixtures from its five replay prompts (`../015-per-skill-improvement-research/004-audit/research/lineages/gpt55fast/research.md`, R2). The foundations lineage recommended a results and fixture matrix built from its six manual scenarios (`../015-per-skill-improvement-research/002-foundations/research/lineages/gpt55fast/research.md`, P2-3). The motion lineage found the only checked-in 014 report was the interface one, so motion has no benchmark artifact proving its claimed score (`../015-per-skill-improvement-research/003-motion/research/lineages/gpt55fast/research.md`, P2). The sibling 014 benchmark run produced the first report pairs and is the first such evidence, but a standing per-mode fixture set is still missing (`../014-routing-benchmark/implementation-summary.md`).

### Purpose
Make every claimed routing score reproducible by capturing a checked-in report pair per mode, derived from each mode's manual_testing_playbook scenarios, and by persisting a motion-labelled benchmark report so motion has its own checked-in proof. The skill-benchmark runs in deterministic router-replay mode for all five modes, turning oral scores into evidence that future changes can be measured against.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Capture a checked-in routing-benchmark report pair per mode, derived from each mode's manual_testing_playbook scenarios.
- Persist a motion-labelled benchmark report artifact, since motion previously had no checked-in proof of its score.
- Run the skill-benchmark in deterministic Mode-A router-replay mode for all five modes and capture the resulting reports.

### Out of Scope
- The router and alias changes (`../016-register-loader-contract`, `../017-real-bugs`, `../018-routing-wiring`) whose effects these fixtures will later measure. This phase seeds fixtures and captures a baseline, it does not change routing.
- The handoff schema (`../019-handoff-card`) and the content top-ups (`../021-content-topups`).
- Any new manual scenarios. The fixtures derive from the scenarios that already exist in each mode's playbook.

### Inputs (read-only)
- The missing-fixtures finding: `../015-per-skill-improvement-research/implementation-summary.md` and the audit (R2), foundations (P2-3), and motion (P2) lineage research.
- The sibling benchmark precedent: `../014-routing-benchmark/implementation-summary.md` and its per-mode report pairs.
- Each mode's `manual_testing_playbook/` scenarios, which carry the `expected_intent` and `expected_resources` metadata the fixtures derive from.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `<mode>/skill-benchmark-report.json` | Created | Deterministic Mode-A report JSON per mode, derived from the mode's manual_testing_playbook scenarios |
| `<mode>/skill-benchmark-report.md` | Created | Matching markdown report per mode, including a motion-labelled report under `design-motion/` |
| Packet docs | Updated | Completion status, score deltas, task evidence and verification evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A checked-in report pair exists per mode | Each of the five modes has a checked-in JSON and markdown report derived from its manual_testing_playbook scenarios |
| REQ-002 | The skill-benchmark runs for all five modes | The skill-benchmark executes in deterministic Mode-A router-replay mode and produces a report per mode, so each claimed score is reproducible from checked-in inputs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Motion has its own checked-in benchmark report | A motion-labelled benchmark report artifact exists under `design-motion/`, ending the gap where motion had no checked-in proof |
| REQ-004 | The reports validate cleanly | `validate.sh --strict` passes on this packet and the report JSON files parse |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each mode has a checked-in routing-benchmark report pair derived from its manual_testing_playbook scenarios, and the skill-benchmark runs for all five modes.
- **SC-002**: Motion has its own checked-in benchmark report artifact, every claimed score is reproducible from checked-in reports, and `validate.sh --strict` passes on this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The fixtures drift from the manual scenarios they derive from | The fixture set stops reflecting the documented behavior | Derive each fixture directly from a playbook scenario and cite the scenario id, so the link is explicit |
| Risk | The seeded baseline is captured before the router fixes land | The baseline reflects pre-fix routing | Label the baseline as pre-fix, so later phases measure their improvement against it deliberately |
| Risk | The motion report is generated but not labelled clearly | Future readers repeat the interface-report confusion | Label the motion report by mode and store it under the motion benchmark path |
| Dependency | The missing-fixtures finding and the per-mode research | The fixture scope cannot be grounded | Read the audit (R2), foundations (P2-3), and motion (P2) findings for the per-mode fixture shapes |
| Dependency | `../014-routing-benchmark` report-pair shape | The fixtures may not align with the harness | Match the existing per-mode report-pair shape so the skill-benchmark consumes the fixtures |
| Dependency | Each mode's manual_testing_playbook scenarios | The fixtures cannot be derived | Read each playbook's scenarios and their expected-intent and expected-resources metadata |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| Category | Requirement |
|----------|-------------|
| Reproducibility | Each claimed score is reproducible from checked-in fixtures, not from oral context |
| Traceability | Each report row cites the manual_testing_playbook scenario it derives from |
| Coverage | All five modes have a fixture set, and motion has its own labelled report artifact |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A playbook scenario that is adversarial (an abstention or refusal case) must seed a fixture whose expected outcome is the abstention, not a positive route.
- A mode whose playbook scenario count differs from the others must still produce a complete fixture set, not a truncated one.
- The motion report must be stored under the motion benchmark path even if the harness defaults its output elsewhere.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Low-to-moderate. The work captures reports from existing scenarios and runs the benchmark, not changing routing. The main care points are keeping each report traceable to its source scenario and labelling the motion report clearly so the earlier interface-report confusion does not recur.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Answered. The captured reports reflect the current router state after the 016 through 019 improvements.
- Answered. The reports live directly under this packet in one subfolder per mode.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
