---
title: "Implementation Plan: Phase 9: census-hardening"
description: "Fix paths with spaces in the shared citation parser, measure census accuracy per class on stratified samples, batch the git reads and add a redirect-table rebuild flag."
trigger_phrases:
  - "census hardening plan"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: census-hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node |
| **Framework** | sk-doc citation drift scanner |
| **Storage** | None, results in `scratch/` |
| **Testing** | node test runner |

### Overview
Write the protocol first. Fix the space-in-path parser with a negative test against over-matching. Draw stratified samples per class, settle each row by a factual check where one exists and by two model labelers otherwise, and report accuracy with intervals. Then make the census faster and rebuildable without changing a correct count.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met (AC-004 superseded by ADR-001)
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Measure first, fix on evidence. The protocol is written and dated before any data exists, so no threshold can be fitted to the result.

### Key Components
- **Protocol**: sizes, seed, ground-truth rules and thresholds, dated before data.
- **Parser fix**: a spaced path resolves only when the whole path is a tracked file.
- **Sampler**: stratified draw per class with a recorded seed.
- **Batched reader**: one `git cat-file --batch` stream instead of one `git show` per doc.

### Data Flow
Protocol, then the parser fix and census delta, then sampling and labeling, then accuracy, then batching and the rebuild flag, each byte-compared.

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
| Unit | Parser, resolver, rebuild flag | `test-cite-drift-scan.mjs` |
| Accuracy | Stratified samples per class | Factual checks plus two labelers |
| Timing | Full census, median of three | `time` at one commit |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 census at `5285608745fe` | Internal | Green | The measurement that depends on it is recorded as not run |
| Two labelers | External | Yellow, check each before dispatch | The measurement that depends on it is recorded as not run |
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
