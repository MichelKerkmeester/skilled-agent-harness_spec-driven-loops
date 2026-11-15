---
title: "Tasks: Phase 3: mint-locator-at-prepare"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "mint locator at prepare tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: mint-locator-at-prepare

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

`$RUNTIME` is `.skilled/skills/system-spec-kit/runtime`. `$CLI_TEST` is `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the mint, the schema and the two handover files, and record the current count (`.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts`, `hook-state.ts`, `.skilled/hooks/session-handover/bin/session-handover.cjs`, `lib/relaunch-core.cjs`). Verify: `rg -n --count-matches --include-zero "historyHandle|persistHistoryLocator|historyLocator" .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts .skilled/hooks/session-handover/bin/session-handover.cjs .skilled/hooks/session-handover/lib/relaunch-core.cjs` prints `relaunch-core.cjs:0` and `session-handover.cjs:0`.
- [x] T002 Confirm the compiled helpers the mint will require are present (`$RUNTIME/dist/hooks/lib/history/locator-digest.js`, `$RUNTIME/dist/hooks/lib/history/lookup-offer.js`, `$RUNTIME/dist/hooks/claude/hook-state.js`). Verify: `ls $RUNTIME/dist/hooks/lib/history/locator-digest.js $RUNTIME/dist/hooks/lib/history/lookup-offer.js $RUNTIME/dist/hooks/claude/hook-state.js` prints all three paths.
- [x] T003 [P] Confirm the handover CLI suite is green before the change (`$CLI_TEST`). Verify: `node --test $CLI_TEST` exits 0 and prints `# fail 0`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `handover` to the locator's provenance source enum (`$RUNTIME/hooks/claude/hook-state.ts`). Verify: `rg -n "source: z.enum" $RUNTIME/hooks/claude/hook-state.ts` prints one line that contains `handover`.
- [x] T005 Cover the new source in the locator contract test, and keep the unknown-source case (`$RUNTIME/tests/history-locator.vitest.ts`). Verify: `cd $RUNTIME && npx vitest run tests/history-locator.vitest.ts` exits 0.
- [x] T006 Add `mintHandoverLocator` to the handover core: resolve the transcript, place the workspace, build the locator with the shared digest, persist it with the shared writer, return null on any failure (`.skilled/hooks/session-handover/lib/relaunch-core.cjs`). Verify: `node -e "console.log(typeof require('./.skilled/hooks/session-handover/lib/relaunch-core.cjs').mintHandoverLocator)"` prints `function`.
- [x] T007 Call the mint from `prepare` after `preparePending` returns, inside the fail-open guard (`.skilled/hooks/session-handover/bin/session-handover.cjs`). Verify: `rg -n --count-matches --include-zero "historyHandle|persistHistoryLocator|historyLocator|mintHandoverLocator" .skilled/hooks/session-handover/bin/session-handover.cjs` prints a count of 1 or more.
- [x] T008 Add the CLI cases: the stored locator and its source, the identity the digest re-derives, the unwritable state directory, and the runtime with no locator kind (`$CLI_TEST`). Verify: `node --test $CLI_TEST` exits 0 and prints `# fail 0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the handover CLI suite from the repository root (`$CLI_TEST`). Verify: `node --test $CLI_TEST` exits 0 and prints `# fail 0`.
- [x] T010 Run the locator contract suite (`$RUNTIME/tests/history-locator.vitest.ts`). Verify: `cd $RUNTIME && npx vitest run tests/history-locator.vitest.ts` exits 0.
- [x] T011 Re-run the measured command and confirm both handover files now name a locator helper (`.skilled/hooks/session-handover/`). Verify: `rg -n --count-matches --include-zero "historyHandle|persistHistoryLocator|historyLocator|mintHandoverLocator" .skilled/hooks/session-handover/bin/session-handover.cjs .skilled/hooks/session-handover/lib/relaunch-core.cjs` prints a non-zero count for both files.
- [x] T012 Validate the packet (`specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/003-mint-locator-at-prepare`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/003-mint-locator-at-prepare --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] A stored locator whose `provenance.source` is `handover` is read back from the sender's state file by the CLI test
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---
