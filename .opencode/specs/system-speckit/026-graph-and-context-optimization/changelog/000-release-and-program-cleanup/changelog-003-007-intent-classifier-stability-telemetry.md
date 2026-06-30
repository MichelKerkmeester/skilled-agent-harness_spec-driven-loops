---
title: "Intent Classifier Stability: Normalized Telemetry and Paraphrase Corpus"
description: "Normalized IntentTelemetry contract shipped with parallel taskIntent and backendRouting objects. An additive emitIntentTelemetry wrapper was added alongside a 20-group paired paraphrase corpus covering all 7 intent labels. Backward-compatible aliases preserved. 62 vitest tests pass."
trigger_phrases:
  - "intent classifier telemetry normalization"
  - "IntentTelemetry paraphrase corpus"
  - "task-intent backend-routing schema"
  - "intent classifier stability corpus"
  - "emitIntentTelemetry paraphraseGroup"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/007-intent-classifier-stability-telemetry` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

The `memory_context` response contained two dissonant intent fields: `meta.intent` (task-intent classification) and `data.queryIntentRouting` (backend routing channel). Neither carried an explicit `classificationKind` label. No normalized schema connected them. Paraphrase variants of the same query produced unstable task-intent labels. No corpus asserted stability across CLI styles.

The normalized `IntentTelemetry` contract was implemented per 007 §5/Q8 and 005/REQ-001, REQ-004, REQ-016. The contract introduces parallel `taskIntent` and `backendRouting` objects with explicit `classificationKind` fields. It also adds an optional `paraphraseGroup` annotation, backward-compatible `type` and `confidence` aliases so existing parsers are not broken. A 20-group paired paraphrase corpus covering 72 pair combinations across all 7 intent labels was added, with stability assertions bounding confidence drift below 0.30. Three unstable candidate variants were identified and replaced during corpus design without relaxing any threshold.

The live `memory_context` probe confirmed `emitIntentTelemetry()` runs in the deployed process, returning `taskIntent.intent:"understand"` and `backendRouting.route:"semantic"` as separate concerns for the canonical `"Semantic Search"` probe query.

### Added

- `IntentTelemetry` type with parallel `taskIntent` and `backendRouting` objects in `intent-classifier.ts`
- `emitIntentTelemetry()` additive wrapper around `classifyIntent()` exposing the normalized contract
- `deriveParaphraseGroup()` heuristic: lowercase tokenization, stopword filtering, sort, then hyphen-join to derive a stable group key
- `tests/intent-paraphrase-stability.vitest.ts` paired paraphrase corpus with 20 groups, 72 pair combinations, covering all 7 intent labels
- Normalized telemetry shape assertion in `intent-classifier.vitest.ts`

### Changed

- `memory_context` response `meta.intent` now embeds the full `IntentTelemetry` object, carrying `taskIntent` and `backendRouting`. The optional `paraphraseGroup` field is included when the classifier detects equivalence.
- `data.queryIntentRouting.seeAlso` normalized to point to `meta.intent`
- Backward-compatible `meta.intent.type` and `meta.intent.confidence` preserved as aliases of `taskIntent.intent` and `taskIntent.confidence`

### Fixed

- Dual-classifier dissonance between `meta.intent` and `data.queryIntentRouting` resolved by explicit `classificationKind` labels on both objects
- Paraphrase instability for `"Semantic Search"` variants corrected; both `"Semantic Search"` and `"Find stuff related to semantic search"` now classify to the same task intent

### Verification

| Check | Result | Evidence |
|-------|--------|----------|
| `npx vitest run tests/intent-paraphrase-stability.vitest.ts tests/intent-classifier.vitest.ts` | PASS | 2 files, 62 tests pass |
| `npm run build` | PASS | `tsc --build` completed without errors |
| `grep -l taskIntent dist/lib/search/intent-classifier.js` | PASS | Dist file matched |
| `grep -l backendRouting dist/lib/search/intent-classifier.js` | PASS | Dist file matched |
| `grep -l paraphraseGroup dist/lib/search/intent-classifier.js` | PASS | Dist file matched |
| `grep -l classificationKind dist/lib/search/intent-classifier.js` | PASS | Dist file matched |
| Live `memory_context({input:"Semantic Search", mode:"auto"})` probe | PASS | Recorded 2026-04-27T10:12:36Z. `taskIntent.intent:"understand"`, `backendRouting.route:"semantic"`, `paraphraseGroup:"search-semantic"` confirmed in running process. |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/intent-classifier.ts` | Added `IntentTelemetry` type. Added `emitIntentTelemetry()` wrapper. Added `deriveParaphraseGroup()` heuristic. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | Embedded full telemetry in `meta.intent`. Kept `data.queryIntentRouting` as backend routing only. Normalized `seeAlso` pointer. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/intent-paraphrase-stability.vitest.ts` (NEW) | Paired paraphrase corpus. 20 groups, 72 combinations, all 7 intent labels, confidence drift bound below 0.30. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts` | Added normalized telemetry shape assertion |

### Follow-Ups

- Monitor paraphrase heuristic accuracy in production. Sorted-token grouping may miss semantic equivalences that embedding-based clustering would catch.
- Restart the MCP-owning client after each dist rebuild to ensure live probes reflect the deployed binary rather than a stale child process.
