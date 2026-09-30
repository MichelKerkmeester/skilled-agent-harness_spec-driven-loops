# Research Angles

Path prefixes used below:
- `PHASE/` = `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/`
- `CTX/` = `specs/cli-jev/003-cli-jev-workflow-integration/context/`
- `R/` = `CTX/external repo's/`
- Seam ids `S01` to `S26` are in `PHASE/context/seam-map.md`. Harness ids `H1` to `H15` are in `PHASE/context/measurement-digest.md`. Checklist questions `Q1` to `Q15` are section 3 of `PHASE/context/repo-rules-digest.md`.

## How an iteration uses this file

1. **Find your angle.** Your label is the last path segment of `config.fanout_lineage_artifact_dir` (`deepseek`, `mimo` or `grok`). Iteration N takes the angle with id `<label>-NN`, two digits: iteration 1 of the Grok lineage takes `grok-01`, iteration 10 of the DeepSeek lineage takes `deepseek-10`. Set the iteration's Focus Area to that id and title.
2. **One angle per iteration.** Do not drift into the next angle. If the angle's question is answered early, go deeper on it, not wider.
3. **Budget.** About 12 tool calls. Spend them on opening code, not on rereading the digests.
4. **Cite.** Every claim carries a repo-relative `file:line`, and only for lines you opened in this iteration or a cited earlier one. A digest citation you did not reopen is quoted as the digest's claim, not yours.
5. **Stay read-only.** Write only inside your lineage directory, `PHASE/research/lineages/<label>/`. Your iteration lands at `PHASE/research/lineages/<label>/iterations/iteration-NNN.md`. Read anything else, write nothing else. No git writes, no test suites, no `validate.sh`, no installs.
6. **Build on yourself.** Read iteration N-1 of your own lineage first and pick up its open threads, as named in its hand-off.
7. **Build past the others.** From wave 2 on (iteration 4 onward), read the newest iteration file of each of the other two lineages if one exists, at `PHASE/research/lineages/<other>/iterations/`. Push past what it found, contest it with code, or say plainly that you agree and why. Never restate it as new. Grok usually runs ahead, so the other two lineages will often find a newer Grok file.
8. **No live `jev` calls.** No `jev`, `jev auth test` or any request to a Jev endpoint. Every judgment is billed and state is sent off the machine. Reason from code, docs and recorded reports (H8).
9. **Name the two packages apart.** The Python `jev-cli` 0.6.2 is what `.skilled/skills/cli-jev/cli-usage/` wraps. The npm `jevctl` 0.2.3 is vendored research material at `R/jev-cli-main`. Both install a `jev` command, and their exit codes disagree (exit 2 is a usage error in one and a tripped gate in the other). Every claim about `jev` says which one it means.
10. **Never open a `.env` file** anywhere, vendored or not.

### The per-idea record

Fill this block for every idea the iteration assesses, one block per idea:

| Field | What goes in it |
|---|---|
| **Idea** | One line: what Jev judges, with which type (`noul`, `choice`, `score`, `run`) |
| **Value** | What decision gets cheaper, faster or more accurate, and for whom |
| **Seam** | `file:line` where the call would sit, opened this iteration |
| **Metric, baseline, harness** | The number that moves, today's value with its citation (or UNKNOWN), and the harness id from the measurement digest, or the gap row and its smallest harness |
| **Cost, latency, privacy** | Calls per use, what state leaves the machine, the deadline it must meet |
| **Opt-in and no key** | The switch that turns it on, and exactly what happens with no Jev key or a failed call (must be today's behavior, said plainly, never a silent default score) |
| **Complexity** | Rough lines of code and the files touched |
| **Verdict** | build-now, next, later or drop, with one sentence of reason |
| **Confidence** | Confirmed from code, or inferred plus what would confirm it |

End every iteration with a **Hand-off** section: the open threads the next iteration of your lineage must pick up, one line each.

## The three lenses

**`deepseek`: the integration engineer.** You care whether the thing can be wired without breaking what is there. Find the exact call site, the hook contract and its deadline from `.claude/settings.json`, the process boundary a `jev` subprocess would cross, and the env flag shape the neighbouring code already uses. Name the degrade path when the key is missing, the call exits 3 or 4, or the answer is malformed. Size every idea in lines of code and files touched, and name the callers and frozen contracts it would touch (Q8).

**`mimo`: UX and measurement.** You care whether the operator notices, and whether anyone can prove it helped. For each idea, say what the operator sees, decides or types differently, what the default is, and whether it adds a flag, a prompt or a report to read. Then design the proof: the metric, the baseline already recorded, the harness that runs it, and a shadow or A/B design on that harness that never serves Jev's answer before it is measured. Where no harness fits, name the smallest one from the gaps table.

**`grok`: contrarian and outside patterns.** You care whether it should exist at all. Mine the five vendored integrations under `R/` and the posts under `CTX/social posts/` for what worked, what the authors conceded, and what carries over to a CLI transport. Offer the bold version of each idea, then argue the case against it: cheaper existing code, one-lens verdicts, cache breakage, egress, near-threshold noise. Every idea you keep gets a kill criterion: the measured result that would drop it.

## Wave 1: ground the operator's four ideas (iterations 1 to 3)

Source for the ideas: `CTX/ideas from michel kerkmeester.md:1-13`. Every idea is opt-in and needs an active Jev key.

### deepseek-01: Grading AI responses, the wiring
- **Question:** Where exactly would a Jev grade of a model's output be called, and what does each candidate site already expect back?
- **Start from:** S22 `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs`, `.../model-benchmark/run-benchmark.cjs`, `.../scorer/grader/harness.cjs`, S09 `.skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs`, `.skilled/skills/cli-jev/cli-usage/SKILL.md`.
- **Hand off:** the grader interface shape a `jev` kind must return, the exit-code mapping it needs, and which sites fit a synchronous call versus only an offline one.

### deepseek-02: Active skill-advisor recommendations, the wiring
- **Question:** Can a Jev tie-break live inside the 2500 ms advisor child, or only as a shadow lane or an offline precompute, and what does each shape cost in code?
- **Start from:** S01 to S05, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`, `ambiguity.ts`, `lane-registry.ts`, `lanes/semantic-shadow.ts`, `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`.
- **Hand off:** the feasible shape (live, shadow or offline), the flag name pattern it would copy, and the files a shadow lane touches.

### deepseek-03: The goal hook and compaction, the wiring
- **Question:** What would a Jev verifier in the goal hook and a Jev keep-or-drop pass at compaction each plug into, across the Claude, OpenCode and Pi surfaces, inside their deadlines?
- **Start from:** S08 `.skilled/hooks/goal/lib/goal-core.cjs`, `.skilled/hooks/goal/pi/goal-context.ts`, the other runtime adapters under `.skilled/hooks/goal/`, S14 `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts`, `shared.ts`, `R/jev-cli-main/plugin/hooks/fast-jev.ts`.
- **Hand off:** per surface, whether a call fits the deadline, which runtime lacks the seam, and the degrade path each needs.

### mimo-01: Grading AI responses, what the operator gets
- **Question:** Which grading use would change something the operator sees or decides, and which would only add a number to ignore?
- **Start from:** H9 and H13 in the measurement digest, `.skilled/skills/sk-communication/benchmark/reply-harness/README.md`, `.skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md`, section 5 of `PHASE/context/repo-rules-digest.md`.
- **Hand off:** one grading use with a named gold set and an agreement metric, and the uses to drop because nobody acts on the grade.

### mimo-02: Active skill-advisor recommendations, the proof
- **Question:** Is there enough measurable headroom on the advisor corpus for a Jev tie-break to show a gain, and what shadow design proves it without touching the ratchet?
- **Start from:** H1, H2, H5, `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json`, `score-outcome-rerank.mjs`, `lib/shadow/shadow-sink.ts`.
- **Hand off:** the exact arm design, the rows it can move at most, the baseline to beat, and what the operator sees when Jev and the scorer disagree.

### mimo-03: The goal hook and compaction, friction and proof
- **Question:** Would a Jev goal verdict or a Jev compaction pass reduce operator nudges, lost context or repeated work, and how would either be measured with no labeled set today?
- **Start from:** H12, the compaction gap row in the measurement digest, `.skilled/hooks/goal/README.md`, `.skilled/hooks/goal/lib/goal-core.test.cjs`, `.skilled/skills/system-spec-kit/runtime/tests/hook-precompact.vitest.ts`.
- **Hand off:** the smallest labeled set for each, its size and who labels it, and the default each feature ships with.

### grok-01: Grading AI responses, outside patterns and the case against
- **Question:** What did the vendored integrations and posts learn about grading with Jev, and when is a grade worse than no grade?
- **Start from:** `R/claude-jev-main/src/domain/catalog/review.ts`, `R/claude-jev-main/README.md` (the planted false positive), `CTX/social posts/Reddit - I think i found the best use case for JEV and PI.md` (the done gate), `R/supercov-main/docs/quality.md`.
- **Hand off:** the grading patterns worth carrying over, the anti-patterns, and a kill criterion for any grading idea.

### grok-02: Active skill-advisor recommendations, the bold version and its rebuttal
- **Question:** What is the boldest Jev role in skill routing, and why might suggestion-only or nothing beat it?
- **Start from:** `R/jev-cli-main/docs/guidelines.md`, `R/jev-cli-main/src/core/`, `CTX/social posts/Reddit - Integrated the Jev context engine into Hermes.md` (skill selection comments), the per-prompt switching anti-pattern in `PHASE/context/jev-material-digest.md`, S02, S04.
- **Hand off:** the bold idea, the strongest argument against it from code, and the conditions under which it would win.

### grok-03: The goal hook and compaction, what the outside world tried
- **Question:** What do jevctl's compaction hook, pi-jev-context and the Hermes plugin teach about goal judgment and context reduction, and what broke for them?
- **Start from:** `R/jev-cli-main/plugin/hooks/fast-jev.ts`, `R/jev-cli-main/src/vendor/compaction/compact.ts`, `R/pi-jev-context-main/src/index.ts`, `src/context.ts`, `src/jev.ts`, the Hermes post.
- **Hand off:** the patterns that carry over to this repository's hooks, the cache and lost-state risks, and a kill criterion for each idea.

## Wave 2: cross-cutting judgment points (iterations 4 to 6)

Read the newest iteration of the other two lineages first. Each angle names which typed judgment the seam makes today, by code or by a model.

### deepseek-04: Deep-loop stop and convergence
- **Question:** Where would a Jev second rater enter the stop decision without becoming authoritative, and how would the reducer carry its signal?
- **Start from:** S15, S16, S19, S20, `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs`, `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`, `.skilled/skills/system-deep-loop/runtime/lib/stopping-clocks/stopping-clock-shadow.ts`, `.skilled/skills/system-deep-loop/runtime/lib/next-focus/next-focus-selection.ts`.
- **Hand off:** the one stop-path seam that already has a shadow slot, the state-file fields it would add, and the contract owners it touches.

### deepseek-05: Finding triage and dispatch guards
- **Question:** Which of deep-review severity replay, fan-out duplicate collapse and the dispatch guards can take a Jev call inside their deadlines, and which cannot?
- **Start from:** S11 to S13, S17, S18, `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs`, `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs`, `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`, `.skilled/skills/system-deep-loop/runtime/lib/blinded-adjudication/`.
- **Hand off:** the triage seam with the cleanest wiring, its LOC, and the guard seams ruled out with the reason from code.

### deepseek-06: Validation triage, routing clarify and defer, verdicts
- **Question:** Which of the spec-kit validation, compiled-routing clarify and defer, and playbook or benchmark verdict seams accept a Jev call without touching a frozen contract?
- **Start from:** S06, S07, S09, S10, S22 to S26, `.skilled/bin/compiled-route.cjs`, `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs`, `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts`.
- **Hand off:** the seams whose contract permits an extra advisory field, and a combined shortlist across wave 2 ranked by wiring cost.

### mimo-04: Deep-loop stop and convergence, iterations saved
- **Question:** Would a Jev stop signal save iterations at equal cited-finding count, and how would a replay over archived lineages measure it?
- **Start from:** H10, H11, the deep-loop stop gap row, archived lineage state files under `specs/**/research/lineages/`, `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence-signals.md`.
- **Hand off:** the replay design, the archived runs it would use, and what the operator would see differently when a loop stops.

### mimo-05: Finding triage, agreement with adjudicated gold
- **Question:** Would a Jev severity call on deep-review findings agree with the final adjudicated severity often enough to save a human pass, and where does the gold come from?
- **Start from:** H9, H14, the finding-triage gap row, archived `review/` folders under `specs/`, `.skilled/skills/system-deep-loop/deep-review/references/protocol/completion-criteria.md`.
- **Hand off:** the gold source, the agreement metric and its threshold for usefulness, and the operator-facing change (fewer P0s to reread, or none).

### mimo-06: Validation triage, routing clarify and defer, operator friction
- **Question:** At which of these seams does the operator currently answer a question or read a warning that a Jev suggestion could pre-answer, and is there enough gold to prove it?
- **Start from:** H3, H6, H7, H8, the canary fixtures under `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/*/fixtures/`, the manual-testing playbook of `.skilled/skills/cli-jev/cli-usage/`.
- **Hand off:** the friction points ranked by how often they reach the operator, and the ones with too few gold rows to measure.

### grok-04: Deep-loop stop, the case against a Jev judge
- **Question:** Does the repository's own rule that one model is one opinion rule out a Jev stop signal, or does a different-family numeric judge count as a second lens?
- **Start from:** `.skilled/repo-rules/delegation-and-orchestration.md`, S15, S16, S19, the newInfoRatio flatline warning in `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`, `R/claude-jev-main/README.md` (weaknesses: counting, indirection, noisy state).
- **Hand off:** the verdict on a Jev stop signal with its kill criterion, and what Jev is structurally bad at in loop state.

### grok-05: Finding triage, what jev-review and claude-jev actually do
- **Question:** Do the jev-review funnel and the claude-jev review catalogue carry over to deep-review and fan-out merge, and where do they fail?
- **Start from:** `R/jev-review-main/src/review/workflow.ts`, `src/review/judgments.ts`, `src/domain/config.ts`, `R/claude-jev-main/src/domain/catalog/review.ts`, S17, S18.
- **Hand off:** the funnel stages that fit, the whole-run abort and other shapes that must not, and a kill criterion.

### grok-06: Guards, validation and routing, where Jev is the wrong tool
- **Question:** Which wave-2 seams are repository facts that Jev must not replace, and which bold idea survives, for example a `screen`-style injection gate on fetched content?
- **Start from:** S10 to S13, `.skilled/skills/cli-jev/cli-usage/SKILL.md` (the rule against replacing repository facts), `R/jev-cli-main/src/core/screen.ts`, `R/jev-cli-main/docs/recipes.md`, the context-steers-the-judge anti-pattern.
- **Hand off:** a drop list with reasons from code, and at most two bold ideas worth wave 3.

## Wave 3: new skills, commands and workflows (iterations 7 and 8)

Each new surface must carry a measured-usefulness design from `PHASE/context/measurement-digest.md`. Build on what waves 1 and 2 ranked highest across all three lineages, not on a fresh list.

### deepseek-07: The smallest new surface
- **Question:** Do the top ideas so far need a new skill, command or shared helper, or can each call the `cli-usage` transport from its own seam? If a shared piece is needed, what is the smallest one that three real callers use?
- **Start from:** `.skilled/skills/cli-jev/SKILL.md`, `.skilled/skills/cli-jev/cli-usage/references/integration-patterns.md`, the top seams from your iterations 1 to 6, section 2 items 2, 11 and 12 of `PHASE/context/repo-rules-digest.md`.
- **Hand off:** the surface decision (none, helper, command or skill), its callers at `file:line`, and its LOC.

### deepseek-08: The measurement harness as code
- **Question:** What is the smallest runnable harness for the top two ideas: the latency and cost probe, a gold-set scorer, or a new grader kind on H9? Where does it live and what does it write?
- **Start from:** the gaps table in `PHASE/context/measurement-digest.md`, H1, H2, H9, `.skilled/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs`.
- **Hand off:** the harness file list, its output format, and how it runs with no key (skip and say so).

### mimo-07: New commands and workflows the operator would actually use
- **Question:** Which new command or workflow step removes a decision from the operator rather than adding one, and what is its default?
- **Start from:** `.skilled/commands/`, `R/claude-jev-main/commands/`, `R/jev-cli-main/docs/recipes.md`, section 5 of `PHASE/context/repo-rules-digest.md`, the top ideas from all lineages' iterations 1 to 6.
- **Hand off:** at most three surfaces with the operator's before and after, and the ones that only add a report to read.

### mimo-08: The usefulness proof for each new surface
- **Question:** For each surface kept in mimo-07 and the other lineages' wave 3, what is the proof plan of one to five pass or fail checks, written before the build?
- **Start from:** section 3 Q1 and Q2 of `PHASE/context/repo-rules-digest.md`, the harnesses H1 to H14, the gaps table.
- **Hand off:** a proof plan per surface with metric, baseline, harness and threshold for keeping it.

### grok-07: Bold new surfaces from outside, and their rebuttals
- **Question:** Which vendored surface (claude-jev hypothesis ranking, jevctl `screen`, `rerank` or `verify`, supercov's quality catalogue, pi-jev-context's reversible filter) would be worth a new skill mode or command here, and what is the case against each?
- **Start from:** `R/claude-jev-main/src/domain/catalog/hypotheses.ts`, `R/jev-cli-main/README.md`, `R/supercov-main/crates/supercov-cli/src/quality/properties.json`, `R/pi-jev-context-main/README.md`, `.skilled/skills/cli-jev/hub-router.json`.
- **Hand off:** at most two bold surfaces with kill criteria, and why the rest do not carry over to a CLI transport.

### grok-08: Contest the consensus
- **Question:** Read every lineage's top-ranked idea so far. Which one is weakest when you reopen its seam and its metric, and what would a skeptic's replacement be?
- **Start from:** the newest iterations of all three lineages, the seams they cite, section 4 red flags of `PHASE/context/repo-rules-digest.md`.
- **Hand off:** a contested list with the code evidence for each objection, and any idea you now rank higher than the consensus.

## Wave 4: cost, restraint and build order (iterations 9 and 10)

### deepseek-09: Failure modes and prompt caching in the wiring
- **Question:** For the top ideas, what happens on exit 3, exit 4, a malformed answer, a slow call near the deadline and the wrong `jev` package on PATH, and does any of them change a prompt that a provider caches?
- **Start from:** `.skilled/skills/cli-jev/cli-usage/SKILL.md` (exit codes and probes), `.skilled/skills/cli-jev/cli-usage/references/providers-and-models.md`, section 5 of `PHASE/context/jev-material-digest.md`, the hook deadlines in `PHASE/context/seam-map.md`.
- **Hand off:** a failure table per idea, the version probe that tells the two packages apart, and any idea that fails its deadline.

### deepseek-10: Smallest-first build order, engineering view
- **Question:** In what order should the survivors be built so each slice works end to end for one caller, and what is each slice's LOC and rollback sentence?
- **Start from:** all your iterations, the newest iterations of the other lineages, Q5, Q8 and Q10 of `PHASE/context/repo-rules-digest.md`.
- **Hand off:** the ordered list with slice, LOC, files, callers and rollback, for the synthesis.

### mimo-09: Cost, latency and privacy as the operator experiences them
- **Question:** For the top ideas, what does a day of use cost, how much latency does the operator feel, what leaves the machine, and how is egress announced?
- **Start from:** the vendor cost claims in `PHASE/context/jev-material-digest.md` (mark them as vendor claims), the latency gap row, `.skilled/skills/cli-jev/cli-usage/SKILL.md` (state is forwarded verbatim), `R/pi-jev-context-main/README.md` (egress warning), `R/supercov-main/docs/quality.md` (cost estimate and dry run).
- **Hand off:** a per-idea cost and privacy line, marked confirmed or vendor claim, and the one measurement that must come first.

### mimo-10: Smallest-first build order, measurement view
- **Question:** Which slice produces a usable number soonest, and which ideas must wait until a gold set exists?
- **Start from:** all your iterations, the other lineages' newest iterations, the use-case-to-harness map in `PHASE/context/measurement-digest.md`.
- **Hand off:** the ordered list with the measurement each slice unlocks, and ideas parked on a named gap.

### grok-09: The overengineering critique
- **Question:** Run every surviving idea from all three lineages through the fitness checklist Q1 to Q15 and the red flags. Which fail, and which pass only by narrowing the request?
- **Start from:** sections 3 and 4 of `PHASE/context/repo-rules-digest.md`, `.skilled/repo-rules/prevent-overengineering.md`, `.skilled/repo-rules/answer-the-actual-request.md`, the newest iterations of all lineages.
- **Hand off:** a pass or fail table per idea against Q1 to Q15, and the what-not-to-build list with reasons.

### grok-10: The contrarian build order and kill list
- **Question:** If only one Jev integration ships this quarter, which, and what result in its first slice would kill the rest of the program?
- **Start from:** all your iterations, the newest iterations of the other lineages, grok-09's table.
- **Hand off:** the single first build, its kill criterion, the ideas that die with it, and where you disagree with the other lineages' orders.
