// ───────────────────────────────────────────────────────────────────
// MODULE: Heal Provenance
// ───────────────────────────────────────────────────────────────────

import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';

import { renderInlineGates } from '../templates/inline-gate-renderer';
import { loadTemplateContractForDocument } from '../utils/template-structure.js';

const CLI_DIR = path.resolve(__dirname, '..');
const CHECK_TEMPLATE_STALENESS = path.join(CLI_DIR, 'spec', 'check-template-staleness.sh');
const QUALITY_AUDIT = path.join(CLI_DIR, 'spec', 'quality-audit.sh');
const HEAL_SPEC_DOCS = path.join(CLI_DIR, 'spec', 'heal-spec-docs.cjs');

// A retired write flag must refuse before discovery, and a provenance stamp
// must land only where the document's own anchors exactly match the level's
// render. Both leave behind a fixture whose digest proves which happened.
const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function makeRoot(): string {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'heal-provenance-')));
  roots.push(root);
  return root;
}

// Relative path plus content digest for every file under the root, sorted, so
// any write — created, changed or deleted — shows up as a different digest.
function manifest(root: string): string {
  const entries: string[] = [];
  const walk = (dir: string): void => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, item.name);
      if (item.isDirectory()) {
        walk(abs);
      } else {
        const digest = crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');
        entries.push(`${path.relative(root, abs).split(path.sep).join('/')} ${digest}`);
      }
    }
  };
  walk(root);
  return crypto.createHash('sha256').update(entries.sort().join('\n')).digest('hex');
}

function writeProbePacket(root: string): void {
  const packet = path.join(root, 'specs', 'heal-track', '001-stale-probe');
  fs.mkdirSync(packet, { recursive: true });
  fs.writeFileSync(path.join(packet, 'spec.md'), '# Stale probe\n\nNo template source recorded.\n');
  // The plan carries an old marker so the unchanged-file assertion proves a
  // version bump did not happen, rather than only that no file was created.
  fs.writeFileSync(
    path.join(packet, 'plan.md'),
    '# Plan\n\n<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v1.0 -->\n\nAnchors not yet checked.\n',
  );
}

// The anchor set and the marker come from the contract and renderer the healer
// itself reads, so the fixtures cannot drift from the template by restating
// either value.
function levelTwoPlanContract() {
  const contract = loadTemplateContractForDocument('2', 'plan.md', 'plan.md');
  if (!contract.supported) throw new Error('Level 2 plan.md contract did not resolve');
  return contract;
}

function levelTwoPlanAnchors(): string[] {
  const contract = levelTwoPlanContract();
  return [...contract.requiredAnchors, ...(contract.optionalAnchors || [])];
}

function levelTwoPlanMarker(): string {
  const rendered = renderInlineGates(fs.readFileSync(levelTwoPlanContract().templatePath, 'utf8'), '2');
  const marker = rendered.match(/<!--\s*SPECKIT_TEMPLATE_SOURCE:\s*([^>]*?)\s*-->/);
  if (!marker) throw new Error('Level 2 plan.md render declares no template-source marker');
  return marker[1].trim();
}

function writePacket(
  root: string,
  name: string,
  level: string | null,
  anchors: string[],
  levelInFrontmatter = false,
): string {
  const packet = path.join(root, name);
  fs.mkdirSync(packet, { recursive: true });
  const levelLine = level === null || levelInFrontmatter ? '' : `\n<!-- SPECKIT_LEVEL: ${level} -->\n`;
  const levelYaml = level !== null && levelInFrontmatter ? `level: ${level}\n` : '';
  fs.writeFileSync(
    path.join(packet, 'spec.md'),
    `---\ntitle: "Heal probe"\ndescription: "Provenance healing fixture."\n${levelYaml}---\n# Heal probe\n${levelLine}`,
  );
  fs.writeFileSync(
    path.join(packet, 'plan.md'),
    [
      '---',
      'title: "Heal probe plan"',
      'description: "Provenance healing fixture plan."',
      '---',
      '',
      ...anchors.map((anchor) => `<!-- ANCHOR:${anchor} -->`),
      '',
    ].join('\n'),
  );
  return packet;
}

describe('retired write flags', () => {
  it('check-template-staleness.sh refuses --auto-upgrade before any work', () => {
    const root = makeRoot();
    writeProbePacket(root);
    const before = manifest(root);

    const result = spawnSync('bash', [CHECK_TEMPLATE_STALENESS, '--root', root, '--auto-upgrade'], {
      encoding: 'utf8',
    });

    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stderr).toContain('removed, use upgrade-legacy');
    expect(manifest(root)).toBe(before);
  });

  it('quality-audit.sh refuses --fix before any work', () => {
    const root = makeRoot();
    writeProbePacket(root);
    const before = manifest(root);

    const result = spawnSync('bash', [QUALITY_AUDIT, '--root', root, '--fix'], { encoding: 'utf8' });

    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stderr).toContain('removed, use upgrade-legacy');
    expect(manifest(root)).toBe(before);
  });
});

describe('heal-spec-docs provenance stamp', () => {
  it('stamps an exact-anchor plan and leaves superset, subset and level-less plans alone', () => {
    const root = makeRoot();
    const anchors = levelTwoPlanAnchors();
    const exact = writePacket(root, '001-exact-plan', '2', anchors);
    const superset = writePacket(root, '002-superset-plan', '2', [...anchors, 'invented-extra']);
    const subset = writePacket(root, '003-subset-plan', '2', anchors.slice(1));
    const levelLess = writePacket(root, '004-level-less-plan', null, anchors);

    const exactPlan = path.join(exact, 'plan.md');
    const original = fs.readFileSync(exactPlan, 'utf8');
    const refusals = {
      superset: fs.readFileSync(path.join(superset, 'plan.md')),
      subset: fs.readFileSync(path.join(subset, 'plan.md')),
      levelLess: fs.readFileSync(path.join(levelLess, 'plan.md')),
    };

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--roots', root, '--apply'], {
      encoding: 'utf8',
    });

    expect(result.status, result.stdout + result.stderr).toBe(0);
    // Every fixture packet was discovered and exactly one document was healed;
    // the refusals below are decisions, not missing files.
    expect(result.stdout).toContain('packets=4 documents healed=1');

    const stamp = `<!-- SPECKIT_TEMPLATE_SOURCE: ${levelTwoPlanMarker()} -->`;
    const healed = fs.readFileSync(exactPlan, 'utf8');
    expect(healed).toContain(stamp);
    // Removing the stamp restores the original byte for byte, so the stamp is
    // the only edit the healer made.
    expect(healed.replace(`${stamp}\n`, '')).toBe(original);

    expect(result.stdout).toContain('carries invented-extra beyond the anchors rendered for Level 2');
    expect(result.stdout).toContain(`does not carry ${anchors[0]}, so it cannot be called`);
    expect(result.stdout).toContain('no level is recorded in spec.md');

    expect(fs.readFileSync(path.join(superset, 'plan.md')).equals(refusals.superset)).toBe(true);
    expect(fs.readFileSync(path.join(subset, 'plan.md')).equals(refusals.subset)).toBe(true);
    expect(fs.readFileSync(path.join(levelLess, 'plan.md')).equals(refusals.levelLess)).toBe(true);
  });

  it('stamps an exact-anchor plan when spec.md declares its level only in frontmatter', () => {
    const root = makeRoot();
    const anchors = levelTwoPlanAnchors();
    const packet = writePacket(root, '001-frontmatter-level-plan', '2', anchors, true);

    const plan = path.join(packet, 'plan.md');
    const original = fs.readFileSync(plan, 'utf8');

    const result = spawnSync(process.execPath, [HEAL_SPEC_DOCS, '--roots', root, '--apply'], {
      encoding: 'utf8',
    });

    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout).toContain('packets=1 documents healed=1');

    const stamp = `<!-- SPECKIT_TEMPLATE_SOURCE: ${levelTwoPlanMarker()} -->`;
    const healed = fs.readFileSync(plan, 'utf8');
    expect(healed).toContain(stamp);
    // A frontmatter-only level still counts as recorded, so the stamp lands and
    // removing it restores the original byte for byte.
    expect(healed.replace(`${stamp}\n`, '')).toBe(original);
  });
});
