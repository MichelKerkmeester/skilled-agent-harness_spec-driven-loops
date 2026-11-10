"""Print the HEAD and current intro (the first paragraph after the H1) of every changed Markdown file under a directory."""
import subprocess, sys, re, os
BASE = os.environ.get('BASE', 'HEAD')
def targets(arg):
    """A directory, or @<file> listing paths one per line."""
    if arg.startswith('@'):
        return [l.strip() for l in open(arg[1:]) if l.strip()]
    return [arg]
def intro(t):
    m = re.search(r'^# [^\n]+\n+((?:(?!#|---|<!--)[^\n]+\n?)+)', t, re.M)
    return m.group(1).strip() if m else ''
for f in subprocess.run(['git', 'diff', '--name-only', BASE, '--', *targets(sys.argv[1])], capture_output=True, text=True).stdout.split():
    if not f.endswith('.md'): continue
    o = subprocess.run(['git', 'show', f'{BASE}:{f}'], capture_output=True, text=True)
    if o.returncode: continue
    a, b = intro(o.stdout), intro(open(f).read())
    if a != b: print(f'== {f}\n  HEAD: {a}\n  NOW:  {b}')
