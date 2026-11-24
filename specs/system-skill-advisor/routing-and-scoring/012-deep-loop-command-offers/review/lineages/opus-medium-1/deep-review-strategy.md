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
version: 1.11.1.0
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
Review: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers (spec-folder). Operator focus: the deep-loop offer gate in command-attach.ts and the Python fallback in skill_advisor.py, plus the typed-command hint from packet 013.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Not re-running the routing-accuracy corpus or rebuilding dist.
- Not reviewing advisor code outside the 32 scope files.
- No fixes: findings only.

---

## 5. STOP CONDITIONS
- stopPolicy=max-iterations: run all 5 iterations; convergence is telemetry only.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 3
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Loading command-attach.ts through a type-stripping resolve hook to probe the gate on real prompts (iteration 1)

---
- Timing probes with repeated led namings exposed the per-occurrence rescan (iteration 2)
- Reading the packet's own hook capture (fresh-review-hook.txt) confirmed end-to-end behaviour (iteration 3)
- Differential TS-vs-Python run on fresh prompts (0 drift) plus guard-coverage read (iteration 4)
- Probing deferred vs routed paths with mixed mode cues (iteration 5)

## 9. WHAT FAILED
- Loading advisor-recommend.ts the same way fails (TS-only syntax); fell back to direct read (iteration 1)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A depth word lifting the hub at stage one: no depth word sits in the loop rule's alternations. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A depth word lifting the hub at stage one: no depth word sits in the loop rule's alternations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A depth word lifting the hub at stage one: no depth word sits in the loop rule's alternations.

### Dead code in the gate: every exported predicate has a caller in attachCommand, deferredLoopCommand or the advisor scorer. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Dead code in the gate: every exported predicate has a caller in attachCommand, deferredLoopCommand or the advisor scorer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Dead code in the gate: every exported predicate has a caller in attachCommand, deferredLoopCommand or the advisor scorer.

### Prompt injection into the brief head through the command label: the label is built from known command keys only. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Prompt injection into the brief head through the command label: the label is built from known command keys only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prompt injection into the brief head through the command label: the label is built from known command keys only.

### Routed research mode attaching `/deep:research` to "run 5 review iterations": this depends on the router picking research for a review-named prompt, which I did not observe. Not reported. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Routed research mode attaching `/deep:research` to "run 5 review iterations": this depends on the router picking research for a review-named prompt, which I did not observe. Not reported.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Routed research mode attaching `/deep:research` to "run 5 review iterations": this depends on the router picking research for a review-named prompt, which I did not observe. Not reported.

### Typed head showing options in Python-fallback mode: the fallback carries no deep command row on these prompts, so no options render. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Typed head showing options in Python-fallback mode: the fallback carries no deep command row on these prompts, so no options render.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Typed head showing options in Python-fallback mode: the fallback carries no deep command row on these prompts, so no options render.

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
- Synthesis (max iterations reached) Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
resource-map.md not present; skipping coverage gate. Prior review generations exist under review-archive/ (not read as evidence for this lineage).

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
| .skilled/changelog/skilled/v4.2.0.0.md | - | - | - | pending |
| .skilled/commands/deep/assets/deep-research-presentation.txt | - | - | - | pending |
| .skilled/commands/deep/assets/deep-review-presentation.txt | - | - | - | pending |
| .skilled/commands/deep/research.md | - | - | - | pending |
| .skilled/commands/deep/review.md | - | - | - | pending |
| .skilled/hooks/injection-contract.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/render.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/command-brief-golden.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/command-head-length.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/render-child-session.vitest.ts | - | - | - | pending |
| specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md | - | - | - | pending |
| specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md | - | - | - | pending |
| specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md | - | - | - | pending |
| specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/plan.md | - | - | - | pending |
| specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md | - | - | - | pending |
| specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md | - | - | - | pending |
| specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/implementation-summary.md | - | - | - | pending |
| specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/plan.md | - | - | - | pending |
| specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/spec.md | - | - | - | pending |
| specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/tasks.md | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-opus-medium-1-1795495423434-9mvwzq, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-11-24T04:45:00Z
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
