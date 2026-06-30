---
title: "Executor Audit"
description: "fanout-run.cjs stamps SPECKIT_CLI_DISPATCH_STACK via the runtime buildExecutorDispatchEnv for each spawned CLI seat and fails closed on a same-kind recursive spawn (detectSameKindFromStack), preventing recursive deep-context launches. The runtime executor-audit.ts module provides the recursion-guard and provenance-logging contract."
trigger_phrases:
  - "executor audit"
  - "SPECKIT_CLI_DISPATCH_STACK"
  - "buildExecutorDispatchEnv"
  - "recursion guard"
  - "executor provenance"
  - "cli_contract"
  - "executor-audit.ts"
  - "dispatch stack"
version: 1.2.0.4
---

# Executor Audit

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Prevents a CLI seat from recursively launching another `deep-context` loop by stamping `SPECKIT_CLI_DISPATCH_STACK` into each spawned seat's environment before dispatch. The dispatch stack is a colon-delimited string of executor kinds; when the same kind already appears on the inherited stack, the dispatch is refused.

Enforcement lives at the actual subprocess spawn site, `fanout-run.cjs`: it both stamps the stack via `buildExecutorDispatchEnv` and, before spawning, fails closed via `detectSameKindFromStack` when this kind is already on the inherited stack. The runtime `executor-audit.ts` module also provides a complete four-layer guard (`validateExecutorDispatchAllowed`: stack, ancestry, runtime-env, lockfile) used by the in-process dispatch helpers that already know they are a dispatched seat. `fanout-run.cjs` deliberately checks only the **stack** layer, because the orchestrator legitimately runs inside one of these runtimes — so the runtime-env (e.g. `OPENCODE_SESSION_ID`) and ancestry layers would false-positive on the first-level dispatch. The YAML `cli_contract` documents the requirement.

---

## 2. HOW IT WORKS

### YAML Integration

Both `deep_context_auto.yaml` and `deep_context_confirm.yaml` include a `cli_contract` block under `step_sweep_cli_pool` that mandates:

> "Executor-audit recursion guard: spawn each CLI seat with the deep-loop-runtime executor-audit dispatch env (`SPECKIT_CLI_DISPATCH_STACK` appended with this loop's kind via `buildExecutorDispatchEnv`) so a seat cannot recursively launch another deep-context loop; record seat provenance per the runtime executor-audit contract."

### buildExecutorDispatchEnv

`buildExecutorDispatchEnv(config, parentEnv)` in `executor-audit.ts`:
1. Reads `parentEnv[SPECKIT_CLI_DISPATCH_STACK]` (`CLI_DISPATCH_STACK_ENV` constant).
2. Splits the colon-delimited stack, appends the new executor kind, and writes the updated stack into `nextEnv[SPECKIT_CLI_DISPATCH_STACK]`.
3. Filters the parent env to only include allowed keys per executor kind (common allowlist + per-kind prefixes like `OPENCODE_`, `OPENCODE_`, `CLAUDE_`, etc.).

### Recursion Guard Layers

`validateExecutorDispatchAllowed(config, context)` checks four layers in order:
1. **Stack** — `detectSameKindFromStack`: same kind already in `SPECKIT_CLI_DISPATCH_STACK`.
2. **Ancestry** — `detectFromAncestry`: executor binary found in Linux `/proc` ancestor cmdlines.
3. **Runtime env** — `detectFromRuntimeEnv`: executor session env var is set (e.g. `OPENCODE_SESSION_ID`).
4. **Lockfile** — `detectFromLockfile`: executor dispatch lockfile exists in state directories.

When blocked, `emitDispatchFailure` writes a `dispatch_failure` event to the JSONL state log with the recursion reason.

### Executor Provenance

`buildExecutorAuditRecord` attaches `{ kind, model, reasoningEffort, serviceTier, lineageId? }` to the JSONL iteration record so every seat's provenance is traceable in the state log.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Workflow | `cli_contract` requirement in `step_sweep_cli_pool`: mandates `SPECKIT_CLI_DISPATCH_STACK` + `buildExecutorDispatchEnv` per seat |
| `.opencode/commands/deep/assets/deep_context_confirm.yaml` | Workflow | Same `cli_contract` requirement |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` | Shared | `buildExecutorDispatchEnv`, `validateExecutorDispatchAllowed`, `detectSameKindFromStack`, `detectFromAncestry`, `detectFromRuntimeEnv`, `detectFromLockfile`, `buildExecutorAuditRecord`, `emitDispatchFailure`, `CLI_DISPATCH_STACK_ENV` |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/manual_testing_playbook/07--runtime-robustness/executor-audit.md` | Manual playbook | Verifies `SPECKIT_CLI_DISPATCH_STACK` and `executor-audit` references exist in the auto YAML |

---

## 4. SOURCE METADATA

- Group: Runtime Robustness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--runtime-robustness/executor-audit.md`

Related references:
- [cli-council-seats.md](../02--by-model-parallel-sweep/cli-council-seats.md) — CLI seats within which `buildExecutorDispatchEnv` is applied
- [loop-lock.md](loop-lock.md) — the lockfile layer checked by `detectFromLockfile`
