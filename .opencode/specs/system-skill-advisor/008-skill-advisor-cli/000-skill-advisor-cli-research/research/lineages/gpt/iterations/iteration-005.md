# Iteration 5: KQ5 Long-Running Operations

## Focus

Classify `advisor_rebuild`, `skill_graph_scan`, and the Python compiler chain for CLI semantics.

## Findings

1. `advisor_rebuild` reads status, skips live state unless forced, indexes `.opencode/skills`, publishes generation, then re-reads status [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-rebuild.ts:63].
2. `skill_graph_scan` requires a trusted caller, checks workspace containment, indexes metadata, refreshes embeddings, computes source signature, and publishes generation [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/scan.ts:34].
3. The legacy compiler supports `--validate-only` and `--export-json`; without export it compiles in memory and does not write output [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py:1025].
4. Measured validation costs on this host: `skill_advisor.py --validate-only` median 73.8ms; `skill_graph_compiler.py --validate-only` median 35.1ms; `skill_advisor.py --health` median 49.8ms [SOURCE: command:5-sample timing sweep].
5. Scan/rebuild are not prompt-submit operations. They should be explicit CLI maintenance commands with progress output, exit map semantics, and trusted-caller/confirmation gates.

## Sources Consulted

- `handlers/advisor-rebuild.ts`
- `handlers/skill-graph/scan.ts`
- `scripts/skill_graph_compiler.py`
- 5-sample timing sweep

## Assessment

`newInfoRatio`: 0.62. Validation paths are measured; write-producing scan/rebuild were not executed because the lane is read-only outside the artifact directory.

## Reflection

What worked: separating read-only validation from state mutation. What failed: direct rebuild timing was intentionally skipped due to mutation scope. Ruled out: hook-time rebuild/scan.

## Recommended Next Focus

KQ6: count and cite all integration surfaces.
