# Iteration 10: grok-10: If only one phase ships

## Focus

Question H. One new phase, the result that stops Deem, the result that stops Jev's remaining arms, and the disagreement with swe-01.

## Sibling check

- Own iterations 1–9, including the claim table in `iteration-009.md`.
- `research/lineages/deepseek/iterations/iteration-003.md` (iteration 3, newest). Their hand-off says a classifier advisory must not be read as a gate, and the closure gate stays the acceptance-criteria check. Agree. No order contest: they did not propose a Deem phase.
- `research/lineages/swe/iterations/iteration-001.md` (iteration 1, newest). N-swe-01-1 is build-now for a stdlib client. Disagree. Evidence below.
- `research/lineages/mimo/iterations/`: no iteration file.
- `research/lineages/glm/iterations/`: no iteration file.

`steer.md` was read.

## Findings

### The one phase

If only one new phase ships, it is not a judgment arm and it is not a new client.

D3 says the 0.8B bf16 server is what gets built, and nothing else (`specs/cli-jev/003-cli-jev-workflow-integration/goal.md:51`). D2 says a new hub holds `cli-jev` and `cli-deem`, and the research decides `cli-deem`'s shape (`goal.md:50`). This lineage's shape is route (c): a small client that posts Deem's body and does not shell `jev`. That shape is a decision, not a phase that ships while the caller count is zero.

The phase that can ship without a model is the zero-call census BASE2 already marked build-now for R19 (`specs/cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion/research/research.md:236-249`, quoted from iteration 4). It counts tokens and fit. It does not call Jev or Deem. R1's arm stays gated on its four keep conditions, including aggregate flip at most 0.10 (`B2:233`), which has not been run.

Counts this lineage actually has: 0 runtime Deem callers in the `.skilled` search in iteration 7; 0 labels (`P/context/deem-local.md:52`); 1 served model, which D3 already covers; 15 calibration files, none naming the served id (iteration 1). A judgment phase has no baseline to beat.

### What stops Deem, what stops Jev

Stop Deem's judgment arms entirely when N-grok-08-2 prints a flip above 0.10 on one fixed choice, or the `deem-ctl status` commit pair changes between the three calls. Also stop them when a later labeled set on this repo lands far below the 0.8B card's 96.3%, which is a vendor figure from a different runtime (iteration 9). LOCAL's p50 does not stop or start them.

Stop Jev's remaining arms when R1's keep rule prints kill: flip above 0.10, or the sign test fails, or the arm does not beat the comparators (`B2:233`). A Deem outage does not stop those arms. A Jev auth failure does not stop a Deem arm. With neither, behavior stays today's (`goal.md:49`).

### Disagreement

swe-01 marks the stdlib client build-now. This lineage marks the same shape later (N-grok-07-1). The evidence is D3's "nothing else is built" (`goal.md:51`), the zero-caller search, and the fact that a client without a caller does not cut context. Their LOC estimate is theirs. The packaging agreement stands. The timing does not.

D2's "derive cli-deem from cli-jev" (`goal.md:50`) conflicts with a client that does not shell `jev`, if "derive" means wrap the binary. The same sentence says the research decides the shape. This lineage uses that clause: derive the printed contract and the exit numbers, not the HTTP call. Named here so a later author does not treat it as silent.

deepseek-03's "advisory is not a gate" matches this order. A census line can print `kill`. A classifier line cannot close a packet.

### What the operator decides

Before any judgment arm: whether a non-thresholding client is allowed on top of D3. That is an amendment, not a default. Before any threshold: a calibration file that names the served commit, and a stored commit pair. Neither is true now (iterations 1 and 7).

### Idea N-grok-10-1

- **Idea:** `N-grok-10-1`. Ship no new classifier phase. The order is the line below.
- **Question:** H
- **Builds on:** `goal.md:49-51`. Iterations 7 and 9. `B2:233` and `B2:236-249` as quoted in iteration 4.
- **Value:** keeps D3 intact.
- **Seam:** none new.
- **Metric, baseline, harness:** caller count 0 in the iteration 7 search; label count 0. Harness: not a new script.
- **Savings:** unmeasured. The saving is not adding a phase.
- **Cost, latency, privacy:** none added.
- **Two-backend gate:** no new switch. With neither backend, today's path.
- **Rough LOC:** 0 for this decision.
- **Verdict:** drop, as a build. The order is the finding.
- **Confidence:** confirmed for D3 and D2 text opened this iteration. The census verdict is quoted from iteration 4's reading of BASE2.
- **Kill criterion:** a runtime caller of Deem appears, or the operator amends D3 to allow the client. Either reopens N-grok-07-1. It still does not reopen a threshold.

### The order in one line

Zero-call census first; no new client unless D3 is amended; one-question flip next and only on a pinned commit; no judgment arm until that flip is at most 0.10; Jev arms stay on their existing kill rules.

## Sources Consulted

- `specs/cli-jev/003-cli-jev-workflow-integration/goal.md:47-55`
- Own iterations 1–9
- `research/lineages/swe/iterations/iteration-001.md` (N-swe-01-1, from iteration 7's reading)
- `research/lineages/deepseek/iterations/iteration-003.md` hand-off
- `B2:233`, `B2:236-249` as already cited in iteration 4
- `steer.md`

## Assessment

newInfoRatio: 0.60

Novelty: the order, the named D2 tension, and the refusal of swe-01's timing.

Confidence: confirmed for the goal lines. The sibling verdict is from their file as read in iteration 7 and not rewritten here.

Convergence telemetry: last three 0.80, 0.60, 0.60. Mean 0.67, above 0.05. Stop policy is max-iterations. This is iteration 10.

## Reflection

What worked: reading D3 before picking a phase.

What failed: mimo and glm still have no iteration file, so their orders are unknown.

Ruled out: shipping the client as the one phase. Ruled out: a judgment arm on the 96.3% card figure.

## Recommended Next Focus

Synthesis. stopReason maxIterationsReached.

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| The one phase is no new classifier phase | new as an order | `goal.md:51`, caller count from iteration 7 |
| D2's shape clause allows a client that does not shell jev | new, named tension | `goal.md:50` |
| swe-01 timing is not adopted | disagreement | their iteration 1 vs D3 |

## Hand-off

- Synthesis: survivors stay later or drop. No build-now in this lineage.
- The order line above is the one to carry.
- Do not inherit N-grok-06-1's premise or N-grok-05-1's byte savings as confirmed.
