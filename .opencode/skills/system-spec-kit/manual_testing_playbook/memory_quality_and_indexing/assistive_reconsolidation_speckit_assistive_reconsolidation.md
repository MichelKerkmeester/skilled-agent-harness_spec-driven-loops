---
title: "165 -- Assistive reconsolidation (SPECKIT_ASSISTIVE_RECONSOLIDATION)"
description: "This scenario validates assistive reconsolidation (SPECKIT_ASSISTIVE_RECONSOLIDATION) for `165`. It focuses on enabling the flag, saving a near-duplicate, and verifying advisory-note/recommend behavior."
audited_post_018: true
version: 3.6.0.18
id: memory-quality-and-indexing-assistive-reconsolidation-speckit-assistive-reconsolidation
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 165 -- Assistive reconsolidation (SPECKIT_ASSISTIVE_RECONSOLIDATION)

## 1. OVERVIEW

This scenario validates assistive reconsolidation (SPECKIT_ASSISTIVE_RECONSOLIDATION) for `165`. It focuses on enabling the flag, saving a near-duplicate, verifying shadow-archive and recommendation behavior, and confirming companion predecessor-change detection.

---

## 2. SCENARIO CONTRACT


- Objective: Verify the high-similarity compatibility note and borderline recommendation behavior plus companion predecessor validation.
- Real user request: `` Please validate Assistive reconsolidation (SPECKIT_ASSISTIVE_RECONSOLIDATION) against SPECKIT_ASSISTIVE_RECONSOLIDATION=true and tell me whether the expected signals are present: similarity >= 0.96 returns the internal 'auto_merge' classifier and emits a high-similarity compatibility note without archiving the older row; 0.88 <= similarity < 0.96 returns 'review' with AssistiveRecommendation logged; similarity < 0.88 returns 'keep_separate'; review tier produces classification (supersede/complement/keep_separate) without destructive action; companion merge guard aborts stale merge attempts with `predecessor_changed` or `predecessor_gone`. ``
- Prompt: `Validate assistive reconsolidation merge and recommendation behavior.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: similarity >= 0.96 returns the internal 'auto_merge' classifier and emits a high-similarity compatibility note without archiving the older row; 0.88 <= similarity < 0.96 returns 'review' with AssistiveRecommendation logged; similarity < 0.88 returns 'keep_separate'; review tier produces classification (supersede/complement/keep_separate) without destructive action; companion merge guard aborts stale merge attempts with `predecessor_changed` or `predecessor_gone`
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the high-similarity compatibility note triggers at >= 0.96, recommendation logs for review tier, no destructive action occurs for assistive tiers, and predecessor-change detection blocks stale companion merges; FAIL if tier classification is wrong, assistive tiers mutate state, or stale predecessor changes still commit a merge

---

## 3. TEST EXECUTION

### Prompt

```
Validate assistive reconsolidation merge and recommendation behavior.
```

### Commands

1. `SPECKIT_ASSISTIVE_RECONSOLIDATION=true`
2. Save memory A, then save near-duplicate B (sim >= 0.96)
3. Verify the high-similarity compatibility note
4. Save memory C (0.88 <= sim < 0.96 vs A)
5. Verify AssistiveRecommendation logged
6. `npx vitest run tests/assistive-reconsolidation.vitest.ts`

### Expected

High-similarity compatibility note at >= 0.96; review with recommendation at >= 0.88; keep_separate below 0.88; no destructive action for assistive tiers

### Evidence

BLOCKED on the direct save-memory steps: Commands 2 and 4 say "Save memory A", "save near-duplicate B", and "Save memory C" but do not provide concrete `memory_save` file paths or memory contents. The available `memory_save` CLI requires an existing spec/constitutional file path, and this scenario's allowed-write constraint permits editing only this scenario file.

CLI surface check:

```text
$ node .opencode/bin/spec-memory.cjs memory_save --help
spec-memory memory_save

Description:
  [L2:Core] Index a spec document or constitutional file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Routed saves write continuity into canonical spec documents (decision-record.md, implementation-summary.md, handover.md). Includes pre-flight validation (T067-T070) for anchor format, duplicate detection, and token budget estimation. Token Budget: 3500.

Aliases:
  memory_save, memory-save, memorySave

Input schema:
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "filePath": {
      "type": "string",
      "minLength": 1,
      "description": "Absolute path to a spec document under specs/**/ or .opencode/specs/**/ (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, handover.md, research.md, resource-map.md, description.json, graph-metadata.json) or a constitutional memory under .opencode/skills/*/constitutional/"
    },
    "force": {
      "type": "boolean",
      "default": false,
      "description": "Force re-index even if content hash unchanged"
    },
    "dryRun": {
      "type": "boolean",
      "default": false,
      "description": "Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation"
    },
    "skipPreflight": {
      "type": "boolean",
      "default": false,
      "description": "Skip pre-flight validation checks (not recommended)"
    },
    "asyncEmbedding": {
      "type": "boolean",
      "default": false,
      "description": "When true, embedding generation is deferred for non-blocking saves. The spec-doc record is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior."
    },
    "routeAs": {
      "type": "string",
      "enum": [
        "narrative_progress",
        "narrative_delivery",
        "decision",
        "handover_state",
        "research_finding",
        "task_update",
        "metadata_only",
        "drop"
      ],
      "description": "Optional routing override hint for canonical continuity saves."
    },
    "mergeModeHint": {
      "type": "string",
      "enum": [
        "append-as-paragraph",
        "insert-new-adr",
        "append-table-row",
        "update-in-place",
        "append-section"
      ],
      "description": "Optional merge-mode hint for routed canonical continuity saves."
    },
    "tenantId": {
      "type": "string",
      "description": "Tenant boundary for governed ingest."
    },
    "userId": {
      "type": "string",
      "description": "User boundary for governed ingest."
    },
    "agentId": {
      "type": "string",
      "description": "Agent boundary for governed ingest."
    },
    "sessionId": {
      "type": "string",
      "description": "Session boundary for governed ingest."
    },
    "provenanceSource": {
      "type": "string",
      "description": "Required provenance source when governed ingest validation applies."
    },
    "provenanceActor": {
      "type": "string",
      "description": "Required provenance actor when governed ingest validation applies."
    },
    "governedAt": {
      "type": "string",
      "description": "ISO timestamp for governed ingest. Defaults to now when omitted."
    },
    "retentionPolicy": {
      "type": "string",
      "enum": [
        "keep",
        "ephemeral"
      ],
      "description": "Retention class applied to the saved spec-doc record."
    },
    "deleteAfter": {
      "type": "string",
      "description": "Optional ISO timestamp after which retention sweep may delete the spec-doc record."
    },
    "plannerMode": {
      "type": "string",
      "enum": [
        "plan-only",
        "hybrid",
        "full-auto"
      ],
      "description": "Optional routed-save planner execution mode."
    },
    "targetAnchorId": {
      "type": "string",
      "description": "Optional target anchor for routed continuity saves."
    }
  },
  "required": [
    "filePath"
  ]
}
(node:54865) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

Direct TypeScript invocation for classifier/log output was attempted without adding dependencies or files, but the package has no `tsx` binary and the local loader path failed on a type declaration import:

```text
$ SPECKIT_ASSISTIVE_RECONSOLIDATION=true npx tsx -e "import { classifyAssistiveSimilarity, classifySupersededOrComplement, logAssistiveRecommendation } from './handlers/save/reconsolidation-bridge.ts'; const output = { '0.96': classifyAssistiveSimilarity(0.96), '0.9599': classifyAssistiveSimilarity(0.9599), '0.88': classifyAssistiveSimilarity(0.88), '0.8799': classifyAssistiveSimilarity(0.8799), reviewClassification: classifySupersededOrComplement('Short old content.', 'Short old content. Plus a lot of new detail that was not present before, with additional context and explanations that expand significantly on the original.') }; console.log(JSON.stringify(output, null, 2)); logAssistiveRecommendation({ olderMemoryId: 5, newerMemoryId: 6, similarity: 0.89, classification: 'complement', recommendedAt: 1764678306000 });"
sh: tsx: command not found
```

```text
$ SPECKIT_ASSISTIVE_RECONSOLIDATION=true node --import ../scripts/node_modules/tsx/dist/loader.mjs -e "import { classifyAssistiveSimilarity, classifySupersededOrComplement, logAssistiveRecommendation } from './handlers/save/reconsolidation-bridge.ts'; const output = { '0.96': classifyAssistiveSimilarity(0.96), '0.9599': classifyAssistiveSimilarity(0.9599), '0.88': classifyAssistiveSimilarity(0.88), '0.8799': classifyAssistiveSimilarity(0.8799), reviewClassification: classifySupersededOrComplement('Short old content.', 'Short old content. Plus a lot of new detail that was not present before, with additional context and explanations that expand significantly on the original.') }; console.log(JSON.stringify(output, null, 2)); logAssistiveRecommendation({ olderMemoryId: 5, newerMemoryId: 6, similarity: 0.89, classification: 'complement', recommendedAt: 1764678306000 });"
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

Targeted Vitest evidence for classifier tiers and AssistiveRecommendation log coverage:

```text
$ SPECKIT_ASSISTIVE_RECONSOLIDATION=true npx vitest run tests/assistive-reconsolidation.vitest.ts -t "classifyAssistiveSimilarity|logAssistiveRecommendation|Threshold Tier Integration" --reporter verbose

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

stderr | mcp_server/tests/assistive-reconsolidation.vitest.ts
[shared/paths] database dir resolved outside @spec-kit workspace root (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit); falling back to import.meta.dirname-relative resolution

 ↓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — Feature Flag > isAssistiveReconsolidationEnabled returns true by default (graduated)
 ↓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — Feature Flag > isAssistiveReconsolidationEnabled returns true for "true"
 ↓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — Feature Flag > isAssistiveReconsolidationEnabled returns true for "1"
 ↓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — Feature Flag > isAssistiveReconsolidationEnabled returns false for "false"
 ↓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — Feature Flag > isAssistiveReconsolidationEnabled returns false for "0"
 ↓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — Feature Flag > keeps classifier helpers available for deferred follow-up decisions when save-time reconsolidation stays opt-in
 ↓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — Constants > ASSISTIVE_COMPATIBILITY_NOTE_THRESHOLD is 0.96
 ↓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — Constants > ASSISTIVE_REVIEW_THRESHOLD is 0.88
 ↓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — Constants > compatibility-note threshold is above review threshold
 ✓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — classifyAssistiveSimilarity > returns "auto_merge" for similarity >= 0.96 1ms
 ✓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — classifyAssistiveSimilarity > returns "review" for similarity in [0.88, 0.96) 0ms
 ✓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — classifyAssistiveSimilarity > returns "keep_separate" for similarity < 0.88 0ms
 ✓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — classifyAssistiveSimilarity > exact boundary 0.96 is auto_merge 0ms
 ✓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — classifyAssistiveSimilarity > exact boundary 0.88 is review 0ms
 ✓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — classifyAssistiveSimilarity > just below 0.88 is keep_separate 0ms
 ↓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — classifySupersededOrComplement > returns "supersede" when newer content is similar length to older
 ↓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — classifySupersededOrComplement > returns "complement" when newer content is substantially longer (>1.2x)
 ↓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — classifySupersededOrComplement > returns "supersede" for equal-length content
 ↓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — classifySupersededOrComplement > handles empty older content gracefully
 ↓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — classifySupersededOrComplement > handles empty newer content gracefully
 ↓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — classifySupersededOrComplement > returns "supersede" when newer is exactly at the 1.2x boundary
 ↓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — classifySupersededOrComplement > returns "complement" when newer is just above the 1.2x boundary
 ✓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — logAssistiveRecommendation > logs the recommendation to console.warn without throwing 1ms
 ✓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — logAssistiveRecommendation > logs complement classification correctly 0ms
 ✓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — logAssistiveRecommendation > preserves advisory_stale markers for committed recommendations 0ms
 ✓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — Threshold Tier Integration > covers all three tiers with non-overlapping ranges 0ms
 ✓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — Threshold Tier Integration > no destructive action below 0.88 threshold 0ms
 ✓ mcp_server/tests/assistive-reconsolidation.vitest.ts > Assistive Reconsolidation — Threshold Tier Integration > high-similarity compatibility note tier only fires at >= 0.96 0ms

 Test Files  1 passed (1)
      Tests  12 passed | 16 skipped (28)
   Start at  12:25:54
   Duration  756ms (transform 490ms, setup 19ms, import 644ms, tests 4ms, environment 0ms)
```

Full scenario test command output:

```text
$ SPECKIT_ASSISTIVE_RECONSOLIDATION=true npx vitest run tests/assistive-reconsolidation.vitest.ts

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  28 passed (28)
   Start at  12:24:38
   Duration  610ms (transform 399ms, setup 15ms, import 518ms, tests 4ms, environment 0ms)
```

### Pass / Fail

- **BLOCKED**: the classifier/recommendation tests pass, but the manual save-memory steps are under-specified because the scenario does not provide concrete memory A/B/C file paths or contents compatible with `memory_save` under the allowed-write constraint.

### Failure Triage

Verify isAssistiveReconsolidationEnabled() → Check ASSISTIVE_COMPATIBILITY_NOTE_THRESHOLD (0.96) → Check ASSISTIVE_REVIEW_THRESHOLD (0.88) → Inspect classifyBorderlinePair() logic → Verify recommendation persistence

---

### Prompt

```
Validate companion reconsolidation aborts when predecessor changes.
```

### Commands

1. Enable `SPECKIT_ASSISTIVE_RECONSOLIDATION=true`
2. seed a merge-eligible predecessor used by the companion reconsolidation module
3. begin async merge preparation
4. mutate, archive, or delete the predecessor before transaction re-read
5. verify `predecessor_changed` or `predecessor_gone` is surfaced and no stale merged row is inserted
6. `npx vitest run .opencode/skills/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts -t \"Aborts merge when predecessor changes during embedding generation\"`

### Expected

Companion merge path aborts with `predecessor_changed` or `predecessor_gone`; no stale merged row is inserted; assistive layer remains recommendation/shadow-only rather than performing a destructive content merge

### Evidence

Exact command from the playbook, run from workspace root, failed to discover the `.vitest.ts` test file:

```text
$ SPECKIT_ASSISTIVE_RECONSOLIDATION=true npx vitest run .opencode/skills/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts -t "Aborts merge when predecessor changes during embedding generation"

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

No test files found, exiting with code 1

filter: .opencode/skills/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts
include: **/*.{test,spec}.?(c|m)[jt]s?(x)
exclude:  **/node_modules/**, **/.git/**
```

Equivalent targeted package-root command verified the expected predecessor-change behavior:

```text
$ SPECKIT_ASSISTIVE_RECONSOLIDATION=true npx vitest run mcp_server/tests/reconsolidation.vitest.ts -t "Aborts merge when predecessor changes during embedding generation"

 RUN  v4.1.6 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

(node:56601) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

 Test Files  1 passed (1)
      Tests  1 passed | 53 skipped (54)
   Start at  12:25:06
   Duration  638ms (transform 414ms, setup 0ms, import 560ms, tests 7ms, environment 0ms)
```

DB assertion covered by the passing targeted test at `mcp_server/tests/reconsolidation.vitest.ts`:

```text
expect(result.action).toBe('complement');
expect(result.status).toBe('predecessor_changed');
expect(result.newMemoryId).toBe(0);

expect(rows).toEqual([
  { id: 105, is_archived: 0, content_text: 'Concurrent writer content' },
]);
```

### Pass / Fail

- **BLOCKED**: the expected predecessor-change behavior passes with the package-root command, but the exact command written in this playbook fails with `No test files found`, so the scenario is not executable exactly as written.

### Failure Triage

Verify predecessor snapshot comparison (`content_hash`, `updated_at`) → Check shared reconsolidation guardrails → Confirm assistive bridge still limits itself to shadow-archive/recommend behavior

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [memory_quality_and_indexing/assistive_reconsolidation.md](../../feature_catalog/memory_quality_and_indexing/assistive_reconsolidation.md)
- Feature flag reference: [feature_flag_reference/1_search_pipeline_features_speckit.md](../feature_flag_reference/1_search_pipeline_features_speckit.md)
- Source file: `mcp_server/handlers/save/reconsolidation-bridge.ts`

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 165
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `memory_quality_and_indexing/assistive_reconsolidation_speckit_assistive_reconsolidation.md`
