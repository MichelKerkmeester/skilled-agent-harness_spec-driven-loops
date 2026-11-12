// Prints, per hub, how many registered modes name a command and which do not.
import { readFileSync } from 'node:fs';
for (const hub of ['sk-doc', 'sk-design', 'system-deep-loop']) {
  const modes = JSON.parse(readFileSync(`.skilled/skills/${hub}/mode-registry.json`, 'utf8')).modes || [];
  console.log(hub, 'modes', modes.length, 'with command', modes.filter((m) => m.command).length, 'null', modes.filter((m) => !m.command).map((m) => m.workflowMode || m.id).join(','));
}
