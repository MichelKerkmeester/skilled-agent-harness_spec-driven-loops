---
title: Target Onboarding Guide
description: How to add a new bounded target to deep-improvement without weakening guardrails.
trigger_phrases:
  - "onboard new target"
  - "add deep-improvement target"
  - "classify canonical derived candidate target"
  - "target manifest guardrails"
---

# Target Onboarding Guide

Workflow for onboarding new deep-improvement targets while keeping evaluator discipline, manifest clarity, and promotion safety intact. Use it when a new target is genuinely needed rather than just interesting.

---

## 1. OVERVIEW

### Purpose

Explains how to add a bounded target to `deep-improvement` without weakening the existing manifest and benchmark rules.

### When to Use

Use this reference when:
- adding a new target profile
- deciding whether a target should be canonical, derived, or candidate-only
- checking whether target growth is still safe

### Core Principle

Target growth should be explicit, repeatable, and evaluator-backed. If the target cannot be classified or benchmarked cleanly, it is not ready.

---

## 2. PRECONDITIONS

Only add a target when all of the following are true:

- the target has a structured output contract
- the target can be benchmarked deterministically or with policy-stable rules
- the target can be classified clearly as canonical, derived, or candidate-only
- the target does not require mirror sync to prove the experiment result

---

## 3. REQUIRED STEPS

1. (Optional) Add the manifest entry in `assets/agent-improvement/target_manifest.jsonc` if the target needs explicit classification or guardrail protections
2. Run `generate-profile.cjs` to derive a scoring profile from the agent's own structure and rules:

   ```text
   node scripts/agent-improvement/generate-profile.cjs --agent=.opencode/agents/{name}.md
   ```

3. Run `score-candidate.cjs` against the target for a dynamic-mode 5-dimension baseline
4. Run `run-benchmark.cjs` against packet-local outputs for the new target if benchmark evidence is required
5. Confirm reducer output still separates target families cleanly

Dynamic mode is the only scoring path. There are no static profiles to maintain.

---

## 4. CLASSIFICATION RULES

- `canonical`: may become promotion-eligible only with explicit guardrails
- `derived`: downstream packaging surface only
- `candidate-only`: benchmarkable and scoreable, but not promotable in the current packet

---

## 5. CURRENT RECOMMENDATION

- every target is onboarded through dynamic mode; there is no static, automatically promotion-eligible profile
- promotion remains a per-target decision requiring explicit operator approval, repeatability evidence, and manifest boundary compliance

---

## 6. RELATED RESOURCES

- `../model-benchmark/evaluator_contract.md`
- `../../assets/agent-improvement/target_manifest.jsonc`

