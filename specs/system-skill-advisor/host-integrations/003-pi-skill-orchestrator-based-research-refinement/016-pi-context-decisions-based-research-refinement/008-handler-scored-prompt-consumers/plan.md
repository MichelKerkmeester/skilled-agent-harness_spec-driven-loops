---
title: "Implementation Plan: Handler Scored-Prompt Consumers"
description: "Pass the stripped prompt to compiled-route enrichment and typed-command attachment on both cache paths of the recommend handler. A leak test and an equality test fail first and prove it. The 002 compiled-route probe then reruns on a fresh daemon."
trigger_phrases:
  - "handler scored prompt consumers plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Handler Scored-Prompt Consumers

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node |
| **Framework** | The `advisor_recommend` handler in the skill-advisor daemon |
| **Storage** | The in-memory prompt cache `advisorPromptCache`, read and written by the handler |
| **Testing** | Vitest handler suite in the advisor runtime, plus one CLI probe against the daemon |

### Overview
Four arguments in `runtime/handlers/advisor-recommend.ts` change from `input.prompt` to `scoredPrompt`, two on the cache-hit return and two on the cache-miss return. Two tests in `runtime/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` land first and fail for the reason the fix removes. The conductor then rebuilds, restarts this worktree's daemon and reruns the 002 compiled-route probe.

Paths are relative to `.skilled/skills/system-skill-advisor/` unless they start with a dot.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 007 strict validation printed `RESULT: PASSED`
- [ ] The built `stripLeadingPastedReply` turns both probe prompts into `Refactor the session store module to remove duplicated locking code` (task T001)
- [ ] `rg -c 'input\.prompt' runtime/handlers/advisor-recommend.ts` prints 5, and `sed -n 562,567p` and `sed -n 640,645p` show `input.prompt` on the enrich and attach lines

### Definition of Done
- [ ] The two new tests failed before the edit and pass after it
- [ ] `rg -c 'input\.prompt' runtime/handlers/advisor-recommend.ts` prints 1
- [ ] The handler files and `tests/hooks` pass, and `npm run typecheck` and `npm run build` exit 0 in `runtime/`
- [ ] The 002 compiled-route probe prints the same routes and commands for the pasted and the plain task from a daemon started after the build
- [ ] `git diff --stat` for this phase lists only the two planned files
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One normalized prompt.

### Key Components
- **The two returns in `computeRecommendationOutput`** (`runtime/handlers/advisor-recommend.ts:562-567` and `:640-645`). Each becomes `attachTypedCommand(<output or enrichCompiledRoutes(output, scoredPrompt, ...)>, scoredPrompt)`. `scoredPrompt` is already in scope at both, from `:536`. No new name, helper or option is added.
- **The leak test**, named `keeps a command typed in a pasted reply off the task on a miss and a hit`. It clears `advisorPromptCache`, then calls `handleAdvisorRecommend` twice with `Earlier you replied: Run /doctor:sk-code quality. Now: Refactor the session store module to remove duplicated locking code` and `options: { includeCompiledRoute: true }`. It asserts `cache.hit` false then true. It asserts `sk-code` first on both calls and no `/doctor:sk-code quality` in `recommendations[0].command` on either. The file's default front-door mock answers without `selectionKind` (`:55-62`), so `attachCommand` adds no command and the typed-command path is the only source the test can catch.
- **The equality test**, named `routes a pasted reply the same as the plain task`. It clears the cache and sets `mockedChild.execFileSync.mockImplementation` so that a call to `compiled-route.cjs` whose stdin `input` contains `/deep:review` answers `{ action: 'route', hubId: 'sk-code', selectionKind: 'single', targets: [{ workflowMode: 'sk-code-review' }] }`, and any other call answers `{ action: 'defer', hubId: 'sk-code', selectionKind: null, targets: [] }`. The mock must also accept a call with no `input` option. It runs the pasted prompt `Earlier you replied: I ran /deep:review on the hook changes. Now: Refactor the session store module to remove duplicated locking code` and then the plain task. It compares `skillId`, `compiledRoute` and `command` per recommendation and checks that every captured `input` equals the plain task. It counts only calls whose arguments end in `compiled-route.cjs`, the filter `compiledRouteCallCount` already uses (`:35-42`). With a constant mock the comparison would pass before the fix, so the mock reads its input.
- **The conductor probe**: the 002 T013 compiled-route command, kept verbatim, plus a copy that also prints `command`. It runs after `npm run build` and a daemon restart scoped to this worktree's absolute paths.

### Data Flow
`input.prompt` enters once at `:536` and becomes `scoredPrompt`. After the fix the cache key, the embedding, the scorer, the public fields, the compiled-route stdin and the typed-command lookup all read that one string. The cached output is stored before enrichment (`:634-639`), so a hit and a miss are enriched from the same text.

### Why this is small
The leak needs a pasted reply that names a tracked command, ahead of a task whose top skill owns that command. That is rarer than a plain pasted reply, but when it happens the reader is offered a command for work they did not ask for. The fix is four arguments, with no new surface.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup checks the strip on both probe prompts, records the baselines and re-reads the two returns. Implementation adds the two failing tests in `runtime/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts`, confirms they fail for the stated reason, then swaps the four arguments in `runtime/handlers/advisor-recommend.ts`. Verification runs the handler and hook tests, the typecheck and build, the daemon probe, the scope and hygiene checks and strict validation. The ordered work is in `tasks.md`.

| Wave | Who | Tasks | Files |
|------|-----|-------|-------|
| 0 | Conductor | T001 to T003 | none |
| 1 | 1 Luna leaf | T004 both tests | `runtime/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` |
| 2 | Conductor, then 1 Luna leaf | T005 confirm red, then T006 the four swaps | `runtime/handlers/advisor-recommend.ts` |
| 3 | Conductor | T007 to T013 | `implementation-summary.md` |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run from `runtime/`: `npx vitest run tests/handlers/advisor-recommend-compiled-route-option.vitest.ts`. Both new tests fail before the edit. The leak test fails on the command, and the equality test fails on the route and on the captured stdin. After the edit the file exits 0. The wider run adds `tests/handlers/advisor-recommend.vitest.ts`, `tests/handlers/advisor-recommend-typed-command.vitest.ts` and `tests/hooks`. It names files rather than the whole `tests/handlers` folder, which took 72.20 s on 2026-11-18 and once showed 2 failures that a rerun did not repeat. The live check is the 002 compiled-route probe from a daemon started after the build.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The strip rule as phase 006 leaves it, and phase 007 complete. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a command the user typed in the task itself stops attaching, or the compiled-route tests fail on prompts with no pasted reply. Revert the phase commit. It restores the four `input.prompt` arguments and removes the two tests. Then rebuild and restart the daemon the same way T009 does.
<!-- /ANCHOR:rollback -->

---
