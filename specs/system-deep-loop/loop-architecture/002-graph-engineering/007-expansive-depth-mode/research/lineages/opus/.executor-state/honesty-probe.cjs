// Read-only probe: per iteration, projected stamp vs gateway commit time, file mtime, citations, findings.
const fs=require('fs'),path=require('path');
const dir=process.argv[2], kind=process.argv[3]||'research';
const ledgerDir=fs.readdirSync(dir).find(d=>/-ledger$/.test(d)&&!/audit|effect/.test(d));
const commits=[];
if(ledgerDir){const fd=path.join(dir,ledgerDir,'frames');for(const f of fs.readdirSync(fd).sort()){for(const line of fs.readFileSync(path.join(fd,f),'utf8').split('\n').filter(Boolean)){try{const j=JSON.parse(line);let ev=null;try{ev=JSON.parse(Buffer.from(j.canonical_event_bytes,'base64').toString('utf8'))}catch{try{ev=typeof j.canonical_event_bytes==='string'?JSON.parse(j.canonical_event_bytes):null}catch{}}commits.push({seq:j.sequence,at:j.receipt&&j.receipt.committed_at,ev})}catch{}}}}
const state=fs.readFileSync(path.join(dir,`deep-${kind}-state.jsonl`),'utf8').split('\n').filter(Boolean).map(l=>{try{return JSON.parse(l)}catch{return null}}).filter(Boolean);
const its=state.filter(r=>r.type==='iteration');
const itDir=path.join(dir,'iterations');
let prevMt=null;
for(const r of its){
  const n=r.iteration, f=path.join(itDir,`iteration-${String(n).padStart(3,'0')}.md`);
  let mt=null,words=0,cites=0,uniq=0;
  if(fs.existsSync(f)){const t=fs.readFileSync(f,'utf8');mt=fs.statSync(f).mtime;words=t.split(/\s+/).length;const m=t.match(/[\w./-]+\.(cjs|ts|js|md|yaml|json|mjs|sh)[:#]L?\d+/g)||[];cites=m.length;uniq=new Set(m).size;}
  const c=commits.find(c=>c.ev&&JSON.stringify(c.ev).includes(`"iteration":${n},`)&&/iteration/.test(JSON.stringify(c.ev).slice(0,400)));
  const ts=r.timestamp, at=c&&c.at;
  const skew=ts&&at?Math.round((Date.parse(ts)-Date.parse(at))/1000):null;
  const gap=prevMt&&mt?Math.round((mt-prevMt)/1000):null; prevMt=mt||prevMt;
  console.log([n,'stamp='+ts,'commit='+(at||'?'),'skew_s='+skew,'gap_s='+gap,'words='+words,'cites='+cites+'/'+uniq,'findings='+(r.findingsCount??'?'),'ratio='+r.newInfoRatio,'srcs='+((r.sourcesQueried||[]).length),'tools='+((r.toolsUsed||[]).length)].join(' '));
}
