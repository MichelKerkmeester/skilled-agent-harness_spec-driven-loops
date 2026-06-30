# Deep Review Strategy - Session Tracking

## Topic
Review of the mcp-figma skill package and phase-parent spec folder (`146-mcp-figma-with-direct-cli-support`). The skill drives Figma Desktop from the terminal via figma-ds-cli with an optional Figma MCP path through Code Mode. Both child phases (001 research, 002 build) are marked Complete. Review target is the shipped skill at `.opencode/skills/mcp-figma/` plus the phase spec documents.

## Review Dimensions (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [x] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [x] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [x] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

## Non-Goals
- Not reviewing the upstream silships/figma-cli repo or the Figma Desktop app itself (third-party, read-only input)
- Not reviewing the npm `figma-cli` package (unrelated, named only as a trap)
- Not evaluating design taste or interface aesthetics (owned by sk-design-interface)

## Stop Conditions
- Max 10 iterations reached
- All 4 dimensions covered with stabilization met
- Composite convergence score >= 0.60 with all legal-stop gates passing

## Completed Dimensions
<!-- MACHINE-OWNED: START -->
[None yet]

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
<!-- MACHINE-OWNED: END -->

## Running Findings
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 9 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2 (converged)
<!-- MACHINE-OWNED: END -->

## What Worked
[First iteration -- populated after iteration 1 completes]

## What Failed
[First iteration -- populated after iteration 1 completes]

## Exhausted Approaches (do not retry)

## Ruled Out Directions

## Next Focus
<!-- MACHINE-OWNED: START -->
Review complete. All 4 dimensions covered, all traceability protocols pass, 0 P0/P1, 9 P2 advisories. Verdict: PASS with hasAdvisories=true. Next: /create:changelog
<!-- MACHINE-OWNED: END -->

## Known Context
- Phase 001 (001-figma-cli-and-mcp-research): 5-iteration deep research into figma-cli capabilities, MCP landscape, skill architecture, and install/safety path. Complete.
- Phase 002 (002-skill-build-and-registration): Built the mcp-figma skill v0.1.0 with SKILL.md, 4 references, 8 scripts, feature catalog, manual testing playbook, README, INSTALL_GUIDE, changelog, graph registration. Complete.
- The skill passed package_skill.py --check with PASS, figma-ds-cli 1.2.0 installed from repo build, Code Mode figma manual confirmed.
- resource-map.md not present. Skipping coverage gate.

## Cross-Reference Status
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 3 | All 11 normative claims (REQ-001 through REQ-006, R1-R5) resolve to shipped artifacts with file:line evidence |
| `checklist_evidence` | core | pass | 3 | 26/26 checklist items verified with evidence tags |
| `skill_agent` | overlay | pass | 3 | SKILL.md allowed-tools contract self-consistent; no runtime agent |
| `agent_cross_runtime` | overlay | notApplicable | - | mcp-figma is user-invocable, not a runtime agent |
| `feature_catalog_code` | overlay | pass | 3 | 8 capability areas with per-feature tables match shipped scope |
| `playbook_capability` | overlay | pass | 3 | 8 scenarios map to executable figma-ds-cli verbs |
<!-- MACHINE-OWNED: END -->

## Files Under Review
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/skills/mcp-figma/SKILL.md` | - | - | - | pending |
| `.opencode/skills/mcp-figma/scripts/install.sh` | - | - | - | pending |
| `.opencode/skills/mcp-figma/scripts/daemon.sh` | - | - | - | pending |
| `.opencode/skills/mcp-figma/scripts/connect-safe.sh` | - | - | - | pending |
| `.opencode/skills/mcp-figma/scripts/connect-yolo.sh` | - | - | - | pending |
| `.opencode/skills/mcp-figma/scripts/unpatch.sh` | - | - | - | pending |
| `.opencode/skills/mcp-figma/scripts/doctor.sh` | - | - | - | pending |
| `.opencode/skills/mcp-figma/scripts/print-utcp-snippets.sh` | - | - | - | pending |
| `.opencode/skills/mcp-figma/scripts/_common.sh` | - | - | - | pending |
| `.opencode/skills/mcp-figma/references/figma_cli_reference.md` | - | - | - | pending |
| `.opencode/skills/mcp-figma/references/tool_surface.md` | - | - | - | pending |
| `.opencode/skills/mcp-figma/references/mcp_wiring.md` | - | - | - | pending |
| `.opencode/skills/mcp-figma/references/troubleshooting.md` | - | - | - | pending |
| `.opencode/skills/mcp-figma/feature_catalog/feature_catalog.md` | - | - | - | pending |
| `.opencode/skills/mcp-figma/manual_testing_playbook/manual_testing_playbook.md` | - | - | - | pending |
| `.opencode/skills/mcp-figma/INSTALL_GUIDE.md` | - | - | - | pending |
| `.opencode/skills/mcp-figma/README.md` | - | - | - | pending |
| `.opencode/specs/skilled-agent-orchestration/151-.../001-figma-cli-and-mcp-research/spec.md` | - | - | - | pending |
| `.opencode/specs/skilled-agent-orchestration/151-.../002-skill-build-and-registration/spec.md` | - | - | - | pending |
| `.opencode/specs/skilled-agent-orchestration/151-.../002-skill-build-and-registration/checklist.md` | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

## Review Boundaries
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-v4-pro-1781459141456-y67ab1, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, shared time budget
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, feature_catalog_code, playbook_capability]
- Started: 2026-06-14T18:00:00Z
<!-- MACHINE-OWNED: END -->
