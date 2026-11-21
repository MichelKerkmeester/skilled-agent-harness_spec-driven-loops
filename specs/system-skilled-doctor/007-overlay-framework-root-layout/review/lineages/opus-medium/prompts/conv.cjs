// Lineage helper: step_graph_convergence -- run convergence.cjs once and record its evaluation through the gateway.
const fs=require('fs'),cp=require('child_process'),crypto=require('crypto');
const [L,n,req,pass]=process.argv.slice(2);
const SID='fanout-opus-medium-1795192401900-xpt66n';
const env={...process.env,DEEP_LOOP_COVERAGE_DB_DIR:L+'/graph-db'};
const r=cp.spawnSync('node',['.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs','--spec-folder','specs/system-skilled-doctor/007-overlay-framework-root-layout','--loop-type','review','--session-id',SID,'--convergence-mode','default','--depth-mode','expansive','--stop-decision','--config-path',L+'/deep-review-config.json','--state-log',L+'/deep-review-state.jsonl','--registry-path',L+'/deep-review-findings-registry.json','--iteration-count',n,'--security-sensitive-fix-scope','true','--fix-replay-required-rows',req,'--fix-replay-passing-rows',pass],{encoding:'utf8',env});
const j=JSON.parse(r.stdout); fs.writeFileSync(`${L}/prompts/conv-${String(n).padStart(3,'0')}.json`,r.stdout);
if(!j.loop_counters_json){console.log('HALT: no loop counters');process.exit(3);}
const canon=(v)=>JSON.stringify(v,Object.keys(v||{}).sort());
const h=(v)=>crypto.createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const sig=j.graph_signals_json||{}; const sd=j.stop_decision;
const clamp=(x)=>Math.max(0,Math.min(1,Number.isFinite(x)?x:0));
const reg=JSON.parse(fs.readFileSync(L+'/deep-review-findings-registry.json','utf8'));
const raw={noveltyRatio:clamp(sig.noveltyRatio),coverageRatio:clamp(sig.coverageRatio??sig.dimensionCoverageRatio),findingStabilityRatio:clamp(sig.findingStabilityRatio),evidenceDensityRatio:clamp(sig.evidenceDensityRatio),hotspotSaturationRatio:clamp(sig.hotspotSaturationRatio),observationDigest:h(sig)};
const gd={CONTINUE:'continue',STOP_ALLOWED:'converged',STOP_BLOCKED:'blocked'}[j.graph_decision]||'unavailable';
const blockers=Array.isArray(j.graph_blockers_json)?j.graph_blockers_json:[];
const ids=blockers.map(b=>String(b.type||'graph_blocker'));
const dec={CONTINUE:'continue',STOP:'converged',BLOCKED:'blocked',STUCK_RECOVERY:'recover'}[sd.decision]||'continue';
const cfg=JSON.parse(fs.readFileSync(L+'/deep-review-config.json','utf8'));
const p01=(reg.findingsBySeverity||{}); const active=(p01.P0||0)+(p01.P1||0);
const ev={stem:'deep_review.graph_convergence_evaluated',scope:{runId:SID,sessionId:SID,generation:1,iterationId:'iteration-'+n},data:{rawSignals:raw,weightedSignals:raw,dimensionCoverageDigest:h(canon(reg.dimensionCoverage||{})),protocolCoverageDigest:h(canon(sig.protocolCoverage||{})),findingStability:sig.findingStabilityRatio===undefined?'unknown':(sig.findingStabilityRatio>=0.1?'stable':'unstable'),p0p1ResolutionState:active>0?'blocked':'resolved',evidenceDensity:raw.evidenceDensityRatio,hotspotSaturation:raw.hotspotSaturationRatio,decision:(dec==='blocked'&&ids.length===0)?'continue':dec,policyFingerprint:h(canon({convergenceThreshold:cfg.convergenceThreshold,stopPolicy:cfg.stopPolicy,convergenceMode:cfg.antiConvergence.convergenceMode})),blockerIds:(gd==='blocked'&&ids.length===0)?['graph_blocker']:ids,stopCandidate:j.graph_decision==='STOP_ALLOWED',graphDecision:gd,graphDigest:h(sig),signals:sig,blockers},eventId:`graph-${SID}-g1-i${n}`};
const f=`${L}/prompts/graph-event-${String(n).padStart(3,'0')}.json`; fs.writeFileSync(f,JSON.stringify(ev));
const g=cp.spawnSync('node',['.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs','--mode','review','--run-directory',L,'--event-json',f],{encoding:'utf8'});
console.log('graph-event rc='+g.status,(g.stdout||'').slice(0,80),(g.stderr||'').slice(0,300));
console.log('DECISION',sd.decision,sd.stopReason,sd.reasonDetail,'graph='+j.graph_decision,'stuck='+j.loop_counters_json.stuckCount,JSON.stringify(sd.blockedBy));
const gates=sd.gates||{}; console.log('GATES',Object.entries(gates).map(([k,v])=>k+'='+(v.pass?'P':'F')).join(' '));
