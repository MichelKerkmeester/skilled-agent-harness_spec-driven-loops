// Run from the repository root with AI_SESSION_CHILD unset:
//   node --import ./.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs <this file>
// Lists the readers of the OpenCode plugin's route summary and bounding option, the
// command-field assertions the two delivery tests hold, and the head the CLI
// fallback renders for a skill row that carries a command. Reads files only.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const plugin = readFileSync('.opencode/plugins/system-skill-advisor.js', 'utf8').split('\n');
const hits = (pattern: RegExp) => plugin.flatMap((line, index) => (pattern.test(line) ? [`${index + 1}: ${line.trim().slice(0, 90)}`] : []));
console.log(`compiledRouteSummary lines: ${JSON.stringify(hits(/compiledRouteSummary/))}`);
console.log(`metadata readers: ${JSON.stringify(hits(/\.metadata\?*\./))}`);
console.log(`bounding jsdoc: ${JSON.stringify(hits(/rawOptions\.boundedCompiledRouteSummary/))}`);
const envelope = readFileSync('.skilled/skills/system-skill-advisor/runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts', 'utf8');
const pluginTest = readFileSync('.opencode/plugins/tests/system-skill-advisor.test.cjs', 'utf8');
console.log(`envelope test inputs with command, policy, ownerSkillId: ${/command: '\//.test(envelope)}, ${/policy: '(run|start|ask)'/.test(envelope)}, ${/ownerSkillId:/.test(envelope)}`);
console.log(`plugin test asserts a command label: ${/\/[a-z]+:[a-z-]+ \((run|start|ask)\)/.test(pluginTest)}`);
const fallback = await import(resolve('.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts'));
const render = await import(resolve('.skilled/skills/system-skill-advisor/runtime/lib/render.ts'));
const result = fallback.resultFromCliData({
  data: { freshness: 'live', recommendations: [{ skillId: 'sk-doc', confidence: 0.95, uncertainty: 0.12, command: '/create:agent', policy: 'start', ownerSkillId: 'sk-doc' }] },
  options: { maxTokens: 80 }, startedAt: 0, now: () => 1,
});
const top = result.recommendations[0];
console.log(`fallback keeps: command ${top.command}, policy ${top.policy}, ownerSkillId ${top.ownerSkillId}`);
console.log(`head: ${render.renderAdvisorBrief(result)?.split('\n')[0]}`);
