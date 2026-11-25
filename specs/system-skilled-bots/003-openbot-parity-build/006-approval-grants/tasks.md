---
title: "Tasks: Phase 6: approval-grants"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "approval grants tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: approval-grants

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

Two shell variables this list uses: `RT` is `.skilled/skills/system-skilled-bots/runtime` and `BOTS` is `node .skilled/bin/bots.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the item's key list (`$RT/lib/needs-you.ts`). Verify: `rg -n "ITEM_KEYS" $RT/lib/needs-you.ts` prints the declaration and no `'grants'` entry
- [ ] T002 Record the gate's item write (`$RT/lib/runner.ts`). Verify: `rg -n "const item: NeedsYouItem" $RT/lib/runner.ts` prints one line
- [ ] T003 Record the answer's two item writes (`$RT/lib/answer.ts`). Verify: `rg -n "writeNeedsYouItem" $RT/lib/answer.ts` prints two lines
- [ ] T004 Record the answer verb spec and the inbox branch (`.skilled/bin/bots.cjs`). Verify: `rg -n "answer: \{ ids: 2" .skilled/bin/bots.cjs` prints the spec with an empty options list
- [ ] T005 Capture the baseline suite result (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed` count
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Create the six kinds in OpenBot's order (`$RT/lib/action-kind.ts`). Verify: `rg -n "pay|credentials|delete|send|share|post" $RT/lib/action-kind.ts` prints the kind list in that order
- [ ] T007 Add the word lists and `classifyAction` with its `other` fallback (`$RT/lib/action-kind.ts`). Verify: `rg -n "classifyAction" $RT/lib/action-kind.ts` prints the export and the fallback
- [ ] T008 Create the four rungs and `decideApproval` (`$RT/lib/approval-ladder.ts`). Verify: `rg -n "kind|rule|auto-review|extra-vigilant" $RT/lib/approval-ladder.ts` prints the rung list in order
- [ ] T009 Add the scope rule and the standing-allow check (`$RT/lib/approval-ladder.ts`). Verify: `rg -n "standing" $RT/lib/approval-ladder.ts` prints the rule and its doc comment
- [ ] T010 Add `grants` to the item, its key and its validation (`$RT/lib/needs-you.ts`). Verify: `rg -n "'grants'" $RT/lib/needs-you.ts` prints the key and its check
- [ ] T011 Read a missing grant as null (`$RT/lib/needs-you.ts`). Verify: `rg -n "grants" $RT/lib/needs-you.ts` prints the null default beside the field
- [ ] T012 Name the granted scope in the resumed prompt (`$RT/lib/needs-you.ts`). Verify: `rg -n "scope" $RT/lib/needs-you.ts` prints the resumed-prompt line
- [ ] T013 Classify the parked question and write the grant (`$RT/lib/runner.ts`). Verify: `rg -n "classifyAction|decideApproval" $RT/lib/runner.ts` prints both calls
- [ ] T014 Accept a scope and refuse a standing allow with no kind (`$RT/lib/answer.ts`). Verify: `rg -n "grant-kind-unknown" $RT/lib/answer.ts` prints the refusal
- [ ] T015 Write the scope on the grant (`$RT/lib/answer.ts`). Verify: `rg -n "scope" $RT/lib/answer.ts` prints the input field and the write
- [ ] T016 Add `--scope` to `answer` (`.skilled/bin/bots.cjs`). Verify: `$BOTS answer item-1 yes --scope once` prints `bots: item-unknown: item-1`
- [ ] T017 Reject a scope outside the four (`.skilled/bin/bots.cjs`). Verify: `$BOTS answer item-1 yes --scope sometimes` exits 2 with `bots: --scope takes once, conversation, always or deny`
- [ ] T018 Print the grant on the inbox line (`.skilled/bin/bots.cjs`). Verify: `rg -n "grants" .skilled/bin/bots.cjs` prints the column
- [ ] T019 Create the classifier tests (`$RT/tests/action-kind.vitest.ts`). Verify: `cd $RT && npx vitest run tests/action-kind.vitest.ts` prints no `failed`
- [ ] T020 Create the ladder tests over the 35-row matrix (`$RT/tests/approval-ladder.vitest.ts`). Verify: `cd $RT && npx vitest run tests/approval-ladder.vitest.ts` prints no `failed`
- [ ] T021 Extend the needs-you tests (`$RT/tests/needs-you.vitest.ts`). Verify: `cd $RT && npx vitest run tests/needs-you.vitest.ts` prints no `failed`
- [ ] T022 Extend the answer tests (`$RT/tests/answer.vitest.ts`). Verify: `cd $RT && npx vitest run tests/answer.vitest.ts` prints no `failed`
- [ ] T023 Extend the runner tests (`$RT/tests/runner.vitest.ts`). Verify: `cd $RT && npx vitest run tests/runner.vitest.ts` prints no `failed`
- [ ] T024 Extend the CLI tests (`$RT/tests/cli-run.vitest.ts`). Verify: `cd $RT && npx vitest run tests/cli-run.vitest.ts` prints no `failed`
- [ ] T025 Write the ladder as a doc (`.skilled/skills/system-skilled-bots/bots-run/references/approval-ladder.md`). Verify: `rg -n "first answer wins" .skilled/skills/system-skilled-bots/bots-run/references/approval-ladder.md` prints the rule
- [ ] T026 Document `--scope` on `bots answer` (`.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md`). Verify: `rg -n -- "--scope" .skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` prints the option
- [ ] T027 Name the grant column in the status reference (`.skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md`). Verify: `rg -n "grant" .skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` prints the column
- [ ] T028 Add the grant to the item's catalog entry (`.skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-items.md`). Verify: `rg -n "grants" .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-items.md` prints the field
- [ ] T029 Add the scope to the answer's catalog entry (`.skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-answer.md`). Verify: `rg -n -- "--scope" .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-answer.md` prints the option
- [ ] T030 Add the two module rows to the runtime README (`$RT/lib/README.md`). Verify: `rg -n "action-kind.ts|approval-ladder.ts" $RT/lib/README.md` prints two rows
- [ ] T031 Write the MIT notice for the lifted classifier (`THIRD_PARTY_NOTICES.md`). Verify: `rg -n "tool-name.ts" THIRD_PARTY_NOTICES.md` prints the entry
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T032 Run the whole runtime suite (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed`
- [ ] T033 Prove the gate writes a grant from a parked question (`$RT/tests/runner.vitest.ts`). Verify: `cd $RT && npx vitest run tests/runner.vitest.ts -t "grant"` prints one passing test
- [ ] T034 Prove the standing-allow refusal (`$RT/tests/answer.vitest.ts`). Verify: `cd $RT && npx vitest run tests/answer.vitest.ts -t "grant-kind-unknown"` prints one passing test
- [ ] T035 Prove the ladder's order (`$RT/tests/approval-ladder.vitest.ts`). Verify: `cd $RT && npx vitest run tests/approval-ladder.vitest.ts -t "first answer wins"` prints one passing test
- [ ] T036 Prove an item written before this phase still lists (`$RT/tests/needs-you.vitest.ts`). Verify: `cd $RT && npx vitest run tests/needs-you.vitest.ts -t "grants"` prints one passing test
- [ ] T037 Run the packet validator (`specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `$BOTS inbox` prints a grant column on every item line and exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

A blocked task is marked `[B]` with the reason on the same line, and the phase does not close while one remains.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md` prints 11
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 4\. IMPLEMENTATION PHASES' specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md` prints one line
- [ ] CHK-003 [P1] Dependencies identified and available. Verify: `cd $RT && npx vitest --version` exits 0
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The runtime type-checks. Verify: `cd $RT && npm run typecheck` exits 0
- [ ] CHK-011 [P0] The two new modules print nothing. Verify: `rg -n 'console\.(log|error)' $RT/lib/action-kind.ts $RT/lib/approval-ladder.ts` prints nothing
- [ ] CHK-012 [P1] Error handling implemented. Verify: `rg -n 'grant-kind-unknown' $RT/lib/answer.ts` prints the refusal
- [ ] CHK-013 [P1] Code follows project patterns. Verify: `rg -n '^export (function|type|interface)' $RT/lib/action-kind.ts $RT/lib/approval-ladder.ts` prints the exports
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants --strict` prints `RESULT: PASSED`
- [ ] CHK-021 [P0] Manual testing complete. Verify: `$BOTS inbox` exits 0
- [ ] CHK-022 [P1] Edge cases tested. Verify: `cd $RT && npx vitest run tests/approval-ladder.vitest.ts -t "adversarial"` prints one passing test
- [ ] CHK-023 [P1] Error scenarios validated. Verify: `cd $RT && npx vitest run tests/answer.vitest.ts -t "grant-kind-unknown"` prints one passing test
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

The plan's affected-surfaces addendum is active because this phase changes a stored record shape and a CLI surface. These rows verify the inventories it names.

- [ ] CHK-FIX-001 [P0] Each changed surface names its class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Verify: `rg -c '^\| .*runtime/lib/' specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md` prints 6
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed. Verify: `rg -n 'writeNeedsYouItem' $RT/lib/` prints every writer of an item
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the changed symbols. Verify: `rg -n 'NeedsYouItem|ITEM_KEYS|buildResumedPrompt' $RT --glob '*.ts'` prints every reader
- [ ] CHK-FIX-004 [P0] The classifier's and the ladder's adversarial cases are tested. Verify: `rg -n 'adversarial' $RT/tests/approval-ladder.vitest.ts` prints the case block
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Verify: `rg -n 'Matrix axes' specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md` prints the 35-row line
- [ ] CHK-FIX-006 [P1] The `other`-kind variant ran. Verify: `cd $RT && npx vitest run tests/approval-ladder.vitest.ts -t "other"` prints one passing test
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a commit, not a moving branch. Verify: `git rev-parse --short HEAD` prints the commit the evidence was taken at
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Verify: `rg -n 'sk-|ghp_|BEGIN PRIVATE KEY' $RT/lib/action-kind.ts $RT/lib/approval-ladder.ts` prints nothing
- [ ] CHK-031 [P0] Input validation implemented. Verify: `rg -n 'KINDS|SCOPES' $RT/lib/action-kind.ts $RT/lib/approval-ladder.ts` prints both closed lists
- [ ] CHK-032 [P1] Auth/authz working correctly. Verify: `rg -n 'sign-in|login' $RT/lib/approval-ladder.ts` prints nothing, because the runtime has no sign-in and a grant is a record
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized. Verify: `rg -l 'grants' specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/tasks.md` prints three paths
- [ ] CHK-041 [P1] Code comments adequate. Verify: `rg -c '^\s*//' $RT/lib/action-kind.ts` prints a count above zero
- [ ] CHK-042 [P2] The runtime README names both modules. Verify: `rg -n 'action-kind.ts|approval-ladder.ts' $RT/lib/README.md` prints two rows
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only. Verify: `ls specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/scratch/` lists no file the phase wrote outside it
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Verify: `find specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/scratch -type f` prints nothing
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | [ ]/12 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-11-25
<!-- /ANCHOR:summary -->

---
