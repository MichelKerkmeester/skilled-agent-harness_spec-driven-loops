---
title: "Implementation Plan: Lane C Compiled-Routing Benchmark Alignment"
description: "Planned implementation sequence for adding flag-on compiled invocation, legacy/compiled route-gold parity, drift classification, and report gating around the frozen Lane C scorer."
trigger_phrases:
  - "Lane C compiled routing plan"
  - "benchmark compiled legacy parity plan"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Lane C Compiled-Routing Benchmark Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
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
| **Language/Stack** | Node.js/CommonJS harness plus Vitest |
| **Legacy observation** | Frozen `router-replay.cjs` Mode A output |
| **Compiled observation** | Public `.opencode/bin/compiled-route.cjs` child process with flag `1` |
| **Gold evaluator** | Frozen `evaluateRouteGold()` export |
| **Report authority** | `report.json`, with Markdown rendered by `build-report.cjs` |
| **Mutation posture** | Read-only diagnostics; no manifest mint or routing-input write |

### Overview

Add one new parity module at the orchestrator boundary. It hashes the frozen files, asks the shared eligibility/status interface what compiled outcome is expected, obtains legacy and compiled observations, normalizes them, and evaluates both against the existing route gold. The orchestrator adds structured parity results and a distinct gate; the scorer and scenario loader remain unchanged.

This design keeps responsibilities clean: existing files continue to define legacy replay and scoring, while the new harness proves the served compiled path matches them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] P0 provides a stable public compiled front door and machine-readable serving-status cause.
- [ ] P3 provides shared eligibility and manifest discovery without a local hub list.
- [ ] Baseline hashes and legacy benchmark reports are captured.
- [ ] Normalized routing fields and order semantics are approved.

### Definition of Done

- [ ] Every eligible route-gold row invokes the flag-on compiled front door.
- [ ] Legacy and compiled projections both pass the same gold and compare equal.
- [ ] Drift, no-manifest legacy, and breakage are reported distinctly.
- [ ] D1-D5 legacy results remain unchanged.
- [ ] JSON, Markdown, CLI, and README describe the same gate.
- [ ] Frozen file hashes remain identical.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Dual-observation adapter around an immutable scorer. The parity module converts two executor-specific shapes into one routing projection, while the current scorer continues evaluating the legacy-compatible observed shape.

### Key Components

- **Eligibility/status adapter**: decides whether compiled parity is required and why a sentinel occurred.
- **Compiled child-process adapter**: runs the public front door with an isolated flag-on environment.
- **Normalizer**: maps legacy intents and compiled qualified targets through `mode-registry.json` into action/selection/ordered targets.
- **Parity evaluator**: calls frozen route-gold evaluation twice and compares routing projections.
- **Report gate**: aggregates row results without changing D1-D5 values.

### Data Flow

```text
authored scenario + gold
          |
          +----> frozen legacy replay ----+
          |                               |
          +----> flag-on compiled CLI ----+--> normalize --> gold x2 + equality
                                                   |
                                                   v
                                          report.compiledRouting
                                                   |
                                      orchestrator verdict/exit gate
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Planned Action | Verification |
|---------|--------------|----------------|--------------|
| New parity module | None | Add invocation, normalization, parity, status, and digest logic | Dedicated Vitest suite |
| `run-skill-benchmark.cjs` | Orchestrates Lane C | Call parity module and apply distinct gate | End-to-end temp report test |
| `build-report.cjs` | Renders Markdown from JSON | Render compiled parity without independent scoring | JSON-to-Markdown snapshot |
| Lane C README/CLI | Documents current Mode A/B behavior | Add parity option/resolved mode and report schema | Documentation test/review |
| Frozen replay/scorer/loader | Legacy observation, scoring, gold loading | Import and hash only | Diff plus digest equality |
| Public compiled front door | Flag-gated served decision | Spawn with child-only env | Fresh, drifted, and broken fixtures |
| Shared status/eligibility API | Cause and expectation authority | Consume read-only | State-matrix tests |

Required inventories:

- Enumerate every current Lane C exit code and verdict string before adding the gate.
- Enumerate legacy telemetry and compiled target shapes for all seven hub archetypes.
- Capture a baseline report for a representative hub and non-hub skill.
- Pin the frozen file hashes before the first implementation edit.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Capture frozen hashes, current Lane C reports, verdicts, and exit codes.
- [ ] Pin shared eligibility/status APIs and normalized routing schema.
- [ ] Design temp fixtures for fresh, drifted, missing, broken, and divergent cases without live manifest mutation.

### Phase 2: Core Implementation

- [ ] Add `compiled-routing-parity.cjs` with frozen hash verification, child env isolation, normalization, gold evaluation, and equality comparison.
- [ ] Integrate the parity lane into `run-skill-benchmark.cjs` for eligible hub route-gold rows.
- [ ] Add `report.compiledRouting` and distinct verdict/exit handling without changing the score aggregate.
- [ ] Render the report block from JSON in `build-report.cjs`.
- [ ] Document the resolved parity mode and state behavior in README and CLI usage.

### Phase 3: Verification

- [ ] Add deterministic Vitest coverage for the full state and routing-shape matrix.
- [ ] Compare post-change legacy D1-D5 reports with baselines.
- [ ] Run the existing Lane C suites plus the new parity suite.
- [ ] Re-hash the frozen files and run strict spec-folder validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Planned Tools |
|-----------|-------|---------------|
| Unit | Normalization and first-difference diagnostics | Vitest table tests |
| Process | Child flag-on invocation and parent env isolation | `spawnSync` fixture wrapper |
| Contract | Fresh eligible hub parity | Temp hub/manifest fixture plus same route gold |
| Contract | Missing and stale manifest | Shared status adapter fixtures |
| Negative | Fresh manifest with invalid JSON/sentinel, forced route divergence | Vitest failure fixtures |
| Regression | Unchanged D1-D5 and existing verdicts when parity not applicable | Baseline report deep comparison |
| Integrity | Frozen file hashes | SHA-256 before/after and test-time assertion |
| End-to-end | JSON report, Markdown rendering, process exit | Programmatic `run()` in temp output directory |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Default-on decision contracts | Internal | Available | Status ownership must stay single-sourced |
| P0 stable front door and status cause | Internal | Planned | Compiled invocation or cause classification remains fragile |
| P3 eligibility and manifest discovery | Internal | Planned | Harness would need a forbidden local hub list |
| Current Lane C modules and tests | Internal | Available | Provide the immutable baseline and integration seam |
| Seven hub registries | Internal | Available | Required for identifier normalization |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: D1-D5 baseline drift, false parity failures, environment leakage, live manifest mutation, incorrect drift classification, or frozen hash mismatch.
- **Procedure**: Remove the orchestrator/report integration and new parity module from the active Lane C path; restore prior CLI/report behavior; retain diagnostic fixtures only if they remain inert; rerun existing Lane C suites and confirm baseline reports. The frozen files require no rollback because they are never edited.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
P0 front door/status + P3 eligibility
                 |
                 v
baseline -> parity module -> orchestrator/report -> fixtures/tests -> adoption
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Stable P0/P3 interfaces | Core implementation |
| Core implementation | Setup | Verification |
| Verification | Core implementation | Lane C compiled-reality gate |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Relative Effort |
|-------|------------|-----------------|
| Interface and baseline capture | Medium | Cross-packet contract inspection |
| Parity module | High | Multi-shape normalization and status handling |
| Orchestrator/report integration | Medium | Additive gate with score non-regression |
| Fixtures and tests | High | Full state and bundle matrix |
| Documentation | Low | README, CLI, report schema |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Implementation Checklist

- [ ] Frozen file hashes captured.
- [ ] Representative legacy reports captured.
- [ ] All fixtures are temp/injected and cannot reach production manifests.
- [ ] Parent environment snapshot is asserted in tests.

### Rollback Procedure

1. Disable/remove the new parity call from the orchestrator.
2. Restore prior report rendering and usage text.
3. Run the existing Lane C suite and compare representative reports to baseline.
4. Re-hash the frozen files and halt if any digest differs.

### Data Reversal

- **Has persistent data changes?** No.
- **Reversal procedure**: Delete only test-temp output through the test harness; production manifests and routing inputs are never mutated by design.
<!-- /ANCHOR:enhanced-rollback -->

