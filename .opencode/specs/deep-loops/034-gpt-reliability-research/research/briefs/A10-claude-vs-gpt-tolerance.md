# Research Brief A10 — What Claude tolerates that GPT does not

READ-ONLY RESEARCH TASK. No file writes are requested. Do not ask about spec
folders or documentation scope. Do not ask any questions; produce the analysis.

## Measured problem (packet 033, synthesis angle)

Same repo, same prompts, same contracts: Claude passes 25/32 benchmark
scenarios; GPT (best effort) passes 17/32. The prior angles examined specific
surfaces. This angle is cross-cutting: characterize the CLASS of instruction
patterns in this repo that Claude absorbs correctly but GPT mis-executes, so
future authoring follows GPT-safe patterns by default.

## Your task

Sample three contract styles and compare their measured outcomes:
1. `.opencode/commands/deep/assets/deep_review_auto.yaml` (step-list YAML — GPT
   mostly executes these correctly once running)
2. `CLAUDE.md` sections 1-2 (prose rules + gates — GPT inverts priorities here)
3. `.opencode/skills/deep-loop-workflows/deep-ai-council/references/integration/loop_protocol.md`
   (multi-step prose protocol — GPT stalls here)

Identify the discriminating features between the styles GPT executes reliably
and the styles it does not: enumerated steps vs prose mandates; single-file vs
cross-file rules; imperative-with-artifact ("write X to Y") vs imperative-
without-artifact ("be thorough"); rule-count per context window region;
conditional depth ("unless… except when…"). Produce a concrete GPT-SAFE
AUTHORING PROFILE: 5-8 rules for writing contracts this repo's GPT executors
will follow, each justified by a measured 033 outcome + a file:line example of
the pattern done right or wrong in the current repo.

## Output contract (strict)

Markdown, no preamble, no questions. Sections:

### FINDINGS — numbered, each citing `file:line`.

### PROPOSALS — the authoring profile as numbered rules. Each: **Tag**,
**Change** (where to codify it — e.g. a contract-authoring reference doc +
which existing files to retrofit first), **Expected effect**, **Effort**,
**Risk**.

3-6 findings; profile of 5-8 rules.
