# Iteration 2: Runtime path contracts and generator ownership

## Focus

Trace the seven runtime surfaces to the repository files that select their source trees, outputs and configuration paths.

## Findings

### Surface: 2, Runtime resolution contracts

- **Finding:** The repository's mirror generator hardcodes `.claude/agents` as the source for Claude-format agents, `.claude/commands` as a mirror destination, `.opencode/commands` as the command source and four hook-config paths at `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json` and `.devin/hooks.v1.json`. **Classification:** `blocker`. **Consequence for the cutover:** Moving the source root requires changing the generator constants, not only the emitted symlink targets. The generator's current input/output contract is not path-agnostic.
  - [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:36-47`]
  - [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:64-94`]

- **Finding:** Codex's agent generator reads `.opencode/agents` and writes `.codex/agents`, while its prompt generator reads `.opencode/commands` and writes `.codex/prompts`. The generated prompt body embeds `.opencode/commands/<path>` as the canonical path. **Classification:** `regenerate`. **Consequence for the cutover:** Both generator source constants and the prompt renderer must change, then the full output trees must be regenerated. A symlink rewrite leaves stale embedded source paths in prompt stubs.
  - [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs:19-22`]
  - [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs:19-23`]
  - [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs:82-99`]

- **Finding:** Pi's agent and prompt generators also hardcode `.opencode/agents` and `.opencode/commands` as inputs. Pi's generated agent files are not a live installed agent surface today, while `.pi/skills` remains a whole-directory symlink. **Classification:** `regenerate`. **Consequence for the cutover:** The generated trees still have to be rebuilt for parity even if Pi does not currently load `.pi/agents`; the skills link and the native `.pi/extensions` bridges remain separate surfaces.
  - [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs:19-22`]
  - [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs:19-23`]
  - [SOURCE: `.pi/SYNC.md:24-35`]
  - [SOURCE: `.pi/SYNC.md:80-87`]

- **Finding:** Hermes's skill and prompt generators hardcode `.opencode/skills`, `.opencode/agents` and `.opencode/commands` by default, but the skill generator exposes environment overrides for source and output directories. **Classification:** `regenerate`. **Consequence for the cutover:** The implementation can redirect Hermes generation through environment variables, but the generator's rendered canonical-path text and any callers that do not set those variables still require source changes or explicit invocation binding.
  - [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:19-33`]
  - [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs:19-23`]
  - [SOURCE: `.hermes/SYNC.md:48-69`]

- **Finding:** Claude's real agent fork and Cursor's and Devin's mirrors are tied together by the mirror generator. Cursor reads Claude-format agents from `.claude/agents`, commands from `.opencode/commands` and has no project `.cursor/skills`; Devin reads nested `.devin/agents/<name>/AGENT.md`, has no mirrored command surface and discovers project skills from `.opencode/skills`. **Classification:** `manual`. **Consequence for the cutover:** A single `.skilled` source can feed generators only after preserving these runtime-native output positions and the Claude dialect fork. The source path cannot be inferred from the runtime directory name.
  - [SOURCE: `.cursor/SYNC.md:12-39`]
  - [SOURCE: `.devin/SYNC.md:12-39`]

- **Finding:** Hermes requires a project trust grant and an environment opt-in for project plugins. Its config, hooks, MCP servers and provider settings are user-level rather than in `.hermes/`. **Classification:** `manual`. **Consequence for the cutover:** Repository symlink changes do not update user-level Hermes trust, plugin enablement or MCP configuration. Those external state surfaces must be audited separately.
  - [SOURCE: `.hermes/SYNC.md:8-16`]
  - [SOURCE: `.hermes/SYNC.md:38-42`]

- **Finding:** OpenCode's checked-in project contract launches the MCP server through `opencode.json` at `.opencode/bin/mcp-code-mode-launcher.cjs`. The launcher then constructs the server directory, manifest and dist entrypoint below `.opencode/skills/mcp-code-mode/mcp-server`. The repository's OpenCode orchestration docs describe project-local plugin, skill and MCP loading, but the upstream OpenCode discovery implementation is not vendored here. **Classification:** `blocker`. **Consequence for the cutover:** The exact upstream configurability of the `.opencode` discovery directory is UNKNOWN. The launcher path and its nested server paths are proven repository-local dependencies and cannot be left unresolved.
  - [SOURCE: `opencode.json:10-19`]
  - [SOURCE: `.opencode/bin/mcp-code-mode-launcher.cjs:19-28`]
  - [SOURCE: `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md:39-52`]
  - [SOURCE: `.opencode/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:59-80`]

### Runtime contract matrix

| Runtime | Repository-selected path | Configurability established by this checkout | Classification |
|---|---|---|---|
| Claude Code | `.claude/skills`, `.claude/commands`, `.claude/agents`, `.claude/hooks`, `.claude/settings.json` | The mirror generator is hardcoded. Upstream scanner configuration is UNKNOWN. | `blocker` |
| Codex | generated `.codex/agents`, `.codex/prompts`, `.codex/hooks.json`, `.codex/hooks` | Generator inputs are hardcoded. Hook install is outbound to user-global state. | `regenerate` |
| Cursor | `.cursor/agents`, `.cursor/commands`, `.cursor/hooks.json`, no `.cursor/skills` | The repository generator is hardcoded. Upstream scanner configuration is UNKNOWN. | `blocker` |
| Devin | nested `.devin/agents`, `.devin/hooks.v1.json`, project `.opencode/skills` | No mirrored command or skills tree. Upstream config is UNKNOWN. | `manual` |
| Pi | `.pi/skills`, generated `.pi/agents`, `.pi/prompts`, native `.pi/extensions` | Generator inputs are hardcoded. | `regenerate` |
| Hermes | real `.hermes/skills`, generated `.hermes/prompts`, linked `.hermes/agents`, project plugin | Skill source and output have generator environment overrides. User trust and plugin settings are external. | `manual` |
| OpenCode | project `.opencode` tree plus `opencode.json` launcher | Upstream discovery configurability is UNKNOWN. Project launcher paths are hardcoded. | `blocker` |

## Sources Consulted

- Runtime mirror generator and Codex, Pi and Hermes generator implementations.
- Runtime sync manifests for Claude, Cursor, Devin, Pi and Hermes.
- `opencode.json`, the MCP launcher and OpenCode delegation references.

## Assessment

- `newInfoRatio`: 0.95
- Novelty justification: The source-path constants and prompt renderers show that generated outputs carry `.opencode` as data, not only as filesystem topology.
- Confidence: high for repository-owned generators and checked-in launcher paths; UNKNOWN for upstream runtime scanner configurability.

## Reflection

- Worked: reading generator constants and renderers exposed the rewrite points that a symlink inventory cannot show.
- Ruled out: assuming all seven runtimes can be repointed by a shared environment variable.
- Failed: no vendored upstream Claude, Cursor, Devin, Pi, Hermes or OpenCode scanner source was found.

## Recommended Next Focus

Determine the minimum `.opencode` compatibility surface and enumerate hardcoded launcher, plugin and hook paths that would fail after the move.
