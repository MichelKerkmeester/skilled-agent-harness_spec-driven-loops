import re,sys
lines=open(sys.argv[1]).read().split('\n')
start=next(i for i,l in enumerate(lines) if l.startswith('Total unique variables documented'))
def cells(l): return [c.strip() for c in re.split(r'(?<!\\)\|', l.strip().strip('|'))]
strict=set(); gov=set(); i=start+1; per=[]
while i<len(lines):
    l=lines[i]
    if l.startswith('|') and i+1<len(lines) and re.match(r'^\|\s*:?-+',lines[i+1]):
        hdr=cells(l); col=None; kind=None
        if 'Variable' in hdr: col=hdr.index('Variable'); kind='Variable'
        elif 'governing env var' in hdr: col=hdr.index('governing env var'); kind='gov'
        j=i+2; n=0
        while j<len(lines) and lines[j].startswith('|'):
            if col is not None:
                c=cells(lines[j])
                if col<len(c):
                    names=re.findall(r'`([^`]+)`',c[col])
                    for nm in names:
                        (strict if kind=='Variable' else gov).add(nm); n+=1
            j+=1
        per.append((i+1,kind,n)); i=j; continue
    i+=1
print('tables',per)
print('Variable-column unique:',len(strict))
print('plus governing-env-var column:',len(strict|gov))
print(sorted(gov-strict))
bad=[n for n in strict if not re.fullmatch(r'[A-Z][A-Z0-9_]*',n)]
print('non-identifier tokens in Variable column:',bad)
