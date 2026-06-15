# Iteration 2: Security

## Focus
Security dimension review of the mcp-figma skill package. Reviewed all 8 scripts for secret exposure, credential handling, the yolo patch consent model, the eval/raw/run arbitrary mutation gating, and the Code Mode `.env` token path. Cross-referenced SKILL.md NEVER rules against script behavior.

## Scorecard
- Dimensions covered: security
- Files reviewed: 10
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.29

## Findings

### P0, Blocker
None.

### P1, Required
None.

### P2, Suggestion

- **F006**: print-utcp-snippets.sh example uses `figma.figma_get_file` while the live tool is `figma.figma_get_figma_data`, `.opencode/skills/mcp-figma/scripts/print-utcp-snippets.sh:42`. The call example shows `figma.figma_get_file({ /* args per tool_info */ })` but mcp_wiring.md (line 111) and the SKILL.md (line 235) both confirm the live-verified tool name is `figma.figma_get_figma_data`. The example could mislead an operator who copies it without running `tool_info()` first. The comment says "args per tool_info" which partially mitigates this, but the tool name itself is wrong.

- **F007**: doctor.sh could warn when Figma Desktop is not running (not just not found), `.opencode/skills/mcp-figma/scripts/doctor.sh:28`. The script checks if Figma Desktop exists on disk (`figma_desktop_path`) but does not check if it is running (e.g. `pgrep -x Figma`). Since the CLI requires Figma to be open with a file, a running-state check in the diagnostics would help operators who have Figma installed but not launched. This is a diagnostic improvement, not a security blocker.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | — | No secrets exposed; NEVER rules enforced |
| checklist_evidence | pass | hard | CHK-030, CHK-031 verified | No hardcoded secrets; eval/raw/run gated |

## Assessment
- New findings ratio: 0.29 (2 P2 findings with weight 1.0 each out of 7 total weighted findings)
- Dimensions addressed: security
- Novelty justification: Security surface is clean; scripts do not expose secrets; yolo consent model is solid; both findings are advisory

## Ruled Out
- Daemon token exposure: doctor.sh prints the file path but explicitly says "(contents NOT shown)" — acceptable
- eval/raw/run bypass: tool_surface.md and SKILL.md both classify these as ARBITRARY with review-before-run gating — correct

## Dead Ends
- Checked all scripts for hardcoded secrets or token values — none found
- Checked all references for credential leaks — none found

## Recommended Next Focus
D3 Traceability — verify spec/code alignment, checklist evidence completeness, feature catalog vs shipped skill, and playbook vs executable reality.

---

Review verdict: PASS
