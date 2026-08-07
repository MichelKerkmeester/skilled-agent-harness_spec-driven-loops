# Deep Review Report - Codex Fan-Out Lineage

## Executive Summary
Verdict: **CONDITIONAL**. The lineage completed 50/50 iterations under stopPolicy=max-iterations and found 0 P0, 5 P1, 0 P2 active findings. hasAdvisories=false. Release readiness remains in-progress until the active P1s are remediated or explicitly accepted.

## Planning Trigger
Route to remediation planning because active P1 findings remain. The highest-value fixes are lineage session-id propagation, prompt/agent-boundary cleanup, and restoring the focused fanout-run test suite.

## Active Finding Registry
### F001 (P1) Remediation phase is marked complete while retaining scaffold placeholders
- Status: active
- Dimension: traceability
- Evidence: [SOURCE: .opencode/specs/deep-loops/024-deep-loop-improved/008-loop-systems-remediation/spec.md:42]; [SOURCE: .opencode/specs/deep-loops/024-deep-loop-improved/008-loop-systems-remediation/spec.md:50]; [SOURCE: .opencode/specs/deep-loops/024-deep-loop-improved/008-loop-systems-remediation/spec.md:66]; [SOURCE: .opencode/specs/deep-loops/024-deep-loop-improved/008-loop-systems-remediation/spec.md:139]
- Claim: The remediation phase presents itself as complete while core scope, handoff, problem, requirements, and phase criteria remain placeholders or pending.
- Recommendation: Downgrade the phase status or replace placeholders with real remediation scope, requirements, and handoff evidence before treating phase 009 as closed.

### F002 (P1) Fan-out lineage session id is discarded during review init
- Status: active
- Dimension: correctness
- Evidence: [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:785-789]; [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1281-1282]; [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:373]; [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:410]; [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:415]
- Claim: The fan-out runner passes a concrete session_id to the lineage prompt, but review init writes config, JSONL, and registry sessionId fields from ISO_8601_NOW instead of the supplied lineage id.
- Recommendation: Bind the supplied session_id into review init and reuse it across config, state, registry, graph convergence, blocked-stop, and synthesis events.

### F003 (P1) CLI fan-out prompt names the LEAF deep-review agent and asks it to run the full loop
- Status: active
- Dimension: traceability
- Evidence: [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:806]; [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:816]; [SOURCE: .opencode/agents/deep-review.md:34]; [SOURCE: .opencode/agents/deep-review.md:54-64]; [SOURCE: .opencode/commands/deep/review.md:117]
- Claim: The generated CLI lineage prompt says the subprocess is a deep-review agent and instructs it to run phase_init, phase_main_loop, and phase_synthesis, contradicting the deep-review agent contract that it executes exactly one iteration and must not run the full loop.
- Recommendation: Render CLI lineage prompts as command-host/orchestrator prompts, or invoke the deep/review command surface directly, so LEAF-only agent instructions do not conflict with full-loop phase execution.

### F004 (P1) Focused fan-out regression suite fails after native lineages were folded into the pool
- Status: active
- Dimension: correctness
- Evidence: [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:323-341]; [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:458]; [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:1342-1343]; [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1174-1177]
- Claim: The checked-in fanout-run tests still expect native-only configurations to produce no CLI lineage work, while the implementation now assigns all lineages to the pool, and the focused vitest run fails 3 tests.
- Recommendation: Either update the native-only tests to the new pool-owned native behavior with a native/opencode stub, or restore a true no-CLI branch; keep the prompt wording assertion synchronized with the current legal-convergence phrase.

### F005 (P1) Workflow YAML carries ephemeral finding-id comments
- Status: active
- Dimension: maintainability
- Evidence: [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:395]; [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:408]
- Claim: The review workflow embeds an ephemeral finding id in comments, which violates the active comment-hygiene rule that forbids artifact/finding identifiers in durable code or workflow comments.
- Recommendation: Remove the finding-id marker and keep only the durable rationale for honoring the parsed resource-map flag.

## Remediation Workstreams
1. Lineage state integrity: fix F002 and verify sessionId consistency across config, JSONL, registry, graph events, and synthesis.
2. Agent/command contract fidelity: fix F003 so CLI fan-out prompts do not conflict with LEAF-only deep-review instructions.
3. Verification recovery: fix F004 and rerun the focused fanout-run/fanout-merge suite.
4. Spec/document hygiene: fix F001 and F005 to remove stale completion/placeholders and ephemeral comment markers.

## Spec Seed
- Add a remediation phase or update phase 009 to explicitly cover fan-out lineage identity, CLI prompt contract, native pool test alignment, and comment hygiene.

## Plan Seed
- Patch review init to consume supplied session_id.
- Adjust CLI lineage prompt rendering or dispatch through the command host.
- Update fanout-run tests for the current native-pool contract, then run the focused vitest suite.
- Replace phase 009 placeholders or downgrade its status.
- Remove ephemeral finding-id comments from workflow YAML.

## Traceability Status
| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| spec_code | partial | hard | F001, F003 |
| checklist_evidence | partial | hard | F004 focused test failure |
| feature_catalog_code | partial | advisory | F002/F003 fan-out dispatch drift |
| playbook_capability | partial | advisory | F004 verification drift |

## Deferred Items
- No P2-only advisories were deferred.
- No external web checks were run; review remained local/code-only.

## Audit Appendix
- Stop reason: maxIterationsReached.
- Iterations: 50.
- Dimensions covered: correctness, security, traceability, maintainability.
- Verification run: `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run ../../deep-loop-runtime/tests/unit/fanout-run.vitest.ts ../../deep-loop-runtime/tests/unit/fanout-merge.vitest.ts --reporter=verbose` -> failed: fanout-run 3 failures, fanout-merge passed.
- Resource map coverage: resource-map.md was not present at init; gate omitted.
