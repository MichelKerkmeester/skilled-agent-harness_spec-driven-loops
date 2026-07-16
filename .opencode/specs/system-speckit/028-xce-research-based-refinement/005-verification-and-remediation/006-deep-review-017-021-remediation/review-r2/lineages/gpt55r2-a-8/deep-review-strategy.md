# Deep Review Strategy - Session Tracking

## 2. TOPIC
Search and retrieval subsystem review for the system-spec-kit MCP server, scoped by `A-search-retrieval/spec.md`.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS
- Do not modify code under review.
- Do not run external web research.
- Do not write outside the lineage artifact directory.

---

## 5. STOP CONDITIONS
- Stop after `config.maxIterations=1` or earlier legal convergence.
- Stop immediately on confirmed P0 and synthesize release-blocking verdict at max iteration.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1 | Community fallback can append rows outside caller retrieval filters. |
| D2 Security | FAIL | 1 | Retrieval rescue can bypass governed tenant/user/agent filtering after Stage 1. |
| D3 Traceability | CONDITIONAL | 1 | Scoped retrieval claims are only partially preserved across fallback layers. |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 1 active
- **P1 (Major):** 1 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +1 P0, +1 P1, +0 P2
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
- Fallback-path review found scope bugs by checking every post-Stage-1 row injection point against governed and caller-specified filters (iteration 1).

---

## 9. WHAT FAILED
- Treating Stage 1 scope filtering as sufficient failed because Stage 2 and handler-level fallback paths append additional candidates after Stage 1 (iteration 1).

---

## 10. EXHAUSTED APPROACHES (do not retry)
- None. Max-iteration stop ended the lineage before maintainability coverage.

---

## 11. RULED OUT DIRECTIONS
- Stage 1-only governance proof: ruled out because `applyRetrievalRescueLayer()` appends rows after Stage 1 filtering (evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1369-1373`).

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Remediate F001 first by passing and enforcing normalized tenant/user/agent scope inside retrieval rescue, then replay F002 by applying `specFolder`, `tier`, `contextType`, `includeArchived`, and canonical-source filters to community fallback rows before append.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT
- Scope file says this is an independent audit of search/retrieval code and that clean PASS is valid if no real defects are found.
- `resource-map.md` not present. Skipping coverage gate.
- Memory trigger preflight rejected the fanout session id as not server-managed, so trigger matching was retried without memory session binding.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | Scope matched search/retrieval files; F001/F002 show fallback layers drift from scoped retrieval behavior. |
| `checklist_evidence` | core | pass | 1 | No checklist exists in this review-scope packet. |
| `skill_agent` | overlay | notApplicable | 1 | Target type is spec-folder, not skill. |
| `agent_cross_runtime` | overlay | notApplicable | 1 | Target type is spec-folder, not agent. |
| `feature_catalog_code` | overlay | partial | 1 | Governed retrieval is enforced in Stage 1 but not preserved by retrieval rescue. |
| `playbook_capability` | overlay | partial | 1 | Fallback behavior needs regression coverage for scoped searches. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | D2, D3 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` | D2, D3 | 1 | 1 P0, 0 P1, 0 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts` | D1, D2, D3 | 1 | 1 P0, 0 P1, 0 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | D1, D2, D3 | 1 | 0 P0, 1 P1, 0 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts` | D1, D3 | 1 | 0 P0, 1 P1, 0 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` | D2, D3 | 1 | 0 P0, 0 P1, 0 P2 | reference |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 1
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-gpt55r2-a-8-1781761314338-6u1ztm, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness state: release-blocking
- Per-iteration budget: target 8-11 tool calls
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-06-18T06:25:05Z
<!-- MACHINE-OWNED: END -->
