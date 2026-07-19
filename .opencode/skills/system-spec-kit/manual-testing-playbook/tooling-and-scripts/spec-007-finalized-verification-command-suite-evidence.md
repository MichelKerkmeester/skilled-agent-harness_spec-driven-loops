---
title: "108 -- Spec 007 finalized verification command suite evidence"
description: "This scenario validates Spec 007 finalized verification command suite evidence for `108`. It focuses on Confirm the recorded verification set matches the current Spec 007 evidence."
version: 3.6.0.14
id: tooling-and-scripts-spec-007-finalized-verification-command-suite-evidence
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 108 -- Spec 007 finalized verification command suite evidence

## 1. OVERVIEW

This scenario validates Spec 007 finalized verification command suite evidence for `108`. It focuses on Confirm the recorded verification set matches the current Spec 007 evidence.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm the recorded verification set matches the current Spec 007 evidence.
- Real user request: `` Please validate Spec 007 finalized verification command suite evidence against npx tsc -b and tell me whether the expected signals are present: `npx tsc -b` PASS, `npm run lint` PASS, UX suite PASS with 7 files / 510 tests, stdio plus embeddings suite PASS with 2 files / 15 tests, and MCP SDK stdio smoke PASS with 28 tools listed. ``
- Prompt: `Validate Spec 007 finalized verification command suite evidence against npx tsc -b and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `npx tsc -b` PASS, `npm run lint` PASS, UX suite PASS with 7 files / 510 tests, stdio plus embeddings suite PASS with 2 files / 15 tests, and MCP SDK stdio smoke PASS with 28 tools listed
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all five verification steps match the recorded Spec 007 evidence exactly

---

## 3. TEST EXECUTION

### Prompt

```
Validate Spec 007 finalized verification command suite evidence against npx tsc -b and report cited pass/fail evidence.
```

### Commands

1. `npx tsc -b`
2. `npm run lint`
3. `npx vitest run tests/hooks-ux-feedback.vitest.ts tests/context-server.vitest.ts tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts tests/memory-crud-extended.vitest.ts tests/memory-save-ux-regressions.vitest.ts`
4. `npx vitest run tests/embeddings.vitest.ts tests/stdio-logging-safety.vitest.ts`
5. run MCP SDK stdio smoke test against `node .opencode/skills/system-spec-kit/mcp-server/dist/context-server.js`

### Expected

`npx tsc -b` PASS, `npm run lint` PASS, UX suite PASS with 7 files / 510 tests, stdio plus embeddings suite PASS with 2 files / 15 tests, and MCP SDK stdio smoke PASS with 28 tools listed

### Evidence

Executed 2026-07-03 from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` and, after the root-level test paths were not found, from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp-server` where the listed `tests/*.vitest.ts` files exist.

`npx tsc -b` from repository root:

```text
This is not the tsc command you are looking for

To get access to the TypeScript compiler, tsc, from the command line either:

- Use npm install typescript to first add TypeScript to your project before using npx
- Use yarn to avoid accidentally running code from un-installed packages
```

`npm run lint` from repository root:

```text
npm error Missing script: "lint"
npm error
npm error Did you mean this?
npm error   npm link # Symlink a package folder
npm error
npm error To see a list of scripts, run:
npm error   npm run
npm error A complete log of this run can be found in: /Users/michelkerkmeester/.npm/_logs/2026-07-02T22_02_00_315Z-debug-0.log
```

UX suite command from repository root:

```text
RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

No test files found, exiting with code 1

filter: tests/hooks-ux-feedback.vitest.ts, tests/context-server.vitest.ts, tests/handler-checkpoints.vitest.ts, tests/tool-input-schema.vitest.ts, tests/mcp-input-validation.vitest.ts, tests/memory-crud-extended.vitest.ts, tests/memory-save-ux-regressions.vitest.ts
include: **/*.{test,spec}.?(c|m)[jt]s?(x)
exclude:  **/node_modules/**, **/.git/**
```

Stdio plus embeddings suite command from repository root:

```text
RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

No test files found, exiting with code 1

filter: tests/embeddings.vitest.ts, tests/stdio-logging-safety.vitest.ts
include: **/*.{test,spec}.?(c|m)[jt]s?(x)
exclude:  **/node_modules/**, **/.git/**
```

`npx tsc -b` from `.opencode/skills/system-spec-kit/mcp-server`:

```text
(no output)
```

`npm run lint` from `.opencode/skills/system-spec-kit/mcp-server`:

```text
> @spec-kit/mcp-server@1.8.0 lint
> eslint . --ext .ts

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp-server/context-server.ts
  242:7  error  'GRAPH_ENRICHMENT_SYMBOL_LIMIT' is assigned a value but never used. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-stop.ts
  22:27  error  'parseAssistantTextTurns' is defined but never used. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp-server/lib/cache/embedding-cache.ts
  268:10  error  'estimateRowBytes' is defined but never used. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp-server/lib/eval/ablation-framework.ts
  412:10  error  'canQueryVecMemories' is defined but never used. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp-server/lib/observability/retrieval-observability.ts
  66:7  error  'CHANNEL_KEYS' is assigned a value but only used as a type. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp-server/lib/routing/content-router.ts
  35:7  error  'SOURCE_SHAPES' is assigned a value but only used as a type. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp-server/lib/search/pipeline/stage1-candidate-gen.ts
  174:10  error  'applyFolderFilter' is defined but never used. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp-server/lib/session/session-snapshot.ts
  16:8  error  'SharedPayloadProvenance' is defined but never used. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp-server/lib/validation/generated-metadata-integrity.ts
  16:39  error  'isStatusCompletionConsistencyGateEnabled' is defined but never used. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts
   71:7   error  'VALID_LEVELS' is assigned a value but never used. Allowed unused vars must match /^_/u
  348:52  error  'folder' is defined but never used. Allowed unused args must match /^_/u

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp-server/tools/index.ts
  32:3  error  'callerContext' is defined but never used. Allowed unused args must match /^_/u  @typescript-eslint/no-unused-vars

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp-server/vitest.config.ts
  13:7  error  'INCLUDE_BENCHES' is assigned a value but never used. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars

✖ 35 problems (30 errors, 5 warnings)
  0 errors and 5 warnings potentially fixable with the `--fix` option.

npm error Lifecycle script `lint` failed with error:
npm error code 1
npm error path /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp-server
npm error workspace @spec-kit/mcp-server@1.8.0
npm error location /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp-server
npm error command failed
npm error command sh -c eslint . --ext .ts
```

UX suite command from `.opencode/skills/system-spec-kit/mcp-server`:

```text
RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

Test Files  7 passed (7)
     Tests  599 passed | 23 skipped (622)
  Start at  00:03:40
  Duration  3.09s (transform 1.11s, setup 46ms, import 1.28s, tests 1.35s, environment 0ms)
```

Stdio plus embeddings suite command from `.opencode/skills/system-spec-kit/mcp-server`:

```text
RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

Test Files  2 passed (2)
     Tests  25 passed | 5 skipped (30)
  Start at  00:03:51
  Duration  264ms (transform 70ms, setup 25ms, import 81ms, tests 45ms, environment 0ms)
```

MCP SDK stdio smoke against `node .opencode/skills/system-spec-kit/mcp-server/dist/context-server.js`:

```text
[context-server] ╔════════════════════════════════════════════════════════╗
[context-server] ║  WARNING: Native runtime changed since last install  ║
[context-server] ╠════════════════════════════════════════════════════════╣
[context-server] ║  Installed: Node v25.2.1 (MODULE_VERSION 141, darwin/arm64)          ║
[context-server] ║  Running:   Node v22.23.1 (MODULE_VERSION 127, darwin/arm64)         ║
[context-server] ║  Mismatch:  module ABI                                               ║
[context-server] ╠════════════════════════════════════════════════════════╣
[context-server] ║  Native modules may crash. Run:                         ║
[context-server] ║  bash scripts/setup/rebuild-native-modules.sh           ║
[context-server] ╚════════════════════════════════════════════════════════╝
[context-server] Detected runtime: unknown (hookPolicy=unknown)
[context-server] another live process holds the single-writer lock for /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp-server/database/context-index.sqlite (held by pid 97253 since 2026-07-02T21:01:45.063Z); refusing to open a second writer on the same database
McpError: MCP error -32000: Connection closed
```

### Pass / Fail

- **BLOCKED**: MCP SDK stdio smoke could not complete because the server refused to open while another live process held the single-writer lock for `database/context-index.sqlite`; additionally, observed lint and test totals did not match the expected recorded Spec 007 signals.
- **Pass**: all five verification steps match the recorded Spec 007 evidence exactly
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Re-run the failing verification step in isolation and inspect the corresponding Spec 007 handler or test coverage

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: *(Spec 007 verification suite — no dedicated catalog entry)*

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 108
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/spec-007-finalized-verification-command-suite-evidence.md`
