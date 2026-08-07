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
Review: .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS
- Do not modify reviewed source, tests, contracts, or packet documents.
- Do not broaden beyond the declared packet and named governor/Pi dispatch surfaces.
- Do not treat prior completion prose or dirty-worktree state as proof without direct evidence.

## 5. STOP CONDITIONS
- Continue through the configured 10 iterations because stop policy is max-iterations.
- Synthesize after the ceiling or an unrecoverable workflow error.
- Preserve active P0/P1 findings and failed quality gates as terminal evidence.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
[None yet -- populated as iterations complete dimension reviews]

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| [D1 Correctness] | FAIL | 1 | Three P1 findings: over-limit dispatch bypass, unquoted echo false positive, and path-only containment baseline. |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 3 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +3 P1, +0 P2

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
[First iteration -- populated after iteration 1 completes]
- Direct source tracing plus a targeted inspector probe exposed the over-limit authorization bypass. (iteration 1)
- Reading the Pi factory tests against the shared matcher separated covered transform-order behavior from untested command-shape cases. (iteration 1)

---

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
- The bounded inspector treats over-limit input as none, so the authorization consumer cannot distinguish an unverified dispatch. (iteration 1)
- The negative-control suite covers quoted echo but not unquoted echo, leaving a false-positive path. (iteration 1)
- Path-only dirty-state subtraction does not detect changes to paths that were already dirty. (iteration 1)

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
<!-- MACHINE-OWNED: START -->
- Completed pivots: 1
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: security fail-open and receipt/containment failure paths
<!-- MACHINE-OWNED: END -->

---

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
- Dimension: security
- Focus: authorization bypasses, fail-open boundaries, receipt integrity, and containment failure paths.
- Reason: correctness review found three P1 boundary failures requiring security-oriented follow-up.
- Rotation status: queued
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT
- Startup context reported no cached continuity and the code graph was unavailable.
- The packet contains nine phase children covering research, governor parity, Pi directive injection/enforcement, AGENTS.md parity, dispatch authorization, validation evidence, metadata reconciliation, and injection-contract synchronization.
- Review scope includes all packet files plus the named dispatch, advisor, runtime, Pi, contract, and test surfaces.
- Resource-map coverage is skipped because .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/resource-map.md was absent at initialization.
- Working-tree evidence is uncommitted and must be treated as a freshness caveat, not as proof of completion.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 1 | REQ-005 and the containment invariant are contradicted by observed boundary behavior. |
| `checklist_evidence` | core | partial | 1 | Focused tests omit padded dispatch, unquoted echo, and pre-existing dirty-path mutation. |
| `skill_agent` | overlay | notApplicable | 1 | Not part of this correctness pivot. |
| `agent_cross_runtime` | overlay | partial | 1 | Shared matcher is cross-runtime, but only Pi consumption was exercised. |
| `feature_catalog_code` | overlay | notApplicable | 1 | No feature-catalog behavior was required for this pivot. |
| `playbook_capability` | overlay | partial | 1 | Codex hook installation check reports missing and orphaned entries. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .opencode/hooks/dispatch/lib/dispatch-audit.mjs | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/hooks/dispatch/pi/dispatch-audit.ts | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/hooks/injection-contract.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/skills/system-deep-loop/runtime/tests/unit/dispatch-failure.vitest.ts | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/skills/system-deep-loop/runtime/tests/unit/dispatch-receipts.vitest.ts | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/skills/system-deep-loop/runtime/tests/unit/post-dispatch-receipt-validator.vitest.ts | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/skills/system-deep-loop/runtime/tests/unit/post-dispatch-validate.vitest.ts | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/skills/system-skill-advisor/README.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/skills/system-skill-advisor/changelog/v0.11.0.0.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/skills/system-skill-advisor/leaf-manifest.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/skills/system-skill-advisor/mcp-server/tests/compat/plugin-bridge.vitest.ts | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/skills/system-skill-advisor/mcp-server/tests/embedders/shared-factory-parity.vitest.ts | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/skills/system-skill-advisor/mcp-server/tests/handlers/skill-graph-dispatch.vitest.ts | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/skills/system-skill-advisor/mcp-server/tests/hooks/prompt-advisor.vitest.ts | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/skills/system-spec-kit/constitutional/fable-governor.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/001-research/checklist.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/001-research/description.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/001-research/evidence/iterations.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/001-research/evidence/synthesis.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/001-research/graph-metadata.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/001-research/implementation-summary.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/001-research/plan.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/001-research/scratch/.gitkeep | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/001-research/spec.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/001-research/tasks.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/002-governor-parity/description.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/002-governor-parity/graph-metadata.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/002-governor-parity/implementation-summary.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/002-governor-parity/plan.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/002-governor-parity/scratch/.gitkeep | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/002-governor-parity/spec.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/002-governor-parity/tasks.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/003-pi-directive-capsule/description.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/003-pi-directive-capsule/graph-metadata.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/003-pi-directive-capsule/implementation-summary.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/003-pi-directive-capsule/plan.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/003-pi-directive-capsule/scratch/.gitkeep | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/003-pi-directive-capsule/spec.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/003-pi-directive-capsule/tasks.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/004-pi-directive-enforcement/description.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/004-pi-directive-enforcement/graph-metadata.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/004-pi-directive-enforcement/implementation-summary.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/004-pi-directive-enforcement/plan.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/004-pi-directive-enforcement/scratch/.gitkeep | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/004-pi-directive-enforcement/spec.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/004-pi-directive-enforcement/tasks.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/005-agents-md-pi-row/description.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/005-agents-md-pi-row/graph-metadata.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/005-agents-md-pi-row/implementation-summary.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/005-agents-md-pi-row/plan.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/005-agents-md-pi-row/scratch/.gitkeep | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/005-agents-md-pi-row/spec.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/005-agents-md-pi-row/tasks.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/006-dispatch-authorization-hardening/checklist.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/006-dispatch-authorization-hardening/description.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/006-dispatch-authorization-hardening/graph-metadata.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/006-dispatch-authorization-hardening/implementation-summary.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/006-dispatch-authorization-hardening/plan.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/006-dispatch-authorization-hardening/scratch/.gitkeep | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/006-dispatch-authorization-hardening/spec.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/006-dispatch-authorization-hardening/tasks.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/007-dispatch-validation-evidence/checklist.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/007-dispatch-validation-evidence/description.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/007-dispatch-validation-evidence/evidence/command-receipts.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/007-dispatch-validation-evidence/evidence/full-corpus-baseline.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/007-dispatch-validation-evidence/graph-metadata.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/007-dispatch-validation-evidence/implementation-summary.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/007-dispatch-validation-evidence/plan.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/007-dispatch-validation-evidence/scratch/.gitkeep | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/007-dispatch-validation-evidence/spec.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/007-dispatch-validation-evidence/tasks.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/008-phase-state-reconciliation/checklist.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/008-phase-state-reconciliation/description.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/008-phase-state-reconciliation/graph-metadata.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/008-phase-state-reconciliation/implementation-summary.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/008-phase-state-reconciliation/plan.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/008-phase-state-reconciliation/scratch/.gitkeep | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/008-phase-state-reconciliation/spec.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/008-phase-state-reconciliation/tasks.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/009-injection-contract-directive-sync/checklist.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/009-injection-contract-directive-sync/description.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/009-injection-contract-directive-sync/graph-metadata.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/009-injection-contract-directive-sync/implementation-summary.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/009-injection-contract-directive-sync/plan.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/009-injection-contract-directive-sync/scratch/.gitkeep | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/009-injection-contract-directive-sync/spec.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/009-injection-contract-directive-sync/tasks.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/description.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/graph-metadata.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/spec.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .pi/PLUGINS.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .pi/SYNC.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .pi/automode.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .pi/extensions/README.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .pi/settings.json | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| AGENTS.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
<!-- MACHINE-OWNED: END -->
## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.05
- Stop policy: max-iterations
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=019fd07b-c9d7-7a7c-8529-45748f016d96, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: deep-review-findings-registry.json
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code,checklist_evidence; overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-08-05T06:04:05.839Z
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
## 16. ITERATION 1 CORRECTNESS SUPPLEMENT

This pass added three P1 findings to the active review frontier:

- Receipt path confinement is assumed but not enforced for caller-supplied receiptDir and dispatchId.
- Fanout enables a write-capable prompt-only boundary for non-Codex executors without structural containment.
- Nonzero Pi exits are exempted from failure classification, so partial artifacts can be accepted as fulfilled.

Next focus remains security: validate whether these boundaries are exploitable across process and runtime trust boundaries.
