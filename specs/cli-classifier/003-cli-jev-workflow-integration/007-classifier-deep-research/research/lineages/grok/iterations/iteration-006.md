# Iteration 6: grok-06: Design routing and review

## Focus

Question F. Where a closed label would replace the main AI reading a design guide, and where the router is already that closed set in code. No hub-level routing accuracy is stated. The benchmark README says none was archived.

## Sibling check

- `research/lineages/deepseek/iterations/iteration-002.md` (iteration 2, still the newest). It does not discuss design routing. No contest. Deem-available remains N-deepseek-02-2.
- `research/lineages/mimo/iterations/`: no iteration file.
- `research/lineages/swe/iterations/`: no iteration file.
- `research/lineages/glm/iterations/`: no iteration file.

Prefix `D` = `.skilled/skills/sk-design`.

## Findings

### No hub routing number

`D/benchmark/README.md:3` and `:26-27` say no hub-level Lane C run was archived, and an empty tree is not a passing score. `:33-41` indexes two mode baselines, fundamentals and diagram, and says a mode baseline does not measure whether a request reaches the hub. This iteration does not open those mode trees and does not invent a hub score.

Playbook scenario files, excluding each directory's `manual-testing-playbook.md` catalog:

| Tree | Scenario files |
|---|---|
| `D/manual-testing-playbook/` | 4 |
| `D/sk-design-fundamentals/manual-testing-playbook/` | 12 |
| `D/sk-design-diagram/manual-testing-playbook/` | 10 |
| `D/sk-design-chart/manual-testing-playbook/` | 9 |
| `D/sk-design-md-generator/manual-testing-playbook/` | 18 |

53 scenario files. That is a count of procedures, not an accuracy.

### The closed sets that already exist

`D/ROUTER.md:32-42` names five intents: `VALUES`, `REVIEW`, `CHART`, `FLOWCHART`, `EXTRACT`, across four modes. `VALUES` and `REVIEW` share `sk-design-fundamentals` and load different references (`:44-45`).

`D/hub-router.json:4-18` is a keyword policy: default mode `sk-design-fundamentals`, ambiguity delta 1, outcomes `single`, `orderedBundle`, `defer`, `none`. `D/sk-design-fundamentals/SKILL.md:197-203` scores intents by keyword weight in the request text. That function is the classifier. A model `choice` over the same five intents would replace a deterministic scorer, which is the authority class of BASE1 row 12 (`B1:1056`, quoted). It would not reduce context: the keyword function does not load a guide to pick the mode.

### Checklists the main AI still has to read

`D/sk-design-fundamentals/references/review-checklist.md:17` and `:25` require every finding to name a file, a line, the criterion, and the fix, and to read the code first. A `choice` or a `noul` does not emit a line number. Putting the component source into the classifier's state moves the read; it does not remove it.

`diagnosis-table.md:35` tells the reader to match a symptom, confirm a cause, then apply a fix. The cause cells are sentences (`:47-55`), not ids. A `choice` over those sentences still needs the surface in front of it.

`D/sk-design-md-generator/references/quality-checklist.md:29` says `validate.ts` already reports `valuesScore` and `claimsScore`, and `isPass` requires both at or above 80. A model score beside that gate would be a second verdict on a check the script already makes.

### Vendored review, not a design seam

`jev-review` has no `src/review.ts`. The review modules are under `src/review/`. `judgments.ts:41-104` asks five `noul` questions per change: correctness, security, reliability, compatibility, test gap. The same five appear in `codebase-judgments.ts:53-119`. Those questions are about a diff, and they return probabilities (`judgments.ts:127-131`), not a file and line in the shape `review-checklist.md:17` requires. BASE2 row 8 already drops a live cut at 0.5 (`B2:825`, quoted). This iteration does not reopen that row.

`duplicated_logic` is a vendor smell whose own card says 50.8% alone, near chance (`specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/supercov-main/crates/supercov-cli/src/quality/properties.json:38-43`). BASE1 row 28 already drops a supercov smell command (`B1:1072`). A local 0.8B does not change a vendor's near-chance figure, and this iteration did not rerun it.

### Idea N-grok-06-1

- **Idea:** `N-grok-06-1`. Do not replace the keyword intent scorer with a `choice` over `VALUES`, `REVIEW`, `CHART`, `FLOWCHART`, and `EXTRACT`. Type: `choice`, refused.
- **Question:** F
- **Builds on:** BASE1 row 12. The scorer is `SKILL.md:197-203`.
- **Value:** none. The function already returns the intent without a model call.
- **Seam:** `D/hub-router.json:13-18`, `D/ROUTER.md:36-42`.
- **Metric, baseline, harness:** hub routing accuracy. Baseline: not archived (`D/benchmark/README.md:26-27`). The 53 scenario files are the harness count, not a score.
- **Savings:** none. The keyword path loads no framework guide to make the pick.
- **Cost, latency, privacy:** a model pick would send the design request off the machine on Jev, or keep it local on Deem, to answer a question the keyword table answers.
- **Two-backend gate:** no switch. With neither backend, behavior is exactly today's keyword router.
- **Rough LOC:** 0.
- **Verdict:** drop.
- **Confidence:** confirmed that the scorer is keyword weights. Inferred that it misroutes often enough to want a model. A hub run would confirm that, and none is archived.
- **Kill criterion:** not kept. A future hub run with a counted miss rate, on the 4 hub scenario files plus the mode files, would be a new idea.

### Idea N-grok-06-2

- **Idea:** `N-grok-06-2`. Do not put Deem or Jev on the review checklist, the diagnosis table, or the md-generator quality gate. Type: none.
- **Question:** F
- **Builds on:** `review-checklist.md:17`, `quality-checklist.md:29`, BASE2 row 8.
- **Value:** keeps findings as file-and-line text, and keeps `isPass` as the script's boolean.
- **Seam:** none to add.
- **Metric, baseline, harness:** `valuesScore` and `claimsScore` already exist in the checklist's description of `validate.ts`. Not rerun.
- **Savings:** none.
- **Cost, latency, privacy:** a review `noul` would need the component source in the state.
- **Two-backend gate:** no switch.
- **Rough LOC:** 0.
- **Verdict:** drop.
- **Confidence:** confirmed for the output shape and for the existing pass rule.
- **Kill criterion:** not kept.

## Sources Consulted

- `D/benchmark/README.md:1-41`
- `D/hub-router.json:1-58`
- `D/ROUTER.md:15-45`
- `D/mode-registry.json:1-16`
- `D/sk-design-fundamentals/SKILL.md:168-203`
- `D/sk-design-fundamentals/references/review-checklist.md:1-39`
- `D/sk-design-fundamentals/references/diagnosis-table.md:1-55`
- `D/sk-design-md-generator/references/quality-checklist.md:17-29`
- Playbook globs listed above
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-review-main/src/review/judgments.ts:41-131`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-review-main/src/review/codebase-judgments.ts:53-119`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/supercov-main/crates/supercov-cli/src/quality/properties.json:38-43`
- `B1:1056`, `:1072`
- `B2:825`
- No `steer.md`

## Assessment

newInfoRatio: 0.75

Novelty: the five intents are already a keyword function, the checklist requires a line number, and the hub score is explicitly unarchived. The 53 scenario files are a count, not a rate.

Confidence: confirmed for those shapes. No routing accuracy is claimed.

Convergence telemetry: last three ratios 0.70, 0.85, 0.75. Mean 0.77, above 0.05. Mode is off. Continue.

## Reflection

What worked: reading the benchmark README's "no hub-level run" sentence before looking for a number to cite.

What failed: the diagnosis cause column is prose, so there is no id list to count as a choice set without inventing one.

Ruled out: a model intent router. Ruled out: a model pass beside `validate.ts`. Ruled out: porting jev-review's five `noul` axes onto the design checklist. Ruled out: reviving the supercov smell command from row 28.

## Recommended Next Focus

grok-07, wave 3. One interface across backends. Every new skill, command, hook, or workflow in that wave needs a metric, a counted baseline, and a harness, or it is recorded unmeasured.

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| No hub-level sk-design routing run is archived | confirms the benchmark README | `D/benchmark/README.md:26-27` |
| Five intents, keyword-scored | new for this question | `ROUTER.md:36-42`, `SKILL.md:197-203` |
| Review findings require file and line | new for this question | `review-checklist.md:17`, `:25` |
| md-generator pass is already `validate.ts` at 80 and 80 | new for this question | `quality-checklist.md:29` |
| jev-review asks five `noul`s and returns probabilities | new against the design checklist's shape | `judgments.ts:41-131` |
| 53 playbook scenario files across the hub and four modes | new count | globs in Sources |
| `duplicated_logic` near chance | confirms BASE1 row 28 with the card opened | `properties.json:38-43` |

## Hand-off

- Do not cite a hub routing accuracy. The README says the run was not archived.
- A design-review classifier is the wrong shape while the finding contract is file and line.
- Wave 3 ideas that lack a counted baseline stay unmeasured.
