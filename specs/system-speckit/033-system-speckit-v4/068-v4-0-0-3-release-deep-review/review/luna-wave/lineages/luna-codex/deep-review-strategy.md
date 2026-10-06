---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
Review: specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] traceability
- [ ] maintainability

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
Source and packet review only. No implementation changes. Scope is the supplied 1,997-path manifest; focused coverage follows steer.md.

---

## 5. STOP CONDITIONS
Run all 10 iterations. The max-iterations policy treats convergence as telemetry.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 1
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Following fetched bytes through section preparation and classifier stdin exposed a resource bound not covered by the line cap. (iteration 2)
- Bounded the review to the lead-steered injection-screen hook path; diff, registration, adapters and consumer tests identify the same payload and delivery surfaces. (iteration 1)
- [Approach]: [Why it worked] (iteration N)

---

## 9. WHAT FAILED
- No failed approach recorded.
- [Approach]: [Why it failed] (iteration N)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Core spec_code and checklist_evidence: not exercised in this correctness pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Core spec_code and checklist_evidence: not exercised in this correctness pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core spec_code and checklist_evidence: not exercised in this correctness pass.

### Cursor and Codex do not register this local screen; the hook README records their fetch-text limitations. This is an explicit scope choice, not a missing binding. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Cursor and Codex do not register this local screen; the hook README records their fetch-text limitations. This is an explicit scope choice, not a missing binding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Cursor and Codex do not register this local screen; the hook README records their fetch-text limitations. This is an explicit scope choice, not a missing binding.

### No credential value is read by this screen or emitted in its hook output. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No credential value is read by this screen or emitted in its hook output.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No credential value is read by this screen or emitted in its hook output.

### No feature-switch bypass found across the shared adapter path. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No feature-switch bypass found across the shared adapter path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No feature-switch bypass found across the shared adapter path.

### No finding was supported by the checked code paths. The tests were read as evidence of intended cases but were not executed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No finding was supported by the checked code paths. The tests were read as evidence of intended cases but were not executed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No finding was supported by the checked code paths. The tests were read as evidence of intended cases but were not executed.

### No formal traceability protocol was required for this security pass. The hook documentation’s 12-section/four-concurrent/20-second limits match the constants and scheduling, but do not describe or implement a byte limit. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No formal traceability protocol was required for this security pass. The hook documentation’s 12-section/four-concurrent/20-second limits match the constants and scheduling, but do not describe or implement a byte limit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No formal traceability protocol was required for this security pass. The hook documentation’s 12-section/four-concurrent/20-second limits match the constants and scheduling, but do not describe or implement a byte limit.

### No mismatch found between registration paths and the inspected adapters. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No mismatch found between registration paths and the inspected adapters.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No mismatch found between registration paths and the inspected adapters.

### No shell command construction from fetched page text found in the reviewed adapter/transport path. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No shell command construction from fetched page text found in the reviewed adapter/transport path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No shell command construction from fetched page text found in the reviewed adapter/transport path.

### Overlay agent_cross_runtime: PASS for the reviewed screen surface. The canonical hook registry binds Claude and Devin adapters and the Pi extension; the OpenCode plugin and Hermes bridge are present at their declared paths. Runtime-specific registrations use the same tool names and delivery points described in the hook documentation. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay agent_cross_runtime: PASS for the reviewed screen surface. The canonical hook registry binds Claude and Devin adapters and the Pi extension; the OpenCode plugin and Hermes bridge are present at their declared paths. Runtime-specific registrations use the same tool names and delivery points described in the hook documentation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay agent_cross_runtime: PASS for the reviewed screen surface. The canonical hook registry binds Claude and Devin adapters and the Pi extension; the OpenCode plugin and Hermes bridge are present at their declared paths. Runtime-specific registrations use the same tool names and delivery points described in the hook documentation.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
traceability

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Prior context: review range v4.0.0.2..v4.0.0.3 (633 commits); manifest contains 1,997 paths. Lead steer prioritizes hooks/runtime surfaces, workflow call chains, then cross-manifest security. Another Luna lineage covers doctor/release/sk-git commit checks.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs | D2 | 2 | 0 P0, 0 P1, 1 P2 | complete |
| .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs | D2 | 2 | 0 P0, 0 P1, 1 P2 | complete |
| .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs | D2 | 2 | 0 P0, 0 P1, 1 P2 | complete |
| .skilled/hooks/shared/hook-flags.cjs | D2 | 2 | 0 P0, 0 P1, 1 P2 | complete |
| .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/hooks/classifier-injection-screen/claude/classifier-injection-screen-posttooluse.mjs | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/hooks/classifier-injection-screen/devin/classifier-injection-screen-posttooluse.mjs | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| .opencode/plugins/classifier-injection-screen.js | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/hooks/classifier-injection-screen/pi/classifier-injection-screen.ts | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-luna-codex-1791264733860-t333md, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Severity threshold: [from config.severityThreshold]
- Review target type: spec-folder
- Cross-reference checks: core=[from config.crossReference.core], overlay=[from config.crossReference.overlay]
- Started: 2026-10-06T05:49:40Z
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .skilled/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```
