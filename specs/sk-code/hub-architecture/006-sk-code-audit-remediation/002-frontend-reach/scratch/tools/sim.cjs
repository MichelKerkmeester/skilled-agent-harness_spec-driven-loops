// Design aid: replays prompts against hub-router.json with the engine's own matching rule.
const fs=require('fs');const root=process.argv[2];
const r=JSON.parse(fs.readFileSync(root+'/.skilled/skills/sk-code/hub-router.json','utf8'));
const extra=process.argv[3]?JSON.parse(fs.readFileSync(process.argv[3],'utf8')):{add:{},remove:[]};
for(const [c,ks] of Object.entries(extra.add||{})){r.vocabularyClasses[c]=r.vocabularyClasses[c]||{keywords:[]};r.vocabularyClasses[c].keywords.push(...ks);if(!r.routerSignals['sk-code-frontend'].classes.includes(c))r.routerSignals['sk-code-frontend'].classes.push(c)}
for(const c of Object.keys(r.vocabularyClasses))r.vocabularyClasses[c].keywords=r.vocabularyClasses[c].keywords.filter(k=>!(extra.remove||[]).includes(k)||!c.startsWith('code-frontend'));
const WB=new Set(['review','lcp','inp','cls']);const sp=v=>String(v).replace(/-+/g,' ').replace(/\s+/g,' ').trim();
const has=(t,v)=>{const s=sp(v.trim().toLowerCase()),h=sp(t);return WB.has(s)?new RegExp('\\b'+s+'\\b','i').test(h):h.includes(s)};
const tb=r.routerPolicy.tieBreak;
function route(p){const t=p.trim().toLowerCase();let sc=Object.entries(r.routerSignals).map(([m,s])=>{const hit=[...new Set(s.classes.flatMap(c=>r.vocabularyClasses[c].keywords).filter(k=>has(t,k)).map(k=>sp(k.toLowerCase())))];return{m,score:hit.length*s.weight,hit}}).filter(e=>e.score>0).sort((a,b)=>b.score-a.score||tb.indexOf(a.m)-tb.indexOf(b.m));
 const sel=sc.filter(e=>sc[0].score-e.score<=r.routerPolicy.ambiguityDelta).map(e=>e.m).sort((a,b)=>tb.indexOf(a)-tb.indexOf(b));return{sel,sc}}
const lines=fs.readFileSync(0,'utf8').split('\n').filter(Boolean);
for(const l of lines){const [tag,p]=l.split('\t');const {sel,sc}=route(p);console.log(tag.padEnd(9),(sel.join('+')||'defer').padEnd(34),p.slice(0,52).padEnd(53),sc.map(e=>e.m.replace('sk-code-','')+':'+e.hit.join('/')).join(' ; '))}
