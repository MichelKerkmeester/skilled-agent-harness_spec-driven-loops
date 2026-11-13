const fs = require('fs'); const path = require('path');
const B = path.resolve(process.argv[2], '.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code');
const S = path.resolve(process.argv[2], '.skilled/skills/sk-code');
const { compileRegistry } = require(path.join(B, 'lib/registry-compiler.cjs'));
const base = require(path.join(B, 'harness/build-artifacts.cjs')).loadSnapshot();
const snap = base.snapshot || base;
console.log('live', snap.policy.effectivePolicyHash);
function compileWith(mutRouter, mutSkill) {
  const routerObj = JSON.parse(fs.readFileSync(path.join(S,'hub-router.json'),'utf8'));
  if (mutRouter) routerObj.surfaceIntentFolds = { 'sk-code-skilled': 'SKILLED' };
  const routerBytes = mutRouter ? Buffer.from(JSON.stringify(routerObj, null, 2)+'\n') : fs.readFileSync(path.join(S,'hub-router.json'));
  let skill = fs.readFileSync(path.join(S,'SKILL.md'),'utf8'); if (mutSkill) skill += '\n';
  const rr = fs.readFileSync(path.join(S,'ROUTER.md'));
  const sourceBytes = { 'SKILL.md': Buffer.from(skill), 'hub-router.json': routerBytes, 'mode-registry.json': fs.readFileSync(path.join(S,'mode-registry.json')), 'ROUTER.md': rr };
  const _t = fs.readFileSync(path.resolve(process.argv[2], '.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs'),'utf8'); const _start=_t.indexOf('const MACHINE_ROUTER_HEADING_RE'); const _end=_t.indexOf('\n}\n', _t.indexOf('function machineRouterSection'))+3; const machineRouterSection = new Function(_t.slice(_start,_end)+'; return machineRouterSection;')();
  const input = { activationGeneration: snap.policy.activationGeneration, hubRouter: JSON.parse(routerBytes.toString()), registry: JSON.parse(sourceBytes['mode-registry.json'].toString()), skillMarkdown: skill, sourceBytes };
  if (typeof machineRouterSection === 'function') { const m = machineRouterSection(rr.toString()); if (m !== null) input.routerMarkdown = m; }
  try { return compileRegistry(input).policy.effectivePolicyHash; } catch (e) { return 'THROW ' + e.message; }
}
console.log('same', compileWith(false,false));
console.log('router+fold', compileWith(true,false));
console.log('skill+nl', compileWith(false,true));
