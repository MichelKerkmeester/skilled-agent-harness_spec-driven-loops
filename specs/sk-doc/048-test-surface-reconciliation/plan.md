---
title: "Implementation Plan: Reconcile the test and fixture surfaces that had frozen against a tree that moved"
description: "Group the failures by suite, give each group to a separate reviewer with the same hard rule, and require every fix to state which side was wrong and the evidence that settled it."
trigger_phrases:
  - "triage stale test versus regression"
  - "parallel suite reconciliation"
  - "re-pin a drift tripwire"
  - "prove the assertion still bites"
importance_tier: "high"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Reconcile the test and fixture surfaces that had frozen against a tree that moved

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Nothing here shares a root cause. What the failures share is a shape: a deliberate change
landed, and something that named the old shape was not updated with it. That makes them
cheap to fix once diagnosed and expensive to diagnose, because a stale expectation and a
real regression look identical from the outside.

Several of the artifacts involved are pinned digests whose entire job is to notice drift.
A stale pin is therefore not a nuisance: it is the tripwire reporting a legitimate edit as
corruption, which trains a reader to re-pin without looking. Every re-pin here had to be
preceded by proof that the pin still bites.

### Overview

Group by suite, work the groups in parallel, and hold every group to the same rule: fix the
root cause, never weaken an assertion, and state which side was wrong with the evidence.
Then re-measure the whole surface from the final state rather than trusting the group
reports.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Every failing suite enumerated with its failure count before work began
- [x] Success criteria measurable as suite counts
- [x] The compiled-routing repair landed first, since several suites read its output

### Definition of Done
- [x] All acceptance criteria met
- [x] Every suite in scope reports zero failures
- [x] Docs updated (spec/plan/tasks/acceptance-criteria/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Parallel triage against a shared contract. Each reviewer owns one suite group and reports in
the same shape, so the results can be compared rather than merely collected.

### Key Components

- **Suite groups**: benchmark, spec-kit validation, advisor, canary validators, runtime,
  communication and plugins, Python
- **The shared rule**: root cause only, no weakened assertion, and a stated verdict on which
  side was wrong
- **The re-measure**: every claim re-run from the final state by the orchestrator, not
  accepted from a report

### Data Flow

A failure is traced to the change that caused it, that change is confirmed deliberate from
history, and only then is the stale side updated. Where the subject of a test was removed
outright, the test is retargeted at something still real.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Benchmark suite and fixtures | Scores every skill | Update stale paths, retire dead subjects | 53 files and 673 tests, none failing |
| `load-playbook-scenarios.cjs` | Reads a playbook into scenarios | Fix a real parse defect | sk-code went from 1 scenario to 30 |
| `mcp-tooling/ROUTER.md` | Stage-two routing for the hub | Add the mode's missing wiring | Its resources resolve instead of returning empty |
| Advisor phrase anchors | Stage-one routing | Raise three anchors to the routing floor | Regression gate green with an added case |
| Canary validators, five hubs | Attest each hub's compiled policy | Re-pin, update literals, retarget falsifiers | All five exit zero |
| Validation fixtures | Define what the validator accepts | Clear errors, preserve every warning | Five compliant fixtures at zero errors, sixteen negatives still failing |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->


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
| Suite | Benchmark, runtime, ai-council, communication, design backend | Vitest |
| Suite | Manifest and plugin contracts | `node --test` |
| Suite | Advisor scorer, spec-kit scripts, command assets | pytest |
| Gate | Per-hub compiled policy | Five canary validators |
| Gate | Validator behaviour on known-good and known-bad packets | The validation fixture suite |
| Control | Every negative fixture must keep failing on its original rule | Re-swept before and after
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The compiled-routing serving repair | Internal | Green | Several suites read the promoted mirror and would measure a stale policy |
| Machine capacity | Environment | Yellow | Parallel reviewers drove load high enough to time out one suite run, which re-ran clean |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any suite ending worse than it started, or a negative fixture that stops failing
- **Procedure**: `git checkout` the paths of the group that regressed, since the groups are
  disjoint by file and can be reverted independently
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Enumerate every suite and its failure count |
| Core Implementation | High | Seven groups worked in parallel |
| Verification | High | Re-measure every claim from the final state |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every suite's failure count captured before any edit
- [x] Groups kept disjoint by file so one can be reverted without the others
- [x] Negative fixtures and falsifiers identified up front as the controls

### Rollback Procedure
1. Identify the group whose files regressed
2. `git checkout` those paths
3. Re-run that group's suite and confirm it returns to its recorded starting count
4. No stakeholder notice needed: this surface is internal to the workspace

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

