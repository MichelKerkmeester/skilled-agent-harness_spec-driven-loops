"""List changed Markdown files under a directory whose frontmatter differs from HEAD, ignoring the version line."""
import subprocess, sys, re
def targets(arg):
    """A directory, or @<file> listing paths one per line."""
    if arg.startswith('@'):
        return [l.strip() for l in open(arg[1:]) if l.strip()]
    return [arg]
d = sys.argv[1]
files = subprocess.run(['git', 'diff', '--name-only', 'HEAD', '--', *targets(d)], capture_output=True, text=True).stdout.split()
def fm(text):
    m = re.match(r'---\n(.*?)\n---\n', text, re.S)
    return [l for l in (m.group(1).split('\n') if m else []) if not l.startswith('version:')]
bad = 0
for f in files:
    if not f.endswith('.md'): continue
    old = subprocess.run(['git', 'show', f'HEAD:{f}'], capture_output=True, text=True)
    if old.returncode: continue
    if fm(old.stdout) != fm(open(f).read()):
        bad += 1; print(f'FRONTMATTER-CHANGED {f}')
print(f'frontmatter_changed={bad}')
