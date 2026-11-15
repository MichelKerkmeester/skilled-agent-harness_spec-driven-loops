---
title: "Implementation Plan: Phase 2: history-core-relocation"
description: "Add one plain ESM entry in the handover concern that calls the compiled history lookup CLI, point the printed command at it, and prove both files exist before the offer is printed."
trigger_phrases:
  - "history core relocation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: history-core-relocation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript 5.9 for the core; Node ESM `.mjs` for the concern entry |
| **Framework** | None |
| **Storage** | None; the compiled CLI reads the hook state file |
| **Testing** | Vitest 4 for the runtime history suites; `node --test` for the concern suite |

### Overview
Add one `.mjs` entry in the handover concern that calls the compiled `runHistoryLookupCli`, point `HISTORY_LOOKUP_COMMAND` at it, and prove both the entry and the compiled core exist before the offer is printed. The core, its build and its tests stay in the spec-kit runtime. Prove it with the 14-file, 221-test history suite and the concern's `node --test` suite.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/history-*.vitest.ts tests/hook-session-start.vitest.ts` prints `Test Files 14 passed (14)` and `Tests 221 passed (221)`
- [ ] `node --test .skilled/hooks/session-handover/tests/*.test.cjs` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin runnable entry.

### Key Components
- **`.skilled/hooks/session-handover/bin/history-lookup.mjs`**: imports `runHistoryLookupCli` (`cli.ts:528`) from the compiled `cli.js` and sets `process.exitCode` to its result.
- **`lookup-offer.ts`**: owns `HISTORY_LOOKUP_COMMAND` (`lookup-offer.ts:20`) and `lookupRunsFrom` (`lookup-offer.ts:94-96`).
- **The compiled core**: unchanged; the runtime build (`package.json:17`) produces `dist/hooks/lib/history/cli.js`.

### Data Flow
The model copies the printed command, the entry runs, the entry imports `dist/hooks/lib/history/cli.js`, and `runHistoryLookupCli` reads the stored locator, re-derives the `hl1_` handle and prints one bounded reply or one refusal.

### Placement Decision

Two placements were compared before this plan was written.

**Placement A: move the TypeScript source into `.skilled/hooks/session-handover/lib/history/` and add a build step to the concern.** It fails on four measured facts:

1. `cli.ts:18-26` imports `../../claude/hook-state.js` and `../../../lib/esm-entry.js`; from the concern those relative paths name no file.
2. `hook-state.ts:25` imports `../lib/history/lookup-offer.js`; moving `lookup-offer.ts` into the concern makes the runtime depend on the concern while the concern's `cli.ts` depends on the runtime, a build cycle.
3. `tsconfig.json:5-6` sets `rootDir: "."` and `outDir: "./dist"`; a source outside the runtime cannot be emitted without changing every dist path.
4. The concern has no `package.json`, `tsconfig.json` or build script, and `.skilled/hooks/README.md:92` says a core keeps real code in the hooks tree only when it imports nothing but Node builtins.

**Placement B: keep the TypeScript source and the build in the runtime, and move the runnable entry into the concern.** This is the chosen placement. The entry is `.skilled/hooks/session-handover/bin/history-lookup.mjs`, plain ESM with no build. It imports `runHistoryLookupCli` (`cli.ts:528`) from the compiled `cli.js` and sets `process.exitCode` to its result. `HISTORY_LOOKUP_COMMAND` (`lookup-offer.ts:20`) changes to `node .skilled/hooks/session-handover/bin/history-lookup.mjs`. `lookupRunsFrom` (`lookup-offer.ts:94-96`) checks the entry and the compiled core, so a checkout without the build still withholds the offer.

**What fails at the cheaper placement.** A looks cheaper because it is a `git mv` plus a `tsconfig.json`, but it cannot build (facts 1-3) and it breaks the repo's own portability rule (fact 4). B is the only placement that keeps the build and the behaviour.

### Test Placement

The core tests stay in `.skilled/skills/system-spec-kit/runtime/tests/`. The runtime's vitest config roots at `.skilled/skills/system-spec-kit` (`vitest.config.ts:15`) and includes `runtime/tests/**` (`vitest.config.ts:18-20`); moving the tests would move the test root. The concern gets its own `node --test` entry test, which is the suite the concern already runs (`README.md:332`).
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records the 14-file, 221-test baseline. Implementation adds the concern entry, changes the constant and the seven CLI-path assertions in four test and support files, and updates the three READMEs. Verification reruns the history suite at 221 tests, runs the concern suite, and typechecks the runtime.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/history-*.vitest.ts tests/hook-session-start.vitest.ts` prints `Test Files 14 passed (14)` and `Tests 221 passed (221)`.
- `node --test .skilled/hooks/session-handover/tests/*.test.cjs` exits 0.
- `cd .skilled/skills/system-spec-kit/runtime && npx tsc --noEmit -p tsconfig.json` exits 0.

The first command is the phase's same-count gate. The second proves the entry and the concern's existing tests still load. The third proves the constant and `lookupRunsFrom` change did not break the runtime build.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Node 22.23.4 or later, the `engines` range in `package.json`.
- The runtime build (`package.json:17`), which produces the compiled `cli.js` the entry imports.
- No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the entry prints a different refusal or exit code from the compiled CLI, or the history suite count changes. Revert the scoped change: delete the entry, restore the one-line constant, restore the seven CLI-path strings, and restore the three README edits. No state or data migration is involved.
<!-- /ANCHOR:rollback -->

---
