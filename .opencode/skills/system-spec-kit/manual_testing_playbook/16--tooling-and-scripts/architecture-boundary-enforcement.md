---
title: "206 -- Architecture boundary enforcement"
description: "This scenario validates architecture boundary enforcement for `206`. It focuses on confirming shared neutrality and thin-wrapper-only enforcement."
version: 3.6.0.11
---

# 206 -- Architecture boundary enforcement

## 1. OVERVIEW

This scenario validates architecture boundary enforcement for `206`. It focuses on confirming shared neutrality and thin-wrapper-only enforcement.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm shared neutrality and thin-wrapper-only enforcement.
- Real user request: `Please validate Architecture boundary enforcement against the documented validation surface and tell me whether the expected signals are present: shared/ imports into mcp_server/ or scripts/ are flagged across supported import syntaxes; wrappers over 50 substantive lines are rejected; wrappers missing child_process import or spawn/exec usage are rejected; wrappers missing scripts/dist/ delegation are rejected; compliant wrappers and allowed cross-module imports pass.`
- Prompt: `Validate Architecture boundary enforcement against the documented validation surface and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: shared/ imports into mcp_server/ or scripts/ are flagged across supported import syntaxes; wrappers over 50 substantive lines are rejected; wrappers missing child_process import or spawn/exec usage are rejected; wrappers missing scripts/dist/ delegation are rejected; compliant wrappers and allowed cross-module imports pass
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if both GAP A and GAP B violations are detected and clean controls pass without false positives

---

## 3. TEST EXECUTION

### Prompt

```
Validate Architecture boundary enforcement against the documented validation surface and report cited pass/fail evidence.
```

### Commands

1. run the architecture-boundary Vitest suite covering T39-T45
2. capture the GAP A cases for import/export/require/dynamic-import violations from shared/
3. capture the GAP B wrapper failures for over-50-line wrappers, missing child_process usage, and missing scripts/dist/ references
4. capture the clean-pass evidence for a legitimate thin wrapper and allowed shared imports
5. confirm the CLI path reports a passing architecture check when the fixture root is compliant

### Expected

shared/ imports into mcp_server/ or scripts/ are flagged across supported import syntaxes; wrappers over 50 substantive lines are rejected; wrappers missing child_process import or spawn/exec usage are rejected; wrappers missing scripts/dist/ delegation are rejected; compliant wrappers and allowed cross-module imports pass

### Evidence

Command: `node mcp_server/node_modules/vitest/vitest.mjs run scripts/tests/architecture-boundary-enforcement.vitest.ts --config mcp_server/vitest.config.ts --reporter verbose`

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

10:40:49 PM [vite] (ssr) Failed to load source map for /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/node_modules/typescript/lib/typescript.js.
Error: An error occurred while trying to read the map file at typescript.js.map
Error: ENOENT: no such file or directory, open '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/node_modules/typescript/lib/typescript.js.map'
    at Object.readFileSync (node:fs:440:20)
    at file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:18742:13
    at readFromFileMap (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:18442:13)
    at Object.exports.fromMapFileComment (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:18536:12)
    at Object.exports.fromMapFileSource (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:18547:22)
    at extractSourcemapFromFile (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:18728:87)
    at loadAndTransform (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:19697:22)
 ✓ scripts/tests/architecture-boundary-enforcement.vitest.ts > Architecture Boundary Enforcement > T39: GAP A detects shared -> mcp_server/scripts imports across syntax variants 6ms
 ✓ scripts/tests/architecture-boundary-enforcement.vitest.ts > Architecture Boundary Enforcement > parses export-from, import type, and require() forms when checking shared neutrality 2ms
 ✓ scripts/tests/architecture-boundary-enforcement.vitest.ts > Architecture Boundary Enforcement > T40: GAP B flags wrappers exceeding 50 substantive lines 2ms
 ✓ scripts/tests/architecture-boundary-enforcement.vitest.ts > Architecture Boundary Enforcement > T41: GAP B flags wrappers missing child_process import 1ms
 ✓ scripts/tests/architecture-boundary-enforcement.vitest.ts > Architecture Boundary Enforcement > T42: GAP B flags wrappers missing scripts/dist reference 1ms
 ✓ scripts/tests/architecture-boundary-enforcement.vitest.ts > Architecture Boundary Enforcement > T43: GAP B catches wrapper bypasses (barrel re-exports and scripts import without spawn/exec) 1ms
 ✓ scripts/tests/architecture-boundary-enforcement.vitest.ts > Architecture Boundary Enforcement > T44: legitimate thin wrappers pass GAP B checks 1ms
 ✓ scripts/tests/architecture-boundary-enforcement.vitest.ts > Architecture Boundary Enforcement > reports no violations when the fixture layout satisfies both architecture boundaries 1ms
 ✓ scripts/tests/architecture-boundary-enforcement.vitest.ts > Architecture Boundary Enforcement > T45: valid mcp_server/scripts -> shared imports are not false positives 1ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  22:40:49
   Duration  1.54s (transform 1.09s, setup 12ms, import 1.45s, tests 18ms, environment 0ms)
```

Command: `node scripts/dist/evals/check-architecture-boundaries.js`

```text
Architecture boundary check passed: shared/ neutrality OK, mcp_server/scripts/ wrappers OK.
```

### Pass / Fail

PASS — both GAP A and GAP B violations were detected by the Vitest suite, clean controls passed without false positives, and the CLI architecture check reported a passing package root.

### Failure Triage

Inspect `scripts/evals/check-architecture-boundaries.ts` import parsing, wrapper signal detection, and package-root resolution if violations are missed or false positives appear

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/architecture-boundary-enforcement.md](../../feature_catalog/16--tooling-and-scripts/architecture-boundary-enforcement.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 206
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/architecture-boundary-enforcement.md`
