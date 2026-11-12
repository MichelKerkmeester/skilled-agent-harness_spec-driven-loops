// Prints the hook's stdout for every tune prompt, one JSON line per prompt,
// so the brief text can be compared before and after a change.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../../../../..');
const hook = resolve(root, '.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js');
for (const line of readFileSync(resolve(here, 'tune-rows.jsonl'), 'utf8').split('\n').filter(Boolean)) {
  const { id, prompt } = JSON.parse(line);
  const payload = JSON.stringify({ prompt, cwd: root, hook_event_name: 'UserPromptSubmit', session_id: 'brief-probe' });
  const run = spawnSync(process.execPath, [hook], { cwd: root, input: payload, encoding: 'utf8', timeout: 30000 });
  console.log(JSON.stringify({ id, status: run.status, stdout: run.stdout }));
}
