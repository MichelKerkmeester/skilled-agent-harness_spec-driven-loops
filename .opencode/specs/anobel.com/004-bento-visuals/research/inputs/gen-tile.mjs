import fs from 'node:fs';
import path from 'node:path';
import { a1Block, preflightSpec } from './a1-contract.mjs';
import { primitiveFor, routeFor } from './primitive-map.mjs';

const auth = JSON.parse(fs.readFileSync(process.env.HOME+'/.local/share/opencode/auth.json','utf8'));
const key = auth['zai-coding-plan'].key;
const spec = JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const img = fs.readFileSync(spec.refImage).toString('base64');
const EP='https://api.z.ai/api/coding/paas/v4/chat/completions';
const ARM = process.env.A1_ARM || 'control';
const RUN_ID = process.env.A1_RUN_ID || 'r1';
const ARMS = new Set(['control','a1_prompt','a1_gate_repair']);
if(!ARMS.has(ARM)) throw new Error('A1_ARM must be control, a1_prompt, or a1_gate_repair');

function contract(title,desc,treatment){return `You are GLM-5.2, a multimodal model that CAN see attached images. An image IS attached and visible to you — do NOT deliberate about whether you can see it; you can. Even if you somehow cannot, the LAYOUT section below fully specifies the shell, so build from that — never refuse or explain, just output the HTML.

You are a senior product-UI engineer. The attached image is the EMPTY reference shell for a Dutch maritime "Vloot-functie" bento tile (title "${title}", description "${desc}"). Build ONE self-contained 560×480 HTML tile in the EXACT house style below, filling the body with this treatment:

TREATMENT: ${treatment}

OUTPUT: a single complete HTML document only — no markdown fences, no prose. Inline <style>, inline SVG, the Hanken Grotesk Google Fonts link only.

LAYOUT (match the reference shell exactly):
- Card 560×480, page bg #eceef0, centered; background #ffffff, border-radius 22px (NOT >=24), NO border, box-shadow:0 1px 2px rgba(20,28,46,.04),0 26px 52px -22px rgba(20,28,46,.20), padding 30px, overflow hidden; font 'Hanken Grotesk',Arial,sans-serif; -webkit-font-smoothing:antialiased; font-variant-numeric:tabular-nums; color #0a1a2f.
- TITLE + DESCRIPTION SIT AT THE BOTTOM-LEFT of the card (exactly like the reference shell). Title "${title}" 21px weight 700 #0a1a2f. Description "${desc}" 13.5px weight 500 #4e4e4e, directly under the title.
- The instrument/content fills the body ABOVE the title block (a floating inner panel: #fefefe + 1px #ececec border + tight <=14px-blur shadow, radius <=16).
- Eyebrow chip TOP-RIGHT: a small ANCHOR icon (maritime) + the text "Vloot-functie" (Title case, NOT uppercase), brand blue #06458c, on a #f6f8fc rounded pill. Use ONLY this anchor icon for the eyebrow — no other glyph.
- Circular ghost ↗ button BOTTOM-RIGHT (34px, white, 1px #e2e2e2).
- EVERYTHING must fit inside the 560×480 card — nothing clipped or overflowing. Size the instrument to leave room for the bottom title+desc block.

Spend boldness on ONE signature instrument moment for the treatment, grounded in maritime-B2B fleet procurement; everything else quiet. Realistic Dutch data (ships MS Aldebaran/Castor/Pollux/Vesta; maart 2026). Format euro amounts consistently as €X.XXX (thousands dot, no cents).

Palette ONLY (zero out-of-palette hex): brand #06458c/#053b77/#043367; green #367e39 (status/success only); red #c9140f (alerts only); text #0a1a2f; muted secondary/meta/caption/table-header TEXT must be #4e4e4e or #0a1a2f, NEVER #787878 and NEVER #8591b3/#acb3c9/#cbd0dc as TEXT color (they fail WCAG AA) — those light neutrals are for borders, dividers, dots, strokes and fills ONLY; neutrals #ececec #e7e9ee #cbd0dc #8591b3 #acb3c9 #f6f8fc #fefefe #ffffff #e2e2e2. NO orange. No gradient except optionally the navy. No glassmorphism. Reduced-motion-guard any hover. Status by icon+word not color alone. Return ONLY the HTML.`;}

function promptFor(t){
  if(ARM==='control') return contract(spec.title,spec.desc,t.brief);
  return `${a1Block(spec.title,spec.desc,t.brief)}\n\n${preflightSpec()}`;
}

function outFor(t){
  if(ARM==='control') return t.out;
  const dir = path.dirname(t.out);
  return path.join(path.dirname(dir),`dist-${ARM}-${RUN_ID}`,path.basename(t.out));
}

function htmlOk(h){
  return (h.toLowerCase().startsWith('<!doctype')||h.toLowerCase().startsWith('<html')) && /<\/html>\s*$/i.test(h);
}

function stripFence(h){
  return h.replace(/^```(?:html)?\s*/i,'').replace(/\s*```\s*$/,'').trim();
}

function splitPreflight(raw){
  const h = raw.trim();
  const m = h.match(/^```(?:json)?[^\n]*\n([\s\S]*?)\n```\s*/i);
  if(!m) return { preflight:null, html:stripFence(h) };
  try{ return { preflight:JSON.parse(m[1]), html:stripFence(h.slice(m[0].length)) }; }
  catch{ return { preflight:null, html:stripFence(h.slice(m[0].length)) }; }
}

async function gen(t){
  const out = outFor(t);
  const primitive = primitiveFor(out);
  const routing = { ...routeFor(out), primitive };
  const writeRouting = () => { try{ fs.mkdirSync(path.dirname(out),{recursive:true}); fs.writeFileSync(`${out}.routing.json`,`${JSON.stringify(routing,null,2)}\n`); }catch{} };
  if(fs.existsSync(out)){ try{ if(/<\/html>\s*$/i.test(fs.readFileSync(out,"utf8"))){ writeRouting(); return `SKIP ${t.n} [${primitive}]`; } }catch{} }
  const body={model:'glm-5.2',max_tokens:24000,temperature:0.4,thinking:{type:'disabled'},messages:[{role:'user',content:[
    {type:'text',text:promptFor(t)},
    {type:'image_url',image_url:{url:'data:image/png;base64,'+img}}]}]};
  for(let a=1;a<=5;a++){
    const ac=new AbortController(); const to=setTimeout(()=>ac.abort(),150000);
    try{
      const r=await fetch(EP,{method:'POST',headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify(body),signal:ac.signal});
      clearTimeout(to);
      const j=await r.json();
      let h=(j.choices?.[0]?.message?.content||'');
      const fin=j.choices?.[0]?.finish_reason;
      if(ARM==='control'){
        h=h.replace(/^```(?:html)?\s*/i,'').replace(/\s*```\s*$/,'').trim();
        if(htmlOk(h)){ fs.writeFileSync(out,h); writeRouting(); return `OK ${t.n} (${h.length}b, ${fin}) [${primitive}]`; }
      }else{
        const p=splitPreflight(h);
        if(htmlOk(p.html) && p.preflight){
          fs.mkdirSync(path.dirname(out),{recursive:true});
          fs.writeFileSync(`${out}.preflight.json`,`${JSON.stringify(p.preflight,null,2)}\n`);
          fs.writeFileSync(out,p.html);
          writeRouting();
          return `OK ${t.n} (${p.html.length}b, ${fin}) [${primitive}]`;
        }
      }
      if(a===5) return ARM==='control'
        ? `FAIL ${t.n} finish=${fin} len=${h.length} (incomplete/no-html)`
        : `FAIL ${t.n} finish=${fin} len=${h.length} (incomplete/no-html/no-preflight)`;
    }catch(e){ clearTimeout(to); if(a===5) return `ERR ${t.n} ${e.message}`; }
    await new Promise(s=>setTimeout(s,5000*a));
  }
}
for(const t of spec.treatments){ console.log(new Date().toISOString().slice(11,19), await gen(t)); }
console.log('DONE');
