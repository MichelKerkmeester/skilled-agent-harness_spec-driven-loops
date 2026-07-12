---
title: Runtime Hooks - Entrypoint Authoring, Wiring, and Maintenance
description: OpenCode-surface reference for current runtime hook wiring, plugin-bridge delivery, dynamic entrypoint reachability, and maintenance rules for editing, adding, or removing hooks.
trigger_phrases:
  - "runtime hook authoring"
  - "hook entrypoints registration"
  - "dynamic load hook pattern"
  - "claude opencode copilot hooks"
importance_tier: normal
contextType: implementation
version: 1.0.0.14
---

# Runtime Hooks - Entrypoint Authoring, Wiring, and Maintenance

Reference for the current runtime-hook surfaces in this workspace: checked-in Claude Code hook wiring, OpenCode plugin-bridge delivery, and GitHub/Copilot-adjacent hook wrappers. Keep this file aligned with the authoritative hook contract in `system-spec-kit/references/config/hook_system.md` and the live runtime wiring in `.claude/settings.json`.

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
- Reviewing parity across the three runtimes

### Key Sources (Evidence)

| Source | Path | Purpose |
|---|---|---|
| Hook system reference | `.opencode/skills/system-spec-kit/references/config/hook_system.md` | Runtime-specific hook system deep-dive |
| Hook helper inventory | `.opencode/skills/system-spec-kit/mcp_server/hooks/README.md` | Current hook helper tree; states OpenCode advice is delivered by plugin bridge |
| Claude settings | `.claude/settings.json` | Live checked-in Claude hook wiring |
| OpenCode skill-advisor plugin | `.opencode/plugins/mk-skill-advisor.js` | OpenCode prompt-time advisor plugin using `experimental.chat.system.transform` |
| OpenCode skill-advisor bridge | `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` | Subprocess bridge from plugin to the advisor server |

---

## 2. DYNAMIC-LOAD PATTERN

### Why Hooks Look Dead

Static `import` analysis (e.g. `tsc --noUnusedLocals`, `ts-prune`, `knip`) walks import graphs, not runtime configuration. Runtime hooks and plugin bridges may be invoked by command strings or plugin host contracts instead of static imports. The current wiring lives in:

| Surface | Registration source | Wiring shape |
|---|---|---|
| Claude Code | `.claude/settings.json` | Nested `hooks.<Event>[].hooks[]` array; each entry has `type: "command"` + `command` string |
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
| `PreToolUse` | `Bash` | `bash -c 'cd "${CLAUDE_PROJECT_DIR:-$PWD}" && node .opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs'` | 5 | Evaluates CLI dispatch `hard_rules` before `opencode run` / `claude -p` commands proceed. |
| `UserPromptSubmit` | empty string | `bash -c 'cd "${CLAUDE_PROJECT_DIR:-$PWD}" && node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js'` | 3 | Prompt-time Spec Kit advisor/context injection. |
| `PreCompact` | empty string | `bash -c 'cd "${CLAUDE_PROJECT_DIR:-$PWD}" && node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/compact-inject.js'` | 3 | Compaction payload preparation. |
| `SessionStart` | empty string | `bash -c 'cd "${CLAUDE_PROJECT_DIR:-$PWD}" && node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js'` | 3 | Startup context priming. |
| `SessionStart` | empty string | `bash -c 'cd "${CLAUDE_PROJECT_DIR:-$PWD}" && bash .opencode/bin/worktree-guard.sh'` | 3 | Workspace safety guard. |
| `Stop` | empty string | `bash -c 'cd "${CLAUDE_PROJECT_DIR:-$PWD}" && node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js ; stop_status=$? ; bash .opencode/scripts/session-cleanup.sh || true ; exit "$stop_status"'` | 10 | Session-stop accounting and cleanup; async. |
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
                "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR:-$PWD}\" && node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js'",
                "timeout": 3
      }
    ]
  }
]
```

The nested shape (`hooks.<Event>[].hooks[]`) is required. A flat shape with top-level `command` is rejected by Claude Code at session start with `Expected array, received undefined`.

---

## 4. OPENCODE HOOKS

The removed `system-spec-kit/mcp_server/hooks/opencode/` suite is not present in this checkout. Current OpenCode prompt-time advice is delivered by plugin bridge:

| Component | Path | Runtime surface |
|---|---|---|
| Skill advisor plugin | `.opencode/plugins/mk-skill-advisor.js` | Exposes `experimental.chat.system.transform`, an `event` handler, and `spec_kit_skill_advisor_status`. |
| Skill advisor bridge | `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` | Subprocess bridge from the plugin to `mk_skill_advisor`; stdin JSON in, single stdout JSON response out. |

`system-spec-kit/mcp_server/hooks/README.md` is explicit: OpenCode prompt-time advice is delivered by the OpenCode plugin and bridge, not by a subfolder in that directory. `hook_system.md` also describes OpenCode plugin-based transport through `.opencode/plugins/mk-skill-advisor.js`, `.opencode/plugins/mk-spec-memory.js`, `.opencode/plugins/mk-code-graph.js`, and `.opencode/plugins/mk-goal.js`.

Deprecated/stale references to `system-spec-kit/mcp_server/hooks/opencode/*` should be treated as legacy documentation until the authoritative hook contract names a new migration path. The current advisor bridge path is `system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`.

---

## 5. GITHUB / COPILOT SIDE

The removed `system-spec-kit/mcp_server/hooks/copilot/` suite is not present in this checkout. There is no longer a checked-in Copilot bridge wrapper; the `.github/hooks/scripts/` lifecycle scripts remain and run the spec-kit Copilot session-priming.

Do not copy the Claude nested hook block into GitHub/Copilot-facing files. `hook_system.md` describes Copilot freshness as NEXT-PROMPT: the current prompt sees the prior turn's refreshed instructions or wrapper output.

---

## 6. MAINTENANCE CHECKLIST

### Editing an Existing Hook

```
□ Read the source file before editing
□ Verify the registered command, plugin bridge, or wrapper path still resolves
□ Run the per-runtime smoke test from `references/hooks/skill_advisor_hook.md §4`
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
| Does the feature need session-start priming? | Add to the runtime's startup/session surface; for Claude this is `SessionStart` in `.claude/settings.json`. |
| Does the feature run per-prompt? | Add to the runtime's prompt surface; for OpenCode advisor context this is the plugin bridge. |
| Does the feature run on compaction? | Map runtime-specific event names; for Claude this is `PreCompact` in `.claude/settings.json`. |

---

## 7. RELATED RESOURCES

### Canonical Evidence

- Current helper inventory: `system-spec-kit/mcp_server/hooks/README.md`
- Current hook contract: `system-spec-kit/references/config/hook_system.md`
- Live Claude wiring: `.claude/settings.json`
- OpenCode advisor plugin bridge: `.opencode/plugins/mk-skill-advisor.js` -> `system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`

### Runtime-Specific Deep-Dives (do not duplicate)

- Skill Advisor hook contract + smoke tests: `system-spec-kit/references/hooks/skill_advisor_hook.md`
- Skill Advisor hook validation procedures: `system-spec-kit/references/hooks/skill_advisor_hook_validation.md`
- Runtime hook system internals: `system-spec-kit/references/config/hook_system.md`

### Settings Files (wiring source-of-truth)

- `.claude/settings.json`
- OpenCode plugin files under `.opencode/plugins/`

### Framework Context

- `CLAUDE.md` §"Session Start & Recovery" notes hook-capable runtimes auto-inject startup context; this reference is the implementation-side complement.
