const fs=require('fs'),path=require('path');
const root=process.argv[2];
const router=fs.readFileSync(path.join(root,'REPO RULES.md'),'utf8');
const files=fs.readdirSync(path.join(root,'repo-rules')).filter(f=>f.endsWith('.md')).sort();
// trigger rows: rows in section 2
function section(md,n){const re=new RegExp('^## '+n+'\\.[^\\n]*$','m');const m=re.exec(md);if(!m)return'';const rest=md.slice(m.index+m[0].length);const nxt=/^## \d+\./m.exec(rest);return nxt?rest.slice(0,nxt.index):rest;}
const s2=section(router,2), s3=section(router,3);
const rows=(s)=>s.split('\n').filter(l=>l.trim().startsWith('|')&&!/^\|[-\s|]+\|$/.test(l.trim())).slice(1);
console.log('trigger rows:',rows(s2).length);
console.log('index rows:',rows(s3).length);
console.log('rule files:',files.length,files.join(', '));
// links
const links=[...router.matchAll(/\]\(([^)]+)\)/g)].map(m=>m[1]);
let bad=[];
for(const l of links){if(/^https?:/.test(l))continue;const p=path.join(root,decodeURIComponent(l.split('#')[0]));if(!fs.existsSync(p))bad.push(l);}
console.log('router links:',links.length,'broken:',bad.length,bad.join(','));
// rule file links
let allbad=[];let totalLinks=0;
for(const f of files){const md=fs.readFileSync(path.join(root,'repo-rules',f),'utf8');
 const ls=[...md.matchAll(/\]\(([^)]+)\)/g)].map(m=>m[1]);totalLinks+=ls.length;
 for(const l of ls){if(/^https?:/.test(l))continue;const p=path.resolve(root,'repo-rules',decodeURIComponent(l.split('#')[0]));if(!fs.existsSync(p))allbad.push(f+' -> '+l);}}
console.log('rule links:',totalLinks,'broken:',allbad.length);allbad.forEach(b=>console.log('  BROKEN',b));
// AGENTS.md links to repo-rules
const agents=fs.readFileSync(path.join(root,'AGENTS.md'),'utf8');
const ag=[...agents.matchAll(/\]\((repo-rules\/[^)]+)\)/g)].map(m=>m[1]);
const agbad=ag.filter(l=>!fs.existsSync(path.join(root,decodeURIComponent(l))));
console.log('AGENTS.md repo-rules links:',ag.length,'unique:',new Set(ag).size,'broken:',agbad.length,agbad.join(','));
// trigger phrase collisions
const phrases={};let total=0;
for(const f of files){const md=fs.readFileSync(path.join(root,'repo-rules',f),'utf8');
 const fm=/^---\n([\s\S]*?)\n---/.exec(md);if(!fm){console.log('NO FRONTMATTER',f);continue;}
 const tp=/trigger_phrases:\n([\s\S]*?)\n(?=[a-zA-Z_]+:)/.exec(fm[1]);
 if(!tp){console.log('NO trigger_phrases',f);continue;}
 const list=tp[1].split('\n').map(l=>l.replace(/^\s*-\s*/,'').replace(/^"|"$/g,'').trim()).filter(Boolean);
 total+=list.length;
 for(const p of list){(phrases[p.toLowerCase()]=phrases[p.toLowerCase()]||[]).push(f);}
 console.log('  '+f+': '+list.length+' phrases');}
console.log('total trigger phrases:',total,'unique:',Object.keys(phrases).length);
const coll=Object.entries(phrases).filter(([k,v])=>v.length>1);
console.log('EXACT collisions:',coll.length);coll.forEach(([k,v])=>console.log('   ',k,'=>',v.join(',')));
// dividers vs numbered sections
for(const f of ['../REPO RULES.md',...files]){
 const p=f.startsWith('..')?path.join(root,'REPO RULES.md'):path.join(root,'repo-rules',f);
 const md=fs.readFileSync(p,'utf8');
 const body=md.replace(/^---\n[\s\S]*?\n---\n/,'');
 const div=(body.match(/^---$/gm)||[]).length;
 const sec=(body.match(/^## \d+\./gm)||[]).length;
 console.log(`  ${f}: dividers=${div} numberedSections=${sec} bytes=${fs.statSync(p).size}`);}
