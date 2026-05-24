import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const MCP_SERVER_ROOT = resolve(TEST_DIR, '..');
const WORKSPACE_ROOT = resolve(TEST_DIR, '../../../../../');
const PLAYBOOK_ROOT = join(WORKSPACE_ROOT, '.opencode/skills/deep-ai-council/manual_testing_playbook');
const SKILL_ADVISOR_TEST_ROOT = join(WORKSPACE_ROOT, '.opencode/skills/system-skill-advisor/mcp_server/tests');
const DEEP_LOOP_RUNTIME_TEST_ROOT = join(WORKSPACE_ROOT, '.opencode/skills/deep-loop-runtime/tests');

const RENAMED_TEST_REFERENCES: Record<string, string> = {
  '.opencode/skills/system-spec-kit/mcp_server/tests/ai-council-runtime-parity.vitest.ts':
    '.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-runtime-parity.vitest.ts',
  '.opencode/skills/system-spec-kit/mcp_server/tests/ai-council-permission-scope.vitest.ts':
    '.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-permission-scope.vitest.ts',
  '.opencode/skills/system-spec-kit/mcp_server/tests/ai-council-audit-trail.vitest.ts':
    '.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-audit-trail.vitest.ts',
  '.opencode/skills/system-spec-kit/mcp_server/tests/ai-council-rollback.vitest.ts':
    '.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-rollback.vitest.ts',
  '.opencode/skills/system-spec-kit/scripts/tests/ai-council-persist-artifacts.vitest.ts':
    '.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-persist-artifacts.vitest.ts',
};

const TEST_FILE_REF =
  /(?:(?:\.opencode\/skills\/system-spec-kit\/)?(?:mcp_server\/tests|scripts\/tests)|\.opencode\/skills\/deep-loop-runtime\/tests|\.\.\/scripts\/tests)\/[A-Za-z0-9._/-]+?\.vitest\.ts/g;
const TEST_NAME_ANCHOR =
  /`((?:(?:\.opencode\/skills\/system-spec-kit\/)?(?:mcp_server\/tests|scripts\/tests)|\.opencode\/skills\/deep-loop-runtime\/tests|\.\.\/scripts\/tests)\/[^`]+?\.vitest\.ts)`\s+test name\s+`([^`]+)`/g;
const TEST_CALL = /\b(?:it|test)\s*\(\s*(?:'([^']+)'|"([^"]+)"|`([^`]+)`)/g;

function walkMarkdown(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walkMarkdown(path);
    return entry.isFile() && entry.name.endsWith('.md') ? [path] : [];
  }).sort();
}

function walkVitest(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walkVitest(path);
    return entry.isFile() && entry.name.endsWith('.vitest.ts') ? [path] : [];
  }).sort();
}

function resolveTestReference(reference: string): string {
  const normalizedReference = RENAMED_TEST_REFERENCES[reference] ?? reference;
  if (normalizedReference === 'mcp_server/tests/scorer/native-scorer.vitest.ts') {
    return join(SKILL_ADVISOR_TEST_ROOT, 'scorer/native-scorer.vitest.ts');
  }
  const withoutSkillPrefix = normalizedReference.replace(/^\.opencode\/skills\/system-spec-kit\//, '');
  if (withoutSkillPrefix.startsWith('mcp_server/tests/')) {
    return join(WORKSPACE_ROOT, '.opencode/skills/system-spec-kit', withoutSkillPrefix);
  }
  if (withoutSkillPrefix.startsWith('scripts/tests/')) {
    return join(WORKSPACE_ROOT, '.opencode/skills/system-spec-kit', withoutSkillPrefix);
  }
  if (withoutSkillPrefix.startsWith('../scripts/tests/')) {
    return resolve(MCP_SERVER_ROOT, withoutSkillPrefix);
  }
  if (normalizedReference.startsWith('.opencode/skills/deep-loop-runtime/tests/')) {
    return join(WORKSPACE_ROOT, normalizedReference);
  }
  return join(WORKSPACE_ROOT, reference);
}

function read(path: string): string {
  return readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
}

function extractStaticTestNames(source: string): Set<string> {
  const names = new Set<string>();
  for (const match of source.matchAll(TEST_CALL)) {
    const name = match[1] ?? match[2] ?? match[3];
    if (name) names.add(name);
  }
  return names;
}

describe('council playbook anchor integrity', () => {
  it('every playbook anchor resolves to a real vitest test file and test name', () => {
    const playbookFiles = walkMarkdown(PLAYBOOK_ROOT);
    const availableTests = new Set([
      ...walkVitest(join(MCP_SERVER_ROOT, 'tests')),
      ...walkVitest(resolve(MCP_SERVER_ROOT, '../scripts/tests')),
      ...walkVitest(SKILL_ADVISOR_TEST_ROOT),
      ...walkVitest(DEEP_LOOP_RUNTIME_TEST_ROOT),
    ]);

    const missingFiles: string[] = [];
    const missingNames: string[] = [];

    for (const playbookFile of playbookFiles) {
      const source = read(playbookFile);
      const testRefs = new Set(source.match(TEST_FILE_REF) ?? []);

      for (const reference of testRefs) {
        const resolved = resolveTestReference(reference);
        if (!availableTests.has(resolved) || !statSync(resolved, { throwIfNoEntry: false })?.isFile()) {
          missingFiles.push(`${playbookFile}: ${reference}`);
        }
      }

      for (const match of source.matchAll(TEST_NAME_ANCHOR)) {
        const [, reference, testName] = match;
        const resolved = resolveTestReference(reference);
        if (!availableTests.has(resolved) || !statSync(resolved, { throwIfNoEntry: false })?.isFile()) {
          missingFiles.push(`${playbookFile}: ${reference} for test name "${testName}"`);
          continue;
        }

        const names = extractStaticTestNames(read(resolved));
        if (!names.has(testName)) {
          missingNames.push(`${playbookFile}: ${reference} missing test name "${testName}"`);
        }
      }
    }

    expect(missingFiles, `Missing playbook vitest file anchors:\n${missingFiles.join('\n')}`).toEqual([]);
    expect(missingNames, `Missing playbook vitest test-name anchors:\n${missingNames.join('\n')}`).toEqual([]);
  });
});
