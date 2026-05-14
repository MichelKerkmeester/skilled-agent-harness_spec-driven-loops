# Iteration 3: D2 Security — Operational Safety, Cross-Skill Integration

## Focus
D2 Security — Review operational safety, environment handling, cross-skill integration boundaries, and access control surface.

## Scorecard
- Dimensions covered: security
- Files reviewed: 4
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.50

## Findings

### P2 — Suggestion

- **F009**: The launcher's `loadEnvFile` function (mk-code-index-launcher.cjs:13-34) performs no content sanitization beyond stripping outer quotes. A malicious `.env.local` could inject arbitrary key-value pairs into `process.env`. Standard Node.js `.env` loaders have similar behavior, and the file is gitignored per the launcher's own comment (line 11). The risk is low because `.env.local` is operator-controlled and not committed, but there is no validation that loaded values match expected formats (e.g., checking that `SPECKIT_CODE_GRAPH_INDEX_*` values are `"true"`/`"false"`). — mk-code-index-launcher.cjs:13-34

- **F010**: The MCP config key in `.claude/mcp.json:38` is `mk_code_index` (underscore) while the server name in `index.ts:9` is `mk-code-index` (hyphen). The MCP SDK convention maps hyphens to underscores in registered keys, so this is correct behavior. However, the README.md correctly documents the client-facing namespace as `mcp__mk_code_index__*` (double underscore separators, underscore key). No documentation explicitly states the hyphen-to-underscore convention, creating a discoverability gap for operators who might expect the key to match the server name exactly. — .claude/mcp.json:38, index.ts:9

## Assessment
- No P0 or P1 security findings
- Operational safety is adequate: process signal handling (lines 227-236) catches SIGINT/SIGTERM/SIGHUP and forwards to child
- Bootstrap lock mechanism prevents concurrent startup races
- MAINTAINER_MODE env override requires explicit `.env.local` opt-in, which is gitignored
- Cross-skill boundaries are well-defined in architecture.md §4: memory boundary, skill-advisor boundary, CocoIndex boundary

## Ruled Out
- SIGKILL-untraceable lockdir: The `finally` block (lines 278-280) cleans up the lockdir on normal failures, and `artifactsReady()` (line 194) provides an escape hatch for stale locks
- No hardcoded secrets or API keys in any reviewed file
- mcp.json `_NOTE_*` keys are documentation-only and stripped by the MCP SDK

## Recommended Next Focus
D3 Traceability — spec vs implementation alignment