// The help printer once iterated a hardcoded pair of registry categories, so
// the six structural rules never appeared in `validate.sh --help` even though
// they ran on every strict pass. The printer now derives its categories from
// the registry; this suite holds it to that.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = path.resolve(TEST_DIR, '..');
const VALIDATE_SH = path.join(CLI_ROOT, 'spec', 'validate.sh');
const REGISTRY_PATH = path.join(CLI_ROOT, 'lib', 'validator-registry.json');

interface RegistryRule {
  rule_id: string;
  category: string;
  severity: string;
}

function registryRules(): RegistryRule[] {
  const parsed = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8')) as RegistryRule[] | { rules: RegistryRule[] };
  return Array.isArray(parsed) ? parsed : parsed.rules;
}

function helpOutput(): string {
  return execFileSync('bash', [VALIDATE_SH, '--help'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
}

describe('validate.sh --help lists the whole registry', () => {
  const rules = registryRules();
  const help = helpOutput();

  it('prints every rule id the registry declares', () => {
    const missing = rules.filter((rule) => !help.includes(`${rule.rule_id} [${rule.severity}`));
    expect(missing.map((rule) => rule.rule_id)).toEqual([]);
  });

  it('prints a heading for every category the registry uses', () => {
    const categories = [...new Set(rules.map((rule) => rule.category))];
    for (const category of categories) {
      expect(help).toContain(`  ${category}:`);
    }
  });
});
