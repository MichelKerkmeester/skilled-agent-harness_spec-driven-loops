---
title: "DV-015 -- Mirrored command invocation"
description: "Verify a mirrored slash command is recognized and invoked through Devin's print-mode skills surface."
version: 1.0.0.0
---

# DV-015 -- Mirrored command invocation

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-015`.

## 1. OVERVIEW

Invoke `/speckit-plan`, a mirrored command registered under `.devin/skills/`, from a real Devin print session. The scenario is read-only and asks for planning output rather than applying changes.

### Why This Matters

Roster visibility is not enough. The slash-command must resolve to its mirrored skill body when the user actually invokes it.

## 2. SCENARIO CONTRACT

- Objective: Prove a mirrored command is recognized and returns command-specific behavior.
- Real user request: `Use /speckit-plan to draft a plan for a harmless documentation change, but do not write it.`
- Prompt: `/speckit-plan Draft a short plan for adding a manual test scenario to a documentation-only packet. Do not create or modify files.`
- Expected execution process: Run the slash command through `devin -p`, capture the output, and confirm it produces a plan rather than an unknown-command error or a generic refusal.
- Expected signals: Output reflects `/speckit-plan` semantics and no file mutation occurs.
- Desired user-visible outcome: A usable mirrored command invocation.
- Pass/fail: PASS on command-specific output and clean status; FAIL on unknown-command or silent fallback; SKIP on auth/availability blockers.

## 3. TEST EXECUTION

1. `devin -p "/speckit-plan Draft a short plan for adding a manual test scenario to a documentation-only packet. Do not create or modify files." --model adaptive --permission-mode normal </dev/null > /tmp/cli-devin-dv015.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv015.txt`
2. Inspect the response for command recognition and plan output.
3. `git status --porcelain`.

| Feature ID | Exact command | Expected signal | Verdict |
|---|---|---|---|
| DV-015 | `devin -p "/speckit-plan ..." --permission-mode normal` | Command-specific plan, no mutation | PASS/FAIL/SKIP |

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Slash-command invocation policy |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Devin skills are the slash-command surface |
| `../../../../.devin/skills/speckit-plan/SKILL.md` | Mirrored command registration |
| `../../../../.opencode/commands/speckit/plan.md` | Canonical command body |

## 5. SOURCE METADATA

- Group: Commands and Skills
- Playbook ID: DV-015
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `commands-and-skills/mirrored-command-invocation.md`
