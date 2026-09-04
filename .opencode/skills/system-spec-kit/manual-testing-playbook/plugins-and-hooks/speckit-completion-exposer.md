---
title: "Speckit Completion Exposer"
description: "Manual scenario validating system-speckit-completion tool and Claude CLI shim parity."
trigger_phrases:
  - "system-speckit-completion"
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

`system-speckit-completion` is a read-only, fail-open OpenCode `tool.register` plugin exposing one merged completion-state payload for a spec folder: inferred level (1/2/3, from canonical-doc presence), checklist P0/P1/P2 completion with evidence gaps (shelling `check-completion.sh --json`), and placeholder completeness percentage (shelling `calculate-completeness.sh --json`) -- replacing a hand-composed, hand-merged pair of Bash calls at the COMPLETION VERIFICATION gate. It ships as:

- OpenCode plugin adapter: `.opencode/plugins/system-speckit-completion.js` (`tool.register`, no hooks, cannot block or write; registers exactly one tool, `system_speckit_completion`).
- Claude/Bash CLI shim (parity front door, not a hook): `.opencode/bin/speckit-completion.cjs` -- Claude has no plugin tool-register surface, so this thin shim prints the identical merged JSON payload to stdout for a Bash-invoked caller.
- Shared runtime-neutral core: `.opencode/skills/system-spec-kit/scripts/lib/completion-state.cjs` (`computeCompletionState`), which both adapters call through unchanged and which never throws -- any resolution/exec/parse failure degrades only the affected section to `{status:'unavailable', error}`.

A related but distinct sibling exists in the same skill: `.opencode/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs` (Claude `Stop` hook) and its OpenCode counterpart `system-completion-sentinel.js` (`session.idle`). Both reuse `completion-state.cjs`'s script-path constant and JSON-parse helper for their own advisory "did the last completion claim have recorded evidence" policy, but they are a separate consumer with their own core (`completion-evidence-sentinel.cjs`) and separate kill-switch -- out of scope for this scenario, which targets only the `system_speckit_completion` tool and its CLI shim.

This scenario validates: the plugin's own kill-switch regression test; a live invocation of the plugin's registered tool `execute()` against three real spec-folder fixtures in this repo at Level 2 (COMPLETE), Level 2 (EVIDENCE_MISSING), and Level 3 (decision-record present); the `strict` flag pass-through; the Claude CLI shim's payload parity against the same Level-2-COMPLETE fixture; the shim's usage/exit-1 path on missing args; and the `SYSTEM_SPECKIT_COMPLETION_DISABLED` kill-switch, which must return an empty plugin hooks object (`{}`) -- the tool never registers at all -- not merely a registered tool that reports `disabled`.

---

## 2. SCENARIO CONTRACT

- Preconditions: Node is on `PATH`. `.opencode/plugins/system-speckit-completion.js` and its core `.opencode/skills/system-spec-kit/scripts/lib/completion-state.cjs` exist (confirmed, see Evidence). At least one real Level-2 COMPLETE, one Level-2 EVIDENCE_MISSING, and one Level-3 spec folder exist in this repo so all three checklist code paths are exercised without inventing fixtures.
- Real user-facing trigger: an agent operating under the COMPLETION VERIFICATION gate calls the OpenCode tool `system_speckit_completion({specFolder, strict})` (or, from Claude, runs the CLI shim) instead of hand-composing and hand-merging separate `check-completion.sh --json` and `calculate-completeness.sh --json` calls.
- Expected signals: the plugin's kill-switch unit test reports all assertions passed with exit 0; a live tool call against a Level-2 COMPLETE fixture returns `level:2`, `checklist.status:"COMPLETE"`, `checklist.passed:true`; a live tool call against a Level-2 fixture whose checklist is settled at EVIDENCE_MISSING returns that real status and `checklist.passed:false` with `qualityGates.p0MissingEvidence>0` (never degraded to `"unavailable"`); a live tool call against a Level-3 fixture (decision-record.md present) returns `level:3`; passing `strict:true` returns `checklist.strict:true` in the same payload shape; the CLI shim invoked on the same Level-2 COMPLETE fixture returns the same `level`/`checklist.status`/`checklist.passed` as the live tool call; the CLI shim with no args exits non-zero and prints usage; `SYSTEM_SPECKIT_COMPLETION_DISABLED=1` makes the plugin factory return `{}` (no `tool` key at all) while an unset or non-`"1"` value leaves `hooks.tool.system_speckit_completion` registered with a callable `execute`.
- Desired user-visible outcome: a concise pass/fail verdict citing the exact captured command output.
- Pass/fail: PASS if all signals above hold from real captured output and `execute()` never throws for any of the three fixtures. FAIL if the kill-switch leaves the tool registered, if the checklist section ever misreports a known EVIDENCE_MISSING packet as `"unavailable"` or `"COMPLETE"`, if the CLI shim's payload diverges from the live tool's payload for the same fixture, or if any call throws instead of degrading gracefully.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Validate the Speckit Completion Exposer end to end against the commands below, and report a PASS or FAIL verdict with cited command output.`

```text
an agent operating under the COMPLETION VERIFICATION gate calls the OpenCode tool `system_speckit_completion({specFolder, strict})` (or, from Claude, runs the CLI shim) instead of hand-composing and hand-merging separate `check-completion.sh --json` and `calculate-completeness.sh --json` calls
```


### Commands

1. Run the plugin's own kill-switch regression test directly with node:

```bash
node .opencode/plugins/tests/system-speckit-completion.test.cjs
```

2. Run the same test through the repo's `node:test` harness for a tap summary:

```bash
node --test .opencode/plugins/tests/system-speckit-completion.test.cjs
```

3. Live-invoke the real plugin's registered tool `execute()` against three real spec-folder fixtures in this repo (a Level-2 COMPLETE packet, a Level-2 EVIDENCE_MISSING packet, and a Level-3 packet carrying a decision-record), plus a `strict:true` call on the Level-3 fixture. The two Level-2 folders are the same fixtures the shared core's own `completion-state.test.mjs` designates `LEVEL2_COMPLETE_FIXTURE` and `LEVEL2_INCOMPLETE_FIXTURE`; the Level-3 folder is a stable, completed Level-3 spec folder in this repo that carries `decision-record.md`, used to exercise the exposer's Level-3 resolution path:

```bash
node -e '
(async () => {
  const mod = await import(new URL("./.opencode/plugins/system-speckit-completion.js", "file://" + process.cwd() + "/"));
  const plugin = mod.default;
  const hooks = await plugin({ directory: process.cwd() });
  const exec = hooks.tool.system_speckit_completion.execute;

  const level2Complete = ".opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync";
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
SYSTEM_SPECKIT_COMPLETION_DISABLED=1 node -e '
(async () => {
  const mod = await import(new URL("./.opencode/plugins/system-speckit-completion.js", "file://" + process.cwd() + "/"));
  const hooks = await mod.default({ directory: process.cwd() });
  console.log("hooks keys:", Object.keys(hooks));
  console.log("hooks JSON:", JSON.stringify(hooks));
})();
'
```

### Expected

- Step 1-2: `system-speckit-completion.test.cjs: all assertions passed`, exit 0; tap summary `# pass 1 / # fail 0`.
- Step 3: Level-2 COMPLETE fixture -> `level:2`, `checklist.status:"COMPLETE"`, `checklist.passed:true`. Level-2 fixture -> `level:2`, `checklist.status:"EVIDENCE_MISSING"`, `checklist.passed:false`, `qualityGates.p0MissingEvidence>0`. Level-3 fixture -> `level:3` (decision-record.md raises the inferred level over checklist-only). `strict:true` call -> identical shape with `checklist.strict:true`.
- Step 4: identical `level`/`checklist.status`/`checklist.passed` values to the Step 3 Level-2-COMPLETE call.
- Step 5: non-zero exit, usage text on stderr.
- Step 6: `hooks keys: []` and `hooks JSON: {}` -- not a registered tool that merely answers `disabled`.

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Pass / Fail

- **Pass**: All signals above hold from real captured output and `execute()` never throws for any of the three fixtures.
- **Fail**: The kill-switch leaves the tool registered, if the checklist section ever misreports a known EVIDENCE_MISSING packet as `"unavailable"` or `"COMPLETE"`, if the CLI shim's payload diverges from the live tool's payload for the same fixture, or if any call throws instead of degrading gracefully.

### Failure Triage

1. Re-run each command in the sequence on its own and record its exit status; the first non-zero exit names the failing step.
2. Confirm the plugin host, bridge, and core files listed in section 4 are the ones actually loaded, and that any compiled output is current.
3. Compare the observed output field by field against the expected signals in section 2, and quote the first field that disagrees.


---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- OpenCode plugin adapter: `.opencode/plugins/system-speckit-completion.js`
- Plugin regression test: `.opencode/plugins/tests/system-speckit-completion.test.cjs`
- Claude/Bash CLI shim: `.opencode/bin/speckit-completion.cjs`
- Shared runtime-neutral core: `.opencode/skills/system-spec-kit/scripts/lib/completion-state.cjs`
- Core's own vitest suite (currently outside project `include` globs, see Evidence): `.opencode/skills/system-spec-kit/scripts/lib/completion-state.test.mjs`
- Shelled scripts merged by the core: `.opencode/skills/system-spec-kit/scripts/spec/check-completion.sh`, `.opencode/skills/system-spec-kit/scripts/spec/calculate-completeness.sh`
- Plugin entrypoint registry (confirms adapter role and kill-switch env): `.opencode/plugins/README.md` §3
- Related-but-distinct sibling consumer (out of scope here, sharing infrastructure only): `.opencode/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs`, `.opencode/plugins/system-completion-sentinel.js`, `.opencode/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs`

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: speckit-completion-exposer
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/speckit-completion-exposer.md
