# Usage: python3 try-variant.py <variant>
# Rewrites the keyword lists of chosen sk-doc README intents, so a variant can be measured.
import json, re, sys
VARIANT = sys.argv[1]
PARTS = set(VARIANT.split('+'))
PATH = '.skilled/skills/sk-doc/ROUTER.md'
text = open(PATH).read()

def edit(intent, keep):
    global text
    pattern = re.compile(r'("' + intent + r'": \{"weight": \d+, "keywords": )(\[.*?\])(\})')
    match = pattern.search(text)
    words = json.loads(match.group(2))
    kept = [w for w in words if keep(w)]
    text = text[:match.start(2)] + json.dumps(kept) + text[match.end(2):]
    print(f'{intent}: {len(words)} -> {len(kept)}')

named = lambda w: re.search(r'[a-z]+-[a-z-]+ hook', w) is not None
if 'no-git-named' in PARTS:
    edit('HOOK_README', lambda w: not (named(w) and re.search(r'\bgit-', w)))
if 'no-named' in PARTS:
    edit('HOOK_README', lambda w: not named(w))
if 'readme-first-named' in PARTS:
    edit('HOOK_README', lambda w: not named(w) or w.startswith('readme for the '))
if 'runtime' in PARTS:
    edit('RUNTIME_PLUGIN_README', lambda w: w != 'hook mirror readme')
SEC = {'sec-md': ['security.md'], 'sec-file': ['security.md', 'security policy file', 'security policy guide', 'security policy template']}
for part in VARIANT.split('+'):
    if part in SEC:
        edit('SECURITY_POLICY', lambda w, keep=SEC[part]: False)
        text = text.replace('"SECURITY_POLICY": {"weight": 4, "keywords": []}', '"SECURITY_POLICY": {"weight": 4, "keywords": ' + json.dumps(SEC[part]) + '}')
    if part.startswith('names:'):
        gone = part[6:].split(',')
        edit('HOOK_README', lambda w: not any(f'{n} hook' in w for n in gone))
    if part.startswith('drop:'):
        edit(part[5:], lambda w: False)
open(PATH, 'w').write(text)
