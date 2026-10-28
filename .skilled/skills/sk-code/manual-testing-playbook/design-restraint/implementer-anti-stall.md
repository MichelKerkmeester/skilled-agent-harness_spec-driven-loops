---
title: "DR-002: Implementer anti-stall rule"
description: "Verify that when part of a requirement looks unnecessary, sk-code builds the simplest correct implementation as specified AND raises a scope-amendment recommendation in the same response, without stalling to ask and without silently cutting scope."
version: 1.5.2.0
---

# DR-002: Implementer anti-stall rule

## 1. OVERVIEW

This scenario verifies the implementer anti-stall rule, which lives in the Pre-Write Restraint step of `shared/references/workflow-implement.md`: walk the Design Restraint Ladder and stop at the first rung that holds, and when requested scope looks unnecessary or risky, implement the requirement and raise a scope-amendment recommendation in the same response. A restraint ladder can backfire into paralysis: an agent that spots a possibly unnecessary requirement might stop and ask rather than ship. The anti-stall rule closes that gap — the implementer builds the simplest correct implementation of the stated requirement and does not stall.

When part of the requirement looks unnecessary, the implementer implements the requirement as specified AND raises a scope-amendment recommendation in the same response. It never silently cuts scope (SCOPE-LOCK still holds) and never blocks solely to ask when a safe minimal version already satisfies the requirement.

It is the behavioral guard that keeps the Design Restraint Ladder (DR-001) from turning restraint into hesitation. `SKILL.md` section 4 carries the SCOPE-LOCK rule the anti-stall behavior sits beside; the anti-stall wording itself is the reference's.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer asks for an over-specified retry wrapper around a call that only ever runs once per gate run, so most of the requested machinery is plausibly unnecessary.

**Exact prompt**:
```
Add a retry wrapper with exponential backoff, jitter, a circuit breaker, and a pluggable metrics sink to the discoverConfig() call in .skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs. It only runs once per gate run.
```

Prompt: `Add a retry wrapper with exponential backoff, jitter, a circuit breaker, and a pluggable metrics sink to the discoverConfig() call in .skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs. It only runs once per gate run.`

**Expected detection**:
- Surface: `SKILLED` (target path contains `/.skilled/`)
- Intent: implementation (write work)

**Expected behavior**:
- The AI implements the stated requirement (the simplest correct version of it) and does NOT stop to ask whether the extra machinery is needed.
- In the SAME response, the AI raises a scope-amendment recommendation flagging that a circuit breaker and metrics sink look unnecessary for a call that runs once per gate run.
- The AI does NOT silently drop any requested part (SCOPE-LOCK held) and does NOT block solely to ask.

**Desired user-visible outcome**: A single response that delivers the requirement and surfaces a "you may want to trim this" amendment, rather than a question that stalls the work.

---

## 3. TEST EXECUTION

### Preconditions

1. The rule resolves: `bash: rg -n "scope-amendment" .skilled/skills/sk-code/shared/references/workflow-implement.md`.
2. The target file exists: `bash: test -f .skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs`.
3. Skill advisor callable.

### Exact Command Sequence

1. **Advisor probe**:
   ```
   bash: python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "Add a retry wrapper with exponential backoff, jitter, a circuit breaker, and a pluggable metrics sink to the discoverConfig() call in .skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs. It only runs once per gate run." --threshold 0.8 > /tmp/skc-DR002-advisor.txt
   ```
2. **Verify**: the top-1 candidate is `sk-code` with `passes_threshold` true at `--threshold 0.8`.
3. **Invoke sk-code** with the exact prompt.
4. **Capture the response shape**: confirm it contains both the implementation and a scope-amendment note, and contains no stall-to-ask.
5. **Persist evidence** to `/tmp/skc-DR002-response.txt`.

### Expected Signals

| Step | Signal |
|---|---|
| 2 | Advisor: top-1 is `sk-code` with `passes_threshold` true. |
| 4 | The response implements the stated requirement (does not block to ask). |
| 4 | The response includes a scope-amendment recommendation naming the likely-unnecessary parts. |
| 4 | No requested part is silently dropped (SCOPE-LOCK held). |

### Pass/Fail Criteria

- **PASS** iff: sk-code implements the stated requirement AND raises a scope-amendment note in one response without blocking to ask, per the Pre-Write Restraint rule in `shared/references/workflow-implement.md`.
- **FAIL** iff: sk-code stalls to ask before implementing, silently drops requested scope, omits both the implementation and the amendment, implements the requirement without raising the amendment note, or raises the amendment framed as a blocking question.

Evidence: `/tmp/skc-DR002-advisor.txt` (advisor probe output) and `/tmp/skc-DR002-response.txt` (response transcript).

### Failure Triage

1. If the AI stalls to ask: verify the scope-amendment sentence in the Pre-Write Restraint step of `shared/references/workflow-implement.md`.
2. If scope is silently cut: confirm SCOPE-LOCK is still cited alongside the anti-stall rule.
3. If no amendment is raised: confirm the rule requires the scope-amendment recommendation in the same response.

---

## 4. SOURCE FILES

- `../manual-testing-playbook.md` — Root directory page and scenario summary.
- `.skilled/skills/sk-code/shared/references/workflow-implement.md` — the Pre-Write Restraint rule that requires the implementation and the scope-amendment note in one response.
- `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` — Design Restraint Ladder the anti-stall rule complements.
- `.skilled/skills/sk-code/SKILL.md` — section 4 SCOPE-LOCK, the rule the anti-stall behavior sits beside.
- `.skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs` — the target file and its `discoverConfig()` call.

Catalog: none. `feature-catalog/feature-catalog.md` does not inventory the phase doctrine or the anti-stall rule, so no catalog entry applies to this scenario.

---

## 5. SOURCE METADATA

- Group: Design Restraint
- Playbook ID: DR-002
- **Created**: 2026-06-13
- **Critical path**: No
- **Destructive**: No (read-only behavior test; the wrapper edit is described but not applied)
- **Sandbox**: production read-only; do not actually edit `quality-config.cjs` during the behavior test.
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
