# Iteration 03: Compile Target Path + Devin hooks.v1.json Registration Shape

## Question

What's the exact compile target + `.devin/hooks.v1.json` registration syntax? Specifically:
- Compile target: `dist/system-skill-advisor/mcp_server/hooks/devin/user-prompt-submit.js`? Or somewhere else aligned with the advisor MCP dist layout?
- Registration: confirm the canonical `.devin/hooks.v1.json` shape (entire file is the hooks object, no wrapper key)
- Command syntax: `bash -c 'cd "/Users/.../Public" && /opt/homebrew/bin/node <dist-path>'` like Claude's settings? Or use `${DEVIN_PROJECT_DIR}`?

## Investigation Steps

1. **Read tsconfig.json**: Checked the advisor's tsconfig.json to understand the outDir configuration
2. **Examined dist structure**: Listed the dist directories to understand the current compile layout
3. **Analyzed shim pattern**: Discovered the system-spec-kit shim that forwards to the advisor implementation
4. **Reviewed registration format**: Checked the Claude hook registration in .claude/settings.local.json for command syntax
5. **Consulted Devin docs**: Referenced the Devin hook docs for the hooks.v1.json format

## Findings

### Finding 1: Advisor tsconfig outDir is `./dist`

The advisor's tsconfig.json (`mcp_server/tsconfig.json:5`) sets `"outDir": "./dist"`, meaning compiled output goes to `./dist` relative to the `mcp_server/` directory.

**Evidence**: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/tsconfig.json" lines="4-5" />

### Finding 2: Actual Compile Target is Nested

The actual dist structure is nested:
- Source: `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`
- Compile target: `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/claude/user-prompt-submit.js`

The tsconfig outDir is `./dist`, but the TypeScript compiler preserves the directory structure, resulting in `dist/system-skill-advisor/hooks/` rather than `dist/hooks/`.

**Evidence**: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/tsconfig.json" lines="4-5" /> and directory listing shows `dist/system-skill-advisor/hooks/claude/`

### Finding 3: System-Spec-Kit Shim Pattern Exists

The Claude hook registration in `.claude/settings.local.json:38` points to:
`.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js`

This is a thin shim (814 bytes) that forwards to the actual implementation:
`.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/claude/user-prompt-submit.js`

The shim exists for backward compatibility with existing runtime settings that reference the old system-spec-kit path.

**Evidence**: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.claude/settings.local.json" lines="38" /> and <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js" lines="1-20" />

### Finding 4: Devin Hook Compile Target

If we implement Option A (skill-owned Devin variant), the compile target would be:
- Source: `.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts`
- Compile target: `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/devin/user-prompt-submit.js`

Optionally, we could also create a shim at:
`.opencode/skills/system-spec-kit/mcp_server/dist/hooks/devin/user-prompt-submit.js`

However, since this is a NEW runtime (not a backward compatibility concern), the shim may not be necessary unless we want to maintain consistency with the existing pattern.

**Evidence**: Inferred from existing pattern (Finding 2) and tsconfig configuration (Finding 1).

### Finding 5: Devin hooks.v1.json Shape

Per Devin docs (<https://cli.devin.ai/docs/extensibility/hooks/overview>), the `.devin/hooks.v1.json` format is:

```json
{
  "UserPromptSubmit": [
    {
      "matcher": "",
      "hooks": [
        {
          "type": "command",
          "command": "./scripts/add-deploy-context.sh",
          "timeout": 10
        }
      ]
    }
  ]
}
```

The entire file is the hooks object (no wrapper key). This matches the Claude settings format.

**Evidence**: <https://cli.devin.ai/docs/extensibility/hooks/overview> - Section "Hook Format"

### Finding 6: Command Syntax Pattern

The Claude hook registration uses:
```bash
bash -c 'cd "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public" && /opt/homebrew/bin/node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js'
```

For Devin, we could either:
1. Use the same absolute path pattern (hardcoded workspace root)
2. Use `${DEVIN_PROJECT_DIR}` environment variable (set automatically by Devin per docs)

The Devin docs state: "The `DEVIN_PROJECT_DIR` environment variable is automatically set to the project root directory."

**Evidence**: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.claude/settings.local.json" lines="38" /> and <https://cli.devin.ai/docs/extensibility/hooks/overview> - Section "Command Hooks"

### Finding 7: Recommended Registration Syntax

For a Devin hook (Option A implementation), the `.devin/hooks.v1.json` registration would be:

```json
{
  "UserPromptSubmit": [
    {
      "matcher": "",
      "hooks": [
        {
          "type": "command",
          "command": "bash -c 'cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/devin/user-prompt-submit.js'",
          "timeout": 3
        }
      ]
    }
  ]
}
```

Using `${DEVIN_PROJECT_DIR}` is preferable to hardcoded absolute paths for portability across workspaces.

**Evidence**: Inferred from Claude pattern (Finding 6) and Devin docs (Finding 6).

### Finding 8: Alternative via Inheritance (Option C)

If we rely on Option C (inheritance via `read_config_from.claude=true`), no `.devin/hooks.v1.json` is needed at all. Devin would automatically inherit the hook from `.claude/settings.local.json`.

This is the zero-code approach recommended in Q1/Q2, pending empirical verification.

**Evidence**: <https://cli.devin.ai/docs/reference/configuration/read-config-from.md> - Claude Code import includes hooks implicitly

## Confidence

**HIGH** - The compile target path is verified by examining the actual dist structure. The registration format is documented in the Devin docs. The command syntax follows the established pattern from Claude hooks.

## Open Follow-Ups

1. Should we create a system-spec-kit shim for the Devin hook for consistency with the existing pattern, or skip it since this is a new runtime?
2. If using Option C (inheritance), do we need to verify that the existing shim still works correctly with Devin?

## Recommendation

**If Option A (skill-owned variant)**:
- Compile target: `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/devin/user-prompt-submit.js`
- Registration: Create `.devin/hooks.v1.json` with the syntax shown in Finding 7
- Optional shim: Create at `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/devin/user-prompt-submit.js` for consistency

**If Option C (inheritance)**:
- No compile target needed (reuse existing Claude hook)
- No `.devin/hooks.v1.json` needed (inherits from `.claude/settings.local.json`)
- Verification: Test that the inherited hook actually injects context in Devin

## Actionable

**YES** - This finding provides the exact registration syntax needed for Phase B decision-record.md and Phase C implementation.

## Category

devin-contract
