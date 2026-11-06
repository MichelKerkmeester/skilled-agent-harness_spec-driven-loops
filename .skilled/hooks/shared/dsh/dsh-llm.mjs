// ───────────────────────────────────────────────────────────────────
// MODULE: DSH LLM Loader
// ───────────────────────────────────────────────────────────────────

import { realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const cache = new Map();

// The plugin lives in this checkout, which has no copy of the harness packages, so a
// bare specifier only resolves when it is anchored at the running dsh binary.
async function resolveFromHarness(specifier, argv1) {
  const anchor = createRequire(realpathSync(argv1));
  return import(pathToFileURL(anchor.resolve(specifier)).href);
}

function loadHarnessPackage(specifier, argv1) {
  if (!cache.has(specifier)) {
    const loading = import(specifier).catch(() => resolveFromHarness(specifier, argv1));
    cache.set(specifier, loading);
    loading.catch(() => { cache.delete(specifier); });
  }
  return cache.get(specifier);
}

/**
 * Load the harness message helpers from the dsh install that runs this plugin.
 *
 * @param {string} [argv1] Entry script of the current process, the dsh binary in a real run.
 * @returns {Promise<object>} The `@deepseek-ai/dsh-llm` module namespace.
 */
export async function loadDshLlm(argv1 = process.argv[1]) {
  return loadHarnessPackage('@deepseek-ai/dsh-llm', argv1);
}

/**
 * Load the harness tool helpers, `defineTool` among them, from the same install.
 *
 * @param {string} [argv1] Entry script of the current process, the dsh binary in a real run.
 * @returns {Promise<object>} The `@deepseek-ai/dsh-tools` module namespace.
 */
export async function loadDshTools(argv1 = process.argv[1]) {
  return loadHarnessPackage('@deepseek-ai/dsh-tools', argv1);
}
