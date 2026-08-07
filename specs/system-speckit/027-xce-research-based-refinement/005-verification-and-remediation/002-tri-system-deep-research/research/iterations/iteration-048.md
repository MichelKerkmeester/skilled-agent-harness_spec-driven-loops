# Iteration 048 — Angle 48

**Angle:** CLI front-door parity drift: 37/8/9 tool counts, offline smoke coverage, envelope/exit-code consistency across the three CLIs.

**Summary:** The live code mostly preserves the advertised 37/8/9 surfaces, but documentation overstates how drift-proof the advisor and historical code-index paths are. The unified offline smoke is useful for count/freshness checks but does not yet lock the shared envelope and exit-code taxonomy.

**Findings kept:** 3

## [P1][DOC-DRIFT] skill-advisor CLI manifest is documented as generated from TOOL_DEFINITIONS but is hand-maintained

- Evidence: .opencode/skills/system-skill-advisor/feature_catalog/mcp-surface/skill-advisor-cli.md:17 and :41 claim byte-identical/generated from TOOL_DEFINITIONS; .opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli-manifest.ts:22-140 defines a separate static SKILL_ADVISOR_TOOL_DEFINITIONS array; server TOOL_DEFINITIONS are assembled separately in .opencode/skills/system-skill-advisor/mcp_server/tools/index.ts:37-43.
- Detail: The current schemas appear aligned by source inspection, but the documented drift-proof mechanism does not exist for skill-advisor. A future server tool/schema change can drift from the CLI unless both duplicated registries are updated.
- Fix sketch: Derive SKILL_ADVISOR_CLI_TOOL_MANIFEST from the server TOOL_DEFINITIONS or add a direct test that deep-compares names, descriptions, and input schemas.

## [P2][REFINEMENT] Unified offline smoke is count-only and does not cover cross-CLI exit-code/envelope consistency

- Evidence: .opencode/bin/cli-offline-smoke.cjs:55-75 only runs list-tools, parses count/status, and checks daemonSocket absence; .opencode/bin/cli-offline-smoke.test.cjs:19-37 asserts status/count/freshness/daemonFree only, with stale-dist classifier checks at :44-55.
- Detail: This is enough for 37/8/9 count drift, but it does not exercise warm-only exit 75, usage/schema exit 64, runtime-error exit 1, json/jsonl/text envelopes, code-index blocked exit-0, detect_changes parse_error exit-64, or skill-advisor trusted-refusal exit-64 across all three CLIs. Those contracts exist in source/docs, but the single offline smoke command does not lock them together.
- Fix sketch: Extend cli-offline-smoke with daemon-free negative cases per CLI or add a sibling cli-exit-envelope-smoke script that asserts the shared taxonomy and known exceptions.

## [P2][DOC-DRIFT] code-index changelog still says there is no manifest to drift

- Evidence: .opencode/skills/system-code-graph/changelog/v1.2.0.0.md:11 says the CLI has runtime command generation with no manifest to drift; current .opencode/skills/system-code-graph/mcp_server/code-index-cli-manifest.ts:10-19 defines EXPECTED_TOOL_NAMES and :23-37 asserts the manifest.
- Detail: Current code has a drift guard manifest, which is a reasonable design, but the release note describes the opposite mechanism. This can mislead maintainers investigating parity failures or deciding where to add a new code-graph tool.
- Fix sketch: Update the changelog or add a note that later hardening introduced code-index-cli-manifest.ts as an explicit drift guard.
