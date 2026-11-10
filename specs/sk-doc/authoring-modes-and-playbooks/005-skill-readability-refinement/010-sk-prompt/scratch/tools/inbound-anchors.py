"""For each scope file, list heading anchors that other files link to (these headings must keep their text)."""
import re, sys, pathlib, subprocess
root = pathlib.Path('.').resolve()
scope = {str((root / l.strip()).resolve()) for l in open(sys.argv[1]) if l.strip()}
link = re.compile(r'\]\(([^)\s#]*)#([^)\s]+)\)')
hits = {}
for f in subprocess.run(['git', 'ls-files', '*.md'], capture_output=True, text=True).stdout.split():
    if f.startswith(('specs/', '.hermes/')) or '/changelog/' in f: continue
    p = root / f
    if not p.is_file(): continue
    for path, frag in link.findall(p.read_text(errors='ignore')):
        tgt = str((p.parent / path).resolve()) if path else str(p.resolve())
        if tgt in scope and tgt != str(p.resolve()):
            hits.setdefault(tgt, set()).add(frag)
for t in sorted(hits):
    print(f"{pathlib.Path(t).relative_to(root)}: {', '.join('#' + a for a in sorted(hits[t]))}")
# Plain-text references by number ("section 4 of improvement-checklist.md", "SKILL.md §3") also break when a
# section moves, so list every line outside the file that names a scope file next to a section number.
num = re.compile(r'(?:§\s*\d+|\b[Ss]ection \d+|\b[Ll]ines? \d+)')
names = {pathlib.Path(s).name: s for s in scope}
textual = {}
for f in subprocess.run(['git', 'ls-files', '*.md'], capture_output=True, text=True).stdout.split():
    if f.startswith(('specs/', '.hermes/')) or '/changelog/' in f: continue
    p = root / f
    if not p.is_file(): continue
    for i, line in enumerate(p.read_text(errors='ignore').split('\n'), 1):
        if not num.search(line): continue
        for n, s in names.items():
            if n in line and str(p.resolve()) != s and (pathlib.Path(s).parent.name in line or n not in ('SKILL.md', 'README.md', 'ROUTER.md') or s.startswith(str(p.parent.resolve()))):
                textual.setdefault(s, []).append(f'{f}:{i}')
for t in sorted(textual):
    print(f"{pathlib.Path(t).relative_to(root)}: numbered-section or line references (keep section numbers and the cited lines in place, or update each) at {', '.join(textual[t][:30])}")
