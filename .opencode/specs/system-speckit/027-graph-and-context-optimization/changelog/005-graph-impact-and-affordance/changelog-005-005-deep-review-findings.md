---
title: "Graph Impact and Affordance: Deep-Review Remediation"
description: "Wave 1 remediation closing all 21 P1 and 12 actionable P2 findings from a 7-iteration deep-review pass across the graph-impact-and-affordance sub-phases. Six themed task groups shipped: detect_changes MCP wiring, verification evidence sync, public API surface gaps, sanitization hardening, trust-badges SQL test rig fix plus doc/label cleanup."
trigger_phrases:
  - "deep review remediation 010/007"
  - "detect_changes MCP wiring"
  - "trust badges SQL fix"
  - "affordance sanitization hardening"
  - "blast radius overflow fix"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-graph-impact-and-affordance/005-deep-review-findings` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-graph-impact-and-affordance`

### Summary

A 7-iteration deep-review pass across the graph-impact-and-affordance sub-phases (001 through 006) surfaced 1 P0 plus 21 P1 plus 22 P2 findings. The P0 (a missing LICENSE verbatim quote) was resolved by scrubbing the upstream project name from the codebase entirely. The remaining findings clustered into six task groups. All 21 P1 findings and 12 actionable P2 findings were closed in Wave 1.

The work covered: wiring `detect_changes` as a callable MCP tool across 4 code touchpoints and 6 documentation surfaces. It also covered syncing real verification command output across 10 sub-phase docs, exposing `minConfidence` on the `code_graph_query` public schema, hardening 7 files against path-traversal, prompt-injection and malformed-badge payloads, fixing the trust-badges SQL test rig via a dependency-injection seam that also caught a latent bind-type bug and cleaning up broken links, conflicting tool counts and a Python smoke-test path error in the install guide.

### Added

- `detect_changes` entry added to the MCP dispatcher, `TOOL_DEFINITIONS`, `TOOL_SCHEMAS` and `ALLOWED_PARAMETERS` ledger, completing the operator-callable surface
- `minConfidence` parameter on `code_graph_query` Zod schema, JSON schema and allowed-parameter ledger with 6 acceptance/rejection vitest cases
- `affordanceNormalizerCounters` module-level counters (received, accepted, dropped_unsafe, dropped_empty, dropped_unknown_skill) in both TS and Python affordance normalizers
- Shared adversarial fixture `affordance-injection-fixtures.json` with 28 injection, 11 benign and 4 privacy phrases consumed by both TS and Python test suites
- `causalEdgesGeneration` counter in `causal-edges.ts` folded into `memory_search` cache key when `enableCausalBoost` is true
- Stable `failureFallback.code` literal union and `spec_kit.graph.blast_radius_failure_total` metric on `computeBlastRadius`

### Changed

- `detect_changes` documentation updated across README, SKILL.md, two skill READMEs, INSTALL_GUIDE, feature catalog and manual testing playbook to reflect MCP-tool registration
- Sub-phase implementation-summary and checklist files (001 through 006) rewritten with Wave-3 canonical `tsc --noEmit`, `vitest run` and `validate.sh --strict` command output using a 3-state convention (`[x]` real evidence, `[ ] OPERATOR-PENDING`, `[ ] BLOCKED`)
- `affordances` on `advisor_recommend` kept as compile-time-only internal scorer seam with DEFER-decision doc comment explaining the prompt-injection rationale
- Prompt-injection denylist broadened in both TS and Python normalizers with synonym variants, stacked-form directional anchors, role-prefix variants plus bracketed role markers
- Tool-count canonicalized to 51 (`TOOL_DEFINITIONS.length`) across root README and two skill READMEs with deferred-handlers footnote
- `trust_badges` merge logic rewritten to a per-field overlay strategy so partial explicit payloads no longer produce half-formed badge shapes

### Fixed

- `parseUnifiedDiff` multi-file boundary: hunk body now tracks `remainingOldLines` and `remainingNewLines` per side so a subsequent file header is not consumed as a hunk line
- `detect-changes.ts` path canonicalization: paths resolving outside `canonicalRootDir` are now rejected with a structured `CandidatePathResult` and surfaced as `status: 'parse_error'` with the offending path in `blockedReason`
- Trust-badges SQL: `resultIds.map(String)` coercion at bind time so `CAST(memory_id AS TEXT)` joins resolve correctly against TEXT-typed `source_id`/`target_id` columns. Three previously skipped tests unskipped via DI seam
- `computeBlastRadius` overflow detection: records `totalAffectedBeforeSlice` before slicing so `overflowed` is set only when the result set genuinely exceeds `limit` rather than when it equals it exactly
- INSTALL_GUIDE Python smoke-test path corrected from an absolute path to the cwd-relative `skill_advisor/tests/python/test_skill_advisor.py` after `cd mcp_server`
- Broken `FEATURE_CATALOG_IN_SIMPLE_TERMS.md` link removed from root README, replaced with a "future docs deliverable" note

### Verification

- `tsc --noEmit` (mcp_server): exit 0, clean (Wave-3 canonical, 2026-04-25).
- `vitest run` (10 Phase 006 test files): 9 passed | 1 skipped (10 files), 90 passed | 3 skipped (93 tests), 1.34s. The 1 skipped file (`trust-badges.test.ts` SQL-mock describe block) was the T-E remediation target, closed by DI fix.
- `vitest run tests/memory/trust-badges.test.ts`: 3 passed (3), all previously skipped SQL-derivation tests unskipped.
- `vitest run tests/tool-input-schema.vitest.ts`: 79 passed (79) including 6 new `minConfidence` cases.
- `vitest run affordance-normalizer.test.ts detect-changes.test.ts phase-runner.test.ts`: 37/37 pass including shared adversarial fixture coverage.
- `python3 skill_advisor/tests/python/test_skill_advisor.py`: 57/57 pass including `conflicts_with` rejection and shared fixture assertions.
- `validate.sh --strict` per sub-phase: 004 PASSED. Sub-phases 001/002/003/005/006 FAILED-COSMETIC (template-section conformance, not contract violations).

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/code_graph/tools/code-graph-tools.ts` | Added `detect_changes` dispatcher case and import |
| `mcp_server/tool-schemas.ts` | New `detectChanges` ToolDefinition appended under L8, tool count canonicalized to 51 |
| `mcp_server/schemas/tool-input-schemas.ts` | `detectChangesSchema`, `minConfidence` on `codeGraphQuerySchema`, both in `TOOL_SCHEMAS` and `ALLOWED_PARAMETERS` |
| `mcp_server/code_graph/handlers/detect-changes.ts` | Path canonicalization with `CandidatePathResult` ok/skip/reject shape |
| `mcp_server/code_graph/lib/diff-parser.ts` | Per-side hunk counters `remainingOldLines`/`remainingNewLines` fix multi-file boundary |
| `mcp_server/code_graph/lib/phase-runner.ts` | `runPhases` wrapped in try/catch/finally; `duplicate-output` rejection added |
| `mcp_server/code_graph/handlers/query.ts` | True overflow detection, preserved seed nodes, stable `failureFallback.code`, shared edge mapper, `reason`/`step` allowlist |
| `mcp_server/skill_advisor/lib/affordance-normalizer.ts` | Broadened denylist, `affordanceNormalizerCounters` |
| `mcp_server/skill_advisor/scripts/skill_graph_compiler.py` | `conflicts_with` rejected as reserved field, broadened denylist, matching counters |
| `mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts` | DEFER-decision comment on `AdvisorRecommendInputSchema` |
| `mcp_server/formatters/search-results.ts` | Per-field badge merge, age-label allowlist, `fetchTrustBadgeSnapshots` DI seam and trace shape |
| `mcp_server/lib/storage/causal-edges.ts` | `causalEdgesGeneration` counter |
| `mcp_server/lib/search/search-utils.ts` | Generation counter folded into cache key when `enableCausalBoost` is true |
| `mcp_server/handlers/memory-search.ts` | Reads generation counter for causal-boost callers |
| `mcp_server/tests/memory/trust-badges.test.ts` | Removed `.skip` and `vi.mock` plumbing, DI-based SQL-derivation tests |
| `mcp_server/tests/tool-input-schema.vitest.ts` | 6 new `minConfidence` accept/reject cases |
| `mcp_server/skill_advisor/tests/__shared__/affordance-injection-fixtures.json` (NEW) | Shared adversarial fixture for TS and Python test parity |
| 10 sub-phase implementation-summary + checklist files | Wave-3 canonical verification evidence with 3-state checklist convention |
| Root README, skill READMEs, INSTALL_GUIDE, feature catalog, manual testing playbook | `detect_changes` MCP-tool status, tool-count sync, broken link removal |

### Follow-Ups

- Run `validate.sh --strict` operator-side on sub-phases 001/002/003/005/006 once template-section cosmetic warnings are resolved.
- Run sk-doc DQI checks on the 5 sub-phase docs that carry OPERATOR-PENDING DQI rows.
- Confirm the `affordances` DEFER decision holds when route/tool/shape contract safety work (ADR-012-003) is revisited in a later packet.
