---
title: "System Code Graph Native Bootstrap"
description: "Installation, configuration, verification, and operator notes for the standalone mk-code-index MCP server providing structural AST indexing, blast-radius analysis, neighborhood context, and change detection."
trigger_phrases:
  - "install mk-code-index"
  - "install system-code-graph"
  - "mk-code-index install"
  - "code graph install"
  - "system code graph bootstrap"
  - "mk_code_index install"
---

# System Code Graph Native Bootstrap

<!-- sk-doc-template: skill_reference_install_guide -->

This is the canonical bootstrap guide for the standalone System Code Graph MCP server. The server runs as `mk_code_index` (filesystem key `mk-code-index`), separate from `mk-spec-memory` and `mk_skill_advisor`, while exposing the public tool ids `code_graph_scan`, `code_graph_query`, `code_graph_classify_query_intent`, `code_graph_status`, `code_graph_context`, `code_graph_verify`, `code_graph_apply`, `detect_changes`, `code_graph_status`, `code_graph_scan`, and `code_graph_verify`.

---

## 0. AI-FIRST INSTALL GUIDE

Copy and paste this prompt to your AI assistant to get installation help:

```
I want to install the System Code Graph MCP server (mk_code_index) from .opencode/skills/system-code-graph

Please help me:
1. Verify I have Node.js >=20.11.0 and npm installed
2. Install dependencies and build the standalone TypeScript MCP server
3. Confirm the compiled entrypoint exists at mcp_server/dist/index.js
4. Add the mk_code_index server entry to my runtime config (I'm using: [OpenCode / Claude Code / Codex / Gemini])
5. Verify code_graph_status, code_graph_scan, and code_graph_verify respond

Guide me through each step with the exact commands I need to run.
```

Your AI assistant will:
- Verify Node.js >=20.11.0 and npm are available
- Install and build the standalone code-graph MCP server
- Confirm the launcher and compiled entrypoint are present
- Configure `mk_code_index` for your runtime (the five INDEX_* flags ship `false` for a quiet, low-disk index)
- Confirm the 8 structural tools register and respond

**Expected setup time:** 3-5 minutes

---

## 1. OVERVIEW

System Code Graph is a TypeScript MCP server under `.opencode/skills/system-code-graph/mcp_server/` that registers the `mk-code-index` server identity. The runtime package is published privately as `@spec-kit/system-code-graph` and ships a Node launcher at `.opencode/bin/mk-code-index-launcher.cjs`. The launcher boots the compiled entrypoint at `mcp_server/dist/index.js` after loading `.env.local` overrides, applying the optional maintainer-mode flag, and guarding the database path against external locations.

The server is runtime-standalone: it does not depend on `mk-spec-memory` being installed or running first. Its database lives at `.opencode/.spec-kit/code-graph/database/code-graph.sqlite`, shared across runtimes and auto-migrated from the legacy skill-local location on first launch.

Public MCP namespace: `mcp__mk_code_index__*`. Hyphens in the server name become underscores in the namespace prefix per MCP convention.

| Field | Value |
|---|---|
| Skill version | `1.0.3.1` |
| Runtime package | `@spec-kit/system-code-graph` |
| Server name | `mk-code-index` |
| Config key | `mk_code_index` |
| Launcher | `.opencode/bin/mk-code-index-launcher.cjs` |
| Entry point | `.opencode/skills/system-code-graph/mcp_server/dist/index.js` |
| Database (default) | `.opencode/.spec-kit/code-graph/database/code-graph.sqlite` |
| MCP tools | 8 (see [README.md](./README.md) §3.2) |

---

## 2. PREREQUISITES

- Node.js >= 20.11.0 (matches `mcp-doctor.sh` minimum threshold; check with `node --version`).
- npm available on PATH.
- Repository root as the current working directory.
- Runtime MCP configuration with an entry for `mk_code_index` in the active config (one of: `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.gemini/settings.json`, `.devin/config.json`, `.vscode/mcp.json`).

`mk-spec-memory` is NOT a prerequisite. Code Graph does not need the memory MCP server to be running first. The TypeScript build emits only this package's runtime files under `mcp_server/dist/`.

---

## 3. INSTALLATION

Install dependencies and build the standalone TypeScript MCP server:

```bash
npm --prefix .opencode/skills/system-code-graph install
npm --prefix .opencode/skills/system-code-graph run build
```

Verify the compiled entrypoint exists:

```bash
test -f .opencode/skills/system-code-graph/mcp_server/dist/index.js && echo "Installed"
```

The launcher is already committed at `.opencode/bin/mk-code-index-launcher.cjs` and does not need a separate install step. Start or refresh the `mk_code_index` MCP server in the active runtime after build.

---

## 4. CONFIGURATION

Each runtime expects an MCP server entry with the same launcher invocation. The canonical block (from `opencode.json`) is:

```json
{
  "mcp": {
    "mk_code_index": {
      "type": "local",
      "command": ["node", ".opencode/bin/mk-code-index-launcher.cjs"],
      "environment": {
        "_NOTE_1_DB": "Database lives at .opencode/.spec-kit/code-graph/database/code-graph.sqlite by default; SPECKIT_CODE_GRAPH_DB_DIR overrides.",
        "_NOTE_2_TOOLS": "Registers 8 tools: code_graph_scan/query/classify_query_intent/context/status/verify/apply, detect_changes. MCP namespace: mcp__mk_code_index__*",
        "_NOTE_3_INDEX_DEFAULTS": "INDEX_* committed defaults are false (end-user safe). Maintainer mode: set SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true in .env.local (gitignored); the launcher will force all 5 INDEX_* to true at startup.",
        "SPECKIT_CODE_GRAPH_INDEX_SKILLS": "false",
        "SPECKIT_CODE_GRAPH_INDEX_AGENTS": "false",
        "SPECKIT_CODE_GRAPH_INDEX_COMMANDS": "false",
        "SPECKIT_CODE_GRAPH_INDEX_SPECS": "false",
        "SPECKIT_CODE_GRAPH_INDEX_PLUGINS": "false"
      }
    }
  }
}
```

Equivalent TOML for `.codex/config.toml`:

```toml
[mcp_servers.mk_code_index]
command = "node"
args = [".opencode/bin/mk-code-index-launcher.cjs"]

[mcp_servers.mk_code_index.env]
_NOTE_1_DB = "Database lives at .opencode/.spec-kit/code-graph/database/code-graph.sqlite by default; SPECKIT_CODE_GRAPH_DB_DIR overrides."
_NOTE_2_TOOLS = "Registers 8 tools: code_graph_scan/query/classify_query_intent/context/status/verify/apply, detect_changes. MCP namespace: mcp__mk_code_index__*"
SPECKIT_CODE_GRAPH_INDEX_SKILLS = "false"
SPECKIT_CODE_GRAPH_INDEX_AGENTS = "false"
SPECKIT_CODE_GRAPH_INDEX_COMMANDS = "false"
SPECKIT_CODE_GRAPH_INDEX_SPECS = "false"
SPECKIT_CODE_GRAPH_INDEX_PLUGINS = "false"
```

Runtime-config locations:

| Runtime | Path |
|---|---|
| OpenCode | `opencode.json` |
| Claude Code | `.claude/mcp.json` |
| Codex CLI | `.codex/config.toml` |
| Gemini CLI | `.gemini/settings.json` |
| Devin CLI | `.devin/config.json` |
| VSCode | `.vscode/mcp.json` |

The five `SPECKIT_CODE_GRAPH_INDEX_*` flags ship as `false` so end users get a quiet, low-disk index. Maintainers who need full structural coverage enable them via maintainer mode (see [§7](#7-database-and-maintainer-mode)).

---

## 5. VERIFICATION

Verify native tool registration through `mk_code_index`:

```text
mcp__mk_code_index__code_graph_status({})
mcp__mk_code_index__code_graph_scan({ "incremental": true })
mcp__mk_code_index__code_graph_verify({})
```

Expected:

- `code_graph_status` returns `readiness`, `canonicalReadiness`, `trustState`, `lastScanAt`, `schemaVersion`, and graph-quality metadata.
- `code_graph_scan` returns scan metadata with updated file, node, and edge counts. Use `incremental: false` when the stored scope fingerprint differs from the requested scope.
- `code_graph_verify` returns gold-query battery results once a fresh scan has populated the graph.

Also verify the active runtime lists `mk_code_index` alongside `mk-spec-memory` and `mk_skill_advisor` (the three core native MCP servers shipped by this repository).

---

## 6. NATIVE PACKAGE CHECKS

Run before declaring bootstrap complete:

```bash
.opencode/skills/system-code-graph/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-code-graph/tsconfig.json
test ! -e .opencode/skills/system-code-graph/dist
node -e "import('./.opencode/skills/system-code-graph/mcp_server/dist/tool-schemas.js')"
.opencode/skills/system-code-graph/node_modules/.bin/vitest --config .opencode/skills/system-code-graph/vitest.config.ts --run code-graph
```

Current code-graph baseline:

| Metric | Expected |
| --- | --- |
| Active MCP tools | 8 |
| TypeScript build | Exit 0 from `tsc --build` |
| Vitest focused run | Pass on the `code-graph` suite (runtime-detection + structural-contract + handler suites) |
| Standalone-storage guard | Launcher rejects DB paths outside the workspace |
| Dist boundary | Root-level `dist/` is absent. Build output lives under `mcp_server/dist/`. |
| Production sibling imports | 0 relative imports from `system-spec-kit` or `system-skill-advisor` production source. Test fixtures may still model integration boundaries. |

---

## 7. DATABASE AND MAINTAINER MODE

### Database location

Default: `.opencode/.spec-kit/code-graph/database/code-graph.sqlite`.

Override with `SPECKIT_CODE_GRAPH_DB_DIR` (env var or `.env.local`). The launcher enforces a standalone-storage guard: the override must resolve inside the workspace root. External absolute paths are rejected at startup.

### Migration

Legacy installs (database at `.opencode/skills/system-code-graph/mcp_server/database/`) are auto-migrated to the standalone shared location on next launch. The legacy database file is preserved as a backup; the launcher copies (does not move) the SQLite triplet, readiness marker, and launcher state file.

### Indexing scope flags

| Flag | Default | Effect |
|---|---|---|
| `SPECKIT_CODE_GRAPH_INDEX_SKILLS` | `false` | Include `.opencode/skills/**`. Also accepts comma-separated `sk-*` allowlist (e.g. `sk-doc,sk-git`). |
| `SPECKIT_CODE_GRAPH_INDEX_AGENTS` | `false` | Include `.opencode/agents/**`. |
| `SPECKIT_CODE_GRAPH_INDEX_COMMANDS` | `false` | Include `.opencode/commands/**`. |
| `SPECKIT_CODE_GRAPH_INDEX_SPECS` | `false` | Include `<active-spec-folder>/**`. |
| `SPECKIT_CODE_GRAPH_INDEX_PLUGINS` | `false` | Include `.opencode/plugins/**`. |

End-user defaults are all `false` so the indexer is quiet and the SQLite file stays small. Per-call `code_graph_scan` arguments (`includeSkills`, `includeAgents`, `includeCommands`, `includeSpecs`, `includePlugins`) override the env defaults for one-shot scans.

### Maintainer mode

Maintainers who index the full repo set:

```bash
echo 'SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true' >> .env.local
```

`.env.local` is gitignored. The launcher reads it on startup, and when the flag is `true` it forces all 5 `SPECKIT_CODE_GRAPH_INDEX_*` flags to `true` before spawning the server, overriding any committed `false` values from the runtime config. Per-call scan args still override.

---

## 8. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| Launcher exits with "standalone-storage guard violation" | `SPECKIT_CODE_GRAPH_DB_DIR` resolves outside the workspace. | Use a path inside the repo, or unset the override. |
| `requiredAction: "code_graph_scan"` in tool responses | Graph is stale, missing, or scope-mismatched. | Run `code_graph_scan` with the intended scope. Use `incremental: false` for scope changes. |
| Skill files do not appear in scan results | `.opencode/skills/**` is excluded by default. | Set `includeSkills: true` per-call, or set `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` (or enable maintainer mode). |
| `parserHealth: "quarantined"` | Parser failures were added to the skip-list. | Inspect `parserSkipList.sample` from `code_graph_status`, then repair or accept the quarantine. |
| Unknown MCP tool error mentions `mk-code-index` | Tool name not registered in `mcp_server/tools/code-graph-tools.ts`. | Add the schema, handler export, and dispatch case in one change. |
| Config still uses `system_code_graph` namespace | Pre-packet-010 config not updated. | Rename the entry to `mk_code_index`, point at `.opencode/bin/mk-code-index-launcher.cjs`, and use `mcp__mk_code_index__*` for all tool references. |
| Root-level `.opencode/skills/system-code-graph/dist/` exists | Stale pre-cleanup build output is still present. | Run `npm --prefix .opencode/skills/system-code-graph run clean && npm --prefix .opencode/skills/system-code-graph run build`. |
| `/doctor:mcp debug --server mk_code_index` fails `root_dist_absent` | Doctor detected stale root-level build output. | Run `/doctor:mcp debug --server mk_code_index --fix`, or run the clean and build commands above manually. |
| Cross-runtime config audit needed | Want to verify all 6 runtimes are consistent. | `for f in opencode.json .claude/mcp.json .codex/config.toml .gemini/settings.json .devin/config.json .vscode/mcp.json; do printf '%-30s ' "$f"; grep -c 'mk_code_index\|mk-code-index' "$f"; done` should show >= 1 hit per file. |
| `/doctor:mcp install --server mk_code_index` fails with "Unknown server" | `doctor_mcp_install.yaml` was not updated to include `mk_code_index` in `valid_values`. | Run `/doctor:update` to refresh subsystem coverage, or patch `valid_values` directly. |

Runtime diagnostics are available via the `/doctor code-graph` slash-command surface (read-only Phase A by default). See `.opencode/install_guides/SET-UP - Code Graph.md` for the full diagnostic walkthrough.

---

## 9. RELATED RESOURCES

| Document | Purpose |
| --- | --- |
| [README.md](./README.md) | Skill overview, quick start, tool reference, FAQ. |
| [SKILL.md](./SKILL.md) | Runtime routing instructions and invariants. |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture, dependency direction, subsystem boundaries. |
| [feature_catalog/feature_catalog.md](./feature_catalog/feature_catalog.md) | Current feature inventory. |
| [manual_testing_playbook/manual_testing_playbook.md](./manual_testing_playbook/manual_testing_playbook.md) | Operator validation scenarios. |
| [`SET-UP - Code Graph.md`](../../install_guides/SET-UP%20-%20Code%20Graph.md) | Runtime diagnostics via `/doctor code-graph` (Phase A read-only). |
| [`.opencode/install_guides/README.md`](../../install_guides/README.md) | Master install guide, Phase 3 §10.4 mk-code-index subsection. |
