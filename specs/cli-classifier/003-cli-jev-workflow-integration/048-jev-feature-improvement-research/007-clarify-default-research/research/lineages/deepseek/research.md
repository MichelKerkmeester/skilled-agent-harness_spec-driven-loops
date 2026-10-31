---
title: "Research: improve, refine and expand the Jev routing clarify default (020) — deepseek lineage"
description: "Five iterations on the measured clarify-default keep (K=54 M=54 A=28 B=15 W=17 L=4 F=10 p=0.003599): what drove it, what makes it cheaper or better, what makes it trustworthy, where it travels, and what default-on would need."
trigger_phrases: []
stopReason: maxIterationsReached
generated: 2026-10-03
---
# Research: improve, refine and expand the Jev routing clarify default (020) — deepseek lineage

**Stop reason: `maxIterationsReached`** (5 of 5 iterations; stop policy `max-iterations`; convergence
tracked as telemetry only). This lineage wrote only inside
`.../007-clarify-default-research/research/lineages/deepseek/`.

## The result in one reading

The verdict `verdict jev: keep K=54 M=54 A=28 B=15 W=17 L=4 F=10 p=0.003599` is arithmetically faithful
to its inputs and robust to the call shape, but it is a narrow claim: Jev beats the *tie-break order* the
router prints first (15/54) on a fixture whose 34 of 54 rows are `none_of_these`. It does **not** beat the
do-nothing answer (always `none_of_these` is 34/54), its served suggestions are wrong 26 of 42 times, and
on the frozen routers only 12 of the 54 rows even reach the `clarify` action the feature describes. The
biggest wins available are measurement fixes (identity, premise check, real rows) and one cost win (an
early stop that is byte-equal at two thirds the calls); the default-on path should stay behind a shadow
phase until a suggestion can compete with "just ask the user".

## Q1 — What drove the measured result

1. **The corpus geometry manufactures the margin.** 34 none-rows make the first-alternative baseline
   structurally 0/34 there, so B=15 is a floor any none-shaped gain clears; the margin only needs
   `10*(A-B) >= M` = 130 >= 54. [findings F-1-01, F-1-02]
2. **A=28 decomposes to 12 none recognitions + 16 mode rights; W=17 = 12 + 5 tie-break-beating wins;
   L=4** (f020-008, 010, 029, 050). "Most of the gain came from recognizing none" is confirmed at 12 of
   17 W rows. [F-1-03]
3. **Errors are one-sided and clustered.** 22 of 34 none-rows still got a mode suggestion — sk-design 9/9
   missed, cli-external 7/11, mcp-tooling 3/9, sk-doc 3/5. `none_of_these` picks are 12/12 precise but
   recall only 35 percent; 19 of the 26 wrong picks were unanimous across rotations (stably wrong).
   [F-1-04]
4. **The four losses share one shape:** a surface named in the prompt (OpenCode, Webflow, README) draws
   the surface mode while the label follows the requested action, at 0.81–0.90 confidence. [F-1-05]
5. **Probability carries no signal** (0.678 vs 0.688 on none wins vs misses), so no confidence gate
   exists. [F-1-06]
6. **The fixture is not a census and its premise does not reproduce.** Rows carry `source: "fixture-047"`,
   a value the census never emits; replaying all 54 prompts through the scorer's own `runCensus` on a tree
   byte-identical to the measurement commit gives 12 clarify (all sk-doc) and 42 route. The
   committed-corpus census still reproduces (clarify 3). [F-1-11, F-1-12, F-3-05]
7. **The baseline is a declaration order, not a decision**, and a degenerate policy outscores Jev on the
   same labels (always-none 34/54). [F-1-09, F-1-10]

## Q2 — How to raise accuracy or lower cost

1. **Early stop, byte-equal (recommended).** Stop after two agreeing orders; call a third only on
   disagreement: **118 calls vs 163 (−27.6%)** with identical picks and verdict. Proof: when orders 0 and
   1 agree, the third vote can only confirm the same 2-1 majority. [F-2-01]
2. **Two calls with a deliberate tie rule.** Disagreement answered `none_of_these`: **A=31 (from 28),
   W=22, L=6, 109 calls (−33%)** — 3 more right answers for a third fewer calls. Changes what Jev says,
   so it is a Keep-Rule amendment, not a free saving. [F-2-02]
3. **One call is as accurate as three.** Single-order accuracy 28/54, 28/54, 29/54; all keep; the best
   single order is the `[none, A, B]` rotation. The 108 extra calls buy stability, not accuracy. [F-2-03]
4. **The accuracy ceiling is the none recognizer.** Perfect none-recall with mode accuracy unchanged
   gives A=50/54; recovering half the 22 misses gives A=39 (margin 240 vs 54). All 22 misses are two-mode
   co-requests. [F-2-04]
5. **The levers are text-level and frozen.** The `-q` instruction and "None of these modes" are pinned by
   REQ-006 and never name the both-and case; changing them is an amendment, measured on a new corpus.
   [F-2-05]
6. **The loss rows want one instruction rule:** answer the mode that performs the requested action; a
   named tool or surface is context. [F-2-06]
7. **Cost is latency, not tokens**: ~119 tokens and 332 ms per call (p95 380 ms); early stop ≈ 0.72 s per
   clarify. [F-2-07]

## Q3 — How to make the measurement more trustworthy

Reproduction checks that pass today: all six counts recompute from `calls.jsonl` + labels; the options
digest recomputes exactly (`36`, `df8ed1df…`); the labels equal the committed fixture modulo labels and
match the arbiter draft 54/54. [F-3-01, F-3-02, F-3-03]

Gaps, with the digests this lineage recorded for the first time (rows `fd9acdfd…`, fixture `94a66cd7…`,
labels projection `0e1f4f3c…`, arbiter draft `9974f80d…`):

1. `report.json` proves only K, B and the column block — no rows hash, labels digest, options digest, tree
   identity or labeler. **Fix: write the four digests into the report.** [F-3-04]
2. The scorer never replays the row's prompt, so a row that is no longer a clarify is scored silently.
   **Fix: a zero-call action check per row.** [F-3-05]
3. The only baseline is the tie-break order. **Fix: print always-none and second-alternative baselines.**
   [F-3-06]
4. Labels are one delegated arbiter read with no two-draft cross-check for 020 and a rule the card calls
   UNDEFINED. **Fix: a second arbiter pass on the 34-row none class, or a stated labeling rule.** [F-3-07]
5. The gate has no per-class floor: a pure-none corpus keeps with no suggestion evidence. [F-3-08]
6. `F` conflates position sensitivity with sampling noise (8 of 10 splits dissent on one rotation).
   **Fix: one repeated order per row.** [F-3-09]
7. The production clarify rate is unmeasured (`--transcripts` exists, count-only). [F-3-10]
8. The census is tree-dependent to two prompts; record the tree with the number. [F-3-11]

## Q4 — Where else the same judgment would pay off

1. **Mode-alternative clarify sites reachable today: cli-external-orchestration (7 modes), sk-doc (15),
   sk-design (4), sk-code (5).** system-deep-loop and sk-code's policy-card path list checklist
   sentences; cli-classifier has one mode (branch unreachable); mcp-tooling never clarifies. [F-4-01,
   F-4-07]
2. **Expansion must be per hub.** Per-hub accuracy ranges sk-doc 9/13 to sk-design 2/11 (0 of 9 none-rows
   recognized); sk-design is contraindicated on this corpus. [F-4-02]
3. **The advisor already killed this judgment twice** — phase 002 pick-first (Jev W=11 L=27, p_loss
   0.0069; Deem kill too) and phase 019 whole-cluster (W=13 L=25, p=0.9832; MRR 0.7260 vs 0.7811). The
   keep does not carry across surfaces. [F-4-03]
4. **The sibling keep with a real comparator** (022: A=39 vs B=30) shows the judgment pays where the
   incumbent is strong; 020's comparator is not. [F-4-04]
5. **The reusable asset is the measurement kit**, not the judge: the census, digests, exact BigInt tail,
   modal pick, scorer and verdict are already exported; 002/019/021 rebuilt their own. [F-4-05]
6. **The surface is rare**: 2 mode-alternative clarify rows over 361 committed prompts; 021's tie-break
   arms never ran (2 tied rows of 58, `no headroom`). The base rate gates the value of everything above.
   [F-4-06]

## Q5 — What default-on would need, cost and risk

**Needs.** (a) The seam: `compiledRoute` drops `clarify.alternatives`/question and the front door prints
only the normalized decision, so a suggestion has nowhere to live until the routing owner extends the
contract [F-5-01]; (b) a named reader (no hub directive reads a suggestion today; `A keep serves nothing`
and 047 D6 bar a default path) [F-5-02]; (c) a scope amendment to 020's drops and the operator's call;
(d) a determinism decision (three fresh calls, no cache; 10/54 rows can flip between invocations) [F-5-03];
(e) a payload decision — live, the user's prompt text leaves the machine [F-5-06]; (f) the suggestion
must sit beside the deterministic action, never replace it [F-5-04].

**Cost.** ~357 tokens and ~1 s per clarify at three calls; ~0.72 s with the early stop; negligible per
session at 3 clarifies in 361 prompts. The real cost is the added synchronous latency and network
dependency in a local, fail-safe path. [F-5-05]

**Measured risk.** Served suggestions: right 16/42 = 38.1 percent, wrong 26; stable-wrong 19 (45.2
percent of served); abstention precise (12/12) but rare (35 percent recall); the suggestion set loses to
always-answering-none 34 to 28; per-hub spread 9/13 to 2/11. [F-5-07]

**Tiers.** T0: trust fixes + transcript rate (no model, no seam). T1: shadow logging whose real user
picks become free labels. T2: gated annotation (unanimous mode pick, per-hub allowlist; sk-design
excluded). T3: model decides the clarify — stays excluded. [F-5-08]

## Ranked recommendation set

| # | Recommendation | Evidence | Cost to build | Expected effect |
|---|----------------|----------|---------------|-----------------|
| 1 | Put the measurement identity in `report.json`: rows hash, labels digest, options digest, scorer hash, and replay each row's engine action before scoring | F-3-04, F-3-05, F-1-11 | Small scorer change (later phase) | Makes a verdict reproducible and stops non-clarify rows being scored |
| 2 | Shadow-log real clarifies and treat the user's actual pick as gold (T1) | F-3-07, F-3-10, F-4-06 | A consent/log policy and a small writer | Fixes the label problem at its root and measures the real base rate |
| 3 | Print the do-nothing and second-alternative baselines beside B; make the strongest simple policy the bar for any future keep | F-1-10, F-5-09, F-4-04 | One output line + rule text | Stops a keep from blessing a suggestion worse than asking |
| 4 | Adopt the early stop (two agreeing orders, third on disagreement) | F-2-01 | Keep-Rule/ORDERS amendment, small | −27.6% calls, byte-equal output; −33% with the tie rule at A=31 |
| 5 | Target the none-recognizer: instruction/option text that names the both-and case, measured on a fresh corpus | F-2-04, F-2-05 | Amendment to REQ-006's frozen texts + new labels | Ceiling A=50/54; half-recovery A=39 |
| 6 | Expand per hub only, sk-doc first, sk-design excluded until it has its own rows | F-4-01, F-4-02 | A per-hub fixture and verdict | Avoids generalizing a fleet-wide keep from a mixed corpus |
| 7 | Reuse the exported measurement kit for future default/order judgements (002/019/021 rebuilt their own) | F-4-05, F-4-03 | Refactor, no new statistics | Every future claim carries the same digests, calls log and frozen rule |
| 8 | If live latency must drop further, run one call — best single order is `[none, A, B]` | F-2-03 | Keep-Rule amendment | 54 calls vs 163; stability and unanimity evidence are lost |
| 9 | Keep default-on behind T0/T1; if ever shown, gate on unanimity + per-hub allowlist and re-measure against real rows | F-5-07, F-5-08 | New phase, reader, seam | Bounds a 61.9-percent-wrong suggestion to a shadow until proven |

## Ruled out

- The verdict evidences mode-pick skill between tied modes: 11 of 16 mode rights coincide with the first
  alternative, and the advisor measurements lost twice on the same judgment.
- `none_of_these` means no mode fits: in this corpus none marks "neither alone" both/compare requests.
- A probability threshold can gate the suggestion: right and wrong probabilities are indistinguishable.
- More calls buy accuracy: single-call accuracy equals the majority's; extra calls buy stability only.
- Default-on is a switch flip, and the measured keep justifies showing the suggestion: the seam is absent,
  no reader exists, and on the only quantified corpus the suggestion is wrong most of the time.
- Every clarify hub is a candidate: cli-classifier's branch is unreachable; two hubs clarify with
  checklist sentences rather than modes.

## Method and limits

**Convergence report.** Stop reason `maxIterationsReached`; 5 of 5 iterations completed; questions answered 5 of 5; newInfoRatio trend 0.85 → 0.70 → 0.75 → 0.70 → 0.65 (mean 0.73 — never near the 0.05 threshold,
so the cap governed, as `stopPolicy: max-iterations` requires). No iteration was skipped, no source was
re-read for the same claim twice, and the terminal synthesis record carries the reason in
`deep-research-state.jsonl`.

- Five iterations, all executed inline in this lineage; no nested dispatch, no model call was made by this
  lineage. All quantitative counterfactuals were recomputed from the recorded run
  (`~/.skilled/.labels/runs/047-020-jev-20261002/`), the labeled rows and the committed tree.
- Limits: the fixture is the only quantified corpus and it is constructed (54 prompts written to tie;
  63 percent none); labels are one delegated arbiter read; the current tree's committed-corpus census
  replays with two more prompts than the 2026-09-29 build, so census numbers carry their tree identity.
- The verification outputs this lineage produced (four-way census replay, `runs` copies of the artifacts
  hashed above) live under `research/lineages/deepseek/verification/`.

## Sources

- `~/.skilled/.labels/runs/047-020-jev-20261002/{calls.jsonl,report.json}`, `~/.skilled/.labels/runs/047-020-jev.stdout.txt`
- `~/.skilled/.labels/020-rows.jsonl`, `~/.skilled/.labels/drafts/020-arbiter.jsonl`
- `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/{scratch/fixtures/020-rows.jsonl,scratch/evidence/results.md}`
- `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/{spec.md,goal.md}`
- `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/{decision-record.md,scratch/evidence/card-020.md}`
- `specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/implementation-summary.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/goal.md`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`
- `.skilled/bin/compiled-route.cjs`, `.skilled/bin/lib/compiled-routing/**` (engine, six hub routers, resolve.cjs)
- `research/lineages/deepseek/verification/` (replay and digest outputs)
