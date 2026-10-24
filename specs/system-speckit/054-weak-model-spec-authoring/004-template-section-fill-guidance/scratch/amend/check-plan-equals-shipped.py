import re,sys
plan='specs/system-speckit/054-weak-model-spec-authoring/004-template-section-fill-guidance/plan.md'
root='.skilled/skills/system-spec-kit/templates/'
rows=[]
for l in open(plan,encoding='utf-8'):
    m=re.match(r'^\| ([ABC]\d\d) \| `([^`]+)` \| `(.+?)` \| (.*) \|$',l.rstrip('\n'))
    if m: rows.append(m.groups())
core=[r for r in rows if r[1].startswith('core/')]
print('rows total',len(rows),'core rows',len(core))
bad=0
seen={}
for rid,f,h,rest in core:
    cells=re.split(r'(?<!\\) \| ',rest)
    cells=[c.replace('\\|','|') for c in cells]
    assert len(cells)==3,(rid,cells)
    ins,good,weak=cells
    want=('<!-- FILL: %s -->'%ins) if (good,weak)==('-','-') else '<!-- FILL: %s GOOD: %s WEAK: %s -->'%(ins,good,weak)
    lines=open(root+f+('' if f.endswith('.tmpl') else ''),encoding='utf-8').read().split('\n')
    idx=[i for i,l in enumerate(lines) if l==h]
    if len(idx)!=1:
        # heading may repeat; take the one that has a fill below
        print('HEADING COUNT',rid,h,len(idx)); bad+=1; continue
    got=lines[idx[0]+1]
    if got!=want:
        print('MISMATCH',rid,h); print(' want',want); print(' got ',got); bad+=1
    seen[(f,h)]=1
# every FILL line in the 4 core templates is covered
for f in ['spec','plan','tasks','implementation-summary']:
    lines=open(root+'core/%s.md.tmpl'%f,encoding='utf-8').read().split('\n')
    n=0;cov=0;fence=False
    for i,l in enumerate(lines):
        if l.startswith('<!-- FILL: '):
            n+=1
            if any(r[1]=='core/%s.md.tmpl'%f and lines[i-1]==r[2] for r in core): cov+=1
            else: print('UNCOVERED',f,i+1,lines[i-1]); bad+=1
    print(f,'fill lines',n,'covered',cov)
print('PLAN_EQUALS_SHIPPED' if bad==0 else 'PLAN_DIFFERS bad=%d'%bad)
sys.exit(1 if bad else 0)
