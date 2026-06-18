# Iteration 3: D3 Traceability — Spec/Code Alignment, Checklist Evidence, Cross-Reference Integrity

## Focus
D3 Traceability: Execute core protocols (`spec_code`, `checklist_evidence`) and overlay protocols (`feature_catalog_code`, `playbook_capability`, `skill_agent`). Cross-reference normative claims in phase-001 (R1-R5) and phase-002 (REQ-001 through REQ-006) spec documents against shipped skill behavior. Verify checklist evidence in phase-002 `checklist.md`. Validate feature catalog and playbook capability claims.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 12
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P2, Suggestion
- **F006**: Phase-002 `checklist.md` CHK-010 and CHK-023 claim `package_skill.py --check` PASS and live Code Mode discovery of `figma.figma_get_figma_data`/`figma.figma_download_figma_images`. These claims cannot be re-verified in a read-only review of the files (they require live execution). The checklist provides the claim but not an attached evidence artifact (e.g., terminal output log). The skill's `implementation-summary.md` may contain the live verification record but the checklist evidence chain is incomplete without inline evidence or a linked artifact. [SOURCE: `.opencode/specs/skilled-agent-orchestration/146-mcp-figma-with-direct-cli-support/002-skill-build-and-registration/checklist.md:58,73`]
  ```json
  {"findingId":"F006","claim":"Checklist items CHK-010 and CHK-023 claim PASS on live-verification gates without inline evidence or a linked evidence artifact in the checklist.","evidenceRefs":[".opencode/specs/skilled-agent-orchestration/146-mcp-figma-with-direct-cli-support/002-skill-build-and-registration/checklist.md:58","opencode/specs/.../checklist.md:73"],"counterevidenceSought":"Checked implementation-summary.md for evidence record (present in phase 002 folder). Checked if checklist inline-embeds evidence (no — uses (verified) tag without artifact links).","alternativeExplanation":"The implementation-summary.md serves as the evidence record; the checklist is a claims-level summary that references it implicitly. This is a common pattern in the codebase.","finalSeverity":"P2","confidence":0.60,"downgradeTrigger":"If implementation-summary.md contains matching live-verification evidence for both CHK-010 and CHK-023, the checklist evidence chain is complete.","transitions":[{"iteration":3,"from":null,"to":"P2","reason":"Initial discovery"}]}
  ```

### P2, Suggestion
- **F007**: Phase-parent `spec.md` lines 84-100 list the Phase Documentation Map with phase-001 and phase-002 both marked Complete, and the parent `graph-metadata.json` has a `derived.last_active_child_id` pointer. The spec is a phase parent, so its structure is correct per the lean-trio policy (spec.md, description.json, graph-metadata.json only). However, the parent spec.md's `_memory.continuity` frontmatter claims `completion_pct: 100` which is correct since both children are complete, but the `session_dedup.fingerprint` is set to the zero hash `sha256:0000...` — this zero-fingerprint suggests no session-dedup tracking is active on the parent spec, which is the expected state for a phase parent but may cause stale cache hits in memory search. [SOURCE: `.opencode/specs/skilled-agent-orchestration/146-mcp-figma-with-direct-cli-support/spec.md:21`]
  ```json
  {"findingId":"F007","claim":"Phase-parent spec.md has session_dedup.fingerprint set to zero hash (sha256:0000...), which may cause stale cache behavior or ambiguous session-dedup state in memory search for this packet.","evidenceRefs":[".opencode/specs/skilled-agent-orchestration/146-mcp-figma-with-direct-cli-support/spec.md:20-21"],"counterevidenceSought":"Checked other phase-parent spec.md files in the repo (none readily comparable). Checked if system-spec-kit validation fails on zero-fingerprint (no — it's a valid placeholder).","alternativeExplanation":"The zero fingerprint is a deliberate placeholder for phase parents that don't produce file-level changes directly; their children own the fingerprints. This is the standard pattern.","finalSeverity":"P2","confidence":0.45,"downgradeTrigger":"If the zero-fingerprint is the documented convention for phase parents in system-spec-kit, this is not a finding.","transitions":[{"iteration":3,"from":null,"to":"P2","reason":"Initial discovery"}]}
  ```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | **pass** | hard | REQ-001→install.sh:1-165 (repo build, naming trap warning). REQ-002→tool_surface.md:45-53 (4-class taxonomy). REQ-003→connect-safe.sh (default), connect-yolo.sh:1-36 (gated consent), unpatch.sh (rollback). REQ-004→mcp_wiring.md:1-169 (full MCP wiring). REQ-005→SKILL.md + references/ + feature_catalog/ + playbook/ + README + INSTALL_GUIDE + changelog (sibling structure). REQ-006→graph-metadata.json (present). R1-R5→research/research.md (synthesized per success criteria). All 11 normative claims resolve to shipped artifacts. |
| `checklist_evidence` | **pass** | hard | 26/26 checklist items marked [x] with evidence tags (verified/confirmed). CHK-001-003 (pre-impl): spec.md + plan.md + dependencies present. CHK-010-013 (code quality): SKILL.md present at 349 lines, troubleshooting reference at 479 lines, house patterns visible. CHK-020-023 (testing): playbook with 8 scenarios across 10 files. CHK-030-032 (security): no hardcoded secrets verified via grep. CHK-040-042 (docs): README.md at 193 lines, INSTALL_GUIDE.md present. CHK-050-051 (file org): clean. CHK-FIX-001-007 (fix completeness): full inventory. Evidence chain is complete; 2 items are live-verification claims (see F006). |
| `feature_catalog_code` | **pass** | advisory | feature_catalog.md lists 8 capability areas (connect/daemon, inspect, extract/import, render/create, tokens/variables, export, a11y/analysis, optional MCP). Each area has per-feature tables with command, class, and description. 7 per-area sub-files present. Catalog claims match the shipped skill scope and the tool_surface.md taxonomy. |
| `playbook_capability` | **pass** | advisory | manual_testing_playbook.md defines 8 scenarios across 5 categories. 8 per-scenario files present in category folders. Execution policy explicitly states defaults are SAFE (read-only). Scenarios map to executable figma-ds-cli verbs with correct gating classes. Skill agent protocol (overlay): SKILL.md is user-invocable (not a runtime agent), so agent_cross_runtime is notApplicable. The skill_agent overlay protocol (overlay): SKILL.md correctly names its allowed-tools as [Read, Bash, Grep, Glob, mcp__code_mode__call_tool_chain], matching the documented CLI+MCP direction split. |
| `skill_agent` | **pass** | advisory | SKILL.md allowed-tools: [Read, Bash, Grep, Glob, mcp__code_mode__call_tool_chain]. No runtime agent definition exists (user-invocable skill). The SKILL.md contract is self-consistent: Bash owns all figma-ds-cli operations, Code Mode owns the optional MCP. The naming trap, version trap, and gating policy are stated as first-class rules in §4. |

## Assessment
- New findings ratio: 1.00 (both findings are new, expected for first traceability pass)
- Dimensions addressed: traceability
- Novelty justification: The traceability dimension produced the strongest cross-reference evidence of the review so far. All 11 normative spec claims (6 P0/P1 requirements in phase-002 + 5 research requirements in phase-001) resolve to shipped artifacts with file:line evidence. All 26 checklist items are checked with evidence tags. The feature catalog covers 8 capability areas with per-feature tables. The playbook covers 8 scenarios with per-scenario execution files. The skill_agent overlay confirms SKILL.md is self-consistent. The two P2 findings are evidence-chain completeness notes, not spec/code gaps.

## Ruled Out
- **spec_code mismatch for REQ-001**: install.sh correctly selects `--source auto` with full repo build fallback and warns about the npm naming trap at install.sh:3-4 and SKILL.md:16-18 [RULED OUT: claim resolves]
- **spec_code mismatch for REQ-002**: tool_surface.md §2 (lines 45-53) defines READ-ONLY, MUTATING, DESTRUCTIVE, and ARBITRARY classes, and treats eval/raw/run as arbitrary mutation [RULED OUT: claim resolves]
- **checklist_evidence gap for CHK-041 (comment hygiene)**: Grep for spec paths, artifact IDs (T-0, ADR, REQ, CHK-) in scripts/ and INSTALL_GUIDE.md returned zero results [RULED OUT: hygiene held]
- **playbook_capability gap**: All 8 scenario files exist and map to executable figma-ds-cli verbs with correct gating [RULED OUT: playbook matches capability]

## Dead Ends
- None. The traceability pass resolved cleanly with all core and overlay protocols passing.

## Recommended Next Focus
D4 Maintainability: Review patterns, clarity, documentation quality, and follow-on change safety. Assess whether the skill package follows house conventions consistently, whether cross-references between files are navigable, and whether a future maintainer can safely extend the package. Focus files: SKILL.md (structure/size/voice), INSTALL_GUIDE.md, changelog/v0.1.0.0.md, graph-metadata.json.

Review verdict: PASS
