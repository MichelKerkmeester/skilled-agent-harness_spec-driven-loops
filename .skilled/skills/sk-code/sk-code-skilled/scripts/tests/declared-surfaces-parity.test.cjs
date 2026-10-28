// ───────────────────────────────────────────────────────────────────
// MODULE: Declared-surface reader parity
// ───────────────────────────────────────────────────────────────────
'use strict';

// The hub's surface declarations are read by two independent copies, one in the replay
// library and one inside the advisor plugin. A declaration one reader picks up and the
// other misses moves detection onto a different surface than the replay predicts, and
// nothing else compares the two. This test pins their agreement on the live hub and on a
// throwaway hub built here, so a reader that ignored the folder it was given cannot pass.
//
// The plugin exports only its default hook, so its reader is taken from the plugin source
// and evaluated unchanged. Calling the shipped text keeps the test honest about the copy
// that runs in production without asking the plugin to widen its public surface.
// Run from the repository root:
//   node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/declared-surfaces-parity.test.cjs

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');

const HUB_SKILL_ROOT = path.resolve(__dirname, '..', '..', '..');
const SKILLED_ROOT = path.resolve(HUB_SKILL_ROOT, '..', '..');
const REPLAY_LIB = path.join(HUB_SKILL_ROOT, 'sk-code-skilled', 'assets', 'scripts', 'router-replay-lib.cjs');
// The plugins are authored only in .opencode/plugins, beside .skilled and not inside it.
const PLUGIN_PATH = path.join(SKILLED_ROOT, '..', '.opencode', 'plugins', 'system-skill-advisor.js');
const PRIVATE_LINK_LIB = path.join(SKILLED_ROOT, 'skills', 'system-skill-advisor', 'runtime', 'lib', 'private-skill-target.cjs');

const { declaredSurfaces: libraryDeclaredSurfaces } = require(REPLAY_LIB);

// Returns the index just past the closing brace of the block that opens at `open`, or -1.
// Quotes and comments are skipped so a brace inside either does not move the depth.
function declarationEnd(source, open) {
  let depth = 0;
  let quote = null;
  for (let index = open; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (char === '\\') index += 1;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '\'' || char === '"' || char === '`') {
      quote = char;
      continue;
    }
    if (char === '/' && source[index + 1] === '/') {
      const newline = source.indexOf('\n', index);
      index = newline === -1 ? source.length : newline;
      continue;
    }
    if (char === '/' && source[index + 1] === '*') {
      const close = source.indexOf('*/', index + 2);
      index = close === -1 ? source.length : close + 1;
      continue;
    }
    if (char === '{') depth += 1;
    else if (char === '}') {
      depth -= 1;
      if (depth === 0) return index + 1;
    }
  }
  return -1;
}

// The declaration is copied by name rather than by line number, so an unrelated edit above
// it cannot move the window onto the wrong text.
function extractFunction(source, name) {
  const start = new RegExp(`^function ${name}\\(`, 'm').exec(source);
  assert.ok(start, `plugin source no longer declares ${name}`);
  const open = source.indexOf('{', start.index);
  const end = open === -1 ? -1 : declarationEnd(source, open);
  assert.notEqual(end, -1, `plugin source declares ${name} without a closed body`);
  return source.slice(start.index, end);
}

function extractStringConstant(source, name) {
  const match = new RegExp(`^const ${name} = ('[^'\\n]*'|"[^"\\n]*");$`, 'm').exec(source);
  assert.ok(match, `plugin source no longer declares ${name}`);
  return match[0];
}

// The plugin reader leans on three helpers and one constant from its own file, so they come
// from the same source. A hand-written stub would let the copy drift while the test passed.
// Only the module loader is supplied here, because the plugin finds that module from its own
// URL; it loads the same trusted-root module the plugin loads.
const pluginDeclaredSurfaces = (() => {
  const source = fs.readFileSync(PLUGIN_PATH, 'utf8');
  const context = vm.createContext({
    join: path.join,
    readdirSync: fs.readdirSync,
    readFileSync: fs.readFileSync,
    loadPrivateSkillTarget: () => require(PRIVATE_LINK_LIB),
  });
  vm.runInContext(
    [
      extractStringConstant(source, 'SK_CODE_HUB'),
      extractFunction(source, 'readJsonFile'),
      extractFunction(source, 'surfaceEntry'),
      extractFunction(source, 'privateSkillLinkCheck'),
      extractFunction(source, 'declaredSurfaces'),
    ].join('\n\n'),
    context,
    { filename: PLUGIN_PATH },
  );
  const reader = vm.runInContext('declaredSurfaces', context);
  assert.equal(typeof reader, 'function', 'plugin declaredSurfaces did not evaluate to a function');
  return reader;
})();

// The two readers keep different marker fields, so parity is asserted on the fields both
// produce. The arrays are rebuilt in this realm because a value made inside the vm context
// carries that context's prototypes.
function surfacePairs(entries) {
  return Array.from(entries, (entry) => `${entry.role}:${entry.label}`);
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

test('the replay library and the plugin declare the same surfaces for the live hub', () => {
  const fromLibrary = libraryDeclaredSurfaces(HUB_SKILL_ROOT);
  const fromPlugin = pluginDeclaredSurfaces(SKILLED_ROOT);

  assert.ok(fromLibrary.length > 0, 'the live hub declares no surface, so parity proves nothing');
  assert.deepEqual(surfacePairs(fromPlugin), surfacePairs(fromLibrary));
});

test('both readers follow the hub folder they are handed', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'declared-surfaces-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  writeJson(path.join(root, 'skills', 'sk-code', 'mode-registry.json'), {
    skill: 'sk-code',
    modes: [
      { packet: 'alpha', surfaceDetection: { label: 'alpha', role: 'specific', pathMarkers: ['alpha/'] } },
      { packet: 'beta', surfaceDetection: { label: 'beta', role: 'specific' } },
      { packet: 'gamma', surfaceDetection: { label: 'gamma', role: 'specific', contentMarkers: ['gamma'] } },
      { surfaceDetection: { label: 'omega', role: 'fallback', pathMarkers: ['.skilled/'] } },
    ],
  });
  writeJson(path.join(root, 'skills', 'zeta-skill', 'graph-metadata.json'), {
    skill_id: 'zeta-skill',
    family: 'sk-code',
    surface_detection: { label: 'zeta', role: 'specific', pathMarkers: ['zeta/'] },
  });

  const fromLibrary = libraryDeclaredSurfaces(path.join(root, 'skills', 'sk-code'));
  const fromPlugin = pluginDeclaredSurfaces(root);

  // Specific surfaces lead, hub entries before outside skills, and the fallback is last. A block
  // with no marker of any kind declares nothing, and one with content markers alone still counts.
  assert.deepEqual(surfacePairs(fromLibrary), ['specific:ALPHA', 'specific:GAMMA', 'specific:ZETA', 'fallback:OMEGA']);
  assert.deepEqual(surfacePairs(fromPlugin), surfacePairs(fromLibrary));
});

// A private link in the skills root counts only when its real target sits inside a trusted
// root. A link into an undeclared folder outside the tree would otherwise add a specific
// surface that outranks the fallback, so neither reader may return it, while a link into a
// declared root must still be read: a rule that failed to load would drop that one too.
test('both readers keep a trusted private link and skip one outside every trusted root', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'declared-surfaces-link-'));
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'declared-surfaces-outside-'));
  const trustedRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'declared-surfaces-trusted-'));
  const declared = process.env.SPECKIT_PRIVATE_SKILL_ROOTS;
  process.env.SPECKIT_PRIVATE_SKILL_ROOTS = trustedRoot;
  t.after(() => {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(outside, { recursive: true, force: true });
    fs.rmSync(trustedRoot, { recursive: true, force: true });
    if (declared === undefined) delete process.env.SPECKIT_PRIVATE_SKILL_ROOTS;
    else process.env.SPECKIT_PRIVATE_SKILL_ROOTS = declared;
  });

  writeJson(path.join(root, 'skills', 'sk-code', 'mode-registry.json'), {
    skill: 'sk-code',
    modes: [{ surfaceDetection: { label: 'omega', role: 'fallback', pathMarkers: ['.skilled/'] } }],
  });
  const linkedMeta = (skillId, label) => ({
    skill_id: skillId,
    family: 'sk-code',
    surface_detection: { label, role: 'specific', pathMarkers: [`${label}/`] },
  });
  writeJson(path.join(outside, 'untrusted', 'graph-metadata.json'), linkedMeta('local-untrusted', 'untrusted'));
  fs.symlinkSync(path.join(outside, 'untrusted'), path.join(root, 'skills', 'local-untrusted'), 'dir');
  writeJson(path.join(root, 'skills', 'inside', 'graph-metadata.json'), linkedMeta('local-inside', 'inside'));
  fs.symlinkSync(path.join(root, 'skills', 'inside'), path.join(root, 'skills', 'local-inside'), 'dir');
  writeJson(path.join(trustedRoot, 'declared', 'graph-metadata.json'), linkedMeta('local-declared', 'declared'));
  fs.symlinkSync(path.join(trustedRoot, 'declared'), path.join(root, 'skills', 'local-declared'), 'dir');

  const fromLibrary = libraryDeclaredSurfaces(path.join(root, 'skills', 'sk-code'));
  const fromPlugin = pluginDeclaredSurfaces(root);

  // The link that stays inside the tree is read through the link and through its own folder.
  assert.deepEqual(surfacePairs(fromLibrary), ['specific:DECLARED', 'specific:INSIDE', 'specific:INSIDE', 'fallback:OMEGA']);
  assert.deepEqual(surfacePairs(fromPlugin), surfacePairs(fromLibrary));
});
