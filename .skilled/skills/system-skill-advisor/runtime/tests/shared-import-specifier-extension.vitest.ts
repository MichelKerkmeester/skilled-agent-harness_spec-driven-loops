// ───────────────────────────────────────────────────────────────────
// TEST: @spec-kit/shared import specifiers carry the .js extension
// ───────────────────────────────────────────────────────────────────
// The advisor consumes @spec-kit/shared as compiled ESM, where a bare
// specifier resolves only through a bundler's guess. Production code settled
// on the .js form; this test keeps every import, re-export and vi.mock
// specifier under the server on that one form so an extensionless one cannot
// come back unnoticed.

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const SERVER_ROOT = path.resolve(import.meta.dirname, '..');
const SKIP_DIRS = new Set(['node_modules', 'dist', '.embeddings-cache']);
const SOURCE_EXTENSIONS = new Set(['.ts', '.mts', '.cts', '.js', '.mjs', '.cjs']);
const SPECIFIER_RE = /(?:from\s*|import\s*\(\s*|require\s*\(\s*|vi\.(?:mock|doMock|importActual|importMock)\s*\(\s*)(['"])(@spec-kit\/shared\/[^'"]+)\1/gu;
const ALLOWED_EXTENSION_RE = /\.(?:js|mjs|cjs|json)$/u;

/** Returns every extensionless @spec-kit/shared specifier in the text. */
export function findExtensionlessSharedSpecifiers(text: string): string[] {
  const violations: string[] = [];
  for (const match of text.matchAll(SPECIFIER_RE)) {
    const specifier = match[2];
    if (!ALLOWED_EXTENSION_RE.test(specifier)) violations.push(specifier);
  }
  return violations;
}

function walk(directory: string, out: string[]): string[] {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute, out);
    else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) out.push(absolute);
  }
  return out;
}

describe('@spec-kit/shared specifiers under the advisor server', () => {
  it('every import, re-export and mock specifier names its .js file', () => {
    const offenders: string[] = [];
    for (const file of walk(SERVER_ROOT, [])) {
      if (path.resolve(file) === path.resolve(import.meta.filename)) continue;
      for (const specifier of findExtensionlessSharedSpecifiers(fs.readFileSync(file, 'utf8'))) {
        offenders.push(`${path.relative(SERVER_ROOT, file)}: ${specifier}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('flags an extensionless specifier in each import form it guards', () => {
    const sample = [
      "import { a } from '@spec-kit/shared/embeddings/factory';",
      "export * from '@spec-kit/shared/embeddings/adapters/ollama';",
      "vi.mock('@spec-kit/shared/frontmatter/parse-frontmatter', () => ({}));",
      "const b = await import('@spec-kit/shared/utils/retry');",
      "import { c } from '@spec-kit/shared/embeddings/factory.js';",
    ].join('\n');
    expect(findExtensionlessSharedSpecifiers(sample)).toEqual([
      '@spec-kit/shared/embeddings/factory',
      '@spec-kit/shared/embeddings/adapters/ollama',
      '@spec-kit/shared/frontmatter/parse-frontmatter',
      '@spec-kit/shared/utils/retry',
    ]);
  });
});
