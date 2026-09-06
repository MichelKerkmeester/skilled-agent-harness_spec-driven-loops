---
title: "Implementation Plan: Doc path, strict-mode and retired-capability fixes"
description: "Each confirmed row is fixed by an exact-string replacement at its cited line, asserted by a script so a missed match fails loudly instead of silently."
trigger_phrases:
  - "remediation execution plan"
  - "exact string replacement gate"
  - "strict mode warning semantics doc fix"
  - "phantom validator rule scripts"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Doc path, strict-mode and retired-capability fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | system-spec-kit skill docs |
| **Storage** | None |
| **Testing** | ripgrep residue scan, trigger-index regeneration |

### Overview
Each confirmed row is fixed by an exact-string replacement at its cited line, asserted by a script so a missed match fails loudly instead of silently. The retired names are then swept with ripgrep and the trigger index is regenerated.
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
- **Replacement script**: One assertion per row; stops on the first miss
- **Residue sweep**: ripgrep over the three doc trees for every retired name

### Data Flow
Confirmed table in, exact replacements out, residue sweep and index regeneration as the gate.
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
| Residue | Retired names across the skill docs | ripgrep |
| Index | Trigger index regeneration | generate-trigger-index.mjs |
| Packet | This child | validate.sh --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Confirmed findings from 025 | Internal | Green | Nothing to fix |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A replacement proves wrong
- **Procedure**: `git checkout` the single file; every change is one hunk in one file
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
