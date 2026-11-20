// Read-only probe: bucket opencode tool_use events by the gateway commit times of iteration rows.
const fs=require('fs'),path=require('path');
const dir=process.argv[2];
const ledgerDir=fs.readdirSync(dir).find(d=>/-ledger$/.test(d)&&!/audit|effect/.test(d));
const commits=[];
for(const f of fs.readdirSync(path.join(dir,ledgerDir,'frames')).sort())for(const line of fs.readFileSync(path.join(dir,ledgerDir,'frames',f),'utf8').split('\n').filter(Boolean)){const j=JSON.parse(line);const ev=Buffer.from(j.canonical_event_bytes,'base64').toString('utf8');const m=ev.match(/"iteration":(\d+),/);if(m&&/iteration/.test(ev.slice(0,300)))commits.push({n:+m[1],at:Date.parse(j.receipt.committed_at)})}
const iters=[...new Map(commits.map(c=>[c.n,c])).values()].sort((a,b)=>a.at-b.at);
const tools=[];
for(const l of fs.readFileSync(path.join(dir,'logs','fanout-lineage.out'),'utf8').split('\n')){try{const j=JSON.parse(l);if(j.type==='tool_use'){const p=j.part||{};const inp=(p.state&&p.state.input)||{};tools.push({t:j.timestamp,tool:p.tool,target:inp.filePath||inp.path||inp.url||'',cmd:inp.command||''})}}catch{}}
let prev=0;
for(const it of iters){const b=tools.filter(x=>x.t>prev&&x.t<=it.at);const kinds={};for(const x of b)kinds[x.tool]=(kinds[x.tool]||0)+1;const isSrc=x=>(/read|grep|glob|webfetch/.test(x.tool)&&!/lineages\//.test(x.target))||(x.tool==="shell"&&/\b(sed -n|grep|rg|cat|head|awk)\b/.test(x.cmd||"")&&!/append-mode-event|reduce-state|lineages\//.test(x.cmd||""));const reads=new Set(b.filter(isSrc).map(x=>x.cmd||x.target));console.log(it.n,'calls='+b.length,'sourceReads='+reads.size,JSON.stringify(kinds));prev=it.at}
