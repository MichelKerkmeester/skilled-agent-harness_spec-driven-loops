# Iteration 1 — mimo-01: Is R1 powered? A zero-call headroom estimate from committed data

**Lineage:** `mimo` (UX and measurement lens)
**Session:** `fanout-mimo-1790457982528-yjdrdz`
**Focus Area:** `mimo-01` — Is R1 powered? A zero-call headroom estimate from committed data
**Angle question:** From committed fields only, what bounds exist on R1's movable rows, what does the exact sign test need to reach power, and what does the operator read when the arm reports?

## Grounding opened this iteration

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json` — all pinned metrics and corpus hashes.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl` — fields `bucket,gate3_reason_category,gate3_triggers,id,notes,prompt,skill_correct,skill_top_1,source_type`; 195 rows; gold distribution counted by `jq`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl` — fields `id,origin_fixture,prompt,skill_top_1,source_type`; 70 rows; gold distribution counted by `jq`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/ambiguity-prompts.jsonl` — fields `bucket,captured_at,id,margin_at_capture,prompt,skill_top_1,source_type,tau`; 24 rows; margins and gold counted by `jq`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/derive-ambiguity-slice.mjs:35-70` — `TAU = 0.03`, the pinned env including `VITEST = 'true'`, and `topTwoMargin` over all candidates.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs:35-46,70-97` — alias-aware `isTop1Correct`, `scoreSet`, the unknown and false-fire counters.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:7-58` — the live cluster rule and `applyAmbiguity`.
- `.skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:25-45` — `defaultShadowDeltaPath` resolves `runtime/data/shadow-deltas.jsonl`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-outcome-rerank.mjs:85-93,119-123,145-160` — reciprocal rank, the even/odd lexical split, `earns_flip`.
- Counts run read-only: `jq`/`node -e` one-liners over the committed JSONL and closed-form binomial arithmetic. No scorer, no repository module, no `jev` command of either package, no network, no `.env` opened.

## Derived numbers (all arithmetic shown)

**Movable-row bounds from committed fields only.** A movable row needs the gold skill inside the live cluster but not first.

1. Labeled file, 195 rows: 18 gold-none (`jq select(.skill_top_1=="none")`), 177 skill-firing. The baseline records `unknown_count` 13 (top is null) and `gold_none_false_fire` 5 (`capture-scorer-eval-baseline.mjs:96-97` counts `row.skill_top_1 === 'none' && top !== null`). Every gold-none row is therefore either a false fire (5) or a null-top abstention (18 − 5 = 13), and the 13 abstentions exhaust `unknown_count` 13, so no skill-firing row abstains. Alias-aware top-1 correct is 152/195, so skill-firing correct = 152 − 13 = 139 and skill-firing gold-not-first = 177 − 139 = **38**. Movable ≤ 38.
2. Holdout file, 70 rows: 6 gold-none, 64 skill-firing. The baseline records no abstention or false-fire counters for the holdout, so the committed bound is the not-correct count: 70 − 53 = **17**. Movable ≤ 17.
3. Census total (the 241 rows R1's census covers): **0 ≤ movable ≤ 55**.
4. Frozen tau 0.03 slice, 24 rows: 18/24 correct → not-first ≤ 6, and **5 of the 24 slice rows are gold-none** (counted today), which can never be movable because a `none` answer is an abstention that keeps the scorer's order (BASE R1). The slice is enriched in abstention rows: 20.8% against 18/195 = 9.2% in the corpus.

**Sign-test arithmetic.** The test is exact one-sided: reject when `P(Bin(n,0.5) ≥ x) ≤ 0.05`, ties excluded (BASE R1 outcome rule; `score-outcome-rerank.mjs:85-87` scores reciprocal rank so ties are win/loss/tie per row).

- Smallest win count with zero losses printing `keep`: w = 5 gives p = 0.5^5 = 0.03125 ≤ 0.05; w = 4 gives 0.0625. **5 of 5 is the minimum**, as BASE states.
- Critical values x_crit(n) and the true win rate q* at which power reaches 0.80 (`P(Bin(n,q*) ≥ x_crit) = 0.80`, bisection on the binomial tail):

| decided rows n | x_crit | power at q=0.5 | q* for 80% power |
|---|---|---|---|
| 5 | 5 | 0.031 | 0.956 |
| 6 | 6 | 0.016 | 0.964 |
| 8 | 7 | 0.035 | 0.896 |
| 10 | 9 | 0.011 | 0.917 |
| 20 | 15 | 0.021 | 0.799 |
| 30 | 20 | 0.049 | 0.718 |
| 55 | 35 | 0.029 | 0.680 |

Two consequences. First, at n = 6 the critical value is 6, so one loss among six decided rows makes `keep` impossible; between n = 5 and n = 7 a single loss is fatal. Second, even at the upper bound of 55 movable rows the arm needs a true win rate near 0.68 to reach 80% power, and at a realistic 10 movable rows it needs about 0.92. **The binding power constraint is the win rate, not the row count** — the census can find 20 movable rows and the arm can still be underpowered in substance while BASE's `underpowered` label (fewer than 5 movable rows) never fires.

**Flip-rate resolution with 3 reruns.** Per row, 3 reruns give modal share 1, 2/3, or 1/3; BASE's per-row flip rate is therefore in {0, 1/3} among decided rows (all-three-different rows are `unstable` and excluded). A per-row cap of 0.10 admits only 0, i.e. "all three picks identical". The cap is unmeasurable as written at row level; as an aggregate (total flips over rows × reruns) it is measurable at resolution 1/(3N).

## Per-idea records

### Idea 1: `R1` — the offline advisor tie-break arm, census first (choice)

| Field | Record |
|---|---|
| **Idea** | `R1`: a `choice` over the passing top skill, its `ambiguousWith` members and `none`, Python `jev-cli` 0.6.2, after a zero-call census. Judged: which skill should lead the advisor's near-tie cluster. |
| **Builds on** | BASE R1 and BASE §4 items 3–5 and 10–14; round-2 questions 30 and 21. |
| **Value** | The operator's decision is which skill goes first when the advisor's scores call a near-tie; today the fused order decides (`ambiguity.ts:22-36` writes the cluster, `fusion.ts:749-776` sorts, cited in BASE and the union rule reopened here). The census now also decides, before any call, whether the arm can ever reach power. |
| **Seam** | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:22-38` — `ambiguousCluster` unions score-margin ≤ 0.05 and confidence-margin ≤ 0.05 over passing recommendations; a candidate is unambiguous only outside both margins. Opened this iteration. Eval side: `score-outcome-rerank.mjs:85-93` (reciprocal rank, `inTopK`), `:119-123` (even/odd lexical split), `:155` (`earns_flip`). |
| **Metric, baseline, harness** | Census counts over 241 rows (177 labeled skill-firing + 64 holdout skill-firing), alias-aware per `capture-scorer-eval-baseline.mjs:70-76`. Baselines re-confirmed: holdout top-1 53/70, slice 18/24 at tau 0.03, full corpus 152/195 (`scorer-eval-baseline.json`). Committed-field bound: movable ≤ 38 + 17 = 55. Power table above. Harness H2 plus the census itself. |
| **Cost, latency, privacy** | Census: zero calls. Arm ceiling 723 calls (241 × 3). Corpus prompts and skill descriptions leave the machine (BASE R1 cost row, unchanged). No deadline: a person runs it. |
| **Key gate and no-key behavior (D5)** | Unchanged from BASE R1: explicit `--jev` flag, D5 gate in order, skip line `jev arm skipped: <check>`, default run byte-identical and spawning no `jev`. Nothing in this iteration's numbers changes the gate. |
| **Rough LOC** | BASE estimate 250–320 LOC for `score-jev-tiebreak.mjs` stands; this iteration adds no code. |
| **Verdict** | **build-now, census unchanged; the arm's pre-registered interpretation changes.** The census is still the only zero-call number that decides, and it now must also print the power curve: `underpowered` should fire on power (q* above any plausible win rate at the found n) as well as on fewer than 5 movable rows. |
| **Confidence** | Confirmed from counts and closed-form arithmetic: all bounds, the power table, the flip-rate resolution. Inferred: that gold-not-first rows place their gold inside the cluster — what would confirm: the census's cluster column. |

### Idea 2: `N-mimo-01-1` — repair the flip-rate clause before the arm runs (amendment to R1's keep rule, no Jev call)

| Field | Record |
|---|---|
| **Idea** | Amend R1's fourth keep condition from "per-row flip rate across reruns of at most 0.10" to an aggregate flip rate over decided rows × reruns, with the per-row rule stated as "a decided row is unanimous across 3 reruns; a 2-of-3 row is reported and counts 1/3 toward the aggregate". |
| **Builds on** | BASE R1's outcome rule, fourth condition. |
| **Value** | As written the condition cannot fail in the way its author intended: per-row it is either 0 or 1/3, so 0.10 is a unanimity test wearing a rate's clothes. Either the test is unanimity (state it) or the rate is aggregate (measure it). The operator reading a printed `flip rate 0.07` needs to know which. |
| **Seam** | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-outcome-rerank.mjs:155` shows the precedent: `earns_flip` is an aggregate comparison of rerun metrics, not a per-row rate. Opened this iteration. |
| **Metric, baseline, harness** | Aggregate flips / (decided rows × 3), resolution 1/(3N); baseline 0 (no reruns recorded anywhere). Harness: R1's own `calls.jsonl`. |
| **Cost, latency, privacy** | None: this is a rule text change in the phase spec before build. |
| **Key gate and no-key behavior (D5)** | Not a call path; nothing to gate. |
| **Rough LOC** | Zero code; one sentence in 002's spec and BASE's rule text. |
| **Verdict** | **build-now (as spec text).** An undefined case in a pre-registered rule is exactly what the pre-registration exists to catch; fixing it after seeing results would bias the verdict. |
| **Confidence** | Confirmed: the resolution argument follows from 3 reruns and modal picks (BASE R1: "3 reruns and one modal pick per eligible row"). |

### Idea 3: `N-mimo-01-2` — widen R21's trigger from `underpowered` to "power curve cannot reach 0.80" (noul calibration, conditional)

| Field | Record |
|---|---|
| **Idea** | R21 (Gate 3 calibration `noul`, 195 prompts × 3) runs not only when the census prints `underpowered` (fewer than 5 movable rows) but whenever the printed power curve shows q* for 80% power above the win rate the arm would need to demonstrate — the arm would return a verdict almost nobody could earn. |
| **Builds on** | BASE R21 (conditional on `underpowered`) and the power table above. |
| **Value** | 002 always returns a Jev number (latency p50/p95, flip rate, calibration) even when the arm's verdict is structurally `inconclusive`; the operator stops waiting on a test that cannot pass. It separates "Jev reads this repository's prompts badly" from "the advisor leaves no room" exactly when the row count alone cannot. |
| **Seam** | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl` `gate3_triggers` field (opened this iteration, field list confirmed); the conditional lives in R1's script decision, not in a new file. |
| **Metric, baseline, harness** | Same as BASE R21: accuracy, F1, Brier against the classifier's 0.9843 archive. |
| **Cost, latency, privacy** | 585 short calls only when the trigger fires; payload is the same corpus prompts R1 sends (BASE R21 row). |
| **Key gate and no-key behavior (D5)** | Under R1's flag and gate, no new flag; with the gate failing it prints R1's skip line and nothing else changes. |
| **Rough LOC** | BASE: 40–60 LOC inside `score-jev-tiebreak.mjs`; the widened trigger adds a comparison against the printed power table, about 5 LOC. |
| **Verdict** | **next.** It is conditional machinery whose trigger definition must be settled before 002's spec freezes, but it is not needed until the census prints. |
| **Confidence** | Inferred: that a structurally underpowered arm wastes operator attention — what would confirm: one census run showing, say, 20 movable rows and q* near 0.8. |

## Question 21 answered: the live ambiguity rate is unrecorded

`defaultShadowDeltaPath` resolves `.skilled/skills/system-skill-advisor/runtime/data/shadow-deltas.jsonl` (`shadow-sink.ts:35-36`, opened this iteration). That directory exists in both the main checkout and this worktree and holds only `prompt-policy.default.json` and `README.md`; the sink file exists in neither. Count of recorded `ambiguousWith` events: **0**. If R1 keeps and R3's served order were live today, the number of fires it would have had is recorded nowhere. One run observation, not a repo count: this lineage's own orchestrator dispatch records the advisor hook as `outage (fail_open)`, which is consistent with a sink that has never been written.

## Operator's view of R1's report (question 5)

Proposed layout, in print order, from BASE R1's proof plan steps 1–4:

1. `census: <file> rows=<n> eligible=<e> movable=<m> gold-first=<g> top3=<t> tau-slice=<s>` — one line per file and split.
2. `power: movable=<m> need-wins=<x_crit>/<n> q80=<q*>` — the line that says whether the arm can earn anything.
3. `baseline: holdout-top1=53/70 ok` or `baseline mismatch: comparison void` — boundary; the arm does not run on mismatch.
4. `comparators: <name> mrr= right@1= right@3=` for confidence order, always-second, outcome-weighted rerank.
5. With `--jev`: `payload: corpus prompts + skill descriptions; planned calls=<n>` before the first billed call, then `calls: <n> wall-p50= wall-p95=`.
6. `results: <W>W <L>L <T>T sign-p=<p> flip-aggregate=<f>` then **exactly one verdict line**: `verdict: keep|kill|underpowered|inconclusive`.

**The single line that decides is line 6's verdict line.** Everything above it exists so the operator can disbelieve it. The default run prints lines 1–4 and stops; with no key or a failed check, `jev arm skipped: <check>` replaces lines 5–6 and the rest is byte-identical (BASE R1, D5).

## Ruled out this iteration

- Running `score-outcome-rerank.mjs`, `capture-scorer-eval-baseline.mjs` or `derive-ambiguity-slice.mjs` to get exact cluster membership: the contract forbids running repository modules, and the census is the build that produces those numbers. Bounds from committed fields were the point.
- Deriving per-row cluster membership from `ambiguity-prompts.jsonl`: the file stores only `margin_at_capture` (top-two raw margin), not candidate lists (`ambiguity-prompts.jsonl` field list, opened this iteration).
- A tighter holdout bound: the holdout carries no unknown or false-fire counters in the baseline (`scorer-eval-baseline.json`, opened this iteration), so 17 stands as the committed bound.
- Any live `jev` call of either package: forbidden by the per-iteration contract.

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence, or restated | Evidence |
|---|---|---|
| Movable rows across R1's 241 census rows are bounded 0 ≤ movable ≤ 55 (38 labeled + 17 holdout); the labeled bound of 38 is derivable because all 13 abstentions are gold-none | new | `scorer-eval-baseline.json` metrics + `jq` counts over `labeled-prompts.jsonl`, `holdout-prompts.jsonl`; derivation above |
| The frozen slice is enriched in gold-none rows: 5 of 24 (20.8%) against 18 of 195 (9.2%), so its 6 wrong rows overstate movable headroom | new | `jq` over `ambiguity-prompts.jsonl` and `labeled-prompts.jsonl`, counted today |
| The exact sign test needs q* ≈ 0.92 (n=10) to 0.68 (n=55) for 80% power; at n=6 one loss makes `keep` impossible | new | closed-form binomial table above |
| BASE's `underpowered` trigger (fewer than 5 movable rows) can miss substantive underpower: 20 movable rows still need a 0.80 true win rate | new | same table; contests the placement of BASE R1's boundary condition |
| With 3 reruns the per-row flip rate is in {0, 1/3}, so BASE's per-row 0.10 cap is a unanimity test; it must be aggregate or restated | new | BASE R1 "3 reruns and one modal pick"; arithmetic above |
| The live cluster unions score and confidence margins at 0.05 over passing skills; unambiguous means outside both | confirms BASE with new evidence | `ambiguity.ts:22-38` reopened with its in-code comment |
| 11 of 24 frozen margins negative, 2 zero (11 positive) | confirms BASE with new evidence | `jq` over `ambiguity-prompts.jsonl` `margin_at_capture`, counted today; BASE D4 |
| The live `ambiguousWith` rate is unrecorded: `shadow-deltas.jsonl` absent in the main checkout and this worktree | new (BASE question 21 was UNKNOWN) | `runtime/data/` listing in both checkouts, `shadow-sink.ts:35-36` |

## Sibling check

Independent: no round-2 sibling file read.

## Hand-off

- mimo-02 must settle the D5 base rate with the stratified sample; its interval decides whether R20's 5% stop rule survives.
- The census script must print the power line (`movable`, `need-wins`, `q80`) — hand to whoever writes `score-jev-tiebreak.mjs`'s first slice (swe-01 territory) and to 002's spec.
- Resolve the flip-rate clause (aggregate vs unanimity) in 002's spec before any run; N-mimo-01-1 is the text.
- Question 21 is answered for this environment (0 records); if the operator has run the advisor in another checkout, one `wc -l` over its `shadow-deltas.jsonl` would replace this.
- W2 iterations must read the newest sibling files before pushing past; check `../grok/`, `../swe/`, `../deepseek/` `iterations/` at iteration 3.
