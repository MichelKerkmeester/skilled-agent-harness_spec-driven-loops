import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { repository, requireSupercov } from './coverage-test-helpers.mjs';

const schema = requireSupercov(repository, ['assertions', 'schema']).stdout;
const path = resolve(repository, 'schemas/assertions.schema.json');
if (process.argv.includes('--check')) {
  assert.equal(readFileSync(path, 'utf8'), schema, 'Published schema differs from Rust types; run npm run sync:assertion-schema');
} else {
  mkdirSync(resolve(repository, 'schemas'), { recursive: true });
  writeFileSync(path, schema);
}
console.log(`[assertion-schema] ${process.argv.includes('--check') ? 'Rust types and editor schema agree' : 'updated from Rust types'}`);
