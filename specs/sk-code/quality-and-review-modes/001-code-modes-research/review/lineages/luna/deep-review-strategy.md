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
specs/sk-code/014-code-modes-research and both completed research phases

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
No implementation, tests, benchmarks, or changes to the reviewed target. Shared graph, merge, and repository-level writes are outside the lineage boundary.

---

## 5. STOP CONDITIONS
Run all five iterations even if convergence is reached earlier. Stop only for a gateway or reducer integrity failure that cannot be repaired within three attempts.

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
- P1 (Required): 2
- P2 (Suggestions): 3
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it worked] (iteration N)

---

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it failed] (iteration N)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### checklist_evidence: deferred to the security and traceability passes. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: checklist_evidence: deferred to the security and traceability passes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: deferred to the security and traceability passes.

### checklist_evidence: partial from earlier findings; status, containment, and cleanup documentation remain open. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: checklist_evidence: partial from earlier findings; status, containment, and cleanup documentation remain open.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: partial from earlier findings; status, containment, and cleanup documentation remain open.

### checklist_evidence: partial; the closure sections say all criteria are met, but metadata does not express that state. Individual command evidence was not rerun. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: checklist_evidence: partial; the closure sections say all criteria are met, but metadata does not express that state. Individual command evidence was not rerun.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: partial; the closure sections say all criteria are met, but metadata does not express that state. Individual command evidence was not rerun.

### checklist_evidence: partial. The checked P0 criterion and its evidence use incompatible write boundaries; no path-level evidence reconciles them. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: checklist_evidence: partial. The checked P0 criterion and its evidence use incompatible write boundaries; no path-level evidence reconciles them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: partial. The checked P0 criterion and its evidence use incompatible write boundaries; no path-level evidence reconciles them.

### checklist_evidence: the cleanup task and the summary conflict; the current path check supports CHK-050 and leaves the summary stale. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: checklist_evidence: the cleanup task and the summary conflict; the current path check supports CHK-050 and leaves the summary stale.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: the cleanup task and the summary conflict; the current path check supports CHK-050 and leaves the summary stale.

### No external graph or resource-map state was used; graphless fallback remains active. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No external graph or resource-map state was used; graphless fallback remains active.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No external graph or resource-map state was used; graphless fallback remains active.

### Overlay protocols: deferred until the packet cross-reference pass; the spec packet contains no agent/runtime implementation change. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay protocols: deferred until the packet cross-reference pass; the spec packet contains no agent/runtime implementation change.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay protocols: deferred until the packet cross-reference pass; the spec packet contains no agent/runtime implementation change.

### Overlay protocols: no code or agent/runtime change is in this research packet; applicability remains unproven for this documentation review. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Overlay protocols: no code or agent/runtime change is in this research packet; applicability remains unproven for this documentation review.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay protocols: no code or agent/runtime change is in this research packet; applicability remains unproven for this documentation review.

### Overlay protocols: skill_agent, agent_cross_runtime, feature_catalog_code, and playbook_capability are not applicable to this research-only packet because it changes no agent, runtime implementation, feature catalog, or playbook. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Overlay protocols: skill_agent, agent_cross_runtime, feature_catalog_code, and playbook_capability are not applicable to this research-only packet because it changes no agent, runtime implementation, feature catalog, or playbook.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay protocols: skill_agent, agent_cross_runtime, feature_catalog_code, and playbook_capability are not applicable to this research-only packet because it changes no agent, runtime implementation, feature catalog, or playbook.

### Scope authorization: the parent spec expressly permits bounded spec.md edits, so this review found a checklist wording/evidence defect, not proof of an unauthorized write. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Scope authorization: the parent spec expressly permits bounded spec.md edits, so this review found a checklist wording/evidence defect, not proof of an unauthorized write.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Scope authorization: the parent spec expressly permits bounded spec.md edits, so this review found a checklist wording/evidence defect, not proof of an unauthorized write.

### spec_code: partial; both child phases align with the parent phase map, while the goal-count drift from R1-P1-001 remains. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: spec_code: partial; both child phases align with the parent phase map, while the goal-count drift from R1-P1-001 remains.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: partial; both child phases align with the parent phase map, while the goal-count drift from R1-P1-001 remains.

### spec_code: partial. Goal D4 and the actual executor schedule disagree; the phase ADRs and summaries agree on the recorded deviation. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: spec_code: partial. Goal D4 and the actual executor schedule disagree; the phase ADRs and summaries agree on the recorded deviation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: partial. Goal D4 and the actual executor schedule disagree; the phase ADRs and summaries agree on the recorded deviation.

### spec_code: partial. The three parent/child goal-to-spec comparisons expose count drift; no implementation code is in this research-only packet. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: spec_code: partial. The three parent/child goal-to-spec comparisons expose count drift; no implementation code is in this research-only packet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: partial. The three parent/child goal-to-spec comparisons expose count drift; no implementation code is in this research-only packet.

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
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Pointer-based snapshot below covers parent scope, two child phases, their specs, goals, acceptance criteria, decision records, summaries, and research outputs.

### Bounded Context Snapshot

Bounded context snapshot:

- Target pointers: `spec.md`, `goal.md`, and the `001-quality-mode-research` and `002-review-mode-research` child packets, including their `research/research.md` outputs and state logs.
- Behavior claims: both phases are complete with fifteen iterations; ADR-002 amended the original ten-iteration run; acceptance criteria are reported met.
- Reuse and conventions: parent/child spec rules, acceptance-criteria status vocabulary, and the two phases’ decision records.
- Review risks and gaps: goals retain ten-iteration completion gates; security checklist evidence admits bounded `spec.md` writes; metadata and one known-limitation note may be stale. No implementation code or tests are part of this packet.


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
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| Parent and both child spec packets | correctness, security, traceability, maintainability | none | 0 | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-luna-1792944728998-jpqv4b, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-10-25T16:25:02Z
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
