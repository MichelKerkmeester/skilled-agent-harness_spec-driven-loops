import re
from pathlib import Path

repo = Path('.')
phase = repo / 'specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment'
lines = (phase / 'plan.md').read_text().split('\n')

start = next(i for i, l in enumerate(lines) if l.startswith('### 3.11 '))
end = next(i for i, l in enumerate(lines) if l.startswith('#### V1:'))
section = lines[start:end]

edits = []
current_file = None
i = 0
while i < len(section):
    line = section[i]
    m = re.match(r'^#### E\d+: `([^`]+)`', line)
    if m:
        current_file = m.group(1)
        i += 1
        continue
    if re.match(r'^E\d+\.\d+ ', line):
        old_idx = next(j for j in range(i, len(section)) if section[j] == 'Old text:')
        new_idx = next(j for j in range(old_idx, len(section)) if section[j] == 'New text:')

        def block(after):
            first = after + 1
            while section[first].strip() == '':
                first += 1
            fence_line = section[first]
            ticks = len(fence_line) - len(fence_line.lstrip('`'))
            fence = '`' * ticks
            body = []
            k = first + 1
            while section[k] != fence:
                body.append(section[k])
                k += 1
            return '\n'.join(body)

        edits.append((line.split(' ', 1)[0], current_file, block(old_idx), block(new_idx)))
        i = new_idx
    i += 1

print(f"parsed {len(edits)} edits")

texts = {}
results = []
for label, rel, old, new in edits:
    if rel not in texts:
        texts[rel] = (repo / rel).read_text()
    count = texts[rel].count(old)
    if count != 1:
        results.append(f"{label} {rel}: old text found {count} times")
        continue
    texts[rel] = texts[rel].replace(old, new, 1)
    results.append(f"{label} {rel}: APPLIED")

out = phase / 'scratch/test/edited'
out.mkdir(parents=True, exist_ok=True)
for rel, text in texts.items():
    name = rel.replace('/', '__')
    (out / name).write_text(text)
(out / 'results.txt').write_text('\n'.join(results) + '\n')
print('\n'.join(results))
