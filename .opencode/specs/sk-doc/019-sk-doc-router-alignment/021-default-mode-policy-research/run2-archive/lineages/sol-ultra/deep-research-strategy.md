# Deep Research Strategy: Parent-Hub defaultMode Policy, Run 2

## Topic

Stress-test and expand the packet's Divergent Exploration Agenda without re-deriving the run-1 verdict.

## Key Questions

- [ ] What is the strongest evidence-backed case that named defaults remain preferable, and where does the run-1 verdict overreach?
- [ ] How should null fallback resources, Layer-0/Layer-1 interaction, and live-model behavior be experimentally evaluated?
- [ ] What exact third-archetype schema, migration order, rollback telemetry, and benchmark contracts would make policy changes safe?
- [ ] Which cross-hub edge cases break a binary named-default-versus-null policy?
- [ ] What second-order anti-patterns emerge from null routing, mode-map loading, contextual defaults, or multi-dominant modes?

## Non-Goals

- Do not re-derive run 1's keep-one/flip-four recommendation as the primary result.
- Do not change shipped router policies, schemas, benchmarks, or source files.
- Do not write outside this detached lineage packet.

## Stop Conditions

- Complete exactly three iterations, treating convergence as telemetry only.
- Each iteration must open a distinct divergent territory and cite repository evidence.
- Synthesis must preserve disagreement, negative knowledge, and unresolved experimental questions.

## Answered Questions

- Replay zero-signal semantics and the strongest bounded named-default case.
- Runnable live policy-by-helper benchmark design.
- Three-archetype schema, telemetry compatibility, rollout, rollback, and edge-case contracts.

<!-- MACHINE-OWNED: START -->
## What Worked

- Separating selection, telemetry, and resource assembly exposed that `defaultApplied` does not mean a child was selected (iteration 1).
- Comparing configured defaults with defer-gold playbooks produced a stronger contrarian model than repeating the keep/flip table (iteration 1).
- Combining live trace capture, blind evidence scoring, stability guards, and isolated fixtures yielded a runnable non-mutating experiment design (iteration 2).

## What Failed

- Repository fixtures cannot establish an approximately 80% dominant-case frequency because they are designed scenarios, not traffic samples (iteration 1).
- Current live traces cannot prove hidden resource ingestion because no startup resource manifest exists (iteration 2).

## Exhausted Approaches

- Re-deriving the run-1 verdict without new evidence is blocked.

## Ruled Out Directions

- Treating `routeTelemetry.defaultApplied` as proof that replay selected the default child.
- Using deterministic replay alone as a proxy for live-model behavior.
- A two-arm named-versus-null test with one shared helper, because it confounds policy and helper effects.
- Treating the full registry as automatically superior, or using one live sample per case.

## Carried-Forward Open Questions

- What effects will the preregistered live benchmark observe across model families?
- What is the privacy-safe natural request distribution for each hub?

## Next Focus

Synthesis complete. Next work is empirical execution of the preregistered live benchmark before any shipped policy change.
<!-- MACHINE-OWNED: END -->

## Known Context

- The packet spec records run 1's provisional answer and a 12-thread divergent agenda.
- `resource-map.md` was not present at initialization; coverage-gate seeding is skipped.
- Artifact root is pre-bound to this detached lineage and must not be re-resolved.

## Research Boundaries

- Max iterations: 3
- Convergence threshold: 0.05, telemetry only under `max-iterations`
- Executor: `cli-opencode` with `openai/gpt-5.6-sol-fast`
- Allowed writes: this lineage directory only
