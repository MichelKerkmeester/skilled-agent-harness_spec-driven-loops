# Iteration 005 — glm-05: What not to build, round 3

- **Lineage:** `glm` · session `fanout-glm-1790490452777-942a1f` · 2026-09-27
- **Wave:** W4 (cost, order, kill) · **Maps to:** H, B · **Timestamp (research):** 2026-09-27T07:18:00Z

## Focus

Angle `glm-05` (research-angles.md:756-768): consolidate every round-3 proposal I would drop, with reason, checklist question and evidence; which baseline drops the flip set reopens WRONGLY; the smallest program that remains; its kill criterion; what the operator should decline FIRST. Refinement (research-angles.md:900): the drops in the synthesis table format, numbered from 73.

## STEER

No `steer.md` ever landed in this lineage (verified at every iteration; the lead's reviews did not arrive before the cap — recorded for the synthesis's REQ-004 check). The `glm-05` refinement (the #73 table format) binds; the `glm (all)` Q7/Q9/Q10/Q12 refinement: final statement below.

## Sibling check (the W4 obligation: all my own + the newest of each)

- My iterations 001-004 — the four through-lines (see F4).
- `grok/iterations/iteration-010.md` (their newest; read it.2) — their one-phase verdict, their swe-01 timing dispute, their "no pin and no hold" deem-ctl finding.
- `deepseek/iterations/iteration-010.md` (their newest; skimmed it.3) — their two-backend amendments; their swe-08-missing note (now retired: swe-006 exists).
- `mimo/iterations/iteration-003.md` (their newest, NEW since it.4) — the comparison design: "one printed line decides", a pre-registered deciding line (their Finding 4), every results citation `grep -n`-verified before writing; the steer's correction: R22's ~50 labels = HVR voice passages (BASE2:711-716), kept apart from review-finding labels.
- `swe/iterations/iteration-006.md` (their newest, NEW since it.4) — the citation-drift slice: their residue table's five candidates; their corroboration-not-duplication note vs N-deepseek-03-3 (`AC_COVERAGE` counts `file:line` presence, never verifies the cited line — `validation-rules.md:110-135`, their read of deepseek-003's); their F7/F8 = "advisory sibling, own switch, exit-0, skip line with neither backend" — the two-backend design point-for-point.
- BASE2 What-Not-To-Build rows 44-72 (the 29-row table, this iteration's read; rows 44-49 = BASE2:794-799 verbatim) — the round-3 drops are NEW numbers; the baseline rows are the context they must not merely restate.

## Findings

### F1 — The round-3 drop list, numbered from 73 (answers question 1; the refinement's table)

| # | Idea | Reason | Checklist question or red flag | Evidence | Lineage(s) |
|---|---|---|---|---|---|
| 73 | Cadence-lowering as the reproducibility fix for the 6-hourly update | The symlink switch fires before any quality comparison regardless of cadence (deem-ctl:163,167); releases are ~weekly (one data point: the model commit's 2026-09-25, LOCAL:20), so 28 polls cost nothing | The cheaper correct fix = provenance + keep-rule requalification (fix-the-producer, not the symptom) | deem-ctl:163,167; plist:12-13; N-glm-01-2 | glm |
| 74 | A Tare-harness quality gate inside `deem-ctl update` | Needs a labeled set this repository has not built (LOCAL:52-53) and a harness the lineage does not own; the two published figures disagree in kind (card 96.3% vs tare 0.6788) so neither stands in for a local measurement; the printed F1 threshold already answers the only question that matters, at 0 LOC | Q1 (no gold here), Q12 (a foreign harness = a dependency) | LOCAL:27,52-53; MODEL_CARD_08B.md:20; leaderboard.md:14; deemed-ctl:79-81 | glm |
| 75 | The 70-LOC passthrough wrapper (N-swe-01-2) as cli-deem | Pays Jev's key ceremony (ALL-8: the bearer + exit-3) to reach an authless server (CORS `*`, no auth — deem_server.py:809-811); a wrapper that only forwards arguments, at 70-LOC-vs-170-LOC-where-170-also-works | The wrapper red flag; Q6 (no caller earns the second hop) | swe-001:58-66 (their own "rejected as the only slice"); ALL-8; it.2 F5 | swe + glm (join) |
| 76 | The patched-jev-cli (grok-07's route (a)) as the Deem transport | 40-70 LOC of edits inside the installed wheel = a fork you maintain ("the installed wheel and the vendored tree diverge"), the 60 s call timeout inherited (JEVSRC:288) — the same failure as 75 at higher cost | Q6; the fork-vs-vendor divergence | grok-007:44 (their kill: the stub + `pip show` proving no local edit) | grok + glm (join) |
| 77 | Minting the `cli-classifier` hub NOW (D2 as a build phase) | A 1-mode hub is air — cli-jev's own "orderedBundle: unreachable while the hub registers one mode" (hub-router:8-11); the census needs no hub (002:98, "this script is the only caller and `--jev` is its own switch"); the four Planned phases mention the hub ZERO times; the costs: +10-12 KB surface, +1 hop (~1,700-2,000 tokens/pass, arithmetic), an advisor-identity re-mint (~30 load-bearing pins), at 0 second-caller | Q3 (build nothing first), Q6 (no caller earns it), the smallest-thing rule | it.2 F1-F3, F6; goal.md:50; 002:92,98; counted: 638/83+30+2,372/467 references | glm |
| 78 | A `cli-jev` mode, or any shared Jev/Deem client helper, inside the 002 census | 002's own Out of Scope froze it: "A shared Jev client helper, a global Jev switch, a new command or a `cli-jev` mode. This script is the only caller and `--jev` is its own switch" — the 0.8B scorer inherits the SAME exclusivity (its own switch, one word) | Q14 (respect the frozen contract); 002's own :92/:98 | 002 spec.md:92,98 (my own read, it.2); it.2 F2/F4 | 002 + glm |
| 79 | Deem-as-MCP for context reduction (N-grok-03-1) | 2,225 source-B of tool schemas + the state-echo into every tools/list, vs 0 for a hook that reads the transcript itself; the wire size honestly UNKNOWN; fails it.3's four-part threshold (new surfaces + cache-bust) | Q6; the F2 unit (attention + cache-creation, cache-bust counted) | grok-003:26-30, :57-67 (their count + their kill); deem_mcp.py:46-120, :60 | grok + glm (join, stronger reason) |
| 80 | Any READ-time file-relevance judge today (R22's revival) | The prize is real (30.1% main / 16.8% subagent re-reads, the recount) but the interception = BASE1 row 38's no-rewriting contract + a new hook + an unstated cache-bust probability; the cheaper read-ledger (subagent hygiene) covers most of it | Q3 (unmeasurable-before-build: no gold, no contract), the F2 unit, the four-part threshold's clause 3-4 | mimo-002:27-29 (598/1,984; 1,168/6,937); BASE1 row 38; it.3 F1-F4 | glm (it.3) |
| 81 | Retrieval reranking today | No counted miss/misrank; the frozen exit-0/1/2 + sentinel + 20-cap contract (cold-Node synchronous); the post-recount Grep/Glob-0 status itself = UNKNOWN — the seam's own usage is uncounted | Q1, Q8 (whose owner? which counted miss-rate?) | deepseek-005 F1 (theirs, quoted); mimo-002's retirements; it.3 F1 row 3 | glm (it.3) |
| 82 | A choice-classifier AS the sk-prompt framework picker | The printed 7-row selection matrix (SKILL.md:309-315) is deterministic TODAY; the classifier re-implements it and then meets the 7-vs-5 registry mismatch (prose 7, four places, vs registry 5 — no template for 2); the 59,661 B prize is collected by "read only the selected section" — a DOCS line, zero code | Q4 (better as docs); the determinism-wins pattern (3rd instance) | my own SKILL.md:3,38 read; grok-005:18-34 (theirs: the registry-5, the 36,580+23,081 — quoted-not-opened, marked); it.4 F2 | grok-005 + glm |
| 83 | A CLEAR-score classifier today | "CLEAR is a 50-point sum of five dimensions… It is not a label set" (SKILL.md:321); the 4 CLEAR + 4 framework-selection playbooks = "procedure checks… not labeled picks and not a routing-accuracy number"; 0 gold → hope-first | Q1/Q3 (no gold, unmeasurable-before-build) | grok-005:36-39 (their honesty, my framing) | grok-005 + glm |
| 84 | Any model as the sk-design mode router | The hub-router already IS the closed label set ("where the router is already that closed set in code"); 0 archived Lane-C runs ("an empty tree is not a passing score"); the model = working code → a 60 ms judgment + the it.1-2 provenance burden | Q3; the determinism-wins pattern (4th instance) | grok-006:5, :20-22; the it.1-2 burden | grok-006 + glm |
| 85 | Publishing ANY F-hub-accuracy number today | UNMEASURED per the W3 rule: no run, no archived Lane-C; the mode baselines "do not measure whether a request reaches the hub"; the ~35+ playbook scenarios = the LATER replay-gold, if anyone labels them | the W3 rule (metric+baseline+harness or "unmeasured") | grok-006:20-29 (their scenario counts: 4+12+10+9+…); their no-inventing discipline | grok-006 + glm |
| 86 | Voice/placeholders flaggers | 9/8 recurrence per week vs the 1%-of-carry/recurrence bar — under any stated threshold | the F4 threshold (it.3); their own "do not recur enough to earn anything" | mimo-002:107-111 (their 9/8 counts + their verdict) | mimo-002 + glm |
| 87 | A template-alignment classifier | Already mechanized — hvr_scan.py:1-21; "a classifier there competes with a script, not with a reader" | Q4 (the cheaper fix exists) | mimo-002:109-111; swe-002's check map | mimo-002 + glm |
| 88 | Building tool-output pruning before the one-bucket count | The decisive number — READ-CONTENT's share of the ~28.6% — is still uncounted (mimo's own "one more bucket" method, not yet run); row 38's contract void; the honest count = the 361 KB/day additionalContext + the 546.2 MB hook_success, whose CONTEXT-active part is the 361 KB — the retention cap (N-glm-03-2b) is the LATER, ownerless-gap answer, not a build | Q1 (the count first); the F2 unit | mimo-002:29-38 (theirs); BASE1 row 38; it.3 F1 row 5, F3.2 | glm + BASE1:38 |

### F2 — Which baseline drops does the flip set reopen WRONGLY (answers question 2)

**Rows 44, 47, 49 — read this iteration, BASE2:794-799, verbatim in my own eyes:**

- **Row 44** (pi-jev-context's per-request filter): the drop never rested on latency/egress alone — the await-per-request, the prompt-CACHE invalidation warning (README:85/87) and the persisted-prune-after-error all SURVIVE a local 60 ms backend (grok-003:36: "A local 60 ms call removes the API charge and the egress. It does not remove cache invalidation or a saved prune that survives an error"). Under it.3's F2 unit, the cache-IS the cost structure (fresh-input p50 = 2): the 60 ms revives the CHEAPEST half and leaves the EXPENSIVE half. Anyone ranking it by "now free, now fast" = the wrong reopen.
- **Row 47** (npm `rerank`'s missing→0): "a missing answer becomes 0 and ties follow input order, so a transport failure can fake a win" — A LOCAL BACKEND KEEPS THE BUG (grok-003:37): the defect lives in the caller's convention, not the wire.
- **Row 49** (claude-jev's path-regex): "refuses paths by pattern and never sees… inside file content" — a classifier does not make it see.

The SYNTHESIS's flip-set section (question B) must therefore say: the 60 ms call flips NOTHING alone; what it buys is the egress/charge halves (grok-003's own conclusion) — and the reopened-temptingly set is exactly 44/47/49, each waiting on its OWN cheaper fix (the provenance+cache discipline; the missing-→-unmeasured convention; a reader), not on the model.

### F3 — The smallest program that remains (answers question 3)

Five artifacts, ~0 new surfaces, every one either an amendment, a replay, or a line:

1. **002 + one word**: `:92` "Jev call" → "Jev or Deem call" (N-glm-02-2), then the 30-60 LOC 0.8B scorer riding the ~180-LOC census, its own switch, the C1/C3 thresholds printed. **This produces THE number.**
2. **005's deletion arm** (swe-004's amendment, my full agreement): the compaction keep/drop census — 226 boundaries, preTokens ≥ 450,019, p50 wait ≈ 104 s — zero-call, gated by 005's own stop line.
3. **The D-residue replay** (N-glm-04-2): the correctness/traceability flagger's labeled-set run over the review tables' OWN labels (severity 3, dimension 4) — precision@0.8 prints; the 0.8B, the 9B, Jev, any heuristic, ONE replay, THEN the review-table column if it passes. (swe-006's citation-drift slice = the D-neighbor, their own design; N-deepseek-03-3's gap = the corroboration — the D-family is the ONE question where the program GROWS a second seam, honestly.)
4. **Two DOCS lines**: the 7-vs-5 fix + "read only the selected framework's section" (N-glm-04-1) — the 59,661 B, collected.
5. **Two paragraphs**: D2.1 (the ledger clause: the hub when the second caller lands, kill at 0-caller) + D3.2 (provenance = readlink + the status pair; the printed keep rule re-qualifies after any weights change).

The 0.8B's role in the whole program: a CANDIDATE SCORER, twice, behind two printed thresholds. It pioneers nothing. That is the contrarian's account of where a free, private, 60 ms, uncalibrated, unmeasured model earns its 3,368 MB: nowhere yet — and the two places it gets to TRY are exercises in writing the number down first.

### F4 — The kill criterion for that program (answers question 4)

One line, unchanged since it.1 (deliberately):

```
deem-0.8-v1 agreement=<X> on n=<movable> rows, aggregateFlip=<Y>
  X < 0.68 (or n < 5) -> the 0.8B does nothing, anywhere; the program's artifacts 1/3/5 die
  X >= 0.68 AND Y <= 0.10 -> the ONE feature (the 002 arm) + the D-column, each by its own printed precision
plus: any weights change re-qualifies (D3.2); the flagger's own: precision < 0.8 or true-flags/week < the false-flag reader-cost, prints, it dies (it.4)
```

The program's OTHER kill: **the 005/002 censuses themselves** — if the 005 deletion-arm's stop line kills, or the census prints `underpowered` (n < 5 movable), the program's model-halves die WITHOUT the 0.8B's agreement number ever being needed — the censuses are the kill-BEFORE-the-kill, which is why they are build-now and the model is not.

### F5 — What to decline FIRST (answers question 5)

1. **The `cli-classifier` hub as a build phase** (#77) — the largest spend with the smallest counted justification: nobody's phase owns it, 1-mode hubs are the repo's own precedent for "unreachable", and the +1-hop cost lands on every judgment pass forever. Declining it costs one paragraph (D2.1) and buys thecounts.
2. **The MCP-Deem exposure** (#79) — the 2,225 B + state-echo, against the hook's 0.
3. **Any READ-time or tool-output rewrite** (#80, #88) — until row 38's contract exists and the one-bucket count lands, every variant is the same hope in different plumbing.

### F6 — The final `glm (all)` statement: Q7, Q9, Q10, Q12 for Deem, after five iterations

- **Q7 (opt-in, clean degradation):** the only no-key activation in the comparison — Dormant-by-default is D1's own clause (goal.md:49); a downed or stubbed server must skip VISIBLY (the parsed-`backend`+model-id health check, deemed-ctl:58-60 + the ALL-4/deepseek-01 pin) — across all five iterations, every surviving proposal's skip-line matches deepseek-005's F4 uniform pattern ("advisory skipped: no classifier backend, exit 0").
- **Q9 (egress):** passes trivially — answers, model, weights all local (LOCAL:51); the one off-machine act is the UPDATER's (the HF/GitHub pull, deemed-ctl:5-7), which is the operator's, not a feature's. The fifth repetition, for the record.
- **Q10 (reversibility):** the feature = the D1 switch; the install = "rm -rf ~/.local/share/deem + launchctl bootout" (LOCAL:66, :70). The five-iteration residual: the 2.1 GB + launchd agent is the dependency-reversibility BITE (repo-external, neither pinned nor auditable) — which is why F4's provenance answer (readlink + the status pair) was worth two iterations: the record makes the dependency FAIL DIAGNOSABLY.
- **Q12 (new dependency):** none added per feature — the climbing sentence D3 already wrote (goal.md:50-51). The bite: every trusting feature adds a service dependency on a launchd-managed, repo-external process; named (LOCAL:28), answered by the provenance precedent, and—per #77—resisted at the SURFACE level (no hub) until a second caller earns it.

## Questions Answered

- **H1:** the drop list, #73-88 — the table (F1). Sixteen rows, each with its reason, its checklist hook, its evidence, its lineage.
- **H2:** the smallest program (F3), its kill (F4), the decline-first (F5).
- **B (final):** the wrongly-reopenable set = 44/47/49 (F2), each gated on its own cheaper fix; the 60 ms buys egress/charge halves only.

## Questions Remaining

None for this lineage. The residuals are the SYNTHESIS's (the quoted-not-opened debt, it.4's list; the D-family's second seam — swe-006's citation drift — which the packet-Opus must reconcile with N-deepseek-03-3 and mimo-08's missing run).

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence or restated | Evidence |
|---|---|---|
| #73-88: sixteen round-3 drops, each carrying a printed reason + checklist + evidence + lineage | **new** (the refinement's deliverable; six are BASE-adjacent concurrences, ten are this lineage's) | F1, with its per-row evidence |
| The 60 ms flips rows 44/47/49 WRONGLY if argued from speed: the cache-structure (44), the caller's convention (47), the refuse-regex (49) each survive the local backend | **confirms BASE with new evidence** (grok-003's reasons + it.3's F2 unit, now stated as the reopen-danger) | F2; BASE2:794-799 read this iteration |
| The smallest remaining program = 1 word + 1 replay + 2 amendments + 2 lines; the 0.8B appears only as a twice-gated candidate scorer | **new** (the convergence of it.1-4; nobody has printed the PROGRAM) | F3 |
| The kill-BEFORE-the-kill: the censuses can kill the model-halves without the agreement number ever being consulted | **new** (the ordering-argument, which is also the answer to "why build the census first") | F4; it.1 F1 |
| The decline-first = the hub (#77): largest spend, smallest counted justification, 0/4 phase-mentions | **new** (the H-answer the angle asked for) | F5; it.2 F2 |

## SCOPE VIOLATIONS

None. Reads only outside the lineage; writes: this file, `deltas/iter-005.jsonl`, the state record, and the lineage's reducer-owned state files.

## Hand-off (to the synthesis)

- The #73-88 table IS the contribution: import it verbatim into the packet What-Not-To-Build, renumbered past whatever the other four lineages' drops reached; the "Lineage(s)" column carries the joins (grok-003/005/006, swe-001, mimo-002, deepseek-005).
- The four through-lines (F4's spirit): (1) the 0.8B = second-scorer-on-existing-gold, twice-gated, never a pioneer; (2) determinism-wins-where-it-exists — four graves (the census's, the matrix's, the hub-router's, the replay's) before one wire; (3) the attention+cache unit governs every savings column; (4) provenance-or-quiet.
- The quoted-not-opened debt, final: the registry-5 + the 36,580/23,081 (grok-005:26-34), 005's spec.md:60 (via swe-004), the 014-runtime-engine internals (via swe-003), the review-table gold's exact shape (mimo-002:113). One open each; none verdict-changing; the jq/wc retires two of five in under a minute.
- The unowned seams, recorded: the hook-stdout retention (546.2 MB, N-glm-03-2b — 0/4 phases own it) and the 1,984-Read/58,109-Bash recount's Grep/Glob-0 status (one recount query, mimo's harness).
- The lead's steer never landed IN TIME (verified absent before all five starts; the REQ-004 reviews arrived post-cap at 09:13:32 local — 111 lines, five reviews, received and adjudicated in research.md §7.5; the lead's side of REQ-004 is satisfied, my side never had the file to read)
- The orchestration residuals, for the packet synthesis: the quoted-not-opened debt (5, it.004's list — the lead's DRIFTED-CITE rows largely concur, one flagged half-right: 010:36 genuinely carries the deemed-ctl quote, origin 007:36), the D-family's second seam (swe-006 × N-deepseek-03-3), the BASE1 rows-1/5 correction (What-Not-To-Build :1045/:1049, latency drops, revival-rule test — the lead's DEFECT, adopted in research.md §7.5), the Tare-identity question, and the choice-key resolution (the lead's, concurring with my it.002 swe-001 adoption)
