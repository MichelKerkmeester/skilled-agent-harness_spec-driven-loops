import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
} from '../../lib/authorized-ledger/index.js';
import {
  AtomicityDomains,
  FencedLeaseCoordinator,
  FencedLedgerWriter,
  LocksAndFencingError,
  ProtectedResourceKinds,
  canonicalizeProtectedResource,
} from '../../lib/locks-and-fencing/index.js';
import {
  FIXTURE_AUDIT_LEDGER_ID,
  FIXTURE_AUTHORITY,
  FIXTURE_LEDGER_ID,
  createFixtureEvent,
  createFixtureEventRegistry,
  createFixturePolicyRegistry,
  createFixtureRequest,
} from './authorized-ledger-fixtures.js';

const rootDirectory = process.argv[2];
const role = process.argv[3];
const controlDirectory = process.argv[4];
if (!rootDirectory || !controlDirectory || (role !== 'stale' && role !== 'successor')) {
  throw new Error('Fenced worker requires a root, role, and control directory');
}

async function waitFor(path: string): Promise<void> {
  while (!existsSync(path)) {
    await new Promise<void>((resolveWait) => setImmediate(resolveWait));
  }
}

const registry = createFixtureEventRegistry();
const policies = createFixturePolicyRegistry();
const ledger = new AppendOnlyLedger({
  rootDirectory,
  ledgerId: FIXTURE_LEDGER_ID,
  auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
  authorityProvider: () => FIXTURE_AUTHORITY,
}, registry);
const resource = canonicalizeProtectedResource({
  kind: ProtectedResourceKinds.LEDGER,
  atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
  components: { ledgerId: FIXTURE_LEDGER_ID },
});
const coordinator = new FencedLeaseCoordinator({
  rootDirectory,
  retryIntervalMs: 1,
  operationTimeoutMs: 100,
});

if (role === 'stale') {
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider: () => FIXTURE_AUTHORITY,
  }, ledger, policies);
  const event = createFixtureEvent(registry, 1);
  const request = await createFixtureRequest(ledger, event, policies, 'superseded-writer');
  const authorization = await gateway.authorize(request);
  if (authorization.verdict !== 'allow') throw new Error('Fixture authorization unexpectedly denied');
  const lease = await coordinator.acquire({
    resource,
    ownerId: 'stale-writer',
    correlationId: 'superseded-writer',
    ttlMs: 5_000,
    acquireTimeoutMs: 1_000,
  });
  writeFileSync(`${controlDirectory}/stale-ready`, 'ready', 'utf8');
  await coordinator.release(lease);
  writeFileSync(`${controlDirectory}/stale-released`, 'released', 'utf8');
  await waitFor(`${controlDirectory}/successor-acquired`);
  let result: Record<string, unknown>;
  try {
    await new FencedLedgerWriter(coordinator).append({
      lease,
      ledger,
      event,
      proof: authorization.proof,
      expectedHead: await ledger.getVerifiedHead(),
    });
    result = { status: 'unexpected-append' };
  } catch (error: unknown) {
    result = {
      status: 'rejected',
      code: error instanceof LocksAndFencingError ? error.code : 'UNEXPECTED_FAILURE',
    };
  }
  writeFileSync(`${controlDirectory}/stale-result`, JSON.stringify(result), 'utf8');
  await waitFor(`${controlDirectory}/successor-result`);
  process.stdout.write(JSON.stringify(result));
} else {
  await waitFor(`${controlDirectory}/stale-ready`);
  await waitFor(`${controlDirectory}/stale-released`);
  const successor = await coordinator.acquire({
    resource,
    ownerId: 'successor-writer',
    correlationId: 'superseded-writer',
    ttlMs: 5_000,
    acquireTimeoutMs: 1_000,
  });
  writeFileSync(`${controlDirectory}/successor-acquired`, String(successor.fenceToken), 'utf8');
  await waitFor(`${controlDirectory}/stale-result`);
  writeFileSync(`${controlDirectory}/successor-result`, 'ready', 'utf8');
  await coordinator.release(successor);
  process.stdout.write(JSON.stringify({ status: 'successor-acquired', fenceToken: successor.fenceToken }));
}
import { existsSync, writeFileSync } from 'node:fs';
