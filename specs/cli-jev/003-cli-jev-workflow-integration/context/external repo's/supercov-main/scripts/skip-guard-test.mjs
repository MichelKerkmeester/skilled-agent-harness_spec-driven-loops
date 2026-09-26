// Every job that claims a language must fail when that language is missing.
//
// The Go and JVM suites skip on a machine without the toolchain, so a
// contributor without either can still run the suite. That is exactly what
// makes them worthless in CI unless something checks: a job whose toolchain
// setup quietly failed skips every test in the language and reports success,
// and the language looks verified while nothing ran.
//
// `SUPERCOV_REQUIRE_GO` and `SUPERCOV_REQUIRE_JVM` turn the skip into the
// failure it should be there -- and `npm run test:go` shipped without one for
// as long as the step existed, so the check that it is present cannot be
// review. It is this.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const workflow = resolve(root, '.github/workflows/compatibility.yml');
const text = readFileSync(workflow, 'utf8');

// Which npm script needs which promise. A script that can skip a whole
// language belongs here the day it is written.
const required = {
  'test:go': ['SUPERCOV_REQUIRE_GO'],
  'test:launcher': ['SUPERCOV_REQUIRE_GO'],
  'test:jvm': ['SUPERCOV_REQUIRE_JVM'],
};

// A step is its `- run:` line and everything indented under it up to the next
// step. Parsed this plainly on purpose: a YAML dependency to read one file is
// a cost, and the shape here is fixed by the workflow's own formatting.
const steps = text
  .split(/^ {6}- /m)
  .slice(1)
  .map((step) => step.split(/^ {6}- /m)[0]);

const failures = [];
for (const [script, variables] of Object.entries(required)) {
  const running = steps.filter((step) =>
    new RegExp(`run:\\s*npm run ${script}\\s*$`, 'm').test(step),
  );
  if (running.length === 0) {
    failures.push(`no step runs \`npm run ${script}\`; if it was renamed, rename it here too`);
    continue;
  }
  for (const step of running) {
    for (const variable of variables) {
      if (!step.includes(`${variable}:`)) {
        failures.push(
          `a step running \`npm run ${script}\` does not set ${variable}, so a job whose toolchain setup failed would skip every test and report success`,
        );
      }
    }
  }
}

// And the version gate, which is the same promise one level down: a test of a
// construct newer than its leg's toolchain skips legitimately, so the leg has
// to name the version it believes it set up or a mis-provisioned job skips
// that test and passes.
const goSteps = steps.filter((step) => /run:\s*npm run test:go\s*$/m.test(step));
for (const step of goSteps) {
  if (!step.includes('SUPERCOV_REQUIRE_GO_LANG:')) {
    failures.push(
      'the step running `npm run test:go` does not pass SUPERCOV_REQUIRE_GO_LANG, so a version-gated test would skip on a leg that promised the version',
    );
  }
}

// The matrix has to include a version that can compile what the version-gated
// tests measure. Below 1.26 `new` cannot take a value, and every test of it
// skips.
const matrix = text.match(/^\s*go: \[(.+)\]$/m);
assert.ok(matrix, 'no Go matrix found in compatibility.yml');
const versions = matrix[1].split(',').map((v) => Number(v.trim().replace(/"/g, '').split('.')[1]));
if (!versions.some((minor) => minor >= 26)) {
  failures.push(
    'no Go version in the matrix is 1.26 or newer, so nothing in CI can compile `new(value)` and every test of it skips',
  );
}

assert.deepEqual(failures, [], `\n  - ${failures.join('\n  - ')}\n`);
console.log('[skip-guard] every language job fails when its toolchain is missing');
