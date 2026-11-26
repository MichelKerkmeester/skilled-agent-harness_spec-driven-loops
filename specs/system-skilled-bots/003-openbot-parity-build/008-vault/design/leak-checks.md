---
title: "Design: every leak check the vault adds or widens"
description: "The checks a value passes on the way in, the known-secret map every stored value joins and the eight surfaces it guards, the one-pass matcher behind them, the post-run scan of stdout, stderr, the run folder and the receipt folder with its encoded forms and redaction token, the withheld delivery and what the checks do not reach."
trigger_phrases:
  - "vault leak checks"
  - "post-run secret scan"
  - "secret redaction token"
  - "known secret map vault"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Every leak check the vault adds or widens

This note closes gaps 7 and 8 of the plan-depth research: the two edge-case refusals with no requirement row, and the redaction token and exit of a withheld run. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:160-161] Refusal names, layers and exits are `contracts/refusals.md` section 3.7 and are cited, not restated. The run-record field is `postRunCauses` in `contracts/records.md` section 4.

---

## 1. ON THE WAY IN: `bots secret set`

The value is read once, in `bots.cjs`, then handed to `setSecret` as a string. It never enters argv: `secret set` takes no option that carries it, so `bots secret set demo --value x` fails the existing parser as `unknown option: --value` with exit 2. [SOURCE: .skilled/bin/bots.cjs:126-128]

| Step | Rule | On failure |
|------|------|------------|
| Read, stdin a terminal | Write `secret value for <name>: ` to stderr. Put stdin in raw mode. Collect bytes until `\r` or `\n`, dropping the last character on `0x7f` or `0x08`, echoing nothing. `0x03` (Ctrl-C) or `0x04` (Ctrl-D) on an empty buffer stops the read. Restore the mode in a `finally` and write a newline to stderr | `secret-no-input`, exit 2, on a stopped read |
| Read, stdin not a terminal | Read until the first `\n` or end of input, at most 65,536 bytes | `secret-no-input`, exit 2, when end of input comes before any byte. `secret-too-long`, exit 2, when 65,536 bytes hold no newline |
| Normalize | Drop one trailing `\r`, then trim surrounding whitespace, the same trim `collectKnownSecrets` applies to an environment value [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:254] | none |
| Empty | Nothing left after the trim | `secret-empty`, exit 2 |
| Placeholder | The value equals one of the lifted guard's dev and example placeholders, such as `dev-secret-change-me-please-32chars` [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/node/secrets-guard.ts:1] | `secret-placeholder`, exit 2 |
| Length | More than 16,384 code points (`[...value].length`), the vault bound [SOURCE: specs/system-skilled-bots/context/rakazo-main/docs/bot-secrets.md:35], or for the macOS keychain a write line over 4,095 bytes (`backends.md` section 2.3) | `secret-too-long`, exit 2, with the bound in the detail |
| Store | `backends.md` and `index-and-writes.md` | `secret-write-dropped`, exit 4 |

On success the verb prints one line to stdout, `bots: secret <name> stored (<backend>)`, and nothing else. Every refusal line names the reason and the name, never the value.

A value shorter than 8 characters is accepted and stored, and is invisible to every literal check below, because the detector skips a value under `MIN_SECRET_LENGTH`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:54] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:289] `contracts/refusals.md` has no refusal for a short value, so this is a stated residual (`threat-model.md` row T9), not a new check.

---

## 2. THE KNOWN-SECRET MAP

`knownSecretValues(stateRoot, identity)` in `secrets.ts` returns a `Map<string, string>` with one row per index entry, keyed `vault:<name>`, valued with the resolved value.

**One function, not a merge per caller.** `collectAllKnownSecrets(env, checkoutRoot, stateRoot, identity)` in `dispatch.ts` is the only map any surface builds. It calls `collectKnownSecrets(env, checkoutRoot)` for the environment and the checkout's dotenv files [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:249-279], then adds every row of `knownSecretValues(stateRoot, identity)`, so a detector match names `key vault:demo`, never a value. Every stored value joins, not only the one a bot declares, because any bot child can read any value file (D6 in `contracts/decisions.md`).

A per-caller merge would leave whichever surface was written before this phase on the environment-only map, and a vault value could then reach a memory file or a proposal draft. So this phase migrates every `collectKnownSecrets` call site that exists at build time, 005's `bots remember` check and its `answer confirm` settle included, and leaves `collectKnownSecrets` as the inner half that only `collectAllKnownSecrets` calls. Later phases call `collectAllKnownSecrets` too, as `contracts/runtime-architecture.md` states.

It guards eight surfaces. Four exist today, two are new here, and two land in 005 before this phase.

| Surface | Where | Refusal on a match | Today |
|---------|-------|--------------------|-------|
| definition body | the runner's literal loop [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:942-953] | `body-secret` | environment and dotenv only |
| resumed question | the same loop | `body-secret` | the same |
| resumed answer | the same loop | `body-secret` | the same |
| queued request prompt | the same loop | `body-secret` | the same |
| `bots answer` text | `answerItem` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:88-89] | `answer-secret` | the same |
| delivery message | `deliverRecord` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:291] | the entry goes `not-attempted` with `withheld: ...` evidence [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:341-343] | the same |
| `bots remember` text | 005's memory write check in `bots.cjs` | `memory-secret` | the same |
| `answer confirm` settle | 005's settle check in `answerItem` | `answer-secret` | the same |

**When the vault cannot be read.** Each surface fails closed. The runner refuses `secret-store-unreadable` before the loop. `answerItem` refuses `secret-store-unreadable` with exit 4. `deliverRecord` sets each queued entry `not-attempted` with the evidence `withheld: secret-store-unreadable`. None of them falls back to the environment-only map, because a check that silently drops the vault would pass the very value it exists to stop. The run check holds for every bot, a bot that names no secret included, because its body could still carry a stored value. So a locked keychain stops every run of the identity until it is unlocked, at the cost of one 10 s timeout per run (`backends.md` section 6).

**One pass.** `findSecretLiteral` keeps its signature and return shape. Its literal half becomes one `createSecretMatcher` over the map's values of at least 8 characters, then, only on a hit, a scan of the map for the first key whose value occurs, which names it. [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/messages/secret-matcher.ts:34] The prefix patterns stay as they are. AC-013 compares the result with the per-value scan on 20 values and a 10,000-character text.

---

## 3. AFTER THE CHILD: THE POST-RUN SCAN

### 3.1 When and over what

The scan runs in `runBot` after the child exits and before anything reads its output: before `finalAnswerText`, before `parseDecisionMarker` and before the record is written. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1092-1093] It runs on every dispatched run, completed, failed, killed or timed out, and on a partial log.

**Values.** Every row of `knownSecretValues` plus every row of `collectKnownSecrets`, at least 8 characters each, and for each vault value two encoded forms beside the plain one: standard base64 of its UTF-8 bytes, and `encodeURIComponent` of it. An encoded form equal to the plain value, or shorter than 8 characters, is dropped. The forms follow the reference, which redacts a command variable "in its plain, base64 and URL-encoded forms". [SOURCE: specs/system-skilled-bots/context/rakazo-main/docs/bot-secrets.md:62]

**Text.** Four places, in this order:

1. The child's captured stdout in memory, `outcome.stdout`, so the answer text, the decision marker and the delivery message are read from the redacted copy. A parked question therefore never carries a value into a needs-you item.
2. The child's captured stderr in memory, `outcome.stderr`. Today `runAuditedExecutorCommand` writes that stream straight to the bots process's stderr [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1635-1637], which for a scheduled job is `<identity>/agent-logs/<label>.log` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/plist-render.ts:243], outside every folder this scan reads. So this phase adds `onStderr?: (text: string) => void` to `RunAuditedExecutorCommandInput` and dispatch passes a collector, which leaves the stream in memory for the scan. The redacted copy is what is re-emitted to the bots process's stderr or written to a log, never the raw one.
3. Every regular file under the run folder, `stdout.log` and the ledger and observability files included (`contracts/runtime-architecture.md` section 2.2).
4. Every regular file under the run's receipt folder, `<identity>/receipts/<runId>/`.

A file is read line by line, because no value holds a newline (section 1), and written to a temp file in the same folder with the original mode, then renamed over the original only when a line changed.

### 3.2 The redaction

Each stretch the matcher's `ranges` returns is replaced by `[redacted: <name>]`, the token `contracts/records.md` section 17 fixes for both 008 and 010. `<name>` is the secret name for a `vault:` row and the map key for an environment or dotenv row. For a stretch that several values cover, the name is the one whose value starts at the stretch's first character, longest value first, and otherwise the first name in sort order whose value lies inside the stretch.

### 3.3 What the run records and does

| Result | Rule |
|--------|------|
| Run record | One `postRunCauses` row `{ cause: 'secret-in-output', names: [<sorted unique names>], detail: '<n> stretches in <run-folder-relative paths, comma separated>' }`. Never a value |
| Run outcome and exit | Unchanged: the run's own outcome stands, 0 for completed, 1 for failed, 5 for awaiting a decision (`contracts/refusals.md` section 2, post-run cause row) |
| Delivery | Withheld. Every queued entry goes `not-attempted` with the evidence `withheld: secret-in-output`, set in `deliverRecord` when the record's `postRunCauses` holds the cause, so no message is sent |
| A clean scan | `postRunCauses` stays `[]` and the run is delivered as today |

One scan records one row. 010's reply scan uses the same cause name and the same row shape, so a chat turn never records two causes for one finding (`contracts/refusals.md` section 3.7).

---

## 4. WHAT THE CHECKS DO NOT REACH

| Path a value can take | Why no check reaches it | Where it is accepted |
|-----------------------|-------------------------|----------------------|
| A file the child writes in the checkout or the worktree | the runtime reads only its own folders | `threat-model.md` T6 |
| A commit or a push the child makes | the same | T6 |
| A network request the child makes | the runtime sees no traffic | T6 |
| A transformed value, such as reversed, split across lines or hex | only plain, base64 and URL-encoded forms are matched | T7 |
| An orphan value | it is not on the map (`index-and-writes.md` section 3) | T8 |
| A value shorter than 8 characters | the detector skips it | T9 |

---

## 5. VERIFY

| Claim | Command | Prints |
|-------|---------|--------|
| The 8 character floor | `rg -n 'MIN_SECRET_LENGTH = ' .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | `54:export const MIN_SECRET_LENGTH = 8;` |
| The runner's literal loop has no vault values today | `rg -n 'collectKnownSecrets\(env, context.checkoutRoot\)' .skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | one line, 942 |
| `collectKnownSecrets` has one call site per surface today | `rg -n 'collectKnownSecrets\(' .skilled/skills/system-skilled-bots/runtime/lib` | four lines, one each in `answer.ts`, `delivery.ts`, `dispatch.ts` and `runner.ts` |
| The child's stderr is written raw today | `rg -n 'process.stderr.write\(stderr\)' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | one line, 1637 |
| A withheld delivery is `not-attempted` | `rg -n "entry.state = 'not-attempted'" .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` | two lines |
| The redaction token is the contract's | `rg -c 'redacted: <name>' specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md` | `2` |
| `--value` is an unknown option today | `node .skilled/bin/bots.cjs secret set demo --value x 2>&1 \| head -1` | `bots: unknown option: --value` |
