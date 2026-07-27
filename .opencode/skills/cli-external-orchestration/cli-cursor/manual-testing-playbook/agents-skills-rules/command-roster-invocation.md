---
title: "CU-024 -- Command roster and invocation"
description: "Verify all 36 Cursor command files are present and invoke a mirrored command through cursor-agent."
version: 1.0.0.0
---

# CU-024 -- Command roster and invocation

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `CU-024`.

## 1. OVERVIEW

Count the 36 `.cursor/commands/*.md` files and invoke `/speckit-plan` in a real Cursor print dispatch.

### Why This Matters

The command roster is a separate parity surface from custom agents. File presence must be paired with a real invocation so a stale or unreadable mirror cannot pass by counting alone.

## 2. SCENARIO CONTRACT

- Objective: Confirm all 36 Cursor command files exist and one representative command is invocable.
- Real user request: `Count Cursor's repository commands and use /speckit-plan to draft a documentation-only plan.`
- Prompt: `/speckit-plan Draft a short plan for adding a manual test scenario to a documentation-only packet. Do not create or modify files.`
- Expected execution process: Count `.cursor/commands/*.md`, verify links resolve, and dispatch the slash command with explicit Cursor flags.
- Expected signals: Count is 36; `/speckit-plan` produces command-specific plan output; no unknown-command error or file mutation.
- Desired user-visible outcome: Complete roster plus one live invocation.
- Pass/fail: PASS when count, resolution, and invocation agree; FAIL on a missing/unreadable command or unknown command; SKIP on Cursor auth/availability blockers.

## 3. TEST EXECUTION

1. `find -L .cursor/commands -maxdepth 1 -type f -name '*.md' -print | sort | tee /tmp/cli-cursor-cu024-roster.txt | wc -l`
2. `cursor-agent -p "/speckit-plan Draft a short plan for adding a manual test scenario to a documentation-only packet. Do not create or modify files." --model composer-2.5 --auto-review --sandbox enabled --output-format text </dev/null > /tmp/cli-cursor-cu024.txt 2>&1; echo "exit=$?" >> /tmp/cli-cursor-cu024.txt`
3. Inspect output text for command recognition and confirm `cursor-agent about` auth evidence; check `git status --porcelain`.

| Feature ID | Exact command | Expected signal | Verdict |
|---|---|---|---|
| CU-024 | `find -L .cursor/commands ...` plus `cursor-agent -p "/speckit-plan ..."` | 36 files and successful invocation | PASS/FAIL/SKIP |

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory and command policy |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Cursor command-file parity boundary |
| `../../../../.cursor/commands/` | Cursor-facing command roster |
| `../../../../.opencode/commands/` | Canonical command bodies |

## 5. SOURCE METADATA

- Group: Agents, Skills and Rules
- Playbook ID: CU-024
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `agents-skills-rules/command-roster-invocation.md`
