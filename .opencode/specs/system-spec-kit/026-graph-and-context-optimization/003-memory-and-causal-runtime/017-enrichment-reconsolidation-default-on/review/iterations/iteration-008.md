# Iteration 8 — traceability — docs-vs-code

**Verdict:** FAIL

Adversarial traceability pass (gpt-5.5-fast high) over docs-vs-code drift in the enrichment / reconsolidation / quality-loop surfaces. Dispatch returned a real verdict; findings were re-verified against the actual `mcp_server` code before recording.

## Findings

- **[P1] Feature catalog still documents quality loop as default OFF** — `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:4636`
  - Evidence: `| SPECKIT_QUALITY_LOOP | false | ... | **Default OFF.** ... |`. Actual code is default-on: `lib/search/search-flags.ts:368-372` documents `Default: TRUE (graduated)` and `isQualityLoopEnabled()` returns `isFeatureEnabled('SPECKIT_QUALITY_LOOP')`. Auto-fix is separately gated by `SPECKIT_QUALITY_AUTO_FIX`.
  - Recommendation: Change the catalog flag row to `SPECKIT_QUALITY_LOOP | true` / Default ON, and keep `SPECKIT_QUALITY_AUTO_FIX` as the separate auto-fix retry gate.

- **[P1] Feature catalog reconsolidation-on-save entry points at the wrong default and flag** — `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:2610`
  - Evidence: `Runs behind the SPECKIT_RECONSOLIDATION flag (default OFF, opt-in). Set SPECKIT_RECONSOLIDATION=true to enable.` Actual save-time gate is `SPECKIT_RECONSOLIDATION_ENABLED`, default ON: `lib/search/search-flags.ts:137-142` documents `Default: TRUE (graduated)` and `isSaveReconsolidationEnabled()` returns `isFeatureEnabled('SPECKIT_RECONSOLIDATION_ENABLED')`. (`SPECKIT_RECONSOLIDATION` is a separate flag at `search-flags.ts:218`.)
  - Recommendation: Update reconsolidation-on-save catalog entries to document `SPECKIT_RECONSOLIDATION_ENABLED=false` as the save-time opt-out flag with default ON behavior; stop presenting `SPECKIT_RECONSOLIDATION` as the primary save-time flag.

- **[P2] Feature catalog command-surface count is stale at 36 tools** — `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:48`
  - Evidence: `The Spec Kit Memory MCP server exposes **36 tools** overall ... matching the README's 36-tool API reference.` Actual `TOOL_DEFINITIONS.length` is 37 (verified via `node` against `dist/tool-schemas.js`), including `memory_causal_unlink`.
  - Recommendation: Update the Command-Surface Contract count and related `36-tool` wording to 37.

- **[P2] README layered MCP surface total still says 36 tools** — `README.md:401`
  - Evidence: README Layered MCP Surface table total is `**36**`, but `mcp_server/tool-schemas.ts` `TOOL_DEFINITIONS` contains 37 entries, including `memory_causal_unlink`.
  - Recommendation: Update the Layered MCP Surface table total to 37 and adjust the affected layer counts so the table sums correctly.

## Notes

- Scope items (a) ENV_REFERENCE defaults / `SPECKIT_POST_INSERT_ENRICHMENT_SYNC` row, (d) playbook 048 `balanceStatus` enum and 049 `memory_causal_unlink` exposure produced no findings in this pass (reviewer reported them clean / no drift).
- The tool-count drift (37 vs 36) was independently re-verified: `TOOL_DEFINITIONS length = 37`.
