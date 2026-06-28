# Iteration 33: D4-A2 Open Design CLI Bash Write-Verb Gate

## Focus

[D4-A2 / D4] `od` CLI Bash bypass: whether a Codex `PreToolUse` Bash matcher can block Open Design CLI write verbs, especially `daemon-cli.mjs run start`, `daemon-cli.mjs ui respond`, and `daemon-cli.mjs media generate`, unless the `sk-design` routing/utilization precondition is carried into the command.

## Actions Taken

1. Re-read the active strategy, iteration 32, and the Open Design skill contract so this pass stayed on the CLI/Bash bypass rather than re-covering direct MCP tool calls. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/deep-research-strategy.md:37] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/deep-research-strategy.md:181] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-032.md:122]
2. Re-read `mcp-open-design` and its CLI/MCP references to verify the documented `od` invocation form, generation flow, and gated CLI write verbs. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:21] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:45] [SOURCE: .opencode/skills/mcp-open-design/references/od_cli_reference.md:17] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:77]
3. Read the installed Open Design bundle on disk to verify that `daemon-cli.mjs` imports the CLI chunk and that the chunk exposes/executes the target write verbs. [SOURCE: /Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs:6] [SOURCE: /Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs:8] [SOURCE: /Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/chunks/cli-BQ3QG36A.mjs:5506] [SOURCE: /Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/chunks/cli-BQ3QG36A.mjs:6247]
4. Re-read the Codex PreToolUse hook, policy file, tests, and `sk-design` proof contract to check what a Bash matcher can inspect and what the required design gate could be bound to. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:44] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:215] [SOURCE: .codex/policy.json:3] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:150]

## Findings

### Finding 1: The `od` CLI write verbs are concrete enough to match at the Bash boundary

Severity: P1. Label: ENFORCEABLE for a Bash command corpus using canonical Open Design invocation forms; ADVISORY for hidden shell aliases/functions the hook cannot resolve from a single command string.

The Open Design skill says the CLI is not a global `od` binary: it is `app/prebundled/daemon/daemon-cli.mjs`, and there is no safe assumption that bare `od` on PATH means Open Design. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:23] [SOURCE: .opencode/skills/mcp-open-design/references/od_cli_reference.md:17] The installed shim confirms that `daemon-cli.mjs` sets `OD_BIN` and `OD_DAEMON_CLI_PATH` to itself, then imports the real CLI chunk. [SOURCE: /Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs:5] [SOURCE: /Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs:8]

The target write verbs are also real, not only prose. The bundled help exposes `od ui <list|show|respond|revoke|prefill>` and `od media generate`, with media generation writing into the active project. [SOURCE: /Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/chunks/cli-BQ3QG36A.mjs:1790] [SOURCE: /Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/chunks/cli-BQ3QG36A.mjs:1806] The `ui respond` implementation parses the command, then posts to `/api/runs/:runId/genui/:surfaceId/respond` with `method: "POST"`. [SOURCE: /Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/chunks/cli-BQ3QG36A.mjs:5506] [SOURCE: /Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/chunks/cli-BQ3QG36A.mjs:5528] [SOURCE: /Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/chunks/cli-BQ3QG36A.mjs:5530] The `run start` implementation posts to `/api/runs` after assembling project, message, plugin, skill, design-system, agent, model, and inputs fields. [SOURCE: /Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/chunks/cli-BQ3QG36A.mjs:6213] [SOURCE: /Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/chunks/cli-BQ3QG36A.mjs:6247] [SOURCE: /Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/chunks/cli-BQ3QG36A.mjs:6250]

Buildable recommendation: add a structured `odCliPreconditions` policy lane to the Codex PreToolUse hook. It should recognize canonical `daemon-cli.mjs` invocations and their variable forms (`"$OD_BIN"`, `${OD_BIN}` when present in the same command), then classify at least these design-affecting write patterns:

```json
{
  "odCliPreconditions": [
    {
      "pathMarkers": ["daemon-cli.mjs", "$OD_BIN", "${OD_BIN}"],
      "writeVerbPatterns": [
        ["run", "start"],
        ["run", "redesign"],
        ["ui", "respond"],
        ["ui", "prefill"],
        ["ui", "revoke"],
        ["media", "generate"]
      ],
      "requireSkDesignGate": true
    }
  ]
}
```

Do not key the matcher on bare `od run start`; the repo docs explicitly warn that bare `od` is the system octal-dump command unless an unverified installer created a shim. [SOURCE: .opencode/skills/mcp-open-design/references/od_cli_reference.md:44] [SOURCE: .opencode/skills/mcp-open-design/references/od_cli_reference.md:70]

### Finding 2: The current Codex Bash policy is the right interception point, but the wrong abstraction for this gate

Severity: P1. Label: ENFORCEABLE.

Codex already has a registered PreToolUse shape that can inspect Bash commands. The hook README documents `PreToolUse` registration through the compiled Codex hook, and the implementation reads `tool`, `tool_name`, `toolName`, plus command payload variants. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/README.md:72] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/README.md:75] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:19] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:36]

The gap is policy shape. `CodexPolicyFile` currently has only `bashDenylist` and `bash_denylist`; `.codex/policy.json` is a conservative starter denylist with destructive shell snippets, not command-precondition rules. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:44] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:49] [SOURCE: .codex/policy.json:3] [SOURCE: .codex/policy.json:4] The matcher is literal-pattern based: it escapes the configured string, relaxes whitespace, and checks a regex against the raw command. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:164] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:174] That is too blunt for Open Design. A pattern like `run start` risks blocking unrelated shell commands; a pattern like `daemon-cli.mjs run start` misses the recommended bundled-Electron form or `$OD_BIN` variable form.

Buildable recommendation: keep `bashDenylist` for simple toxic phrases, but add a separate parser-backed precondition check before the denylist. The checker should:

- tokenize the Bash command enough to handle quotes, env assignments, `node "$OD_BIN" ...`, and `ELECTRON_RUN_AS_NODE=1 "$OD_NODE_BIN" "$OD_BIN" ...`;
- bind the Open Design CLI marker and write verb in the same command segment before denying;
- fail closed only after an Open Design write command has been recognized;
- keep existing non-Open-Design Bash behavior unchanged.

Required tests should replay canonical commands from the docs plus evasions:

```text
node "$OD_BIN" run start --project p --message brief
ELECTRON_RUN_AS_NODE=1 "$OD_NODE_BIN" "$OD_BIN" ui respond --run r s --value-json '{}'
"/Applications/Open Design.app/.../daemon-cli.mjs" media generate --surface image --model m
npm run start
echo "od ui respond"
```

Expected: the first three deny without a valid design gate, the last two do not.

### Finding 3: The CLI gate cannot rely on transcript-only proof; it needs a same-command gate file or equivalent inspectable token

Severity: P1. Label: ENFORCEABLE for command transcript + filesystem fixtures; ADVISORY for whether the resulting visual choices are tasteful.

Iteration 32's direct-MCP token can live in tool input. The CLI path is different: the PreToolUse hook sees a Bash command string, not a structured Open Design request body. The current input type only models command-bearing fields inside the hook payload. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:23] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:36] The `sk-design` side has the right source material for a token: context manifests must name loaded files before design/build decisions, and proof fields/cards are intended for parent sessions, delegated prompts, child responses, and final proof cards. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:65] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:71] The hard gates explicitly block design decisions before context is loaded, and deterministic proof checking already exists for ready claims. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:142] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:150] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:68]

Buildable recommendation: for Bash CLI invocations, require a same-command pointer to a content-bound gate file:

```bash
OD_SK_DESIGN_GATE_FILE=.opencode/tmp/open-design-gates/<id>.json \
  node "$OD_BIN" run start --project <id> --message "<brief>"
```

The hook should parse `OD_SK_DESIGN_GATE_FILE=<path>`, read the JSON, and validate:

- `taskType` is `generation`, `redesign`, `build`, or `dispatch`;
- `workflowModes` includes the expected `sk-design` mode bundle for the Open Design command;
- `loadedFiles[]` paths and SHA-256 hashes match the current checkout;
- `contextVerdict` is `LOADED`;
- `routeTelemetryId` or equivalent proof joins the gate to the routed design decision.

If the matcher recognizes `daemon-cli.mjs run start`, `ui respond`, or `media generate` and the gate file is missing, stale, or incomplete, deny before Bash executes. This is deterministically enforceable. It still does not prove the final design is good; output-diff witnesses and proof-of-application checks remain the taste/utilization layer.

### Finding 4: The Bash matcher is necessary but not sufficient; it complements the guarded MCP/proxy path from iteration 32

Severity: P2. Label: ENFORCEABLE for Codex Bash calls; ADVISORY for cross-runtime or non-Bash Open Design surfaces until each surface has its own interceptor.

Open Design exposes the same daemon through four interchangeable surfaces: the CLI, stdio MCP server, HTTP API, and in-app Skills. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:209] The CLI reference confirms the HTTP API is first-class and live, not an incidental implementation detail. [SOURCE: .opencode/skills/mcp-open-design/references/od_cli_reference.md:99] [SOURCE: .opencode/skills/mcp-open-design/references/od_cli_reference.md:107] The tool-surface reference already says the gating policy spans both MCP tools and CLI write verbs. [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:64] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:77] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:96]

That means a Bash matcher closes only one bypass: a Codex/agent shelling out to `daemon-cli.mjs`. It does not catch direct MCP calls, raw HTTP calls to the ephemeral daemon URL, the in-app Skills surface, or a child agent running outside the parent runtime's hook envelope.

Buildable recommendation: share one `openDesignPreconditions` schema across three adapters:

1. `toolPreconditions` for direct MCP tool calls from iteration 32.
2. `odCliPreconditions` for Bash commands that invoke `daemon-cli.mjs`.
3. a guarded MCP/HTTP proxy for runtimes that cannot provide equivalent pre-tool hooks.

The CLI matcher should not replace the proxy. It should be the cheap Codex-native guard for Bash, backed by the same `skDesignGate` validator as the tool-boundary guard.

## Questions Answered

- Q3/D4: `od ui respond` should be covered by a Bash precondition matcher, but not by the existing raw `bashDenylist` mechanism. The matcher must bind both Open Design CLI identity and write verb, then require a same-command `OD_SK_DESIGN_GATE_FILE` or equivalent inspectable token.
- Q3/D4: The first deterministic CLI block is "recognized Open Design write verb + missing/stale gate file." The quality of the resulting design remains advisory/content-bound and belongs to proof-of-application/output-witness scoring.
- Q5/all: The buildable backlog item is an `odCliPreconditions` policy lane in the Codex PreToolUse hook, sharing the token validator with the direct-MCP `toolPreconditions` lane from iteration 32.

## Questions Remaining

- What exact Codex PreToolUse JSON payloads are emitted for Bash commands with env assignments, quoted app paths, multiline commands, and `ELECTRON_RUN_AS_NODE=1` prefixes?
- Where should transient gate files live, and how should they expire so stale `sk-design` context cannot be replayed indefinitely?
- Can OpenCode and Claude Code expose an equivalent pre-tool Bash interception path, or do they need the guarded MCP/proxy route for parity?
- Should `od media generate` require the full interface/foundations bundle, or a media-specific `sk-design` bundle keyed by surface (`image`, `video`, `audio`)?

## Next Focus

D4-A3: HTTP/daemon bypass and proxy convergence. Verify whether raw `POST /api/runs`, `/api/runs/:runId/genui/:surfaceId/respond`, and `/api/projects/:id/media/generate` can be guarded by the same `skDesignGate` validator, and decide whether the proxy should become the cross-runtime source of truth while Codex Bash/MCP hooks remain local fast paths.

## Sources Consulted

- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/deep-research-strategy.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-032.md`
- `.opencode/skills/mcp-open-design/SKILL.md`
- `.opencode/skills/mcp-open-design/references/tool_surface.md`
- `.opencode/skills/mcp-open-design/references/od_cli_reference.md`
- `/Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs`
- `/Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/chunks/cli-BQ3QG36A.mjs`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/tests/codex-pre-tool-use.vitest.ts`
- `.codex/policy.json`
- `.opencode/skills/sk-design/shared/context_loading_contract.md`
- `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md`
