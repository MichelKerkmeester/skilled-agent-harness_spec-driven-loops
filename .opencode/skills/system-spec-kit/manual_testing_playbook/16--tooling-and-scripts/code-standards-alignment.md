---
title: "089 -- Code standards alignment"
description: "This scenario validates Code standards alignment for `089`. It focuses on Confirm standards conformance."
version: 3.6.0.15
---

# 089 -- Code standards alignment

## 1. OVERVIEW

This scenario validates Code standards alignment for `089`. It focuses on Confirm standards conformance.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm standards conformance.
- Real user request: `Please validate Code standards alignment against the documented validation surface and tell me whether the expected signals are present: Affected files follow naming conventions; comments are meaningful (not boilerplate); import order matches standard; no mismatches found.`
- Prompt: `Validate Code standards alignment against the documented validation surface and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Affected files follow naming conventions; comments are meaningful (not boilerplate); import order matches standard; no mismatches found
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all affected files conform to naming, commenting, and import order standards with zero mismatches

---

## 3. TEST EXECUTION

### Prompt

```
Validate Code standards alignment against the documented validation surface and report cited pass/fail evidence.
```

### Commands

1. inspect affected files
2. verify naming/comments/import order
3. record mismatches

### Expected

Affected files follow naming conventions; comments are meaningful (not boilerplate); import order matches standard; no mismatches found

### Evidence

Preconditions: no explicit Preconditions section is present in this scenario file.

Command 1, inspect affected files:

```text
$ git diff --name-only
.opencode/skills/.goal-state/7365735f306463616135393733666665726954414658627031394f6e6d33.json
.opencode/skills/deep-loop-runtime/database/observability-events.jsonl
.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts
.opencode/skills/deep-loop-runtime/scripts/convergence.cjs
.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs
.opencode/skills/deep-loop-runtime/tests/unit/coverage-graph-signals.vitest.ts
.opencode/skills/system-spec-kit/.opencode/skills/system-spec-kit/mcp_server/data/search-decisions.jsonl
.opencode/skills/system-spec-kit/:memory:
.opencode/skills/system-spec-kit/:memory:.lock
.opencode/skills/system-spec-kit/checkpoints/edge-t010-c4-a-1782963517449-4gyjlo-3/manifest.json
.opencode/skills/system-spec-kit/checkpoints/edge-t010-c4-a-1782963517449-4gyjlo-3/snapshot-main.sqlite
.opencode/skills/system-spec-kit/checkpoints/edge-t010-c4-a-1782963517449-4gyjlo-3/snapshot-vec.sqlite
.opencode/skills/system-spec-kit/checkpoints/edge-t010-c4-b-1782963517449-4gyjlo-4/manifest.json
.opencode/skills/system-spec-kit/checkpoints/edge-t010-c4-b-1782963517449-4gyjlo-4/snapshot-main.sqlite
.opencode/skills/system-spec-kit/checkpoints/edge-t010-c4-b-1782963517449-4gyjlo-4/snapshot-vec.sqlite
.opencode/skills/system-spec-kit/manual_testing_playbook/15--retrieval-enhancements/dual-level-retrieval.md
.opencode/skills/system-spec-kit/manual_testing_playbook/15--retrieval-enhancements/dual-scope-memory-auto-surface-tm-05.md
.opencode/skills/system-spec-kit/manual_testing_playbook/15--retrieval-enhancements/implemented-cross-document-entity-linking-s5.md
.opencode/skills/system-spec-kit/manual_testing_playbook/15--retrieval-enhancements/implemented-memory-summary-generation-r8.md
.opencode/skills/system-spec-kit/manual_testing_playbook/15--retrieval-enhancements/lightweight-consolidation-n3-lite.md
.opencode/skills/system-spec-kit/manual_testing_playbook/15--retrieval-enhancements/memory-summary-search-channel-r8.md
.opencode/skills/system-spec-kit/manual_testing_playbook/15--retrieval-enhancements/provenance-rich-response-envelopes-p0-2.md
.opencode/skills/system-spec-kit/manual_testing_playbook/15--retrieval-enhancements/retrieval-observability-trace-and-health.md
.opencode/skills/system-spec-kit/manual_testing_playbook/15--retrieval-enhancements/session-boost-graduated.md
.opencode/skills/system-spec-kit/manual_testing_playbook/15--retrieval-enhancements/spec-folder-hierarchy-as-retrieval-structure-s4.md
.opencode/skills/system-spec-kit/manual_testing_playbook/15--retrieval-enhancements/tier-2-fallback-channel-forcing.md
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/architecture-boundary-enforcement.md
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-blocked-read-rendering.md
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-compact-and-completion.md
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-dist-freshness-guard.md
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-list-tools-parity.md
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-matrix-adapter-runner-smoke.md
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-stress-concurrent-dual-client-load.md
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-stress-large-payload-pipe-integrity.md
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-stress-numeric-coercion-edge-args.md
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-stress-trust-gate-fuzz.md
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-stress-warm-only-probe-churn.md
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-trusted-gate-refusal.md
.opencode/skills/system-spec-kit/mcp_server/database/.maintenance-active.json
.opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh
.opencode/skills/system-spec-kit/scripts/tests/test-validation-extended.sh
.opencode/skills/system-spec-kit/shared/mcp_server/database/.unclean-shutdown
.opencode/skills/system-spec-kit/shared/mcp_server/database/test-context-index.sqlite.lock
.opencode/skills/system-spec-kit/vectors/context-vectors__hf-local__nomic-ai_nomic-embed-text-v1.5__768__q8.sqlite
.opencode/specs/deep-loops/030-agent-loops-improved/011-followup-remediation/007-sliding-window-convergence-mode/checklist.md
.opencode/specs/deep-loops/030-agent-loops-improved/011-followup-remediation/007-sliding-window-convergence-mode/graph-metadata.json
.opencode/specs/deep-loops/030-agent-loops-improved/011-followup-remediation/007-sliding-window-convergence-mode/plan.md
.opencode/specs/deep-loops/030-agent-loops-improved/011-followup-remediation/007-sliding-window-convergence-mode/spec.md
.opencode/specs/deep-loops/030-agent-loops-improved/011-followup-remediation/007-sliding-window-convergence-mode/tasks.md
.opencode/specs/deep-loops/030-agent-loops-improved/011-followup-remediation/graph-metadata.json
.opencode/specs/deep-loops/030-agent-loops-improved/011-followup-remediation/spec.md
.opencode/specs/deep-loops/030-agent-loops-improved/before-vs-after.md
.opencode/specs/deep-loops/030-agent-loops-improved/changelog/README.md
.opencode/specs/deep-loops/030-agent-loops-improved/changelog/changelog-156-root.md
.opencode/specs/deep-loops/030-agent-loops-improved/graph-metadata.json
.opencode/specs/deep-loops/030-agent-loops-improved/spec.md
.opencode/specs/deep-loops/030-agent-loops-improved/timeline.md
.opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/graph-metadata.json
.opencode/specs/descriptions.json
.opencode/specs/system-speckit/031-manual-playbook-execution-sweep/001-findings-remediation/tasks.md
.opencode/specs/system-speckit/031-manual-playbook-execution-sweep/manifest.tsv
```

Command 2, verify naming/comments/import order:

```text
$ rg -n "^//\\s*(MODULE|COMPONENT):" ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts" ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts" ".opencode/skills/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts" ".opencode/skills/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts" ".opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts" ".opencode/skills/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts" ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-classifier.ts" ".opencode/skills/system-spec-kit/mcp_server/lib/search/channel-representation.ts"
.opencode/skills/system-spec-kit/mcp_server/lib/search/query-classifier.ts:2:// MODULE: Query Classifier
.opencode/skills/system-spec-kit/mcp_server/lib/search/channel-representation.ts:2:// MODULE: Channel Representation
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:2:// MODULE: Co Activation
.opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:2:// MODULE: Trigger Matcher
.opencode/skills/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:2:// MODULE: Composite Scoring
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2:// MODULE: Hybrid Search
.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:2:// MODULE: Folder Discovery
.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:2:// MODULE: Graph Search Fn
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2:// MODULE: Memory Save Handler

$ rg -n "AI-(WHY|TRACE|GUARD):" ".opencode/skills/system-spec-kit/mcp_server"
(no output)

$ test -e ".opencode/skills/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts"; printf "rsf-fusion.ts exists exit=%s\n" "$?"
rsf-fusion.ts exists exit=1

$ rg -n "\\bspecFolderLocks\\b" ".opencode/skills/system-spec-kit/mcp_server/handlers/save" ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
(no output)

$ rg -n "SPEC_FOLDER_LOCKS" ".opencode/skills/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts"
14:const SPEC_FOLDER_LOCKS = new Map<string, Promise<unknown>>();
177:  const chain = (SPEC_FOLDER_LOCKS.get(normalizedFolder) ?? Promise.resolve())
189:  SPEC_FOLDER_LOCKS.set(normalizedFolder, chain);
193:    if (SPEC_FOLDER_LOCKS.get(normalizedFolder) === chain) {
194:      SPEC_FOLDER_LOCKS.delete(normalizedFolder);
200:  SPEC_FOLDER_LOCKS,
```

Import-order inspection output:

```text
$ rg -n "^import( type)? " ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts" ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" ".opencode/skills/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts" ".opencode/skills/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts"
.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:7:import { sanitizeFTS5Query } from './bm25-index.js';
.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:8:import { queryHierarchyMemories } from './spec-folder-hierarchy.js';
.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:9:import { escapeLikePattern } from './vector-index-types.js';
.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:10:import { registerDatabaseRebindListener } from '../../core/db-state.js';
.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:12:import type Database from 'better-sqlite3';
.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:13:import type { GraphSearchFn } from './search-types.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:6:import { createHash } from 'node:crypto';
.opencode/skills/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:7:import fs from 'node:fs';
.opencode/skills/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:8:import os from 'node:os';
.opencode/skills/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:9:import path from 'node:path';
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:8:import { adaptiveFuse, getAdaptiveWeights, isAdaptiveFusionEnabled } from '@spec-kit/shared/algorithms/adaptive-fusion';
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:9:import { applyMMR } from '@spec-kit/shared/algorithms/mmr-reranker';
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:10:import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:47:import type { LaneCandidateList } from './pipeline/types.js';
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:75:import type Database from 'better-sqlite3';
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:76:import type { MMRCandidate } from '@spec-kit/shared/algorithms/mmr-reranker';
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:77:import type { FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:7:import { createHash, randomUUID } from 'node:crypto';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:8:import * as fs from 'node:fs';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:9:import path from 'path';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:37:import type { MCPResponse } from './types.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:38:import { createAppendOnlyMemoryRecord, recordLineageVersion, retirePredecessorForActiveReindex } from '../lib/storage/lineage-state.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:77:import type {
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:82:import {
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:88:import type {
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:101:import { checkExistingRow, checkContentHashDedup } from './save/dedup.js';
```

Catalog validation commands:

```text
$ npm run lint

> @spec-kit/mcp-server@1.8.0 lint
> eslint . --ext .ts

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/context-server.ts
  242:7  error  'GRAPH_ENRICHMENT_SYMBOL_LIMIT' is assigned a value but never used. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts
  22:27  error  'parseAssistantTextTurns' is defined but never used. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts
  268:10  error  'estimateRowBytes' is defined but never used. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts
  412:10  error  'canQueryVecMemories' is defined but never used. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/observability/retrieval-observability.ts
  66:7  error  'CHANNEL_KEYS' is assigned a value but only used as a type. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts
  35:7  error  'SOURCE_SHAPES' is assigned a value but only used as a type. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  174:10  error  'applyFolderFilter' is defined but never used. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts
  301:7  warning  Unused eslint-disable directive (no problems were reported from 'no-console')

✖ 35 problems (30 errors, 5 warnings)
  0 errors and 5 warnings potentially fixable with the `--fix` option.

npm error Lifecycle script `lint` failed with error:
npm error code 1
```

```text
$ npm run check

> @spec-kit/mcp-server@1.8.0 check
> npm run lint && npx tsc --noEmit

✖ 35 problems (30 errors, 5 warnings)
  0 errors and 5 warnings potentially fixable with the `--fix` option.

npm error Lifecycle script `check` failed with error:
npm error code 1
npm error command failed
npm error command sh -c npm run lint && npx tsc --noEmit
```

```text
$ npm run typecheck

> system-spec-kit@1.7.2 typecheck
> npm run --workspaces=false typecheck:root


> system-spec-kit@1.7.2 typecheck:root
> tsc -p shared/tsconfig.json && tsc --noEmit --composite false -p mcp_server/tsconfig.json && tsc --noEmit --composite false -p scripts/tsconfig.json
```

Command 3, record mismatches:

- `npm run lint` expected `0` warnings / `0` errors, observed `35 problems (30 errors, 5 warnings)` and exit code `1`.
- `npm run check` expected exit `0`, observed lint failure and exit code `1`.
- Import ordering mismatch observed in `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts`: `import type { MCPResponse } from './types.js';` appears at line `37` before runtime imports at lines `38-76`, while the standard says type-only imports are always last.
- Import grouping mismatch observed in `.opencode/skills/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts`: `import fs from 'node:fs';`, `import os from 'node:os';`, and `import path from 'node:path';` are Node built-ins, but there is no blank-line group separation/header in that file's import block.

### Pass / Fail

- **Fail**: Expected zero mismatches did not hold; `npm run lint` reported `35 problems (30 errors, 5 warnings)`, `npm run check` exited `1`, and import-order mismatches were observed in the inspected affected files.

### Failure Triage

Inspect code standards definition; verify linter rules cover the standards; check for files missed by alignment pass

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/code-standards-alignment.md](../../feature_catalog/16--tooling-and-scripts/code-standards-alignment.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 089
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/code-standards-alignment.md`
