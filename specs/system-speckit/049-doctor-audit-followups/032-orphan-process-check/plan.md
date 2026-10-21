---
title: "Implementation Plan: Phase 32: orphan-process-check"
description: "A read-only scan of the process table for orphaned helpers, an informational doctor line, and a guarded opt-in reap."
trigger_phrases:
  - "orphan process check plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 32: orphan-process-check

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, built-ins only |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` with fixture `ps` output |

### Overview
The script reads `ps` once, keeps processes owned by the current user with parent PID 1 and an age over the threshold, classifies them against helper patterns and an allowlist, and prints a table or JSON. The reap reads the table again and signals only rows whose command line and start time are unchanged.
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
- [ ] Tests passing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Report by default, act only on explicit opt-in with a re-check right before acting.

### Key Components
- **Scanner**: parses `ps -axo pid,ppid,user,etime,rss,command`
- **Classifier**: helper patterns, stale-checkout detection and the daemon allowlist
- **Reaper**: re-verify, SIGTERM, wait, then report

### Data Flow
`/doctor:setup` runs the scanner and prints one line. The operator runs the script with `--reap`, sees the list, confirms, and each PID is re-checked and signalled.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `/doctor:setup` | Setup health report | Adds one informational line | Doctor tests |
| Doctor scripts README | Lists the scripts | Adds the script | `validate_document.py` |

Required inventories:
- Process patterns from the 2026-10-21 cleanup, each with one fixture row.
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
| Unit | Parsing, classification, allowlist, PID-reuse guard | `node --test` |
| Integration | `/doctor:setup` line from a fixture | doctor tests |
| Manual | Scan this machine and compare with a hand count | `ps` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `/doctor:setup` workflow | Internal | Green | No doctor line |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The scan reports a daemon, or the doctor line slows setup.
- **Procedure**: Revert the commit; the doctor step goes with it.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Implementation | Med | 2 hours |
| Verification | Med | 1.5 hours |
| **Total** |  | **About 4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data migration
- [ ] Baseline measurement recorded
- [ ] Suite green before merge

### Rollback Procedure
1. Revert the commit; the doctor step goes with it.
2. Rerun the affected test suites.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: None needed; the change holds no stored data.
<!-- /ANCHOR:enhanced-rollback -->

---
