---
title: "Pre-registration: Gate 5 card pilot"
description: "Metric, sample, schedule and decision rule for loading rule cards at Gate 5 instead of full rule files, run in isolated test environments and fixed before any scored run."
trigger_phrases:
  - "card pilot preregistration"
  - "gate 5 card decision rule"
importance_tier: "normal"
contextType: "implementation"
---
# Pre-registration: Gate 5 card pilot

<!-- SPECKIT_LEVEL: 2 -->

---

## 1. DESIGN

The pilot runs in isolated test environments built by `rule-experiment.py build` from `experiment/arms.json`, like phase 007. Each arm is a git repository holding the shared fixture project, the live `REPO RULES.md` and the 13 rule files. Every run starts from a fresh copy of its arm, and the live rule files do not change during the pilot.

- **Full arm**: the router as it is. Gate 5 loads full rule files.
- **Cards arm**: the 13 generated cards sit in `.skilled/repo-rules/cards/`, every trigger-table Load link points at a card, and a sixth how-to-use line says to open the full file when the card does not settle the question.
- **Resident arm**: dropped under REQ-005. `AGENTS.md` at 26,778 bytes plus the five reply-rule cards at 7,677 bytes is 34,455 bytes, above the 32,768-byte limit.
- **Executors**: GPT-6 Luna at max reasoning on the fast tier through Codex, and DeepSeek V4.1 Flash at max through Devin when its usage quota allows. A result with one executor says so.
- **Prompts**: the 15 write tasks on the fixture in `experiment/prompts.json`. Each tempts at least one rule: scope, blast radius, root cause, evidence or overengineering. The suffix names the pre-bound spec folder so Gate 3 does not stall a run. Nothing tells the model to read a rule.
- **Schedule**: every prompt runs 12 times per arm per executor, 180 runs per arm, interleaved in one shuffled order (seed 16).

## 2. METRICS

- **Primary**: the share of long replies breaking at least one of the five phase 004 prohibitions (tables, empty openers, a label as the first line, em dashes, semicolons), per arm.
- **Co-primary**: the Gate 5 miss rate, the share of runs that wrote a file before reading `REPO RULES.md`.
- **Secondary**: each prohibition separately, the reply-rule miss rate, the card fallback rate (a full rule file read after its card) and the mean bytes of rule text read per run.
- Each rate is reported with its denominator and a Wilson 95% interval. Runs that exit non-zero or leave no transcript are counted as unscorable.

## 3. SAMPLE SIZE

180 runs per arm per executor with one executor available. This detects a 15-point difference in the primary rate near 50% at about 80% power, so the pilot is sized to catch a large harm from cards, not a small one. A smaller harm would pass unseen, which the decision rule states.

## 4. DECISION RULE

Let d be the cards arm's rate minus the full arm's, with a 95% Newcombe interval, pooled across executors.

1. The upper bound of d on the primary rate is below +15 points, the upper bound of d on the Gate 5 miss rate is below +15 points, and the cards arm reads fewer rule bytes per run: adopt cards. The 15-point margin matches what this sample can resolve, since the interval on d is about 10 points either side. It rules out a large harm, not a small one.
2. Otherwise keep full files and remove every pilot artifact: the generator, the cards, check 11 and its tests, per REQ-006.

Live adoption of cards waits until the 006 post-change window has been measured and 007 has committed its decision. Adoption also needs check 2 to accept card links as row coverage, because in the cards arm it fails by design.
