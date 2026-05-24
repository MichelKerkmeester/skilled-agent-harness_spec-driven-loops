---
title: "System Code Graph Naming Conventions"
description: "Reference for the deliberate name asymmetry across skill folder, MCP server, launcher, database directory, plugin bridge, and hook location."
trigger_phrases:
  - "system code graph naming"
  - "mk-code-index vs system-code-graph"
  - "mk_code_index naming"
  - "code graph plugin name"
  - "code graph hook location"
---

# System Code Graph Naming Conventions

A reference for the multiple names that refer to this skill across different runtime layers and why each one is intentional.

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

### Why this reference exists

The `system-code-graph` skill is referenced under five different identifiers depending on which layer of the system is calling it. Each name is correct in its own scope, but the asymmetry surprises operators and led to documentation drift in earlier packets. This reference is the single source of truth.

### Key sources

- ADR-001 (`005-code-graph/013-system-code-graph-extraction/`): MCP server name stability.
- ADR-002 (`005-code-graph/014-design-and-decision-record/`): Skill folder slug + database path policy.
- Cross-runtime consolidation packet (`005-code-graph/019-system-code-graph-uplift/`): launcher and shared-data-dir rename rationale.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-name-map -->
## 2. NAME MAP

| Layer | Identifier | Source-of-truth | Reason |
|---|---|---|---|
| Skill folder slug | `system-code-graph` | `.opencode/skills/system-code-graph/` | Filesystem name; matches `name:` field in SKILL.md frontmatter. |
| MCP server name | `mk-code-index` | `opencode.json` `mcp.mk_code_index.*` and 5 runtime mirrors | Stable tool contract per ADR-002. Renaming would break every config that registers the server. |
| MCP server config key | `mk_code_index` | All runtime configs | MCP convention: hyphens in server names become underscores in config keys. |
| MCP tool namespace prefix | `mcp__mk_code_index__` | Tool call sites | MCP convention: hyphens → underscores in tool prefix. |
| Launcher file | `mk-code-index-launcher.cjs` | `.opencode/bin/mk-code-index-launcher.cjs` | Filesystem path uses the hyphenated server identity. |
| Database directory | `.opencode/.spec-kit/code-graph/database/` | `INSTALL_GUIDE.md §7` | Shared spec-kit data dir; folder name uses `code-graph` (skill-domain) to keep the path readable across runtimes. |
| Plugin bridge file | `mk-code-graph-bridge.mjs` | `.opencode/plugins/` (if present) | Matches the `code-graph` domain word and the symmetry pattern used by `system-skill-advisor` (whose plugin bridge is `mk-skill-advisor-bridge.mjs`). |
| Hook source location | `.opencode/skills/system-spec-kit/mcp_server/hooks/` | Hook source tree | Asymmetric vs the skill-owned hook pattern. See §4 below. |

---

<!-- /ANCHOR:2-name-map -->

<!-- ANCHOR:3-mcp-server-name-stability -->
## 3. MCP SERVER NAME STABILITY (`mk-code-index` vs `system-code-graph`)

The MCP server name `mk-code-index` is a stable tool contract. Renaming the server to match the skill folder slug (`system-code-graph`) would invalidate every config entry across all six runtimes (OpenCode, Claude Code, Codex, Gemini, Devin, VSCode) and would break every saved tool call ID (`mcp__mk_code_index__*`) in agent transcripts, memory records, and dispatched task logs.

ADR-002 settled this: the **skill folder slug** describes what the skill is for; the **MCP server name** is the runtime identity contract; the two are allowed to diverge and the project tolerates the asymmetry in exchange for tool-call stability.

### What this means in practice

- New docs that talk about the skill as a concept use `system-code-graph`.
- New docs that talk about MCP invocation use `mk-code-index` (server name) or `mk_code_index` (config key).
- Tool call IDs always start with `mcp__mk_code_index__`.

---

<!-- /ANCHOR:3-mcp-server-name-stability -->

<!-- ANCHOR:4-hook-location-asymmetry -->
## 4. HOOK LOCATION ASYMMETRY (vs skill-advisor)

SessionStart hooks for code-graph (`session-prime.ts`, `session-start.ts`, and their downstream helpers) live under `.opencode/skills/system-spec-kit/mcp_server/hooks/`, NOT under `.opencode/skills/system-code-graph/hooks/`. This is an intentional asymmetry vs the `system-skill-advisor` pattern where hooks are skill-owned (ADR-001 for skill-advisor).

### Why hooks stayed in spec-kit

- The hook path is referenced by **110+ files** across the repo, including `.claude/settings.local.json`, runtime config bootstrap paths, build config dependencies, and other skill manifests.
- Migrating the path would be a high-risk breaking change with no immediate operational benefit. The hooks reach code-graph data through the stable boundary at `system-spec-kit/mcp_server/lib/code-graph-boundary.ts`.
- A future migration would need its own packet with build and config redesign scope; it is currently deferred.

### Implication for code-graph maintainers

When editing SessionStart-related code that needs to read or write code-graph state, look in `system-spec-kit/mcp_server/hooks/` and `system-spec-kit/mcp_server/lib/code-graph-boundary.ts`, not `system-code-graph/mcp_server/`.

---

<!-- /ANCHOR:4-hook-location-asymmetry -->

<!-- ANCHOR:5-database-location -->
## 5. DATABASE LOCATION

The code-graph SQLite triplet (`code-graph.sqlite`, `.sqlite-wal`, `.sqlite-shm`), readiness marker (`.code-graph-readiness.json`), and launcher state (`.mk-code-index-launcher.json`) all live in the shared spec-kit data directory:

```text
.opencode/.spec-kit/code-graph/database/
```

This shared location replaced an earlier skill-local location (`.opencode/skills/system-code-graph/mcp_server/database/`) to support cross-runtime coordination — all six runtimes read and write the same database instead of fragmenting state per-runtime. See `database-path-policy.md` for the full migration record and override rules.

---

<!-- /ANCHOR:5-database-location -->

<!-- ANCHOR:6-related-resources -->
## 6. RELATED RESOURCES

- `database-path-policy.md` — full policy + override rules for the database path.
- `ownership-boundary.md` — what stays in `system-spec-kit` vs `system-code-graph` after extraction.
- `code-graph-readiness-check.md` — readiness contract that the launcher and read-path tools enforce.
- `INSTALL_GUIDE.md` (skill root) — canonical configuration and verification steps for `mk_code_index` setup.

<!-- /ANCHOR:6-related-resources -->
