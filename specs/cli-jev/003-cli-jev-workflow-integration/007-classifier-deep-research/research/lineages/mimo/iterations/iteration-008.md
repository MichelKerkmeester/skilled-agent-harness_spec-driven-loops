# Iteration 008 — mimo-08: A validator-judgment workflow, measured

- **Angle:** mimo-08 (W3, maps to D, G)
- **Lens:** UX and measurement. W3 rule: every proposed workflow carries a metric, a counted
  baseline and a harness, or is recorded unmeasured.
- **Read first:** `steer.md` unchanged. Named siblings opened this iteration: `swe-002` (its
  14-check residue map) and `deepseek-003` (its 40-rule M/P/A map) — the angle's open-first list.
  `swe-006` read in iteration 4. `mimo-02` is my own.
- **Sibling check (W3 contract):** newest of each lineage unchanged since iteration 7's check
  (grok-010, deepseek-010, swe-010, glm-005 — all read). No new sibling file this iteration.

## Finding 1 — the steer's strict count: the 354 collapses to zero (Q1 input)

The lead required two restrictions before the 354 could become a sampling frame: the validator
regex must match invocations only, and the edited path must sit under the validated folder. Both
applied in `count-validator-residue2.py` (invocation boundary match at `:24-29`, folder scoping
at `:56-66`), output `results-mimo-08.txt` (cited `r8`, grep-verified):

| Count | Value |
|---|---|
| validator invocations (40 days) | 2,471 (`r8:2`) — against the 8,364 mention-matches of iteration 2 |
| invocations carrying a folder token | 2,455 (`r8:3`) |
| passing invocations | 2,435 (`r8:4`) |
| **passing, then an `.md` edit under the validated folder within 6 assistant records** | **0** (`r8:5`) |
| passing, then an `.md` edit elsewhere | 193 (`r8:6`) |

**Confirmed by count: the strict residue — the AI re-editing a document that just passed its own
validator — occurred zero times in 40 days.** The 193 in-window edits elsewhere are consistent
with the real workflow (validate folder A, then edit folder B). Iteration 2's 354 retires as an
upper bound that the steer correctly voided. This is the mimo lens's most useful negative
finding in question D: **the post-pass-edit residue is not a real population.**

## Finding 2 — what the top residue actually is (Q1)

With the strict population gone, the top residue with a real sampling frame is the one
swe-06 counted and deepseek-03's map named: **citation drift** — `AC_COVERAGE` counts `file:line`
presence but never verifies the cited line supports the row (deepseek-03 F4, their read), and
456 `file:line` citations live under `.skilled/skills/**/*.md` (swe-06's count; their units are
claim + ~15 cited lines ≈ 300 tokens each). The other candidates lose on the frame:
mimo-02's correctness/traceability rows are review findings untied to passed documents (the
steer's defect note), description-fit (3,551 fields, swe-02's count) is agreement-expensive, and
the HVR voice residue is R22's ~50-label problem (BASE2 `research.md:711-716` — kept apart).

## Finding 3 — the label plan (Q1)

| Element | Plan |
|---|---|
| How many | **40 labeled cites** (swe-06's sizing; enough for a first precision figure at ±0.15 binomial width — at n=40 and p~0.8, the 95% half-width is ~0.12, marked arithmetic) |
| Drawn how | 20 constructed (deliberately drift a cited target's line — manufacturable, swe-06's insight) + 20 sampled live cites stratified across doc kinds (skill, command, spec, reference) |
| Labeled by whom | the operator (author-level judgment: "does this line support this sentence") |
| In how many minutes | 2 min/cite × 40 ≈ **80 minutes** (mimo-02's per-label labor rate, estimate) |

## Finding 4 — the metric (Q2)

**Precision at the recall the author needs, against the baseline of a reader alone.**
Pre-registered: the scanner is advisory and exit-0 (swe-06's contract), so the cost side is false
flags; the bar is **precision ≥ 0.8** on the 40-row set, reported at whatever recall the set
resolves (recall needs a larger true-drift population — recorded as unmeasured until the 20
constructed rows give a floor). Baseline of a reader alone: a manual cite audit is open-file,
read-line, compare — swe-06's estimate 8-15 h per full 456-cite pass (theirs, marked).

## Finding 5 — savings, flag UX and the stop rule (Q3, Q4, Q5)

- **Savings in AI passes per week at precision 0.8: UNMEASURED.** No count in any results file
  measures cite-checking turns today (the corpus has no such marker). The harness that would
  measure it: one marked week of the scanner's flags vs the reader's corrections. Recorded as
  unmeasured per the W3 rule — not estimated.
- **What the author sees and does with a flag:** one line,
  `cite drift: <doc>:<line> -> <target>:<line> (<verdict>)` (swe-06's report shape), per
  non-support verdict; the author opens the target line and fixes either the doc's claim or the
  code. No panel, no score, no default verdict — a malformed classifier answer is an `unasked`
  row, never a verdict (swe-06's rule, adopted).
- **Pre-registered stop rule:** kill the feature if (a) precision on the 40-row set is < 0.8, or
  (b) the live drift rate is < 1 per 100 cites (below glm-03 F4's recurrence bar of one counted
  firing/week — at tens of changed-doc cites/week, 1% is the floor where the scanner never
  fires), or (c) the constructed rows show the judgment is not near-objective (operator
  agreement < 0.8 on the 20 constructed rows). Any one firing prints `kill`.

## Per-idea record

### N-mimo-08-1 — the citation-drift judgment workflow (label set + stop rule)

| Field | Content |
|---|---|
| **Idea** | `N-mimo-08-1`: the measured workflow around swe-06's `cite-drift-scan` — 40 labels, precision bar, stop rule. Type: `noul` ("does this line support this claim") |
| **Question** | D, G |
| **Builds on** | N-swe-06-1 (swe-06); deepseek-03 F4's gap; my strict-count zero (the frame that forced the pivot) |
| **Value** | The author sees a rotting citation at scan time instead of at review time; the 456-cite audit becomes one offline pass |
| **Seam** | new `shared/scripts/cite-drift-scan.mjs` beside sk-doc scripts (swe-06's placement); nothing existing is edited |
| **Metric, baseline, harness** | precision@recall on 40 labels; baseline: cites are never checked today (UNKNOWN, confirmed by absence — `reference_checker` verifies shape/existence only, swe-02's map); harness = the scanner's report + the 40-row set |
| **Savings** | UNMEASURED in AI passes (Finding 5); reader minutes baseline 8-15 h per full audit (swe-06's estimate) |
| **Cost, latency, privacy** | ≤456 `noul` calls per full audit, ~60 ms each on Deem local (`deem-local.md:36-38`); claim + ~300-token window per call; Jev egresses that window only; the recurring path is changed-doc cites only |
| **Two-backend gate** | own switch `--cite-backend deem|jev|none`, default `none`; Deem health probe (backend ≠ stub, model pin per deepseek-10 F2's text); Jev D5 checks; dead cites need no call at all; neither → `cite-scan: skipped (no backend)` exit 0 |
| **Rough LOC** | ~180 script + ~120 tests + 40 labels (swe-06's sizing) |
| **Verdict** | **next** — the cheapest judged option in question D (80 min of labels vs 3.5-5 h elsewhere) and its stop rule is printed before it runs |
| **Confidence** | the strict-count zero and the 456-unit frame are confirmed; precision 0.8 and the 80 min are estimates — the 40-row set confirms both |

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| Strict post-pass same-folder edits: 0 in 40 days (2,435 passing invocations) | new (negative knowledge; retires the 354) | `r8:2-5` |
| The top validator-residue with a real frame is citation drift (456 units), not post-pass edits | new | `r8`, swe-06's count |
| 40 labels ≈ 80 min operator labor is the cheapest judged path in question D | new (sizing) | Finding 3 |
| Savings in AI passes: unmeasured, with the named harness | new (negative knowledge, W3 rule) | Finding 5 |
| Stop rule pre-registered: precision < 0.8 OR drift < 1/100 OR agreement < 0.8 prints kill | new | Finding 5 |

## Hand-off

- mimo-09/10: carry the strict-count zero — question D's "validator judgment" is cite drift and
  the named map residues, not post-pass editing.
- The synthesis should retire the 354 explicitly and credit the lead's defect call.
- If the synthesis ranks by label cost: cite drift (80 min) < framework picks (4-5 h) <
  validator-residue flagger (3.5 h, and its frame is now empty).
