// Expands every contract asset path and stats the result. Placeholder vocabulary:
//   <name>/<action>/<command>/<entry> -> the family's router command names
//   <target>                          -> the doctor route manifest's target names
//   <sub>                             -> the mcp router's two sub-actions
const fs=require('fs'),path=require('path');
const R=process.cwd();
const c=JSON.parse(fs.readFileSync('.opencode/skills/sk-doc/sk-create-command/assets/command-contract.json','utf8'));
const routeTargets=fs.readFileSync('.opencode/commands/doctor/_routes.yaml','utf8')
  .split('\n').map(l=>l.match(/^\s*- target:\s*(\S+)/)).filter(Boolean).map(m=>m[1]);
let checked=0, missing=0;
for(const [fam,fc] of Object.entries(c.families)){
  const rp=fc.router_path;
  let cmds=[];
  if(Array.isArray(rp)) cmds=rp.map(p=>path.basename(p,'.md'));
  else { const d=path.join(R,'.opencode/commands',fam);
    if(fs.existsSync(d)) cmds=fs.readdirSync(d).filter(f=>f.endsWith('.md')).map(f=>f.slice(0,-3)); }
  if(!cmds.length){ console.log(`MISSING-FAMILY ${fam}: router_path resolves to no files`); missing++; continue; }
  const paths=[];
  for(const a of (fc.owned_assets||[])) paths.push(a.path);
  for(const t of (fc.execution_targets||[])) paths.push(t.target);
  for(let raw of paths){
    const p=raw.split(' (')[0];
    if(!p.startsWith('.opencode/commands/') || !/\.(txt|ya?ml)$/.test(p)) continue;
    const ph=p.match(/<([^>]+)>/);
    let expansions;
    if(!ph) expansions=[p];
    else if(ph[1]==='target') expansions=routeTargets.map(t=>p.replace(/<[^>]+>/,t));
    else if(ph[1]==='sub') expansions=['install','debug'].map(t=>p.replace(/<[^>]+>/,t));
    else expansions=cmds.map(cm=>p.replace(/<[^>]+>/,cm));
    for(const t of expansions){
      checked++;
      if(!fs.existsSync(path.join(R,t))){ console.log(`MISSING ${fam}: ${t}`); missing++; }
    }
  }
}
console.log(`contract asset paths checked=${checked} missing=${missing}`);
process.exit(missing?1:0);
