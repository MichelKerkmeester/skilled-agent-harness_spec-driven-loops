# Iteration 3: Inspect Workflow And Fan-Out Mechanics

## Focus

This iteration looked at the deep-research YAML and fan-out runtime because Fable 5 behavior needs to survive autonomous lineages, not only human-readable agent docs.

## Findings

1. Confirmed: `fanout-run.cjs` builds the exact prompt shape used by this lineage and includes the direct `config.fanout_lineage_artifact_dir` override plus the instruction not to run `resolveArtifactRoot`. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:126] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:144] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:159]
2. Confirmed: The auto workflow has a branch that binds `artifact_dir`, `artifact_root_dir`, and `artifact_archive_root` directly when `config.fanout_lineage_artifact_dir` is present. [SOURCE: .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:126] [SOURCE: .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:132]
3. Confirmed: The workflow validates iteration outputs after dispatch: iteration file exists, state log appended, required JSONL fields exist, canonical type is `iteration`, and a delta file exists. [SOURCE: .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:753]
4. Confirmed: The fan-out runtime comments say the lineage write boundary is enforced by the prompt because CLIs do not expose a narrower path-scoped workspace-write sandbox. That is a real safety limitation for Fable 5 scope discipline. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:409]
5. Confirmed: The workflow's `step_reduce_state` still calls `node .opencode/skills/deep-research/scripts/reduce-state.cjs {spec_folder}`, while the reducer script resolves the canonical research path internally. In a fan-out lineage, that creates a mismatch unless the runtime skips, patches, or wraps reducer behavior for lineage-local paths. [SOURCE: .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:777] [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:900]

## Ruled Out

- Relying on prompt text alone for path confinement is ruled out as the final safety mechanism. It is currently what fan-out uses, but the runtime itself calls it weaker than a path-scoped sandbox. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:409]

## Dead Ends

- Running the reducer inside this lineage was ruled out because it resolves the canonical spec research path from `specFolder`; this fan-out prompt forbids touching outside the lineage directory. [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:900]

## Edge Cases

- Ambiguous input: The user requested the `cli-codex` executor, but the cli-codex skill has a self-invocation guard when the active runtime is Codex. This lineage records the requested executor as metadata and runs directly in the active Codex seat. [SOURCE: .opencode/skills/cli-codex/SKILL.md:17]
- Contradictory evidence: none.
- Missing dependencies: no path-scoped sandbox facility is available in the inspected fan-out code.
- Partial success: no.

## Sources Consulted

- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:126`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:144`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:159`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:409`
- `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:126`
- `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:132`
- `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:753`
- `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:777`
- `.opencode/skills/deep-research/scripts/reduce-state.cjs:900`
- `.opencode/skills/cli-codex/SKILL.md:17`

## Assessment

- New information ratio: 0.55.
- Questions addressed: Where are the gaps? What implementation path has the best leverage?
- Questions answered: Where are the gaps?
- Confidence: high for the fan-out and reducer mismatch because the cited files directly show the paths and branch behavior.

## Reflection

- What worked and why: Runtime code inspection found enforcement limits that agent docs alone would hide.
- What did not work and why: Treating the YAML reducer step as safe in fan-out did not hold under the user's lineage-only write constraint.
- What I would do differently: Future implementation should add an artifact-dir argument to reducer scripts or a lineage-local reducer entry point.

## Recommended Next Focus

Derive a low-blast implementation architecture that upgrades evidence behavior without rewriting every agent.
