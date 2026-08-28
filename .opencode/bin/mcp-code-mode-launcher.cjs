#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ mcp-code-mode-launcher — Resolve Node and hand off to the MCP server    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawn } = require('node:child_process');
const path = require('node:path');
const { resolveNodeInterpreter } = require('./lib/node-engine-resolver.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATHS AND SIGNALS
// ─────────────────────────────────────────────────────────────────────────────

const REPOSITORY_ROOT = path.resolve(__dirname, '..', '..');
const SERVER_DIRECTORY = path.join(
  REPOSITORY_ROOT,
  '.opencode',
  'skills',
  'mcp-code-mode',
  'mcp-server',
);
const SERVER_MANIFEST_PATH = path.join(SERVER_DIRECTORY, 'package.json');
const SERVER_ENTRYPOINT_PATH = path.join(SERVER_DIRECTORY, 'dist', 'index.js');
const SIGNAL_NUMBERS = Object.freeze({
  SIGHUP: 1,
  SIGINT: 2,
  SIGQUIT: 3,
  SIGTERM: 15,
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. ERROR AND CHILD-PROCESS HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function writeLauncherError(message) {
  process.stderr.write(`[mcp-code-mode-launcher] ${message}\n`);
}

function resolutionFailureMessage(resolution) {
  const requiredRange = resolution.range ?? 'the range declared by the server manifest';
  const reason = resolution.reason ?? 'unknown';
  return `Cannot start the MCP server: no Node interpreter satisfies ${requiredRange} (resolution reason: ${reason}). Install a Node interpreter matching that range and retry.`;
}

function removeSignalHandlers(signalHandlers) {
  for (const [signal, handler] of signalHandlers) {
    process.removeListener(signal, handler);
  }
}

function signalExitCode(signal) {
  const number = SIGNAL_NUMBERS[signal];
  return number === undefined ? 1 : 128 + number;
}

function runServer({
  nodePath,
  entrypointPath,
  serverArguments,
  spawnProcess,
  terminateOnSignal,
}) {
  let childProcess;
  try {
    childProcess = spawnProcess(nodePath, [entrypointPath, ...serverArguments], {
      stdio: 'inherit',
    });
  } catch (error) {
    writeLauncherError(`Failed to start the MCP server: ${error.message}`);
    return Promise.resolve(1);
  }

  return new Promise((resolve) => {
    let settled = false;
    const signalHandlers = new Map();

    const finish = (exitCode, signal) => {
      if (settled) return;
      settled = true;
      removeSignalHandlers(signalHandlers);

      if (signal && terminateOnSignal) {
        try {
          process.kill(process.pid, signal);
          return;
        } catch (error) {
          writeLauncherError(`Could not forward ${signal} to the launcher: ${error.message}`);
        }
      }

      resolve(signal ? signalExitCode(signal) : (typeof exitCode === 'number' ? exitCode : 1));
    };

    childProcess.once('error', (error) => {
      writeLauncherError(`MCP server process failed: ${error.message}`);
      finish(1, null);
    });
    childProcess.once('close', finish);

    for (const signal of Object.keys(SIGNAL_NUMBERS)) {
      const handler = () => {
        if (!childProcess.killed) childProcess.kill(signal);
      };
      signalHandlers.set(signal, handler);
      process.on(signal, handler);
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. LAUNCH FLOW
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve the server interpreter and hand off the launcher's process role.
 *
 * @param {Object} [options] - Runtime dependencies for deterministic tests.
 * @param {Function} [options.resolveInterpreter] - Node interpreter resolver.
 * @param {Function} [options.spawnProcess] - Child-process spawn function.
 * @param {string[]} [options.serverArguments] - Arguments supplied by the host.
 * @param {boolean} [options.terminateOnSignal] - Re-emit child termination signals.
 * @returns {Promise<number>} The server exit status when it exits normally.
 */
async function main({
  resolveInterpreter = resolveNodeInterpreter,
  spawnProcess = spawn,
  serverArguments = process.argv.slice(2),
  terminateOnSignal = true,
} = {}) {
  const resolution = resolveInterpreter({ manifestPath: SERVER_MANIFEST_PATH });
  if (!resolution?.path) {
    writeLauncherError(resolutionFailureMessage(resolution ?? {}));
    return 1;
  }

  return runServer({
    nodePath: resolution.path,
    entrypointPath: SERVER_ENTRYPOINT_PATH,
    serverArguments,
    spawnProcess,
    terminateOnSignal,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CLI ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  main()
    .then((exitCode) => {
      process.exitCode = exitCode;
    })
    .catch((error) => {
      writeLauncherError(error.stack || error.message);
      process.exitCode = 1;
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  main,
  REPOSITORY_ROOT,
  SERVER_ENTRYPOINT_PATH,
  SERVER_MANIFEST_PATH,
  runServer,
};
