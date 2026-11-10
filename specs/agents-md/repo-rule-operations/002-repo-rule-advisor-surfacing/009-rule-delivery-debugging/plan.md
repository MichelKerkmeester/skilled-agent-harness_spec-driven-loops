---
title: "Implementation Plan: Rule delivery debugging"
description: "Measure how often each executor skips a mandated rule load, read the missed transcripts to find the cause, then test delivery fixes as pre-registered harness arms and adopt the winner after the earlier windows close."
trigger_phrases:
  - "rule delivery debugging plan"
  - "mandated rule load fix plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Rule delivery debugging

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python harness and analyzer, Markdown instruction files |
| **Framework** | None |
| **Storage** | Executor transcripts, aggregates-only result files |
| **Testing** | `rule-experiment.py score`, phase 004 analyzer, pytest for any harness change |

### Overview
Measure how often each executor skips a mandated rule load, read the missed transcripts to find the cause, then test delivery fixes as pre-registered harness arms. The winner goes live only after the 006 and 007 windows are measured.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement backed by the 004 baseline and a 16-run pilot
- [ ] Predecessor handoff met: phase 008 write-task runs scored
- [x] Harness committed in `edba53daeb`

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests and checks named in the testing strategy pass
- [ ] spec.md, plan.md and tasks.md synchronized
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Measure, audit the misses, then a pre-registered arm comparison

### Key Components
- **Harness**: `rule-experiment.py` builds one isolated git repository per arm, runs DeepSeek through Devin and Luna through Codex on fresh copies in a seeded order, and scores transcripts as aggregates
- **Cause audit**: a read of each missed run's transcript that records whether the mandate arrived, where it was cut, what instruction it competed with, and whether the model saw it and moved on
- **Arms**: mandate wording and position, router shape, a project-level `AGENTS.md` in the environment, and a hook only past the D3 threshold
- **Live check**: the phase 004 analyzer measures a window after adoption

### Data Flow
Prompt sets with no mention of rules go to each arm's environment. Transcripts feed `score` for rates and the audit for causes. The causes pick the arms, the pre-registration fixes the decision rule, and the winning arm's change is applied to the live file it names.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Root `AGENTS.md` | Carries both mandates. Claude Code reads it through the `~/.claude/CLAUDE.md` symlink | Unchanged until adoption | `check-rule-copies.js` after adoption |
| `.codex/AGENTS.md` | Codex global, reached through `~/.codex/AGENTS.md`. Carries neither mandate | Traced in T003 | `grep` and the T003 note |
| `REPO RULES.md` | The router Gate 5 opens | Unchanged until adoption | `check-repo-rules.cjs` after adoption |
| `rule-experiment.py` | Builds arms and scores runs | Changed only if an arm needs it | pytest |
| Phase 004 analyzer | Splits results on rule blob versions | Not a consumer of arms, measures the live window | Analyzer report |
| `check-rule-copies.js` | Guards the clauses that must end inside Devin's 16,384-byte prefix | Anchor swapped at adoption: the removed bullet's line out, `#### GATE 6:` in | `check-rule-copies.test.sh` |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

**Arm instructions (REQ-008).** Arms vary the instructions through a project-level copy of the repository `AGENTS.md` in each environment, not a copied global. Codex and OpenCode load a project `AGENTS.md` live, and the 007 and 008 environments, which had none, delivered neither mandate to them (`results/delivery-trace.md`). The global files stay untouched.

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Measurement | Natural miss rates and arm runs | `rule-experiment.py score` |
| Manual | Cause audit of missed runs | Transcript read, counts only in `results/` |
| Unit | Any harness change | pytest |
| Integration | Live files after adoption | `check-rule-copies.js`, `check-repo-rules.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `rule-experiment.py` | Internal | Green | No isolated runs |
| Phase 008 write-task runs | Internal | Yellow | Gate 5 rate needs runs of its own |
| Phase 006 and 007 windows measured | Internal | Yellow | Adoption waits |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The adopted fix raises a measured miss rate in the live window, or breaks a guard
- **Procedure**: Revert the adoption commit. Arm runs change nothing live, so they need no rollback
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
| Setup | Harness committed | Implementation |
| Implementation | Setup, 008 write-task runs | Verification |
| Verification | Implementation, 006 and 007 windows measured | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | 3-4 hours |
| Core Implementation | High | 6-10 hours plus run time |
| Verification | Med | 2-3 hours |
| **Total** |  | **11-17 hours of work, plus waiting for the earlier windows** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The adoption lands as its own revertable commit
- [ ] `check-rule-copies.js` and `check-repo-rules.cjs` pass before the commit

### Rollback Procedure
1. Revert the adoption commit.
2. Rerun `check-rule-copies.js` and `check-repo-rules.cjs` on the reverted tree.
3. Record the reversal and its measured cause in `results/`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
