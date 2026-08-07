// ───────────────────────────────────────────────────────────────────
// MODULE: Authorized Ledger Concurrent Writer
// ───────────────────────────────────────────────────────────────────

import {
  AppendOnlyLedger,
  AuthorizedLedgerError,
  TransitionAuthorizationGateway,
} from '../../lib/authorized-ledger/index.js';
import {
  FIXTURE_AUDIT_LEDGER_ID,
  FIXTURE_AUTHORITY,
  FIXTURE_LEDGER_ID,
  createFixtureEvent,
  createFixtureEventRegistry,
  createFixturePolicyRegistry,
  createFixtureRequest,
} from './authorized-ledger-fixtures.js';

// ───────────────────────────────────────────────────────────────────
// 1. WORKER
// ───────────────────────────────────────────────────────────────────

const rootDirectory = process.argv[2];
const index = Number(process.argv[3]);
if (!rootDirectory || !Number.isSafeInteger(index) || index <= 0) {
  throw new Error('Worker requires a ledger root and positive event index');
}

const registry = createFixtureEventRegistry();
const policies = createFixturePolicyRegistry();
const authorityProvider = (): typeof FIXTURE_AUTHORITY => FIXTURE_AUTHORITY;
const ledger = new AppendOnlyLedger({
  rootDirectory,
  ledgerId: FIXTURE_LEDGER_ID,
  auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
  authorityProvider,
}, registry);
const gateway = new TransitionAuthorizationGateway({
  rootDirectory,
  auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
  authorityProvider,
}, ledger, policies);
const event = createFixtureEvent(registry, index);

let receipt;
for (let attempt = 1; attempt <= 40; attempt += 1) {
  const request = await createFixtureRequest(
    ledger,
    event,
    policies,
    `worker-${index}-attempt-${attempt}`,
  );
  const authorization = await gateway.authorize(request);
  if (authorization.verdict === 'deny') continue;
  try {
    receipt = await ledger.appendAuthorized(event, authorization.proof);
    break;
  } catch (error: unknown) {
    if (!(error instanceof AuthorizedLedgerError)) throw error;
    await new Promise((resolveWait) => setTimeout(resolveWait, 5));
  }
}

if (!receipt) throw new Error(`Worker ${index} exhausted append retries`);
process.stdout.write(JSON.stringify(receipt));
