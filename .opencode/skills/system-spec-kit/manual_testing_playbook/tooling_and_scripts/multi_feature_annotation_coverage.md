---
title: "137 -- Multi-feature annotation coverage"
description: "This scenario validates Multi-feature annotation coverage for `137`. It focuses on Verify known multi-feature files have annotation count >= 2."
version: 3.6.0.15
id: tooling-and-scripts-multi-feature-annotation-coverage
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 137 -- Multi-feature annotation coverage

## 1. OVERVIEW

This scenario validates Multi-feature annotation coverage for `137`. It focuses on Verify known multi-feature files have annotation count >= 2.

---

## 2. SCENARIO CONTRACT


- Objective: Verify known multi-feature files have annotation count >= 2.
- Real user request: `Please validate Multi-feature annotation coverage against handlers/memory-save.ts and tell me whether the expected signals are present: All known multi-feature files carry >= 2 annotations; annotations are semantically appropriate.`
- Prompt: `Validate Multi-feature annotation coverage against handlers/memory-save.ts and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All known multi-feature files carry >= 2 annotations; annotations are semantically appropriate
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all checked multi-feature files have >= 2 annotations and no obviously-missing features

---

## 3. TEST EXECUTION

### Prompt

```
Validate Multi-feature annotation coverage against handlers/memory-save.ts and report cited pass/fail evidence.
```

### Commands

1. Identify files known to implement 2+ features (e.g., `handlers/memory-save.ts`, `handlers/memory-search.ts`, `handlers/memory-crud-delete.ts`)
2. For each: count `// Feature catalog:` lines
3. Verify count >= 2 for each multi-feature file
4. Spot-check that listed features are semantically correct for the file's implementation

### Expected

All known multi-feature files carry >= 2 annotations; annotations are semantically appropriate

### Evidence

Executed from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`:

```bash
rg -n "// Feature catalog:" ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts" ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts" ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts" && rg -c "// Feature catalog:" ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts" ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts" ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts"
```

Observed output:

```text
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:27:// Feature catalog: Single and folder delete (memory_delete)
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:28:// Feature catalog: Validation feedback (memory_validate)
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:29:// Feature catalog: Transaction wrappers on mutation handlers
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:30:// Feature catalog: Per-memory history log
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:124:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:125:// Feature catalog: Hybrid search pipeline
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:126:// Feature catalog: 4-stage pipeline architecture
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:127:// Feature catalog: Quality-aware 3-tier search fallback
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:208:// Feature catalog: Memory indexing (memory_save)
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:209:// Feature catalog: Verify-fix-verify memory quality loop
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:210:// Feature catalog: Dry-run preflight for memory_save
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:211:// Feature catalog: Prediction-error save arbitration
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:4
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:4
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:4
```

Semantic spot-check command:

```bash
rg -n "runQualityLoop|buildDryRunSummary|evaluateAndApplyPeDecision|atomicIndexMemory|executePipeline|shouldRunCommunityFallback|Quality-aware|Hybrid|database\.transaction|recordHistory|runPostMutationHooks|handleMemoryDelete" ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts" ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts" ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts"
```

Observed output:

```text
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:18:import { recordHistory } from '../lib/storage/history.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:20:import { runPostMutationHooks } from './mutation-hooks.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:102:async function handleMemoryDelete(args: DeleteArgs): Promise<MCPResponse> {
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:131:    database.transaction(() => {
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:138:          recordHistory(
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:153:          command: 'memory-crud-delete.handleMemoryDelete',
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:231:    const bulkDeleteTx = database.transaction(() => {
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:237:            recordHistory(
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:252:            command: 'memory-crud-delete.handleMemoryDelete',
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:289:      postMutationHooks = runPostMutationHooks('delete', { specFolder, deletedCount });
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:344:export { handleMemoryDelete };
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:16:import { executePipeline } from '../lib/search/pipeline/index.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:125:// Feature catalog: Hybrid search pipeline
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:127:// Feature catalog: Quality-aware 3-tier search fallback
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:377:function shouldRunCommunityFallback({
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1253:    const pipelineResult: PipelineResult = await executePipeline(pipelineConfig);
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1258:    const shouldRunCommunitySearch = shouldRunCommunityFallback({
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1922:  shouldRunCommunityFallback,
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:54:import { runPostMutationHooks } from './mutation-hooks.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:75:  runQualityLoop,
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:103:import { evaluateAndApplyPeDecision } from './save/pe-orchestration.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:140:import { atomicIndexMemory } from './save/atomic-index-memory.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:199:  buildDryRunSummary,
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:223:    runPostMutationHooks(sourceOperation, {
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:528:  const qualityLoopResult = runQualityLoop(parsed.content, buildQualityLoopMetadata(parsed, database), {
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2463:    const peResult = evaluateAndApplyPeDecision(
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2526:          const finalizeChunkedPeTx = database.transaction(() => {
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2593:    // atomicity. Uses database.transaction() so inner transaction() calls in
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2617:    const writeTransaction = database.transaction((): number => {
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3362:        : buildDryRunSummary(
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3787:    const applyGovernanceTx = database.transaction(() => {
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3898:  return atomicIndexMemory<PreparedParsedMemory | CanonicalAtomicPrepared>(params, options, {
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:4036:          postMutationHooks = runPostMutationHooks('atomic-save', {
```

Result: all three checked multi-feature files have `4` `// Feature catalog:` annotations. The listed features are supported by nearby imports/functions and handler code: `memory-save.ts` includes indexing, quality loop, dry-run, and prediction-error orchestration signals; `memory-search.ts` includes pipeline execution and fallback/search signals; `memory-crud-delete.ts` includes delete handler, transaction, history, and post-mutation hook signals.

### Pass / Fail

- **PASS**: all checked multi-feature files have >= 2 annotations and no obviously-missing features.

### Failure Triage

Review file implementation scope → Compare against catalog feature boundaries → Add missing annotations

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling_and_scripts/feature_catalog_code_references.md](../../feature_catalog/tooling_and_scripts/feature_catalog_code_references.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 137
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/multi_feature_annotation_coverage.md`
