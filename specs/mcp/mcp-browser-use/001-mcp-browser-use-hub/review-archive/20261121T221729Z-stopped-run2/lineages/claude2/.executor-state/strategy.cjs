'use strict';
// Rewrites named strategy sections in place from a JSON spec of replacements.
const fs=require('fs');
const L='specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review/lineages/claude2';
const p=L+'/deep-review-strategy.md';
let t=fs.readFileSync(p,'utf8');
const spec=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
for (const [heading, body] of Object.entries(spec.replace||{})) {
  const re=new RegExp('(## '+heading.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\n)([\\s\\S]*?)(\\n---\\n)');
  if(!re.test(t)) throw new Error('missing section '+heading);
  t=t.replace(re,(m,a,b,c)=>a+body+'\n'+c);
}
for (const [heading, line] of Object.entries(spec.append||{})) {
  const re=new RegExp('(## '+heading.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\n[\\s\\S]*?)(\\n---\\n)');
  if(!re.test(t)) throw new Error('missing section '+heading);
  t=t.replace(re,(m,a,c)=>a.replace(/\n\[First iteration[^\n]*\n- \[Approach\][^\n]*/,'').replace(/\n\[Review angles[^\n]*\n- \[Approach\][^\n]*/,'')+'\n'+line+c);
}
fs.writeFileSync(p,t);
console.log('strategy updated');
