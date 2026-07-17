# Review Resource Map

Session: fanout-codex-4-1780596001496-dj6z7c
Generated from direct reads and rg searches because Code Graph MCP was unavailable in this lineage context.

## Core Runtime

- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` - fan-out prompt construction, subprocess dispatch, sandbox argument wiring, timeout sizing.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` - capped async pool primitive and orchestration ledger helpers.
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` - executor schema, lineage schema, sandbox/permission mapping.
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/permissions-gate.ts` - pre-dispatch permission evaluation helper.
- `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` - graph-assisted convergence bridge.
- `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` - review convergence signal computation.
- `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts` - coverage gap query semantics.

## Skill Advisor MCP

- `.opencode/skills/system-skill-advisor/mcp_server/tools/advisor-contract-keys.ts` - advertised parameter-key tuples.
- `.opencode/skills/system-skill-advisor/mcp_server/tools/advisor-recommend.ts` - ListTools descriptor for advisor_recommend.
- `.opencode/skills/system-skill-advisor/mcp_server/tools/advisor-validate.ts` - ListTools descriptor for advisor_validate.
- `.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts` - handler input/output schemas.
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts` - workspaceRoot and threshold use.

## System Spec Kit Contracts

- `.opencode/skills/system-spec-kit/references/hooks/skill_advisor_hook_validation.md` - public advisor hook validation expectations.
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` - review workflow graphEvents transformation.
- `.opencode/skills/deep-review/references/state/state_jsonl.md` - documented graphEvents state shape.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/spec.md` - target scope and review focus.

## Tests Read

- `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` - fanout-run integration with stub binaries.
- `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts` - pool primitive concurrency tests.
- `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-graph.vitest.ts` - review graph allow-list coverage.
- `.opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts` - convergence bridge behavior for empty and uncovered graphs.
