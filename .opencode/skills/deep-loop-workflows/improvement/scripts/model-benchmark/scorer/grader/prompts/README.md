---
title: "prompts: grader system prompts"
description: "System prompts for the D4 primary grader and the adversarial dispute grader."
trigger_phrases:
  - "grader system prompts"
  - "system-grader"
  - "system-skeptic"
---

# prompts: grader system prompts

---

## 1. OVERVIEW

`prompts/` holds the system prompts the grader harness reads at dispatch time. `harness.cjs` loads `system-grader.md` by default and `dispute.cjs` passes `system-skeptic.md` for the adversarial second call. Both prompts instruct the model to score the D4 hallucination dimension and return JSON only.

---

## 2. KEY FILES

| File | What it instructs |
|---|---|
| `system-grader.md` | The primary grader. Scores D4 hallucination by checking that every CLI flag, symbol, and path is allowlisted or a known builtin or package. Penalizes invented flags and made-up symbols. Sets confidence below 0.7 when a claim cannot be verified. Requires JSON-only output with `dim_id`, `score`, `confidence`, `rationale`, `evidence`, and `version`. |
| `system-skeptic.md` | The adversarial dispute resolver. Defaults to suspicion and scores high only when every claim is affirmatively verified. Adds an `adversarial_findings` field and is invoked when primary confidence is low or the dispute rate is high. Requires the same JSON-only contract. |
