# Deep Research Strategy - gpt Lineage

## Research Topic

CLI-fallback feasibility for `mk_skill_advisor`, limited to skill-advisor-specific deltas from the settled spec-memory CLI-over-daemon pattern.

## Known Context

- Parent packet requested a forced 10-iteration fan-out lineage with `artifact_dir` bound directly to this directory.
- The MCP registry exposes 9 tools through `TOOL_DEFINITIONS` and dispatches 4 advisor tools directly plus 5 skill graph tools through `skill-graph-tools.ts` [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts:37].
- `skill_advisor.py` exists as a documented Gate-2 compatibility CLI, but its parser exposes recommend/deep-routing/health/validate/batch modes, not the full MCP tool set [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:3479].
- `resource-map.md` was absent in the parent research directory at init; coverage gate was skipped.

## Key Questions

- [x] KQ1: All 9 tools classified and mapped.
- [x] KQ2: Daemon dependencies audited.
- [x] KQ3: Spec-memory affordance transfer assessed.
- [x] KQ4: Python fallback coverage and scorer divergence measured.
- [x] KQ5: Long-running rebuild/scan semantics classified.
- [x] KQ6: Integration surface counted.
- [x] KQ7: Hook latency bounded.
- [x] KQ8: Coexistence/race/orphan class specified.
- [x] KQ9: Risk register and design deltas produced.
- [x] KQ10: Go/no-go verdict synthesized.

## Answered Questions

All 10 key questions have terminal answers in `research.md` and their matching iteration files.

## What Worked

- Reading the TypeScript tool registry first made the 9-tool parity matrix exact.
- Measuring `--force-local` and `--force-native` on identical prompts clarified that the existing Python CLI can be reconciled for recommendation parity.
- Timing one-shot versus batch calls separated bridge startup cost from scoring cost.

## What Failed

- `ps` process inspection was blocked by the sandbox (`operation not permitted`), so live orphan counts could not be re-measured from the process table.
- The first script path assumption was stale; canonical Python files live under `mcp_server/scripts/`.

## Exhausted Approaches

- Treating `skill_advisor.py` as full CLI parity.
- Treating one-shot native subprocesses as hook-path safe.
- Removing the MCP server instead of adding a dual-stack CLI.

## Ruled-Out Directions

| Approach | Reason | Evidence |
|---|---|---|
| Recommend-only CLI as final answer | Fails zero-feature-loss for rebuild and skill graph tools. | [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts:85] |
| Per-prompt native subprocess on hooks | Median measured one-shot native path was 824.8ms. | [SOURCE: command:5-sample timing sweep] |
| Separate hand-written CLI schemas | Exported Zod schemas already define the advisor contract. | [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts:377] |

## Next Focus

Implementation phase: build a generated Node CLI that wraps MCP handlers/daemon IPC, reconcile `skill_advisor.py` as a legacy facade for `advisor_recommend`, and add lifecycle reaping acceptance tests before enabling CLI spawn on hooks.
