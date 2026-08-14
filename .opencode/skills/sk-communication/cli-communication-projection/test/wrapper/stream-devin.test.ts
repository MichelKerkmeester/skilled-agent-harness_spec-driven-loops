// ───────────────────────────────────────────────────────────────────
// MODULE: Devin Print-Mode Wrapper Tests
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

describe('devin stream capture', () => {
  it('captures -p print output, projects, and re-renders', async () => {
    process.env.COMMUNICATION_PROJECTION_ENABLED = '1';
    const transport = vi.fn(makeProjectingTransport());

    const result = await projectRuntimeStream('devin', {
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

    const result = await projectRuntimeStream('devin', {
      capturedText: SOURCE,
      capturedAt: STREAM_NOW,
    }, makeProjectingConfig(transport));

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'projection-disabled' });
    expect(result.text).toBe(SOURCE);
    expect(transport).not.toHaveBeenCalled();
  });

  it('fails open to the raw stream on empty print output', async () => {
    process.env.COMMUNICATION_PROJECTION_ENABLED = '1';
    const empty = '\n';

    const result = await projectRuntimeStream('devin', {
      capturedText: empty,
      capturedAt: STREAM_NOW,
    }, makeProjectingConfig(vi.fn(makeProjectingTransport())));

    expect(result).toMatchObject({ status: 'exact-original', reasonCode: 'empty-stream' });
    expect(result.text).toBe(empty);
  });
});
