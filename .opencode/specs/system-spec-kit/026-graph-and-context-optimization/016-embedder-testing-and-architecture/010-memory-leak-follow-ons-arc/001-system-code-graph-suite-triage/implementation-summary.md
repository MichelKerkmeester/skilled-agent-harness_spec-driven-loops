---
title: "Implementation Summary: system-code-graph Vitest Suite Triage"
description: "Completed triage of the 31 pre-existing system-code-graph broader Vitest failures from arc 009 phase 007."
trigger_phrases:
  - "system-code-graph-suite-triage"
  - "010 follow-on 1"
  - "code-graph 31 failures triage"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-memory-leak-follow-ons-arc/001-system-code-graph-suite-triage"
    last_updated_at: "2026-05-22T15:53:50Z"
    last_updated_by: "codex"
    recent_action: "completed-arc-010-phase-001-system-code-graph-suite-triage"
    next_safe_action: "start-arc-010-phase-002-rss-benchmark"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "scratch/baseline-failures.md"
    session_dedup:
      fingerprint: "sha256:0a01010101010101010101010101010101010101010101010101010101010101"
      session_id: "010-memory-leak-follow-ons-arc-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Live baseline reproduced as 12 failing files / 31 failing tests before triage."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: system-code-graph Vitest Suite Triage

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-memory-leak-follow-ons-arc/001-system-code-graph-suite-triage` |
| **Prepared** | 2026-05-22 |
| **Completed** | 2026-05-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Closed the arc 009 phase 007 broader-suite baseline for `system-code-graph`.

- Reproduced the current suite baseline and wrote the exact 31-failure list to `scratch/baseline-failures.md`.
- Fixed two product bugs:
  - `TreeSitterParser.isReady('doc')` now returns true without parser initialization, matching doc parsing behavior.
  - `code_graph_query` `blast_radius` now honors `maxDepth: 0` instead of clamping it to depth 1.
- Updated stale tests and mocks after code-graph extraction/localization:
  - Runtime detection now mocks the local Codex hook-policy helper and scrubs all runtime env markers.
  - Startup brief tests mock local shared hook-state and CocoIndex path helpers.
  - Graph payload validator tests mock local shared-payload helpers.
  - Query-handler tests mock the sanitizer export now used by `handlers/query.ts`.
  - CCC readiness sibling tests mock the real CocoIndex readiness probe deterministically.
  - Symlink hardening tests mock the actual system-spec-kit validator modules imported by `memory-save.ts`.
- Added `code_graph_context` telemetry fields to the standalone `system-code-graph` tool schema and restored the local `validateToolArgs` compatibility export.
- Deleted one obsolete assertion that still expected `code_graph_context` to live in `system-spec-kit` Zod schemas after the standalone `system-code-graph` extraction.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The triage started from the live suite, not only the historical closure note. The baseline command reproduced the expected 12 failing files / 31 failing tests, with one path correction: the walker DoS caps failure now lives at `mcp_server/stress_test/code-graph/walker-dos-caps.vitest.ts`.

Each failing file was checked against its assertion target. Valid assertions were fixed either by a minimal product change or by updating stale mocks/assertions to match the current module boundaries. The one assertion tied to removed behavior was physically deleted, following the project rule that legacy test code is deleted rather than archived, commented out, or vaguely skipped.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Prefer FIX over skip/quarantine | All failures had local, low-risk causes: stale mocks, stale assertions, or small product mismatches. No broader design packet was required. |
| Delete the system-spec-kit direct Zod assertion | `code_graph_context` is owned by standalone `system-code-graph`; the old system-spec-kit schema assertion checked removed behavior. |
| Keep skipped count unchanged | No new `.skip()` calls were added; the final suite is green with the pre-existing 7 skipped tests. |
| Update tests to deterministic local mocks | Several failures were env-dependent because tests touched current Codex/CocoIndex/runtime state. Local mocks keep the suite stable. |
| Preserve scope | No architectural refactors or feature work were added beyond the failing assertion targets. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../001-system-code-graph-suite-triage --strict` after plan/task authoring | PASSED: exit 0, errors 0, warnings 0. |
| Baseline: `node node_modules/vitest/vitest.mjs run --config vitest.config.ts 2>&1 \| tee /tmp/code-graph-suite-baseline.log` from `.opencode/skills/system-code-graph` | Reproduced 12 failing files / 31 failing tests; full list in `scratch/baseline-failures.md`. |
| Targeted: `auto-rescan-policy`, `runtime-detection`, `graph-payload-validator`, `tree-sitter-parser` | PASSED: 4 files, 44 tests. |
| Targeted: `code-graph-context-cocoindex-telemetry-passthrough`, `code-graph-context-handler`, `edge-metadata-sanitize` | PASSED: 3 files, 30 tests. |
| Targeted: `code-graph-query-handler`, `startup-brief`, `code-graph-siblings-readiness`, `symlink-realpath-hardening`, `walker-dos-caps` | PASSED: 5 files, 52 tests. |
| Full suite: `node node_modules/vitest/vitest.mjs run --config vitest.config.ts` from `.opencode/skills/system-code-graph` | PASSED: 57 files passed, 1 skipped; 553 tests passed, 7 skipped; 0 failures. |
| `npm run typecheck` from `.opencode/skills/system-code-graph` | PASSED: exit 0. |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-code-graph` | PASSED: exit 0. Reported 10 pre-existing non-blocking TS module-header warnings. |
| Final strict validation commands | PASSED: phase folder, arc 010 parent, and arc 009 phase 007 all exited 0 with errors 0 and warnings 0. |

### Changed-Test Verification

| Test File | Outcome |
|-----------|---------|
| `mcp_server/tests/auto-rescan-policy.vitest.ts` | FIX; targeted pass. |
| `mcp_server/tests/runtime-detection.vitest.ts` | FIX; targeted pass. |
| `mcp_server/tests/graph-payload-validator.vitest.ts` | FIX; targeted pass. |
| `mcp_server/tests/tree-sitter-parser.vitest.ts` | FIX; targeted pass. |
| `mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` | FIX + DELETE obsolete assertion; targeted pass. |
| `mcp_server/tests/code-graph-context-handler.vitest.ts` | FIX; targeted pass. |
| `mcp_server/tests/edge-metadata-sanitize.test.ts` | FIX; targeted pass. |
| `mcp_server/tests/code-graph-query-handler.vitest.ts` | FIX; targeted pass. |
| `mcp_server/tests/startup-brief.vitest.ts` | FIX; targeted pass. |
| `mcp_server/tests/code-graph-siblings-readiness.vitest.ts` | FIX; targeted pass. |
| `mcp_server/tests/symlink-realpath-hardening.vitest.ts` | FIX; targeted pass. |
| `mcp_server/stress_test/code-graph/walker-dos-caps.vitest.ts` | FIX; targeted pass. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

None for this phase. The 31-failure baseline is closed with no new skips and no quarantined tests.
<!-- /ANCHOR:limitations -->

---

## Per-Test Triage Table

| File | Test | Outcome | Reason |
|------|------|---------|--------|
| `auto-rescan-policy.vitest.ts` | `blocks when backlog exactly equals threshold (backlog > threshold fails)` | FIX | Test contradicted product contract: only backlog greater than threshold blocks. Renamed and updated assertion. |
| `code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` | `accepts seed with raw_score, path_class, rankingSignals (snake_case wire)` | FIX | Standalone tool schema lacked telemetry fields and compatibility validator export. |
| `code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` | `accepts seed with rawScore, pathClass, rankingSignals (camelCase)` | FIX | Same standalone schema gap. |
| `code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` | `accepts a mixed seed (camelCase + snake_case) without rejecting` | FIX | Same standalone schema gap. |
| `code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` | `parses snake_case + camelCase telemetry fields` | DELETE | Obsolete assertion checked removed system-spec-kit Zod ownership after code_graph_context moved to system-code-graph. |
| `code-graph-context-handler.vitest.ts` | `counts every remaining anchor when a deadline expires mid-build` | FIX | Test mocked `performance.now`; implementation now uses `process.hrtime.bigint()` inside expansion. |
| `code-graph-context-handler.vitest.ts` | `surfaces omittedAnchors for multi-anchor deadline timeouts through the handler payload` | FIX | Same timer-source mismatch. |
| `code-graph-query-handler.vitest.ts` | `warns when fq_name resolution is ambiguous and prefers callable implementation nodes for calls_from` | FIX | Test mock omitted the sanitizer export now used by query edge mapping. |
| `code-graph-query-handler.vitest.ts` | `warns when name resolution is ambiguous after fq_name misses and prefers inbound-call candidates for calls_to` | FIX | Same stale mock. |
| `code-graph-query-handler.vitest.ts` | `re-ranks more than 10 ambiguous name matches after fq_name misses before selecting a calls_to candidate` | FIX | Same stale mock. |
| `code-graph-query-handler.vitest.ts` | `re-ranks more than 10 ambiguous fq_name matches before selecting a calls_from candidate` | FIX | Same stale mock. |
| `code-graph-query-handler.vitest.ts` | `adds nested edge evidence metadata without collapsing trust axes` | FIX | Same stale mock, plus assertion now checks the removed `trust` collapse rather than the current payload-level confidence echo. |
| `code-graph-query-handler.vitest.ts` | `aggregates payload-level edge trust from the weakest returned edge` | FIX | Same stale mock. |
| `code-graph-query-handler.vitest.ts` | `keeps relationship payloads parseable for the shared query adapter` | FIX | Same stale mock. |
| `code-graph-query-handler.vitest.ts` | `excludes dangling edges and reports corruption warnings instead of returning raw symbol IDs` | FIX | Same stale mock. |
| `code-graph-query-handler.vitest.ts` | `returns only the seed node when blast-radius maxDepth is zero` | FIX | Product bug: handler clamped `maxDepth` to 1. It now allows 0. |
| `code-graph-siblings-readiness.vitest.ts` | `emits canonical readiness fields for 'ccc-status'` | FIX | Test touched real CocoIndex probe state. Added deterministic readiness probe mock. |
| `code-graph-siblings-readiness.vitest.ts` | `emits canonical readiness fields for 'ccc-reindex'` | FIX | Same deterministic probe mock. |
| `code-graph-siblings-readiness.vitest.ts` | `emits canonical readiness fields for 'ccc-feedback'` | FIX | Same deterministic probe mock. |
| `edge-metadata-sanitize.test.ts` | `a sanitizer is referenced at each of 3 documented read-path sites (D7 coverage)` | FIX | Assertion referenced old local sanitizer name; query now uses exported `sanitizeEdgeMetadataString`. |
| `graph-payload-validator.vitest.ts` | `fails closed when query emission validation rejects the trust payload` | FIX | Test mocked old system-spec-kit shared-payload path; query uses local system-code-graph shared-payload. |
| `runtime-detection.vitest.ts` | `detects Codex CLI via CODEX_CLI=1` | FIX | Test mocked old relative Codex hook-policy path. |
| `runtime-detection.vitest.ts` | `returns false when runtime is unknown` | FIX | Test did not scrub current Codex/Copilot/Gemini env markers in this describe block. |
| `runtime-detection.vitest.ts` | `returns tool_fallback when hooks are not available` | FIX | Same runtime env cleanup gap. |
| `startup-brief.vitest.ts` | `builds graph outline and session continuity when data exists` | FIX | Test mocked old system-spec-kit hook-state path; startup brief uses local shared hook-state. |
| `startup-brief.vitest.ts` | `returns empty graph state with summary but no outline for empty indexes` | FIX | Same local shared hook-state mock path. |
| `startup-brief.vitest.ts` | `reports cocoindex as available when the binary exists` | FIX | Test mocked old system-spec-kit CocoIndex path helper; startup brief uses local helper. |
| `symlink-realpath-hardening.vitest.ts` | `blocks memory_save when a safe-looking spec path resolves into z_future` | FIX | Test mocked wrong validator modules; memory-save imports system-spec-kit utils directly. |
| `tree-sitter-parser.vitest.ts` | `TreeSitterParser.isReady returns true for doc language without init` | FIX | Product bug: doc language readiness was checked after parser initialization. |
| `tree-sitter-parser.vitest.ts` | `returns error parseHealth when tree has errors and no nodes extracted` | FIX | Test expected no nodes; current parser preserves a module sentinel while reporting `parseHealth: error`. |
| `walker-dos-caps.vitest.ts` | `stops descending spec discovery past the configured max depth and keeps shallower packets indexable` | FIX | Live path is under `stress_test`; mock returned a relative path that escaped temp root after `/private/tmp` realpath normalization. |

## Commit Handoff

Suggested commit:

```text
fix(010/001): system-code-graph suite triage - 31 failures resolved
```

Files for the parent Claude Code agent to stage explicitly:

- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/handlers/query.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/walker-dos-caps.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/auto-rescan-policy.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/code-graph-siblings-readiness.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/edge-metadata-sanitize.test.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/graph-payload-validator.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/runtime-detection.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/symlink-realpath-hardening.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/tree-sitter-parser.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/007-code-graph-launcher-and-db-lifecycle/implementation-summary.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-memory-leak-follow-ons-arc/spec.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-memory-leak-follow-ons-arc/001-system-code-graph-suite-triage/spec.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-memory-leak-follow-ons-arc/001-system-code-graph-suite-triage/plan.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-memory-leak-follow-ons-arc/001-system-code-graph-suite-triage/tasks.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-memory-leak-follow-ons-arc/001-system-code-graph-suite-triage/implementation-summary.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-memory-leak-follow-ons-arc/001-system-code-graph-suite-triage/scratch/baseline-failures.md
