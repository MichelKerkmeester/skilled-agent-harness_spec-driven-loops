---
title: "Goal: Phase 2: Review, test, re-measure and fix nine Jev features"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/050-pi-default-review/002-feature-review-and-remeasure"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "All completion criteria met with evidence"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-050"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: Review, test, re-measure and fix nine Jev features

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Leave each of the nine reviewed features with a passing suite and a fresh verdict over the default transport.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
| ---- | ---------- |
| D1 | The reviewer is a fresh Claude Opus 5.5 at xhigh, named by the operator. Its workers are DeepSeek V4.1 Flash max on cli-pi and Luna 6 max fast on cli-codex |
| D2 | A re-measure calls live Jev only when `jev auth status` passes, records every call with `--out` and names the route counts |
| D3 | A change to a flag line, call protocol, aggregation or question text is an amendment, logged before the re-measure, with the old verdict kept on record |
| D4 | No new labels or corpora, per 003 D4. The session verifies and commits, path-scoped |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Each of the nine features has a log row with its review result, suite pass count and verdict line or recorded reason
- [x] Each verdict line names its run folder and how many calls Pi and the CLI answered
- [x] Each changed suite passes at or above its baseline, and no P0 or P1 stays open after the cross-family review
- [x] `validate.sh --strict` prints `RESULT: PASSED` on this phase
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase opened | Done | Spec, plan, tasks and goal authored 2026-10-03 from the operator's request |
| Session verification (2026-10-03) | Done | Every verdict line, route count, the 032 fix both ways, the pooled noul agreement and both 037 reports checked by the session |
| Suite baselines (2026-10-03, before any change) | Done | 032 38, 037 46 plus transport 37, 035 50, 025 41, 024 37, 017 30, 026 34, 031 28 (`--testTimeout 60000`), 029 29. All passing |
| Pi noul agreement, 037's open question | Done | Same rows asked through both routes in the same hour, `JEV_TRANSPORT=jev` for the CLI pair. Pooled over 483 paired calls (032, 035, 024, 029 funnel): flag agreement 97.7%, median gap 0.02, mean 0.032, p90 0.08. Two CLI runs on different days: 98.8%, median 0.01, mean 0.011, p90 0.03. Per feature, Pi vs CLI: 032 97.5% (39/40) median 0.02; 035 95.6% (172/180) median 0.03; 024 98.8% (166/168) median 0.01; 029 funnel 100% (95/95) median 0.02. 026 asked nothing (gate closed) |
| 032 citation drift | Done | Review: one defect fixed, B scored with identifier overlap whatever comparator won the baseline (`cite-drift-scan.mjs`, `runJevArm`), amendment logged below, Luna read-only review: no findings. Suite `node --test .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs`: 38 before, 39 after. After the fix: `verdict jev: keep K=40 M=40 A=37 B=13 W=24 L=0 TP=28 FP=0 F=1 p=5.960e-8`, run `050-032-jev-20261003b`, Pi 58, CLI 0. Before the fix, same route: `keep K=40 M=40 A=36 B=13 W=23 L=0 TP=27 FP=0 F=0 p=1.192e-7`, run `050-032-jev-20261003`, Pi 56, CLI 0. CLI pair: `keep A=35 B=13 W=22`, run `050-032-clipair-20261003`, CLI 54 |
| 037 Pi transport | Done | Review: no defect; the scorer calls Pi and the CLI itself and never the transport, so its paired run is its re-measure. Suites `node --test .skilled/skills/cli-classifier/benchmark/pi-transport/tests/` 46 and `node --test .skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs` 37. `verdict pi-transport: keep-cli K=111 M=103 A=97 coverage=92.8 agreement=94.2 median_abs_dp=0.0100 p95_ms=310/426 cost_per_100=0.0000`, run `050-037-paired-20261003`, Pi 309 choice calls plus 1 model check, CLI 309 choice calls plus 1 auth. The last run read `adopt A=98 agreement=95.1` (`049-009-paired-20261003`). Escalation at margin 0.10: 98.1% (101/103) in both runs. See the finding below |
| 017 search narrowing | Done | Review: no defect; DeepSeek second opinion on the counting: no findings. Suite `npx vitest run runtime/cli/tests/score-track-narrowing.vitest.ts`: 30. `verdict jev: stop (margin) K=270 M=270 A=108 B=83 W=80 L=55 F=43 p=0.01924`, run `050-017-jev-20261003`, Pi 852, CLI 0. Two rows short of the margin (A-B 25, the margin needs 27); probability-aware slack -3.0 rows, was -7.0. Last line `stop (margin) A=106 B=82 W=80 L=56 F=48 p=0.02409` (`049-002-jev-20261003`). The row set moved by one row since then, see below. No CLI pair: `choice`, which 037 covers, and a pair costs 35 minutes |
| 035 injection screen | Done | Review: no defect; B reads the chosen baseline's flags. DeepSeek second opinion on the counting: no findings, and its recount from the call log matched both recorded lines. Suite `node --test .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs`: 50. `verdict jev: keep K=90 M=90 A=79 B=68 W=18 L=7 TP=29 FP=5 F=4 p=0.02164`, run `050-035-jev-20261003`, Pi 197, CLI 0. CLI pair: `keep K=90 M=90 A=83 B=68 W=19 L=4 TP=30 FP=2 F=2 p=0.001300`, run `050-035-clipair-20261003`, CLI 191. Primary question only; the opt-in reworded arm was not rerun |
| 025 verdict fallback | Done | Review: no defect. Suite `npx vitest run model-benchmark/tests/verdict-fallback.vitest.ts`: 41. `verdict jev: keep K=24 M=24 A=24 B=8 W=16 L=0 F=na p_win=0.00001526 p_loss=1.000`, run `050-025-jev-20261003`, Pi 24, CLI 0. Same line as `049-006-jev-20261003`. `choice`, so 037's choice agreement covers the route |
| 024 hallucination grader | Done | Review: no defect. Suite `npx vitest run model-benchmark/tests/d4-agreement.vitest.ts`: 37. `verdict jev: keep K=56 M=56 A=54 B=47 W=8 L=1 F=2 p_win=0.01953 p_loss=0.9980`, `verdict cascade: keep K=56 M=56 A=55 B=47 W=8 L=0 F=1 p_win=0.003906 p_loss=1.000`, run `050-024-jev-20261003`, Pi 258 (168 jev, 90 cascade), CLI 0. CLI pair: jev `keep A=55 B=47 W=9 L=1 F=1`, cascade `keep A=56 B=47 W=9 L=0 F=0`, run `050-024-clipair-20261003`, CLI 258 |
| 026 completion claims | Done, not re-measured | Review: no defect. Suite `npx vitest run tests/completion-claim-audit.vitest.ts`: 34. No verdict line: `jev arm skipped: no headroom`. 049's shipped detector is the scorer's baseline and is right on 101 of 110 (0.918), so A would need 112 of 110 to clear the margin. Run `050-026-jev-20261003` holds the report only, Pi 0, CLI 0. The 047 line `stop (margin) A=102 B=93` was read against the old detector |
| 029 P0 reread order | Done | Review: no defect; the printed `10*F <= C` matches the spec's C = 3M. Suite `npx vitest run tests/unit/score-severity-replay.vitest.ts`: 29. `verdict jev: stop (margin) K=95 M=95 A=73 B=73 W=7 L=7 F=7 p=0.6047`, run `050-029-jev-20261003`, Pi 380 (285 severity, 95 funnel), CLI 0. CLI pair: `stop (margin) A=76 B=73 W=7 L=4 F=6 p=0.2744`, the same line as `029-jev-20261001`, run `050-029-clipair-20261003`, CLI 380 |
| 031 debug next check | Done | Review: no defect. Suite `npx vitest run tests/debug-next-check.vitest.ts --testTimeout 60000`: 28. `verdict jev: stop (margin) K=36 M=36 A=26 B=29 W=6 L=9 F=9 p=0.8491 baseline=read_code`, run `050-031-jev-20261003`, Pi 108, CLI 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Amendment, 032 aggregation (2026-10-03, logged before the re-measure) | The Jev arm scored B with identifier overlap on every row, while REQ-005 makes B the count of the comparator that won the baseline, flag-nothing on a tie. When flag-nothing wins, B is understated and W overstated, which leans toward keep. The fix scores B with the winning comparator. On the frozen labels identifier overlap wins (13 vs 9), so the line should not move. Old verdict kept on record: `verdict jev: keep K=40 M=40 A=35 B=13 W=22 L=0 TP=26 FP=0 F=0 p=2.384e-7`, run `049-003-jev-20261003` |
| 032 fix checks | The new test failed on the unfixed scorer with `B: 0, W: 2` against the expected `B: 2, W: 0`, then passed. Its second case catches a fix that always uses flag-nothing. Luna read-only review: no findings, every citation resolved; its sandbox could not run the test (EPERM), so the session ran it. The re-measure kept B=13 as predicted |
| Finding: 037's adopt did not reproduce | The repeat reads `keep-cli` on agreement, 97 of 103 (94.2%) against the 95% bar, where 049 read 98 of 103 (95.1%). Four rows disagree in both runs; the others that flip are near-ties with a Pi margin of 0.00 to 0.09. Pooled over both runs agreement is 195 of 206 (94.7%). Margin-gated escalation held at 98.1% in both. Not a scorer defect: the bar sits inside run-to-run noise. Whether Pi stays the default, or serves only above a margin, is the operator's call |
| Finding: Pi frames noul state differently (P2, transport, out of scope) | `jev-transport.mjs` `classifierContextFor` sends Pi `state: { request: <text> }`, while the CLI sends `"state": "<text>"` unless `--json-state` is set (`jev_cli/__init__.py:193-200, 369`). Pi's noul gaps have wider tails than the CLI's own run-to-run gaps (p90 0.08 vs 0.03). On 035 the Pi line has 4 fewer right rows and 3 more false flags than the same-hour CLI line; the verdict stays keep. The framing is the likely cause, not confirmed |
| Finding: 026 has no headroom | 049 made the shipped detector the scorer's baseline. On the 047 rows it is right on 101 of 110, so no Jev column can clear a 10-point margin and the gate stops before any call |
| P2: model name and requalify on Pi records | Every Pi verdict line reads `model=jev-1.13.0`, the CLI auth probe's name, while Pi answered with `typesafe/jev-latest`. A switch between routes therefore never prints `requalify`. Known from 001, seen in all eight scorers |
| P2: 025 usage on the Pi route | Pi's payload carries no usage, so 025 reports 0 tokens on 24 calls without usage, against 13,308 tokens over the CLI in `049-006-jev-20261003`. The scorer labels the gap |
| P2: 017 row set cannot be pinned on a live run | Rows come from the live tree and `--replay` cannot combine with `--jev`. Since 049, `002-cli-jev-hub-migration/003-decouple-and-rewire` left the cli-jev rows and `050-pi-default-review` entered, and B moved 82 to 83. DeepSeek also noted that the per-track table's `measured` skips unstable rows while the column's M counts them |
| P2: 035 spec wording | DeepSeek: the 035 spec's "3 minus the count of its most common flag" predates 049's two-call protocol; the code follows the "non-modal flags" clause, which reproduces both recorded lines. A spec edit, outside this phase's write scope |
| Not run | 035's opt-in reworded arm was not rerun; 017 has no CLI pair. 026's noul agreement could not be measured because its gate makes no call |
| A Claude reviewer | Named by the operator and allowed by 003 D5 as amended for this phase |
| Open decision for the operator | 037 read keep-cli on the repeat. Keep Pi as the default, or serve Pi only when its top answer leads by 0.10 |
<!-- /ANCHOR:log -->
