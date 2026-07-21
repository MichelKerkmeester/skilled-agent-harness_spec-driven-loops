// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Retrieval Engine Test Fixtures                                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export const STYLE_ALPHA = Object.freeze({
  id: '11111111-1111-4111-8111-111111111111',
  slug: 'alpha',
  title: 'Alpha Editorial',
  thesis: 'Warm cream editorial system with a deliberate serif role.',
  theme: 'light',
  industry: 'Editorial',
  text: 'Warm cream serif typography with measured spacing and quiet components.',
});

export const STYLE_BETA = Object.freeze({
  id: '22222222-2222-4222-8222-222222222222',
  slug: 'beta',
  title: 'Beta Product',
  thesis: 'Dark product system with kinetic motion and compact controls.',
  theme: 'dark',
  industry: 'SaaS',
  text: 'Dark sans-serif product interface with animation and motion transitions.',
});

function canonicalDocument(style) {
  return {
    source: `https://styles.example.test/${style.id}`,
    uuid: style.id,
    name: style.title,
    northStar: style.thesis,
    capturedAt: '2026-01-01T00:00:00.000Z',
    meta: { url: `https://${style.slug}.example.test` },
    screenshot: { url: `https://images.example.test/${style.slug}.jpg` },
    designSystem: {
      theme: style.theme,
      industry: style.industry,
      description: style.text,
      colors: [{ name: 'Canvas', hex: '#ffffff' }],
      typography: [{ family: style.text.includes('serif') ? 'Source Serif' : 'Inter' }],
      spacing: { sectionGap: '64px' },
      components: [{ name: 'Button' }],
      dos: ['Keep one coherent anchor.'],
      donts: ['Do not average token values.'],
      layout: 'Centered grid',
      imagery: 'Editorial photography',
    },
  };
}

function designMarkdown(style) {
  return `# ${style.title} — Style Reference\n> ${style.thesis}\n\n`
    + `## Tokens — Colors\n${style.text}\n\n`
    + '## Tokens — Typography\nSource Serif and Inter\n\n'
    + '## Tokens — Spacing & Shapes\n64px section rhythm\n\n'
    + '## Components\nButton\n';
}

/**
 * Write one complete synthetic style bundle.
 *
 * @param {string} root - Synthetic corpus root.
 * @param {Object} style - Fixture style definition.
 * @returns {Promise<void>}
 */
export async function writeFixtureStyle(root, style) {
  const styleRoot = path.join(root, style.slug);
  await mkdir(styleRoot, { recursive: true });
  await writeFile(
    path.join(styleRoot, `${style.slug}-canonical.json`),
    `${JSON.stringify(canonicalDocument(style), null, 2)}\n`,
  );
  await writeFile(path.join(styleRoot, 'DESIGN.md'), designMarkdown(style));
  await writeFile(
    path.join(styleRoot, 'source.md'),
    `# ${style.title} — source\n\n- **Style UUID:** \`${style.id}\`\n`,
  );
  await writeFile(
    path.join(styleRoot, 'design-tokens.json'),
    `${JSON.stringify({
      color: { canvas: { $value: '#ffffff', $type: 'color' } },
      spacing: { section: { $value: '64px', $type: 'dimension' } },
      typography: { body: { $value: { fontFamily: 'Inter' }, $type: 'typography' } },
    }, null, 2)}\n`,
  );
  await writeFile(path.join(styleRoot, 'css-variables.css'), ':root { --canvas: #ffffff; }\n');
  await writeFile(path.join(styleRoot, 'tailwind-v4.css'), '@theme { --color-canvas: #ffffff; }\n');
}

/**
 * Replace the synthetic crawl manifest with the supplied styles.
 *
 * @param {string} root - Synthetic corpus root.
 * @param {Object[]} styles - Fixture style definitions.
 * @returns {Promise<void>}
 */
export async function writeFixtureCrawlManifest(root, styles) {
  const records = styles.map((style) => ({
    uuid: style.id,
    url: `https://styles.example.test/${style.id}`,
    slug: style.slug,
    status: 'captured',
    capturedAt: '2026-01-01T00:00:00.000Z',
    error: null,
  }));
  await writeFile(path.join(root, '_manifest.json'), `${JSON.stringify(records, null, 2)}\n`);
}

/**
 * Create an isolated corpus with deterministic bundles and cleanup support.
 *
 * @param {Object[]} [styles] - Initial fixture styles.
 * @returns {Promise<{root:string,base:string,cleanup:Function}>} Fixture paths.
 */
export async function createFixtureCorpus(styles = [STYLE_ALPHA, STYLE_BETA]) {
  const base = await mkdtemp(path.join(os.tmpdir(), 'style-library-fixture-'));
  const root = path.join(base, 'styles');
  await mkdir(root);
  await writeFixtureCrawlManifest(root, styles);
  for (const style of styles) await writeFixtureStyle(root, style);
  return {
    root,
    base,
    cleanup: () => rm(base, { recursive: true, force: true }),
  };
}

/**
 * Mutate a fixture DESIGN.md while preserving a valid bundle.
 *
 * @param {string} root - Synthetic corpus root.
 * @param {string} slug - Style slug.
 * @param {string} text - Appended content.
 * @returns {Promise<void>}
 */
export async function appendDesignText(root, slug, text) {
  const designPath = path.join(root, slug, 'DESIGN.md');
  const current = await readFile(designPath, 'utf8');
  await writeFile(designPath, `${current}\n${text}\n`);
}

