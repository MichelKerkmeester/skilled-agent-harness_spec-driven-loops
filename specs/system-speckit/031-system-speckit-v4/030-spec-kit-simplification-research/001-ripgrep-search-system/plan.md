---
title: "Implementation Plan: Ripgrep search system research"
description: "One GLM 5.3 Flash lineage runs the research loop for ten iterations; this session then reproduces every finding."
trigger_phrases:
  - "research lane execution plan"
  - "ripgrep search system lane plan"
  - "reproduction before remediation"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Ripgrep search system research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and TypeScript corpus as ground truth |
| **Framework** | system-deep-loop research mode via fanout-run.cjs |
| **Storage** | JSONL state under research/ |
| **Testing** | Reproduction by hand in this session |

### Overview
One cli-pi lineage on GLM 5.3 Flash max runs the deep-research loop for ten iterations, one charted angle per iteration, writing two-sided citations. After the lane finishes, this session reproduces each finding and writes the confirmed table that remediation consumes.
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
Command-owned research loop with fresh context per iteration

### Key Components
- **fanout-run.cjs**: owns dispatch, state, convergence bookkeeping and synthesis
- **Research charter**: the improved prompt that names the corpus, the angles and the output shape
- **Reproduction pass**: opens every cited line in this session and keeps only what reproduces

### Data Flow
Charter and spec folder go into the fan-out runner; each iteration reads state, picks an angle, reads the corpus, writes an iteration file and one event; synthesis writes research.md; this session reproduces and ranks.
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
| Loop integrity | Ten iteration files and ten events | listing, JSONL line count |
| Finding reproduction | Every P0 and P1 finding | open the cited lines; run the cited command |
| Packet validation | This child | `validate.sh <child> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| pi CLI with the DevPass provider | External | Green | Fall back to OpenRouter |
| system-deep-loop runtime (fanout-run.cjs) | Internal | Green | No lane can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A lane produces unusable output or the charter proves wrong
- **Procedure**: Delete the lineage directory under research/, correct the charter and rerun
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (charter, probe) ──► Run (ten iterations) ──► Reproduce ──► Verify and hand off
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Run |
| Run | Setup | Reproduce |
| Reproduce | Run | Verify |
| Verify | Reproduce | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Implementation | Med | 1-3 hours of unattended lane time |
| Verification | Med | 2-3 hours of reproduction |
| **Total** | | **4-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): not needed, the lane writes only new files under research/
- [x] Feature flag configured: not applicable
- [x] Monitoring alerts set: one-minute checks by the orchestrating session

### Rollback Procedure
1. Kill the lane process if it is still running
2. Delete the lineage directory under research/
3. Rerun strict validation on the child
4. Nothing user-facing changes in this phase

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
