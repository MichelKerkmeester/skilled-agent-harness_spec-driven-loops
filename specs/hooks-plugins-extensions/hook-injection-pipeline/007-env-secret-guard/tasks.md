---
title: "Tasks: env secret guard for every runtime"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "env secret guard tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: env secret guard for every runtime

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create the numbered worktree through sk-git (`worktrees/341-env-secret-guard`). Verify: `git worktree list` lists it.
- [x] T002 Scaffold the Level 2 packet (`specs/hooks-plugins-extensions/hook-injection-pipeline/007-env-secret-guard`). Verify: `ls` lists `spec.md`, `plan.md`, `tasks.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the shared core (`.skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs`). Verify: the core suite passes.
- [x] T004 Write the CLI (`.skilled/hooks/env-secret-guard/cli/env-secret.cjs`). Verify: `env-secret.cjs keys .env` prints the keys as JSON.
- [x] T005 Write the shared command hook for Claude Code, Codex, Cursor and Devin (`.skilled/hooks/env-secret-guard/command-hook/env-secret-guard.cjs`). Verify: the command-hook tests pass for all four payload shapes.
- [x] T006 [P] Write the Pi extension and link it (`pi/env-secret-guard.ts`, `.pi/extensions/env-secret-guard.ts`). Verify: the Pi test returns a block for `read .env`.
- [x] T007 [P] Write the DSH adapter and register it (`dsh/env-secret-guard.mjs`, `.dsh/plugins/repo-guards/index.mjs`). Verify: the DSH suite passes.
- [x] T008 [P] Write the OpenCode plugin and its three tools (`.opencode/plugins/env-secret-guard.js`). Verify: the plugin suite passes.
- [x] T009 Add the registry entry and regenerate the configs (`hook-registry.json`). Verify: `sync-hook-registrations.cjs --check` prints `PASS`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the CI hook node:test collection, the hooks vitest tree and the plugin suite against a `main` baseline. Verify: zero failures on both sides.
- [x] T011 Run both runtime-mirror checks. Verify: both print `PASS`.
- [x] T012 Update the concern README, the hooks kill-switch index and the plugin inventories. Verify: `rg -n env-secret-guard .skilled/hooks/README.md .opencode/plugins/README.md` prints the new rows.
- [x] T013 Independent review of the plugin, extension and hook surfaces by DeepSeek v4.1 Flash at max reasoning, and fix what it confirms. Verify: each review run exits 0 with a `completed` final event. Done: three runs on OpenCode Go, 14 findings triaged, every confirmed one fixed with a test.
- [x] T014 Conversational playbook scenarios CE-P06 and CE-P07, then `/local-skilled-alignment` and its fixes. Verify: `validate-playbook-package.cjs` reports 0 violations and the guard suites pass 41/41.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes the repository's test gates (hook node:test 1517/1517, hooks vitest 491/491, plugins 579/579)
- [x] CHK-011 [P0] No console errors or warnings: the adapters write stdout only for a deny or Cursor's allow
- [x] CHK-012 [P1] Error handling implemented: every adapter fails open, tested
- [x] CHK-013 [P1] Code follows project patterns: modelled on overlay-guard and the git message gate
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Each adapter exercised with its runtime's payload shape
- [x] CHK-022 [P1] Edge cases tested: symlink, Move to, argv form, glob, template file, lookalike names
- [x] CHK-023 [P1] Error scenarios validated: unreadable payload, core throw, missing pepper, outside-project path
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer`, one policy with seven consumers.
- [x] CHK-FIX-002 [P0] Same-class producers: every runtime's file and shell tool is routed to the one core.
- [x] CHK-FIX-003 [P0] Consumer inventory: registry, four generated configs, DSH index, Pi link, OpenCode folder, READMEs.
- [x] CHK-FIX-004 [P0] Adversarial table tests for symlink, joined patch input, outside-root, template and fallback cases.
- [x] CHK-FIX-005 [P1] Matrix axes: seven runtimes by file tool, patch and shell.
- [x] CHK-FIX-006 [P1] Hostile env variant: the kill switch and a missing pepper are tested.
- [ ] CHK-FIX-007 [P1] Evidence pinned to the commit SHA once committed.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets: the pepper comes only from the environment
- [x] CHK-031 [P0] Input validation implemented: key names, inspection paths and project containment
- [x] CHK-032 [P1] No value reaches output: every inspection test asserts the secret is absent
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 14 | 13/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-10
<!-- /ANCHOR:summary -->

---
