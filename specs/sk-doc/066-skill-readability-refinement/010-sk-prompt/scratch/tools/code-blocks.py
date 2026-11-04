"""Check, or with --restore put back, the fenced code blocks of changed Markdown files under a directory to their HEAD text.

A block the orchestrator approved after reading it, such as a structure tree gaining a missing file,
is listed verbatim in approved-blocks.md beside the @scope file and counts as unchanged.
"""
import subprocess, sys, re, os
def targets(arg):
    """A directory, or @<file> listing paths one per line."""
    if arg.startswith('@'):
        return [l.strip() for l in open(arg[1:]) if l.strip()]
    return [arg]
d = sys.argv[1]; restore = '--restore' in sys.argv
fence = re.compile(r'^(```+|~~~+)[^\n]*\n.*?^\1[ \t]*$', re.S | re.M)
changed = mism = 0
allowed = set()
if d.startswith('@'):
    ap = os.path.join(os.path.dirname(d[1:]), 'approved-blocks.md')
    if os.path.exists(ap): allowed = {m.group(0) for m in fence.finditer(open(ap).read())}
for f in subprocess.run(['git', 'diff', '--name-only', 'HEAD', '--', *targets(d)], capture_output=True, text=True).stdout.split():
    if not f.endswith('.md'): continue
    old = subprocess.run(['git', 'show', f'HEAD:{f}'], capture_output=True, text=True)
    if old.returncode: continue
    ob = [m.group(0) for m in fence.finditer(old.stdout)]; cur = open(f).read(); cb = list(fence.finditer(cur))
    pool = list(ob); edited = []
    for m in cb:
        if m.group(0) in pool: pool.remove(m.group(0))
        else: edited.append(m)
    if allowed and len(edited) == len(pool):
        keep = [(m, o) for m, o in zip(edited, pool) if m.group(0) not in allowed]
        edited = [m for m, _ in keep]; pool = [o for _, o in keep]
    if not edited and not pool: continue
    if len(edited) != len(pool):
        mism += 1; print(f'BLOCK-COUNT {f} edited={len(edited)} missing={len(pool)}'); continue
    changed += 1; print(f'BLOCK-CHANGED {f} edited={len(edited)}')
    if restore:
        out, last = [], 0
        for m, orig in zip(edited, pool):
            out.append(cur[last:m.start()]); out.append(orig); last = m.end()
        out.append(cur[last:]); open(f, 'w').write(''.join(out))
print(f'code_blocks_changed={changed} block_count_mismatch={mism}{" restored" if restore and changed else ""}')
