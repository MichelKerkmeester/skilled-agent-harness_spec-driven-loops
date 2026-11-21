// Lineage helper: project one iteration's canonical coverage into the coverage graph (step_graph_upsert).
const fs=require('fs'),cp=require('child_process');
const [L,n]=process.argv.slice(2); const it=Number(n);
const rows=fs.readFileSync(L+'/deep-review-state.jsonl','utf8').trim().split('\n').map(l=>JSON.parse(l)).filter(r=>r.type==='iteration'&&r.iteration===it);
const rec=rows[rows.length-1]; if(!rec) throw new Error('no iteration '+it);
const dims=['correctness','security','traceability','maintainability'];
const nodes=dims.map(d=>({id:'dim:'+d,type:'DIMENSION',name:d,iteration:it,metadata:{}}));
const edges=[];
for(const ref of rec.filesReviewed){const file=ref.replace(/:\d+(-\d+)?$/,'');const id='file:'+file;
 if(!nodes.find(x=>x.id===id)) nodes.push({id,type:'FILE',name:file,iteration:it,metadata:{}});
 for(const d of rec.dimensions){const eid=`covers:${d}:${file}`; if(!edges.find(e=>e.id===eid)) edges.push({id:eid,relation:'COVERS',sourceId:'dim:'+d,targetId:id,metadata:{iteration:it}});}}
const env={...process.env,DEEP_LOOP_COVERAGE_DB_DIR:L+'/graph-db'};
const r=cp.spawnSync('node',['.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs','--spec-folder','specs/system-skilled-doctor/007-overlay-framework-root-layout','--loop-type','review','--session-id','fanout-opus-medium-1795192401900-xpt66n','--nodes',JSON.stringify(nodes),'--edges',JSON.stringify(edges),'--state-log',L+'/deep-review-state.jsonl','--delta-dir',L+'/deltas','--iteration',String(it)],{encoding:'utf8',env});
console.log('upsert it='+it+' rc='+r.status,(r.stdout||'').replace(/\s+/g,' ').slice(0,250),(r.stderr||'').slice(0,250));
