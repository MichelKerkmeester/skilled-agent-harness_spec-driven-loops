---
title: "Decision: Table wording experiment"
description: "The pre-registered rule adopts the short no-table wording: once communication.md is read, neither wording produced a table in 216 replies."
trigger_phrases:
  - "table wording decision"
  - "short no table wording adopted"
importance_tier: "normal"
contextType: "implementation"
---
# Decision: Table wording experiment

## 1. DECISION

**Adopt the short wording.** Rule 2 of `preregistration.md` §4 applies: the short arm's primary rate minus the current arm's is +0.0 points with a 95% Newcombe interval of -3.4 to +3.4, whose upper bound is below +5. The short wording is no worse and is 460 bytes smaller. Rule 1, a reduction, does not apply, because the interval includes 0.

Live adoption waits until the 006 post-change window has been measured, as `preregistration.md` §4 and the parent goal's D6 require. The wording commit then carries its ledger entry under REQ-004.

## 2. DATA

625 scored runs across five executor strata, arm-balanced by the shuffled schedule, with no unscorable run. `results/deviations.md` records how the strata came about. The figures below come from `final-scores.txt`. `scored-runs.jsonl` holds one row per run with no reply text, so every aggregate can be rebuilt.

- **Primary, pooled:** long replies with a table among replies whose run read `communication.md` before the final reply. Current 0 of 108 (0.0%, 0.0 to 3.4), short 0 of 108 (0.0%, 0.0 to 3.4).
- **Every stratum agrees:** no stratum produced a table in a reply that followed a read of the rule. Luna 0 of 55 and 0 of 51, SWE-2 Max 0 of 37 and 0 of 44, DeepSeek through OpenCode Go 0 of 13 and 0 of 11, DeepSeek through Cline 0 of 2 and 0 of 1, DeepSeek through Devin 0 of 1 and 0 of 1.
- **Intention to treat:** current 15.8% of 303, short 21.0% of 314. Every one of those tables came from a run that never read the rule, where the wording cannot act, so the gap is not a wording effect.
- **Delivery:** the rule was read before the reply in 35.6% and 34.4% of long replies. Cline's DeepSeek read it in 3 of 56.
- **Drift control:** semicolons in 70.0% and 68.8% of long replies, level across the arms.

## 3. WHAT IT MEANS

The rule works when it is read, in either wording. The table rate is decided by whether the rule is delivered, which is the question phase 009 takes up, not by how the rule is worded.

## 4. LIMITS

The test environments carried no project-level `AGENTS.md`, so only the Devin strata received the AGENTS.md mandates. Luna and the OpenCode strata found the rules by listing the directory (`009-rule-delivery-debugging/results/delivery-trace.md`). Both arms shared that environment, so the arm comparison stands, but the delivery rates here do not predict delivery in a live session, where the root `AGENTS.md` loads.
