# Resource Map

## Packet Outputs

| Path | Purpose |
|------|---------|
| `deep-research-config.json` | Loop configuration and lineage binding |
| `deep-research-state.jsonl` | Append-only iteration and synthesis state |
| `deep-research-strategy.md` | Reducer-managed research strategy and next focus |
| `deep-research-findings-registry.json` | Resolved questions, findings, dead ends, and source diversity |
| `deep-research-dashboard.md` | Human-readable convergence and question status |
| `iterations/iteration-001.md` | Finding cluster map |
| `iterations/iteration-002.md` | MCP contract drift and memory correctness |
| `iterations/iteration-003.md` | Metadata drift systemicness |
| `iterations/iteration-004.md` | Security severity and fan-out runtime blast radius |
| `deltas/iter-001.jsonl` through `deltas/iter-004.jsonl` | Machine-readable finding deltas |
| `research.md` | Final synthesis |

## Primary Source Families

| Family | Representative Sources | Used For |
|--------|------------------------|----------|
| Research charter | `009-research-synthesis/spec.md` | Scope, threat model, five key questions |
| Review registries | `001-*` through `008-*` sibling `review/deep-review-findings-registry.json` | Finding clusters and prior severity labels |
| MCP contracts | `mcp_server/tool-schemas.ts`, `schemas/tool-input-schemas.ts`, `handlers/*` | Schema/handler drift |
| Embedding reconcile | `lib/embedders/embedding-reconcile.ts`, `INSTALL_GUIDE.md`, `feature_catalog.md` | Q1 contract drift exemplar |
| Memory retrieval | `lib/search/entity-density.ts`, `query-router.ts`, entity-density tests | Q3 routing impact |
| Atomic save | `handlers/save/atomic-index-memory.ts` | Q3 crash-window ordering |
| Metadata generation | `graph-metadata-parser.ts`, `generate-context.ts`, `generate-description.ts`, `backfill-graph-metadata.ts` | Q2 drift mechanisms |
| 026 docs | `026/spec.md`, `resource-map.md`, `changelog/README.md`, `changelog/000-release-and-program-cleanup/*` | Q2 catalog and progress drift |
| 027 docs | `027/spec.md`, 003-006 child metadata, `005-learning-feedback-reducers/description.json` | Q2 false-complete and renumbering drift |
| Governed scope | `memory-search.ts`, `community-search.ts`, `stage1-candidate-gen.ts` | Q4 scoped retrieval severity |
| Causal graph | `causal-graph.ts`, `causal-edges.ts`, causal tool schemas | Q4 ID-only scope gap |
| Fan-out runtime | `fanout-run.cjs`, `fanout-pool.cjs`, `executor-config.ts` | Q5 exit, concurrency, and iteration override |
| Fan-out artifacts | Sibling `orchestration-summary.json`, `orchestration-status.log`, `fanout-lineage.out`, `executor-audit.log` | Q5 artifact blast radius |

## Finding To Source Map

| Question | Core Evidence |
|----------|---------------|
| Q1 | `tool-schemas.ts:342`, `tool-input-schemas.ts:583`, `embedding-reconcile.ts:299`, `INSTALL_GUIDE.md:737`, `feature_catalog.md:654` |
| Q2 | `graph-metadata-parser.ts:1030`, `graph-metadata-parser.ts:1096`, `026/resource-map.md:24`, `027/spec.md:133`, `027/003.../graph-metadata.json:42`, `027/008.../description.json:2` |
| Q3 | `query-router.ts:247`, `entity-density-commit-hooks.vitest.ts:112`, `atomic-index-memory.ts:362`, `atomic-index-memory.ts:378` |
| Q4 | `memory-search.ts:1000`, `memory-search.ts:1006`, `community-search.ts:101`, `causal-graph.ts:757`, `causal-edges.ts:747`, `009-research-synthesis/spec.md:60` |
| Q5 | `fanout-run.cjs:344`, `fanout-run.cjs:362`, `fanout-pool.cjs:92`, `fanout-pool.cjs:207`, sibling orchestration summaries and ledgers |

## Coverage Notes

The target spec folder had no input `resource-map.md` at lineage init, so this file is emitted from converged deltas and direct source reads. It is not a full repository inventory.

Code Graph was unavailable in this session. Coverage came from `rg`, direct reads, sibling review artifacts, and packet-local iteration state.
