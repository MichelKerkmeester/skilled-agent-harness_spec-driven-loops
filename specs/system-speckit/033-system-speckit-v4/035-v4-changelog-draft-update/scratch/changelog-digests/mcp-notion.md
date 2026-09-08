# mcp-notion changelog digest

Skill path: `.opencode/skills/mcp-tooling/mcp-notion/` · Versions covered: v0.1.0.0 to v0.1.0.0 (the only entry in the changelog directory) · Date range: none, the entry carries no date.

---

## Per-version digest, newest first

### v0.1.0.0 (`changelog/v0.1.0.0.md`)

The initial release. It adds Notion to the `mcp-tooling` hub as a new light workflow mode rather than a thin transport, on the grounds that Notion mutates the workspace and needs more than a flat tool list. Per `v0.1.0.0.md`, the mode registers the official Notion MCP (`@notionhq/notion-mcp-server`) as the `notion` manual in `.utcp_config.json`, giving Code Mode 24 tools across 6 domains: 7 page tools, 5 block tools, 6 database and data-source tools, 2 comment tools, 3 user tools and 1 search tool. Notion is MCP-only with no CLI counterpart, unlike `mcp-click-up` and its `cupt` CLI, so every call runs through Code Mode. Five direct Notion REST calls fill gaps the official MCP leaves open: file uploads, views, non-truncated page property items, async-task polling and daily-note conventions, all using the same `NOTION_TOKEN` so no second credential or server is needed. The entry documents dual-backend routing: the local stdio backend (`NOTION_TOKEN`, headless) is registered as the default and the remote OAuth backend (`https://mcp.notion.com/mcp`, interactive only) is the documented alternative, with the router picking local stdio for headless Code Mode sessions. Tool names use hyphens (`create-a-page`, `query-data-source`), so calls must use the bracket-safe form `notion["notion_create-a-page"]({...})` confirmed against `list_tools()` and `tool_info()`. A full `mcp-obsidian`-depth multi-plugin skill was considered and rejected because Notion has no third-party plugins to route between. Verification is documentation plus read-only scripts, not an automated suite: an 11-scenario `manual-testing-playbook/manual-testing-playbook.md`, a read-only `scripts/doctor.sh` and `scripts/install.sh --check-only`, with 0 test files shipped. Documentation covers `feature-catalog/FEATURE-CATALOG.md`, `examples/README.md`, `scripts/README.md`, `README.md` and `INSTALL-GUIDE.md`, 15 files changed in total (3 source, 0 tests, 12 documentation). The release closes with the skill routing at 0.95 advisor confidence and canon checks green. Spec folder `specs/mcp-tooling/014-mcp-notion` (Level 2).

No RENAME, REMOVED or BREAKING items apply. This is the initial release and `v0.1.0.0.md` states plainly that no migration is required. Three behaviors it flags as worth planning around are not breaks but limits: search covers titles only with no full-text body search, deletes are reversible archive-to-trash moves rather than hard deletes, and async-task polling is not exposed by the local backend so a direct API poll or the remote MCP is needed. It also records one tracked risk: Notion is deprecating the local stdio server that the headless Code Mode path depends on, in favor of the remote OAuth server.

---

## Facts the v4 draft gets wrong or misses

Draft read: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` (463 lines). Notion appears at lines 36, 377, 381 and 388.

- Line 388 describes `mcp-notion` only as "Notion workspace operations through the official server over Code Mode". `v0.1.0.0.md` says the mode is deliberately more than the official server: it adds 5 direct Notion REST calls for file uploads, views, non-truncated page property items, async-task polling and daily-note conventions, precisely because the MCP does not expose them. The draft misses the gap-fill half of the capability.
- Line 388 misses the dual-backend routing that `v0.1.0.0.md` calls out as a distinct feature: local stdio registered as the headless default and remote OAuth documented as the interactive-only alternative, with the router choosing local stdio for headless Code Mode sessions.
- The draft nowhere records the tracked risk `v0.1.0.0.md` states in its Upgrade section, that Notion is deprecating the local stdio server the headless path depends on. For a release-notes upgrade audience this is the one forward-looking caveat in the entry.
- The draft misses the three usage limits `v0.1.0.0.md` flags: title-only search with no full-text body search, archive-to-trash deletes rather than hard deletes, and async-task polling being unavailable on the local backend.
- Line 381 groups `mcp-notion` under the heading "Four Transports, a Browser Bridge and Notion". This is not a factual error, the heading separates Notion out, but `v0.1.0.0.md` is explicit that the shape decision was a light workflow mode over a transport, mirroring `mcp-click-up`, and the draft never states that shape anywhere.
- Line 36 and line 377 both say the hub has nine modes. That matches the registry: five workflow modes plus four design transports. No correction needed.

---

## Current version and identity

- Version in `SKILL.md` frontmatter: `0.1.0.0`. Name field: `mcp-notion`.
- Identity: a MODE, not a hub and not standalone. There is no `mode-registry.json`, `graph-metadata.json`, `description.json` or `hub-router.json` at `.opencode/skills/mcp-tooling/mcp-notion/`. The parent `.opencode/skills/mcp-tooling/` holds `mode-registry.json`, `graph-metadata.json`, `description.json` and `hub-router.json`, and its `mode-registry.json` carries `"workflowMode": "mcp-notion"` with `"packet": "mcp-notion"` and `"packetSkillName": "mcp-notion"`. Routing therefore resolves through the `mcp-tooling` hub, and `mcp-notion` has no advisor entry of its own.
