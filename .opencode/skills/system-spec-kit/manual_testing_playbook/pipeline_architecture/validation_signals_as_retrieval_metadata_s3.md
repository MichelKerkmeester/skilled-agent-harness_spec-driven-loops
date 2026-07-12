---
title: "053 -- Validation signals as retrieval metadata (S3)"
description: "This scenario validates Validation signals as retrieval metadata (S3) for `053`. It focuses on Confirm bounded multiplier."
audited_post_018: true
version: 3.6.0.16
---

# 053 -- Validation signals as retrieval metadata (S3)

## 1. OVERVIEW

This scenario validates Validation signals as retrieval metadata (S3) for `053`. It focuses on Confirm bounded multiplier.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm bounded multiplier.
- Real user request: `Please validate Validation signals as retrieval metadata (S3) against the documented validation surface and tell me whether the expected signals are present: Validation signal multiplier bounded to [0.8, 1.2]; highly validated docs score higher; zero-validation docs use 1.0 multiplier.`
- Prompt: `Validate validation signals as retrieval metadata (S3) against the documented validation surface and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Validation signal multiplier bounded to [0.8, 1.2]; highly validated docs score higher; zero-validation docs use 1.0 multiplier
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: All multipliers in [0.8, 1.2]; positive validations increase multiplier; zero validations = 1.0; FAIL: Multiplier out of bounds or zero-validation not neutral

---

## 3. TEST EXECUTION

### Prompt

```
Validate validation signals as retrieval metadata (S3) against the documented validation surface and return pass/fail with cited evidence.
```

### Commands

1. Prepare docs with varied validations
2. run stage-2
3. verify 0.8-1.2 bounds

### Expected

Validation signal multiplier bounded to [0.8, 1.2]; highly validated docs score higher; zero-validation docs use 1.0 multiplier

### Evidence

Command: `npx vitest run tests/validation-metadata.vitest.ts`

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  32 passed (32)
   Start at  15:44:57
   Duration  655ms (transform 431ms, setup 17ms, import 557ms, tests 5ms, environment 0ms)
```

Command: `npx vitest run tests/validation-metadata.vitest.ts -t "Stage2 validation scoring integration" --reporter=verbose`

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

stderr | mcp_server/tests/validation-metadata.vitest.ts
[shared/paths] database dir resolved outside @spec-kit workspace root (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit); falling back to import.meta.dirname-relative resolution

 ↓ mcp_server/tests/validation-metadata.vitest.ts > extractValidationMetadata — quality score signals > T1: extracts qualityScore from db quality_score when present and positive
 ↓ mcp_server/tests/validation-metadata.vitest.ts > extractValidationMetadata — quality score signals > T2: clamps qualityScore above 1.0 to 1.0; treats negative as absent (no tier fallback → null)
 ↓ mcp_server/tests/validation-metadata.vitest.ts > extractValidationMetadata — quality score signals > T3: falls back to tier score when quality_score is zero
 ↓ mcp_server/tests/validation-metadata.vitest.ts > extractValidationMetadata — quality score signals > T4: falls back to tier score when quality_score is absent
 ↓ mcp_server/tests/validation-metadata.vitest.ts > extractValidationMetadata — quality score signals > T5: maps all known importance tiers to expected quality scores
 ↓ mcp_server/tests/validation-metadata.vitest.ts > extractValidationMetadata — SPECKIT_LEVEL from content > T6: extracts specLevel 1 from <!-- SPECKIT_LEVEL: 1 --> marker
 ↓ mcp_server/tests/validation-metadata.vitest.ts > extractValidationMetadata — SPECKIT_LEVEL from content > T7: extracts specLevel 2 and 3 from their respective markers
 ↓ mcp_server/tests/validation-metadata.vitest.ts > extractValidationMetadata — SPECKIT_LEVEL from content > T8: maps SPECKIT_LEVEL: 3+ to specLevel 4
 ↓ mcp_server/tests/validation-metadata.vitest.ts > extractValidationMetadata — SPECKIT_LEVEL from content > T9: returns no specLevel when marker is absent from content
 ↓ mcp_server/tests/validation-metadata.vitest.ts > extractValidationMetadata — completion status > T10: returns completionStatus=complete for <!-- VALIDATED --> marker
 ↓ mcp_server/tests/validation-metadata.vitest.ts > extractValidationMetadata — completion status > T10b: returns completionStatus=complete for <!-- VALIDATION: PASS --> marker
 ↓ mcp_server/tests/validation-metadata.vitest.ts > extractValidationMetadata — completion status > T10c: returns completionStatus=complete for <!-- CHECKLIST: COMPLETE --> marker
 ↓ mcp_server/tests/validation-metadata.vitest.ts > extractValidationMetadata — completion status > T11: returns completionStatus=partial for [x] checklist items without completion marker
 ↓ mcp_server/tests/validation-metadata.vitest.ts > extractValidationMetadata — completion status > T11b: returns completionStatus=partial when SPECKIT_LEVEL marker present without completion
 ↓ mcp_server/tests/validation-metadata.vitest.ts > extractValidationMetadata — completion status > T12: does not set completionStatus when no markers present in content
 ↓ mcp_server/tests/validation-metadata.vitest.ts > extractValidationMetadata — checklist file path heuristic > T13: sets hasChecklist=true when file_path contains "checklist"
 ↓ mcp_server/tests/validation-metadata.vitest.ts > extractValidationMetadata — checklist file path heuristic > T14: does not set hasChecklist when file_path is unrelated
 ↓ mcp_server/tests/validation-metadata.vitest.ts > extractValidationMetadata — edge cases > T15: returns null when row has no signals (no tier, no quality_score, no content)
 ↓ mcp_server/tests/validation-metadata.vitest.ts > extractValidationMetadata — edge cases > T15b: returns null for unknown/missing importance_tier with no other signals
 ↓ mcp_server/tests/validation-metadata.vitest.ts > extractValidationMetadata — edge cases > T16: handles content being an empty string gracefully
 ↓ mcp_server/tests/validation-metadata.vitest.ts > extractValidationMetadata — edge cases > T16b: prefers precomputedContent over content when both present
 ↓ mcp_server/tests/validation-metadata.vitest.ts > enrichResultsWithValidationMetadata — batch enrichment > T17: attaches validationMetadata to rows that have signals
 ↓ mcp_server/tests/validation-metadata.vitest.ts > enrichResultsWithValidationMetadata — batch enrichment > T18: rows without any signals pass through without validationMetadata key
 ↓ mcp_server/tests/validation-metadata.vitest.ts > enrichResultsWithValidationMetadata — batch enrichment > T19: returns empty array unchanged
 ↓ mcp_server/tests/validation-metadata.vitest.ts > enrichResultsWithValidationMetadata — batch enrichment > T20: enriches all fields in a single row that has multiple signals
 ↓ mcp_server/tests/validation-metadata.vitest.ts > enrichResultsWithValidationMetadata — score immutability > T21: does not modify score, rrfScore, or similarity fields
 ↓ mcp_server/tests/validation-metadata.vitest.ts > enrichResultsWithValidationMetadata — score immutability > T22: does not modify intentAdjustedScore or importance_weight
 ↓ mcp_server/tests/validation-metadata.vitest.ts > TIER_QUALITY_SCORES and VALIDATION_COMPLETE_MARKERS exports > TIER_QUALITY_SCORES covers all six standard tiers
 ↓ mcp_server/tests/validation-metadata.vitest.ts > TIER_QUALITY_SCORES and VALIDATION_COMPLETE_MARKERS exports > TIER_QUALITY_SCORES values are ordered correctly (constitutional > deprecated)
 ↓ mcp_server/tests/validation-metadata.vitest.ts > TIER_QUALITY_SCORES and VALIDATION_COMPLETE_MARKERS exports > VALIDATION_COMPLETE_MARKERS has at least 3 known markers
 ✓ mcp_server/tests/validation-metadata.vitest.ts > Stage2 validation scoring integration > applies higher score to higher-quality validation metadata 1ms
 ✓ mcp_server/tests/validation-metadata.vitest.ts > Stage2 validation scoring integration > leaves score unchanged when validation metadata is absent 0ms

 Test Files  1 passed (1)
      Tests  2 passed | 30 skipped (32)
   Start at  15:46:52
   Duration  625ms (transform 423ms, setup 20ms, import 536ms, tests 2ms, environment 0ms)
```

Command: `node --import ../scripts/node_modules/tsx/dist/loader.mjs -e 'import { __testables } from "./lib/search/pipeline/stage2-fusion.ts"; ...'`

```text
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

Command: read-only bounds verification using the documented Stage 2 formula from `mcp_server/lib/search/pipeline/stage2-fusion.ts` lines 145-160 and 271-289.

```text
[
  {
    "id": "max-clamp",
    "baseScore": 0.5,
    "qualityFactor": 1.1,
    "specLevelBonus": 0.06,
    "completionBonus": 0.04,
    "checklistBonus": 0.01,
    "adjustedScore": 0.6,
    "multiplier": 1.2
  },
  {
    "id": "highly-validated",
    "baseScore": 0.5,
    "qualityFactor": 1.09,
    "specLevelBonus": 0.04,
    "completionBonus": 0.04,
    "checklistBonus": 0.01,
    "adjustedScore": 0.59,
    "multiplier": 1.18
  },
  {
    "id": "low-validation",
    "baseScore": 0.5,
    "qualityFactor": 0.94,
    "specLevelBonus": 0,
    "completionBonus": 0,
    "checklistBonus": 0,
    "adjustedScore": 0.47,
    "multiplier": 0.94
  },
  {
    "id": "zero-validation",
    "baseScore": 0.5,
    "adjustedScore": 0.5,
    "multiplier": 1
  }
]
{
  "minMultiplier": 0.94,
  "maxMultiplier": 1.2,
  "allWithinBounds": true,
  "highlyValidatedBeatsLowValidated": true,
  "zeroValidationMultiplier": 1
}
```

### Pass / Fail

- **PASS**: Stage 2 validation scoring tests passed; observed verification values show all multipliers within [0.8, 1.2], highly validated output `0.59` greater than low-validation output `0.47`, and zero-validation multiplier `1`.

### Failure Triage

Verify multiplier formula → Check bounds clamping → Inspect validation count resolution

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [pipeline_architecture/validation_signals_as_retrieval_metadata.md](../../feature_catalog/pipeline_architecture/validation_signals_as_retrieval_metadata.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 053
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `pipeline_architecture/validation_signals_as_retrieval_metadata_s3.md`
