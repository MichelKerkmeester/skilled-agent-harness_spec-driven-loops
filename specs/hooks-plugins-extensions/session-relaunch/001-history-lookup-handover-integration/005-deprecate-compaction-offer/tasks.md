---
title: "Tasks: Phase 5: deprecate-compaction-offer"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "deprecate compaction offer tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: deprecate-compaction-offer

<!-- SPECKIT_LEVEL: 1 -->

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

**Variables**: `R` is `.skilled/skills/system-spec-kit/runtime`. `H` is `.skilled/hooks/session-relaunch`. `P` is the seven producer files named in T004 to T010.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phase 004 prints a lookup command from the claim path (`H/bin/session-relaunch.cjs`). Verify: `rg -n -i "history|lookup" .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` prints at least one line naming the lookup.
- [ ] T002 Confirm the handover does not import a producer's mint (`H`). Verify: `rg -n "mintHistoryLocator" .skilled/hooks/session-relaunch` prints nothing and exits 1.
- [ ] T003 Record the baseline suite result (`R`). Verify: `cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/history-*.vitest.ts tests/hook-precompact.vitest.ts` exits 0 and prints its passing test count.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Remove the PreCompact mint, the locator state field and the checkout-root mirror (`R/hooks/claude/compact-inject.ts`). Verify: `rg -n "mintHistoryLocator|stampHistoryLocator|mirrorToCheckoutRoot|historyLocator" .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` prints nothing and exits 1.
- [ ] T005 Remove the SessionStart lookup section, its gate, its capability read and its budget reservation (`R/hooks/claude/session-prime.ts`). Verify: `rg -n "HISTORY_LOOKUP_TITLE|buildHistoryLookupSection|loadHistoryCapability|lookupRunsFrom|placeLookup|HistoryLocator" .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts` prints nothing and exits 1.
- [ ] T006 Remove the Pi mint, persist call and offer, keeping the summary, the purpose and the recovery pointer (`R/hooks/pi/session-compact-context.ts`). Verify: `rg -n "mintHistoryLocator|persistLocator|buildHistoryLookupSection|placeLookup|historyHandle|loadHistoryCapability|HISTORY_LOCATOR" .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts` prints nothing and exits 1.
- [ ] T007 Remove the DSH locator support block, mint, persist call and offer, keeping the summary and the recovery pointer (`R/hooks/dsh/session-compact-context.mjs`). Verify: `rg -n "mintHistoryLocator|persistLocator|buildHistoryLookupSection|placeLookup|historyHandle|loadHistoryCapability|locatorSupport|HISTORY_LOCATOR" .skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs` prints nothing and exits 1.
- [ ] T008 Remove the Devin mint, persist call, one-shot marker and marker helpers, keeping the summary, the spec folder and the recovery pointer (`R/hooks/devin/post-compaction.cjs`). Verify: `rg -n "mintHistoryLocator|persistLocator|pendingOfferPath|recordPendingOffer|PENDING_OFFER_SUFFIX|placeLookup" .skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs` prints nothing and exits 1.
- [ ] T009 Remove the Devin prompt-time marker read and offer, keeping the advisor context (`R/hooks/devin/user-prompt-submit.ts`). Verify: `rg -n "takeHistoryLookupSection|pendingOfferPath|readPendingOffer|clearPendingOffer|locatorIsFresh|PENDING_OFFER_SUFFIX|HistoryOfferMarker|loadHistoryCapability" .skilled/skills/system-spec-kit/runtime/hooks/devin/user-prompt-submit.ts` prints nothing and exits 1.
- [ ] T010 Delete the OpenCode plugin (`.opencode/plugins/session-history-lookup.js`). Verify: `ls .opencode/plugins/session-history-lookup.js` prints a no-such-file error and exits 1.
- [ ] T011 Delete the OpenCode plugin test (`.opencode/plugins/tests/session-history-lookup.test.cjs`). Verify: `ls .opencode/plugins/tests/session-history-lookup.test.cjs` prints a no-such-file error and exits 1.
- [ ] T012 Add one locator builder the suites share (`R/tests/_support/history-fixtures.ts`). Verify: `rg -n "export function buildLocator" .skilled/skills/system-spec-kit/runtime/tests/_support/history-fixtures.ts` prints one line.
- [ ] T013 Build the CLI suite's locators from the shared builder (`R/tests/history-lookup-cli.vitest.ts`). Verify: `rg -n "mintHistoryLocator|post-compaction.cjs|session-compact-context" .skilled/skills/system-spec-kit/runtime/tests/history-lookup-cli.vitest.ts` prints nothing and exits 1.
- [ ] T014 Delete the adapter mint and offer suite (`R/tests/history-locator-adapters.vitest.ts`). Verify: `ls .skilled/skills/system-spec-kit/runtime/tests/history-locator-adapters.vitest.ts` prints a no-such-file error and exits 1.
- [ ] T015 Drop the mint, PreCompact-persistence and gate suites and seed the locator directly (`R/tests/history-locator.vitest.ts`). Verify: `rg -n "mintHistoryLocator|PreCompact persistence" .skilled/skills/system-spec-kit/runtime/tests/history-locator.vitest.ts` prints nothing and exits 1.
- [ ] T016 Drop the two locator cases and call `persistCompactResult` with three arguments (`R/tests/hook-precompact.vitest.ts`). Verify: `rg -n "mintHistoryLocator" .skilled/skills/system-spec-kit/runtime/tests/hook-precompact.vitest.ts` prints nothing and exits 1.
- [ ] T017 Delete the SessionStart offer suite (`R/tests/history-lookup-after-session-start.vitest.ts`). Verify: `ls .skilled/skills/system-spec-kit/runtime/tests/history-lookup-after-session-start.vitest.ts` prints a no-such-file error and exits 1.
- [ ] T018 Delete the Devin marker and prompt-offer suite (`R/tests/history-lookup-devin-prompt-offer.vitest.ts`). Verify: `ls .skilled/skills/system-spec-kit/runtime/tests/history-lookup-devin-prompt-offer.vitest.ts` prints a no-such-file error and exits 1.
- [ ] T019 Delete the per-adapter offer redemption suite (`R/tests/history-lookup-adapters-e2e.vitest.ts`). Verify: `ls .skilled/skills/system-spec-kit/runtime/tests/history-lookup-adapters-e2e.vitest.ts` prints a no-such-file error and exits 1.
- [ ] T020 Drop the four adapter constants and the case that reads them (`R/tests/history-vocabulary-drift.vitest.ts`). Verify: `rg -n "session-history-lookup|post-compaction.cjs|session-compact-context" .skilled/skills/system-spec-kit/runtime/tests/history-vocabulary-drift.vitest.ts` prints nothing and exits 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T021 Run the history and PreCompact suites (`R`). Verify: `cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/history-*.vitest.ts tests/hook-precompact.vitest.ts` exits 0.
- [ ] T022 Run the type check (`R/tsconfig.json`). Verify: `cd .skilled/skills/system-spec-kit/runtime && npx tsc --noEmit -p tsconfig.json` exits 0.
- [ ] T023 Run the OpenCode plugin suites (`.opencode/plugins/tests/`). Verify: `node --test .opencode/plugins/tests/` exits 0.
- [ ] T024 Prove no producer names the lookup (`P`). Verify: `rg -n "History Lookup|buildHistoryLookupSection|mintHistoryLocator" .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts .skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs .skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs .skilled/skills/system-spec-kit/runtime/hooks/devin/user-prompt-submit.ts .opencode/plugins/session-history-lookup.js` prints nothing and exits 1.
- [ ] T025 Prove the summary and the `/speckit:resume` pointer stay (`R/hooks/pi`, `R/hooks/dsh`, `R/hooks/devin`). Verify: `rg -c "Post-Compaction Summary|/speckit:resume" .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts .skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs .skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs` prints one line per file, each count 1 or more.
- [ ] T026 Validate this packet (`specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/005-deprecate-compaction-offer`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/005-deprecate-compaction-offer --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `rg -n "History Lookup|buildHistoryLookupSection|mintHistoryLocator"` over the seven producer files prints nothing, and the history, hook, type-check and plugin gates all exit 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
