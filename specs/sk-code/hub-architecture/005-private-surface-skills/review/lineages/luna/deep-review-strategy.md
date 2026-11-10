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

# Deep Review Strategy - Private Surface Skills

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
Review: specs/sk-code/013-private-surface-skills. The review checks the phase-parent contract, five child phases, privacy boundary, local advisor routing, and the implementation surfaces named by the phase plans.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Do not rewrite Git history, publish, push, or alter external repositories.
- Do not change implementation or packet documents; review evidence only.
- Exclude historical records that the parent spec explicitly keeps out of scope unless they are needed to verify a live claim.

---

## 5. STOP CONDITIONS
- Hard ceiling: five iterations. Convergence remains telemetry until the cap.
- Synthesis records stopReason `maxIterationsReached`.
- A scope conflict is documented in the current iteration; packet-root graph upserts are skipped because the write authority is limited to this lineage.

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
- P1 (Required): 1
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Direct reads of packet sources and implementation paths provide checkable file:line evidence without running tests or mutating the review target. (initialization)
- Iteration 1: triangulating parent, goal, and child status fields exposed a phase-completion inconsistency with line-level evidence.
- Iteration 2: tracing trusted roots across TypeScript and Python readers ruled out a static path-prefix escape and exposed the pre-commit type-change filter edge.
- Iteration 3: phase 2's explicit Unmet closure criterion confirmed the parent status finding; sampled phase 5 evidence references matched their quoted outputs.
- Iteration 4: comparing the scanner inventory with the CI workflow exposed a separate derived-freshness root scan and an implicit local-* exclusion.
- Iteration 5: rechecked all active findings, traced retrieval and advisor consumers to their guards, and closed the feature-catalog and playbook protocols without new findings.

---

## 9. WHAT FAILED
- The YAML initialization and loop graph-upsert steps target packet-root graph metadata, outside the lineage write boundary; those steps are excluded and recorded as scope conflicts. (initialization)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A corpus walk through an ignored local skill was not found; the crawler skips ignored entries before inspecting their type. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A corpus walk through an ignored local skill was not found; the crawler skips ignored entries before inspecting their type.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A corpus walk through an ignored local skill was not found; the crawler skips ignored entries before inspecting their type.

### A missing or mismatched evidence pointer in the sampled phase 5 final-tip and corpus-boundary rows was not found. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A missing or mismatched evidence pointer in the sampled phase 5 final-tip and corpus-boundary rows was not found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing or mismatched evidence pointer in the sampled phase 5 final-tip and corpus-boundary rows was not found.

### agent_cross_runtime, feature_catalog_code, and playbook_capability: pending for the final stabilization pass. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: agent_cross_runtime, feature_catalog_code, and playbook_capability: pending for the final stabilization pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: agent_cross_runtime, feature_catalog_code, and playbook_capability: pending for the final stabilization pass.

### agent_cross_runtime: pass — TypeScript and Python canonical-root/relative-path checks agree on containment. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: agent_cross_runtime: pass — TypeScript and Python canonical-root/relative-path checks agree on containment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: agent_cross_runtime: pass — TypeScript and Python canonical-root/relative-path checks agree on containment.

### An untrusted local-link path in the advisor readers or watcher was not found; each delegates to canonical trusted-root checks. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: An untrusted local-link path in the advisor readers or watcher was not found; each delegates to canonical trusted-root checks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: An untrusted local-link path in the advisor readers or watcher was not found; each delegates to canonical trusted-root checks.

### checklist_evidence: fail — phase 2 AC-014 remains Unmet under its explicit closure contract. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: checklist_evidence: fail — phase 2 AC-014 remains Unmet under its explicit closure contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: fail — phase 2 AC-014 remains Unmet under its explicit closure contract.

### checklist_evidence: fail — phase 2's own closeability contract says an Unmet row prevents closure. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: checklist_evidence: fail — phase 2's own closeability contract says an Unmet row prevents closure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: fail — phase 2's own closeability contract says an Unmet row prevents closure.

### checklist_evidence: fail — the phase 2 Unmet closure criterion remains open against parent completion claims. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: checklist_evidence: fail — the phase 2 Unmet closure criterion remains open against parent completion claims.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: fail — the phase 2 Unmet closure criterion remains open against parent completion claims.

### checklist_evidence: partial — goal completion boxes are checked while phase 2 still lists open tasks. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: checklist_evidence: partial — goal completion boxes are checked while phase 2 still lists open tasks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: partial — goal completion boxes are checked while phase 2 still lists open tasks.

### checklist_evidence: partial — the phase 1 success criterion covers staged path refusal, but no tests were run in this review. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: checklist_evidence: partial — the phase 1 success criterion covers staged path refusal, but no tests were run in this review.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: partial — the phase 1 success criterion covers staged path refusal, but no tests were run in this review.

### feature_catalog_code and playbook_capability: pending for stabilization. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: feature_catalog_code and playbook_capability: pending for stabilization.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: feature_catalog_code and playbook_capability: pending for stabilization.

### feature_catalog_code and playbook_capability: pending for the later traceability pass. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: feature_catalog_code and playbook_capability: pending for the later traceability pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: feature_catalog_code and playbook_capability: pending for the later traceability pass.

### feature_catalog_code: pass — the feature catalog describes the public sk-code hub; the exact removed and local surface identifiers are absent, consistent with the decision that `local-*` skills are outside that hub. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: feature_catalog_code: pass — the feature catalog describes the public sk-code hub; the exact removed and local surface identifiers are absent, consistent with the decision that `local-*` skills are outside that hub.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: feature_catalog_code: pass — the feature catalog describes the public sk-code hub; the exact removed and local surface identifiers are absent, consistent with the decision that `local-*` skills are outside that hub.

### Missing local-skill scenarios in the sk-code feature catalog or manual playbook were not established; the packet assigns local routing/invisibility evidence to phase 5 and scopes these docs to the public hub. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Missing local-skill scenarios in the sk-code feature catalog or manual playbook were not established; the packet assigns local routing/invisibility evidence to phase 5 and scopes these docs to the public hub.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing local-skill scenarios in the sk-code feature catalog or manual playbook were not established; the packet assigns local routing/invisibility evidence to phase 5 and scopes these docs to the public hub.

### No implementation conclusion was drawn from research summaries or unchecked source paths. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No implementation conclusion was drawn from research summaries or unchecked source paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No implementation conclusion was drawn from research summaries or unchecked source paths.

### Overlay protocols skill_agent, agent_cross_runtime, feature_catalog_code, and playbook_capability: not evaluated in this correctness pass; reserved for traceability review. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay protocols skill_agent, agent_cross_runtime, feature_catalog_code, and playbook_capability: not evaluated in this correctness pass; reserved for traceability review.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay protocols skill_agent, agent_cross_runtime, feature_catalog_code, and playbook_capability: not evaluated in this correctness pass; reserved for traceability review.

### playbook_capability: pass — the manual playbook covers live sk-code scenarios; the exact removed and local surface identifiers are absent, while phase 5 owns the private-skill routing and invisibility proofs. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: playbook_capability: pass — the manual playbook covers live sk-code scenarios; the exact removed and local surface identifiers are absent, while phase 5 owns the private-skill routing and invisibility proofs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: playbook_capability: pass — the manual playbook covers live sk-code scenarios; the exact removed and local surface identifiers are absent, while phase 5 owns the private-skill routing and invisibility proofs.

### scope_boundary: conflict — graph metadata upserts and resource-map emission target paths outside the lineage write boundary and remain skipped. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: scope_boundary: conflict — graph metadata upserts and resource-map emission target paths outside the lineage write boundary and remain skipped.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: scope_boundary: conflict — graph metadata upserts and resource-map emission target paths outside the lineage write boundary and remain skipped.

### skill_agent and agent_cross_runtime: partial — TypeScript and Python containment checks use equivalent canonical-path and relative-boundary logic. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: skill_agent and agent_cross_runtime: partial — TypeScript and Python containment checks use equivalent canonical-path and relative-boundary logic.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent and agent_cross_runtime: partial — TypeScript and Python containment checks use equivalent canonical-path and relative-boundary logic.

### skill_agent and agent_cross_runtime: partial — TypeScript and Python containment helpers are similar, but generators maintain separate root enumerators. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: skill_agent and agent_cross_runtime: partial — TypeScript and Python containment helpers are similar, but generators maintain separate root enumerators.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent and agent_cross_runtime: partial — TypeScript and Python containment helpers are similar, but generators maintain separate root enumerators.

### skill_agent: partial — the focused search found no removed surface identifiers in the sk-code skill guide or graph metadata; broader mapping checks remain. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: skill_agent: partial — the focused search found no removed surface identifiers in the sk-code skill guide or graph metadata; broader mapping checks remain.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent: partial — the focused search found no removed surface identifiers in the sk-code skill guide or graph metadata; broader mapping checks remain.

### skill_agent: pass — advisor metadata readers use the shared trusted-link and scan-eligibility helpers. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: skill_agent: pass — advisor metadata readers use the shared trusted-link and scan-eligibility helpers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent: pass — advisor metadata readers use the shared trusted-link and scan-eligibility helpers.

### spec_code: fail — the parent and goal claim completion while phase 2 AC-014 remains Unmet. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: spec_code: fail — the parent and goal claim completion while phase 2 AC-014 remains Unmet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: fail — the parent and goal claim completion while phase 2 AC-014 remains Unmet.

### spec_code: fail — the phase 3 inventory omits a workflow-invoked skill-root gate. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: spec_code: fail — the phase 3 inventory omits a workflow-invoked skill-root gate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: fail — the phase 3 inventory omits a workflow-invoked skill-root gate.

### spec_code: fail — the phase 3 scan inventory omits a workflow-invoked root scan. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: spec_code: fail — the phase 3 scan inventory omits a workflow-invoked root scan.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: fail — the phase 3 scan inventory omits a workflow-invoked root scan.

### spec_code: partial — the parent status and child phase 2 task state disagree. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: spec_code: partial — the parent status and child phase 2 task state disagree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: partial — the parent status and child phase 2 task state disagree.

### spec_code: partial — the phase 1 guard's status filter leaves an unexamined type-change edge. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: spec_code: partial — the phase 1 guard's status filter leaves an unexamined type-change edge.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: partial — the phase 1 guard's status filter leaves an unexamined type-change edge.

### Static path-prefix escape caused by differing TypeScript and Python relative-path rules was not found. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Static path-prefix escape caused by differing TypeScript and Python relative-path rules was not found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Static path-prefix escape caused by differing TypeScript and Python relative-path rules was not found.

### Trusted-root prefix escape through a sibling path was checked in both runtime helpers and not found; they compare relative paths rather than string prefixes. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Trusted-root prefix escape through a sibling path was checked in both runtime helpers and not found; they compare relative paths rather than string prefixes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Trusted-root prefix escape through a sibling path was checked in both runtime helpers and not found; they compare relative paths rather than string prefixes.

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
- Ignored corpus traversal of local skills — `corpus.mjs` checks ignored membership before following links or descending (iteration 5, evidence: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:275-280`).
- Untrusted local-skill link in advisor readers or watcher — Python and TypeScript consumers use canonical trusted-root containment (iteration 5, evidence: `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:155-208`, `.skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts:197-206`).
- Missing local-skill protocols in hub catalog/playbook — exact identifiers are absent consistently with D1/D6 and phase 5's ownership of local proof (iteration 5, evidence: `specs/sk-code/013-private-surface-skills/spec.md:62-83`).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: synthesis - Focus area: consolidate active findings and record the max-iteration stop reason. - Reason: maxIterations is five; convergence remains telemetry and does not stop this run early. - Rotation status: complete - Blocked/productive carry-forward: graph and resource-map writes remain outside the lineage boundary; keep the scope conflict visible. - Required evidence: five iteration records, active registry, dashboard, and review report.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
The packet goal is to keep Webflow and Obsidian surfaces out of tracked sk-code outputs while allowing only operator-local routing. The parent spec establishes frozen decisions D1-D7 and five ordered phases. Existing research is pointer material only; every carried claim must be rechecked against current files.

### Bounded Context Snapshot

Bounded context snapshot, scoped to the declared review target:

- Target pointers: parent `spec.md` and `goal.md`; child specs, plans, tasks and acceptance criteria in phases 001-005; `.gitignore`, the pre-commit guard, advisor graph scan/compiler/Python reader, Hermes sync, and retrieval corpus/index surfaces named in the packet.
- Behavior claims: root decisions D1-D7, phase transition order, phase task verification, and phase 5's fresh-clone and local-routing proofs.
- Reuse and conventions: root ignore rules, eight-root pre-commit guard, `local-*` symlink containment, tracked-output filtering, and generated-artifact freshness.
- Review risks and gaps: parent/child status drift, proof commands that can return false zero, private bytes crossing tracked-output boundaries, and path-level scope limits. Packet-root graph mutation is excluded by the lineage boundary.

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
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10 (telemetry only under max-iterations)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-luna-1792944728998-cwb2cp, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-10-25T16:21:21Z
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
