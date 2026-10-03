# Iteration 3: Making the Measurement More Trustworthy

## Focus

Audit what the measurement rests on: label provenance, the boundary calls, the corpus's survival,
the record trail between report, goal log and registry, and the sensitivity of the metrics that
decided the verdict.

## Findings

1. **The labels are operator-delegated model reads, and that is documented at three layers, not
   hidden.** The 60 natural rows carry `labeler: operator-delegated:opus-5.5-medium`
   [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/labels.jsonl]. Two drafter
   models (Luna 6 max, SWE 2 max) labeled every row blind to each other and agreed on every shared
   natural label (5 `instructs` each), a single Opus 5.5 medium arbiter then judged every row from
   its source and settled the boundary, and the session spot-checked the arbiter's load-bearing
   claims [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/035-decisions.md Method]
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/decision-record.md:69,104].
   The delegation was an operator decision recorded in parent D4/D5, and the named risk, "a verdict
   built on these labels is read as human-gold", has the `labeler` field as its mitigation
   [SOURCE: decision-record.md:104-111]. One stale sentence remains: feature 035's spec still says
   "No model writes a label or a planted sentence"
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/spec.md:49],
   which the disk and the 042 acceptance criteria contradict
   [SOURCE: 042-label-drafting-and-confirmation/acceptance-criteria.md AC-007].

2. **The single natural miss is the arbiter's own acknowledged close call.**
   `035-decisions.md` records the boundary ruling (agent-loadable files that steer the agent are
   `instructs`; human-facing docs are `clean`) and names two close `instructs` calls: N51, a
   `CLAUDE.md` commands block, and N41, skill frontmatter. N51 is `r50`, the row Jev scores 0.023;
   N41 is `r08`, which Jev catches at 0.79
   [SOURCE: 042-label-drafting-and-confirmation/scratch/evidence/labels/035-decisions.md Notes]
   [derived from `labels.jsonl` r50/r08 with section reads at commit `6aa7ca09`]. The natural
   positive class is only 5 rows, so one row is 20% of it; any published recall figure should carry
   the close-call flag and a one-row sensitivity delta, or report natural and planted recall apart.

3. **The rows survive today only through a historical commit, and the zero-call census no longer
   shows the corpus it scores.** The vendored `context/` tree was untracked on 2026-10-01 by
   `b0f89ee5f07` ("stop tracking vendored packet context"), an ancestor of HEAD, so the default run
   now prints `corpus census: commit=1f7746de files=0` while the baseline still scores the sections
   read at the rows' pinned commit `6aa7ca09`
   [SOURCES: `git show -s b0f89ee5f07`; re-run zero-call scorer at HEAD; `labels.jsonl` commit field;
   `score-injection-screen.mjs:618` vs `:1334,1364`]. A fresh `--draw` today would throw
   `draw needs 90 sections, found 0` (`drawRows`, `:480-482`). The measurement is reproducible while
   both commits exist, and it fails hard if they are pruned; nothing in the output says which corpus
   the baseline measured.

4. **The live run's trace has a two-commit discrepancy and no label-file hash.** The goal log cites
   the live run "at `177c0fbd703b`"
   [SOURCE: 035-fetched-text-injection-screen/goal.md, Live Jev run row], while the report itself
   records `commit: fccdc47725eb3706a419a6dd8641419e35bc17f9`
   [SOURCE: ~/.skilled/.labels/runs/035-jev-20261001/report.json commit]. Both commits are dated
   2026-10-01 with the identical subject "docs(cli-jev): write the delegated label arbiter into D4
   and D5", which reads as twin commits in parallel worktrees; the scored rows are pinned to
   `6aa7ca09` either way. INFERRED benign; diffing the two trees would confirm. Independently, the
   report hashes the instruction and the lexical list (`instructionSha256`, `lexicalSha256`) but not
   the labels or planted files, so editing `labels.jsonl` would leave the stored verdict internally
   consistent and silently wrong [SOURCE: `score-injection-screen.mjs:1209-1228` `buildReport`].

5. **The deciding metrics are robust overall and thin in three specific places.** Margin slack is
   160 rows and the sign-test p is 1.1e-5, but (a) precision passes 155 >= 144, three false
   positives from `kill` (iteration 2); (b) the baseline is chosen by a single row, lexical 56 vs
   flag-nothing 55 [SOURCE: `score-injection-screen.mjs:653,656`]; and (c) `F=0` counts minority
   votes relative to each row's modal flag, so it cannot see spread (iteration 1, `:810`). The Brier
   `0.0652` has no printed reference: the same arithmetic gives flag-nothing 0.389 and the lexical
   baseline 0.433 [derived: `(35 undetected instructs)/90` and `(5 FP + 34 missed)/90` against the
   `:821` formula]. Printing comparator Brier values would make the headline calibratable.

6. **The fetch census undercounts the fetch population it exists to size.** It counts agent files
   only under `.claude/agents/` and only their `tools:` line (`:191-203`), finding 2 of 12, while the
   opencode, hermes, codex, pi and cursor agent trees each carry the same WebFetch grants
   (`.opencode/agents/deep-research.md:87` and `:174`, `.opencode/agents/ai-council.md:124`,
   `.codex/agents/deep-research.toml:164`, `.hermes/agents/deep-research.md:87`), and the 82/61
   record counts come only from tracked `deep-research-state.jsonl` files
   [SOURCE: `.claude/agents/deep-research.md:4`, `.claude/agents/ai-council.md:4`;
   `score-injection-screen.mjs:159-205`; zero-call census]. "Fetches happen" is conservative and
   true; "two agents fetch" is false as a repository statement.

7. **The verdict's only registry home is outside the results table.** The 047 measurement results
   file lists rows for features 003 through 034 and no 035 row
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md];
   the verdict lives in the 035 goal log and in an out-of-repo runs directory, while the shipped
   measurement docs describe the method and not the result
   [SOURCE: .skilled/skills/cli-classifier/feature-catalog/measurements/injection-screen-measurement.md].
   The number this research brief quotes has exactly one in-repo home and one external artifact.

## Sources Consulted

- `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/decision-record.md:8,69,104-111`; `acceptance-criteria.md` AC-007; `scratch/evidence/labels/035-decisions.md`
- `.skilled/skills/cli-classifier/benchmark/injection-screen/labels.jsonl`
- `specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/spec.md:49`; `goal.md` Live Jev run row
- `~/.skilled/.labels/runs/035-jev-20261001/report.json`, `calls.jsonl`
- `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:159-205, 480-482, 618, 653-656, 810, 821, 1209-1228, 1334-1364`
- `git show -s b0f89ee5f07 177c0fbd703b fccdc47725eb`; zero-call scorer re-run at HEAD
- `.claude/agents/deep-research.md:4`, `.claude/agents/ai-council.md:4`, `.opencode/agents/deep-research.md:87,174`

## Assessment

- newInfoRatio: 0.82
- Novelty justification: The provenance audit ties the labels to their documented arbitration and
  shows the one natural miss is the arbiter's close call; the corpus audit shows the default census
  and the scored corpus have diverged since 2026-10-01; the report/label-hash and commit-twin gaps
  are new.
- Confidence: High for provenance, corpus state and metric arithmetic (all read or recomputed).
  Medium for the twin-commit explanation and the comparator Brier references as interpretations of
  the same recorded data.

## Reflection

- What worked: Reading the label decisions log against the call log explained the anomaly row
  (`r50`) rather than filing it as a model failure.
- What failed: There is no recorded environment fingerprint tying the report's commit to the goal
  log's; both had to be read side by side.
- Ruled out: Treating the delegated labels as unexamined risk (the delegation, blindness and
  spot-checks are recorded); treating the empty corpus census as harmless (it hides the provenance
  split between the census commit and the rows' commit).
