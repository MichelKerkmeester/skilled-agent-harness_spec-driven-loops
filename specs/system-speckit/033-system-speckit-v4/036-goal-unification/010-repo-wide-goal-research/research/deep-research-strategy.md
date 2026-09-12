# Deep Research Strategy: repo-wide goal surfaces

## Charter

Five iterations, no early convergence. Each iteration keeps everything the previous one
established and widens the surface it looks at. Every claim about current behaviour carries a
`file:line` that was opened and confirmed. Design conclusions are marked CLAIM. Anything
unconfirmed is INFERRED or UNKNOWN with the action that would settle it.

## Expanding scope, one ring per iteration

| Iteration | Ring | What it adds to the previous ring |
|---|---|---|
| 1 | The goal engine | `.opencode/hooks/goal/` in full: the shared slice module, the core, the four runtime adapters, the command-line surface and their tests. |
| 2 | Every runtime surface | The OpenCode plugin, the per-runtime commands and prompts, the hook registries and generated mirrors under `.claude`, `.codex`, `.cursor`, `.devin`, `.pi`. |
| 3 | Spec-kit's own goal contract | The goal template, the budget contract, the validator rules, the set-string playbook, the lifecycle workflow assets and the retrieval surfaces that make them reachable. |
| 4 | Everything else in the repository that touches a goal | Root instruction files, repo rules, skills that mention goals, feature catalogues, manual testing playbooks, changelogs, and any script or gate that reads or writes goal state. |
| 5 | The whole picture | Contradictions between rings, surfaces nobody owns, behaviour documented in one ring and implemented in another, and what a reader would get wrong from the documents alone. |

## Questions each iteration must answer for its ring

1. What exists here that is goal-related, by path?
2. What does it actually do, confirmed by reading it rather than by its name?
3. Where does it disagree with another surface, or with a document?
4. What is unreachable, unused, or reads as live but is not?
5. What would a new reader get wrong?

## Output

`research/research.md` is the canonical record. Each iteration appends its ring without
deleting an earlier one; the last iteration reconciles them.
