'use strict';
// Where does a label mask sit relative to the BOXES around it? Two faults live here and no
// rule measures either: a mask that overruns a box border (erasing it, since labels paint
// before boxes only sometimes), and a label glyph that ends up hard against a box edge.
const fs=require('fs'), path=require('path');
const ROOT='/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-design/sk-design-diagram';
const DIR=path.join(ROOT,'assets/diagrams');
const GROUND=/^(#f5f5f5|#ececec|#141414|#2d3142|var\(--(?:color-)?paper(?:-2)?\))$/i;
const attr=(a,n)=>(new RegExp(`\\b${n}\\s*=\\s*"([^"]*)"`).exec(a)||[])[1];
const files=fs.readdirSync(DIR).filter(f=>f.endsWith('.html')).sort();
const rows=[];
for(const f of files){
  const html=fs.readFileSync(path.join(DIR,f),'utf8');
  const s=html.indexOf('<svg'), e=html.lastIndexOf('</svg>');
  if(s===-1) continue;
  const markup=html.slice(s,e+6);
  const rects=[]; const masks=[];
  const re=/<rect\b([^>]*?)\/?>(\s*)(<text\b)?/g; let m;
  while((m=re.exec(markup))!==null){
    const a=m[1];
    const r={x:+attr(a,'x'),y:+attr(a,'y'),w:+attr(a,'width'),h:+attr(a,'height'),
             fill:attr(a,'fill')||'', cls:attr(a,'class')||'', stroke:attr(a,'stroke')||''};
    if(![r.x,r.y,r.w,r.h].every(Number.isFinite)) continue;
    const named=/label/.test(r.cls)&&/mask/.test(r.cls);
    const shaped=GROUND.test(r.fill)&&r.h<=24&&r.w<=240&&!!m[3];
    if(named||shaped) masks.push(r); else rects.push(r);
  }
  for(const k of masks){
    for(const b of rects){
      if(b.w<40||b.h<24) continue;                 // only real boxes/zones
      if(!b.stroke || b.stroke==='none') continue;  // only ones with a drawn border
      // does the mask's span cross one of the box's four border lines?
      // Only a mask that STRADDLES a border line erases it; sitting inside a zone is fine.
      const edges=[['left',b.x],['right',b.x+b.w]].filter(([,vx])=>k.x<vx&&k.x+k.w>vx&&k.y<b.y+b.h&&k.y+k.h>b.y)
        .map(([n,vx])=>`${n} x=${vx} (mask spans ${Math.min(vx-k.x,k.x+k.w-vx).toFixed(1)} past it)`);
      const hedges=[['top',b.y],['bottom',b.y+b.h]].filter(([,vy])=>k.y<vy&&k.y+k.h>vy&&k.x<b.x+b.w&&k.x+k.w>b.x)
        .map(([n,vy])=>`${n} y=${vy} (mask spans ${Math.min(vy-k.y,k.y+k.h-vy).toFixed(1)} past it)`);
      const all=[...edges,...hedges];
      if(!all.length) continue;
      rows.push(`${f}: mask [${k.x},${k.y},${k.w}x${k.h}] straddles box [${b.x},${b.y},${b.w}x${b.h}] stroke=${b.stroke} -> ${all.join('; ')}`);
    }
  }
}
rows.forEach(r=>console.log(r));
console.log(`\n${rows.length} mask/box overlap(s) across ${files.length} files`);
