// -------------------------------------------------------------------
// TEST: Scaffold Golden Snapshots
// -------------------------------------------------------------------

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { resolveLevelContract } from '../../mcp-server/lib/templates/level-contract-resolver';
import { renderInlineGates, type RenderLevel } from '../templates/inline-gate-renderer';

const SKILL_ROOT = path.resolve(__dirname, '../..');
const TEMPLATE_ROOT = path.join(SKILL_ROOT, 'templates');
const CREATE_SCRIPT = path.join(SKILL_ROOT, 'scripts/spec/create.sh');

function normalizeSnapshot(content: string): string {
  return content
    .replace(/\r\n/gu, '\n')
    .replaceAll('[capability]', '[needed behavior]')
    .replaceAll('"capability"', '"needed behavior"')
    .replaceAll('I want [capability]', 'I want [needed behavior]')
    .replaceAll(
      'Sub-phase manifest: which child phase folders exist and what each one does',
      'Sub-phase list: which child phase folders exist and what each one does',
    )
    .replace(/[ \t]+$/gmu, '')
    .trim();
}

function renderTemplate(templateName: string, level: RenderLevel): string {
  // Templates live in role-based folders (core/addons/packet-types); resolve by search.
  let templatePath = path.join(TEMPLATE_ROOT, templateName);
  for (const sub of ['core', 'addons', 'packet-types']) {
    const candidate = path.join(TEMPLATE_ROOT, sub, templateName);
    if (fs.existsSync(candidate)) {
      templatePath = candidate;
      break;
    }
  }
  return renderInlineGates(fs.readFileSync(templatePath, 'utf8'), level);
}

describe('manifest template golden snapshots', () => {
  for (const level of ['1', '2', '3', '3+'] as RenderLevel[]) {
    it(`renders required docs for Level ${level} from manifest templates`, () => {
      const contract = resolveLevelContract(level);
      const lifecycleDocs = Object.values(contract.lifecycleRequiredDocs).flat();
      for (const docName of new Set([
        ...contract.requiredCoreDocs,
        ...contract.requiredAddonDocs,
        ...lifecycleDocs,
      ])) {
        const rendered = renderTemplate(`${docName}.tmpl`, level);
        const normalized = normalizeSnapshot(rendered);
        expect(rendered, docName).toMatch(/^---\n/u);
        expect(normalized, docName).toContain('SPECKIT_TEMPLATE_SOURCE');
        expect(normalized, docName).not.toMatch(/<!--\s*IF\s+/u);
        expect(normalized, docName).not.toMatch(/<!--\s*\/IF\s*-->/u);
        expect(normalized).toMatchSnapshot(`${level}-${docName}`);
      }
    });
  }

  it('renders the phase-parent spec from the manifest template', () => {
    const rendered = renderTemplate('phase-parent.spec.md.tmpl', 'phase');
    const normalized = normalizeSnapshot(rendered);
    expect(rendered).toMatch(/^---\n/u);
    expect(normalized).toContain('SPECKIT_TEMPLATE_SOURCE');
    expect(normalized).toContain('PHASE DOCUMENTATION MAP');
    expect(normalized).not.toMatch(/<!--\s*IF\s+/u);
    expect(normalized).not.toMatch(/<!--\s*\/IF\s*-->/u);
    expect(normalized).toMatchSnapshot('phase-parent-spec.md');
  });

  it('renders each lazy add-on template with its stable anchor structure', () => {
    const expectedAnchors: Record<string, string[]> = {
      'before-after.md': ['metadata', 'summary', 'comparison', 'net-effect', 'notes-caveats'],
      'timeline.md': ['metadata', 'timeline', 'milestones'],
      'roadmap.md': ['metadata', 'now-next-later', 'milestones-targets', 'dependencies'],
      'decision-record.md': ['adr-001'],
    };

    for (const [docName, anchors] of Object.entries(expectedAnchors)) {
      const rendered = renderTemplate(`${docName}.tmpl`, '1');
      const normalized = normalizeSnapshot(rendered);
      expect(rendered, docName).toMatch(/^---\n/u);
      expect(normalized, docName).toContain('SPECKIT_TEMPLATE_SOURCE');
      expect(normalized, docName).not.toMatch(/<!--\s*IF\s+/u);
      expect(normalized, docName).not.toMatch(/<!--\s*\/IF\s*-->/u);
      for (const anchor of anchors) {
        expect(normalized, `${docName}:${anchor}`).toContain(`<!-- ANCHOR:${anchor} -->`);
      }
      expect(normalized, docName).toMatchSnapshot(`lazy-${docName}`);
    }
  });

  it('scaffolds lazy add-ons only with explicit opt-in', () => {
    const root = fs.mkdtempSync(path.join(tmpdir(), 'spec-kit-lazy-addons-'));
    const defaultPath = path.join(root, '001-default');
    const optInPath = path.join(root, '002-opt-in');
    const runCreate = (target: string, withLazyAddons = false) => spawnSync(
      'bash',
      [CREATE_SCRIPT, '--path', target, '--level', '3', '--skip-branch', ...(withLazyAddons ? ['--with-lazy-addons'] : []), 'lazy add-on test'],
      { cwd: SKILL_ROOT, encoding: 'utf8' },
    );
    const lazyDocs = ['before-after.md', 'timeline.md', 'roadmap.md', 'decision-record.md'];

    try {
      const defaultResult = runCreate(defaultPath);
      expect(defaultResult.status, defaultResult.stderr).toBe(0);
      for (const docName of lazyDocs) {
        expect(fs.existsSync(path.join(defaultPath, docName)), docName).toBe(false);
      }

      const optInResult = runCreate(optInPath, true);
      expect(optInResult.status, optInResult.stderr).toBe(0);
      for (const docName of lazyDocs) {
        expect(fs.existsSync(path.join(optInPath, docName)), docName).toBe(true);
      }
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('keeps Level 1 as the minimum viable authored packet', () => {
    const contract = resolveLevelContract('1');
    expect([...contract.requiredCoreDocs, ...contract.requiredAddonDocs]).toEqual([
      'spec.md',
      'plan.md',
      'tasks.md',
    ]);
    expect(contract.lifecycleRequiredDocs.afterImplementationStarts).toEqual(['implementation-summary.md']);
  });

  it('keeps legacy checklist optional while gating merged verification in tasks', () => {
    const contract = resolveLevelContract('2');
    expect(contract.requiredAddonDocs).not.toContain('checklist.md');
    expect(contract.optionalAddonDocs).toEqual(['checklist.md', 'acceptance-criteria.md']);

    const renderedTasks = renderTemplate('tasks.md.tmpl', '2');
    expect(renderedTasks).toContain('## Verification Checklist');
    expect(renderedTasks).toContain('## Testing Checklist');
    expect(renderedTasks).toContain('<!-- ANCHOR:protocol -->');
    expect(renderedTasks).toContain('<!-- ANCHOR:summary -->');
    expect(renderedTasks).not.toContain('<!-- IF level:');
  });
});
