---
title: "049 Substrate Stress Coverage: Canonical Vitest Gate for Substrate Paths"
description: "Promoted the 045 shared-daemon runner into a canonical stress gate and added deterministic pure-logic stress tests for query expansion bounds, tokenizer-budget edge behavior plus V-rule save flooding. Four stress files and a README shipped under mcp_server/stress_test/substrate/."
trigger_phrases:
  - "049 substrate stress coverage"
  - "substrate vitest gate"
  - "query expansion bound stress"
  - "v-rule save flood stress"
  - "stress substrate canonical gate"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/049-substrate-stress-coverage` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

The canonical Vitest stress suite was intentionally embedding-provider-agnostic, mocking pipelines and using synthetic candidates. Substrate paths such as llama-cpp embedding generation, V-rule save flooding, CocoIndex two-client coordination, query-expansion bounds plus token-budget edge cases had no canonical stress gate. The only substrate-level evidence lived in a sandbox runner from packet 045.

The 045 shared-daemon MCP runner was promoted into `mcp_server/stress_test/substrate/` and three pure-logic stress files were authored against the actual exported APIs. A Vitest subprocess wrapper was added for daemon smoke across scenarios 403/404/407/410. All four files pass under `npm run stress:substrate` with a raised 240-second timeout. The stress suite now fails-closed on substrate regressions without touching the provider-agnostic layer.

### Added

- `run-substrate-stress-harness.mjs` under `stress_test/substrate/` promoted from the 045 sandbox runner and path-adjusted for the canonical location
- `substrate-runner-harness.vitest.ts` as a Vitest subprocess wrapper asserting that scenarios 403/404/407/410 all produce PASS rows through the real two-daemon stack
- `query-expansion-bound-stress.vitest.ts` covering 100 expansion-eligible queries all bounded to `COMBINED_QUERY_CHAR_BUDGET` plus empty-expansion and over-budget base-query contract cases
- `token-aware-chunking-edge-stress.vitest.ts` covering 99%, 101%, 500% of context plus CJK and emoji tokenizer-budget boundary inputs using a mocked `LlamaCppProvider` runtime (later removed in the llama-cpp surface purge)
- `v-rule-save-flood-stress.vitest.ts` covering V8 thresholds, parent-child allowlist, scatter, dominance, numeric-prefix denylist plus 50 sequential canonical-doc validations
- `stress_test/substrate/README.md` with a run recipe and a note separating daemon smoke from pure-logic tests
- `stress:substrate` npm script in `package.json`

### Changed

- `stress_test/README.md` updated to document the substrate suite directory, key file, validation plus entrypoint
- `vitest.stress.config.ts` stress timeout raised from its prior value to `240_000` ms to accommodate daemon startup during the harness smoke

### Fixed

- No bugs corrected. All changes are additive stress coverage.

### Verification

| Check | Result | Evidence |
|-------|--------|----------|
| Pure-logic substrate stress | PASS | `npx vitest run --config vitest.stress.config.ts stress_test/substrate/query-expansion-bound-stress.vitest.ts stress_test/substrate/token-aware-chunking-edge-stress.vitest.ts stress_test/substrate/v-rule-save-flood-stress.vitest.ts` exited 0 |
| Promoted harness wrapper | PASS | `npx vitest run --config vitest.stress.config.ts stress_test/substrate/substrate-runner-harness.vitest.ts` exited 0 |
| TSV evidence | PASS | `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.summary.tsv` contains PASS rows for 403/404/407/410 |
| Strict packet validation | PASS | `validate.sh .../049-substrate-stress-coverage --strict` exited 0 with 0 errors and 0 warnings |
| Vitest stress gate combined | PASS | 4 files, 14 tests passed in 26.9 s (harness 26.3 s. 3 logic files under 600 ms total) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs` (NEW) | Created | Promoted 045 shared-daemon harness adapted for canonical stress-test location. |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts` (NEW) | Created | Vitest subprocess wrapper for daemon smoke across scenarios 403/404/407/410. |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/query-expansion-bound-stress.vitest.ts` (NEW) | Created | Combined-query bound stress for 034 query-expansion logic. |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/token-aware-chunking-edge-stress.vitest.ts` (NEW, later deleted) | Created | llama-cpp tokenizer-budget edge stress using mocked runtime. Deleted in subsequent llama-cpp surface purge. |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/v-rule-save-flood-stress.vitest.ts` (NEW) | Created | V8 threshold, allowlist, scatter, dominance plus flood stress for 040/044/047 V-rule logic. |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/README.md` (NEW) | Created | Substrate stress overview and run recipe with daemon smoke separation note. |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/README.md` | Updated | Added substrate suite directory, key file, validation plus entrypoint docs. |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Updated | Added `stress:substrate` npm script. |
| `.opencode/skills/system-spec-kit/mcp_server/vitest.stress.config.ts` | Updated | Raised stress timeout to `240_000` ms. |

### Follow-Ups

- Manual runner sync remains. The sandbox runner and canonical harness are intentionally separate copies and must be synchronized manually when either diverges.
- Harness smoke requires live Memory and CocoIndex daemons for scenarios 403/404/407/410. Pure-logic files remain deterministic and can run without daemon startup.
- Over-budget base queries are preserved by current query-expansion code. The stress test documents this as worker-side token preflight handoff rather than a bug.
