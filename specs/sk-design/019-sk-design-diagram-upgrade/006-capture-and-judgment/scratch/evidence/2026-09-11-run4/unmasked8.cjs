'use strict';
// Find arrow labels that carry NO mask rect and still sit on or near a connector.
// Text boxes come from a live getBBox in user units (same space as the connector coords),
// so no capture-pixel mapping is involved and the chrome-subtraction trap cannot apply.
const fs = require('fs'), os = require('os'), path = require('path'), { execFileSync } = require('child_process');
const BROWSER = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ROOT = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-design/sk-design-diagram';
const DIR = path.join(ROOT, 'assets/diagrams');

const PROBE = `<script>window.addEventListener('load',function(){setTimeout(function(){
  var out=[];
  document.querySelectorAll('svg').forEach(function(svg){
    svg.querySelectorAll('text').forEach(function(t){
      var b; try { b=t.getBBox(); } catch(e){ return; }
      var prev=t.previousElementSibling;
      var masked=false;
      if (prev && prev.tagName.toLowerCase()==='rect'){
        var f=(prev.getAttribute('fill')||'').toLowerCase();
        var cls=(prev.getAttribute('class')||'');
        if (/label/.test(cls)&&/mask/.test(cls)) masked=true;
        if (/^(#f5f5f5|#ececec|#141414|#2d3142|var\\(--(?:color-)?paper(?:-2)?\\))$/.test(f)) masked=true;
      }
      out.push({text:(t.textContent||'').trim().slice(0,24),x:+b.x.toFixed(2),y:+b.y.toFixed(2),w:+b.width.toFixed(2),h:+b.height.toFixed(2),masked:masked});
    });
  });
  var m=document.createElement('meta'); m.name='probe'; m.content=encodeURIComponent(JSON.stringify(out)); document.head.appendChild(m);
},400);});</script>`;

function probe(src){
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(),'probe-'));
  try{
    const p = path.join(tmp,'p.html');
    const h = fs.readFileSync(src,'utf8'); const i = h.lastIndexOf('</body>');
    fs.writeFileSync(p, i===-1? h+PROBE : h.slice(0,i)+PROBE+h.slice(i));
    const dom = execFileSync(BROWSER,['--headless','--disable-gpu','--hide-scrollbars','--window-size=1280,900','--virtual-time-budget=2500','--dump-dom',`file://${p}`],{encoding:'utf8',maxBuffer:32*1024*1024,timeout:60000,stdio:['ignore','pipe','ignore']});
    const m = dom.match(/<meta[^>]*name="probe"[^>]*content="([^"]*)">/);
    return m? JSON.parse(decodeURIComponent(m[1])) : null;
  } catch(e){ return null; } finally { fs.rmSync(tmp,{recursive:true,force:true}); }
}

// connector segments, reusing the family's parser
const famSrc = fs.readFileSync(path.join(ROOT,'scripts/families/label-mask-clearance.cjs'),'utf8');
const ARITY_SRC = famSrc.match(/const ARITY = \{[^}]*\};/)[0];
const segFn = new Function(ARITY_SRC + '\nreturn ' + famSrc.match(/function segmentsOf\(d\)[\s\S]*?\n}/)[0])();
const attr=(a,n)=>(new RegExp(`\\b${n}\\s*=\\s*"([^"]*)"`).exec(a)||[])[1];
function connectors(markup){
  const out=[]; const re=/<(line|path)\b([^>]*?)\/?>/g; let m;
  while((m=re.exec(markup))!==null){
    const tag=m[1], a=m[2];
    const isC = /\bmarker-\w+\s*=/.test(a) || /(connector|arrow|edge|link|flow)/.test(attr(a,'class')||'');
    if(!isC) continue;
    const segs = tag==='line'
      ? [{x1:+attr(a,'x1'),y1:+attr(a,'y1'),x2:+attr(a,'x2'),y2:+attr(a,'y2')}]
      : segFn(attr(a,'d')||'');
    if(segs && segs.every(s=>[s.x1,s.y1,s.x2,s.y2].every(Number.isFinite))) out.push({segs, where: tag==='line'?`line ${attr(a,'x1')},${attr(a,'y1')}->${attr(a,'x2')},${attr(a,'y2')}`:`path "${String(attr(a,'d')).slice(0,34)}"`});
  }
  return out;
}
function gap(seg,r){
  let best=Infinity;
  for(let i=0;i<=64;i++){const t=i/64;const px=seg.x1+(seg.x2-seg.x1)*t,py=seg.y1+(seg.y2-seg.y1)*t;
    const dx=px<r.x?r.x-px:px>r.x+r.w?px-(r.x+r.w):0, dy=py<r.y?r.y-py:py>r.y+r.h?py-(r.y+r.h):0;
    best=Math.min(best,Math.hypot(dx,dy));}
  return best;
}
const files = fs.readdirSync(DIR).filter(f=>f.endsWith('.html')).sort();
const hits=[];
for(const f of files){
  const full=path.join(DIR,f);
  const html=fs.readFileSync(full,'utf8');
  const s=html.indexOf('<svg'), e=html.lastIndexOf('</svg>');
  const markup = s===-1?'':html.slice(s,e+6);
  const conns = connectors(markup);
  if(!conns.length) continue;
  const texts = probe(full);
  if(!texts){ console.log(`  ${f}: PROBE FAILED`); continue; }
  for(const t of texts){
    if(t.masked) continue;
    if(!t.w || !t.h) continue;
    const r={x:t.x,y:t.y,w:t.w,h:t.h};
    let best=Infinity, which=null;
    for(const c of conns) for(const sg of c.segs){ const g=gap(sg,r); if(g<best){best=g;which=c.where;} }
    if(best < 8) hits.push({file:f,text:t.text,box:[t.x,t.y,t.w,t.h],gap:+best.toFixed(2),connector:which});
  }
}
for(const h of hits) console.log(`${h.file}: unmasked text "${h.text}" bbox ${h.box.join(',')} is ${h.gap}px from ${h.connector}`);
console.log(`\n${hits.length} unmasked label(s) within 4 units of a connector, across ${files.length} files`);
