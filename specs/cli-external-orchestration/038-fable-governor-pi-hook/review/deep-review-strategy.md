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
Spec-folder review of the current governor-parity, Pi directive, bounded-dispatch, authorization, runtime/factory-test, metadata, and injection-contract surfaces represented by .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [x] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [x] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS
Implementing fixes, changing reviewed source/spec files, or widening beyond the declared packet and current governor-related working-tree surfaces.

---

## 5. STOP CONDITIONS
Stop at maxIterations, unrecoverable state/dispatch failure, or any output contract failure; preserve all review targets as read-only.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
[None yet -- populated as iterations complete dimension reviews]

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| [D1 Correctness] | [FAIL] | [1] | [P1: quoted executor forms bypass the Pi dispatch inspection boundary.] |
| [D2 Security] | [FAIL] | [2] | [P1: receipt MAC authentication and dirty-path attribution remain unresolved.] |
| [D3 Traceability] | [FAIL] | [3] | [P1: completion status reconciliation omits open plan criteria and a failing strict gate.] |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 4 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +1 P1, +0 P2

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it worked] (iteration N)

---

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it failed] (iteration N)

---

## 10. EXHAUSTED APPROACHES (do not retry)
[Populated when a review approach has been tried from multiple angles without yielding new findings]

### [Category Name] -- BLOCKED (iteration N, N attempts)
- What was tried: [specific review approaches attempted]
- Why blocked: [root cause of exhaustion]
- Do NOT retry: [explicit prohibition]

### [Category Name] -- PRODUCTIVE (iteration N)
- What worked: [successful review approaches in this category]
- Prefer for: [related dimensions where this category may help]

---

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

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
 Dimension: maintainability
 Focus: documentation integrity, status-authority clarity, and safe follow-on change cost across the reviewed packet.
 Reason: correctness, security, and traceability have active P1 findings; the next pivot is maintainability without re-entering swept runtime directions.
<!-- MACHINE-OWNED: END -->

## Iteration 1 Update

- What worked: direct source tracing from shell tokenization through Pi preflight isolated a concrete authorization bypass; existing tests cover transform order and session capture but not quoted executable tokens.
- What failed: the current dispatch corpus does not exercise shell-equivalent quoted executor forms, so the regression is invisible to the focused suite.
- Ruled out: raw-input capture, transform-order handling, and session-mismatch denial remained conservative in the reviewed paths and corresponding factory tests.

---

## 13. KNOWN CONTEXT
Memory context unavailable in this runtime; prior review packet was archived under review-archive/20260805T073738Z. Use only cited files and current state.

// DECISION: Keep the explicitly requested cli-codex executor for subsequent iterations; accept a containment event only when verify-iteration passes, because the runtime guard reverts and records the out-of-scope writes and the leaf's review artifacts remain mechanically complete.
// DECISION: Skip the false-positive step_marker_scan for this direct leaf iteration; the rendered prompt is the required single-review prompt, not a nested phase-running loop.
// DECISION: Run graphless for this lineage; both canonical graph scripts fail on the installed Node/native-module ABI, and stopPolicy=max-iterations makes graph telemetry non-gating.

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
Scope resolved from the archived matching packet and validated against current file existence; review excludes generated review artifacts.

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |
|  | none | -- | 0 | pending |

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.05
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=review-1785915676506, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[from config.crossReference.core], overlay=[from config.crossReference.overlay]
- Started: 2026-08-05T07:41:16.505Z
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .opencode/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .opencode/skills/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] traceability
- [ ] maintainability

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 3
- P2 (Suggestions): 0
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Core / checklist_evidence: partial — existing focused receipts cover transform order and session mismatch; they do not cover the discovered parser false negative. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Core / checklist_evidence: partial — existing focused receipts cover transform order and session mismatch; they do not cover the discovered parser false negative.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core / checklist_evidence: partial — existing focused receipts cover transform order and session mismatch; they do not cover the discovered parser false negative.

### Core / spec_code: partial — Phase 006 covers raw capture and authorization matrices, but the quoted-executor equivalence class is absent. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Core / spec_code: partial — Phase 006 covers raw capture and authorization matrices, but the quoted-executor equivalence class is absent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core / spec_code: partial — Phase 006 covers raw capture and authorization matrices, but the quoted-executor equivalence class is absent.

### Core `checklist_evidence`: partial. The receipt test documents advisory MAC behavior; no in-scope evidence establishes content-level protection for pre-existing dirty paths. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Core `checklist_evidence`: partial. The receipt test documents advisory MAC behavior; no in-scope evidence establishes content-level protection for pre-existing dirty paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `checklist_evidence`: partial. The receipt test documents advisory MAC behavior; no in-scope evidence establishes content-level protection for pre-existing dirty paths.

### Core `spec_code`: partial. The packet traces Pi authorization and dispatch-validation evidence, but does not state a fail-closed receipt-authentication or dirty-path containment requirement. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Core `spec_code`: partial. The packet traces Pi authorization and dispatch-validation evidence, but does not state a fail-closed receipt-authentication or dirty-path containment requirement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `spec_code`: partial. The packet traces Pi authorization and dispatch-validation evidence, but does not state a fail-closed receipt-authentication or dirty-path containment requirement.

### Overlay / agent_cross_runtime: deferred to a later dimension. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay / agent_cross_runtime: deferred to a later dimension.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay / agent_cross_runtime: deferred to a later dimension.

### Overlay / feature_catalog_code: not applicable. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay / feature_catalog_code: not applicable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay / feature_catalog_code: not applicable.

### Overlay / playbook_capability: not applicable. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay / playbook_capability: not applicable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay / playbook_capability: not applicable.

### Overlay / skill_agent: not applicable in this correctness pivot. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay / skill_agent: not applicable in this correctness pivot.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay / skill_agent: not applicable in this correctness pivot.

### Overlay `agent_cross_runtime`: deferred. The receipt key is process-local and cross-process authenticity is not established. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Overlay `agent_cross_runtime`: deferred. The receipt key is process-local and cross-process authenticity is not established.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `agent_cross_runtime`: deferred. The receipt key is process-local and cross-process authenticity is not established.

### Overlay `feature_catalog_code`: not applicable to this security slice. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Overlay `feature_catalog_code`: not applicable to this security slice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `feature_catalog_code`: not applicable to this security slice.

### Overlay `playbook_capability`: partial; the reviewed implementation has security behavior not covered by the current packet evidence. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Overlay `playbook_capability`: partial; the reviewed implementation has security behavior not covered by the current packet evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `playbook_capability`: partial; the reviewed implementation has security behavior not covered by the current packet evidence.

### Overlay `skill_agent`: pass. The advisor renderer and bridge use sanitized typed labels and fixed directives. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Overlay `skill_agent`: pass. The advisor renderer and bridge use sanitized typed labels and fixed directives.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `skill_agent`: pass. The advisor renderer and bridge use sanitized typed labels and fixed directives.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
traceability

<!-- /ANCHOR:next-focus -->

## Iteration 2 Update

- Security review completed with two new P1 findings: receipt MAC authenticity is advisory at the route-proof validator, and dirty-path containment aliases pre-existing paths by name.
- The prior R1-P1-001 remains active with its typed adjudication packet recorded in the iteration state.
- Advisor prompt injection, receipt-secret exposure, and unsafe receipt deserialization were ruled out on the reviewed paths.
- Graph coverage remains graphless_fallback; next focus is traceability and contract reconciliation, including the explicit containment fail-open policy.
