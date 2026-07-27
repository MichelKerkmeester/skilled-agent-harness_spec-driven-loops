---
title: "DV-014 -- Skills and command roster"
description: "Verify Devin's skills subcommand exposes the repository's mirrored slash-command roster, including the 36 registered commands."
version: 1.0.0.0
---

# DV-014 -- Skills and command roster

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-014`.

## 1. OVERVIEW

Enumerate the slash-command surface through `devin skills list` and compare it with the 36 `.devin/skills/<namespace>-<name>/SKILL.md` registrations.

### Why This Matters

Devin's `skills` subcommand is the command surface. Counting the registered symlinked skills is the reliable parity check; a nonexistent `devin commands` subcommand is not a missing feature.

## 2. SCENARIO CONTRACT

- Objective: Confirm all 36 mirrored command registrations are visible to Devin.
- Real user request: `List every slash command Devin can use in this repository and prove the count.`
- Prompt: `List the repository's available slash commands, report the total, and name the namespaces represented. Do not edit files.`
- Expected execution process: Run `devin skills list`, count the output, enumerate `.devin/skills/*/SKILL.md`, and compare names.
- Expected signals: Devin lists 36 registered slash commands, including examples such as `/deep-research`, `/memory-save`, `/speckit-plan`, and `/doctor-mcp`; filesystem symlinks resolve into `.opencode/commands/`.
- Desired user-visible outcome: A complete, reproducible command roster.
- Pass/fail: PASS when the count and symlink targets agree; FAIL on missing/extra registrations or a mismatch; SKIP on auth/availability blockers.

## 3. TEST EXECUTION

1. `devin skills list > /tmp/cli-devin-dv014-list.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv014-list.txt`
2. `find .devin/skills -mindepth 2 -maxdepth 2 -name SKILL.md -type l -print | sort > /tmp/cli-devin-dv014-links.txt`
3. `devin -p "List the repository's available slash commands, report the total, and name the namespaces represented. Do not edit files." --model adaptive --permission-mode normal </dev/null > /tmp/cli-devin-dv014-prompt.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv014-prompt.txt`
4. Compare the command output, filesystem count, and prompt result.

| Feature ID | Exact command | Expected signal | Verdict |
|---|---|---|---|
| DV-014 | `devin skills list` plus filesystem enumeration | 36 registrations and valid `.opencode/commands/` targets | PASS/FAIL/SKIP |

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Command/skills parity scope |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Verified skills discovery and command non-concept |
| `../../../../.devin/skills/` | Devin-facing registrations |
| `../../../../.opencode/commands/` | Canonical command bodies |

## 5. SOURCE METADATA

- Group: Commands and Skills
- Playbook ID: DV-014
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `commands-and-skills/skills-roster.md`
