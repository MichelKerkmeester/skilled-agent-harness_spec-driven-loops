---
title: "271 -- Research metadata backfill"
description: "This scenario validates the research metadata backfill script for `271`. It focuses on proving missing iteration metadata is created without rewriting already-complete folders."
version: 3.6.0.8
---

# 271 -- Research metadata backfill

## 1. OVERVIEW

This scenario validates the research metadata backfill script for `271`. It focuses on proving missing iteration metadata is created without rewriting already-complete folders.

---

## 2. SCENARIO CONTRACT


- Objective: Verify the research backfill script creates missing `description.json` and `graph-metadata.json` files while leaving complete iteration folders untouched.
- Real user request: `Please validate Research metadata backfill against scripts/memory/backfill-research-metadata.ts and tell me whether the expected signals are present: missing metadata files created; complete folders unchanged; output identifies only the folders that needed repair.`
- Prompt: `Validate Research metadata backfill against scripts/memory/backfill-research-metadata.ts and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: missing metadata files created; complete folders unchanged; output identifies only the folders that needed repair
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the script repairs incomplete research iteration folders without rewriting the complete ones

---

## 3. TEST EXECUTION

### Prompt

```
Validate Research metadata backfill against scripts/memory/backfill-research-metadata.ts and report cited pass/fail evidence.
```

### Commands

1. Prepare or use a fixture tree with both missing-metadata and complete research iteration folders
2. Run the backfill script against the fixture or packet
3. Inspect the created metadata files in the incomplete folders
4. Confirm the complete folders were left untouched

### Expected

Missing metadata files created; complete folders unchanged; output identifies only the folders that needed repair

### Evidence

Before listing for the pre-approved packet research tree:

```text
$ ls -la "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/031-manual-playbook-execution-sweep/research"
ls: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/031-manual-playbook-execution-sweep/research: No such file or directory
```

Existing fixture search:

```text
Glob .opencode/specs/**/research/**/iterations: No files found
Glob specs/**/research/**/iterations: No files found
```

Backfill dry-run output against the pre-approved packet:

```text
$ npx tsx memory/backfill-research-metadata.ts "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/031-manual-playbook-execution-sweep" --dry-run
{
  "specFolderPath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/031-manual-playbook-execution-sweep",
  "dryRun": true,
  "iterationDirectories": [],
  "descriptionCreated": 0,
  "graphCreated": 0,
  "unchanged": 0,
  "failed": 0,
  "failures": []
}
(node:91681) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

After listing for the pre-approved packet research tree:

```text
$ ls -la "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/031-manual-playbook-execution-sweep/research"
ls: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/031-manual-playbook-execution-sweep/research: No such file or directory
```

The scenario requires a fixture or packet containing both missing-metadata and complete research iteration folders. None exists under `.opencode/specs` or `specs`, and preparing one or running `--apply` would create or modify files outside the allowed write path for this execution.

### Pass / Fail

- **BLOCKED**: no eligible research iteration fixture or packet exists in the current repo state, and the allowed-write boundary permits editing only this scenario file.

### Failure Triage

Inspect `scripts/memory/backfill-research-metadata.ts`, the workflow follow-up integration, and the backfill test fixtures

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/research-metadata-backfill.md](../../feature_catalog/16--tooling-and-scripts/research-metadata-backfill.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 271
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/research-metadata-backfill.md`
