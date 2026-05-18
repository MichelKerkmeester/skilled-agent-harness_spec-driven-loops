# Deep Review Strategy - Session Tracking

## 1. REVIEW CHARTER
- **Target**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/002-manifest-driven-template-design`
- **Target Type**: spec_folder (implementation audit of C+F hybrid manifest-driven template system)
- **Dimensions**: implementation-spec-alignment, code-correctness, template-rendering-correctness, validator-coverage, cross-runtime-mirror-consistency
- **Stop conditions**: rolling newFindingsRatio < 0.10 for 2 iterations OR all dimensions converged OR max=5 reached
- **Success criteria**: zero P0 correctness failures; all P1 findings documented with remediation

## 2. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 implementation-spec-alignment — Does the implementation match the spec.md / ADR claims?
- [ ] D2 code-correctness — Logic errors, edge cases, error handling in manifest/renderer/validators
- [ ] D3 template-rendering-correctness — Inline-gate renderer EBNF correctness, manifest schema validity
- [ ] D4 validator-coverage — Validator integration with manifest, file/section check completeness
- [ ] D5 cross-runtime-mirror-consistency — TS/Shell parity, dual-source manifest consumption
<!-- MACHINE-OWNED: END -->

## 3. NON-GOALS
- Auditing legacy templates (level_1/2/3/3+/addendum/phase_parent) — those are slated for deletion in Phase 4
- Reviewing research.md content quality — it was produced by a converged deep-research loop
- Spec doc cross-references (spec.md vs plan.md vs checklist.md) — user explicitly excluded this

## 4. STOP CONDITIONS
- Max iterations: 5 (hard cap)
- Convergence threshold: newFindingsRatio < 0.10
- Blocked stop if P0 findings remain unresolved
- Claim adjudication gate: all P0/P1 must have typed adjudication packets

## 5. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
[None yet]
<!-- MACHINE-OWNED: END -->

## 6. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
<!-- MACHINE-OWNED: END -->

## 7. WHAT WORKED
[Awaiting first iteration]

## 8. WHAT FAILED
[Awaiting first iteration]

## 9. EXHAUSTED APPROACHES
[None yet]

## 10. RULED OUT DIRECTIONS
[None yet]

## 11. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Iteration 1: implementation-spec-alignment — verify design spec vs actual implementation code
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT
This spec folder was an investigation-only packet that converged at iter 9 (newInfoRatio 0.06). The chosen design is C+F hybrid manifest-driven greenfield. The follow-on implementation packet partially exists — key files like `spec-kit-docs.json`, `inline-gate-renderer.ts`, and `template-utils.sh` already exist. The implementation-summary.md states "No code changed in this packet" but the codebase has manifest-driven infrastructure. This review audits the current implementation against the specified design.

## 13. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | Verify implementation files match spec.md/ADR claims |
| `checklist_evidence` | core | pending | - | Verify checklist items have evidence |
| `skill_agent` | overlay | notApplicable | - | No agent files in review scope |
| `agent_cross_runtime` | overlay | notApplicable | - | No multi-runtime agent files |
| `feature_catalog_code` | overlay | notApplicable | - | No feature catalog references |
| `playbook_capability` | overlay | notApplicable | - | No playbook references |
<!-- MACHINE-OWNED: END -->

## 14. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| templates/manifest/spec-kit-docs.json | - | - | - | pending |
| scripts/templates/inline-gate-renderer.ts | - | - | - | pending |
| scripts/templates/inline-gate-renderer.sh | - | - | - | pending |
| scripts/lib/template-utils.sh | - | - | - | pending |
| scripts/renderers/template-renderer.ts | - | - | - | pending |
| scripts/rules/check-files.sh | - | - | - | pending |
| scripts/rules/check-sections.sh | - | - | - | pending |
| scripts/rules/check-template-headers.sh | - | - | - | pending |
| scripts/rules/check-section-counts.sh | - | - | - | pending |
| scripts/spec/create.sh | - | - | - | pending |
| scripts/spec/validate.sh | - | - | - | pending |
| shared/parsing/spec-doc-health.ts | - | - | - | pending |
| scripts/utils/template-structure.js | - | - | - | pending |
| templates/manifest/README.md | - | - | - | pending |
| templates/manifest/EXTENSION_GUIDE.md | - | - | - | pending |
| templates/manifest/MIGRATION.md | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

## 15. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-05-04T00-review-template-greenfield, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: deep-review-findings-registry.json
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec_folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[]
- Started: 2026-05-04T00:00:00Z
<!-- MACHINE-OWNED: END -->

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] correctness
- [ ] security
- [ ] traceability
- [ ] maintainability

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
[None yet]

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 0
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
correctness

<!-- /ANCHOR:next-focus -->
