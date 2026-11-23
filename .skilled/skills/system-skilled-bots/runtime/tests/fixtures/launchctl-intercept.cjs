'use strict';

// Loaded with --require into a bots CLI that a test starts, so the real CLI
// runs end to end while every launchctl call is answered here and logged,
// never by the real scheduler. Every other process call goes through. The
// ESM view of node:child_process is refreshed, so the runtime modules the
// CLI imports see the same intercepted function. The user database's home is
// replaced the same way by the account home the test names, so the CLI's job
// environment and agents folder sit in a temp folder.

const childProcess = require('node:child_process');
const { appendFileSync } = require('node:fs');
const { syncBuiltinESMExports } = require('node:module');
const os = require('node:os');
const path = require('node:path');

const LOG = process.env.BOTS_TEST_LAUNCHCTL_LOG;
if (!LOG) throw new Error('launchctl-intercept needs BOTS_TEST_LAUNCHCTL_LOG');

const isLaunchctl = (file) => path.basename(String(file)) === 'launchctl';

function answer(args) {
  appendFileSync(LOG, `${JSON.stringify(args)}\n`);
  const verb = args[0];
  // Nothing is ever loaded here: print finds no job and bootout has nothing to stop.
  const status = verb === 'print' ? 113 : verb === 'bootout' ? 3 : 0;
  const stdout = verb === 'print-disabled' ? 'disabled services = {\n}\n' : '';
  return { pid: 0, output: [null, stdout, ''], stdout, stderr: '', status, signal: null };
}

const originalSpawnSync = childProcess.spawnSync;
childProcess.spawnSync = function interceptedSpawnSync(file, args, options) {
  if (isLaunchctl(file)) return answer(args ?? []);
  return originalSpawnSync.call(this, file, args, options);
};
for (const name of ['spawn', 'execFile', 'execFileSync', 'exec', 'execSync']) {
  const original = childProcess[name];
  childProcess[name] = function guarded(file, ...rest) {
    if (isLaunchctl(String(file).split(' ')[0])) throw new Error(`launchctl-intercept: ${name} is not intercepted`);
    return original.call(this, file, ...rest);
  };
}
// Without a temp account home the CLI would read the real agents folder and the real home's git config.
const ACCOUNT_HOME = process.env.BOTS_TEST_ACCOUNT_HOME;
if (!ACCOUNT_HOME) throw new Error('launchctl-intercept needs BOTS_TEST_ACCOUNT_HOME');
const originalUserInfo = os.userInfo;
os.userInfo = function testUserInfo(options) {
  return { ...originalUserInfo.call(this, options), homedir: ACCOUNT_HOME };
};
syncBuiltinESMExports();
