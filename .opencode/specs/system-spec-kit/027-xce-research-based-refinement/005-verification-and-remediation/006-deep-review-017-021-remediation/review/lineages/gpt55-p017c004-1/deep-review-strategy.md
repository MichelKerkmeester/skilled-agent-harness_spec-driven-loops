# Deep Review Strategy - gpt55-p017c004-1

## 1. Topic

Review: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set`

## 2. Review Dimensions (Remaining)

<!-- MACHINE-OWNED: START -->
- [ ] D2 Security, input/output safety, data exposure, permissions
- [ ] D3 Traceability, spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

## 3. Non-Goals

- Do not implement fixes.
- Do not modify files under review.
- Do not run `resolveArtifactRoot`; artifact_dir is bound directly to the fanout override.

## 4. Stop Conditions

- Stop after convergence or `maxIterations=1`, whichever comes first.
- Stop immediately on an active P0 with evidence; none were found.

## 5. Completed Dimensions

<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1 | Found one P1: shipped starter labeled-set JSON is not consumable by the shipped labeled-set loader. |
<!-- MACHINE-OWNED: END -->

## 6. Running Findings

<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 1 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +1 P1, +0 P2

Findings are tracked in `deep-review-findings-registry.json`.
<!-- MACHINE-OWNED: END -->

## 7. What Worked

- Directly replaying the loader against the shipped starter artifact converted a doc/code mismatch into executable evidence. (iteration 1)
- Exact Grep across sibling lineages avoided duplicating already-known lower-severity findings. (iteration 1)

## 8. What Failed

- Code graph outline was blocked by stale graph readiness and required a full scan, so direct reads were used. (iteration 1)
- `memory_context` rejected session-scoped calls with `E_SESSION_SCOPE`, so packet-local docs became the prior context source. (iteration 1)

## 9. Exhausted Approaches

- None.

## 10. Ruled Out Directions

- Default-on production calibration risk: ruled out by opt-in flag and model-path gate evidence in `search-flags.ts:613-644` and `confidence-scoring.ts:217-222`.
- Request-quality S2 regression: ruled out for this pass; reviewed code keeps `assessRequestQuality()` separate from calibration application.

## 11. Next Focus

<!-- MACHINE-OWNED: START -->
Fix or plan remediation for F001. The minimal regression should parse `assets/confidence-labeled-set.starter.json` and assert `loadLabeledSet()` returns 100 pairs, either by changing the asset to a top-level array or by adding supported `pairs[]` wrapper handling.
<!-- MACHINE-OWNED: END -->

## 12. Known Context

- Target packet status is complete and documents two deliverables: a default-on 0.45/0.55 relevance rebalance and default-off isotonic calibration infrastructure.
- `checklist.md` is absent; this is a Level 1 packet, so checklist evidence is not applicable.
- `resource-map.md` is absent; resource-map coverage gate is skipped.
- Sibling lineage evidence already identified a P2 model-bloat issue and a P2 boolean-edge test gap; this lineage focused on a distinct starter artifact/loader compatibility issue.

## 13. Cross-Reference Status

<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | F001: starter labeled-set artifact does not satisfy `loadLabeledSet()` input contract. |
| `checklist_evidence` | core | notApplicable | 1 | No `checklist.md` in Level 1 target folder. |
| `feature_catalog_code` | overlay | pass | 1 | Calibration is opt-in and requires model path; production remains inert by default. |
| `playbook_capability` | overlay | partial | 1 | Follow-up playbook path is blocked until starter artifact and loader agree. |
<!-- MACHINE-OWNED: END -->

## 14. Files Under Review

<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-calibration.ts` | D1 | 1 | 0 P0, 1 P1, 0 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/tests/confidence-calibration.vitest.ts` | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `assets/fit-calibration.mjs` | D1 | 1 | 0 P0, 1 P1, 0 P2 | partial |
| `assets/confidence-labeled-set.starter.json` | D1 | 1 | 0 P0, 1 P1, 0 P2 | partial |
| `spec.md` | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `implementation-summary.md` | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
<!-- MACHINE-OWNED: END -->

## 15. Review Boundaries

<!-- MACHINE-OWNED: START -->
- Max iterations: 1
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-gpt55-p017c004-1-1781757625173-xsur7n, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-06-18T04:45:03Z
<!-- MACHINE-OWNED: END -->
