# Alignment Iteration 5

- Lane: sk-doc::docs::.opencode/skills/*/feature-catalog/**, .opencode/skills/sk-doc/create-*/SKILL.md
- Authority: sk-doc / docs
- Status: complete
- Findings: 5 (new ratio 1)

## Artifacts Checked

- .opencode/skills/cli-external-orchestration/feature-catalog/cli-executor-dispatch-routing/cli-executor-dispatch-routing.md
- .opencode/skills/cli-external-orchestration/feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md
- .opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md
- .opencode/skills/cli-external-orchestration/feature-catalog/feature-catalog.md
- .opencode/skills/mcp-tooling/feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md

## Findings - P0

_none_

## Findings - P1

- P1: The CLI executor leaf repeatedly claims the registry has three workflow packets, but the live registry includes cli-cursor as a fourth workflow. [SOURCE: .opencode/skills/cli-external-orchestration/feature-catalog/cli-executor-dispatch-routing/cli-executor-dispatch-routing.md:18] [SOURCE: .opencode/skills/cli-external-orchestration/mode-registry.json:79]
- P1: The root catalog contradicts its own four-packet introduction and the live registry by describing dispatch across only three packets. [SOURCE: .opencode/skills/cli-external-orchestration/feature-catalog/feature-catalog.md:33] [SOURCE: .opencode/skills/cli-external-orchestration/mode-registry.json:79]
- P1: The Cursor leaf says mcp-route-guard is deliberately not wired, while the live Cursor hook registry wires it under beforeMCPExecution. [SOURCE: .opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:40] [SOURCE: .cursor/hooks.json:82]
- P1: The Cursor leaf uses mutable Phase 011 narration and a numbered spec implementation summary as runtime evidence, contrary to the feature-catalog current-source-only rule. [SOURCE: .opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:38] [SOURCE: .opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:79] [SOURCE: .opencode/skills/sk-doc/create-feature-catalog/SKILL.md:386]
- P1: The root catalog embeds Phase 010, Phase 011, and Phase 016 delivery history in its current-reality summary, violating the authority rule against mutable phase history in runtime catalogs. [SOURCE: .opencode/skills/cli-external-orchestration/feature-catalog/feature-catalog.md:73] [SOURCE: .opencode/skills/sk-doc/create-feature-catalog/SKILL.md:351] [SOURCE: .opencode/skills/sk-doc/create-feature-catalog/SKILL.md:386]

## Findings - P2

_none_

## Summary

Five new P1 findings: two stale three-mode claims omit cli-cursor, one Cursor guard-wiring claim contradicts live configuration, and two artifacts retain prohibited mutable phase history; both compiled-routing leaves re-probed clean.

## Next Focus

Resolved by partition-corpus on the next iteration.


_Narrative synthesized by the read-only-leaf writer from the structured iteration record._
