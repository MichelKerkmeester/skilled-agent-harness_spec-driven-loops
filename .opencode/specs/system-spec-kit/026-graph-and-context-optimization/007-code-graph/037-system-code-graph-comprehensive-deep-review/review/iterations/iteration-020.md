# Iteration 020 — system-code-graph: Cross-runtime config registration consistency (mk_code_index in all 6 configs + master install README §10.4 + changelog/v1.0.0.0.md)

## Summary

All 6 runtime configs register mk_code_index with the correct launcher path and core environment variables, but there are three inconsistencies: (1) Codex and Devin configs set all 5 SPECKIT_CODE_GRAPH_INDEX_* flags to "false" while the other four configs set them to "true", creating divergent default behavior across runtimes; (2) the master install README lacks a dedicated §10.4 subsection for mk_code_index despite the changelog claiming it was added; (3) Codex config is missing the _NOTE_AUTO_MIGRATION comment that appears in the other configs. Verdict: P1 findings for inconsistent index defaults and missing README section.

## Files Reviewed

- `opencode.json` (lines read: 97)
- `.claude/mcp.json` (lines read: 77)
- `.codex/config.toml` (lines read: 125)
- `.gemini/settings.json` (lines read: 176)
- `.devin/config.json` (lines read: 79)
- `.vscode/mcp.json` (lines read: 79)
- `.opencode/install_guides/README.md` (lines read: 473 of 1602)
- `.opencode/skills/system-code-graph/changelog/v1.0.0.0.md` (lines read: 76)

## Findings

### P0 (release-blocking)

| ID | File:line | Finding | Why P0 | Remediation |
|----|-----------|---------|--------|-------------|
| — | — | None | — | — |

### P1 (high priority)

| ID | File:line | Finding | Why P1 | Remediation |
|----|-----------|---------|--------|-------------|
| 020-001 | .codex/config.toml:51-55; .devin/config.json:50-54 | SPECKIT_CODE_GRAPH_INDEX_* flags set to "false" while opencode.json, .claude/mcp.json, .gemini/settings.json, and .vscode/mcp.json set them to "true" | Creates divergent default behavior across runtimes — Codex and Devin users get no indexing by default while other runtimes auto-index on first scan, violating the cross-runtime consistency principle stated in the changelog | Align all 6 configs to the same default (likely "false" per the end-user-safe design intent in the changelog) |
| 020-002 | .opencode/install_guides/README.md | No §10.4 subsection exists for mk_code_index/System Code Graph despite changelog v1.0.0.0 line 40 claiming "added mk_code_index to the master install README (§7.1 Component Matrix, §7.3 Bundles, new §10.4 Phase-3 subsection, §19 Related Documents)" | Changelog documents a feature that doesn't exist — users following the install guide have no dedicated Phase-3 subsection for mk_code_index setup, breaking the documented installation workflow | Add §10.4 "System Code Graph (mk_code_index)" subsection to Phase 3: MCP Servers following the pattern of other MCP server sections |
| 020-003 | .codex/config.toml:23-30 | Missing _NOTE_AUTO_MIGRATION comment for mk-spec-memory that appears in opencode.json:35, .claude/mcp.json:25, .gemini/settings.json:42, .devin/config.json:25, .vscode/mcp.json:25 | Inconsistent documentation across runtimes — Codex users miss the auto-migration opt-out information that is present in all other configs | Add _NOTE_AUTO_MIGRATION comment to [mcp_servers."mk-spec-memory".env] section |

### P2 (nice-to-have)

| ID | File:line | Finding | Why P2 | Remediation |
|----|-----------|---------|--------|-------------|
| 020-004 | .claude/mcp.json:46; .gemini/settings.json:68 | mk_code_index env uses "_NOTE_1_TOOLS" while opencode.json:59, .codex/config.toml:48, .devin/config.json:47, .vscode/mcp.json:47 use "_NOTE_1_DB" for the first note | Inconsistent comment key naming across configs — Claude and Gemini omit the DB path note that other configs include, making the documentation slightly less comprehensive | Standardize on "_NOTE_1_DB" pattern across all 6 configs for consistency |

## Convergence Signal

newInfoRatio 0.9 vs prior iterations — this is the first iteration to examine cross-runtime config consistency, so nearly all findings are new evidence about the registration surface.
