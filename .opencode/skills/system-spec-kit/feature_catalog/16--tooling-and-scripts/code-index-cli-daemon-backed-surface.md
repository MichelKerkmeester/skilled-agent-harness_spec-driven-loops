---
title: "Daemon-backed code-index CLI surface"
description: "Dual-stack CLI front door over the mk-code-index daemon, with manifest-backed commands, warm-only fallback reads, and blocked maintenance paths for prompt-time usage."
trigger_phrases:
  - "daemon-backed code-index CLI surface"
  - "code-index cli"
  - "code_graph_status warm-only cli"
  - "mk-code-index CLI front door"
---

# Daemon-backed code-index CLI surface

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The code graph daemon ships a CLI front door at `node .opencode/bin/code-index.cjs` over the same daemon/IPC transport used by MCP.

The CLI gives hooks, doctor probes, and transport-down recovery a read path when the daemon is already warm. Prompt-time callers use warm-only probing so they do not cold-spawn the daemon.

---

## 2. HOW IT WORKS

The stable shim performs socket and dist-freshness guardrails, then delegates to the TypeScript CLI entrypoint. The manifest defines the allowed code-index command surface, and calls are sent over IPC to the daemon rather than importing code graph internals in-process.

Runtime integrations call read paths with `--warm-only --timeout-ms`. Maintenance operations remain blocked from prompt-time hook fallback, preserving the code graph readiness contract and avoiding surprise scans or destructive applies.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/bin/code-index.cjs` | Script | Stable executable shim for the code-index CLI |
| `.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts` | CLI entrypoint | IPC command execution, output rendering, and warm-only behavior |
| `.opencode/skills/system-code-graph/mcp_server/code-index-cli-manifest.ts` | CLI manifest | Command definitions and maintenance/read classification |
| `.opencode/plugins/mk-code-graph.js` | Plugin bridge | OpenCode bridge using CLI/IPC instead of in-process imports |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-parity.vitest.ts` | Automated test | CLI/MCP parity coverage |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-blocked-read.vitest.ts` | Automated test | Blocked readiness/read behavior coverage |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-dual-client.vitest.ts` | Automated test | MCP and CLI concurrent client coverage |
| `.opencode/skills/system-code-graph/feature_catalog/06--mcp-tool-surface/code-index-cli.md` | Catalog | Owning system-code-graph feature entry |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/code-index-cli-daemon-backed-surface.md`

Related references:
- [spec-memory-cli-daemon-backed-surface.md](spec-memory-cli-daemon-backed-surface.md) - Spec-memory CLI sibling surface
- [skill-advisor-cli-daemon-backed-surface.md](skill-advisor-cli-daemon-backed-surface.md) - Skill-advisor CLI sibling surface
