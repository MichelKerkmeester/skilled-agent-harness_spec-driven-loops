// Probe: the Vibe prompt part on a directive-only context, a headed context, and
// a subagent payload that marks its parent under a key the part does not read.
// The advisor run is injected, so no daemon or model starts.
import { buildAdvisorPart, withCommandDocuments } from '../../../../../../../.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs';

const directiveOnly = 'Directives:\n- When a save is due, run /speckit:save to record the session.';
const headed = 'Advisor: no skill matched.\nDirectives:\n- When a save is due, run /speckit:save to record the session.';
console.log('directive-only changed:', withCommandDocuments(directiveOnly) !== directiveOnly);
console.log('directive-only tail:', JSON.stringify(withCommandDocuments(directiveOnly).split('\n').at(-1)));
console.log('headed changed:', withCommandDocuments(headed) !== headed);

const brief = 'Advisor: sk-doc 0.91';
const deps = {
  env: {},
  isEnabled: () => true,
  run: async () => ({ hookSpecificOutput: { additionalContext: brief } }),
  read: () => null,
  write: () => {},
};
const base = { hook_event_name: 'pre_agent', prompt: 'write a readme for the utils folder', session_id: 's1' };
console.log('parent_session_id set ->', JSON.stringify(await buildAdvisorPart({ ...base, parent_session_id: 'p1' }, deps)));
console.log('agent_id only ->', JSON.stringify(await buildAdvisorPart({ ...base, agent_id: 'child-1' }, deps)));
