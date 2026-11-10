"""Give the surface packet SKILL.md files one integer-numbered section order with SMART ROUTING third."""
import re, pathlib
K = pathlib.Path('.skilled/skills/sk-code')
def split(t):
    # sections: preamble, then chunks starting at '## N.' headings (divider lines stay with the previous chunk)
    parts = re.split(r'(?m)^(?=## )', t)
    return parts[0], parts[1:]
def num(h): return re.match(r'## ([0-9]+[a-z]?)\. ', h).group(1)
def renumber(chunks):
    out = []
    for i, c in enumerate(chunks, 1):
        out.append(re.sub(r'^## [0-9]+[a-z]?\. ', f'## {i}. ', c, count=1))
    return out
def ensure_divider(chunk):
    body = chunk.rstrip('\n')
    if not body.endswith('\n---'):
        body += '\n\n---'
    return body + '\n\n'
for rel in ['sk-code-ci/SKILL.md', 'sk-code-skilled/SKILL.md']:
    p = K / rel; pre, ch = split(p.read_text())
    i = next(j for j, c in enumerate(ch) if c.startswith('## 2b. SMART ROUTING'))
    ch[i - 1] = ensure_divider(ch[i - 1])
    p.write_text(pre + ''.join(renumber(ch))); print('renumbered', rel)
p = K / 'sk-code-frontend/SKILL.md'; pre, ch = split(p.read_text())
i = next(j for j, c in enumerate(ch) if re.match(r'## [0-9]+\. SMART ROUTING', c))
sr = ch.pop(i)
last_was_final = i == len(ch)
ch = [ensure_divider(c) for c in ch]
sr = sr.rstrip('\n') + '\n\n---\n\n'
ch.insert(2, sr)
ch[-1] = re.sub(r'\n+---\n*$', '\n', ch[-1])
p.write_text(pre + ''.join(renumber(ch))); print('moved SMART ROUTING in', 'sk-code-frontend/SKILL.md')
t = K / 'sk-code-skilled/scripts/tests/quality-checklist-map.test.cjs'; s = t.read_text()
assert s.count("'## 5. QUALITY CHECKLIST MAP'") == 1
t.write_text(s.replace("'## 5. QUALITY CHECKLIST MAP'", "'## 6. QUALITY CHECKLIST MAP'")); print('updated test literal')
