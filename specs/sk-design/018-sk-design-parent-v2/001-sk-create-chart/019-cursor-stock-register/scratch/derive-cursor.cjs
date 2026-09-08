const { contrast } = require(process.cwd() + '/.opencode/skills/sk-design/sk-design-chart/scripts/color-gates.cjs');
const hex = (r,g,b)=>'#'+[r,g,b].map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('').toUpperCase();
const rgb = h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const mix=(a,b,t)=>{const A=rgb(a),B=rgb(b);return hex(...A.map((v,i)=>v+(B[i]-v)*t));};
const toward=(v,ground,target,to)=>{if(contrast(v,ground)>=target)return v;let lo=0,hi=1,ans=v;for(let i=0;i<40;i++){const m=(lo+hi)/2;const c=mix(v,to,m);if(contrast(c,ground)>=target){ans=c;hi=m;}else lo=m;}return ans;};
const P='#F7F7F4', INK='#26251E', EMBER='#F54E00', VERDANT='#1F8A65', CRIMSON='#CF2D56', AMBER='#C08532', FOREST='#34785C', ASH='#7A7974', DRIFT='#84847E', MIST='#A1A19F', STONE='#CDCDC9', LINEN='#E6E5E0', BONE='#F2F1ED';
const r=(a,b)=>contrast(a,b).toFixed(2);
console.log('light chrome', {surface:P, ink:INK, muted:toward(ASH,P,4.5,INK), rule:STONE}, 'muted ratio', r(toward(ASH,P,4.5,INK),P));
console.log('dark chrome', {surface:INK, ink:P, muted:MIST, rule:INK+'17'}, 'mist on ink', r(MIST,INK));
const nl=[INK, toward(ASH,P,3,INK), toward(DRIFT,P,3,INK), toward(MIST,P,3,INK)]; console.log('neutral light', nl, nl.map(v=>r(v,P)), 'emph ember', r(EMBER,P), 'vs s1', r(INK,EMBER));
const nd=[P,LINEN,STONE,MIST]; console.log('neutral dark', nd, nd.map(v=>r(v,INK)), 'emph ember', r(EMBER,INK), 'vs s1', r(P,EMBER));
const cl=[EMBER,VERDANT,CRIMSON,toward(AMBER,P,3,INK)]; console.log('categorical light', cl, cl.map(v=>r(v,P)), 'emph ink vs s1', r(INK,EMBER));
const cd=[EMBER,VERDANT,CRIMSON,AMBER]; console.log('categorical dark', cd, cd.map(v=>r(v,INK)), 'emph parchment vs s1', r(P,EMBER));
// ordered ramp: 5 steps of ember, index0 furthest from ground
function ramp(ground, to){ // to = colour to mix toward for the far end
  // step0 = ember pushed toward `to` until >=3.2 on ground; then lighten toward ground with separation>=1.3, last >=1.15
  const far=toward(EMBER,ground,3.2,to); const steps=[far]; let cur=far;
  for(let i=1;i<5;i++){ let t=0; let cand=cur; for(t=0.02;t<=1;t+=0.01){cand=mix(cur,ground,t); if(contrast(cur,cand)>=1.32) break;} steps.push(cand); cur=cand; }
  return steps;
}
const ol=ramp(P,INK), od=ramp(INK,P);
console.log('ordered light', ol, ol.map(v=>r(v,P)), 'last>=1.15', r(ol[4],P)); console.log('ordered dark', od, od.map(v=>r(v,INK)));
console.log('ordered emph ink vs far', r(INK,ol[0]), 'dark emph parchment vs far', r(P,od[0]));
function rampTo(ground, targets){ return targets.map(t=>{ if(contrast(EMBER,ground)<=t) return EMBER; let lo=0,hi=1,ans=EMBER; for(let i=0;i<40;i++){const m=(lo+hi)/2;const c=mix(EMBER,ground,m); if(contrast(c,ground)>=t){ans=c;lo=m;} else hi=m;} return ans; }); }
const ol2=rampTo(P,[3.28,2.5,1.9,1.45,1.16]); console.log('ordered light v2', ol2, ol2.map(v=>r(v,P)));
const od2=rampTo(INK,[4.37,3.3,2.5,1.88,1.42]); console.log('ordered dark v2', od2, od2.map(v=>r(v,INK)));
function rampFrom(ground, to, targets){ return targets.map((t,i)=>{ const base = i===0 ? toward(EMBER,ground,t,to) : EMBER; if(i===0) return base; let lo=0,hi=1,ans=EMBER; for(let k=0;k<40;k++){const m=(lo+hi)/2;const c=mix(EMBER,ground,m); if(contrast(c,ground)>=t){ans=c;lo=m;} else hi=m;} return ans; }); }
const ol3=rampFrom(P,INK,[3.62,2.76,2.11,1.61,1.23]); console.log('OL3', JSON.stringify(ol3), ol3.map(v=>r(v,P)).join(' '));
