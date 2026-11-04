"""Check every relative Markdown link that targets sk-code or sk-create-skill resolves to a file and heading."""
import re, sys, pathlib, subprocess
root = pathlib.Path(sys.argv[1]).resolve()
ref_dirs = [root / ".skilled/skills/sk-code", root / ".skilled/skills/sk-doc/sk-create-skill"]
def slug(h):
    s = h.strip().lower()
    s = re.sub(r'[^\w\- ]', '', s)
    return s.replace(' ', '-')
def anchors(p):
    out, fence = set(), False
    for line in p.read_text().split('\n'):
        if line.startswith('```'): fence = not fence
        if fence: continue
        m = re.match(r'^#{1,6} (.+)$', line)
        if m: out.add(slug(re.sub(r'[`*]', '', m.group(1))))
    return out
files = subprocess.run(['git','ls-files','*.md'], cwd=root, capture_output=True, text=True).stdout.split()
bad = checked = 0
link = re.compile(r'\]\(([^)\s]+?)\)')
for f in files:
    if f.startswith('specs/') or '/z_archive/' in f or f.startswith('.hermes/'): continue
    src = root / f
    if not src.is_file(): continue
    fence = False
    for n, line in enumerate(src.read_text(errors='ignore').split('\n'), 1):
        if line.lstrip().startswith(('```', '~~~')):
            fence = not fence
            continue
        if fence: continue
        for target in link.findall(re.sub(r'`[^`]*`', '', line)):
            if target.startswith(('http', 'mailto:')): continue
            path, _, frag = target.partition('#')
            tp = (src.parent / path).resolve() if path else src.resolve()
            if not (any(str(tp).startswith(str(d)) for d in ref_dirs)): continue
            checked += 1
            if not tp.exists():
                print(f"MISSING FILE {f}:{n} -> {target}"); bad += 1; continue
            if frag and tp.suffix == '.md' and frag not in anchors(tp):
                print(f"MISSING ANCHOR {f}:{n} -> {target}"); bad += 1
print(f"checked={checked} broken={bad}")
sys.exit(1 if bad else 0)
