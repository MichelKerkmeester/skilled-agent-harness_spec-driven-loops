#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ compiled-routing-lockstep-parity — P4 directive-surface parity coverage  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Normalized-parity fixture test for the P4 lockstep directive-surface manifest
 * (`../../references/parent-skill/compiled-routing-lockstep-surfaces.json`). Every
 * registered surface's compiled-routing directive block (see `directiveMarker`) must
 * carry byte-normalized-identical wording once the surface's own hub name is
 * substituted out.
 *
 * A surface that does not carry the directive block at all (the two create-skill
 * parent templates, until their own rendering ships) is a safe "not rendered yet"
 * state, never a violation — only surfaces that DO have a directive block and disagree
 * with each other count as drifted.
 *
 * The pass/fail assertions below run exclusively against synthetic, temp-directory
 * fixtures (never the live repo tree), so this test's outcome never depends on the
 * current state of any real SKILL.md. A separate, purely informational section at the
 * end reads the REAL manifest against the REAL repo and prints a live report — it
 * never asserts, so it cannot turn this file red over out-of-scope drift it merely
 * observes.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const MANIFEST_PATH = path.join(__dirname, '..', '..', 'references', 'parent-skill', 'compiled-routing-lockstep-surfaces.json');
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..', '..');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CORE: EXTRACT + NORMALIZE + COMPARE
// ─────────────────────────────────────────────────────────────────────────────

/** Return the directive blockquote (every contiguous `>`-prefixed line starting at
 * the marker), or null when the marker is absent — a safe "not rendered yet" state. */
function extractDirectiveBlock(content, marker) {
  const lines = content.split('\n');
  const startIdx = lines.findIndex((line) => line.includes(marker));
  if (startIdx === -1) return null;
  const blockLines = [];
  for (let i = startIdx; i < lines.length; i += 1) {
    if (!lines[i].startsWith('>')) break;
    blockLines.push(lines[i]);
  }
  return blockLines.join('\n');
}

/** Replace every literal occurrence of a surface's own hub name with the shared
 * placeholder token, so per-hub substitution is not mistaken for drift. Templates
 * (hubName null) already carry the literal placeholder in their source form. */
function normalizeDirective(block, hubName, placeholder) {
  if (!hubName) return block;
  return block.split(hubName).join(placeholder);
}

/**
 * Check every registered surface for directive-wording parity.
 *
 * @param {Array<{id:string, kind:string, hubName:string|null, path:string}>} surfaces
 * @param {{directiveMarker:string, hubNamePlaceholder:string}} config
 * @returns {{violations: Array<Object>, withDirective: Array<Object>}}
 */
function checkSurfaceParity(surfaces, { directiveMarker, hubNamePlaceholder }) {
  const violations = [];
  const withDirective = [];

  for (const surface of surfaces) {
    if (!fs.existsSync(surface.path)) {
      violations.push({
        type: 'surface_file_missing',
        id: surface.id,
        path: surface.path,
        message: `${surface.id}: registered lockstep surface does not exist: ${surface.path}`,
      });
      continue;
    }
    const content = fs.readFileSync(surface.path, 'utf8');
    const block = extractDirectiveBlock(content, directiveMarker);
    if (block === null) continue; // legacy / not-yet-rendered — safe, not a violation
    const normalized = normalizeDirective(block, surface.hubName, hubNamePlaceholder);
    withDirective.push({ ...surface, normalized });
  }

  if (withDirective.length > 1) {
    const counts = new Map();
    for (const entry of withDirective) counts.set(entry.normalized, (counts.get(entry.normalized) || 0) + 1);
    let majorityText = null;
    let majorityCount = -1;
    for (const [text, count] of counts) {
      if (count > majorityCount) { majorityText = text; majorityCount = count; }
    }
    if (counts.size > 1) {
      for (const entry of withDirective) {
        if (entry.normalized !== majorityText) {
          violations.push({
            type: 'directive_drift',
            id: entry.id,
            path: entry.path,
            message: `${entry.id}: compiled-routing directive wording differs from the other ${majorityCount} in-sync lockstep surface(s)`,
          });
        }
      }
    }
  }

  return { violations, withDirective };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

function directiveBlockText(hubToken) {
  return [
    '> **Compiled routing (opt-in, flag-gated, additive).** When `SPECKIT_COMPILED_ROUTING=1`, resolve the mode via the compiled router contract first:',
    '> ```bash',
    `> node .opencode/bin/compiled-route.cjs --hub ${hubToken} --prompt "<task>"`,
    '> ```',
    '> Follow the returned decision — `route` (use its `targets`), `clarify`/`defer` (disambiguate), `reject` (refuse). '
      + 'On a `{"servingAuthority":"legacy"}` sentinel or any error, use the routing below. The front door self-gates on '
      + `serving-authority, and the flag is **off by default**, so this is inert until compiled routing is activated for \`${hubToken}\`.`,
  ].join('\n');
}

function surfaceFileContent(hubToken) {
  return `# Fixture Hub\n\n## 2. SMART ROUTING\n\nSome routing prose.\n\n${directiveBlockText(hubToken)}\n\n### The discriminator\n`;
}

function withTempDir(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lockstep-parity-fixture-'));
  try {
    return fn(dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

const MARKER = '> **Compiled routing (opt-in, flag-gated, additive).**';
const PLACEHOLDER = '{{HUB_NAME}}';

// ─────────────────────────────────────────────────────────────────────────────
// 4. TESTS
// ─────────────────────────────────────────────────────────────────────────────

function testCleanSeededFixturePassesAcrossHubsAndTemplates() {
  withTempDir((dir) => {
    const surfaces = [];
    for (const hubName of ['fixture-hub-a', 'fixture-hub-b', 'fixture-hub-c']) {
      const filePath = path.join(dir, `${hubName}.md`);
      fs.writeFileSync(filePath, surfaceFileContent(hubName), 'utf8');
      surfaces.push({ id: `hub-skill.${hubName}`, kind: 'hub-skill', hubName, path: filePath });
    }
    // Parent templates: literal placeholder token, hubName null (no substitution needed).
    for (const templateId of ['parent-template.active-scaffold', 'parent-template.canonical']) {
      const filePath = path.join(dir, `${templateId}.md`);
      fs.writeFileSync(filePath, surfaceFileContent(PLACEHOLDER), 'utf8');
      surfaces.push({ id: templateId, kind: 'parent-template', hubName: null, path: filePath });
    }

    const { violations, withDirective } = checkSurfaceParity(surfaces, { directiveMarker: MARKER, hubNamePlaceholder: PLACEHOLDER });
    assert.deepEqual(violations, []);
    assert.equal(withDirective.length, 5);
  });
}

function testSeededDriftIsCaughtByNamingTheDriftedSurface() {
  withTempDir((dir) => {
    const surfaces = [];
    for (const hubName of ['fixture-hub-a', 'fixture-hub-b', 'fixture-hub-c']) {
      const filePath = path.join(dir, `${hubName}.md`);
      let content = surfaceFileContent(hubName);
      if (hubName === 'fixture-hub-c') {
        content = content.replace('use the routing below', 'use the registry-driven routing below');
      }
      fs.writeFileSync(filePath, content, 'utf8');
      surfaces.push({ id: `hub-skill.${hubName}`, kind: 'hub-skill', hubName, path: filePath });
    }

    const { violations } = checkSurfaceParity(surfaces, { directiveMarker: MARKER, hubNamePlaceholder: PLACEHOLDER });
    assert.equal(violations.length, 1, 'exactly the one seeded drift, not a generic diff against every surface');
    assert.equal(violations[0].type, 'directive_drift');
    assert.equal(violations[0].id, 'hub-skill.fixture-hub-c');
  });
}

function testMissingDirectiveOnATemplateIsNotAViolation() {
  withTempDir((dir) => {
    const surfaces = [];
    const rendered = path.join(dir, 'hub-with-directive.md');
    fs.writeFileSync(rendered, surfaceFileContent('hub-with-directive'), 'utf8');
    surfaces.push({ id: 'hub-skill.hub-with-directive', kind: 'hub-skill', hubName: 'hub-with-directive', path: rendered });

    const notYetRendered = path.join(dir, 'template-not-rendered.md');
    fs.writeFileSync(notYetRendered, '# Legacy scaffold\n\nNo compiled-routing directive here yet.\n', 'utf8');
    surfaces.push({ id: 'parent-template.active-scaffold', kind: 'parent-template', hubName: null, path: notYetRendered });

    const { violations, withDirective } = checkSurfaceParity(surfaces, { directiveMarker: MARKER, hubNamePlaceholder: PLACEHOLDER });
    assert.deepEqual(violations, [], 'a surface with no directive yet must fail safely, not report drift');
    assert.equal(withDirective.length, 1);
  });
}

function testMissingSurfaceFileIsAViolation() {
  withTempDir((dir) => {
    const surfaces = [{ id: 'hub-skill.ghost', kind: 'hub-skill', hubName: 'ghost', path: path.join(dir, 'does-not-exist.md') }];
    const { violations } = checkSurfaceParity(surfaces, { directiveMarker: MARKER, hubNamePlaceholder: PLACEHOLDER });
    assert.equal(violations.length, 1);
    assert.equal(violations[0].type, 'surface_file_missing');
    assert.equal(violations[0].id, 'hub-skill.ghost');
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. LIVE REPORT (informational only — never asserts, so real pre-existing or
//    partial-rollout drift on the actual 9 surfaces cannot fail this file)
// ─────────────────────────────────────────────────────────────────────────────

function reportLiveSurfaceParity() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.log(`[sk-doc] lockstep manifest not found at ${MANIFEST_PATH} — skipping live report`);
    return;
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const surfaces = manifest.surfaces.map((s) => ({ ...s, path: path.join(REPO_ROOT, s.path) }));
  const { violations, withDirective } = checkSurfaceParity(surfaces, {
    directiveMarker: manifest.directiveMarker,
    hubNamePlaceholder: manifest.hubNamePlaceholder,
  });
  console.log(`[sk-doc] live report: ${withDirective.length}/${surfaces.length} surfaces carry the directive block`);
  if (violations.length === 0) {
    console.log('[sk-doc] live report: all surfaces carrying the directive are in normalized parity');
  } else {
    console.log(`[sk-doc] live report: ${violations.length} surface(s) diverge from the majority wording (informational, not asserted):`);
    for (const v of violations) console.log(`  - ${v.message}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. RUN
// ─────────────────────────────────────────────────────────────────────────────

testCleanSeededFixturePassesAcrossHubsAndTemplates();
testSeededDriftIsCaughtByNamingTheDriftedSurface();
testMissingDirectiveOnATemplateIsNotAViolation();
testMissingSurfaceFileIsAViolation();
console.log('[sk-doc] compiled-routing-lockstep-parity fixture coverage passed');
reportLiveSurfaceParity();

module.exports = { extractDirectiveBlock, normalizeDirective, checkSurfaceParity };
