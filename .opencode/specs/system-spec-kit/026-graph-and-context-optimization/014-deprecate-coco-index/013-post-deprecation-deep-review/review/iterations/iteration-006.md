# Iteration 6 - D2/D3 Deep / Doctor, Catalog, Launchers, Config Flags
## Dimensions Covered
- security
- traceability
## Files Reviewed
- `.opencode/commands/doctor/assets/doctor_deep-loop.yaml:97`
- `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:29,48,291,307,323`
- `.opencode/bin/lib/sidecar-env-allowlist.cjs:17`
- `.opencode/skills/system-spec-kit/SKILL.md:422`
- `.vscode/mcp.json` (all _NOTE_* blocks)
- `.gemini/settings.json` (all _NOTE_* blocks)
- `.codex/config.toml` (all _NOTE_* blocks)
- `.mcp.json` (all _NOTE_* blocks)
- `.devin/config.json` (all _NOTE_* blocks)
- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` (RERANKER_LOCAL references)
- `.opencode/skills/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts` (RERANKER_LOCAL test references)
- `.opencode/skills/system-spec-kit/mcp_server/tests/search-extended.vitest.ts` (RERANKER_LOCAL test references)

## Findings
### P0
- none
### P1
- **F009**: Dead RERANK_ env var prefix in sidecar allowlist for removed feature — `.opencode/bin/lib/sidecar-env-allowlist.cjs:17` — The `RERANK_` prefix is still allowed in the sidecar env allowlist, but `RERANKER_LOCAL` was removed in the 014 deprecation (system-spec-kit/SKILL.md:422 states "the SPECKIT_CROSS_ENCODER/RERANKER_LOCAL flags are no longer wired"). Allowing env vars for a dead feature is a security/maintainability risk. Recommendation: Remove `'RERANK_'` from the prefixes array in SIDECAR_ENV_ALLOWLIST.
### P2
- **F008**: Stale catalog entry claiming removed CCC integration capability — `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:29,48,291,307,323` — The feature catalog references a non-existent `07--ccc-integration` directory and claims CCC integration capabilities (ccc-reindex, ccc-feedback, ccc-status tools) that were removed in the 014 deprecation. Directory listing shows no 07--ccc-integration folder exists. Recommendation: Remove the CCC integration section from the catalog or replace with a deprecation notice.

## Confirmed-Clean Surfaces
- Doctor command surface: Only the already-known F006 (doctor_deep-loop.yaml:97 forbidden-target glob) found; no new vestigial routes or stale doctor-cocoindex references
- Install guides: No coco/ccc/rerank/8765 references found in `.opencode/install_guides/**`
- Scripts: No coco/ccc/rerank/8765/ensure-rerank residue found in `.opencode/scripts/**`
- MCP config _NOTE_* blocks: All 5 configs clean; the only rerank references are to Voyage's cloud rerank-2.5 service (not the removed system-rerank-sidecar)

## Claim Adjudication
- F006: claim "doctor_deep-loop.yaml:97 has vestigial glob"; evidence `.opencode/commands/doctor/assets/doctor_deep-loop.yaml:97` shows `"mcp_server/database/*coco*"`; counterevidence sought "other doctor routes"; alternative "clean doctor surface"; finalSeverity P2; confidence 1.00 (confirmed as known finding)

## Next Focus
Synthesis (stabilized) - Found 2 new findings (F008 P2, F009 P1) in this pass. The RERANK_ prefix issue is a security/maintainability concern that should be addressed. The stale catalog entry is a traceability issue. Both are actionable but not blockers.

Review verdict: FAIL (new findings found; cumulative P0:1 P1:4 P2:4)