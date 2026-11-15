---
title: "Tasks: Phase 4: offer-lookup-at-claim"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "offer lookup at claim tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: offer-lookup-at-claim

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

Two shell variables are used below. `S` is `.skilled/hooks/session-handover/bin/session-handover.cjs`. `T` is `.skilled/hooks/session-handover/tests/`. Every verify command spells its path in full so it can be pasted as written.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the three lines `claim` prints today (`S`). Verify: `rg -n "printHandoffBody|completeCommandFor|Goal packet" .skilled/hooks/session-handover/bin/session-handover.cjs` prints 5 lines, including line 706 for the body and line 717 for the goal packet.
- [x] T002 Confirm the sender's locator is keyed by its session id (`hook-state.ts`). Verify: `rg -n "export function getStatePath" .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts` prints one line at 469.
- [x] T003 Confirm the CLI's freshness gate and its 30-minute window (`cli.ts`). Verify: `rg -n "const LOCATOR_TTL_MS|args.sessionId !== locator.sessionId" .skilled/skills/system-spec-kit/runtime/hooks/lib/history/cli.ts` prints 2 lines, at 37 and 545.
- [x] T004 Confirm the section builder and its withhold condition (`lookup-offer.ts`). Verify: `rg -n "export function buildHistoryLookupSection|if \(!historyCapability" .skilled/skills/system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts` prints 2 lines, at 132 and 136.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the re-stamp helper to the relaunch core (`relaunch-core.cjs`). It reads the sender's stored locator, rewrites `mintedAt` and `provenance.capturedAt` to the claim time, keeps every other field, and persists the result through the hook-state writer. Verify: `node --check .skilled/hooks/session-handover/lib/relaunch-core.cjs` exits 0.
- [x] T006 Add one core case for the re-stamp (`T/relaunch-core.test.cjs`). It stores a locator with `mintedAt` three hours old, re-stamps it, and asserts the handle is unchanged and `mintedAt` is the claim time. Verify: `node --test .skilled/hooks/session-handover/tests/relaunch-core.test.cjs` prints `ℹ fail 0`.
- [x] T007 Print the section after the note body in `claim` (`S`). Load `buildHistoryLookupSection` and `persistHistoryLocator`, build the section from the sender's locator, and write it after the goal packet line so the complete command stays the closing line. Verify: `rg -n "buildHistoryLookupSection" .skilled/hooks/session-handover/bin/session-handover.cjs` prints one line.
- [x] T008 Guard the mint, the write and the print in one `try` block that prints nothing on failure (`S`). Verify: `rg -c "catch" .skilled/hooks/session-handover/bin/session-handover.cjs` prints 24 or more, up from the 23 it prints before the guard.
- [x] T009 Add the claim cases to the CLI suite (`T/session-handover-cli.test.cjs`). Cover the section after the body, the sender session id in the command, the re-minted `mintedAt`, the withheld section on a workspace without the CLI, and the fail-open case with no state file. Verify: `node --test .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` prints `ℹ fail 0`.
- [x] T010 Add one receiver step to the eight in section 5 (`handoff.md`). It tells the receiver to look up a detail the note does not spell out before guessing, and it sits before the step that continues the remaining work. Verify: `rg -c '^[0-9]+\. ' .skilled/commands/speckit/handoff.md` prints 9.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the handover CLI suite (`T/session-handover-cli.test.cjs`). Verify: `node --test .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` prints `ℹ fail 0` and `ℹ cancelled 0`.
- [x] T012 Run the history locator suite (`tests/history-locator.vitest.ts`). Verify: `npx vitest run tests/history-locator.vitest.ts` from `.skilled/skills/system-spec-kit/runtime` exits 0 and reports no failed test.
- [x] T013 Run the packet validator (`spec.md`, `plan.md`, `tasks.md`, `goal.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/004-offer-lookup-at-claim --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] One manual claim prints a `## History Lookup` section whose command returns the sender's turns.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
