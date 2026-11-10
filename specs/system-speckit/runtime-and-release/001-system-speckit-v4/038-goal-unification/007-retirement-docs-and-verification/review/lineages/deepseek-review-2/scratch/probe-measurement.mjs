// Fixture probe: does the runtime extractor and the validator's goal-budget
// measurement agree on the same goal document?
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const { extractGoalDurableSlice } = await import(`${ROOT}/.opencode/skills/system-spec-kit/runtime/dist/lib/validation/spec-doc-structure.js`);
const slice = require(`${ROOT}/.opencode/hooks/goal/lib/goal-slice.cjs`);

const frontmatter = ['--- ', 'title: "Goal: probe"', '_memory:', '  continuity:', '    session_dedup:', '      session_id: SECRET-SESSION', '---'].join('\n');
const body = ['# Goal: probe', '', '<!-- ANCHOR:directive -->', 'Objective: probe the measurement.', '<!-- /ANCHOR:directive -->', ''].join('\n');
const filler = "x".repeat(3800);
const doc = `${frontmatter}\n${body}${filler}\n<!-- ANCHOR:log -->\n| Item | State |\n|---|---|\n<!-- /ANCHOR:log -->\n`;

const runtime = slice.extractDurableSlice(doc);
const validator = extractGoalDurableSlice(doc);
console.log(JSON.stringify({
  runtimeChars: runtime.length,
  validatorChars: validator.length,
  delta: validator.length - runtime.length,
  runtimeTier: runtime.length > 4000 ? 'over' : runtime.length > 3000 ? 'warn' : 'ok',
  validatorTier: validator.length > 4000 ? 'over' : validator.length > 3000 ? 'warn' : 'ok',
  validatorSliceStartsWithFrontmatter: validator.includes('SECRET-SESSION'),
  runtimeSliceHasSecret: runtime.includes('SECRET-SESSION'),
  exactFenceAgrees: (() => {
    const same = doc.replace('--- \ntitle', '---\ntitle');
    return slice.extractDurableSlice(same).length === extractGoalDurableSlice(same).length;
  })(),
}, null, 2));
