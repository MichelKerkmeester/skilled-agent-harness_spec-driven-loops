# Iteration 002 -- Raising accuracy or lowering cost

- **Focus:** Q2. Ground each lever in the recorded run (120 measured calls), the scorer's option/gate machinery, and the 40-row corpus.
- **Status:** complete. **newInfoRatio:** 0.80.
- **Sources read:** `score-alignment-suggestion.ts` (:731-770 jevGate, :836-878 buildDescriber, :980-989 buildOptionLines, :1013-1057 auth + payload estimate, :1081-1133 call loop), `alignment-validator.ts` (:412-435, :530-537, :649-656), `calls.jsonl` (120 measured calls), `022-rows.jsonl` (40 rows), specs tree `description.json` inventory.

## Findings

**F2-01 [DERIVED] The accuracy ceiling is one row on this corpus, and Jev already recovered every baseline error.**
From the counts: both right = 29, Jev-only right (W) = 10, baseline-only right (L) = 1, both wrong = 0. The 30 rows the top-alternative baseline got right are the only place a loss can occur, and Jev lost exactly 1 of them; the 10 rows the baseline got wrong are the value column, and Jev won all 10. Raising accuracy on this corpus therefore means converting that single L row; raising *value* means holding the 10 W rows while shrinking the loss side.
[SOURCE: ~/.skilled/.labels/runs/047-022-jev-20261002/report.json counts; derived partition of M=40]

**F2-02 [OBSERVED] The one lost row's correct option was the only option whose description had silently collapsed to a bare folder name.**
The basename `001-deep-research` carries a `description.json` in 9 different directories under `specs/` (the cli-jev one plus 8 others, 3 under `z_archive/`). `buildDescriber`'s by-name index maps a basename to every directory that holds one, and a lookup with more than one hit falls back to returning the folder name itself (:838-877: "two folders with the same name fall back to the folder name"). So the option line for `001-deep-research` was sent without its description while unique-basename siblings such as `007-classifier-deep-research` were sent with theirs (:980-989 builds `key=text`). The lost row f022-001 is the only row where Jev and the label disagreed; four rows list `001-deep-research` among their options (f022-001, -004, -015, -026) and the other three were answered right, so the collision is present in the loss but its causal role is not proven. What would confirm it: rerun the corpus with path-resolved descriptions and compare A on f022-001.
[SOURCE: specs tree walk (9 dirs named 001-deep-research with description.json); score-alignment-suggestion.ts:831-834, :838-877, :980-989; 022-rows.jsonl rows f022-001/004/015/026; calls.jsonl row f022-001]

**F2-03 [OBSERVED] Option text is thin: one `description.json` line per folder, with the `keywords` array unused and the collision fallback undetected by the scorer.**
`buildOptionLines` sends `key=description` (or `key=description [key]` when two keys share identical text). The row's `description.json` also carries a `keywords` array (observed: `001-deep-research/description.json`, `007-classifier-deep-research/description.json`) that never reaches the prompt. Nothing in the frame reports that an option's text fell back to its name.
[SOURCE: score-alignment-suggestion.ts:980-989; specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/description.json; 007-classifier-deep-research/description.json]

**F2-04 [OBSERVED] Confidence is mostly saturated: 81 of 120 measured calls returned pick_prob 1.0; only 16 rows ever dipped below it; the loss row is the extreme case.**
Measured calls: 120; pick_prob == 1.0 on 81, < 1.0 on 39; 16 rows carry at least one sub-1.0 call; f022-001 is the floor (0.48-0.58). A confidence-gated protocol that keeps pass 1 always and runs passes 2-3 only when pass 1 returns pick_prob < 1.0 would have run 25*1 + 15*3 = 70 calls instead of 120 on this corpus: a 42% call reduction. Costs of that trade: the flip metric (F) exists only for re-queried rows, the modal pick degrades to a single observation on gated rows, and the frozen keep rule (022 plan §4 / D4) fixes the three-pass method -- so this is an amendment proposal, not a drop-in. What would confirm its verdict equivalence: rerun the current and gated policies on a corpus that actually produces flips (this one produced none).
[SOURCE: calls.jsonl (derived counts); score-alignment-suggestion.ts:59, :622-632, :996-1141]

**F2-05 [DERIVED] The per-save cost unit is about one second, not the batch's 40 seconds.**
The 120 calls ran sequentially (:1116-1133) and summed to ~39.8 s, but one save has one row: 3 calls at p50 ~324 ms is ~1.0 s of model wall time plus one process start and the headroom/auth gates. The batch wall is an artifact of scoring 40 rows in one process.
[SOURCE: calls.jsonl wall_ms (p50 323.5 ms, sum 39.8 s); score-alignment-suggestion.ts:1116-1133]

**F2-06 [OBSERVED + UNKNOWN] The run's token estimate is a plan, not a receipt.**
The scorer prints `est_input_tokens` from the state + question + option lengths (32,927 planned for 121 calls, about 274 tokens per call) but `calls.jsonl` records no token or price fields, and no provider receipt was captured in the run directory. Actual billed tokens and cost per call are UNKNOWN for this run; only wall time (p50 324 ms) and call count (121) are measured.
[SOURCE: score-alignment-suggestion.ts:1013-1020; calls.jsonl field set; ~/.skilled/.labels/runs/047-022-jev.stdout.txt]

**F2-07 [OBSERVED] Run-level cost gates already exist; save-level gating does not.**
Zero calls happen when the baseline is already above 90% (headroom gate, :1269-1276), and the Jev arm stays dormant unless the binary sits on PATH at the pinned version, auth passes, and the payload is accepted (:731-770). Inside the validator, alternative scores are computed (`calculateAlignmentScoreWithDomain` :412-435, :530-537, :649-656) but only printed; no machine-readable margin is available to decide "is a model judgment worth buying here", and the scorer discards those scores.
[SOURCE: score-alignment-suggestion.ts:731-770, :1269-1276; alignment-validator.ts:530-537, :649-656]

**F2-08 [DERIVED] Ranked levers.**

Accuracy:
- **A1 Describe by path, not by basename name-index** (skip archive dirs; when the row came from a known specs root, resolve `<root>/<folder>/description.json`). Directly removes F2-02's collapse; expected ceiling +1 row here, and it removes a tail where any duplicated basename (1 of 46 distinct option names on this corpus) loses its description. Confirmation: rerun A on f022-001.
- **A2 Enrich the option text** (append `keywords`, or the folder's one-line plan title). Effect unmeasured; risk is prompt bloat and anchoring.
- **A3 More passes on low-confidence rows** (3 -> 5 when pick_prob < 0.7). f022-001 would get 5 samples; +2 calls on 16 rows = +32 calls (+27%). Benefit unproven.

Cost:
- **C1 Confidence-gated passes** (F2-04): -42% calls on this corpus; requires a keep-rule amendment and a flips-bearing corpus to prove equivalence.
- **C2 Parallelize rows** in batch mode: the 39.8 s batch wall is ~4x lower at concurrency 4; irrelevant to a one-row save.
- **C3 Resolve descriptions without the recursive walk**: `buildDescriber` recursively walks the whole specs root to index basenames once per process (:839-855). Per-save integration pays that walk; path resolution (A1) removes both the walk and the collision. Wall share of the walk was not captured -- UNKNOWN.
- **C4 Deterministic-margin gate** (F2-07): surface the alternatives' scores and skip the model when the gap is decisive. Saving on real saves is UNKNOWN; the fixture cannot estimate it because every fixture row was constructed with a decoy target and a genuine alternative set.
- **C5 Model/provider choice**: only jev-1.13.0 / provider official was observed; no comparison arm exists in this run. UNKNOWN.

## Ruled out

- **One fixed pass** as a drop-in: W/L would rest on single samples and F disappears entirely, weakening exactly the signal the keep rule reads. Not recommended without the confidence gate's evidence.
- **Order-rotation reduction as an accuracy lever**: rotation produced no flips (F=0), so it neither helps nor hurts accuracy on this corpus; it is a stability control only. [SOURCE: calls.jsonl]

## Next focus

Q3 -- how trustworthy the measurement is: corpus construction, label provenance, null target column, external-only artifacts, and what a rerun/audit path would need.
