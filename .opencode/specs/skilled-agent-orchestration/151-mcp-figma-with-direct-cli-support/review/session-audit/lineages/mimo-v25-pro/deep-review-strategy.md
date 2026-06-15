# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

---

## 2. TOPIC
Review of mcp-figma skill with direct CLI support — spec folder `skilled-agent-orchestration/151-mcp-figma-with-direct-cli-support`. Both phases (001 research, 002 skill build) are marked complete. The deliverable is the `mcp-figma` skill at `.opencode/skills/mcp-figma/`.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [x] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [x] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [x] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS
- Not reviewing the Figma Desktop app itself or the silships upstream repo
- Not reviewing the unrelated npm `figma-cli` package (unic/figma-cli)
- Not re-deriving or caching Figma content
- Not modifying any files under review (observation-only audit)

---

## 5. STOP CONDITIONS
- All 4 dimensions covered with at least one stabilization pass
- No active P0 findings remaining
- Convergence threshold met (rolling average < 0.08, dimension coverage 100%)
- OR maxIterations (10) reached

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1 | 2 P1 (yolo running-state gap, install.sh error handling), 3 P2 |
| D2 Security | PASS | 2 | 0 P0/P1, 2 P2 (tool name mismatch in snippet, doctor running-state check) |
| D3 Traceability | PASS | 3 | 0 P0/P1/P2 new; all 4 protocols pass (F005 from iter 1 carried forward) |
| D4 Maintainability | PASS | 4 | 0 P0/P1, 2 P2 (verbose flag dead code, unused constants) |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 2 active (+2 this iteration)
- **P2 (Minor):** 3 active (+3 this iteration)
- **Delta this iteration:** +0 P0, +2 P1, +3 P2

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
- Script-level review against ALWAYS/NEVER rules in SKILL.md: found enforcement gaps (iteration 1)
- Cross-referencing spec claims against graph-metadata.json: found missing sibling edge (iteration 1)

---

## 9. WHAT FAILED
- None this iteration

---

## 10. EXHAUSTED APPROACHES (do not retry)
[Populated when a review approach has been tried from multiple angles without yielding new findings]

---

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated — consolidated from iteration dead-end data]

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Dimension: D2 Security
Focus: Review daemon token handling and exposure surface, the yolo app.asar patch safety model, the `eval/raw/run` arbitrary mutation gating, and the Code Mode `.env` token exposure path. Verify that the NEVER rules around token exposure and the destructive-command gating are enforced in scripts and references.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT
- Phase 001 (research) completed 5 iterations covering CLI surface, MCP landscape, skill architecture, install/safety path, and convergence
- Phase 002 (skill build) completed: SKILL.md, 4 references, 8 scripts, feature catalog, testing playbook, README, INSTALL_GUIDE, changelog, graph-metadata
- Both phases validated with `validate.sh --strict`
- The spec folder is a phase parent with two child phases, both marked complete
- `resource-map.md` not present at the spec folder root

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | — | — |
| `checklist_evidence` | core | pending | — | — |
| `skill_agent` | overlay | notApplicable | — | Target is spec-folder, not skill directly |
| `agent_cross_runtime` | overlay | notApplicable | — | Target is spec-folder, not agent |
| `feature_catalog_code` | overlay | pending | — | Verify feature catalog matches shipped skill |
| `playbook_capability` | overlay | pending | — | Verify playbook scenarios match executable reality |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `spec.md` | — | — | — | pending |
| `001-figma-cli-and-mcp-research/spec.md` | — | — | — | pending |
| `002-skill-build-and-registration/spec.md` | — | — | — | pending |
| `002-skill-build-and-registration/checklist.md` | — | — | — | pending |
| `002-skill-build-and-registration/implementation-summary.md` | — | — | — | pending |
| `.opencode/skills/mcp-figma/SKILL.md` | — | — | — | pending |
| `.opencode/skills/mcp-figma/scripts/install.sh` | — | — | — | pending |
| `.opencode/skills/mcp-figma/scripts/_common.sh` | — | — | — | pending |
| `.opencode/skills/mcp-figma/scripts/connect-safe.sh` | — | — | — | pending |
| `.opencode/skills/mcp-figma/scripts/connect-yolo.sh` | — | — | — | pending |
| `.opencode/skills/mcp-figma/scripts/daemon.sh` | — | — | — | pending |
| `.opencode/skills/mcp-figma/scripts/doctor.sh` | — | — | — | pending |
| `.opencode/skills/mcp-figma/scripts/unpatch.sh` | — | — | — | pending |
| `.opencode/skills/mcp-figma/references/tool_surface.md` | — | — | — | pending |
| `.opencode/skills/mcp-figma/references/mcp_wiring.md` | — | — | — | pending |
| `.opencode/skills/mcp-figma/references/troubleshooting.md` | — | — | — | pending |
| `.opencode/skills/mcp-figma/feature_catalog/feature_catalog.md` | — | — | — | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-mimo-v25-pro-1781459141456-y67ab1, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-06-14T19:45:00Z
<!-- MACHINE-OWNED: END -->
