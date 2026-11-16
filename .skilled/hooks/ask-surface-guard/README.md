---
title: "Ask Surface Guard: Prose Option Menus Sent Back to the Question Tool"
description: "Sends a turn that ends in a prose option menu back once, so the agent asks through the runtime's question tool. Seven runtimes register it and Cursor does not."
trigger_phrases:
  - "ask surface guard"
  - "prose option menu"
  - "question tool enforcement"
  - "ask user question hook"
  - "stop hook option menu"
  - "ask-surface concern"
  - "prose menu detector"
importance_tier: "normal"
contextType: "reference"
---

# Ask Surface Guard: Prose Option Menus Sent Back to the Question Tool

---

## 1. OVERVIEW

This folder sends a turn that ends in a prose option menu back once. The agent then asks the same question through the runtime's question tool. The policy lives in `lib/ask-surface-core.cjs`, which every adapter imports. `lib/advisory-stop.cjs` is the warn-only runner that Codex and Devin share.

A prose option menu is a closing list of labelled choices. It reads `A) Fix the cause` or `1. Keep the provider` at the end of a reply. The guard treats that list as a question for the operator's question tool.

The concern key is `ask-surface`, which differs from the folder name. Its switch is `SYSTEM_ASK_SURFACE_DISABLED`, and the master switch is `SYSTEM_HOOKS_DISABLED`. Section 6 covers both switches and how to set them.

Claude, Codex, Devin, DSH, OpenCode, Pi and Vibe each register the guard. Cursor registers nothing, because `.cursor/hooks.json` names no ask-surface hook.

---

## 2. HOW IT WORKS

`evaluateTurn` returns a verdict and a reason for one finished turn. The table below lists the four reasons a turn can return.

| Reason | Verdict | When |
|---|---|---|
| `no-surface` | pass | The session has no question tool. |
| `tool-asked` | pass | The turn already called the question tool. |
| `no-menu` | pass | No prose option menu closes the message. |
| `prose-menu` | fire | A menu closes the message and no tool was called. |

Only DSH, Pi and Vibe pass `surfaceAvailable`, so only they can report `no-surface`.

`detectProseMenu` reads the last assistant message and looks for a closing menu. It first drops fenced code, inline code, blockquotes, tables and headings. Those shapes can hold option-shaped lines that are not a question.

A menu needs two or more labelled options in a closing run. The first label must be `A` or `1`, never a later letter. Each later label must follow the one before it in sequence. A question must sit within three lines above the first option or after the last.

Numbered lines can be steps rather than a list of choices. So a numeric menu also needs a question that signals a choice. `asksForNumericChoice` looks for words such as `which`, `pick` or `choose`.

`repromptFor` builds the text the adapter sends back to the agent. It names the runtime's question tool and asks for one question. The options become that question's choices, with the recommendation marked first.

| Runtime | Question tool |
|---|---|
| Claude | `AskUserQuestion` |
| Codex | `request_user_input` |
| Devin | `ask_user_question` |
| DSH | `ask_user_question` |
| OpenCode | `question` |
| Pi | `ask_user_question` or `question` |
| Vibe | `ask_user_question` |

`markTurn` writes a marker file before the adapter sends anything back. DSH, Pi, OpenCode and Vibe call it, so one operator message is sent back at most once. Claude, Codex and Devin skip a payload with `stop_hook_active` instead. The marker path is `<tmpdir>/ask-surface-guard/<projectHash>/<turnHash>`, keyed on the project and the turn. The first write returns true and a repeat returns false.

`recordFire` appends one JSON line per fire to `.skilled/skills/.state/ask-surface/fires.jsonl`. It never throws, so a guard cannot fail on its own log.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `Stop` | `claude/ask-surface-stop.cjs` | `.skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs` | The turn is sent back. |
| Codex | `Stop` | `codex/ask-surface-stop.cjs` | `.skilled/hooks/ask-surface-guard/codex/ask-surface-stop.cjs` | One advisory line on stderr. |
| Devin | `Stop` | `devin/ask-surface-stop.cjs` | `.skilled/hooks/ask-surface-guard/devin/ask-surface-stop.cjs` | One advisory line on stderr. |
| DSH | `agent/turn-stopping` | `dsh/ask-surface-guard.mjs` | `.skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs` | A steered user message. |
| Pi | `agent_end` | `pi/ask-surface-guard.ts` | `.skilled/hooks/ask-surface-guard/pi/ask-surface-guard.ts` | A hidden follow-up message. |
| Vibe | `post_agent` | `vibe/ask-surface-post-agent.mjs` | `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs` | A deny, injected as a retry. |
| OpenCode | `session.idle` | None | `.opencode/plugins/ask-surface-guard.js` | A new turn from `promptAsync`. |
| Cursor | None | None | None | Nothing. |

`.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` lists Claude, Codex and Devin at `Stop` with a 5-second timeout, plus the Pi extension. The entry id is `ask-surface-guard`.

Claude returns `{decision: "block"}` and Claude sends the turn back once. The adapter reads the transcript for the last typed prompt and the last assistant text. It skips sidechain entries and a turn already sent back once.

Codex and Devin only warn, because neither Stop documents a block. `lib/advisory-stop.cjs` writes the reprompt to stderr and never to stdout, so neither runtime reads a decision from it. Both skip the ask-tool scan, so a menu asked through the tool and repeated in prose still logs.

DSH registers `registerAskSurfaceGuard` from `.dsh/plugins/repo-guards/index.mjs`, which runs at plugin load. It listens on `agent/turn-stopping` and calls `agent.steer` with a user message. A headless profile, a lineage leaf or `AI_SESSION_CHILD=1` has no question tool, so it passes.

Pi registers through `.pi/extensions/ask-surface-guard.ts`, which re-exports `pi/ask-surface-guard.ts` unchanged. It listens on `agent_end` and sends a hidden follow-up with `triggerTurn`. Without a UI it passes, because neither Pi question tool can run.

OpenCode runs `.opencode/plugins/ask-surface-guard.js` on `session.idle`, once per operator message. It reads the last 20 messages and starts a new turn with `promptAsync`. It writes nothing to stdout or stderr, because either would overlay the TUI.

Vibe runs `vibe/ask-surface-post-agent.mjs` from the `turn-end` `post_agent` hook. That hook is `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs`, registered in `.vibe/hooks.toml`. The part returns a deny and Vibe injects the reason as a retry user message. Vibe passes a turn when `AI_SESSION_CHILD=1`, when there is a `parent_session_id` or when the tool catalog never names `ask_user_question`. Its hook runs with `match = "main"` and a 20-second timeout in `.vibe/hooks.toml`.

Each adapter fails open, and each does it its own way. Claude writes `ask-surface-stop: <message>` to stderr and exits 0. Codex and Devin swallow every error and exit 0 without a word. DSH logs a warning through `ctx.logger.warn` and leaves the turn alone. Pi catches inside the handler and returns, so the run ends as it would have. OpenCode catches the error and leaves the session idle as it was. Vibe returns null on a pass.

An error in the Vibe part is caught by the turn-end composer in `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs`, which skips the part. When an adapter cannot load, Claude and Codex print a drift line and a JSON message. Devin prints nothing.

---

## 4. DIRECTORY TREE

```text
ask-surface-guard/
+-- README.md
+-- claude/
|   +-- ask-surface-stop.cjs
|   `-- ask-surface-stop.test.mjs
+-- codex/
|   `-- ask-surface-stop.cjs
+-- devin/
|   `-- ask-surface-stop.cjs
+-- dsh/
|   `-- ask-surface-guard.mjs
+-- fixtures/
|   +-- blockquoted-menu.json
|   +-- code-block-menu.json
|   +-- howto-list-question.json
|   +-- no-surface-session.json
|   +-- numbered-steps.json
|   +-- prose-menu-bold.json
|   +-- prose-menu-dotted.json
|   +-- prose-menu-lettered.json
|   +-- prose-menu-numbered.json
|   +-- prose-menu-ten.json
|   +-- single-option.json
|   +-- summary-question.json
|   `-- tool-asked.json
+-- lib/
|   +-- advisory-stop.cjs
|   +-- advisory-stop.test.mjs
|   +-- ask-surface-core.cjs
|   `-- ask-surface-core.test.mjs
+-- pi/
|   +-- ask-surface-guard.test.ts
|   `-- ask-surface-guard.ts
+-- tests/
|   `-- dsh-ask-surface-guard.test.mjs
`-- vibe/
    `-- ask-surface-post-agent.mjs
```

`fixtures/` holds the JSON cases the tests read, one case per file. Each case carries a `lastMessage` and an `expected` verdict. `lib/ask-surface-core.test.mjs` walks that folder and runs every case it finds.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/ask-surface-core.cjs` | The policy. It detects a menu, decides the verdict, builds the reprompt, marks a turn and logs a fire. |
| `lib/advisory-stop.cjs` | The warn-only runner. It reads a `Stop` payload and writes the reprompt to stderr. |
| `claude/ask-surface-stop.cjs` | The Claude `Stop` adapter. It reads the transcript and returns a block decision. |
| `codex/ask-surface-stop.cjs` | The Codex entry. It calls the advisory runner with `codex`. |
| `devin/ask-surface-stop.cjs` | The Devin entry. It calls the advisory runner with `devin`. |
| `dsh/ask-surface-guard.mjs` | The DSH plugin. It registers on `agent/turn-stopping` and steers a message. |
| `pi/ask-surface-guard.ts` | The Pi extension. It registers on `agent_end` and sends a follow-up. |
| `vibe/ask-surface-post-agent.mjs` | The Vibe part. It returns a deny for the turn-end composer. |
| `fixtures/` | The JSON cases the tests read. |

---

## 6. CONFIGURATION

The guard is on by default, because `ask-surface` is not a default-off concern. A switch is on when its value is `1`, `true`, `yes` or `on`, in any case.

| Switch | Concern key | Effect |
|---|---|---|
| `SYSTEM_ASK_SURFACE_DISABLED=1` | `ask-surface` | Every adapter does nothing. |
| `SYSTEM_HOOKS_DISABLED=1` | Every concern | Turns off this guard and every other repository hook. |

DSH and Pi read the switch only at load, so set it before the session starts.

The concern key is `ask-surface`, which differs from the folder name. `concernFlag` builds the switch name from the key, so the switch is `SYSTEM_ASK_SURFACE_DISABLED`.

Set a switch inline for one command or export it for a session. To keep it, write it in `.skilled/hooks/hook-flags.env`, a gitignored copy of `.skilled/hooks/hook-flags.env.example`. The environment always wins over the file, so a session can override a saved default.

---

## 7. VALIDATION

Run every command below from the repository root.

```bash
node --test .skilled/hooks/ask-surface-guard/lib/ .skilled/hooks/ask-surface-guard/claude/ .skilled/hooks/ask-surface-guard/tests/
```

Expected result: every case passes and the command exits 0.

```bash
.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/ask-surface-guard/pi/ask-surface-guard.test.ts
```

Expected result: the Pi suite passes and the command exits 0.

```bash
node --test .opencode/plugins/tests/ask-surface-guard.test.cjs
```

Expected result: the OpenCode plugin suite passes and the command exits 0.

```bash
SYSTEM_ASK_SURFACE_DISABLED=1 node .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs < /dev/null; echo "exit: $?"
```

Expected result: `exit: 0` and no other output on either stream.

---

## 8. RELATED

- [`../README.md`](../README.md): the hooks tree, with the switch index and the coverage matrix.
- [`../shared/README.md`](../shared/README.md): the switch resolver every adapter calls before it runs.
- [`../session-lifecycle/README.md`](../session-lifecycle/README.md): the Vibe turn-end composer that runs the ask-surface part.
- [`../../../.opencode/plugins/ask-surface-guard.js`](../../../.opencode/plugins/ask-surface-guard.js): the OpenCode plugin that starts the new turn.
- [`../../../.pi/extensions/ask-surface-guard.ts`](../../../.pi/extensions/ask-surface-guard.ts): the Pi entry that re-exports the extension.
- [`../../../.dsh/plugins/repo-guards/index.mjs`](../../../.dsh/plugins/repo-guards/index.mjs): the DSH plugin that registers the guard.
- [`../../../.vibe/hooks.toml`](../../../.vibe/hooks.toml): the Vibe hook file that registers `turn-end`.
