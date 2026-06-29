---
title: "Code-Graph Coverage Seed Bridge"
description: "Documents the deep-context bridge that seeds coverage-graph nodes from code-graph/frontier evidence before the first convergence check."
trigger_phrases:
  - "code graph coverage seed bridge"
  - "coverage graph seed source"
  - "seed confidence"
  - "frontier coverage graph"
  - "code graph to coverage graph"
version: 1.2.0.1
---

# Code-Graph Coverage Seed Bridge

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Documents the seed bridge that initializes the `deep-context` coverage graph from the frontier/code-graph phase before the first convergence check runs.

The shipped context workflow builds seed nodes and edges from `frontier_slices_json`, binds `coverage_seed_source` to `frontier_source`, and assigns seed confidence of `0.55` for code-graph seeds or `0.35` for fallback-derived seeds. The shared upsert script persists the seed metadata on coverage nodes as `seed_source` and `seed_confidence`.

## 2. HOW IT WORKS

`deep_context_auto.yaml` seeds the frontier first, then derives coverage-graph seed nodes for the `context` loop type. It uses the same session id as the context lineage and calls `deep-loop-runtime/scripts/upsert.cjs` with `--seed-source` and `--seed-confidence`.

The coverage graph database stores seed metadata on nodes only. `coverage-graph-db.ts` defines optional `seedSource` and `seedConfidence` fields, migrates `coverage_nodes` to include `seed_source` and `seed_confidence`, validates confidence in the inclusive `0..1` range, and preserves existing seed metadata on conflict unless a new seed value is provided.

The upsert script enforces seed argument consistency: if any node already contains seed metadata or the caller supplies one seed flag, both `seedSource` and `seedConfidence` must be present and valid. The JSON response reports the seed source and confidence when seeding was requested.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Workflow | Builds coverage seed nodes/edges from the frontier and calls `upsert.cjs` before convergence checks. |
| `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs` | Runtime CLI | Requires valid `--seed-source` and `--seed-confidence` for seed paths and forwards metadata to the DB layer. |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` | Storage | Stores `seed_source` and `seed_confidence`, validates values, migrates existing DBs, and surfaces seed metadata in node reads. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/06--coverage-graph-schema/code-graph-coverage-seed-bridge.md` | Manual scenario | Verifies YAML seed wiring, upsert validation, DB columns, and seed metadata round-trip behavior. |
| `.opencode/skills/deep-loop-runtime/tests/integration/upsert-script.vitest.ts` | Automated test | Exercises upsert-script seed validation and returned seed metadata. |
| `.opencode/skills/deep-loop-runtime/tests/unit/coverage-graph-db.vitest.ts` | Automated test | Exercises DB seed metadata persistence, organic-node behavior, and zero-node seed warnings. |

---

## 4. SOURCE METADATA

- Group: Coverage-Graph Schema
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--coverage-graph-schema/code-graph-coverage-seed-bridge.md`
- Primary sources: `.opencode/commands/deep/assets/deep_context_auto.yaml`, `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs`, `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts`

Related references:
- [loop-type-context-schema.md](loop-type-context-schema.md) - Context schema
- [context-node-kinds-relations.md](context-node-kinds-relations.md) - Context node kinds and relations
