---
title: "Decision: Gate 5 card pilot"
description: "The pre-registered rule adopts rule cards at Gate 5: no large harm on prohibitions or Gate 5 misses, and 29% less rule text read per run."
trigger_phrases:
  - "card pilot decision"
  - "gate 5 cards adopted"
importance_tier: "normal"
contextType: "implementation"
---
# Decision: Gate 5 card pilot

## 1. DECISION

**Adopt cards at Gate 5.** Rule 1 of `preregistration.md` §4 applies, because all three of its conditions hold on the pooled data:

- **Primary:** long replies breaking at least one prohibition, cards minus full, -4.0 points with a 95% Newcombe interval of -15.5 to +7.6. The upper bound is below +15.
- **Co-primary:** the Gate 5 miss rate, cards minus full, +2.2 points, -3.3 to +7.9. The upper bound is below +15.
- **Bytes:** the cards arm read 42,064 bytes of rule text per run against 59,620 for full files, 29% less.

The 15-point margin rules out a large harm, not a small one, as the pre-registration states.

Live adoption waits until the 006 post-change window has been measured. Before the router change lands, checks 2 and 10 in `check-repo-rules.cjs` must accept card links, since both fail or pass vacuously on the cards router (goal D6). No rejected-arm artifact exists to remove: the resident arm was dropped under REQ-005 before anything was built for it, and the full arm is the current repository.

## 2. DATA

318 scored runs across four executor strata, 162 cards and 156 full, with no unscorable run. `results/deviations.md` records how the strata came about. The figures come from `final-scores.txt`, and `scored-runs.jsonl` holds one row per run with no reply text.

- **Per stratum, primary:** Luna -4.0 points (-17.8 to +10.1), SWE-2 Max -23.5 (-52.9 to +13.5), DeepSeek through OpenCode Go -10.5 (-41.1 to +23.3), DeepSeek through Cline +13.3 (-9.2 to +37.9). The small strata are wide and point both ways.
- **Prohibitions:** no tables, empty openers or label first lines in either arm. Em dashes 15.9% and 13.8%, semicolons 56.8% and 58.7%.

## 3. RISKS TO WATCH AFTER ADOPTION

- **Reply rules missed more often:** cards minus full +6.5 points, -4.3 to +17.2. A secondary metric that does not enter the rule, but its interval leans against cards. The live measurement after adoption should track it.
- **Fallback:** after reading a card, the model opened the full rule file in 55.9% of runs (Luna 65.6%, DeepSeek 27 to 29%, SWE-2 0 of 7). That is why the byte saving is 29% and not the 80% the card sizes alone would give.
