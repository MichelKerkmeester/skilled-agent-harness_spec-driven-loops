You are the synthesis step of a finished five-lineage deep research, round 3 of the Jev research. You write one file and report back. You are a leaf: never dispatch another agent.

## Pre-resolved gates (do not ask about these)

- Gate 3 is answered: A) existing spec folder `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research`. Nobody is at your prompt to answer a question, so a question stops the work. Decide, and record the decision in the file.
- Skill routing is resolved: this is the `/deep:research` synthesis step (`step_compile_research` in `.skilled/commands/deep/assets/deep-research-auto.yaml`). `research.md` is a research artifact, not an sk-doc document. Load nothing else.
- Write scope is exactly one file: `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/research/research.md`. Do not create, edit or delete any other file. That includes every `steer.md`, every phase doc, both earlier syntheses and every Planned build phase. Do not run git writes, `validate.sh`, `generate-context.js`, any test suite or any install.
- Make no live `jev` call of either package. Never call, start, stop or update the local Deem server. Only the orchestrator calls it. Never open a `.env` file.

## The question the research answered

Rounds 1 and 2 asked where Jev, a hosted and keyed typed-judgment model, earns a measured, opt-in place in this repository. Round 3 adds a second backend and new ground. It asks where a classifier model, Jev hosted or Deem local, cuts the main AI's context and manual review work. It covers eight questions:
- **A.** Deem on this Mac and `cli-deem`: serving, latency, memory, the 0.8B against the 9B from their published numbers, accuracy against Jev, the missing Deem CLI, the lifecycle (install, start, health, update on a new Hugging Face commit and rollback), `cli-deem`'s place in a `cli-classifier` hub and whether the Python `jev-cli`'s `custom` provider makes it a thin wrapper.
- **B.** Which round-1 and round-2 drops were drops only for cost, quota, latency or egress, and which flip under a free, private, local model.
- **C.** Context reduction: skill and resource routing including ROUTER leaves, retrieval reranking, file relevance, compaction keep or drop and tool-output pruning.
- **D.** Validators: every template-alignment check in spec-kit, sk-doc, `check-goal.cjs`, frontmatter and the command, skill and agent docs, the judgment calls left after they pass and the precision a classifier reaches on them.
- **E.** sk-prompt: framework pick, CLEAR scoring and ambiguity.
- **F.** sk-design: mode routing and rubric scoring.
- **G.** Open discovery: new skills and workflows with measured value.
- **H.** Order, savings in context tokens, AI passes and minutes, cost and kill criteria.

The brief, the questions and the required answer shape are in the `Research Brief` section of `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/spec.md`. Read it first.

## Inputs (read all of them)

Base: `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/`

1. **The five lineages.** For each, read every file in `research/lineages/<label>/iterations/`, the lineage's `research.md` if it wrote one and its `steer.md`.

   | Label | Model and effort | Executor | Iterations | Lens |
   |---|---|---|---|---|
   | `grok` | Grok 4.7 xhigh fast. Grok 4.7 lists no MAX tier | cli-cursor | 10 | Outside patterns and the vendored Deem and Jev material |
   | `deepseek` | DeepSeek V4.1 Flash, max | cli-pi (`llmgateway`) | 10 | Seams, gating and failure paths, including the two-backend gate |
   | `mimo` | MiMo V2.6 Pro, high | cli-pi (`llmgateway`) | 10 | UX and measurement: context tokens, AI passes and minutes, with baselines |
   | `swe` | SWE-2 Max | cli-devin | 10 | Code-level slice design, including validators and template-alignment checks |
   | `glm` | GLM-5.3-Flash, max | cli-pi (`llmgateway`) | 5 | The contrarian: what not to build and where others overengineer |

2. **The merged state** under `research/`. List that directory first and read every merge file it holds, for example `findings-registry.json`, `fanout-attribution.md`, `resource-map.md`, `orchestration-summary.json` and `observability-events.jsonl`. Also read each lineage's own state log, registry and strategy.
3. **This phase's own docs**: `spec.md`, `plan.md`, `goal.md`, `context/research-angles.md` and `context/deem-local.md`. The angles file maps every iteration to its angle, wave and lens and holds the per-iteration contract. `deem-local.md` is the orchestrator's install record and measurements of the served Deem.
4. **The baselines**, which your synthesis extends and never silently overrides:
   - `../004-deep-research-expansion/research/research.md`, the round-2 final synthesis, called BASE2 below. Read at least section 1, its Changes section, section 9, section 11 with What Not To Build and the Divergence Map, section 12 and section 13. It holds R1 to R22, What Not To Build rows 44 to 72 and open questions 1 to 38.
   - `../001-deep-research/research/research.md`, the round-1 re-synthesis, called BASE1 below. Read at least section 9 with its privacy table and What Not To Build rows 1 to 43.
5. **The fitness checklist**: `../001-deep-research/context/repo-rules-digest.md`, Q1 to Q15 in section 3 and the red flags in section 4.
6. **The vendored material**: the Deem repository in `context/deem-main/`, and the five repositories, two website files, three posts and the operator's ideas file under `../context/`, wherever a lineage cites them.
7. **The transport skill** `.skilled/skills/cli-jev/`, and the vendored Python `jev-cli` source at `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py`.
8. **The source code at every `file:line`** any lineage cites for a recommendation you keep. Open it. Do not trust the citation.

## Facts about the run that you must account for

- **Five model families, one Claude layer.** The lineages are five non-Claude families on one brief with five lenses. The two baselines, the five leads and you are all Claude Opus 5.5. Where a lineage reaches the same call as a baseline, it counts as cross-family corroboration only if the lineage reopened the code or ran the count itself. Agreement you reach from your own reading is a Claude reading, not corroboration.
- **Only wave-1 agreement counts as corroboration.** Wave 1 is iterations 1 to 3 for `grok`, `deepseek`, `mimo` and `swe`, and iteration 1 for `glm`. In wave 1 no lineage read another lineage's round-3 files.
  - From wave 2 on, each lineage read the newest iteration of the others and pushed past it. Agreement there is not independent. Check whether the later iteration cites the sibling or cites code and counts it opened itself, and report the two apart. Count neither as corroboration.
  - Each iteration names the sibling files it read in a Sibling check section. Use those, by iteration number.
  - Agreement inside one lineage is never corroboration.
- **The leads are a shared Claude influence.** Each lineage had an Opus 5.5 high lead that reviewed every iteration and appended steering to `research/lineages/<label>/steer.md`, which every iteration read first. A steer usually reached the iteration after next, because each lineage ran its iterations back to back. Read each `steer.md` beside its iterations.
  - A wave-1 agreement counts only if neither lineage's `steer.md` suggested it before that iteration ran. Where a steer did, record the agreement as steered.
  - Where an iteration follows a steer's suggestion, the finding is the iteration's evidence, not the lead's authority.
- **The merge under-counts findings.** In rounds 1 and 2 the merge rebuilt 85 of 112 and 74 of 118 count-only findings, and `step_convergence_report` recorded `synthesis_incomplete` both times. Read every iteration file directly, and never trust a merged count, a registry or a resource map over the iteration markdown.
- **Lineage timestamps are unreliable.** Earlier runs recorded state timestamps outside the real run window. Never use one as evidence of order. Use iteration numbers, and the runner's own events in `research/observability-events.jsonl` for durations.
- **`newInfoRatio` is self-report.** Judge new information from each iteration's New against baseline table and from the code. The contract counts a restated baseline finding without new evidence as no new information.
- **Two packages install a `jev` command.**
  - The Python `jev-cli` 0.6.2 is what `.skilled/skills/cli-jev/cli-usage/` wraps.
  - The npm `jevctl` 0.2.3 is vendored research material at `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main`.
  - Their exit codes disagree: exit 2 is a usage error with no quota spent in the Python `jev-cli`, and a tripped `--fail-on` gate in `jevctl`.
  - Keep them apart in every sentence. A lineage claim that mixes them is wrong until you show which package it holds for.
- **Deem facts.** Cite `context/deem-local.md` by line for each.
  - The served model is `LibertAIDAI/deem-0.8-v1` in bf16, at Hugging Face commit `8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21`, on Deem's Python server with `DEEM_DEVICE=mps` at `127.0.0.1:8300`.
  - Measured on synthetic inputs: a p50 of about 60 ms and a p95 of 62.8 to 78.5 ms per call, a 3,368 MB physical footprint and about 10 s from start to healthy.
  - It is uncalibrated (temperature 1.0), and its quality on this repository's judgments is unmeasured. Any lineage accuracy claim for it is inferred or a vendor claim.
  - The 9B (`LibertAIDAI/deem-9b-v1`) is a documented option that nobody serves. Every 9B figure is a vendor claim.
  - No Deem CLI exists. Deem publishes releases only as new Hugging Face commits, with no GitHub releases or tags. The operator wants the local model kept current with them (parent D3).
- **An inferred wire gap.** The orchestrator confirmed that Deem's server serves the System One API shape and that the vendor says `typesafe-sdk` works against it. Code suggests the Python `jev-cli`'s typed subcommands may not reach Deem unchanged. Reopen `jev_cli/__init__.py:364-369` and `:389-393` against `deem_server.py:535`, `:542`, `:606` and `:618`, and settle it from code and the lineages' evidence. Nothing live has tested it.
- **The reopened deadlines.** A warm local call of about 60 ms sits inside the 2,500 ms advisor hook and the 3 s PreCompact hook behind BASE1 rows 1 and 5. The cost of a spawn, a connection or a cold start inside a hook is unmeasured (`deem-local.md:44`, `:50`). A row reopens only as far as the evidence supports.
- **Vendor claims were never reproduced here.** Jev prices and latencies, Deem's published accuracy and any figure from a README, website or post are vendor claims or user reports. Label them wherever you use them.
- **Private data.** Lineages were told to report transcript and goal-state findings as counts, lengths and field names only. If an iteration quotes transcript or reply text, do not carry the text into your file, and list the iteration in the caveats section.
- **The workspace.** The run happened in the git worktree `.worktrees/069-cli-jev-workflow-integration` on branch `worktrees/069-cli-jev-workflow-integration`. When this brief was written, HEAD was `17bc67ad2b` with the preparation files uncommitted. Take the launch HEAD from the run's own files if they record it, and write UNKNOWN if they do not.
- **Containment.** Each lead wrote only its own lineage's `steer.md`, and sibling lineage directories are excluded from each lineage's containment. An advisory naming a `steer.md` is a lead's write. Any other advisory naming a file outside `research/lineages/<label>/` points at that lineage. Report every advisory in the caveats section.

## The two-backend gate (parent D1)

Every recommendation runs on Jev or Deem and stays dormant unless one is available.
- **Jev** is available only when `command -v jev` succeeds, `jev --version` prints `jev 0.6.2` and `jev auth status --provider <p>` exits 0 for the provider the feature calls.
- **Deem** is available only when the local server passes a health check. The lineages were asked to define that check from code (angle deepseek-01), including how it refuses the uniform-logit stub the server falls back to without a checkpoint (`deem_server.py:137-154`, `:772-777`). Adopt, amend or replace their definition, and say which.
- **Preference.** Each recommendation says which backend it prefers when both are available, and why.
- **With neither**, it behaves exactly as today and says so in one line.
- **Switches.** Each feature keeps its own switch. There is no global switch (BASE1 row 42), and no path returns a default score or verdict (BASE1 row 9). A recommendation that cannot state this drops.

## What to do

1. **Verify.** For every recommendation you rank, reopen each cited `file:line` and record it in the ledger as resolved, drifted or failed.
   - Drifted means the right file but the wrong lines: give the right lines.
   - Failed means the file or content is absent.
   - A recommendation whose load-bearing citation failed drops, or stays marked `citation failed` with its verdict lowered to drop or later and the reason given.
   - Re-verify every count a lineage reports that changes a verdict, by rerunning it read-only where you can. Where you cannot, mark it lineage-reported.
2. **Compare lineages.** Mark each recommendation as found by five, four, three, two or one lineage (name them) or disputed. Say whether the agreement was independent under the wave rule and unsteered.
   - Where lineages disagree, do not average or tally. Say which evidence is stronger and why, or mark it unresolved.
   - Say separately whether each round-3 finding agrees with, extends or contests BASE2.
3. **Re-rank the drops under a free, private, local model (question B).** Take every What Not To Build row in BASE1 (1 to 43) and BASE2 (44 to 72) and every later item in BASE2 section 11.
   - For each, name the load-bearing reason: cost, quota, latency, egress, no gold, authority, no seam or no reader.
   - Say whether a local Deem removes that reason, keeps it or leaves it unknown, and give the new verdict: stays dropped, reopens as build-now, next or later, or unknown.
   - A row whose reason includes no gold, authority (Q8, Q11) or no seam never flips on backend alone.
   - Put the full table in section 4, and carry every changed row into What Not To Build.
4. **Judge against the fitness checklist.** Run every recommendation through Q1 to Q15 and the red flags. A recommendation that fails a question either says why that failure is acceptable or drops. A classifier answer is one lens, never a verdict or a permission.
5. **Judge for yourself.** You are not bound by any lineage's verdict, any lead's steer or either baseline's. Where the code says otherwise, say so and cite it.
6. **Keep claims honest.** Mark each load-bearing claim confirmed from code or a count, or inferred, and for an inferred one name what would confirm it. Write UNKNOWN rather than guess. Never invent a flag, env var, harness figure, file name, commit or model id. Names that do not exist yet are marked "proposed".

## research.md structure

Use these 18 numbered sections in this order, with one unnumbered section after section 1. A table of contents is allowed in this file only.

1. **Executive Summary.** The verdict in five lines or fewer, including the single build-now item you would start with and where Deem stands.
   - then an unnumbered `## Changes From the Round-2 Synthesis` section: every verdict, rank, record, drop row, phase and open question that round 3 changes against BASE2, each with its reason and evidence, in BASE2's table style. Items round 3 left untouched are not listed. Say so in one line.
2. **Scope, Method and Inputs.** Lineages, models, executors, lenses, iteration counts, the leads, runner durations from the runner's own events, the Deem commit measured, what was verified and how, and what was not run.
3. **A: Deem on this Mac and `cli-deem`.** Serving, measured speed and memory, the 0.8B against the 9B from published numbers, the accuracy comparison against Jev as designed, the wire question settled, the lifecycle including updates on new Hugging Face commits and rollback, and the verdict on wrapper, translator or client.
4. **B: The drops that flip.** The full re-rank table from step 3 of What to do.
5. **C: Context reduction.** Each seam with its deadline, headroom, counted baseline and net saving.
6. **D: Validators.** The complete check map across spec-kit, sk-doc, DQI, HVR, `check-goal.cjs`, frontmatter and the command, skill and agent docs, the judgment residue after each passes and the precision a classifier would need.
7. **E: sk-prompt.**
8. **F: sk-design.**
9. **G: Open discovery.** New skills and workflows, each with its measured value or marked unmeasured.
10. **H: Order, savings, cost and kill criteria.** The build order of the survivors, their savings in context tokens, AI passes and minutes against counted baselines, their cost per backend and what kills each.
11. **Cross-Lineage Agreement.**
    - Where the five families agreed independently and unsteered in wave 1.
    - Where agreement came after cross-reading, split by whether the lineage cited code it opened or only a sibling.
    - Where a lead's steer preceded the agreement.
    - Where only one lineage looked, and where they disagreed.
    - Cross-family corroboration of BASE2's calls on R1, R19, R2 and R20.
12. **Recommendations.** The ranked list, in the shape below.
    - then an unnumbered `## What Not To Build` section as a table `| # | Idea | Reason | Checklist question or red flag | Evidence | Lineage(s) |`. It consolidates every dropped idea and dead end from all five lineages, continues the row numbers from BASE2's row 72 and lists every BASE1 or BASE2 row round 3 changes.
    - then an unnumbered `## Divergence Map` section: saturated directions, pivots, contested ideas, failures and the remaining frontier. Say plainly if no divergent pivots happened.
13. **Open Questions.** Carry BASE2's open questions forward with their new status, and number new ones from 39. Each says what would resolve it.
14. **Proposed Build Phases.** In the shape below.
15. **Citation Verification Ledger.** Every citation you checked, with its result.
16. **Evidence Quality and Caveats.** Include the run facts above, every containment advisory, every steered agreement and any lineage that quoted private text.
17. **References.**
18. **Convergence Report.** Write only the heading and one line saying the workflow appends it. The workflow fills it after you.

### Recommendation shape (section 12)

**Ids.** BASE2's R1 to R22 keep their ids. A new recommendation takes the next free id from R23 upward, and ids are never reused. A merged or split item keeps its old id and says what it absorbed. Lineages named new ideas `N-<angle id>-<k>`. Map each one you keep to its R id, and list every N id with its disposition.

Rank every recommendation, old and new, as build-now, next, later or drop. Order by value to the operator weighed against cost, latency, privacy and risk, smallest measurable slice first. A Deem-backed recommendation ranks above later only if its first slice makes zero calls or a measured accuracy set exists for it. Each entry carries the goal's D4 answer shape:
- **Verdict**, with one sentence of reason, and the change from BASE2's verdict if any.
- **What the classifier judges**, the judgment type (`noul`, `choice`, `score` or `run`) and which backend and package.
- **Seam** at `file:line`.
- **Value**: the decision or read that gets cheaper, faster or more accurate.
- **Metric, baseline and harness**: today's number with its citation or UNKNOWN, the design, and where no harness exists the smallest harness as part of the first slice.
- **Savings**: context tokens, AI passes and minutes per use and per week, each from a count or marked estimate.
- **Cost, latency and privacy per backend**: calls per use, the deadline it must meet and what leaves the machine. Jev sends state off the machine. Deem keeps it local.
- **Two-backend gate and no-backend behavior**: its own switch, how each backend is detected, which it prefers, exactly what happens on each failure of either backend, and one line confirming that with neither it behaves exactly as today.
- **Smallest slice**: one caller end to end, with files, functions, test cases, rough LOC and a rollback sentence.
- **Keep or kill rule**, fixed before the build.
- **Fitness checklist**: the questions it fails, if any, and why that is acceptable.
- **Confidence**: confirmed or inferred, and what would confirm an inferred claim.
- **Lineage agreement**: how many and which, whether independent and unsteered, and how it stands against BASE2.
- **Citation check**: resolved, drifted or failed.

### Build phase shape (section 14)

**Existing Planned phases.** `002-advisor-jev-tiebreak-arm`, `003-goal-verifier-jev-shadow`, `005-compaction-recall-harness` and `006-goal-criteria-lint` stay, unless you argue otherwise with evidence. For each, list the Deem amendments line by line:
- the lines that gate on Jev alone today, with `file:line`, and their two-backend replacement text and skip lines
- which keep rule, latency line or cost line changes when Deem is the backend
- whether the phase should take Deem at all, and why
- whether it is amended, unchanged or parked

`004-deep-research-expansion` and this phase are research phases, not build phases.

**New Planned phases.** Number them from `008` upward under `specs/cli-jev/003-cli-jev-workflow-integration/`. Propose at most six, and give each a reason it earns its own folder. The set must include the `cli-classifier` hub holding `cli-jev` (moved) and `cli-deem` (new), because the parent's D2 requires it. Its shape is yours to decide from the evidence:
- one phase or a split into the hub and `cli-deem`
- the move of `cli-jev` now or later
- `cli-deem` as a wrapper, translator or client
- `cli-deem`'s lifecycle: install, start, health, update when Deem publishes a new Hugging Face commit and rollback to the previous commit, including how a measured keep rule survives an update

Give each new phase:
- a literal kebab-case folder slug naming the concrete subject, for example `008-cli-classifier-hub`, never `008-phase-8` or `008-improvements`
- a one-line scope and the recommendations it carries
- its first slice: one caller end to end, with its measurement
- the files it would likely touch
- its switch and two-backend gate behavior
- its dependency on other phases, a rough size and its kill criterion
- the observable check that would prove it worked

Put a measurement-only phase first if no recommendation can be judged without a harness that does not exist yet. End the section by recommending which phase to do first, and why. List later-verdict items as not phased, each with the condition that would promote it.

## Report back

End with a short report for the orchestrator:
- the path you wrote
- the number of recommendations per verdict, and how many are new from R23 onward
- how many drops the re-rank reopened, and which
- citations checked, resolved, drifted and failed
- the top three recommendations, one line each
- where Deem stands: its role, the wire verdict and the lifecycle shape
- the Deem amendments to 002, 003, 005 and 006 in one line each
- the proposed new phase slugs in order
- how many lineage agreements you counted as independent and unsteered, against how many after cross-reading or steering
- every containment advisory, and anything you could not resolve

Never claim a check you did not run.
