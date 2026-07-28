---
title: Runtime Hooks - Entrypoint Authoring, Wiring, and Maintenance
description: OpenCode-surface reference for current runtime hook wiring, plugin-bridge delivery, dynamic entrypoint reachability, and maintenance rules for editing, adding, or removing hooks.
trigger_phrases:
  - "runtime hook authoring"
  - "hook entrypoints registration"
  - "dynamic load hook pattern"
  - "claude cursor opencode copilot hooks"
importance_tier: normal
contextType: implementation
version: 1.0.0.18
---

# Runtime Hooks - Entrypoint Authoring, Wiring, and Maintenance

Reference for the current runtime-hook surfaces in this workspace: checked-in Claude Code hook wiring, checked-in Cursor CLI/editor hook wiring, OpenCode plugin-bridge delivery, and GitHub/Copilot-adjacent hook wrappers. Keep this file aligned with the authoritative hook contract in `system-spec-kit/references/config/hook-system.md` and the live runtime wiring in `.claude/settings.json` / `.cursor/hooks.json`.

---

## 1. OVERVIEW

### Purpose

This reference documents the runtime-hook entrypoint pattern for OpenCode-family system code: how hook sources are registered, wired, and maintained. Some hook source files have no static `import` callers inside their server; runtime settings, plugin declarations, or wrapper files make them reachable. Static dead-code analyzers can see those entrypoints as unused; they are not.

### Core Principle

> **Hook entrypoints are runtime-loaded, not necessarily statically imported.** Their reachability lives in runtime settings, plugin bridge registrations, or checked-in wrapper files. Treat those registration surfaces as part of the contract.

### When to Use

- Editing an existing hook entrypoint and verifying its runtime wiring still resolves
- Adding a new hook to one or more runtimes
- Removing a hook (must update both source and runtime registration)
- Triaging a static analysis report flagging hook code as dead
- Reviewing parity across the four runtimes

### Key Sources (Evidence)

| Source | Path | Purpose |
|---|---|---|
| Hook system reference | `.opencode/skills/system-spec-kit/references/config/hook-system.md` | Runtime-specific hook system deep-dive |
| Hook helper inventory | `.opencode/skills/system-spec-kit/mcp-server/hooks/README.md` | Current hook helper tree; states OpenCode advice is delivered by plugin bridge |
| Claude settings | `.claude/settings.json` | Live checked-in Claude hook wiring |
| Cursor hooks | `.cursor/hooks.json` | Live checked-in Cursor CLI/editor hook wiring |
| Cursor hook contract | `.opencode/skills/cli-external-orchestration/cli-cursor/references/hook-contract.md` | Cursor-specific hook schema, discovery order, and event-delivery caveats |
| OpenCode skill-advisor plugin | `.opencode/plugins/mk-skill-advisor.js` | OpenCode prompt-time advisor plugin using `experimental.chat.system.transform` |
| OpenCode skill-advisor bridge | `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs` | Subprocess bridge from plugin to the advisor server |

---

## 2. DYNAMIC-LOAD PATTERN

### Why Hooks Look Dead

Static `import` analysis (e.g. `tsc --noUnusedLocals`, `ts-prune`, `knip`) walks import graphs, not runtime configuration. Runtime hooks and plugin bridges may be invoked by command strings or plugin host contracts instead of static imports. The current wiring lives in:

| Surface | Registration source | Wiring shape |
|---|---|---|
| Claude Code | `.claude/settings.json` | Nested `hooks.<Event>[].hooks[]` array; each entry has `type: "command"` + `command` string |
| Cursor CLI | `.cursor/hooks.json` (project scope; merges with `~/.cursor/hooks.json` user scope, shared with the Cursor editor) | Flat `hooks.<event>[]` array; each entry has `command`, `type: "command"`, `timeout`, and an optional `matcher` for tool-name-scoped routing |
| OpenCode | `.opencode/plugins/*.js` and user/workspace OpenCode runtime config | Plugin objects exposing `experimental.chat.system.transform`, `event`, and/or tools |
| GitHub/Copilot side | lifecycle scripts under `.github/hooks/scripts/` | Copilot session-priming scripts; no checked-in wrapper config |

KEEP hook sources unless the wiring is verifiably gone from every runtime registration surface.

### Reachability Rule

A hook source file is alive iff:
1. A live registration source references it directly or via its compiled artifact, AND
2. The referenced source, bridge, wrapper, or compiled artifact resolves in the current checkout.

Removing the source without removing the registration produces a runtime error. Removing the registration without removing the source produces an orphan that future audits will surface.

---

## 3. CLAUDE HOOKS

Claude Code hook wiring is checked in at `.claude/settings.json`. Use that file as the live wiring source for matchers, command strings, and timeouts.

| Event | Matcher | Command | Timeout | Purpose |
|---|---|---|---:|---|
| `PreToolUse` | `Bash` | `bash -c 'cd "${CLAUDE_PROJECT_DIR:-$PWD}" && node .opencode/hooks/dispatch/claude/dispatch-preflight-lint.mjs'` | 5 | Evaluates CLI dispatch `hard_rules` before `opencode run` / `claude -p` commands proceed. |
| `UserPromptSubmit` | empty string | `bash -c 'cd "${CLAUDE_PROJECT_DIR:-$PWD}" && node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/user-prompt-submit.js'` | 3 | Prompt-time Spec Kit advisor/context injection. |
| `PreCompact` | empty string | `bash -c 'cd "${CLAUDE_PROJECT_DIR:-$PWD}" && node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/compact-inject.js'` | 3 | Compaction payload preparation. |
| `SessionStart` | empty string | `bash -c 'cd "${CLAUDE_PROJECT_DIR:-$PWD}" && node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/session-prime.js'` | 3 | Startup context priming. |
| `SessionStart` | empty string | `bash -c 'cd "${CLAUDE_PROJECT_DIR:-$PWD}" && bash .opencode/bin/worktree-guard.sh'` | 3 | Workspace safety guard. |
| `Stop` | empty string | `bash -c 'cd "${CLAUDE_PROJECT_DIR:-$PWD}" && node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/session-stop.js ; stop_status=$? ; bash .opencode/scripts/session-cleanup.sh || true ; exit "$stop_status"'` | 10 | Session-stop accounting and cleanup; async. |
| `PostToolUse` | `Write|Edit` | `bash -c 'cd "${CLAUDE_PROJECT_DIR:-$PWD}" && python3 .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh'` | 10 | Warn-only comment-hygiene and dist-staleness checks after source edits. |

Helper modules (statically imported by the entrypoints, NOT directly wired): `claude-transcript.ts`, `hook-state.ts`, `shared.ts`.

### Wiring Shape

```jsonc
"UserPromptSubmit": [
  {
    "matcher": "",
    "hooks": [
      {
        "type": "command",
                "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR:-$PWD}\" && node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/user-prompt-submit.js'",
                "timeout": 3
      }
    ]
  }
]
```

The nested shape (`hooks.<Event>[].hooks[]`) is required. A flat shape with top-level `command` is rejected by Claude Code at session start with `Expected array, received undefined`.

---

## 4. CURSOR HOOKS

Cursor CLI hook wiring is checked in at `.cursor/hooks.json` (project scope). Unlike every sibling runtime, this file is **the exact same hooks.json the Cursor desktop editor reads** — project scope merges with (does not shadow) the pre-existing `~/.cursor/hooks.json` user scope, so registering a hook here also applies to any teammate opening this repo in the editor. Use `.cursor/hooks.json` as the live wiring source for matchers, command strings, and timeouts.

| Event | Matcher | Command | Timeout | Purpose |
|---|---|---:|---:|---|
| `sessionStart` | none | `node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/cursor/session-start.js` | 10 | Startup context priming (proxies to `session-prime.js`). |
| `sessionStart` | none | `node .opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` | 10 | Validates `MK_SPEC_FOLDER` or opens explicitly enabled Gate-3 state for an identifiable top-level session. |
| `sessionStart` | none | `bash .opencode/bin/worktree-guard.sh` | 10 | Workspace safety guard. |
| `sessionStart` | none | `bash .opencode/bin/check-git-hooks.sh` | 10 | Git-hooks-installed guard. |
| `sessionStart` | none | `python3 .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh --all` | 10 | Dist-staleness warning across every watched package. |
| `sessionStart` | none | `node .opencode/bin/install-codex-hooks.mjs --check` | 10 | Codex hook-drift warning. |
| `sessionEnd` | none | `node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/cursor/session-end.js` | 10 | Session-stop accounting (proxies to `session-stop.js`; Cursor's `stop` event never fires under the CLI, so `sessionEnd` is the confirmed substitute). |
| `sessionEnd` | none | `bash .opencode/scripts/session-cleanup.sh` | 10 | Session-scoped MCP-helper cleanup. |
| `preToolUse` | none | `node .opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs` | 10 | Evaluates the shared spec-gate mutation policy before every tool call (`Shell`/`Write`). |
| `preToolUse` | `Task` | `node .opencode/hooks/task-dispatch/cursor/task-dispatch-guard.mjs` | 10 | Deep-loop dispatch policy for a delegated subagent (`Task`) tool call; fires alongside the unmatched entry above, not instead of it. |
| `postToolUse` | none | `node .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs` | 10 | Chains `Write`/`Shell` tool calls into the Claude post-edit-quality, code-graph-freshness, and CLI-dispatch-audit hooks. |
| `beforeSubmitPrompt` | none | `node .opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-classify.mjs` | 10 | Advisory Gate-3 classification. Registered for parity; confirmed dormant under the installed CLI build (event never fires). |
| `beforeSubmitPrompt` | none | `node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/cursor/user-prompt-submit.js` | 10 | Prompt-time skill-advisor brief. Registered for parity; confirmed dormant alongside the classify hook above. |
| `beforeMCPExecution` | none | `node .opencode/hooks/mcp-route-guard/cursor/mcp-route-guard.mjs` | 10 | Advises routing an external MCP call through Code Mode. Recombines Cursor's split `mcp_server_name` + bare `tool_name` into the packed shape the shared core parses (see the split-shape caveat below). |
| `preCompact` | none | `node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/cursor/precompact.js` | 10 | Compaction payload pre-caching (proxies to `compact-inject.js`). Registered for parity; delivery unconfirmed and untestable in isolation (no CLI-reachable compaction trigger exists). |

Helper module (statically imported by every entrypoint, NOT directly wired): `shared.ts` — the Cursor-to-Claude payload bridge (`readCursorHookInput`, `toClaudeShape`, `runClaudeHookAdapter`, `emitCursorResponse`).

### Wiring Shape

```jsonc
"preToolUse": [
  {
    "command": "node .opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs",
    "type": "command",
    "timeout": 10
  },
  {
    "command": "node .opencode/hooks/task-dispatch/cursor/task-dispatch-guard.mjs",
    "type": "command",
    "matcher": "Task",
    "timeout": 10
  }
]
```

The flat shape (`hooks.<event>[]`, each entry optionally carrying `matcher`) is Cursor's own schema — distinct from Claude's nested `hooks.<Event>[].hooks[]` shape above. A `matcher`-scoped entry fires alongside an unmatched entry for the same event, not instead of it (confirmed live: a `Task` tool call fires both the unmatched `spec-gate-enforce.mjs` entry and the `matcher: "Task"` entry).

### Startup Prebinding Boundary

`spec-gate-prebind.mjs` compensates only for Cursor CLI's missing prompt-classification delivery. It writes no state for disabled sessions, dispatched children, malformed input, or missing session identity; enforcement remains off unless `MK_SPEC_GATE_ENFORCE=1` is explicitly present.

### MCP Config And The Split-Shape Caveat

`.cursor/mcp.json` is a symlink to the repo's own `.mcp.json`. Cursor's documented MCP schema is byte-compatible with Claude's (`mcpServers` / `command` string / `args` array / `env` object), so one file serves both. `opencode.json` cannot participate — its schema differs (`mcp` key, `command` as an array, `environment` rather than `env`).

Cursor's MCP hook payloads split the server and tool across **two** fields — `mcp_server_name: "sequential_thinking"` alongside a BARE `tool_name: "sequentialthinking"` — where Claude packs both into one `mcp__<server>__<tool>` string. The shared `mcp-route-guard` core parses only the packed forms, so a Cursor adapter MUST recombine the two fields before forwarding; passing the bare tool name through matches nothing and the guard silently never advises. Confirmed by testing the core directly: `mcp__figma__get_screenshot` and `figma_get_screenshot` both advise, bare `get_screenshot` does not. `afterMCPExecution` also fires (adding `result_json` + `duration`) but has no Claude-side counterpart to proxy to, so nothing is wired for it.

### Discovery Mirror — `.cursor/hooks/`

`.cursor/hooks/` holds a symlink to every file `.cursor/hooks.json` invokes, purely so the scripts are visible at Cursor's own documented conventional path (`.cursor/hooks/<script>`). `.cursor/hooks.json`'s `command` fields still point at the real paths above, not these symlinks — confirmed by direct testing, invoking `session-start.js`/`session-end.js`/`user-prompt-submit.js`/`precompact.js` through the symlink produces **zero output**, because each compiles from a `.ts` source ending in `runCursorHook(import.meta.url, main)`, whose entrypoint guard compares `process.argv[1]` (stays the symlink path) against the ESM-loader-resolved `import.meta.url` (resolves through the symlink to the real path) — they never match, so `main()` never runs. The plain `.mjs` files have no such guard and work through either path, but every `command` entry stays pointed at the real path for consistency. See `.cursor/hooks/README.md` for the full explanation.

---

## 5. OPENCODE HOOKS

The removed `system-spec-kit/mcp-server/hooks/opencode/` suite is not present in this checkout. Current OpenCode prompt-time advice is delivered by plugin bridge:

| Component | Path | Runtime surface |
|---|---|---|
| Skill advisor plugin | `.opencode/plugins/mk-skill-advisor.js` | Exposes `experimental.chat.system.transform`, an `event` handler, and `spec_kit_skill_advisor_status`. |
| Skill advisor bridge | `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs` | Subprocess bridge from the plugin to `mk_skill_advisor`; stdin JSON in, single stdout JSON response out. |

`system-spec-kit/mcp-server/hooks/README.md` is explicit: OpenCode prompt-time advice is delivered by the OpenCode plugin and bridge, not by a subfolder in that directory. `hook-system.md` also describes OpenCode plugin-based transport through `.opencode/plugins/mk-skill-advisor.js`, `.opencode/plugins/mk-spec-memory.js`, `.opencode/plugins/mk-code-graph.js`, and `.opencode/plugins/mk-goal.js`.

Deprecated/stale references to `system-spec-kit/mcp-server/hooks/opencode/*` should be treated as legacy documentation until the authoritative hook contract names a new migration path. The current advisor bridge path is `system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`.

---

## 6. GITHUB / COPILOT SIDE

The removed `system-spec-kit/mcp-server/hooks/copilot/` suite is not present in this checkout. There is no longer a checked-in Copilot bridge wrapper; the `.github/hooks/scripts/` lifecycle scripts remain and run the spec-kit Copilot session-priming.

Do not copy the Claude nested hook block into GitHub/Copilot-facing files. `hook-system.md` describes Copilot freshness as NEXT-PROMPT: the current prompt sees the prior turn's refreshed instructions or wrapper output.

---

## 7. MAINTENANCE CHECKLIST

### Editing an Existing Hook

```
□ Read the source file before editing
□ Verify the registered command, plugin bridge, or wrapper path still resolves
□ Run the per-runtime smoke test from `references/hooks/skill-advisor-hook.md §4`
□ Confirm fail-open behavior: errors must return `{}` or empty `additionalContext`, never throw to the runtime
□ If TypeScript sources feed compiled runtime entrypoints, rebuild the owning package so dist-freshness checks do not report stale output
```

### Adding a Hook

```
□ Author the source under the owning hook, plugin, bridge, or wrapper directory
□ Register the wiring entry in the matching runtime registration surface
□ Build to confirm any required dist artifact emits
□ Smoke-test with the runtime's documented invocation form (advisor hook ref §4 has examples)
□ Consider parity: if the feature applies to other runtimes, register there too (see §7)
```

### Removing a Hook

```
□ Delete the source file under the owning hook, plugin, bridge, or wrapper directory
□ Delete the wiring entry from the matching runtime registration surface
□ Rebuild to remove the stale dist artifact
□ Verify no other hook helper imports the deleted module
□ If skipping either step: future dead-code audits will surface the orphan
```

### Cross-Runtime Parity

Hooks are RUNTIME-SPECIFIC. Adding `compact-inject` to Claude does NOT auto-add it to OpenCode or GitHub/Copilot-facing wrappers. Each runtime has different events and transport rules. Parity decisions are explicit:

| Question | Action |
|---|---|
| Does the feature need session-start priming? | Add to the runtime's startup/session surface; for Claude this is `SessionStart` in `.claude/settings.json`, for Cursor this is `sessionStart` in `.cursor/hooks.json`. |
| Does the feature run per-prompt? | Add to the runtime's prompt surface; for OpenCode advisor context this is the plugin bridge, for Cursor this is `beforeSubmitPrompt` (confirmed dormant under the current CLI build — register for parity, do not assume delivery). |
| Does the feature run on compaction? | Map runtime-specific event names; for Claude this is `PreCompact` in `.claude/settings.json`, for Cursor this is `preCompact` in `.cursor/hooks.json` (also unconfirmed/untestable in isolation). |
| Does the feature need per-tool routing? | Only Cursor's schema supports a `matcher` field for a SECOND entry on the same event (e.g. `preToolUse` + `matcher: "Task"`) that fires alongside, not instead of, an unmatched entry; Claude achieves the same via its own nested `matcher` field per event. |

---

## 8. RELATED RESOURCES

### Canonical Evidence

- Current helper inventory: `system-spec-kit/mcp-server/hooks/README.md`
- Current hook contract: `system-spec-kit/references/config/hook-system.md`
- Live Claude wiring: `.claude/settings.json`
- OpenCode advisor plugin bridge: `.opencode/plugins/mk-skill-advisor.js` -> `system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`

### Runtime-Specific Deep-Dives (do not duplicate)

- Skill Advisor hook contract + smoke tests: `system-spec-kit/references/hooks/skill-advisor-hook.md`
- Skill Advisor hook validation procedures: `system-spec-kit/references/hooks/skill-advisor-hook-validation.md`
- Runtime hook system internals: `system-spec-kit/references/config/hook-system.md`

### Settings Files (wiring source-of-truth)

- `.claude/settings.json`
- OpenCode plugin files under `.opencode/plugins/`

### Framework Context

- `CLAUDE.md` §"Session Start & Recovery" notes hook-capable runtimes auto-inject startup context; this reference is the implementation-side complement.
