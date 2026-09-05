// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ MODULE: Finalize Dist — post-build dist verification and freshness stamp ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const serverDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(serverDir, 'dist');
const workspaceRoot = path.resolve(serverDir, '..', '..', '..', '..');
const {
  recordPackageBuild,
  writePackageSourceHashCache,
} = require(path.join(serverDir, '..', 'scripts', 'lib', 'dist-freshness.cjs'));
const FRESHNESS_PACKAGE_ID = 'system-spec-kit/runtime';
const staleDistRoots = [
  'system-spec-kit',
  'system-skill-advisor',
  'tests',
  'database',
];
const requiredArtifacts = [
  'api/index.js',
];
const freshnessEntries = ['default', 'validation-orchestrator'];

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

// Promote each entry's freshness record to build-attested provenance. The
// matching prepare-build step (run before the TypeScript compile) captured the
// pre-build source hash; recording here confirms that source is unchanged and
// anchors the record to the compiled dist so a later check can trust the build
// as authoritative rather than falling back to the mtime heuristic. If no
// prepared record exists -- the build was invoked without the prepare step --
// fall back to a checker-origin cache so a legitimate build is never failed by a
// missing attestation, and surface the gap on stderr.
function recordFreshnessBuilds() {
  for (const entry of freshnessEntries) {
    const options = { workspaceRoot, entry };
    const recorded = recordPackageBuild(FRESHNESS_PACKAGE_ID, options);
    if (recorded.status === 'recorded') {
      continue;
    }
    const fallback = writePackageSourceHashCache(FRESHNESS_PACKAGE_ID, options);
    if (fallback.status !== 'cached') {
      throw new Error(fallback.message || `Failed to write freshness cache for ${entry}`);
    }
    console.warn(
      `finalize-dist: build attestation unavailable for ${entry} (${recorded.message}); wrote checker-origin cache instead`,
    );
  }
}

removeStaleDistRoots();
assertRequiredArtifacts();
assertNoStaleDistRoots();
recordFreshnessBuilds();
