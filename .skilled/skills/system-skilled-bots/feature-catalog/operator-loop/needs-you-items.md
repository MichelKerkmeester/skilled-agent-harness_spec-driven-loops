---
title: "Needs-you items"
description: "Parks a run that needs a human decision as an item under the user-level state root, and holds the bot's later runs until it is answered or expires."
trigger_phrases:
  - "needs-you items"
  - "bot needs a decision"
  - "parked bot run"
  - "NEEDS-DECISION marker"
version: 1.0.0.0
---

# Needs-you items

## 1. OVERVIEW

Parks a run that needs a human decision as an item under the user-level state root, and holds the bot's later runs until it is answered or expires.

An unattended run that needs a human ends instead of waiting, and no process waits for the answer. The item lives where a run can neither forge nor clear one. `bots inbox` lists open and expired items, and `bots answer` continues the run.

---

## 2. HOW IT WORKS

The prompt tells the child to print a `[NEEDS-DECISION] ` line with its question, optionally followed by `[OPTION] ` lines. When the runner reads that marker in the child's final answer, it writes one item holding the question, the options, the parked prompt and the bound spec folder, then ends the run as `awaiting-decision` with exit 5. A parked worktree is kept for the resumed run. An empty question is an author failure and writes no item. A timeout or budget stop keeps its own class even when the marker was printed first.

An item's state (`open`, `answered` or `expired`) is derived from its fields every time it is read and never stored, so it cannot disagree with them. An item expires after the repository's needs-you expiry, seven days by default. An expired item is listed as expired without being rewritten.

An open item holds every later run of its bot, which is refused before dispatch, and a scheduled fire it holds is recorded as held. An item file that does not read also holds the bot unless it still names another bot, and a needs-you folder that cannot be listed holds every bot, because a hold that fails open would let a bot run past a question. The hold lifts once the item is answered or expires.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Shared | Item shape, derived state, expiry, listing, the hold rule and the resumed prompt |
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Shared | The decision and option markers and their parser |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Shared | Parks the run, writes the item and checks the hold before the lease |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/needs-you.vitest.ts` | Vitest | Item validation, state derivation and expiry |
| `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts` | Vitest | Parking per executor kind, the hold and its release, expired listing |
| `.skilled/skills/system-skilled-bots/runtime/tests/runner-hardening.vitest.ts` | Vitest | Unreadable items and an unlistable folder hold the bot |

---

## 4. SOURCE METADATA

- Group: Operator loop
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `operator-loop/needs-you-items.md`

Related references:
- [needs-you-answer.md](needs-you-answer.md) - how an item is answered and the run continues
- [run-delivery.md](run-delivery.md) - the notice a parked run sends
