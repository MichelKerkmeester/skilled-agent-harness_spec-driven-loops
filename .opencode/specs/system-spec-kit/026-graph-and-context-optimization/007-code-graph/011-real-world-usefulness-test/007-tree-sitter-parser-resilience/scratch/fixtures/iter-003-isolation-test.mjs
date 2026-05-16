#!/usr/bin/env node
// iter-003-isolation-test.mjs
// Order-dependence test for B2 (memory access out of bounds) hypothesis.
//
// Question: does parser-instance reuse + grammar-switching cause OOB?
//
// Probes (each is a fresh `node` invocation; pass --probe=N to select):
//   1: Parse vitest.phase-k.config.ts ALONE (fresh parser, typescript only)
//   2: Parse runners/common.ts ALONE (fresh parser, typescript only)
//   3: Parse mcp-doctor-lib.sh ALONE (fresh parser, bash only — should be B1, not B2)
//   4: Parse vitest.phase-k.config.ts AFTER parsing a clean .ts (sequential, shared parserInstance)
//   5: Parse vitest.phase-k.config.ts AFTER bash WASM throw (mixed grammar, shared parserInstance) — main hypothesis test
//
// If probe 1 OR 2 crashes alone --> file-specific syntax/byte trigger (rejects shared-state hypothesis).
// If probe 4 crashes after a clean .ts but probe 1 alone is fine --> ts-only state corruption.
// If probe 5 crashes after bash B1 throw but probe 1 alone is fine --> bash B1 leaves parser in a
//   poisoned WASM linear-memory state, causing the NEXT parse() to OOB regardless of grammar.
//   THIS IS THE PARSER-INSTANCE REUSE HYPOTHESIS.
//
// Exit code: 0 = parsed (no error), 1 = thrown (OOB or other), 2 = setup error.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const localRequire = createRequire(import.meta.url);

// Climb until we find .opencode/skills/system-spec-kit (more robust than counting ..)
function findRepoRoot(start) {
  let dir = start;
  while (dir !== '/' && dir.length > 1) {
    try {
      readFileSync(resolve(dir, '.opencode/skills/system-spec-kit/mcp_server/package.json'));
      return dir;
    } catch { dir = dirname(dir); }
  }
  throw new Error('Could not locate repo root from ' + start);
}
const REPO = findRepoRoot(__dirname);
const MCP = resolve(REPO, '.opencode/skills/system-spec-kit/mcp_server');

const FIXTURES = {
  vitestConfig: resolve(REPO, '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/029-stress-test-v1-0-4/measurements/vitest.phase-k.config.ts'),
  cleanTs: resolve(REPO, '.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts'),
  bashScript: resolve(REPO, '.opencode/commands/doctor/scripts/mcp-doctor-lib.sh'),
  runnersCommon: resolve(REPO, '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/016-hook-plugin-per-runtime-testing/runners/common.ts'),
};

function getGrammarPath(name) {
  // Resolve via the package itself (mirrors tree-sitter-parser.ts:69-70)
  const cjsReq = createRequire(resolve(MCP, 'package.json'));
  const pkg = cjsReq.resolve('tree-sitter-wasms/package.json');
  return resolve(dirname(pkg), 'out', `${name}.wasm`);
}

async function loadParser() {
  // web-tree-sitter@0.24.7 ships ESM at dist/web-tree-sitter.js (per its
  // package.json "main"/"exports"). Resolve via the CJS resolver against MCP
  // node_modules, then convert to a file:// URL for dynamic ESM import.
  const cjsReq = createRequire(resolve(MCP, 'package.json'));
  const entry = cjsReq.resolve('web-tree-sitter');
  const url = new URL(`file://${entry}`).href;
  const mod = await import(url);
  const ParserClass = mod.default ?? mod.Parser ?? mod;
  await ParserClass.init();
  return ParserClass;
}

async function loadLang(ParserClass, wasmName) {
  const Lang = ParserClass.Language ?? ParserClass;
  return await Lang.load(getGrammarPath(wasmName));
}

async function parseOne(parser, lang, filePath, label) {
  const content = readFileSync(filePath, 'utf-8');
  console.log(`[${label}] file=${filePath.split('/').slice(-3).join('/')} bytes=${content.length}`);
  parser.setLanguage(lang);
  try {
    const tree = parser.parse(content);
    console.log(`[${label}] OK rootKind=${tree.rootNode.type} hasError=${tree.rootNode.hasError}`);
    return { ok: true };
  } catch (err) {
    console.log(`[${label}] THROW message=${err && err.message}`);
    return { ok: false, err };
  }
}

async function main() {
  const probe = (process.argv.find(a => a.startsWith('--probe=')) || '--probe=1').split('=')[1];
  const ParserClass = await loadParser();
  const parser = new ParserClass();
  const tsLang = await loadLang(ParserClass, 'tree-sitter-typescript');
  let bashLang = null;
  let exitCode = 0;

  if (probe === '1') {
    const r = await parseOne(parser, tsLang, FIXTURES.vitestConfig, 'P1.alone-vitest');
    exitCode = r.ok ? 0 : 1;
  } else if (probe === '2') {
    const r = await parseOne(parser, tsLang, FIXTURES.runnersCommon, 'P2.alone-runners');
    exitCode = r.ok ? 0 : 1;
  } else if (probe === '3') {
    bashLang = await loadLang(ParserClass, 'tree-sitter-bash');
    const r = await parseOne(parser, bashLang, FIXTURES.bashScript, 'P3.alone-bash');
    exitCode = r.ok ? 0 : 1;
  } else if (probe === '4') {
    const r1 = await parseOne(parser, tsLang, FIXTURES.cleanTs, 'P4a.clean-ts');
    const r2 = await parseOne(parser, tsLang, FIXTURES.vitestConfig, 'P4b.then-vitest');
    exitCode = r2.ok ? 0 : 1;
    void r1;
  } else if (probe === '5') {
    bashLang = await loadLang(ParserClass, 'tree-sitter-bash');
    const r1 = await parseOne(parser, bashLang, FIXTURES.bashScript, 'P5a.bash-throw');
    const r2 = await parseOne(parser, tsLang, FIXTURES.vitestConfig, 'P5b.then-vitest');
    exitCode = r2.ok ? 0 : 1;
    void r1;
  } else {
    console.log(`Unknown probe: ${probe}`);
    exitCode = 2;
  }
  process.exit(exitCode);
}

main().catch(e => { console.log('SETUP_ERROR', e && e.message); process.exit(2); });
