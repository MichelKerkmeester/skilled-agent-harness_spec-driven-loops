// Run from the repository root:
//   node --import ./.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs <this file>
// Prints, for each prompt, the problem cue the doctor hand-off reads, the command
// /doctor:helper's own ranker puts first and its rank score. The first block holds
// ordinary app problems that share doctor vocabulary, the second holds problems with
// this toolkit. Reads files only.
import { resolve } from 'node:path';

const handoff = await import(resolve('.skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts'));
const attach = await import(resolve('.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts'));
const root = process.cwd();

const blocks: Record<string, string[]> = {
  'app problem': [
    'the environment variable for the database url is missing in production',
    'the install step in our dockerfile is broken, the overlay filesystem is stale',
    'the mcp tool call fails with a wrong argument error in my weather server code',
    'turn off the dark mode toggle in the settings page',
    'the login button is not working on the checkout page',
    'our ci pipeline is failing on the lint step for the payments service',
  ],
  'toolkit problem': [
    'my skilled hooks are not showing up',
    'the skill advisor is not firing in codex',
    'the runtime mirrors are out of sync with .skilled',
    'code mode is not registered in opencode',
    'my deep research loop never converges, dont touch anything just tell me why',
    'the trigger index lookup returns nothing for my packet, do not change anything',
    'AGENTS.md is missing the shipped sections',
    'the symlink to the skilled checkout is broken',
  ],
};

for (const [label, prompts] of Object.entries(blocks)) {
  console.log(`# ${label}`);
  for (const prompt of prompts) {
    const cue = handoff.doctorProblemCue(prompt);
    const match = handoff.matchDoctorProblem(prompt, root);
    const noEdit = attach.isNoEditRequest(prompt);
    console.log(`cue=${cue ?? 'none'} first=${match?.runnable ?? '-'} score=${match?.score ?? '-'} noEdit=${noEdit} :: ${prompt}`);
  }
}
