---
title: "Design: bots chat loop and text output"
description: "A literal sample session of bots chat <id> with the prompt string, a reply, the line shown while a run executes, a parked question, a failure, a refusal and /exit, plus which stream each line goes to and the text forms of --message and --transcript."
trigger_phrases:
  - "bots chat loop"
  - "chat loop transcript"
  - "bots chat prompt string"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The `bots chat` loop and its text output

The loop follows turnstone's terminal shape: readline with a history and a completer over a fixed command list, and each line classified before it is dispatched. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:176-181] [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:1276-1305] Its prompt carries the active name in brackets, as turnstone's does. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:2203-2208] The lift is Apache-2.0, and `../../002-conversation-runtime-and-chat-verb/` carries the notice.

Every message line printed below is one stored message, so the loop and `--transcript` print the same words.

---

## 1. A SAMPLE SESSION

The data set is the screen's: clock `2026-11-25T21:14:04Z`, operator `ada`, bots `archive`, `digest`, `hello` and `nightly-report`. The conversation `hello` already holds the four messages of `chat-transcript.sample.json`. Stdin is a tty. Lines from stdout and stderr are shown in the order a person sees them, and section 2 names the stream of each.

```text
$ node .skilled/bin/bots.cjs chat hello
bots: chat hello · conversation hello · 4 messages · /help lists the commands
[hello] > is the release ready?
· hello · working…
hello › needs you: Ship the release? (item 20261125T211204Z-7c1e9a40)
bots: answer it with: bots answer 20261125T211204Z-7c1e9a40 <text>
[hello] > @digest anything new on the cache key?
· digest · working…
digest › The cache key change merged at 21:09.
[hello] > @nightly-report run the numbers again
· nightly-report · working…
nightly-report › failed: executor exited 1
[hello] > @Hello are you there?
bots: bot-unknown: Hello
[hello] > /status
bots: unknown command: /status
[hello] >
[hello] > /exit
$ echo $?
0
```

What each line shows:

| Line | What it is |
|------|------------|
| `bots: chat hello · conversation hello · 4 messages · /help lists the commands` | The opening line: the default bot, the conversation and its message count |
| `[hello] > ` | The prompt. The name in brackets is the default bot, which a line with no address goes to |
| `· hello · working…` | Printed when the run is dispatched, so a run that takes minutes is visibly running. It names the addressed bot |
| `hello › needs you: …` | The parked bot message, as stored. The text form `needs you: <question> (item <itemId>)` is `contracts/records.md` section 10 |
| `bots: answer it with: …` | A hint after a parked message, naming the one command that continues the run |
| `digest › …` | A reply from the addressed bot. The prompt keeps `[hello]`, because an address routes one message and does not move the default (`routing-grammar.md` section 2) |
| `nightly-report › failed: executor exited 1` | A failed run's message, as stored, in the form `failed: <exit reason>` |
| `bots: bot-unknown: Hello` | A refusal. Nothing is appended and no run starts. `Hello` fails the bot id pattern because of its capital letter (`routing-grammar.md` section 4) |
| `bots: unknown command: /status` | A line starting with `/` is always a command and never a message |
| `[hello] >` then a new prompt | An empty line sends nothing and appends nothing |
| `/exit` and `exit 0` | `/exit` and `/quit` leave with exit 0, as a closed stdin does |

The answer to the parked question arrives later in the same conversation, appended by the drain once `bots answer` has queued the resume. The loop does not wait for it. The next `--transcript`, or the next line typed in the loop, shows it.

---

## 2. WHICH STREAM EACH LINE GOES TO

| Line | Stream | Printed when stdin is not a tty |
|------|--------|---------------------------------|
| The opening line | stderr | No |
| The prompt `[<bot>] > ` | stdout, through readline | No |
| `· <bot> · working…` | stderr | Yes |
| `<bot> › <text>`, one per appended bot message | stdout | Yes |
| `bots: answer it with: …` | stderr | Yes |
| A refusal or `unknown command` line | stderr | Yes |
| The `/help` list | stderr | Yes |

Stdout carries only the conversation, so `printf 'hello\n/exit\n' | bots chat hello > out.txt` leaves one bot message line in `out.txt` and nothing else. The prompt and the opening line are drawn only for a person at a terminal, which readline's tty check decides.

---

## 3. THE LOOP'S COMMANDS

| Line | What it does | Appends |
|------|--------------|---------|
| `/exit`, `/quit` | Leave with exit 0 | Nothing |
| `/help` | Print the commands and the address rule on stderr | Nothing |
| Any other line starting with `/` | `bots: unknown command: <word>` on stderr | Nothing |
| An empty line, or one that is only whitespace | Nothing | Nothing |
| Any other line | One message: the routing grammar, then the append, the run and the reply | One human message, then one bot message |

Tab completes the `/` commands and `@<bot-id>` for every bot the checkout defines, as turnstone completes its slash commands. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:168-173] A message that has to start with `/` is sent with `--message` instead.

`Ctrl+D` at the prompt closes stdin and leaves with exit 0. `Ctrl+C` at an empty prompt leaves with exit 0, as turnstone does. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:2209-2212] `Ctrl+C` while a run executes is the terminal's signal to the whole foreground group, as it is for `bots run` today. The human message is already appended, so the next `--transcript` reports it as unanswered rather than running it again (`../../002-conversation-runtime-and-chat-verb/spec.md` REQ-002).

The loop's exit code is 0 however its runs ended, because each run's outcome is already a message in the file. One failed run does not make the conversation a failure.

---

## 4. `--message` AND `--transcript` AS TEXT

`bots chat <id> --message <text>` is one turn of the loop with no prompt and no opening line.

```text
$ node .skilled/bin/bots.cjs chat hello --message 'is the release ready?'
· hello · working…
hello › Yes. CI is green and the changelog is merged.
$ echo $?
0
```

Its exit code is the run's: 0 completed, 1 failed, 5 parked and 4 for a run refused before dispatch or a `bot-unknown` address, as the runtime's exit table gives (`contracts/refusals.md` section 1 and section 3.9). An empty message, or an address with nothing after it, exits 2 with the usage text. `--message` takes no `--json`, because `contracts/cli-json.md` section 2 gives `bots chat` one `--json` form, the transcript's.

`bots chat <id> --transcript` prints one line per message, oldest first:

```text
$ node .skilled/bin/bots.cjs chat hello --transcript
2026-11-25T21:02:12Z ada → hello: what changed on main since yesterday?
2026-11-25T21:03:40Z hello › Three merges: the lint fix, the changelog and the CI cache bump.
2026-11-25T21:05:08Z ada → digest: @digest summarize the open review threads
2026-11-25T21:06:31Z digest › Two threads wait on you: the release notes and the cache key.
$ echo $?
0
```

| Message | Text form |
|---------|-----------|
| Human | `<at> <by> → <botId>: <text>` |
| Human with no later bot message | The same, then ` (no reply yet)` |
| Bot | `<at> <botId> › <text>` |

`<at>` is printed to the second with a `Z`, and `<text>` is the stored text verbatim, so an injection attempt reads back exactly as it was typed (`../../002-conversation-runtime-and-chat-verb/spec.md` REQ-013). The `--json` form prints the envelope `contracts/cli-json.md` section 3.1 fixes and is what the pane reads (`pane-contract.md` section 2).

---

## 5. SOURCES

| What the loop follows | Pointer |
|-----------------------|---------|
| readline with a history length, a completer and Tab bound to complete | [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:176-181] |
| The completer over the slash commands | [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:168-173] |
| One line classified before it is dispatched, `/exit` and `/quit` in any case | [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:1276-1305] |
| The bracketed prompt and the end of input on `EOFError` or `KeyboardInterrupt` | [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:2203-2212] |
| The parked and failed text forms | `contracts/records.md` section 10 |
| The exit codes | `contracts/refusals.md` section 1 and section 3.9 |
