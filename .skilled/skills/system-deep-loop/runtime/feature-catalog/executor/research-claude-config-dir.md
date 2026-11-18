---
title: "Research Claude config dir"
description: "A deep-research iteration on cli-claude-code runs Claude under the configured config dir, and the executor audit records that dir."
trigger_phrases:
  - "research claude config dir"
  - "claude-config-dir research"
  - "--claude-config-dir"
  - "research cli-claude-code config dir"
version: 1.0.1.0
---

# Research Claude config dir (--claude-config-dir)

## 1. OVERVIEW

A deep-research run on the `cli-claude-code` executor runs Claude under a configured config dir, the same way review does. The flag is optional for research, and an empty value means no config dir is set. Review still requires the flag on `cli-claude-code`, and every other executor refuses it.

---

## 2. HOW IT WORKS

### Flag Validation

`runtime/scripts/dispatch-iteration.cjs` validates `--claude-config-dir` for both loop types. A review run on `cli-claude-code` without the flag fails with `missing required flag '--claude-config-dir'`. A research run accepts the flag. Any executor other than `cli-claude-code` refuses it with `flag '--claude-config-dir' is only valid with --executor cli-claude-code`.

### Command Forwarding

The `if_cli_claude_code` branch of `.skilled/commands/deep/assets/deep-research.yaml` forwards the configured dir to the dispatch command with a render hint. A contract test pins that branch in both command YAMLs, so a one-sided edit fails the suite.

### Audit Record

The executor audit row for a research iteration carries the configured dir, so an operator can read which Claude config an iteration used from the audit alone.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs` | Script | Validates the flag per loop type and passes the dir into the Claude run. |
| `.skilled/commands/deep/assets/deep-research.yaml` | Command workflow | The `if_cli_claude_code` branch forwards the configured dir. |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Shared | Reads `executor.configDir` into the audit row. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/dispatch-iteration.vitest.ts` | Vitest | Flag refusal and acceptance cases for research and review. |
| `.skilled/skills/system-deep-loop/runtime/tests/executor-audit-cli-branch-receipts.test.ts` | Node test | Research twin of the claude-code branch receipt; the audit row carries the configured dir. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts` | Vitest | Pins the `if_cli_claude_code` branch in both command YAMLs. |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/research-claude-config-dir.md` | Manual playbook | DLR-064: research on `cli-claude-code` runs under the configured Claude config dir. |

---

## 4. SOURCE METADATA

- Group: Executor
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `executor/research-claude-config-dir.md`

Related references:
- [executor-config.md](executor-config.md) - Executor configuration
- [fallback-router.md](fallback-router.md) - Fallback routing
