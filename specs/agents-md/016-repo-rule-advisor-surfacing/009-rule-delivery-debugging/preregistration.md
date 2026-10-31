---
title: "Pre-registration: Rule delivery debugging"
description: "Arms, metric, sample and decision rule for loading the reply rules through a numbered gate instead of a bullet, fixed before any scored arm run."
trigger_phrases:
  - "reply rule gate preregistration"
  - "rule delivery decision rule"
importance_tier: "normal"
contextType: "implementation"
---
# Pre-registration: Rule delivery debugging

<!-- SPECKIT_LEVEL: 2 -->

---

## 1. DESIGN

The control arms of phases 007 and 008 showed the cause (`results/control-arm-miss-rates.txt`, `results/delivery-trace.md`). Gate 5, a numbered hard-block gate, was missed in 5 of 136 write runs, all of them runs that never received the mandate. The reply-rule load, a bullet late in `AGENTS.md`, was skipped in 62% of SWE-2 replies even though SWE-2 receives it. The test is whether the reply-rule load holds better as a numbered gate.

Each arm is an isolated environment built by `rule-experiment.py build` from `experiment/arms.json`: the shared fixture, the live router and rules, and a project-level copy of the repository `AGENTS.md`, which Codex and OpenCode load as they do live. A probe on 2026-10-05 had both executors quote Gate 5 from their loaded instructions without reading a file.

- **Baseline arm**: `AGENTS.md` as it is.
- **Gate 6 arm**: the reply-rule bullet becomes `GATE 6: REPLY RULES LOAD [HARD] BLOCK` after Gate 5, with the same five files and triggers, and the old bullet becomes a pointer to it. Nothing else changes.
- **Executors**: GPT-6 Luna at max reasoning on the fast tier through Codex, and DeepSeek V4.1 Flash at max through OpenCode Go.
- **Prompts**: the 45 prompts in `experiment/prompts.json`, the 30 reply-only questions of 007 and the 15 write tasks of 008. None mentions a rule.
- **Schedule**: every prompt runs twice per arm per executor, 180 runs per arm, interleaved in one shuffled order (seed 16).

## 2. METRICS

- **Primary**: the reply-rule miss rate, long replies whose run did not read `communication.md` and `communication-prose.md` before the final reply. Executors are pooled.
- **Guard**: the Gate 5 miss rate on runs that wrote a file.
- **Secondary**: each executor separately, the five phase 004 prohibitions, and rule bytes read per run.
- Each rate is reported with its denominator and a Wilson 95% interval, and each arm difference with a Newcombe interval.

## 3. SAMPLE SIZE

About 170 long replies per arm. With a baseline miss rate near 60%, that detects a drop of about 15 points at 80% power.

## 4. DECISION RULE

Let d be the Gate 6 arm's rate minus the baseline's.

1. The upper bound of d on the primary rate is below 0, and the upper bound of d on the Gate 5 miss rate is below +10 points: adopt Gate 6.
2. Otherwise keep the bullet.

A hook arm runs only if the winning arm still misses the reply rules in more than 30% of long replies, and only under a new pre-registration, as parent D3 requires. Adoption waits for its turn under parent D2, after the 008 cards' live window.
