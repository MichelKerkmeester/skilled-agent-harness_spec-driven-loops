---
title: "218 -- MCP Server Public API Barrel"
description: "This scenario validates MCP Server Public API Barrel for `218`. It focuses on verifying the top-level barrel re-exports the approved runtime, helper, and metadata surfaces from one stable import boundary."
audited_post_018: true
version: 3.6.0.12
id: pipeline-architecture-mcp-server-public-api-barrel
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 218 -- MCP Server Public API Barrel

## 1. OVERVIEW

This scenario validates MCP Server Public API Barrel for `218`. It focuses on verifying the top-level barrel re-exports the approved runtime, helper, and metadata surfaces from one stable import boundary.

---

## 2. SCENARIO CONTRACT


- Objective: Verify the top-level barrel re-exports the approved runtime, helper, and metadata surfaces from one stable import boundary.
- Real user request: `` Please validate MCP Server Public API Barrel against mcp_server/api/index.ts and tell me whether the expected signals are present: `mcp_server/api/index.ts` re-exports the documented evaluation, indexing, search, provider, storage, helper, and metadata symbols; `mcp_server/api/README.md` names `api/` as the approved public surface; consumers can rely on one stable top-level barrel. ``
- Prompt: `Validate the MCP Server Public API Barrel against mcp_server/api/index.ts and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `mcp_server/api/index.ts` re-exports the documented evaluation, indexing, search, provider, storage, helper, and metadata symbols; `mcp_server/api/README.md` names `api/` as the approved public surface; consumers can rely on one stable top-level barrel
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the barrel centralizes the approved public import contract and the docs steer consumers to `api/`; FAIL if required exports are missing, helper surfaces require internal imports, or the docs contradict the barrel policy

---

## 3. TEST EXECUTION

### Prompt

```
Validate the MCP Server Public API Barrel against mcp_server/api/index.ts and return pass/fail with cited evidence.
```

### Commands

1. Inspect `mcp_server/api/index.ts` and capture the top-level export groups and promoted helper surfaces
2. Cross-check those exports against `api/eval.ts`, `api/indexing.ts`, `api/search.ts`, `api/providers.ts`, and `api/storage.ts` plus the curated internal helper modules named in the catalog
3. Inspect `mcp_server/api/README.md` and confirm consumer guidance points to `api/` as the supported boundary
4. Run a barrel import smoke test or equivalent script check that accesses representative symbols from each export family through `mcp_server/api` only

### Expected

`mcp_server/api/index.ts` re-exports the documented evaluation, indexing, search, provider, storage, helper, and metadata symbols; `mcp_server/api/README.md` names `api/` as the approved public surface; consumers can rely on one stable top-level barrel

### Evidence

Barrel export capture from `.opencode/skills/system-spec-kit/mcp_server/api/index.ts`:

```ts
export {
  runAblation,
  storeAblationResults,
  formatAblationReport,
  toHybridSearchFlags,
  isAblationEnabled,
  inspectGroundTruthAlignment,
  assertGroundTruthAlignment,
  ALL_CHANNELS,
  type AblationChannel,
  type AblationSearchFn,
  type AblationReport,
  type GroundTruthAlignmentSummary,
  runBM25Baseline,
  recordBaselineMetrics,
  type BM25SearchFn,
  type BM25SearchResult,
  type BM25BaselineResult,
  loadGroundTruth,
  initEvalDb,
} from './eval.js';

export {
  initializeIndexingRuntime,
  warmEmbeddingModel,
  runMemoryIndexScan,
  refreshGraphMetadata,
  reindexSpecDocs,
  runEnrichmentBackfill,
  closeIndexingRuntime,
  type MemoryIndexScanArgs,
} from './indexing.js';

export {
  initHybridSearch,
  hybridSearchEnhanced,
  type HybridSearchOptions,
  type HybridSearchResult,
  fts5Bm25Search,
  isFts5Available,
  vectorIndex,
} from './search.js';

export {
  generateEmbedding,
  generateQueryEmbedding,
  getEmbeddingProfile,
  retryManager,
} from './providers.js';

export {
  initCheckpoints,
  initAccessTracker,
} from './storage.js';
```

Promoted helper and metadata surfaces observed in `.opencode/skills/system-spec-kit/mcp_server/api/index.ts`:

```ts
export {
  generatePerFolderDescription,
  savePerFolderDescription,
  loadPerFolderDescription,
  loadExistingDescription,
  extractKeywords,
  slugifyFolderName,
  getRepairMergeSafe,
} from '../lib/search/folder-discovery.js';
export type { PerFolderDescription, LoadResult } from '../lib/search/folder-discovery.js';

export {
  extractEntities,
  rebuildAutoEntities,
} from '../lib/extraction/entity-extractor.js';

export * as sessionBoost from '../lib/search/session-boost.js';
export * as causalBoost from '../lib/search/causal-boost.js';
export * as workingMemory from '../lib/cognitive/working-memory.js';
export {
  initExtractionAdapter,
  getExtractionMetrics,
  resetExtractionMetrics,
} from '../lib/extraction/extraction-adapter.js';
export type { ExtractionMetrics } from '../lib/extraction/extraction-adapter.js';

export {
  LAYER_DEFINITIONS,
  TOOL_LAYER_MAP,
  getLayerForTool,
  getLayerTokenBudget,
} from '../lib/architecture/layer-definitions.js';
export type { LayerDefinition, LayerId } from '../lib/architecture/layer-definitions.js';

export {
  GENERATED_METADATA_GRANDFATHER_ENV,
  getMemoryRoadmapCapabilityFlags,
  getMemoryRoadmapDefaults,
  getMemoryRoadmapPhase,
  isGeneratedMetadataGrandfatherEnabled,
  isStatusCompletionConsistencyGateEnabled,
  STATUS_COMPLETION_CONSISTENCY_GATE_ENV,
} from '../lib/config/capability-flags.js';
export type { MemoryRoadmapCapabilityFlags } from '../lib/config/capability-flags.js';
```

README policy snippet from `.opencode/skills/system-spec-kit/mcp_server/api/README.md`:

```md
`mcp_server/api/` is the supported import surface for scripts, eval tooling and package consumers that need MCP server capabilities without reaching into internal folders. Add exports here only when an external caller needs a stable contract.

Internal MCP server code should import from its owning `lib/`, `handlers/`, `core/`, or local module instead of routing through this API barrel.
```

Sub-barrel and curated helper cross-check notes:

```text
api/eval.ts exports runAblation, storeAblationResults, formatAblationReport, toHybridSearchFlags, isAblationEnabled, inspectGroundTruthAlignment, assertGroundTruthAlignment, ALL_CHANNELS, eval types, runBM25Baseline, recordBaselineMetrics, BM25 types, loadGroundTruth, initEvalDb.
api/indexing.ts exports initializeIndexingRuntime, warmEmbeddingModel, runMemoryIndexScan, refreshGraphMetadata, reindexSpecDocs, runEnrichmentBackfill, closeIndexingRuntime, MemoryIndexScanArgs.
api/search.ts exports initHybridSearch, hybridSearchEnhanced, HybridSearchOptions, HybridSearchResult, fts5Bm25Search, isFts5Available, vectorIndex.
api/providers.ts exports generateEmbedding, generateQueryEmbedding, getEmbeddingProfile, retryManager.
api/storage.ts exports initCheckpoints, initAccessTracker.
lib/search/folder-discovery.ts grep found generatePerFolderDescription, savePerFolderDescription, loadPerFolderDescription, loadExistingDescription, extractKeywords, slugifyFolderName, getRepairMergeSafe.
lib/extraction/entity-extractor.ts grep found extractEntities and rebuildAutoEntities.
lib/extraction/extraction-adapter.ts exports RULES, initExtractionAdapter, rebindExtractionAdapter, applySummarizer, matchRule, getExtractionMetrics, resetExtractionMetrics and type ExtractionMetrics.
lib/architecture/layer-definitions.ts grep found LayerDefinition, LayerId, LAYER_DEFINITIONS, TOOL_LAYER_MAP, getLayerForTool, getLayerTokenBudget.
lib/config/capability-flags.ts exports getMemoryRoadmapCapabilityFlags, getMemoryRoadmapDefaults, getMemoryRoadmapPhase, MemoryRoadmapCapabilityFlags, MemoryRoadmapDefaults, MemoryRoadmapPhase, generated-metadata env constants, parser env constant, and status-completion gate env constant.
```

Direct source import attempt transcript:

```text
$ node --import ../scripts/node_modules/tsx/dist/loader.mjs --input-type=module <<'EOF'
import * as publicApi from './api/index.ts';
import { LAYER_DEFINITIONS } from './api/index.ts';

const checks = {
  evaluation: typeof publicApi.runAblation,
  indexing: typeof publicApi.initializeIndexingRuntime,
  search: typeof publicApi.hybridSearchEnhanced,
  provider: typeof publicApi.generateEmbedding,
  storage: typeof publicApi.initCheckpoints,
  folderHelper: typeof publicApi.generatePerFolderDescription,
  entityHelper: typeof publicApi.extractEntities,
  benchmarkNamespace: typeof publicApi.sessionBoost,
  extractionHelper: typeof publicApi.initExtractionAdapter,
  metadataConstant: publicApi.GRAPH_METADATA_FILENAME,
  layerMetadata: LAYER_DEFINITIONS.L1.name,
  roadmapPhase: typeof publicApi.getMemoryRoadmapPhase,
};
console.log(JSON.stringify(checks, null, 2));
EOF
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/node_modules/@types/better-sqlite3/index.d.ts:159
export = Database;
         ^

ReferenceError: Database is not defined
    at <anonymous> (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/node_modules/@types/better-sqlite3/index.d.ts:159:10)
    at Object.<anonymous> (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/node_modules/@types/better-sqlite3/index.d.ts:159:10)
    at Module._compile (node:internal/modules/cjs/loader:1781:14)
    at Object.transformer (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/node_modules/tsx/dist/register-BOkp8V6j.cjs:9:3176)
    at Module.load (node:internal/modules/cjs/loader:1505:32)
    at Function._load (node:internal/modules/cjs/loader:1309:12)
    at wrapModuleLoad (node:internal/modules/cjs/loader:254:19)
    at loadCJSModuleWithModuleLoad (node:internal/modules/esm/translators:335:3)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/translators:235:7)
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)

Node.js v22.23.1
```

Package public-surface smoke test transcript:

```text
$ npm test -- --run tests/api-public-surfaces.vitest.ts

> @spec-kit/mcp-server@1.8.0 test
> node scripts/run-tests.mjs --run tests/api-public-surfaces.vitest.ts


 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  15:09:17
   Duration  1.05s (transform 724ms, setup 23ms, import 928ms, tests 2ms, environment 0ms)
```

Equivalent barrel export and README policy script transcript:

```text
$ node --input-type=module <<'EOF'
import fs from 'node:fs';

const barrel = fs.readFileSync('./api/index.ts', 'utf8');
const readme = fs.readFileSync('./api/README.md', 'utf8');
const required = {
  evaluation: ['runAblation', 'storeAblationResults', 'formatAblationReport', 'toHybridSearchFlags', 'isAblationEnabled', 'ALL_CHANNELS', 'runBM25Baseline', 'recordBaselineMetrics', 'loadGroundTruth', 'initEvalDb'],
  indexing: ['initializeIndexingRuntime', 'warmEmbeddingModel', 'runMemoryIndexScan', 'closeIndexingRuntime', 'MemoryIndexScanArgs'],
  search: ['initHybridSearch', 'hybridSearchEnhanced', 'HybridSearchOptions', 'HybridSearchResult', 'fts5Bm25Search', 'isFts5Available', 'vectorIndex'],
  provider: ['generateEmbedding', 'generateQueryEmbedding', 'getEmbeddingProfile', 'retryManager'],
  storage: ['initCheckpoints', 'initAccessTracker'],
  helpers: ['generatePerFolderDescription', 'savePerFolderDescription', 'loadPerFolderDescription', 'extractKeywords', 'slugifyFolderName', 'extractEntities', 'rebuildAutoEntities', 'sessionBoost', 'causalBoost', 'workingMemory', 'initExtractionAdapter', 'getExtractionMetrics', 'resetExtractionMetrics'],
  metadata: ['LAYER_DEFINITIONS', 'TOOL_LAYER_MAP', 'getLayerForTool', 'getLayerTokenBudget', 'LayerDefinition', 'LayerId', 'getMemoryRoadmapCapabilityFlags', 'getMemoryRoadmapDefaults', 'getMemoryRoadmapPhase', 'MemoryRoadmapCapabilityFlags', 'GRAPH_METADATA_FILENAME', 'GRAPH_METADATA_SCHEMA_VERSION'],
};
const result = Object.fromEntries(Object.entries(required).map(([family, symbols]) => [family, symbols.filter((symbol) => !new RegExp(`\\b${symbol}\\b`).test(barrel))]));
const readmePolicy = {
  supportedImportSurface: readme.includes('`mcp_server/api/` is the supported import surface'),
  externalScriptsPreferApi: readme.includes('Prefer `@spec-kit/mcp-server/api` or `@spec-kit/mcp-server/api/<module>`'),
  internalCodeNotBarrel: readme.includes('Internal MCP server code should import from its owning `lib/`, `handlers/`, `core/`, or local module'),
};
console.log(JSON.stringify({ missingByFamily: result, readmePolicy }, null, 2));
EOF
{
  "missingByFamily": {
    "evaluation": [],
    "indexing": [],
    "search": [],
    "provider": [],
    "storage": [],
    "helpers": [],
    "metadata": []
  },
  "readmePolicy": {
    "supportedImportSurface": true,
    "externalScriptsPreferApi": true,
    "internalCodeNotBarrel": true
  }
}
```

### Pass / Fail

PASS

The barrel centralizes the approved evaluation, indexing, search, provider, storage, helper, and metadata surfaces, the README steers consumers to `api/`, and the package public-surface smoke test passed.

### Failure Triage

Inspect `mcp_server/api/index.ts` for stale or missing re-exports -> verify renamed helper symbols still match the barrel contract -> check `mcp_server/api/README.md` for outdated consumer guidance -> confirm callers are not forced back to internal paths for metadata or rollout helpers

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [pipeline_architecture/mcp_server_public_api_barrel.md](../../feature_catalog/pipeline_architecture/mcp_server_public_api_barrel.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 218
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `pipeline_architecture/mcp_server_public_api_barrel.md`
