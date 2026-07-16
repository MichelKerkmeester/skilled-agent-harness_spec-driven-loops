---
title: "Changelog: Code Graph + Advisor + Hooks Polish [008-real-world-usefulness-test-planning/007-readiness-hooks-advisor-polish]"
description: "Chronological changelog for the Code Graph + Advisor + Hooks Polish phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning/007-readiness-hooks-advisor-polish` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning`

### Summary

Phase 006 implements the remaining P1 clusters from the real-world usefulness research packet. The code changes are scoped to code graph readiness/query/context/verify, advisor rebuild/startup publication, and the glob-aware scope policy. Documentation-only findings update the Copilot, Gemini, and CocoIndex references.

### Added

- Gemini README now documents SessionStart, compact, and SessionEnd hook registration with smoke examples (F-013).
- code_graph_context seed normalizer accepts live CocoIndex snake_case fields alongside existing camelCase forms (F-016).
- Snake_case seed regression test added to code-graph-context-handler.vitest.ts (F-016).

### Changed

- Blocked-read payloads now expose active/stored scope diagnostics, manifest count, digest, and parse backlog (Cluster A).
- Query and context handlers use guarded inline full-scan path only when scope fingerprints match and parse-error backlog is clean (F-018).
- Verify now includes a scopePreflight result and blocks when active maintainer scope does not match stored graph scope (F-019).
- Scope fingerprints include sorted include/exclude glob dimensions when globs are present; v2 legacy fingerprints remain compatible on first scan (Cluster E).
- Copilot README aligned with implementation's raw text output instead of claiming status JSON (F-012).
- CocoIndex tool reference documents the live snake_case protocol and normalization expectations (F-017).
- startup skill-graph indexing asserts SQLite artifact, generation file, and advisor live status before publishing; failed assertion publishes stale (F-015).

### Fixed

- advisor_rebuild now repairs when either freshness or trust-state axis is bad; skips only when freshness is live and trust state is not absent (F-014).
- advisor-rebuild.vitest.ts covers live/absent repair regression.

### Verification

- Focused cluster vitest command - PASS: 7 files, 172 tests.
- F-015 focused vitest - PASS: 1 file, 1 test, 421 skipped.
- Query fallback compatibility vitest - PASS: 1 file, 6 tests.
- npx vitest run code_graph/tests/ - PASS: 20 files, 270 tests.
- npx vitest run skill_advisor/tests/ - FAIL: 36 files passed, 3 files failed, 285 tests passed, 3 tests failed.
- npx vitest run tests/ - FAIL: 7 failed suites and 116 failed tests observed in the dirty workspace.
- npm run build - PASS: exit 0.
- Child strict validation - PASS: exit 0.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts` | Modified | Add diagnostics and guarded full-scan readiness policy. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts` | Modified | Enable guarded auto-rescan for query reads. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts` | Modified | Enable guarded auto-rescan and normalize snake_case seed input. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/verify.ts` | Modified | Add scope-aware verify preflight. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts` | Modified | Add v3 glob-aware fingerprints and legacy comparison. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts` | Modified | Apply policy include/exclude glob dimensions to default config. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` | Modified | Pass globs into scope policy and use legacy-aware scope comparison. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts` | Modified | Repair live-but-absent trust state. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Assert post-index live publication before publishing live. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/README.md` | Modified | Align session-prime docs with text output. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/README.md` | Modified | Add startup/compact/end registration and smoke examples. |
| `.opencode/skills/mcp-coco-index/references/tool_reference.md` | Modified | Document live snake_case result protocol and interop note. |

### Follow-Ups

- Advisor test suite still fails broad parity and python-compat expectations outside the changed advisor rebuild predicate.
- Broad tests/ suite still fails across unrelated dirty-worktree areas; scoped query fallback and structural scan regressions now pass.
- Copilot README was restored/updated for F-012, but the wider deleted Copilot hook tree remains a separate workspace issue.
