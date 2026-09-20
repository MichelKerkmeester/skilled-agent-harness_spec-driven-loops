"""Extract the structural skeleton of every governance file into one table.

Structure is read mechanically rather than by eye because the whole point of the
inventory is to find where the corpus disagrees with itself, and an impression of
eight similar files reliably reports them as identical.
"""
import json, pathlib, re, sys

ROOT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.')
FILES = [ROOT / 'REPO RULES.md'] + sorted((ROOT / 'repo-rules').glob('*.md'))

def parse(p):
    raw = p.read_text()
    fm = re.match(r'^---\n(.*?)\n---\n', raw, re.S)
    body = raw[fm.end():] if fm else raw
    keys, phrases = [], 0
    if fm:
        keys = re.findall(r'^([a-zA-Z_]+):', fm.group(1), re.M)
        phrases = len(re.findall(r'^  - ', fm.group(1), re.M))
    heads = re.findall(r'^(#{1,3}) (.+)$', body, re.M)
    numbered = [h for lvl, h in heads if lvl == '##' and re.match(r'^\d+\. ', h)]
    unnumbered = [h for lvl, h in heads if lvl == '##' and not re.match(r'^\d+\. ', h)]
    selfcheck = [h for h in numbered if 'SELF-CHECK' in h.upper()]
    checkboxes = len(re.findall(r'^- \[ \] ', body, re.M))
    return {
        'file': p.name,
        'frontmatter': bool(fm),
        'fm_keys': keys,
        'trigger_phrases': phrases,
        'numbered_sections': len(numbered),
        'numbered_all_upper': all(
            ''.join(s for i, s in enumerate(h.split('`')) if i % 2 == 0).upper()
            == ''.join(s for i, s in enumerate(h.split('`')) if i % 2 == 0)
            for h in numbered),
        'unnumbered_sections': unnumbered,
        'has_fires_when': any(h.strip().lower() == 'fires when' for h in unnumbered),
        'has_the_rule': any(h.strip().lower() == 'the rule' for h in unnumbered),
        'has_selfcheck': bool(selfcheck),
        'selfcheck_items': checkboxes,
        'dividers': body.count('\n---\n'),
        'routed_from_line': bool(re.search(r'^> Routed from', body, re.M)),
        'expands_agents_line': bool(re.search(r'Expands `AGENTS\.md`, never overrides it', body)),
        'xrefs': sorted(set(re.findall(r'\]\((?!http)([^)#]+)\)', body))),
        'lines': len(raw.splitlines()),
        'bytes': len(raw.encode()),
    }

rows = [parse(p) for p in FILES]
print(json.dumps(rows, indent=2))
