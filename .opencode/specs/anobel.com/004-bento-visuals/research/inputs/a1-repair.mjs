import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { a1Block } from './a1-contract.mjs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const W = 560;
const H = 480;
const EP='https://api.z.ai/api/coding/paas/v4/chat/completions';
const here = path.dirname(fileURLToPath(import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseArgs(argv){
  const args = { arm:'a1_gate_repair', runId:'r1' };
  const rest = [];
  for(let i=0;i<argv.length;i++){
    const a = argv[i];
    if(a==='--arm') args.arm = argv[++i];
    else if(a==='--run') args.runId = argv[++i];
    else rest.push(a);
  }
  if(!rest[0]) throw new Error('usage: node a1-repair.mjs <tileHtmlPath> [--arm a1_gate_repair] [--run <id>]');
  return { tile:path.resolve(rest[0]), ...args };
}

function tileIdOf(file){
  return path.basename(file,'.html').replace(/-glm(?=-|$)/g,'');
}

async function gatePathFor(tile){
  const p = path.join(path.dirname(tile),`${path.basename(tile,'.html')}.gate.json`);
  try{ await fs.access(p); return p; }catch{}
  return `${tile}.gate.json`;
}

function freePort(){
  return new Promise((resolve,reject)=>{
    const s = net.createServer();
    s.once('error',reject);
    s.listen(0,'127.0.0.1',()=>{
      const port = s.address().port;
      s.close(()=>resolve(port));
    });
  });
}

class CDP{
  constructor(ws){
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.waiters = new Map();
    ws.addEventListener('message',(ev)=>this.onMessage(ev.data));
    ws.addEventListener('close',()=>this.rejectAll(new Error('CDP websocket closed')));
    ws.addEventListener('error',()=>this.rejectAll(new Error('CDP websocket error')));
  }

  static connect(url){
    return new Promise((resolve,reject)=>{
      const ws = new WebSocket(url);
      const t = setTimeout(()=>reject(new Error('CDP websocket timeout')),10_000);
      ws.addEventListener('open',()=>{ clearTimeout(t); resolve(new CDP(ws)); },{ once:true });
      ws.addEventListener('error',()=>{ clearTimeout(t); reject(new Error('CDP websocket error')); },{ once:true });
    });
  }

  send(method,params={},timeout=30_000){
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve,reject)=>{
      const t = setTimeout(()=>{ this.pending.delete(id); reject(new Error(`${method} timeout`)); },timeout);
      this.pending.set(id,{ resolve, reject, t });
    });
  }

  once(method,timeout=30_000){
    return new Promise((resolve,reject)=>{
      const t = setTimeout(()=>{
        const a = this.waiters.get(method) ?? [];
        this.waiters.set(method,a.filter((w)=>w.resolve!==resolve));
        reject(new Error(`${method} timeout`));
      },timeout);
      const a = this.waiters.get(method) ?? [];
      a.push({ resolve, reject, t });
      this.waiters.set(method,a);
    });
  }

  onMessage(data){
    const msg = JSON.parse(typeof data === 'string' ? data : Buffer.from(data).toString('utf8'));
    if(msg.id){
      const p = this.pending.get(msg.id);
      if(!p) return;
      clearTimeout(p.t);
      this.pending.delete(msg.id);
      if(msg.error) p.reject(new Error(msg.error.message || JSON.stringify(msg.error)));
      else p.resolve(msg.result);
      return;
    }
    const a = this.waiters.get(msg.method);
    if(!a?.length) return;
    const w = a.shift();
    clearTimeout(w.t);
    if(a.length) this.waiters.set(msg.method,a);
    else this.waiters.delete(msg.method);
    w.resolve(msg.params ?? {});
  }

  rejectAll(err){
    for(const p of this.pending.values()){ clearTimeout(p.t); p.reject(err); }
    this.pending.clear();
    for(const a of this.waiters.values()) for(const w of a){ clearTimeout(w.t); w.reject(err); }
    this.waiters.clear();
  }

  close(){
    try{ this.ws.close(); }catch{}
  }
}

async function launchBrowser(){
  const port = await freePort();
  const userDir = await fs.mkdtemp(path.join(os.tmpdir(),'a1-chrome-'));
  const proc = spawn(CHROME,[
    '--headless=new','--disable-gpu','--hide-scrollbars','--force-device-scale-factor=1',
    `--remote-debugging-port=${port}`,`--user-data-dir=${userDir}`,'about:blank',
  ],{ stdio:'ignore' });
  try{
    const deadline = Date.now() + 15_000;
    let target = null;
    while(Date.now()<deadline){
      if(proc.exitCode!=null) throw new Error(`Chrome exited with code ${proc.exitCode}`);
      try{
        const res = await fetch(`http://127.0.0.1:${port}/json`);
        const json = await res.json();
        target = json.find((t)=>t.type==='page' && t.webSocketDebuggerUrl);
        if(target) break;
      }catch{}
      await sleep(100);
    }
    if(!target) throw new Error('no Chrome page target');
    const cdp = await CDP.connect(target.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride',{ width:W, height:H, deviceScaleFactor:1, mobile:false });
    return { cdp, proc, userDir };
  }catch(err){
    try{ proc.kill('SIGKILL'); }catch{}
    await fs.rm(userDir,{ recursive:true, force:true, maxRetries:3, retryDelay:100 }).catch(()=>{});
    throw err;
  }
}

async function closeBrowser(browser){
  if(!browser) return;
  try{ browser.cdp.close(); }catch{}
  try{ browser.proc.kill('SIGKILL'); }catch{}
  await fs.rm(browser.userDir,{ recursive:true, force:true, maxRetries:3, retryDelay:100 }).catch(()=>{});
}

async function screenshot(file){
  let browser = null;
  try{
    browser = await launchBrowser();
    const cdp = browser.cdp;
    await cdp.send('Emulation.setDeviceMetricsOverride',{ width:W, height:H, deviceScaleFactor:1, mobile:false });
    const loaded = cdp.once('Page.loadEventFired',30_000);
    const nav = await cdp.send('Page.navigate',{ url:pathToFileURL(file).href });
    if(nav.errorText) throw new Error(`Page.navigate: ${nav.errorText}`);
    await loaded;
    await cdp.send('Runtime.evaluate',{ expression:`(async()=>{try{await document.fonts.ready}catch{};await new Promise(r=>requestAnimationFrame(()=>r()));await new Promise(r=>requestAnimationFrame(()=>r()));})()`, awaitPromise:true });
    const shot = await cdp.send('Page.captureScreenshot',{ format:'png', fromSurface:true, captureBeyondViewport:false },30_000);
    return shot.data;
  }finally{
    await closeBrowser(browser);
  }
}

function stripTags(s){
  return String(s||'').replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
}

function roleText(html,role){
  const re = new RegExp(`<([a-z0-9:-]+)[^>]*data-a1-role=["']${role}["'][^>]*>([\\s\\S]*?)<\\/\\1>`,'i');
  return stripTags(html.match(re)?.[2] || '');
}

function tagText(html,tag){
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`,'i');
  return stripTags(html.match(re)?.[1] || '');
}

function copyOf(html){
  const title = roleText(html,'title') || tagText(html,'h1') || tagText(html,'h2') || 'UNKNOWN';
  const desc = roleText(html,'description') || tagText(html,'p') || 'UNKNOWN';
  return { title, desc };
}

function htmlOk(h){
  return (h.toLowerCase().startsWith('<!doctype')||h.toLowerCase().startsWith('<html')) && /<\/html>\s*$/i.test(h);
}

function stripFence(h){
  return h.replace(/^```(?:html)?\s*/i,'').replace(/\s*```\s*$/,'').trim();
}

function failedOnly(gate){
  return Object.fromEntries(Object.entries(gate.checks||{}).filter(([,v])=>!v.pass));
}

function repairPrompt(gate,title,desc){
  const primitive = gate.primitive || 'instrument';
  const treatment = `Repair the existing ${primitive} tile. Preserve the current composition and only correct the named gate failures.`;
  const failure = {
    tileId:gate.tileId,
    pass:gate.pass,
    primitive,
    checks:failedOnly(gate),
    overflowSummary:gate.overflowSummary,
  };
  return `${a1Block(title,desc,treatment)}

LOCK: keep the exact copy WORDS, product meaning, Dutch wording, the palette colors, and the title/description text content unchanged. You MAY change layout, sizing, positioning, spacing, element structure, fonts, and CSS to resolve EVERY failed check in the FAILURE JSON. Fix ALL named defects: vertical overflow, element/title-band collisions, low-contrast text (switch dark-panel text to the on-dark tokens #E7ECF7 body / #B8C2D6 muted; never use a banned gray as readable text on navy), uppercase on the eyebrow/headings (REMOVE text-transform:uppercase — this is a styling fix, not a copy change), and clipped content. Resolving a named defect is required, not optional.

FAILURE JSON:
${JSON.stringify(failure,null,2)}

Return one complete HTML document only. No markdown fences, no prose.`;
}

async function repairHtml(prompt,png){
  const auth = JSON.parse(await fs.readFile(`${process.env.HOME}/.local/share/opencode/auth.json`,'utf8'));
  const key = auth['zai-coding-plan'].key;
  const body={model:'glm-5.2',max_tokens:24000,temperature:0.4,thinking:{type:'disabled'},messages:[{role:'user',content:[
    {type:'text',text:prompt},
    {type:'image_url',image_url:{url:'data:image/png;base64,'+png}},
  ]}]};
  const r = await fetch(EP,{ method:'POST', headers:{ 'Authorization':'Bearer '+key, 'Content-Type':'application/json' }, body:JSON.stringify(body) });
  const j = await r.json();
  if(!r.ok) throw new Error(`GLM repair HTTP ${r.status}: ${JSON.stringify(j).slice(0,500)}`);
  return stripFence(j.choices?.[0]?.message?.content || '');
}

function runGate(tile,args){
  return new Promise((resolve,reject)=>{
    const p = spawn(process.execPath,[path.join(here,'a1-gate.mjs'),tile,'--arm',args.arm,'--run',args.runId],{ stdio:'inherit' });
    p.on('error',reject);
    p.on('close',(code)=>code===0 ? resolve() : reject(new Error(`a1-gate exited ${code}`)));
  });
}

async function writeRepair(gatePath,gate,repair){
  await fs.writeFile(gatePath,`${JSON.stringify({ ...gate, repair },null,2)}\n`);
}

async function main(){
  const args = parseArgs(process.argv.slice(2));
  const gatePath = await gatePathFor(args.tile);
  const gate = JSON.parse(await fs.readFile(gatePath,'utf8'));
  const id = gate.tileId || tileIdOf(args.tile);
  if(gate.pass === true){
    console.log(`SKIP ${id} (already passes)`);
    return;
  }
  // Repaired output lands in a SEPARATE arm dir so the original baseline tile and
  // its gate.json are never mutated — the repair is a new artifact, not a clobber.
  const outDir = path.join(path.dirname(path.dirname(args.tile)),`dist-${args.arm}-${args.runId}`);
  await fs.mkdir(outDir,{recursive:true});
  const repairedPath = path.join(outDir,path.basename(args.tile));
  try{
    const html = await fs.readFile(args.tile,'utf8');
    const { title, desc } = copyOf(html);
    const png = await screenshot(args.tile);
    const repaired = await repairHtml(repairPrompt(gate,title,desc),png);
    if(!htmlOk(repaired)) throw new Error(`repair returned incomplete/no-html len=${repaired.length}`);
    await fs.writeFile(repairedPath,repaired);
    await runGate(repairedPath,args);
    const repairedGatePath = await gatePathFor(repairedPath);
    const next = JSON.parse(await fs.readFile(repairedGatePath,'utf8'));
    const repair = { fired:true, attempt:1, regated:Boolean(next.pass), convertedToPass:Boolean(next.pass) };
    await writeRepair(repairedGatePath,next,repair);
    console.log(`REPAIR ${id} regated=${repair.regated} -> ${repairedPath}`);
  }catch(err){
    console.error(`REPAIR-ERR ${id}: ${err?.message || err}`);
    throw err;
  }
}

main().catch((err)=>{
  console.error(err?.stack || err?.message || String(err));
  process.exitCode = 1;
});
