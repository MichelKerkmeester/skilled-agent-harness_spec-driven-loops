# Iteration 5: Inventory Command And Agent Migration Surfaces

## Focus

Identify external references that affect runtime behavior, command routing, or agent instructions rather than only documentation.

## Findings

- The doctor deep-loop route invokes runtime scripts directly, so command diagnostics are an executable migration surface [SOURCE: .opencode/commands/doctor/_routes.yaml:108].
- The same doctor route carries additional runtime script references that must move with the nested runtime path [SOURCE: .opencode/commands/doctor/_routes.yaml:110].
- Deep command YAML assets cite workflow and runtime paths, so generated command contracts can drift if only source files are edited [SOURCE: .opencode/commands/deep/assets/deep_ai-council_confirm.yaml:40].
- Deep command YAMLs also reference runtime assets used during loop execution [SOURCE: .opencode/commands/deep/assets/deep_ai-council_confirm.yaml:47].
- Both OpenCode and Claude orchestrate agent mirrors mention the deep-loop mode registry, so both runtime-specific agent trees need synchronized edits [SOURCE: .opencode/agents/orchestrate.md:185] [SOURCE: .claude/agents/orchestrate.md:174].

## Sources Consulted

- `.opencode/commands/doctor/_routes.yaml`
- `.opencode/commands/deep/assets/deep_ai-council_confirm.yaml`
- `.opencode/agents/orchestrate.md`
- `.claude/agents/orchestrate.md`

## Assessment

- `newInfoRatio`: 0.66.
- Novelty justification: expanded reference migration beyond prose into command routes, generated contracts, and runtime-specific agent mirrors.
- Confidence: high, because the cited files are active command and agent surfaces.

## Reflection

External migration should be treated as buildable surface repair, not cleanup. The command-contract regeneration gate is necessary because stale compiled assets can preserve old paths even after sources change.

## Recommended Next Focus

Stress-test advisor migration, because advisor projection and corpus surfaces may mix generated and hand-authored references.
