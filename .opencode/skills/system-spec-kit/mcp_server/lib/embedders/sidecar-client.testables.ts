// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — sidecar client testables
// ───────────────────────────────────────────────────────────────

import type { SidecarClientOptions, SidecarClientTestOptions } from './sidecar-client.js';

export const __sidecarClientTypeFixtures = {
  productionOptionsRejectTestFields(): SidecarClientOptions {
    return {
      provider: 'hf-local',
      model: 'model',
      dimensions: 3,
      // @ts-expect-error workerPath belongs to SidecarClientTestOptions, not SidecarClientOptions.
      workerPath: 'worker.cjs',
    };
  },

  testOptionsAcceptTestFields(): SidecarClientTestOptions {
    return {
      provider: 'hf-local',
      model: 'model',
      dimensions: 3,
      workerPath: 'worker.cjs',
      pingTimeoutMs: 100,
      requestTimeoutMs: 200,
    };
  },
};
