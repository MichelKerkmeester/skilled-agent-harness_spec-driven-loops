// ───────────────────────────────────────────────────────────────────
// MODULE: Claude Code Headless Stream Wrapper Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  projectRuntimeStream,
} from '../../src/index.js';
import {
  EXPECTED_PROJECTION,
  SOURCE,
  STREAM_NOW,
  makeProjectingConfig,
  makeProjectingTransport,
  restoreEnablementEnv,
} from './stream-helpers.js';

afterEach(() => {
  restoreEnablementEnv();
});

const CLAUDE_STREAM = [
  '{"type":"system","subtype":"init","session_id":"s-1"}',
  `{"type":"assistant","message":{"content":[{"type":"text","text":"${SOURCE}"}]}}`,
  '{"type":"result","subtype":"success","is_error":false,"result":"ok"}',
].join('\n');

describe('claude stream capture', () => {
  it('captures headless stream-json, projects, and re-renders', async () => {
    process.env.COMMUNICATION_PROJECTION_ENABLED = '1';
    const transport = vi.fn(makeProjectingTransport());

    const result = await projectRuntimeStream('claude', {
      capturedText: CLAUDE_STREAM,
      capturedAt: STREAM_NOW,
    }, makeProjectingConfig(transport));

    expect(result.status).toBe('projection');
    if (result.status !== 'projection') {
      throw new Error('Expected a projection.');
    }
    expect(result.text).toBe(EXPECTED_PROJECTION);
    expect(result.mode).toBe('atomic-replace');
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it('passes the byte-exact original through when projection is disabled', async () => {
    process.env.COMMUNICATION_PROJECTION_ENABLED = '0';
    const transport = vi.fn(makeProjectingTransport());

    const result = await projectRuntimeStream('claude', {
      capturedText: CLAUDE_STREAM,
      capturedAt: STREAM_NOW,
    }, makeProjectingConfig(transport));

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'projection-disabled' });
    expect(result.text).toBe(SOURCE);
    expect(transport).not.toHaveBeenCalled();
  });

  it('fails open to the raw stream on an empty capture', async () => {
    process.env.COMMUNICATION_PROJECTION_ENABLED = '1';

    const result = await projectRuntimeStream('claude', {
      capturedText: '   \n',
      capturedAt: STREAM_NOW,
    }, makeProjectingConfig(vi.fn(makeProjectingTransport())));

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'empty-stream' });
    expect(result.text).toBe('   \n');
  });

  it('fails open to the raw stream on a malformed line', async () => {
    process.env.COMMUNICATION_PROJECTION_ENABLED = '1';
    const malformed = '{"type":"assistant","message":{}}\nnot-json\n';

    const result = await projectRuntimeStream('claude', {
      capturedText: malformed,
      capturedAt: STREAM_NOW,
    }, makeProjectingConfig(vi.fn(makeProjectingTransport())));

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'malformed-stream' });
    expect(result.text).toBe(malformed);
  });

  it('fails open to the raw stream when no assistant message is present', async () => {
    process.env.COMMUNICATION_PROJECTION_ENABLED = '1';
    const noMessage = '{"type":"system","subtype":"init"}\n';

    const result = await projectRuntimeStream('claude', {
      capturedText: noMessage,
      capturedAt: STREAM_NOW,
    }, makeProjectingConfig(vi.fn(makeProjectingTransport())));

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'no-assistant-message' });
    expect(result.text).toBe(noMessage);
  });

  it('fails open on a terminal error result', async () => {
    process.env.COMMUNICATION_PROJECTION_ENABLED = '1';
    const errored = [
      '{"type":"assistant","message":{"content":[{"type":"text","text":"partial"}]}}',
      '{"type":"result","subtype":"error","is_error":true,"result":"boom"}',
    ].join('\n');

    const result = await projectRuntimeStream('claude', {
      capturedText: errored,
      capturedAt: STREAM_NOW,
    }, makeProjectingConfig(vi.fn(makeProjectingTransport())));

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'runtime-failure' });
    expect(result.text).toBe(errored);
  });

  it('passes the raw stream through for an incapable runtime', async () => {
    process.env.COMMUNICATION_PROJECTION_ENABLED = '1';

    const result = await projectRuntimeStream('opencode', {
      capturedText: SOURCE,
      capturedAt: STREAM_NOW,
    }, makeProjectingConfig(vi.fn(makeProjectingTransport())));

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'runtime-incapable' });
    expect(result.text).toBe(SOURCE);
  });
});
