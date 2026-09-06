---
title: "Implementation Plan: Docs reality alignment research"
description: "A single cli-pi lineage runs the deep-research loop for ten iterations against the three documentation trees."
trigger_phrases:
  - "research lane execution plan"
  - "fanout run cli pi lineage"
  - "reproduction pass before remediation"
  - "docs reality alignment research"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Docs reality alignment research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown corpus, TypeScript runtime as ground truth |
| **Framework** | system-deep-loop research mode via fanout-run.cjs |
| **Storage** | JSONL state under research/ |
| **Testing** | Reproduction by hand in this session |

### Overview
A single cli-pi lineage runs the deep-research loop for ten iterations against the three documentation trees. Each iteration takes one angle from the charter, reads docs and runtime side by side, and writes findings with two-sided citations. After the lane finishes, this session reproduces each finding and writes the confirmed table that the remediation phase consumes.
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
- **fanout-run.cjs**: Owns dispatch, state, convergence bookkeeping and synthesis for the lineage
- **Research charter**: The improved prompt that names the corpus, the ground truth, the seven angles and the output shape
- **Reproduction pass**: Opens every cited line in this session and keeps only what reproduces

### Data Flow
Charter and spec folder go into the fan-out runner; each iteration reads state, picks an angle, reads docs and code, writes an iteration file and one event; the reducer refreshes strategy and dashboard; synthesis writes research.md; this session reproduces and ranks.
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
| Loop integrity | Ten iteration files and ten events present | `ls research/**/iterations`, JSONL line count |
| Finding reproduction | Every P0 and P1 finding | Open the cited doc and code lines; run the cited command |
| Packet validation | This child | `validate.sh <child> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| pi CLI 0.85 with the OpenRouter provider | External | Green | Fall back to the DevPass route |
| system-deep-loop runtime (fanout-run.cjs) | Internal | Green | No lane can run; would require a direct pi dispatch, which the skill contract forbids |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A lane produces unusable output or the charter proves wrong
- **Procedure**: Delete the lineage directory under research/, correct the charter and rerun; nothing outside research/ is written in this phase
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
| Setup | Low | 1 hour |
| Core Implementation | Med | 3-6 hours of unattended lane time |
| Verification | Med | 2-3 hours of reproduction |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): not needed, the lane writes only new files under research/
- [x] Feature flag configured: not applicable
- [x] Monitoring alerts set: three-minute log-growth checks by the orchestrating session

### Rollback Procedure
1. Kill the lane process if it is still running
2. Delete the lineage directory under research/
3. Rerun strict validation on the child to confirm it is unchanged
4. Nothing user-facing changes in this phase

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
