---
title: Deep Research Strategy - Jev fetched-text injection screen (deepseek lineage)
description: Runtime strategy file for the deepseek lineage of the injection-screen improvement research.
trigger_phrases:
  - "injection screen research strategy"
  - "deepseek lineage strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Jev Fetched-Text Injection Screen

Detached fan-out lineage `deepseek` of packet
`048-jev-feature-improvement-research/004-injection-screen-research`.
Executor: `cli-pi`, model `deepseek-v4.1-flash`, reasoning max. Stop policy: `max-iterations`.

## 1. TOPIC

Improve, refine and expand the Jev fetched-text injection screen (cli-jev feature 035), whose scorer is
`.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs`. The screen
measures text agents fetch with `WebFetch` or `WebSearch`, which nothing screens today. Its comparator
is a four-pattern lexical screen. Measured result: `verdict jev: keep K=90 M=90 A=81 B=56 W=30 L=5
TP=31 FP=5 F=0 p=0.00001118`, Brier `0.0652`, over 60 natural rows plus 30 planted injection
sentences; the lexical screen caught 1 of 30 planted sentences.

Five questions, one per iteration:

1. What drove the measured result?
2. How can the screen's accuracy be raised or its cost lowered?
3. How can the measurement be made more trustworthy?
4. Where else in `.skilled` would the same judgment pay off?
5. What would a default-on integration need, and at what cost and risk?

## 2. NON-GOALS

- Changing the scorer, the labels, the planted sentences or any live workflow. This phase researches only.
- Re-measuring feature 035 with live Jev calls. The measurement owner is phase 047 / feature 035; this
  research reads their recorded artifacts.
- Deciding whether to wire a screen. The seam is an open question in feature 035; this research can only
  rank what a default-on integration would need, cost and risk.

## 3. STOP CONDITIONS

- `max-iterations` reached: this lineage runs exactly 5 iterations; convergence before that is telemetry only.
- No nested executor dispatch, no writes outside the lineage directory.

<!-- ANCHOR:key-questions -->
## 4. KEY QUESTIONS (remaining)

- [x] Q1 - What drove the measured result K=90 M=90 A=81 B=56 W=30 L=5 TP=31 FP=5 F=0 p=0.00001118?
- [x] Q2 - How can the screen's accuracy be raised or its cost lowered?
- [x] Q3 - How can the measurement be made more trustworthy?
- [x] Q4 - Where else in `.skilled` would the same judgment pay off?
- [x] Q5 - What would a default-on integration need, and at what cost and risk?
<!-- /ANCHOR:key-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:answered-questions -->
## 5. ANSWERED QUESTIONS

- Q1 (iteration 1): the keep is a 25-row margin over a baseline right on 56; 27 of the 30 Jev-only
  wins are planted rows; errors cluster within 0.15 of the flag line; Brier is error mass.
- Q2 (iteration 2): threshold 0.6 gives A=84 and precision 0.968 on the recorded calls; a
  confirm-then-verify protocol cuts 33% of calls with identical flags; comparator extensions catch
  9 of 30 planted versus 1 today.
- Q3 (iteration 3): labels are documented operator-delegated model reads with blind drafting and
  spot-checks; the corpus is untracked at HEAD; label hashes, comparator Brier and census
  provenance are the cheap trust gaps.
- Q4 (iteration 4): fetch is real and unscreened; Bash output has an existing PostToolUse seam; MCP
  responses, `sk_vision_ocr` text and child stdout follow; the `noul` pattern already pays in 047.
- Q5 (iteration 5): seam is a PostToolUse fetch matcher with UNKNOWN blocking capability; measured
  tiers 0.25/0.5/0.75 = 33+7, 31+5, 26+0; p50 324 ms per call; three silent skips; staged plan.
<!-- /ANCHOR:answered-questions -->

---

<!-- ANCHOR:what-worked -->
## 6. WHAT WORKED

- Joining `calls.jsonl` to `labels.jsonl` and recomputing the scorer's own decision functions turned
  the recorded run into a free experimental surface (iterations 1-2).
- Reading the label decisions log against the call log explained the anomaly row `r50` as the
  arbiter's close call rather than a model failure (iteration 3).
- Reading the settings matchers beside the fetch census turned "no seam" into "two adjacent seams"
  (iteration 4).
- The zero-call scorer re-run reproduced the baseline and exposed the empty corpus census (iterations
  1 and 3).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 7. WHAT FAILED

- `calls.jsonl` records no payload size or token count, so per-row token cost cannot be attributed.
- The live report keeps no per-row text, so error characterization needs section reads at the pinned
  commit.
- The hook capability question cannot be closed from the repository alone.
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 8. EXHAUSTED APPROACHES (do not retry)

- Same-question re-asks in the review band: reruns already agree within rows (iteration 2).
- Reading `F=0` as stability: the metric is structurally blind to spread (iteration 1).
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 9. RULED OUT DIRECTIONS

- Threshold tuning as a free win: it is a spec amendment and costs one true positive (iteration 2,
  evidence: `calls.jsonl` sweep).
- Delegated labels as unexamined risk: the arbitration is documented (iteration 3, evidence:
  `035-decisions.md`, `decision-record.md:69,104-111`).
- Default-on blocking at the decision line: FP noise plus unknown hook capability (iteration 5).
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 9A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none recorded
- Pivot lineage: none
- Remaining frontier: untested proposals R6-R8 and the UNKNOWN hook capability
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 10. CARRIED-FORWARD OPEN QUESTIONS

- Can a PostToolUse hook for `WebFetch`/`WebSearch` warn before the agent acts, or withhold output?
- Is fetched text ever the operator's private text?
- Do the 0.6 threshold and the early-exit protocol hold on a fresh run?
- Does a reworded instruction cut the agent-topic false positives without losing natural positives?
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Synthesis complete. The merged `research.md` and `findings-registry.json` are written in this
lineage directory. No further iteration is planned under `max-iterations`.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT

- Scorer: `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs`
  (1424 lines). Frozen constants at `:44-60`: 60 natural + 30 planted rows, lexical patterns
  `ignore (all )?(previous|prior) instructions | system prompt | exfiltrat | hidden marker` at `:48`,
  the `noul` instruction at `:52`, `FLAG_AT 0.5 / REVIEW_AT 0.25 / BLOCK_AT 0.75` at `:53-55`,
  `JEV_RERUNS 3` at `:56`, the keep rule at `:59`.
- Verdict arithmetic: `decideVerdict` `:754-762`; sign test `:709-720`; column summary `:791-831`;
  row build and hash check `:607-632`; baseline choice `:642-662`; headroom `:687-691`.
- Recorded live run: `~/.skilled/.labels/runs/035-jev-20261001/report.json` and `calls.jsonl`
  (271 lines, 270 scored calls), outside the repository. Report: `K=90 M=90 A=81 B=56 W=30 L=5
  TP=31 FP=5 F=0 p=0.00001118 brier=0.06522876543209875`, flags at 0.25/0.50/0.75 = 40/36/26,
  latency p50 324 ms / p95 388 ms, model `jev-1.13.0`, provider `official`.
- Labels: `.skilled/skills/cli-classifier/benchmark/injection-screen/labels.jsonl` (90 rows, 60
  natural, 30 planted; 55 clean + 5 natural `instructs`; labeler `operator-delegated:opus-5.5-medium`
  on natural rows) and `planted.jsonl` (30 sentences). Draw seed `20260929`, at commit `6aa7ca09`.
- Feature 035 docs: `specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/`
  (spec keep rule, goal log live-run row, implementation summary), plus the cli-classifier
  measurement docs and `042-label-drafting-and-confirmation/scratch/evidence/card-035.md`.
- Corpus fragility: the vendored `context/` tree is untracked at HEAD (`corpus census: files=0`),
  removed by `b0f89ee5f07` ("stop tracking vendored packet context"); the labels still read their
  sections at commit `6aa7ca09`, which exists.
- Fetch surface: zero-call census today prints `state_files=486 records=6661 with_tools_used=835
  naming_webfetch=82 naming_websearch=61 files_with_either=31 unparsed_lines=5`, `agent_files=12
  granting_webfetch_or_websearch=2`. `.claude/settings.json` has no `WebFetch`/`WebSearch` matcher;
  no tracked hook file names either tool.
- Write boundary: everything this lineage produces stays in
  `.../004-injection-screen-research/research/lineages/deepseek/`.

## 13. RESEARCH BOUNDARIES

- Max iterations: 5. Convergence threshold: 0.05 (telemetry only under `max-iterations`).
- Per-iteration budget: up to 12 tool calls, inline execution.
- Progressive synthesis: true. Canonical output: `research.md` in this lineage directory.
- Machine-owned sections in this file are maintained by this lineage's own writes; no external reducer
  runs inside the lineage.
