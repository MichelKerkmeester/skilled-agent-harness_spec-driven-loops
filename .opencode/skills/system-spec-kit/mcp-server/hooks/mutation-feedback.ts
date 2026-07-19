// ───────────────────────────────────────────────────────────────
// MODULE: Mutation Feedback
// ───────────────────────────────────────────────────────────────
import type { MutationHookResult } from '../handlers/memory-crud-types.js';

function buildMutationHookFeedback(operation: string, hookResult: MutationHookResult): {
  data: {
    operation: string;
    latencyMs: number;
    triggerCacheCleared: boolean;
    constitutionalCacheCleared: boolean;
    graphSignalsCacheCleared: boolean;
    coactivationCacheCleared: boolean;
    entityDensityCacheCleared?: boolean;
    toolCacheInvalidated: number;
    actionCount?: number;
    subscribers?: MutationHookResult['subscribers'];
    errors: string[];
  };
  hints: string[];
} {
  const hints: string[] = [];

  const subscriberSummary = hookResult.subscribers?.length
    ? hookResult.subscribers
      .map((subscriber) => `${subscriber.name}=${subscriber.ok ? 'ok' : 'failed'}`)
      .join(', ')
    : [
        `trigger=${hookResult.triggerCacheCleared ? 'ok' : 'failed'}`,
        `constitutional=${hookResult.constitutionalCacheCleared ? 'ok' : 'failed'}`,
        `graphSignals=${hookResult.graphSignalsCacheCleared ? 'ok' : 'failed'}`,
        `coactivation=${hookResult.coactivationCacheCleared ? 'ok' : 'failed'}`,
      ].join(', ');
  hints.push(`Post-mutation subscribers: ${subscriberSummary}`);
  hints.push(
    `Tool cache invalidation: invalidated ${hookResult.toolCacheInvalidated} entries for operation "${operation}"`
  );

  const anyCacheClearFailed =
    hookResult.subscribers?.some((subscriber) => !subscriber.ok) ?? (
      !hookResult.triggerCacheCleared ||
      !hookResult.constitutionalCacheCleared ||
      !hookResult.graphSignalsCacheCleared ||
      !hookResult.coactivationCacheCleared
    );

  if (anyCacheClearFailed) {
    hints.push('Warning (non-fatal): one or more post-mutation cache clear operations failed');
  }

  if (hookResult.errors.length > 0) {
    hints.push('Post-mutation hook errors: ' + hookResult.errors.join('; '));
  }

  return {
    data: {
      operation,
      latencyMs: hookResult.latencyMs,
      triggerCacheCleared: hookResult.triggerCacheCleared,
      constitutionalCacheCleared: hookResult.constitutionalCacheCleared,
      graphSignalsCacheCleared: hookResult.graphSignalsCacheCleared,
      coactivationCacheCleared: hookResult.coactivationCacheCleared,
      entityDensityCacheCleared: hookResult.entityDensityCacheCleared,
      toolCacheInvalidated: hookResult.toolCacheInvalidated,
      actionCount: hookResult.actionCount,
      subscribers: hookResult.subscribers,
      errors: hookResult.errors,
    },
    hints,
  };
}

export { buildMutationHookFeedback };
