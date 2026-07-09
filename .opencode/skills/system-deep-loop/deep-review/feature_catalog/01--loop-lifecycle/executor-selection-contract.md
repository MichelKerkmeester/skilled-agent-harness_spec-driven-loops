---
title: "Executor Selection Contract"
description: "Resolves which executor runs each review iteration (native agent or one of two CLIs) and enforces per-kind flag compatibility before dispatch."
trigger_phrases:
  - "executor selection contract"
  - "parseExecutorConfig"
  - "select review executor"
  - "per-kind flag compatibility"
  - "native cli-opencode dispatch"
version: 1.11.0.6
---

# Executor Selection Contract

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Decides whether a review iteration runs on the native `@deep-review` agent or is dispatched to an external CLI, and guarantees the chosen executor only receives flags it actually supports.

The contract lets the same review loop run on different model backends without changing the loop logic. It centralizes dispatch-branch selection and flag validation so an unsupported flag fails fast at config parse time rather than mid-dispatch.

## 2. HOW IT WORKS

### Entry Point & Routing

Before each dispatch, the workflow resolves the executor via `parseExecutorConfig` from `runtime//lib/deep-loop/executor-config.ts`. The resolved `config.executor.kind` selects one of three dispatch branches:

| Kind | Dispatch |
|---|---|
| `native` | `@deep-review` agent with model Opus |
| `cli-opencode` | rendered prompt piped via stdin to `opencode run --dangerously-skip-permissions`, granting full OS-level workspace write access. There is no `--sandbox workspace-write` flag in the live command, and `sandboxMode='read-only'` is NOT honored. The only real containment is the prompt-level "ALLOWED WRITE PATHS"/"BANNED OPERATIONS" contract (model-obeyed, not OS-enforced) plus post-dispatch validation. Review targets must be treated as potentially adversarial content. |
| `cli-claude-code` | `claude -p` with `--permission-mode acceptEdits` (overriding the read-only `plan` default so iteration writes succeed) |

### Core Behavior

All branches share three steps: pre-dispatch prompt rendering (`renderPromptPack`), post-dispatch validation (`validateIterationOutputs` asserting iteration file plus JSONL delta plus required fields), and an executor audit append (`appendExecutorAuditToLastRecord`, skipped when kind is `native`).

### Configuration

Per-kind flag compatibility is enforced at config parse time by `EXECUTOR_KIND_FLAG_SUPPORT`. Setting a flag the chosen kind does not support throws `ExecutorConfigError` before any dispatch. Cross-CLI delegation (a running executor invoking other CLIs through its shell) is documented design intent, runtime recursion detection is out of scope.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Runtime | `parseExecutorConfig`, `EXECUTOR_KIND_FLAG_SUPPORT`, `ExecutorConfigError`. |
| `references/protocol/loop_protocol.md` | Protocol | Executor Resolution section: per-kind dispatch branches and shared steps. |
| `SKILL.md` | Skill contract | Executor Selection Contract and Cross-CLI Delegation subsections. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/01--entry-points-and-modes/parameterized-invocation-max-iterations-convergence.md` | Manual scenario | Exercises parameterized invocation paths that feed executor config. |
| `manual_testing_playbook/07--command-flow-stress-tests/write-boundary-reducer-owned-files.md` | Manual scenario | Confirms executor write boundaries against reducer-owned files. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--loop-lifecycle/executor-selection-contract.md`
- Primary sources: `references/protocol/loop_protocol.md`, `SKILL.md`, `runtime//lib/deep-loop/executor-config.ts`
Related references:
- [resource-map-coverage-gate.md](resource-map-coverage-gate.md) — Resource Map Coverage Gate
- [fanout-dispatch.md](fanout-dispatch.md) — Fan-out loop dispatch
