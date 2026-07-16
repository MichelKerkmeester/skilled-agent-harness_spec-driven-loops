# Iteration 004 - Maintainability

## Focus
Documentation drift, MCP tool IDs, and graceful degradation contracts.

## Findings
### P2
- **F004**: Review slice names a runtime `reduce-state.cjs` entrypoint that is intentionally owned by `deep-review` - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/spec.md:58` - the review scope lists `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` and `reduce-state.cjs`, but deep-loop-runtime documents the direct runtime scripts as `convergence`, `upsert`, `query`, and `status` plus fan-out scripts, while explicitly saying `deep-review/scripts/reduce-state.cjs` depends on the moved runtime. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/spec.md:58`] [SOURCE: `.opencode/skills/deep-loop-runtime/SKILL.md:157`] [SOURCE: `.opencode/skills/deep-loop-runtime/SKILL.md:261`]
- **F005**: Code-graph unavailable fallback guidance conflicts across root and skill docs - `.opencode/skills/system-code-graph/SKILL.md:292` - the root workflow says graph-unavailable recovery should use Grep/Glob plus direct reads, while system-code-graph's fallback contract says an unavailable `mk_code_index` MCP should report and stop because structural queries do not fall back to text search. That is reasonable for authoritative structural answers, but it conflicts with the broader agent recovery path used when continuing work without graph support. [SOURCE: `AGENTS.md:118`] [SOURCE: `.opencode/skills/system-code-graph/SKILL.md:292`]

### P0
None.

### P1
None new.

## No-Finding Notes
- Code-graph tool IDs in `mcp_server/tool-schemas.ts` match the `mcp__mk_code_index__...` references in the skill docs and system-spec-kit routing guidance.
- Skill-advisor tool IDs in `tools/index.ts`, `skill-graph-tools.ts`, and `tool_ids_reference.md` are internally consistent for the checked public surface.

Review verdict: PASS
