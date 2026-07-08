// MODULE: Dispatch Receipt Cryptography Tests

import { describe, expect, it } from 'vitest';
import { createHmac } from 'node:crypto';
import {
  canonicalReceiptJson,
  deriveReceiptKey,
  signReceipt,
  verifyReceipt,
} from '../lib/deep-loop/receipt-crypto.js';

const RUN_MASTER = 'run-master-secret-0123456789abcdef';
const DISPATCH_ID = 'dispatch-i1-aa11bb22';
const OTHER_DISPATCH_ID = 'dispatch-i2-ff99ee88';

describe('receipt-crypto deriveReceiptKey', () => {
  it('derives an HMAC-SHA256 hex key from run-master secret and dispatchId', () => {
    const key = deriveReceiptKey(RUN_MASTER, DISPATCH_ID);

    expect(key).toMatch(/^[0-9a-f]{64}$/);

    // Matches the literal HMAC-SHA256(secret, dispatchId) contract.
    const expected = createHmac('sha256', RUN_MASTER).update(DISPATCH_ID).digest('hex');
    expect(key).toBe(expected);
  });

  it('is deterministic: re-deriving from the same run-master + dispatchId yields the same key (resume re-verify)', () => {
    const first = deriveReceiptKey(RUN_MASTER, DISPATCH_ID);
    const second = deriveReceiptKey(RUN_MASTER, DISPATCH_ID);

    expect(second).toBe(first);
  });

  it('differs across dispatchIds and run-master secrets', () => {
    expect(deriveReceiptKey(RUN_MASTER, DISPATCH_ID)).not.toBe(deriveReceiptKey(RUN_MASTER, OTHER_DISPATCH_ID));
    expect(deriveReceiptKey(RUN_MASTER, DISPATCH_ID)).not.toBe(deriveReceiptKey('different-secret', DISPATCH_ID));
  });
});

describe('receipt-crypto signReceipt / verifyReceipt round-trip', () => {
  it('verifies a freshly signed receipt', () => {
    const key = deriveReceiptKey(RUN_MASTER, DISPATCH_ID);
    const record = {
      version: 1,
      type: 'dispatch_receipt',
      phase: 'intent',
      dispatchId: DISPATCH_ID,
      issuedAt: '2026-07-03T00:00:00.000Z',
      facts: { command: 'node', args: ['-e', '1'], cwd: '/tmp', iteration: 1 },
    };

    const mac = signReceipt(record, key);
    expect(mac).toMatch(/^[0-9a-f]{64}$/);
    expect(verifyReceipt(record, mac, key)).toBe(true);
  });

  it('verifies the same record with the mac field attached (symmetric sign/verify)', () => {
    const key = deriveReceiptKey(RUN_MASTER, DISPATCH_ID);
    const unsigned = { dispatchId: DISPATCH_ID, facts: { a: 1 } };
    const signed = { ...unsigned, mac: signReceipt(unsigned, key) };

    // verifyReceipt must ignore the attached mac when recomputing.
    expect(verifyReceipt(signed, signed.mac, key)).toBe(true);
  });
});

describe('receipt-crypto forgery rejection', () => {
  it('rejects a forged mac', () => {
    const key = deriveReceiptKey(RUN_MASTER, DISPATCH_ID);
    const record = { dispatchId: DISPATCH_ID, facts: { command: 'node' } };
    const realMac = signReceipt(record, key);
    const tampered = realMac.slice(0, 62) + (realMac.slice(62) === '0' ? '1' : '0');

    expect(verifyReceipt(record, tampered, key)).toBe(false);
  });

  it('rejects a mac computed under a different key (wrong run-master / dispatchId)', () => {
    const record = { dispatchId: DISPATCH_ID, facts: { command: 'node' } };
    const macUnderRealKey = signReceipt(record, deriveReceiptKey(RUN_MASTER, DISPATCH_ID));

    expect(verifyReceipt(record, macUnderRealKey, deriveReceiptKey(RUN_MASTER, OTHER_DISPATCH_ID))).toBe(false);
    expect(verifyReceipt(record, macUnderRealKey, deriveReceiptKey('other-secret', DISPATCH_ID))).toBe(false);
  });

  it('rejects a truncated mac (length mismatch)', () => {
    const key = deriveReceiptKey(RUN_MASTER, DISPATCH_ID);
    const record = { dispatchId: DISPATCH_ID, facts: { command: 'node' } };
    const mac = signReceipt(record, key);

    expect(verifyReceipt(record, mac.slice(0, 32), key)).toBe(false);
  });

  it('rejects a tampered payload even with the original mac', () => {
    const key = deriveReceiptKey(RUN_MASTER, DISPATCH_ID);
    const record = { dispatchId: DISPATCH_ID, facts: { command: 'node' } };
    const mac = signReceipt(record, key);

    const tamperedRecord = { ...record, facts: { command: 'malicious' } };
    expect(verifyReceipt(tamperedRecord, mac, key)).toBe(false);
  });
});

describe('receipt-crypto canonicalReceiptJson', () => {
  it('is order-independent (sorted keys) so a signature reproduces regardless of insertion order', () => {
    const key = deriveReceiptKey(RUN_MASTER, DISPATCH_ID);
    const a = { dispatchId: DISPATCH_ID, facts: { z: 1, a: 2 }, version: 1 };
    const b = { version: 1, facts: { a: 2, z: 1 }, dispatchId: DISPATCH_ID };

    expect(canonicalReceiptJson(a)).toBe(canonicalReceiptJson(b));
    expect(signReceipt(a, key)).toBe(signReceipt(b, key));
  });

  it('excludes the mac field from the signed payload', () => {
    const key = deriveReceiptKey(RUN_MASTER, DISPATCH_ID);
    const withoutMac = { dispatchId: DISPATCH_ID, facts: { command: 'node' } };
    const withMac = { ...withoutMac, mac: 'deadbeef' };

    expect(signReceipt(withoutMac, key)).toBe(signReceipt(withMac, key));
  });
});
