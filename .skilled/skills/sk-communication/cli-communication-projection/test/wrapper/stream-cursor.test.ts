// ───────────────────────────────────────────────────────────────────
// MODULE: Cursor Agent Non-Interactive Wrapper Tests
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

describe('cursor stream capture', () => {
  it('captures non-interactive stdout, projects, and re-renders', async () => {
    process.env.COMMUNICATION_PROJECTION_ENABLED = '1';
    const transport = vi.fn(makeProjectingTransport());

    const result = await projectRuntimeStream('cursor', {
      capturedText: SOURCE,
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

    const result = await projectRuntimeStream('cursor', {
      capturedText: SOURCE,
      capturedAt: STREAM_NOW,
    }, makeProjectingConfig(transport));

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'projection-disabled' });
    expect(result.text).toBe(SOURCE);
    expect(transport).not.toHaveBeenCalled();
  });

  it('fails open to the raw stream on empty stdout', async () => {
    process.env.COMMUNICATION_PROJECTION_ENABLED = '1';
    const empty = '';

    const result = await projectRuntimeStream('cursor', {
      capturedText: empty,
      capturedAt: STREAM_NOW,
    }, makeProjectingConfig(vi.fn(makeProjectingTransport())));

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'empty-stream' });
    expect(result.text).toBe(empty);
  });
});
