// ───────────────────────────────────────────────────────────────────
// MODULE: Machine Router Resolver tests
// ───────────────────────────────────────────────────────────────────
// The resolver is the one place that decides which document holds a skill's machine router, so
// these cases are the whole contract: a declaration in ROUTER.md, a declaration in SKILL.md, a
// default-resource-only declaration, a fenced sample of the heading, two declarations, and none.
// Each case builds a throwaway skill root, so the verdict is read from files the case wrote
// rather than from the live tree.
// Run from the repository root:
//   node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-file-resolver.test.cjs

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const RESOLVER = path.resolve(__dirname, '..', '..', 'assets', 'scripts', 'router-file-resolver.cjs');
const { resolveMachineRouter, MACHINE_ROUTER_HEADING_RE, DECLARATION_RE } = require(RESOLVER);

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function skillRoot(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'router-resolver-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

// A skill that documents the router shape in a fenced sample before it has a router of its own.
function fencedSample(fence) {
  return [
    '# demo',
    '',
    'A machine-router section looks like this:',
    '',
    `${fence}markdown`,
    '## 4. MACHINE ROUTER',
    '',
    'RESOURCE_MAP = {',
    '  "DEMO": ["references/demo.md"],',
    '}',
    fence,
    '',
    'Nothing is routed yet.',
    '',
  ].join('\n');
}

test('a declaration in ROUTER.md is the router, even while SKILL.md is still in hand', (t) => {
  const root = skillRoot(t);
  const skillText = '# demo\n\nRead ./ROUTER.md before selecting resources.\n';
  const routerText = [
    '## 4. MACHINE ROUTER',
    '',
    'INTENT_SIGNALS = {',
    '  "DEMO": {"weight": 2, "keywords": ["demo"]},',
    '}',
    'RESOURCE_MAP = {',
    '  "DEMO": ["references/demo.md"],',
    '}',
    '',
  ].join('\n');
  write(path.join(root, 'SKILL.md'), skillText);
  write(path.join(root, 'ROUTER.md'), routerText);

  // The caller's SKILL.md text declares nothing of its own, and the verdict must not fall back
  // to it just because the caller had it.
  const result = resolveMachineRouter({ skillRoot: root, skillMdText: skillText });
  assert.equal(result.verdict, 'router-md');
  assert.equal(result.source, path.join(root, 'ROUTER.md'));
  assert.equal(result.text, routerText);
});

test('a declaration in SKILL.md is the router when the skill has no ROUTER.md', (t) => {
  const root = skillRoot(t);
  const skillText = [
    '# demo',
    '',
    'The routing detail follows.',
    '',
    '## 10. MACHINE ROUTER',
    '',
    'RESOURCE_MAP = {',
    '  "DEMO": ["references/demo.md"],',
    '}',
    '',
  ].join('\n');
  write(path.join(root, 'SKILL.md'), skillText);

  const result = resolveMachineRouter({ skillRoot: root });
  assert.equal(result.verdict, 'skill-md');
  assert.equal(result.source, path.join(root, 'SKILL.md'));
  // The section, not the file: the prose above the heading stays where it was.
  assert.equal(result.text, skillText.slice(skillText.indexOf('## 10. MACHINE ROUTER')));
});

test('two declarations are a verdict of their own, with no document to parse', (t) => {
  const root = skillRoot(t);
  write(path.join(root, 'SKILL.md'), '## MACHINE ROUTER\n\nRESOURCE_MAP = {\n  "DEMO": ["references/skill.md"],\n}\n');
  write(path.join(root, 'ROUTER.md'), '## MACHINE ROUTER\n\nRESOURCE_MAP = {\n  "DEMO": ["references/router.md"],\n}\n');

  const result = resolveMachineRouter({ skillRoot: root });
  assert.equal(result.verdict, 'dual-declaration');
  assert.equal(result.source, null, 'a dual declaration must not name one document over the other');
  assert.equal(result.text, null, 'a dual declaration must hand back no section to parse');
});

test('a document with no machine-router heading declares nothing', (t) => {
  const root = skillRoot(t);
  // The hub shape: assignments under a stage-two heading. It is a router, but not THIS router,
  // and reading it here would route every hub from its stage-two map.
  const hubRouter = '## 3. MACHINE-READABLE ROUTER (replay / benchmark source)\n\nRESOURCE_MAP = {\n  "DEMO": ["references/demo.md"],\n}\n';
  write(path.join(root, 'SKILL.md'), 'RESOURCE_MAP = {\n  "DEMO": ["references/demo.md"],\n}\n');
  write(path.join(root, 'ROUTER.md'), hubRouter);

  const result = resolveMachineRouter({ skillRoot: root });
  assert.equal(result.verdict, 'none');
  assert.equal(result.source, null);
  assert.equal(result.text, null);
  assert.equal(MACHINE_ROUTER_HEADING_RE.test(hubRouter), false, 'the hub heading must stay outside the grammar');
  assert.equal(MACHINE_ROUTER_HEADING_RE.test('## MACHINE ROUTER\n'), true);
  // A heading with prose under it is a section about the router, not a declaration of one.
  assert.equal(DECLARATION_RE.test('## MACHINE ROUTER\n\nProse about routing.\n'), false);
});

test('a section that declares only a default resource is still a declaration', (t) => {
  const root = skillRoot(t);
  // A mode can select no intent and route every request through one always-loaded preamble doc.
  // That default is the whole router it declares, so the section carrying it is the router.
  const skillText = [
    '# demo',
    '',
    '## 6. MACHINE ROUTER',
    '',
    'DEFAULT_RESOURCE = "references/README.md"',
    '',
  ].join('\n');
  write(path.join(root, 'SKILL.md'), skillText);

  const result = resolveMachineRouter({ skillRoot: root });
  assert.equal(result.verdict, 'skill-md');
  assert.equal(result.source, path.join(root, 'SKILL.md'));
  assert.equal(result.text, skillText.slice(skillText.indexOf('## 6. MACHINE ROUTER')));
  assert.equal(DECLARATION_RE.test('## MACHINE ROUTER\n\nDEFAULT_RESOURCES = [\n  "references/README.md",\n]\n'), true);
});

test('a heading inside a fenced sample is an example, not a section', (t) => {
  const root = skillRoot(t);
  // The sample shows the grammar a router file takes. Parsing from it would hand a reader the
  // sample in place of a section, and a real heading below it would never be reached.
  for (const fence of ['```', '~~~']) {
    write(path.join(root, 'SKILL.md'), fencedSample(fence));
    const sampled = resolveMachineRouter({ skillRoot: root });
    assert.equal(sampled.verdict, 'none', `a ${fence} sample must declare nothing`);
    assert.equal(sampled.source, null);
    assert.equal(sampled.text, null);
  }

  const realHeading = '## MACHINE ROUTER\n\nRESOURCE_MAP = {\n  "DEMO": ["references/real.md"],\n}\n';
  write(path.join(root, 'SKILL.md'), fencedSample('```') + realHeading);

  const resolved = resolveMachineRouter({ skillRoot: root });
  assert.equal(resolved.verdict, 'skill-md');
  assert.equal(resolved.text, realHeading, 'the section starts at the first heading outside the sample');
});

test('a Unicode line separator does not start a heading line', (t) => {
  const root = skillRoot(t);
  // The Python dead-route scan splits on newline alone, so a heading that follows a line
  // separator on the same line is no heading there, and the two readers must agree.
  write(path.join(root, 'SKILL.md'), 'x ## MACHINE ROUTER\nINTENT_SIGNALS = {}\n');
  assert.equal(resolveMachineRouter({ skillRoot: root }).verdict, 'none');
});
