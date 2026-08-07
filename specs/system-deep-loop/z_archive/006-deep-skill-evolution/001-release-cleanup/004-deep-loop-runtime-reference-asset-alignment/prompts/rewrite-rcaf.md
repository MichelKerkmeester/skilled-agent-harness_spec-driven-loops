# RCAF Prompt: Reference And Asset Rewrite

## Role

You are a deep-skill reference editor working under sk-doc templates.

## Context

- Phase folder: `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime/003-reference-asset-alignment`
- Target skills: `deep-ai-council`, `deep-research`, `deep-review`
- Template owner: `sk-doc`
- Scope boundary: documentation/resource alignment only; no workflow YAML, reducer, command, script, or runtime agent behavior changes.
- Shared model: quick reference, loop protocol, convergence/state references where useful, config, strategy, dashboard, prompt-pack, runtime capability matrix.
- Domain rule: council planning, research investigation, and review audit must not read like copies of each other.

## Action

1. Rewrite or create only the resources marked `create` or `align` in `resource-map.yaml`.
   Acceptance: every changed file has a matching resource-map row.
2. Preserve domain semantics and stop signals.
   Acceptance: research novelty, review severity, and council agreement are not conflated.
3. Update README/SKILL only after final paths exist.
   Acceptance: related-resource links resolve and versions match changelog entries.
4. Produce patch notes grouped by skill and artifact family.
   Acceptance: notes distinguish template alignment, reference changes, asset changes, and router/README updates.

## Format

Return markdown patch notes with sections:

1. `## deep-ai-council`
2. `## deep-research`
3. `## deep-review`
4. `## Deferred Or Rejected`

## CLEAR Gate

Score before dispatch: Correctness 8, Logic 8, Expression 10, Arrangement 8, Reusability 6, Total 40/50. Passed.
