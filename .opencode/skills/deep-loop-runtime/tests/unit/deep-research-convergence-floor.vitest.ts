// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Convergence Floor Contract
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const testDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(testDir, '..', '..', '..', '..');
const configPath = resolve(
  repoRoot,
  'skills',
  'deep-loop-workflows',
  'deep-research',
  'assets',
  'deep_research_config.json',
);
const yamlPath = resolve(repoRoot, 'commands', 'deep', 'assets', 'deep_research_auto.yaml');

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function readYaml(): string {
  return readFileSync(yamlPath, 'utf8');
}

function readConfig(): Record<string, unknown> {
  return JSON.parse(readFileSync(configPath, 'utf8')) as Record<string, unknown>;
}

// ───────────────────────────────────────────────────────────────────
// 4. CONTRACT TESTS
// ───────────────────────────────────────────────────────────────────

describe('deep-research convergence floor contract', () => {
  it('adds explicit floor and convergence mode defaults to the config template', () => {
    const config = readConfig();
    const antiConvergence = config.antiConvergence as Record<string, unknown>;

    expect(config).not.toHaveProperty('minIterations');
    expect(config).not.toHaveProperty('convergenceMode');
    expect(antiConvergence.minIterations).toBe(3);
    expect(antiConvergence.convergenceMode).toBe('default');
    expect(antiConvergence.stopPolicy).toBe('fail-closed');
    expect(config.maxIterations).toBe(10);
  });

  it('keeps the hard iteration cap ahead of the convergence floor', () => {
    const yaml = readYaml();
    const hardCapIndex = yaml.indexOf('iteration_count >= max_iterations');
    const floorIndex = yaml.indexOf('iteration_count < effective_min_iterations');

    expect(hardCapIndex).toBeGreaterThanOrEqual(0);
    expect(floorIndex).toBeGreaterThanOrEqual(0);
    expect(hardCapIndex).toBeLessThan(floorIndex);
    expect(yaml).toContain('if min_iterations_raw exceeds max_iterations, use max_iterations');
  });

  it('fails open for older configs and emits a distinct pass event when the floor clears', () => {
    const yaml = readYaml();

    expect(yaml).toContain('min_iterations_missing_warning');
    expect(yaml).toContain('using no convergence floor for backward compatibility');
    expect(yaml).toContain('event":"min_iterations_guard_pass"');
    expect(yaml).toContain('"iterationCount":{iteration_count}');
    expect(yaml).toContain('"minIterations":{effective_min_iterations}');
  });

  it('allows convergence mode off without disabling terminal caps or recovery halts', () => {
    const yaml = readYaml();
    const hardCapIndex = yaml.indexOf('iteration_count >= max_iterations');
    const recoveryIndex = yaml.indexOf('stuck_count >= config.stuckThreshold');
    const modeOffIndex = yaml.indexOf('convergence_mode == "off"');

    expect(modeOffIndex).toBeGreaterThanOrEqual(0);
    expect(hardCapIndex).toBeLessThan(modeOffIndex);
    expect(recoveryIndex).toBeLessThan(modeOffIndex);
    expect(yaml).toContain('skip convergence stop candidates');
  });
});
