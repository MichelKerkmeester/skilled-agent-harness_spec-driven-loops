---
title: "Implementation Plan: Rule delivery instrumentation"
description: "Extend the existing compliance script instead of adding a runtime hook: Claude Code and Codex transcripts already record tool calls, hook injections and compaction boundaries, so an offline pass measures what a hook would, at zero context cost."
trigger_phrases:
  - "rule delivery instrumentation plan"
  - "gate 5 miss rate plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Rule delivery instrumentation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 standard library |
| **Framework** | None |
| **Storage** | Local transcript files, read-only |
| **Testing** | pytest via `sk-doc/scripts/tests/run-script-tests.sh` |

### Overview
Extend the existing compliance script instead of adding a runtime hook: Claude Code and Codex transcripts already record tool calls, hook injections and compaction boundaries, so an offline pass measures what a hook would, at zero context cost.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement backed by measurement in `002-rule-concision-and-loading`
- [ ] Predecessor handoff met: `002-rule-concision-and-loading/prep/measure-rule-compliance.py`, the starting point
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
Offline batch analysis with per-runtime adapters

### Key Components
- **Adapters**: one per transcript format, each yielding normalized events (tool call, reply, injection, boundary)
- **Measures**: receipts, eligibility, misses, prohibition checks, version split
- **Report**: aggregates with denominators and Wilson intervals, text and JSON

### Data Flow
Transcript files go through an adapter into normalized events. Measures fold events per session and per compaction window, then the report prints counts and rates only.

### Decision
**ADR-001: Offline analyzer instead of a runtime observer hook.** A logging-only hook beside `spec-gate-enforce` was the 001 recommendation. Extending the script in place covers Claude Code and Codex fully, because both transcripts already carry the tool calls, injections and boundaries a hook would log. A hook fails nothing the analyzer does not already cover for those two, so it is deferred until a needed runtime is shown to keep no transcript.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `prep/measure-rule-compliance.py` | Current script | Superseded by the promoted copy | 002 packet keeps its frozen copy as evidence |
| `spec-gate-core.mjs` exempt paths | Source of truth for exempt writes | Mirrored, not imported | Test pins the mirrored list |
| `sk-create-repo-rule/SKILL.md` | Lists the mode's scripts | Update | Doc lists the new script |
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
| Unit | Adapters, receipts, eligibility, version split, interval math | pytest |
| Integration | Full run over synthetic multi-session fixtures | pytest |
| Manual | Run on real transcripts and compare with the evidence pack | Command line |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Local transcript directories | Internal | Green | That runtime reports zero sessions |
| git history of `.skilled/repo-rules` | Internal | Green | Version split unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The analyzer reports wrong numbers
- **Procedure**: Revert the commit. Nothing at runtime depends on it.
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
| Setup | `002-rule-concision-and-loading/prep/measure-rule-compliance.py`, the starting point | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | 005-trigger-coverage-check |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 6-8 hours |
| Verification | Med | 2-3 hours |
| **Total** |  | **9-13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Each change lands as its own revertable commit
- [ ] The checks in the testing strategy pass before the commit

### Rollback Procedure
1. Revert the commit. Nothing at runtime depends on it.
2. Rerun the checks named in the testing strategy on the reverted tree.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
