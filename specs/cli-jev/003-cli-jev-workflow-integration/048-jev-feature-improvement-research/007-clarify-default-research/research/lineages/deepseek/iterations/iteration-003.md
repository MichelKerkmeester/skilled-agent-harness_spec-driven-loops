---
title: "Iteration 3: What the measurement records, and the checks that would make it trustworthy"
trigger_phrases: []
---
# Iteration 3: What the measurement records, and the checks that would make it trustworthy

## Focus

Q3: audit the recorded run's evidence chain end to end — what the run proves today, what it fails to
record, and the cheapest checks that would close each gap before a keep is spent.

## Actions Taken

- Inventoried every field the run writes: stdout lines, `report.json`, `calls.jsonl`.
- Recomputed all six counts and the options digest from the raw labels and calls, independently of the scorer.
- Hashed the rows file, the committed fixture, the labels projection and the arbiter draft.
- Re-read the Keep Rule, the label card, the arbiter decision record and the 047 results row.

## Findings

1. **The counts reproduce independently.** Recomputing `scoreColumn` semantics by hand from `calls.jsonl`
   and the labels yields exactly A=28, B=15, W=17, L=4, F=10, unstable=0, abstained=12, and the sign test
   recomputes to p=0.003599. The recorded verdict line is faithful to its own inputs.
   [SOURCE: ~/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl]
   [SOURCE: ~/.skilled/.labels/020-rows.jsonl]

2. **The options digest reproduces.** Re-running the scorer's exported `optionsDigest` over the labeled
   rows returns `count=36, sha256=df8ed1dfd6bfb016cccfedefa37c8d43ade0528b4e043c5457bccb4d806ac073`, the
   same string the stdout printed, so the option texts the run measured can be verified from the tree.
   [SOURCE: ~/.skilled/.labels/runs/047-020-jev.stdout.txt]
   [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:547-559]

3. **The labels are the fixture with `label` values substituted, and they match the arbiter's draft.**
   The labeled file equals the committed fixture modulo labels, and all 54 `id:label` pairs match
   `~/.skilled/.labels/drafts/020-arbiter.jsonl`. Digests as of today, none of which the run records:
   rows file `sha256:fd9acdfdbd538f8c6d9d0cb7dd27397d27696ea580469f5c7fc22eee5ba28fd8`; committed fixture
   `sha256:94a66cd7e4803e75df2e0505a21f640b4b3c48b502e2c2297402417180ba79ad`; labels projection
   `sha256:0e1f4f3c96a7a3a67445b5bde08b1a5709887bc622633591e9151197d7f13fcd`; arbiter draft
   `sha256:9974f80defbe4a5c4fd180df86838bd9e0080770a07681b912d0e47116adc5bc`.
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/fixtures/020-rows.jsonl]
   [SOURCE: ~/.skilled/.labels/drafts/020-arbiter.jsonl]

4. **The report cannot prove which labels it judged.** `report.json` holds K, B and the column block only;
   there is no rows-file hash, no labels digest, no options digest, no tree identity, and the `--out`
   directory path appears only in the 047 results table. A later relabel would leave the verdict line
   standing with nothing to compare against. [SOURCE: ~/.skilled/.labels/runs/047-020-jev-20261002/report.json]
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:10]

5. **The scorer never checks the row's premise.** `readRows` → `labelRows` → `runJevArm` treat a row as
   prompt + alternatives + label; nothing replays the prompt through the hub engine. The fixture's rows
   carry `source: "fixture-047"` (never emitted by the census), and on the frozen routers only 12 of 54
   rows produce the `clarify` action the feature describes — 42 route as ordered bundles. A zero-call
   action check before scoring would have caught this class of drift at no model cost.
   [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:445-497]
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/007-clarify-default-research/research/lineages/deepseek/verification/census/report/report.json]

6. **The baseline framing invites a false positive.** The Keep Rule's only incumbent is the router's first
   alternative (keep rule at spec:150-162). On this corpus that is 15/54, while always answering
   `none_of_these` is 34/54 and the second alternative alone is 5/54. A `keep` therefore coexists with a
   column that is six rows worse than the do-nothing answer. `What a verdict means` (spec:166) already
   says a keep serves nothing until a later phase; the trust fix is to print the alternate baselines so
   the reader can see the comparison the gate did not make.
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:150-166]

7. **The label method is one arbiter read, and this feature kept no cross-check.** The labels are
   operator-delegated reads by a single Opus 5.5 medium arbiter (042 ADR-001); for 020 only
   `020-arbiter.jsonl` exists — no per-row two-draft pair as other features kept. The row schema has no
   `labeler` field, and the label card itself records the decision rule as UNDEFINED: nothing in the
   phase says what makes one listed mode "the" mode, and the same two-mode shape is labeled `none` in one
   hub and a mode in another (goal+changelog → none; skill+README → sk-create-skill). The none class is
   34 of 54 rows and carries the margin; it has one read.
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/decision-record.md]
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/card-020.md]

8. **No class floor: the gate can pass with an unmeasured suggestion class.** The gate is `K >= 30`
   labeled rows; the coverage condition is one-sided (`10*M >= 9*K`). Nothing requires mode-rows or
   none-rows to be present, so a corpus of pure none rows keeps with zero evidence that the default
   suggestion is ever right — the opposite failure of this corpus, which is honest about having 20 mode
   rows but closes no floor on them. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:44-54]
   [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:621-639]

9. **F conflates position sensitivity with sampling noise.** The three calls are three different cyclic
   orders, so a 2-1 split can be either. Eight of the ten splits dissent exactly on the order-1 rotation,
   and `unstable` is 0 because the scorer only marks three-distinct-picks rows. One repeated order per
   row (the same presentation twice) would separate the two effects for one extra call per row.
   [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:849-860]
   [SOURCE: ~/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl]

10. **The production base rate is absent.** `real clarify rate: not measured` is printed whenever
    `--transcripts` is not given, and the meeting of the 54-row gate, the fixture's selection (prompts
    written to tie) and the 63 percent none rate are corpus properties, not traffic properties. The
    census says 3 clarify rows over 361 committed prompts today (2 with mode alternatives), so a default
    for clarify affects a rare event — which cuts cost and also means the fixture cannot speak to how
    often the default would matter. The transcript counter is count-only by design, so measuring the rate
    needs no text to leave the machine. [SOURCE: ~/.skilled/.labels/runs/047-020-jev.stdout.txt]
    [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/007-clarify-default-research/research/lineages/deepseek/verification/census/report/report.json]

11. **The census is tree-dependent to two prompts, and that is fine if recorded.** The 2026-09-29 build
    recorded 359 prompts / 239 route / 3 clarify; the replay today gives 361 / 240 / 3 with the same
    unparsed=24 and clarify_mode=2. The corpus grew, the clarify shape did not change; a census number
    is only meaningful with the tree identity it was taken on.
    [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/goal.md]
    [SOURCE: ~/.skilled/.labels/runs/047-020-jev.stdout.txt]

**Ranked trust fixes, cheapest first:** (1) write rows-file and labels digests plus the options digest
into `report.json`; (2) replay each row's prompt and record its engine action alongside the label, and
require `clarify` (or record the deviation); (3) print always-none and second-alternative baselines next
to B; (4) add a per-class floor to the gate; (5) keep two blind drafts or a second arbiter pass on the
none class; (6) add one repeated order for a noise estimate; (7) run `--transcripts` for the base rate.

## Ruled Out

- "The recorded counts are unreliable": recomputation from the calls reproduces every count and the exact
  p, and the options digest reproduces from the tree.
- "The labels drifted from the arbiter's draft": 54 of 54 pairs match.
- "The fixture was edited after scoring": the labeled file equals the committed fixture modulo labels.

## Next Focus

Iteration 4 — Q4: where else in `.skilled` the same pick-the-default judgment would pay off, ordered by
payoff, with the other clarify sites, the advisor's tie-break work and the deferred-consumer seams.

## Sources

- `~/.skilled/.labels/runs/047-020-jev-20261002/report.json`, `calls.jsonl`, `~/.skilled/.labels/runs/047-020-jev.stdout.txt`
- `~/.skilled/.labels/020-rows.jsonl`, `~/.skilled/.labels/drafts/020-arbiter.jsonl`
- `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/fixtures/020-rows.jsonl`
- `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md`, `goal.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/decision-record.md`, `scratch/evidence/card-020.md`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`
