# Resource Map

## Target

`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal`

## Artifact Root

`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/review/lineages/codex-1`

The artifact root was bound directly from `config.fanout_lineage_artifact_dir`. `resolveArtifactRoot` was not executed.

## Source Coverage

| Source | Coverage | Notes |
|---|---|---|
| `handlers/memory-search.ts` | high | Security scope fallback, session ID trust, formatting path |
| `handlers/memory-context.ts` | high | Session lifecycle, strategy options, session-state persistence |
| `handlers/memory-triggers.ts` | medium | Session trust and exact-scope filtering checked |
| `handlers/causal-graph.ts` | high | Manual causal link creation and stats/backfill path |
| `handlers/causal-links-processor.ts` | high | Batch resolution, fuzzy fallback, edge insertion |
| `lib/search/community-search.ts` | high | Community fallback helper has no scope inputs |
| `lib/session/session-manager.ts` | medium | Trusted session contract and rejection behavior |
| `lib/search/session-state.ts` | medium | Retrieval-state keying |
| `lib/storage/causal-edges.ts` | medium | Endpoint FK validation deferred |
| `schemas/tool-input-schemas.ts` | medium | Runtime `memory_causal_stats.backfill` validation |
| `tools/causal-tools.ts` | low | Dispatcher validation and forwarding |
| `tool-schemas.ts` | medium | Public MCP schema drift |
| `context-server.ts` | low | `ListTools` source |
| `tests/relation-backfill-conflict.vitest.ts` | low | Runtime validation test evidence |
| `tests/handler-helpers.vitest.ts` | low | Partial-title causal reference behavior |

## Missing Inputs

- No target `resource-map.md` existed before this lineage.
- Code Graph was unavailable; direct reads and exact grep/glob discovery were used.

## Output Coverage

| Artifact | Purpose |
|---|---|
| `deep-review-config.json` | Lineage configuration and completion status |
| `deep-review-state.jsonl` | Append-only loop state and claim adjudication events |
| `deep-review-findings-registry.json` | Reduced findings registry |
| `deep-review-strategy.md` | Mutable strategy and convergence state |
| `deep-review-dashboard.md` | Human-readable dashboard |
| `deltas/iter-001.jsonl` | Iteration 001 delta record |
| `deltas/iter-002.jsonl` | Iteration 002 delta record |
| `deltas/iter-003.jsonl` | Iteration 003 delta record |
| `deltas/iter-004.jsonl` | Iteration 004 delta record |
| `deltas/iter-005.jsonl` | Iteration 005 delta record |
| `prompts/iteration-001.md` | Iteration 001 prompt record |
| `prompts/iteration-002.md` | Iteration 002 prompt record |
| `prompts/iteration-003.md` | Iteration 003 prompt record |
| `prompts/iteration-004.md` | Iteration 004 prompt record |
| `prompts/iteration-005.md` | Iteration 005 prompt record |
| `logs/fanout-codex-1.log` | Lineage execution log |
| `iterations/iteration-001.md` | Correctness pass |
| `iterations/iteration-002.md` | Security pass |
| `iterations/iteration-003.md` | Security follow-up and traceability pass |
| `iterations/iteration-004.md` | Maintainability pass |
| `iterations/iteration-005.md` | Stabilization pass |
| `review-report.md` | Final synthesis |
