---
title: Deep Review Strategy - compat opt-in and image declaration
description: Inline detached one-iteration review strategy for the requested fan-out lineage.
trigger_phrases:
  - deep review compat opt-in
  - affinity advice consumer path
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Detached Fan-out Lineage

## 1. OVERVIEW

This lineage performs one broad review iteration over the requested spec-folder target. The
executor-dispatch contract is already satisfied by the calling fan-out process; the iteration
was performed inline in this session.

## 2. TOPIC

Review specs/hooks/021-compat-opt-in-and-image-declaration for correctness, security,
traceability, and maintainability across the changed extension, model configuration, packet
documents, tests, and recorded live evidence.

## 3. REVIEW DIMENSIONS

<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness
- [x] D2 Security
- [x] D3 Traceability
- [x] D4 Maintainability
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- Do not edit the target extension, tests, models.json, packet documents, or scratch evidence.
- Do not run repository validators, metadata generators, network probes, or git write commands.
- Do not treat the unrelated handover-cli-skills.md file as part of this target.
- Do not infer gateway cache stickiness from an HTTP 200 response.

## 5. STOP CONDITIONS

The stop policy is max-iterations with maxIterations=1. Convergence is telemetry only and
cannot trigger early synthesis. The terminal stop reason is maxIterationsReached.

## 6. COMPLETED DIMENSIONS

<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| correctness | CONDITIONAL | 1 | DeepSeek startup selection can suppress generic affinity advice. |
| security | PASS | 1 | No credential literal, unsafe write, or new injection path was found in scope. |
| traceability | CONDITIONAL | 1 | The packet records the missing startup-path test and weak request-header artifact. |
| maintainability | CONDITIONAL | 1 | One assertion around removed thinkingFormat behavior is vacuous. |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS

<!-- MACHINE-OWNED: START -->
- P0 (Critical): 0 active
- P1 (Major): 1 active
- P2 (Minor): 2 active
- Delta this iteration: +0 P0, +1 P1, +2 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED

- Direct source tracing followed the producer, generic composer, selected adapter, and startup
  notification consumer; this exposed the affinity advice loss that helper-only tests miss.
- The packet's recorded extension check output is complete: typecheck, 114 tests, diff check,
  and package dry-run are all shown as passing in scratch/check-run.txt.
- The deterministic image fixture and response body support the one-model image declaration,
  while the evidence is kept scoped to that model.

## 9. WHAT FAILED

- The startup notification harness does not cover a DeepSeek-named proxy with a missing generic
  affinity flag. Its control C intentionally accepts zero warnings even though the full
  diagnosis still reports the missing flag.
- The affinity evidence records a successful response but not a durable request-header trace or
  server echo that would let a reviewer independently confirm the three headers were sent.

## 10. EXHAUSTED APPROACHES

No review approach was exhausted. The one-iteration cap prevents a second pass; it does not
convert unresolved questions into convergence.

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER

<!-- MACHINE-OWNED: START -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: correctness, security, traceability, maintainability
- Pivot lineage: broad all-dimensions pass
- Remaining frontier: startup notification regression coverage, request-header evidence replay
<!-- MACHINE-OWNED: END -->

## 11. RULED OUT DIRECTIONS

- Name-only DeepSeek applicability regression: ruled out by the explicit gate and its negative
  test at review-findings.test.ts:1122-1135.
- Manufactured thinkingFormat writer residue in the current source: no active assignment remains
  in the changed suggestion/advice path or fix suggestion; the branch-removal diff confirms it.
- Literal credential exposure in the reviewed packet: no API key value is recorded; evidence uses
  redacted environment references.
- Image ground-truth mismatch: the arbitrary code and all three fixture lines match the recorded
  model response.

## 12. NEXT FOCUS

If another run is authorized, first add or execute a model_select regression for a DeepSeek-named
proxy with thinkingFormat explicitly enabled and affinity missing, then replay the full notification
path for the unopted case. Preserve a redacted verbose request trace or gateway echo for affinity.

## 13. KNOWN CONTEXT

- Target is a Level 1 spec packet with spec.md, plan.md, tasks.md, implementation-summary.md,
  changed TypeScript/config/test files, and scratch evidence.
- resource-map.md was absent in the target at initialization; the coverage gate is skipped.
- The packet explicitly excludes handover-cli-skills.md from this review scope.
- The target claims that affinity moved to the generic path without losing opted-in advice.
- The current code composes the generic list in describeMissingCacheCompatForModel(), but the
  DeepSeek adapter's warningText still calls describeMissingDeepSeekCompat() alone.
- The recorded implementation summary claims validate.sh passed, but this lineage did not run
  that command because the executor contract forbids repository tooling writes.

## 14. CROSS-REFERENCE STATUS

<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| spec_code | core | fail | 1 | Plan architecture says affinity advice is preserved; selected startup adapter does not consume the composed list. |
| checklist_evidence | core | partial | 1 | Tasks and check output provide broad evidence, but the notification edge case and request-header proof are incomplete. |
| skill_agent | overlay | notApplicable | 1 | Target is a spec-folder, not a skill. |
| agent_cross_runtime | overlay | notApplicable | 1 | No agent definition is under review. |
| feature_catalog_code | overlay | notApplicable | 1 | No feature catalog is part of this packet. |
| playbook_capability | overlay | partial | 1 | The recorded verification harness is executable but omits the missing-affinity DeepSeek startup case. |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW

<!-- MACHINE-OWNED: START -->
| File group | Dimensions | Last iteration | Findings | Status |
|------------|------------|----------------|----------|--------|
| spec, plan, tasks, implementation summary | correctness, traceability, maintainability | 1 | 1 P1, 2 P2 | complete |
| extension source and tests | correctness, security, traceability, maintainability | 1 | 1 P1, 1 P2 | complete |
| models.json and live probes | security, traceability | 1 | 1 P2 | complete |
| review brief, diff, harness output | traceability, maintainability | 1 | 1 P1, 2 P2 | complete |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES

<!-- MACHINE-OWNED: START -->
- Max iterations: 1
- Convergence threshold: 0.10
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-gpt-56-luna-1789146937931-6gxjep, parentSessionId=null, generation=1, lineageMode=new
- Requested lineage mode: auto
- Artifact root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/hooks/021-compat-opt-in-and-image-declaration/review/lineages/gpt-56-luna
- Severity threshold: P2
- Review target type: spec-folder
- Executor: cli-codex model=gpt-5.6-luna
- Execution mode: AUTONOMOUS inline
- Stop policy: max-iterations
<!-- MACHINE-OWNED: END -->

