---
title: "Implementation Plan: Live Decontaminated-Holdout Lane + T1 to T2 Circularity Gate"
description: "Reconstructed Level 3 implementation plan for the live anti-overfit lane phase. It restates the spec.md purpose, scope and success criteria; the original plan was never written."
trigger_phrases:
  - "live anti-overfit lane plan"
  - "circularity meter gate plan"
importance_tier: "important"
contextType: "implementation"
---

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Live Decontaminated-Holdout Lane + T1 to T2 Circularity Gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Not recorded |
| **Framework** | Skill-benchmark harness — fixture path, live executor seam (`dispatchScenario`), verdict ladder |
| **Storage** | Benchmark report fields (`report.circularity`, `report.overActivation` from the sibling phase); private gold joined post-dispatch |
| **Testing** | Unit tests for gap math and sample-floor status; fixture live path via `parseLiveResult` synthetic NDJSON; existing `--fixtures-dir` e2e in router mode |

### Overview
Route the fixture corpus through the existing live executor seam (today the fixture path hardcodes the deterministic router) so T2 decontaminated holdouts get a real live `resourceRecall`, publish the T1 to T2 circularity meter as a real anti-overfit signal, and add an opt-in gate that is advisory by default with sample-floor and repeat-median flakiness controls, keeping Mode-A the only hard CI gate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Live executor seam reuse. `dispatchScenario` to `live-executor.runLiveScenario` already exists, and `scoreScenario` already does the post-dispatch private-gold join with a `liveTier` carve-out; `computeDivergence` and the `divergence` aggregate parameter are fully built but dead. This phase wires the fixture corpus through that seam.

### Key Components
- `runFixtures({traceMode, executor})` refactored from `runLegacyFixtures` via `dispatchScenario`
- Fixture to scenario adapter feeding the existing `expectedFromScenario`
- `computeCircularityMeter(rows)` — per-tier mean of `dims.d1intra.resourceRecall`
- `computeDivergence` reuse for router-versus-live corroboration
- Opt-in `--anti-overfit-gate` verdict

### Data Flow
A fixture becomes a scenario through the adapter, dispatches through the live seam, and its post-dispatch private-gold join yields a live `resourceRecall`. The circularity meter aggregates those recalls per tier and publishes `report.circularity`; the gate reads it only behind an explicit flag, a sample floor, repeat-and-median and live-mode-only.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Phase 1: Fixture path through the live seam
- [ ] Refactor `runLegacyFixtures` to `runFixtures({traceMode, executor})`
- [ ] Add the fixture to scenario adapter

### Phase 2: Circularity meter
- [ ] Add `computeCircularityMeter(rows)`
- [ ] Publish `report.circularity` and render a report section
- [ ] Reuse `computeDivergence` for router-versus-live corroboration

### Phase 3: Opt-in gate
- [ ] Add the `--anti-overfit-gate` verdict behind the sample floor, repeat-median and live-mode-only controls

### Phase 4: Verification
- [ ] Unit-test gap math and sample-floor status
- [ ] Test the fixture live path via synthetic NDJSON
- [ ] Confirm the existing `--fixtures-dir` e2e passes unchanged in router mode
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Circularity gap math and sample-floor status | vitest |
| Unit | Fixture live path against synthetic NDJSON (no network in CI) | `parseLiveResult` |
| Regression | Existing `--fixtures-dir` e2e unchanged in router mode | Harness e2e |

Live testing carries a cost, so it stays behind `--trace-mode live` with a small default N.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 009 (fixture-as-scenario normalization) | Internal | Not recorded | The live fixture path has no normalization to reuse |
| Existing live executor seam (`dispatchScenario`, `runLiveScenario`) | Internal | Available | T2 holdouts get no live `resourceRecall` |
| `computeDivergence` and the `divergence` aggregate parameter | Internal | Available but dead | Router-versus-live corroboration has no implementation |

The phase feeds the phase-011 optimizer's anti-overfit awareness.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not recorded — no rollback steps were captured when the phase was scaffolded. The spec's risk note keeps the gate advisory by default, behind an explicit flag, so a rollback is limited to disabling the flag rather than reverting the lane.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

The spec records one sequencing dependency: phase 009's fixture-as-scenario normalization is reused here.

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 009 fixture-as-scenario normalization | Phase 009 | Normalization reused by `runFixtures` | The fixture live path |
| `runFixtures({traceMode, executor})` | Phase 009 normalization | Live `resourceRecall` for T2 holdouts | Circularity meter input |
| `computeCircularityMeter(rows)` | `runFixtures` rows | `report.circularity` | The opt-in gate verdict |
| `--anti-overfit-gate` | Sample floor, repeat-median, live-mode-only | `CIRCULARITY-WARN` / `BLOCKED-BY-OVERFIT` verdict | Nothing recorded |

Component boundaries beyond these are Not recorded.
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Not recorded — the spec records sequencing (after phase 009) and the live-cost risk that keeps `--trace-mode live` behind a small default N, but no durations or critical path were captured.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Fixture corpus routed through the live seam | Success criterion 1 (circularity meter published and rendered) | Not recorded |
| M2 | Opt-in gate available | Success criterion 2 (fixture live path tested via synthetic NDJSON) | Not recorded |
| M3 | Regression safety confirmed | Success criterion 3 (existing `--fixtures-dir` e2e passes unchanged in router mode) | Not recorded |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Pre-Task Checklist
- [ ] Read spec.md, this plan and tasks.md before the first edit
- [ ] Confirm the target files match the task's declared scope
- [ ] Know the verification command for the task before starting it

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute tasks in dependency order; parallel work stays inside one workstream |
| TASK-SCOPE | Touch only the files the task names; report anything else as a finding |
| TASK-VERIFY | Run the task's verification before marking it complete |

### Status Reporting Format

`[TASK-ID] [DONE | IN PROGRESS | BLOCKED] - one line of evidence`

### Blocked Task Protocol
1. Mark the task BLOCKED with the blocking fact
2. Record the fact in the tasks.md blocked section
3. Continue with the next unblocked task; escalate after two blocked tasks
<!-- /ANCHOR:ai-execution -->
