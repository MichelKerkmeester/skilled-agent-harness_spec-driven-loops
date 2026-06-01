---
title: "Local Embeddings Foundation Phase 051: Runtime Config mk-code-index Parity and Findings Remediation"
description: "Aligns three stale runtime MCP configs with the mk-code-index rename and closes bounded P1/P2 findings from two deep-review reports. All four runtime configs now use mk_code_index and the live launcher path."
trigger_phrases:
  - "runtime config mk-code-index parity"
  - "016 findings sweep"
  - "deep-review findings remediation"
  - "mk_code_index config alignment"
  - "system_code_graph rename cleanup"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/051-runtime-config-mk-code-index-parity-plus-findings` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

After the code-graph server was renamed to `mk-code-index`, three runtime client configs still carried the legacy `system_code_graph` server key and old launcher path. Operators using OpenCode, Codex or Gemini runtimes would attempt to connect through stale config identity that no longer matched the live launcher. Two deep-review reports (017 and 048) also carried open finding ledgers with no recorded remediation or deferral.

Track A updated `opencode.json`, `.codex/config.toml` and `.gemini/settings.json` to use `mk_code_index` and `.opencode/bin/mk-code-index-launcher.cjs`. `.claude/mcp.json` was verified already aligned and left unchanged. Track B closed bounded findings from both reports: the 017 P1 launcher fallback fix was applied. Both 048 P1 fixes (null-client guard and connect timeout) were confirmed already in source. Five bounded 048 P2 items were resolved. All remaining broad P2 work was deferred to named follow-on packets with explicit ledger entries.

Work landed in two commits on 2026-05-14: `2ad7f79fa` for config parity and `b74e0c95e` for bounded finding fixes.

### Added

- Bounded launcher fallback derivation from `path.basename(kitDir)` in `mk-code-index-launcher.cjs` (017 F012 fix)
- Primary-key routing test coverage for `spec_kit_memory` and `cocoindex_code` keys in the shared-daemon helper test (048 F011 fix)
- Two-client requirements and success criteria in the 046 shared-daemon-suite-runner spec (048 F008/F009 traceability)

### Changed

- `opencode.json`: config key renamed from `system_code_graph` to `mk_code_index`, launcher path updated to `mk-code-index-launcher.cjs`
- `.codex/config.toml`: config table and launcher path renamed to match the live server identity
- `.gemini/settings.json`: config key and launcher path renamed to match the live server identity
- `run-mcp-direct.mjs`: broadened shared-daemon error response detection to cover `status=error`, `status=failed` and `ok=false` (048 F004 fix)
- `045-shared-daemon-suite-runner/implementation-summary.md`: two-transport trade-off note added (048 F010 traceability)

### Fixed

- Legacy `system_code_graph` config key in three runtime mirrors caused MCP identity mismatch after the `mk-code-index` rename. All three mirrors now use `mk_code_index`.
- Launcher fallback path in `mk-code-index-launcher.cjs` was hard-coded rather than derived from the skill directory basename. Now derives from `path.basename(kitDir)` (017 F012).
- Shared-daemon error detection in `run-mcp-direct.mjs` missed `status=failed` and `ok=false` response shapes. Detection broadened to cover all three failure patterns (048 F004).
- Helper test in `shared-daemon-runner-helpers.vitest.ts` exercised only one client key. Now covers both `spec_kit_memory` and `cocoindex_code` primary keys (048 F011).

### Verification

| Check | Result |
|-------|--------|
| `git show 50cfabb6e2 --stat` | PASS: local rename commit found. Requested SHA `7cfc16ed9` absent from this checkout. |
| Config legacy grep | PASS: no `system_code_graph` or `system-code-graph-launcher` matches in any of the four runtime configs. |
| JSON parse (`opencode.json`, `.claude/mcp.json`, `.gemini/settings.json`) | PASS: all three parse cleanly with Node/JSON tooling. |
| TOML parse (`.codex/config.toml`) | PASS: parses with Python 3.11 `tomllib`. |
| OpenCode MCP smoke | PASS: `mk_code_index` connected through `.opencode/bin/mk-code-index-launcher.cjs`. Unrelated `system_skill_advisor` failure was out of scope. |
| Launcher syntax check | PASS: `node --check .opencode/bin/mk-code-index-launcher.cjs`. |
| Runner syntax check | PASS: `node --check _sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs` at commit time. |
| Helper vitest | PASS: `npx vitest run tests/shared-daemon-runner-helpers.vitest.ts` from `mcp_server`, 1 file, 2 tests. |
| 045 strict validation | PASS: `validate.sh .../046-shared-daemon-suite-runner --strict`, 0 errors, 0 warnings. |
| 016 strict validation | PASS: packet close-out confirmed. |

### Files Changed

| File | What changed |
|------|--------------|
| `opencode.json` | Config key renamed to `mk_code_index`. Launcher path updated to `mk-code-index-launcher.cjs`. |
| `.codex/config.toml` | Config table and launcher path renamed to match live server identity. |
| `.gemini/settings.json` | Config key and launcher path renamed to match live server identity. |
| `.opencode/bin/mk-code-index-launcher.cjs` | Fallback nested dist path now derived from `path.basename(kitDir)` rather than a hard-coded string. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/shared-daemon-runner-helpers.vitest.ts` | Primary-key coverage extended to both `spec_kit_memory` and `cocoindex_code`. |
| `_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs` | Broadened error detection for `status=error`, `status=failed` and `ok=false` shapes. |

### Follow-Ups

- Dispatch listed 5 P1 and 16 P2 findings but the checked-in 048 report contains 2 P1 and 12 P2. Confirm the dispatch source before reconciling counts in future sweeps.
- `opencode mcp list` showed `system_skill_advisor` failing with connection closed. That surface was out of scope for this packet. A follow-on sweep should diagnose the advisor startup failure.
- Pre-existing dirty runtime state (launcher timestamp JSON and search-decision logs) was not staged. Future commits should clarify which generated state files are intentional.
- Broad 048 P2 clusters deferred to `049-shared-daemon-runner-hardening` (safe argument parser, env allowlist, stderr opt-out, result aggregation, runner phase extraction) and `050-shared-daemon-test-hygiene` (broaden helper tests, resolve deep relative import strategy).
- Deferred 017 findings (F006/F011/F017) are tracked under `017-system-code-graph-architecture-and-artifact-policy` for architecture artifact policy and source-map path normalization.
