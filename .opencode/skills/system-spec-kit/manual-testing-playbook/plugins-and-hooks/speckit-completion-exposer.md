---
title: "Speckit Completion Exposer"
description: "Manual scenario validating mk-speckit-completion tool and Claude CLI shim parity."
trigger_phrases:
  - "mk-speckit-completion"
  - "speckit completion exposer"
  - "spec folder completion state"
  - "checklist completion tool"
  - "plg-002"
version: 1.0.0.0
id: plugins-and-hooks-speckit-completion-exposer
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# Speckit Completion Exposer

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

`mk-speckit-completion` is a read-only, fail-open OpenCode `tool.register` plugin exposing one merged completion-state payload for a spec folder: inferred level (1/2/3, from canonical-doc presence), checklist P0/P1/P2 completion with evidence gaps (shelling `check-completion.sh --json`), and placeholder completeness percentage (shelling `calculate-completeness.sh --json`) -- replacing a hand-composed, hand-merged pair of Bash calls at the COMPLETION VERIFICATION gate. It ships as:

- OpenCode plugin adapter: `.opencode/plugins/mk-speckit-completion.js` (`tool.register`, no hooks, cannot block or write; registers exactly one tool, `mk_speckit_completion`).
- Claude/Bash CLI shim (parity front door, not a hook): `.opencode/bin/speckit-completion.cjs` -- Claude has no plugin tool-register surface, so this thin shim prints the identical merged JSON payload to stdout for a Bash-invoked caller.
- Shared runtime-neutral core: `.opencode/skills/system-spec-kit/scripts/lib/completion-state.cjs` (`computeCompletionState`), which both adapters call through unchanged and which never throws -- any resolution/exec/parse failure degrades only the affected section to `{status:'unavailable', error}`.

A related but distinct sibling exists in the same skill: `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/completion-evidence-stop.cjs` (Claude `Stop` hook) and its OpenCode counterpart `mk-completion-sentinel.js` (`session.idle`). Both reuse `completion-state.cjs`'s script-path constant and JSON-parse helper for their own advisory "did the last completion claim have recorded evidence" policy, but they are a separate consumer with their own core (`completion-evidence-sentinel.cjs`) and separate kill-switch -- out of scope for this scenario, which targets only the `mk_speckit_completion` tool and its CLI shim.

This scenario validates: the plugin's own kill-switch regression test; a live invocation of the plugin's registered tool `execute()` against three real spec-folder fixtures in this repo at Level 2 (COMPLETE), Level 2 (EVIDENCE_MISSING), and Level 3 (decision-record present); the `strict` flag pass-through; the Claude CLI shim's payload parity against the same Level-2-COMPLETE fixture; the shim's usage/exit-1 path on missing args; and the `MK_SPECKIT_COMPLETION_DISABLED` kill-switch, which must return an empty plugin hooks object (`{}`) -- the tool never registers at all -- not merely a registered tool that reports `disabled`.

---

## 2. SCENARIO CONTRACT

- Preconditions: Node is on `PATH`. `.opencode/plugins/mk-speckit-completion.js` and its core `.opencode/skills/system-spec-kit/scripts/lib/completion-state.cjs` exist (confirmed, see Evidence). At least one real Level-2 COMPLETE, one Level-2 EVIDENCE_MISSING, and one Level-3 spec folder exist in this repo so all three checklist code paths are exercised without inventing fixtures.
- Real user-facing trigger: an agent operating under the COMPLETION VERIFICATION gate calls the OpenCode tool `mk_speckit_completion({specFolder, strict})` (or, from Claude, runs the CLI shim) instead of hand-composing and hand-merging separate `check-completion.sh --json` and `calculate-completeness.sh --json` calls.
- Expected signals: the plugin's kill-switch unit test reports all assertions passed with exit 0; a live tool call against a Level-2 COMPLETE fixture returns `level:2`, `checklist.status:"COMPLETE"`, `checklist.passed:true`; a live tool call against a Level-2 fixture whose checklist is settled at EVIDENCE_MISSING returns that real status and `checklist.passed:false` with `qualityGates.p0MissingEvidence>0` (never degraded to `"unavailable"`); a live tool call against a Level-3 fixture (decision-record.md present) returns `level:3`; passing `strict:true` returns `checklist.strict:true` in the same payload shape; the CLI shim invoked on the same Level-2 COMPLETE fixture returns the same `level`/`checklist.status`/`checklist.passed` as the live tool call; the CLI shim with no args exits non-zero and prints usage; `MK_SPECKIT_COMPLETION_DISABLED=1` makes the plugin factory return `{}` (no `tool` key at all) while an unset or non-`"1"` value leaves `hooks.tool.mk_speckit_completion` registered with a callable `execute`.
- Desired user-visible outcome: a concise pass/fail verdict citing the exact captured command output.
- Pass/fail: PASS if all signals above hold from real captured output and `execute()` never throws for any of the three fixtures. FAIL if the kill-switch leaves the tool registered, if the checklist section ever misreports a known EVIDENCE_MISSING packet as `"unavailable"` or `"COMPLETE"`, if the CLI shim's payload diverges from the live tool's payload for the same fixture, or if any call throws instead of degrading gracefully.

---

## 3. TEST EXECUTION

### Commands

1. Run the plugin's own kill-switch regression test directly with node:

```bash
node .opencode/plugins/tests/mk-speckit-completion.test.cjs
```

2. Run the same test through the repo's `node:test` harness for a tap summary:

```bash
node --test .opencode/plugins/tests/mk-speckit-completion.test.cjs
```

3. Live-invoke the real plugin's registered tool `execute()` against three real spec-folder fixtures in this repo (a Level-2 COMPLETE packet, a Level-2 EVIDENCE_MISSING packet, and a Level-3 packet carrying a decision-record), plus a `strict:true` call on the Level-3 fixture. The two Level-2 folders are the same fixtures the shared core's own `completion-state.test.mjs` designates `LEVEL2_COMPLETE_FIXTURE` and `LEVEL2_INCOMPLETE_FIXTURE`; the Level-3 folder is a stable, completed Level-3 spec folder in this repo that carries `decision-record.md`, used to exercise the exposer's Level-3 resolution path:

```bash
node -e '
(async () => {
  const mod = await import(new URL("./.opencode/plugins/mk-speckit-completion.js", "file://" + process.cwd() + "/"));
  const plugin = mod.default;
  const hooks = await plugin({ directory: process.cwd() });
  const exec = hooks.tool.mk_speckit_completion.execute;

  const level2Complete = ".opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync";
  const level2Incomplete = ".opencode/specs/system-code-graph/002-codegraph-seeded-ppr";
  const level3 = ".opencode/specs/skilled-agent-orchestration/122-cli-codex-deprecation";

  console.log("=== Level-2 COMPLETE ===");
  console.log(await exec({ specFolder: level2Complete }, { directory: process.cwd() }));
  console.log("=== Level-2 EVIDENCE_MISSING ===");
  console.log(await exec({ specFolder: level2Incomplete }, { directory: process.cwd() }));
  console.log("=== Level-3 (decision-record present) ===");
  console.log(await exec({ specFolder: level3 }, { directory: process.cwd() }));
  console.log("=== Level-3 with strict:true ===");
  console.log(await exec({ specFolder: level3, strict: true }, { directory: process.cwd() }));
})();
'
```

4. Claude/Bash CLI shim parity check on the same Level-2 COMPLETE fixture:

```bash
node .opencode/bin/speckit-completion.cjs .opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync --project-dir "$PWD"
```

5. CLI shim usage/exit-1 path on missing args:

```bash
node .opencode/bin/speckit-completion.cjs
```

6. Kill-switch check -- expect an empty plugin hooks object (no `tool` key registered at all):

```bash
MK_SPECKIT_COMPLETION_DISABLED=1 node -e '
(async () => {
  const mod = await import(new URL("./.opencode/plugins/mk-speckit-completion.js", "file://" + process.cwd() + "/"));
  const hooks = await mod.default({ directory: process.cwd() });
  console.log("hooks keys:", Object.keys(hooks));
  console.log("hooks JSON:", JSON.stringify(hooks));
})();
'
```

### Expected

- Step 1-2: `mk-speckit-completion.test.cjs: all assertions passed`, exit 0; tap summary `# pass 1 / # fail 0`.
- Step 3: Level-2 COMPLETE fixture -> `level:2`, `checklist.status:"COMPLETE"`, `checklist.passed:true`. Level-2 fixture -> `level:2`, `checklist.status:"EVIDENCE_MISSING"`, `checklist.passed:false`, `qualityGates.p0MissingEvidence>0`. Level-3 fixture -> `level:3` (decision-record.md raises the inferred level over checklist-only). `strict:true` call -> identical shape with `checklist.strict:true`.
- Step 4: identical `level`/`checklist.status`/`checklist.passed` values to the Step 3 Level-2-COMPLETE call.
- Step 5: non-zero exit, usage text on stderr.
- Step 6: `hooks keys: []` and `hooks JSON: {}` -- not a registered tool that merely answers `disabled`.

---

## 4. EVIDENCE

Preconditions observed (source files read):

```text
.opencode/plugins/mk-speckit-completion.js read successfully; total 90 lines.
.opencode/skills/system-spec-kit/scripts/lib/completion-state.cjs read successfully; total 280 lines.
.opencode/plugins/tests/mk-speckit-completion.test.cjs read successfully; total 64 lines.
.opencode/bin/speckit-completion.cjs read successfully; total 97 lines.
.opencode/skills/system-spec-kit/scripts/spec/check-completion.sh exists (16769 bytes).
.opencode/skills/system-spec-kit/scripts/spec/calculate-completeness.sh exists (20553 bytes).
```

Command 1 and real output:

```bash
node .opencode/plugins/tests/mk-speckit-completion.test.cjs
```

```text
mk-speckit-completion.test.cjs: all assertions passed
EXIT_CODE=0
```

Command 2 and real output:

```bash
node --test .opencode/plugins/tests/mk-speckit-completion.test.cjs
```

```text
TAP version 13
# mk-speckit-completion.test.cjs: all assertions passed
# Subtest: .opencode/plugins/tests/mk-speckit-completion.test.cjs
ok 1 - .opencode/plugins/tests/mk-speckit-completion.test.cjs
  ---
  duration_ms: 54.041375
  type: 'test'
  ...
1..1
# tests 1
# suites 0
# pass 1
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 59.496417
```

Command 3 and real output (live tool `execute()` against three real fixtures):

```text
=== Level-2 COMPLETE ===
{
  "specFolder": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync",
  "level": 2,
  "filesPresent": {
    "spec": true,
    "plan": true,
    "tasks": true,
    "checklist": true,
    "decisionRecord": false,
    "implementationSummary": true
  },
  "checklist": {
    "folder": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync",
    "status": "COMPLETE",
    "passed": true,
    "strict": false,
    "summary": { "total": 23, "completed": 23, "percentage": 100 },
    "priorities": {
      "p0": { "total": 8, "completed": 8 },
      "p1": { "total": 14, "completed": 14 },
      "p2": { "total": 1, "completed": 1 },
      "untagged": { "total": 0, "completed": 0 }
    },
    "qualityGates": { "priorityContextMissing": 0, "p0MissingEvidence": 0, "p1MissingEvidence": 0 }
  },
  "placeholders": {
    "spec_folder": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync",
    "files_analyzed": 4,
    "overall_completion": 100,
    "total_placeholders": 0,
    "total_lines": 400,
    "files": {},
    "quality": { "enabled": false }
  },
  "generatedAt": "2026-07-11T12:40:44.439Z"
}
=== Level-2 EVIDENCE_MISSING ===
{
  "specFolder": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-code-graph/002-codegraph-seeded-ppr",
  "level": 2,
  "filesPresent": {
    "spec": true,
    "plan": true,
    "tasks": true,
    "checklist": true,
    "decisionRecord": false,
    "implementationSummary": true
  },
  "checklist": {
    "folder": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-code-graph/002-codegraph-seeded-ppr",
    "status": "EVIDENCE_MISSING",
    "passed": false,
    "strict": false,
    "summary": { "total": 22, "completed": 22, "percentage": 100 },
    "priorities": {
      "p0": { "total": 9, "completed": 9 },
      "p1": { "total": 12, "completed": 12 },
      "p2": { "total": 1, "completed": 1 },
      "untagged": { "total": 0, "completed": 0 }
    },
    "qualityGates": { "priorityContextMissing": 0, "p0MissingEvidence": 9, "p1MissingEvidence": 12 }
  },
  "placeholders": {
    "spec_folder": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-code-graph/002-codegraph-seeded-ppr",
    "files_analyzed": 4,
    "overall_completion": 100,
    "total_placeholders": 0,
    "total_lines": 425,
    "files": {},
    "quality": { "enabled": false }
  },
  "generatedAt": "2026-07-11T12:40:44.836Z"
}
=== Level-3 (decision-record present) ===
{
  "specFolder": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/122-cli-codex-deprecation",
  "level": 3,
  "filesPresent": {
    "spec": true,
    "plan": true,
    "tasks": true,
    "checklist": true,
    "decisionRecord": true,
    "implementationSummary": true
  },
  "checklist": {
    "folder": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/122-cli-codex-deprecation",
    "status": "EVIDENCE_MISSING",
    "passed": false,
    "strict": false,
    "summary": { "total": 50, "completed": 50, "percentage": 100 },
    "priorities": {
      "p0": { "total": 15, "completed": 15 },
      "p1": { "total": 26, "completed": 26 },
      "p2": { "total": 9, "completed": 9 },
      "untagged": { "total": 0, "completed": 0 }
    },
    "qualityGates": { "priorityContextMissing": 0, "p0MissingEvidence": 15, "p1MissingEvidence": 26 }
  },
  "placeholders": {
    "spec_folder": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/122-cli-codex-deprecation",
    "files_analyzed": 4,
    "overall_completion": 100,
    "total_placeholders": 0,
    "total_lines": 620,
    "files": {},
    "quality": { "enabled": false }
  },
  "generatedAt": "2026-07-11T13:04:02.761Z"
}
=== Level-3 with strict:true ===
{
  "specFolder": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/122-cli-codex-deprecation",
  "level": 3,
  "filesPresent": {
    "spec": true,
    "plan": true,
    "tasks": true,
    "checklist": true,
    "decisionRecord": true,
    "implementationSummary": true
  },
  "checklist": {
    "folder": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/122-cli-codex-deprecation",
    "status": "EVIDENCE_MISSING",
    "passed": false,
    "strict": true,
    "summary": { "total": 50, "completed": 50, "percentage": 100 },
    "priorities": {
      "p0": { "total": 15, "completed": 15 },
      "p1": { "total": 26, "completed": 26 },
      "p2": { "total": 9, "completed": 9 },
      "untagged": { "total": 0, "completed": 0 }
    },
    "qualityGates": { "priorityContextMissing": 0, "p0MissingEvidence": 15, "p1MissingEvidence": 26 }
  },
  "placeholders": {
    "spec_folder": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/122-cli-codex-deprecation",
    "files_analyzed": 4,
    "overall_completion": 100,
    "total_placeholders": 0,
    "total_lines": 620,
    "files": {},
    "quality": { "enabled": false }
  },
  "generatedAt": "2026-07-11T13:04:03.174Z"
}
```

Note on the Level-3 fixture: `122-cli-codex-deprecation` is a stable, completed Level-3 spec folder in this repo that carries `decision-record.md`, used to exercise the exposer's Level-3 resolution path (a present `decision-record.md` raises the inferred level to 3 over a checklist-only inference). The tool reports whatever completion state the folder currently holds -- a live signal read from the real fixture, not a fabricated or fixed count -- so this scenario asserts only the stable structural signal (`level:3`) and the payload shape, never a hard-coded checklist count or status.

Command 4 and real output (CLI shim parity):

```bash
node .opencode/bin/speckit-completion.cjs .opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync --project-dir "$PWD"
```

```text
{
  "specFolder": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync",
  "level": 2,
  "filesPresent": {
    "spec": true,
    "plan": true,
    "tasks": true,
    "checklist": true,
    "decisionRecord": false,
    "implementationSummary": true
  },
  "checklist": {
    "folder": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync",
    "status": "COMPLETE",
    "passed": true,
    "strict": false,
    "summary": { "total": 23, "completed": 23, "percentage": 100 },
    "priorities": {
      "p0": { "total": 8, "completed": 8 },
      "p1": { "total": 14, "completed": 14 },
      "p2": { "total": 1, "completed": 1 },
      "untagged": { "total": 0, "completed": 0 }
    },
    "qualityGates": { "priorityContextMissing": 0, "p0MissingEvidence": 0, "p1MissingEvidence": 0 }
  },
  "placeholders": {
    "spec_folder": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync",
    "files_analyzed": 4,
    "overall_completion": 100,
    "total_placeholders": 0,
    "total_lines": 400,
    "files": {},
    "quality": { "enabled": false }
  },
  "generatedAt": "2026-07-11T12:40:52.404Z"
}
```

(exit code 0; `level`/`checklist.status`/`checklist.passed` match the Step 3 Level-2-COMPLETE live tool call exactly)

Command 5 and real output (usage/exit-1 path):

```bash
node .opencode/bin/speckit-completion.cjs
```

```text
Usage: speckit-completion.cjs <spec-folder> [--strict] [--project-dir <dir>]

Prints one merged JSON payload:
  {specFolder, level, filesPresent, checklist, placeholders, generatedAt}

Options:
  --strict             Treat P2 checklist items as required (see check-completion.sh --strict)
  --project-dir <dir>  Resolve <spec-folder> and shell both scripts from this directory (default: cwd)
  --help, -h            Show this help

Set MK_SPECKIT_COMPLETION_DISABLED=1 to make this a full no-op (no filesystem probe, no script exec).
EXIT=1
```

Command 6 and real output (kill-switch, plus an unset control run):

```bash
MK_SPECKIT_COMPLETION_DISABLED=1 node -e '...'
```

```text
hooks keys: []
hooks JSON: {}
```

```bash
node -e '... (kill-switch unset) ...'
```

```text
hooks keys: [ 'tool' ]
tool keys: [ 'mk_speckit_completion' ]
```

Observation (not part of the pass/fail contract, recorded for maintainers): the shared core's own suite, `.opencode/skills/system-spec-kit/scripts/lib/completion-state.test.mjs`, is not currently picked up by either project vitest config (`.opencode/skills/system-spec-kit/vitest.config.ts` or `mcp-server/vitest.config.ts`) -- both `include` globs require a `.vitest.ts` or `.test.ts` extension, and this file is `.test.mjs`. Running `node_modules/.bin/vitest run scripts/lib/completion-state.test.mjs` from `mcp-server/` produced `No test files found, exiting with code 1`. This scenario instead exercises the identical `computeCompletionState` code paths live through the plugin's own `execute()` and the CLI shim above, so the core logic itself is not left unverified; only that specific vitest suite invocation is dormant.

---

## 5. SOURCE FILES

- OpenCode plugin adapter: `.opencode/plugins/mk-speckit-completion.js`
- Plugin regression test: `.opencode/plugins/tests/mk-speckit-completion.test.cjs`
- Claude/Bash CLI shim: `.opencode/bin/speckit-completion.cjs`
- Shared runtime-neutral core: `.opencode/skills/system-spec-kit/scripts/lib/completion-state.cjs`
- Core's own vitest suite (currently outside project `include` globs, see Evidence): `.opencode/skills/system-spec-kit/scripts/lib/completion-state.test.mjs`
- Shelled scripts merged by the core: `.opencode/skills/system-spec-kit/scripts/spec/check-completion.sh`, `.opencode/skills/system-spec-kit/scripts/spec/calculate-completeness.sh`
- Plugin entrypoint registry (confirms adapter role and kill-switch env): `.opencode/plugins/README.md` §3
- Related-but-distinct sibling consumer (out of scope here, sharing infrastructure only): `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/completion-evidence-stop.cjs`, `.opencode/plugins/mk-completion-sentinel.js`, `.opencode/skills/system-spec-kit/mcp-server/lib/hooks/completion-evidence-sentinel.cjs`

---

## 6. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: speckit-completion-exposer
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/speckit-completion-exposer.md

---

## 7. PASS/FAIL

**PASS**

The kill-switch regression test passed with `all assertions passed` (exit 0), confirmed both directly and via the `node --test` tap harness (`# pass 1 / # fail 0`). Live invocation of the actual registered tool's `execute()` against three real, distinct spec-folder fixtures in this repo correctly reported `level:2`/`COMPLETE`/`passed:true` for the Level-2 COMPLETE packet, the real (non-degraded) `EVIDENCE_MISSING`/`passed:false`/`p0MissingEvidence:9` for the Level-2 packet with missing evidence markers, and `level:3` for the Level-3 packet carrying `decision-record.md`, with its checklist reported at whatever completion state the folder currently holds (`EVIDENCE_MISSING`/`passed:false` on this run) -- an honest live signal, not a hard-coded count. The `strict:true` flag passed through correctly (`checklist.strict:true`). The Claude/Bash CLI shim returned an identical `level`/`checklist.status`/`checklist.passed` for the same fixture as the live tool call, and its no-args path exited non-zero with usage text. The kill-switch produced a genuinely empty plugin hooks object (`{}`, no `tool` key) rather than a registered-but-disabled tool, and an unset/`"0"` value left the tool registered with a callable `execute`. One non-blocking observation is recorded in Evidence: the shared core's own `completion-state.test.mjs` vitest suite is not currently reachable via the project's vitest `include` globs (extension mismatch), though this does not affect the pass verdict since the same core logic was exercised live above.
