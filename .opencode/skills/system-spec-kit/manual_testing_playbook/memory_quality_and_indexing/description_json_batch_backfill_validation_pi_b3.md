---
title: "131 -- Description.json batch backfill validation (PI-B3)"
description: "This scenario validates Description.json batch backfill validation (PI-B3) for `131`. It focuses on Confirm batch-generated folder descriptions exist and conform to schema."
audited_post_018: true
version: 3.6.0.17
---

# 131 -- Description.json batch backfill validation (PI-B3)

## 1. OVERVIEW

This scenario validates Description.json batch backfill validation (PI-B3) for `131`. It focuses on Confirm batch-generated folder descriptions exist and conform to schema.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm batch-generated folder descriptions exist and conform to schema.
- Real user request: `` Please validate Description.json batch backfill validation (PI-B3) against specId and tell me whether the expected signals are present: Description.json coverage stays in parity with the current active spec inventory; all JSON files parse without syntax errors; C1 field-type checks pass with `specId` string, `parentChain` array of strings, and `memorySequence` number; schema fields are present at varying depths; per-folder files preferred over spec.md fallback. ``
- Prompt: `Validate description.json batch backfill schema coverage.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Description.json coverage stays in parity with the current active spec inventory; all JSON files parse without syntax errors; C1 field-type checks pass with `specId` string, `parentChain` array of strings, and `memorySequence` number; schema fields are present at varying depths; per-folder files preferred over spec.md fallback
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if description.json coverage matches the active spec inventory, every description.json is valid JSON, C1 field-type checks pass, and per-folder generation is preferred over spec.md fallback

---

## 3. TEST EXECUTION

### Prompt

```
Validate description.json batch backfill schema coverage.
```

### Commands

1. Count spec folders with spec.md
2. Count description.json files — expect parity with the current active spec inventory
3. Validate JSON syntax of all files
4. Run explicit C1 conformance checks: `specId` is string, `parentChain` is array of strings, and `memorySequence` is number
5. Spot-check schema fields at depth 1, 3, 5+
6. Run generateFolderDescriptions → verify per-folder files preferred over spec.md

### Expected

Description.json coverage stays in parity with the current active spec inventory; all JSON files parse without syntax errors; C1 field-type checks pass with `specId` string, `parentChain` array of strings, and `memorySequence` number; schema fields are present at varying depths; per-folder files preferred over spec.md fallback

### Evidence

Command output for count comparison, JSON syntax validation, C1 field checks, depth spot checks, and stale-description risk:

```json
{
  "root": ".opencode/specs",
  "activeSpecFolders": 2394,
  "descriptionJsonFilesInActiveSpecFolders": 2385,
  "missingDescriptionJson": 9,
  "jsonSyntaxErrors": 0,
  "jsonSyntaxErrorExamples": [],
  "c1FieldErrors": 0,
  "c1FieldErrorExamples": [],
  "depthSpotChecks": {
    "depth3": {
      "path": ".opencode/specs/ai-systems/001-ai-system-architecture/001-two-runtime-packaging-design/description.json",
      "depth": 3,
      "fields": [
        "description",
        "folderSlug",
        "keywords",
        "lastUpdated",
        "level",
        "memoryNameHistory",
        "memorySequence",
        "parentChain",
        "specFolder",
        "specId"
      ],
      "specId": "001",
      "parentChain": [
        "ai-systems",
        "001-ai-system-architecture"
      ],
      "memorySequence": 0,
      "description": "Two-Runtime Packaging — Architecture Design (Copywriter pilot)"
    },
    "depth5plus": {
      "path": ".opencode/specs/deep-loops/z_archive/021-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime-release-cleanup/description.json",
      "depth": 5,
      "fields": [
        "description",
        "folderSlug",
        "keywords",
        "lastUpdated",
        "memoryNameHistory",
        "memorySequence",
        "parentChain",
        "specFolder",
        "specId"
      ],
      "specId": "001",
      "parentChain": [
        "skilled-agent-orchestration",
        "z_archive",
        "116-deep-skill-evolution",
        "000-release-cleanup"
      ],
      "memorySequence": 2,
      "description": "The `deep-loop-runtime` skill carries 266 lines of SKILL.md, 174 lines of README, 4 references (732 lines), 18 feature-catalog files plus 1 index (101"
    }
  },
  "staleExistingDescriptionJsonFiles": 110,
  "staleExistingDescriptionJsonExamples": [
    ".opencode/specs/barter/002-text-wrap-balance-react-native/description.json",
    ".opencode/specs/barter/005-notifications-system/description.json",
    ".opencode/specs/barter/006-visual-multi-language/description.json",
    ".opencode/specs/deep-loops/031-deep-loop-gpt-reliability/description.json",
    ".opencode/specs/deep-loops/031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/004-command-pre-route-headers/description.json"
  ]
}
```

Command output for missing `description.json` paths and depth inventory:

```json
{
  "missingDescriptionJsonPaths": [
    ".opencode/specs/barter/007-barter-deal-page-liquid-glass-bug",
    ".opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target",
    ".opencode/specs/skilled-agent-orchestration/z_archive/053-mcp-figma-transfer/001-barter-figma-agent/.backup-20260505-095155",
    ".opencode/specs/skilled-agent-orchestration/z_archive/053-mcp-figma-transfer/002-public-figma-agent/.backup-20260505-095156",
    ".opencode/specs/skilled-agent-orchestration/z_archive/053-mcp-figma-transfer/003-mcp-figma-skill-removal/.backup-20260505-095158",
    ".opencode/specs/skilled-agent-orchestration/z_archive/091-commit-standards-and-retroactive-rewrite/002-commit-standards-definition/.backup-20260516-114328",
    ".opencode/specs/skilled-agent-orchestration/z_archive/091-commit-standards-and-retroactive-rewrite/003-sk-git-skill-update/.backup-20260516-114328",
    ".opencode/specs/skilled-agent-orchestration/z_archive/091-commit-standards-and-retroactive-rewrite/004-cli-devin-rewrite-prompts/.backup-20260516-114328",
    ".opencode/specs/skilled-agent-orchestration/z_archive/091-commit-standards-and-retroactive-rewrite/005-retroactive-rewrite-execution/.backup-20260516-114328"
  ],
  "depthInventory": {
    "2": {
      "specFolders": 46,
      "withDescription": 45,
      "examples": [
        ".opencode/specs/ai-systems/001-ai-system-architecture",
        ".opencode/specs/ai-systems/002-skill-port-quality-audit",
        ".opencode/specs/ai-systems/003-skill-consolidation"
      ]
    },
    "3": {
      "specFolders": 410,
      "withDescription": 410,
      "examples": [
        ".opencode/specs/ai-systems/001-ai-system-architecture/001-two-runtime-packaging-design",
        ".opencode/specs/ai-systems/001-ai-system-architecture/002-copywriter-projects-build",
        ".opencode/specs/ai-systems/001-ai-system-architecture/003-copywriter-projects-validation"
      ]
    },
    "4": {
      "specFolders": 737,
      "withDescription": 736,
      "examples": [
        ".opencode/specs/deep-loops/030-agent-loops-improved/002-deep-loop-runtime/001-atomic-state-serialize-diff",
        ".opencode/specs/deep-loops/030-agent-loops-improved/002-deep-loop-runtime/002-atomic-state-integrity-helpers",
        ".opencode/specs/deep-loops/030-agent-loops-improved/002-deep-loop-runtime/003-atomic-state-deferred-writer"
      ]
    },
    "5": {
      "specFolders": 753,
      "withDescription": 746,
      "examples": [
        ".opencode/specs/deep-loops/z_archive/021-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime-release-cleanup",
        ".opencode/specs/deep-loops/z_archive/021-deep-skill-evolution/000-release-cleanup/002-deep-loop-runtime-doc-remediation",
        ".opencode/specs/deep-loops/z_archive/021-deep-skill-evolution/000-release-cleanup/003-deep-loop-runtime-evergreen-citation-sweep"
      ]
    },
    "6": {
      "specFolders": 306,
      "withDescription": 306,
      "examples": [
        ".opencode/specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/001-workflow-correctness-audit",
        ".opencode/specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/002-memory-data-integrity-audit",
        ".opencode/specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/003-skill-advisor-freshness-audit"
      ]
    },
    "7": {
      "specFolders": 127,
      "withDescription": 127,
      "examples": [
        ".opencode/specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/001-search-intelligence-stress-playbook/001-stress-playbook-foundation",
        ".opencode/specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/001-search-intelligence-stress-playbook/002-search-scenario-design",
        ".opencode/specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/001-search-intelligence-stress-playbook/003-search-scenario-execution"
      ]
    },
    "8": {
      "specFolders": 13,
      "withDescription": 13,
      "examples": [
        ".opencode/specs/system-speckit/z_archive/001-fix-command-dispatch/z_archive/023-path-scoped-rules/002-modular-architecture/test-fixtures/invalid-anchors",
        ".opencode/specs/system-speckit/z_archive/001-fix-command-dispatch/z_archive/023-path-scoped-rules/002-modular-architecture/test-fixtures/invalid-priority-tags",
        ".opencode/specs/system-speckit/z_archive/001-fix-command-dispatch/z_archive/023-path-scoped-rules/002-modular-architecture/test-fixtures/missing-evidence"
      ]
    },
    "10": {
      "specFolders": 2,
      "withDescription": 2,
      "examples": [
        ".opencode/specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/packet-docs",
        ".opencode/specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit/packet-docs"
      ]
    }
  }
}
```

Direct TS import command output before using a loader-only retry:

```text
node:internal/modules/esm/resolve:275
    throw new ERR_MODULE_NOT_FOUND(
          ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/description/description-merge.js' imported from /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts
    at finalizeResolution (node:internal/modules/esm/resolve:275:11)
    at moduleResolve (node:internal/modules/esm/resolve:861:10)
    at defaultResolve (node:internal/modules/esm/resolve:985:11)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:747:20)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:724:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:320:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:182:49)
    at process.processTicksAndRejections (node:internal/process/task_queues:103:5) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/description/description-merge.js'
}

Node.js v22.23.1
```

Command output for safe `generateFolderDescriptions` execution against a non-stale subtree, verifying per-folder preference without modifying files:

```text
(node:23397) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("data%3Atext/javascript%2Cexport%20async%20function%20resolve(specifier%2Ccontext%2CnextResolve)%7Btry%7Breturn%20await%20nextResolve(specifier%2Ccontext)%7Dcatch(error)%7Bif(error%26%26error.code%3D%3D%3D%5C"ERR_MODULE_NOT_FOUND%5C"%26%26specifier.endsWith(%5C".js%5C"))%7Breturn%20nextResolve(specifier.slice(0%2C-3)%2B%5C".ts%5C"%2Ccontext)%7Dthrow%20error%7D%7D", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)
{
  "command": "generateFolderDescriptions([\".opencode/specs/ai-systems/001-ai-system-architecture\"])",
  "cacheVersion": 1,
  "foldersReturned": 7,
  "generated": "2026-07-02T10:50:58.507Z",
  "sampleSpecFolder": "001-two-runtime-packaging-design",
  "emittedDescription": "Two-Runtime Packaging — Architecture Design (Copywriter pilot)",
  "perFolderDescription": "Two-Runtime Packaging — Architecture Design (Copywriter pilot)",
  "perFolderPreferred": true,
  "filesModifiedDuringRun": []
}
```

### Pass / Fail

- **FAIL**: `description.json` coverage does not match the active spec inventory: observed `activeSpecFolders: 2394`, `descriptionJsonFilesInActiveSpecFolders: 2385`, and `missingDescriptionJson: 9`.

### Failure Triage

Verify generateFolderDescriptions covers the current spec inventory → Check JSON schema validation and C1 field-type rules → Inspect per-folder vs spec.md preference logic

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [memory_quality_and_indexing/spec_folder_description_discovery.md](../../feature_catalog/memory_quality_and_indexing/spec_folder_description_discovery.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 131
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `memory_quality_and_indexing/description_json_batch_backfill_validation_pi_b3.md`
