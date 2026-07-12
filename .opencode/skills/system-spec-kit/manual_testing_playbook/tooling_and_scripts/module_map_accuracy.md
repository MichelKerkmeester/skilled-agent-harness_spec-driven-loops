---
title: "151 -- MODULE_MAP.md accuracy validation"
description: "This scenario validates MODULE_MAP.md content accuracy by spot-checking module entries against actual code structure. It focuses on verifying listed files exist and consumers are correct."
version: 3.6.0.16
---

# 151 -- MODULE_MAP.md accuracy validation

## 1. OVERVIEW

This scenario validates MODULE_MAP.md content accuracy for `151`. It focuses on verifying that the module inventory, file listings, and consumer mappings match the actual codebase.

---

## 2. SCENARIO CONTRACT

- Objective: Verify MODULE_MAP.md entries match actual code structure for 5 sampled modules.
- Real user request: `Please validate MODULE_MAP.md accuracy validation against cd .opencode/skills/system-spec-kit and tell me whether the expected signals are present: All 5 sampled modules have accurate file lists and consumer mappings.`
- Prompt: `Validate MODULE_MAP.md accuracy validation against cd .opencode/skills/system-spec-kit and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All 5 sampled modules have accurate file lists and consumer mappings
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all 5 sampled modules are accurate

---

## 3. TEST EXECUTION

### Prompt

```
Validate MODULE_MAP.md accuracy validation against cd .opencode/skills/system-spec-kit and report cited pass/fail evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit`
2. Read MODULE_MAP.md entries for config, cognitive, search, storage, scoring
3. For each module: `ls mcp_server/lib/{module}/` to verify key files exist
4. For each module: `grep -r "from.*/{module}/" mcp_server/ --include="*.ts" -l` to verify consumers
5. Compare against MODULE_MAP.md listings

### Expected

All 5 modules have accurate file lists and consumer mappings

### Evidence

Executed from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit`.

Initial MODULE_MAP location observation:

```text
Read /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/MODULE_MAP.md
File not found: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/MODULE_MAP.md
```

The module entries used for comparison are present in `mcp_server/lib/MODULE_MAP.md`:

```text
### `cognitive/`
- Key files:
  - `working-memory.ts` — working-memory writes, cleanup, and short-horizon memory behavior.
  - `fsrs-scheduler.ts` — FSRS-based spaced-repetition scheduling and retrievability math.
  - `attention-decay.ts` — time/usage decay utilities used to age memory salience.
  - `tier-classifier.ts` — classification logic that maps memories into behavioral tiers.
- Primary consumers:
  - `lib/search/*`
  - `handlers/save/*`
  - `handlers/memory-triggers.ts`
  - `handlers/memory-context.ts`
  - `lib/extraction/*`
  - `lib/session/*`

### `config/`
- Key files:
  - `memory-types.ts` — canonical memory-type definitions and decay-oriented configuration.
  - `type-inference.ts` — inference logic for memory/document classification from path, content, and metadata.
  - `capability-flags.ts` — phase-aware rollout defaults and capability flag helpers.
  - `README.md` — module overview and the document-type/memory-type model.
- Primary consumers:
  - `lib/parsing/*`
  - `lib/telemetry/*`
  - `lib/eval/*`
  - `lib/cognitive/*`

### `scoring/`
- Key files:
  - `composite-scoring.ts` — main composite ranking formula and score normalization.
  - `importance-tiers.ts` — canonical tier definitions and decay/scoring multipliers.
  - `folder-scoring.ts` — folder-level relevance and recency weighting.
  - `confidence-tracker.ts` — confidence-related normalization helpers.
  - `negative-feedback.ts` — post-feedback confidence penalties.
- Primary consumers:
  - `lib/search/*`
  - `lib/cognitive/*`
  - `handlers/checkpoints.ts`
  - `handlers/memory-crud-stats.ts`
  - `handlers/memory-crud-update.ts`

### `search/`
- Key files:
  - `hybrid-search.ts` — main hybrid retrieval entry point across search channels.
  - `pipeline/orchestrator.ts` — 4-stage retrieval pipeline coordinator.
  - `vector-index-store.ts` — vector-store abstraction bridge and core index operations.
  - `vector-index-schema.ts` — schema creation and schema-safety helpers for search storage.
  - `query-router.ts` — query-complexity routing and pipeline selection.
- Primary consumers:
  - `handlers/save/*`
  - `handlers/memory-search.ts`
  - `handlers/memory-context.ts`
  - `handlers/checkpoints.ts`
  - `handlers/chunking-orchestrator.ts`
  - `lib/storage/*`

### `storage/`
- Key files:
  - `checkpoints.ts` — checkpoint create/list/restore/delete operations.
  - `incremental-index.ts` — incremental indexing and deferred lexical-only indexing helpers.
  - `transaction-manager.ts` — mutation transaction wrappers and atomicity helpers.
  - `causal-edges.ts` — causal edge persistence and graph-maintenance hooks.
  - `reconsolidation.ts` — post-save similarity merge/complement/conflict handling.
- Primary consumers:
  - `handlers/save/*`
  - `handlers/memory-bulk-delete.ts`
  - `handlers/memory-crud-delete.ts`
  - `handlers/memory-crud-update.ts`
  - `handlers/pe-gating.ts`
  - `lib/search/*`
```

`ls mcp_server/lib/config/` output:

```text
README.md
capability-flags.ts
memory-types.ts
spec-doc-paths.ts
type-inference.ts
```

`grep -r "from.*/config/" mcp_server/ --include="*.ts" -l` output included exact consumer paths matching the listed consumer areas:

```text
mcp_server/lib/cognitive/*
mcp_server/lib/telemetry/retrieval-telemetry.ts
mcp_server/lib/eval/memory-state-baseline.ts
mcp_server/lib/parsing/memory-parser.ts
```

Actual output examples from that command:

```text
mcp_server/lib/cognitive/fsrs-scheduler.ts
mcp_server/lib/cognitive/working-memory.ts
mcp_server/lib/telemetry/retrieval-telemetry.ts
mcp_server/lib/eval/memory-state-baseline.ts
mcp_server/lib/parsing/memory-parser.ts
mcp_server/handlers/memory-search.ts
mcp_server/handlers/memory-index-discovery.ts
mcp_server/handlers/save/create-record.ts
```

`ls mcp_server/lib/cognitive/` output:

```text
README.md
adaptive-ranking.ts
attention-decay.ts
co-activation.ts
fsrs-scheduler.ts
prediction-error-gate.ts
pressure-monitor.ts
rollout-policy.ts
temporal-contiguity.ts
tier-classifier.ts
working-memory.ts
```

`grep -r "from.*/cognitive/" mcp_server/ --include="*.ts" -l` output included exact consumer paths matching the listed consumer areas:

```text
mcp_server/lib/search/pipeline/stage2-fusion.ts
mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
mcp_server/lib/search/search-flags.ts
mcp_server/lib/search/graph-flags.ts
mcp_server/lib/search/hybrid-search.ts
mcp_server/lib/extraction/extraction-adapter.ts
mcp_server/lib/session/session-manager.ts
mcp_server/handlers/memory-search.ts
mcp_server/handlers/checkpoints.ts
mcp_server/handlers/memory-context.ts
mcp_server/handlers/save/pe-orchestration.ts
mcp_server/handlers/save/response-builder.ts
mcp_server/handlers/save/reconsolidation-bridge.ts
mcp_server/handlers/save/create-record.ts
mcp_server/handlers/memory-triggers.ts
```

`ls mcp_server/lib/search/` output included the MODULE_MAP key files:

```text
hybrid-search.ts
pipeline
query-router.ts
vector-index-schema.ts
vector-index-store.ts
```

`ls mcp_server/lib/search/pipeline/` output confirmed the nested key file exists:

```text
README.md
index.ts
orchestrator.ts
ranking-contract.ts
stage1-candidate-gen.ts
stage2-fusion.ts
stage2b-enrichment.ts
stage3-rerank.ts
stage4-filter.ts
types.ts
```

`grep -r "from.*/search/" mcp_server/ --include="*.ts" -l` output included exact consumer paths matching the listed consumer areas:

```text
mcp_server/handlers/memory-search.ts
mcp_server/handlers/memory-context.ts
mcp_server/handlers/checkpoints.ts
mcp_server/handlers/chunking-orchestrator.ts
mcp_server/handlers/save/post-insert.ts
mcp_server/handlers/save/reconsolidation-bridge.ts
mcp_server/handlers/save/types.ts
mcp_server/lib/storage/reconsolidation.ts
mcp_server/lib/storage/ports/vector-store.ts
mcp_server/lib/storage/ports/lexical-search.ts
```

`ls mcp_server/lib/storage/` output:

```text
README.md
access-tracker.ts
canonical-fingerprint.ts
causal-edges.ts
causal-generation.ts
checkpoints.ts
consolidation.ts
document-helpers.ts
history.ts
idempotency-receipts.ts
incremental-index.ts
learned-triggers-schema.ts
lineage-state.ts
maintenance-marker.ts
memo.ts
mutation-ledger.ts
near-duplicate.ts
ports
post-insert-metadata.ts
reconsolidation.ts
schema-downgrade.ts
statediff.ts
transaction-manager.ts
write-provenance.ts
```

`grep -r "from.*/storage/" mcp_server/ --include="*.ts" -l` output included exact consumer paths matching the listed consumer areas:

```text
mcp_server/handlers/pe-gating.ts
mcp_server/handlers/memory-save.ts
mcp_server/handlers/chunking-orchestrator.ts
mcp_server/handlers/memory-index.ts
mcp_server/handlers/causal-graph.ts
mcp_server/handlers/memory-search.ts
mcp_server/handlers/checkpoints.ts
mcp_server/handlers/memory-crud-update.ts
mcp_server/handlers/memory-crud-delete.ts
mcp_server/handlers/save/pe-orchestration.ts
mcp_server/handlers/save/enrichment-state.ts
mcp_server/handlers/save/reconsolidation-bridge.ts
mcp_server/handlers/save/create-record.ts
mcp_server/handlers/memory-bulk-delete.ts
mcp_server/lib/search/vector-index-queries.ts
mcp_server/lib/search/vector-index-mutations.ts
mcp_server/lib/search/vector-index-schema.ts
mcp_server/lib/search/vector-index-store.ts
```

`ls mcp_server/lib/scoring/` output:

```text
README.md
composite-scoring.ts
confidence-tracker.ts
folder-scoring.ts
importance-tiers.ts
interference-scoring.ts
mpab-aggregation.ts
```

`grep -r "from.*/scoring/" mcp_server/ --include="*.ts" -l` output included exact consumer paths matching several listed consumer areas:

```text
mcp_server/lib/search/pipeline/stage2-fusion.ts
mcp_server/lib/search/pipeline/stage3-rerank.ts
mcp_server/lib/search/vector-index-store.ts
mcp_server/lib/search/hybrid-search.ts
mcp_server/lib/cognitive/attention-decay.ts
mcp_server/handlers/memory-crud-stats.ts
mcp_server/handlers/checkpoints.ts
mcp_server/handlers/memory-crud-update.ts
```

Comparison result: FAIL. `mcp_server/lib/MODULE_MAP.md` lists `mcp_server/lib/scoring/negative-feedback.ts` as a key file, but the actual `ls mcp_server/lib/scoring/` output does not contain `negative-feedback.ts`.

### Pass / Fail

- **Fail**: The expected condition did not hold because one sampled module has contradicting file-list evidence: `scoring/negative-feedback.ts` is listed in `mcp_server/lib/MODULE_MAP.md`, but it is absent from the actual `ls mcp_server/lib/scoring/` output.

### Failure Triage

Identify stale entry -> update MODULE_MAP.md -> re-verify

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling_and_scripts/module_boundary_map.md](../../feature_catalog/tooling_and_scripts/module_boundary_map.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 151
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/module_map_accuracy.md`
