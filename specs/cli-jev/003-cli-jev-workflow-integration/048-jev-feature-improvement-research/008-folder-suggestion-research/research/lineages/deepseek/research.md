# Jev spec-folder suggestion (cli-jev feature 022) -- improvement research synthesis

Lineage `deepseek` of the 008-folder-suggestion-research fan-out. Stop policy: max-iterations (5 of 5). All evidence cited below was read from the repository or the operator's run artifacts; no model call, no `jev` invocation and no write outside this lineage occurred in this run.

## 1. Scope and Evidence Discipline

The research question is the five-question brief scoped to feature 022: what drove the measured verdict, how to raise accuracy or lower cost, how to make the measurement trustworthy, where else the same judgment pays off, and what a default-on integration needs. Evidence tiers are marked OBSERVED (read from a receipt), DERIVED (follows from observations) and INFERRED (plausible, unconfirmed). The two strongest receipts are the scorer itself (`.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts`) and the recorded run (`~/.skilled/.labels/runs/047-022-jev-20261002/`, read-only, outside the repository).

## 2. Executive Verdict

**The verdict is arithmetically sound and structurally narrow.** Jev kept (K=40 M=40 A=39 B=30 W=10 L=1 F=0 p=0.0059) by winning 10 of the 11 rows where it disagreed with the best free answer, with zero pick instability. But the free answer it beat was the top listed alternative only: the fixture's target column is wrong on all 40 rows by construction, so the run says nothing about Jev versus the save flow's actual default (proceeding with the target), and its corpus is a built fixture labeled by a delegated arbiter, not the transcript draw feature 022 specifies. [SOURCE: ~/.skilled/.labels/runs/047-022-jev.stdout.txt; score-alignment-suggestion.ts:583-593, :679-690; 047/scratch/evidence/results.md]

**Highest-value moves, in order:** (1) rebuild the corpus from real transcripts with genuine targets and adjudicated labels, then rerun the frozen keep rule; (2) fix the option-description resolution, whose basename collision hit exactly the one row Jev lost; (3) if the model arm goes anywhere near a default path, ship it as a flag-gated interactive suggestion first, never as a silent non-interactive selector. [SOURCE: iteration-002.md F2-02, F2-08; iteration-003.md F3-08; iteration-005.md F5-05]

## 3. The Measurement As Recorded

- Command: `score-alignment-suggestion.ts --score ~/.skilled/.labels/022-rows.jsonl --jev --accept-payload --out <run dir>`; the scorer printed `rows: total=40 labeled=40 callable=40 state_null=0`, `baseline: target=0 top=30 chosen=top`, `margin: 0.10`, and `verdict jev: keep K=40 M=40 A=39 B=30 W=10 L=1 F=0 p=0.0059 baseline=top jev_version=jev 0.6.2 provider=official model=jev-1.13.0`. [SOURCE: ~/.skilled/.labels/runs/047-022-jev.stdout.txt]
- Calls: 121 planned and recorded (120 measured + 1 auth), all exit 0; wall per measured call p50 ~324 ms (min 287, max 448), sequential sum ~39.8 s; planned input tokens 32,927. [SOURCE: ~/.skilled/.labels/runs/047-022-jev-20261002/calls.jsonl; score-alignment-suggestion.ts:1013-1020]
- Verdict math: sign test `binomTail(11,10) = 12/2048 = 0.005859375`; coverage 400>=360; kill not triggered (binomTail(11,1) ~ 0.9995); margin 90>=40; flips 0<=120. [DERIVED from score-alignment-suggestion.ts:603-609, :679-690 and report.json]
- Corpus: 40 rows; every row has a wrong target, exactly 3 alternatives, label == the row's own plan folder (40/40); label sits at alternatives[0] on 30 rows, [1] on 8, [2] on 2. Repository copy has `label: null` on all 40 rows; the scored copy lives at `~/.skilled/.labels/022-rows.jsonl`. [SOURCE: field-wise diff of the two rows files]

## 4. Q1 -- What Drove the Result

1. **The scoring frame.** Three passes per row with rotated option order, modal pick, then four ordered rules (coverage, kill, margin, sign, flips, keep). The binding pass was the sign test; everything else passed or did not trigger. [SOURCE: score-alignment-suggestion.ts:59, :622-632, :653-673, :679-690, :1081-1088]
2. **The baseline collapse.** `chooseBaseline` compares target-right vs top-alternative-right; the fixture's target was never the label, so the target arm scored 0 and the run defaulted to `top` (30/40). [SOURCE: score-alignment-suggestion.ts:583-593; stdout line; 047 results.md]
3. **The signal.** On the 29 rows both answers were right, and on the 10 rows the top alternative was wrong Jev was right on all 10; of the 30 baseline-right rows Jev lost 1. All 11 disagreements came from one row's near-tie loss plus ten clean wins. [DERIVED from report.json counts]
4. **Stability was total.** No row changed its pick across the three rotations (F=0). [SOURCE: calls.jsonl, derived]
5. **The one loss is a semantic near-tie.** f022-001 (label `001-deep-research`) drew `007-classifier-deep-research` on all three passes at pick_prob 0.52/0.58/0.48, the lowest confidence in the run. [SOURCE: calls.jsonl rows f022-001; 022-rows.jsonl]

## 5. Q2 -- Accuracy and Cost Levers

- **Accuracy ceiling here is one row.** Jev's 39/40 is bounded by the one loss, and its value column (10/10 recovery of baseline errors) is at ceiling too. [DERIVED, F2-01]
- **The lost row's correct option was the only option whose description had collapsed to a bare folder name.** `buildDescriber` resolves bare folder names through a global basename index and falls back to the name when a basename is not unique; `001-deep-research` exists with a `description.json` in 9 directories (3 under `z_archive/`). The other three rows listing that option were answered right, so causality is INFERRED; the confirmation is a rerun with path-resolved descriptions. [SOURCE: score-alignment-suggestion.ts:831-834, :838-877; specs tree walk; 022-rows.jsonl]
- **Cost is dominated by the three-pass protocol.** 81 of 120 measured calls returned pick_prob 1.0; gating passes 2-3 on pass-0 confidence would have run 70 calls instead of 120 (-42%) on this corpus, at the price of losing per-row flips for gated rows and requiring a keep-rule amendment. [SOURCE: calls.jsonl derived; score-alignment-suggestion.ts:59, :996-1141]
- **Option text is thin and the token receipt is absent.** The prompt carries one description line per folder, the `description.json` `keywords` array is unused, and no token or price receipt exists in the run directory; per-save cost is ~1.0 s of model wall (3 x p50 324 ms), the batch's 39.8 s being a serial artifact. [SOURCE: score-alignment-suggestion.ts:980-989, :1116-1133; calls.jsonl field set]
- **Run-level gates already control cost** (headroom gate, version/auth/payload gate); no save-level margin gate exists because the validator computes alternative scores but only prints them. [SOURCE: score-alignment-suggestion.ts:731-770, :1269-1276; alignment-validator.ts:530-537]

## 6. Q3 -- Measurement Trust

- **Corpus fidelity.** The spec draws rows from real transcripts with operator labels; the inventory that fed the labeling phase found 0 rows and no transcript directory; the run used a 40-row fixture built later under a fixture allowance, labeled by a delegated arbiter. [SOURCE: 022/spec.md:48-55, :112-115; 042/scratch/evidence/label-inventory-1.md:254; 047/goal.md D4; 047 results.md]
- **Dead target column.** With target right on 0/40 the run measures one of the spec's two free answers; any "beats the target" framing is unsupported, and the target's failure was manufactured by the fixture, not observed in real saves. [SOURCE: 022/spec.md:118; results.md]
- **Label provenance is thin.** A 40-line `{id,label}` draft, no 022 decisions log, no labeler field in the schema, no record of the arbiter's input; every label repeats the row's own folder. [SOURCE: ~/.skilled/.labels/drafts/022-arbiter.jsonl; 042/scratch/evidence/card-022.md §5; 022-rows.jsonl]
- **No artifact pinning.** Scored corpus and run dir live outside the repository; neither is hash-pinned in the packet; the backend is pinned (jev 0.6.2 / jev-1.13.0) but the scorer revision and token use are not. [SOURCE: 047 results.md; report.json; calls.jsonl]
- **What is already right:** the keep rule is dated and frozen before any model run; the baseline is chosen before any call; label/callable/foreign-label gates hold; every call carries an options hash; row text stays out of files. [SOURCE: 022/spec.md:118, :184, REQ-002..007]

**Trust fixes ranked:** real-transcript corpus (T1); adjudicate the 11 discordant rows with a second labeler (T2); record label provenance and the labeler's input set (T3); hash-pin corpus + report + scorer revision (T4); report W+L and an interval beside p (T5); negative controls -- swapped labels, distractor states (T6); one inter-run repetition (T7). [DERIVED, F3-08]

## 7. Q4 -- Where Else the Same Judgment Pays Off

The judgment ("pick the right small-set target from a content signal") appears inside the same save flow four times: the CLI alignment suggestion (built), the data-path alignment suggestion (computed, printed, unusable in non-interactive mode), folder auto-detection (candidates ranked with explicit low-confidence bands but no third answer beyond confirm/fallback), and the explicit-CLI argument (suggestion computed then deliberately bypassed). [SOURCE: folder-detector.ts:1043-1049, :1160, :1187; alignment-validator.ts:522-545, :658-684]

The auto-detection copy is the highest-value unbuilt one because the near-tie gate already exists (`assessSessionConfidence` flags quality ties and <10-point gaps within the recency window) and the production path already falls through on low confidence. [SOURCE: folder-detector.ts:300-325, :1247-1250, :1301-1304, :1346]

Adjacent copies: child-folder ambiguity (refused with a "Did you mean" list), predecessor-memory ties (resolved to null), and the sibling measured features that already monetize the pattern (019 advisor order, 020 router modes, 021 route replay). [SOURCE: generate-context.ts:1020, :1035-1040; find-predecessor-memory.ts:365-372; 019/goal.md:16; 047 results.md rows 020-021]

## 8. Q5 -- Default-On Integration: Needs, Cost, Risk

**Needs (none exist today):** durable revocable payload consent (the scorer's acceptance is per-run); a save-time timeout cap (the scorer's 90 s is batch-scale); a non-interactive policy that never lets a model pick override the below-20% hard block; a kill switch whose off state equals today's behavior; a save-flow call log; and an evidence gate on a non-fixture corpus. [SOURCE: score-alignment-suggestion.ts:65, :552-558, :593-596, :764-767; F3; F5-04]

**Cost:** marginal fire ~0.3-1.0 s of model wall and ~0.3-0.8 k planned tokens (3 or 1 calls by gate); price and fire frequency are UNKNOWN (no receipt; committed-tree census found 2 below-50 events with 0 alternatives). The deciding cost is latency on a save, not tokens. [SOURCE: F2-04..06; 022/implementation-summary.md]

**Risks:** wrong redirect (writes follow the selected folder), premature generalization from a fixture, privacy of session text, latency, hard-block policy drift, injection via session text, and cost blindness. [DERIVED, F5-06]

**Shapes:** S1 flag-gated interactive suggestion first; S2 default-on interactive after S1 evidence; S3 non-interactive adoption only as its own policy decision. All three require amending 047 D6 ("No Jev arm joins a default path"). [SOURCE: 047/goal.md D6; F5-05]

## 9. Recommendations

| # | Recommendation | Evidence | Reversibility |
|---|---|---|---|
| R1 | Rebuild the 022 corpus from real transcripts (>=30 low/infrastructure events with alternatives and states), keep labels operator/arbiter-adjudicated, rerun the frozen keep rule | F3-01, F3-02; 042 unblock condition | High (data only) |
| R2 | Fix description resolution: path-resolve `description.json` before any basename index, and skip archive folders in the index | F2-02 | High (scorer/describer change + tests) |
| R3 | Adjudicate the 11 discordant rows with a second labeler; record agreement and the arbiter's input set | F3-03, F3-04 | High |
| R4 | Hash-pin the scored corpus, `report.json` copy and scorer revision into the packet; report W+L and an interval beside p | F3-05, F3-06 | High |
| R5 | Prototype the flag-gated interactive suggestion (S1) only after R1-R4; shadow it and census fires, picks and acceptance | F5-04, F5-08 | High (flag off = status quo) |
| R6 | Defer non-interactive adoption (S3) and any hard-block interplay to a separate decision record | F5-05, F5-06 | n/a |

## 10. Risks and Preconditions

Preconditions for any served suggestion: the T1/T2 corpus results hold under the frozen keep rule; consent storage exists; the save-time timeout is capped near seconds with skip-on-timeout; the hard block is untouched; a kill switch and call log exist. Until then, serving a model pick would extend a fixture result into a write path. [DERIVED]

## 11. Eliminated Alternatives

- **One fixed pass as the scoring protocol**: removes the flips signal and makes W/L single-sample; rejected without a confidence-gated equivalence study. [F2-08]
- **Order-rotation reduction as an accuracy lever**: rotation produced zero flips, so it neither helps nor hurts accuracy here; it is a stability control. [F1-06]
- **Quoting "+97.5 points over the default"**: the target's 0/40 was manufactured by the fixture; unsupported by real saves. [F3-02]
- **Discarding the verdict because the corpus is a fixture**: the verdict states exactly what it measured; the defect is the inference, not the arithmetic. [F3-08]
- **Model pick overriding the below-20% non-interactive hard block**: rejected on policy. [F5-08]
- **Default-on as the immediate next step**: rejected against 047 D6 and the missing prerequisites. [F5-08]

## Divergence Map

No formal divergent pivots or Council artifacts were used in this lineage. Breadth came from five fixed passes: mechanism (Q1), lever analysis (Q2), provenance audit (Q3), call-site survey (Q4), integration/risk (Q5). Saturated directions: the Q1 mechanism question closed after one pass (no second pass added mechanism); cost is measured only where receipts exist and is UNKNOWN elsewhere (price, fire frequency, description-walk share). Remaining frontier: the real-transcript corpus and the adjudicated label set (T1, T2) which would change what Q3, Q5 and the served-form decision may claim. [SOURCE: findings-registry.json; strategy.md]

## 12. Open Questions

- Do the 022 counts survive a real-transcript corpus with genuine targets? (UNKNOWN; T1.) [F3-01]
- Are the 10 W rows and the 1 L row correctly labeled? (UNKNOWN; T2.) [F3-03]
- What is the price per fire and the fires per week on this repository? (UNKNOWN; no receipt, no census.) [F2-06, F5-03]
- Does the description-collision fix convert f022-001? (INFERRED lever, unconfirmed; R2.) [F2-02]
- Would the same judgment hold in auto-detection near-ties? (UNKNOWN; no census of low-confidence branches.) [F4-02]
- How large is the description-index walk relative to a call at save time? (UNKNOWN; not instrumented.) [F2-08 C3]

## 13. Evidence Index

| Source | Use |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts` | Scorer mechanics, gates, verdict math, describer, option lines |
| `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts` | Both validator paths, thresholds, alternative listing, prompts, hard blocks |
| `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/folder-detector.ts` | Save-flow call sites, redirect, candidate ranking and confidence bands |
| `~/.skilled/.labels/022-rows.jsonl` (external, read-only) | Scored corpus, 40 labeled rows |
| `specs/.../047-.../scratch/fixtures/022-rows.jsonl` | Repository fixture copy (null labels) |
| `~/.skilled/.labels/runs/047-022-jev-20261002/{calls.jsonl,report.json}` (external, read-only) | Call log, counts, p |
| `~/.skilled/.labels/drafts/022-arbiter.jsonl` (external, read-only) | Label draft ({id,label}) |
| `specs/.../047-.../scratch/evidence/results.md` | Recorded corpus provenance and verdict line |
| `specs/.../042-.../scratch/evidence/{label-inventory-1.md,card-022.md}`, `042/spec.md` | Label-gate history, arbiter amendment |
| `specs/.../022-.../{spec.md,plan.md,goal.md,implementation-summary.md}` | Feature contract, REQ, frozen keep rule, census |
| `specs/.../047-.../goal.md` | D1, D4, D6 decisions |
| `specs/.../019-.../goal.md` | Sibling measurement precedent |
| `REPO RULES.md` + `.skilled/repo-rules/{evidence-and-proof,scope-discipline,delegation-and-orchestration,uncertainty-and-honesty}.md` | Operating rules loaded for this run |

## 14. Verification Notes

What was run: read-only inspections only (file reads, ripgrep, Python field analysis over JSONL/JSON artifacts). Commands whose output and exit status were read include the rows-file statistics, the calls.jsonl aggregation, the corpus field diff, the specs-tree description.json walk and the final lineage self-check. No scorer invocation, no model call, no network call, no repository write outside this lineage. What is inferred rather than observed: the causal role of the description collision in the one loss (F2-02); every UNKNOWN in Section 12. What only the operator can verify: the contents of `~/.skilled/.labels` at the time of the original run (read here but outside the repository's history) and whether the arbiter labels match the operator's intent.

## 15. Limitations and Confidence

Mechanism claims (Q1) rest on code + recorded artifacts: confidence high. Cost claims rest on one run's wall times and a planned token estimate: confidence medium; no price data. Corpus-fidelity and label claims rest on direct field inspection: confidence high; their effect on the verdict is a question for the next corpus. Pay-off and integration claims are design judgments grounded in code call sites, not measurements: confidence medium, and explicitly marked. [DERIVED]

## 16. References

- Scorer and validator: see Section 13 rows 1-3; the frozen keep rule is `022/spec.md:118, :184-206`.
- Run evidence: `~/.skilled/.labels/runs/047-022-jev.stdout.txt`, `.../047-022-jev-20261002/{calls.jsonl,report.json}`.
- Corpus: `~/.skilled/.labels/022-rows.jsonl`; repository copy `047/scratch/fixtures/022-rows.jsonl`.
- Packet history: `042/spec.md:40-44, :69`; `047/goal.md`; `047/scratch/evidence/results.md`.
- Iteration evidence: `iterations/iteration-001.md` through `iteration-005.md`; findings in `deltas/iter-001.jsonl` ... `iter-005.jsonl`.

## 17. Iteration Trail

| Iter | Focus | newInfoRatio | Key output |
|---|---|---|---|
| 1 | Q1 mechanism and corpus shape | 0.85 | F1-01..F1-08 |
| 2 | Q2 accuracy and cost levers | 0.80 | F2-01..F2-08 |
| 3 | Q3 measurement trust | 0.82 | F3-01..F3-08 |
| 4 | Q4 pay-off map | 0.78 | F4-01..F4-08 |
| 5 | Q5 default-on needs/cost/risk | 0.80 | F5-01..F5-08 |

## Convergence Report

| Dimension | Result |
|---|---|
| Stop reason | `maxIterationsReached` (5 of 5); convergence telemetry had no early-stop authority. |
| Total iterations | 5 of 5; iteration files, deltas and state records 1..5. |
| Questions answered | 5 of 5 at decision level; residuals listed in Section 12. |
| Average newInfoRatio | 0.81 (0.85, 0.80, 0.82, 0.78, 0.80). |
| Threshold | 0.05; never approached because the forced-depth policy ended the run at the cap. |
| Divergence | No divergent pivots; breadth from five fixed passes. |
| Interpretation | The five questions are answered with the evidence that exists; the next informative step is corpus work (R1, R3), not another reading pass. |
