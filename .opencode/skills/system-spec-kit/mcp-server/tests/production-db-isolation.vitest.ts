// ───────────────────────────────────────────────────────────────────
// MODULE: Production Database Isolation Tests
// ───────────────────────────────────────────────────────────────────

import * as fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import {
  ProductionDatabaseResolutionError,
  resolveDatabaseDir,
} from '../../shared/paths.js';

const productionDatabaseDir = path.resolve(import.meta.dirname, '..', '..', 'mcp-server', 'database');
const originalEnvironment = {
  MEMORY_DB_PATH: process.env.MEMORY_DB_PATH,
  SPEC_KIT_DB_DIR: process.env.SPEC_KIT_DB_DIR,
  SPECKIT_DB_DIR: process.env.SPECKIT_DB_DIR,
};

function restoreEnvironment(): void {
  for (const [key, value] of Object.entries(originalEnvironment)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function isWithinDirectory(candidatePath: string, rootPath: string): boolean {
  const relativePath = path.relative(rootPath, candidatePath);
  return relativePath === '' || (!relativePath.startsWith('..') && !path.isAbsolute(relativePath));
}

function collectVitestConfigs(directory: string): string[] {
  const configs: string[] = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.name === 'dist' || entry.name === 'node_modules' || entry.name === '.git') {
      continue;
    }
    if (entry.isDirectory()) {
      configs.push(...collectVitestConfigs(entryPath));
    } else if (entry.isFile() && /^vitest(?:\..+)?\.config\.(?:[cm]?js|[cm]?ts)$/.test(entry.name)) {
      configs.push(entryPath);
    }
  }
  return configs;
}

function hasIsolationSetup(configSource: string): boolean {
  return configSource.includes('setupFiles') && configSource.includes('vitest-setup.ts');
}

function findUnguardedConfigs(configSources: Iterable<[string, string]>): string[] {
  return [...configSources]
    .filter(([, source]) => source.includes('mcp-server/tests/**') && !hasIsolationSetup(source))
    .map(([configPath]) => configPath);
}

afterEach(restoreEnvironment);

describe('production database isolation', () => {
  it('resolves a throwaway directory under the system temporary root', () => {
    const resolvedDatabaseDir = resolveDatabaseDir();
    const resolvedTempDir = fs.realpathSync(os.tmpdir());

    expect(fs.realpathSync(resolvedDatabaseDir)).not.toBe(fs.realpathSync(productionDatabaseDir));
    expect(isWithinDirectory(fs.realpathSync(resolvedDatabaseDir), resolvedTempDir)).toBe(true);
  });

  it('fails closed with a named error when the test context targets production', () => {
    delete process.env.MEMORY_DB_PATH;
    delete process.env.SPEC_KIT_DB_DIR;
    delete process.env.SPECKIT_DB_DIR;

    try {
      resolveDatabaseDir();
      throw new Error('Expected production database resolution to fail closed');
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(ProductionDatabaseResolutionError);
      expect(error).toMatchObject({
        name: 'ProductionDatabaseResolutionError',
        databaseDir: productionDatabaseDir,
      });
    }
  });

  it('detects a Vitest config that globs MCP server tests without isolation setup', () => {
    const skillRoot = path.resolve(import.meta.dirname, '..', '..');
    const configSources = collectVitestConfigs(skillRoot).map((configPath) => [
      configPath,
      fs.readFileSync(configPath, 'utf8'),
    ] as [string, string]);

    expect(findUnguardedConfigs(configSources)).toEqual([]);
    expect(findUnguardedConfigs([
      ['fixture/vitest.config.ts', "include: ['mcp-server/tests/**']"],
    ])).toEqual(['fixture/vitest.config.ts']);
  });
});
