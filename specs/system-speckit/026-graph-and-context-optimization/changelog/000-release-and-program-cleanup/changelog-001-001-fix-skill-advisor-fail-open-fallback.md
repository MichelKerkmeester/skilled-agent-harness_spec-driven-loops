---
title: "Skill-Advisor Release Remediation: Fail-Open Fallback and Trusted-Caller Gate"
description: "Closed 3 P1 release blockers and 15 P2 advisories from the 008/008 deep review. Fixes cover advisor unavailable fail-open, public scan caller-authority gate, missing regression coverage, recovery hardening, diagnostic path redaction plus pattern consolidation."
trigger_phrases:
  - "skill-advisor fail-open fallback"
  - "advisor_recommend unavailable branch"
  - "skill_graph_scan trusted caller gate"
  - "008/008 review remediation"
  - "001-fix-skill-advisor-fail-open-fallback"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-28

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/001-fix-skill-advisor-fail-open-fallback` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness`

### Summary

The 008/008 deep review surfaced three release-blocking gaps in the skill-advisor runtime. `advisor_recommend` did not fail open when freshness was unavailable, so a broken or unreachable graph could still return authoritative-looking recommendations. `skill_graph_scan` had no caller-authority check, meaning any MCP caller could trigger a mutable reindex and publish a new generation. Active review invariants lacked failing-before regression tests, so regressions would pass silently.

All three P1s were closed at the runtime boundary with test-first regressions. The remediation ran across four phases: P1 runtime closures, live-path recovery and rebuild concurrency hardening, diagnostic path redaction with documentation cleanup, plus pattern consolidation to remove drift risk from repeated structures.

The full closure covers 18/18 source findings (3 P1 and 15 P2). Typecheck, build, 87-test vitest suite, 4 pytest cases plus strict packet validation all passed on completion.

### Added

- `unavailableOutput()` helper in `advisor-recommend.ts` mirrors `absentOutput()`. The branch activates when freshness is `'unavailable'` and returns empty recommendations with `advisor_unavailable` trust state. Scoring is never called.
- `trusted-caller.ts` in `lib/auth/` provides a `requireTrustedCaller()` helper that accepts or rejects a caller context, centralizing the trust check across scan and future mutation operations.
- `sqlite-integrity.ts` in `lib/freshness/` exposes a shared `checkSqliteIntegrity()` function used by both the live DB init path and the rebuild recovery path.
- `lane-registry.ts` in `lib/scorer/` becomes the single source of scorer lane ids, weights plus schema metadata. Derived exports replace hand-maintained parallel lists across `types.ts`, `weights-config.ts`, `fusion.ts` plus `advisor-tool-schemas.ts`.
- `contract.ts` in `lib/compat/` and its `compat-contract.json` sidecar define the shared advisor compatibility contract consumed by the Python `skill_advisor.py` script and the plugin bridge.
- Five regression test files added: `advisor-recommend-unavailable.vitest.ts`, `skill-graph-scan-auth.vitest.ts`, `skill-graph-corruption-recovery.vitest.ts`, `skill-graph-rebuild-concurrency.vitest.ts` plus `skill-graph-diagnostic-redaction.vitest.ts`. Each failed against the unfixed code and passed after the corresponding fix.

### Changed

- `skill_graph_scan` in `handlers/skill-graph/scan.ts` now gates mutation on `callerContext.trusted`. Untrusted callers receive a typed `UNTRUSTED_CALLER` rejection. No mutation or generation publication occurs for untrusted calls.
- Caller context flows from `context-server.ts` through `tools/index.ts` and `tools/skill-graph-tools.ts` into the scan handler. The dispatcher now derives and threads trust metadata rather than ignoring it.
- `initDb()` in `lib/skill-graph/skill-graph-db.ts` now runs a SQLite `PRAGMA quick_check` before opening the authoritative graph. A malformed database triggers recovery before any caller can hit broken state.
- `rebuildFromSource()` in `lib/freshness/rebuild-from-source.ts` now wraps integrity check, rename plus rebuild in a per-path lease with busy-retry. Concurrent callers serialize instead of racing over the same database.
- Diagnostic envelopes in `scan.ts`, `advisor-status.ts`, `generation.ts` plus the plugin bridge redact local filesystem and process paths from public output.
- `response-envelope.ts` in `handlers/skill-graph/` provides a shared response schema and redaction helper. `query.ts` and `status.ts` consume it instead of maintaining separate envelope logic.
- `state-mutation.ts` in `lib/daemon/` extracts the daemon mutation retry boundary. `watcher.ts` routes all daemon DB mutations through this helper.
- Shared SQLite fixture in `tests/fixtures/skill-graph-db.ts` replaces duplicate `writeGraphMetadata()` setup in `skill-graph-handlers.vitest.ts` and `skill-graph-db.vitest.ts`.

### Fixed

- `advisor_recommend` returned scored recommendations when graph state was broken or the daemon was unreachable. The `unavailableOutput()` branch prevents scoring from running in that state.
- `skill_graph_scan` accepted mutation requests from any MCP caller. The trusted-caller gate rejects untrusted callers before any SQLite write or generation publication.
- The 008/008 packet used `mcp_server/skill-advisor` (hyphen) in some paths and `mcp_server/skill_advisor` (underscore) in others. All runtime path references now use the underscore spelling.
- The feature catalog recorded the `derived_generated` lane weight as 0.10 while the runtime shipped 0.15. The catalog, decision record plus implementation summary now all use 0.15.
- The promotion-gate documentation referenced `lib/promotion/gate-bundle.ts`, which did not exist. The summary now traces gate behavior to real `advisor_validate` slices.
- The 008/008 checklist lacked file:line evidence anchors on completed items. Each checked item now resolves to a specific file and line.

### Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/handlers/advisor-recommend-unavailable.vitest.ts` before fix | FAIL, exit 1. Unavailable status still produced recommendations. |
| `npx vitest run tests/handlers/advisor-recommend-unavailable.vitest.ts` after fix | PASS, exit 0. |
| `npx vitest run tests/handlers/skill-graph-scan-auth.vitest.ts` before fix | FAIL, exit 1. Untrusted scan could mutate. |
| `npx vitest run tests/handlers/skill-graph-scan-auth.vitest.ts` after fix | PASS, exit 0. |
| `npx vitest run tests/skill-graph-corruption-recovery.vitest.ts stress_test/skill-advisor/skill-graph-rebuild-concurrency.vitest.ts tests/skill-graph-diagnostic-redaction.vitest.ts` before fixes | FAIL, exit 1. Malformed DB, concurrent rebuild plus path leakage paths were exposed. |
| Focused vitest set (5 remediation files) | PASS, exit 0. |
| Full vitest set (11 files, 87 tests) | PASS, exit 0. |
| `python3 -m pytest skill_advisor/tests/python/test_skill_advisor.py` | PASS, exit 0. 4 tests. |
| `npm run typecheck` | PASS, exit 0. |
| `npm run build` | PASS, exit 0. |
| `bash validate.sh 002-skill-graph-daemon-native-advisor-tools --strict` | PASS, exit 0. |
| `bash validate.sh 001-fix-skill-advisor-fail-open-fallback --strict` | PASS, exit 0. |
| 18/18 source findings disposition table | All closed with file:line evidence. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts` | Modified | Added unavailable fail-open branch before scoring. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-recommend-unavailable.vitest.ts` (NEW) | Created | Covers unavailable fail-open and no-scorer-call behavior. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/auth/trusted-caller.ts` (NEW) | Created | Centralizes trusted caller validation. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Derives trusted caller metadata for downstream handlers. |
| `.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts` | Modified | Threads caller context through dispatch. |
| `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts` | Modified | Passes caller context into skill-graph handlers. |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/scan.ts` | Modified | Gates mutation on trusted callers. Uses shared redacted envelopes. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/skill-graph-scan-auth.vitest.ts` (NEW) | Created | Covers trusted and untrusted scan paths. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` | Modified | Runs SQLite integrity quick_check in live DB initialization. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/freshness/sqlite-integrity.ts` (NEW) | Created | Shared SQLite integrity checking utility. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/freshness/rebuild-from-source.ts` | Modified | Serializes rebuild recovery with lease and busy retry. |
| `.opencode/skills/system-skill-advisor/mcp_server/stress_test/skill-advisor/skill-graph-rebuild-concurrency.vitest.ts` (NEW) | Created | Covers concurrent rebuild serialization. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph-diagnostic-redaction.vitest.ts` (NEW) | Created | Covers path redaction across public diagnostics. |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/response-envelope.ts` (NEW) | Created | Shared response envelopes and redaction helpers for skill-graph handlers. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts` (NEW) | Created | Single source of scorer lane ids, weights plus schema metadata. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/compat/contract.ts` (NEW) | Created | Shared advisor compatibility contract definition. |
| `.opencode/skills/system-skill-advisor/mcp_server/schemas/compat-contract.json` (NEW) | Created | JSON sidecar consumed by non-TS runtimes. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/state-mutation.ts` (NEW) | Created | Shared daemon mutation retry boundary. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/fixtures/skill-graph-db.ts` (NEW) | Created | Shared SQLite graph metadata fixture setup for tests. |

### Follow-Ups

None.
