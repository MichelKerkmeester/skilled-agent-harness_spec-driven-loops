import os,re,sys,json
EXT=('.ts','.js','.cjs','.mjs')
num=re.compile(r'^\s*(//|/\*)?\s*\d+\.\s+[A-Z][A-Z0-9 &/_-]{2,}\s*$',re.M)
std_line=re.compile(r'^// ─{20,}\s*$',re.M)
std_block=re.compile(r'^/\* ─{20,}',re.M)
alt=re.compile(r'^\s*//\s*[-=*#]{5,}|^\s*/\*\s*[-=*]{5,}|^//\s*─+\s+\S.*─+\s*$|^\s*//\s*#?region\b',re.M)
out={}
for s in ['system-skill-advisor','system-spec-kit','system-deep-loop']:
  R=f'.skilled/skills/{s}/runtime'; st=dict(files=0,header=0,big=0,big_nonum=0,alt=0,mixed=0,tests=0); ex={'big_nonum':[],'alt':[]}
  for d,ds,fs in os.walk(R):
    ds[:]=[x for x in ds if x not in('node_modules','dist')]
    for f in fs:
      if not f.endswith(EXT) or f.endswith('.d.ts'): continue
      p=os.path.join(d,f); t=open(p,errors='ignore').read(); st['files']+=1
      if re.search(r'\.(test|vitest|spec)\.',f) or '/tests' in d: st['tests']+=1
      if re.search(r'(MODULE|COMPONENT):','\n'.join(t.splitlines()[:40])): st['header']+=1
      if alt.search(t): st['alt']+=1; ex['alt'].append(p)
      if std_line.search(t) and std_block.search(t): st['mixed']+=1
      if t.count('\n')>150:
        st['big']+=1
        if not num.search(t): st['big_nonum']+=1; ex['big_nonum'].append(p)
  out[s]=st; print(s,st); print('  e.g. big_nonum:',ex['big_nonum'][:3]); print('  e.g. alt:',ex['alt'][:3])
