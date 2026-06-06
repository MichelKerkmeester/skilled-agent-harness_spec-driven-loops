# Iteration 2: LENS-2 Delta and Requirement Traceability

## Focus

Check every research design delta against phase requirements and tasks, then check every phase requirement back to research evidence.

## Findings

1. D1, D3, and D8 trace cleanly to phase 1. The research delta table defines generated CLI registry, trusted graph mutation policy, and exit map [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/research/lineages/gpt/research.md:83]. Phase 1 requirements cover all nine generated subcommands, fail-closed mutating commands, IPC auto-spawn, and exit codes 75/69/64 [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core/spec.md:119].

2. D2, D5, and D6 trace cleanly to phase 2. The research delta table defines Python reconciliation, rebuild/scan jobs, and orphan reaping [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/research/lineages/gpt/research.md:84]. Phase 2 requirements cover the parity fixture, mutation wall-time/job UX decision, orphan fixtures, and dual-client tests [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests/spec.md:118].

3. D4 traces to phase 3, but its acceptance language needs a sharper latency split. The research says warm-only hooks must use daemon IPC, in-process compat, or caches, not one native Python bridge per prompt [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/research/lineages/gpt/research.md:57]. Phase 3 requires each runtime to demonstrate the CLI path once with MCP stopped within the cache-hit p95 <60ms bar [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration/spec.md:119]. The acceptance should say whether that drill is a pre-warmed cache-hit drill, a warm-daemon non-cache drill, or a separate fail-open cold-start drill.

4. P1 GAP: D7 traceability is inconsistent around Devin. The research delta table's D7 acceptance names OpenCode/Codex/Claude configs unchanged [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/research/lineages/gpt/research.md:89], while phase 3 requires configs unchanged across OpenCode/Codex/Claude/Devin [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration/spec.md:126]. Devin does have an active `mk_skill_advisor` MCP config in `.devin/config.json` [SOURCE: file:.devin/config.json:37], but `.devin/config.local.json` contains only `mk-spec-memory` and `sequential_thinking` MCP entries [SOURCE: file:.devin/config.local.json:8]. The phase should define which Devin config files participate in the "unchanged" diff.

## Sources Consulted

- `.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/research/lineages/gpt/research.md`
- `.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core/spec.md`
- `.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests/spec.md`
- `.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration/spec.md`
- `.devin/config.json`
- `.devin/config.local.json`

## Assessment

`newInfoRatio`: 0.76. Most deltas trace, but the Devin/D7 mismatch is new and relevant to phase 3 acceptance.

Confidence: high on D1-D8 mapping; medium on Devin config precedence because merge semantics are not stated in the packet.

## Reflection

What worked: two-way mapping avoided false "orphan" claims. What failed: the research D7 acceptance was copied too narrowly from the initial integration surface map. Ruled out: broad D-series trace failure.

## Recommended Next Focus

LENS-3: runtime pairing completeness against actual hook, shim, plugin, config, and doctor inventory.
