# Review Report

## Executive Summary
Verdict: FAIL. The review found 1 active P0, 4 active P1, and 2 active P2 findings across seven iterations. The release-blocking issue is that `deep-review/scripts/reduce-state.cjs` cannot honor the fan-out lineage artifact override, so reducer-owned outputs can target the canonical review packet instead of the lineage packet.

Scope covered system-code-graph, system-skill-advisor, and deep-loop-runtime seams named by the target spec. `hasAdvisories: true`.

## Planning Trigger
Route to remediation planning before release. The active P0 can make fan-out lineages fail or mutate the wrong review packet. The active P1 findings then affect fan-out concurrency, executor iteration caps, Codex CLI defaults, and recursion/env guard coverage.

## Active Finding Registry
| ID | Severity | Finding | Evidence |
|---|---|---|---|
| F001 | P0 | deep-review reducer ignores fan-out artifact_dir override | [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:1673] |
| F002 | P1 | `spawnSync` in the fan-out worker serializes CLI lineages | [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344] |
| F003 | P1 | per-lineage `iterations` only sizes timeout and never reaches child `maxIterations` | [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:154] |
| F004 | P1 | Codex service tier defaults drift between cli-codex, YAML, and fanout-run | [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:177] |
| F005 | P1 | fanout-run bypasses the shared executor recursion guard and env allowlist | [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:348] |
| F006 | P2 | fan-out lineage write boundary is prompt-only while sandbox defaults to workspace-write | [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:83] |
| F007 | P2 | reviewed code comments still contain perishable packet and finding labels | [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:7] |

## Remediation Workstreams
1. Fan-out artifact ownership: add an explicit reducer artifact-dir override or make the reducer consume already-bound state paths; update review YAML calls accordingly.
2. Fan-out process execution: replace `spawnSync` with async subprocess execution or reuse `runAuditedExecutorCommandAsync` so `runCappedPool` can actually run K lineages in flight.
3. Executor config fidelity: pass lineage `iterations` into the child loop as `max_iterations`, and align Codex defaults to `service_tier=fast`.
4. Dispatch safety: route fanout-run through the same recursion guard and environment allowlist used by single-executor dispatch.
5. Hygiene follow-up: remove perishable labels from code comments and make lineage write boundaries explicit.

## Spec Seed
Add a remediation spec requiring:
- Fan-out lineage artifact override is honored by reducer-owned registry, dashboard, strategy, and resource-map writes.
- CLI fan-out concurrency is verified with a slow stub proving overlapping execution.
- Per-lineage `iterations` is either enforced as child `maxIterations` or renamed/documented as timeout-only.
- Codex dispatch defaults to `gpt-5.5`, medium reasoning, `service_tier=fast` unless explicitly overridden.
- fanout-run uses shared executor dispatch guard/env filtering.

## Plan Seed
1. Extend `reduce-state.cjs` with `--artifact-dir` and validate it stays under the supplied lineage path.
2. Update review and research YAML reducer calls to pass `{artifact_dir}` in fan-out and non-fan-out paths.
3. Convert fanout-run worker to async spawn and add an overlap test using a slow stub with `concurrency: 2`.
4. Wire lineage `iterations` into the child prompt/config and add parser tests.
5. Replace `service_tier=default/null` with normalized `fast`.
6. Reuse `validateExecutorDispatchAllowed` and `buildExecutorDispatchEnv` or a fan-out-safe wrapper.

## Traceability Status
| Protocol | Status | Notes |
|---|---|---|
| spec_code | partial | Required fan-out/concurrency assessment completed; active defects remain. |
| checklist_evidence | pass | No checklist exists in this Level 1 slice. |
| feature_catalog_code | partial | Fan-out docs describe behavior that implementation does not fully honor. |
| playbook_capability | partial | Existing fanout-run tests do not prove true concurrency or guard reuse. |

## Deferred Items
- P2 sandbox boundary: prompt-only write confinement is weaker than the requested lineage-only output boundary.
- P2 comment hygiene: remove packet/finding labels from code comments while preserving durable rationale.
- Code graph MCP was unavailable in-session; direct `rg`/read evidence was used instead.
- No tests were executed because lineage instructions prohibited writing outside the artifact directory.

## Audit Appendix
- Stop reason: maxIterationsReached
- Total iterations: 7
- Final severity counts: P0=1, P1=4, P2=2
- Dimension coverage: correctness, security, traceability, maintainability
- Replay validation: active findings remained stable in iteration 7, with no new findings.
- Resource map input: absent; generated review `resource-map.md` from delta evidence.
- Final release-readiness state: release-blocking
