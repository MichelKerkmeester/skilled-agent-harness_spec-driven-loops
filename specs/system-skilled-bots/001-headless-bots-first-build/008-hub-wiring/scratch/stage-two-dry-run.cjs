const path=require('path');const fs=require('fs');
const N=path.resolve(process.argv[2]);const cand=process.argv[3];
const {sourceInputs}=require(path.join(N,'harness/build-artifacts.cjs'));
const {compileRegistry,REGISTRY_SOURCE,SKILL_SOURCE,ROUTER_SOURCE}=require(path.join(N,'lib/registry-compiler.cjs'));
const {evaluateRoute}=require(path.join(N,'lib/router.cjs'));
const sb=sourceInputs(); if(cand) sb[ROUTER_SOURCE]=fs.readFileSync(cand);
const snap=compileRegistry({activationGeneration:1,hubRegistry:JSON.parse(sb[REGISTRY_SOURCE].toString()),hubSkillMarkdown:sb[SKILL_SOURCE].toString(),sourceBytes:sb});
const prompts=["write a new BOT.md for a nightly dependency check bot","run the nightly-digest bot by hand","install the launchd schedule for my nightly-digest bot","show me the status of my bots and their last runs","what is waiting in my bots inbox","answer the open needs-you question for the release bot","run the tests","status of the build","author a skill","schedule a meeting for tomorrow","update skilled now","is my skilled install healthy","schedule this bot and show its status","help with bots"];
for(const p of prompts){const r=evaluateRoute(snap,{prompt:p});const d=r.decision;console.log(JSON.stringify({prompt:p,action:d.action,modes:d.action==='route'?d.route.targets.map(t=>t.destinationId.workflowMode):[],scores:r.trace.matchedScores}));}
