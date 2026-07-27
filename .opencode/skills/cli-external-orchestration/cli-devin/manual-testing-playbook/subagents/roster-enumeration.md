---
title: "DV-012 -- Agent roster enumeration"
description: "Verify that Devin exposes the 13 mirrored repository agents alongside its two built-in profiles."
version: 1.0.0.0
---

# DV-012 -- Agent roster enumeration

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-012`.

## 1. OVERVIEW

Enumerate the dispatchable agent roster and compare it with the expected 13 mirrored names plus `subagent_explore` and `subagent_general`.

### Why This Matters

A single successful custom dispatch does not prove roster parity. Enumeration catches missing symlinks, name drift, and accidental loss of a specialization.

## 2. SCENARIO CONTRACT

- Objective: Produce a complete, duplicate-free dispatchable agent roster.
- Real user request: `List every subagent profile Devin can actually dispatch in this repository.`
- Prompt: `Enumerate every dispatchable Devin subagent profile in this repository. Separate the 13 mirrored repository agents from the built-ins subagent_explore and subagent_general. Do not edit files.`
- Expected execution process: Run `find` against `.devin/agents/` and a real `devin -p` roster request; compare names, counts, and symlink targets.
- Expected signals: All 13 names appear: ai-council, code, context, debug, deep-alignment, deep-improvement, deep-research, deep-review, design, markdown, orchestrate, prompt-improver, review; built-ins also appear.
- Desired user-visible outcome: A reproducible roster report with no missing or duplicate profiles.
- Pass/fail: PASS on exact roster parity; FAIL on any missing, duplicate, or undispatchable expected name; SKIP on auth/availability blockers.

## 3. TEST EXECUTION

1. `find .devin/agents -maxdepth 2 -name AGENT.md -type l -print | sort`
2. `devin -p "Enumerate every dispatchable Devin subagent profile in this repository. Separate the 13 mirrored repository agents from the built-ins subagent_explore and subagent_general. Do not edit files." --model adaptive --permission-mode normal </dev/null > /tmp/cli-devin-dv012.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv012.txt`
3. Compare the command output with the expected roster and count 13 mirrored files.

| Feature ID | Exact command | Expected signal | Verdict |
|---|---|---|---|
| DV-012 | `find ... -> devin -p ... roster ...` | 13 mirrored + 2 built-ins | PASS/FAIL/SKIP |

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Roster coverage note |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/agent-delegation.md` | Roster and profile rules |
| `../../SKILL.md` | Verified 13-agent roster |
| `../../../../.devin/agents/` | Mirror directory under test |

## 5. SOURCE METADATA

- Group: Subagents
- Playbook ID: DV-012
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `subagents/roster-enumeration.md`
