---
title: "DLR-067 -- Fan-out preview builds every lineage command without writing"
description: "This scenario validates that fanout-run.cjs --preview prints each lineage's command with its prompt replaced by a digest, its effective config and the aggregate budget, and exits before any directory, ledger, store or root-config write, for `DLR-067`."
version: 1.0.0.0
---

# DLR-067 -- Fan-out preview builds every lineage command without writing

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DLR-067`.

---

## 1. OVERVIEW

This scenario validates the `--preview` branch of `fanout-run.cjs`, the read-only view that `--dry-run` runs first for a fan-out. It focuses on what the preview prints for each lineage and on the promise that it writes nothing.

### Why This Matters

An operator checks a fan-out before paying for it. The preview is only safe to run if it builds the same commands a real run would and leaves the packet as it was. A preview that writes a lineage directory, a ledger or the root config's `maxIterations` would change the run it is meant to inspect, and one that prints a raw prompt would leak it into the log.

---

## 2. SCENARIO CONTRACT

Operators run the exact commands below and confirm the four preview cases and the source behind them.

- Objective: Confirm that `--preview` prints one entry per lineage with the argv, the prompt replaced by `<prompt:...>`, cwd, session id, iterations, frontier scope and `effective_config`, plus `topic_digest`, `dry_run_halt` and `aggregate_budget`, that it rejects a Claude config dir the real run would reject, and that the artifact directory and the root config stay byte-identical.
- Real user request: Before I spend on this fan-out, show me the exact command each lineage would run, and promise me nothing was written.
- Prompt: `Check that the fan-out preview prints every lineage command with its prompt digested, rejects what the real run would reject, and writes nothing. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Run the preview cases by name, run the root-config guard case, then read the preview branch in the fan-out runner.
- Expected signals: The four preview cases pass, and so does the root-config guard case. Between them the cases assert that the preview JSON has `status: "preview"`, that each lineage's `args` carry the prompt as `<prompt:...>`, that `aggregate_budget` carries its `units` legend, that `dry_run_halt` names boundary `child-spawn` and step `step_fanout_spawn`, that a `cli-claude-code` entry shows `config_dir` only when its lineage sets one, that a config dir the real run would reject fails the preview, and that the artifact directory and the root config are byte-identical afterwards.
- Desired user-visible outcome: The operator can read each lineage's command and its sandbox label before the run, and knows the preview changed nothing.
- Pass/fail: PASS if every named case passes and the source shows the preview returning before any write; FAIL if a case fails, a raw prompt appears in the output, or the preview writes a file.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that the fan-out preview prints every lineage command with its prompt digested, rejects what the real run would reject, and writes nothing. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/fanout-run.vitest.ts -t "builds every lineage command without writing" --reporter=verbose`
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/fanout-run.vitest.ts -t "leaves the root config untouched under --preview" --reporter=verbose`
3. `rg -n "args.preview === true|status: 'preview'|= writeRootConfigBudget" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`

### Expected

Command 1 prints `Tests  4 passed` with the rest of the file skipped. The cases are `prints both lineages with the prompt digested and leaves the artifact dir byte-identical`, `prints the research topic digest beside the prompt digests`, `shows the resolved config dir only for a claude-code lineage that sets one` and `fails the preview on a config dir the real run would reject`. Command 2 prints `Tests  1 passed`: `leaves the root config untouched under --preview and under an explicit --max-iterations`. Command 3 shows the preview branch, the `status: 'preview'` output that returns from it, and the call to the root-config writer on a later line, which the preview never reaches.

### Evidence

- The verbose case lines and the summary lines from commands 1 and 2, with their exit status.
- The `rg` lines from command 3, read from the current source.

### Pass / Fail

- **Pass**: Commands 1 and 2 exit 0 with every named case passing, and command 3 shows the preview returning before the root-config write.
- **Fail**: Any named case fails, a raw prompt appears in a preview entry, or the artifact directory or root config changes.

### Failure Triage

- The artifact directory changed: check that the preview branch returns before the lineage directories, ledger and frontier stores are created.
- The root config changed: check that `writeRootConfigBudget` is still called only after the preview return.
- A raw prompt appears: check that each entry prints `redactedArgs`, not the built argv.
- A bad config dir passes: check that the preview validates `config_dir` the way the real run does.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | The `--preview` branch, `buildLineageDispatch`, `sandboxEnforcementFor` and `writeRootConfigBudget` |

### Validation

| File | Role |
|---|---|
| `tests/unit/fanout-run.vitest.ts` | The `--preview` cases and the root-config guard case |

---

## 5. SOURCE METADATA

- Group: FAN-OUT
- Playbook ID: DLR-067
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `fanout/fanout-run-preview.md`
- Feature catalog status: `feature-catalog/fanout/fanout-run.md` covers the preview under "Completion, Preview and Diagnostics".
