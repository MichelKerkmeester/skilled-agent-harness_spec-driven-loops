// Run from the repository root with AI_SESSION_CHILD unset: node <this file>
// Renders three heads with the built renderer, the child flag passed explicitly.
import { resolve } from 'node:path';
const { renderAdvisorBrief } = await import(resolve('.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/render.js'));
const head = (rec, childSession) => renderAdvisorBrief({ status: 'ok', freshness: 'live', recommendations: [{ confidence: 0.95, uncertainty: 0.12, passes_threshold: true, ...rec }], metrics: { tokenCap: 80 } }, { tokenCap: 80, childSession })?.split('\n')[0];
console.log('needsMode on a command row: ' + head({ skill: 'command-create-agent', needsMode: true }, false));
console.log('child, run row paired with an add-only command: ' + head({ skill: 'command-speckit-search', command: '/doctor:speckit', policy: 'run' }, true));
console.log('child, plain start command: ' + head({ skill: 'sk-doc', command: '/create:readme', policy: 'start', ownerSkillId: 'sk-doc' }, true));
