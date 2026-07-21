// ───────────────────────────────────────────────────────────────────
// MODULE: Semantic Community Novelty Shadow
// ───────────────────────────────────────────────────────────────────

import {
  computeGraphNoveltyDelta,
  computeWindowedGraphNoveltyDelta,
} from '../coverage-graph/coverage-graph-signals.js';

import type {
  SemanticLegacyNoveltyInput,
  SemanticNoveltyResult,
  SemanticNoveltyShadowResult,
} from './semantic-community-types.js';

/** Pair concept novelty with the unchanged authoritative graph-growth result. */
export function computeSemanticNoveltyShadow(
  semantic: SemanticNoveltyResult,
  legacy: SemanticLegacyNoveltyInput,
): SemanticNoveltyShadowResult {
  const graphDelta = computeGraphNoveltyDelta(
    legacy.nodes,
    legacy.edges,
    legacy.snapshots,
  );
  const windowedDelta = legacy.slidingWindowSize === undefined
    ? null
    : computeWindowedGraphNoveltyDelta(
      legacy.nodes,
      legacy.edges,
      legacy.snapshots,
      legacy.slidingWindowSize,
    );
  return Object.freeze({
    authority: 'legacy_coverage_graph',
    semantic,
    legacy_graph_novelty_delta: graphDelta,
    legacy_windowed_graph_novelty_delta: windowedDelta,
  });
}
