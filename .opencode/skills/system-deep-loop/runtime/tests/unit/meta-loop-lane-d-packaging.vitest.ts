// MODULE: Meta Loop Lane D Packaging Tests

import { describe, expect, it } from 'vitest';

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const RUNTIME_ROOT = resolve(TEST_DIR, '..', '..');
const WORKSPACE_ROOT = resolve(RUNTIME_ROOT, '..', '..', '..', '..');

const PROFILE_PATH = resolve(
  WORKSPACE_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/assets/non_dev_ai_system/profiles/deep_loop_runtime.json',
);
const SCHEMA_PATH = resolve(
  WORKSPACE_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/assets/non_dev_ai_system/packaging_config.schema.json',
);
const COMMAND_PATH = resolve(WORKSPACE_ROOT, '.opencode/commands/deep/ai-system-improvement.md');
const CONTRACT_PATH = resolve(
  WORKSPACE_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/references/non_dev_ai_system/loop_contract.md',
);

type SelfTargetProfile = {
  packaging_root: string;
  frozenSurfaces: Array<{ relpath: string; surfaceType: string }>;
  editableTechDocs: Array<{ relpath: string }>;
  allowedDiffRelpaths: string[];
  excludedSessionPrefixes: string[];
};

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}

describe('meta-loop Lane D runtime/ packaging', () => {
  it('defines a self-target profile whose editable docs are allowed and frozen surfaces are not', () => {
    const profile = readJson<SelfTargetProfile>(PROFILE_PATH);
    const allowed = new Set(profile.allowedDiffRelpaths);
    const frozenRelpaths = profile.frozenSurfaces.map((surface) => surface.relpath);

    expect(existsSync(resolve(WORKSPACE_ROOT, profile.packaging_root))).toBe(true);
    expect(profile.frozenSurfaces.some((surface) => surface.surfaceType === 'scorer')).toBe(true);
    expect(profile.frozenSurfaces.some((surface) => surface.surfaceType === 'harness')).toBe(true);
    expect(profile.excludedSessionPrefixes).toEqual([
      'deep-loop-runtime-loop-',
      'deep-loop-runtime-scoring-',
      'deep-loop-runtime-merge-',
      'deep-loop-runtime-diag-',
    ]);

    for (const doc of profile.editableTechDocs) {
      expect(allowed.has(doc.relpath)).toBe(true);
      expect(existsSync(resolve(WORKSPACE_ROOT, doc.relpath))).toBe(true);
    }

    for (const relpath of frozenRelpaths) {
      expect(allowed.has(relpath)).toBe(false);
      expect(existsSync(resolve(WORKSPACE_ROOT, relpath))).toBe(true);
    }

    expect(allowed.has(
      '.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs',
    )).toBe(false);
    expect(allowed.has(
      '.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs',
    )).toBe(false);
  });

  it('keeps the Lane D schema backward-compatible while recognizing self-target metadata', () => {
    const schema = readJson<{ properties: Record<string, unknown>; required: string[] }>(SCHEMA_PATH);

    for (const key of [
      'frozenSurfaces',
      'editableTechDocs',
      'allowedDiffRelpaths',
      'excludedSessionPrefixes',
    ]) {
      expect(schema.properties[key]).toBeDefined();
      expect(schema.required).not.toContain(key);
    }
  });

  it('documents the command-level self-target guard without changing the loop-host argv contract', () => {
    const command = readFileSync(COMMAND_PATH, 'utf8');
    const contract = readFileSync(CONTRACT_PATH, 'utf8');

    expect(command).toContain('--self-target <profile>');
    expect(command).toContain('dry-run remains the default');
    expect(command).toContain('Require a clean tree for `--live`');
    expect(command).toContain('Acquire the single-writer loop lock');
    expect(command).toContain('unless the user explicitly passes `--parallel`');
    expect(command).toContain('The self-target flag is not forwarded to `loop-host.cjs`');

    expect(contract).toContain('## 11. SELF-TARGET PACKAGING PROFILE');
    expect(contract).toContain('`allowedDiffRelpaths[]`');
    expect(contract).toContain('every frozen surface must be absent');
  });
});
