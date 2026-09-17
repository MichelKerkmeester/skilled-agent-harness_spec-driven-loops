// ───────────────────────────────────────────────────────────────────
// MODULE: Path Coverage Shadow Bridge
// ───────────────────────────────────────────────────────────────────

import type {
  LegacyCouncilBridge,
  PathCoverageEvaluation,
  PathCoverageShadowEvaluation,
} from './types.js';

/** Attach coverage proof diagnostics while leaving the legacy decision authoritative. */
export function createPathCoverageShadowEvaluation(
  legacyBridge: Readonly<LegacyCouncilBridge>,
  pathCoverage: PathCoverageEvaluation,
): PathCoverageShadowEvaluation {
  const bridge = Object.freeze({
    ...legacyBridge,
    path_coverage_shadow_only: true as const,
    path_coverage_decision: pathCoverage.decision,
    path_coverage_certificate: pathCoverage.certificate,
    path_coverage_partial_report: pathCoverage.partialCoverage,
    path_coverage_disagrees: legacyBridge.graph_decision !== pathCoverage.decision,
  });
  return Object.freeze({
    authority: 'legacy-convergence' as const,
    authoritativeDecision: legacyBridge.graph_decision,
    legacyBridge,
    pathCoverage,
    bridge,
  });
}
