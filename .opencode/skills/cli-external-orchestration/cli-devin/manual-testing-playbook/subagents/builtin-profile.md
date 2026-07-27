---
title: "DV-010 -- Built-in subagent profile"
description: "Verify a real Devin run_subagent delegation through the built-in subagent_explore profile."
version: 1.0.0.0
---

# DV-010 -- Built-in subagent profile

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-010`.

## 1. OVERVIEW

Ask Devin to use its built-in `subagent_explore` profile for read-only repository research.

### Why This Matters

The built-in profile is the simplest proof that Devin's native `run_subagent` surface is working and that the calling session can receive a child result.

## 2. SCENARIO CONTRACT

- Objective: Obtain a bounded repository map from `subagent_explore`.
- Real user request: `Have a read-only Devin subagent map the CLI skill packet and report the relevant files.`
- Prompt: `Use a subagent_explore subagent to identify the cli-external-orchestration skill packet, its SKILL.md, and its manual-testing playbooks. Do not edit files.`
- Expected execution process: Run a read-only print dispatch and inspect the returned child result for file paths and profile attribution.
- Expected signals: Output states that `subagent_explore` was used or clearly includes its read-only result; no files change.
- Desired user-visible outcome: A child-produced repository map with traceable paths.
- Pass/fail: PASS when the built-in profile delegates and returns useful content; FAIL on inline-only work or mutation; SKIP on auth/availability blockers.

## 3. TEST EXECUTION

1. `devin -p "Use a subagent_explore subagent to identify the cli-external-orchestration skill packet, its SKILL.md, and its manual-testing playbooks. Do not edit files." --model adaptive --permission-mode normal </dev/null > /tmp/cli-devin-dv010.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv010.txt`
2. Inspect the output for the child profile and paths.
3. `git status --porcelain`.

| Feature ID | Exact command | Expected signal | Verdict |
|---|---|---|---|
| DV-010 | `devin -p ... subagent_explore ...` | Built-in read-only child result, clean tree | PASS/FAIL/SKIP |

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Subagent category and PASS/FAIL discipline |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/agent-delegation.md` | Built-in profile and invocation contract |
| `../../SKILL.md` | Conductor ownership and profile-routing rule |

## 5. SOURCE METADATA

- Group: Subagents
- Playbook ID: DV-010
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `subagents/builtin-profile.md`
