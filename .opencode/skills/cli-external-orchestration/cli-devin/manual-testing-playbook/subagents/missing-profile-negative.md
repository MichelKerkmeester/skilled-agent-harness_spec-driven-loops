---
title: "DV-013 -- Missing subagent profile negative case"
description: "Verify that a nonexistent custom subagent profile fails clearly instead of silently falling back to another profile."
version: 1.0.0.0
---

# DV-013 -- Missing subagent profile negative case

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-013`.

## 1. OVERVIEW

Request a deliberately nonexistent profile and record Devin's failure behavior. The negative case does not modify the agent roster.

### Why This Matters

Silent fallback from a missing specialist to a built-in general agent can invalidate an orchestrator's assumptions about permissions, expertise, and output shape.

## 2. SCENARIO CONTRACT

- Objective: Confirm a missing profile produces an explicit failure or refusal.
- Real user request: `Use a profile named definitely-missing-profile and tell me why that cannot run.`
- Prompt: `Use the custom subagent profile definitely-missing-profile to answer with the single word MISSING. If the profile does not exist, report that exact failure and do not substitute another profile.`
- Expected execution process: Run a read-only print dispatch and inspect stderr/stdout for a missing-profile error or explicit refusal.
- Expected signals: The result identifies the missing profile; it does not claim a successful `definitely-missing-profile` dispatch and does not silently substitute `subagent_general`.
- Desired user-visible outcome: A fail-closed negative result.
- Pass/fail: PASS when the missing profile is surfaced explicitly; FAIL when a different profile runs without disclosure; SKIP only on auth/availability blockers.

## 3. TEST EXECUTION

1. `devin -p "Use the custom subagent profile definitely-missing-profile to answer with the single word MISSING. If the profile does not exist, report that exact failure and do not substitute another profile." --model adaptive --permission-mode normal </dev/null > /tmp/cli-devin-dv013.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv013.txt`
2. Record whether the output names the missing profile and whether any fallback was disclosed.
3. `git status --porcelain`.

| Feature ID | Exact command | Expected signal | Verdict |
|---|---|---|---|
| DV-013 | `devin -p ... definitely-missing-profile ...` | Explicit missing-profile failure; no silent fallback | PASS/FAIL/SKIP |

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Negative-case verdict policy |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/agent-delegation.md` | Profile selection and error handling |
| `../../SKILL.md` | Custom profile discovery correction |

## 5. SOURCE METADATA

- Group: Subagents
- Playbook ID: DV-013
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `subagents/missing-profile-negative.md`
