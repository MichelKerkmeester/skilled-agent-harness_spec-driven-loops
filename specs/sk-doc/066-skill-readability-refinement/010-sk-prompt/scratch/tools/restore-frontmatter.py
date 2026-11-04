"""Put back the HEAD frontmatter of every changed Markdown file under a directory, keeping the edited body."""
import subprocess, sys, re
def targets(arg):
    """A directory, or @<file> listing paths one per line."""
    if arg.startswith('@'):
        return [l.strip() for l in open(arg[1:]) if l.strip()]
    return [arg]
d = sys.argv[1]; n = 0
for f in subprocess.run(['git', 'diff', '--name-only', 'HEAD', '--', *targets(d)], capture_output=True, text=True).stdout.split():
    if not f.endswith('.md'): continue
    old = subprocess.run(['git', 'show', f'HEAD:{f}'], capture_output=True, text=True)
    if old.returncode: continue
    om = re.match(r'---\n.*?\n---\n', old.stdout, re.S); cur = open(f).read(); cm = re.match(r'---\n.*?\n---\n', cur, re.S)
    if not om or not cm or om.group(0) == cm.group(0): continue
    open(f, 'w').write(om.group(0) + cur[cm.end():]); n += 1; print(f'restored {f}')
print(f'restored={n}')
