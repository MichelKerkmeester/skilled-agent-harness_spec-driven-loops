"""List a leaf's in-scope docs. kind: whole (the skill), hub (root files + shared/, not mode dirs), mode (one mode dir)."""
import os, subprocess, sys
skill, kind = sys.argv[1], sys.argv[2]   # skill: repo-relative dir of the skill or mode
SKIP = ('/changelog/', '/manual-testing-playbook/', '/feature-catalog/', '/benchmark/', '/tests/', '/node_modules/', '/fixtures/')
files = subprocess.run(['git', 'ls-files', '--', f'{skill}/*.md', f'{skill}/**/*.md'], capture_output=True, text=True).stdout.split()
modes = set()
if kind == 'hub':
    for d in os.listdir(skill):
        if os.path.isfile(os.path.join(skill, d, 'SKILL.md')): modes.add(d)
out = []
for f in files:
    rel = f[len(skill) + 1:]
    if any(s in '/' + rel for s in SKIP) or os.path.islink(f): continue
    top = rel.split('/')[0]
    if kind == 'hub' and top in modes: continue
    if '/' not in rel:
        if rel in ('SKILL.md', 'ROUTER.md', 'README.md'): out.append(f)
        continue
    if top in ('references', 'assets', 'shared'): out.append(f)
print('\n'.join(sorted(out)))
