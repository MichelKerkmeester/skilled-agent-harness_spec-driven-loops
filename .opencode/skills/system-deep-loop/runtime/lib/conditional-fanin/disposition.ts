import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';

import type {
  BudgetEvidenceInput,
  BudgetMutationResult,
  HierarchicalBudgetAuthority,
} from '../hierarchical-budgets/index.js';
import type {
  OutstandingBranchAtCut,
  OutstandingDisposition,
} from './types.js';

function stableDispositionKey(
  decisionIdentity: string,
  logicalBranchId: string,
  kind: OutstandingDisposition['kind'],
): string {
  return `fanin-disposition:${sha256Bytes(canonicalBytes({
    decision_identity: decisionIdentity,
    logical_branch_id: logicalBranchId,
    kind,
  }))}`;
}

export function planOutstandingDispositions(
  decisionIdentity: string,
  branches: readonly OutstandingBranchAtCut[],
): readonly OutstandingDisposition[] {
  const seen = new Set<string>();
  const dispositions = [...branches]
    .sort((left, right) => left.branch.registration.logical_branch_id.localeCompare(
      right.branch.registration.logical_branch_id,
    ))
    .map((branch): OutstandingDisposition => {
      const logicalBranchId = branch.branch.registration.logical_branch_id;
      if (seen.has(logicalBranchId)) {
        throw new TypeError('Cannot plan multiple dispositions for one logical branch');
      }
      seen.add(logicalBranchId);
      const leaseId = branch.lease?.leaseId ?? null;
      const fenceToken = branch.lease?.fenceToken ?? null;
      const common = {
        logicalBranchId,
        reservationId: branch.reservationId,
        dispatchId: branch.dispatchId,
        leaseId,
        fenceToken,
      };
      if (branch.executionState === 'queued') {
        const kind = 'withdraw' as const;
        return Object.freeze({
          ...common,
          kind,
          idempotencyKey: stableDispositionKey(decisionIdentity, logicalBranchId, kind),
          retainLease: false,
          retainSpend: true,
          settleActualSpend: false,
        });
      }
      if (branch.executionState === 'reserved-not-started') {
        if (branch.reservationId === null) {
          throw new TypeError('Reserved branch disposition requires a reservation identity');
        }
        const kind = 'cancel-reservation' as const;
        return Object.freeze({
          ...common,
          kind,
          idempotencyKey: stableDispositionKey(decisionIdentity, logicalBranchId, kind),
          retainLease: false,
          retainSpend: true,
          settleActualSpend: false,
        });
      }
      if (branch.executionState === 'running' && branch.cancellable) {
        if (leaseId === null || fenceToken === null) {
          throw new TypeError('Running cancellation requires an exact fenced lease');
        }
        const kind = 'fenced-cancel' as const;
        return Object.freeze({
          ...common,
          kind,
          idempotencyKey: stableDispositionKey(decisionIdentity, logicalBranchId, kind),
          retainLease: true,
          retainSpend: true,
          settleActualSpend: true,
        });
      }
      if (branch.executionState === 'running') {
        const kind = 'detach-to-salvage' as const;
        return Object.freeze({
          ...common,
          kind,
          idempotencyKey: stableDispositionKey(decisionIdentity, logicalBranchId, kind),
          retainLease: true,
          retainSpend: true,
          settleActualSpend: true,
        });
      }
      const kind = 'retain-terminal' as const;
      return Object.freeze({
        ...common,
        kind,
        idempotencyKey: stableDispositionKey(decisionIdentity, logicalBranchId, kind),
        retainLease: branch.lease?.status === 'active',
        retainSpend: true,
        settleActualSpend: false,
      });
    });
  return Object.freeze(dispositions);
}

export interface OutstandingDispositionPorts {
  withdrawQueued(disposition: OutstandingDisposition): Promise<void>;
  proveNoDispatch(disposition: OutstandingDisposition): Promise<string>;
  cancelAndSettleActual(disposition: OutstandingDisposition): Promise<void>;
  detachToSalvage(disposition: OutstandingDisposition): Promise<void>;
}

export interface ApplyOutstandingDispositionsInput {
  readonly dispositions: readonly OutstandingDisposition[];
  readonly budgetAuthority: HierarchicalBudgetAuthority;
  readonly ports: OutstandingDispositionPorts;
  readonly budgetEvidence: (
    disposition: OutstandingDisposition,
  ) => Omit<BudgetEvidenceInput, 'requestId' | 'operationId' | 'evidenceDigest'>;
}

export async function applyOutstandingDispositions(
  input: ApplyOutstandingDispositionsInput,
): Promise<readonly (BudgetMutationResult | null)[]> {
  const results: (BudgetMutationResult | null)[] = [];
  for (const disposition of input.dispositions) {
    if (disposition.kind === 'withdraw') {
      await input.ports.withdrawQueued(disposition);
      results.push(null);
      continue;
    }
    if (disposition.kind === 'cancel-reservation') {
      if (disposition.reservationId === null) {
        throw new TypeError('Reservation cancellation is missing its reservation identity');
      }
      const noDispatchEvidenceDigest = await input.ports.proveNoDispatch(disposition);
      const evidence = input.budgetEvidence(disposition);
      results.push(await input.budgetAuthority.cancel({
        ...evidence,
        requestId: disposition.idempotencyKey,
        operationId: disposition.idempotencyKey,
        evidenceDigest: noDispatchEvidenceDigest,
        reservationId: disposition.reservationId,
        noDispatchEvidenceDigest,
      }));
      continue;
    }
    if (disposition.kind === 'fenced-cancel') {
      await input.ports.cancelAndSettleActual(disposition);
      results.push(null);
      continue;
    }
    if (disposition.kind === 'detach-to-salvage') {
      await input.ports.detachToSalvage(disposition);
      results.push(null);
      continue;
    }
    results.push(null);
  }
  return Object.freeze(results);
}
