---
title: "DLR-064 -- Research honors the configured Claude config dir"
description: "This scenario validates that a deep-research iteration on cli-claude-code runs Claude under the configured config dir and records that dir in its audit, for `DLR-064`. It focuses on the --claude-config-dir flag on the research path."
version: 2.1.0.0
---

# DLR-064 -- Research honors the configured Claude config dir

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DLR-064`.

---

## 1. OVERVIEW

This scenario validates that a single-executor research run on `cli-claude-code` uses the Claude account the operator configured. It focuses on the `--claude-config-dir` flag on the research path, its validation, and the audit record that names the dir.

### Why This Matters

A research run that ignored the configured dir would charge the wrong Claude account, or read the wrong settings. The audit record has to name the dir the child process actually used, so the operator can check which account ran the iteration.

---

## 2. SCENARIO CONTRACT

Operators run the exact commands below and confirm that the configured dir reaches the Claude child and the audit record.

- Objective: Confirm that `dispatch-iteration.cjs` accepts `--claude-config-dir` on a cli-claude-code research dispatch, validates it before the prompt is read, exports it as `CLAUDE_CONFIG_DIR`, and writes it into the audit record.
- Real user request: Make sure a research run on Claude uses the Claude config dir I set, not whichever one the shell happens to have.
- Prompt: `Check that a deep-research iteration on cli-claude-code runs Claude under the configured config dir and records that dir in its audit. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Run the dispatch and audit suites by file stem, then read the flag and the research workflow branch in source.
- Expected signals: A research dispatch accepts the flag and runs Claude under the dir. An empty value means no dir. A dir outside the allowed roots is refused before the prompt is read. The audit record and the child both carry the configured dir.
- Desired user-visible outcome: The operator can say which Claude config dir ran a research iteration, and the audit shows it.
- Pass/fail: PASS if the named suites pass or skip only under the ancestry guard, and the source shows the flag reaching `CLAUDE_CONFIG_DIR`; FAIL if the child runs without the configured dir, or the audit record omits it. SKIP only with the blocker named under Pass / Fail.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that a deep-research iteration on cli-claude-code runs Claude under the configured config dir and records that dir in its audit. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run dispatch-iteration.vitest`
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run executor-audit-cli-branch-receipts.test`
3. `rg -n "claude-config-dir" .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs`
4. `rg -n "optional_claude_config_dir_flag" .skilled/commands/deep/assets/deep-research.yaml`

### Expected

Commands 1 and 2 exit 0. Outside a Claude session, every dispatch case runs and passes. Inside a Claude session, two dispatch cases skip under the Claude ancestry guard: `accepts --claude-config-dir on a cli-claude-code research dispatch and runs Claude under it` and `treats an empty --claude-config-dir on research as absent`. The other dispatch cases still pass. Inside a Claude session, the audit suite's research case `claude-code research branch: the audit record and the child both carry the configured config dir` still shows the dir reaching the audit record and the child. Command 3 prints the flag definition and its validation. Command 4 prints the research workflow slot that renders the flag only when a dir is configured.

### Evidence

- The vitest summary line, the pass and skip counts, and the exit status for commands 1 and 2.
- The `rg` output for commands 3 and 4, read from the current files.

### Pass / Fail

- **Pass**: Commands 1 and 2 exit 0, every dispatch case that is not skipped passes, and commands 3 and 4 show the flag reaching the research branch. Outside a Claude session no case skips.
- **Fail**: The child runs without the configured dir, the audit record omits it, or a dir outside the allowed roots is accepted.
- **SKIP**: Only when a live run is attempted inside a Claude session. The blocker is the Claude ancestry guard, which refuses a nested Claude dispatch. Name that guard in the record.

### Failure Triage

- The flag is refused on research: check the research branch of the flag validation in `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs`.
- The audit omits the dir: check that `configDir` is set on the executor object before the audit record is written.
- The child runs under the wrong account: check that `CLAUDE_CONFIG_DIR` is exported through the guarded environment.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs` | The `--claude-config-dir` flag, its validation and the `CLAUDE_CONFIG_DIR` export |
| `.skilled/commands/deep/assets/deep-research.yaml` | The research cli-claude-code command slot that forwards the configured dir |

### Validation

| File | Role |
|---|---|
| `dispatch-iteration.vitest` | Flag acceptance, empty value, refused roots and the non-claude refusal on research |
| `executor-audit-cli-branch-receipts.test` | The research audit record and the child carry the configured dir |

---

## 5. SOURCE METADATA

- Group: EXECUTOR
- Playbook ID: DLR-064
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `executor/research-claude-config-dir.md`
- Feature catalog status: this scenario does not cite a specific catalog entry.
