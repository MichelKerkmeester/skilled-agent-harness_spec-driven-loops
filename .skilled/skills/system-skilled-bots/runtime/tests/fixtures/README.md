---
title: "system-skilled-bots runtime test fixtures"
description: "BOT.md inputs, stub executor binaries, scheduler and notifier stand-ins and child-process drivers for the bots runtime tests."
trigger_phrases:
  - "skilled bots test fixtures"
  - "bots stub executor"
---

# system-skilled-bots / runtime / tests / fixtures

---

## 1. OVERVIEW

This folder holds the inputs and stand-ins the runtime suites share. Loose `.md` files are single BOT.md definitions for the parser tests. The `bots/` folder is a ready-made bots folder the runner tests copy into temp checkouts. The stubs replace every binary a run would otherwise reach: the executors, `osascript` and sk-git's worktree numbering script. The `channels/` folder holds recorded chat platform replies for the transport tests.

Nothing here is a production entry point. Each consumer suite owns the assertion that gives a fixture meaning, and every fixture runs inside a temp world, never against this checkout.

---

## 2. DIRECTORY TREE

```text
fixtures/
├── bots/                      # One folder per runner scenario, each with a BOT.md
├── channels/                  # Recorded platform replies for the chat transport tests
├── stub-executor/             # claude, codex, opencode and vibe stand-ins
├── naming-stub/               # Stand-ins for sk-git's worktree numbering script
├── drain-race-driver.cjs
├── launchctl-intercept.cjs
├── osascript-stub.sh          # Stand-in for the desktop notice binary
├── run-bot-child.ts
├── empty-body.md
├── manual.md
├── missing-id.md
├── missing-trigger.md
├── queued-event.md
├── scheduled-deep-review.md
└── unknown-key.md
```

---

## 3. FILES

### Definition Inputs

| File | Responsibility |
|---|---|
| `manual.md` | A valid manual-trigger bot, `tidy-notes`. |
| `queued-event.md` | A valid queue-trigger bot with a `precheck` line. |
| `scheduled-deep-review.md` | A valid weekday cron bot with a `cli-opencode` runtime block and a budget. |
| `empty-body.md` | Frontmatter with no body, refused as `empty-body`. |
| `missing-id.md` | A definition with no `id`. |
| `missing-trigger.md` | A definition with no `trigger`. |
| `unknown-key.md` | A misspelled frontmatter key that must not pass silently. |

`definition.vitest.ts` is the suite that reads these files.

### Runner Scenarios

`runner-support.ts` exposes `bots/` as `FIXTURE_BOTS`. Each folder holds one BOT.md whose body carries `STUB:` directive lines the stub executor acts on.

| Folder | Scenario |
|---|---|
| `bots/manual-ok/` | A clean codex run bound to a spec folder. |
| `bots/claude-ok/` | A clean read-only run on the Claude Code kind. |
| `bots/claude-decision/` | A Claude Code run that parks a question. |
| `bots/needs-decision/` | A codex run that parks a question for the operator. |
| `bots/decide-empty/` | A run that emits an empty decision marker. |
| `bots/crash/` | A run whose executor exits with status 4. |
| `bots/failing-precheck/` | A precheck that exits nonzero, so nothing dispatches. |
| `bots/silent-precheck/` | A precheck that reports nothing to do. |
| `bots/over-budget/` | A run that sleeps past its duration budget. |
| `bots/stuck/` | A run that hangs past its one-second invocation timeout. |
| `bots/slow/` | A run that sleeps until the test sets its fast flag. |
| `bots/tamper/` | A run that tries to clear its switches and forge a needs-you item from inside the checkout. |
| `bots/weak-write/` | A write-capable posture on a kind with only an approval gate, refused before dispatch. |
| `bots/worktree-posture/` | A run in its own numbered worktree. |
| `bots/worktree-slow/` | A worktree run that edits slowly until told to hurry. |

### Channel Recordings

`channel-transports.vitest.ts` is the only suite that reads these files. It resolves them through `FIXTURES`, which joins the test folder with `fixtures` and `channels`. Each file holds one recorded reply or event body from a chat platform, so a test replays the provider's own bytes with no network call. Files are named `<platform>-<case>.json`.

| File prefix | What the files hold |
|---|---|
| `signal-` | Four files: the Server-Sent Events stream, a send result, a rate limit and an unregistered account. |
| `slack-` | Seven files: `auth.test`, `apps.connections.open`, Socket Mode frames, `chat.postMessage`, `channel_not_found`, `invalid_auth` and `ratelimited`. |
| `telegram-` | Ten files: `getMe`, `getUpdates` with and without updates, `sendMessage`, `answerCallbackQuery`, `deleteWebhook`, bad request, conflict, too many requests and unauthorized. |
| `whatsapp-` | Seven files: the Graph API send, a bad request, a rate limit and four webhook bodies for text, statuses, a failed status and another number. |

### Stand-ins and Drivers

| File | Responsibility |
|---|---|
| `stub-executor/codex` | Shell wrapper that runs `codex-stub.cjs`. The `claude`, `opencode` and `vibe` wrappers do the same for their own stubs. |
| `stub-executor/codex-stub.cjs` | Reads the prompt, writes a receipt under the temp HOME and acts on `STUB:` lines such as `exit`, `sleep`, `decide` and `tamper`. Its siblings `claude-stub.cjs`, `opencode-stub.cjs` and `vibe-stub.cjs` mimic each kind's output format. |
| `naming-stub/half-provisioned.sh` | Makes a tree folder, then reports a provisioning failure with exit 3. |
| `naming-stub/record-calls.sh` | Only logs that it was called, to prove a run never reached worktree creation. |
| `osascript-stub.sh` | Logs each argument to `OSASCRIPT_STUB_LOG` and exits with `OSASCRIPT_STUB_EXIT`, so no notice is shown. |
| `launchctl-intercept.cjs` | Loaded with `--require` into a bots CLI a test starts, so every `launchctl` call is answered and logged here. Used by `installer.vitest.ts` and `status.vitest.ts`. |
| `drain-race-driver.cjs` | One drain process for `race.vitest.ts`. It loads the runtime, signals ready and waits on a start file so two drains begin together. |
| `run-bot-child.ts` | Runs one bot through `runBot` in its own process so `isolation.vitest.ts` can hold two runs alive or kill one. |

---

## 4. VALIDATION

The fixtures have no check of their own. The suites that read them run from the repository root.

```bash
cd .skilled/skills/system-skilled-bots/runtime && npm test
```

Expected result: every suite passes and Vitest exits 0.

---

## 5. RELATED

- [Runtime tests](../README.md)
- [Runtime library](../../lib/README.md)
- [Checker fixtures](../../../scripts/fixtures/README.md)
