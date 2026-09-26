// Run the Go gate under every toolchain the compatibility matrix names.
//
// The matrix in .github/workflows/compatibility.yml is the claim: these are
// the Go versions Supercov is verified on. Until this script existed the claim
// could only be checked by pushing, which meant a version-specific break --
// `new` taking a value in 1.26, the generated harness on the 1.22 floor -- was
// found by CI or by a user, never locally.
//
// Go's own toolchain switching does the work: GOTOOLCHAIN names a version and
// the `go` on PATH fetches and becomes it, so this needs no toolchain manager
// and no second install.

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/// The versions the workflow claims, read from the workflow rather than
/// repeated here: a list that drifts from the matrix proves nothing about it.
function matrixVersions() {
  const workflow = readFileSync(
    resolve(root, '.github/workflows/compatibility.yml'),
    'utf8',
  );
  const go = workflow.match(/^\s*go: \[(.+)\]$/m);
  if (!go) throw new Error('no Go matrix found in compatibility.yml');
  return go[1].split(',').map((v) => v.trim().replace(/"/g, ''));
}

// `1.26` is what the matrix says and `go1.26.0` is what GOTOOLCHAIN wants.
// The patch is not a version anyone pinned, so ask Go for its own answer.
function resolveToolchain(version) {
  const probe = spawnSync('go', ['version'], {
    encoding: 'utf8',
    env: { ...process.env, GOTOOLCHAIN: `go${version}.0+auto` },
  });
  const named = probe.stdout?.match(/go\d+\.\d+(\.\d+)?/)?.[0];
  return named && named.startsWith(`go${version}`) ? named : `go${version}.0`;
}

const requested = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const versions = requested.length ? requested : matrixVersions();
const failures = [];

for (const version of versions) {
  const toolchain = resolveToolchain(version);
  console.log(`\n=== Go ${version} (${toolchain}) ===`);
  const run = spawnSync('npm', ['run', 'test:go'], {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      GOTOOLCHAIN: toolchain,
      // Exactly what the workflow sets, so a skip here means the same thing a
      // skip there would.
      SUPERCOV_REQUIRE_GO: '1',
      SUPERCOV_REQUIRE_GO_LANG: version,
    },
  });
  if (run.status !== 0) failures.push(version);
}

console.log(`\n=== ${versions.length - failures.length}/${versions.length} Go versions passed ===`);
if (failures.length) {
  console.error(`failed: ${failures.join(', ')}`);
  process.exit(1);
}
