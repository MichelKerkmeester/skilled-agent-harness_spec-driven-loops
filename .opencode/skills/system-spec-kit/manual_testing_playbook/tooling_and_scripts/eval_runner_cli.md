---
title: "235 -- Eval Runner CLI"
description: "This scenario validates eval runner CLI for `235`. It focuses on confirming flag gating, channel parsing, report output, and artifact persistence for ablation runs."
version: 3.6.0.13
---

# 235 -- Eval Runner CLI

## 1. OVERVIEW

This scenario validates eval runner CLI for `235`. It focuses on confirming flag gating, channel parsing, report output, and artifact persistence for ablation runs.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm ablation flag gating, provenance preview, channel handling, report output, and artifact persistence.
- Real user request: `` Please validate Eval Runner CLI against /tmp/ablation-result.json and tell me whether the expected signals are present: mapping preview logs the production DB path and parent-memory count; flag-disabled run exits non-zero with usage guidance; enabled run initializes production and eval DBs; formatted report prints; `/tmp/ablation-result.json` is written. ``
- Prompt: `Validate Eval Runner CLI against /tmp/ablation-result.json and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: mapping preview logs the production DB path and parent-memory count; flag-disabled run exits non-zero with usage guidance; enabled run initializes production and eval DBs; formatted report prints; `/tmp/ablation-result.json` is written
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the mapping preview and CLI contract both behave as documented, with truncation clearly called out when present

---

## 3. TEST EXECUTION

### Prompt

```
Validate Eval Runner CLI against /tmp/ablation-result.json and report cited pass/fail evidence.
```

### Commands

1. `npx tsx .opencode/skills/system-spec-kit/scripts/evals/map-ground-truth-ids.ts --dry-run`
2. `npx tsx .opencode/skills/system-spec-kit/scripts/evals/run-ablation.ts --channels vector || true`
3. `SPECKIT_ABLATION=true npx tsx .opencode/skills/system-spec-kit/scripts/evals/run-ablation.ts --channels vector,fts5,invalid --verbose`
4. `node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync('/tmp/ablation-result.json','utf8')); console.log(data.productionMemoryCount, data.scriptVersion)"`

### Expected

Mapping preview logs the production DB path and parent-memory count; disabled run exits non-zero with enablement error; enabled run initializes the production DB and eval DB; invalid channel input does not silently crash; JSON artifact contains `productionMemoryCount` and `scriptVersion`

### Evidence

Command 1: `npx tsx .opencode/skills/system-spec-kit/scripts/evals/map-ground-truth-ids.ts --dry-run`

```text
npm warn exec The following package was not found and will be installed: tsx@4.22.5
=== Ground Truth ID Mapping Script ===
Database: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite
Mode: DRY RUN

Loaded 103 ground truth queries
Production DB has 32629 parent memories



<shell_metadata>
shell tool terminated command after exceeding timeout 120000 ms. If this command is expected to take longer and is not waiting for interactive input, retry with a larger timeout value in milliseconds.
</shell_metadata>
```

Command 2: `npx tsx .opencode/skills/system-spec-kit/scripts/evals/run-ablation.ts --channels vector || true`

```text

ABLATION STUDY (R13-S3)
------------------------------------------------------------
ERROR: SPECKIT_ABLATION=true is required to run ablation studies.
Usage: SPECKIT_ABLATION=true npx tsx scripts/evals/run-ablation.ts
```

Command 3: `SPECKIT_ABLATION=true npx tsx .opencode/skills/system-spec-kit/scripts/evals/run-ablation.ts --channels vector,fts5,invalid --verbose`

```text

ABLATION STUDY (R13-S3)
------------------------------------------------------------
Production DB: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite
FATAL: VectorIndexError: another live process holds the single-writer lock for /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite (held by pid 97253 since 2026-07-02T21:01:45.063Z); refusing to open a second writer on the same database
    at acquire_db_instance_lock (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/db-instance-lock.ts:190:13)
    at Module.initialize_db (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:2068:5)
    at main (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/evals/run-ablation.ts:107:26)
    at <anonymous> (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/evals/run-ablation.ts:209:1)
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5) {
  code: 'DB_LOCK_HELD'
}
```

Command 4: `node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync('/tmp/ablation-result.json','utf8')); console.log(data.productionMemoryCount, data.scriptVersion)"`

```text
node:fs:440
    return binding.readFileUtf8(path, stringToFlags(options.flag));
                   ^

Error: ENOENT: no such file or directory, open '/tmp/ablation-result.json'
    at Object.readFileSync (node:fs:440:20)
    at [eval]:1:50
    at runScriptInThisContext (node:internal/vm:209:10)
    at node:internal/process/execution:446:12
    at [eval]-wrapper:6:24
    at runScriptInContext (node:internal/process/execution:444:60)
    at evalFunction (node:internal/process/execution:279:30)
    at evalTypeScript (node:internal/process/execution:291:3)
    at node:internal/main/eval_string:74:3 {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: '/tmp/ablation-result.json'
}

Node.js v22.23.1
```

### Pass / Fail

- **Blocked**: The enabled run could not initialize the production DB because another live process held the single-writer lock for `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` (`code: 'DB_LOCK_HELD'`, held by pid 97253 since 2026-07-02T21:01:45.063Z), so `/tmp/ablation-result.json` was not written.

### Failure Triage

Inspect `scripts/evals/map-ground-truth-ids.ts`, `scripts/evals/run-ablation.ts`, ground-truth/eval DB initialization, and channel parsing if provenance, gating, or artifact persistence regresses

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling_and_scripts/eval_runner_cli.md](../../feature_catalog/tooling_and_scripts/eval_runner_cli.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 235
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/eval_runner_cli.md`
