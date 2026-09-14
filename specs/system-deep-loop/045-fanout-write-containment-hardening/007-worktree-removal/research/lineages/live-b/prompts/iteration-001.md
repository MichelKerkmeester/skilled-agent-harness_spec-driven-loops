# Iteration Prompt — 1

Mode: research · Lineage: live-b · Session: `fanout-live-b-1789402289626-dt269k` · Generation 1
Artifact dir: `specs/system-deep-loop/045-fanout-write-containment-hardening/007-worktree-removal/research/lineages/live-b`
Executor: `cli-pi` (model `deepseek-v4.1-flash`, reasoning max) — executed **in-process** by the
lineage itself; the per-iteration dispatch step is satisfied by the lineage process and no nested
CLI/agent/subprocess is spawned.

## Topic

List every exported function of
`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts`
with a one-line purpose each, citing `file:line`.

## Single focus for this iteration

Exhaustive exported-surface inventory with per-function purpose and `file:line` citation. Treat the
asked class strictly as exported **functions**; report exported constants and types in a separate,
labelled section so the class boundary stays explicit.

## Known context to start from

- Module: 1391 lines, sha256 `45b462789245b579b19111df028c2a3a534463e2dacdbf1ea01e0b3e79e2a540`.
- The module's header states its purpose: a dispatched leaf's artifact-dir boundary is prompt-only,
  so the module turns it structural by diffing the git working tree after a dispatch and reporting
  out-of-scope changes, with preservation as the default remedy.
- A production consumer exists: `runtime/scripts/fanout-run.cjs`.

## Contract

1. Write the iteration narrative to `iterations/iteration-001.md` (Focus, Findings, Sources
   Consulted, Assessment, Reflection, Recommended Next Focus).
2. Write the per-iteration delta to `deltas/iter-001.jsonl` with a `type: "iteration"` record.
3. Write one iteration record to `deep-research-state.jsonl` carrying `type`, `iteration`, `mode`,
   `status`, `focus`, `newInfoRatio`, `noveltyJustification`, and the route-proof fields
   (`target_agent`, `agent_definition_loaded`, `resolved_route`).
4. Stay inside the artifact directory. Every finding cites `[SOURCE: file:line]`.
5. Budget: 12 tool calls, 10 minutes. Report `newInfoRatio` with a one-sentence novelty
   justification, plus what was tried and ruled out.

## Stop policy

`max-iterations` with `maxIterations: 1`. Convergence before the cap is telemetry only and must not
trigger early synthesis; reach the cap, then synthesize.
