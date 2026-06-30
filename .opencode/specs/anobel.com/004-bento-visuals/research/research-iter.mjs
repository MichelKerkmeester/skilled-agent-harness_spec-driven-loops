import {spawn} from 'node:child_process'; import fs from 'node:fs';
const [,, promptFile, outFile] = process.argv;
const prompt = fs.readFileSync(promptFile,'utf8');
function run(){return new Promise((res)=>{
  const p=spawn('opencode',['run','--model','openai/gpt-5.5-fast','--variant','xhigh','--format','json',prompt],{stdio:['ignore','pipe','pipe']});
  let out='',err=''; const to=setTimeout(()=>{p.kill('SIGTERM');},1800000);
  p.stdout.on('data',d=>out+=d); p.stderr.on('data',d=>err+=d);
  p.on('close',code=>{clearTimeout(to);res({code,out,err});});
});}
let r; for(let a=1;a<=2;a++){ r=await run(); if(r.out&&r.out.length>50) break; await new Promise(s=>setTimeout(s,5000)); }
fs.writeFileSync(outFile+'.raw.json', r.out||'');
// parse: collect assistant text parts from the json event stream
let text='';
for(const line of (r.out||'').split('\n')){
  if(!line.trim()) continue;
  try{ const j=JSON.parse(line);
    const part=j.part||j;
    if(part && part.type==='text' && typeof part.text==='string') text+=part.text;
    else if(j.message&&typeof j.message.content==='string') text+=j.message.content;
  }catch{}
}
if(!text.trim()){ // fallback: maybe plain text or a single json
  const m=(r.out||'').match(/"text":"((?:[^"\\]|\\.)*)"/g);
  if(m) text=m.map(s=>{try{return JSON.parse('{'+s+'}').text}catch{return ''}}).join('');
}
fs.writeFileSync(outFile, text.trim()||('[NO TEXT PARSED — exit '+r.code+']\nstderr:\n'+(r.err||'').slice(0,500)));
console.log(outFile+': '+(text.trim().length)+' chars (exit '+r.code+')');
