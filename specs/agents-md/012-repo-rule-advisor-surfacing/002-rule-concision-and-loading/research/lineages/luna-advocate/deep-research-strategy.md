# Deep Research Strategy

## Topic

Question: how should this repository's repo rules (.skilled/repo-rules/, 13 files, about 27k tokens) be written and loaded to change model behaviour, and at what context cost?

## Key Questions

- [x] What does a full load of the repository rules cost per session and per compaction window?
- [x] How does prompt caching affect input cost versus context occupancy?
- [x] What compression range is plausible, and what behavior does compression risk losing?
- [x] Which cross-lineage claims survive adversarial review?

## Non-goals

- Do not modify the repository rules, hooks, or spec packet.
- Do not infer causal behavior changes from the existing observational compliance baseline.
- Do not claim a context-window percentage or this Codex runtime's cache price without measurement.

## Stop Conditions

- Run exactly two iterations; convergence is telemetry only.
- Preserve cited evidence and mark unmeasured quantities UNKNOWN.
- Keep every created or modified file inside this lineage directory.

## Answered Questions

- What does a full load of the repository rules cost per session and per compaction window?
- How does prompt caching affect input cost versus context occupancy?
- What compression range is plausible, and what behavior does compression risk losing?
- Which cross-lineage claims survive adversarial review?

## What Worked

- Prep evidence pack gives measured aggregate file sizes and compliance/read counts.
- API cache behavior and local byte-size comparison separate monetary/input cost from context occupancy.
- Adversarial review separated byte savings from behavior evidence and identified measurements for each unresolved causal claim.

## What Failed

- Exact per-window reload token totals and model-specific cache usage are not present in the evidence pack.
- No opportunity-adjusted Gate 5 miss rate or randomized rule-card behavior result is available.

## Exhausted Approaches

None yet.

## Ruled Out Directions

None yet.

## Next Focus

Synthesis complete at maxIterationsReached. Further work requires runtime token/cache telemetry, opportunity-adjusted Gate 5 miss measurement, and randomized fidelity tests for cards, wording, or a synchronous response linter.

## Known Context

- Prep measurements are in specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md.
- Core routing sources are root AGENTS.md and REPO RULES.md.
- Rule-card structure is documented in .skilled/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md.
- This is a fan-out lineage; the caller-bound artifact root is this directory.

## Research Boundaries

- Max iterations: 2
- Convergence threshold: 0.05
- Stop policy: max-iterations
- Executor metadata: cli-codex / gpt-6-luna / max / fast
- Source files are read-only.
