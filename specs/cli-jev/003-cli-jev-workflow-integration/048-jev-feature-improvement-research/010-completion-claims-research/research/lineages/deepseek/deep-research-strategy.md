# Deep Research Strategy - Jev completion-claim audit (feature 026)

## 1. OVERVIEW

Lineage `deepseek` of the 010-completion-claims-research fan-out. Stop policy max-iterations (5) reached; convergence before the cap stayed telemetry only. Executor: cli-pi deepseek-v4.1-flash, reasoning max. Write surface: this lineage directory only. Synthesis: `research.md`.

---

## 2. TOPIC

Improve, refine and expand the Jev completion-claim audit (cli-jev feature 026). Its scorer is `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` in system-spec-kit, and it measures the completion sentinel's detectCompletionClaim regex, which decides whether an agent's last 400 characters claim the work is done. Measured result: verdict jev: stop (margin) K=110 M=110 A=102 B=93 W=13 L=4 F=0 p_win=0.02452. Real data: 50 Pi turns and 60 Claude turns. The win is significant but its 0.08 gain falls under the 0.10 margin. The regex missed all 10 labeled claims. Five questions: what drove the result, accuracy/cost levers, measurement trustworthiness, where else the judgment pays off, and default-on integration cost/risk.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

None. All five answered in `research.md`.
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- No scorer, sentinel, hook or validator change (report only; implementation is a separate follow-up).
- No live model calls, no `jev` invocation, no network egress.
- No writes outside this lineage directory. (Honored.)

---

## 5. STOP CONDITIONS

- Max iterations (5) reached. (Reached.)
- Contradiction between the 047 row and a local reproduction. (None found; counts reproduced exactly.)
- Write-surface breach. (None.)

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- [x] Q1 What drove the measured result? The gate has 0/10 recall and 0/7 precision (vocabulary missing; context-blind); margin failed by two net wins; a miss skips the whole evidence path. (iteration 1)
- [x] Q2 How to raise accuracy or lower cost? Closing-anchor + vocabulary are free accuracy; threshold 0.7 flips keep on the same calls (post-hoc); reruns unearned (F=0); 331 calls / ~1s per claimed turn measured. (iteration 2)
- [x] Q3 How to make the measurement trustworthy? Strong replay; weak positives (one runtime), arbiter labels without provenance, unpinned extraction, post-hoc tunables, no held-out canary, cost outside the rule. (iteration 3)
- [x] Q4 Where else does the judgment pay off? Five wired surfaces from one core; Cursor unwired; spec-folder resolution un-scored; spec-gate classify next; run-scope twin exists; template already replicated. (iteration 4)
- [x] Q5 What does default-on need? Role decision, per-surface latency budgets, identity pinning + requalify, privacy consent + stripping, cost model with cache, pre-registered held-out keep with cost in the rule, fail-open/advisory/kill-switch inheritance. (iteration 5)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reproducing the scorer locally with its own exported functions and the census command: exact counts, zero calls, zero writes (iterations 1-2).
- Replaying the recorded `calls.jsonl` for threshold and per-row analyses instead of re-judging (iterations 2-3).
- Reading label provenance from 042's own ADR/spec instead of inferring from the label file (iteration 3).
- Following the sentinel's import graph to all five wiring files to get real timeout/async values (iterations 4-5).
- Combining packet docs (042/047) with the run artifacts: provenance plus arithmetic.
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Broad vocabulary expansion alone: precision collapses (TP 9/10, FP 18) (iteration 2).
- Searching for a corpus extractor to pin corpus-vs-hook input: none exists; recorded as a gap (iteration 3).
- Assuming every adapter is wired: Cursor's is not (iteration 4).
- Per-row batching assumptions: `jev run` is one state with many questions (iteration 2).
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
- Live judging inside this lineage: out of scope (no model calls, no network), and the recorded calls replay fully.
- Deriving label intent from the label file alone: provenance lives in 042; the file has two keys.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Default-on judge as the primary gate now: 047 is stop (margin); the 0.7 keep is post-hoc at exact equality.
- Vocabulary-only fixes without context rules: measured precision loss.
- Carrying the scorer's 90s timeout into hooks: budgets are 10s / host-blocking.
- Batching rows through `jev run`: not supported by the request shape.
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none
- Pivot lineage: none
- Remaining frontier: held-out corpus run; production hook-payload capture; spec-gate volume measurement
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- What is the production Stop frequency per runtime (for the cost model)?
- Do hook payloads match the corpus `raw_text` extraction?
- What is the spec-folder resolution error rate on the same corpus?
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Implementation follow-up (outside this loop): R1-R3 (free gate fixes + pre-registered threshold) then R4-R6 (corpus, cost rule, sibling scorers), with R7 wiring and R8 last. See `research.md` section 3.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- Detector: the ten-word pattern at sentinel:64; 400-char trimmed tail at :113-119; gate-only role at :489-499.
- Margin rule: 10*(A-B) >= M (scorer:480-489); measured A-B=9 vs 11 needed.
- Corpus: 110 real turns (50 Pi from 042 + 60 Claude drawn in 047), 10 yes all Claude; labels sha256 601bf1e7a5da7e70dbfbe25a95712ddf6b1d598e366392ce9eca0c0cec06c7a0.
- Recorded run: report.json rowsSha256 9f558fed4d43d1528340b8d06348a04194b0b56713e443f2230bc7c9c3f50619; 331 calls all measured; p50 320 ms p95 391 ms; jev 0.6.2 / model jev-1.13.0 / provider official.
- resource-map.md not present in the target spec folder; coverage gate skipped; this lineage emits its own `resource-map.md`.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5 (reached); convergence threshold 0.05
- Per-iteration budget: kept at 8-12 tool calls, under 10 minutes each
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output (this lineage)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Current generation: 1
- Started: 2026-10-03T01:02:30Z; completed: 2026-10-03T01:52:00Z
