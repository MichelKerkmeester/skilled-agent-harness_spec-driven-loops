import re,subprocess,os,sys
root=os.getcwd()
skill=os.path.join(root,'.skilled/skills/system-spec-kit')
out=subprocess.check_output(['git','-c','core.fsmonitor=false','show','--name-status','--format=','0266893597'],text=True)
files=[l.split('\t')[1] for l in out.splitlines() if l.startswith('A\t') and l.split('\t')[1].startswith('.skilled/')]
EXT=r'(?:md|sh|ts|tsx|js|cjs|mjs|json|py|tmpl|txt|yaml|yml)'
tot=ok=0;bad=[]
for f in files:
    d=os.path.dirname(os.path.join(root,f))
    t=open(f,encoding='utf-8').read()
    refs=set()
    for m in re.finditer(r'\]\(([^)\s]+)\)',t):
        r=m.group(1)
        if r.startswith(('http:','https:','mailto:','#')): continue
        refs.add(r.split('#')[0])
    for m in re.finditer(r'`([^`\s]+)`',t):
        r=m.group(1).split('=',1)[-1]
        if '/' in r and re.search(r'\.'+EXT+r'$',r) and not re.search(r'[<>*{}$|]',r) and not r.startswith(('http','node_modules')):
            refs.add(r)
    refs.discard('')
    for r in sorted(refs):
        tot+=1
        cands=[os.path.join(d,r),os.path.join(root,r),os.path.join(skill,r),os.path.join(skill,'feature-catalog',r),os.path.join(skill,'manual-testing-playbook',r)]
        if any(os.path.exists(c) for c in cands): ok+=1
        else: bad.append((f,r))
print('files',len(files))
print('refs',tot,'resolved',ok,'unresolved',len(bad))
for f,r in bad: print('UNRESOLVED',f.split('system-spec-kit/')[-1],'->',r)
