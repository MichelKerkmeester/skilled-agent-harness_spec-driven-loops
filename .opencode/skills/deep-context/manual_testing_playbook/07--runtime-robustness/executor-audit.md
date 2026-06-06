---
title: "RUNTIME-005 -- Executor Audit"
description: "This scenario validates Executor Audit for `RUNTIME-005`. It focuses on `SPECKIT_CLI_DISPATCH_STACK` and the `executor-audit` contract being referenced in the auto YAML's `cli_contract`, confirming the recursion-guard wiring."
---

# RUNTIME-005 -- Executor Audit

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RUNTIME-005`.

---

## 1. OVERVIEW

This scenario validates Executor Audit for `RUNTIME-005`. It focuses on `SPECKIT_CLI_DISPATCH_STACK` and the `executor-audit` recursion-guard contract being wired into `deep_start-context-loop_auto.yaml` via the `cli_contract` requirement, and `buildExecutorDispatchEnv` being the runtime function that stamps the dispatch stack into each CLI seat's environment.

### Why This Matters

Without the recursion guard, a CLI seat (e.g., a cli-opencode seat dispatched during `step_sweep_cli_pool`) could interpret its prompt as an instruction to start a new deep-context loop for the same scope, causing unbounded recursion that fills the state log and exhausts timeouts. The `SPECKIT_CLI_DISPATCH_STACK` env variable is the primary runtime tripwire; verifying its presence in the YAML contract ensures the guard is documented and wired.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RUNTIME-005` and confirm the expected signals without contradictory evidence.

- Objective: Verify that `SPECKIT_CLI_DISPATCH_STACK` and `executor-audit` are referenced in `deep_start-context-loop_auto.yaml`, confirming the recursion-guard wiring for CLI seats.
- Real user request: `Verify that the deep-context CLI seat dispatch enforces the executor-audit recursion guard via SPECKIT_CLI_DISPATCH_STACK.`
- Prompt: `As a manual-testing orchestrator, validate the executor-audit recursion-guard contract for deep-context against the auto YAML cli_contract block. Verify SPECKIT_CLI_DISPATCH_STACK and executor-audit appear in deep_start-context-loop_auto.yaml. Return a concise verdict.`
- Expected execution process: Grep `deep_start-context-loop_auto.yaml` for `SPECKIT_CLI_DISPATCH_STACK` and `executor-audit`; grep `executor-audit.ts` for `CLI_DISPATCH_STACK_ENV` and `buildExecutorDispatchEnv`.
- Expected signals: `SPECKIT_CLI_DISPATCH_STACK` found in auto YAML; `executor-audit` found in auto YAML; `CLI_DISPATCH_STACK_ENV` constant found in executor-audit.ts; `export function buildExecutorDispatchEnv` found in executor-audit.ts.
- Desired user-visible outcome: Every CLI seat launched by the context loop carries `SPECKIT_CLI_DISPATCH_STACK` in its environment, so if a seat attempts to recursively launch a deep-context loop, the guard blocks it before dispatch.
- Pass/fail: PASS if all four grep checks return the expected tokens; FAIL if `SPECKIT_CLI_DISPATCH_STACK` or `executor-audit` is absent from the YAML, or if `buildExecutorDispatchEnv` is not exported from the runtime module.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; grep the auto YAML and the runtime module.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RUNTIME-005 | Executor Audit | Verify SPECKIT_CLI_DISPATCH_STACK and executor-audit wiring in auto YAML | `Verify that the deep-context CLI seat dispatch enforces the executor-audit recursion guard via SPECKIT_CLI_DISPATCH_STACK.` | 1. `rg "SPECKIT_CLI_DISPATCH_STACK\|executor-audit" .opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` -> 2. `rg "CLI_DISPATCH_STACK_ENV\|buildExecutorDispatchEnv" .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` | Step 1: both tokens found in auto YAML; Step 2: both tokens found in executor-audit.ts | Grep outputs from both commands | PASS if steps 1-2 all return expected tokens; FAIL if either token is absent from the YAML or the runtime export is missing | 1. Confirm `buildExecutorDispatchEnv` is listed under `// ───── EXPORTS ─────` in executor-audit.ts. 2. Check that `validateExecutorDispatchAllowed` is also exported (the guard itself, not just the env builder). 3. Verify `CLI_DISPATCH_STACK_ENV = 'SPECKIT_CLI_DISPATCH_STACK'` is the constant used in `buildExecutorDispatchEnv`. |

### Optional Supplemental Checks

Verify `validateExecutorDispatchAllowed` is also exported from executor-audit.ts (the four-layer guard):

```bash
rg "export function validateExecutorDispatchAllowed" .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts
```

Verify the confirm YAML also carries the `cli_contract` recursion-guard requirement:

```bash
rg "SPECKIT_CLI_DISPATCH_STACK\|executor-audit" .opencode/commands/deep/assets/deep_start-context-loop_confirm.yaml
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/07--runtime-robustness/executor-audit.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` | `cli_contract` block in `step_sweep_cli_pool`: mandates `SPECKIT_CLI_DISPATCH_STACK` + `buildExecutorDispatchEnv` |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` | `CLI_DISPATCH_STACK_ENV`, `buildExecutorDispatchEnv`, `validateExecutorDispatchAllowed`, `detectSameKindFromStack` |

---

## 5. SOURCE METADATA

- Group: Runtime Robustness
- Playbook ID: RUNTIME-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--runtime-robustness/executor-audit.md`
