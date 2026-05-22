---
name: deep-loop-runtime
version: 1.0.0
description: "Shared deep-loop runtime infrastructure for deep-review + deep-research: executor config, prompt-pack rendering, post-dispatch validation, atomic state, JSONL repair, loop locking, permissions, Bayesian scoring, fallback routing, coverage-graph schema + query + signals."
allowed-tools: [Bash, Read, Glob, Grep]
---

# Deep Loop Runtime

Shared runtime infrastructure for the deep-review and deep-research loop workflows. The 118 FULL_ISOLATE_NO_MCP arc moved the shared runtime libraries, coverage-graph ownership, script entry points, SQLite storage, and runtime tests into this peer skill.

## 1. WHEN TO USE

This skill is consumed by deep-review and deep-research workflow YAML and script paths, not invoked directly as a user-facing workflow.

Use it when a deep-loop workflow needs shared runtime support for:

- executor configuration and audit metadata
- prompt-pack rendering
- post-dispatch validation
- atomic state files and JSONL repair
- loop locking and permissions gates
- Bayesian scoring and fallback routing
- coverage-graph schema, query, and signal interpretation

## 2. SCOPE

In scope:

- runtime libraries under `lib/deep-loop/`
- coverage-graph runtime libraries under `lib/coverage-graph/`
- `.cjs` script entry points under `scripts/`
- runtime-owned SQLite storage under `storage/`
- runtime tests under `tests/`

Out of scope:

- MCP tool registration
- MCP handler ownership
- DB lifecycle inside `system-spec-kit/mcp_server/`
- direct user command routing

## 3. ARCHITECTURE

- `lib/deep-loop/` holds shared deep-loop runtime libraries.
- `lib/coverage-graph/` holds coverage-graph schema, query, and signal helpers.
- `scripts/` holds `.cjs` entry points used by workflow YAML and collateral commands.
- `storage/` owns relocated runtime SQLite artifacts.
- `tests/` holds runtime-owned tests split from the MCP server surface.

Shipped layout:

| Path | Populated By | Purpose |
|------|--------------|---------|
| `lib/deep-loop/` | 10 files | Shared executor config, audit, prompt-pack, validation, state, repair, locking, permissions, scoring, and fallback routing. |
| `lib/coverage-graph/` | 3 files | Coverage-graph schema owner, query helpers, and signal interpretation. |
| `scripts/` | 4 files | Direct `status`, `query`, `upsert`, and `convergence` entry points replacing the removed deep-loop MCP tools. |
| `storage/` | SQLite | Runtime-owned `deep-loop-graph.sqlite`. |
| `tests/` | Unit, integration, lifecycle | Runtime-owned tests discovered by the system-spec-kit MCP server Vitest config. |

## 4. INTEGRATION POINTS

- 117 ADR-001: original AI Council SPLIT ruling. Superseded for the 118 arc by user directive.
- 118 ADR-001: FULL_ISOLATE_NO_MCP. Moves deep-loop runtime, coverage-graph schema/query/signals, script entry points, storage, and tests into this peer skill while removing the deep-loop MCP tool surface.
- Deep-review and deep-research workflow YAML call this runtime through script entry points once phase 003 lands.

## 5. REFERENCES

- 118 phase 003: script shim and DB relocation.
- 118 phase 004: MCP tool surface removal.
- 118 phase 008: v1.0.0 closeout, changelog, and resource-map updates.
