# Deep Review Report - codex-2

## Executive Summary

Verdict: CONDITIONAL

The lineage found no P0 release blockers. It did find three P1 issues and one P2 issue across the interconnected MCP / deep-loop runtime integration surface. The P1s are release-significant because they affect fan-out execution guarantees, per-lineage loop-depth configuration, and hard-block comment hygiene policy compliance.

Scope reviewed:
- `.opencode/skills/deep-loop-runtime/`
- `.opencode/skills/system-code-graph/`
- `.opencode/skills/system-skill-advisor/`
- The target packet's review requirements in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/spec.md`

Active findings:
- P0: 0
- P1: 3
- P2: 1

## Planning Trigger

The review was triggered by the `007-interconnected-mcps` audit packet, which asks for a deep review of integration seams between MCP subsystems and the deep-loop runtime. The packet specifically calls out code-graph freshness and graceful degradation, skill-advisor routing, fan-out concurrency, executor configuration semantics, sandbox defaults, and comment-hygiene policy compliance.

Executor metadata:
- session_id: `fanout-codex-2-1780596001497-312vj2`
- executor: `cli-codex model=gpt-5.5`
- runtime note: current runtime is Codex, so the cli-codex self-invocation guard was honored and no nested Codex process was spawned.
- artifact_dir: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/review/lineages/codex-2`

## Active Finding Registry

### F001 - P1 - Fan-out CLI lineages serialize despite the concurrency cap

Evidence:
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:174` admits workers while `active < concurrency`.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:307` passes an async worker into the pool.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344` uses `spawnSync()` for each lineage executor.
- `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts` verifies the pool primitive with a gated async worker.
- `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` verifies directories, summaries, ledger writes, and state directories, but does not prove overlapping subprocess execution.

Impact:
The fan-out runner advertises and accepts concurrency, and the parent audit packet expects concurrent gpt-5.5 lineages. In the real subprocess path, `spawnSync()` blocks the event loop until each lineage exits, so long-running lineages execute serially. This invalidates campaign timing and resource-planning assumptions.

Concrete fix:
Replace the synchronous child execution path with an asynchronous subprocess implementation, wire completion through the pool promise lifecycle, and add a unit/integration test with delayed child processes proving at least two children overlap when `concurrency > 1`.

### F002 - P1 - Per-lineage `iterations` is documented as loop-depth control but only affects timeout sizing

Evidence:
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:292` documents `iterations` as a per-lineage max-iterations override.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:128-146` builds the child prompt without passing `iterations`, `max_iterations`, or equivalent loop-depth guidance.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:155` uses `lineage.iterations || 12` only for timeout calculation.

Impact:
Operator configuration appears to control child review depth, but the child receives no binding instruction. A configured short lineage can still run the default loop, while a configured long lineage only gets a larger timeout. That is a contract drift between configuration docs and runtime behavior.

Concrete fix:
Either pass the lineage iteration limit into the generated child prompt / runtime config and enforce it in the child loop, or rename the field to a timeout-sizing input and update schema/docs/tests to remove the false loop-depth promise.

### F004 - P1 - Reviewed source contains comment-hygiene hard-block violations

Evidence:
- `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:14-16` contains phase-slot tracking comments.
- `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:33-35` contains phase-slot tracking comments.
- `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:121-123` contains phase-slot tracking comments.
- `.opencode/skills/system-code-graph/mcp_server/core/config.ts:19` contains an ADR tracking comment.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:8` and `:229` contain packet-number tracking comments.

Impact:
The project-level hard block forbids ephemeral tracking labels in code comments, including packet, phase, ADR, task, checklist, requirement, and finding ids. These comments can trip pre-commit policy and violate the durable-code-comment standard even when runtime behavior is otherwise correct.

Concrete fix:
Remove the ephemeral labels and keep only durable intent comments where the explanation is still useful. For example, preserve the reason a tool is a stub or compatibility alias, but remove packet/phase/ADR identifiers.

### F003 - P2 - Stale graph guidance routes operators to a blocked read path

Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:953` tells operators that `code_graph_query` still works when the graph is stale.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:966` routes fresh or stale graph status to `code_graph_query`.
- `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:865-875` blocks the read path when the graph is not fresh or verification failed.
- `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1244-1249` returns the blocked payload for non-fresh graph reads.

Impact:
The actual code-graph read path is conservative, which is good for safety. The higher-level guidance is stale, so recovery instructions can send operators into a call that predictably blocks instead of routing them to refresh or fallback discovery.

Concrete fix:
Update system-spec-kit guidance to distinguish fresh, stale, missing, and verification-failed graph states. For stale/non-fresh states, route first to scan/refresh or to Grep/Glob/direct reads until freshness is restored.

## Remediation Workstreams

1. Runtime execution semantics
   - Convert `fanout-run.cjs` subprocess execution from `spawnSync()` to async child process handling.
   - Add overlap tests using delayed child commands and a concurrency cap greater than one.
   - Verify ledger and summary writes remain deterministic under concurrent completion order.

2. Executor configuration contract
   - Decide whether `iterations` is a child-loop limit or a timeout heuristic.
   - If it is a child-loop limit, propagate it into the generated child prompt/config and assert it in tests.
   - If it is not, rename and redocument it to avoid operator misunderstanding.

3. Policy hygiene cleanup
   - Remove packet, phase, and ADR labels from source comments in reviewed runtime and MCP files.
   - Keep durable why-comments where they remain useful.
   - Run the project comment-hygiene/pre-commit gate after cleanup.

4. Code-graph recovery contract
   - Align system-spec-kit guidance with code-graph read-path blocking behavior.
   - Add a regression check for stale graph status text or route selection if the docs are generated from runtime metadata.

## Spec Seed

Suggested follow-up packet:

```markdown
# Spec: Interconnected MCP Release Readiness Fixes

## Goal
Fix release-significant integration drift found by the `007-interconnected-mcps` deep review lineage.

## Requirements
- Fan-out CLI lineages must execute concurrently up to the configured cap.
- Per-lineage iteration configuration must either control child loop depth or be renamed and documented as timeout sizing only.
- Reviewed source comments must comply with comment-hygiene hard-block policy.
- System-spec-kit graph freshness guidance must match code-graph query blocking behavior.

## Non-Goals
- No broad refactor of deep-loop state format.
- No changes to unrelated MCP tools.
- No executor-provider expansion beyond the reviewed contract.
```

## Plan Seed

1. Read the fan-out runner, pool, and unit tests.
2. Replace synchronous lineage subprocess execution with an async implementation.
3. Add concurrency overlap tests and existing ledger/summary regression coverage.
4. Decide and implement the `iterations` contract.
5. Remove ephemeral comment labels in scoped files.
6. Align stale graph guidance with code-graph read-path behavior.
7. Run stack-appropriate tests and the spec validator for the follow-up packet.

## Traceability Status

Traceability coverage:
- Configuration drift: covered by F002.
- Concurrency mismatch: covered by F001.
- Graceful degradation / stale graph drift: covered by F003.
- Comment-hygiene policy: covered by F004.
- Skill-advisor seams: reviewed, no active finding.
- Sandbox defaults: reviewed, no active finding under the documented fresh-worktree containment assumption.

No claim was made that the broader program is release-ready. This lineage only reports the reviewed MCP/runtime surfaces and the packet-defined seams.

## Deferred Items

- No active P0 security issue was found in the reviewed surface.
- The sandbox default remains a deployment assumption rather than a code defect in this packet because the parent audit documents workspace-write risk and worktree containment as the expected boundary.
- Resource-map coverage was skipped because the target spec folder does not contain a resource map.

## Audit Appendix

Iteration record:
- Iteration 001: scope and fan-out concurrency review; F001 opened.
- Iteration 002: executor configuration review; F002 opened.
- Iteration 003: code-graph freshness and recovery review; F003 opened.
- Iteration 004: skill-advisor and sandbox review; no new active finding.
- Iteration 005: policy and regression coverage review; F004 opened.

Convergence basis:
- All packet-requested dimensions were covered.
- Two consecutive passes after the main runtime/config findings produced no additional P0/P1 in advisor or sandbox seams.
- The remaining open findings are actionable and bounded to the reviewed surfaces.

Release readiness state: CONDITIONAL pending remediation of P1 findings F001, F002, and F004.
