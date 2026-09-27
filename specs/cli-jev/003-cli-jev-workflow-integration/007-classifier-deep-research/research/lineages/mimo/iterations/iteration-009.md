# Iteration 009 — mimo-09: Measurement-first order and operator labor

- **Angle:** mimo-09 (W4, maps to H)
- **Lens:** UX and measurement. W4 rule: read all own iterations and the newest of each sibling
  first — done (iterations 1-8 are mine; grok-010, deepseek-010, swe-010, glm-005 all read).
- **Read first:** `steer.md` unchanged. BASE2 section 9 (this iteration's read,
  `research.md:446-499`): its order is "free numbers first, the first billed call second, labels
  third and later arms last", its cost table prices operator minutes per item, and its kill lines
  are printed strings fixed in each phase spec. Note: BASE2's "mimo-05" rows are round-2
  lineage numbering, not this lineage's iteration ids — kept apart.
- **Sibling check (W4 contract):** newest of each other lineage unchanged (grok-010, deepseek-010,
  swe-010, glm-005 — all previously read). No new sibling file.

## Finding 1 — the slice that produces a usable number soonest (Q1)

**The 002 census slice (swe-10's `score-jev-tiebreak.mjs` first PR).** Their observable check
prints per-file counts, holdout top-1 `53/70`, the comparator table and the power line in one run,
zero calls, and the diff is two files (swe-10, their design read in iteration 7). What the
operator reads: **one report**, and its first line answers "is a judgment arm reachable here at
all" (`no headroom` / `underpowered` / the win rate needed). Runner-up with my own harness:
N-mimo-06-1's sk-design router replay (53 scenarios, misroute count — the number question F has
never had). Third: mimo-03's comparison zero-call slice (power line + corpus manifest).

## Finding 2 — operator minutes per phase, and what fails with none (Q2)

| Phase slice | Operator minutes | Fails if the operator gives none? |
|---|---|---|
| 002 census (swe-10) | 0 (it is `node score-jev-tiebreak.mjs`) | **No** |
| sk-design replay (N-mimo-06-1) | 0-15 | **No** |
| Read-ledger / hook cap (N-mimo-04-2/-3) | 0-15 | **No** |
| Stage-2 router replay (N-glm-03-1) | ~30 (pinning review, my iteration-7 estimate) | **No** |
| Marked-week tallies (N-mimo-05-1) | ~5/day for one week | Produces a bound, not a number, without them |
| Comparison zero-call slice (N-mimo-03-1) | 0 | **No** |
| Comparison billed run (289 × 2) | ~10 + a Jev key yes | **Yes on the Jev side**: with no key the Jev arm is dormant (parent D1) and the run degrades to Deem-vs-gold; still runs |
| Cite-drift workflow (N-mimo-08-1) | 80 (40 labels) | **Yes**: no labels → precision unmeasurable → the pre-registered stop rule fires `kill` |
| Compaction keep/drop arm (N-mimo-04-1) | included in the comparison's labels | **Yes**: its keep rule needs the accuracy line |
| sk-prompt / sk-design judged features | 4-5 h labels each | **Yes** — and both stay later/drop on their own arithmetic |

The pattern the operator should see: **every zero-call slice survives a zero-minute operator; the
first judged feature is 80 minutes; everything after that is 3.5-5 h per feature.** (Minutes are
my estimates on the counted label sizes; the counts are in iterations 2, 4, 5, 8.)

## Finding 3 — savings per survivor, from counts (Q3)

| Survivor | Context tokens/week | AI passes/week | Minutes/week | Source |
|---|---|---|---|---|
| Stage-2 router replay | ~6.3 MB tool-result bytes ≈ 1.6M derived tokens (4 B/token, marked) + leaf re-scoring attention | loads that no longer happen: 210/day | tool time only | mine: `results-mimo-04-buckets.txt:49,56` |
| Read-ledger | ~1.4 MB/40d (counted bytes) | 15 re-reads (counted) | ~2 | mine: `results-mimo-04.txt:6` |
| Hook retention cap | context side 2.5 MB/week (counted); storage 546.2 MB/40d | 0 | 0 | mine: `results-mimo-01-recount.txt:65,69,154` |
| Compaction arm | post-compaction re-creation UNKNOWN | up to 51 recovery reads (counted base) | up to 68 user-wait (swe-004's 104 s, marked) | mine + theirs |
| Cite-drift workflow | UNMEASURED | UNMEASURED (W3 rule) | reader baseline 8-15 h per full audit (swe-06's estimate) | theirs |
| 002 census + comparison | 0 (measurement) | 0 | reports only | theirs + mine |

## Finding 4 — measurements that must come first (Q4)

1. **`LOCAL` before any Deem arm** — it exists (`deem-local.md`), and no Deem feature ranks above
   `later` without an accuracy set (my iteration-01 rule, still standing).
2. **002's latency record before any live form** (BASE2 section 9's rule, `research.md:446+`).
3. **The mimo-03 accuracy line before any judged keep rule** — the compaction arm's flip ≤ 0.10
   rule is uninterpretable without it.
4. **Calibration before any threshold** — the 0.8B is uncalibrated (`deem-local.md:27`); the
   50-row split is pre-registered in iteration 3.
5. **N-mimo-06-1's replay before any question-F classifier** — the misroute count decides whether
   one is even wanted.
6. **The marked-week tally before any sk-prompt/sk-design build** — usage is a bound, not a count.

## Finding 5 — the order (Q5)

1. **Free numbers:** the 002 census slice, the sk-design replay, the read-ledger and the hook cap.
   All zero-call. The operator reads three reports and approves two small fixes.
2. **Zero-call routing:** the stage-2 replay after its ~30 min pinning review.
3. **The comparison:** its zero-call slice now; the billed 289×2 run on the operator's Jev yes
   (Deem-only vs gold if no key). Prints the one deciding line from iteration 3.
4. **The first judged feature:** the cite-drift workflow (80 min of labels), past its printed
   stop rule.
5. **The compaction arm:** only after step 3's accuracy line, with its keep rule printed.
6. **Everything else stays later or drop:** sk-prompt picks (later), sk-design routing (drop),
  CLEAR (drop), tool-output pruning (later, cache-bust unmeasured), validator-residue flagger
  (drop — its population is empty, iteration 8).

## Per-idea record

### N-mimo-09-1 — the measurement-first program (the order as one artifact)

| Field | Content |
|---|---|
| **Idea** | `N-mimo-09-1`: adopt the six-step order above as the synthesis's build order, with operator minutes printed per step. Type: `run` (the program) |
| **Question** | H |
| **Builds on** | BASE2 section 9's order (extended: two backends, zero-call-first from my counts) |
| **Value** | The operator spends 0 minutes before the first numbers, 80 before the first judged feature, and can stop at any step with everything already measured |
| **Seam** | the phase specs' step lists (002/003/005/006 and the new Planned phases) |
| **Metric, baseline, harness** | operator minutes per printed number; baseline: round 2 priced 2-2.5 h total (BASE2's line, theirs); harness = each slice's own report |
| **Savings** | as Finding 3's table |
| **Cost, latency, privacy** | per-slice; the only egress is the comparison's Jev arm (prompts only) |
| **Two-backend gate** | steps 1-2 need none; step 3's Deem arm is local, its Jev arm needs a key; steps 4-5 are gated per feature |
| **Rough LOC** | 0 (an order) |
| **Verdict** | **build-now as the synthesis's order** |
| **Confidence** | the minutes are estimates on counted label sizes; the counts are confirmed |

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| The first usable number is the 002 census report, at 0 operator minutes | confirms BASE2's "free numbers first" with new evidence | BASE2 `research.md:446+`, swe-10 |
| Every zero-call slice survives a zero-minute operator; the first judged feature is 80 min | new | Finding 2 |
| Savings table per survivor with counted bases and named UNKNOWNs | new | Finding 3 |
| Six measurements-before-builds rules (calibration, latency record, accuracy line, replay, tally) | new (extends BASE2's two) | Finding 4 |
| The order's last step is drop, not later, for the empty-frame flagger | new | Finding 5, iteration 8 |

## Hand-off

- mimo-10 prints the kill lines as numbers for each survivor in this order.
- The synthesis's H answer is Findings 3-5 plus iteration 10's kill table.
