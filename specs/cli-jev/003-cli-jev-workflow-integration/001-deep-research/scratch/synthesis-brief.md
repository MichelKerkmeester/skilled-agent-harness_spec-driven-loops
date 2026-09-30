You are the synthesis step of a finished three-lineage deep research. You write one file and report back. You are a leaf: never dispatch another agent.

## Pre-resolved gates (do not ask about these)

- Gate 3 is answered: A) existing spec folder `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research`. Nobody is at your prompt to answer a question, so a question stops the work.
- Skill routing is resolved: this is the `/deep:research` synthesis step (`step_compile_research` in `.skilled/commands/deep/assets/deep-research-auto.yaml`). `research.md` is a research artifact, not an sk-doc document. Load nothing else.
- Write scope is exactly one file: `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/research/research.md`. Do not create, edit or delete any other file. Do not run git writes, `validate.sh`, `generate-context.js`, any test suite or any install.
- Make no live `jev` call of either package, and never open a `.env` file.

## The question the research answered

Where do Jev typed judgments earn a measured, opt-in, UX-first place in this repository's skills, workflows and logic? The operator's four starting ideas are in `specs/cli-jev/003-cli-jev-workflow-integration/context/ideas from michel kerkmeester.md`: grading AI responses, active skill-advisor recommendations, upgrading the goal hook, plugin and extension, and Jev plus a compressor for compaction. The brief, research questions RQ1 to RQ7 and the required answer shape are in the `Research Brief` section of `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/spec.md`. Read it first.

## Inputs (read all of them)

Base: `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/`

1. `research/lineages/deepseek/iterations/iteration-001.md` to `iteration-010.md`, plus `research/lineages/deepseek/research.md`. DeepSeek V4.1 Flash at max thinking, run through cli-pi. Lens: integration engineer.
2. `research/lineages/mimo/iterations/iteration-001.md` to `iteration-010.md`, plus `research/lineages/mimo/research.md`. MiMo V2.6 Pro at high thinking, run through cli-pi. Lens: UX and measurement.
3. `research/lineages/grok/iterations/iteration-001.md` to `iteration-010.md`, plus `research/lineages/grok/research.md`. Grok 4.7 xhigh fast, run through cli-cursor. Lens: contrarian and outside patterns.
4. The merged state the fan-out merge wrote under `research/`. List that directory first and read every merge file it holds, for example `findings-registry.json`, `fanout-attribution.md` and `resource-map.md`, plus each lineage's own state log and registry. If a lineage's state records carry no findings arrays, its findings live only in its iteration markdown, so read the markdown and do not trust the merged count.
5. `spec.md` in the base, and the four digests in `context/`: `repo-rules-digest.md`, `seam-map.md`, `jev-material-digest.md` and `measurement-digest.md`. Also `context/research-angles.md`, which maps each iteration to its angle and lens.
6. The source code at every `file:line` any lineage cites for a recommendation you keep. Open it. Do not trust the citation.

## Facts about the run that you must account for

- The lineages are three model families on the same brief with three different lenses. Agreement in wave 1 (iterations 1 to 3) is independent corroboration.
- From iteration 4 on, each lineage was told to read the newest iteration of the other two and push past it. Agreement between lineages after iteration 4 is therefore not independent. Where a later iteration agrees with another lineage, check whether it cites that lineage or cites code it opened itself, and count only the second as corroboration. Agreement inside one lineage is never corroboration.
- Lineage timestamps are unreliable. Earlier runs of this runner recorded state timestamps outside the real run window. Do not use a lineage timestamp as evidence of order or of anything else. Use iteration numbers.
- Self-reported `newInfoRatio` values are self-report, not measurement.
- Two different packages install a `jev` command. The Python `jev-cli` 0.6.2 is what `.skilled/skills/cli-jev/cli-usage/` wraps. The npm `jevctl` 0.2.3 is vendored research material at `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main`. Their exit codes disagree: exit 2 is a usage error with no quota spent in the Python `jev-cli` and a tripped `--fail-on` gate in `jevctl`. Keep them apart in every sentence. A lineage claim that mixes them is wrong until you show which package it holds for.
- Vendor claims (cost per token, latency per answer, accuracy figures) were never reproduced in this repository. Label them as vendor claims wherever you use them.
- The run happened in the git worktree `.worktrees/069-cli-jev-workflow-integration`, which was clean at launch apart from `research/` (HEAD `2bbefcbdb7`), and no other session writes there. One exception: the orchestrator edited `scratch/synthesis-brief.md` (this file) after launch, so an advisory naming it is the orchestrator's edit, not the lineage's. Any other advisory that names a file outside a lineage directory points at that lineage. Report every advisory in section 15.

## What to do

1. **Verify.** For every recommendation you rank, reopen each cited `file:line` and record it in the ledger as resolved, drifted (right file, wrong lines, give the right lines) or failed (file or content absent). A recommendation whose load-bearing citation failed drops, or stays in the list marked `citation failed` with its verdict lowered to drop or later and the reason given.
2. **Compare lineages.** Mark each recommendation found by all three, by two (name them), by one (name it) or disputed, and whether the agreement was independent under the wave rule above. Where lineages disagree, do not average or tally. Say which evidence is stronger and why, or mark it unresolved.
3. **Judge against the fitness checklist.** Run every recommendation through the 15 questions in section 3 of `context/repo-rules-digest.md` and the red flags in its section 4. A recommendation that fails a question either says why that failure is acceptable or drops. In particular: it must be opt-in, with no Jev key it must behave exactly as today and say so plainly with no silent default score, and a Jev answer is one lens, never a verdict or a permission.
4. **Judge for yourself.** You are not bound by any lineage's verdict. Where the code says otherwise, say so and cite it.
5. **Keep claims honest.** Mark each load-bearing claim confirmed from code or inferred, and for inferred ones name what would confirm it. Write UNKNOWN rather than guess, and never invent a flag, env var, harness figure or model id.

## research.md structure

Use these 17 numbered sections in this order. A table of contents is allowed in this file only.

1. Executive Summary: the verdict in five lines or fewer, including the single build-now item you would start with
2. Scope, Method and Inputs: lineages, models, lenses, iteration counts, what was verified and how
3. to 9. One section per research question, RQ1 to RQ7, with the merged answer and its evidence
10. Cross-Lineage Agreement: where the three families agreed independently, where agreement came after cross-reading, where only one looked and where they disagreed
11. Recommendations: the ranked list (shape below)
    - then an unnumbered `## What Not To Build` section as a table `| Idea | Reason | Checklist question or red flag | Evidence | Lineage(s) |`, consolidating every dropped idea and dead end from all three lineages
    - then an unnumbered `## Divergence Map` section: saturated directions, pivots, contested ideas, failures and the remaining frontier. Say plainly if no divergent pivots happened
12. Open Questions: each with what would resolve it
13. Proposed Build Phases (shape below)
14. Citation Verification Ledger: every citation you checked, with its result
15. Evidence Quality and Caveats: including the run facts listed above and any containment advisories
16. References
17. Convergence Report: write only the heading and one line saying the workflow appends it. The workflow fills it after you

### Recommendation shape (section 11)

Rank every recommendation into one of four verdicts: build-now, next, later or drop. Order by value to the operator, weighed against cost, latency, privacy and risk, with the smallest measurable slice first. Each entry carries:
- Verdict with one sentence of reason
- What Jev judges, with the judgment type (`noul`, `choice`, `score` or `run`) and which `jev` package
- Seam at `file:line`
- Value: the decision that gets cheaper, faster or more accurate
- Metric, baseline and harness: the harness id from `context/measurement-digest.md`, today's number with its citation or UNKNOWN, and the shadow or A/B design. Where no harness exists, the gap row and its smallest harness, which becomes part of the first slice
- Cost, latency and privacy: calls per use, the deadline it must meet, what state leaves the machine
- Opt-in and no-key behavior: the switch, and exactly what happens with no key, exit 3, exit 4 or a malformed answer
- Smallest slice: one caller, end to end, with the files it touches and rough LOC
- Fitness checklist: the questions it fails, if any, and why that is acceptable
- Confidence: confirmed or inferred, and what would confirm an inferred claim
- Lineage agreement: all three, two (named), one (named) or disputed, and whether independent
- Citation check: resolved, drifted or failed

### Build phase shape (section 13)

Propose at most 6 build phases, numbered from `002` onward under `specs/cli-jev/003-cli-jev-workflow-integration/`. Each groups related build-now and next recommendations. Give each:
- a literal kebab-case folder slug naming the concrete subject, for example `002-model-benchmark-jev-grader`, never `002-phase-2` or `002-improvements`
- a one-line scope
- the recommendations it carries
- its first slice: one caller, end to end, with its measurement
- the files it would likely touch
- its dependency on other phases
- a rough size
- the observable check that would prove it worked

Put a measurement-only phase first if no recommendation can be judged without a harness that does not exist yet. End the section by recommending which phase to do first, and why. Later-verdict items are listed as not phased, with the condition that would promote them.

## Report back

End with a short report for the orchestrator:
- the path you wrote
- the number of recommendations per verdict (build-now, next, later, drop)
- citations checked, resolved, drifted and failed
- the top three recommendations, one line each
- the proposed phase slugs in order
- how many lineage agreements you counted as independent versus after cross-reading
- anything you could not resolve

Never claim a check you did not run.
