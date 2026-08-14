#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: CLI-Output Wrapper Launcher
// ───────────────────────────────────────────────────────────────────
// PURPOSE: Launch a wrapper-target runtime through the shared capture
//          -normalize-project-render seam. Disabled, incapable, or
//          unparsed runtimes pass the byte-exact original through.
// ───────────────────────────────────────────────────────────────────

import { spawn } from 'node:child_process';

const DIST_INDEX = new URL('../dist/index.js', import.meta.url).href;
const DIST_WRAPPER = new URL('../dist/wrapper/index.js', import.meta.url).href;

const EXIT_PROTOCOL = 69;

function usage() {
  return [
    'Usage: cli-output-wrapper <runtime> [-- <command...>]',
    '       cli-output-wrapper --list',
    '',
    'Runs a wrapper-target runtime through the capture-normalize-project-render',
    'seam. When projection is disabled or the runtime is incapable, the command',
    'runs unmodified and its output passes through byte-exactly.',
  ].join('\n');
}

async function main() {
  const argv = process.argv.slice(2);

  if (argv.includes('--list')) {
    const { listWrapperRuntimes, resolveWrapperRuntime } = await import(DIST_WRAPPER);
    for (const id of listWrapperRuntimes()) {
      const plan = resolveWrapperRuntime(id);
      if (plan !== null) {
        process.stdout.write(`${plan.runtime}\t${plan.launchMode}\t${plan.pathId}\n`);
      }
    }
    return;
  }

  if (argv.length === 0 || argv[0] === '--help' || argv[0] === '-h') {
    process.stderr.write(`${usage()}\n`);
    process.exit(argv.length === 0 ? 2 : 0);
  }

  const runtime = argv[0];
  const separator = argv.indexOf('--');
  const command = separator === -1 ? [] : argv.slice(separator + 1);

  const { resolveWrapperRuntime } = await import(DIST_WRAPPER);
  const { isProjectionEnabled, loadLocalProjectionConfig } = await import(DIST_INDEX);

  const plan = resolveWrapperRuntime(runtime);
  if (plan === null) {
    process.stderr.write(`cli-output-wrapper: unknown or incapable runtime '${runtime}'.\n`);
    process.exit(EXIT_PROTOCOL);
  }

  process.stderr.write(
    `cli-output-wrapper: runtime=${plan.runtime} launchMode=${plan.launchMode} `
    + `pathId=${plan.pathId} protocol=${plan.protocol} `
    + `runtimeVersion=${plan.runtimeVersion} protocolVersion=${plan.protocolVersion}\n`,
  );

  if (command.length === 0) {
    process.stderr.write('cli-output-wrapper: no target command supplied; nothing to run.\n');
    process.exit(0);
  }

  if (!isProjectionEnabled()) {
    process.stderr.write('cli-output-wrapper: projection disabled; passing through.\n');
    await runPassthrough(command);
    return;
  }

  const { resolveStreamParser, parseRuntimeStream } = await import(DIST_WRAPPER);
  const parser = resolveStreamParser(runtime);
  if (parser === null) {
    process.stderr.write(
      'cli-output-wrapper: no stream parser is registered for '
      + `'${plan.runtime}'; passing through byte-exactly.\n`,
    );
    await runPassthrough(command);
    return;
  }

  const captured = await runCaptured(command);
  if (captured === null) {
    process.exit(EXIT_PROTOCOL);
  }
  const { capturedText, exitCode } = captured;
  const capturedAt = new Date().toISOString();
  const parsed = parseRuntimeStream(runtime, {
    capturedText,
    capturedAt,
  });
  if (parsed === null || parsed.status === 'unparsed') {
    const reasonCode = parsed === null ? 'runtime-incapable' : parsed.reasonCode;
    process.stderr.write(
      'cli-output-wrapper: stream not projectable ('
      + `${reasonCode}); passing through byte-exactly.\n`,
    );
    process.stdout.write(capturedText);
    process.exit(exitCode ?? 1);
  } else {
    // Projection config comes from the shared local-provider loader so the
    // wrapper and the OpenCode plugin resolve the same provider. When the
    // loader returns null (no local provider configured) the captured bytes
    // pass through byte-exactly; only a non-null config triggers a projection.
    const local = loadLocalProjectionConfig();
    if (local === null) {
      process.stderr.write(
        'cli-output-wrapper: no local provider configured; '
        + 'passing the assistant message through byte-exactly.\n',
      );
      process.stdout.write(capturedText);
      process.exit(exitCode ?? 1);
      return;
    }
    const { runWrapperProjection } = await import(DIST_WRAPPER);
    const result = await runWrapperProjection(plan.adapter, parsed.original, parsed.envelopes, {
      context: local.context,
      prompt: local.prompt,
      records: local.records,
      candidateProviderIds: local.candidateProviderIds,
      policy: local.policy,
      judgeMode: local.judgeMode,
      capabilities: local.capabilities,
      transport: local.transport,
      now: capturedAt,
    });
    if (result.status === 'projection') {
      process.stderr.write(
        'cli-output-wrapper: projected the assistant message through the configured local provider.\n',
      );
      process.stdout.write(result.text);
    } else {
      process.stderr.write(
        'cli-output-wrapper: projection reverted to the exact original ('
        + `${result.reasonCode}); passing through byte-exactly.\n`,
      );
      process.stdout.write(capturedText);
    }
    process.exit(exitCode ?? 1);
  }
}

function runCaptured(command) {
  return new Promise((resolve) => {
    const child = spawn(command[0], command.slice(1), {
      stdio: ['ignore', 'pipe', 'inherit'],
      env: process.env,
    });
    const chunks = [];
    child.stdout.on('data', (chunk) => {
      chunks.push(chunk);
    });
    child.on('error', (error) => {
      process.stderr.write(`cli-output-wrapper: ${error.message}\n`);
      resolve(null);
    });
    child.on('exit', (code, signal) => {
      if (signal !== null) {
        resolve({ capturedText: Buffer.concat(chunks).toString('utf8'), exitCode: 1 });
        return;
      }
      resolve({ capturedText: Buffer.concat(chunks).toString('utf8'), exitCode: code ?? 0 });
    });
  });
}

function runPassthrough(command) {
  return new Promise((resolve) => {
    const child = spawn(command[0], command.slice(1), {
      stdio: 'inherit',
      env: process.env,
    });
    child.on('error', (error) => {
      process.stderr.write(`cli-output-wrapper: ${error.message}\n`);
      process.exit(EXIT_PROTOCOL);
    });
    child.on('exit', (code, signal) => {
      if (signal !== null) {
        process.exit(1);
      }
      process.exit(code ?? 1);
    });
    resolve();
  });
}

main().catch((error) => {
  process.stderr.write(`cli-output-wrapper: ${error?.message ?? String(error)}\n`);
  process.exit(EXIT_PROTOCOL);
});
