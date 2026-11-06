---
title: "MIR-001 -- Sync generator checks"
description: "This scenario validates that the three generated .dsh mirrors report in sync through their --check mode without writing to the tree for `MIR-001`."
version: 1.0.0.0
---

# MIR-001 -- Sync generator checks

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `MIR-001`.

---

## 1. OVERVIEW

This scenario validates the three generated `.dsh/` trees and their drift checks. It focuses on the read-only `--check` mode.

### Why This Matters

The skill links, prompt stubs and persona patches derive from `.skilled/`. A manual edit or a renamed skill makes the mirror stale, and dsh then loads an old surface. `--check` reports drift with exit `1` and writes nothing, so it belongs in every review.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the three generators agree with the current `.skilled/` tree without changing it.
- Real user request: `Check that the generated DeepSeek Harness mirrors still match the skills, commands and agents we have now. Do not rewrite anything.`
- Prompt: `Check that the three generated DeepSeek Harness mirrors are in sync without writing anything. Run each generator with --check and report the counts and exit codes.`
- Expected execution process: Run the skill generator with `--check` -> run the prompt generator with `--check` -> run the agent generator with `--check` -> read each PASS or drift line and each exit code.
- Expected signals: All three commands exit `0`. The skill generator prints `PASS: 56 skill links are in sync.` The prompt generator prints `PASS: 45 prompt stubs are in sync.` The agent generator prints `PASS: 11 agent patches are in sync.` Exclusion lines are informational and do not signal drift.
- Desired user-visible outcome: A clear statement that all three mirrors are current, with the counts and exit codes.
- Pass/fail: PASS if all three commands exit `0` and print their in-sync line. FAIL if any command exits `1`, prints a drift line or writes a file.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the three checks from the repository root.
2. Keep the exit code for each command.
3. Read the final `PASS` line and ignore the `EXCLUDED` inventory lines.
4. Confirm no command printed a write, prune or drift line.

### Commands

```bash
node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-prompts-dsh.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs --check
```

### Recorded Result

- Verdict: `PASS`.
- Observed: `sync-skills-dsh.cjs --check` exited `0` with `PASS: 56 skill links are in sync.`
- Observed: `sync-prompts-dsh.cjs --check` exited `0` with `PASS: 45 prompt stubs are in sync.`
- Observed: `sync-agents-dsh.cjs --check` exited `0` with `PASS: 11 agent patches are in sync.`
- The counts come from the run. The `.dsh/SYNC.md` inventory names the generators and the drift condition but does not pin a count.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MIR-001 | Sync generator checks | Prove all three mirrors are in sync | `Check that the three generated DeepSeek Harness mirrors are in sync without writing anything. Run each generator with --check and report the counts and exit codes.` | 1. `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs --check` -> 2. `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-prompts-dsh.cjs --check` -> 3. `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs --check` -> 4. confirm no write, prune or drift line | Step 1: exit `0`, `PASS: 56 skill links are in sync.` Step 2: exit `0`, `PASS: 45 prompt stubs are in sync.` Step 3: exit `0`, `PASS: 11 agent patches are in sync.` Step 4: no write or drift line | The three command transcripts with their exit codes and PASS lines | PASS if all three exit `0` with their in-sync line. FAIL if any exits `1`, prints drift or writes a file | 1. Read the drift line to see which entry is stale. 2. Confirm a `SKILL.md` name or a command or agent file changed since the last write run. 3. Run the generator without `--check` only when you intend to prune stale output |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Command notation and verdict rules |
| `../../SKILL.md` | Runtime folder ownership and the drift boundary |
| `../../references/runtime-folder-and-sync.md` | Generated trees, `--check` mode and sync triggers |
| `.dsh/SYNC.md` | Surface inventory and the sync workflow |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs` | Skill-link farm generator |
| `.skilled/skills/system-spec-kit/runtime/cli/dsh/sync-prompts-dsh.cjs` | Prompt stub generator |
| `.skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs` | Persona patch generator |

---

## 5. SOURCE METADATA

- Group: Generated Mirrors
- Playbook ID: MIR-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mirrors/sync-generator-checks.md`
