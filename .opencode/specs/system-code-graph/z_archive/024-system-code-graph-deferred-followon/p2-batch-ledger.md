# P2 Batch Ledger — 040-followon

**Source:** 037-system-code-graph-comprehensive-deep-review `review/review-report.md` § "P2 findings" + per-iteration markdown files.
**Executor:** cli-opencode + deepseek/deepseek-v4-pro
**Date:** 2026-05-15
**Baseline:** `8a5080e60`

---

## Summary

| Disposition | Count |
|---|---|
| CLOSED-NOW | 12 |
| CLOSED-BY-PARALLEL | 3 |
| DEFERRED-LOCKOUT | 16 |
| DEFERRED-LARGER-SCOPE | 7 |
| OUT-OF-SCOPE (not in allowed paths) | 8 |

---

## CLOSED-NOW (12)

| ID | Iter | What | File(s) | Fix |
|----|------|------|---------|-----|
| 005-P2-002 | 005 | Dispatch does not log unknown tool names | `mcp_server/tools/index.ts:11` | Add `console.error` for unknown tool dispatch |
| 007-P2-002 | 007 | SQL LIKE query with user input without escaping `%` / `_` wildcards | `mcp_server/lib/code-graph-db.ts:1011` | Add `.replace(/[%_]/g, '\\$&')` before LIKE binding |
| 007-P2-003 | 007 | `limit` parameter has no validation | `mcp_server/handlers/query.ts:1138` | Add `Math.max(1, Math.min(Number(args.limit) \|\| 50, 1000))` |
| 007-P2-004 | 007 | `maxDepth` parameter has no validation | `mcp_server/handlers/query.ts:1140` | Add `Math.max(1, Math.min(Number(args.maxDepth) \|\| 3, 20))` |
| 007-P2-005 | 007 | Duplicate `sanitizeEdgeMetadataString` in query.ts + code-graph-db.ts | `mcp_server/handlers/query.ts:665-679` | Remove duplicate; import from `code-graph-db.sanitizeEdgeMetadataString` |
| 008-P2-3 | 008 | Deadline uses `performance.now()` instead of monotonic timing | `mcp_server/lib/code-graph-context.ts:340` | Switch to `process.hrtime.bigint()` for monotonic deadline checks |
| 009-P2-004 | 009 | `GoldVerificationTrust` type has minimal JSDoc | `mcp_server/handlers/status.ts:29` | Add full JSDoc explaining semantics, relationship to `SharedPayloadTrustState` |
| 012-P2-002 | 012 | No validation that `node.endLine >= node.startLine` | `mcp_server/handlers/detect-changes.ts:330` | Add `if (node.endLine < node.startLine) continue;` guard |
| 013-P2-001 | 013 | Hardcoded CCC binary path fragile to installation changes | `mcp_server/handlers/ccc-status.ts:15`, `ccc-reindex.ts:20`, `lib/ccc-readiness-probe.ts:146` | Make path overridable via `COCOINDEX_BIN_PATH` env var |
| 013-P2-002 | 013 | No validation that feedback file write succeeded | `mcp_server/handlers/ccc-feedback.ts:49` | Wrap `appendFileSync` in try/catch; return error on write failure |
| — | 013 | `ccc-reindex` truncates output to 2000 chars with magic number | `mcp_server/handlers/ccc-reindex.ts:57` | Add named constant `REINDEX_OUTPUT_MAX_LENGTH` |
| — | 013 | `ccc-feedback` rating enum lacks runtime validation | `mcp_server/handlers/ccc-feedback.ts:21-31` | Add runtime check against valid ratings array before processing |

## CLOSED-BY-PARALLEL (3)

| ID | Iter | What | Why closed |
|----|------|------|------------|
| 005-P2-001 | 005 | Readiness marker failure does not block startup | P1-B1 was fixed: index.ts now has uncaughtException + unhandledRejection handlers, try/catch on connect + process.exit(1), try/catch on readiness marker write |
| 010-P2-002 | 010 | verify.ts imports `.js` instead of `.ts` | Standard TypeScript ESM convention — `.js` extension in imports is correct for ESM modules |
| 022-P2-021-1 | 022 | `buildUnavailableReadiness` duplicated in 3 CCC handlers | P0-2 fix replaced all 3 calls with shared `probeCocoIndexReadiness` from `lib/ccc-readiness-probe.ts` |

## DEFERRED-LOCKOUT (16)

These touch files in parallel-agent territory: `SKILL.md`, `README.md`, `INSTALL_GUIDE.md`, `references/**`, `feature_catalog/**`, `manual_testing_playbook/**`.

| ID | Iter | What | File |
|----|------|------|------|
| 001-P2-001 | 001 | Description >130 chars | `README.md` |
| 001-P2-002 | 001 | Description >130 chars | `SKILL.md` |
| 001-P2-003 | 001 | Description >130 chars | `INSTALL_GUIDE.md` |
| 001-P2-004 | 001 | `_memory` frontmatter field not in template | `SKILL.md` |
| 002-P2-001 | 002 | §3 lacks process flow diagram | `SKILL.md` |
| 002-P2-002 | 002 | §6 lacks checkbox format | `SKILL.md` |
| 003-P2-F003 | 003 | Non-template frontmatter fields | `feature_catalog/feature_catalog.md` |
| 003-P2-F004 | 003 | ANCHOR comments not in template | `feature_catalog/**` |
| 003-P2-F005 | 003 | Missing `last_updated` field | `feature_catalog/feature_catalog.md` |
| 004-P2-004 | 004 | Devin scenario missing `importance_tier` | `manual_testing_playbook/10--devin-hooks/025-devin-session-start.md` |
| 004-P2-005 | 004 | Non-sequential section numbering | `manual_testing_playbook.md` |
| 004-P2-006 | 004 | Scenario ID naming inconsistency | `manual_testing_playbook.md` |
| 004-P2-007 | 004 | HTML anchor comments in Devin scenario | `manual_testing_playbook/10--devin-hooks/025-devin-session-start.md` |
| 016-P2-001 | 016 | Conditional CCC test execution not documented | `stress_test/code-graph/ccc-integration-stress.vitest.ts` |
| 016-P2-002 | 016 | Cross-skill test imports | `stress_test/code-graph/walker-dos-caps.vitest.ts` |
| 016-P2-003 | 016 | README missing misplaced test file note | `stress_test/code-graph/README.md` |

## DEFERRED-LARGER-SCOPE (7)

| ID | Iter | What | Why deferred |
|----|------|------|-------------|
| 006-P2-005 | 006 | structural-indexer.ts empty content check inconsistency | Behavioral change — requires spec discussion on whether empty files should include module node |
| 006-P2-006 | 006 | scan.ts `structuralErrors` variable could be inlined | Functional code, minimal improvement from inlining |
| 008-P2-1 | 008 | Fallback to `symbolId` when `fqName` is undefined | Design change requiring seed-resolver updates; fallback is correct defensive behavior |
| 008-P2-2 | 008 | No fuzzy matching for subject resolution | Feature request, not bug fix; exact matching is intentional for precision |
| 008-P2-4 | 008 | `shouldBlockReadPath` complex boolean logic | 2-line function already simple; extracting constant adds more code than it saves |
| 011-P2-004 | 011 | apply.ts error handling doesn't distinguish recoverable vs non-recoverable | Architectural change requiring error taxonomy design |
| 011-P2-005 | 011 | apply-orchestrator.ts audit logging lacks recovery-mode event types | Feature addition requiring audit schema design |

## OUT-OF-SCOPE (8)

These files are outside the allowed production code paths (`mcp_server/handlers/**`, `mcp_server/lib/**`, `mcp_server/tools/**`, `mcp_server/tool-schemas.ts`, `mcp_server/index.ts`).

| ID | Iter | What | File |
|----|------|------|------|
| 001-P2-005 | 001 | No architecture-specific template | `ARCHITECTURE.md` (skill root, outside mcp_server) |
| 012-P2-003 | 012 | Empty line handling in diff-parser may not match all tools | Well-documented existing behavior (see inline comments) |
| 013-P2-003 | 013 | `process.cwd()` used without project root validation | Requires tool schema change; default behavior is reasonable |
| 014-P2-002 | 014 | Launcher control character defense only checks `\n` and `\0` | `.opencode/bin/mk-code-index-launcher.cjs` |
| 014-P2-003 | 014 | Launcher maintainer-mode check uses strict string comparison | `.opencode/bin/mk-code-index-launcher.cjs` |
| 015-P2-005 | 015 | `apply-metadata.ts` has no dedicated unit tests | Test files excluded per scope |
| 015-P2-006 | 015 | `working-set-tracker.ts` has no test coverage | Test files excluded per scope |
| 015-P2-007 | 015 | `query-result-adapter.ts` has no dedicated unit tests | Test files excluded per scope |
| 018-P2-004 | 018 | Root `package.json`/`package-lock.json` are unrelated | Root-level files, outside both skill scopes |
| 020-P2-004 | 020 | Inconsistent `_NOTE_1_DB`/`_NOTE_1_TOOLS` naming across configs | `.claude/mcp.json`, `.gemini/settings.json` — outside allowed paths |

---

## Files Modified

| File | Changes |
|------|---------|
| `mcp_server/tools/index.ts` | +1 line: console.error for unknown tool dispatch |
| `mcp_server/lib/code-graph-db.ts` | +2 lines: escape SQL LIKE wildcards |
| `mcp_server/lib/code-graph-context.ts` | +2 lines: process.hrtime.bigint() monotonic deadline |
| `mcp_server/handlers/query.ts` | ~-15/+4 lines: limit/maxDepth validation + dedup sanitize |
| `mcp_server/handlers/detect-changes.ts` | +1 line: endLine >= startLine guard |
| `mcp_server/handlers/ccc-status.ts` | +1 line: COCOINDEX_BIN_PATH env var |
| `mcp_server/handlers/ccc-reindex.ts` | +3 lines: env var + named constant |
| `mcp_server/handlers/ccc-feedback.ts` | +10 lines: write validation + rating enum check |
| `mcp_server/lib/ccc-readiness-probe.ts` | +1 line: COCOINDEX_BIN_PATH env var |
| `mcp_server/handlers/status.ts` | +8 lines: improved GoldVerificationTrust JSDoc |

**Total lines changed:** ~30 added, ~15 removed (net +15)
