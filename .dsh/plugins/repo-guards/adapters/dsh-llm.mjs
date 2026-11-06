// ───────────────────────────────────────────────────────────────────
// MODULE: DSH LLM Loader
// ───────────────────────────────────────────────────────────────────

import { realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

let cached;

// The plugin lives in this checkout, which has no copy of the harness packages, so a
// bare specifier only resolves when it is anchored at the running dsh binary.
async function resolveFromHarness(argv1) {
  const anchor = createRequire(realpathSync(argv1));
  return import(pathToFileURL(anchor.resolve('@deepseek-ai/dsh-llm')).href);
}

/**
 * Load the harness message helpers from the dsh install that runs this plugin.
 *
 * @param {string} [argv1] Entry script of the current process, the dsh binary in a real run.
 * @returns {Promise<object>} The `@deepseek-ai/dsh-llm` module namespace.
 */
export async function loadDshLlm(argv1 = process.argv[1]) {
  if (!cached) {
    cached = import('@deepseek-ai/dsh-llm').catch(() => resolveFromHarness(argv1));
    cached.catch(() => { cached = undefined; });
  }
  return cached;
}
