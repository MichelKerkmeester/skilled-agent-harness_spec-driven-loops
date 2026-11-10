import re,sys,collections
TAG=re.compile(r'opencode 1|\bv1\b|1\.19|unverified|opencode ?2|\bv2\b|opencode2',re.I)
hits=collections.defaultdict(list)
for l in open(sys.argv[1]):
    f,n,_=l.split(':',2); hits[f].append(int(n))
out=collections.Counter(); unc=[]
for f,ns in hits.items():
    L=open(f).read().split('\n')
    banner=any(TAG.search(x) for x in L[:40])
    for n in ns:
        i=n-1; cls=None
        # inside fence? find fence opening
        fence=None; inside=False
        for j in range(i):
            if L[j].lstrip().startswith('```'): inside=not inside; fence=j if inside else None
        start = fence if inside else i
        ctx=L[max(0,start-6):start]
        # nearest heading
        h=next((L[j] for j in range(i,-1,-1) if L[j].startswith('#')),'')
        # table header row: nearest line above starting with | that precedes a |--- line
        tbl=''
        if L[i].startswith('|'):
            j=i
            while j>0 and L[j-1].startswith('|'): j-=1
            tbl=L[j]
        if any(TAG.search(x) for x in ctx): cls='fence/para-context'
        elif TAG.search(h): cls='heading'
        elif TAG.search(tbl): cls='table-header'
        elif banner: cls='banner-only'
        else: cls='UNCOVERED'
        out[cls]+=1
        if cls in('UNCOVERED','banner-only'): unc.append(f"{cls}\t{f}:{n}\t{L[i][:160]}")
print(dict(out))
open(sys.argv[2],'w').write('\n'.join(unc)+'\n')
