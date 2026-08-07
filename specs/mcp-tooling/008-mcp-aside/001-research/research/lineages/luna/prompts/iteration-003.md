# Deep Research Iteration 3 Prompt

## Route proof

- Mode: `research`
- Target agent: `deep-research`
- Resolved route: `Resolved route: mode=research target_agent=deep-research`
- Executor: `cli-codex model=gpt-5.6-luna`
- Session: `fanout-luna-1784196776045-jwfb3a`
- Artifact root: `.opencode/specs/mcp-tooling/008-mcp-aside/001-research/research/lineages/luna`

## Focus

Complete the packet-authoring review: contrast Aside with the repository's bdg CLI/Code Mode patterns, map navigation/DOM/screenshot/console/network/session workflows, and derive the exact `aside` UTCP manual shape. Preserve evidence gaps and runtime discovery rules. This is the hard-cap iteration; do not stop before recording the full review.

## Required evidence

- Read the local `.utcp_config.json` manual shape and `mcp-code-mode` naming/discovery rules.
- Read the local `mcp-chrome-devtools` skill and CDP/session references without executing `bdg`.
- State which Aside capabilities are verified, inferred from standard Playwright behavior, or untested because no browser profile was bound.
- Provide a CLI-primary flow and a Code Mode MCP fallback flow, including error/cleanup behavior.
- Include a copy-ready but unapplied `aside` UTCP manual object and explain why no root config write occurs in this lineage.

## Safety and output constraints

- Do not run `bdg`, edit `.utcp_config.json`, author the skill, or write outside the lineage root.
- Do not claim Code Mode registration is live; it is derived from repository convention and must be discovered after registration.
- Treat `aside.aside_repl` as the expected Code Mode naming form only after `list_tools`/`tool_info` confirmation.
- Record `max-iterations` as the terminal policy even if convergence telemetry is below the configured threshold.
