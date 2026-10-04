---
title: "Implementation Plan: Gate 5 card pilot"
description: "Generate cards from the rules so they cannot drift, then compare two loading arms in isolated test environments and decide from the measured checks and fallbacks."
trigger_phrases:
  - "gate 5 card pilot plan"
  - "card plus self-check plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Gate 5 card pilot

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS), Markdown, Python analyzer |
| **Framework** | None |
| **Storage** | Generated card files |
| **Testing** | pytest for the generator and check 11, `rule-experiment.py score` |

### Overview
Generate cards from the rules so they cannot drift, then compare two loading arms in isolated test environments and decide from the measured checks and fallbacks. Arm C is dropped under REQ-005.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement backed by measurement in `002-rule-concision-and-loading`
- [ ] Predecessor handoff met: Phase 003 shipped (AGENTS.md budget)
- [x] Affected files identified by codebase exploration

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests and checks named in the testing strategy pass
- [ ] spec.md, plan.md and tasks.md synchronized
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Generated derivative plus a two-arm pilot in isolated test environments

### Key Components
- **Generator**: cuts each rule's Fires when, The rule and SELF-CHECK sections into a card with a link to the full file
- **Check 11**: regenerates and compares, so a stale card fails CI
- **Arms**: `full` and `cards`, each an isolated git repository built by `rule-experiment.py` from `experiment/arms.json`

### Data Flow
Rules feed the generator, and the `cards` arm environment gets its cards under `cards/` with the router pointing at them. Each run copies its arm fresh, and `score` reports the checks per arm and executor. The live router changes only if arm `cards` is adopted.

### Decision
**ADR-001: Generated card files instead of line-range reads.** A router line telling the model to read a line range of each rule would avoid new files, but the range moves with every edit and the SELF-CHECK is not adjacent to The rule. Generated cards with a sync check cost 13 derived files and one check, and they cannot drift silently.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check-repo-rules.cjs` file discovery | Reads every `*.md` in the rules directory | Unchanged if `cards/` is a subdirectory | T001 confirms the readdir filter ignores directories |
| `REPO RULES.md` Load column | What Gate 5 loads | Card links in arm `cards` only | `experiment/arms.json` |
| Check 2, row coverage | Matches trigger rows to rule files | Must accept card links before arm `cards` goes live | Fails by design on the arm router |
| Check 10, Fires-when coverage | Matches rule bullets to router rows | Must resolve card links before arm `cards` goes live | Reports zero bullets on the arm router, against 61 live |
| `AGENTS.md` §8 | Reply-rule load line | Unchanged, arm C dropped | REQ-005 measurement |
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
| Unit | Generator determinism and check 11 drift detection | pytest |
| Integration | Corpus gate with cards present | `check-repo-rules.cjs` |
| Measurement | Isolated runs, two arms | `rule-experiment.py score` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `rule-experiment.py` | Internal | Green | No isolated runs |
| Phase 006 window measured | Internal | Yellow | A winning arm cannot go live |
| Phase 007 decision | Internal | Yellow | A winning arm cannot go live |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The card arm worsens a measured check, or the pilot is abandoned
- **Procedure**: The runs change nothing live. If arm `cards` is rejected, delete the generator, check 11 and its tests. If it was adopted and later fails, revert the adoption commit.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 003 shipped (AGENTS.md budget) | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | 3-4 hours |
| Core Implementation | Med | 4-6 hours plus run time |
| Verification | Med | 3-4 hours |
| **Total** |  | **10-14 hours of work plus run time** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Each change lands as its own revertable commit
- [ ] The checks in the testing strategy pass before the commit

### Rollback Procedure
1. If arm `cards` is rejected, delete the generator, check 11 and its tests. If an adoption fails later, revert the adoption commit.
2. Rerun the checks named in the testing strategy on the reverted tree.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
