---
title: "Executor Selection Contract"
description: "Resolves which executor runs each review iteration (native agent or one of three CLIs) and enforces per-kind flag compatibility before dispatch."
---

# Executor Selection Contract

## 1. OVERVIEW

Decides whether a review iteration runs on the native `@deep-review` agent or is dispatched to an external CLI, and guarantees the chosen executor only receives flags it actually supports.

The contract lets the same review loop run on different model backends without changing the loop logic. It centralizes dispatch-branch selection and flag validation so an unsupported flag fails fast at config parse time rather than mid-dispatch.

## 2. CURRENT REALITY

Before each dispatch, the workflow resolves the executor via `parseExecutorConfig` from `deep-loop-runtime/lib/deep-loop/executor-config.ts`. The resolved `config.executor.kind` selects one of four dispatch branches:

| Kind | Dispatch |
|---|---|
| `native` | `@deep-review` agent with model Opus |
| `cli-codex` | rendered prompt piped via stdin to `codex exec` with reasoning-effort, service-tier, and `--sandbox workspace-write` |
| `cli-gemini` | positional prompt to `gemini`, model whitelist enforced, no reasoning-effort or service-tier flags |
| `cli-claude-code` | `claude -p` with `--permission-mode acceptEdits` (overriding the read-only `plan` default so iteration writes succeed) |

All branches share three steps: pre-dispatch prompt rendering (`renderPromptPack`), post-dispatch validation (`validateIterationOutputs` asserting iteration file plus JSONL delta plus required fields), and an executor audit append (`appendExecutorAuditToLastRecord`, skipped when kind is `native`).

Per-kind flag compatibility is enforced at config parse time by `EXECUTOR_KIND_FLAG_SUPPORT`. Setting a flag the chosen kind does not support throws `ExecutorConfigError` before any dispatch. Cross-CLI delegation (a running executor invoking other CLIs through its shell) is documented design intent, runtime recursion detection is out of scope.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Runtime | `parseExecutorConfig`, `EXECUTOR_KIND_FLAG_SUPPORT`, `ExecutorConfigError`. |
| `references/protocol/loop_protocol.md` | Protocol | Executor Resolution section: per-kind dispatch branches and shared steps. |
| `SKILL.md` | Skill contract | Executor Selection Contract and Cross-CLI Delegation subsections. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md` | Manual scenario | Exercises parameterized invocation paths that feed executor config. |
| `manual_testing_playbook/07--command-flow-stress-tests/057-write-boundary-reducer-owned-files.md` | Manual scenario | Confirms executor write boundaries against reducer-owned files. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--loop-lifecycle/08-executor-selection-contract.md`
- Primary sources: `references/protocol/loop_protocol.md`, `SKILL.md`, `deep-loop-runtime/lib/deep-loop/executor-config.ts`
