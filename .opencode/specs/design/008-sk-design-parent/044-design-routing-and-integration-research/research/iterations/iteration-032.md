# Iteration 32: D4-A1 Open Design MCP Tool-Boundary Gate

## Focus

[D4-A1 / D4] wired-MCP direct-tool bypass: whether Open Design's mutating MCP tools can be guarded by a PreToolUse matcher so the `sk-design` precondition is checked at the tool boundary, not only by prose in `mcp-open-design`.

## Actions Taken

1. Re-read the active strategy and the prior D3 telemetry/application-proof arc so this pass stayed on the Open Design transport boundary rather than re-covering hub routing, route telemetry, or loaded-versus-applied proof. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md:34] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md:194] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-031.md:147]
2. Re-read `mcp-open-design` and its tool-surface reference to anchor the exact precondition and mutating/destructive tool set. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:19] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:21] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:48] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:56]
3. Re-read the shared `sk-design` context/proof cards to identify what a boundary token should prove before Open Design mutation is allowed. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:71] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:70] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:68]
4. Re-read the checked-in Codex hook registration, policy file, PreToolUse implementation, and unit tests to verify whether non-Bash/MCP tools can currently be blocked. [SOURCE: .codex/settings.json:32] [SOURCE: .codex/settings.json:37] [SOURCE: .codex/policy.json:3] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:215] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/codex-pre-tool-use.vitest.ts:60]
5. Re-read the OpenCode plugin entrypoints to separate Codex PreToolUse enforcement from OpenCode prompt/status plugin surfaces. [SOURCE: .opencode/plugins/README.md:8] [SOURCE: .opencode/plugins/README.md:44] [SOURCE: .opencode/plugins/mk-skill-advisor.js:710] [SOURCE: .opencode/plugins/mk-code-graph.js:414]

## Findings

### Finding 1: `mcp-open-design` states a hard `sk-design` precondition, but it is not checked at the tool boundary

Severity: P1. Label: ENFORCEABLE for a tool-call transcript or hook fixture; ADVISORY for whether the resulting visual direction is good.

The Open Design skill already says the important thing: it is "the transport, never the taste," and any generation or design-feeding read must load `sk-design` first, run ground -> token-system -> critique, and shape the brief/form answers with that judgment. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:19] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:21] The same requirement is repeated in the run direction and routing table: `start_run`/generation is gated, and any RUN or design-feeding READ must load `sk-design` before deciding. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:45] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:78] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:92]

The gap is that this precondition lives in the skill text and pseudocode. A direct MCP call to an Open Design mutating tool can bypass that prose unless the runtime intercepts the tool call itself. The current `design_gate()` pseudocode blocks only inside the skill router model; it does not install or describe a concrete PreToolUse matcher over MCP tool names. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:164] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:175]

Buildable recommendation: add a first-class Open Design tool-boundary policy named `openDesignPreconditions` to the Codex PreToolUse hook/policy, with a deterministic "deny unless gate token is present and valid" check. The token should be carried in the Open Design tool input, not only in the surrounding transcript, because the hook can reliably inspect tool name and input. Minimal token shape:

```json
{
  "skDesignGate": {
    "version": 1,
    "surface": "project/page/component",
    "taskType": "generation|redesign|build|audit|dispatch",
    "register": "Brand|Product",
    "workflowModes": ["interface", "foundations"],
    "loadedFiles": [
      {"path": ".opencode/skills/sk-design/register.md", "sha256": "sha256:..."},
      {"path": ".opencode/skills/sk-design/design-interface/SKILL.md", "sha256": "sha256:..."}
    ],
    "contextVerdict": "LOADED",
    "routeTelemetryId": "optional transcript id"
  }
}
```

The hook can recompute file hashes and reject missing, stale, or incomplete tokens. That deterministically enforces "no Open Design mutation without a current `sk-design` context token." It does not prove taste quality or mental utilization; proof cards and later output-diff witnesses still own that advisory/content layer.

### Finding 2: The Open Design mutating/destructive tool set is concrete enough for a matcher

Severity: P1. Label: ENFORCEABLE.

The tool surface doc says the running MCP server exposes about 18 tools and must be verified live because `od mcp --help` undercounts. [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:17] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:40] It classifies the relevant write surface exactly: mutating tools are `create_artifact`, `write_file`, `create_project`, `start_run`, and `cancel_run`; destructive tools are `delete_file` and `delete_project`. [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:48] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:50] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:56] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:58]

The same reference already defines a stricter exposure policy: surface read-only tools freely, gate `create_artifact`, `create_project`, `start_run`, and `cancel_run`, and omit `delete_file`, `delete_project`, and `write_file` from the default path. [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:66] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:77] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:84] The hard rule says every mutating or destructive verb must be gated and names all seven MCP write/destructive tools. [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:91] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:96]

Buildable recommendation: use this list as the initial matcher corpus, but require a live `tools/list` drift check before release. A deterministic test fixture can replay tool names in multiple namespace forms:

```text
start_run
open-design.start_run
open_design.start_run
mcp__open_design__start_run
mcp.open-design.start_run
```

Expected outcome: read-only tools pass; all mutating/destructive tools deny without `skDesignGate`; all mutating/destructive tools pass only with a valid token and normal user confirmation/rollback gates. `write_file`, `delete_file`, and `delete_project` should remain "explicit-request only" even when the token is valid.

### Finding 3: The checked-in Codex PreToolUse hook is registered, but currently Bash-only and fails open for MCP tools

Severity: P1. Label: ENFORCEABLE.

The workspace has a Codex PreToolUse registration that calls the compiled `pre-tool-use.js` hook. [SOURCE: .codex/settings.json:32] [SOURCE: .codex/settings.json:37] The policy file describes itself as a conservative starter Bash denylist. [SOURCE: .codex/policy.json:3] The TypeScript input shape is broad enough to read `tool`, `tool_name`, `toolName`, and several input payload casings. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:19] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:36] But the policy schema contains only `bashDenylist` / `bash_denylist`, and the core handler returns `{}` unless `toolNameFor(input) === 'Bash'`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:44] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:49] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:215] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:217]

The unit tests lock that behavior in: `Edit`, `Read`, and `Write` all emit no decision even with a dangerous command string. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/codex-pre-tool-use.vitest.ts:60] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/codex-pre-tool-use.vitest.ts:69] That makes the current hook unsuitable for direct Open Design MCP enforcement. It can block a Bash command that shells out to `od`, but it cannot block a direct MCP `start_run` tool call.

Buildable recommendation: extend, do not replace, the current hook:

```ts
interface ToolPrecondition {
  toolNamePatterns: string[];
  requireSkDesignGate?: boolean;
  reason: string;
}

interface CodexPolicyFile {
  bashDenylist?: readonly (string | BashDenylistEntry)[];
  bash_denylist?: readonly (string | BashDenylistEntry)[];
  toolPreconditions?: readonly ToolPrecondition[];
}
```

Then run the tool-precondition check before the Bash-only branch. Required tests:

- denies `tool: "mcp__open_design__start_run"` when `tool_input.skDesignGate` is missing
- denies stale `loadedFiles[].sha256`
- allows the same tool when the token validates and leaves the existing Bash denylist behavior unchanged
- denies destructive Open Design tools even with a token unless `explicitUserConfirmation` and explicit project are present

This closes the direct-tool bypass for Codex. It is deterministic because the hook decision depends on tool name, input fields, and on-disk hashes.

### Finding 4: OpenCode needs a verified pre-tool hook or MCP proxy; the local plugin entrypoints are not currently an Open Design mutation guard

Severity: P2. Label: ENFORCEABLE once the interception surface is verified; currently ADVISORY for OpenCode runtime coverage.

The local OpenCode plugin folder auto-loads `.js` entrypoints at session start. [SOURCE: .opencode/plugins/README.md:8] The current entrypoints are `mk-skill-advisor.js`, `mk-code-graph.js`, and `session-cleanup.js`; none is an Open Design mutation guard. [SOURCE: .opencode/plugins/README.md:40] [SOURCE: .opencode/plugins/README.md:46] The checked examples expose prompt/system transforms and status tools, not a demonstrated pre-tool denial path over third-party MCP tools. [SOURCE: .opencode/plugins/mk-skill-advisor.js:710] [SOURCE: .opencode/plugins/mk-skill-advisor.js:712] [SOURCE: .opencode/plugins/mk-code-graph.js:414] [SOURCE: .opencode/plugins/mk-code-graph.js:442]

Buildable recommendation: for OpenCode, do not claim parity until one of two mechanisms is verified:

1. A real OpenCode pre-tool hook/plugin event can intercept third-party MCP tool calls and return a deny decision before execution.
2. Open Design is wired through a small local MCP proxy that exposes the same read tools freely but wraps the seven mutating/destructive tools with the same `skDesignGate` validation before forwarding to the Open Design daemon.

The proxy route is heavier but runtime-agnostic: Codex, OpenCode, Claude Code, HTTP automation, and CLI wrappers can all point to the guarded proxy. The native hook route is lighter for Codex because PreToolUse already exists in `.codex/settings.json`.

## Questions Answered

- Q3/D4: The deny-by-default mechanism should be a tool-boundary `skDesignGate` token, required only for Open Design mutating/destructive tools and design-feeding generation paths. The deterministic block is "no token, stale token, or token missing required files"; visual quality and whether the user accepted a good direction remain advisory.
- Q5/all: The buildable backlog item is enforceable for Codex now: extend `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts`, `.codex/policy.json`, and `codex-pre-tool-use.vitest.ts` with Open Design tool preconditions. OpenCode and other runtimes need either a verified pre-tool interception surface or an MCP proxy before parity can be claimed.

## Questions Remaining

- What exact Open Design MCP tool-name strings appear in Codex and OpenCode PreToolUse/plugin payloads after live `tools/list` and one dry-run interception?
- Should the `skDesignGate` token be manually embedded in the Open Design tool input, generated by a helper command, or produced by the future `routeTelemetry`/proof-card parser?
- Should CLI `od ui respond` be covered by the existing Bash denylist path with command-pattern preconditions, or should all write paths converge through the same guarded MCP proxy?

## Next Focus

D4-A2: design the runtime-agnostic guarded Open Design proxy or cross-runtime hook adapter: exact policy schema, live tool-name discovery, token validation, CLI command-pattern coverage, and parity tests for Codex/OpenCode/Claude Code.

## Sources Consulted

- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md`
- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-031.md`
- `.opencode/skills/mcp-open-design/SKILL.md`
- `.opencode/skills/mcp-open-design/references/tool_surface.md`
- `.opencode/skills/sk-design/shared/context_loading_contract.md`
- `.opencode/skills/sk-design/shared/assets/context_loaded_card.md`
- `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md`
- `.codex/settings.json`
- `.codex/policy.json`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/codex-pre-tool-use.vitest.ts`
- `.opencode/plugins/README.md`
- `.opencode/plugins/mk-skill-advisor.js`
- `.opencode/plugins/mk-code-graph.js`
