# Tare — Deem's outcome-grounded benchmark

> *"Zero your scale. Measure decisions, not vibes."*
> (a **tare** is the counterweight used to zero a scale)

Tare is the benchmark harness for Deem, the open decision-model family
(see `../../SPEC.md` §5). It measures **calibrated machine decisions**
against outcomes — never against teacher agreement.

## What Tare measures

| Metric | Question it answers |
|---|---|
| **Accuracy** | How often is the argmax decision right, per domain? |
| **ECE** (10-bin) | Is the stated probability honest? (expected calibration error) |
| **Reliability bins** | Where does calibration break down? (per-bin confidence vs. accuracy) |
| **Brier / log loss** | Does the *whole* distribution carry information, not just the top slot? |
| **Risk-coverage curve + AUC** | What accuracy do you buy at each automation level? |
| **Automation rate @ target accuracy** | What fraction of decisions can be safely automated at 90% (or any) accuracy? |
| **Derived confidence** | `C = (N·p_max − 1)/(N − 1)` — the Jev-style rescaled peak probability |
| **Conditioned flip gate** | Is the permutation flip rate within what honest uncertainty at that accuracy can explain? (§ below) |
| **Consistency probes** | Negation, permutation, paraphrase — scored as *paired accuracy*, not just invariance |
| **Adversarial-state robustness** | (Track under construction) decisions under perturbed/corrupted state |

## Honesty rules

1. **No teacher grading, ever.** Every reference is an outcome or a human
   label. Teacher consensus may be used for *diagnosis*, never as the
   reference score.
2. **Calibration is measured after frozen temperature scaling.** Models are
   calibrated on a disjoint split (see `split.py`); the fitted temperatures
   are published per release, and the harness measures what shipped.
3. **Same item, same split, every run.** Splits are content-hash based
   (`split.py`), so numbers are comparable across releases and machines.
4. **Probes are scored as paired accuracy.** A negation pair earns credit
   only if *both* directions independently produce the correct decision —
   a model can agree with itself and still be wrong. Invariance
   (agreement) is reported for contrast, never as a pass.

## The permutation-flip gate, conditioned on accuracy

The pre-registered gate — flip rate < 2% under option permutation,
unconditionally — is miscalibrated at low accuracy. Position-consistency
is only achievable where the model actually knows the answer: a model
that guesses uniformly on N options flips at ~1 − 1/N (0.75 for N=4),
so a near-chance dataset fails the unconditional gate *by construction*,
honest or not. The gate below conditions on accuracy. Implementation:
`expected_flip_rate` / `conditioned_flip_gate` / `conditioned_flip_ok` in
`metrics.py` (tests in `tests/test_conditioned_flip.py`).

### Expected flip rate under permutation

Idealize the readout under each ordering as an independent draw from the
model's content distribution `p` over the N canonical options (a
deterministic readout with a near-uniform `p` behaves like this: the
argmax is decided by perturbation noise). Two orderings then disagree
with probability

    D(p) = 1 − Σᵢ pᵢ²        (one minus the collision index)

**Random guessing.** For `p = uniform`, `D = 1 − 1/N` — 0.75 at N=4.
Under K orderings scored as all-agree, a uniform guesser flips with
probability `1 − N^(1−K)` (0.984 at N=4, K=4): the independent-sampling
ceiling, and far above any realistic deterministic readout (the honest
near-uniform outlier below flips at 0.347 under the same protocol).

**Confident model.** For `p = δᵢ` — any point mass, correct or not —
`D = 0`. Flips measure *sharpness*, not correctness: a model can be
consistently wrong. (That failure is the accuracy gate's job, not the
flip gate's.)

**Actual max-prob distribution.** Given only the mean top-class
probability `C = E[p_max]`, the worst case (rest of the mass spread
uniformly) and the concavity of `f(m) = 1 − m² − (1−m)²/(N−1)` give the
confidence-conditioned bound `E[flip] ≤ f(C)`, recovering both anchors
above (`f(1/N) = 1 − 1/N`, `f(1) = 0`).

### The accuracy-conditioned null

Bound the model by the honest two-point mixture: on each question it
either *knows* an answer (argmax permutation-invariant, correct with
the probability of its knowledge) or *guesses* uniformly. With guess
fraction `g`, accuracy is `acc = q_c + g/N` and only guessing flips:

    F = g · (1 − 1/N)

Maximizing `F` at fixed accuracy (all knowledge correct) gives the
**honest-null flip rate** — the largest flip rate honest uncertainty can
produce at that accuracy:

    F_null(acc, N) = 1 − acc          if acc ≥ 1/N
                     acc · (N − 1)    if acc ≤ 1/N   (sub-chance)

A model flipping *above* `F_null` is not uncertain, it is position-tied.

### The gate

    PASS  iff  flip_rate ≤ F_null(acc, N) + margin

with `margin = 0.05` (default; ~1 binomial standard error of a flip-rate
estimate at the probe's n=150 rows, where the SE peaks at ~0.035 near
the null's own ceiling). Condition on an accuracy that position
shortcuts cannot inflate — the probe's mean permuted accuracy, or
`min(identity, permuted)` — never identity alone. The unconditional
<2% gate remains reported for continuity; the conditioned gate is the
verdict that enters the exit criteria.

### Verdicts (flip probe, identity + 3 shuffles, 150 rows/dataset)

v5/v6 (checkpoint frozen in v6; probes identical) and RLCD v1 — all
datasets now PASS, including the honest-uncertainty outlier:

| Dataset | N | acc (min id/perm) | flip | F_null | threshold | Verdict |
|---|---|---|---|---|---|---|
| ag_news | 4 | 0.900 | 0.000 | 0.100 | 0.150 | PASS |
| amazon_reviews | 5 | 0.712 | 0.020 | 0.288 | 0.338 | PASS |
| fever | 3 | 0.865 | 0.0067 | 0.135 | 0.185 | PASS |
| mmlu | 4 | 0.467 | 0.347 | 0.533 | 0.583 | PASS |
| snli | 3 | 0.887 | 0.013 | 0.113 | 0.163 | PASS |

(RLCD: identical except amazon acc 0.707, flip 0.020, thr 0.343 and
snli acc 0.880, flip 0.020, thr 0.170 — PASS.)

No should-fail dataset gets a pass — the v2 position-shortcut failure
(flips 0.92–0.99) still fails on every dataset, even mmlu at
near-chance accuracy, and even conditioning v2 ag_news on its *shuffled*
accuracy (0.26 → threshold 0.79 < 0.993):

| Dataset | N | acc | flip | threshold | Verdict |
|---|---|---|---|---|---|
| ag_news | 4 | 0.897 | 0.993 | 0.153 | FAIL |
| amazon_reviews | 5 | 0.378 | 0.987 | 0.672 | FAIL |
| snli | 3 | 0.760 | 0.953 | 0.290 | FAIL |
| mmlu | 4 | 0.253 | 0.987 | 0.797 | FAIL |
| fever | 3 | 0.779 | 0.920 | 0.271 | FAIL |

## Layout

```
eval/tare/
├── metrics.py      # ECE, Brier, log loss, reliability bins, risk-coverage,
│                   # automation rate, derived confidence (pure, stdlib-only)
├── probes.py     # negation / permutation / paraphrase consistency probes
├── split.py      # deterministic sha256-based 80/10/10 train/dev/test split
├── report.py     # results-JSON -> per-domain text table or --format json
├── leaderboard.py  # entry ingest + validation + ranking -> leaderboard.md/.json
├── entries/      # one JSON per leaderboard entry (ours cite repo artifacts)
├── demo.py       # synthetic-data demo; generates demo_results.json
└── tests/        # pytest suite: .venv/bin/pytest eval/tare/tests/ -q
```

## Leaderboard

`leaderboard.py` ingests the entries in `entries/` (ours re-derive their
numbers from the raw eval artifacts in the repo; third-party submissions
cite their own artifacts), validates that every metric traces to a results
file, ranks on the Tare metrics, and emits `leaderboard.md` +
`leaderboard.json`:

```bash
python3 eval/tare/leaderboard.py          # rebuild + write
python3 eval/tare/leaderboard.py --check   # validate entries, print only
```


## Results schema

A results file is a JSON **list of records**. Decision records:

```json
{"domain": "routing", "question_id": "r-0001",
 "probabilities": [0.1, 0.9], "correct_answer": 1, "confidence": 0.8}
```

* `probabilities` — per-option; need not sum to 1 (rescaled defensively)
* `correct_answer` — index of the correct option (outcome- or human-derived)
* `confidence` — *optional* model-supplied confidence (reported, not trusted;
  Tare recomputes derived confidence from the distribution)

Probe records (same `domain`/`question_id`, plus `kind`):

```json
{"kind": "negation",    "domain": "contracts", "question_id": "n-0042",
 "p_a": 0.72, "p_not_a": 0.47, "ground_truth": true}

{"kind": "permutation", "domain": "routing", "question_id": "p-0007",
 "predictions": [0, 0, 1]}
```

* **negation**: `p_a` = P(proposition), `p_not_a` = P(negated proposition),
  `ground_truth` = whether the proposition is true. Reported:
  `consistency_error = mean |P(a) − (1 − P(not a))|` (Jev's documented
  0.72/0.47 failure scores 0.19), plus per-direction accuracy and
  `paired_accuracy` = the worse of the two.
* **permutation**: `predictions` = canonical option id per ordering (or
  `(permuted_index, permutation)` pairs). Reported: flip rate.
* **paraphrase**: `predictions` = predicted option id per prompt template.
  Reported: all-agree consistency and mean majority agreement.

## Usage

```bash
.venv/bin/pytest eval/tare/tests/ -q          # run the test suite
python3 eval/tare/demo.py                     # synthetic end-to-end demo
python3 eval/tare/report.py results.json       # text report
python3 eval/tare/report.py results.json --format json --target-acc 0.95
```

## How to add a domain track

1. **Pick outcome-verified references.** Public labeled datasets, exact-
   probability games, browser tasks with click/outcome checkers, or
   hand-labeled gold rows. If the reference is a teacher, it is not a Tare
   track.
2. **Convert to decision records** using the schema above (one
   `probabilities` vector + `correct_answer` per question). Emit
   `question_id`s that are stable across releases.
3. **Add probe items** where the domain admits them: negation pairs for
   Noul-style tracks, ≥2 permutations per choice question, ≥3 paraphrase
   templates. Probes are mandatory for headline tracks.
4. **Register the domain in the report.** Nothing to code — records are
   grouped by the `domain` field and `report.py` emits the full table
   automatically.
5. **Freeze and version.** Add the track's items to a versioned dataset
   release (Apache-2.0) so scores stay comparable; splits are already
   content-deterministic via `split.py`.

## Vision

Vision tracks (`tare-vision-1`) plug into the same schema: frames are part
of state, decisions remain Choice/Score/Noul, and references remain
click/outcome-verified. The metrics layer does not change.
