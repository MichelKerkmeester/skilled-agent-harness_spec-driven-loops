---
title: "043 -- Pre-storage quality gate (TM-04)"
description: "This scenario validates Pre-storage quality gate (TM-04) for `043`. It focuses on Confirm 3-layer gate behavior."
audited_post_018: true
version: 3.6.0.18
---

# 043 -- Pre-storage quality gate (TM-04)

## 1. OVERVIEW

This scenario validates Pre-storage quality gate (TM-04) for `043`. It focuses on Confirm 3-layer gate behavior.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm 3-layer gate behavior.
- Real user request: `Please validate Pre-storage quality gate (TM-04) against the documented validation surface and tell me whether the expected signals are present: Structural, semantic, and duplication checks all run; blocking failures stop the save; warn-only findings remain advisory; no fake persisted decision-log claim.`
- Prompt: `Validate the pre-storage quality gate for structural, semantic, and duplication checks.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Structural, semantic, and duplication checks all run; blocking failures stop the save; warn-only findings remain advisory; no fake persisted decision-log claim
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Each failure class triggers the correct gate stage with accurate blocking vs advisory behavior; FAIL: A stage is skipped, severity is wrong, or the scenario claims a persisted decision log that runtime does not emit

---

## 3. TEST EXECUTION

### Prompt

```
Validate the pre-storage quality gate for structural, semantic, and duplication checks.
```

### Commands

1. Submit one structural failure, one semantic-quality failure, and one duplicate-content case
2. observe block vs warn behavior at each step
3. capture returned warnings and save outcome

### Expected

Structural, semantic, and duplication checks all run; blocking failures stop the save; warn-only findings remain advisory

### Evidence

Commands executed from `.opencode/skills/system-spec-kit/mcp_server`.

Attempted direct pure-function import first to avoid fixture writes; this did not execute the gate because the local TS runtime resolution failed before import completion:

```text
$ node --import ../scripts/node_modules/tsx/dist/loader.mjs --input-type=module -e 'import { validateStructural, scoreContentQuality, checkSemanticDedup, SIGNAL_DENSITY_THRESHOLD, SEMANTIC_DEDUP_THRESHOLD } from "./lib/validation/save-quality-gate.ts"; const makeContent = (length) => "x".repeat(length); const structural = validateStructural({ title: null, content: makeContent(100), specFolder: "003-memory" }); const contentQuality = scoreContentQuality({ title: "x", content: makeContent(60), triggerPhrases: [], anchors: [] }); const semanticDedup = checkSemanticDedup([1,1,1], "003-memory", () => [{ id: 99, file_path: "/test/dup.md", similarity: 0.95 }]); const observed = { structuralFailure: { stage: "Layer 1: structural", result: structural, saveOutcome: structural.pass ? "allow" : "block" }, semanticQualityFailure: { stage: "Layer 2: content quality", threshold: SIGNAL_DENSITY_THRESHOLD, result: contentQuality, saveOutcome: contentQuality.pass ? "allow" : "advisory-warn-only" }, duplicateContentCase: { stage: "Layer 3: semantic dedup", threshold: SEMANTIC_DEDUP_THRESHOLD, result: semanticDedup, saveOutcome: semanticDedup.pass ? "allow" : "advisory-warn-only" } }; console.log(JSON.stringify(observed, null, 2));'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/node_modules/@types/better-sqlite3/index.d.ts:159
export = Database;
         ^

ReferenceError: Database is not defined
```

Second direct import attempt with Node's TS stripping also failed before executing the gate because the source imports `.js` siblings that are not present without a build:

```text
$ node --experimental-strip-types --input-type=module -e 'import { validateStructural, scoreContentQuality, checkSemanticDedup, SIGNAL_DENSITY_THRESHOLD, SEMANTIC_DEDUP_THRESHOLD } from "./lib/validation/save-quality-gate.ts"; const makeContent = (length) => "x".repeat(length); const structural = validateStructural({ title: null, content: makeContent(100), specFolder: "003-memory" }); const contentQuality = scoreContentQuality({ title: "x", content: makeContent(60), triggerPhrases: [], anchors: [] }); const semanticDedup = checkSemanticDedup([1,1,1], "003-memory", () => [{ id: 99, file_path: "/test/dup.md", similarity: 0.95 }]); const observed = { structuralFailure: { stage: "Layer 1: structural", result: structural, saveOutcome: structural.pass ? "allow" : "block" }, semanticQualityFailure: { stage: "Layer 2: content quality", threshold: SIGNAL_DENSITY_THRESHOLD, result: contentQuality, saveOutcome: contentQuality.pass ? "allow" : "advisory-warn-only" }, duplicateContentCase: { stage: "Layer 3: semantic dedup", threshold: SEMANTIC_DEDUP_THRESHOLD, result: semanticDedup, saveOutcome: semanticDedup.pass ? "allow" : "advisory-warn-only" } }; console.log(JSON.stringify(observed, null, 2));'
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.js' imported from /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts
```

Supported project harness execution of the documented TM-04 failure classes:

```text
$ npx vitest run tests/save-quality-gate.vitest.ts -t "WO4|UG3|UG4|UG5" --reporter verbose

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

 ✓ mcp_server/tests/save-quality-gate.vitest.ts > Save Quality Gate (TM-04) > Warn-Only Mode (MR12) > WO4: Would-reject logged but save allowed in warn-only mode 37ms
 ✓ mcp_server/tests/save-quality-gate.vitest.ts > Save Quality Gate (TM-04) > Unified Quality Gate > UG3: Gate ON, structural failure rejects 0ms
 ✓ mcp_server/tests/save-quality-gate.vitest.ts > Save Quality Gate (TM-04) > Unified Quality Gate > UG4: Gate ON, low quality content rejects 0ms
 ✓ mcp_server/tests/save-quality-gate.vitest.ts > Save Quality Gate (TM-04) > Unified Quality Gate > UG5: Gate ON, semantic duplicate rejects 1ms
 ✓ mcp_server/tests/save-quality-gate.vitest.ts > Save Quality Gate (TM-04) > Unified Quality Gate > UG5b: legacy mode still blocks semantic and score-heavy failures 0ms

 Test Files  1 passed (1)
      Tests  5 passed | 78 skipped (83)
   Start at  13:29:06
   Duration  613ms (transform 365ms, setup 18ms, import 477ms, tests 39ms, environment 0ms)
```

Observed stage/save outcomes from the passing focused cases:

```text
WO4: Would-reject logged but save allowed in warn-only mode
UG3: Gate ON, structural failure rejects
UG4: Gate ON, low quality content rejects
UG5: Gate ON, semantic duplicate rejects
UG5b: legacy mode still blocks semantic and score-heavy failures
```

Decision-log claim check:

```text
$ grep pattern: decision[- ]log|persisted decision|decision log under mcp_server/**/*.ts
Found 4 matches
mcp_server/lib/storage/incremental-index.ts: Line 189:  * 6-path decision logic for whether a file needs re-indexing.
mcp_server/tests/memory-parser-stable-chunks.vitest.ts: Line 9: <!-- ANCHOR:decision-log -->
mcp_server/tests/memory-parser-stable-chunks.vitest.ts: Line 13: <!-- /ANCHOR:decision-log -->
mcp_server/tests/memory-parser-stable-chunks.vitest.ts: Line 20:       chunkId: 'anchor:decision-log',
```

No `persisted decision log` runtime claim was observed in the TM-04 quality-gate output.

### Pass / Fail

- **PASS**: Focused TM-04 harness output passed `WO4`, `UG3`, `UG4`, `UG5`, and `UG5b`, showing warn-only would-reject remains advisory, structural failures reject, content-quality and semantic-duplicate cases are surfaced, legacy mode still blocks advisory failures, and no persisted decision-log claim appeared in the observed output.

### Failure Triage

Verify gate ordering, warning surfacing, and save-path branching in the actual runtime output

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [memory_quality_and_indexing/pre_storage_quality_gate.md](../../feature_catalog/memory_quality_and_indexing/pre_storage_quality_gate.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 043
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `memory_quality_and_indexing/pre_storage_quality_gate_tm_04.md`
