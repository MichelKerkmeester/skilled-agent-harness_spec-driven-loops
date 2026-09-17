---
title: Stress-Test Failure Paths Before Promotion Claims
description: Same-task A/B stress-test protocol required before recommending promotion for changes that alter agent discipline.
trigger_phrases:
  - "stress test failure paths"
  - "A/B promotion evidence"
  - "sandbox baseline comparison"
  - "legal-stop gate keys check"
importance_tier: important
contextType: implementation
version: 1.17.0.0
---

# Stress-Test Failure Paths Before Promotion Claims

Full protocol for Mode 2A of the Lane A (agent-improvement) loop: proving that a disciplined `/deep:agent-improvement` run actually behaves differently from a generic improvement attempt before recommending promotion.

---

## 1. OVERVIEW

### Purpose

Defines the same-task A/B stress-test operators and orchestrators must run before recommending promotion for any candidate that alters agent discipline (rules, boundaries, escalation behavior), so promotion claims rest on observed grep/file/diff/exit-code evidence rather than on having merely read or invoked the skill.

### When to Use

Use this reference when:
- A candidate changes ALWAYS/NEVER rules, boundary enforcement, or escalation behavior
- You are about to recommend promotion and need the required stress-test evidence first
- Reviewing whether a prior promotion recommendation actually ran this protocol

### Core Principle

Reading `SKILL.md` or invoking `skill(deep-improvement)` is not evidence that the disciplined path executed. Only observed behavioral signals — helper invocation, packet-local candidate boundary, no premature canonical/mirror mutation, benchmark journal boundary, legal-stop gate keys, and stop-reason correctness — count as evidence.

---

## 2. PROTOCOL

For changes that alter agent discipline, run at least one same-task A/B stress scenario before recommending promotion:

1. **Call A**: run a generic improvement attempt against an isolated sandbox copy of the target.
2. **Reset**: reset the sandbox to its baseline copy.
3. **Call B**: run the disciplined `/deep:agent-improvement` path against the identical prompt and files.
4. **Judge**: compare only grep/file/diff/exit-code signals between Call A and Call B — helper invocation, packet-local candidate boundary, no canonical or mirror mutation before promotion, benchmark journal boundary, legal-stop gate keys, and stop-reason correctness.

Do not treat `Read(SKILL.md)` or `skill(deep-improvement)` as evidence that this protocol executed.

---

## 3. RELATED RESOURCES

- `../shared/loop-protocol.md`
- `../shared/runtime-truth-contracts.md`
- `score-dimensions.md`
- `../../scripts/shared/promote-candidate.cjs`
