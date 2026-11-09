// ───────────────────────────────────────────────────────────────────
// MODULE: Upgrade Legacy Refresh Markers
// ───────────────────────────────────────────────────────────────────

import crypto from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { renderInlineGates } from '../templates/inline-gate-renderer';
import { loadTemplateContractForDocument } from '../utils/template-structure.js';

type LaneResult = {
  text: string;
  changed: boolean;
  actions: string[];
  refusals: string[];
};

const require = createRequire(path.join(__dirname, 'upgrade-legacy-refresh-markers.vitest.ts'));
const { refreshMarker } = require('../spec/heal-spec-docs.cjs') as {
  refreshMarker: (text: string, file: string) => LaneResult;
};

const skillRoot = path.resolve(__dirname, '../../..');
const repoRoot = path.resolve(skillRoot, '../../..');

// The packet the fixture renders: filled content on the current template anchors, which is
// what a passing packet carrying an old marker looks like. The command derives its own
// repository from its location and refuses a root outside it, so the sweep runs against a
// copy of the skill inside a throwaway repository rather than this checkout.
const TRACK = 'specs/refresh-track';
const FIXTURE = 'runtime/cli/test-fixtures/002-valid-level1';
const LEGACY_SPEC_MARKER = '<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->';
const EXTRA_ANCHOR = [
  '<!-- ANCHOR:invented-extra -->',
  '## Addendum',
  '',
  'Notes the level template does not render.',
  '<!-- /ANCHOR:invented-extra -->',
].join('\n');

let sandbox: string;
let copy: string;
const tempRoots: string[] = [];

function runUpgrade(args: string[]) {
  return spawnSync(process.execPath, [path.join(copy, 'runtime/cli/spec/upgrade-legacy.mjs'), ...args], {
    cwd: sandbox,
    encoding: 'utf8',
  });
}

function validate(folder: string) {
  return spawnSync('bash', [path.join(copy, 'runtime/cli/spec/validate.sh'), folder, '--strict'], {
    cwd: sandbox,
    encoding: 'utf8',
  });
}

function derive(folder: string) {
  return spawnSync(
    process.execPath,
    [path.join(copy, 'runtime/cli/spec/repair-derived.cjs'), '--folder', path.relative(sandbox, folder), '--apply'],
    { cwd: sandbox, encoding: 'utf8' },
  );
}

// Every file's relative path plus its content digest, sorted, so any write anywhere in the
// packet shows up as a different digest.
function digestTree(folder: string): string {
  const entries: string[] = [];
  const walk = (dir: string): void => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, item.name);
      if (item.isDirectory()) {
        walk(abs);
      } else {
        const digest = crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');
        entries.push(`${path.relative(folder, abs).split(path.sep).join('/')} ${digest}`);
      }
    }
  };
  walk(folder);
  return crypto.createHash('sha256').update(entries.sort().join('\n')).digest('hex');
}

// The marker comes from the template and renderer the healer itself reads, so the expected
// value cannot drift from the shipped template by restating it here.
function provenSpecMarkerValue(): string {
  const contract = loadTemplateContractForDocument('1', 'spec.md', 'spec.md');
  if (!contract.supported) throw new Error('the Level 1 spec.md contract did not resolve');
  const rendered = renderInlineGates(fs.readFileSync(contract.templatePath, 'utf8'), '1');
  const marker = rendered.match(/<!--\s*SPECKIT_TEMPLATE_SOURCE:\s*([^>]*?)\s*-->/);
  if (!marker) throw new Error('the Level 1 spec.md render declares no template-source marker');
  return marker[1].trim();
}

// The same derivation for a Level 2 phase child, whose render adds the phase addendum.
function provenLevelTwoSpecMarker(childSpec: string): string {
  const contract = loadTemplateContractForDocument('2', 'spec.md', childSpec);
  if (!contract.supported) throw new Error('the Level 2 spec.md contract did not resolve');
  const rendered = renderInlineGates(fs.readFileSync(contract.templatePath, 'utf8'), '2');
  const marker = rendered.match(/<!--\s*SPECKIT_TEMPLATE_SOURCE:\s*([^>]*?)\s*-->/);
  if (!marker) throw new Error('the Level 2 spec.md render declares no template-source marker');
  return marker[1].trim();
}

// A current phase child exercises both anchor shapes at once: the scaffold writes a
// measured-behavior block nested inside the problem section and a phase-context block from
// the phase addendum, and no H2 heading makes either of them a mandatory section anchor.
// The scaffold builds it, so the fixture cannot drift from what an operator receives.
function scaffoldPhaseChildSpec(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'refresh-marker-phase-'));
  tempRoots.push(root);
  execFileSync('git', ['init', '-q'], { cwd: root });
  const scaffold = spawnSync(
    'bash',
    [
      path.join(skillRoot, 'runtime/cli/spec/create.sh'),
      '--phase',
      '--level',
      '2',
      '--phases',
      '1',
      '--phase-names',
      'alpha',
      '--short-name',
      'phase-marker-probe',
      '--skip-branch',
      'Phase marker probe',
    ],
    { cwd: root, encoding: 'utf8' },
  );
  expect(scaffold.status, scaffold.stdout + scaffold.stderr).toBe(0);

  const track = fs.readdirSync(path.join(root, 'specs'), { withFileTypes: true });
  const packet = track.find((entry) => entry.isDirectory() && /^\d{3}-/.test(entry.name));
  if (!packet) throw new Error('the scaffold created no packet folder');
  const phases = fs.readdirSync(path.join(root, 'specs', packet.name), { withFileTypes: true });
  const child = phases.find((entry) => entry.isDirectory() && /^\d{3}-/.test(entry.name));
  if (!child) throw new Error('the scaffold created no phase child folder');
  return path.join(root, 'specs', packet.name, child.name, 'spec.md');
}

// The build record that proves the copied dist fresh is keyed by an absolute path, so a
// copy is judged by mtimes; its dist was built from these sources, so the copy is
// re-stamped to look built from its own tree.
function refreshCopiedDistMtimes(): void {
  const now = new Date();
  const touchDist = (dir: string): void => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      if (item.name === 'node_modules') continue;
      const abs = path.join(dir, item.name);
      if (item.isDirectory()) touchDist(abs);
      else if (item.isFile() && abs.includes('/dist/')) fs.utimesSync(abs, now, now);
    }
  };
  touchDist(path.join(copy, 'runtime'));
}

beforeAll(() => {
  sandbox = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'refresh-markers-')));
  copy = path.join(sandbox, '.skilled/skills/system-spec-kit');
  fs.cpSync(skillRoot, copy, { recursive: true, filter: (src) => path.basename(src) !== 'node_modules' });

  // node_modules stays out of the copy and is linked back in at its real location: it is
  // large and identical, and the copied runtime resolves its dependencies through the same
  // relative paths.
  for (const relative of ['node_modules', 'runtime/node_modules', 'runtime/cli/node_modules']) {
    const source = path.join(skillRoot, relative);
    if (fs.existsSync(source)) fs.symlinkSync(source, path.join(copy, relative), 'dir');
  }
  // A hoisted install gives runtime/ no node_modules of its own, and the freshness check
  // then calls it unprovisioned and never reports it stale. An empty folder counts as
  // provisioned, and resolution still walks up.
  fs.mkdirSync(path.join(copy, 'runtime/node_modules'), { recursive: true });
  // The validator reads the shared frontmatter list and the citation resolver from sk-doc,
  // and a missing sibling turns those two checks from passes into errors. A link keeps the
  // copied tree reading the same rules this checkout reads.
  fs.symlinkSync(path.join(repoRoot, '.skilled/skills/sk-doc'), path.join(sandbox, '.skilled/skills/sk-doc'), 'dir');
  refreshCopiedDistMtimes();

  // Packets stay out of git, so a run always starts from a clean tree and needs no
  // reversibility manifest before it may write.
  fs.mkdirSync(path.join(sandbox, 'specs'), { recursive: true });
  fs.writeFileSync(path.join(sandbox, '.gitignore'), 'specs/\n');
  execFileSync('git', ['init', '-q'], { cwd: sandbox });
  execFileSync('git', ['-c', 'user.name=Refresh Markers Test', '-c', 'user.email=refresh-markers@test.invalid', 'add', '-A'], { cwd: sandbox });
  execFileSync(
    'git',
    ['-c', 'user.name=Refresh Markers Test', '-c', 'user.email=refresh-markers@test.invalid', 'commit', '-q', '-m', 'test repository baseline'],
    { cwd: sandbox },
  );
}, 180_000);

afterAll(() => {
  if (sandbox) fs.rmSync(sandbox, { recursive: true, force: true });
  for (const root of tempRoots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function resetTrack(): void {
  fs.rmSync(path.join(sandbox, TRACK), { recursive: true, force: true });
}

// A packet the strict validator accepts while its spec.md still carries a marker from
// before the current template version. The fixture names the folder it was rendered in, so
// that identity is re-pointed first and the repair tool fills in whatever the move
// changed: a stale pointer is an error the validator reports, not a difference the marker
// refresh is about.
function writeLegacyMarkerPacket(name: string, extraAnchorOnPlan = false): string {
  const folder = path.join(sandbox, TRACK, name);
  fs.mkdirSync(folder, { recursive: true });
  fs.cpSync(path.join(copy, FIXTURE), folder, { recursive: true });

  const graphFile = path.join(folder, 'graph-metadata.json');
  const graph = JSON.parse(fs.readFileSync(graphFile, 'utf8')) as Record<string, unknown>;
  graph.parent_id = 'refresh-track';
  graph.parent_id_review_required = false;
  fs.writeFileSync(graphFile, `${JSON.stringify(graph, null, 2)}\n`);

  const specFile = path.join(folder, 'spec.md');
  fs.writeFileSync(
    specFile,
    fs.readFileSync(specFile, 'utf8').replace(/<!--\s*SPECKIT_TEMPLATE_SOURCE:[^>]*-->/, LEGACY_SPEC_MARKER),
  );

  if (extraAnchorOnPlan) {
    const planFile = path.join(folder, 'plan.md');
    fs.writeFileSync(
      planFile,
      fs.readFileSync(planFile, 'utf8').replace('<!-- ANCHOR:phases -->', `${EXTRA_ANCHOR}\n\n<!-- ANCHOR:phases -->`),
    );
  }

  const derived = derive(folder);
  expect(derived.status, derived.stdout + derived.stderr).toBe(0);

  const strict = validate(folder);
  expect(strict.stdout, strict.stdout + strict.stderr).toContain('RESULT: PASSED');
  return folder;
}

describe('upgrade-legacy --refresh-markers', () => {
  it('lists a legacy marker in a dry run and moves it only under apply', { timeout: 180_000 }, () => {
    resetTrack();
    const packet = writeLegacyMarkerPacket('001-legacy-marker');
    const specFile = path.join(packet, 'spec.md');
    const before = digestTree(packet);
    const proven = provenSpecMarkerValue();

    const dry = runUpgrade(['--refresh-markers', '--roots', TRACK]);

    expect(dry.status, dry.stdout + dry.stderr).toBe(1);
    expect(dry.stdout).toContain(
      `would refresh ${TRACK}/001-legacy-marker/spec.md: moved the template source from spec | v1.0 to ${proven}, proven by its exact anchors`,
    );
    expect(dry.stdout).toMatch(/refresh-markers packets=1 documents refreshed=\d+ refused=\d+ reverted=0/);
    expect(digestTree(packet), 'a dry run must write nothing').toBe(before);

    const applied = runUpgrade(['--refresh-markers', '--roots', TRACK, '--apply']);

    expect(applied.status, applied.stdout + applied.stderr).toBe(0);
    expect(applied.stdout).toContain('reverted=0');
    expect(fs.readFileSync(specFile, 'utf8')).toContain(`<!-- SPECKIT_TEMPLATE_SOURCE: ${proven} -->`);
    expect(fs.readFileSync(specFile, 'utf8')).not.toContain(LEGACY_SPEC_MARKER);

    const strict = validate(packet);
    expect(strict.stdout, strict.stdout + strict.stderr).toContain('RESULT: PASSED');
  });

  it('refuses a document whose anchors do not prove the current marker', { timeout: 180_000 }, () => {
    resetTrack();
    const packet = writeLegacyMarkerPacket('001-anchor-mismatch', true);
    const planFile = path.join(packet, 'plan.md');
    const planBefore = fs.readFileSync(planFile);

    const applied = runUpgrade(['--refresh-markers', '--roots', TRACK, '--apply']);

    expect(applied.status, applied.stdout + applied.stderr).toBe(0);
    expect(applied.stdout).toContain(`refused ${TRACK}/001-anchor-mismatch/plan.md: plan.md: carries`);
    expect(applied.stdout).toContain('invented-extra');
    // The refusal covers one document; the other lane documents still refresh, so the run
    // did work and the packet's own plan.md is the only file whose bytes may not move.
    expect(applied.stdout).toContain(`refreshed ${TRACK}/001-anchor-mismatch/spec.md:`);
    expect(applied.stdout).toMatch(/reverted=0/);
    expect(fs.readFileSync(planFile).equals(planBefore), 'a refused document keeps every byte').toBe(true);

    const strict = validate(packet);
    expect(strict.stdout, strict.stdout + strict.stderr).toContain('RESULT: PASSED');
  });
});

describe('refreshMarker', () => {
  it('leaves a document that carries no marker unchanged', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'refresh-marker-unit-'));
    tempRoots.push(root);
    const file = path.join(root, 'plan.md');
    const text = '---\ntitle: "Probe"\ndescription: "Marker unit fixture."\n---\n# Probe\n\nNo template source recorded.\n';
    fs.writeFileSync(file, text);

    const result = refreshMarker(text, file);

    expect(result).toEqual({ text, changed: false, actions: [], refusals: [] });
    expect(fs.readFileSync(file, 'utf8')).toBe(text);
  });

  it('moves a stale marker on a current phase child', () => {
    const file = scaffoldPhaseChildSpec();
    const legacy = fs
      .readFileSync(file, 'utf8')
      .replace(/<!--\s*SPECKIT_TEMPLATE_SOURCE:[^>]*-->/, '<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->');
    fs.writeFileSync(file, legacy);

    const result = refreshMarker(legacy, file);

    expect(result.refusals).toEqual([]);
    expect(result.changed).toBe(true);
    expect(result.text).toContain(`<!-- SPECKIT_TEMPLATE_SOURCE: ${provenLevelTwoSpecMarker(file)} -->`);
    expect(result.text).not.toContain('spec-core | v2.2');
  });

  it('leaves a current phase child at its own marker untouched', () => {
    const file = scaffoldPhaseChildSpec();
    const text = fs.readFileSync(file, 'utf8');

    const result = refreshMarker(text, file);

    expect(result).toEqual({ text, changed: false, actions: [], refusals: [] });
  });

  it('refuses a foreign anchor on a stale marker but not on a current one', () => {
    const file = scaffoldPhaseChildSpec();
    const scaffolded = fs.readFileSync(file, 'utf8');
    const withExtra = scaffolded.replace(
      '<!-- ANCHOR:metadata -->',
      `${EXTRA_ANCHOR}\n\n<!-- ANCHOR:metadata -->`,
    );

    const current = refreshMarker(withExtra, file);
    expect(current.refusals).toEqual([]);
    expect(current.changed).toBe(false);

    const stale = withExtra.replace(
      /<!--\s*SPECKIT_TEMPLATE_SOURCE:[^>]*-->/,
      '<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->',
    );
    const refused = refreshMarker(stale, file);
    expect(refused.refusals).toEqual([
      `spec.md: carries invented-extra beyond the anchors rendered for Level 2, so it cannot be called ${provenLevelTwoSpecMarker(file)}`,
    ]);
    expect(refused.changed).toBe(false);
    expect(refused.text).toBe(stale);
  });
});
