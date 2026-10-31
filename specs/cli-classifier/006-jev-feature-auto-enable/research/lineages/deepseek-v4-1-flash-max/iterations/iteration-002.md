# Iteration 002 — Spec-track narrowing: the repeat, the power, and the keep rule

- **Focus:** Given the repeat on 270 rows stopped on margin (106 vs 82, bootstrap interval spanning zero), what corpus, labels, keep rule and power would prove a live win or settle a kill; what question, option or input changes improve accuracy; which failure modes need hardening; where would it plug into a live path; what tests would cover it? (Q2)
- **Read first:** no `steer.md` exists in this lineage yet (checked at iteration start, absent).
- **Lens:** every claim gets a `file:line`; every "confirmed" names the check that produced it.

## Actions Taken

1. Located and read the repeat run record: `~/.skilled/.labels/runs/049-002-jev.stdout.txt` (full report print) and `report.json` (pins: row-set SHA-256, 270 rows, option-set SHA-256, model tuple).
2. Read the 049 build record: `049-jev-feature-improvement-build/002-track-narrowing-improvements/implementation-summary.md` (what shipped, verification, limitations).
3. Read the current scorer's keep rule, verdict order, sign test, bootstrap and pinning call sites (`score-track-narrowing.mjs:55-64,637,816-892,961-981,1372-1396`) and the shared measurement kit (`scorer-report.mjs:33,71,88,107,144,165,181,243,256,267`).
4. Read the test inventory: `tests/score-track-narrowing.vitest.ts` (33 named cases across test set, baselines, verdict, bootstrap, replay, jev gate).
5. Computed exact binomial power against the margin gate from the repeat's own counts (script below).

## Findings

### F-001 — The 017 keep did not repeat; the repeat is inconclusive, not a kill (P0, Q2)

The repeat (`049-002-jev-20261003`, 852 calls, 2,093 s) printed `verdict jev: stop (margin) K=270 M=270 A=106 B=82 W=80 L=56 F=48 p=0.02409`, with `bootstrap probability-aware vs baseline: accuracy_delta_95_ci=[-0.1185,0.2760] clusters=16 replicates=1000` (`~/.skilled/.labels/runs/049-002-jev.stdout.txt`). The margin gate needs `10*(A-B) >= M`, i.e. 27 rows; Jev's gain was 24. The sign test passed (p=0.02409 < 0.05); margin failed first. The baseline rose from 68/256 (26.6%) to 82/270 (30.4%) while Jev moved 97/256 (37.9%) to 106/270 (39.3%), so the *relative* lead fell under the 10-point bar.

- **Confirmed by:** reading the recorded stdout and recomputing `10*(106-82)=240 < 270`; the 049 summary states the same in prose (`002-track-narrowing-improvements/implementation-summary.md:94,103`).
- **Implication:** the two recorded runs bracket the gate (keep on 256 rows, stop-on-margin on 270). Neither run alone settles anything; the CI spanning zero means the true effect is anywhere in roughly [-11.9pp, +27.6pp].

### F-002 — The corpus is underpowered for the effect it measured; the power question resolves to numbers (P0, Q2)

Exact binomial power against the margin gate (needs `W-L >= 27` at M=270), computed from the repeat's own counts:

| Quantity | Value |
|---|---|
| Observed decided-pair win rate `p_w = W/(W+L)` | 80/136 = 0.588 |
| Decided pairs at K=270 | 136 (50.4% of rows) |
| Minimum decided pairs for 80% power at `p_w=0.588` | **217** (≈ **431 rows** at the current decided rate) |
| MDE at the current 136 decided pairs (80% power) | `p_w = 0.634`, i.e. ≈ 37 rows / 13.7pp gain |
| Power of the repeat as run, at its own observed effect | **0.399** |
| Power at `p_w=0.65` with 136 / 224 decided pairs | 0.892 / 0.997 |

- **Confirmed by:** exact binomial tail summation in a script (power = `P(2W-n_d >= 27)`, W~Bin(n_d,p_w)); input counts from the recorded stdout.
- **Implication:** to prove a live win at the observed effect the corpus needs roughly **217 decided pairs (~430 rows)** with the current decided rate; conversely, the current corpus can only reliably clear the margin gate if the true win rate is ≥63.4%. A pre-registered power line (n, alpha, MDE) belongs in the scorer's report before any third run is read as decisive.

### F-003 — The keep rule is relative-only: no absolute accuracy floor, no per-track floor (P0, Q2)

The frozen rule is `coverage 10*M >= 9*K, margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M` (`score-track-narrowing.mjs:62-64`), evaluated in that order by `decideVerdict` (`:883-892`). Nothing in the rule looks at absolute accuracy: A=106/270 (39.3%) would keep if the margin passed. The headroom line only guards a *strong* baseline (no headroom above 90% right, `:390,700`).

- **Confirmed by:** reading `decideVerdict` and the rule constants; the repeat's own numbers show a keep-eligible-looking sign test on a 39.3%-accurate arm.
- **Implication:** "prove a live win" needs at minimum an absolute floor (e.g. decided-subset accuracy or A/M) and a per-track recall floor, both operator-set, or the rule can keep a feature that is wrong on most rows.

### F-004 — Probability-aware aggregation did not repeat its gain; one call is near-equivalent (P1, Q2)

On the 017 corpus the probability-aware arm scored 98 vs the modal 97 (prior research, session-verified). On the repeat it scored **102 vs the modal 106** (`verdict probability-aware: stop (margin) ... A=102 B=82 W=77 L=57 p=0.05018`; decided-subset 102/203 = 0.5025; margin slack −7.0 rows). The one-call arm scored 103 with p=0.04125. So the "free row" is corpus-dependent, and the three-order protocol buys stability, not accuracy.

- **Confirmed by:** comparing the recorded arms in the repeat stdout against the 017 figure in the merged prior research (`048.../002-track-narrowing-research/research/research.md:65,114`).
- **Implication:** do not adopt probability-aware aggregation or the one-call cut on one corpus; the shortlist arm remains unmeasured (`shortlist arm: ... accuracy=not-measured`).

### F-005 — The 049 trust upgrades landed and are visible in the repeat record (P1, Q2)

The repeat's report pins `rowSetSha256`, 270 rows with per-row `questionSha256`, and `optionSetSha256` (`report.json` `dataPin`), plus the model tuple `{jevVersion: "jev 0.6.2", provider: "official", model: "jev-1.13.0"}`; a second run into a populated `--out` is refused, `--replay` scores exactly the recorded rows and reports drops, and the cluster bootstrap (16 clusters, 1000 replicates) is in the report (`scorer-report.mjs:71,88,181`; `score-track-narrowing.mjs:1372-1396`). The 049 verification recorded a 0-drop replay of the 017 recording (K=256 M=256 A=97).

- **Confirmed by:** reading the pin fields in `report.json`, the shared kit's exports, and the 049 verification table (`implementation-summary.md:90-96`).
- **Implication:** the remaining trust gap is not instrumentation but *labels and population*: the corpus is committed packet prose, not Gate 1 requests, and the gold is path-derived.

### F-006 — Transfer warning persists; clusters are heterogeneous and abstention-heavy (P1, Q2)

The repeat's paraphrase probes favor ripgrep 9/14 to Jev 2/14 (unchanged shape from 017), and the per-track table ranges from sk-git 14/19 to sk-design 3/20 with 16 of 20 abstained; total abstained=55 (20.4%). Three tracks (sk-design 16, sk-communication 8, sk-doc 7) hold 31 of the 55 abstentions.

- **Confirmed by:** reading the `paraphrase probes` and `per-track jev` lines in the repeat stdout.
- **Implication:** any live path must be miss-only with fail-open on `none`/low confidence, and per-track floors should exclude or separately gate clusters like sk-design until their descriptions are diagnosed (prior R5).

### F-007 — Cost is latency: ~325 ms p50 per call; serving shape should be one call, miss-only (P2, Q2)

The repeat measured `latency_p50_ms=325 latency_p95_ms=389` per call over 852 planned calls per arm, with an estimated 953,885 input tokens (mostly the 17-option block). The one-call arm is within 3 rows of the modal arm (103 vs 106), and the advisor hook budget is 2,500 ms.

- **Confirmed by:** the repeat stdout's `column jev`, `planned calls` and token lines; the one-call arm's recorded verdict.
- **Implication:** if a live path is ever built, serve one call on ambiguous/miss rows only, inside a few-hundred-ms budget, with the three-order protocol kept for offline measurement.

### F-008 — Integration shape: a FEATURES entry plus an advisory Gate 1 call site; R1 still binds (P2, Q2)

The gate needs no change (iteration 1, F-001/F-002): add `'track-narrowing': { env: 'JEV_FEATURE_TRACK_NARROWING', aliases: [] }` to `FEATURES`, and a live call site in Gate 1 retrieval (`lookup-trigger-index.mjs:132` `lookup()`) that asks `featureReady('track-narrowing')` only when the lexical lookup misses or ties, prints an advisory suggestion, and fails open to broad search — the cite-drift advisory shape (version-pinned gate, advisory only, never blocks). Prior research R1 ("keep hard narrowing offline until a real-request holdout passes") is unchanged and strengthened by the repeat.

- **Confirmed by:** the gate read (iteration 1), the lookup entry point read, and the prior research's R1/R9 and integration section (`048.../002-track-narrowing-research/research/research.md:92,102,110`).
- **Implication:** nothing about the repeat makes a live path safe today; the ranked next step is corpus first, then rule floors, then a shadow.

## Ruled Out

- **Reading the repeat as a kill.** The CI spans zero and the effect is underpowered; it is inconclusive (F-001, F-002).
- **Adopting probability-aware aggregation as a free row.** It lost 4 rows on the repeat corpus (F-004).
- **A gate change to register the feature.** `FEATURES` is data (iteration 1, F-001).

## Dead Ends

None. All five research actions produced evidence.

## Edge Cases

- Ambiguous input: none; the topic names the scorer, the repeat and the two sub-questions.
- Contradictory evidence: the probability-aware arm contradicts the 017 "free row" claim — recorded as F-004 with both corpora cited, not resolved by preference.
- Missing dependencies: `steer.md` absent; no lead review yet.
- Partial success: none.

## Sources Consulted

- `~/.skilled/.labels/runs/049-002-jev.stdout.txt`; `~/.skilled/.labels/runs/049-002-jev-20261003/report.json`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:55-64,637,816-892,961-981,1372-1396`
- `.skilled/skills/cli-classifier/shared/scripts/scorer-report.mjs:33,71,88,107,144,165,181,243-267`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts:188-1120`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:132`
- `specs/cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/002-track-narrowing-improvements/implementation-summary.md:49-105`
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/002-track-narrowing-research/research/research.md:49-146`

## Assessment

- New information ratio: 0.9 (the repeat's full record, the power numbers, the probability-aware reversal, and the landed trust upgrades are new; the corpus/label critique carries forward from prior research with new evidence)
- Questions addressed: Q2
- Questions answered: Q2 in all five sub-parts: corpus/labels/keep-rule/power (F-001..F-003), accuracy changes (F-004), hardening (F-005..F-007), integration (F-008), tests (below).

## Reflection

- What worked and why: computing power from the run's own counts turned a vague "underpowered" worry into numbers the operator can act on (217 decided pairs / ~431 rows; MDE 13.7pp).
- What did not work and why: nothing failed; the one surprise — probability-aware losing on the repeat — was caught only because both corpora were cited side by side.
- What I would do differently: for clarify default and alignment, pull the equivalent "what changed since 048" delta first, since the trust upgrades landed for all three scorers through the shared kit.

## Recommended Next Focus

Iteration 3 — routing clarify default (Q3): read `score-clarify-default.cjs` (post-049: replay/refusal of non-clarify rows), the 3-of-359 committed-prompt clarify count, the fixture keep (28 vs 15 of 54), and the 049/007 improvements. Deliverable: corpus/labels/keep-rule/power, accuracy changes, hardening, integration shape (seam!), tests.
