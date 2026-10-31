# Iteration 1: What drove the measured Jev verdict and its keep

## Focus

Explain `verdict jev: keep K=24 M=24 A=24 B=8 W=16 L=0 F=0 p_win=0.00001526` from the scorer's mechanics, the corpus construction, the label balance, and the recorded run arithmetic.

## Findings

1. **The recorded keep clears every gate, and the sign test is the only binding one.** With K=M=24, A=24, B=8, W=16, L=0, F=0: coverage `10*24=240 >= 9*24=216`; the loss tail cannot kill (`p_loss=1.0`); margin `10*(24-8)=160 >= 24`; sign test `p_win = binomialTail(16,16) = 2^-16 = 1.5259e-5 < 0.05`; flips `0 <= 3*24/10 = 7.2`. Recomputing the sign test at n=16, the smallest win count that would still pass is W=12 (`p=0.0384`); W=11 fails (`p=0.105`). This run cleared the binding gate with four wins to spare. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:348-357] [SOURCE: ~/.skilled/.labels/runs/047-025-jev-20261002/report.json] [SOURCE: recomputation over the scorer's `binomialTail`]

2. **The chosen baseline is the majority class, and the corpus forces it to be exactly K/3.** `chooseBaseline` takes the better of the majority class and the loose last-word rule, with the loose rule winning ties; the labels are pass 8, fail 8, block 8, so majority class `pass` is right on 8 rows while the loose rule is right on 0, and `majority` is chosen. B=8 therefore equals one third of K by construction — the weakest majority baseline a 24-row corpus can have. [SOURCE: score-verdict-fallback.cjs:294-311] [SOURCE: ~/.skilled/.labels/025-outputs.jsonl] [SOURCE: report.json]

3. **The corpus hard-codes the pattern miss and also disables the loose rule.** A recomputation over all 24 outputs (682–816 characters each) finds zero whole-word `pass|fail|block` tokens, while inflected and derived forms are present (`fails` x2, `failed`, `failure`, `passed`, `blocker` x3). `extractVerdict` fires only on a line that is just the verdict word, optionally prefixed by `verdict|result|status` plus a separator; `loosePick` reads only whole verdict words anywhere. Both zero-call readers are evaded while a human reader still sees the verdict. The miss is a property of the corpus as much as of the rules. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:117-123] [SOURCE: score-verdict-fallback.cjs:279-282] [SOURCE: recomputed from `~/.skilled/.labels/025-outputs.jsonl`]

4. **The scored population is the operator-named outputs file, not the shipped benchmark fixtures.** The same run prints `fixture cases: 8 hits: 8 misses: 0` and `outputs rows: 24 hits: 0 misses: 24`. The four `reviewer-*` fixtures in the profile write `VERDICT: X` lines and all 8 merged cases hit the pattern, so no fixture miss ever enters the arm and the fallback's natural-miss rate is not measured anywhere in this run. [SOURCE: ~/.skilled/.labels/runs/047-025-jev.stdout.txt] [SOURCE: report.json census block] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/reviewer-regression.json]

5. **Jev's column is unanimous and stable on this population.** `calls.jsonl` holds 73 calls (1 auth test plus 24 rows x 3 option orders), all with status `measured`; the modal pick equals the label on all 24 rows, so A=24; F=0; the lowest recorded `pickProb` is 0.96 and the mean is 0.998; p50 wall time 334 ms, p95 377 ms; the model was `jev-1.13.0` from provider `official` under `jev 0.6.2`. The run's `labels_sha256=876874b0...` matches the measured outputs file exactly. [SOURCE: ~/.skilled/.labels/runs/047-025-jev-20261002/calls.jsonl recomputed] [SOURCE: stdout.txt verdict line] [SOURCE: score-verdict-fallback.cjs:405-432,775-830]

6. **The labels are the corpus author's intended verdicts, re-confirmed blind.** The committed `025-intended.jsonl` cycles `pass`, `fail`, `block` by row id, and the measured labels match that intent on 24 of 24 rows. `results.md` records the corpus as "24 reviewer reports written by DeepSeek V4.1 Flash" labeled by a "delegated arbiter, blind, 24 rows (matched the author's intended verdict on 24 of 24)". The committed scratch fixture holds the identical 24 texts without the `label` field; the labels live in the operator's untracked file. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/fixtures/025-intended.jsonl] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14] [SOURCE: scratch/fixtures/025-outputs.jsonl compared with `~/.skilled/.labels/025-outputs.jsonl`]

## Ruled Out

- Treat the 8-case fixture census as the fallback's measured population: all 8 fixture cases hit the pattern (`hits: 8, misses: 0`), so the fixtures contribute no fallback rows. [SOURCE: stdout.txt]
- Treat loose 0 of 24 as a property of the rule alone: the corpus avoids the exact tokens the rule needs by construction while carrying inflected near-misses, so the 0 measures the corpus too. [SOURCE: recomputed from 025-outputs.jsonl]
- Treat `p_win=0.00001526` as an error probability: it is the sign-test tail conditional on 16 discordant wins, and the discordance count is manufactured by the balanced 8/8/8 labels against a deliberately weak majority baseline. [SOURCE: score-verdict-fallback.cjs:348-357 + recomputation]

## Dead Ends

- Re-deriving verdicts from the shipped profile fixtures to grow the miss population: the fixtures all hit, and the labeling card records that no miss text existed in the repository before the operator supplied it. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/card-025.md]

## Edge Cases

- The measured labels file is an operator-home file; the committed draft fixture is the same text without labels, so reproducing the run outside this machine relies on the printed `labels_sha256` as the corpus identity. [SOURCE: diff of the two files]
- Inflected forms (`failed`, `fails`, `failure`, `blocker`) sit just beyond both zero-call rules; even a one-step regex widening would materially change the loose baseline and the comparison this keep was measured against. [SOURCE: recomputed token census]

## Sources Consulted

- score-verdict-fallback.cjs:34-60, 146-159, 212-220, 279-311, 329-357, 405-432, 700-863, 887-947, 1059-1077
- reviewer-scorer.cjs:117-123, 155-188, 203
- reviewer-regression.json; feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md
- ~/.skilled/.labels/025-outputs.jsonl (24 rows, pass 8 / fail 8 / block 8, sha256 876874b048262482ffc5135b20e0a0ff49254b1a3978e5a4a70730571b30a4ab)
- ~/.skilled/.labels/runs/047-025-jev-20261002/{report.json, calls.jsonl}; ~/.skilled/.labels/runs/047-025-jev.stdout.txt
- 047-measure-every-jev-feature/scratch/evidence/results.md:14; scratch/fixtures/{025-outputs.jsonl,025-intended.jsonl}
- 025-reviewer-verdict-fallback/{goal.md,implementation-summary.md}
- 042-label-drafting-and-confirmation/scratch/evidence/card-025.md
- 006-verdict-fallback-research/{spec.md,goal.md}
- deep-research-strategy.md (read before iteration 1); steer.md (checked before iteration 1; absent)

## Assessment

- New information ratio: 0.90
- Novelty: six result drivers, each recomputed or re-read from a different artifact (scorer decisions, run report, call log, corpus text, labels, intent file). The exact-token avoidance insight and the forced K/3 baseline were not previously recorded in the packet docs.
- Questions addressed: Q1 fully; Q3 evidence gathered.
- Questions answered: What drove the measured Jev result?
- Confidence: High for the arithmetic, corpus construction, and run evidence. The claim that this transfers to real reviewer outputs is not supported by this run and stays open.

## Reflection

- What worked and why: reading the verdict line, `report.json`, and `calls.jsonl` together with the corpus and the scorer's own decision functions reconciled every printed count with its definition.
- What did not work and why: nothing blocked; the only surprise was how strictly the corpus avoids exact verdict tokens, which required a token census to establish.
- What I would do differently: bring the intent file and label file into the first read next time, since they determine B and therefore the whole margin.

## Recommended Next Focus

Iteration 2: identify concrete accuracy and cost levers for the fallback, then define a measurement design that separates model accuracy from corpus construction.
