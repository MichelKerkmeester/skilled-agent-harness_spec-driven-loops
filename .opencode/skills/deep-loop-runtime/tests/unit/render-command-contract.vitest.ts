import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

import { afterEach, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

type Command = 'deep/review' | 'deep/research';

type ManifestRow = {
  command: Command;
  mode: 'fallback' | 'fix';
  argsSha256: string;
  legacyBodySha256: string;
  compiledContractSha256: string;
  renderedSha256: string;
};

const renderer = require('../../scripts/render-command-contract.cjs') as {
  COMMANDS: Record<Command, { legacyBodyPath: string; compiledContractPath: string }>;
  WORKSPACE_ROOT: string;
  compareFallback: (command: Command) => { equal: boolean; renderedLength: number; legacyBodyLength: number };
  renderCommandContract: (
    command: Command,
    options?: { argsText?: string; manifestPath?: string; writeManifest?: boolean },
  ) => { command: Command; mode: 'fallback' | 'fix'; output: Buffer; manifestRow: ManifestRow };
  resolveMode: (command: Command) => 'fallback' | 'fix';
  sha256: (input: string | Buffer) => string;
};

const commands = ['deep/review', 'deep/research'] as const;
const tempDirs: string[] = [];

function workspacePath(sourcePath: string): string {
  return resolve(renderer.WORKSPACE_ROOT, sourcePath);
}

function legacyBody(command: Command): Buffer {
  return readFileSync(workspacePath(renderer.COMMANDS[command].legacyBodyPath));
}

function compiledContract(command: Command): Buffer {
  return readFileSync(workspacePath(renderer.COMMANDS[command].compiledContractPath));
}

function tempManifestPath(): string {
  const dir = mkdtempSync(join(tmpdir(), 'render-command-contract-'));
  tempDirs.push(dir);
  return join(dir, 'manifest.jsonl');
}

function withInjectionMode<T>(mode: string | undefined, run: () => T): T {
  const previous = process.env['SPECKIT_COMMAND_INJECTION_MODE'];
  if (mode === undefined) {
    delete process.env['SPECKIT_COMMAND_INJECTION_MODE'];
  } else {
    process.env['SPECKIT_COMMAND_INJECTION_MODE'] = mode;
  }
  try {
    return run();
  } finally {
    if (previous === undefined) {
      delete process.env['SPECKIT_COMMAND_INJECTION_MODE'];
    } else {
      process.env['SPECKIT_COMMAND_INJECTION_MODE'] = previous;
    }
  }
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('render-command-contract', () => {
  it.each(commands)('proves fallback stdout is byte-identical for %s', (command) => {
    const result = withInjectionMode(undefined, () => renderer.renderCommandContract(command, {
      argsText: 'sample args',
      manifestPath: tempManifestPath(),
    }));

    expect(result.mode).toBe('fallback');
    expect(Buffer.compare(result.output, legacyBody(command))).toBe(0);
    expect(renderer.compareFallback(command)).toMatchObject({
      equal: true,
      renderedLength: legacyBody(command).length,
      legacyBodyLength: legacyBody(command).length,
    });
  });

  it.each(commands)('renders fix mode as compiled contract followed by legacy body for %s', (command) => {
    const result = withInjectionMode(`${command}:fix`, () => renderer.renderCommandContract(command, {
      argsText: 'sample args',
      manifestPath: tempManifestPath(),
    }));
    const contract = compiledContract(command);
    const body = legacyBody(command);

    expect(result.mode).toBe('fix');
    expect(Buffer.compare(result.output.subarray(0, contract.length), contract)).toBe(0);
    expect(result.output.includes(body)).toBe(true);
  });

  it.each(commands)('appends a manifest row with render hashes for %s', (command) => {
    const argsText = 'target :auto --max-iterations=2';
    const manifestPath = tempManifestPath();
    const result = withInjectionMode(undefined, () => renderer.renderCommandContract(command, {
      argsText,
      manifestPath,
    }));
    const rows = readFileSync(manifestPath, 'utf8').trimEnd().split('\n').map((line) => JSON.parse(line) as ManifestRow);

    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual({
      command,
      mode: 'fallback',
      argsSha256: renderer.sha256(Buffer.from(argsText, 'utf8')),
      legacyBodySha256: renderer.sha256(legacyBody(command)),
      compiledContractSha256: renderer.sha256(compiledContract(command)),
      renderedSha256: renderer.sha256(result.output),
    });
  });

  it('resolves the default rollout mode through the shared resolver', () => {
    const result = withInjectionMode(undefined, () => renderer.renderCommandContract('deep/review', {
      manifestPath: tempManifestPath(),
    }));

    expect(renderer.resolveMode('deep/review')).toBe('fallback');
    expect(result.mode).toBe('fallback');
  });

  it.each(commands)('exposes a zero-diff compare CLI for %s', (command) => {
    const scriptPath = workspacePath('.opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs');
    const result = spawnSync(process.execPath, [scriptPath, '--command', command, '--compare'], {
      cwd: renderer.WORKSPACE_ROOT,
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toBe(`COMPARE OK command=${command} bytes=${legacyBody(command).length}\n`);
  });
});
