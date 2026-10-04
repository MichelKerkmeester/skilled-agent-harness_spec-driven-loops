---
title: "Pre-registration: Table wording experiment"
description: "Metric, sample, schedule and decision rule for the short versus current no-table wording, run in isolated test environments on two executors and fixed before any scored run."
trigger_phrases:
  - "table wording preregistration"
  - "no table wording decision rule"
importance_tier: "normal"
contextType: "implementation"
---
# Pre-registration: Table wording experiment

<!-- SPECKIT_LEVEL: 1 -->

---

## 1. DESIGN

The live ABAB time blocks in `plan.md` are replaced by isolated test environments, at the operator's request to run the experiment now. Each arm is a git repository holding the shared fixture project (`sk-create-repo-rule/scripts/rule-experiment-fixture/`), the live `REPO RULES.md` and the 13 rule files, built by `rule-experiment.py build` from `experiment/arms.json`. The arms differ in one block of `communication.md` and nothing else. Every run starts from a fresh copy of its arm, so no run sees another's writes, and the live repository's rule files do not change during the experiment, which keeps the 006 measurement window clean.

- **Current arm**: the 612-byte block, "No tables in a reply. One or two facts go in a sentence…", with the in-flight exception.
- **Short arm**: "No tables in a reply, except the in-flight block in `communication-handoff.md` §6. Use a sentence for one or two facts and bullets for parallel items."
- **Executors**: DeepSeek V4.1 Flash at max through Devin, and GPT-6 Luna at max reasoning on the fast tier through Codex. Each loads its global instructions as usual, so whether it reads `communication.md` is its own behaviour.
- **Prompts**: the 30 reply-only questions in `experiment/prompts.json`. Each invites a grid and none contains "table", "matrix", "comparison" or "compare".
- **Schedule**: every prompt runs 5 times per arm per executor, 600 runs in all, interleaved in one shuffled order (seed 16) so drift during the run spreads across both arms.

Delivery is natural. Nothing in the prompt tells the model to read the rule, because the experiment should measure the rule as it loads in practice.

## 2. METRICS

- **Primary**: the share of long replies (400 characters or more) carrying a markdown table, among replies whose run read `communication.md` before replying. Executors are pooled.
- **Secondary**: the same share over every long reply (intention to treat), each executor separately, and the other four prohibition checks from the phase 004 analyzer, with the semicolon rate as a drift control.
- Each rate is reported with its denominator and a Wilson 95% interval. A run that exits non-zero or leaves no transcript is unscorable and counted separately.

## 3. SAMPLE SIZE

The spec's planned effect is a drop from about 20% to 10%, which needs about 200 delivered long replies per arm at 80% power. The pilot of 16 runs read `communication.md` in 7 of 8 DeepSeek runs and 3 of 8 Luna runs, so 300 runs per arm should yield about 190 delivered replies per arm. The pilot is excluded from the result.

## 4. DECISION RULE

Let d be the short arm's primary rate minus the current arm's, with a 95% Newcombe interval.

1. The upper bound of d is below 0: the short wording lowers the table rate. Adopt it.
2. Otherwise the upper bound of d is below +5 points: the short wording is no worse and is 460 bytes smaller. Adopt it.
3. Otherwise keep the current wording.

Live adoption of a winning wording waits until the 006 post-change window has been measured, so the two changes never share a window.
