---
title: "Implementation Plan: Phase 8: context-type-hardening"
description: "Measure the shared contextType list going forward: generator and model-writer off-list rates, warning recall and precision over a planted matrix, and false alarms over the corpus."
trigger_phrases:
  - "context type hardening plan"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: context-type-hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node, Python, Bash |
| **Framework** | spec-kit validator rules, sk-doc document validator |
| **Storage** | None, results in `scratch/` |
| **Testing** | vitest, pytest-style script tests |

### Overview
Write the protocol first. Then measure three things against it: what generators and model writers emit, what the two warnings catch over a planted matrix, and what they flag in the existing corpus. Fix only what a measurement shows is wrong.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Measure first, fix on evidence. The protocol is written and dated before any data exists, so no threshold can be fitted to the result.

### Key Components
- **Protocol**: sets, sizes, seeds and thresholds, dated before data.
- **Planted matrix**: every canonical value, alias and protocol off-list value crossed with quoting, case and position.
- **Model writers**: three models write spec docs cold from one brief.
- **Corpus run**: both warnings over every spec doc and skill doc.

### Data Flow
Protocol, then matrix and corpus runs, then the model-writer runs, then fixes with regression tests, then the summary with commands.

### Executors
- **SWE 2 max** through cli-devin (`--model swe-2-max`): code changes, one change per brief that names the file, the edit and the check.
- **Luna 6 max fast** through cli-codex (`--model gpt-6-luna`, `model_reasoning_effort="max"`, `service_tier="fast"`): labeling and review.
- **DeepSeek V4.1 Flash max** through cli-opencode (`opencode-go/deepseek-v4.1-flash --variant max`): the second labeler, from a different model family.
- The orchestrator writes the protocol, settles labeler disagreements and reruns every check before recording it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Filled when a measurement finds a defect: the producer, its consumers and the test that proves the fix.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Protocol and results | Decide what counts | Create | Timestamp precedes every result |

Required inventories:
- Same-class producers: searched for each defect before it is fixed.
- Consumers of changed symbols: listed per fix.
- Matrix axes: named in the protocol before data.
- Algorithm invariant: stated per fix, with its negative case.
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
| Matrix | Both warnings over planted rows | Shell harness and `validate_document.py` |
| Corpus | Every existing doc | Rule helper and validator |
| Model writers | 30 cold-written docs or the protocol's count | cli-devin, cli-codex, cli-opencode |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 shared list | Internal | Green | The measurement that depends on it is recorded as not run |
| The three CLI executors | External | Yellow, check each before dispatch | The measurement that depends on it is recorded as not run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix changes a validation result or a correct count.
- **Procedure**: `git restore` the changed file, since nothing is committed, and rerun the comparison.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Protocol ──► Fixes with tests ──► Measurement ──► Summary
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Protocol | None | Everything |
| Fixes | Protocol | Measurement |
| Measurement | Fixes | Summary |
| Summary | Measurement | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Protocol | Low | 30 minutes |
| Fixes | Medium | 1 to 2 hours |
| Measurement | Medium | 1 to 2 hours, labeling in parallel |
| **Total** | | **2.5 to 4.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): not applicable, no data changes
- [x] Feature flag configured: not applicable, warn-only rules
- [x] Monitoring alerts set: not applicable

### Rollback Procedure
1. `git restore` the changed file.
2. Rerun its tests.
3. Rerun the comparison that guards validation results.
4. Nothing is user-facing until the operator commits.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
