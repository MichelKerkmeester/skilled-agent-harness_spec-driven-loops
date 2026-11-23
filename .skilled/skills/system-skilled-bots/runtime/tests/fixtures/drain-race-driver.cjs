'use strict';

// One drain process for the race test. It loads the runtime first, says it is
// ready, then spins on a start file, so two of these begin their pass within
// moments of each other rather than a module load apart. It prints the pass's
// lines as JSON. It runs the real drain and the real runner; the test's PATH
// resolves the executor to the stub.

const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const [runtime, checkoutRoot, skilledTree, readyFile, startFile] = process.argv.slice(2);

async function main() {
  const { register } = require(require.resolve('tsx/esm/api', { paths: [runtime] }));
  register();
  const drain = await import(pathToFileURL(path.join(runtime, 'lib', 'request-drain.ts')).href);
  fs.writeFileSync(readyFile, String(process.pid));
  const deadline = Date.now() + 60_000;
  while (!fs.existsSync(startFile)) {
    if (Date.now() > deadline) throw new Error('start file never appeared');
  }
  const report = await drain.drainQueue({
    checkoutRoot,
    skilledTree,
    runOptions: { guard: { ancestryCmdlines: [], statePaths: [] } },
  });
  process.stdout.write(`${JSON.stringify(report)}\n`);
}

main().then(
  () => {
    process.exitCode = 0;
  },
  (error) => {
    process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
    process.exitCode = 1;
  },
);
