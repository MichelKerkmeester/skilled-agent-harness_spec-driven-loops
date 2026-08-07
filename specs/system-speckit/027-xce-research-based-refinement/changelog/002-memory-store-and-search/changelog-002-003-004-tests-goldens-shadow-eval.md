---
title: "Semantic Trigger Fallback 004: Trigger Goldens, Shadow Eval, and Blocked Union Promotion"
description: "Synthetic CJK and Latin goldens fixture, threshold-band shadow telemetry, cold-start/latency/backfill test coverage, and env flag documentation close out the phase. Union promotion is explicitly blocked pending live 768d evidence. No schema version change."
trigger_phrases:
  - "027 phase 002/003 004 tests goldens shadow eval"
  - "trigger goldens fixture"
  - "shadow eval promotion gate"
  - "union promotion blocked"
  - "semantic trigger closeout"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/004-tests-goldens-shadow-eval` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback`

### Summary

This leaf closes the semantic trigger fallback phase without changing the default runtime state. The master flag remains off, the mode default is `shadow`, and union promotion is explicitly blocked.

The deliverables are test and telemetry infrastructure. A goldens fixture covers 40 CJK and Latin trigger cases with exact, paraphrase, and distractor variants using deterministic synthetic vectors. The fixture validates matcher threshold, margin, max, dedup, metric, and telemetry machinery only. It is not real 768d embedding recall evidence and does not constitute a union promotion gate pass.

Additional test suites cover cold-start behavior (uncached query skip-signal), deterministic sync-work latency budget, threshold-band telemetry tuning, and interrupted backfill resumability. The matcher gains additive threshold-band counts in its shadow stats to support future tuning analysis. ENV_REFERENCE.md is updated with the `SPECKIT_SEMANTIC_TRIGGERS_MODE` flag and the semantic trigger count.

### Added

- `mcp_server/tests/fixtures/trigger-goldens.json` — 40 synthetic CJK and Latin trigger cases with exact, paraphrase, and distractor variants
- `mcp_server/tests/trigger-golden-fixture.ts` — shared fixture loader and deterministic vector generator
- `mcp_server/tests/trigger-shadow-db-fixture.ts` — shared hermetic database helpers for shadow eval tests
- `mcp_server/tests/trigger-goldens.vitest.ts` — precision/recall/false-positive and matcher-gate tests against the goldens fixture
- `mcp_server/tests/trigger-cold-start.vitest.ts` — uncached query skip-signal test (`no_query_embedding` path)
- `mcp_server/tests/trigger-latency-budget.vitest.ts` — deterministic sync-work latency-budget test
- `mcp_server/tests/trigger-threshold-tuning.vitest.ts` — shadow telemetry threshold-band test
- `mcp_server/tests/trigger-backfill-resume.vitest.ts` — interrupted backfill resumability test

### Changed

- `mcp_server/lib/triggers/semantic-trigger-matcher.ts` — additive threshold-band telemetry counts in shadow stats (exact, above-threshold, near-threshold, below-threshold bands)
- `mcp_server/ENV_REFERENCE.md` — `SPECKIT_SEMANTIC_TRIGGERS_MODE` flag and semantic trigger count documented

### Fixed

- None. This leaf is test and telemetry scaffolding only; no source behavior changed.

### Verification

| Check | Result |
|-------|--------|
| New semantic trigger suites (5 files) | PASS (7 tests) |
| Canary trigger suites (4 files) | PASS (31 tests) |
| `npm run build` | PASS |
| `SCHEMA_VERSION` check | PASS (remains 34) |
| Default runtime state | PASS: master OFF, mode defaults to `shadow`, union not promoted |
| `validate.sh --strict` on spec folder | PASS (0 errors, 0 warnings) |

#### Promotion Gate Evidence

| Evidence Area | Gate | Current Evidence |
|---------------|------|-----------------|
| False positives | BLOCKED | Synthetic distractor FP = 0 only; live-profile rate not measured |
| Recall | BLOCKED | Synthetic paraphrase recall = 1.0 only; live 768d lift not measured |
| Latency | BLOCKED | Deterministic sync-work budget passes; live p95 not measured |
| Cost | BLOCKED | Not measured in this phase |
| Rollback | PARTIAL | Master OFF and `shadow` default documented |

Union promotion decision: BLOCKED. Live 768d evidence required before any promotion.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/tests/fixtures/trigger-goldens.json` | Created | Synthetic CJK and Latin trigger goldens fixture |
| `mcp_server/tests/trigger-golden-fixture.ts` | Created | Shared fixture loader and deterministic vector generator |
| `mcp_server/tests/trigger-shadow-db-fixture.ts` | Created | Shared hermetic database helpers |
| `mcp_server/tests/trigger-goldens.vitest.ts` | Created | Precision/recall/FP and matcher-gate tests |
| `mcp_server/tests/trigger-cold-start.vitest.ts` | Created | Uncached query skip-signal test |
| `mcp_server/tests/trigger-latency-budget.vitest.ts` | Created | Deterministic sync-work latency-budget test |
| `mcp_server/tests/trigger-threshold-tuning.vitest.ts` | Created | Shadow telemetry threshold-band test |
| `mcp_server/tests/trigger-backfill-resume.vitest.ts` | Created | Interrupted backfill resumability test |
| `mcp_server/lib/triggers/semantic-trigger-matcher.ts` | Modified | Additive threshold-band telemetry counts in shadow stats |
| `mcp_server/ENV_REFERENCE.md` | Modified | `SPECKIT_SEMANTIC_TRIGGERS_MODE` flag and semantic trigger count |

### Follow-Ups

- Live false-positive, recall, latency, and cost evidence must be collected against a real 768d embedding profile before union mode promotion is considered.
- The synthetic goldens fixture proves machinery correctness only. It must not be cited as evidence for live recall behavior or false-positive rates.
- The original scaffold named `__tests__/triggers/` as the test path. Implementation used the repository's `tests/*.vitest.ts` convention throughout this phase.
