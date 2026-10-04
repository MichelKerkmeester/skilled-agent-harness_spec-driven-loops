# Deep Research Strategy

## Research Topic
How should repository rules be written and loaded to change model behaviour, and at what context cost? This lineage focuses on the measured communication-rule compliance baseline and recommended interventions.

## Known Context
`prep/evidence-pack.md` reports approximate static size estimates and observational compliance aggregates. The study is nonrandomized and the rule-read detector observes Read/tool calls, not all possible shell reads or system injection. `resource-map.md` is absent from the spec folder. The run is detached and writes only inside this lineage.

## Key Questions
- Which measured prohibitions change after a rule is read, and which do not?
- Which proposed causes are supported, contradicted, or not distinguishable from existing data?
- Which interventions are plausible, what do they cost, and how can the existing measurement script assess them?
- What evidence would reorder the interventions?

## Answered Questions
- The semicolon outcome is read-associated with a lower rate, while the table outcome is not; the nonrandomized data does not identify a cause.
- Static file-size costs are measurable, but actual tokenizer billing and per-session savings are unknown.
- A card needs the self-check to retain the rule norms; the behavior of the compressed form still needs a controlled pilot.
- The configured completion Stop sentinel is asynchronous and advisory-only; it does not block or rewrite a completed response.
- The ranking and reorder conditions are recorded in iteration 3 and research.md.

## What Worked
- Use the supplied evidence pack as the measurement baseline and verify repository rule text and enforcement paths.

## What Failed
- No randomized treatment or live reply enforcement baseline is available in the supplied aggregates.

## Exhausted Approaches
- Do not infer causal effects from before/after/never session groups alone.
- Do not use table-pattern hits as exact violations without checking requested-document context.

## Ruled-Out Directions
- Do not claim Devin truncation explains the Claude Code measurements; the supplied steer says the measured Claude sessions receive full AGENTS.md.

## Next Focus
This three-iteration lineage is complete at the maximum iteration cap. A future causal test should randomize same-path wording and record task type and actual exposure, then pilot slim cards with their self-checks.
