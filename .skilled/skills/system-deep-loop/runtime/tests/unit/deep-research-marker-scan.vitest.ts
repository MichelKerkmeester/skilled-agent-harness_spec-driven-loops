// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Marker Scan Guard Test
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';

import { runtimeRoot } from '../helpers/spawn-cjs';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const SKILLS_ROOT = resolve(runtimeRoot, '..', '..', '..');
const TEMPLATE_PATH = resolve(runtimeRoot, '..', 'deep-research', 'assets', 'prompt-pack-iteration.md.tmpl');

const AUTO_YAML_PATH = resolve(SKILLS_ROOT, 'commands', 'deep', 'assets', 'deep-research-auto.yaml');
const CONFIRM_YAML_PATH = resolve(SKILLS_ROOT, 'commands', 'deep', 'assets', 'deep-research-confirm.yaml');
const YAML_PATHS = [AUTO_YAML_PATH, CONFIRM_YAML_PATH];

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function stepBlock(text: string, stepName: string): string {
  const marker = `      ${stepName}:\n`;
  const start = text.indexOf(marker);
  if (start === -1) {
    throw new Error(`${stepName} was not found in the workflow asset`);
  }

  const rest = text.slice(start + marker.length);
  const nextStep = rest.search(/\n      [a-zA-Z0-9_]+:\n/u);
  return nextStep === -1 ? rest : rest.slice(0, nextStep);
}

function markerScanConfig(yamlPath: string): { canonicalHeader: string; nestedMarkerPattern: string } {
  const block = stepBlock(readFileSync(yamlPath, 'utf8'), 'step_marker_scan');
  const canonicalHeader = /canonical_header:\s*"([^"]+)"/u.exec(block)?.[1];
  const nestedMarkerPattern = /nested_marker_pattern:\s*"([^"]+)"/u.exec(block)?.[1];
  if (!canonicalHeader || !nestedMarkerPattern) {
    throw new Error(`step_marker_scan marker keys missing in ${basename(yamlPath)}`);
  }
  return { canonicalHeader, nestedMarkerPattern };
}

// ───────────────────────────────────────────────────────────────────
// 4. TESTS
// ───────────────────────────────────────────────────────────────────

describe('deep research marker scan never matches its own canonical header', () => {
  const templateFirstLine = readFileSync(TEMPLATE_PATH, 'utf8').split(/\r?\n/u)[0]?.trim() ?? '';

  for (const yamlPath of YAML_PATHS) {
    it(`matches only review markers in ${basename(yamlPath)}`, () => {
      const { canonicalHeader, nestedMarkerPattern } = markerScanConfig(yamlPath);
      const nestedMarker = new RegExp(nestedMarkerPattern, 'u');

      expect(canonicalHeader).toBe(templateFirstLine);
      expect(nestedMarker.test(templateFirstLine)).toBe(false);
      expect(nestedMarker.test('DEEP-REVIEW')).toBe(true);
      expect(nestedMarker.test('CODE-REVIEW')).toBe(true);
      expect(nestedMarker.test('DEEP-RESEARCH extra')).toBe(false);
      expect(nestedMarker.test('')).toBe(false);
    });
  }
});
