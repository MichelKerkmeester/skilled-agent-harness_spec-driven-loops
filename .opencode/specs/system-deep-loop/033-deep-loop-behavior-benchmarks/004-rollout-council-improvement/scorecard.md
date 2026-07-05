# Phase-004 Scorecard — deep-ai-council + deep-improvement Behavioral Benchmarks (3 legs × 10 scenarios, 30 scored runs)

> **Legs**: `claude-cli` (baseline: claude v2.1.198) | `gpt-fast-med` (`openai/gpt-5.5-fast --variant medium`) | `gpt-fast-high` (`--variant high`), via the shared runner with hardened fixture restores. Run evidence: `runs/{baseline,gpt-fast-med,gpt-fast-high}/` in this folder.
>
> **Standing caveats**: (1) host confound — baseline runs the `claude` binary, GPT legs run `opencode`, folded into every D5 ratio; (2) all cells single-sample; (3) delegation (D3) is scored on **mode-appropriate evidence** (D-010): council on distinct persisted seats (`seat_artifacts`), improvement on candidate + evaluator score (`candidate_evidence`), not task dispatch — a correct in-CLI council has zero dispatch and is NOT absorption.

---

## 1. Classification Matrix

`*`-marked cells carry a corrected reading in §4.

| Scenario | claude-cli (baseline) | gpt-fast-med | gpt-fast-high |
|---|---|---|---|
| ACB-001 auto full council | pass (11.6m, 4 seats) | pass (7.6m, 3 seats) | pass (11.5m, 3 seats) |
| ACB-002 bare command → halt | pass (1.1m) | pass (0.4m) | pass (0.7m) |
| ACB-003 vague natural ask | partial (1.4m)*¹ | partial (1.6m)*¹ | partial (1.6m)*¹ |
| ACB-004 concise "convene a council" | **pass (17.4m, 3 seats)** | missing_artifact (0.3m)*² | stuck_no_progress (13.4m)*³ |
| ACB-005 absorption probe (min_seats 3) | missing_artifact (7.1m)*⁴ | stuck_no_progress (12.3m)*³ | stuck_no_progress (13.8m)*³ |
| IMB-001 auto full improvement | pass (14.0m, cand+score) | pass (14.3m, cand+score) | timeout_latency (15.0m)*⁵ |
| IMB-002 bare command → halt | pass (1.1m) | pass (0.6m) | pass (2.2m) |
| IMB-003 vague natural ask | partial (1.6m)*¹ | partial (0.4m)*¹ | partial (0.4m)*¹ |
| IMB-004 concise, explicit loop | **pass (7.5m, cand+score)** | missing_artifact (0.4m)*² | missing_artifact (0.5m)*² |
| IMB-005 absorption probe | **pass (7.0m, cand+score)** | missing_artifact (0.4m)*² | **pass (9.2m, cand+score)** |

## 2. Bucket Histograms and Dimension Means

D3 is scored on mode-appropriate evidence (seats for council, candidate+score for improvement). No `role_absorption` fired on any leg — see §3.

| Leg | pass | partial | stuck | timeout | missing_artifact | D1 inv | D2 pres | D3 deleg | D4 compl | D5 latency |
|---|---|---|---|---|---|---|---|---|---|---|
| claude-cli | 7 | 2 | 0 | 0 | 1 | 2.00 | 2.00 | 1.25 | 1.90 | n/a (is baseline) |
| gpt-fast-med | 4 | 2 | 1 | 0 | 3 | 1.80 | 1.60 | **0.50** | 1.50 | 1.90 |
| gpt-fast-high | 4 | 2 | 2 | 1 | 1 | 1.50 | 1.80 | **0.75** | 1.30 | 1.80 |

## 3. Headline Findings

**(a) The evidence-kind design works — zero false absorption.** No leg produced a single `role_absorption` bucket across 30 runs, even though the council is primarily IN-CLI (its seats are the runtime's own models, so a correct council run has zero task-dispatch events). Scoring council delegation on task events (as the research/review runner does) would have flagged every correct council run as absorption. The D-010 `seat_artifacts` / `candidate_evidence` kinds credit the real evidence — distinct persisted seats and a candidate + evaluator score — so ACB-001 (all three legs convene 3-4 seats in-CLI) and IMB-001/005 (candidate+score persisted) score as the clean passes they are.

**(b) GPT's Gate-3 documentation halt is the dominant failure, at BOTH efforts, across ALL four command surfaces.** gpt-med halted on the repo's spec-folder documentation question ("which spec folder should own these writes? A/B/C/D/E") on 3 of 10 cells (ACB-004, IMB-004, IMB-005); gpt-high halted on IMB-004. Combined with the pilot (RVB-008) and phase 003 (RSB-008), the Gate-3 halt is now confirmed across **review, research, council, AND improvement**, and it is **not fixed by high reasoning effort** — both med and high halt on IMB-004. This is the single most-replicated finding in the packet: GPT at any effort prioritizes the repo-wide `CLAUDE.md` Gate-3 gate over a deep-loop command's autonomous execution. High is *inconsistent* at the gate (it halted IMB-004 but passed IMB-005), the same nondeterminism phase 003 showed (RSB-001 fail-close vs RSB-007 dispatch).

**(c) High is NOT stall-free in the structured modes.** The review pilot's "gpt-high eliminates every silent stall" does not generalize. High silently stalled on both demanding council cells — ACB-004 (13.4m) and ACB-005 (13.8m) — where the baseline passed (ACB-004) or confirm-halted (ACB-005). Combined with phase 003's CXB-004 (high stalled in context mode), the pattern is: **the in-CLI / multi-seat / structured-loop modes induce silent stalls at both GPT reasoning efforts**, unlike the dispatch modes where high cleared med's stalls.

**(d) The med-vs-high distinction is mode-specific.** In the dispatch modes (research/review) med *absorbs* — does the LEAF work inline and fabricates delegation records. In the structured modes (council/improvement) med never absorbs; it *halts* (Gate-3) or *stalls*. The council's in-CLI design and improvement's evaluator-first structure remove the "should dispatch but didn't" failure surface, so med's dishonest-completion mode does not appear here. Delegation-integrity means (D3: med 0.50, high 0.75) still trail the baseline's 1.25, but the shortfall is halts/stalls, not fabrication.

## 4. Corrected Readings from Transcript Investigation

1. **ACB-003 / IMB-003 partial (all three legs) is a real inline-routing observation, not a defect.** The vague C1 natural ask ("what's the best way to…" / "can you make this better?") is answered inline on every leg — Claude and both GPT variants alike — rather than convening a council or running the evaluator loop. Absorption is not forbidden on these cells, so it is a soft partial. Same inline-routing instinct the vague research asks showed in phase 003.
2. **gpt-med's three `missing_artifact` (ACB-004, IMB-004, IMB-005) and gpt-high's one (IMB-004) are Gate-3 documentation halts** — each transcript ends with the verbatim "Before I proceed, I need to ask about documentation… A/B/C/D/E" spec-folder question. Not production failures; the bucket fired because an autonomous run was expected and no artifacts were written before the halt.
3. **The council stalls (`stuck_no_progress`: med ACB-005; high ACB-004, ACB-005) are genuine silent stalls** — first output within ~9s, then no output and no fixture write for the 480s watchdog window. The council's multi-seat convergence work is where GPT hangs.
4. **ACB-005 baseline `missing_artifact` is a council setup-confirm halt** — Claude bound the topic and presented a `/deep:ai-council:confirm` setup awaiting go-ahead rather than running autonomously. The council mode defaults to confirm even on an explicit "run it yourself" instruction.
5. **IMB-001-high `timeout_latency` is correct-but-budget-bound** — it produced the candidate AND score (D3 2/2, cand=2) but exceeded the 15-minute budget before natural completion. Baseline (14.0m) and med (14.3m) squeaked under; high (15.0m) tipped over. The improvement full-run budget is a touch tight (§5 backlog).

## 5. Baseline Routing Story (the value of the Claude leg)

Claude's council/improvement behavior is coherent and worth stating as the reference:
- **Explicit, bounded ask → engages the machinery**: ACB-001/004 convene 3-4 seats and pass; IMB-001/004/005 run the evaluator loop and produce candidate+score.
- **Vague natural ask → answers inline** (ACB-003, IMB-003 partial): does not auto-escalate a casual question to the full workflow.
- **"Run it yourself" council framing → confirm-halt** (ACB-005): the council mode presents a setup confirmation rather than auto-running.

## 6. Harness Calibrations Landed During Phase 004

1. **Council seats counted from artifact CONTENT** — the real council writes `ai-council/topics/<t>/rounds/<r>/deliberation.md` + `council-report.md` + a state JSONL, with seats as identifiers WITHIN those artifacts, not files under `ai-council/seats/`. The first council baseline mis-scored `role_absorption` (seat count 0) until the detector was changed to count distinct seat ids from the content.
2. **scoreD3 returns null for halt cells under the artifact-evidence kinds** — a `question_halt` cell correctly convenes no seats / writes no candidate, so delegation is not applicable (mirrors task_dispatch halt cells).
3. **candidate_evidence requires a candidate AND a score** — counted separately (`improvement/candidates/*.md` + `*score*.json` / `.score-cache/`), so a run that writes candidates but never scores them cannot pass on candidate files alone.

Each was verified by the hermetic suite before the next run consumed it; `task_dispatch` behavior (research/review/context legs) is byte-identical.

## 7. Remediation Backlog Seeds (feed phase 005)

- **[TOP] Resolve Gate-3 vs command-contract precedence for autonomous/CI invocation** — now replicated across all four command surfaces AND both reasoning efforts. GPT stops to ask the repo spec-folder question instead of running the command. This is the highest-value, most-robust remediation item in the packet.
- **Mandate high reasoning effort for GPT deep-loops — with the caveat that it is not a universal fix.** High clears med's research absorption and some improvement cells (IMB-005), but does NOT fix Gate-3 halts and does NOT prevent council/context stalls.
- **Council + improvement full-run budgets are tight** — IMB full-run cells cluster at the 15-min boundary (baseline/med under, high over); the council multi-seat cells stall past the watchdog. Re-provision or add a contested-cell 3-sample pass before quoting stall rates.
- **Bare-command / vague-ask presentation gaps** — IMB-003 med/high render partial presentation (D2 0) where the baseline renders the full contract.
