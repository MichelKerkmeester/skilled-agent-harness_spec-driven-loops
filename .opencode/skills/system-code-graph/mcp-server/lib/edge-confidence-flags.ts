// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Edge Confidence Flags
// ───────────────────────────────────────────────────────────────

export const CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION_ENV = 'SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION';

export function isCodeGraphEdgeConfidenceDifferentiationEnabled(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return env[CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION_ENV] === 'true';
}
