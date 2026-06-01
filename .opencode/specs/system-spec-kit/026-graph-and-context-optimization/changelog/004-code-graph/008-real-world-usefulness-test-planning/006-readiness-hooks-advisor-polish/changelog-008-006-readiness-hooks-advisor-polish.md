---
title: "Code Graph + Advisor + Hooks Polish (Phase 006)"
description: "Five P1 clusters shipped: read-path diagnostics and guarded auto-rescan, hook doc parity for Copilot and Gemini, advisor rebuild and startup hardening, CocoIndex snake_case seed normalization. Glob-aware scope fingerprints with v2 legacy compatibility also shipped."
trigger_phrases:
  - "readiness hooks advisor polish"
  - "cluster a to e code graph"
  - "glob-aware scope fingerprint"
  - "CocoIndex snake_case seed normalization"
  - "advisor rebuild mixed-axis predicate"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-06

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning/006-readiness-hooks-advisor-polish` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning`

### Summary

The Phase 012 deep research left 12 P1 findings unresolved after the P0 remediation work. Blocked-read payloads gave operators no scope or parse diagnostics. The advisor rebuild predicate only triggered on one bad axis and silently passed when the other was bad. Startup live-publication skipped artifact assertion. Hook READMEs for Copilot and Gemini diverged from actual output. CocoIndex MCP output used snake_case fields that the context handler did not accept. Scope fingerprints omitted glob dimensions, so glob-narrowed graphs could silently replace full-scope graphs.

Five clusters were delivered in one bounded packet:

- **Cluster A: Read-path diagnostics and guarded auto-rescan.** Blocked-read payloads now expose `activeScope`, `storedScope`, `manifestCount`, `manifestDigest` plus the parse-backlog reason. Query and context handlers use a shared guarded inline full-scan path. Verify adds a `scopePreflight` result and blocks on scope mismatch.
- **Cluster B: Hook documentation parity.** The Copilot README no longer claims session-prime prints status JSON. The Gemini README now documents SessionStart, compact, SessionEnd registration alongside BeforeAgent advisor registration with smoke examples.
- **Cluster C: Advisor hardening.** `advisor_rebuild` now repairs when freshness or trust-state is bad, not only when freshness is bad. Startup skill-graph indexing asserts the SQLite artifact plus the generation file and advisor live status before publishing live state.
- **Cluster D: CocoIndex interop.** `code_graph_context` seed normalization now accepts raw CocoIndex snake_case fields (`file_path`, `start_line`, `end_line`, `content`) alongside existing camelCase forms. The CocoIndex reference documents the live protocol and interop expectations.
- **Cluster E: Glob-aware scope fingerprints.** Fingerprints now include sorted include/exclude glob dimensions when globs are present, tagged as v3. Stored v2 fingerprints parse with legacy compatibility so existing persisted metadata does not crash or block first-repair scans.

The focused regression set and the full code-graph suite passed. The TypeScript build passed. Global advisor and integration suites had pre-existing failures outside the changed surfaces.

### Added

- Readiness diagnostics fields (`activeScope`, `storedScope`, `manifestCount`, `manifestDigest`) on blocked-read payloads in `ensure-ready.ts`
- Guarded auto-rescan policy path in query and context handlers (requires scope and parse-backlog safety checks)
- `scopePreflight` result field on `code_graph_verify` responses
- Gemini hook SessionStart, compact, SessionEnd registration and smoke examples in `hooks/gemini/README.md`
- snake_case seed normalization for `file_path`, `start_line`, `end_line` plus `content` in `context.ts`
- snake_case seed regression test in `code-graph-context-handler.vitest.ts`
- v3 glob-aware scope fingerprints in `index-scope-policy.ts` when include/exclude globs are non-empty

### Changed

- `advisor_rebuild` predicate now skips only when both `freshness === "live"` and trust state is not `absent`. Previously skipped when freshness alone was live.
- Startup live-publication in `context-server.ts` now asserts SQLite artifact plus generation file and advisor live status before publishing live state. Failed assertion publishes `stale/post-index-assertion-failed`.
- Copilot README session-prime smoke description updated to match raw text output rather than claiming status JSON
- CocoIndex tool reference updated to document canonical snake_case result fields and normalization expectations for consumers
- `scan.ts` now passes include/exclude globs into the scope policy and uses legacy-aware comparison for stored fingerprints

### Fixed

- `code_graph_verify` did not check whether active runtime scope matched stored graph scope. Scope-preflight result now blocks or reports mismatch clearly.
- `advisor_rebuild` silently passed when trust state was `absent` but freshness was `live`. Mixed-axis repair now triggers in this case.
- Startup advisor live-publication skipped artifact assertion, which allowed advertising live state when the SQLite artifact or generation file was missing.
- `code_graph_context` rejected raw CocoIndex MCP seeds because they used snake_case field names. Normalization now accepts both field shapes.
- Scope fingerprints omitted glob dimensions, so glob-narrowed scans could overwrite full-scope graphs without triggering a mismatch. v3 fingerprints block this case.

### Verification

| Check | Result |
|-------|--------|
| Focused cluster vitest (7 files) | PASS: 172 tests |
| F-015 focused vitest (1 file) | PASS: 1 test, 421 skipped |
| Query fallback compatibility vitest (1 file) | PASS: 6 tests |
| `npx vitest run code_graph/tests/` | PASS: 20 files, 270 tests |
| `npx vitest run skill_advisor/tests/` | FAIL: 3 files failed, 3 tests failed (pre-existing parity and python-compat failures outside changed surface) |
| `npx vitest run tests/` | FAIL: 7 suites failed, 116 tests failed (pre-existing dirty-workspace failures unrelated to targeted fixes) |
| `npm run build` | PASS: exit 0 |
| Child strict validation (`validate.sh --strict`) | PASS: exit 0 |
| Parent strict validation | PASS: exit 0 |

### Files Changed

| File | What changed |
|------|--------------|
| `code_graph/lib/ensure-ready.ts` | Added diagnostics fields and guarded full-scan readiness policy |
| `code_graph/handlers/query.ts` | Enabled guarded auto-rescan for query reads |
| `code_graph/handlers/context.ts` | Enabled guarded auto-rescan. Added snake_case seed normalization. |
| `code_graph/handlers/verify.ts` | Added scope-aware verify preflight result |
| `code_graph/lib/index-scope-policy.ts` | Added v3 glob-aware fingerprints with legacy v2 parsing compatibility |
| `code_graph/lib/indexer-types.ts` | Applied policy include/exclude glob dimensions to default config |
| `code_graph/handlers/scan.ts` | Passes globs into scope policy. Uses legacy-aware scope comparison. |
| `skill_advisor/handlers/advisor-rebuild.ts` | Repaired mixed-axis predicate to trigger on absent trust state |
| `context-server.ts` | Added post-index live publication assertion before publishing live state |
| `hooks/copilot/README.md` | Aligned session-prime doc with raw text output |
| `hooks/gemini/README.md` | Added SessionStart/compact/SessionEnd registration and smoke examples |
| `mcp-coco-index/references/tool_reference.md` | Documented live snake_case result protocol and normalization interop note |

### Follow-Ups

- Triage the pre-existing `skill_advisor/tests/` parity and python-compat failures in a separate cleanup packet. These are outside the changed advisor rebuild predicate and were present before this packet shipped.
- Restore the deleted Copilot hook tree in a separate workspace cleanup. The Copilot README was corrected for F-012 but the wider deleted hook files are out of scope here.
- Confirm glob-aware fingerprint v3 behavior against a real persisted v2 store once the dirty-workspace deletions are repaired.
