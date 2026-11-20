# Counts trigger-index sources that carry a v1 phrase and are neither history
# (changelog/, specs/) nor a survivor listed in justified.txt. Prints the count,
# then each such source. The replacement Verify for AC-008 expects 0.
import json, os, re, sys

here = os.path.dirname(os.path.abspath(__file__))
justified = {line.split('\t')[0] for line in open(os.path.join(here, 'justified.txt')) if line.strip()}
index = json.load(open('.skilled/skills/system-spec-kit/runtime/data/trigger-index.json'))
pattern = re.compile(r'opencode1\b|opencode-ai|opencode 1\b', re.I)
paths = index['paths']

def source(i):
    entry = paths[i]
    return entry if isinstance(entry, str) else (entry.get('path') or str(entry))

live = set()
for phrase, ids in index['phrases'].items():
    if pattern.search(phrase):
        for i in ids:
            src = source(i)
            if '/changelog/' not in src and not src.startswith('specs/') and src not in justified:
                live.add(src)
print(len(live))
for src in sorted(live):
    print(src)
sys.exit(0)
