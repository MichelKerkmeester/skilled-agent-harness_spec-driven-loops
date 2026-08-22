// ───────────────────────────────────────────────────────────────────
// MODULE: Per-Mode Authority Flip — Coordinator Factory
// ───────────────────────────────────────────────────────────────────

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
} from '../authorized-ledger/index.js';
import { createAuthorityFlipTransitionPolicyRegistry } from './authority-flip-policy.js';
import { AuthorityFlipCoordinator } from './cutover-coordinator.js';
import { createAuthorityTransitionEventRegistry } from './ledger-event.js';

import type { AuthoritySnapshot } from '../authorized-ledger/index.js';
import type { AuthorityRegistry } from './authority-registry.js';
import type {
  AuthorityFlipCoordinatorOptions,
  AuthorityFlipExpectedIdentity,
} from './cutover-coordinator.js';
import type { CutoverCertificateMode } from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export interface AuthorityFlipCoordinatorFactoryOptions {
  readonly rootDirectory: string;
  readonly ledgerId: string;
  readonly auditLedgerId?: string;
  readonly registry: AuthorityRegistry;
  readonly expectedIdentity: AuthorityFlipExpectedIdentity;
  readonly authorizedActorIds: readonly string[];
  readonly authorizedCapabilityIds: readonly string[];
  readonly now?: () => Date;
}

export interface AuthorityFlipCoordinatorBundle {
  readonly coordinator: AuthorityFlipCoordinator;
  readonly gateway: TransitionAuthorizationGateway;
  readonly ledger: AppendOnlyLedger;
  readonly policies: ReturnType<typeof createAuthorityFlipTransitionPolicyRegistry>;
}

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function authoritySnapshot(
  registry: AuthorityRegistry,
  mode: string,
): AuthoritySnapshot {
  const record = registry.read(mode as CutoverCertificateMode);
  return Object.freeze({ state: record.state, epoch: record.epoch });
}

function identityResolver(
  expectedIdentity: AuthorityFlipExpectedIdentity,
): NonNullable<ConstructorParameters<typeof TransitionAuthorizationGateway>[0]['identityResolver']> {
  return ({ evaluationInput }) => ({
    actorId: expectedIdentity.actorId,
    capabilityId: expectedIdentity.capabilityId,
    evidenceDigest: evaluationInput.evidenceDigest,
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. PUBLIC FACTORY
// ───────────────────────────────────────────────────────────────────

/** Assemble the production ledger, gateway, policy registry, and coordinator. */
export function createAuthorityFlipCoordinator(
  options: AuthorityFlipCoordinatorFactoryOptions,
): AuthorityFlipCoordinatorBundle {
  const now = options.now ?? (() => new Date());
  const policies = createAuthorityFlipTransitionPolicyRegistry(options);
  const authorityProvider = (mode: string): AuthoritySnapshot => authoritySnapshot(options.registry, mode);
  const eventRegistry = createAuthorityTransitionEventRegistry();
  const ledger = new AppendOnlyLedger({
    rootDirectory: options.rootDirectory,
    ledgerId: options.ledgerId,
    auditLedgerId: options.auditLedgerId,
    authorityProvider,
    now,
  }, eventRegistry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory: options.rootDirectory,
    auditLedgerId: options.auditLedgerId,
    authorityProvider,
    identityResolver: identityResolver(options.expectedIdentity),
    now,
  }, ledger, policies);
  const coordinatorOptions: AuthorityFlipCoordinatorOptions = {
    registry: options.registry,
    ledger,
    gateway,
    policies,
    identityResolver: () => options.expectedIdentity,
    now,
  };
  return Object.freeze({
    coordinator: new AuthorityFlipCoordinator(coordinatorOptions),
    gateway,
    ledger,
    policies,
  });
}
