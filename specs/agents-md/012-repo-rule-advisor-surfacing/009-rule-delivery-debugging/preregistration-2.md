---
title: "Pre-registration 2: Rule delivery debugging"
description: "A write-task replication of the Gate 6 arm sized to resolve the Gate 5 guard the first pre-registration could not, fixed before any of its runs."
trigger_phrases:
  - "gate 6 replication preregistration"
  - "gate 5 guard follow-up"
importance_tier: "normal"
contextType: "implementation"
---
# Pre-registration 2: Rule delivery debugging

<!-- SPECKIT_LEVEL: 2 -->

---

## 1. DESIGN

`results/decision.md` kept the bullet under the first pre-registration: Gate 6 cut reply-rule misses by 22.6 points, but about 30 write runs per arm could not bound the Gate 5 guard below +10 points. This replication runs write tasks only, so every run tests the guard, and it decides adoption on its own data. The first run's data does not enter it.

- **Arms**: the same `experiment/arms.json`, baseline and Gate 6, built fresh.
- **Executors**: GPT-6 Luna at max reasoning on the fast tier through Codex, and DeepSeek V4.1 Flash at max through OpenCode Go.
- **Prompts**: the 15 write tasks in `experiment/prompts-write.json`, the write tasks of `experiment/prompts.json` unchanged. None mentions a rule.
- **Schedule**: every prompt runs 3 times per arm per executor, 90 runs per arm, interleaved in one shuffled order (seed 29).

## 2. METRICS

- **Guard**: the Gate 5 miss rate on runs that wrote a file.
- **Primary**: the reply-rule miss rate on long replies, as in the first pre-registration.
- Rates carry denominators and Wilson 95% intervals, arm differences Newcombe intervals, executors pooled.

## 3. SAMPLE SIZE

90 runs per arm. In the first run, about half the write-task runs edited a file (32 and 30 of 60 per arm), so about 45 writing runs per arm. With no misses in either arm, that bounds the guard difference near +7.9 points, inside the +10 limit even at 40 writing runs (+8.8).

## 4. DECISION RULE

Let d be the Gate 6 arm's rate minus the baseline's.

1. The upper bound of d on the Gate 5 miss rate is below +10 points, and the upper bound of d on the reply-rule miss rate is below 0: adopt Gate 6.
2. Otherwise keep the bullet.

Adoption waits for its turn under parent D2, after the 008 cards' live window. A hook arm runs only if the adopted arm still misses the reply rules in more than 30% of long replies, under a further pre-registration.
