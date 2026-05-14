---
title: "System Skill Advisor MCP Server"
description: "Standalone package home for skill-advisor handlers, libraries, schemas, scripts, tests, benchmarks, and database ownership."
trigger_phrases:
  - "system skill advisor mcp server"
  - "advisor mcp server"
  - "advisor standalone package"
---

# System Skill Advisor MCP Server

This directory now owns the advisor implementation that previously lived inside the Spec Kit MCP server tree.

## Structure

- `handlers/`: MCP handler implementations for `advisor_recommend`, `advisor_status`, `advisor_rebuild`, and `advisor_validate`.
- `lib/`: scorer, daemon, freshness, lifecycle, compatibility, corpus, derived-metadata, auth, shadow, and utility modules.
- `tools/`: advisor tool dispatch and package-local registration helpers.
- `schemas/`: Zod contracts and compatibility schemas for advisor inputs, outputs, and derived metadata.
- `scripts/`: Python compatibility runtime, graph compiler, routing-accuracy corpus tooling, fixtures, and generated script outputs.
- `compat/`: TypeScript bridge surface for compatibility consumers.
- `tests/`: Vitest and Python coverage for handlers, scorer behavior, schema contracts, compatibility, parity, cache, hook, and legacy regression cases.
- `bench/`: calibration, latency, watcher, scorer, and code-graph benchmark harnesses.
- `data/`: package-local runtime data such as shadow deltas.
- `database/`: package-local `skill-graph.sqlite` and its WAL/SHM companions.

The existing Spec Kit memory MCP server can still import these modules during the bridge window. Public advisor tool ids stay unchanged.
