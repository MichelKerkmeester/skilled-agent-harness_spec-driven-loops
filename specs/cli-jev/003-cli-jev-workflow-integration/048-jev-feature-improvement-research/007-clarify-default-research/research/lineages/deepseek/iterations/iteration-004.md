---
title: "Iteration 4: Where else the same judgment would pay off — and where it was already measured and lost"
trigger_phrases: []
---
# Iteration 4: Where else the same judgment would pay off — and where it was already measured and lost

## Focus

Q4: which other surfaces in `.skilled` face the same pick-a-default-among-candidates judgment, what the
recorded measurements there already say, and what the reusable part of this scorer is.

## Actions Taken

- Read every other clarify branch in the compiled-routing rollout and classified each by option type
  (mode keys vs checklist sentences) and reachability.
- Read the advisor's two prior measurements of the same judgment (phases 002 and 019) and the sibling
  keeps (022) for comparator strength.
- Checked each hub's `mode-registry.json` for the number of modes its clarify could ever list.
- Re-read the scorer's export surface as the reusable measurement kit.

## Findings

1. **Four hubs can still present a mode-alternative clarify; three more cannot in the mode sense.**
   cli-external-orchestration (7 modes, `router.cjs:62-72`), sk-doc (15 modes,
   `007-sk-doc/lib/router.cjs:149-163`), sk-design (4 modes, `canary-router.cjs:154-170`) and sk-code
   (5 modes, `canary-router.cjs:165-180`) all list up to three tie-break-ordered modes plus
   `none_of_these`. system-deep-loop's clarify lists two `fallbackChecklist` sentences, not modes
   (`002-system-deep-loop/lib/canary-router.cjs:202-213`); sk-code's policy-card path does the same
   (`001-sk-code/lib/policy-card.cjs:215-217`); cli-classifier declares exactly one mode
   (`cli-jev`), so its `ambiguous.length > 1` branch is unreachable after the Deem removal; and
   mcp-tooling never clarifies (`003-mcp-tooling/lib/router.cjs:107-112`).
   [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs:62-72]
   [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/canary-router.cjs:202-213]
   [SOURCE: .skilled/skills/cli-classifier/mode-registry.json:23]

2. **The payoff would have to be hub by hub, and one hub is contraindicated on the measured corpus.**
   Jev's per-hub accuracy on the 54 fixture rows: sk-doc 9/13, mcp-tooling 9/12, sk-code 4/7,
   cli-external-orchestration 4/11, sk-design 2/11 — sk-design recognized none of its 9 none-rows and
   was right only on its 2 mode-rows. Any expansion should carry its own per-hub verdict, and sk-design
   needs its own corpus before a default near chart/diagram ties.
   [SOURCE: ~/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl]

3. **The same judgment was already measured twice on the skill advisor and lost both times.** Phase 002
   (pick first among a near-tie cluster): `verdict: kill backend=jev decided=38 wins=11 losses=27
   p_win=0.9975 p_loss=0.0069 flip=0.0153` on `jev-1.13.0` — and Deem kill too (8/30). Phase 019
   (whole-cluster reorder): `verdict jev: kill K=111 M=111 W=13 L=25 F=13 p=0.9832 mrr=0.7260/0.7811
   p95_ms=1490`. The advisor is therefore not a place where this judgment "would pay off"; it is a
   documented place where it did not. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/implementation-summary.md:90]
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/goal.md:97]

4. **A sibling keep shows what a strong comparator looks like.** Phase 022 (alignment folder
   suggestion) kept with `K=40 M=40 A=39 B=30 W=10 L=1 p=0.0059` — a comparator right on 30 of 40,
   against 020's comparator at 15 of 54. The same family of judgment pays off where the incumbent is
   real; 020's keep leans on the none class instead.
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:12]

5. **What is genuinely reusable is the measurement kit, not the judge.** `score-clarify-default.cjs`
   exports the census, row/label readers, mode describer, options digest, exact BigInt binomial tail,
   modal pick, column scorer, verdict decider, verdict line and the arm (`module.exports` list).
   Phases 002, 019 and 021 each rebuilt their own scorer around the same statistical shape; a shared
   kit would give every future default/order claim the same digests, calls log and pre-registered rule.
   [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:1307-1345]

6. **Real corpora rarely reach the surface at all.** The census finds 2 mode-alternative clarify rows
   over 361 committed prompts (one cli-external canary, one sk-doc canary); phase 021's tie-break arms
   never ran because the replay left 2 tied rows of 58 (`no headroom`). Expansion value is bounded by a
   base rate nobody has measured, which puts the Q4 ordering behind one piece of Q3 work.
   [SOURCE: ~/.skilled/.labels/runs/047-020-jev.stdout.txt]
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:11]

7. **Checklist clarifies need a different producer.** The census already separates `clarify_mode` from
   `clarify_checklist`, and the option-text producer (`describeModes`) only understands mode keys read
   from `mode-registry.json` packets. Reusing the judgment on a checklist clarify means inventing an
   option set for sentences, or treating the checklist as a single defer — a scope decision, not a
   drop-in. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:89-104]
   [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:499-545]

## Ruled Out

- "The judgment generalizes to the advisor's near-ties": measured there twice, kill both times, both
  backends; the keep does not carry across surfaces.
- "Every hub with a clarify block is an expansion candidate": cli-classifier's is unreachable with one
  mode; system-deep-loop's and sk-code's policy-card path carry checklist sentences, not modes.
- "More hubs mean more value": the surface is limited by the real clarify-with-two-ties rate, which is
  unmeasured and small on committed text (2 rows in 361 prompts).

## Next Focus

Iteration 5 — Q5: what a default-on integration would need (the seam through the front door, the reader,
the amendment), its cost model, and the measured risk register, then the synthesis.

## Sources

- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/{004-cli-external-orchestration,007-sk-doc,009-sk-design,001-sk-code,002-system-deep-loop,003-mcp-tooling,008-cli-classifier}/lib/*.cjs`
- `.skilled/skills/cli-classifier/mode-registry.json:23`
- `specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/implementation-summary.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/goal.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md`
- `~/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl`, `~/.skilled/.labels/runs/047-020-jev.stdout.txt`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`
