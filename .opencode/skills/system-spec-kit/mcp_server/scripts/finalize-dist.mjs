// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Finalize Dist                                                           ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const serverDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(serverDir, 'dist');
const workspaceRoot = path.resolve(serverDir, '..', '..', '..', '..');
const { writePackageSourceHashCache } = require(path.join(serverDir, '..', 'scripts', 'lib', 'dist-freshness.cjs'));
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
];
const freshnessEntries = ['default', 'spec-memory-cli', 'validation-orchestrator'];

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

function writeFreshnessCaches() {
  for (const entry of freshnessEntries) {
    const result = writePackageSourceHashCache('system-spec-kit/mcp_server', {
      workspaceRoot,
      entry,
    });
    if (result.status !== 'cached') {
      throw new Error(result.message || `Failed to write freshness cache for ${entry}`);
    }
  }
}

copyJsonFiles(path.join(serverDir, 'lib', 'eval', 'data'), path.join(distDir, 'lib', 'eval', 'data'));
copyJsonFiles(path.join(serverDir, 'lib', 'routing'), path.join(distDir, 'lib', 'routing'));

removeStaleDistRoots();
assertRequiredArtifacts();
assertNoStaleDistRoots();
writeFreshnessCaches();
