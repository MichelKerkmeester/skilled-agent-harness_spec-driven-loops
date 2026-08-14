// ───────────────────────────────────────────────────────────────────
// MODULE: Stream Capture Test Helpers
// ───────────────────────────────────────────────────────────────────

import { PROJECTION_ENABLE_ENV } from '../../src/config/enablement.js';
import { ollamaResponse } from '../providers/helpers.js';
import { WRAPPER_NOW, createWrapperConfig } from './helpers.js';

import type { ProviderTransport, WrapperProjectionConfig } from '../../src/index.js';

export const STREAM_NOW = WRAPPER_NOW;
export const SOURCE = 'deploy the `release` build now.';
export const EXPECTED_PROJECTION = 'ship the `release` build today.';

const priorEnv = process.env[PROJECTION_ENABLE_ENV];

/** Restore the projection enablement env var between tests. */
export function restoreEnablementEnv(): void {
  if (priorEnv === undefined) {
    delete process.env[PROJECTION_ENABLE_ENV];
  } else {
    process.env[PROJECTION_ENABLE_ENV] = priorEnv;
  }
}

/** A stub transport that projects the deploy phrase to its ship form. */
export function makeProjectingTransport(): ProviderTransport {
  return async (request) => {
    const messages = (request.body as {
      messages: readonly { role: string; content: string }[];
    }).messages;
    const user = messages.find((entry) => entry.role === 'user')?.content ?? '';
    return ollamaResponse(user.replace('deploy', 'ship').replace(' now', ' today'));
  };
}

/** A projection config backed by the projecting stub transport. */
export function makeProjectingConfig(transport: ProviderTransport): WrapperProjectionConfig {
  return createWrapperConfig({ transport });
}
