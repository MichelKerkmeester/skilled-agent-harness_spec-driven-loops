---
title: "VIB-MIR-001 -- Sync generator checks"
description: "This scenario validates that the three generated .vibe mirrors report in sync through their --check mode without writing to the tree."
version: 1.0.1.0
---

# VIB-MIR-001 -- Sync generator checks

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `VIB-MIR-001`.

---

## 1. OVERVIEW

This scenario validates the three generated `.vibe/` trees and their drift checks. It focuses on the read-only `--check` mode.

### Why This Matters

The agent profiles, skill links and prompt stubs derive from `.skilled/`. A renamed skill or a stale link makes the mirror disagree with its source, and a Vibe session then loads an old surface. `--check` reports drift with a non-zero exit and writes nothing, so it is safe to run on every review. A write run prunes stale output, which is why the check comes first.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the three generators agree with the current `.skilled/` tree without changing it.
- Real user request: `Check that the generated Vibe mirrors still match the skills, commands and agents we have now. Do not rewrite anything.`
- Prompt: `Check that the three generated Vibe mirrors are in sync without writing anything. Run each generator with --check and report the counts and exit codes.`
- Expected execution process: Run the agent generator with `--check` -> run the skill generator with `--check` -> run the prompt generator with `--check` -> read each PASS line and each exit code.
- Expected signals: All three commands exit `0`. The agent generator prints `[vibe-agent-sync] PASS: 11 agent profiles are in sync.` The skill generator prints `[vibe-skill-sync] LINKS: 56` and `[vibe-skill-sync] PASS: 56 skill links are in sync.` The prompt generator prints `[vibe-prompt-sync] PASS: 45 prompt stubs are in sync.` The `EXCLUDED` inventory lines are informational and do not signal drift.
- Evidence: The three command transcripts with their exit codes and PASS lines.
- Desired user-visible outcome: A clear statement that all three mirrors are current, with the counts and exit codes.
- Pass/fail: PASS if all three commands exit `0` and print their in-sync line. FAIL if any command exits non-zero, prints a drift line, or writes a file.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the three checks from the repository root.
2. Keep the exit code for each command.
3. Read the final PASS line and ignore the `EXCLUDED` inventory lines.
4. Confirm no command printed a write, prune or drift line.

### Commands

```bash
node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-skills-vibe.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-prompts-vibe.cjs --check
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-MIR-001 | Sync generator checks | Prove all three mirrors are in sync | `Check that the three generated Vibe mirrors are in sync without writing anything. Run each generator with --check and report the counts and exit codes.` | 1. `node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs --check` -> 2. `node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-skills-vibe.cjs --check` -> 3. `node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-prompts-vibe.cjs --check` -> 4. confirm no write, prune or drift line | Step 1: exit `0`, `PASS: 11 agent profiles are in sync.` Step 2: exit `0`, `LINKS: 56`, `PASS: 56 skill links are in sync.` Step 3: exit `0`, `PASS: 45 prompt stubs are in sync.` Step 4: no write or drift line | The three command transcripts with their exit codes and PASS lines | PASS if all three exit `0` with their in-sync line. FAIL if any exits non-zero, prints drift or writes a file | 1. Read the drift line to see which entry is stale. 2. Confirm a `SKILL.md` name, a command file or an agent file changed since the last write run. 3. Run the generator without `--check` only when you intend to prune stale output |

### Failure Triage

1. Read the drift line; it names the entry that no longer matches its source.
2. For a skill link, compare the link name with the source skill's frontmatter `name`.
3. For a prompt stub, confirm the source command file still exists and its flattened name is unique.
4. For an agent profile, confirm the source `.md` still exists and its body renders.
5. Run the generator without `--check` only when you intend to write and prune.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Command notation and verdict rules |
| [SKILL.md](../../SKILL.md) | Runtime folder ownership and the drift boundary |
| [runtime-folder-and-sync.md](../../references/runtime-folder-and-sync.md) | Generated trees, `--check` mode and sync triggers |
| `.vibe/SYNC.md` | Surface inventory, the excluded names and the sync workflow |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs` | Agent profile generator |
| `.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-skills-vibe.cjs` | Skill link farm generator |
| `.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-prompts-vibe.cjs` | Prompt stub generator |

---

## 5. SOURCE METADATA

- Group: Generated Mirrors
- Playbook ID: VIB-MIR-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mirrors/sync-generator-checks.md`
