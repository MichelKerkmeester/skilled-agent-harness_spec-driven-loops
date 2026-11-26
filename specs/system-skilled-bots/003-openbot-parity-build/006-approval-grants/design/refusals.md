---
title: "Design: the refusal catalogue of the approval grant"
description: "Every refusal this phase raises or reuses, with its trigger, its exact stderr text, its exit code, the state it leaves on disk, the recovery an operator has and the test that proves it."
trigger_phrases:
  - "grant refusal catalogue"
  - "item-busy refusal"
  - "action-kind-invalid"
  - "grant-scope-unsupported"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The refusal catalogue

Nine refusals reach an operator from this phase's work. Three are new here, four are reused from 001 and 005, one is reserved for a later packet and one is the item validator's. The table's rows are `contracts/refusals.md` section 3.5's and are not repeated. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "3.5 Phase 006, approval grants"] What this file adds is the trigger, the exact text, the state on disk, the recovery and the test, which the contract's table has no column for.

The exit rule is `contracts/refusals.md` section 2's: a check `bots.cjs` makes on its own input exits 2, and a refusal that comes back from a runtime call exits 4. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "2. LAYERS AND THE EXIT RULE"]

---

## 1. THE CATALOGUE

| # | Name | Trigger | Exact stderr | Exit | State on disk | Recovery |
|---|------|---------|--------------|------|---------------|----------|
| 1 | `grant-scope-unsupported` | `bots answer` is given `--scope always` or `--scope conversation` | `bots: grant-scope-unsupported: no rule store lands in this phase` | 2 | Nothing. The item is not read | Answer again with `once` or `deny`, or with no `--scope` |
| 2 | `--scope takes once or deny` | `bots answer` is given any other `--scope` value | `bots: --scope takes once or deny` | 2 | Nothing | Answer again with `once` or `deny` |
| 3 | `item-answered-differently` | A second answer carries another text or another scope, or the answer lost the lock race | `bots: item-answered-differently: answered at <instant>` | 4 | Nothing. The first answer and its grant stand | Read the item with `bots inbox --all` and accept the recorded answer |
| 4 | `item-busy` | The lock is held by a live process and the 2,000 ms wait ran out | `bots: item-busy: held by pid <pid> since <instant>` | 4 | The lock file, which the holder releases | Retry the same answer with the same text and scope. The answer is idempotent for one text and one scope |
| 5 | `answer-not-approver` | A present roster names neither the actor as `owner` nor in `members` | `bots: answer-not-approver: <actor> is not on the roster` | 4 | Nothing. The item stays open | Answer as the owner, or add the actor with `bots channel roster add` |
| 6 | `action-kind-invalid` | A question carries `[ACTION: <kind>]` naming a kind outside the six | `bots: action-kind-invalid: <kind>` on the run's record, and the run's own line | 1 | No item. The run is failed with class `author` | Fix the bot's `[ACTION: <kind>]` line and run again |
| 7 | `grant-kind-unknown` | Reserved. A standing allow on an item whose `grants.kind` is `other` | `bots: grant-kind-unknown: <item-id>` | 4 | Nothing | None in this packet. No rule store lands, so nothing raises it |
| 8 | `item-field-invalid: grants` | A stored grant fails one of the ten checks in `design/records.md` section 1.1 | `bots: item-field-invalid: grants` from `answerItem`, and `bots: item <id> did not read` from `bots inbox` | 4 from `answerItem`, 0 from `inbox` | The item file, unchanged | Repair the item file by hand, or remove it if the decision is lost |
| 9 | `item-expired` | The item passed `expiresAt` before the answer | `bots: item-expired: expired at <instant>` | 4 | Nothing. The grant stays born open | None. An expired item is never answered automatically |

### 1.1 Which of the nine are new

| Name | New here | Owner |
|------|----------|-------|
| `grant-scope-unsupported` | No, 001 lands it | 001 |
| `--scope takes once or deny` | No, 001 lands it | 001 |
| `item-answered-differently` | The reason is today's. The scope half and the race half are this phase's | 006 |
| `item-busy` | Yes | 006 |
| `answer-not-approver` | Yes, and 011 reuses it on the channel surface | 006 |
| `action-kind-invalid` | Yes | 006 |
| `grant-kind-unknown` | Yes, reserved | 006 |
| `item-field-invalid: grants` | The reason is today's. The `grants` detail is this phase's | 006 |
| `item-expired` | No, today's | today |

### 1.2 The one refusal this phase does not raise

`unknown-key: grants` is what a runtime built before this phase says when it meets an item that carries the key. It is not this phase's refusal and no code here raises it. It is the revert cost `contracts/versioning.md` section 2 records, and the manual step is to strip `grants` from each item. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/versioning.md, section "2. AN OLDER RUNTIME MEETS A NEWER RECORD"]

---

## 2. THE EXACT TEXT OF EACH LINE

The CLI prints `bots: <reason>` or `bots: <reason>: <detail>` and nothing else on stderr. [SOURCE: .skilled/bin/bots.cjs:213] The detail is the one below and never a value the operator typed, so a secret in an answer cannot reach a refusal line.

| Name | Detail | Where the detail comes from |
|------|--------|-----------------------------|
| `grant-scope-unsupported` | `no rule store lands in this phase` | a fixed string, so the operator learns why rather than only that |
| `--scope takes once or deny` | none | the usage line follows on the next line |
| `item-answered-differently` | `answered at <instant>` | the item's `answer.answeredAt` |
| `item-busy` | `held by pid <pid> since <instant>` | the lock file's `pid` and `createdAt` |
| `answer-not-approver` | `<actor> is not on the roster` | the resolved actor name |
| `action-kind-invalid` | `<kind>` | the declared kind, which is a word the bot wrote |
| `grant-kind-unknown` | `<item-id>` | the item's id |
| `item-field-invalid: grants` | `grants` | the validator's field name |
| `item-expired` | `expired at <instant>` | the item's `expiresAt` |

---

## 3. WHAT EACH REFUSAL LEAVES BEHIND

The rule the whole catalogue follows: a refusal at steps 1 to 10 of `contracts/answer-seam.md` section 1 writes nothing, so the item stays open and the bot stays held. A refusal after step 11 cannot happen, because step 11 is the last judgement.

| Refusal | Item state after | Grant after | Bot held after |
|---------|------------------|-------------|----------------|
| `grant-scope-unsupported` | `open` | born open | yes |
| `--scope takes once or deny` | `open` | born open | yes |
| `item-answered-differently` | `answered` | as the first answer wrote it | until the resume leaves the queue |
| `item-busy` | `open` | born open | yes |
| `answer-not-approver` | `open` | born open | yes |
| `action-kind-invalid` | no item | none | no, the run failed |
| `grant-kind-unknown` | `open` | born open | yes |
| `item-field-invalid: grants` | unreadable, so `holdForBot` holds the bot the file names | unreadable | yes |
| `item-expired` | `expired` | born open | no |

---

## 4. THE TESTS

| Refusal | Test file | Test name |
|---------|-----------|-----------|
| `grant-scope-unsupported` | `tests/answer.vitest.ts` | `grant-scope-unsupported` |
| `--scope takes once or deny` | `tests/cli-run.vitest.ts` | `scope takes once or deny` |
| `item-answered-differently` | `tests/answer.vitest.ts` | `item-answered-differently` |
| `item-busy` | `tests/answer.vitest.ts` | `item-busy` |
| `answer-not-approver` | `tests/answer.vitest.ts` | `answer-not-approver` |
| `action-kind-invalid` | `tests/action-kind.vitest.ts` | `ACTION` |
| `grant-kind-unknown` | none. Nothing raises it, so a test would assert a branch no input reaches | not applicable |
| `item-field-invalid: grants` | `tests/needs-you.vitest.ts` | `grants` |
| `item-expired` | `tests/answer.vitest.ts` | `item-expired` |

The test files sit under `.skilled/skills/system-skilled-bots/runtime/tests/`.

---

## 5. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| `item-busy` carries the holder's pid and the lock's instant | An operator who sees a pid can tell a live answer from a lock left by a killed process, and the second case needs no action |
| `grant-scope-unsupported` carries a fixed detail naming the missing store | The refusal is a limitation rather than a mistake, and the operator learns it at the answer rather than after believing a standing allow took effect |
| `action-kind-invalid` is a run failure and not a refusal before dispatch | The child already ran and printed the bad line, so the run cannot park and the failure is the run's own [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "5. DECISIONS TAKEN"] |
| `grant-kind-unknown` ships with no test | No rule store lands, so no input reaches the branch and a test would assert a line no caller can produce |
| No refusal detail ever carries the answer's text | A secret the operator typed would otherwise reach stderr, which a log keeps |
