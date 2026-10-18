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
commit b6eef4ebbb on branch worktrees/126-drift-guard-tolerance: the router-sync existence filter, archived-gold skip and first-map anchor, the registry-derived doc-claims surface count with its allowlist row, their four tests, the scripts README row, the sk-code-skilled 1.2.4.0 release with its Hermes copy, and the phase spec docs.

Dimensions, risk-ordered: correctness, security, traceability, maintainability. Max iterations 5, convergence threshold 0.1, stop policy max-iterations.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- The doc-claims `paths` check and the `webflow|opencode|animation` prose prefix list (out of scope in spec.md).
- A minted surface discriminator or a fixture hub for the surface-hint test (rejected X20, X24).
- Files outside commit b6eef4ebbb and the phase spec docs, except as cross-references.

---

## 5. STOP CONDITIONS
- Five iterations (stop policy max-iterations; convergence is telemetry only).

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
- P2 (Suggestions): 9
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Direct read of both guard scripts against the commit diff pinned every changed hunk to its spec decision (D1-D4) and to a concrete failure or pass mode (iteration 1)
- Heading-list arithmetic on leg 1a's first-map regex against ROUTER.md proved pristine start-offset parity with the removed literal anchor without rerunning tests (iteration 1)
- Hub-wide grep of the surface-count vocabulary proved no new failures on the pristine tree and validated that the allowlist substring matches agent-authoring.md:43 (iteration 1)
- A commit-wide prose sweep for the old rule vocabulary (three-surface, two surfaces) separated the updated assets README row from two stale live descriptions, proving a same-class fix left two of three sites behind (iteration 3)
- Diffing the .hermes mirror against the canonical SKILL.md isolated the generated banner as the only divergence, confirming the mirror is faithful and any doc fix must go through the generator (iteration 3)
- Reading the guard test files end to end against the changed behavior separated the tested registry-count rule (verify-doc-claims.test.cjs:227) from the new surfaces allowlist row that no fixture writes, isolating the one new behavior without regression coverage (iteration 4)
- A hygiene sweep over both guard scripts and both test files for spec paths, REQ/AC/CHK ids and finding ids returned nothing, confirming the changed comments keep only the durable why (iteration 4)

---

## 9. WHAT FAILED
- Build/test tooling is outside this iteration's containment, so T1-T4 before/after exits were verified from the committed test sources instead of re-observed; no defect was implied (iteration 1)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Leg 1a first-map anchor regression: pristine first match is `## 4. WEBFLOW MAP` at the removed literal's offset; no-map hubs fail closed; T3 covers removal (iteration 1, evidence: verify-router-sync.cjs:129)
- Leg 2 on-disk filter false pass: a parent map citing a dropped packet falls to ownedLeaf and fails when the regenerated manifest lacks the mode (iteration 1, evidence: verify-router-sync.cjs:224)
- Leg 3 skip breadth: ORPHAN_WORKFLOW_MODE covers every undeclared mode; accepted residual risk per goal D2/spec.md risk row, declared-mode PACKET_MISMATCH still fails (iteration 1, evidence: leaf-resource-contract.cjs:457)
- Doc-claims allowlist inertness: the live line contains the lowercase allowlist substring, so the row matches (iteration 1, evidence: agent-authoring.md:43)
- Cross-runtime divergence: the .hermes copy differs from canonical only by its generated banner; both carry version 1.2.4.0 (iteration 3, evidence: .hermes/skills/sk-code-skilled/SKILL.md)
- Playbook capability drift: OC-008's expected_resources both exist and its guard list matches the shipped wrapper (iteration 3, evidence: manual-testing-playbook/authoring-verification/verification-alignment.md)
- Stale version references: 1.2.3.0 appears only inside its own changelog file (iteration 3, evidence: .skilled/skills/sk-code/sk-code-skilled/changelog/v1.2.3.0.md)
- Commit-metadata traceability: the commit carries the required Spec: trailer, no Co-Authored-By line, and exactly one new changelog file (iteration 3, evidence: git show -s --format=%B b6eef4ebbb)
- Comment-hygiene violation in the changed guards and tests: sweep found no spec paths, REQ/AC/CHK ids or finding ids; each new comment states why (iteration 4, evidence: verify-doc-claims.cjs:42-44, verify-router-sync.cjs:31)
- ORPHAN_WORKFLOW_MODE magic-string coupling: the contract string is a bare literal at leaf-resource-contract.cjs:457, but the leg 3 test at verify-router-sync.test.cjs:146 exercises the skip and fails closed on a rename (iteration 4)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Research 025 section 14 R2 and findings F83, F85, F94, F95, F96 define the change. The builder verified: T1 to T4 fail before and pass after; the live wrapper exits 0 with unchanged per-check results; in a scratch copy after the removal recipe router-sync passes 5/5, also with the Webflow prose map removed, while the HEAD guard fails checks 2 and 3 (and 1a without the map).

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
| `spec_code` | core | partial | 3 | REQ-001-006 and D1-D6 map to the eight changed files; spec.md:86-95 omits assets/scripts/README.md and the generated Hermes copy (R3-P2-001); Spec trailer and changelog verified |
| `checklist_evidence` | core | partial | 3 | T001-T012, checklists and AC rows still pending (expected pre-T012); REQ-006's doctor clause has no AC expression of its own (R3-P2-003) |
| `skill_agent` | overlay | pass | 3 | No agent definition references the packet; the skill's own frontmatter contract is intact and version-consistent |
| `agent_cross_runtime` | overlay | pass | 3 | .hermes mirror differs only by its generated banner; both copies 1.2.4.0; the stale sentence at .hermes :180 mirrors canonical :175 (R3-P2-002) |
| `feature_catalog_code` | overlay | notApplicable | 3 | No feature catalog artifact exists for this surface (skill root and benchmark/ hold none) |
| `playbook_capability` | overlay | pass | 3 | OC-008 expected_resources exist and its guard capability list matches the shipped wrapper |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .hermes/skills/sk-code-skilled/SKILL.md | D1+D3 | 3 | 0 P0, 0 P1, 1 P2 (mirrored R3-P2-002) | reviewed |
| .skilled/skills/sk-code/sk-code-skilled/SKILL.md | D1+D3 | 3 | 0 P0, 0 P1, 1 P2 (R3-P2-002) | reviewed |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/README.md | D1+D3 | 3 | 0 P0, 0 P1, 0 P2 (updated row verified) | reviewed |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs | D1 | 1 | 0 P0, 0 P1, 2 P2 | reviewed |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs | D1 | 1 | 0 P0, 0 P1, 0 P2 | reviewed |
| .skilled/skills/sk-code/sk-code-skilled/changelog/v1.2.4.0.md | D1 | 1 | 0 P0, 0 P1, 0 P2 | reviewed |
| .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs | D1 | 1 | 0 P0, 0 P1, 0 P2 | reviewed |
| .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs | D1 | 1 | 0 P0, 0 P1, 0 P2 | reviewed |
| specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/003-example-tolerant-drift-guards/acceptance-criteria.md | D1+D3 | 3 | 0 P0, 0 P1, 1 P2 (R3-P2-003) | reviewed |
| specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/003-example-tolerant-drift-guards/goal.md | D1+D3 | 3 | 0 P0, 0 P1, 0 P2 | reviewed |
| specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/003-example-tolerant-drift-guards/plan.md | D1+D3 | 3 | 0 P0, 0 P1, 1 P2 (R3-P2-001) | reviewed |
| specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/003-example-tolerant-drift-guards/spec.md | D1+D3 | 3 | 0 P0, 0 P1, 1 P2 (R3-P2-001), 1 P2 (R3-P2-003) | reviewed |
| specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/003-example-tolerant-drift-guards/tasks.md | D1+D3 | 3 | 0 P0, 0 P1, 0 P2 | reviewed |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-10-13T05:58:44.591Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: [timestamp]
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

resource-map.md not present; skipping coverage gate
