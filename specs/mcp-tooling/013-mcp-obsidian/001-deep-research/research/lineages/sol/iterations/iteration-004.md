# Iteration 4: Dual-surface architecture, configuration, and final ranking

## Focus

Map the existing `mcp-click-up` CLI-plus-MCP conventions to Obsidian, close the requested feature matrix, and produce a ranked BUILD-vs-ADOPT decision for each surface with an exact Code Mode authentication pattern.

## Findings

1. **The architecture should mirror `mcp-click-up` at the routing level, not copy its provider choices.** The sibling mode selects a real CLI for frequent ergonomic operations and MCP for structured/broader operations, with explicit install pointers and operation-to-tool routing. The current ClickUp MCP entry is also a warning: its configured `@clickup/mcp-server` identity is documented as returning npm 404, so `mcp-obsidian` must make package/endpoint verification a doctor/install gate rather than trusting a plausible name. [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/SKILL.md:299] [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/README.md:63]
2. **CLI recommendation — ADOPT official `obsidian` as primary; do not build a replacement.** It is bundled with Obsidian 1.12.7+, has the strongest semantic surface, and directly covers all requested categories: note CRUD, full search, backlinks/outgoing links, daily notes, tags, typed properties/frontmatter, and templates. Its explicit cost is app coupling: the first command starts Obsidian if necessary. A thin mode-level router/normalizer is justified; reimplementing vault semantics is not. [SOURCE: https://obsidian.md/help/cli]
3. **CLI fallback — ADOPT `notesmd-cli` only as an optional headless profile.** The verified binary works without Obsidian, is distributed by Homebrew/Scoop/AUR or Go build, and covers filesystem CRUD, filename/content search, daily notes, and frontmatter. It does not provide the live metadata graph or documented dedicated backlinks, vault-wide tag, and general template commands. This should be opt-in (`headless`) rather than silent fallback, because behavior is not equivalent. [SOURCE: https://github.com/Yakitrak/notesmd-cli]
4. **MCP recommendation — ADOPT Local REST API's built-in MCP endpoint as the default live-vault backend.** It is already the shortest path to Obsidian's live metadata and command registry, and its upstream docs explicitly recommend it over third-party MCP wrappers. For this repository's Code Mode, use the established stdio bridge pattern: `npx -y mcp-remote@latest https://127.0.0.1:27124/mcp/ --header "Authorization:${OBSIDIAN_AUTH_HEADER}"`, after trusting the plugin certificate. If trust cannot be installed, the documented local-only fallback is `http://127.0.0.1:27123/mcp/` with `--allow-http`; never expose that listener beyond loopback. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://www.npmjs.com/package/mcp-remote]
5. **The exact Code Mode secret pattern should be manual `obsidian` plus full bearer header in one prefixed variable.** In `.utcp_config.json`, map child env `OBSIDIAN_AUTH_HEADER` from `${OBSIDIAN_AUTH_HEADER}` and let `mcp-remote` expand it in `Authorization:${OBSIDIAN_AUTH_HEADER}`. In `.env.example`, document `obsidian_OBSIDIAN_AUTH_HEADER=Bearer your_local_rest_api_key`. The `obsidian_` prefix follows Code Mode's `{manual_name}_{VAR}` rule; storing the complete `Bearer …` value matches `mcp-remote`'s safe env-header pattern and keeps the token out of JSON and argv literals. [SOURCE: .opencode/skills/mcp-code-mode/README.md:122] [SOURCE: https://www.npmjs.com/package/mcp-remote]
6. **MCP fallback ranking is conditional, not additive by default.** Use npm/binary `obsidian-mcp-server` when Code Mode cannot bridge authenticated remote HTTP or when its read-only/path-policy/pagination controls are required; it still needs Local REST API and the app. Use npm/binary `obsidian-mcp` only for a distinct headless-filesystem profile, accepting narrower semantics. Do not register all three under one mode by default: overlapping mutation tools increase ambiguity and blast radius. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] [SOURCE: https://github.com/StevenStavrakis/obsidian-mcp/blob/main/package.json]
7. **Feature matrix and remaining build scope:** official CLI is the only single surface with native coverage of CRUD/search/backlinks/daily/tags/frontmatter/templates. Built-in MCP covers CRUD/search/tags/frontmatter and can reach daily/templates indirectly through commands, but lacks dedicated backlink/template tools. `notesmd-cli` and filesystem `obsidian-mcp` are headless but narrower. Build only the mode packet, installer/doctor, routing docs, safety policies, and—if product requirements demand parity—a thin compatibility layer for missing backlinks/templates across profiles; do not build a new vault engine or generic MCP server. [INFERENCE: based on the official CLI, Local REST API MCP, NotesMD CLI, filesystem MCP, and the sibling mode's routing contract]

### Proposed Code Mode manual

```json
{
  "name": "obsidian",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "obsidian": {
        "transport": "stdio",
        "command": "npx",
        "args": [
          "-y",
          "mcp-remote@latest",
          "https://127.0.0.1:27124/mcp/",
          "--header",
          "Authorization:${OBSIDIAN_AUTH_HEADER}"
        ],
        "env": {
          "OBSIDIAN_AUTH_HEADER": "${OBSIDIAN_AUTH_HEADER}"
        }
      }
    }
  }
}
```

Corresponding `.env.example` entry:

```dotenv
# Obsidian Local REST API MCP (Code Mode prefixes with manual name `obsidian`)
obsidian_OBSIDIAN_AUTH_HEADER=Bearer your_local_rest_api_key
```

### Requested feature matrix

| Surface | Headless vault access | CRUD | Search | Backlinks | Daily notes | Tags | Frontmatter | Templates |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Official `obsidian` CLI | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| `notesmd-cli` | Yes | Yes | Yes | No dedicated query | Yes | No vault index | Yes | Daily-template support only |
| Local REST API built-in MCP | No | Yes | Yes | No dedicated tool | Via commands/extensions | Yes | Yes | Via commands |
| `obsidian-mcp-server` | No | Yes | Yes | Outgoing parse only | Periodic addressing | Yes | Yes | Via commands only |
| `obsidian-mcp` | Yes | Yes | Yes | No | No | Yes | YAML parsing, no generic tool | No |
| `obsidian://` | No | Create/open only | Opens search UI | No | Opens daily | No | No | No |

## Ruled Out

- Building a new full CLI or vault engine: the official CLI already has complete live-vault semantics and NotesMD covers the narrower headless case.
- Building a new default MCP wrapper: Local REST API already publishes an authenticated MCP endpoint.
- Using a guessed npm identity: every recommended executable/package was tied to upstream metadata or an endpoint with no package claim.
- Silently falling back from live-app to filesystem mode: those profiles differ on metadata, links, templates, commands, and concurrency behavior.

## Dead Ends

- Copy the current ClickUp MCP package string without verifying it; the sibling packet records that it returns 404.
- Make `obsidian://` the CLI transport; it is one-way, UI-oriented, and lacks machine-readable reads.
- Register multiple overlapping write-capable MCP servers as peers in the default mode.

## Edge Cases

- Ambiguous input: “dual CLI+MCP” could imply feature parity. The recommendation preserves a common routing/documentation layer but makes profile differences explicit rather than inventing parity.
- Contradictory evidence: Local REST API's prose mentions periodic-note capability while the current built-in MCP tool table does not list a dedicated periodic tool; final classification is indirect via commands/extensions, not native dedicated coverage.
- Missing dependencies: live smoke tests require an operator-installed Obsidian 1.12.7+, Local REST API token, and trusted certificate; these become implementation-phase doctor checks.
- Partial success: the proposed manual is evidence-backed but not registered or exercised in this research-only lineage.

## Sources Consulted

- https://obsidian.md/help/cli
- https://github.com/Yakitrak/notesmd-cli
- https://github.com/coddingtonbear/obsidian-local-rest-api
- https://www.npmjs.com/package/mcp-remote
- https://github.com/cyanheads/obsidian-mcp-server
- https://github.com/StevenStavrakis/obsidian-mcp/blob/main/package.json
- `.utcp_config.json:66`
- `.env.example:1`
- `.opencode/skills/mcp-code-mode/README.md:112`
- `.opencode/skills/mcp-tooling/mcp-click-up/SKILL.md:299`
- `.opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/README.md:63`

## Assessment

- New information ratio: 0.68
- Questions addressed: final BUILD-vs-ADOPT decision; Code Mode transport; auth/env prefix; requested feature matrix; implementation boundary.
- Questions answered: ranked CLI and MCP choices; exact default/manual identity; running-app versus headless profiles; remaining justified build scope.

## Reflection

- What worked and why: pairing upstream capability evidence with the repository's real Code Mode and sibling-mode conventions produced an implementable recommendation instead of a generic ecosystem survey.
- What did not work and why: the sibling ClickUp package string cannot serve as a trustworthy precedent because its own verification notes record a 404; only the structural routing pattern should be mirrored.
- What I would do differently: run the proposed manual against a disposable fixture vault before implementation acceptance, then capture `list_tools` and one read-only call as a checked-in discovery fixture.

## Recommended Next Focus

Maximum iterations reached. Synthesize the four passes into the canonical research report and carry live smoke-test requirements forward as implementation validation, not more research iteration work.
