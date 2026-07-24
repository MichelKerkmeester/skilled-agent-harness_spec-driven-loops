---
title: "Indexed Style Database"
description: "Opt-in SQLite and FTS5 style index with rebuildable vectors, incremental generation publishing, and eligibility-first weighted-RRF retrieval."
trigger_phrases:
  - "Indexed Style Database"
  - "persistent style retrieval"
  - "style database backend"
  - "weighted RRF style search"
version: 1.0.0.0
---

# Indexed Style Database

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The styles library includes a persistent retrieval backend under `styles/_db/`. It stores a versioned style index in SQLite with FTS5 and maintains a rebuildable vector projection without making the database the source of truth.

The adapter under `styles/_engine/` supports `legacy`, `shadow` and `persistent` modes. It defaults to `legacy`, so flat style files remain authoritative and persistent reads require explicit opt-in.

---

## 2. HOW IT WORKS

The incremental indexer advances through `DISCOVER`, `VERIFY`, `PARSE_VALIDATE`, `COMMIT`, `VECTOR_DRAIN` and `PUBLISH`. It uses content hashes for freshness, publishes immutable generations atomically and quarantines or tombstones records that cannot remain live.

Retrieval filters eligibility before ranking. Eligible records enter structured, FTS5 and vector lanes, whose ranks are combined through weighted reciprocal-rank fusion (weighted RRF) with per-channel attribution and deterministic tie-breaking. Generation snapshots and keyset cursors keep reads bound to one published generation, while unavailable lanes follow the backend's degradation and fail-closed behavior.

Vector work is non-blocking and rebuildable. Vectors are keyed by record identity, retrieval hash and profile, with a content-addressed embedding cache; no external SQLite vector extension is required.

An operator surface under `styles/_db/operator.mjs` exposes the persistent-path lifecycle as documented entry points — status, build, cutover, rollback and vector-repair — and enforces a current-plus-rollback generation retention invariant so published generation files are pruned safely without dropping the live generation or its rollback target. Enabling the persistent path remains a separate operator decision.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/styles/_db/schema.mjs` | Storage | Defines the versioned SQLite, FTS5, vector, relationship and generation schema. |
| `.opencode/skills/sk-design/styles/_db/indexer.mjs` | Indexer | Runs the incremental generation lifecycle and atomic publish. |
| `.opencode/skills/sk-design/styles/_db/retrieval.mjs` | Retrieval | Applies eligibility-first structured, FTS5 and vector weighted-RRF ranking. |
| `.opencode/skills/sk-design/styles/_db/vectors.mjs` | Projection | Maintains the non-blocking rebuildable vector queue and cache. |
| `.opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs` | Adapter | Selects `legacy`, `shadow` or `persistent` and defaults to `legacy`. |
| `.opencode/skills/sk-design/styles/_engine/style-library.mjs` | Facade | Routes the existing style-library surface through the adapter. |
| `.opencode/skills/sk-design/styles/_db/operator.mjs` | Operator | Persistent status/build/cutover/rollback/vector-repair with current-plus-rollback generation retention. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/styles/_db/tests/schema.test.mjs` | Automated test | Covers database schema behavior. |
| `.opencode/skills/sk-design/styles/_db/tests/indexer.test.mjs` | Automated test | Covers indexing and generation publication. |
| `.opencode/skills/sk-design/styles/_db/tests/retrieval.test.mjs` | Automated test | Covers indexed retrieval and rank fusion. |
| `.opencode/skills/sk-design/styles/_db/tests/adapter.test.mjs` | Automated test | Covers adapter modes and the legacy default. |
| `.opencode/skills/sk-design/styles/_db/tests/operator.test.mjs` | Automated test | Covers the operator lifecycle and current-plus-rollback retention. |

---

## 4. SOURCE METADATA

- Group: Styles-Library Utilization
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `styles-library-utilization/style-database-backend.md`

Related references:
- [retrieval-engine.md](retrieval-engine.md) - Authoritative flat-file retrieval path used by the default `legacy` adapter mode.
- [shared-corpus-context-seam.md](shared-corpus-context-seam.md) - Neutral planning envelope consumed before mode-owned retrieval.
