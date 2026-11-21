---
title: "Executor selection contract"
description: "Resolves which executor runs each iteration and enforces per-kind flag compatibility before dispatch."
trigger_phrases:
  - "executor selection contract"
  - "parseExecutorConfig"
  - "select review executor"
  - "per-kind flag compatibility"
  - "native cli-opencode dispatch"
version: 1.11.11.0
---

# Executor Selection Contract

## 1. OVERVIEW

Decides whether a review iteration runs on the native `@deep-review` agent or is dispatched to an external CLI, and guarantees the chosen executor only receives flags it actually supports.

The contract lets the same review loop run on different model backends without changing the loop logic. It centralizes dispatch-branch selection and flag validation so an unsupported flag fails fast at config parse time rather than mid-dispatch.

---

## 2. HOW IT WORKS

### Entry Point & Routing

Before each dispatch, the workflow resolves the executor via `parseExecutorConfig` from `runtime//lib/deep-loop/executor-config.ts`. The resolved `config.executor.kind` selects the dispatch branch. Every CLI kind runs through `dispatch-iteration.cjs --executor <kind>`:

| Kind | Dispatch |
|---|---|
| `native` | `@deep-review` agent with model Opus |
| `cli-opencode` | the rendered prompt is passed as the `opencode run` message argument with stdin closed, using `run --standalone -m <model>#<effort> --format json`. `--auto` (auto-approve permissions) is always passed. The executor exposes no sandbox flag. An unset or `workspace-write` sandbox adds an inline `OPENCODE_CONFIG_CONTENT` that denies `external_directory`, which stops OpenCode's file tools at the working directory but does not confine Bash, so Bash can still write anywhere. `danger-full-access` adds no deny, and `finalizeLineageCommand` refuses `read-only` before dispatch rather than run it unconfined. Beyond that file-tool deny, the only containment is the prompt-level "ALLOWED WRITE PATHS"/"BANNED OPERATIONS" contract (model-obeyed, not OS-enforced) plus post-dispatch validation. Review targets must be treated as potentially adversarial content. |
| `cli-claude-code` | `claude -p` with a permission mode resolved from `--sandbox-mode`, as on research: `acceptEdits` when it is unset or `workspace-write`, `plan` when it is `read-only`, and `bypassPermissions` when it is `danger-full-access`. The default cannot run Bash in `-p` mode, so a run that must record state through the append gateway needs `--sandbox-mode=danger-full-access`. It is built by the shared fan-out builder, logs `--output-format stream-json --verbose` and writes its session cost to `iterations/iteration-NNN.cost.json`. The stream lands in `iterations/iteration-NNN.out`, masked like a fan-out lineage log; an unset model resolves to `CLAUDE_DEFAULT_MODEL`. |
| `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`, `cli-deepseek-harness` | the kind's own CLI, started by `dispatch-iteration.cjs` with the rendered prompt. The requested `--sandbox-mode` is mapped to the kind's own read-only or write surface: unset resolves to `workspace-write`, and a requested `read-only` is never widened, so an iteration that must write fails at the artifact gate instead of gaining write access. The deepseek harness narrows `danger-full-access` to `workspace-write`, and a fan-out `--preview` reports it in `effective_config` as `sandboxMode` `workspace-write`, `sandboxNarrowedFrom` `danger-full-access` and `sandboxEnforcement` `preventive`. Devin and pi run `workspace-write` with the unconfined full-access command, so it is reported as `sandboxMode` `danger-full-access`, `sandboxWidenedFrom` `workspace-write` and `sandboxEnforcement` `none`. The iteration's receipt and state rows record the same fields in their `executor` record. An unset codex model resolves to the builder's `CODEX_DEFAULT_MODEL`, and a missing binary throws an `INPUT_VALIDATION` error before any receipt is written |
| `cli-mistral-vibe` | none in a single-executor run, which refuses it. It runs only as a fan-out lineage |

### Core Behavior

All branches share three steps: pre-dispatch prompt rendering (`renderPromptPack`), post-dispatch validation (`validateIterationOutputs` asserting iteration file plus JSONL delta plus required fields), and an executor audit append (`appendExecutorAuditToLastRecord`, skipped when kind is `native`). On a ledger-backed state log the executor row goes through the append gateway. `verify-iteration.cjs` then fails a non-native iteration whose state log or lineage metadata names no executor, with `executor_missing`.

### Configuration

Per-kind flag compatibility is enforced at config parse time by `EXECUTOR_KIND_FLAG_SUPPORT`. Setting a flag the chosen kind does not support throws `ExecutorConfigError` before any dispatch. Cross-CLI delegation (a running executor invoking other CLIs through its shell) is documented design intent, runtime recursion detection is out of scope.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Runtime | `parseExecutorConfig`, `EXECUTOR_KIND_FLAG_SUPPORT`, `ExecutorConfigError`. |
| `references/protocol/loop-protocol.md` | Protocol | Executor Resolution section: per-kind dispatch branches and shared steps. |
| `SKILL.md` | Skill contract | Executor Selection Contract and Cross-CLI Delegation subsections. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/entry-points-and-modes/parameterized-invocation-max-iterations-convergence.md` | Manual playbook | Exercises parameterized invocation paths that feed executor config. |
| `manual-testing-playbook/command-flow-stress-tests/write-boundary-reducer-owned-files.md` | Manual playbook | Confirms executor write boundaries against reducer-owned files. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `loop-lifecycle/executor-selection-contract.md`
- Primary sources: `references/protocol/loop-protocol.md`, `SKILL.md`, `runtime//lib/deep-loop/executor-config.ts`
Related references:
- [resource-map-coverage-gate.md](../../feature-catalog/loop-lifecycle/resource-map-coverage-gate.md) — Resource Map Coverage Gate
- [fanout-dispatch.md](../../feature-catalog/loop-lifecycle/fanout-dispatch.md) — Fan-out loop dispatch
