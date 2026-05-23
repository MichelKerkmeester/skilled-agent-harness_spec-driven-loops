// ───────────────────────────────────────────────────────────────
// MODULE: Embedder Reindex Test Seam
// ───────────────────────────────────────────────────────────────

import {
  cancelJob,
  startReindexForTest,
} from './reindex.js';

export const __embedderReindexTestables = {
  cancelJob,
  startReindex: startReindexForTest,
};
