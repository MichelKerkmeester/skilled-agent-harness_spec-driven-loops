# Deep Review Strategy - 019-maintenance-grace-daemon-survives-reelection

## 1. TOPIC

Review the implementation of the maintenance-grace daemon-survives-re-election fix (phase 019). Focus on correctness of the marker writer, the launcher adopt predicate, and the two reap-path guard sites, plus spec/implementation alignment.

---

## 2. REVIEW DIMENSIONS (remaining)

<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [x] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization — not covered
- [x] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity — partially covered via spec_code protocol
- [x] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost — partially covered
<!-- MACHINE-OWNED: END -->

---

## 3. NON-GOALS

- Re-reviewing the 018 cooperative-yield implementation.
- Running the live end-to-end reindex deploy check.
- Evaluating the unrelated model-server/hf-embed supervision paths.

---

## 4. STOP CONDITIONS

- Max iterations reached (config.maxIterations = 1).
- All configured dimensions covered OR hard stop triggered.

---

## 5. COMPLETED DIMENSIONS

<!-- MACHINE-OWNED: START -->

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| Correctness | CONDITIONAL | 1 | One P1 traceability finding (marker payload shape) and one P2 maintainability finding (spec TTL drift) observed during correctness pass; no P0 correctness defects found. |

<!-- MACHINE-OWNED: END -->

---

## 6. RUNNING FINDINGS

<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 1 active
- **P2 (Minor):** 1 active
- **Delta this iteration:** +0 P0, +1 P1, +1 P2

Findings are tracked in `deep-review-findings-registry.json`.
<!-- MACHINE-OWNED: END -->

---

## 7. WHAT WORKED

- Reading the spec, plan, implementation summary, and the four key source files gave a complete picture of the change.
- The marker writer, pure predicate, and both launcher guard sites were easy to locate and verify against the spec requirements.

---

## 8. WHAT FAILED

- No approaches failed.

---

## 9. EXHAUSTED APPROACHES (do not retry)

None.

---

## 10. RULED OUT DIRECTIONS

- Hypothesized that the marker might not be cleared on synchronous-path scans; ruled out because the spec restricts the marker to background scans and the synchronous path intentionally does not write it.
- Hypothesized a race between `processLiveness` and `shouldAdoptDespiteProbe`; ruled out because the launcher captures liveness at the call site and the predicate does not re-query it.

---

## 11. NEXT FOCUS

<!-- MACHINE-OWNED: START -->
Loop stopped at maxIterations=1. No further iterations scheduled. Synthesize review-report.md.
<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT

- Phase 019 follows 018 (cooperative tail-loop yields) and fixes the case where a second launcher reaps a daemon mid-scan.
- Key files: `mcp_server/lib/storage/maintenance-marker.ts`, `mcp_server/handlers/memory-index.ts`, `bin/lib/model-server-supervision.cjs`, `bin/mk-spec-memory-launcher.cjs`.
- No `resource-map.md` present; coverage gate skipped.

---

## 13. CROSS-REFERENCE STATUS

<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | Marker payload shape drifts from spec (jobId missing); TTL value drifts (60s vs 180s). Guard sites and predicate match spec. |
| `checklist_evidence` | core | pass | 1 | Level-1 spec folder has no checklist.md; gate not applicable. |
| `skill_agent` | overlay | notApplicable | — | Target is a spec folder, not a skill. |
| `agent_cross_runtime` | overlay | notApplicable | — | Target is a spec folder, not an agent. |
| `feature_catalog_code` | overlay | notApplicable | — | No feature catalog claims under review. |
| `playbook_capability` | overlay | notApplicable | — | No playbook scenarios under review. |

<!-- MACHINE-OWNED: END -->

---

## 14. FILES UNDER REVIEW

<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts` | Correctness | 1 | 1 P1 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Correctness | 1 | 0 | complete |
| `.opencode/bin/lib/model-server-supervision.cjs` | Correctness | 1 | 0 | complete |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Correctness | 1 | 0 | complete |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-daemon-survives-reelection/spec.md` | Correctness | 1 | 1 P2 | partial |

<!-- MACHINE-OWNED: END -->

---

## 15. REVIEW BOUNDARIES

<!-- MACHINE-OWNED: START -->
- Max iterations: 1
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-p019-kimi-2-1781719527072-mk6no9, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code,checklist_evidence], overlay=[feature_catalog_code,playbook_capability]
- Started: 2026-06-17T16:05:00Z
<!-- MACHINE-OWNED: END -->
