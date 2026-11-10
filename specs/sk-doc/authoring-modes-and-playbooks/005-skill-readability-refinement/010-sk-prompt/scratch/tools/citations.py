"""Report source citations, such as "(research: ...)", "(docs: ...)" or "[SOURCE: ...]", present at HEAD but missing now."""
import subprocess, sys, re, os
BASE = os.environ.get('BASE', 'HEAD')
def targets(arg):
    if arg.startswith('@'):
        return [l.strip() for l in open(arg[1:]) if l.strip()]
    return [arg]
cite = re.compile(r'\((?:research(?: return)?|docs?|snapshot|source|guide|quoting)\s*:[^)]*\)|\[SOURCE:[^\]]*\]', re.I)
missing = 0
for f in subprocess.run(['git', 'diff', '--name-only', BASE, '--', *targets(sys.argv[1])], capture_output=True, text=True).stdout.split():
    if not f.endswith('.md') or '/changelog/' in f: continue
    old = subprocess.run(['git', 'show', f'{BASE}:{f}'], capture_output=True, text=True)
    if old.returncode or not os.path.exists(f): continue
    now = open(f).read()
    for c in sorted(set(cite.findall(old.stdout))):
        if c not in now: missing += 1; print(f'CITATION-MISSING {f}: {c[:160]}')
print(f'citations_missing={missing}')
