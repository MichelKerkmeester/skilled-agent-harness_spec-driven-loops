---
title: "Implementation Plan: Phase 13: vibe-audit-fixes"
description: "Fix the verified sk-code audit findings in the Vibe hooks, dispatch rules and lineage adapter. Each behavior fix gets a regression test first, and every touched file passes node --check and the 120-character limit."
trigger_phrases:
  - "vibe audit fixes plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 13: vibe-audit-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES modules and CommonJS, one TypeScript test file |
| **Framework** | Vibe 3.1.2 hooks; this repository's dispatch rule engine and deep-loop fan-out runner |
| **Storage** | None |
| **Testing** | `node --test` for the hooks and dispatch rules, `vitest` for the fan-out runner |

### Overview
Each behavior fix gets a failing test first: the env-guard cwd, the relative `VIBE_HOME` base, the null exit code, the stopped-outcome message and the renderer's substitution check. Then the fix goes in. The style fixes (JSDoc, the mirror comment, the box header, line length, the stderr try/catch, the duplicated sets) need no new test; `node --check` and the existing suites confirm them. The build runs on DeepSeek V4.1 Flash max through OpenCode 2 on the Mistral provider, and the orchestrator reviews each diff.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node --test .skilled/hooks/dispatch/lib/*.test.mjs .vibe/plugins/repo-guards/tests/*.test.mjs` passes on the unchanged tree; record the counts as the baseline
- [ ] `npx vitest run tests/unit/fanout-run.vitest.ts`, run from `.skilled/skills/system-deep-loop/runtime`, passes; record the count

### Definition of Done
- [ ] The same two commands pass, with the new cases added to the counts
- [ ] `node --check` exits 0 on every touched `.mjs` and `.cjs` file
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted defect fixes.

### Key Components
- **`lib/hook-io.mjs`**: the one place a Vibe payload becomes a core call. Putting `sessionDirFor` here fixes every guard's cwd at once.
- **`dispatch-rule-checks.mjs`**: holds the `isolated-vibe-home` rule, which needs the same base folder as its neighbor `output-dir-required`.
- **`fanout-run.cjs`**: the lineage verdict and failure message.

### Data Flow
A Vibe hook reads a JSON payload whose `cwd` is the session folder. `toCoreCall` keeps the checkout as `cwd`, because the git-message and dispatch-preflight hooks depend on that; `env-secret-guard.mjs` alone overrides `cwd` with the session folder at its call site, so its core resolves paths there. The dispatch rules read the command text, and they resolve a relative path against the folder a preceding `cd` names, or against the caller's cwd when there is none.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the baseline counts of the suites, reproduces the dotfile drift and records the git-message gate's fixture output. Implementation writes each regression test, then its fix, then the style fixes, one file per task. Verification reruns the three suites plus `node --check` and the line-length scan on every touched file. `tasks.md` holds the ordered steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

A new `env-secret-guard.test.mjs` spawns the hook against a scratch session folder that holds a relative symlink to a dotenv file, and asserts a deny. The dispatch rule test adds the two relative-home cases. The fan-out unit test adds the null exit code, the stopped outcome and a check that the three roster copies agree. The renderer test adds the `$VAR`, `${VAR}` and backtick leftovers. Each new case is run once before its fix and must fail then.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Node.js and the deep-loop runtime's pinned `vitest`. No new package. Phases 007, 008, 009 and 011 must stay Complete, since this phase edits their files.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a guard fixture or dispatch rule test that passed at baseline fails after the change. Revert this phase's commit. The fixes are independent, so one bad fix can also be reverted on its own file without touching the rest.
<!-- /ANCHOR:rollback -->

---
