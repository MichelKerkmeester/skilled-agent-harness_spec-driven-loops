// ───────────────────────────────────────────────────────────────
// MODULE: Mutation Hooks
// ───────────────────────────────────────────────────────────────
import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
import { clearSemanticTriggerCache } from '../lib/triggers/semantic-trigger-matcher.js';
import * as toolCache from '../lib/cache/tool-cache.js';
import { clearConstitutionalCache } from '../hooks/memory-surface.js';
import { clearGraphSignalsCache } from '../lib/graph/graph-signals.js';
import { clearRelatedCache } from '../lib/cognitive/co-activation.js';
import { clearDegreeCache } from '../lib/search/graph-search-fn.js';
import { invalidateEntityDensityCache } from '../lib/search/entity-density.js';
import { createStatediffAction } from '../lib/storage/statediff.js';

import type { MutationHookResult } from './memory-crud-types.js';
import type { StatediffAction, StatediffTargetType } from '../lib/storage/statediff.js';

// Feature catalog: Transaction wrappers on mutation handlers
// Feature catalog: Shared post-mutation hook wiring
// Feature catalog: Mutation hook result contract expansion


export type { MutationHookResult };

type HookSubscriberName =
  | 'trigger-cache'
  | 'semantic-trigger-cache'
  | 'tool-cache'
  | 'constitutional-cache'
  | 'graph-cache'
  | 'coactivation-cache'
  | 'entity-density-cache';

interface HookSubscriberReport {
  name: HookSubscriberName;
  actionCount: number;
  ok: boolean;
  error?: string;
}

interface HookSubscriber {
  name: HookSubscriberName;
  shouldRun(actions: readonly StatediffAction[]): boolean;
  run(operation: string, context: Record<string, unknown>, actions: readonly StatediffAction[]): number | void;
}

function isStatediffAction(value: unknown): value is StatediffAction {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const candidate = value as Partial<StatediffAction>;
  return typeof candidate.action === 'string'
    && typeof candidate.target === 'string'
    && typeof candidate.key === 'string'
    && typeof candidate.sourceOperation === 'string';
}

function actionsFromContext(operation: string, context: Record<string, unknown>): StatediffAction[] {
  const explicitActions = context.statediffActions;
  if (Array.isArray(explicitActions)) {
    return explicitActions.filter(isStatediffAction);
  }

  const memoryId = typeof context.memoryId === 'number' || typeof context.memoryId === 'string'
    ? String(context.memoryId)
    : operation;
  const target: StatediffTargetType = operation.startsWith('causal-') ? 'causal_edge' : 'memory_index';
  const action = operation.includes('delete') || operation.includes('unlink') ? 'delete' : 'upsert';
  return [createStatediffAction(action, {
    target,
    key: memoryId,
    sourceOperation: operation,
  })];
}

function hasTarget(actions: readonly StatediffAction[], targets: readonly StatediffTargetType[]): boolean {
  return actions.some((action) => targets.includes(action.target));
}

const hookSubscribers: HookSubscriber[] = [
  {
    name: 'trigger-cache',
    shouldRun: (actions) => actions.length > 0,
    run: () => {
      triggerMatcher.clearCache();
    },
  },
  {
    name: 'semantic-trigger-cache',
    shouldRun: (actions) => actions.length > 0,
    run: () => {
      clearSemanticTriggerCache();
    },
  },
  {
    name: 'tool-cache',
    shouldRun: (actions) => actions.length > 0,
    run: (operation, context) => toolCache.invalidateOnWrite(operation, context),
  },
  {
    name: 'constitutional-cache',
    shouldRun: (actions) => actions.length > 0,
    run: () => {
      clearConstitutionalCache();
    },
  },
  // Graph and co-activation clears stay unconditional (fail-safe): action
  // batches are an advisory subscriber aid and may under-report graph effects
  // (e.g. memory deletes cascade causal-edge deletes that arrive as
  // memory_index actions only). Cache clears are cheap O(1) resets, so
  // over-invalidating is always safe; skipping on incomplete batches is not.
  {
    name: 'graph-cache',
    shouldRun: (actions) => actions.length > 0,
    run: () => {
      clearGraphSignalsCache();
      clearDegreeCache();
    },
  },
  {
    name: 'coactivation-cache',
    shouldRun: (actions) => actions.length > 0,
    run: () => {
      clearRelatedCache();
    },
  },
  {
    name: 'entity-density-cache',
    shouldRun: (actions) => hasTarget(actions, ['memory_index', 'graph_edge', 'causal_edge']),
    run: () => {
      invalidateEntityDensityCache();
    },
  },
];

function subscriberFailed(report: HookSubscriberReport[], name: HookSubscriberName): boolean {
  return report.some((item) => item.name === name && !item.ok);
}

function subscriberSucceeded(report: HookSubscriberReport[], name: HookSubscriberName): boolean {
  return report.some((item) => item.name === name && item.ok);
}

function runPostMutationHooks(
  operation: string,
  context: Record<string, unknown> = {}
): MutationHookResult {
  const startTime = Date.now();
  const errors: string[] = [];
  const actions = actionsFromContext(operation, context);
  const subscriberReports: HookSubscriberReport[] = [];
  let toolCacheInvalidated = 0;

  for (const subscriber of hookSubscribers) {
    if (!subscriber.shouldRun(actions)) {
      continue;
    }
    try {
      const result = subscriber.run(operation, context, actions);
      if (subscriber.name === 'tool-cache' && typeof result === 'number') {
        toolCacheInvalidated = result;
      }
      subscriberReports.push({ name: subscriber.name, actionCount: actions.length, ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(
        `[mutation-hooks] subscriber "${subscriber.name}" failed for operation="${operation}":`,
        message
      );
      errors.push(`${subscriber.name}: ${message}`);
      subscriberReports.push({ name: subscriber.name, actionCount: actions.length, ok: false, error: message });
      if (subscriber.name === 'tool-cache') {
        toolCacheInvalidated = 0;
      }
    }
  }

  return {
    latencyMs: Date.now() - startTime,
    actionCount: actions.length,
    triggerCacheCleared: subscriberSucceeded(subscriberReports, 'trigger-cache') && !subscriberFailed(subscriberReports, 'trigger-cache'),
    constitutionalCacheCleared: subscriberSucceeded(subscriberReports, 'constitutional-cache') && !subscriberFailed(subscriberReports, 'constitutional-cache'),
    toolCacheInvalidated,
    graphSignalsCacheCleared: subscriberSucceeded(subscriberReports, 'graph-cache') && !subscriberFailed(subscriberReports, 'graph-cache'),
    coactivationCacheCleared: subscriberSucceeded(subscriberReports, 'coactivation-cache') && !subscriberFailed(subscriberReports, 'coactivation-cache'),
    entityDensityCacheCleared: subscriberSucceeded(subscriberReports, 'entity-density-cache') && !subscriberFailed(subscriberReports, 'entity-density-cache'),
    subscribers: subscriberReports,
    errors,
  };
}

export { runPostMutationHooks };
