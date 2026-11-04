"""List prose lines removed from changed Markdown files under a directory whose text no longer appears in the file."""
import subprocess, sys, re, os
BASE = os.environ.get('BASE', 'HEAD')
def targets(arg):
    """A directory, or @<file> listing paths one per line."""
    if arg.startswith('@'):
        return [l.strip() for l in open(arg[1:]) if l.strip()]
    return [arg]
def norm(s):
    s = re.sub(r'[*_`>#|]', ' ', s); s = re.sub(r'^\s*(?:[-+]|\d+\.)\s+', ' ', s)
    return re.sub(r'\s+', ' ', s).strip().lower()
total = 0
for f in subprocess.run(['git', 'diff', '--name-only', BASE, '--', *targets(sys.argv[1])], capture_output=True, text=True).stdout.split():
    if not f.endswith('.md') or '/changelog/' in f: continue
    diff = subprocess.run(['git', 'diff', '-U0', BASE, '--', f], capture_output=True, text=True).stdout
    try: now = norm(open(f).read().replace('\n', ' '))
    except FileNotFoundError: continue
    for l in diff.split('\n'):
        if not l.startswith('-') or l.startswith('---'): continue
        n = norm(l[1:])
        if len(n) < 25 or n.startswith(('title:', 'description:', 'version:')): continue
        parts = [p for p in re.split(r'(?<=[.;:])\s+', n) if len(p) >= 20]
        missing = [p for p in parts if p.rstrip('.;:') not in now]
        if missing: total += 1; print(f'LOST {f}: {l[1:].strip()[:220]}')
print(f'lost_lines={total}')
