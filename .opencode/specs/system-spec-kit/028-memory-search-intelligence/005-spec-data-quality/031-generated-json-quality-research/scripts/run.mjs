import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { spawn } from 'node:child_process'
const DIR = '/tmp/jqr'
const ROOT = process.cwd()
const keys = readdirSync(DIR).filter(f => f.endsWith('.txt')).map(f => f.replace('.txt',''))
const CONC = 3, TIMEOUT = 900
const shq = v => `'${String(v).replace(/'/g, `'\\''`)}'`
function done(k){ const f=`${DIR}/out-${k}.json`; return existsSync(f) && statSync(f).size>300 }
function run(k, attempt=1){
  return new Promise(res=>{
    const prompt = readFileSync(`${DIR}/${k}.txt`,'utf8')
    const cmd = `AI_SESSION_CHILD=1 gtimeout -k 60 ${TIMEOUT} opencode run --model openai/gpt-5.5-fast --variant xhigh --format json --dir ${shq(ROOT)} ${shq(prompt)} </dev/null`
    const t0=Date.now(); const c=spawn('bash',['-c',cmd],{cwd:ROOT}); let out='',err=''
    c.stdout.on('data',d=>out+=d); c.stderr.on('data',d=>err+=d)
    c.on('close',code=>{
      const ms=Date.now()-t0
      if(out.length<300 && attempt<2){ setTimeout(()=>res(run(k,attempt+1)),2000); return }
      writeFileSync(`${DIR}/out-${k}.json`,out)
      writeFileSync(`${DIR}/meta-${k}.json`,JSON.stringify({k,code,ms,bytes:out.length,attempts:attempt,errTail:err.slice(-200)}))
      console.log(`${k} bytes=${out.length} ${Math.round(ms/1000)}s exit=${code}`); res()
    })
  })
}
const todo = keys.filter(k=>!done(k))
console.log(`seats=${keys.length} todo=${todo.length} conc=${CONC}`)
let i=0
async function worker(){ while(i<todo.length){ const k=todo[i++]; await run(k) } }
await Promise.all(Array.from({length:CONC},()=>worker()))
console.log('RESEARCH-DONE')
