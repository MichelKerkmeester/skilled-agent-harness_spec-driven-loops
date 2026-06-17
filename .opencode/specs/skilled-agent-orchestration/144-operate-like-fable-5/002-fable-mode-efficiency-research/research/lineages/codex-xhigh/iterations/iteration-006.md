# Iteration 6: Convergence, Caveats, and Synthesis Guardrails

## Focus
Confirm whether the lineage can stop before maxIterations, document runtime caveats, and preserve eliminated alternatives for the merge.

## Actions Taken
- Re-read the `cli-codex` skill self-invocation guard.
- Re-read the deep-research workflow synthesis/write-back steps.
- Checked question coverage and residual novelty.
- Consolidated eliminated alternatives.

## Findings
1. **Convergence is legal by question coverage.** Six of six key questions have cited answers, and the remaining novelty is below threshold. MaxIterations was 10; this lineage stops at 6. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/references/convergence/convergence.md:3]

2. **Executor provenance must be flagged.** The requested executor was `cli-codex model=gpt-5.5`, but `cli-codex` explicitly refuses self-invocation when the current agent is already Codex. The lineage therefore records requested executor metadata but did not spawn a nested `codex exec`. [SOURCE: .opencode/skills/cli-codex/SKILL.md:17]

3. **Skipping resolveArtifactRoot was required and honored.** The YAML has an override branch for `config.fanout_lineage_artifact_dir`; this lineage bound `artifact_dir` directly to the requested path. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:82]

4. **Spec write-back and memory save are intentionally deferred.** The YAML synthesis and save phases can edit `{spec_folder}/spec.md` and canonical continuity docs; those writes would escape the lineage artifact_dir. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:906] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:947]

5. **The merge agent should treat this lineage as content-complete but process-degraded.** The research answers the requested pillars, but exact process provenance differs from the requested CLI executor. This is the one claim most likely to be mishandled downstream if the merge only counts files. [SOURCE: .opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/research/research.md:1]

## Questions Answered
- What runtime caveats must be flagged?
- Can this lineage converge before maxIterations?

## Questions Remaining
- None inside this lineage. Packet-level merge may still compare sibling lineage output.

## Assessment
- newInfoRatio: 0.04.
- Novelty justification: only residual process/provenance caveats remained.
- Confidence: high for convergence by coverage; high for self-invocation caveat from the skill contract.

## Reflection
What worked: preserving process caveats in artifacts rather than smoothing them away.

What failed or was ruled out:
- Claiming actual nested cli-codex provenance.
- Running spec write-back or memory save from this leaf.
- Staging git from inside the fan-out lineage.

## Recommended Next Focus
Synthesize the lineage and hand it to the fan-out merger.
