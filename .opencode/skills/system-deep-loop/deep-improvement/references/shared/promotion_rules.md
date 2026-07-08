---
title: Promotion Rules
description: Keep, reject, and guarded promotion rules for deep-improvement candidates.
trigger_phrases:
  - "promotion rules"
  - "keep vs reject candidate"
  - "promotion prerequisites"
  - "no-go conditions"
importance_tier: important
contextType: implementation
version: 1.17.0.14
---

# Promotion Rules

Policy reference for deciding whether a deep-improvement candidate stays baseline-only, is rejected, or becomes promotion-eligible. Use it when score and benchmark evidence exist and you need the decision rule, not just the raw metrics.

---

## 1. OVERVIEW

### Purpose

Defines the difference between an interesting candidate, an acceptable candidate, and a promotable candidate.

### When to Use

Use this reference when:
- Reviewing score and benchmark outputs
- Explaining why a candidate tied, lost, or won
- Checking whether promotion prerequisites are actually satisfied

### Core Principle

Promotion stays intentionally narrower than scoring and benchmarking. A candidate can be promising without being safe to promote.

---

## 2. CURRENT PROMOTION POSTURE

All agent targets are evaluated via dynamic mode. Promotion is a per-target decision made under dynamic mode; there are no static, automatically promotion-eligible profiles.

When promotion is enabled, the promotion script enforces the same gates in both callable phases:
- `candidate-acceptable` dynamic-mode 5-dimension scoring above `scoring.thresholdDelta`
- a matching `benchmark-pass` report (when benchmarks are configured for the target)
- a passing repeatability report
- explicit operator approval plus manifest boundary enforcement for the specific target
- a hard repo-managed mirror sync gate when the target is an agent definition under `.opencode/agents/`, `.claude/agents/`, or `.opencode/agents/`

`--phase=accept` verifies those gates and snapshots the canonical preimage plus accepted candidate into the archive without mutating the canonical target. `--phase=ship` loads the accepted-state file, verifies that the canonical target still matches the accepted preimage, and then writes the accepted candidate snapshot. The legacy no-phase command still performs the previous guarded one-step promotion for existing callers.

The default branch preservation policy is `preserve-on-failure`. Under that policy, accept or ship gate failures emit `promotion_blocked_branch_preserved` to the configured event log and leave branch/candidate evidence intact.

---

## 3. KEEP VS REJECT

Keep the baseline when:
- the candidate score is lower
- the candidate violates the manifest
- the candidate only adds noise

Reject the candidate when:
- hard rejection conditions fire
- the run is an infra failure
- the candidate broadens scope

Prefer the candidate only when:
- the candidate score is higher
- no hard rejection condition fired
- the delta is meaningful

---

## 4. TIE-BREAK

When scores tie, prefer the simpler option:
- fewer instructions
- less duplication
- clearer file-reading contract
- narrower scope language

---

## 5. PROMOTION PREREQUISITES

Promotion is allowed only when:
- artifact-level fixtures exist (or are waived for the specific target)
- repeatability is proven for the active benchmark set
- rollback steps are documented
- accept/ship evidence is present when using the two-phase path
- the explicit approval gate is passed
- the target is not classified `fixed` or `forbidden` in the manifest
- agent-definition targets are present and content-aligned across both runtime mirrors (`.opencode/agents/`, `.claude/agents/`)

If mirror verification fails, promotion rejects with a structured `MIRROR_SYNC_GATE_FAILED` error. The optional promotion state file records `mirror_sync_state` as `all_landed`, `partial:<runtime-list>`, or `verification_failed`. Resume behavior defaults to rolling back partial mirror landings before another promotion attempt; operators may instead retry failed mirrors or pause for an explicit decision.

---

## 6. NO-GO CONDITIONS

Safety brakes that force the loop to stop or refuse broader rollout. Do not expand the loop beyond the current boundary when any of these are true:

- the scorer cannot reliably separate a weak candidate from the baseline
- the benchmark runner cannot produce stable scores across repeat runs
- promotion cannot be rolled back quickly
- runtime mirror drift is undocumented
- a second target lacks a deterministic or policy-stable evaluator
- the mutator and scorer boundaries blur
- canonical mutation happens without explicit approval
- ship attempts to write over a canonical target that no longer matches the accepted preimage
- benchmark evidence and mirror-sync evidence are being mixed together
- a profile exceeds the configured infra-failure or weak-benchmark limits
- all 5 evaluation dimensions have plateaued (3+ consecutive identical scores per dimension), indicating the loop has exhausted its current approach - stop and reassess the hypothesis or target

The reducer consumes these configured stop rules and marks the runtime `shouldStop` when the packet crosses them.

---

## 7. RELATED RESOURCES

- `../model_benchmark/evaluator_contract.md`
- `rollback_runbook.md`
- `../../scripts/shared/reduce-state.cjs`
- `../../scripts/shared/promote-candidate.cjs`
- `../../scripts/shared/rollback-candidate.cjs`
