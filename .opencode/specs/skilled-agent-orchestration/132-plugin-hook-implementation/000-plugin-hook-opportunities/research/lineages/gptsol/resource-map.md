# Research Resource Map

## READMEs

- `.opencode/plugins/README.md` - Current plugin inventory, entrypoint constraints, bridge ownership, and runtime patterns.

## Documents

- `.opencode/skills/sk-code/code-opencode/references/shared/hooks.md` - Cross-runtime hook wiring and parity rules.
- `.opencode/skills/system-code-graph/references/runtime/naming_conventions.md` - Intentional code-graph hook ownership boundary.

## Commands

- None directly inspected; command-owned deep-loop behavior was read through its skill/runtime contracts.

## Agents

- `.opencode/agents/deep-research.md` - Single-iteration evidence and state contract used by this lineage.

## Skills

- `.opencode/skills/system-spec-kit/SKILL.md` - Mutation gate and completion evidence.
- `.opencode/skills/sk-code/code-quality/SKILL.md` - Target-path quality checks and verification separation.
- `.opencode/skills/sk-code/code-opencode/SKILL.md` - Plugin output and system-code rules.
- `.opencode/skills/sk-git/SKILL.md` - Git safety invariants.
- `.opencode/skills/mcp-code-mode/SKILL.md` - External MCP routing policy and native exemptions.
- `.opencode/skills/system-skill-advisor/SKILL.md` - Existing prompt-time routing ownership.
- `.opencode/skills/system-deep-loop/SKILL.md` - Mode registry and lifecycle ownership.
- `.opencode/skills/sk-design/design-audit/SKILL.md` - Evidence requirements that rule out automatic edit-time scoring.

## Specs

- None used as candidate evidence; the research remained grounded in live skills, plugins, settings, and hook sources.

## Scripts

- `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh` - Existing post-edit quality adapter.
- `.opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs` - Existing Bash deny/advisory envelope.
- `.opencode/skills/system-deep-loop/runtime/hooks/claude/task-dispatch-guard.cjs` - Existing shared-policy Claude adapter.

## Tests

- `.opencode/skills/system-spec-kit/mcp_server/tests/opencode-plugins-folder-purity.vitest.ts` - Recognizes valid plugin hook keys including `tool.execute.after`.

## Config

- `.claude/settings.json` - Live Claude event wiring, matchers, commands, timeouts, and ownership.

## Meta

- `iterations/iteration-001.md` - Inventory and gap identification.
- `iterations/iteration-002.md` - OpenCode candidate mapping.
- `iterations/iteration-003.md` - Claude mapping, parity, ranking, and convergence.
