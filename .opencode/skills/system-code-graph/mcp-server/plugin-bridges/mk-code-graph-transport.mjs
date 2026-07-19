// ─────────────────────────────────────────────────────────────────────────────
// mk-code-graph transport-plan parsing
// ─────────────────────────────────────────────────────────────────────────────
// Shared, non-plugin helpers for turning a bridge response into an OpenCode
// transport plan. Kept out of the plugin module so the plugin can export only
// its default factory: OpenCode's legacy loader treats every exported function
// in a plugin file as a plugin entrypoint, so a named parser export there can
// perturb plugin registration.

export function isValidTransportBlock(block) {
  return Boolean(block)
    && typeof block === 'object'
    && typeof block.title === 'string'
    && typeof block.content === 'string'
    && typeof block.dedupeKey === 'string';
}

/**
 * Parse a bridge response into an OpenCode transport plan.
 *
 * @param {unknown} responseText - Raw JSON response text from the bridge process.
 * @returns {object|null} Parsed transport plan, or null when no valid transport
 *   payload exists (including non-string or empty input).
 */
export function parseTransportPlan(responseText) {
  if (typeof responseText !== 'string' || !responseText) {
    return null;
  }

  try {
    const parsed = JSON.parse(responseText);
    const data = parsed?.data ?? parsed;
    const plan = data?.opencodeTransport;
    if (!plan || typeof plan !== 'object') {
      return null;
    }
    if (plan.transportOnly !== true
      || !Array.isArray(plan.messagesTransform)
      || !plan.messagesTransform.every(isValidTransportBlock)
      || (plan.systemTransform !== undefined && !isValidTransportBlock(plan.systemTransform))
      || (plan.compaction !== undefined && !isValidTransportBlock(plan.compaction))) {
      return null;
    }
    return plan;
  } catch {
    return null;
  }
}

export function diagnoseTransportPlanFailure(responseText) {
  if (!responseText) {
    return 'Bridge returned empty stdout; plugin injection will no-op';
  }

  try {
    const parsed = JSON.parse(responseText);
    if (parsed?.status === 'skipped' || parsed?.status === 'fail_open') {
      const exitCode = parsed?.metadata?.exitCode ?? null;
      const reason = parsed?.error || parsed?.metadata?.reason || parsed?.metadata?.route || 'no transport payload';
      return `Bridge ${parsed.status}: ${reason}${exitCode === null || exitCode === undefined ? '' : ` (exit=${exitCode})`}; plugin injection will no-op`;
    }
    const data = parsed?.data ?? parsed;
    const plan = data?.opencodeTransport;
    if (!plan || typeof plan !== 'object') {
      return 'Bridge response missing data.opencodeTransport; plugin injection will no-op';
    }
    if (plan.transportOnly !== true) {
      return 'Bridge opencodeTransport.transportOnly was not true; plugin injection will no-op';
    }
    if (!Array.isArray(plan.messagesTransform)) {
      return 'Bridge opencodeTransport.messagesTransform was not an array; plugin injection will no-op';
    }
    if (!plan.messagesTransform.every(isValidTransportBlock)
      || (plan.systemTransform !== undefined && !isValidTransportBlock(plan.systemTransform))
      || (plan.compaction !== undefined && !isValidTransportBlock(plan.compaction))) {
      return 'Bridge opencodeTransport contained a malformed block; plugin injection will no-op';
    }
    return 'Bridge returned invalid OpenCode transport payload; plugin injection will no-op';
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return `Bridge returned unparsable JSON (${reason}); plugin injection will no-op`;
  }
}
