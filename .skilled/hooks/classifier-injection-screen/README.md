---
title: 'Classifier Injection Screen: Advisory for Fetched Web Text'
description: 'Checks fetched web text and DSH MCP results for instructions aimed at an AI agent and adds an advisory in Claude, Devin, DSH, OpenCode, Pi and Vibe.'
trigger_phrases:
  - 'injection screen hook'
  - 'webfetch injection screen'
  - 'fetched text injection check'
  - 'opencode injection screen'
  - 'opencode webfetch screen'
  - 'injection screen plugin'
---

# Classifier Injection Screen: Advisory for Fetched Web Text

---

## 1. OVERVIEW

`classifier-injection-screen/` checks fetched web text for instructions aimed at an AI agent. DSH also screens accepted web and MCP results. A flagged section adds an advisory alongside the result. The hook never blocks a fetch.

Every adapter imports `lib/classifier-injection-advisory.mjs`. That core extracts the text and checks the Jev feature gate. It also formats the advisory. The core calls `lib/classifier-screen-fetched-text.mjs` to split and screen the text.

The concern key is `injection-screen`, while the folder name is `classifier-injection-screen`. Its hook switch is `SYSTEM_INJECTION_SCREEN_DISABLED`. `SYSTEM_HOOKS_DISABLED=1` is the master switch.

---

## 2. HOW IT WORKS

The screen uses the question and threshold in [the scorer](../../skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs). It splits Markdown at headings outside fenced code blocks. Sections shorter than five lines join a neighbor when one exists. Sections longer than 60 lines split into pieces of up to 60 lines. Pieces over 8,000 UTF-16 code units are sliced again.

Each scheduled section gets two parallel `noul` calls. If their scores fall on opposite sides of 0.6, the core starts a third call. A section is flagged when the mean of its required readable scores reaches 0.6.

The core screens at most 12 sections within a 20-second budget. It handles up to four sections at once. The total text limit is 96,000 UTF-16 code units. A failed or unreadable answer leaves its section unmeasured. Text past the total limit and pieces past the section cap stay unchecked.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `PostToolUse` on `WebFetch` | `claude/classifier-injection-screen-posttooluse.mjs` | `.skilled/hooks/classifier-injection-screen/claude/classifier-injection-screen-posttooluse.mjs` | One `hookSpecificOutput.additionalContext` advisory line. |
| Codex | None | None | None | No local adapter is registered. |
| Cursor | None | None | None | No local adapter is registered. |
| Devin | `PostToolUse` on `^webfetch$` | `devin/classifier-injection-screen-posttooluse.mjs` | `.skilled/hooks/classifier-injection-screen/devin/classifier-injection-screen-posttooluse.mjs` | One `hookSpecificOutput.additionalContext` advisory line. |
| OpenCode | `tool.execute.after` and `experimental.chat.system.transform` | `opencode/classifier-injection-screen.js` | `.opencode/plugins/classifier-injection-screen.js` | Adds the advisory to `output.system` on the next transform. |
| Pi | `tool_result` for `fetch_content` | `pi/classifier-injection-screen.ts` | `.skilled/hooks/classifier-injection-screen/pi/classifier-injection-screen.ts` | Appends one text block to the tool result. |
| DSH | `tools/post-execute` | `dsh/classifier-injection-screen.mjs` | `.skilled/hooks/classifier-injection-screen/dsh/classifier-injection-screen.mjs` | Adds a notice to `additionalContexts` on an accepted web or MCP result. |
| Vibe | `post_tool` for `web_fetch` and `open_url` | `vibe/classifier-injection-screen.mjs` | `.vibe/plugins/repo-guards/classifier-injection-screen.mjs` | Adds one `additional_context` advisory. |

Claude and Devin register in `.claude/settings.json` and `.devin/hooks.v1.json`. Both entries set a 30-second timeout. Codex and Cursor have no matching entry in `.codex/hooks.json` or `.cursor/hooks.json`.

The DSH adapter screens accepted `web_fetch` and `web_search` results. It also screens tool names that start with `mcp__`.

OpenCode discovers top-level plugins through the flat `.opencode/plugins/` glob. Pi loads `.pi/extensions/classifier-injection-screen.ts`, which re-exports the adapter. The DSH bundle entry `.dsh/plugins/repo-guards/index.mjs` registers its linked adapter. Vibe registers `classifier-injection-screen` in `.vibe/hooks.toml`.

Claude and Devin exit 0 with no output when the screen produces no advisory. OpenCode catches screen errors and writes no terminal output. Pi returns no replacement result after a screen error. DSH logs a warning through `ctx.logger.warn` and returns its accepted result. Vibe lets the call continue and writes a screen error to stderr.

---

## 4. DIRECTORY TREE

~~~text
classifier-injection-screen/
+-- README.md
+-- claude/    adapter and test
+-- devin/     adapter and test
+-- dsh/       adapter
+-- lib/       shared core and tests
+-- opencode/  link to .opencode/plugins/classifier-injection-screen.js
+-- pi/        extension and test
+-- tests/     DSH adapter test
`-- vibe/      link to .vibe/plugins/repo-guards/classifier-injection-screen.mjs
~~~

Runtime adapters sit in their own folders. The `opencode/` and `vibe/` folders each hold one symlink to the real file the runtime loads. Shared logic and its tests are in `lib/`. The DSH suite is in `tests/`.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/classifier-injection-advisory.mjs` | Extracts text and checks feature readiness. It formats the advisory. |
| `lib/classifier-screen-fetched-text.mjs` | Schedules section calls and applies the flag rule. |
| `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs` | Defines the screening question and threshold. It also sets section line bounds. |
| `.skilled/skills/cli-classifier/shared/scripts/jev-features.mjs` | Resolves Jev feature switches and checks CLI readiness. |
| `.skilled/hooks/shared/hook-flags.cjs` | Resolves the concern switch and master switch. |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Holds this concern's runtime registration records. |
| `.opencode/plugins/classifier-injection-screen.js` | Buffers OpenCode advisories and adds them on the next transform. |
| `.pi/extensions/classifier-injection-screen.ts` | Re-exports the Pi adapter for the runtime. |
| `.dsh/plugins/repo-guards/index.mjs` | Registers the DSH adapter in the repo-guards bundle. |
| `.vibe/hooks.toml` | Registers the Vibe hook and its tool match. |

---

## 6. CONFIGURATION

The hook is on by default. Jev screening runs only when `jev` is on PATH and its auth check succeeds.

| Switch | Concern key | Effect |
|---|---|---|
| `SYSTEM_INJECTION_SCREEN_DISABLED=1` | `injection-screen` | Turns off this concern in every covered runtime. |
| `SYSTEM_HOOKS_DISABLED=1` | Shared hooks | Turns off hooks that use the shared resolver. |
| `JEV_FEATURE_INJECTION_SCREEN=0` | `injection-screen` | Turns off Jev screening for this concern. |
| `JEV_FEATURES=0` | Jev features | Turns off every Jev feature. |

Hook switches turn the hook off when set to `1`, `true`, `yes` or `on`. Jev feature switches turn screening off at `0`, `false`, `no` or `off`. Both resolvers read the environment before `.skilled/hooks/hook-flags.env`. The environment wins for each switch.

---

## 7. VALIDATION

Run from the repository root.

~~~bash
node --test .skilled/hooks/classifier-injection-screen/lib/ .skilled/hooks/classifier-injection-screen/tests/ .opencode/plugins/tests/classifier-injection-screen.test.cjs
~~~

Expected result: every test passes and the command exits 0.

~~~bash
SYSTEM_INJECTION_SCREEN_DISABLED=1 node .skilled/hooks/classifier-injection-screen/claude/classifier-injection-screen-posttooluse.mjs < /dev/null
~~~

Expected result: no output on stdout or stderr and exit status 0.

---

## 8. RELATED

- [Hooks index](../README.md): concern folders and the runtime coverage matrix.
- [Shared hook switches](../shared/hook-flags.cjs): the canonical hook switch resolver.
- [Screening question](../../skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs): question and threshold source.
- Runtime entries: [OpenCode plugin](../../../.opencode/plugins/classifier-injection-screen.js), [Pi extension](../../../.pi/extensions/classifier-injection-screen.ts), [DSH bundle](../../../.dsh/plugins/repo-guards/index.mjs) and [Vibe hook](../../../.vibe/plugins/repo-guards/classifier-injection-screen.mjs).
