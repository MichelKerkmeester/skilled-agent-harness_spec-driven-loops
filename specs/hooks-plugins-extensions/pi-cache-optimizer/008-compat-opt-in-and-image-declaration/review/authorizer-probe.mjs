// Asks the project's own dispatch authorizer which phrasings authorize which
// executor. Read-only: it imports the shipped gate and calls its decision fn.
// The synthetic `command` strings below are never executed; they only answer the
// gate's "is this command one direct executor" question.
import { createRequire } from 'node:module';
import { join } from 'node:path';

const EXT = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer';
const requireFromExt = createRequire(join(EXT, 'package.json'));
const { createJiti } = requireFromExt('jiti');

const jiti = createJiti(join(EXT, 'probe.mjs'), { interopDefault: false, moduleCache: false });
const mod = await jiti.import(
  '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/dispatch-preflight-lint.ts',
);
const { shouldDenyPiDispatch } = mod;

const cases = [
  ['user turn 1 (as written)', 'Use cli pi with GLM 5.3 flash max llm gateway to review what youve done'],
  ['user turn 2 (as written)', 'Also ask GPT 5.6 LUNA MAX FAST (CLI CODEX)'],
  ['hyphenated: both', 'use cli-pi and cli-codex to review'],
  ['hyphenated: pi only', 'use cli-pi to review'],
  ['hyphenated: codex only', 'use cli-codex to review'],
  ['negated pi', 'do not use cli-pi'],
];

for (const [label, text] of cases) {
  for (const skill of ['cli-pi', 'cli-codex']) {
    const denied = shouldDenyPiDispatch({
      runtime: 'pi',
      toolName: 'bash',
      command: 'THECOMMAND',
      dispatchSkill: skill,
      inspectedExecutor: skill,
      inspectionKind: 'direct',
      userText: text,
    });
    console.log(`${denied ? 'DENY ' : 'ALLOW'} ${skill.padEnd(10)} <- ${label}`);
  }
}
