You are the synthesis step of a finished four-lineage deep research, round 2 of the Jev research. You write one file and report back. You are a leaf: never dispatch another agent.

## Pre-resolved gates (do not ask about these)

- Gate 3 is answered: A) existing spec folder `specs/cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion`. Nobody is at your prompt to answer a question, so a question stops the work. Decide, and record the decision in the file.
- Skill routing is resolved: this is the `/deep:research` synthesis step (`step_compile_research` in `.skilled/commands/deep/assets/deep-research-auto.yaml`). `research.md` is a research artifact, not an sk-doc document. Load nothing else.
- Write scope is exactly one file: `specs/cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion/research/research.md`. Do not create, edit or delete any other file. That includes the round-1 `research.md`, every phase doc and every Planned build phase. Do not run git writes, `validate.sh`, `generate-context.js`, any test suite or any install.
- Make no live `jev` call of either package, and never open a `.env` file.

## The question the research answered

Round 1 asked where Jev typed judgments earn a measured, opt-in, UX-first place in this repository's skills, workflows and logic. The AI Council reviewed its synthesis, and a fresh leaf re-synthesized it. Round 2 deepens and widens the re-synthesized recommendations. It asks for concrete first slices, powered measurements, the compaction and goal-authoring seams round 1 never examined, what the vendored material teaches, and what both round 1 and the council missed.

The operator's four starting ideas are in `specs/cli-jev/003-cli-jev-workflow-integration/context/ideas from michel kerkmeester.md`:
- grading AI responses
- active skill-advisor recommendations
- upgrading the goal hook, plugin and extension
- Jev plus a compressor for compaction or other context reduction

The brief, research questions RQ1 to RQ7 and the required answer shape are in the `Research Brief` section of `specs/cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion/spec.md`. Read it first.

## Inputs (read all of them)

Base: `specs/cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion/`

1. **The four lineages.** For each, read `research/lineages/<label>/iterations/iteration-001.md` to `iteration-005.md`, plus `research/lineages/<label>/research.md` if the lineage wrote one.

   | Label | Model and effort | Executor | Lens |
   |---|---|---|---|
   | `grok` | Grok 4.7 xhigh fast. Grok 4.7 lists no MAX tier | cli-cursor | Contrarian and outside patterns. It owns the referenced `../context/` material |
   | `mimo` | MiMo V2.6 Pro, high | cli-pi (llmgateway) | UX and measurement |
   | `swe` | SWE-2 Max | cli-devin | Code-level slice design: exact functions, test cases, LOC and keep or kill rules |
   | `deepseek` | DeepSeek V4.1 Flash, max | cli-pi (llmgateway) | Seams, the key gate and failure paths |

2. **The merged state** under `research/`. List that directory first and read every merge file it holds, for example `findings-registry.json`, `fanout-attribution.md`, `resource-map.md`, `orchestration-summary.json` and `observability-events.jsonl`. Also read each lineage's own state log, registry and strategy.
3. **This phase's own docs**: `spec.md`, `plan.md`, `goal.md`, and `context/research-angles.md`. The angles file maps every iteration to its angle, wave and lens, and holds the per-iteration contract the lineages worked under.
4. **The baseline**, which your synthesis extends and never silently overrides:
   - `../001-deep-research/research/research.md`: the round-1 re-synthesis. Read at least section 1, Changes From the First Synthesis, section 11 with What Not To Build, section 12 and section 13. It holds R1 to R21, What Not To Build rows 1 to 43 and open questions 1 to 30.
   - `../001-deep-research/ai-council/council-report.md`: the council review, including its Dissent and Adjacent Defects.
5. **The four round-1 digests** in `../001-deep-research/context/`: `repo-rules-digest.md` (the fitness checklist Q1 to Q15 in section 3 and the red flags in section 4), `seam-map.md` (S01 to S26), `jev-material-digest.md` and `measurement-digest.md` (H1 to H15 and the gaps table).
6. **The vendored material** in `../context/`, wherever a lineage cites it: the five repos under `external repo's/`, the two website files (each holds only a URL), the three posts under `social posts/` and the operator's ideas file.
7. **The source code at every `file:line`** any lineage cites for a recommendation you keep. Open it. Do not trust the citation.

## Facts about the run that you must account for

- **Four model families, one Claude baseline.** The lineages are four non-Claude families on the same brief with four lenses. The round-1 re-synthesis, the council and you are all Claude Opus 5.5. Where a lineage reaches the same call as the baseline, it counts as cross-family corroboration (open question 30) only if the lineage reopened the code or ran the count itself. Agreement you reach from your own reading is a Claude reading, not corroboration.
- **Only iterations 1 and 2 are independent.** In iterations 1 and 2 (wave 1) no lineage read another lineage's round-2 files. From iteration 3 on, each lineage read the newest iteration of the other three and pushed past it.
  - Agreement between lineages in iterations 3 to 5 is therefore not independent. Where a later iteration agrees with another lineage, check whether it cites that lineage or cites code and counts it opened itself. Count only the second as corroboration.
  - Each iteration names the sibling files it read in a Sibling check section. Use those, by iteration number.
  - Agreement inside one lineage is never corroboration.
- **Lineage timestamps are unreliable.** Earlier runs of this runner recorded state timestamps outside the real run window. Never use a lineage timestamp as evidence of order or of anything else. Use iteration numbers, and the runner's own events in `research/observability-events.jsonl` for durations.
- **`newInfoRatio` is self-report.** Treat every self-reported `newInfoRatio` as self-report, not measurement. Judge new information from each iteration's New against baseline table and from the code, and remember that the contract counts a restated baseline finding without new evidence as no new information.
- **The merge registry may under-count a lineage.** In round 1, DeepSeek's own lineage registry held 8 of its 57 findings before the merge ran. Read every iteration file directly, and never trust a merged count, a registry or a resource map over the iteration markdown.
- **Two packages install a `jev` command.**
  - The Python `jev-cli` 0.6.2 is what `.skilled/skills/cli-jev/cli-usage/` wraps.
  - The npm `jevctl` 0.2.3 is vendored research material at `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main`.
  - Their exit codes disagree: exit 2 is a usage error with no quota spent in the Python `jev-cli`, and a tripped `--fail-on` gate in `jevctl`.
  - Keep them apart in every sentence. A lineage claim that mixes them is wrong until you show which package it holds for.
- **Vendor claims were never reproduced here.** Cost per token, latency per answer, accuracy figures, star counts and anything describing jevcache.sh or classifier.dev come from READMEs, websites or posts. Label them as vendor claims or user reports wherever you use them. The two website files hold only a URL.
- **Private data.** Lineages were told to report transcript and goal-state findings as counts, lengths and field names only. If an iteration quotes transcript or reply text, do not carry the text into your file, and list the iteration in section 15.
- **The workspace.** The run happened in the git worktree `.worktrees/069-cli-jev-workflow-integration` on branch `worktrees/069-cli-jev-workflow-integration`. When this brief was written, `git status` was clean at HEAD `8ea2a05454`. Take the launch HEAD from the run's own files if they record it, and write UNKNOWN if they do not.
- **One file edited after launch.** The orchestrator may have edited `scratch/synthesis-brief.md` (this file) after the run launched. An advisory naming it is the orchestrator's edit, not a lineage's. Any other advisory naming a file outside `research/lineages/<label>/` points at that lineage. Report every advisory in section 15.

## The key gate (parent goal D5)

Every recommendation is opt-in and dormant unless three checks all pass, in this order:
1. `command -v jev`
2. `jev --version` printing `jev 0.6.2`
3. `jev auth status` exiting 0

With no key, a feature behaves exactly as it does today and says so in one line. Each feature keeps its own switch. There is no global switch (baseline What Not To Build row 42), and no path returns a default score (row 9). Every recommendation's opt-in field states its switch, where the three checks run and exactly what happens when each fails. A recommendation that cannot state this drops.

## What to do

1. **Verify.** For every recommendation you rank, reopen each cited `file:line` and record it in the ledger as resolved, drifted or failed.
   - Drifted means the right file but the wrong lines: give the right lines.
   - Failed means the file or content is absent.
   - A recommendation whose load-bearing citation failed drops, or stays marked `citation failed` with its verdict lowered to drop or later and the reason given.
   - Also re-verify every count a lineage reports that changes a verdict, by rerunning it read-only where you can. Where you cannot, mark it lineage-reported.
2. **Compare lineages.** Mark each recommendation as found by all four, by three, by two, by one (name them) or disputed, and say whether the agreement was independent under the wave rule.
   - Where lineages disagree, do not average or tally. Say which evidence is stronger and why, or mark it unresolved.
   - Say separately whether each round-2 finding agrees with, extends or contests the baseline.
3. **Judge against the fitness checklist.** Run every recommendation through Q1 to Q15 and the red flags.
   - A recommendation that fails a question either says why that failure is acceptable or drops.
   - It must be opt-in under the key gate, with no silent default score.
   - A Jev answer is one lens, never a verdict or a permission.
4. **Resolve what was handed over.** For each question the baseline's section 12 hands to round 2 (30, 22, 18, 19, 23, 25, 26, 28, 7 and 21), say resolved, partly resolved or unresolved, with the evidence. Do the same for the council's open disagreements: D2 (parking 003) and D5 (the criteria-lint base rate), plus the spot-check question 27 that D1 left.
5. **Judge for yourself.** You are not bound by any lineage's verdict or by the baseline's. Where the code says otherwise, say so and cite it.
6. **Keep claims honest.** Mark each load-bearing claim confirmed from code or a count, or inferred, and for an inferred one name what would confirm it. Write UNKNOWN rather than guess. Never invent a flag, env var, harness figure, file name or model id. Names that do not exist yet are marked "proposed".

## research.md structure

Use these 17 numbered sections in this order, with one unnumbered section after section 1. A table of contents is allowed in this file only.

1. **Executive Summary.** The verdict in five lines or fewer, including the single build-now item you would start with.
   - then an unnumbered `## Changes From the Round-1 Re-Synthesis` section: every verdict, rank, record, drop row, phase and open question that round 2 changes against `../001-deep-research/research/research.md`, each with its reason and evidence. Use tables in the baseline's style: changed verdicts and ranks, changed records, corrected claims, and the status of each handed-over question and open council disagreement. Items round 2 left untouched are not listed. Say so in one line.
2. **Scope, Method and Inputs.** Lineages, models, executors, lenses, iteration counts, runner durations from the runner's own events, what was verified and how, and what was not run.
3. **RQ1: First slices.** For each build-now and next recommendation: files, functions, test cases, the pre-registered keep or kill rule and rough LOC.
4. **RQ2: Compaction.** Whether a Claude Code function hook can host a Jev keep-or-drop pass within its real deadline, and what the zero-call recall census shows first.
5. **RQ3: Goal criteria and goal judges.** The criteria lint across `sk-create-goal` authoring and Claude Code's native goal judge, and the base rate of unverifiable criteria.
6. **RQ4: R1's power.** How many decided rows the corpus files yield, and which zero-call comparator the arm must beat.
7. **RQ5: The vendored material.** The patterns in the five repos, the two websites and the three posts worth adopting under the key gate, and the anti-patterns here.
8. **RQ6: What round 1 and the council both missed.** Seams, skills or workflows where a Jev judgment passes the fitness checklist today.
9. **RQ7: Order, cost and kill criteria.** The build order of the survivors, what each costs in calls, latency and egress, and what kills each.
10. **Cross-Lineage Agreement.**
    - Where the four families agreed independently in iterations 1 and 2.
    - Where agreement came after cross-reading, split by whether the lineage cited code it opened or only a sibling.
    - Where only one lineage looked, and where they disagreed.
    - Close with a subsection on cross-family corroboration of the Claude baseline (open question 30): for R1's keep rule, R19's rank and R2's reshaping, which lineages reached the same call from code they opened, which contested it, and with what evidence.
11. **Recommendations.** The ranked list, in the shape below.
    - then an unnumbered `## What Not To Build` section as a table `| # | Idea | Reason | Checklist question or red flag | Evidence | Lineage(s) |`. It consolidates every dropped idea and dead end from all four lineages. Continue the row numbers from the baseline's row 43, and list any baseline row round 2 changes.
    - then an unnumbered `## Divergence Map` section: saturated directions, pivots, contested ideas, failures and the remaining frontier. Say plainly if no divergent pivots happened.
12. **Open Questions.** Each with what would resolve it. Carry the baseline's open questions forward with their new status, and number new ones from 31.
13. **Proposed Build Phases.** In the shape below.
14. **Citation Verification Ledger.** Every citation you checked, with its result.
15. **Evidence Quality and Caveats.** Include the run facts listed above, every containment advisory and any lineage that quoted private text.
16. **References.**
17. **Convergence Report.** Write only the heading and one line saying the workflow appends it. The workflow fills it after you.

### Recommendation shape (section 11)

**Ids.** The baseline's R1 to R21 keep their ids. A new recommendation takes the next free id from R22 upward, and ids are never reused. A merged or split item keeps its old id and says what it absorbed. Lineages named new ideas `N-<angle id>-<k>`. Map each one you keep to its new R id in the record.

Rank every recommendation, old and new, into one of four verdicts: build-now, next, later or drop. Order by value to the operator, weighed against cost, latency, privacy and risk, with the smallest measurable slice first. Each entry carries:
- **Verdict**, with one sentence of reason, and the change from the baseline's verdict if any.
- **What Jev judges**, with the judgment type (`noul`, `choice`, `score` or `run`) and which `jev` package.
- **Seam** at `file:line`.
- **Value**: the decision that gets cheaper, faster or more accurate.
- **Metric, baseline and harness.**
  - The harness id from the measurement digest.
  - Today's number with its citation, or UNKNOWN.
  - The shadow or A/B design.
  - Where no harness exists, the gap row and its smallest harness, which becomes part of the first slice.
- **Cost, latency and privacy**: calls per use, the deadline it must meet, and what state leaves the machine.
- **Opt-in, key gate and no-key behavior**:
  - its own switch
  - where the three D5 checks run
  - exactly what happens when each check fails, on exit 3, on exit 4 and on a malformed answer
  - one line confirming that with the gate failing it behaves exactly as today
- **Smallest slice**: one caller, end to end, with the files and functions it touches, its test cases, rough LOC and its rollback sentence.
- **Keep or kill rule**, fixed before the build.
- **Fitness checklist**: the questions it fails, if any, and why that is acceptable.
- **Confidence**: confirmed or inferred, and what would confirm an inferred claim.
- **Lineage agreement**: four, three, two or one (named) or disputed, whether independent, and how it stands against the baseline.
- **Citation check**: resolved, drifted or failed.

### Build phase shape (section 13)

Propose at most 6 build phases in total. The existing Planned phases `002-advisor-jev-tiebreak-arm` and `003-goal-verifier-jev-shadow` count toward the 6 if you keep them. Mark each as amended, unchanged or parked, and list its proposed amendments. `004-deep-research-expansion` is this research phase and is not a build phase. New build phases number from `005` upward under `specs/cli-jev/003-cli-jev-workflow-integration/`, because 002 to 004 exist.

The baseline proposed `005-compaction-recall-harness` and `006-goal-criteria-jev-lint`. Neither folder exists yet, so you may keep, rename, merge or drop them, and you say which.

Each phase groups related build-now and next recommendations. Give each:
- a literal kebab-case folder slug naming the concrete subject, for example `005-compaction-recall-harness`, never `005-phase-5` or `005-improvements`
- a one-line scope
- the recommendations it carries
- its first slice: one caller, end to end, with its measurement
- the files it would likely touch
- its switch and key-gate behavior
- its dependency on other phases
- a rough size
- its kill criterion
- the observable check that would prove it worked

Put a measurement-only phase first if no recommendation can be judged without a harness that does not exist yet. End the section by recommending which phase to do first, and why. List later-verdict items as not phased, each with the condition that would promote it.

## Report back

End with a short report for the orchestrator:
- the path you wrote
- the number of recommendations per verdict (build-now, next, later, drop), and how many are new from R22 onward
- citations checked, resolved, drifted and failed
- the top three recommendations, one line each
- the proposed phase slugs in order, marking which are amended, new or parked
- how many lineage agreements you counted as independent against after cross-reading
- the status of each handed-over question (30, 22, 18, 19, 23, 25, 26, 28, 7 and 21) and of council disagreements D2 and D5
- every containment advisory, and anything you could not resolve

Never claim a check you did not run.
