import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const COCOINDEX_RELATIVE_PATH = '.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc';

function resolveProjectRoot(): string {
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  let current = moduleDir;
  for (let i = 0; i < 10; i++) {
    if (existsSync(resolve(current, '.opencode'))) {
      return current;
    }
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return process.cwd();
}

let cachedRoot: string | null = null;

function getProjectRoot(): string {
  if (!cachedRoot) {
    cachedRoot = resolveProjectRoot();
  }
  return cachedRoot;
}

export function getCocoIndexBinaryPath(): string {
  return resolve(getProjectRoot(), COCOINDEX_RELATIVE_PATH);
}

export function isCocoIndexAvailable(): boolean {
  return existsSync(getCocoIndexBinaryPath());
}

export function _resetCachedRoot(): void {
  cachedRoot = null;
}
