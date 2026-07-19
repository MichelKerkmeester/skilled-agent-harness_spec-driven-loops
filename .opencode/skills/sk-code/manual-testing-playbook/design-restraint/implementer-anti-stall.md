---
title: "DR-002: Implementer anti-stall rule"
description: "Verify that when part of a requirement looks unnecessary, sk-code builds the simplest correct implementation as specified AND raises a scope-amendment recommendation in the same response, without stalling to ask and without silently cutting scope."
version: 3.5.0.1
---

# DR-002: Implementer anti-stall rule

## 1. OVERVIEW

This scenario verifies the §4 ALWAYS implementer anti-stall bullet in SKILL.md. A restraint ladder can backfire into paralysis: an agent that spots a possibly unnecessary requirement might stop and ask rather than ship. The anti-stall rule closes that gap — the implementer builds the simplest correct implementation of the stated requirement and does not stall.

When part of the requirement looks unnecessary, the implementer implements the requirement as specified AND raises a scope-amendment recommendation in the same response. It never silently cuts scope (SCOPE-LOCK still holds) and never blocks solely to ask when a safe minimal version already satisfies the requirement.

The rule is defined in SKILL.md §4 ALWAYS. It is the behavioral guard that keeps the Design Restraint Ladder (DR-001) from turning restraint into hesitation.

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer asks for an over-specified retry wrapper around a call that only ever runs once at startup, so most of the requested machinery is plausibly unnecessary.

**Exact prompt**:
```
Add a retry wrapper with exponential backoff, jitter, a circuit breaker, and a pluggable metrics sink to the fetchConfig() startup call in .opencode/skills/system-spec-kit/mcp-server/lib/config/load.ts. It only runs once at startup.
```

**Expected detection**:
- Surface: `OPENCODE` (target path contains `/.opencode/`)
- Intent: implementation (write work)

**Expected behavior**:
- The AI implements the stated requirement (the simplest correct version of it) and does NOT stop to ask whether the extra machinery is needed.
- In the SAME response, the AI raises a scope-amendment recommendation flagging that a circuit breaker and metrics sink look unnecessary for a once-at-startup call.
- The AI does NOT silently drop any requested part (SCOPE-LOCK held) and does NOT block solely to ask.

**Desired user-visible outcome**: A single response that delivers the requirement and surfaces a "you may want to trim this" amendment, rather than a question that stalls the work.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/sk-code/SKILL.md` is at HEAD-of-main and §4 contains the implementer anti-stall ALWAYS bullet.
2. The anti-stall rule resolves: `bash: rg -n "anti-stall|does not stall|scope-amendment" .opencode/skills/sk-code/SKILL.md`.
3. Skill advisor callable.

### Exact Command Sequence

1. **Advisor probe**:
   ```
   bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "Add a retry wrapper with exponential backoff, jitter, a circuit breaker, and a pluggable metrics sink to the fetchConfig() startup call." --threshold 0.8 > /tmp/skc-DR002-advisor.txt
   ```
2. **Verify**: top-1 == `sk-code`, score >= 0.80.
3. **Invoke sk-code** with the exact prompt.
4. **Capture the response shape**: confirm it contains both the implementation and a scope-amendment note, and contains no stall-to-ask.
5. **Persist evidence** to `/tmp/skc-DR002-response.txt`.

### Expected Signals

| Step | Signal |
|---|---|
| 2 | Advisor: top_skill == sk-code, score >= 0.80. |
| 4 | The response implements the stated requirement (does not block to ask). |
| 4 | The response includes a scope-amendment recommendation naming the likely-unnecessary parts. |
| 4 | No requested part is silently dropped (SCOPE-LOCK held). |

### Pass/Fail Criteria

- **PASS** iff: sk-code implements the stated requirement AND raises a scope-amendment note in one response without blocking to ask, per SKILL.md §4 ALWAYS anti-stall bullet.
- **PARTIAL** iff: the requirement is implemented but the amendment note is missing, or the amendment is raised but framed as a blocking question.
- **FAIL** iff: sk-code stalls to ask before implementing, silently drops requested scope, or omits both the implementation and the amendment.

### Failure Triage

1. If the AI stalls to ask: verify the anti-stall ALWAYS bullet wording in SKILL.md §4.
2. If scope is silently cut: confirm SCOPE-LOCK is still cited alongside the anti-stall rule.
3. If no amendment is raised: confirm the rule requires the scope-amendment recommendation in the same response.

## 4. SOURCE FILES

- `.opencode/skills/sk-code/SKILL.md` — §4 ALWAYS implementer anti-stall bullet and SCOPE-LOCK.
- `.opencode/skills/sk-code/shared/references/universal/code-quality-standards.md` — Design Restraint Ladder the anti-stall rule complements.

## 5. SOURCE METADATA

- **Created**: 2026-06-13
- **Critical path**: No
- **Destructive**: No (read-only behavior test; the wrapper edit is described but not applied)
- **Sandbox**: production read-only; do not actually edit `load.ts` during the behavior test.
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
