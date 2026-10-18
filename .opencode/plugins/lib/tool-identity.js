// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Tool Identity
// ───────────────────────────────────────────────────────────────────

import { z } from 'zod';

/**
 * Return a v1 tool definition unchanged.
 *
 * @param {unknown} definition - The tool definition to pass through.
 * @returns {unknown} The same tool definition.
 */
export function tool(definition) {
  return definition;
}

tool.schema = z;
