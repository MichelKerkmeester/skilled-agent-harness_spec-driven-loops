# Iteration 01: Devin SessionStart Context-Injection Empirical Contract

## Question

Does `hookSpecificOutput.additionalContext` (Claude's context-injection field) actually inject content into Devin's model context for SessionStart events, or does it silently no-op?

## Investigation Steps

1. **Read Devin hook documentation**: Fetched <https://cli.devin.ai/docs/extensibility/hooks/overview> and <https://cli.devin.ai/docs/extensibility/hooks/lifecycle-hooks>
2. **Read Claude hook implementation**: Examined `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` to understand the expected output format
3. **Read Claude Code hooks reference**: Fetched <https://docs.anthropic.com/en/docs/claude-code/hooks> to verify the canonical `additionalContext` contract
4. **Checked existing Devin configuration**: Read `.devin/config.json` and `.claude/settings.local.json`
5. **Reviewed parallel advisor research**: Examined `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/025-cli-devin-skill-advisor-hook/research/iterations/iteration-01.md` for comparative findings
6. **Attempted empirical test**: BLOCKED by self-invocation constraint (cannot run `devin` recursively from within Devin)

## Findings

### Finding 1: Devin Documentation is Silent on `additionalContext`

The Devin lifecycle hooks documentation (<https://cli.devin.ai/docs/extensibility/hooks/lifecycle-hooks>) documents:
- Input: JSON on stdin with event-specific fields (e.g., `source` for SessionStart)
- Output: JSON on stdout with `decision` and `reason` fields for decision events (PreToolUse, PermissionRequest, Stop)

**CRITICAL**: The docs do NOT mention `hookSpecificOutput.additionalContext` for context injection at all. For SessionStart, the docs show only the input format (`source` field) but no documented output format beyond decision events.

**Evidence**: Devin lifecycle hooks docs lines 352-378 document SessionStart with only `source` input field; no `additionalContext` output field is mentioned anywhere in the document.

### Finding 2: Claude Code DOES Document `additionalContext` for SessionStart

The Claude Code hooks reference explicitly documents `hookSpecificOutput.additionalContext` for context injection:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "This file is generated. Edit src/schema.ts and run `bun generate` instead."
  }
}
```

The documentation states (lines 1358-1362):
- SessionStart, Setup, and SubagentStart: at the start of the conversation, before the first prompt
- UserPromptSubmit and UserPromptExpansion: alongside the submitted prompt
- PreToolUse, PostToolUse, PostToolUseFailure, and PostToolBatch: next to the tool result

**Evidence**: Claude Code hooks reference lines 1342-1362 document the `additionalContext` contract explicitly for SessionStart.

### Finding 3: Claude SessionStart Hook Uses Plain Text Output (Not JSON)

The existing Claude SessionStart hook (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`) does NOT use `hookSpecificOutput.additionalContext`. Instead, it uses plain text markdown output via `formatHookOutput`:

```typescript
// Line 59-64 in shared.ts
export function formatHookOutput(sections: OutputSection[]): string {
  return sections
    .filter(s => s.content.trim().length > 0)
    .map(s => `## ${s.title}\n${s.content}`)
    .join('\n\n');
}

// Line 377-382 in session-prime.ts
const output = truncateToTokenBudget(formatHookOutput(sections), adjustedBudget);
await writeHookOutput(output);
```

The hook writes markdown sections directly to stdout (e.g., `## Session Context\n...`, `## Structural Context\n...`), not JSON with `hookSpecificOutput`.

**Evidence**: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/hooks/claude/shared.ts" lines="59-64" /> and <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts" lines="377-382" />

### Finding 4: Devin Claims Claude Code Compatibility

The Devin overview docs state: "Devin for Terminal uses a hook format that is **compatible with [Claude Code hooks][45]**. If you already have hooks configured for Claude Code, they will work with Devin for Terminal automatically."

The docs also state hooks can "add context" and "inject additional instructions or information when specific tools are called."

**Evidence**: Devin hooks overview lines 136-139 claim compatibility; lines 149-151 state hooks can add context.

### Finding 5: Devin Imports from Claude Config by Default

The Devin hooks documentation shows that Devin reads hooks from `.claude/settings.local.json` when `read_config_from.claude` is enabled (the default):

```
.claude/settings.local.json  | "hooks" key (Claude Code format)
Hooks from `.claude/` paths are loaded when `read_config_from.claude` is enabled (the default).
```

**Evidence**: Devin hooks overview lines 315-318 and 341-342.

### Finding 6: Code-Graph SessionStart Hook IS Registered in Claude Config

The code-graph SessionStart hook IS registered in `.claude/settings.local.json:56-67`:

```json
"SessionStart": [
  {
    "matcher": "",
    "hooks": [
      {
        "type": "command",
        "command": "bash -c 'cd \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public\" && /opt/homebrew/bin/node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js'",
        "timeout": 3
      }
    ]
  }
]
```

**Evidence**: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.claude/settings.local.json" lines="56-67" />

### Finding 7: No Explicit Devin Hooks Registered

`.devin/config.json` contains only MCP server registrations; no `hooks` key exists. There is no `.devin/hooks.v1.json` file.

**Evidence**: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.devin/config.json" /> - No hooks section; `ls -la .devin` shows no hooks.v1.json.

### Finding 8: Empirical Test BLOCKED by Self-Invocation Constraint

The original research plan called for writing a test hook script at `/tmp/devin-test-session-hook.sh` and running `devin --config` to empirically verify context injection by looking for a `TEST_MARKER_SS_XYZ` in the response. However, the constraint "Self-invocation: forbidden. You ARE Devin; do NOT dispatch cli-devin or devin recursively" prevents this empirical verification.

**Evidence**: Research constraints section states self-invocation is forbidden per cli-devin SKILL.md §1.

### Finding 9: Parallel Advisor Research Reached Same Conclusion

The advisor packet's iteration-01 (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/025-cli-devin-skill-advisor-hook/research/iterations/iteration-01.md`) investigated the identical question for UserPromptSubmit and reached the same findings:
- Devin docs are silent on `additionalContext`
- Claude hooks use it (or plain text for SessionStart)
- Devin claims compatibility
- Empirical test blocked by self-invocation
- Recommendation: rely on inheritance via `read_config_from.claude=true`

**Evidence**: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/025-cli-devin-skill-advisor-hook/research/iterations/iteration-01.md" />

## Confidence

**LOW** - The documentation claims compatibility but does not explicitly document the `additionalContext` field for Devin. The existing Claude SessionStart hook uses plain text output, not JSON `hookSpecificOutput`. Empirical verification is blocked by self-invocation constraints.

## Open Follow-Ups

1. **[UNCERTAIN]** Does Devin actually honor the Claude SessionStart hook's plain text markdown output when inheriting from `.claude/settings.local.json`? This requires empirical testing outside the current session.
2. If Devin does NOT honor plain text output, does it honor JSON `hookSpecificOutput.additionalContext` instead? (The Claude Code docs say this is the canonical way, but the existing hook doesn't use it.)
3. Does the `read_config_from.claude` import include hooks, or only rules/skills/commands/MCP servers? The docs list hooks as imported but the `read_config_from` reference doesn't list hooks explicitly.

## Recommendation

Given the uncertainty and the self-invocation constraint, the safest approach for Phase B/C is:

**Option C (Inheritance)**: Rely on `read_config_from.claude=true` to inherit the existing Claude SessionStart hook. This is zero new code and aligns with Devin's documented compatibility promise.

**Rationale**:
- Devin docs claim Claude Code compatibility
- The code-graph SessionStart hook is already registered in `.claude/settings.local.json`
- `read_config_from.claude=true` is the default
- The existing hook uses plain text markdown output, which Devin may honor as part of compatibility
- If empirical testing later shows this doesn't work, we can add an explicit Devin variant at that time

**Fallback**: If Phase C implementation reveals that the inherited hook doesn't inject context, then add an explicit Devin variant at `.opencode/skills/system-code-graph/hooks/devin/session-start.ts` (or the location decided in Q2/Q3) and register it in `.devin/hooks.v1.json`.

## Actionable

**YES** - This finding directly informs Q2 (hook source migration decision) and Q3 (Devin variant source location). If inheritance works, we may not need a Devin variant at all, which simplifies the migration decision in Q2.

## Category

devin-contract
