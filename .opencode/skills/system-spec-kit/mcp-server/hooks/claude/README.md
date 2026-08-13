# Claude Code Hook Scripts


---

## 1. OVERVIEW

Hook scripts for Claude Code lifecycle events. These run as external Node.js processes triggered by Claude Code, not as MCP server modules.

---

## 2. SCRIPTS

| File | Hook Event | Behavior |
|------|-----------|----------|
| `compact-inject.ts` | PreCompact | Precomputes context from transcript, caches to hook state |
| `session-prime.ts` | SessionStart | Injects context via stdout based on source (compact/startup/resume/clear) |
| `user-prompt-submit.ts` | UserPromptSubmit | Thin process-boundary shim: spawns the compiled advisor hook at `system-skill-advisor/mcp-server/dist/hooks/claude/user-prompt-submit.js` and merges a warm code-graph status section into its `additionalContext` |
| `session-stop.ts` | Stop (async) | Parses transcript for token usage, stores snapshots |
| `completion-evidence-stop.cjs` | Stop (async) | Standalone completion-evidence sentinel, co-resident with `session-stop.ts` on the same Stop matcher; advises when a completion claim lacks packet evidence, never blocks |
| `claude-transcript.ts` | (library) | JSONL transcript parser, token counting, cost estimation |
| `true-citation-mining.ts` | (library) | Session-stop glue: mines the transcript for true-citation used/not-used pairs and persists them, flag-gated and fail-safe |
| `shared.ts` | (library) | Common utilities: stdin parsing, output formatting, timeout, logging |
| `hook-state.ts` | (library) | Per-session state management at temp directory |

---

## 3. LIFECYCLE FLOW

```
PreCompact → cache context → SessionStart(compact) → inject cached context
SessionStart(startup) → prime session with overview
SessionStart(resume) → load prior session state
Stop → parse transcript, save token snapshot
```

---

## 4. REGISTRATION

Hooks registered in `.claude/settings.local.json`. Compiled JS at `dist/hooks/claude/`.

Advisor registration snippet:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/user-prompt-submit.js'",
            "timeout": 3
          }
        ]
      }
    ]
  }
}
```

Set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` to skip the advisor path for the current process session.

---

## 5. SPEC-GATE (GATE-3) HOOKS

This folder also holds the Claude Code side of the Gate-3 spec-folder discipline. Both files call into `../lib/spec-gate/spec-gate-core.mjs` and never decide policy themselves. Every entrypoint fails open: a missing or invalid stdin payload always resolves to approve, so a bug here never blocks an unrelated turn. Unlike the lifecycle hooks above, these are direct-run `.mjs` files with no build step.

| File | Purpose |
|------|---------|
| `spec-gate-classify.mjs` | `UserPromptSubmit` hook. Runs `classifyIntent()` against each user turn, opens the session gate and surfaces the bounded Gate-3 question as `additionalContext`. Advisory only, no deny capability. |
| `spec-gate-enforce.mjs` | `PreToolUse` hook. Runs `evaluateMutation()` before a Write, Edit or Bash call. Write and Edit are deny-capable, Bash is advise-only. Logs every non-allow decision through `appendWarningLog()`. |
| `spec-gate-claude.test.mjs` | Co-located tests, run with `node --test`. |

`.claude/settings.json` wires `spec-gate-classify.mjs` to `UserPromptSubmit` and `spec-gate-enforce.mjs` to the `Write|Edit` and `Bash` `PreToolUse` matchers.

---

## 6. DESIGN PRINCIPLE

Hooks are transport reliability, not separate business logic. They call the same retrieval primitives (`memory_match_triggers`, `memory_context`) that other runtimes call explicitly.
For packet work, the operator-facing recovery surface remains `/speckit:resume`, with continuity rebuilt from `handover.md -> _memory.continuity -> spec docs`.

The prompt-time advisor contract lives at `../../../../system-skill-advisor/hooks/skill-advisor-hook.md`.
