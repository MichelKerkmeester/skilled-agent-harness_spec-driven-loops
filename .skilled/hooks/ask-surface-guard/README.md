---
title: "Ask Surface Guard: Prose Option Menus Sent Back to the Question Tool"
description: "Finds prose option menus at the end of replies. Claude, DSH, OpenCode, Pi and Vibe send the turn back through the question tool when one is available. Codex and Devin print an advisory."
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

`ask-surface-guard/` finds replies that end with a prose option menu and sends them back through the runtime's question tool when one is available. Codex and Devin print an advisory instead, because neither runtime documents a Stop decision that sends the turn back.

The shared policy lives in `lib/ask-surface-core.cjs`. Adapters call it directly or through `lib/advisory-stop.cjs`. The core detects menus, decides whether to send a turn back, builds the reprompt and records fires.

The concern key is `ask-surface`. It differs from the folder name. Its switch is `SYSTEM_ASK_SURFACE_DISABLED` and the master switch is `SYSTEM_HOOKS_DISABLED`.

---

## 2. HOW IT WORKS

`detectProseMenu` removes fenced code, blockquotes, tables and headings before looking for options. It needs two or more sequential options that start at `A` or `1`. A nearby line must contain a question mark. Numbered menus also need wording that signals a choice.

`evaluateTurn` returns a verdict and a reason. It returns `pass` when the session has no question tool, the turn already called that tool or no menu closes the reply. Otherwise, it returns `fire`.

| Reason | Verdict | When |
|---|---|---|
| `no-surface` | pass | The adapter says this session has no question tool. |
| `tool-asked` | pass | The adapter saw the question tool in this turn. |
| `no-menu` | pass | No closing prose option menu was found. |
| `prose-menu` | fire | A closing menu was found and no earlier condition passed. |

`repromptFor` names the runtime's question tool and asks for one question with the options as its choices. It marks the recommendation first.

DSH, OpenCode, Pi and Vibe call `markTurn` to prevent repeated reprompts for one turn. Claude skips a repeat Stop event when `stop_hook_active` is true. Codex and Devin only print an advisory. Their Stop adapters never look for a question-tool call, so an advisory can still appear after one.

`recordFire` appends a JSON line to `.skilled/skills/.state/ask-surface/fires.jsonl`. A logging error does not throw.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `Stop` | `claude/ask-surface-stop.cjs` | `.skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs` | A block decision with the `AskUserQuestion` instruction. |
| Codex | `Stop` | `codex/ask-surface-stop.cjs` | `.skilled/hooks/ask-surface-guard/codex/ask-surface-stop.cjs` | One advisory line on stderr. The turn ends normally. |
| Cursor | None | None | None | No ask-surface entry. |
| Devin | `Stop` | `devin/ask-surface-stop.cjs` | `.skilled/hooks/ask-surface-guard/devin/ask-surface-stop.cjs` | One advisory line on stderr. The turn ends normally. |
| OpenCode | `session.idle` | `opencode/ask-surface-guard.js` | `.opencode/plugins/ask-surface-guard.js` | Starts a new turn with `session.promptAsync`. |
| Pi | `agent_end` | `pi/ask-surface-guard.ts` | `.skilled/hooks/ask-surface-guard/pi/ask-surface-guard.ts` | A hidden follow-up starts another turn. |
| DSH | `agent/turn-stopping` | `dsh/ask-surface-guard.mjs` | `.skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs` | Sends a user message with `agent.steer`. |
| Vibe | `post_agent` | `vibe/ask-surface-post-agent.mjs` | `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs` | Returns a deny reason that Vibe injects as a retry message. |

The registry id is `ask-surface-guard`. It binds Claude and Codex at `Stop` with 5-second timeouts. Devin uses `Stop` with the same timeout. Claude's entry is in `.claude/settings.json` and Codex's entry is in `.codex/hooks.json`. Devin's entry is in `.devin/hooks.v1.json`. Cursor's `.cursor/hooks.json` has no ask-surface entry.

The registry's Pi binding names `ask-surface-guard.ts`. `.pi/extensions/ask-surface-guard.ts` re-exports the adapter. The DSH bundle registers the guard in `.dsh/plugins/repo-guards/index.mjs`. OpenCode loads plugin modules from the flat `.opencode/plugins/` glob.

Vibe registers `turn-end` as a `post_agent` hook in `.vibe/hooks.toml`. It matches `main` and has a 20-second timeout. `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs` loads the ask-surface part.

Claude prints an error line to stderr and exits 0 if its main handler rejects. On a payload or read error, the advisory runner prints nothing and exits 0. DSH logs a warning when its handler catches an error. Pi catches handler errors and returns. OpenCode catches errors and leaves the session idle. Vibe's turn-end composer skips a part that throws.

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
+-- opencode/
|   `-- ask-surface-guard.js -> ../../../../.opencode/plugins/ask-surface-guard.js
+-- pi/
|   +-- ask-surface-guard.test.ts
|   `-- ask-surface-guard.ts
+-- tests/
|   `-- dsh-ask-surface-guard.test.mjs
`-- vibe/
    `-- ask-surface-post-agent.mjs
```

The OpenCode entry in this tree is a symlink to the plugin file listed in RUNTIME COVERAGE.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/ask-surface-core.cjs` | Detects closing menus, returns verdicts and builds reprompt text. |
| `lib/advisory-stop.cjs` | Runs the warning-only Stop behavior for Codex and Devin. |
| `../shared/hook-flags.cjs` | Resolves the concern switch and master switch. |
| `../../../.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Stores the Stop bindings and Pi extension entry. |
| `../../../.opencode/plugins/ask-surface-guard.js` | OpenCode plugin module loaded by its plugin folder. |
| `../../../.pi/extensions/ask-surface-guard.ts` | Pi entry that re-exports this folder's adapter. |
| `../../../.dsh/plugins/repo-guards/index.mjs` | DSH bundle that registers the guard. |
| `../../../.vibe/hooks.toml` | Vibe registration for the turn-end composer. |

---

## 6. CONFIGURATION

The guard is enabled by default. Set a switch to `1`, `true`, `yes` or `on` with any capitalization to turn it off.

| Switch | Concern key | Effect |
|---|---|---|
| `SYSTEM_ASK_SURFACE_DISABLED=1` | `ask-surface` | Turns off this guard. |
| `SYSTEM_HOOKS_DISABLED=1` | Every concern | Turns off repository-authored runtime hooks. |

The resolver also accepts values from `.skilled/hooks/hook-flags.env` when that file exists. A process environment value takes precedence.

---

## 7. VALIDATION

The Node suites cover core verdicts, advisory behavior, Claude Stop handling and DSH steering. They are `lib/ask-surface-core.test.mjs`, `lib/advisory-stop.test.mjs`, `claude/ask-surface-stop.test.mjs` and `tests/dsh-ask-surface-guard.test.mjs`.

The Pi suite is `pi/ask-surface-guard.test.ts` and uses Vitest. The OpenCode suite is `.opencode/plugins/tests/ask-surface-guard.test.cjs` and uses `node:test`.

Run the disabled-switch smoke check from the repository root.

```bash
SYSTEM_ASK_SURFACE_DISABLED=1 node .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs < /dev/null
```

Expected result: no output on either stream and exit status 0.

---

## 8. RELATED

- [Hooks index](../README.md): switch index and runtime coverage matrix.
- [Shared hook helpers](../shared/README.md): switch resolver and shared adapter helpers.
- [Hook registry](../../../.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json): Stop bindings and the Pi extension entry.
- [OpenCode plugin](../../../.opencode/plugins/ask-surface-guard.js): the plugin module loaded from OpenCode's plugin folder.
- [Pi extension entry](../../../.pi/extensions/ask-surface-guard.ts): re-exports the Pi adapter.
- [DSH plugin bundle](../../../.dsh/plugins/repo-guards/index.mjs): registers the DSH adapter.
- [Vibe hook settings](../../../.vibe/hooks.toml): registers the turn-end composer.
