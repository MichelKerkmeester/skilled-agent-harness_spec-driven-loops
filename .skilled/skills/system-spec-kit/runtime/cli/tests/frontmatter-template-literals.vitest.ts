// ───────────────────────────────────────────────────────────────────
// MODULE: Frontmatter Template Literals Tests
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

// The template literal reader fetches the template on every call and keeps nothing
// between calls. The first case guards the fresh-run boundary: a new module instance
// must read the template from disk rather than inherit a value an earlier instance
// read for the same path. The second case guards the within-instance boundary: a
// template changed on disk must be re-read by the same instance on its next call.

const roots: string[] = [];

function makeRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'frontmatter-template-literals-'));
  roots.push(root);
  return root;
}

function writeSpecTemplate(templatesRoot: string, importanceTier: string): void {
  const directory = path.join(templatesRoot, 'core');
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(
    path.join(directory, 'spec.md.tmpl'),
    `---\nimportance_tier: "${importanceTier}"\ncontextType: "implementation"\n---\n# Spec\n`,
  );
}

async function loadFreshModule() {
  vi.resetModules();
  return import('../lib/frontmatter-migration.js');
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('frontmatter template literals', () => {
  it('reads the template again in a fresh run instead of a value an earlier run cached', async () => {
    const root = makeRoot();
    const templatesRoot = path.join(root, 'templates');
    const filePath = path.join(root, 'packet', 'spec.md');
    const content = '---\ntitle: "Packet Spec"\ndescription: "A packet spec."\n---\n# Packet Spec\n';
    const options = { templatesRoot, templateLiteralDefaults: true };

    writeSpecTemplate(templatesRoot, 'critical');
    const earlier = await loadFreshModule();
    expect(earlier.buildFrontmatterContent(content, options, filePath).managed.importance_tier).toBe('critical');

    writeSpecTemplate(templatesRoot, 'normal');
    const later = await loadFreshModule();
    expect(later.buildFrontmatterContent(content, options, filePath).managed.importance_tier).toBe('normal');
  });

  it('re-reads a template that changed on disk within the same module instance', async () => {
    const root = makeRoot();
    const templatesRoot = path.join(root, 'templates');
    const filePath = path.join(root, 'packet', 'spec.md');
    const content = '---\ntitle: "Packet Spec"\ndescription: "A packet spec."\n---\n# Packet Spec\n';
    const options = { templatesRoot, templateLiteralDefaults: true };

    writeSpecTemplate(templatesRoot, 'critical');
    const mod = await loadFreshModule();
    expect(mod.buildFrontmatterContent(content, options, filePath).managed.importance_tier).toBe('critical');

    writeSpecTemplate(templatesRoot, 'normal');
    expect(mod.buildFrontmatterContent(content, options, filePath).managed.importance_tier).toBe('normal');
  });
});
