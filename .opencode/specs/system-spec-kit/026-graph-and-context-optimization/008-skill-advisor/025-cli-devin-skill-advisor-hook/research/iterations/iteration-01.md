# Iteration 01: Devin UserPromptSubmit Context-Injection Empirical Contract

## Question

Does `hookSpecificOutput.additionalContext` (Claude's context-injection field) actually inject content into Devin's model context, or does it silently no-op?

## Investigation Steps

1. **Read Devin hook documentation**: Fetched <https://cli.devin.ai/docs/extensibility/hooks/overview> and <https://cli.devin.ai/docs/extensibility/hooks/lifecycle-hooks.md>
2. **Read Claude hook implementation**: Examined `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` to understand the expected output format
3. **Checked existing Devin configuration**: Read `.devin/config.json` and `.claude/settings.local.json`
4. **Attempted empirical test**: BLOCKED by self-invocation constraint (cannot run `devin` recursively from within Devin)

## Findings

### Finding 1: Devin Documentation is Silent on `additionalContext`

The Devin lifecycle hooks documentation (<https://cli.devin.ai/docs/extensibility/hooks/lifecycle-hooks.md>) documents:
- Input: JSON on stdin with event-specific fields (e.g., `prompt` for UserPromptSubmit)
- Output: JSON on stdout with `decision` and `reason` fields for decision events (PreToolUse, PermissionRequest, Stop)

**CRITICAL**: The docs do NOT mention `hookSpecificOutput.additionalContext` for context injection at all. For UserPromptSubmit, the docs show only the input format but no documented output format beyond decision events.

**Evidence**: <https://cli.devin.ai/docs/extensibility/hooks/lifecycle-hooks.md> - No mention of `hookSpecificOutput` or `additionalContext` in the entire document.

### Finding 2: Claude Hook Implementation Uses `additionalContext`

The existing Claude hook implementation (`.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:37-42,186-191`) returns:

```typescript
{
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit',
    additionalContext: brief,
  },
}
```

This is the canonical context-injection pattern for Claude Code.

**Evidence**: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts" lines="37-42" /> and <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts" lines="186-191" />

### Finding 3: Devin Claims Claude Code Compatibility

The Devin overview docs state: "Devin for Terminal uses a hook format that is **compatible with [Claude Code hooks][45]**. If you already have hooks configured for Claude Code, they will work with Devin for Terminal automatically."

**Evidence**: <https://cli.devin.ai/docs/extensibility/hooks/overview> - Section "What Can Hooks Do?" → "Add context"

### Finding 4: Devin Imports from Claude Config by Default

The `read_config_from` documentation shows that `read_config_from.claude` defaults to `true`, meaning Devin automatically imports:
- Rules from `CLAUDE.md`
- Skills from `.claude/skills/**/SKILL.md`
- MCP servers from `.claude/settings.json`, `.claude/settings.local.json`, etc.

**Evidence**: <https://cli.devin.ai/docs/reference/configuration/read-config-from.md> - Claude Code section shows hooks are NOT explicitly listed as imported (only rules, skills, commands, MCP servers are listed).

### Finding 5: Advisor Hook IS Registered in Claude Config

The advisor hook IS registered in `.claude/settings.local.json:31-43`:

```json
"UserPromptSubmit": [
  {
    "matcher": "",
    "hooks": [
      {
        "type": "command",
        "command": "bash -c 'cd \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public\" && /opt/homebrew/bin/node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js'",
        "timeout": 3
      }
    ]
  }
]
```

**Evidence**: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.claude/settings.local.json" lines="31-43" />

### Finding 6: No Explicit Devin Hooks Registered

`.devin/config.json` contains only MCP server registrations; no `hooks` key exists. There is no `.devin/hooks.v1.json` file.

**Evidence**: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.devin/config.json" /> - No hooks section; `ls -la .devin` shows no hooks.v1.json.

### Finding 7: Empirical Test BLOCKED by Self-Invocation Constraint

The original research plan called for writing a test hook script and running `devin --config` to empirically verify context injection. However, the constraint "Self-invocation: forbidden. You are running INSIDE Devin. Do NOT dispatch cli-devin, do NOT execute `devin` recursively." prevents this empirical verification.

**Evidence**: Research constraints section states self-invocation is forbidden per cli-devin SKILL.md §1.

## Confidence

**LOW** - The documentation claims compatibility but does not explicitly document the `additionalContext` field. Empirical verification is blocked by self-invocation constraints.

## Open Follow-Ups

1. **[UNCERTAIN]** Does Devin actually honor `hookSpecificOutput.additionalContext` when inheriting hooks from `.claude/settings.local.json`? This requires empirical testing outside the current session.
2. If Devin does NOT honor `additionalContext`, what is the alternative context-injection mechanism? (Return text on stdout? A different field name?)
3. Does the `read_config_from.claude` import include hooks, or only rules/skills/commands/MCP servers? The docs don't list hooks explicitly.

## Recommendation

Given the uncertainty and the self-invocation constraint, the safest approach for Phase B/C is:

**Option C (Inheritance)**: Rely on `read_config_from.claude=true` to inherit the existing Claude hook. This is zero new code and aligns with Devin's documented compatibility promise.

**Rationale**:
- Devin docs claim Claude Code compatibility
- The advisor hook is already registered in `.claude/settings.local.json`
- `read_config_from.claude=true` is the default
- If empirical testing later shows this doesn't work, we can add an explicit Devin variant at that time

**Fallback**: If Phase C implementation reveals that the inherited hook doesn't inject context, then add an explicit Devin variant at `.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts` and register it in `.devin/hooks.v1.json`.

## Actionable

**YES** - This finding directly informs Q2 (source location decision) and Q3 (registration shape). If inheritance works, we may not need a Devin variant at all.

## Category

devin-contract
