// ───────────────────────────────────────────────────────────────
// MODULE: Rerank-Sidecar Cross-Language Canonical Parity
// ───────────────────────────────────────────────────────────────
// 022/008 shipped `sidecar_defaults.py` as the single source of truth for
// port + model-name + revision-pin defaults. Bash + Node launchers ship
// inline literals (Bash can't import Python; Node can't either) with
// cross-language sync comments pointing to the Python module. This test
// asserts the three canonical defaults match across all three source files
// so silent drift fails CI.
//
// Sources of truth:
//   PYTHON: .opencode/skills/system-rerank-sidecar/scripts/sidecar_defaults.py
//   BASH:   .opencode/skills/system-rerank-sidecar/scripts/start.sh
//   NODE:   .opencode/bin/lib/ensure-rerank-sidecar.cjs

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// tests/ -> mcp_server/ -> system-spec-kit/ -> skills/ -> .opencode/ -> repo root
const REPO_ROOT = resolve(__dirname, '..', '..', '..', '..', '..');

const PYTHON_PATH = resolve(REPO_ROOT, '.opencode/skills/system-rerank-sidecar/scripts/sidecar_defaults.py');
const BASH_PATH   = resolve(REPO_ROOT, '.opencode/skills/system-rerank-sidecar/scripts/start.sh');
const NODE_PATH   = resolve(REPO_ROOT, '.opencode/bin/lib/ensure-rerank-sidecar.cjs');

interface CanonicalDefaults {
  port: number;
  modelName: string;
  modelRevision: string;
}

function extractPythonDefaults(): CanonicalDefaults {
  const src = readFileSync(PYTHON_PATH, 'utf8');
  const port = /^DEFAULT_PORT\s*=\s*(\d+)\s*$/m.exec(src);
  const modelName = /^DEFAULT_MODEL_NAME\s*=\s*"([^"]+)"\s*$/m.exec(src);
  const modelRevision = /^DEFAULT_MODEL_REVISION\s*=\s*"([^"]+)"\s*$/m.exec(src);
  if (!port || !modelName || !modelRevision) {
    throw new Error(
      `Could not extract canonical defaults from ${PYTHON_PATH}. ` +
      `Expected DEFAULT_PORT, DEFAULT_MODEL_NAME, DEFAULT_MODEL_REVISION top-level assignments.`,
    );
  }
  return {
    port: Number.parseInt(port[1], 10),
    modelName: modelName[1],
    modelRevision: modelRevision[1],
  };
}

function extractBashDefaults(): CanonicalDefaults {
  const src = readFileSync(BASH_PATH, 'utf8');
  // PORT="${RERANK_SIDECAR_PORT:-8765}"
  const port = /PORT\s*=\s*"\$\{RERANK_SIDECAR_PORT:-(\d+)\}"/.exec(src);
  // "RERANK_MODEL_NAME=${RERANK_MODEL_NAME:-Qwen/Qwen3-Reranker-0.6B}"
  const modelName = /RERANK_MODEL_NAME=\$\{RERANK_MODEL_NAME:-([^}]+)\}/.exec(src);
  // "RERANK_MODEL_REVISION=${RERANK_MODEL_REVISION:-e61197ed4...}"
  const modelRevision = /RERANK_MODEL_REVISION=\$\{RERANK_MODEL_REVISION:-([^}]+)\}/.exec(src);
  if (!port || !modelName || !modelRevision) {
    throw new Error(
      `Could not extract bash defaults from ${BASH_PATH}. ` +
      `Expected PORT="\${RERANK_SIDECAR_PORT:-NNNN}" and RERANK_MODEL_{NAME,REVISION} parameter-expansion defaults.`,
    );
  }
  return {
    port: Number.parseInt(port[1], 10),
    modelName: modelName[1],
    modelRevision: modelRevision[1],
  };
}

function extractNodeDefaults(): CanonicalDefaults {
  const src = readFileSync(NODE_PATH, 'utf8');
  // const DEFAULT_PORT = 8765;
  const port = /const\s+DEFAULT_PORT\s*=\s*(\d+)\s*;/.exec(src);
  // readConfigHashEnvValue(env, 'RERANK_MODEL_NAME', 'Qwen/Qwen3-Reranker-0.6B')
  const modelName = /readConfigHashEnvValue\([^,]+,\s*'RERANK_MODEL_NAME'\s*,\s*'([^']+)'\s*\)/.exec(src);
  // readConfigHashEnvValue(env, 'RERANK_MODEL_REVISION', 'e61197ed4...')
  const modelRevision = /readConfigHashEnvValue\([^,]+,\s*'RERANK_MODEL_REVISION'\s*,\s*'([^']+)'\s*\)/.exec(src);
  if (!port || !modelName || !modelRevision) {
    throw new Error(
      `Could not extract Node defaults from ${NODE_PATH}. ` +
      `Expected const DEFAULT_PORT and readConfigHashEnvValue() defaults for RERANK_MODEL_{NAME,REVISION}.`,
    );
  }
  return {
    port: Number.parseInt(port[1], 10),
    modelName: modelName[1],
    modelRevision: modelRevision[1],
  };
}

describe('rerank-sidecar cross-language canonical parity (022/008 + 022/014)', () => {
  const python = extractPythonDefaults();
  const bash = extractBashDefaults();
  const node = extractNodeDefaults();

  it('DEFAULT_PORT matches across Python + Bash + Node', () => {
    expect(bash.port).toBe(python.port);
    expect(node.port).toBe(python.port);
  });

  it('DEFAULT_MODEL_NAME matches across Python + Bash + Node', () => {
    expect(bash.modelName).toBe(python.modelName);
    expect(node.modelName).toBe(python.modelName);
  });

  it('DEFAULT_MODEL_REVISION matches across Python + Bash + Node', () => {
    expect(bash.modelRevision).toBe(python.modelRevision);
    expect(node.modelRevision).toBe(python.modelRevision);
  });

  it('canonical Python module exposes the three expected constants', () => {
    // Smoke check: catches the case where sidecar_defaults.py is renamed
    // or its constants are renamed/removed.
    expect(python.port).toBeGreaterThan(0);
    expect(python.port).toBeLessThan(65536);
    expect(python.modelName.length).toBeGreaterThan(0);
    expect(python.modelRevision).toMatch(/^[a-f0-9]{40}$/);
  });
});
