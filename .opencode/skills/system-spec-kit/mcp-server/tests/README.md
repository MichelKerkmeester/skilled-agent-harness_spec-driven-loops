---
title: "MCP Server Tests: Vitest Coverage"
description: "Vitest unit, integration, handler, eval, governance, and regression coverage for the MCP server."
trigger_phrases:
  - "test suite"
  - "vitest"
  - "regression tests"
---

# MCP Server Tests: Vitest Coverage

---

## 1. OVERVIEW

`tests/` is the default Vitest coverage surface for the MCP server. It covers unit logic, integration paths, MCP handler contracts, retrieval behavior, governance, eval metrics, startup checks, and regression cases.

Current responsibilities:

- Verify cognitive retrieval behavior such as attention decay, tiering, co-activation, and session learning.
- Verify search, ranking, graph, routing, response envelopes, and public API surfaces.
- Verify save, index, checkpoint, governance, lineage, hook, and startup regressions.
- Keep stress and load validation separate in sibling `../stress-test/`.

---

## 2. PACKAGE TOPOLOGY

```text
tests/
+-- *.vitest.ts          # Unit, integration, handler, eval, and regression suites
+-- fixtures/            # Sample documents and data for targeted tests
+-- continuity/          # Continuity-focused nested suites
`-- README.md
```

Allowed dependency direction:

```text
tests ───▶ mcp_server source modules
tests ───▶ fixtures
```

Disallowed dependency direction:

```text
mcp_server source modules ───▶ tests
tests ───▶ shared temp state without explicit setup and cleanup
```

---

## 3. DIRECTORY TREE

```text
tests/
+-- api-public-surfaces.vitest.ts          # Public export contract coverage
+-- feature-flag-reference-docs.vitest.ts  # Docs and config parity checks
+-- governance-e2e.vitest.ts               # Governed scope integration coverage
+-- handler-memory-search.vitest.ts        # MCP handler search contract coverage
+-- hybrid-search.vitest.ts                # Retrieval ranking coverage
+-- memory-save-integration.vitest.ts      # Save pipeline integration coverage
+-- scope-governance-normalizer-parity.vitest.ts
+-- __helpers__/
|   `-- test-env.ts                        # Shared setEnv / restoreEnv / withFeatureFlag for env-driven tests
+-- fixtures/                              # Shared test fixtures
+-- integration/
|   `-- entity-density-commit-hooks.vitest.ts # Post-commit cache invalidation coverage
+-- continuity/                            # Continuity-specific suites
`-- README.md
```

Use `rg --files tests -g '*.vitest.ts'` for the full live inventory.

---

## 4. KEY FILES

| Area | Representative Files | Responsibility |
|---|---|---|
| Cognitive and memory state | `attention-decay.vitest.ts`, `working-memory.vitest.ts`, `tier-classifier.vitest.ts` | Retrieval state, scoring, and tier behavior. |
| Search and routing | `hybrid-search.vitest.ts`, `query-plan-emission.vitest.ts`, `intent-routing.vitest.ts` | Query planning, ranking, fusion, and routing behavior. |
| Embedder degradation and canonical semantic recall | `stage1-embedder-degrade.vitest.ts`, `gate-d-regression-embedding-semantic-search.vitest.ts` | Stage 1 lexical fallback when query embeddings are unavailable, exposed degradation metadata, and Gate D semantic-source filtering that keeps canonical reader sources while dropping archived or legacy fallback rows. |
| Fusion and scoring determinism | `calibrated-overlap-bonus.vitest.ts`, `score-resolution-consistency.vitest.ts`, `rrf-fusion.vitest.ts`, `unit-rrf-fusion.vitest.ts`, `vector-knn-query-shape-benchmark.vitest.ts`, `stage2-fusion.vitest.ts` | Calibrated overlap denominator behavior, shared effective-score ordering, RRF content-hash tiebreaks, cross-variant fusion, stable vector KNN secondary ordering, and Stage 2 graph/session/causal/fallback metadata. |
| Hybrid routing + graph-channel preservation | `query-router.vitest.ts`, `entity-density.vitest.ts`, `routing-telemetry-stress.vitest.ts`, `integration/entity-density-commit-hooks.vitest.ts` | Covers intent gate, entity-density override, telemetry rolling window, post-commit cache invalidation, and env-flag parsing. |
| Handler and protocol surface | `handler-memory-search.vitest.ts`, `mcp-tool-dispatch.vitest.ts`, `mcp-error-format.vitest.ts` | MCP dispatch and response contracts. |
| Memory mutation and health guards | `memory-crud-update-constitutional-guard.vitest.ts`, `handler-memory-health-edge.vitest.ts` | Constitutional `memory_update` CAS via `expectedHash`, protected-field partitioning, and `memory_health` validation/default/auto-repair/background-enrichment edge cases. |
| Save and index regressions | `memory-save-integration.vitest.ts`, `handler-memory-index.vitest.ts`, `handler-memory-index-async-scan.vitest.ts`, `handler-memory-index-cooldown.vitest.ts`, `incremental-index-move-reconcile.vitest.ts`, `index-scope.vitest.ts`, `memory-save-supersede-reindex.vitest.ts`, `content-router-cache.vitest.ts` | Save, scan coalescing and cooldown, move reconciliation, scoped index, supersede reindex, cache, and indexing behavior. |
| Metadata, idempotency and feedback safety | `frontmatter-promoter.vitest.ts`, `memory-idempotency-and-near-duplicate.vitest.ts`, `feedback-safety-posture.vitest.ts` | Frontmatter edge promotion with skip-closed cleanup, idempotency receipt replay/conflict/hash parity plus near-duplicate markers, and feedback ledger/schema safety invariants. |
| Governance and scope | `governance-e2e.vitest.ts`, `memory-governance.vitest.ts`, `scope-governance-normalizer-parity.vitest.ts` | Scope enforcement and governed lifecycle behavior. |
| Public API and docs parity | `api-public-surfaces.vitest.ts`, `feature-flag-reference-docs.vitest.ts` | Export and documentation alignment. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Test ownership | `tests/` verifies MCP server behavior. It does not own production code paths. |
| Fixtures | Fixture data belongs in `fixtures/` or suite-local setup. |
| Environment | Tests that change database paths, temp folders, or feature flags must isolate state. |
| Stress runs | Large stress and load checks belong in `../stress-test/`. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ Developer or CI command                  │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ npx vitest run [suite or pattern]        │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Suite setup creates isolated state       │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Source module or handler is exercised    │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Pass, fail, or focused regression signal │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `npx vitest run` | CLI | Runs the full MCP server test suite. |
| `npx vitest run tests/<file>.vitest.ts` | CLI | Runs one focused suite. |
| `rg --files tests -g '*.vitest.ts'` | CLI | Lists the current Vitest inventory. |
| `fixtures/` | Directory | Shared fixture inputs for targeted suites. |

---

## 7. VALIDATION

Run from `.opencode/skills/system-spec-kit/mcp-server`.

```bash
npx vitest run
```

Focused examples:

```bash
npx vitest run tests/api-public-surfaces.vitest.ts tests/feature-flag-reference-docs.vitest.ts
npx vitest run tests/governance-e2e.vitest.ts tests/memory-governance.vitest.ts
npx vitest run tests/handler-memory-search.vitest.ts tests/hybrid-search.vitest.ts
```

Expected result: selected suites pass with isolated database and temp state.

---

## 8. RELATED

- [`../README.md`](../README.md)
- [`../handlers/README.md`](../handlers/README.md)
- [`../api/README.md`](../api/README.md)
- [`../lib/README.md`](../lib/README.md)
- [`../stress-test/README.md`](../stress-test/README.md)
