---
title: "040 V-rule cross-spec overreach fix"
description: "Narrowed V8 cross-spec contamination detection to stop false-positive blocks on metric labels, ADR numeric prefixes plus legitimate cross-references in decision records and handovers."
trigger_phrases:
  - "V8 cross-spec overreach fix"
  - "validate memory quality V8 false positive"
  - "ADR numeric prefix false positive"
  - "metric suffix denylist validator"
  - "cross-spec contamination overreach"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-16

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/041-v-rule-cross-spec-overreach` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

The memory quality validator was rejecting legitimate ADR content with a V8 hard block. A direct run against the `037-llama-cpp-embedding-worker-deep-dive` decision record reported false foreign packet IDs including `768-dimension`, `142-line`, `ADR-002-decouple-retention-from-governance` plus `005-stability-instrumentation`. Four independent overreach modes caused the block: metric unit labels matching the `NNN-word` shape, ADR title numbers treated as packet IDs, a nested file-path fallback that captured the wrong numbered segment plus a scatter threshold too low for document types that legitimately cross-reference related packets.

The patch tightened candidate extraction in `validate-memory-quality.ts` by adding an explicit metric suffix denylist, filtering ADR context by match position, deriving the current spec from the last numbered segment in a nested `/specs/` path plus raising the scattered-foreign threshold only for `decision-record.md`, `handover.md` plus `implementation-summary.md`. The dominance rule is unchanged. A five-test Vitest file provides regression coverage for each overreach mode.

### Added

- Explicit metric suffix denylist in V8 candidate extraction covering `dimension`, `line`, `token` plus related unit labels
- Five-test Vitest file `validate-memory-quality-v8-overreach.vitest.ts` covering T040-01 through T040-05 for each overreach mode
- High-cross-reference document detection that raises the scattered-foreign threshold to 4 for decision records, handovers plus implementation summaries

### Changed

- V8 candidate extraction now filters matches whose position falls inside an `ADR-` context, preventing ADR title numbers from becoming packet IDs
- Current-spec extraction in the file-path fallback now scans the last numbered segment after `/specs/` in nested paths, fixing the case where `026/.../037/.../decision-record.md` was read as spec `026` instead of `037`

### Fixed

- V8 hard block on `037-llama-cpp-embedding-worker-deep-dive/decision-record.md` caused by metric labels, ADR numeric titles plus a misidentified current spec

### Verification

| Check | Result | Evidence |
|-------|--------|----------|
| New V8 overreach Vitest (T040-01 to T040-05) | PASS | `env -u EMBEDDINGS_PROVIDER npx vitest run validate-memory-quality-v8-overreach.vitest.ts`: 1 file passed, 5 tests passed. |
| Existing V8 regex-narrow Vitest | PASS | `env -u EMBEDDINGS_PROVIDER npx vitest run validate-memory-quality-v8-regex-narrow.vitest.ts`: 1 file passed, 3 tests passed. |
| Live validate 037 ADR-003 | PASS | `node validate-memory-quality.js .../037-llama-cpp-embedding-worker-deep-dive/decision-record.md`: `QUALITY_GATE_PASS`, `matchesFound: []`, `current_spec:037-llama-cpp-embedding-worker-deep-dive`. |
| Strict validate 040 packet | PASS | `bash validate.sh .../041-v-rule-cross-spec-overreach --strict`: `RESULT: PASSED`, errors 0, warnings 0. |
| `npm run build` from scripts package | FAIL | Exit 2. TypeScript could not write existing files under `mcp_server/dist` due to `EPERM` on the local filesystem. No TypeScript diagnostic was reached before the write failures. |

### Files Changed

| File | Action | Description |
|------|--------|-------------|
| `.opencode/skills/system-spec-kit/scripts/lib/validate-memory-quality.ts` | Modified | Tightened V8 candidate extraction: metric denylist, ADR context filter, nested current-spec path fix, doc-type scatter threshold raise |
| `.opencode/skills/system-spec-kit/scripts/tests/validate-memory-quality-v8-overreach.vitest.ts` | Created (NEW) | Five-test regression file covering T040-01 through T040-05 for each overreach mode |

### Follow-Ups

- Resolve the `EPERM` filesystem permission issue blocking `npm run build` writes to `mcp_server/dist` and confirm exit 0 for a full build.
- Extend the metric suffix denylist as new unit-like false positives are discovered, each with a paired test.
- Consider broader ADR context filtering if prose references to decision numbers beyond the immediate `ADR-` prefix are found to produce new false positives.
