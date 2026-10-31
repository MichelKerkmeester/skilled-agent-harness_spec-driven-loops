# Iteration 003 — mimo-03: Deem against Jev on the same judgments: the comparison design

- **Angle:** mimo-03 (W1, maps to A, H)
- **Lens:** UX and measurement. The comparison is designed so one printed line decides.
- **Read first:** `steer.md` re-read (review of iteration 2 landed). Steering for 3-4 applied:
  row counts taken from the files themselves (below), one deciding line pre-registered
  (Finding 4), and every results citation below was verified by `grep -n` on the file
  immediately before writing. `LOCAL:30-53` read: p50 ~60 ms per primitive on synthetic inputs,
  uncalibrated temperature 1.0 (`deem-local.md:27`), quality unmeasured here (`deem-local.md:52`),
  raw probabilities (`deem-local.md:53`). Correction carried from the steer: R22's ~50 labels
  are HVR reader-needed voice passages (BASE2 `research.md:711-716`), kept apart from
  review-finding labels in every sentence here.
- **Sibling check:** Independent: no round-3 sibling file read.

## Finding 1 — the sets that host the comparison at zero new labels (Q1)

Row counts read from the files themselves (`wc -l`):

| Set | Rows | Gold label present | Judgment type it needs | Role |
|---|---|---|---|---|
| `routing-accuracy/labeled-prompts.jsonl` | 195 | `skill_correct`, `gate3_triggers` (127 `yes` / 68 `no`, BASE1 H3 says) | `choice` 2-option (yes/no) and `choice` over candidate skills | accuracy + Gate-3 slice |
| `routing-accuracy/holdout-prompts.jsonl` | 70 | `skill_top_1` from `origin_fixture` | `choice` over candidate skills | held-out routing accuracy |
| `routing-accuracy/ambiguity-prompts.jsonl` | 24 | `skill_top_1` near the boundary (`margin_at_capture`, `tau` fields) | `choice` near boundary | flip-rate set |

289 rows total, prompts only (each row carries a `prompt` field; keys read, values not printed).
The Gate-3 slice is nearly saturated: the archived classifier is at F1 0.9843 with tp 125, fp 2,
fn 2, tn 66 (BASE1 `research.md:1026`), which leaves at most 4 errors to move — the mimo-03
refinement's point confirmed by BASE1's own count. Confirmed by count; judgment-type mapping is
inferred from the row keys.

## Finding 2 — the metric (Q2)

**Agreement with gold decides.** Not agreement between backends: two backends can agree and both
be wrong. The vendored Tare harness states the same honesty rule ("No teacher grading, ever;
every reference is an outcome or a human label", `DEEM/eval/tare/README.md:27-30`, vendor claim).
Secondary lines: the flip rate between backends on identical rows (R1's keep rule used an
aggregate flip rate of at most 0.10, BASE2 `research.md:233`) and calibration (below), which
decides whether any threshold can sit on probabilities at all. Pre-registered thresholds:
agreement-with-gold gap resolution in Finding 4; flip rate ≤ 0.10 borrowed from R1's rule.

## Finding 3 — calibration first (Q3)

The served 0.8B is uncalibrated: no calibration file loaded, every answer reports temperature
1.0 (`deem-local.md:27`) and probabilities are raw (`deem-local.md:53`). Tare's rule 2 measures
calibration after frozen temperature scaling on a disjoint split (`DEEM/eval/tare/README.md:30-32`,
vendor claim; its `split.py` is content-hashed, `:33`). Sizing, counted arithmetic in
`results-mimo-03-power.txt:18`: a single-temperature fit wants >= 50 rows, 5-bin ECE >= 100,
10-bin ECE >= 200 — 200 does not fit beside an evaluation on 289 total rows (`:19`).
**Pre-registered:** a 50-row disjoint calibration split (content-hash), 5-bin ECE on the
remainder; a 10-bin ECE is unmeasurable on this corpus and is printed as `underpowered`, not
estimated.

## Finding 4 — power and the one deciding line (Q4)

Exact-binomial sign-test power line, R1's pre-registered pattern (exact one-sided test at 0.05,
minimum wins and win rate for 80% power; R1's own line: 55 movable rows need a true win rate
near 0.68, BASE2 `research.md:45`, and my table reproduces that point at 49 movable rows
(`results-mimo-03-power.txt:10`, w80=0.68)). The arithmetic is saved at
`results-mimo-03-power.txt:1-13`, verified by `grep -n` before writing.

| Set | Rows | Movable rows | k_crit | Win rate for 80% power |
|---|---|---|---|---|
| ambiguity | 24 | 24 / 12 / 6 | 17 / 10 / 6 | 0.76 / 0.87 / 0.97 (`:2-4`) |
| holdout | 70 | 70 / 35 / 18 | 43 / 23 / 13 | 0.66 / 0.71 / 0.78 (`:5-7`) |
| labeled | 195 | 195 / 98 / 49 | 110 / 58 / 31 | 0.60 / 0.63 / 0.68 (`:8-10`) |
| combined | 289 | 289 / 144 / 72 | 159 / 83 / 44 | 0.58 / 0.61 / 0.66 (`:11-13`) |

**Sets too small:** `ambiguity` (24) detects only enormous gaps — even fully movable it needs a
true win rate of 0.76 (`:2`), and at 6 movable rows 0.97 (`:4`). `holdout` (70) needs 0.66 at
full mobility (`:5`). Only `labeled` (195) and the combined set (289) can separate plausible
gaps, and only when a large share of rows is actually movable.

**Accuracy-side resolution** (conservative unpaired formula, saved at `:14-17`): a 3-point gap
at p~0.95 needs 585 rows per arm (`:14`), a 5-point gap 431 (`:15`), a 10-point gap 137 (`:17`).
289 rows resolve about a 10-point accuracy gap and nothing finer.

**What the operator reads, line by line** (one screen): rows per set, per-backend gold accuracy,
the paired sign-test line (movable rows, k_crit, observed wins), the flip rate, the 5-bin ECE
line, and the verdict line. **The single line that decides, pre-registered here:**

> `Deem non-inferior: PASS iff gold-accuracy gap to Jev is at most 10 points on decided rows
> (exact one-sided sign test, alpha 0.05) AND backend flip rate <= 0.10; otherwise
> INCONCLUSIVE: underpowered for tighter margins (5 points needs ~431 labeled rows per arm).`

Rationale: 10 points is the finest gap this corpus can resolve (`:17`), and printing
`INCONCLUSIVE` rather than a soft pass keeps the answer shape's honesty.

## Finding 5 — what would make the comparison unfair (Q5)

1. **Option caps.** Deem's `choice` requires an `options` list (`DEEM/serve/deem_server.py:533-540`).
   Routing rows must present identical candidate caps to both backends (pre-register top-4
   candidates). What the 0.8B does with more options is unmeasured — inferred; confirmation is
   a sweep over option counts on the 24 ambiguity rows.
2. **Calibration.** Deem probabilities are raw at temperature 1.0 (`deem-local.md:27`, `:53`);
   the Jev-style confidence is a rescaled peak probability
   (`DEEM/eval/tare/README.md:22-23`, vendor claim). Confidence values are never compared
   before the calibration split; only decisions are.
3. **Prompt wording and field shape.** The Python `jev-cli` sends `criteria` and reads
   `answers.answer.<type>` (`JEVSRC:364-369`, `:389-393`), while Deem reads `options` and
   `levels` (`deem_server.py:535-543`) and returns `value` and `level` (`:604-619`). The
   comparison harness feeds identical instruction text to both and translates fields only;
   any paraphrase invalidates the row. (Field gap is inferred from code, unverified live —
   the spec's risk row says the same.)
4. **State length.** The sets are prompt-only rows; judgments carry no repository state, so
   state length is constant by construction. Any later stateful use is a different comparison.
5. **Model update mid-comparison.** `deem-ctl update` switches `models/current` and restarts
   (`deem-local.md:55-70`). Pin model commit `8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21`
   (`deem-local.md:20`), record the commit id on every row, and abort the run if it changes.
6. **Vendor numbers stay vendor claims.** The 0.8B card's accuracy (96.3% long-policy hold-out,
   `deem-local.md:51` area) and all 9B figures are vendor claims and never enter the gold
   column.

## Per-idea record

### N-mimo-03-1 — the two-backend comparison run (measurement slice)

| Field | Content |
|---|---|
| **Idea** | `N-mimo-03-1`: one harness run that answers "is the served 0.8B good enough here" on 289 labeled rows. Type: `run` (batch of `choice` judgments) |
| **Question** | A (accuracy against Jev), H (kill criteria input) |
| **Builds on** | BASE1 H3's Gate-3 corpus (F1 0.9843), BASE2 R1's power-line pattern (`research.md:45`, `:233`) |
| **Value** | The operator gets one printed line that either licenses local-classifier features or kills them; every later verdict rests on it |
| **Seam** | `routing-accuracy/` corpus files as input; the run harness is new code beside `gate3-corpus-runner.mjs` (the existing runner in `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/`) |
| **Metric, baseline, harness** | Gold-accuracy gap + flip rate + 5-bin ECE; baseline: the 0.8B has no accuracy number here (UNKNOWN, `deem-local.md:52`); harness: new comparison runner + the power line at `results-mimo-03-power.txt:1-13` |
| **Savings** | None directly; it prices every downstream idea. Its own cost: 289 rows x 2 backends, Deem arm ~60 ms/row (`deem-local.md:36-38`) = ~17 s local |
| **Cost, latency, privacy** | Deem arm: 289 local calls, prompts leave nothing; Jev arm: 289 keyed calls, prompts leave the machine (prompts only, no repository state) |
| **Two-backend gate** | The harness itself is gated: with one backend it prints single-backend accuracy and `flip rate: n/a`; with neither it prints `no backend` and runs nothing. Jev detection: `jev --version` 0.6.2 + `jev auth status --provider <p>` exit 0; Deem detection: `GET /health` parsing `backend`, refusing `stub` (ALL-4) |
| **Rough LOC** | ~200-300: corpus loader, two adapters, sign-test/ECE/report printing |
| **Verdict** | **build-now for the zero-call slice** (power line + corpus manifest + report format, all above are already computable), **next for the billed run** — it is the gate every other recommendation passes through |
| **Confidence** | Row counts, power and field shapes confirmed from files and code; the 10-point resolvable gap is confirmed arithmetic; option-cap behavior at >4 options is inferred |

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| 289 labeled rows host a two-backend comparison: 195 / 70 / 24 | new | `wc -l` on the three files |
| Sign-test power table: combined set needs win rate 0.58-0.66 for 80% power | new | `results-mimo-03-power.txt:11-13` |
| Ambiguity set (24) is too small except for huge gaps (w80 0.76-0.97) | new | `results-mimo-03-power.txt:2-4` |
| Only ~10-point accuracy gaps resolveable on 289 rows (137/arm); 5 points needs 431/arm | new | `results-mimo-03-power.txt:15`, `:17` |
| One deciding line pre-registered (10-point gap + flip <= 0.10) | new | this file, Finding 4 |
| Calibration split is mandatory (temperature 1.0 uncalibrated); 5-bin ECE only | confirms LOCAL with new arithmetic | `deem-local.md:27`, `results-mimo-03-power.txt:18` |
| R1's power-line pattern transfers to a two-backend comparison | confirms BASE2 with new evidence | BASE2 `research.md:45`, `:233`; `results-mimo-03-power.txt:10` |
| Gate-3 slice has at most 4 movable errors (F1 0.9843) | confirms BASE1 with new evidence | BASE1 `research.md:1026` |

## Hand-off

- mimo-04 must first split re-reads into edit-preceding, post-compaction and partial reads
  (steer), then price re-read avoidance off the split, not off 598.
- mimo-04 prices seams against the p50 384,219 carry (`results-mimo-01-recount.txt:10`, per
  steer's corrected line) and marks hook spawn/connect cost unmeasured (`deem-local.md:50`).
- mimo-08: restrict the validator regex to invocations and require the edited path under the
  validated folder before the 354 becomes a sampling frame (steer).
- Any later iteration citing a results file line re-runs `grep -n` first (steer, twice burned).
