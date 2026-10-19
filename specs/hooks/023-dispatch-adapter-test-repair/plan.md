---
title: "Implementation Plan: Document the owning runner for the dispatch adapter vitest suites"
description: "Reproduce both recorded failures, trace each to its runner, and write the command that loads the adapter suites into the two dispatch READMEs."
trigger_phrases:
  - "dispatch adapter test repair plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Document the owning runner for the dispatch adapter vitest suites

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and ESM hook adapters, Markdown |
| **Framework** | Pi extension API, Codex hooks |
| **Storage** | None |
| **Testing** | vitest 5.0.3 under `.skilled/hooks/vitest.config.ts`, `node --test` |

### Overview
Each recorded failure is reproduced under the runner that produced it and then run under the hooks vitest config, where both pass. With no code or test defect found, the fix is the missing documentation: the dispatch READMEs now give the command and say why the plain runners fail.
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
Pi loads each extension through a relative symlink in `.pi/extensions/` and resolves its relative imports from the symlink path. Vitest resolves the symlink to the real file, so a link-relative import misses there unless an alias maps it.

### Key Components
- **`.skilled/hooks/vitest.config.ts`**: roots vitest at the repository and aliases `(../)+.skilled/` to the real `.skilled/` tree.
- **`pi/dispatch-preflight-lint.ts`**: imports `../../.skilled/hooks/shared/hook-flags.mjs`, written for the link base.
- **`codex/codex-shell-tool.test.mjs`**: a vitest suite (`import { describe, it, expect } from 'vitest'`).

### Data Flow
A test imports the adapter by its real path, and vitest resolves the adapter's static `hook-flags.mjs` import through the alias.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `pi/dispatch-preflight-lint.ts`, `pi/dispatch-audit.ts` | Pi adapters, link-relative imports | Unchanged, the documented contract | `.pi/extensions/README.md:16` |
| `.skilled/hooks/vitest.config.ts` | Owning runner config | Unchanged | Three adapter suites pass under it |
| `dispatch/README.md`, `hooks/README.md` | Run commands | Updated | `git diff .skilled/hooks/` |

Same-class producers: every Pi extension under `.skilled/hooks/*/pi/` and `.skilled/skills/*/hooks/pi/` imports hook-flags by the same link-relative path (`rg -n "hook-flags" --glob '*/pi/*.ts'`), so the convention is repo-wide, not an outlier in this adapter.
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
| Unit | The three adapter suites, the guard suites, the shared hook suites, the whole hooks vitest tree | vitest, `node --test` |
| Negative | Both wrong-runner failures, reproduced and kept as evidence | `node --test`, vitest without `--config` |
| Manual | Each README command run as written from the worktree root | shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Provisioned `.skilled/node_modules` in the worktree | Internal | Green | No vitest run is possible |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A documented command is wrong.
- **Procedure**: `git revert` the docs commit. No code changed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (reproduce, baseline) | None | Implementation |
| Implementation (README edits) | Setup | Verification |
| Verification (suites, review, validate) | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | 30 minutes |
| Core Implementation | Low | 15 minutes |
| Verification | Low | 20 minutes |
| **Total** | | **About an hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): not applicable, docs only
- [x] Feature flag configured: not applicable
- [x] Monitoring alerts set: not applicable

### Rollback Procedure
1. `git revert` the docs commit.
2. Rerun `sh scratch/suites.sh` to confirm the suites are unaffected.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
