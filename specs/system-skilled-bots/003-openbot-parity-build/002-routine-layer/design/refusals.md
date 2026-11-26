---
title: "Design: the refusals and exit codes of phase 2"
description: "Every refusal phase 2 adds with its layer, failure class, exit code, registry entry, checker invariant id and defect fixture, the existing refusals its verbs can return, and the stderr shape of each."
trigger_phrases:
  - "routine refusal catalogue"
  - "routine exit codes"
  - "routine checker invariants"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The refusals and exit codes of phase 2

Eleven refusals, nine of them definition parse names the checker also audits, one checker invariant that is also an install refusal, and two run refusals that enter the runner's typed registry. The packet table is `contracts/refusals.md` section 3.2 and this file adds the columns a builder needs: the checker invariant id, the fixture that trips it and the exact stderr line. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "3.2 Phase 002, routine layer"]

The exit rule is the packet's. A definition parse refusal exits 4 at run time as the detail of `definition-malformed` and 1 in the checker. A checker invariant exits 1. A run refusal exits 4 and enters `REFUSAL_CAUSES`. A verb refusal exits 2 when `bots.cjs` refuses before any runtime call and 4 when a runtime `Result` refused. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "2. LAYERS AND THE EXIT RULE"]

---

## 1. THE ELEVEN

| # | Name | Layer | Class | Exit | `REFUSAL_CAUSES` | Checker invariant id | Fixture |
|---|------|-------|-------|------|------------------|----------------------|---------|
| 1 | `routine-trigger-conflict` | Definition parse | - | 4 run, 1 checker | No | `definition.routine-trigger-conflict` | `routine-trigger-conflict` |
| 2 | `routine-tell-with-targets` | Definition parse | - | 4 run, 1 checker | No | `definition.routine-tell-with-targets` | `routine-tell-with-targets` |
| 3 | `routine-starts-empty` | Definition parse | - | 4 run, 1 checker | No | `definition.routine-starts-empty` | `routine-starts-empty` |
| 4 | `routine-starts-multiple-cron` | Definition parse | - | 4 run, 1 checker | No | `definition.routine-starts-multiple-cron` | `routine-starts-multiple-cron` |
| 5 | `routine-starts-cron-not-first` | Definition parse | - | 4 run, 1 checker | No | `definition.routine-starts-cron-not-first` | `routine-starts-cron-not-first` |
| 6 | `routine-starts-multiple` | Definition parse | - | 4 run, 1 checker | No | `definition.routine-starts-multiple` | `routine-starts-multiple` |
| 7 | `routine-until-check-without-outcome` | Definition parse | - | 4 run, 1 checker | No | `definition.routine-until-check-without-outcome` | `routine-until-check-without-outcome` |
| 8 | `routine-until-shell-metacharacters` | Definition parse | - | 4 run, 1 checker | No | `definition.routine-until-shell-metacharacters` | `routine-until-shell-metacharacters` |
| 9 | `routine-floor-15-minutes` | Checker invariant, and an install refusal | - | 1 checker, 4 `bots install` | No | `routine-floor-15-minutes` | `routine-floor` |
| 10 | `routine-fatigued` | Run refusal | `null` | 4 | Yes | none | none, a state root is the fixture |
| 11 | `routine-completed` | Run refusal | `null` | 4 | Yes | none | none, a state root is the fixture |

Rows 1 to 8 are details of `definition-malformed` at run time, never registry entries, because the runner already folds every parse refusal into that one cause. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:789] Row 9 is the one refusal that is both a checker invariant and an install refusal, because the checker audits a checkout and the installer refuses before it writes a plist.

**The checker prefixes a parse reason with `definition.`.** `parseDefinition` calls the routine parser, so rows 1 to 8 are parse refusals and the checker prints them as `FAIL: definition.<reason>`, the shape it already uses for every parse reason [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:177]. The reason string the runtime returns stays unprefixed, so a run records `definition-malformed` with the bare reason as its detail. Row 9 is a checker invariant rather than a parse refusal, so it prints unprefixed.

**The registry after this phase.** `REFUSAL_CAUSES` holds 25 causes today and this phase adds two, so it holds 27 until 005 adds its own. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:122-149] Both new entries keep the `{ reason, class }` shape the registry types. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:149]

---

## 2. THE STDERR AND STDOUT SHAPE OF EACH

| # | Where it surfaces | The exact line |
|---|-------------------|----------------|
| 1 to 8 | The checker | `FAIL: definition.<name>: <message>` on stdout, exit 1 [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:110-113] |
| 1 to 8 | A run | `bots: <botId> refused before dispatch (definition-malformed: <name>)` on stdout, exit 4 [SOURCE: .skilled/bin/bots.cjs:404] |
| 9 | The checker | `FAIL: routine-floor-15-minutes: <message>` on stdout, exit 1 |
| 9 | `bots install` | `bots: routine-floor-15-minutes: <detail>` on stderr, exit 4 [SOURCE: .skilled/bin/bots.cjs:208-214] |
| 10 | A run | `bots: <botId> refused before dispatch (routine-fatigued)` on stdout, exit 4 |
| 11 | A run | `bots: <botId> refused before dispatch (routine-completed)` on stdout, exit 4 |

The checker's message for each invariant names the file and the field, in the shape the existing invariants use, such as `bots/<id>/BOT.md: routine.starts holds 2 entries`. The message is not asserted by a test, only the id is, so a builder may word it freely as long as the id is exact.

**The precedence between the three `starts` names.** Rows 4, 5 and 6 can all fire on one `starts` list, so the order is fixed and the first that applies is the one reported: `routine-starts-multiple-cron` when two or more entries are cron, else `routine-starts-cron-not-first` when exactly one entry is cron and it is not at index 0, else `routine-starts-multiple`. `design/fixtures.md` section 2 states the same rule beside the three fixtures that prove it, and `spec.md` REQ-009 cites both.

---

## 3. THE TWO RUN REFUSALS, DECIDED

**`routine-fatigued` is decided at the `disabled` check.** The runner reads the `disabled` switch before the lease. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:822-823] When that switch is set and the routine state file records `fatiguedAt`, the refusal is `routine-fatigued` rather than `disabled`. Without this the name the phase requires could never be recorded, because the `disabled` check refuses before anything else could name fatigue. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "5. DECISIONS TAKEN"]

**`routine-completed` is checked beside `disabled`.** The `completed` switch is read in the same place, before the lease, and refuses `routine-completed` with class `null`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "5. DECISIONS TAKEN"] The order between the two checks is fixed: `disabled` first, so a bot that is both fatigued and completed reports the fatigue, which is the state the operator has to act on.

**Neither refusal is a failure.** Both carry class `null`, so neither counts toward the streak. A run refused before dispatch carries `exit.refusal` and is never counted as a failed run. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:415-434]

---

## 4. THE EXISTING REFUSALS THIS PHASE'S VERBS RETURN

`bots routines` and `bots enable` add no verb refusal of their own. They return the names the CLI already has.

| Verb | Refusal | Exit | When |
|------|---------|------|------|
| `bots routines` | `bots: unknown option: <option>` | 2 | an option the verb does not take [SOURCE: .skilled/bin/bots.cjs:94-98] |
| `bots routines` | `identity-unknown` | 4 | the repository has no identity [SOURCE: .skilled/bin/bots.cjs:211] |
| `bots routines` | `config-unreadable`, `config-invalid` | 4 | the repository config does not read [SOURCE: .skilled/bin/bots.cjs:208-214] |
| `bots routines` | `bots: <message>` | 1 | an uncaught throw [SOURCE: .skilled/bin/bots.cjs:542-545] |
| `bots enable` | `identity-unknown`, `config-unreadable`, `config-invalid` | 4 | the same three |
| `bots enable` | `item-expired` | none, it is a warning | the fatigue item has expired. The enable still clears the switch and the record, and prints `bots: item <id> expired; not answered` on stderr |
| `bots enable` | `answer-not-approver` | 4 | 011's roster names the actor and does not admit it. The enable stops before the switch is cleared, because the answer is step 1 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "3.5 Phase 006, approval grants", row `answer-not-approver`] |

**The `item-expired` warning is not a refusal.** It is one stderr line and the verb exits 0, because the operator asked for the bot to be enabled and the item is a notice rather than a gate. `design/state-machines.md` section 3 fixes the three item outcomes.

---

## 5. THE `bots routines` FAILED READ

The screen contract's section 9 fixes how the screen draws a failed read of the four payloads. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md, section "9. A FAILED READ"] This verb's own exits are the ones below, and they are the ones the screen's table already expects.

| Exit | When | Stderr |
|------|------|--------|
| 0 | a good read, including a checkout with no routine bot | empty, or one `bots: routine state <botId> did not read` line per damaged state file, with the good rows still printed |
| 1 | an uncaught throw | `bots: <message>` |
| 2 | a usage error | `bots: <message>` and then the usage text |
| 4 | the repository config or identity refuses | `bots: <reason>: <detail>`, or the identity-unknown sentence |

**A damaged state file does not fail the read.** It reads as every field null, so the row prints `untilMetAt -` and `switch` from the switches alone, and the stderr line names the bot. That is the same rule `bots inbox` applies to an unreadable item. [SOURCE: .skilled/bin/bots.cjs:472]

---

## 6. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| The eight parse names carry the checker's `definition.` prefix and the floor name does not | The checker already prints every parse reason as `definition.<reason>`, so the routine parse reasons follow it and a builder writes no new branch. The floor is a checker invariant rather than a parse refusal, so it prints unprefixed |
| The floor fixture is `routine-floor`, not `routine-floor-15-minutes` | The fixture folder names the rule and the invariant id names the bound. The other nine fixtures carry the invariant id because the id is the whole rule |
| `routine-fatigued` and `routine-completed` carry class `null` | Neither is a failure. A class would make a refused run count toward the streak, which is the bug the refusal exists to report |
| `disabled` is checked before `completed` | A bot that is both fatigued and completed reports the fatigue, which is the state the operator has to act on |
| `bots enable` warns on an expired item and exits 0 | A recovery that refused would leave the bot stopped with no way back except editing files by hand |
| `bots routines` prints a damaged state file as a row and a stderr line | A read verb that failed on one damaged file would hide every other routine |

---

## 7. CHECK THIS FILE

Each command prints the number on the line after it.

```bash
rg -c '^\| [0-9]+ \| `routine-' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/refusals.md
# prints 11
rg -c '^## ' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/refusals.md
# prints 7
```
