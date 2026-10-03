# Iteration 1: Q1 - what drove the measured result

## Focus

Reproduce the measured 047 run locally and explain, with file:line evidence, what produced `verdict jev: stop (margin) K=110 M=110 A=102 B=93 W=13 L=4 F=0 p_win=0.02452` and the 10 missed claims.

## Findings

### F1-01 - Recall is zero on the labeled corpus

All 10 label-yes rows are silent. The scorer's own attribution prints `regex missed claims: 10 (by word: none)`: no claim word from the pattern appears in any of the 10 missed tails, so there is nothing to attribute. Reproduced locally with the exact 047 command minus `--jev --out`.
[SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:247-268]
[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs:64]

### F1-02 - Precision is zero as well

The census fired on 7 of 110 rows and every fire was a label-no row: `rows: 110 fires: 7` and `regex false fires: 7`. On this corpus the detector is 0 true positives / 7 false positives — 93/110 agreement comes entirely from correctly not firing.
[SOURCE: reproduced run of score-completion-claims.mjs:148-158,232-236]
[SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:15]

### F1-03 - The margin check stopped the verdict, not the sign test

The keep rule requires `10*(A-B) >= M`: with A-B=9 and M=110 the left side is 90, twenty points short (two net wins short of the 11 needed). `decideVerdict` evaluates coverage, kill, margin, sign test, flips in that order, so margin returns `stop (margin)` before the passing sign test (p_win=0.02452) is consulted. Coverage passes exactly (10*110 >= 9*110) and the kill check passes (p_loss=0.9936).
[SOURCE: score-completion-claims.mjs:480-489]
[SOURCE: independent evaluation of decideVerdict with the measured counts -> "stop (margin)"]

### F1-04 - The statistics are exact and reproduce

p_win = binomialTail(13,17) = 3214/131072 = 0.0245208740234375; p_loss = binomialTail(4,17) = 130238/131072 = 0.9936370849609375. Both tails are summed coefficient by coefficient in BigInt (`20n * num < den`), so no float compare decides the 0.05 test.
[SOURCE: score-completion-claims.mjs:446-456]
[SOURCE: independent node evaluation of the module's own binomialTail]

### F1-05 - The word list is the wrong vocabulary for real claims

The pattern is `\b(completed|resolved|fixed|finished|shipped|released|deployed|implemented|occurred|happened)\b/i`. The 10 missed tails end with "Nothing is waiting on you", "everything is committed and pushed", "Validation passes: 43 PASSED and 0 FAILED", "Nothing left on my side", "The goal is complete", "58 commits ... The goal is complete", "Nothing remains to build". None contains any of the ten words; two members (occurred, happened) are not completion claims at all.
[SOURCE: completion-evidence-sentinel.cjs:60-64]
[SOURCE: reproduced missed-claim listing over ~/.skilled/.labels/026-rows.jsonl x 026-labels-047.jsonl]

### F1-06 - False fires are context-blind

The 7 false fires are "Deployed to staging" (unchecked checklist item), "Status | Complete / Completed | Not completed" (status table), "resolved-root=...resolved-target=..." (variable names), "re-verifying all gates ... RESULT: FAILED" (a failure report), "needs supportsDeveloperRole: false" (requirement), "deviations get recorded as amendments" (open question), "the whole claim is the before/after delta" (reasoning). `detectCompletionClaim` trims, slices 400 chars and regex-tests with no negation, list-item, path or end-statement handling.
[SOURCE: completion-evidence-sentinel.cjs:113-119]
[SOURCE: reproduced false-fire listing]

### F1-07 - A miss disables the whole sentinel, not just the label

`evaluateCompletionEvidence` returns `{decision:'ok'}` immediately when `detectCompletionClaim` does not fire; the check-completion.sh / implementation-summary evidence path runs only after a fire. With 0 recall, the entire enforcement path is unreachable on the turns that need it.
[SOURCE: completion-evidence-sentinel.cjs:489-499]

### F1-08 - The corpus is asymmetric by runtime

110 rows = 50 Pi + 60 Claude. All 10 label-yes rows are Claude turns; the Pi sample contributes zero positives. The measured recall is Claude-turn recall, and Pi claim endings are absent from the positive class.
[SOURCE: computed id-join over 026-rows.jsonl and 026-labels-047.jsonl]
[SOURCE: 047 results.md:15]

## Sources Consulted

- `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` (read in full)
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs` (read in full)
- `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/README.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md`
- `~/.skilled/.labels/026-rows.jsonl`, `~/.skilled/.labels/026-labels-047.jsonl` (read-only)
- Commands: reproduced scorer census+regex run (no `--jev`, no `--out`, exit 0); node id-join of rows and labels; independent binomialTail/decideVerdict evaluation via the module's exported functions

## Assessment

- newInfoRatio: 0.85
- Novelty justification: First pass; reproduces the 047 row locally and turns it into a mechanism — 0/10 recall driven by vocabulary, 0/7 precision driven by context-blindness, and a margin failure two net wins short — all new to this packet.
- Confidence: high on the counts, verdict math and pattern text (all reproduced); medium on the claim that misses bypass enforcement end to end (read of the sentinel entrypoint, not a live hook run).

## Reflection

- Worked: running the scorer's own exported functions and the census command gives exact, reproducible numbers with zero model calls and zero writes.
- Failed: no value in re-deriving the labels or re-running with `--jev`; the corpus labels are fixed input and live judging is out of scope for this lineage.
- Ruled out: treating the margin verdict as a statistical accident — the sign test passes, but the margin failure is structural (vocabulary + corpus size), not noise.

## Recommended Next Focus

Q2: enumerate concrete accuracy and cost levers — pattern vocabulary and context rules, and where the judge's 331-call/0.3 s-per-call cost can be bounded or avoided.
