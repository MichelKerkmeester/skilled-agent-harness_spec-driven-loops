// Run from the repository root:
//   node --import ./.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs <this file> [--file <prompts.json>]
// The probe removes AI_SESSION_CHILD from its own environment first, so a dispatched
// worker sees the brief an operator's session receives and not the child form.
// Prints, for each prompt, the brief the Claude hook path renders and the brief the
// OpenCode plugin renders. The Claude side sends the request the hook fallback sends
// (compiledRouteTopOnly) through the advisor CLI, then resultFromCliData and
// renderAdvisorBrief. The OpenCode side loads the real plugin and lets it spawn the
// advisor CLI itself. Neither side starts a daemon or a model session, and neither
// writes a file. A prompt file is a JSON array of strings.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

delete process.env.AI_SESSION_CHILD;
const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const fileIndex = args.indexOf('--file');
const file = fileIndex === -1 ? join(here, 'head-prompts.json') : args[fileIndex + 1];
const prompts: string[] = JSON.parse(readFileSync(file, 'utf8'));
const root = process.cwd();

const fallback = await import(resolve('.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts'));
const render = await import(resolve('.skilled/skills/system-skill-advisor/runtime/lib/render.ts'));
const plugin = await import(pathToFileURL(resolve('.opencode/plugins/system-skill-advisor.js')).href);
const hooks = await plugin.default.server({ directory: root }, {});

function claudeBrief(prompt: string): string {
  const request = {
    prompt,
    options: { topK: 3, includeAttribution: false, includeAbstainReasons: true, includeCompiledRoute: true, compiledRouteTopOnly: true, confidenceThreshold: 0.8, uncertaintyThreshold: 0.35 },
  };
  const stdout = execFileSync(
    'node',
    ['.skilled/bin/skill-advisor.cjs', 'advisor_recommend', '--json', JSON.stringify(request), '--format', 'json'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  );
  const result = fallback.resultFromCliData({
    data: JSON.parse(stdout).data,
    options: {},
    startedAt: 0,
    now: () => 1,
  });
  return render.renderAdvisorBrief(result, { childSession: false }) ?? '(no brief from the renderer)';
}

async function opencodeBrief(prompt: string, index: number): Promise<string> {
  const output: { system: string[] } = { system: [] };
  await hooks['experimental.chat.system.transform']({ sessionID: `probe-heads-${index}`, prompt }, output);
  return output.system[0] ?? '(no brief)';
}

const lead = (brief: string): string => brief.split('\nDirectives:')[0].replace(/\n/g, ' | ');

for (const [index, prompt] of prompts.entries()) {
  const claude = lead(claudeBrief(prompt));
  const opencode = lead(await opencodeBrief(prompt, index));
  console.log(`PROMPT: ${prompt}`);
  console.log(`  claude:   ${claude}`);
  console.log(`  opencode: ${opencode}`);
  console.log(`  same head: ${claude === opencode}`);
}
process.exit(0);
