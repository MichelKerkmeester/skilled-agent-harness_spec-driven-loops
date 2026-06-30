import {spawn} from 'node:child_process'; import fs from 'node:fs';
const [,, model, variant, promptFile, outFile] = process.argv;
const prompt = fs.readFileSync(promptFile,'utf8');
function run(){return new Promise((res)=>{
  const args=['run','--model',model,'--format','json'];
  if(variant && variant!=='none') args.push('--variant',variant);
  args.push(prompt);
  const p=spawn('opencode',args,{stdio:['ignore','pipe','pipe']});
  let out='',err=''; const to=setTimeout(()=>p.kill('SIGTERM'),1200000);
  p.stdout.on('data',d=>out+=d); p.stderr.on('data',d=>err+=d);
  p.on('close',c=>{clearTimeout(to);res({c,out,err});});
});}
let r; for(let a=1;a<=2;a++){ r=await run(); if(r.out&&r.out.length>80) break; await new Promise(s=>setTimeout(s,5000)); }
fs.writeFileSync(outFile+'.raw.json', r.out||'');
let text=''; for(const line of (r.out||'').split('\n')){ if(!line.trim())continue; try{const j=JSON.parse(line);const part=j.part||j; if(part&&part.type==='text'&&typeof part.text==='string')text+=part.text; else if(j.message&&typeof j.message.content==='string')text+=j.message.content;}catch{} }
fs.writeFileSync(outFile, text.trim()||('[NO TEXT exit='+r.c+'] '+(r.err||'').slice(0,300)));
console.log(outFile.split('/').slice(-2).join('/')+': '+text.trim().length+'c');
