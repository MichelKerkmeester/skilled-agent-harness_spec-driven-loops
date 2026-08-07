# Alignment Iteration 6

- Lane: sk-doc::docs::.opencode/skills/*/feature-catalog/**, .opencode/skills/sk-doc/create-*/SKILL.md
- Authority: sk-doc / docs
- Status: complete
- Findings: 1 (new ratio 1)

## Artifacts Checked

- .opencode/skills/mcp-tooling/feature-catalog/feature-catalog.md
- .opencode/skills/mcp-tooling/feature-catalog/workflow-vs-transport-routing/workflow-vs-transport-routing.md
- .opencode/skills/sk-code/feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md
- .opencode/skills/sk-code/feature-catalog/feature-catalog.md
- .opencode/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md

## Findings - P0

_none_

## Findings - P1

- P1: The leaf claims the shared workflow doctrine lives at `shared/references/workflow_*.md`, but that pattern resolves no files; the live canonical files and both surfaces’ symlinks use `workflow-{implement,debug,verify}.md`. This breaks the catalog’s current-source traceability requirement. [SOURCE: .opencode/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md:32] [SOURCE: .opencode/skills/sk-code/shared/references/workflow-debug.md]

## Findings - P2

_none_

## Summary

One new P1: the sk-code two-axis leaf cites a nonexistent workflow_*.md source pattern; live canonical files and surface symlinks use workflow-*.md.

## Next Focus

Resolved by partition-corpus on the next iteration.


_Narrative synthesized by the read-only-leaf writer from the structured iteration record._
