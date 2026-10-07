---
title: "Implementation Plan: Phase 004 — Skill-benchmark mode (Lane C) design + build"
description: "Reconstructed Level 3 implementation plan for the 004 Lane C build phase, derived from spec.md and git history. It restates the three pluggable seams, the resources to add, and the success criteria; the original plan was never written."
trigger_phrases:
  - "skill-benchmark mode build plan"
  - "lane c skill benchmark plan"
importance_tier: "important"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Phase 004 — Skill-benchmark mode (Lane C): design + build

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node scripts under the `deep-improvement` skill (`scripts/skill-benchmark/`, `scripts/shared/loop-host.cjs`), references and assets markdown/JSON, one deep-loop command |
| **Framework** | The `deep-improvement` skill's three-lane layout (agent-improvement, model-benchmark, skill-benchmark) |
| **Storage** | Skill Benchmark Report artifacts (JSON + markdown) |
| **Testing** | vitest suite for the skill; `validate.sh` for this folder |

### Overview
Design and build Lane C (skill-benchmark) in the renamed `deep-improvement` skill: fixtures per target skill, a hint-free dispatcher that captures the resource-load trace, a scorer across the dimensions confirmed in Phase 001, a ranked remediation report, and a `/deep:start-skill-benchmark-loop` command. The Phase 002 implementation playbook is the build guide; the Phase 001 design is authoritative.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 design converged
- [ ] Phase 002 implementation playbook available
- [ ] Lane A/B non-regression contract understood (byte-identical without the mode flag)

### Definition of Done
- [ ] Lane C runs end-to-end on a real target skill and emits a ranked, actionable report
- [ ] Lane A/B behavior unchanged without the mode flag
- [ ] Repeatability evidence captured
- [ ] `validate.sh --strict` green for this phase
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three pluggable seams reused from the existing lanes, plus a mode arm on the shared loop host.

### Key Components
- **Fixtures (candidate-source)**: per-target-skill scenario set — realistic prompt + expected activation + expected reference/asset(s) + correct-outcome rubric, including negatives
- **Dispatcher**: hint-free harness that runs each scenario against an executor and captures the resource-load trace + tool trace
- **Scorer**: actual vs expected across routing/activation accuracy, unprompted discovery precision/recall, efficiency/bottlenecks, usefulness ablation, and structural connectivity
- **Mode**: `scripts/shared/loop-host.cjs --mode=skill-benchmark`; records carry `mode: skill-benchmark`; report carries `scoringMethod`
- **Command**: `/deep:start-skill-benchmark-loop` (`:auto`/`:confirm`)
- **Report**: per-dimension scores + ranked bottlenecks + concrete remediations

### Data Flow
Not recorded beyond the spec's seam description: fixtures feed the dispatcher, the dispatcher produces traces, the scorer compares traces to expected values, and the report builder renders the ranked report.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Fixture loading, scorer dimensions, report builder | Not recorded |
| Integration | End-to-end Lane C run on a real target skill | Not recorded |
| Regression | Lane A/B byte-identity without the mode flag | Not recorded |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 design + Phase 002 playbook | Internal | Not recorded | The shared-vs-Lane-C module split is unfixed |
| Lane B scorer/grader/cache and dispatcher seams | Internal | Not recorded | Lane C cannot reuse the pluggable seams |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not recorded.
- **Procedure**: Not recorded — the mode arm was to be additive, so removing the flag would leave Lane A/B behavior unchanged.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verification |
| Verification | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Not recorded | Not recorded |
| Core Implementation | Not recorded | Not recorded |
| Verification | Not recorded | Not recorded |
| **Total** | | **Not recorded** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Lane A/B identity verified without the mode flag

### Rollback Procedure
1. Not recorded.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not recorded.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Fixtures | None | Scenario set | Dispatcher |
| Dispatcher | Fixtures | Resource-load + tool traces | Scorer |
| Scorer | Dispatcher | Dimension scores | Report builder |
| Report builder | Scorer | Ranked Skill Benchmark Report | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Fixtures** - Not recorded - CRITICAL
2. **Dispatcher** - Not recorded - CRITICAL
3. **Scorer** - Not recorded - CRITICAL
4. **Report builder** - Not recorded - CRITICAL

**Total Critical Path**: Not recorded

**Parallel Opportunities**:
- Not recorded.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup Complete | Fixtures + seams ready | Not recorded |
| M2 | Core Done | Lane C runs end-to-end | Not recorded |
| M3 | Release Ready | Non-regression + validation green | Not recorded |
<!-- /ANCHOR:milestones -->
