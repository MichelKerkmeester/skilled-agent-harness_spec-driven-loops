---
title: "Implementation Plan: Header tags, hook catch and script test fixes"
description: "Mechanical rows are applied with per-file substitutions and a barrel deletion; judgment rows get the smallest change that satisfies the standard or a recorded reason for no change."
trigger_phrases:
  - "remediation execution plan"
  - "exact string replacement gate"
  - "shell header tag normalization"
  - "rule script component header"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Header tags, hook catch and script test fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, shell, ESM scripts |
| **Framework** | system-spec-kit runtime |
| **Storage** | None |
| **Testing** | vitest, tsc, grep |

### Overview
Mechanical rows are applied with per-file substitutions and a barrel deletion; judgment rows get the smallest change that satisfies the standard or a recorded reason for no change. Two vitest files give the untested scripts their coverage floor.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Asserted exact-text replacement per confirmed row

### Key Components
- **Header substitution**: Line-3 replacement per file, then a grep for residue
- **Script tests**: spawnSync of bash against a temp fixture; one happy path and one edge each

### Data Flow
Confirmed tables in, substitutions and small edits out, vitest and typecheck as the gate.
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
| Unit | quality-audit.sh and calculate-completeness.sh | vitest |
| Typecheck | CLI project | tsc |
| Residue | Retired header tags | grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Confirmed findings from 026 | Internal | Green | Nothing to fix |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A substitution or deletion breaks a consumer
- **Procedure**: `git checkout` the file; each change is independent
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Read confirmed table ──► Apply rows ──► Gates ──► Close
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Read | None | Apply |
| Apply | Read | Gates |
| Gates | Apply | Close |
| Close | Gates | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Implementation | Low | 1-2 hours |
| Verification | Low | 30 minutes |
| **Total** | | **2-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): not needed, git holds every prior version
- [x] Feature flag configured: not applicable
- [x] Monitoring alerts set: not applicable

### Rollback Procedure
1. `git checkout HEAD -- <file>` for the offending file
2. Rerun the gate that caught it
3. Record the reverted row as open in the summary
4. No user-facing surface changes

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
