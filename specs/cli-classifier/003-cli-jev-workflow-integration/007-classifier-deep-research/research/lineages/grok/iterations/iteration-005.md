# Iteration 5: grok-05: Framework label sets

## Focus

Question E. The first finding is the label-set count. A `choice` can replace the main AI reading a framework guide only over labels that have a template. CLEAR is not that set.

## Sibling check

- `research/lineages/deepseek/iterations/iteration-002.md` (iteration 2, newest). Read. This lineage now cites N-deepseek-02-2 as the Deem-available check: backend is `torch` or an `ensemble:` name without `stub`, and `model` is `deem-0.8-v1`. A backend-only pass accepts the wrong checkpoint. Quoted as deepseek-02's. Agree. Nothing in that file is about framework labels, so there is nothing to contest.
- `research/lineages/mimo/iterations/`: no iteration file.
- `research/lineages/swe/iterations/`: no iteration file.
- `research/lineages/glm/iterations/`: no iteration file.

Prefix `SK` = `.skilled/skills/sk-prompt`.

## Findings

### The label sets disagree

| Set | Count | Names | Where |
|---|---|---|---|
| Prose claim | 7 | "7 frameworks" | `SK/SKILL.md:3`, `:12` |
| Use-case sentence | 7 | RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT | `SK/SKILL.md:38` |
| Selection matrix | 7 | RACE, RCAF, COSTAR, CIDI, CRISPE, TIDD-EC, CRAFT | `SK/SKILL.md:309-315` |
| Router comment | 7 | "Phase 1: Framework Selection (7 frameworks evaluated)" | `SK/SKILL.md:70` |
| Library file | 7 | same seven as line 38 | `SK/references/patterns-evaluation.md:3`, `:28` |
| Machine registry | 5 | `rcaf`, `race`, `cidi`, `tidd-ec`, `costar` | `SK/assets/framework-registry.json:5-54` |

The registry has no `crispe` and no `craft`. Those two names exist only in the prose. A `choice` whose options are the matrix at `SKILL.md:309-315` can return `CRISPE` or `CRAFT`, and the registry then has no template to render. A `choice` whose options are the five registry ids cannot return the two names the matrix still teaches.

`TEXT_ENHANCE` loads `references/depth-framework.md` and `references/patterns-evaluation.md` (`SK/SKILL.md:136`). The patterns file is 36,580 bytes. The skill file is 23,081 bytes. Both counts are `wc -c` on those paths. The main AI reads the 7-name library. The renderer, if it uses the registry, can only fill 5.

Deem's torch backend reads at most 26 options (`specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/context/deem-main/serve/README.md:92-94`). Five and seven both fit. The cap is not why this fails.

### What a choice would replace, and what it would not

`jev classify` picks one label from a set the caller defines, with an `other` escape (`specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/docs/classify.md:3-17`). That command is `jevctl`. The Python `jev-cli` has no `classify` subcommand (iteration 2). The same shape on the Python side is `choice` with an explicit `none` key, which BASE2 section 7 already adopted (`B2:402`, quoted).

A `choice` over the five registry ids, plus `none`, is a closed set with a template for every non-none label. It would let a script load one registry template instead of the 36,580-byte library. It does not do that today, and it cannot cover CRISPE or CRAFT until those two get registry entries or the matrix drops them.

CLEAR is a 50-point sum of five dimensions (`SK/SKILL.md:321`), threshold 40+. It is not a label set. The playbook has four CLEAR scenarios (`SK/manual-testing-playbook/clear-scoring/`: `clear-five-dimensions.md`, `forty-of-fifty-threshold.md`, `dimension-floors-block.md`, `dimension-drilldown-rationale.md`) and four framework-selection scenarios (`SK/manual-testing-playbook/framework-selection/`, four files). Those eight files are procedure checks. They are not labeled picks and not a routing-accuracy number. No hub-level selection accuracy is stated here.

BASE2 row 63 drops Jev inside `/prompt:improve` because that command has no labels (`B2:803`). The five registry ids are labels for a template id, not labels for prompt quality. Row 63 stands for the command. It does not forbid an offline census over the registry.

### Idea N-grok-05-1

- **Idea:** `N-grok-05-1`. An offline `choice` over `rcaf`, `race`, `cidi`, `tidd-ec`, `costar`, and `none`. The script loads that one registry template. It does not score CLEAR. Type: `choice`.
- **Question:** E
- **Builds on:** new. Row 63 is the neighboring drop, not the parent of this idea.
- **Value:** the main model would not need `patterns-evaluation.md` for a request whose answer is one of the five ids.
- **Seam:** `SK/assets/framework-registry.json:5-54` for the options. `SK/SKILL.md:136` for the file that would stop being loaded on that path. `SK/SKILL.md:309-315` is the conflict, not the option list.
- **Metric, baseline, harness:** agreement with an operator label on which of the five ids a request should use. Baseline: no such labels. The four framework-selection playbook files are the harness shape, not the score. Patterns file size, 36,580 bytes, is the context that becomes skippable only after agreement exists.
- **Savings:** up to 36,580 bytes per TEXT_ENHANCE turn that today loads the library, and only when the pick is one of the five. CRISPE and CRAFT requests still load the prose. Per week UNKNOWN. This iteration did not count those turns.
- **Cost, latency, privacy:** one `choice` per request, offline. The request text leaves the machine on Jev and stays local on Deem. Temperature is 1.0 until a calibration file names the served commit (iteration 1, N-grok-01-2), so the pick probability is not a threshold.
- **Two-backend gate:** its own switch, default off. Deem available under N-deepseek-02-2 (quoted). Jev available when `jev auth status --provider <p>` exits 0. Prefer Deem: the payload is the user's prompt. Neither available: the main AI loads the library as today. A missing answer throws. A label outside the five is `none`, and the library is loaded.
- **Rough LOC:** a census script, not sized. The registry is the option list, so the choice itself is one question.
- **Verdict:** later. The set is real. The gold is not.
- **Confidence:** confirmed for the 7-versus-5 count and the byte sizes. Inferred that operators would accept a five-way pick. Labels would confirm that.
- **Kill criterion:** a labeled set where the modal pick is `none` on more than half the rows, or any row whose operator label is CRISPE or CRAFT. Either result means the registry is the wrong closed set.

### Idea N-grok-05-2

- **Idea:** `N-grok-05-2`. Do not put a classifier on CLEAR, and do not put one inside `/prompt:improve`. Type: none.
- **Question:** E
- **Builds on:** BASE2 row 63. The 50-point definition at `SK/SKILL.md:321`.
- **Value:** avoids a score standing in for five weighted dimensions that have no labels.
- **Seam:** none.
- **Metric, baseline, harness:** the four CLEAR playbook files. No numeric baseline.
- **Savings:** none.
- **Cost, latency, privacy:** not applicable.
- **Two-backend gate:** no switch. With neither backend, behavior is exactly today's.
- **Rough LOC:** 0.
- **Verdict:** drop.
- **Confidence:** confirmed that CLEAR is a weighted sum, not an ordered level list.
- **Kill criterion:** not kept. A later labeled CLEAR set of at least the four scenario files, scored by a person, would be a new idea, not a revival of this one.

## Sources Consulted

- `SK/SKILL.md:3`, `:12`, `:38`, `:70`, `:85`, `:122`, `:136`, `:260-325`
- `SK/assets/framework-registry.json:1-56`
- `SK/references/patterns-evaluation.md:1-28`
- `SK/manual-testing-playbook/clear-scoring/` (4 files) and `framework-selection/` (4 files)
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/docs/classify.md:1-35`
- `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/context/deem-main/serve/README.md:79-95`
- `specs/cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion/research/research.md:402`, `:803`
- `research/lineages/deepseek/iterations/iteration-002.md` N-deepseek-02-2
- `wc -c` on `SKILL.md` and `patterns-evaluation.md`
- No `steer.md`

## Assessment

newInfoRatio: 0.85

Novelty: the 7-versus-5 count and the 36,580-byte library are new. Row 63 is quoted and left standing for the command.

Confidence: the counts are confirmed by reading the ids. No selection accuracy is claimed.

Convergence telemetry: last three ratios 0.85, 0.70, 0.85. Mean 0.80, above 0.05. Mode is off. Continue.

## Reflection

What worked: counting registry ids before discussing a choice. The matrix and the registry are different sets.

What failed: no labeled framework picks exist, so the savings stay conditional.

Ruled out: a choice over the seven prose names. Ruled out: a CLEAR score. Ruled out: quoting the compiled-routing benchmark reports as framework-selection accuracy. Those reports route which files to load, which is a different question, and this iteration did not use their numbers.

## Recommended Next Focus

grok-06. Design routing and review. Do not invent a hub-level routing accuracy. Use per-mode baselines and a playbook scenario count.

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| The skill claims 7 frameworks; the registry holds 5 ids | new | `SKILL.md:3`, `:38`, `:309-315`; `framework-registry.json:5-54` |
| CRISPE and CRAFT have no registry template | new | registry has no those ids |
| `patterns-evaluation.md` is 36,580 bytes and is what TEXT_ENHANCE loads | new | `SKILL.md:136`; `wc -c` |
| CLEAR is a 50-point sum, with 4 playbook scenarios and no labels | new | `SKILL.md:321` |
| Row 63 still drops Jev inside `/prompt:improve` | confirms BASE2 | `B2:803` |
| 26-option cap does not bind at 5 or 7 | new application of a known cap | `serve/README.md:92-94` |

## Hand-off

- A later census uses the five registry ids plus `none`. It does not use the matrix until CRISPE and CRAFT are in the registry or deleted from `SKILL.md:313-315`.
- Deem health for that census is N-deepseek-02-2, and the measurement record carries the commit pair (N-deepseek-02-3, quoted, not reopened).
- Do not cite a framework-selection accuracy. None was measured.
