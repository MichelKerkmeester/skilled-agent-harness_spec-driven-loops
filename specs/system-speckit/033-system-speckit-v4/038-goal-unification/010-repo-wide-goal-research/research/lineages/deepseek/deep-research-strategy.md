# Deep Research Strategy: repo-wide goal surfaces (lineage `deepseek`)

Lineage of the fan-out run `fanout-deepseek-1789192823658-autusz`, executing the
research charter at
`specs/system-speckit/033-system-speckit-v4/036-goal-unification/010-repo-wide-goal-research/research/deep-research-strategy.md`
whenever this file is silent.

## Charter

Five iterations, no early convergence. Each iteration keeps everything the previous one
established and widens the surface it looks at. Every claim about current behaviour carries a
`file:line` that was opened and confirmed. Design conclusions are marked `CLAIM`. Anything
unconfirmed is `INFERRED` or `UNKNOWN` with the action that would settle it.

`stopPolicy` is `max-iterations` at 5. `convergenceThreshold` is 0.05 and is recorded as
telemetry only: a low `newInfoRatio` before iteration 5 broadens the review angles inside the
current ring instead of triggering synthesis early.

## Expanding scope, one ring per iteration

| Iteration | Ring | What it adds to the previous ring |
|---|---|---|
| 1 | The goal engine | `.opencode/hooks/goal/` in full: the shared slice module, the core, the four runtime adapters, the command-line surface and their tests. |
| 2 | Every runtime surface | The OpenCode plugin, the per-runtime commands and prompts, the hook registries and generated mirrors under `.claude`, `.codex`, `.cursor`, `.devin`, `.pi`. |
| 3 | Spec-kit's own goal contract | The goal template, the budget contract, the validator rules, the set-string playbook, the lifecycle workflow assets and the retrieval surfaces that make them reachable. |
| 4 | Everything else in the repository that touches a goal | Root instruction files, repo rules, skills that mention goals, feature catalogues, manual testing playbooks, changelogs, and any script or gate that reads or writes goal state. |
| 5 | The whole picture | Contradictions between rings, surfaces nobody owns, behaviour documented in one ring and implemented in another, and what a reader would get wrong from the documents alone. |

## Questions every iteration must answer for its ring

1. What exists here that is goal-related, by path?
2. What does it actually do, confirmed by reading it rather than by its name?
3. Where does it disagree with another surface, or with a document?
4. What is unreachable, unused, or reads as live but is not?
5. What would a new reader get wrong?

## Write surface (hard)

`specs/system-speckit/033-system-speckit-v4/036-goal-unification/010-repo-wide-goal-research/research/lineages/deepseek`
is the entire write surface. Nothing is created, modified or deleted outside it. In
particular `generate-context.js`, `validate.sh`, and every git write command stay unrun.

## Known Context

- The packet's own `spec.md` is an unfilled template: `spec.md:30` carries
  `[What is broken, missing, or inefficient? ...]` verbatim, and `goal.md:39` carries
  `**Objective:** [One sentence...]`. Both are ring-4 observations that shape nothing yet.
- The packet's `goal.md` durable slice is unset, so the GOAL POSTURE reminder stands: the
  directive that would judge this research is not written down anywhere.
- The lineage directory arrived pre-seeded with `containment/`, `.executor-state/`,
  `deep-research-audit-ledger/`, `deep-research-effect-ledger/` and `locks-and-fencing-v1/`.
  These are harness scaffolding, not research output, and are treated as read-only.
  `containment/` is 13 MB of baseline copies of other spec folders' `review/` and `research/`
  trees; it is not evidence for anything in this charter and is never cited.

## Output

`research.md` in this directory is the canonical record for this lineage. Each iteration
appends its ring without deleting an earlier one; iteration 5 reconciles them.
