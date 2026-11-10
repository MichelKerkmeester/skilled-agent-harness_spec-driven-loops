---
title: "Implementation Plan: Phase 3: hook-docs-and-standards-alignment"
description: "Fourteen one-file DeepSeek briefs: two hook fixes, one validator fix with its test, and the doc, README and env reference updates an audit found, each claim checked in code first."
trigger_phrases:
  - "hook docs alignment plan"
  - "env reference switch plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: hook-docs-and-standards-alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2 (hooks), Node ESM, Markdown |
| **Framework** | git hooks via global `core.hooksPath` |
| **Storage** | None |
| **Testing** | Hook suites under `.skilled/scripts/git-hooks/tests/`, `node --test` for sk-git |

### Overview
GPT-6 Luna at max effort audited the hook changes read-only through cli-codex. Claude checked each finding against the code, then wrote one literal brief per file; DeepSeek V4.1 Flash at max applied each through cli-pi on opencode-go. Every diff was read and the affected suite run before the next brief.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Every audit claim checked against the hook code; one refuted, two narrowed
- [x] The full list of hook switches derived from the code, not from the audit

### Definition of Done
- [x] All acceptance criteria met
- [x] Hook suites, sk-git node tests, skill-root metadata gate and route guard pass
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Docs follow code: each replacement sentence is written from the hook line it describes.

### Key Components
- **pre-push remote gate**: update approval with `=1`, creation only with the allowlist or `=<branch>`, live-branch update exception.
- **ENV-REFERENCE.md section 5**: the one table of per-invocation hook switches, which `/doctor:env` will read.

### Data Flow
Audit report → claim checked in code → literal brief → DeepSeek edit → diff and suite check.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Both pre-commit hooks | Comment hygiene on staged blobs | Update | pre-commit suite, scratch submodule repo |
| `message-contract.mjs` | Spec trailer check | Update | message-contract test, negative control |
| ENV-REFERENCE.md | Switch reference | Update | Script listing every switch the hooks read |
| Hook and sk-git docs | Behavior description | Update | Read against the cited hook lines |
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
| Unit | Spec containment | `node --test` |
| Integration | Both pre-commit hooks | Hook suites (bash) |
| Manual | Submodule entry, env coverage | Scratch repository, coverage script |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 1 and 2 | Internal | Green (committed) | This phase edits on top of them |
| cli-codex GPT-6 Luna, cli-pi DeepSeek V4.1 Flash | External | Green | Fall back to asking the operator |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A suite fails after a unit and a repair dispatch does not fix it.
- **Procedure**: Revert that unit's files with `git checkout -p` against the pre-unit diff snapshot kept in the scratchpad.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit | Phases 1 and 2 | Fixes |
| Fixes (B1-B11) | Audit | Verify |
| Verify | Fixes | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit | Medium | One read-only dispatch |
| Fixes | Low | Twelve one-file dispatches |
| Verification | Low | One full suite run |
| **Total** | | **Thirteen dispatches plus checks** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Nothing deploys: the hooks go live only when main is merged

### Rollback Procedure
1. Revert the unit's files in worktree 075.
2. Re-run the affected suite.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
