---
title: "sk-communication Manual Testing Playbook"
description: "Deterministic operator scenarios for sk-communication, and the corpus its benchmark runs score against."
trigger_phrases:
  - "sk-communication manual testing"
  - "sk-communication playbook"
importance_tier: "important"
contextType: "general"
---

# sk-communication Manual Testing Playbook

> Operator scenarios for this skill. This corpus is an input: a benchmark run reads it and
> never rewrites it, so a later run can be compared against an earlier one.

---

## 1. OVERVIEW

TODO state what this playbook covers and what it deliberately leaves to automated tests.

## 2. SCENARIOS

TODO add one category folder per area, and one file per feature inside it. Every scenario
needs a deterministic prompt, an expected signal, and a pass or fail criterion another
operator could apply without asking the author what was meant.

## 3. RESULTS

Runs land in [`../benchmark/reports/`](../benchmark/reports/), one dated folder each.
`create-manual-testing-playbook` owns the scenario contract and the results-storage rules.
