// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Exec JSON-Stream Wrapper Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it, vi } from 'vitest';

import { projectRuntimeStream } from '../../src/index.js';
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

const CODEX_STREAM = [
  '{"type":"thread-started"}',
  `{"type":"agent-message","text":"${SOURCE}"}`,
  '{"type":"turn-completed"}',
].join('\n');

describe('codex stream capture', () => {
  it('captures the JSON stream, projects, and re-renders', async () => {
    process.env.COMMUNICATION_PROJECTION_ENABLED = '1';
    const transport = vi.fn(makeProjectingTransport());

    const result = await projectRuntimeStream('codex', {
      capturedText: CODEX_STREAM,
      capturedAt: STREAM_NOW,
    }, makeProjectingConfig(transport));

    expect(result.status).toBe('projection');
    if (result.status !== 'projection') {
      throw new Error('Expected a projection.');
    }
    expect(result.text).toBe(EXPECTED_PROJECTION);
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it('passes the byte-exact original through when projection is disabled', async () => {
    process.env.COMMUNICATION_PROJECTION_ENABLED = '0';
    const transport = vi.fn(makeProjectingTransport());

    const result = await projectRuntimeStream('codex', {
      capturedText: CODEX_STREAM,
      capturedAt: STREAM_NOW,
    }, makeProjectingConfig(transport));

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'projection-disabled' });
    expect(result.text).toBe(SOURCE);
    expect(transport).not.toHaveBeenCalled();
  });

  it('fails open to the raw stream on an empty capture', async () => {
    process.env.COMMUNICATION_PROJECTION_ENABLED = '1';

    const result = await projectRuntimeStream('codex', {
      capturedText: '',
      capturedAt: STREAM_NOW,
    }, makeProjectingConfig(vi.fn(makeProjectingTransport())));

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'empty-stream' });
    expect(result.text).toBe('');
  });

  it('fails open to the raw stream on a malformed line', async () => {
    process.env.COMMUNICATION_PROJECTION_ENABLED = '1';
    const malformed = '{"type":"thread-started"}\nnot-json\n';

    const result = await projectRuntimeStream('codex', {
      capturedText: malformed,
      capturedAt: STREAM_NOW,
    }, makeProjectingConfig(vi.fn(makeProjectingTransport())));

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'malformed-stream' });
    expect(result.text).toBe(malformed);
  });

  it('fails open to the raw stream when no agent message is present', async () => {
    process.env.COMMUNICATION_PROJECTION_ENABLED = '1';
    const noMessage = '{"type":"thread-started"}\n{"type":"turn-completed"}\n';

    const result = await projectRuntimeStream('codex', {
      capturedText: noMessage,
      capturedAt: STREAM_NOW,
    }, makeProjectingConfig(vi.fn(makeProjectingTransport())));

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'no-assistant-message' });
    expect(result.text).toBe(noMessage);
  });

  it('fails open on a terminal error event', async () => {
    process.env.COMMUNICATION_PROJECTION_ENABLED = '1';
    const errored = [
      `{"type":"agent-message","text":"${SOURCE}"}`,
      '{"type":"error","message":"boom"}',
    ].join('\n');

    const result = await projectRuntimeStream('codex', {
      capturedText: errored,
      capturedAt: STREAM_NOW,
    }, makeProjectingConfig(vi.fn(makeProjectingTransport())));

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'runtime-failure' });
    expect(result.text).toBe(errored);
  });
});
