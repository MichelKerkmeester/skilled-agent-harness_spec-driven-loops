---
title: "Iteration 1: What drove the measured result"
trigger_phrases: []
---
# Iteration 1: What drove the measured result

## Focus

The anatomy of `verdict jev: keep K=54 M=54 A=28 B=15 W=17 L=4 F=10 p=0.003599`: corpus geometry,
the row-level mechanism behind every count, the error and precision structure, and what the
first-alternative baseline can and cannot show.

## Actions Taken

- Read the recorded run: `report.json`, all 163 lines of `calls.jsonl`, the 020 stdout, the labeled rows
  and the arbiter draft.
- Recomputed A/B/W/L/F per row, per hub and per order from `calls.jsonl`; split none-rows from mode-rows.
- Replayed the 54 fixture prompts through the scorer's own `runCensus` and through the engine entry it
  calls (`loadHubEngine` + `evaluate`), and read the router branches that decide `clarify` vs a bundle.
- Read the Keep Rule implementation, the rotation design and the two routers that can produce the pairs.

## Findings

1. The arithmetic is exactly the printed line: the sign test runs on the 21 discordant rows
   (`P(X >= 17)` for X ~ Binomial(21, 1/2) = 0.003599), the margin needs `10*(A-B) >= M` = 130 >= 54,
   the flip gate needs `10*F <= 3*M` = 100 <= 162, and the kill test `P(X >= L)` = ~0.999 is nowhere near
   0.05. So the verdict is carried by the margin on A-B = 13 and the sign test on W/L = 17/4, not by any
   close call. [SOURCE: ~/.skilled/.labels/runs/047-020-jev-20261002/report.json]
   [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:621-639]
   [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:577-595]

2. The corpus geometry manufactures most of the margin. All 54 rows pair exactly two modes of one hub
   (11 cli-external-orchestration, 12 mcp-tooling, 7 sk-code, 11 sk-design, 13 sk-doc) and 34 of 54 are
   labeled `none_of_these`. Because the label of a none-row is by definition not among the alternatives,
   the first-alternative baseline is right on 0 of 34 none-rows and 15 of 20 mode-rows — a metric floor of
   15/54 that any none-shaped gain clears. [SOURCE: ~/.skilled/.labels/020-rows.jsonl]

3. A=28 decomposes cleanly: 12 of the 34 none-rows were recognized (all 12 as a unanimous
   `none_of_these` pick), and 16 of the 20 mode-rows were answered with the labeled mode. W=17 =
   those 12 none recognitions + 5 mode-rows where Jev beat the tie-break (f020-007, 011, 016, 027, 042).
   L=4 = f020-008, 010, 029, 050. So the claim "most of Jev's gain came from recognizing none" is
   confirmed at 12 of 17 W rows. [SOURCE: ~/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl]

4. The error structure is one-sided and clustered. Jev still picked a listed mode on 22 of the 34
   none-rows, and those misses concentrate by hub: sk-design 9 of 9 (every chart+diagram row), cli-external
   7 of 11, mcp-tooling 3 of 9, sk-doc 3 of 5. Conversely its `none_of_these` picks are perfectly precise
   (12 of 12) but timid: none-recall is 12/34 = 35 percent. Nineteen of the 26 wrong picks were unanimous
   across all three rotations (17 of them none-row misses), i.e. stably wrong, not noise.
   [SOURCE: ~/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl]

5. The four L rows share one shape: the prompt names a surface or artifact that is itself an alternative,
   and the label follows the requested action instead. "Review this OpenCode TypeScript change and run its
   quality checks" (label `sk-code-quality`) draws `sk-code-opencode` three times at 0.81/0.66/0.85;
   "Check the code quality of my Webflow implementation" draws `sk-code-webflow` at 0.88/0.70/0.90;
   "Create a skill and a README for this app" (label `sk-create-skill`) splits 2-1 toward
   `sk-create-readme`. The surface descriptions are concrete nouns ("OPENCODE surface", "WEBFLOW surface")
   while the labeled modes are actions ("quality gate after implementation").
   [SOURCE: ~/.skilled/.labels/020-rows.jsonl] [SOURCE: .skilled/skills/sk-code/sk-code-opencode/SKILL.md:5]
   [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:5]

6. The pick probabilities carry no usable signal on this corpus. Mean modal probability is 0.678 on
   none-row wins and 0.688 on none-row misses; 0.797 on mode-row rights and 0.823 on mode-row wrongs.
   The model is not less confident when it is wrong, so no threshold on `pick_prob` separates the two.
   [SOURCE: ~/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl]

7. Ten of the 54 rows split 2-1 across the three rotations, and eight of the ten dissent exactly on the
   order-1 rotation (the left-rotate-by-one presentation); one dissents at order 0, one at order 2. The
   scorer's own order design is the three cyclic orders of `[A, B, none]`, so this is a positional
   sensitivity signature, not sampling noise. F=10 is the sum of those dissents.
   [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:849-860]
   [SOURCE: ~/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl]

8. The measured run was clean on transport: 163 calls (162 choices + 1 auth test), every one `measured`,
   no timeouts and no exit-4 retries; wall sum 54.1 s, mean 332 ms, p50 328 ms, p95 380 ms, and the
   scorer's own estimate is 19,446 input tokens for the payload.
   [SOURCE: ~/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl]
   [SOURCE: ~/.skilled/.labels/runs/047-020-jev.stdout.txt]

9. The first-alternative baseline is a tie-break order, not a decision. Both routers order near-tied
   modes by their `tieBreak` index before listing them, so "first alternative" is the policy's
   declaration order and the fixture's recorded alternative order matches it everywhere.
   [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs:199-210]
   [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/router.cjs:149-163]

10. On the same labels a degenerate policy outscores Jev: "always answer `none_of_these`" is right on
    the 34 none-rows (34/54, 63 percent) against Jev's 28/54, and the second-listed alternative alone is
    right 5/54. The Keep Rule compares only with the first alternative, so a `keep` proves Jev beats the
    tie-break order; it does not prove Jev beats not answering, which is the option the user actually
    has today. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:1194-1199]
    [SOURCE: ~/.skilled/.labels/020-rows.jsonl]

11. The fixture is not a census output, and its "written to tie" premise does not reproduce as a clarify
    action for 42 of its 54 rows. The rows carry `source: "fixture-047"`, a value the census never emits;
    the census emits `canary`, `playbook` and `corpus`. Replaying all 54 prompts through the same
    `runCensus` the scorer uses, on a tree whose compiled-routing artifacts and hub skill sources are
    byte-identical to the measurement commit (`git diff bb58ffd22c..HEAD` empty for the five hubs), gives
    12 clarify and 42 route: only the 12 sk-doc rows (of its 13) reproduce a clarify with the recorded
    pair; the other 42 resolve to a route whose targets are the two listed modes. The committed-corpus
    census itself still reproduces its shape (361 prompts replayed now vs 359 then; clarify 3 both times).
    [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/fixtures/020-rows.jsonl]
    [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:106-158]
    [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/007-clarify-default-research/research/lineages/deepseek/verification/census/report/report.json]

12. For the four hubs whose rows route instead of clarifying, the router took its explicit-multi-mode
    branch: two named modes each match explicit alias detectors, and that branch returns an ordered
    bundle before the ambiguity test ever runs. cli-external-orchestration:175-186 shows the branch and
    the two modes carrying equal scores (4 and 4 in the replayed trace). So the rows are tie-shaped at
    the score level, but the feature's stated context — "when it returns a clarify between two modes of
    one hub" — is exercised by the 12 sk-doc rows alone.
    [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs:175-186]

## Ruled Out

- "The verdict shows Jev picks the right mode between two tied modes": on the 20 mode-rows it is right
  16/20, but 11 of those 16 are also the first alternative. The distinguishing rows are 5 wins and 4
  losses — the none class carries the verdict.
- "`none_of_these` means no mode fits those rows": in this corpus the alternatives are the two modes the
  prompt itself names, and the none-rows are predominantly "do both / compare" requests, so none means
  "neither alone", a reading the prompt text supports directly.
- "The confidence numbers can gate the suggestion": the probability distributions of right and wrong
  picks overlap almost exactly (finding 6), so a threshold on `pick_prob` has nothing to bite on.

## Next Focus

Iteration 2 — Q2: counterfactual scoring from the recorded calls for the cost and accuracy levers
(two-call early stop, tie handling, none-recall levers, prompt and option-text changes), each with its
recomputed verdict and call count.

## Sources

- `~/.skilled/.labels/runs/047-020-jev-20261002/report.json`, `calls.jsonl`
- `~/.skilled/.labels/runs/047-020-jev.stdout.txt`
- `~/.skilled/.labels/020-rows.jsonl`, `~/.skilled/.labels/drafts/020-arbiter.jsonl`
- `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/fixtures/020-rows.jsonl`
- `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/router.cjs`
- `.../007-clarify-default-research/research/lineages/deepseek/verification/census/` (replay outputs)
