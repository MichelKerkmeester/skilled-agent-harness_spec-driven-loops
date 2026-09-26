// Run the release musl binary in a real Alpine Node consumer, without a compiler.
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { assertionMapSmoke } from './assertion-map-js-smoke.mjs';

const binary = process.argv[2];
if (!binary) throw new Error('Usage: node scripts/assertion-map-alpine-integration.mjs <binary>');
const root = mkdtempSync(resolve(tmpdir(), 'supercov-alpine-maps-'));
try {
  for (const typescript of [false, true]) {
    assertionMapSmoke({
      root: resolve(root, typescript ? 'ts' : 'js'),
      launcher: resolve(import.meta.dirname, '../bin/supercov.js'),
      env: { ...process.env, SUPERCOV_RUST_BINARY: resolve(binary) },
      typescript,
    });
  }
} finally {
  rmSync(root, { recursive: true, force: true });
}
