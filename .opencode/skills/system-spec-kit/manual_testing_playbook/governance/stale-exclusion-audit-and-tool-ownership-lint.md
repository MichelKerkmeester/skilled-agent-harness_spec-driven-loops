---
title: "448 -- Stale-Exclusion Audit and Tool-Ownership Lint"
description: "Manual check that memory_health surfaces hard-exclusion audit metadata and the tool-ownership lint fails closed on drift from the registered 41-tool schema."
version: 3.6.0.2
---

# 448 -- Stale-Exclusion Audit and Tool-Ownership Lint

## 1. OVERVIEW

This scenario validates two read-only governance surfaces: stale-exclusion audit metadata and source-derived tool-ownership linting. The audit must classify intended archived exclusions separately from deprecated-tier silent-risk rows. The lint must derive the 41-tool ownership map from `TOOL_DEFINITIONS` and fail closed on missing tools, extra tools, malformed maps, field drift, or unreadable definitions.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm stale-exclusion audit visibility and blocking tool-ownership drift detection.
- Real user request: `Validate memory health stale-exclusion audit and prove the tool-ownership map blocks drift from the registered tool schema.`
- Prompt: `Validate stale-exclusion audit through memory_health and tool-ownership lint drift detection through the committed runner.`
- Expected execution process: Seed or use a sandbox with archived and deprecated rows, run `memory_health`, run the focused stale-audit/tool-ownership suite, then run the clean source-derived lint runner. Use the runner's env override to prove unreadable definitions fail closed without changing source files.
- Expected signals: `memory_health` exposes hard-exclusion audit metadata and hints; focused suite proves deprecated risk, archived intended exclusion, malformed policy handling, missing/extra ownership drift, and byte-identical clean serialization; clean lint reports a 41-tool map; unreadable definitions fail closed; source tree remains unchanged after temporary checks.
- Desired user-visible outcome: The operator can cite health audit classifications and prove the ownership lint blocks stale tool maps.
- Pass/fail: PASS only when health audit classifications are visible and the lint passes clean state while failing each drift simulation.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate stale-exclusion audit through memory_health and tool-ownership lint drift detection through the committed runner.
```

### Commands

1. Use a disposable DB fixture containing at least one archived row that should be intentionally excluded and one deprecated-tier row that should be flagged as silent-risk.
2. Run `memory_health({ reportMode: "full" })` and capture the exclusion audit block and hints.
3. Run the focused suite from `.opencode/skills/system-spec-kit/mcp_server`: `npx vitest run tests/stale-audit-tool-ownership.vitest.ts`.
4. Run the clean lint command from `.opencode/skills/system-spec-kit/mcp_server`: `node tests/tool-ownership-lint-runner.mjs`.
5. Create a temp directory, copy `tests/fixtures/tool-ownership-map.json` into it, and run `SPECKIT_TOOL_SCHEMAS_PATH=<temp>/missing-tool-schemas.ts SPECKIT_TOOL_OWNERSHIP_MAP_PATH=<temp>/tool-ownership-map.json node tests/tool-ownership-lint-runner.mjs` from the same cwd.
6. Run `git diff -- .opencode/skills/system-spec-kit/mcp_server/tests/fixtures/tool-ownership-map.json .opencode/skills/system-spec-kit/mcp_server/tests/tool-ownership-lint-runner.mjs` and confirm no source fixture was changed.

### Expected

- `memory_health` separates intended archived exclusions from deprecated-tier silent-risk rows and includes operator hints.
- Focused suite passes stale-exclusion and ownership drift cases.
- Clean lint reports `tool-ownership map clean` for the valid 41-tool ownership map.
- Unreadable definitions fail closed with an actionable message.
- The committed fixture and lint runner remain unchanged after temporary drift checks.

### Evidence

Attempted `memory_health({ reportMode: "full" })` through the Spec Memory CLI from the workspace root:

```text
$ node .opencode/bin/spec-memory.cjs memory_health --json '{"reportMode":"full"}' --format json --timeout-ms 3000
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
```

Attempted direct TypeScript source handler invocation against a disposable DB fixture containing `normal`, `deprecated`, and `archived` `memory_index.importance_tier` rows plus `memory_fts`:

```text
[shared/paths] database dir resolved outside @spec-kit workspace root (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit); falling back to import.meta.dirname-relative resolution
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

Attempted the project-local `tsx` entry path:

```text
sh: tsx: command not found
```

Focused suite from `.opencode/skills/system-spec-kit/mcp_server`:

```text
$ npx vitest run tests/stale-audit-tool-ownership.vitest.ts

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

stderr | mcp_server/tests/stale-audit-tool-ownership.vitest.ts
[shared/paths] database dir resolved outside @spec-kit workspace root (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit); falling back to import.meta.dirname-relative resolution

 ❯ mcp_server/tests/stale-audit-tool-ownership.vitest.ts (6 tests | 1 failed) 66ms
     × flags deprecated relevant rows while recall output stays byte-identical 6ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  mcp_server/tests/stale-audit-tool-ownership.vitest.ts > stale/status hard-exclusion audit > flags deprecated relevant rows while recall output stays byte-identical
AssertionError: expected [ 1, 2 ] to deeply equal [ 1 ]

- Expected
+ Received

  [
    1,
+   2,
  ]

 ❯ mcp_server/tests/stale-audit-tool-ownership.vitest.ts:111:32
    109|
    110|     expect(before).toBe(after);
    111|     expect(JSON.parse(before)).toEqual([1]);
       |                                ^
    112|     expect(report.status).toBe('risk');
    113|     expect(report.diagnostics).toEqual(

⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 5 passed (6)
   Start at  00:41:00
   Duration  1.04s (transform 671ms, setup 13ms, import 902ms, tests 66ms, environment 0ms)
```

Clean lint command from `.opencode/skills/system-spec-kit/mcp_server`:

```text
$ node tests/tool-ownership-lint-runner.mjs
tool-ownership map clean (39 tool(s))
```

Unreadable definitions drift check from `.opencode/skills/system-spec-kit/mcp_server` after creating a temp directory and copying `tests/fixtures/tool-ownership-map.json` to `<temp>/tool-ownership-map.json`:

```text
$ SPECKIT_TOOL_SCHEMAS_PATH="/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/opencode/tool-ownership.LuMGaC/missing-tool-schemas.ts" SPECKIT_TOOL_OWNERSHIP_MAP_PATH="/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/opencode/tool-ownership.LuMGaC/tool-ownership-map.json" node tests/tool-ownership-lint-runner.mjs
tool-ownership lint failed closed: TOOL_DEFINITIONS source unreadable: ENOENT: no such file or directory, open '/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/opencode/tool-ownership.LuMGaC/missing-tool-schemas.ts'
```

Committed fixture and lint runner diff from the workspace root:

```text
$ git diff -- .opencode/skills/system-spec-kit/mcp_server/tests/fixtures/tool-ownership-map.json .opencode/skills/system-spec-kit/mcp_server/tests/tool-ownership-lint-runner.mjs
```

No output was produced by the diff command.

### Pass / Fail

- **BLOCKED**: `memory_health({ reportMode: "full" })` could not be executed because the Spec Memory CLI reports stale dist output and rebuilding would modify files outside the allowed write path; additionally, the focused suite currently fails `flags deprecated relevant rows while recall output stays byte-identical` because recall returns `[1, 2]` instead of `[1]`.

### Failure Triage

Inspect `handlers/memory-crud-health.ts`, `tests/stale-audit-tool-ownership.vitest.ts`, `tests/tool-ownership-lint-runner.mjs`, and `tests/fixtures/tool-ownership-map.json`. Confirm the fixture contains both archived and deprecated rows before diagnosing missing audit fields.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `governance/stale-exclusion-audit-and-tool-ownership-lint.md` | Scenario contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `mcp_server/handlers/memory-crud-health.ts` | Health audit surface |
| `mcp_server/tests/stale-audit-tool-ownership.vitest.ts` | Audit and lint regression coverage |
| `mcp_server/tests/tool-ownership-lint-runner.mjs` | Source-derived lint runner |
| `mcp_server/tests/fixtures/tool-ownership-map.json` | Committed ownership fixture |

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 448
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `governance/stale-exclusion-audit-and-tool-ownership-lint.md`
