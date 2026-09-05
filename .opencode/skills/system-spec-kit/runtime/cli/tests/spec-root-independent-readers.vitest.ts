// ---------------------------------------------------------------
// MODULE: Independent Spec-Root Reader Tests
// ---------------------------------------------------------------

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { validateMemoryQualityContent } from '../lib/validate-memory-quality';
import { buildSpecAffinityTargets } from '../utils/spec-affinity';

const originalCwd = process.cwd();
const tempRoots: string[] = [];

function createWorkspace(): string {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-independent-readers-'));
  tempRoots.push(workspace);
  process.chdir(workspace);
  return workspace;
}

function writeSpec(workspace: string, root: 'canonical' | 'legacy', specFolder: string, phrase: string): string {
  const specsRoot = root === 'canonical'
    ? path.join(workspace, '.opencode', 'specs')
    : path.join(workspace, 'specs');
  const resolvedSpecFolder = path.join(specsRoot, specFolder);
  fs.mkdirSync(resolvedSpecFolder, { recursive: true });
  fs.writeFileSync(path.join(resolvedSpecFolder, 'spec.md'), `---
title: "${phrase}"
trigger_phrases:
  - "${phrase}"
---

# ${phrase}
`, 'utf8');
  return resolvedSpecFolder;
}

function validateTopicalPhrase(specFolder: string, phrase: string): boolean | undefined {
  const result = validateMemoryQualityContent(`---
title: "Independent reader fixture"
spec_folder: "${specFolder}"
trigger_phrases:
  - "independent reader fixture"
tool_count: 0
---

# Independent reader fixture

This temporary fixture contains ${phrase} and enough durable text to exercise topical validation.
`);

  return result.ruleResults.find((rule) => rule.ruleId === 'V12')?.passed;
}

afterEach(() => {
  process.chdir(originalCwd);
  while (tempRoots.length > 0) {
    fs.rmSync(tempRoots.pop()!, { recursive: true, force: true });
  }
});

describe('independent spec-root readers', () => {
  it('prefers canonical metadata when both roots contain the same packet', () => {
    const workspace = createWorkspace();
    const specFolder = 'system-spec-kit/901-independent-reader';
    const canonicalPath = writeSpec(workspace, 'canonical', specFolder, 'canonical reader marker');
    writeSpec(workspace, 'legacy', specFolder, 'legacy reader marker');

    const affinity = buildSpecAffinityTargets(specFolder);

    expect(affinity.resolvedSpecFolderPath && fs.realpathSync(affinity.resolvedSpecFolderPath))
      .toBe(fs.realpathSync(canonicalPath));
    expect(affinity.exactPhrases).toContain('canonical reader marker');
    expect(affinity.exactPhrases).not.toContain('legacy reader marker');
    expect(validateTopicalPhrase(specFolder, 'canonical reader marker')).toBe(true);
  });

  it('retains legacy-only read fallback', () => {
    const workspace = createWorkspace();
    const specFolder = 'system-spec-kit/902-legacy-reader';
    const legacyPath = writeSpec(workspace, 'legacy', specFolder, 'legacy fallback marker');

    const affinity = buildSpecAffinityTargets(specFolder);

    expect(affinity.resolvedSpecFolderPath && fs.realpathSync(affinity.resolvedSpecFolderPath))
      .toBe(fs.realpathSync(legacyPath));
    expect(affinity.exactPhrases).toContain('legacy fallback marker');
    expect(validateTopicalPhrase(specFolder, 'legacy fallback marker')).toBe(true);
  });
});
