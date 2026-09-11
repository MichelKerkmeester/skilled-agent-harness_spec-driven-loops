'use strict';
// Probe: the runtime extractor and the validator's goal extractor over one input matrix,
// plus the boundary agreement between the validator's goal slice and its general
// frontmatter parser.
const REPO = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const slice = require(`${REPO}/.opencode/hooks/goal/lib/goal-slice.cjs`);
const validator = require(`${REPO}/.opencode/skills/system-spec-kit/runtime/dist/lib/validation/spec-doc-structure.js`);

const BASE = [
  '---',
  'title: "fixture"',
  '_memory:',
  '  continuity:',
  '    packet_pointer: "fixture"',
  '---',
  '<!-- ANCHOR:directive -->',
  '## 1. DIRECTIVE',
  '',
  'Body text that is measured.',
  '',
  '<!-- /ANCHOR:directive -->',
  '',
  '<!-- ANCHOR:log -->',
  '## 2. LOG',
  '',
  '| Item | State | Evidence |',
  '|------|-------|----------|',
  '| seed | Done | fixture |',
  '',
].join('\n');

const cases = {
  exact: BASE,
  'trailing-space-opener': BASE.replace(/^---\n/, '---  \n'),
  'trailing-tab-closer': BASE.replace(/\n---\n<!-- ANCHOR:directive/, '\n---\t\n<!-- ANCHOR:directive'),
  'both-tolerant': BASE.replace(/^---\n/, '--- \t\n').replace(/\n---\n<!-- ANCHOR:directive/, '\n---  \n<!-- ANCHOR:directive'),
  'cr-only': BASE.replace(/\n/g, '\r'),
  'crlf': BASE.replace(/\n/g, '\r\n'),
  'bom+comment': `\uFEFF<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->\n${BASE}`,
  'unclosed-opener': `---\ntitle: "fixture"\n<!-- ANCHOR:directive -->\nbody\n`,
  'no-frontmatter': '<!-- ANCHOR:directive -->\nbody\n<!-- ANCHOR:log -->\n| a | b | c |\n',
  'spaced-opener-only': BASE.replace(/^---\n/, '---  \n') + '\n',
};

let mismatches = 0;
for (const [name, content] of Object.entries(cases)) {
  const runtime = slice.extractDurableSlice(content);
  const validatorSlice = validator.extractGoalDurableSlice(content);
  const same = runtime === validatorSlice;
  if (!same) mismatches += 1;
  const fm = validator.__testFrontmatter ? validator.__testFrontmatter(content) : null;
  console.log(
    `${name.padEnd(22)} same=${String(same).padEnd(5)} runtimeLen=${String(runtime.length).padStart(4)} validatorLen=${String(validatorSlice.length).padStart(4)}`
    + (same ? '' : ` RUNTIME_HEAD=${JSON.stringify(runtime.slice(0, 40))} VALIDATOR_HEAD=${JSON.stringify(validatorSlice.slice(0, 40))}`),
  );
  if (fm !== null) console.log(`${' '.repeat(22)} generalFrontmatter=${JSON.stringify(fm)}`);
}
console.log('MISMATCHES', mismatches, 'of', Object.keys(cases).length);
console.log('VALIDATOR_EXPORTS', Object.keys(validator).filter((key) => /goal|front|extract/i.test(key)).join(','));
