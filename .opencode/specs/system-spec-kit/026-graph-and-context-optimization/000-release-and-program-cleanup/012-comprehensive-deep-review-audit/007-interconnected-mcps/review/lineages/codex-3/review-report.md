# Deep Review Report

## Executive Summary
Verdict: CONDITIONAL. The review found no P0s, three active P1 findings, and two P2 advisories across the interconnected MCP/deep-loop slice.

The strongest issue is the fan-out runner: `fanout-pool.cjs` supports capped concurrency, but `fanout-run.cjs` injects a worker that blocks the event loop with `spawnSync`, so CLI lineages run serially in practice. Two adjacent P1s cover per-lineage iteration bounds not reaching the actual loop and artifact-bound write safety depending on prompt discipline instead of runtime enforcement.

## Planning Trigger
Plan remediation before release. The active P1s affect shipped fan-out behavior, cost/runtime bounds, and write-boundary safety for autonomous CLI lineages.

## Active Finding Registry
| ID | Severity | Finding | Evidence |
|---|---|---|---|
| F001 | P1 | Fan-out CLI worker serializes lineages despite the concurrency cap. | `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:311`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344`, `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:174` |
| F002 | P1 | Fan-out lineages run with repo-write permission while the artifact boundary is prompt-only. | `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:83`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:142`, `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:910` |
| F003 | P1 | Per-lineage `iterations` config changes only timeout, not the loop bound. | `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:292`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:131`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:154` |
| F004 | P2 | Review slice names a runtime `reduce-state.cjs` entrypoint that is intentionally owned by `deep-review`. | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/spec.md:58`, `.opencode/skills/deep-loop-runtime/SKILL.md:157`, `.opencode/skills/deep-loop-runtime/SKILL.md:261` |
| F005 | P2 | Code-graph unavailable fallback guidance conflicts across root and skill docs. | `AGENTS.md:118`, `.opencode/skills/system-code-graph/SKILL.md:292` |

## Remediation Workstreams
1. Fan-out execution: replace `spawnSync` with an async subprocess path in `fanout-run.cjs`, then add a regression test that proves two slow CLI stubs overlap when `concurrency: 2`.
2. Executor contract: pass lineage `iterations` into the lineage prompt/config as `max_iterations`, and validate that the child loop records the expected max in `deep-review-config.json`.
3. Permission boundary: require an explicit sandbox choice for CLI fan-out or enforce an artifact-local write matrix before dispatch; prompt text alone is not a boundary.
4. Documentation cleanup: remove the nonexistent runtime reducer path from the review slice or point it to `deep-review/scripts/reduce-state.cjs`; reconcile graph-unavailable fallback wording.

## Spec Seed
- Add an acceptance criterion that fan-out runtime tests must prove wall-clock overlap for CLI subprocess lineages.
- Add an acceptance criterion that `iterations` is visible in the child lineage config and state log, not only in parent timeout math.
- Add a safety requirement that CLI fan-out may write only under the bound lineage artifact directory unless an operator explicitly opts out.

## Plan Seed
1. Patch `fanout-run.cjs` to use non-blocking subprocess execution and preserve stdout capture, timeout handling, and salvage.
2. Extend `buildLoopPrompt()` with `max_iterations: ${lineage.iterations || default}` and thread it into child config creation.
3. Add unit tests for subprocess overlap, max-iteration propagation, and sandbox/write-boundary behavior.
4. Update the slice spec and code-graph fallback docs after behavior is finalized.

## Traceability Status
| Protocol | Status | Notes |
|---|---|---|
| spec_code | pass | All requested focus areas were either mapped to findings or explicitly ruled out. |
| checklist_evidence | pass | No checklist exists in the Level 1 slice. |
| feature_catalog_code | partial | Fan-out feature docs are present, but they do not cover subprocess-overlap failure. |
| playbook_capability | partial | Pool primitive tests do not prove fanout-run subprocess concurrency. |

## Deferred Items
- P2 F004 and F005 can be batched with documentation cleanup after P1 behavior is fixed.
- Live CLI fan-out tests were not executed in this lineage because the task was read-only and limited writes to the lineage artifact directory.

## Audit Appendix
Iterations: 5. Dimensions covered: correctness, security, traceability, maintainability. Stop reason: converged after stabilization. Replay from JSONL gives active counts P0=0, P1=3, P2=2 and a CONDITIONAL verdict.

Evidence density gate passed for all active P1s: each has at least one concrete `file:line` citation and a claim-adjudication packet. Code Graph MCP was unavailable in session startup, so graphless fallback used direct reads plus exact `rg` discovery.
