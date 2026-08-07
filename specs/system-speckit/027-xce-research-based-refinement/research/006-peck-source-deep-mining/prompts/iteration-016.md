DEEP-RESEARCH — CROSS-MODEL VERIFY (MiniMax M3)

# Iteration 016 — Adversarially verify T10 (benchmark-substrate novelty)

## Task
The prior gpt-5.5-fast run's highest-novelty claim (iter 006, 0.85): "spec-kit's deep-improvement Lane B/C benchmarks CANNOT regression-test whether a reviewer PROMPT still catches a known bug class with an expected verdict; peck's revim harness supplies that missing shape." Try hard to REFUTE it — find an existing spec-kit benchmark that already does reviewer-prompt-vs-expected-verdict regression.

## Instructions
1. Read the spec-kit benchmark surfaces: `.opencode/skills/deep-improvement/assets/model-benchmark/README.md` + `benchmark-fixtures/README.md`, `.opencode/skills/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs`, `.opencode/skills/deep-improvement/scripts/skill-benchmark/{run,score}-skill-benchmark.cjs`, `.opencode/commands/deep/start-model-benchmark-loop.md`, `start-skill-benchmark-loop.md`. peck: `external/peck-master/benchmarks/AGENTS.md`, `benchmarks/revim-code-reviewer/config.sh`, `benchmarks/revim-planner/config.sh`.
2. Reach a verdict:
   - C1: Lane B (model-benchmark) fixtures are pattern/function/code-task oracles, NOT "run a reviewer prompt over a real diff and compare to an EXPECTED Pass/Fail/Block verdict."
   - C2: Lane C (skill-benchmark) gold is routing/usefulness, NOT reviewer-bug-verdict gold.
   - C3: therefore the reviewer-prompt-regression shape is genuinely missing (or REFUTE: cite where it already exists).

## Do's
- READ-ONLY. Cite every claim as `file:line`. Max ~12 tool calls.
- Try to REFUTE first; only CONFIRM if you genuinely cannot find an existing equivalent.
- Distinguish "could be built from existing primitives" (not the same as "already exists").

## Don'ts
- Do NOT modify, create, or write any file.
- Do NOT accept the prior 0.85 novelty at face value.
- Do NOT dispatch sub-agents; do NOT exceed 12 tool calls.

## Examples
Output exactly:
### VERDICTS
`[V-016-C1..C3] CONFIRMED|REFUTED|PARTIAL|UNKNOWN — claim — evidence `file:line` — reasoning`
### NEW_CONSIDERATIONS
If the shape is missing, the cheapest way to add it (which scorer/fixture type); if it exists, where. 0-3 bullets.
### METRICS
agreement: AGREE | DISAGREE | MIXED (vs prior ADAPT-into-Lane-B, novelty 0.85)
newInfoRatio: <0.0-1.0>
status: complete
sources: <file:line list>

## Context
- Cross-model verification (MiniMax M3) over a gpt-5.5-fast run on peck-master. Prior doc: `research/006-peck-source-deep-mining/iterations/iteration-006.md`.
- Spec folder `specs/system-spec-kit/027-xce-research-based-refinement` pre-approved; skip Gate 3 — you write NOTHING.
