---
title: "Implementation Plan: Table wording experiment"
description: "Build one isolated test environment per wording, run both executors on fresh copies in a seeded interleaved order, and apply a rule written before the data exists."
trigger_phrases:
  - "table wording experiment plan"
  - "no table rule wording plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Table wording experiment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python harness and the phase 004 analyzer checks |
| **Framework** | None |
| **Storage** | Executor transcripts, aggregates-only results |
| **Testing** | `rule-experiment.py score` |

### Overview
Build one isolated test environment per wording, run both executors on fresh copies in a seeded interleaved order, and apply a rule written before the data exists. This replaces the live ABAB time blocks, at the operator's request to run now.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement backed by measurement in `002-rule-concision-and-loading`
- [x] Predecessor handoff met: Phase 004 analyzer and baseline
- [x] Affected files identified by codebase exploration

### Definition of Done
- [ ] All requirements met
- [ ] Tests and checks named in the testing strategy pass
- [ ] spec.md, plan.md and tasks.md synchronized
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-arm controlled experiment in isolated test environments

### Key Components
- **Variants**: the current block at `communication.md:91-99` and the 152-byte imperative drafted in `002-rule-concision-and-loading/research/lineages/luna-compliance/iterations/iteration-003.md`, both keeping the in-flight exception
- **Harness**: `rule-experiment.py` builds each arm from commit `edba53daeb` and `experiment/arms.json`, then runs and scores
- **Executors**: DeepSeek V4.1 Flash through Devin and GPT-6 Luna through Codex, each with its own global instructions

### Data Flow
Each run copies its arm's environment fresh and gets one of the 30 prompts in the seed-16 order. `score` reads the transcripts, applies the phase 004 analyzer's checks, and prints aggregates per arm and executor. The live rule files stay unchanged until the decision is adopted.
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
| Measurement | 600 runs, two arms, two executors | `rule-experiment.py score` |
| Manual | Requested-table audit on a sample | Hand review of aggregates flagged by the analyzer |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `rule-experiment.py` | Internal | Green | No isolated runs |
| Phase 006 window measured | Internal | Yellow | The chosen wording cannot go live |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The experiment is abandoned, or an adopted wording is later reversed
- **Procedure**: The run changes nothing live. If a wording was adopted, restore the current one with one commit
<!-- /ANCHOR:rollback -->

---
