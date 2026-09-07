// ───────────────────────────────────────────────────────────────────
// TEST: Scaffold Golden Snapshots
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { afterAll, describe, expect, it } from 'vitest';
import { resolveLevelContract } from '../../lib/templates/level-contract-resolver';
import { renderInlineGates, type RenderLevel } from '../templates/inline-gate-renderer';

const SKILL_ROOT = path.resolve(__dirname, '../../..');
const TEMPLATE_ROOT = path.join(SKILL_ROOT, 'templates');
const CREATE_SCRIPT = path.join(SKILL_ROOT, 'runtime', 'cli', 'spec', 'create.sh');

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
      'goal.md': ['directive', 'completion', 'log'],
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
      // The goal document has its own flag and is not part of the lazy four.
      expect(fs.existsSync(path.join(optInPath, 'goal.md'))).toBe(false);
      const goalPath = path.join(root, '003-with-goal');
      const goalResult = spawnSync(
        'bash',
        [CREATE_SCRIPT, '--path', goalPath, '--level', '1', '--skip-branch', '--with-goal', 'goal flag test'],
        { cwd: SKILL_ROOT, encoding: 'utf8' },
      );
      expect(goalResult.status, goalResult.stderr).toBe(0);
      // create.sh, not the renderer, strips the template's provenance token from
      // titles and substitutes every hard placeholder it knows the value of.
      for (const scaffolded of ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md', 'goal.md']) {
        const body = fs.readFileSync(path.join(goalPath, scaffolded), 'utf8');
        expect(body, scaffolded).not.toMatch(/\[template:/u);
        expect(body, scaffolded).not.toMatch(/\[Feature Name\]/u);
      }
      const goal = fs.readFileSync(path.join(goalPath, 'goal.md'), 'utf8');
      expect(goal).toContain('SPECKIT_TEMPLATE_SOURCE');
      expect(goal).toContain('<!-- ANCHOR:directive -->');
      expect(goal).toContain('last_updated_by: "scaffold"');
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

  it('carries verification in the merged tasks document and nowhere else', () => {
    const contract = resolveLevelContract('2');
    // The standalone verification document is retired: it must appear in no
    // bucket at all, or a scaffold would start producing it again.
    for (const bucket of [
      contract.requiredCoreDocs,
      contract.requiredAddonDocs,
      contract.optionalAddonDocs,
      contract.lazyAddonDocs,
    ]) {
      expect(bucket).not.toContain('checklist.md');
    }
    expect(contract.optionalAddonDocs).toEqual(['acceptance-criteria.md']);

    const renderedTasks = renderTemplate('tasks.md.tmpl', '2');
    expect(renderedTasks).toContain('## Verification Checklist');
    expect(renderedTasks).toContain('## Testing Checklist');
    expect(renderedTasks).toContain('<!-- ANCHOR:protocol -->');
    expect(renderedTasks).toContain('<!-- ANCHOR:summary -->');
    expect(renderedTasks).not.toContain('<!-- IF level:');
  });
});

describe('review and research packet scaffolds', () => {
  // Metadata derivation only runs under a specs root, so the scaffolds land in
  // a throwaway folder inside the repository's specs tree and are removed after.
  const repoRoot = path.resolve(SKILL_ROOT, '..', '..', '..');
  const root = path.join(repoRoot, 'specs', `zz-scaffold-golden-${process.pid}-${Date.now()}`);
  const validateScript = path.join(SKILL_ROOT, 'runtime', 'cli', 'spec', 'validate.sh');
  fs.mkdirSync(root, { recursive: true });
  afterAll(() => fs.rmSync(root, { recursive: true, force: true }));

  const cases = [
    { level: 'review', number: '999', nestedDoc: 'review/review-report.md' },
    { level: 'research', number: '998', nestedDoc: 'research/research.md' },
  ] as const;

  for (const { level, number, nestedDoc } of cases) {
    it(`scaffolds a ${level} packet with its nested document at the manifest path, validating strict untouched`, () => {
      const target = path.join(root, `${number}-${level}-fixture`);
      const created = spawnSync(
        'bash',
        [CREATE_SCRIPT, '--json', '--skip-branch', '--level', level, '--path', target, '--number', number, `${level} fixture`],
        { cwd: SKILL_ROOT, encoding: 'utf8' },
      );
      expect(created.status, created.stderr).toBe(0);
      expect(fs.existsSync(path.join(target, nestedDoc)), nestedDoc).toBe(true);
      expect(fs.existsSync(path.join(target, path.basename(nestedDoc))), `${nestedDoc} must not land flat`).toBe(false);
      const nested = fs.readFileSync(path.join(target, nestedDoc), 'utf8');
      expect(nested).not.toMatch(/\[template:/u);
      expect(nested).not.toMatch(/\[NAME\]/u);
      expect(fs.readFileSync(path.join(target, 'spec.md'), 'utf8')).toContain(`<!-- SPECKIT_LEVEL: ${level} -->`);

      const validated = spawnSync('bash', [validateScript, target, '--strict', '--no-recursive'], { cwd: SKILL_ROOT, encoding: 'utf8' });
      expect(validated.stdout).toContain(`Level:  ${level}`);
      expect(validated.stdout, validated.stdout).toContain('RESULT: PASSED');
      expect(validated.status).toBe(0);
    });
  }

  it('renders the review report and research spec templates from the manifest', () => {
    const templates = [
      { templateName: 'review-report.md.tmpl', level: 'review', snapshot: 'review-review-report.md', anchorFree: true },
      { templateName: 'research.spec.md.tmpl', level: 'research', snapshot: 'research-spec.md', anchorFree: false },
    ] as const;
    for (const { templateName, level, snapshot, anchorFree } of templates) {
      const rendered = renderTemplate(templateName, level);
      const normalized = normalizeSnapshot(rendered);
      expect(rendered, templateName).toMatch(/^---\n/u);
      expect(normalized, templateName).toContain('SPECKIT_TEMPLATE_SOURCE');
      expect(normalized, templateName).not.toMatch(/<!--\s*IF\s+/u);
      if (!anchorFree) {
        for (const anchor of ['metadata', 'problem', 'scope', 'questions']) {
          expect(normalized, `${templateName}:${anchor}`).toContain(`<!-- ANCHOR:${anchor} -->`);
        }
        expect(normalized, templateName).toContain('<!-- SPECKIT_LEVEL: research -->');
      }
      expect(normalized, templateName).toMatchSnapshot(snapshot);
    }
  });
});
