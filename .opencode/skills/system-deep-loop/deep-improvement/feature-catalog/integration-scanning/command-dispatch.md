---
title: "Command dispatch"
description: "Routes deep-improvement execution from the slash command into the auto and confirm workflow assets."
trigger_phrases:
  - "command dispatch"
  - "agent-improvement.md"
  - "route improvement command"
  - "workflow asset routing"
  - "slash command entrypoint"
version: 1.17.0.9
---

# Command dispatch

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Routes deep-improvement execution from the slash command into the auto and confirm workflow assets.

This feature covers the operator-facing command surface and the workflow assets that actually run the deep-improvement loop.

---

## 2. HOW IT WORKS

`.opencode/commands/deep/agent-improvement.md` is the command entrypoint. It resolves the target agent, spec folder, and execution mode, then tells the caller to load either the autonomous or interactive YAML workflow. The command markdown explicitly says not to dispatch agents from the command file itself.

The real dispatch authority lives in the YAML assets. Both workflow files rescan integration, dispatch `@deep-improvement` to write candidates, emit journal events with `improvement-journal.cjs`, and call the scoring, coverage, trade-off, and reducer helpers. Confirm mode adds approval gates around candidate generation and post-score review, while auto mode runs the same stages without those gates.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/agent-improvement.md` | Command | Entry surface that gathers inputs and routes execution into the matching YAML workflow. |
| `.opencode/commands/deep/assets/deep-agent-improvement-auto.yaml` | Workflow | Runs the full loop autonomously and emits session-end journal events after synthesis. |
| `.opencode/commands/deep/assets/deep-agent-improvement-confirm.yaml` | Workflow | Runs the same loop with approval gates before candidate generation and after scoring. |
| `.opencode/agents/deep-improvement.md` | Proposal agent | Leaf agent that the workflows dispatch for bounded candidate generation. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/references/shared/loop-protocol.md` | Workflow reference | Documents the expected propose, score, benchmark, reduce, and promote sequence. |
| `.opencode/skills/system-deep-loop/deep-improvement/references/shared/quick-reference.md` | Operator reference | Provides the shortest command surface and runtime-path reminder for the loop. |

---

## 4. SOURCE METADATA

- Group: Integration scanning
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `integration-scanning/command-dispatch.md`
Related references:
- [runtime-mirrors.md](../../feature-catalog/integration-scanning/runtime-mirrors.md) — Runtime mirrors
