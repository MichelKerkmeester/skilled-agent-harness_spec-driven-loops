---
title: "CocoIndex Seed Telemetry Passthrough"
description: "Per-seed telemetry passthrough (rawScore, pathClass, rankingSignals) through code_graph_context anchors. Pure additive metadata for audit and explanation. Score, rank order and confidence on anchors are unchanged. Ships in commit bbf869331e alongside packets 012-014."
trigger_phrases:
  - "cocoindex seed telemetry passthrough"
  - "rawScore pathClass rankingSignals anchor passthrough"
  - "Q-OPP cocoindex seed fidelity"
  - "code_graph_context telemetry fields"
  - "015 cocoindex telemetry"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/015-cocoindex-seed-telemetry-passthrough`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

The CocoIndex fork (cocoindex_code v0.2.3+spec-kit-fork.0.2.0) emits five telemetry fields per query result (`raw_score`, `path_class`, `rankingSignals`, `dedupedAliases`, `uniqueResultCount`), but `code_graph_context` dropped all of them when a CocoIndex result was supplied as a seed. Anchors returned to the model lost provenance data that would help explain why the fork ranked one chunk over another. The v1.0.2 stress test confirmed `dedupedAliases:26` lived on the fork side and never reached the consumer (research.md §6, Novel Finding #5).

Three source files were extended across the schema, type and handler layers to pass the per-seed telemetry through to returned anchors. A 12-test vitest covered schema acceptance (snake_case and camelCase wire variants), anchor emission, backward compatibility (no telemetry in equals no extra fields out) and fixture equality on score and ordering. The change is purely additive. Anchor `score`, `confidence`, `resolution` and ordering are byte-equal before and after on a fixed fixture corpus (Test E). No second rerank was introduced in `lib/search/` (Test F static grep).

### Added

- Five optional telemetry fields on `codeGraphSeedSchema` (`tool-input-schemas.ts`): `rawScore`, `raw_score`, `pathClass`, `path_class`, `rankingSignals` (snake_case wire plus camelCase internal variants)
- Wire-name normalization in the CocoIndex seed branch of `context.ts` (`raw_score` to `rawScore`, `path_class` to `pathClass`)
- Conditional anchor emission of `rawScore`, `pathClass`, `rankingSignals` next to existing `score`, `snippet`, `range` when the resolved `ArtifactRef` carried them
- 12-test vitest (`code-graph-context-cocoindex-telemetry-passthrough.vitest.ts`) covering criteria A through F

### Changed

- `ContextHandlerArgs.seeds` array shape in `context.ts` extended with the five optional telemetry fields
- `CocoIndexSeed` and `ArtifactRef` interfaces in `seed-resolver.ts` extended with camelCase telemetry fields
- `resolveCocoIndexSeed` updated to spread telemetry from input seed onto the resolved `ArtifactRef`

### Fixed

- CocoIndex fork telemetry fields were silently dropped when a fork result was supplied as a `code_graph_context` seed. They now survive the schema validation, type narrowing, resolver and anchor-emission layers.

### Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` in `mcp_server/` | PASS: no errors, no warnings |
| Vitest: `code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` | PASS: 1 file, 12 tests passed |
| Test A: snake_case wire schema accepts | PASS: `validateToolArgs` does not throw |
| Test B: camelCase and mixed schema accepts | PASS: both variants validate |
| Test C: anchors emit telemetry next to score/snippet/range | PASS: `anchor.rawScore`, `anchor.pathClass`, `anchor.rankingSignals` present |
| Test C2: camelCase input round-trips identically | PASS: no normalization artifacts |
| Test D: no telemetry in gives no extra anchor fields | PASS: fields absent (not null) |
| Test D2: manual provider ignores telemetry | PASS: no cross-provider leakage |
| Test E: byte-equal core fields before vs after (most load-bearing) | PASS: 3-seed fixture corpus, post-patch anchors equal pre-patch after telemetry strip |
| Test E2: `anchor.score` equals `seed.score` not `seed.raw_score` | PASS: bounded post-rerank score preserved, raw audit signal separate |
| Test F: hybrid-search.ts and search-utils.ts not referencing fork tokens | PASS: zero matches for `path_class`, `pathClass`, `rankingSignals`, `raw_score` |
| Test G: direct Zod schema validation | PASS: schema parses snake, camel and mixed seeds without throwing |
| Sibling regression `code-graph-*.vitest.ts` | 91 tests across 2 targeted files pass. One pre-existing failure in `code-graph-degraded-sweep.vitest.ts` confirmed pre-existing via `git stash` run. |
| `validate.sh --strict` on packet folder | DEFERRED: recorded as blocker pending daemon restart |
| Live `code_graph_context` probe | DEFERRED: requires MCP daemon restart per packet 008 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/handlers/context.ts` | Modified (+47 / -13 lines) | Extended `ContextHandlerArgs.seeds`. Added wire-name normalization and conditional telemetry emission on anchors. |
| `.opencode/skills/system-code-graph/mcp_server/lib/seed-resolver.ts` | Modified (+28 / -9 lines) | Extended `CocoIndexSeed` and `ArtifactRef`. Preserved telemetry through `resolveCocoIndexSeed`. |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modified (+12 lines) | Extended `codeGraphSeedSchema` with snake_case and camelCase telemetry fields. |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` (NEW) | Added (~340 lines, 12 tests) | Coverage for criteria A through F. Deleted in packet 014/002 when CocoIndex was decoupled. |

### Follow-Ups

- MCP daemon restart required before a live `code_graph_context` probe can confirm the rebuilt `dist` loaded correctly. Per packet 008 guidance.
- Response-level telemetry deferred. `dedupedAliases` and `uniqueResultCount` are response-level counters (research.md §6.3 alt #2). They require the caller to supply the entire CocoIndex response envelope into `code_graph_context`, which is a separate composition decision.
- Surface `rankingSignals` in `textBrief` and `combinedSummary` narrative output deferred to a follow-on packet (spec §7 open question).
- Telemetry adoption metrics deferred. No counter today tracks how many anchor consumers read the new fields.
