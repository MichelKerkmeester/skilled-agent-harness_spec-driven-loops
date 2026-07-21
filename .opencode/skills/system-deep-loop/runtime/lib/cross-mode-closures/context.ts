// ───────────────────────────────────────────────────────────────────
// MODULE: Cross-Mode Closure Context
// ───────────────────────────────────────────────────────────────────

import {
  CrossModeClosureError,
  CrossModeClosureErrorCodes,
} from './errors.js';
import { bindClosureServicePorts, requireIdentity } from './internal.js';
import {
  MODE_CONTRACT_INTERFACE_VERSION,
  MODE_CONTRACT_SHAPE,
} from '../mode-contracts/index.js';
import { canonicalizeProtectedResource } from '../locks-and-fencing/index.js';
import { PHASE_013_MODE_IDS } from './types.js';

import type {
  CrossModeClosureContext,
  CrossModeClosureContextInput,
} from './types.js';

const LEGACY_SHADOW_POSTURE = Object.freeze({
  legacyAuthority: 'authoritative',
  closureAuthority: 'shadow-only',
  closureFailure: 'preserve-legacy-result',
} as const);

function requireMethod(value: unknown, field: string): void {
  if (typeof value !== 'function') {
    throw new CrossModeClosureError(
      CrossModeClosureErrorCodes.INVALID_CONTEXT,
      `${field} must be a callable safety port`,
      { field },
    );
  }
}

/** Create the single immutable context shared by all five closure owners. */
export function createCrossModeClosureContext(
  input: CrossModeClosureContextInput,
): CrossModeClosureContext {
  if (!Object.isFrozen(input.modeContract)) {
    throw new CrossModeClosureError(
      CrossModeClosureErrorCodes.INVALID_CONTEXT,
      'Closure context requires the frozen shared mode contract',
    );
  }
  const descriptor = input.modeContract.describe();
  if (!(PHASE_013_MODE_IDS as readonly string[]).includes(descriptor.modeId)) {
    throw new CrossModeClosureError(
      CrossModeClosureErrorCodes.INVALID_CONTEXT,
      'Mode identity is outside the manifest-complete workstream set',
      { modeIdentity: descriptor.modeId },
    );
  }
  if (
    descriptor.interfaceVersion !== MODE_CONTRACT_INTERFACE_VERSION
    || descriptor.interfaceShape !== MODE_CONTRACT_SHAPE
    || descriptor.migrationPosture !== 'additive-dark'
    || descriptor.legacyAuthority !== 'authoritative'
    || descriptor.ledgerAuthority !== 'shadow-only'
  ) {
    throw new CrossModeClosureError(
      CrossModeClosureErrorCodes.INVALID_CONTEXT,
      'Mode contract identity or authority posture differs from the frozen interface',
    );
  }
  requireIdentity(input.continuityIdentity, 'continuityIdentity');
  requireIdentity(input.correlation.runId, 'correlation.runId');
  requireIdentity(input.correlation.correlationId, 'correlation.correlationId');
  if (input.correlation.causationId !== null) {
    requireIdentity(input.correlation.causationId, 'correlation.causationId');
  }
  requireIdentity(input.lifecycleEvent.identity.eventId, 'lifecycleEvent.identity.eventId');
  requireIdentity(input.lifecycleEvent.canonicalDigest, 'lifecycleEvent.canonicalDigest');
  requireIdentity(input.budgetScope.scope.scopeId, 'budgetScope.scope.scopeId');
  const eventDeclared = input.modeContract.eventTypes().some((event) => (
    event.eventType === input.lifecycleEvent.identity.eventType
    && event.interfaceVersion === descriptor.interfaceVersion
  ));
  if (!eventDeclared) {
    throw new CrossModeClosureError(
      CrossModeClosureErrorCodes.INVALID_CONTEXT,
      'Lifecycle event is not declared by the frozen mode contract',
    );
  }
  const declaredWriteResources = new Set(
    descriptor.writeSet.resources.map((resource) => resource.resource),
  );
  for (const binding of input.writeSet) {
    if (!declaredWriteResources.has(binding.modeResource)) {
      throw new CrossModeClosureError(
        CrossModeClosureErrorCodes.INVALID_CONTEXT,
        'Concrete write-set binding is absent from the mode contract declaration',
        { modeResource: binding.modeResource },
      );
    }
    canonicalizeProtectedResource(binding.protectedResource);
  }
  requireMethod(input.services.authorization.append, 'services.authorization.append');
  requireMethod(input.services.sealedArtifacts.readVerified, 'services.sealedArtifacts.readVerified');
  requireMethod(input.services.receipts.effects.execute, 'services.receipts.effects.execute');
  requireMethod(input.services.receipts.effects.recover, 'services.receipts.effects.recover');
  requireMethod(input.services.receipts.boundaries.issue, 'services.receipts.boundaries.issue');
  requireMethod(input.services.adjudication.invoke, 'services.adjudication.invoke');
  requireMethod(input.services.budgets.admit, 'services.budgets.admit');
  requireMethod(input.services.budgets.startAttempt, 'services.budgets.startAttempt');
  requireMethod(input.services.budgets.settle, 'services.budgets.settle');
  requireMethod(input.services.gauges.initialAccumulator, 'services.gauges.initialAccumulator');
  requireMethod(input.services.gauges.reduce, 'services.gauges.reduce');
  requireMethod(input.services.gauges.finalize, 'services.gauges.finalize');
  requireMethod(input.services.fencing.stateStore.replace, 'services.fencing.stateStore.replace');

  const services = Object.freeze({
    authorization: Object.freeze({
      append: input.services.authorization.append.bind(input.services.authorization),
    }),
    receipts: Object.freeze({
      effects: Object.freeze({
        execute: input.services.receipts.effects.execute.bind(
          input.services.receipts.effects,
        ),
        recover: input.services.receipts.effects.recover.bind(
          input.services.receipts.effects,
        ),
      }),
      boundaries: Object.freeze({
        issue: input.services.receipts.boundaries.issue.bind(
          input.services.receipts.boundaries,
        ),
      }),
    }),
    sealedArtifacts: Object.freeze({
      readVerified: input.services.sealedArtifacts.readVerified.bind(
        input.services.sealedArtifacts,
      ),
    }),
    adjudication: Object.freeze({
      service: input.services.adjudication.service,
      invoke: input.services.adjudication.invoke.bind(input.services.adjudication),
    }),
    budgets: Object.freeze({
      admit: input.services.budgets.admit.bind(input.services.budgets),
      startAttempt: input.services.budgets.startAttempt.bind(input.services.budgets),
      settle: input.services.budgets.settle.bind(input.services.budgets),
    }),
    gauges: Object.freeze({
      initialAccumulator: input.services.gauges.initialAccumulator.bind(
        input.services.gauges,
      ),
      reduce: input.services.gauges.reduce.bind(input.services.gauges),
      finalize: input.services.gauges.finalize.bind(input.services.gauges),
    }),
    fencing: Object.freeze({
      coordinator: input.services.fencing.coordinator,
      stateStore: Object.freeze({
        replace: input.services.fencing.stateStore.replace.bind(
          input.services.fencing.stateStore,
        ),
      }),
    }),
  });
  const context = Object.freeze({
    modeContract: input.modeContract,
    modeIdentity: descriptor.modeId as CrossModeClosureContext['modeIdentity'],
    interfaceVersion: descriptor.interfaceVersion,
    lifecycleEvent: input.lifecycleEvent,
    continuityIdentity: input.continuityIdentity,
    sealedReferences: Object.freeze([...input.sealedReferences]),
    budgetScope: input.budgetScope,
    writeSet: Object.freeze(input.writeSet.map((binding) => Object.freeze({
      modeResource: binding.modeResource,
      protectedResource: Object.freeze({
        ...binding.protectedResource,
        components: Object.freeze({ ...binding.protectedResource.components }),
      }),
    }))),
    posture: LEGACY_SHADOW_POSTURE,
    correlation: Object.freeze({ ...input.correlation }),
  });
  bindClosureServicePorts(context, services);
  return context;
}
