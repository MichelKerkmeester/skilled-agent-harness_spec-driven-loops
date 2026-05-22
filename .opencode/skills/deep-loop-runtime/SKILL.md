---
name: deep-loop-runtime
version: 0.1.0
description: "Shared deep-loop runtime infrastructure for deep-review + deep-research: executor config, prompt-pack rendering, post-dispatch validation, atomic state, JSONL repair, loop locking, permissions, Bayesian scoring, fallback routing, coverage-graph schema + query + signals."
allowed-tools: [Bash, Read, Glob, Grep]
---

# Deep Loop Runtime

Shared runtime infrastructure for the deep-review and deep-research loop workflows. Phase 001 creates only the skill scaffold; runtime libraries and executable entry points land in later 118 phases.

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
- `lib/coverage-graph/` holds coverage-graph schema, query, and signal helpers after migration.
- `scripts/` holds `.cjs` entry points used by workflow YAML and collateral commands.
- `storage/` owns relocated runtime SQLite artifacts once phase 003 lands.
- `tests/` holds runtime-owned tests split from the MCP server surface.

Phase ownership:

| Path | Populated By | Purpose |
|------|--------------|---------|
| `lib/deep-loop/` | 118 phase 002 | Move 10 deep-loop runtime `.ts` files. |
| `lib/coverage-graph/` | 118 phase 002 | Move coverage-graph runtime helpers and schema owner per FULL_ISOLATE_NO_MCP. |
| `scripts/` | 118 phase 003 | Add `.cjs` script shims replacing the deep-loop MCP tools. |
| `storage/` | 118 phase 003 | Relocate `deep-loop-graph.sqlite` ownership. |
| `tests/` | 118 phase 007 | Move runtime-focused tests. |

## 4. INTEGRATION POINTS

- 117 ADR-001: original AI Council SPLIT ruling. Superseded for the 118 arc by user directive.
- 118 ADR-001: FULL_ISOLATE_NO_MCP. Moves deep-loop runtime, coverage-graph schema/query/signals, script entry points, storage, and tests into this peer skill while removing the deep-loop MCP tool surface.
- Deep-review and deep-research workflow YAML call this runtime through script entry points once phase 003 lands.

## 5. REFERENCES

- 118 phase 003 ADRs: script shim and DB relocation details once authored.
- 118 phase 004 ADRs: MCP tool surface removal details once authored.
- 118 phase 008 closeout: final version, changelog, and resource-map updates once landed.
