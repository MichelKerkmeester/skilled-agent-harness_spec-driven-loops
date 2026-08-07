---
title: "Iter 011 — Track 6: system-skill-advisor/mcp_server/README.md target scope"
iteration: 11
track: 6
focus: "system-skill-advisor/mcp_server/README.md target scope"
status: complete
newInfoRatio: 1.00
findings: 7
timestamp: 2026-05-15T17:26:31Z
---

## Iter 011 Findings

### 1. ARCHITECTURE diagram concept

```text
╭──────────────────────────────────────────────────────────────────╮
│                 SKILL ADVISOR MCP SERVER                         │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌──────────────────┐      ┌─────────────────┐
│ MCP clients  │ ───▶ │ advisor-server.ts │ ───▶ │ tools/          │
│ hooks / CLI  │      │ transport layer  │      │ tool dispatch   │
└──────┬───────┘      └────────┬─────────┘      └────────┬────────┘
       │                       │                         │
       │                       ▼                         ▼
       │              ┌──────────────────┐      ┌─────────────────┐
       └───────────▶  │ handlers/         │ ───▶ │ lib/            │
                      │ tool execution   │      │ runtime helpers │
                      └────────┬─────────┘      └────────┬────────┘
                               │                         │
                               ▼                         ▼
                      ┌──────────────────┐      ┌─────────────────┐
                      │ lib/skill-graph/ │ ───▶ │ database/      │
                      │ SQLite queries   │      │ skill-graph.sqlite│
                      └──────────────────┘      └─────────────────┘

Dependency direction:
advisor-server ───▶ tools ───▶ handlers ───▶ lib/skill-graph ───▶ database
handlers ───▶ lib modules (scorer, freshness, daemon, derived, etc.)
lib modules ───▶ schemas and shared helpers
```

### 2. PACKAGE TOPOLOGY

Allowed direction:
```text
tools/ → handlers/ → lib/
handlers/ → schemas/
lib/ → database/
scripts/ → lib/
tests/ → lib/, handlers/, schemas/
```

Disallowed direction:
```text
lib/ → tools/ (no MCP registration in lib)
lib/ → tests/ (no test dependencies in runtime code)
database/ → handlers/ (database is passive storage layer)
schemas/ → handlers/ (schemas are contracts, not orchestration)
```

### 3. DIRECTORY TREE

```text
mcp_server/
+-- advisor-server.ts              # MCP server entrypoint and transport layer
+-- tools/                         # MCP tool definitions and dispatch
│   +-- advisor-recommend.ts
│   +-- advisor-rebuild.ts
│   +-- advisor-status.ts
│   +-- advisor-validate.ts
│   +-- skill-graph-tools.ts
│   +-- advisor-contract-keys.ts
│   +-- types.ts
│   +-- index.ts
│   `-- README.md
+-- handlers/                      # MCP tool handlers (thin orchestration)
│   +-- advisor-recommend.ts
│   +-- advisor-rebuild.ts
│   +-- advisor-status.ts
│   +-- advisor-validate.ts
│   +-- skill-graph/
│   │   +-- scan.ts
│   │   +-- query.ts
│   │   +-- status.ts
│   │   +-- validate.ts
│   │   +-- propagate-enhances.ts
│   │   +-- response-envelope.ts
│   │   +-- index.ts
│   │   `-- README.md
│   +-- index.ts
│   `-- README.md
+-- lib/                          # Runtime helpers and business logic
│   +-- skill-graph/
│   │   +-- skill-graph-db.ts
│   │   +-- skill-graph-queries.ts
│   │   `-- README.md
│   +-- scorer/
│   │   +-- lanes/
│   │   +-- ablation.ts
│   │   +-- age-policy.ts
│   │   +-- aliases.ts
│   │   +-- ambiguity.ts
│   │   +-- attribution.ts
│   │   +-- fusion.ts
│   │   +-- lane-registry.ts
│   │   `-- README.md
│   +-- auth/
│   │   +-- trusted-caller.ts
│   │   `-- README.md
│   +-- compat/
│   │   +-- advisor-status-reader.ts
│   │   +-- contract.ts
│   │   +-- daemon-probe.ts
│   │   +-- redirect-metadata.ts
│   │   `-- README.md
│   +-- context/
│   │   +-- caller-context.ts
│   │   `-- README.md
│   +-- corpus/
│   │   +-- df-idf.ts
│   │   `-- README.md
│   +-- cross-skill-edges/
│   │   +-- apply-graph-metadata-patch.ts
│   │   +-- context-template.ts
│   │   +-- detect-inbound-enhances.ts
│   │   +-- index.ts
│   │   +-- metadata-loader.ts
│   │   +-- types.ts
│   │   `-- README.md
│   +-- daemon/
│   │   +-- lease.ts
│   │   +-- lifecycle.ts
│   │   +-- state-mutation.ts
│   │   +-- watcher-orchestrator.ts
│   │   +-- watcher.ts
│   │   `-- README.md
│   +-- derived/
│   │   +-- anti-stuffing.ts
│   │   +-- extract.ts
│   │   +-- provenance.ts
│   │   +-- sanitizer.ts
│   │   +-- sync.ts
│   │   +-- trust-lanes.ts
│   │   `-- README.md
│   +-- freshness/
│   │   +-- cache-invalidation.ts
│   │   +-- generation.ts
│   │   +-- rebuild-from-source.ts
│   │   +-- sqlite-integrity.ts
│   │   +-- trust-state-values.ts
│   │   +-- trust-state.ts
│   │   `-- README.md
│   +-- lifecycle/
│   │   +-- age-haircut.ts
│   │   +-- archive-handling.ts
│   │   +-- rollback.ts
│   │   +-- schema-migration.ts
│   │   +-- status-values.ts
│   │   +-- supersession.ts
│   │   `-- README.md
│   +-- shadow/
│   │   +-- shadow-sink.ts
│   │   `-- README.md
│   +-- advisor-runtime-values.ts
│   +-- affordance-normalizer.ts
│   +-- error-diagnostics.ts
│   +-- freshness.ts
│   +-- generation.ts
│   +-- metrics.ts
│   +-- normalize-adapter-output.ts
│   +-- prompt-cache.ts
│   +-- prompt-policy.ts
│   +-- render.ts
│   `-- README.md
+-- schemas/                      # TypeScript and JSON contracts
│   +-- advisor-tool-schemas.ts
│   +-- compat-contract.json
│   +-- daemon-status.ts
│   +-- generation-metadata.ts
│   +-- skill-derived-v2.ts
│   `-- README.md
+-- database/                     # SQLite runtime state
│   +-- skill-graph.sqlite
│   +-- .mk-skill-advisor-launcher.json
│   `-- README.md
+-- data/                         # Data files (shadow deltas)
│   +-- shadow-deltas.jsonl
│   `-- README.md
+-- compat/                       # Package-level compatibility export
│   +-- index.ts
│   `-- README.md
+-- bench/                        # Benchmark suites and baselines
│   +-- code-graph-parse-latency.bench.ts
│   +-- code-graph-query-latency.baseline.json
│   +-- code-graph-query-latency.bench.ts
│   +-- hook-brief-signal-noise.bench.ts
│   +-- latency-bench.ts
│   +-- scorer-bench.ts
│   +-- scorer-calibration-baseline.json
│   +-- scorer-calibration.bench.ts
│   +-- watcher-benchmark.ts
│   `-- README.md
+-- tests/                        # Vitest regression suites
│   +-- __shared__/
│   +-- cache/
│   +-- compat/
│   +-- fixtures/
│   +-- handlers/
│   +-- hooks/
│   +-- legacy/
│   +-- parity/
│   +-- python/
│   +-- schemas/
│   +-- scorer/
│   +-- *.vitest.ts
│   +-- *.test.ts
│   `-- README.md
+-- scripts/                      # Python CLI and utilities
│   +-- check-prompt-quality-card-sync.sh
│   +-- init-skill-graph.sh
│   +-- skill_advisor.py
│   +-- skill_advisor_bench.py
│   +-- skill_advisor_regression.py
│   +-- skill_advisor_runtime.py
│   +-- skill_graph_compiler.py
│   +-- skill-graph.json
│   +-- fixtures/
│   +-- routing-accuracy/
│   +-- out/
│   `-- README.md
+-- README.md
```

### 4. KEY FILES

| File | Responsibility |
|---|---|
| `advisor-server.ts` | MCP server entrypoint, transport layer, tool registration, daemon lifecycle management (lines 1-262) |
| `tools/index.ts` | Tool definition registry and dispatch router for 9 public tools (lines 1-70) |
| `tools/skill-graph-tools.ts` | Skill graph tool definitions (scan, query, status, validate, propagate_enhances) (lines 1-143) |
| `handlers/index.ts` | Re-exports all handler entrypoints for advisor and skill-graph operations (lines 1-14) |
| `lib/skill-graph/skill-graph-db.ts` | SQLite schema initialization, metadata indexing, stats and row mapping (lib/skill-graph/README.md lines 38) |
| `lib/skill-graph/skill-graph-queries.ts` | Prepared graph relationship queries (depends_on, dependents, enhances, etc.) (lib/skill-graph/README.md lines 39) |
| `lib/scorer/` | Native scoring implementation with lane-based attribution and calibration (lib/README.md lines 89) |
| `lib/daemon/lifecycle.ts` | Advisor daemon startup, shutdown and lifecycle orchestration (lib/daemon/README.md) |

### 5. BOUNDARIES AND FLOW

Boundary table:
| Boundary | Rule |
|---|---|
| Transport → Tools | advisor-server.ts imports and dispatches through tools/index.ts |
| Tools → Handlers | tools/ dispatches to handlers/ for business logic |
| Handlers → Lib | handlers/ call lib/ modules for scoring, freshness, daemon logic |
| Lib → Database | lib/skill-graph/ reads/writes database/skill-graph.sqlite |
| Lib → Schemas | lib/ modules import schema contracts from schemas/ |
| Scripts → Lib | scripts/ may read advisor data and call lib/ helpers |
| Tests → Runtime | tests/ import lib/, handlers/, schemas/ for coverage |

Tool invocation flow:
```text
MCP tool request
  → advisor-server.ts (transport layer)
  → tools/index.ts (dispatch router)
  → handlers/* (orchestration layer)
  → lib/* (business logic: scorer, freshness, daemon, skill-graph)
  → database/skill-graph.sqlite (persistent storage)
  → schemas/* (contract validation)
  → response envelope (redacted output)
```

### 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `advisor-server.ts` | MCP server | Main MCP server entrypoint, registers tools, manages daemon lifecycle |
| `advisor_recommend` | Tool | Returns skill recommendations for a given prompt (tools/advisor-recommend.ts) |
| `advisor_rebuild` | Tool | Rebuilds the advisor index from skill metadata (tools/advisor-rebuild.ts) |
| `advisor_status` | Tool | Reports advisor health, daemon state and freshness status (tools/advisor-status.ts) |
| `advisor_validate` | Tool | Validates advisor configuration and metadata (tools/advisor-validate.ts) |
| `skill_graph_scan` | Tool | Indexes or re-indexes skill metadata into SQLite (tools/skill-graph-tools.ts lines 21-32) |
| `skill_graph_query` | Tool | Queries skill graph relationships (dependencies, enhances, hubs, etc.) (tools/skill-graph-tools.ts lines 34-52) |
| `skill_graph_status` | Tool | Reports skill graph health and statistics (tools/skill-graph-tools.ts lines 54-58) |
| `skill_graph_validate` | Tool | Validates skill graph for schema drift, broken edges, cycles (tools/skill-graph-tools.ts lines 60-64) |
| `skill_graph_propagate_enhances` | Tool | Detects and applies missing inbound enhances edges (tools/skill-graph-tools.ts lines 66-83) |

### 7. VALIDATION

npm test command:
```bash
npm test -- --runInBand
```
(Source: lib/skill-graph/README.md lines 57-58)

sk-doc validate (for README files):
```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp_server/[subfolder]/README.md
```
(Applied to: lib/, handlers/, bench/, compat/, data/, tests/, scripts/, schemas/ - each README.md cites this pattern)

ITER_011_COMPLETE: 7 findings, newInfoRatio=1.00
