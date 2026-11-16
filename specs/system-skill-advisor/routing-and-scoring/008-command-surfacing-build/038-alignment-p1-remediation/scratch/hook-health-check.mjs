// Runs the DSH, Vibe and Pi prompt hooks' shared handler call once each, as each
// adapter makes it, and counts the health records written. Run it with TMPDIR set to
// an empty folder, so the records it counts are the ones these calls wrote.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { runAdvisor as runDsh } from '../../../../../../.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs';
import { buildAdvisorPart } from '../../../../../../.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs';

const root = join(tmpdir(), 'speckit-skill-advisor-metrics');
// A record is written after the handler returns, so the count is read once all three
// calls are done and grouped by the runtime each record names.
const byRuntime = () => {
  const counts = {};
  if (!existsSync(root)) return counts;
  for (const name of readdirSync(root)) {
    for (const line of readFileSync(join(root, name), 'utf8').split('\n')) {
      if (line.trim() === '') continue;
      const runtime = JSON.parse(line).runtime;
      counts[runtime] = (counts[runtime] ?? 0) + 1;
    }
  }
  return counts;
};
const input = { prompt: 'write the login handler and add a test', cwd: process.cwd(), hook_event_name: 'UserPromptSubmit' };
const env = { ...process.env };
delete env.AI_SESSION_CHILD;

await runDsh(input);
await buildAdvisorPart({ ...input, hook_event_name: 'pre_agent', session_id: 'health-check' },
  { env, isEnabled: () => true, read: () => null, write: () => {} });
const advisor = await import('../../../../../../.skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js');
await advisor.handleClaudeUserPromptSubmit(input, { runtime: 'pi', writeDiagnostic: () => {} });
await new Promise((resolve) => setTimeout(resolve, 500));
const counts = byRuntime();
console.log(['dsh', 'vibe', 'pi'].map((runtime) => `${runtime} ${counts[runtime] ?? 0}`).join(' '));
