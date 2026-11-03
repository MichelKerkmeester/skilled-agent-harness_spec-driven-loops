---
title: "Implementation Plan: Phase 8: release-coverage"
description: "Fold the packet into v4.0.1.0 and the README from one DeepSeek build, and add a release-coverage check to the alignment harness from a second, then prove the check on this branch."
trigger_phrases:
  - "web only frontend plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: release-coverage

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Node CommonJS |
| **Framework** | Root release notes, alignment harness |
| **Storage** | None |
| **Testing** | `node --test`, `validate_document.py`, `validate.sh` |

### Overview
One DeepSeek V4.1 Flash max build folds the packet into the open release notes and the README; a second adds `check-release-coverage.cjs` to the alignment harness. The check runs on this branch before and after the fold.
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
- [x] The release-coverage check passes on this branch and its tests pass
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A deterministic floor under a judgment lens: the battery check proves that each added skill changelog and skill is named, and the widened lane lens judges whether the description is right.

### Key Components
- **`check-release-coverage.cjs`**: reads the scope's added paths and the newest root release notes.
- **Surface map S6**: runs the check once per scope and grades a missing notes folder `cannot_run`.

### Data Flow
`scope.json` → added changelog and SKILL.md paths → required ids → matched against the release notes and the README → `MISSING` lines and a status.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `v4.0.1.0.md` | Open root release notes | Update | `validate_document.py` |
| Root `README.md` | Front door | Update | README reference and count checkers |
| Alignment harness S6 | No deterministic check | Add one | Its tests, then a run on this branch |
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
| Unit | The release-coverage rules | `node --test .skilled/commands/assets/local-skilled-alignment/tests/` |
| Integration | The check on this branch | `check-release-coverage.cjs --scope` on a worktree scope |
| Manual | The release notes read right | Read against the per-skill changelogs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `opencode run -m opencode-go/deepseek-v4.1-flash#max` | External | Green this session | No build; stop and ask |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the release notes or README fail validation, or the check flags a false gap.
- **Procedure**: `git revert` the docs commit; delete the harness script and restore S6's `checks: []` in the main checkout.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 007 closed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase close |
<!-- /ANCHOR:phase-deps -->

---
