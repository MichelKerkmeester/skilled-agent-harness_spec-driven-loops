---
title: "Design: Activity and actor refusals"
description: "Every refusal and failure line the activity, inbox, answer, run and schedule install verbs gain in this phase, with its exact first line, its exit code, its layer, where it is checked and the test that proves it."
trigger_phrases:
  - "activity and actor refusals"
  - "answer scope refusal"
  - "as needs a tty"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Activity and actor refusals

`contracts/refusals.md` section 3.1 owns this phase's rows and section 2 owns the exit rule: a check `bots.cjs` makes on its own input exits 2, and a refusal from a runtime call exits 4. This file adds the exact text, the check order and the test for each row. It names the four rows the contract gained from this phase: R6, R7, R8 and R13. None of them enters `REFUSAL_CAUSES`, and none is a run refusal.

A usage refusal prints `bots: <message>` and then the usage text on stderr, so its first line is the message alone [SOURCE: .skilled/bin/bots.cjs:94-98]. Nothing is printed on stdout.

---

## 1. THE ROWS

| # | First stderr line | Verb | When | Exit | In `contracts/refusals.md` 3.1 | Test |
|---|-------------------|------|------|------|-------------------------------|------|
| R1 | `bots: option --as needs a value` | `answer`, `run` | `--as` with no value, or a value blank after trim | 2 | yes | `cli-run.vitest.ts`, `as value` |
| R2 | `bots: --as takes a name` | `answer`, `run` | the trimmed value fails `ACTOR_PATTERN` | 2 | yes | `cli-run.vitest.ts`, `as value` |
| R3 | `bots: grant-scope-unsupported` | `answer` | `--scope always` or `--scope conversation` | 2 | yes | `cli-run.vitest.ts`, `scope` |
| R4 | `bots: --scope takes once or deny` | `answer` | any other `--scope` value, case included, so `ONCE` and the empty string land here | 2 | yes | `cli-run.vitest.ts`, `scope` |
| R5 | `bots: --as needs a tty` | `answer`, `run` | `--as` names someone other than the OS user and `process.stdin.isTTY` is not `true` | 2 | yes | `cli-run.vitest.ts`, `tty` |
| R6 | `bots: --full-access needs a tty` | `schedule install` | `--full-access` and `process.stdin.isTTY` is not `true` | 2 | yes, added 2026-11-26 | `cli-run.vitest.ts`, `full access` |
| R7 | `bots: activity takes no id` | `activity` | a positional after the verb | 2 | yes, added 2026-11-26 | `cli-run.vitest.ts`, `activity usage` |
| R8 | `bots: activity takes no --<option>` | `activity` | any option but `--json`, `--repo` and `--skilled-tree` | 2 | yes, added 2026-11-26 | `cli-run.vitest.ts`, `activity usage` |
| R9 | `bots: <reason>: <detail>; run bots status --rebuild` | `activity` | the index cannot be opened, read or built, where reason is `index-unreadable`, `index-binding-failed` or `index-build-failed` | 1 | yes | `activity.vitest.ts`, `index failure` |
| R10 | `bots: the status modules did not load: <message>` | `activity` | the status modules throw on load, as `status` does today [SOURCE: .skilled/bin/bots.cjs:352-354] | 1 | no, same as `status` | none, the existing line |
| R11 | `bots: identity-unknown: ...` and the other config refusals | `activity` | the checkout's config or identity refuses, as `status` does today [SOURCE: .skilled/bin/bots.cjs:356-360] | 4 | no, same as `status` | none, the existing line |
| R12 | `bots: item-answered-differently: answered at <t>` | `answer` | the same text with another scope, new in this phase, beside today's other-text case | 4 | existing row [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:82-86] | `answer.vitest.ts`, `scope` |
| R13 | `bots: child-write-refused` | `answer`, `enable` | `SKILLED_BOT_RUN_ID` or `AI_SESSION_CHILD=1` is in the environment, so the caller is a bot child | 2 | yes, added 2026-11-26 | `cli-run.vitest.ts`, `child write` |

R7 and R8 are the parser's existing messages for any verb [SOURCE: .skilled/bin/bots.cjs:144] [SOURCE: .skilled/bin/bots.cjs:166], so they need no new code, only the verb's row in `VERB_SPECS`. They are listed because the screen's failed-read table names exit 2 for a usage error.

`--json` and `--all` on `inbox` remove today's `bots: inbox takes no --json` [SOURCE: .skilled/bin/bots.cjs:70]. No other inbox line changes: a folder that cannot be listed still exits 1 and an item that does not read is still named on stderr with exit 0 [SOURCE: .skilled/bin/bots.cjs:458-473].

---

## 2. THE ORDER

`bots answer` runs R13, then R1, R2, R3 and R4, then R5, then loads the runtime. So a script that passes a bad scope and a foreign `--as` is told about the scope first, and nothing is read or written before the last check passes. The diagram is [state-machines.md](state-machines.md) section 6.

`bots run` runs R1, R2 and R5 in that order. `bots schedule install` runs R6 before the installer is called.

R13 runs first because a bot child is not a person at a terminal, so no later check can make its write legitimate. It reads the environment only, so it costs no file read.

The tty check compares the trimmed `--as` with `os.userInfo().username` by exact match. A lookup that throws counts as no match, so the check refuses without a tty. A pinned `SKILLED_BOTS_OPERATOR` on a path that is not a scheduled fire or a scheduled drain takes the same check, so a shell that exports the variable is refused `bots: --as needs a tty` unless the name is the OS user.

---

## 3. WHAT IS NOT A REFUSAL

| Case | What happens |
|------|--------------|
| A definition declares `danger-full-access` on a bot installed without `--full-access` | The run dispatches at `workspace-write` and records it. No line is printed |
| `bots schedule install <id> --full-access` on a bot whose trigger is not cron | The install record is written with `operator` and `fullAccess`, no plist is written and the verb prints `bots: <botId> has a <kind> trigger, so full access is recorded and no schedule is installed` on stdout and exits 0. Without the flag the same verb still refuses `trigger-not-cron` |
| A pinned `SKILLED_BOTS_OPERATOR` that fails the pattern | Ignored, the actor falls to the OS user |
| The OS user name fails the pattern or cannot be read | The actor is `null` on the record or the answer |
| `answeredBy` cannot be stamped because the parked run has no record yet | Skipped, the answer still succeeds |
| A refresh that cannot complete | The identity stays in `staleIdentities`, exit 0, nothing on stderr |
| A lease side file, request or install record that does not read | Skipped, no row and no line |

---

## 4. CLASS FOR THE SCREEN

The screen classes every answer refusal by its first line [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow/design/state-machines.md:283-285]. R3 and R4 are the two rows it already lists as reachable only through a screen defect. R12 is `gone`, the same class as the other-text case. R13 is `refused`, because a bot child that tries to answer is a caller the screen did not expect rather than an item that moved.
