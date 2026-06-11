// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Finalize Dist                                                           ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const serverDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(serverDir, 'dist');
const staleDistRoots = [
  'system-spec-kit',
  'system-skill-advisor',
  'system-code-graph',
  'tests',
  'database',
];
const requiredArtifacts = [
  'context-server.js',
  'api/index.js',
  'hooks/codex/session-start.js',
];
const cliSourceFiles = [
  'spec-memory-cli.ts',
  'tool-schemas.ts',
  'schemas/tool-input-schemas.ts',
];
const cliSourceHashState = path.join(distDir, '.spec-memory-cli-source-hash.json');

function copyJsonFiles(sourceDir, targetDir) {
  if (!fs.existsSync(sourceDir)) {
    return;
  }

  fs.mkdirSync(targetDir, { recursive: true });
  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      copyJsonFiles(sourcePath, targetPath);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

function removeStaleDistRoots() {
  for (const root of staleDistRoots) {
    fs.rmSync(path.join(distDir, root), { recursive: true, force: true });
  }
}

function assertRequiredArtifacts() {
  const missing = requiredArtifacts.filter((artifact) => !fs.existsSync(path.join(distDir, artifact)));
  if (missing.length > 0) {
    throw new Error(`Missing expected dist artifact(s): ${missing.join(', ')}`);
  }
}

function assertNoStaleDistRoots() {
  const stale = staleDistRoots.filter((root) => fs.existsSync(path.join(distDir, root)));
  if (stale.length > 0) {
    throw new Error(`Stale dist root(s) still present: ${stale.join(', ')}`);
  }
}

function writeCliSourceHash() {
  const existingSources = cliSourceFiles
    .map((filePath) => path.join(serverDir, filePath))
    .filter((filePath) => fs.existsSync(filePath));
  if (existingSources.length === 0) return;

  const hash = crypto.createHash('sha256');
  for (const filePath of existingSources.sort()) {
    hash.update(path.relative(serverDir, filePath));
    hash.update('\0');
    hash.update(fs.readFileSync(filePath));
    hash.update('\0');
  }
  fs.writeFileSync(cliSourceHashState, `${JSON.stringify({ version: 1, sourceHash: hash.digest('hex') })}\n`);
}

copyJsonFiles(path.join(serverDir, 'lib', 'eval', 'data'), path.join(distDir, 'lib', 'eval', 'data'));
copyJsonFiles(path.join(serverDir, 'lib', 'routing'), path.join(distDir, 'lib', 'routing'));

removeStaleDistRoots();
assertRequiredArtifacts();
assertNoStaleDistRoots();
writeCliSourceHash();
