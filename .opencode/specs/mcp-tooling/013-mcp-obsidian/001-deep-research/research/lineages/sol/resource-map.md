# Resource Map

## Summary

Evidence for the Obsidian BUILD-vs-ADOPT decision spans official documentation, upstream repositories/package manifests, and repository-local integration contracts. No source was written or modified outside this lineage.

## Official Documentation

- `https://obsidian.md/help/cli` — official CLI install, app dependency, commands, and requested feature coverage.
- `https://docs.obsidian.md/Plugins/Vault` — plugin API and in-app vault model.
- `https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI` — URI actions and limitations.

## Upstream Providers

- `https://github.com/coddingtonbear/obsidian-local-rest-api` — REST/MCP transport, auth, tools, certificate, and app dependency.
- `https://github.com/Yakitrak/notesmd-cli` — current headless CLI identity and commands.
- `https://github.com/obsidianmd/obsidian-headless` — Sync/Publish package identity.
- `https://github.com/dsebastien/obsidian-cli-rest` — official-CLI wrapper plugin.
- `https://github.com/cyanheads/obsidian-mcp-server` — rich Local REST API MCP wrapper.
- `https://raw.githubusercontent.com/cyanheads/obsidian-mcp-server/main/package.json` — exact npm/bin identity.
- `https://github.com/StevenStavrakis/obsidian-mcp` — filesystem MCP tools and install.
- `https://github.com/StevenStavrakis/obsidian-mcp/blob/main/package.json` — exact npm/bin identity.
- `https://github.com/newtype-01/obsidian-mcp` — hybrid MCP identity and environment variables.
- `https://www.npmjs.com/package/mcp-remote` — authenticated remote-MCP stdio bridge and header substitution.

## Repository Integration Contracts

- `.utcp_config.json:66` — Code Mode MCP manual shape.
- `.env.example:1` — manual-prefixed environment convention.
- `.opencode/skills/mcp-code-mode/README.md:112` — callable naming and `{manual_name}_{VAR}` prefix contract.
- `.opencode/skills/mcp-tooling/mcp-click-up/SKILL.md:299` — dual CLI+MCP routing model.
- `.opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/README.md:63` — package-identity 404 warning to avoid.

## Generated Evidence

- `iterations/iteration-001.md` — official surfaces and Local REST API baseline.
- `iterations/iteration-002.md` — community CLI identity and headless classification.
- `iterations/iteration-003.md` — MCP identities, transports, and auth.
- `iterations/iteration-004.md` — repository config mapping and final ranking.
- `deltas/iter-001.jsonl` through `deltas/iter-004.jsonl` — structured iteration records.
