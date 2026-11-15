---
title: "Implementation Plan: Phase 3: mint-locator-at-prepare"
description: "Add one provenance source to the locator schema, one mint helper in the handover core, and one call in prepare after the relaunch record is written. The helper reuses the shared digest and the shared state writer, and no failure reaches the handover."
trigger_phrases:
  - "mint locator at prepare plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: mint-locator-at-prepare

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript in the runtime hook package, CommonJS in the handover concern |
| **Framework** | None; Node.js built-ins (`node:crypto`, `node:fs`) |
| **Storage** | The hook state JSON file, keyed by a hash of the working directory |
| **Testing** | `node:test` for the handover CLI, Vitest for the runtime hook package |

### Overview
A new provenance value lets the locator schema record a handover as its source, and one helper in the handover core mints and persists the locator for the sending session. The helper calls the shared `historyHandle` (`locator-digest.ts:29`) and `persistHistoryLocator` (`locator-digest.ts:65`) instead of a second digest, and `prepare` calls it after the record exists. Two test files and the measured command prove it.
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
- [ ] `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with `# fail 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared helper, one new caller.

### Key Components
- **`mintHandoverLocator` in `relaunch-core.cjs`**: resolves the sender's transcript with the resolvers already there, `claudeSessionLogPath` (`relaunch-core.cjs:685`) and `codexRolloutPath` (`relaunch-core.cjs:798`), places the workspace with `placeLookup` (`lookup-offer.ts:116`), and builds the locator with `historyHandle` (`locator-digest.ts:29`). It returns the locator or null and never throws.
- **`persistHistoryLocator`** (`locator-digest.ts:65`): scopes the process cwd to the locator workspace for the write (`locator-digest.ts:79`) and counts the write only when the stored locator carries the minted handle (`locator-digest.ts:72`).
- **`HistoryLocatorSchema`** (`hook-state.ts:285`): the closed schema whose provenance source enum gains `handover` (`hook-state.ts:306`).
- **`prepare`** (`session-relaunch.cjs:513`): the one call site, after the `preparePending` call (`session-relaunch.cjs:588`).

### Data Flow
`prepare` runs in the sender's working directory. `placeLookup` walks up to the checkout root and returns it as `workspace`, plus `sessionDirectory` when the sender sat below it (`lookup-offer.ts:116`). `historyHandle` hashes runtime, session id, workspace, locator kind and, for Claude and Codex, the transcript path (`locator-digest.ts:33`). `persistHistoryLocator` changes the process cwd to that workspace for the write, so `getStatePath` names the file from the session id under a directory named from that cwd (`hook-state.ts:469`, `hook-state.ts:459`), which is the directory the printed command changes to before it runs the CLI.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the four source files, confirms the compiled helpers the mint requires are present, and records the measured count. Implementation adds `handover` to the schema, adds `mintHandoverLocator` to the handover core, and calls it from `prepare` after the record write. Verification runs the handover CLI suite, the locator contract suite and the measured command again.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Two suites, both already in the repository. `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` must exit 0 and cover the mint, the stored identity, the fail-open path and the runtime with no locator kind; its sandbox already writes a Claude session log through `writeClaudeGoalLog` (`session-relaunch-cli.test.cjs:2411`). `npx vitest run tests/history-locator.vitest.ts` from `.skilled/skills/system-spec-kit/runtime` must exit 0 and keep rejecting an unknown provenance source (`history-locator.vitest.ts:149`).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Node.js built-ins only. The mint requires the compiled runtime bundle, the same way the Devin hook requires it (`post-compaction.cjs:34`); a missing build is the fail-open branch, not a handover failure. Phase 002 owns where the shared history helpers finally live.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a prepare that stores a locator whose handle the CLI cannot re-derive, or a prepare whose exit code or output changes when the mint fails. Revert the scoped commit; the schema change is additive and the stored field degrades to null on its own (`hook-state.ts:353`).
<!-- /ANCHOR:rollback -->

---
