// ───────────────────────────────────────────────────────────────────
// MODULE: Wrapper Render Seam
// ───────────────────────────────────────────────────────────────────

import { deepFreeze } from '../fidelity/freeze.js';

import type { ProjectMessageResult } from '../runtime/project-message.js';
import type { WrapperRunResult } from './types.js';

/**
 * Convert the entrypoint's terminal outcome into the wrapper's render result.
 * An accepted projection re-renders in place of the captured original; every
 * other terminal passes the byte-exact original through.
 */
export function renderWrapperTerminal(result: ProjectMessageResult): WrapperRunResult {
  if (result.status === 'projection') {
    return deepFreeze({
      status: 'projection',
      text: result.text,
      mode: result.mode,
    });
  }
  return deepFreeze({
    status: 'exact-original',
    text: result.text,
    reasonCode: result.reasonCode,
  });
}
