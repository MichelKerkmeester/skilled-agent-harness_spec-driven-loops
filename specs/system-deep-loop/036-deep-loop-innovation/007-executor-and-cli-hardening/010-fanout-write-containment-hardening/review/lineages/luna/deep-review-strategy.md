---
title: Deep Review Strategy - fanout write containment hardening
sessionId: fanout-luna-1789427869613-2bzg57
generation: 2
---

# Deep Review Strategy

## 1. OVERVIEW

Bounded three-iteration review of the spec packet and its directly referenced containment, fan-out, executor-config, workflow, and evidence surfaces. The executor is inline in this detached lineage; no nested dispatch is permitted. Convergence is telemetry only because the stop policy is `max-iterations`.

## 2. TOPIC

Review `specs/system-deep-loop/045-fanout-write-containment-hardening` against the current implementation and current review-mode workflow contracts.

## 3. REVIEW DIMENSIONS
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness
- [x] D2 Security
- [x] D3 Traceability
- [ ] D4 Maintainability
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- Do not modify implementation, tests, packet documents, workflow YAML, or runtime configuration.
- Do not execute validators, builds, tests, continuity writers, Git writes, or nested executor dispatch.
- Do not infer runtime behavior beyond the read-only source and test evidence available in the workspace.

## 5. STOP CONDITIONS

- Run exactly three iterations, even if convergence telemetry would otherwise signal an early stop.
- Stop only at the configured cap; terminal synthesis must record `maxIterationsReached`.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| Correctness | PASS | 1 | Current containment state transitions, failure ordering, preserve default, and canonical-root selection align with the reviewed invariants. |
| Security | CONDITIONAL | 2 | Baseline, restore-parent, and quarantine check-create paths lack complete symlink or atomic no-follow guarantees. |
| Traceability | CONDITIONAL | 3 | The cli-opencode caller, packet requirements, acceptance evidence, and plan thresholds are not reconciled with ADR-007 and the current no-worktree topology. |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 6 active
- **P2 (Minor):** 1 active
- **Delta this iteration:** +0 P0, +3 P1, +1 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED

- Direct source-to-test comparison worked for state transitions because the producer, runner call order, and focused tests were read together (iteration 1).
- Trust-boundary review worked by tracing every baseline, restore, and quarantine write to its shared path helper and its nearest symlink test (iteration 2).
- Caller-to-packet comparison exposed a supported-workflow guard and acceptance surface that still assume the removed worktree topology (iteration 3).

## 9. WHAT FAILED

- No atomic no-follow primitive or ancestor-safe restore boundary is present in the reviewed security paths; this is recorded as three P1 findings (iteration 2).
- The current caller and packet evidence cannot be treated as one contract: ADR-007, fanout-run.cjs, deep-review-auto.yaml, and the closure rows disagree (iteration 3).

## 10. EXHAUSTED APPROACHES

- The correctness invariant sweep is saturated for this lineage; do not repeat baseline deletion, failure ordering, preserve-default, or canonical-root selection as the primary angle.
- The final-component symlink angle is saturated; the missing ancestor and atomicity cases remain active findings, not a reason to repeat the existing test.

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- MACHINE-OWNED: START -->
- Failed pivots: 0
- Audited overrides: 0
- Completed pivots: 2
- Swept: correctness state transitions; security trusted writes
- Pivot lineage: correctness -> security trust-boundary writes -> traceability caller/evidence contracts
- Remaining frontier: maintainability only; synthesis is required at the cap
<!-- MACHINE-OWNED: END -->

## 11. RULED OUT DIRECTIONS

- Baseline-only untracked deletion: ruled out by the union comparison and focused deletion tests (iteration 1).
- Failure-path bypass: ruled out by containment-before-failure-gates ordering (iteration 1).
- Preserve-default regression: ruled out by implementation and strict config parsing (iteration 1).
- Existing final-component quarantine symlink: ruled out by refusal logic and focused tests (iteration 2).
- Strict rejection of the removed containment.worktrees config key: ruled out by executor-config.ts:803-817 (iteration 3).

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Synthesis: maintainability was not run; preserve the maxIterationsReached stop reason and the 3/4 dimension coverage gap.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `spec.md`, `plan.md`, `acceptance-criteria.md`, `tasks.md`, `decision-record.md`, `goal.md`, `handover.md`; containment and fan-out runtime files; executor configuration; auto/confirm review workflows; directly referenced unit and runner tests.
- Behavior claims: containment defaults preserve; restore is opt-in; churn thresholds are 3 per window and 12 cumulative; failed lanes are contained before failure gates; removed worktree behavior is superseded by the accepted ADR-007 direction.
- Reuse and convention pointers: current `fanout-run.cjs` delegates containment to `write-containment.ts`; the append gateway owns canonical review ledger writes; review iterations require narrative, delta, and state artifacts.
- Risk areas: stale worktree language and evidence, trust-boundary writes through symlinked paths, caller drift in `deep-review-auto.yaml`, and incomplete tests for parent-component symlink replacement.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| spec_code | core | partial | 3 | ADR-007 and the current no-worktree runner disagree with retained packet requirements and the stale auto caller. |
| checklist_evidence | core | partial | 3 | Acceptance rows marked Met include an absent test, mismatched line citations, and unreconciled closure metadata. |
| skill_agent | overlay | notApplicable | 0 | Target is a spec folder, not a standalone skill. |
| agent_cross_runtime | overlay | notApplicable | 0 | Target is not an agent definition. |
| feature_catalog_code | overlay | partial | 3 | Runner boundary was checked; a separate catalog sweep remains incomplete. |
| playbook_capability | overlay | pending | 3 | Maintainability/playbook coverage was deferred by the iteration cap. |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts | D1, D2 | 2 | 3 P1 | partial |
| .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | D1, D2 | 2 | 1 P1 | partial |
| .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts | D1 | 1 | 0 | partial |
| .opencode/skills/system-deep-loop/runtime/scripts/runtime-bootstrap.cjs | D1 | 1 | 0 | partial |
| .opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts | D1, D2 | 2 | 2 P1 gaps | partial |
| .opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts | D1 | 1 | 0 | partial |
| .opencode/commands/deep/assets/deep-review-auto.yaml | - | - | 0 | pending |
| .opencode/commands/deep/assets/deep-review-confirm.yaml | - | - | 0 | pending |
| specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md | D1 | 1 | 0 | partial |
| specs/system-deep-loop/045-fanout-write-containment-hardening/plan.md | - | - | 0 | pending |
| specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md | - | - | 0 | pending |
| specs/system-deep-loop/045-fanout-write-containment-hardening/tasks.md | - | - | 0 | pending |
| specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md | D1 | 1 | 0 | partial |
| specs/system-deep-loop/045-fanout-write-containment-hardening/goal.md | - | - | 0 | pending |
| specs/system-deep-loop/045-fanout-write-containment-hardening/handover.md | - | - | 0 | pending |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.1
- Convergence mode: off
- Stop policy: max-iterations
- Session lineage: sessionId=fanout-luna-1789427869613-2bzg57, parentSessionId=null, generation=2, lineageMode=new, lineageModeInput=auto
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-09-14T23:29:16.000Z
<!-- MACHINE-OWNED: END -->
