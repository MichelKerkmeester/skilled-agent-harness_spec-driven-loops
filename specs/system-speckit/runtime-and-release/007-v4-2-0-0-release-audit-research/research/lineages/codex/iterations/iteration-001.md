# Iteration 1: Deep Loop release-note coverage

## Focus
Audit Deep Loop notes against window commits affecting research defaults, convergence, frontier, synthesis, state, or iteration behavior.

## Actions Taken
- Read the lineage config, state projection, strategy and steering file before selecting the focus. The steering file was absent.
- Compared the Deep Loop release-note section with the window commit list and the current workflow and runtime contracts.
- Inspected commit b3fea67595ede5d47ce0d9ef57629bd46aedda8f and its current convergence behavior.
- Inspected commit 1b7fe3e1a26ff0b808b5d78bb17bb032caa46ead and the current stdout log producer.
- Read-only context search found a sibling Devin strategy. Its audit conclusions were not treated as evidence.

## Findings
1. **MISSING | P2** Expansive research fan-out lineages now form a hard `frontier_drained` stop when their assigned frontier has at least one answered node and none open or active. The release notes mention this stop for review only, so they omit the research behavior. Commit `b3fea67595ede5d47ce0d9ef57629bd46aedda8f` changed the workflow and convergence algorithm. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1132] [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:130] The related release-note entry is line 179. [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:179]
2. **MISSING | P2** Single-executor CLI iterations persist masked child stdout at `iterations/iteration-NNN.out`. Commit `1b7fe3e1a26ff0b808b5d78bb17bb032caa46ead` introduced this per-iteration artifact after long provider streams exceeded the old in-memory buffer. The current dispatcher creates and masks the file. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:390] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:396] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1599] The weak-pass notes list tool and source metrics but do not name the stdout artifact. [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:210]

## Ruled Out
- The release-note statement that a review stops on `frontier_drained` is true for review. It is not a contradiction; the omitted research fan-out case is classified MISSING.
- The first path-scoped commit read looked only under the mode packet. The relevant change was in the workflow and runtime files, which the full commit diff confirmed.

## Dead Ends
- None. The initial path mismatch was corrected with the commit's complete relevant file set.

## Edge Cases
- Ambiguous input: the review-only note does not establish exclusivity. Current workflow code confirms research fan-out also has this behavior.
- Contradictory evidence: none.
- Missing dependencies: none. The steering file does not exist.
- Partial success: none. Both findings have commit, source-line and related release-note citations.

## Scope Conflicts
- The workflow context-loading recipe calls for a temporary pattern file outside the lineage. The workflow also has pre-init and post-synthesis steps that mutate the parent `spec.md` and run validation. The dispatch restricts writes to this lineage and expressly forbids validation commands, so those out-of-lineage actions were skipped. The run will still include the final synthesis in this lineage.
- The dispatcher names `phase_main_loop`; the YAML names the loop phase `phase_loop`. This run maps the dispatcher label to the YAML phase and records the mapping.

## Sources Consulted
- `.skilled/changelog/skilled/v4.2.0.0.md:179, 210-214`
- `.skilled/commands/deep/assets/deep-research.yaml:1132`
- `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:130`
- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs`
- `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:390-397`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1599-1620`
- Commits `b3fea67595ede5d47ce0d9ef57629bd46aedda8f` and `1b7fe3e1a26ff0b808b5d78bb17bb032caa46ead`
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/window-commits.txt`
- The lineage config, projection, strategy and checked steering file

## Assessment
- New information ratio: 1.0 (2 fully new, 0 partially new, 0 redundant)
- Questions addressed: the Deep Loop section of the missing-coverage question
- Questions answered: none; the full user-visible change inventory remains open
- Questions remaining: all four key questions remain open

## Reflection
- What worked and why: commit diffs followed by current code reads distinguished the added behavior from the adjacent review wording.
- What did not work and why: a narrow diff path initially missed workflow/runtime changes because the commit did not touch the research mode folder.
- What I would do differently: query each named release-note section against its owning command and runtime paths, then inspect candidate commits at the producer.

## Recommended Next Focus
Audit Fan-Out Runs notes against runner, merge, lineage containment, shared budgets and merge provenance changes.

