"""Check that every relative Markdown link into a scope file, and every link out of one, resolves to a file and heading."""
import re, sys, pathlib, subprocess
root = pathlib.Path('.').resolve()
scope = {(root / l.strip()).resolve() for l in open(sys.argv[1]) if l.strip()}
def slug(h):
    s = re.sub(r'[^\w\- ]', '', h.strip().lower()); return s.replace(' ', '-')
cache = {}
def anchors(p):
    if p not in cache:
        out, fence = set(), False
        for line in p.read_text(errors='ignore').split('\n'):
            if line.startswith('```'): fence = not fence
            if fence: continue
            m = re.match(r'^#{1,6} (.+)$', line)
            if m: out.add(slug(re.sub(r'[`*]', '', m.group(1))))
        cache[p] = out
    return cache[p]
link = re.compile(r'\]\(([^)\s]+?)\)')
bad = checked = 0
for f in subprocess.run(['git', 'ls-files', '*.md'], capture_output=True, text=True).stdout.split():
    if f.startswith(('specs/', '.hermes/')) or '/changelog/' in f: continue
    p = (root / f).resolve()
    if not p.is_file(): continue
    fence = False
    for i, line in enumerate(p.read_text(errors='ignore').split('\n'), 1):
        if line.startswith('```'): fence = not fence
        if fence: continue
        for tgt in link.findall(re.sub(r'`[^`]*`', '', line)):
            if re.match(r'^[a-z]+:', tgt) or tgt.startswith('/'): continue
            path, _, frag = tgt.partition('#')
            dest = (p.parent / path).resolve() if path else p
            if p not in scope and dest not in scope: continue
            checked += 1
            if not dest.exists() or (frag and dest.suffix == '.md' and dest.is_file() and frag.lower() not in anchors(dest)):
                bad += 1; print(f'BROKEN {f}:{i} -> {tgt}')
print(f'checked={checked} broken={bad}')
