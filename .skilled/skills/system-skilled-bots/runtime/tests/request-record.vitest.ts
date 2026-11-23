// Request record: the key comes from the event, never the body, and a resume keys on its item.

import { describe, expect, it } from 'vitest';

import { buildRequest, deriveIdempotencyKey, validateRequest } from '../lib/request-record.js';

const target = { identity: 'acme/tool', path: '/tmp/checkout' };

describe('request record', () => {
  it('keys one source event the same whatever the prompt, and a caller key wins', () => {
    const first = buildRequest({ workflowId: 'review', source: 'webhook', eventId: 'evt-1', prompt: 'first', target });
    const second = buildRequest({ workflowId: 'review', source: 'webhook', eventId: 'evt-1', prompt: 'changed payload', target });
    expect(first.ok && second.ok).toBe(true);
    if (!first.ok || !second.ok) return;
    expect(first.value.idempotencyKey).toBe('webhook:evt-1');
    expect(second.value.idempotencyKey).toBe(first.value.idempotencyKey);
    expect(second.value.id).toBe(first.value.id);
    expect(first.value).toMatchObject({ kind: 'run', attempts: 0, target });
    expect(deriveIdempotencyKey({ source: 'webhook', eventId: 'evt-1', key: 'caller-key' })).toEqual({ ok: true, value: 'caller-key' });
  });

  it('refuses a run request with neither an event id nor a key', () => {
    expect(buildRequest({ workflowId: 'review', source: 'webhook', target })).toMatchObject({ ok: false, reason: 'event-id-missing' });
  });

  it('keys a resume request on its needs-you item id and refuses any other source', () => {
    const resume = buildRequest({ kind: 'resume', workflowId: 'review', source: 'answer', eventId: '20261123T000000Z-abcd', target });
    expect(resume.ok && resume.value.idempotencyKey).toBe('20261123T000000Z-abcd');
    expect(buildRequest({ kind: 'resume', workflowId: 'review', source: 'webhook', eventId: 'x1', target })).toMatchObject({
      ok: false,
      reason: 'resume-source-invalid',
    });
  });

  it('rejects a record whose id does not match its key, or that carries an unknown field', () => {
    const built = buildRequest({ workflowId: 'review', source: 'webhook', eventId: 'evt-1', target });
    if (!built.ok) throw new Error(built.reason);
    expect(validateRequest({ ...built.value, id: 'rq-forged' })).toMatchObject({ ok: false, reason: 'request-id-mismatch' });
    expect(validateRequest({ ...built.value, extra: 1 })).toMatchObject({ ok: false, reason: 'unknown-key', detail: 'extra' });
  });
});
