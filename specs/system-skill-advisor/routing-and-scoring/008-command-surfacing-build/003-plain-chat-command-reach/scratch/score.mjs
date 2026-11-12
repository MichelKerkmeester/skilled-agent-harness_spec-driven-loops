// Scores one prompt with the built scorer under the caller's environment and
// prints the top recommendations, for spot checks during the build.
import { pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../../..');
const adv = resolve(root, '.skilled/skills/system-skill-advisor/runtime');
const { scoreAdvisorPrompt } = await import(pathToFileURL(resolve(adv, 'dist/runtime/lib/scorer/fusion.js')).href);
const r = scoreAdvisorPrompt(process.argv[2], { workspaceRoot: root });
console.log(JSON.stringify({ ambiguous: r.ambiguous, recs: (r.recommendations ?? []).slice(0, 8).map((x) => [x.skill, x.score?.toFixed?.(3), x.confidence]) }));
