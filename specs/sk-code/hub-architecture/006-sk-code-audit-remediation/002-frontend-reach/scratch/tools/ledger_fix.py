"""Usage: ledger_fix.py <ledger> <json {id: evidence}>. Writes the fix-evidence cell of each named row."""
import sys,json,re
p=sys.argv[1]; E=json.load(open(sys.argv[2])); n=0; out=[]
for l in open(p).read().split('\n'):
    m=re.match(r'^\| ([A-Z]+-?\d+) \|',l)
    if m and m.group(1) in E and l.endswith('| - |'):
        e=E[m.group(1)]; assert '|' not in e.replace('\\|',''), m.group(1)
        l=l[:-len('| - |')]+f'| {e} |'; n+=1
    out.append(l)
open(p,'w').write('\n'.join(out)); print('rows',n)
