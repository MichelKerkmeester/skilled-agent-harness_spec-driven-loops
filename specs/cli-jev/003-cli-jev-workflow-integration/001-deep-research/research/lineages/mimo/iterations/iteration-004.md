# Iteration 4 — mimo-04: Deep-loop stop and convergence, iterations saved

**Lineage:** `mimo` (UX and measurement lens) — wave 2 begins
**Session:** `fanout-mimo-1790438758756-5mso8j`
**Focus Area:** `mimo-04` — Deep-loop stop and convergence, iterations saved
**Angle question:** Would a Jev stop signal save iterations at equal cited-finding count, and how would a replay over archived lineages measure it?

## Sibling check (wave 2 onward)

Read the newest sibling iterations: `deepseek/iterations/iteration-009.md` (failure-mode table; its row D carries this seam from its iteration 4) and `grok/iterations/iteration-010.md` (one-slice ranking and kill radius). Also opened the sibling angle files `deepseek/iterations/iteration-004.md` and `grok/iterations/iteration-004.md` because they are this angle's direct counterparts. DeepSeek wires a Jev novelty second rater beside `buildNoveltyCorroboration` (`convergence.cjs:506-549`, its citation) and makes the replay the first slice. Grok drops any Jev field the STOP decision reads, on the one-model and non-counting grounds, with a kill criterion. I do not restate either. What I add is the measurement design neither wrote down: the corpus is already on disk, the gold marker is computable from deltas alone, and the baseline to beat is the heuristic's own replayed trade curve, not the recorded stop.

## Corpus facts opened this iteration

- 181 archived lineages under `specs/**/research/lineages/` carry `deltas/iter-*.jsonl` (counted by find this iteration), so cited findings are machine-readable without opening iteration prose.
- Sampled state record fields (`specs/mcp-tooling/z_archive/010-mcp-mobbin/001-research/research/lineages/luna/deep-research-state.jsonl`): `newInfoRatio`, `findingsCount`, `sourceDiversity`, `ruledOut`, `status`, `focus` all present per iteration. A replay can run from state logs plus deltas alone.
- The stop model: three weighted signals (rolling average 0.30, MAD noise floor 0.35, question entropy 0.85 coverage 0.35) nominate STOP (`.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence-signals.md:41-47`, opened).
- The current run itself is forced depth: `stopPolicy max-iterations`, `convergenceMode off`, so convergence is telemetry only (this lineage's config). Many archived runs are the same shape, which is why the gold cannot be "where the run stopped".

## Per-idea records

### Idea 1: The stop replay harness (measurement slice)

| Field | Record |
|---|---|
| **Idea** | A read-only replay over the archived lineages: for each lineage, compute the derived gold stop (the last iteration whose delta adds a first-appearance cited finding), then compare three stops — the recorded stop, the heuristic stop (three weighted signals replayed over recorded `newInfoRatio` values), and the Jev stop (one `jev noul` per evidence iteration: "does this iteration's material go beyond what came before"). Report the trade curve: iterations saved versus first-appearance sources lost. |
| **Value** | The go/no-go number for any stop feature, and the first thing in this whole research that measures the current heuristic itself. The operator's decision it eventually touches: whether to let a loop keep spending iterations. Today that decision rests on signals with no recorded accuracy (H11 baseline: "None as an accuracy number. No gold says when a loop should have stopped", measurement digest H11). |
| **Seam** | Offline; the seam is the measurement gap itself (measurement digest §3: "A replay script over archived lineages that marks the last iteration adding a new cited finding, then compares recorded, heuristic and Jev stops"). Inputs: `deep-research-state.jsonl` and `deltas/iter-*.jsonl` per lineage (shapes confirmed this iteration). |
| **Metric, baseline, harness** | Metric: (iterations saved, first-appearance sources lost) per lineage for each of the three stop rules, plus the share of lineages where the rule saves at least one iteration at zero loss. Baseline: the heuristic's replayed curve — that is the number to beat, not the recorded stop, because forced-depth runs stopped where the config said. The derived gold is the "last iteration adding a new cited finding" marker, itself a named gap ("That comparison point is itself a gap", measurement digest H11); this harness fills that gap as its first output. Harness: H11 replay, per the gaps table. |
| **Cost, latency, privacy** | Replay is local and free except the Jev arm: one billed `jev noul` per evidence iteration. A 25-lineage sample at 5 to 10 iterations is 125 to 250 calls, cents at vendor-claimed prices (vendor claim, jev-material digest §2). Privacy: archived iteration findings are repository internals and leave the machine on Jev-arm calls; the replay must strip secrets and announce egress (cli-usage state-forwarding rule, seam-map). The heuristic arm sends nothing. |
| **Opt-in and no key** | The replay is a script; its Jev arm is a flag. No key: the two local arms still run and the report says the Jev column is skipped. Nothing is served to any loop. |
| **Complexity** | Roughly 150-250 lines, one script plus a small report writer; touches no shared contract, reads only archives. The corpus filter is part of the script: state log parseable, deltas present, at least three evidence iterations. |
| **Verdict** | **build-now, second slice.** The gold is free from existing deltas, the corpus is 181 lineages deep, and every later stop idea is unrankable without this number. It follows the routing arm only because that arm is smaller and its gold is human-labeled rather than derived. |
| **Confidence** | Confirmed from code and disk: corpus size, record fields, signal weights. Inferred: that the derived gold tracks real exhaustion ("no new cited finding" can miss novelty recorded only in prose). What would confirm: a manual read of 5 replayed lineages checking the derived marker against the iteration files. |

### Idea 2: A stop suggestion the operator sees (confirm-mode and report surface)

| Field | Record |
|---|---|
| **Idea** | If Idea 1 shows a real trade improvement, surface it where the operator already decides: the confirm-mode continuation question ("this loop has added no new cited finding in two iterations; stopping saves N") and one line in the convergence report. Never auto-stop. |
| **Value** | This is the only stop-shaped idea that changes something the operator does: in `:confirm` runs they answer a continuation decision per iteration, and an exhausted-loop signal pre-answers the easy ones. In `:auto` runs the value is a shorter report line and nothing else until a promotion is measured. |
| **Seam** | The convergence report and the confirm prompt are workflow-owned surfaces (deep-research SKILL lifecycle, no single file:line opened this iteration; the reducer's flatline warning at `reduce-state.cjs:965-985` is the digest's citation for where loop-health language already surfaces). |
| **Metric, baseline, harness** | Same replay number as Idea 1, plus one UX check: on replayed lineages, how often would the suggestion have been shown and would it have been right (precision of "no new cited finding ahead"). Baseline: today's confirm prompt carries no such signal at all. |
| **Cost, latency, privacy** | Zero additional calls: it reads the replay-calibrated heuristic or a cached shadow result. |
| **Opt-in and no key** | Advisory text only; no key means no suggestion line, today's prompt exactly. |
| **Complexity** | Small once Idea 1 exists; the wording lives in the command workflow, whose contract owner is the deep-research workflow, so it needs the named-owner check before it is built. |
| **Verdict** | **next,** gated on Idea 1's curve showing precision high enough that the suggestion is right more often than it is noise. |
| **Confidence** | Inferred from the loop's mode contract; the confirm-mode wording is not opened this iteration. |

### Idea 3: A Jev novelty second-rater field in state and dashboard

| Field | Record |
|---|---|
| **Idea** | Record a Jev novelty `score` beside the agent's `newInfoRatio` self-report (DeepSeek 4.1's wiring, its citation `convergence.cjs:506-549`), visible in the dashboard as a second novelty column. |
| **Value** | Trust calibration when the self-report is inert: the reducer already warns that a flat 0.9 self-report makes convergence claims untrustworthy (measurement digest H11). But as an operator surface, a second novelty column is a report number to parse unless the replay shows the disagreements change a decision. |
| **Seam** | `stopping-clock-shadow.ts:10-19` shadow-pairing shape (DeepSeek's and Grok's citation; authority stays `legacy-convergence`). |
| **Metric, baseline, harness** | Agreement between Jev novelty and the derived gold marker per iteration; baseline is the self-report's own agreement, which is also unmeasured. |
| **Cost, latency, privacy** | One billed call per evidence iteration in live loops if ever run live; the offline replay covers the question without that. Findings text leaves the machine per call. |
| **Opt-in and no key** | Field absent unless opted in; no key means the column does not exist, not a blank or a zero. |
| **Complexity** | 60-100 lines plus a reducer field; touches the state record shape, a shared contract with the runner's validators (this very lineage's iteration records show the route-proof field set the runner reads). |
| **Verdict** | **later.** It adds a report surface first and a decision surface never; measure the disagreement in the replay before spending a schema field on it. |
| **Confidence** | Inferred UX reading plus the sibling wiring claims. |

### Idea 4: Jev input to the STOP decision itself

| Field | Record |
|---|---|
| **Idea** | Let a Jev judgment allow or block STOP (Grok 4's target). |
| **Value** | Fewer iterations only if the judgment is right, and wrong authority costs findings silently. |
| **Seam** | `convergence.cjs:481` ("STOP is allowed pending newInfoRatio agreement", Grok's citation) and the frozen shadow slot at `stopping-clock-shadow.ts:16`. |
| **Metric, baseline, harness** | Unmeasurable after authority is granted, which is the problem. |
| **Cost, latency, privacy** | As Idea 3 plus silent-misstop risk. |
| **Opt-in and no key** | No flag shape exists for authority and none should be invented (Grok's kill criterion: any path where a Jev field is read by the STOP decision). |
| **Complexity** | Small code, wrong layer: the whole loop mode set inherits the new authority. |
| **Verdict** | **drop.** It serves a judgment before it is measured and hands one numeric lens authority the repository's own rules reserve for corroboration (repo-rules-digest §2 item 9). |
| **Confidence** | Doctrine-level; Grok's one-lens argument (its iteration 4) and this lens's serve-after-measure rule agree, which is a cross-lens conclusion, not one model twice. |

## Ruled out this iteration

- Using the recorded stop of each archived run as gold: forced-depth runs (`stopPolicy max-iterations`) stopped where the config said, including this lineage's own config, so the recorded stop measures policy, not exhaustion.
- Sampling lineages without deltas: finding rows live in `deltas/iter-*.jsonl` (the fan-out runner counts exactly these, `fanout-run.cjs:853-870` family), so a lineage without them cannot yield a cited-finding gold and is excluded by the corpus filter.

## Hand-off

- The replay design to carry forward: corpus filter (parseable state log, deltas present, at least three evidence iterations), derived gold (last first-appearance cited source in deltas), three arms (recorded, heuristic replayed, Jev per-iteration novelty), metric (iterations saved at zero first-appearance loss, plus the trade curve), sample 25 lineages stratified by iteration count for the Jev arm and all 181 for the local arms.
- The baseline to beat is the heuristic's replayed curve. Nobody has measured the current stop model; if it already stops at the derived gold, every Jev stop idea dies and the report should say so.
- What the operator sees differently: in confirm mode, an evidence-backed suggestion on exhausted loops; in auto mode, nothing until promotion. If a stop ever loses a first-appearance source, the operator's cost is re-running or extending the loop, which is the repeated-work failure the zero-loss constraint guards.
- For mimo-05: the derived-gold technique (first-appearance in deltas) is reusable for finding triage gold if archived deep-review folders carry final adjudicated severities next to original calls.
- Carried from iteration 3: one labeled transcript set may serve both the goal verifier and the S09 done gate; mimo-06 decides.
