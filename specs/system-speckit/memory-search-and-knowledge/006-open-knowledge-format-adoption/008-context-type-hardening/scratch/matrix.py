"""Planted matrix for the contextType and importance_tier warnings, built from protocol v1 (seed 20261004)."""
import json, os, re, subprocess, sys, tempfile, itertools, collections
ROOT = os.getcwd()
P = 'specs/system-speckit/050-open-knowledge-format-adoption/008-context-type-hardening'
V = json.load(open('.skilled/skills/system-spec-kit/shared/frontmatter-values.json'))
doc, tier = V['contextType']['document'], V['importanceTier']
OFF = {'contextType': ['architecture','debugging','audit','design','notes','summary','implementation-summary','config','testing','research-notes'],
       'importance_tier': ['high-priority','low','urgent','p0','minor','optional','core','key','primary','secondary']}
VALUES = [('contextType', x, 'canonical') for x in doc['canonical']] + [('contextType', x, 'alias') for x in doc['aliases']] + \
         [('contextType', x, 'off') for x in OFF['contextType']] + \
         [('importance_tier', x, 'canonical') for x in tier['canonical']] + [('importance_tier', x, 'alias') for x in tier['aliases']] + \
         [('importance_tier', x, 'off') for x in OFF['importance_tier']]
QUOTES = {'none': '{}', 'double': '"{}"', 'single': "'{}'"}
CASES = {'lower': str.lower, 'title': lambda s: s[:1].upper() + s[1:], 'upper': str.upper}
POS = ['top', 'body', 'nested']
SAFE = {'contextType': 'general', 'importance_tier': 'normal'}
out = tempfile.mkdtemp(prefix='fv-matrix-', dir=os.environ.get('TMPDIR'))
rows = []
for i, ((key, val, cls), q, c, pos) in enumerate(itertools.product(VALUES, QUOTES, CASES, POS)):
    planted = QUOTES[q].format(CASES[c](val))
    other = 'importance_tier' if key == 'contextType' else 'contextType'
    top = planted if pos == 'top' else SAFE[key]
    fm = [f'title: "Row {i}"', 'description: "Planted matrix row."', f'{key}: {top}', f'{other}: {SAFE[other]}']
    if pos == 'nested':
        fm += ['_memory:', '  continuity:', f'    {key}: {planted}']
    body = f'# Row {i}\n\n' + (f'{key}: {planted}\n' if pos == 'body' else 'Body text.\n')
    name = f'row-{i:04d}.md'
    open(os.path.join(out, name), 'w').write('---\n' + '\n'.join(fm) + '\n---\n' + body)
    rows.append(dict(file=name, key=key, value=val, cls=cls, quote=q, case=c, pos=pos, expect=(cls == 'off' and pos == 'top')))
# W1: the spec-kit shell rule over the folder
RULE = '.skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values.sh'
r = subprocess.run(['bash', RULE.replace('.sh', '.sh')] if False else ['bash', '-c', 'source "$1"; run_check "$2" 2; printf "%s\\n" "$RULE_STATUS" "$RULE_MESSAGE"; printf "%s\\n" ${RULE_DETAILS[@]+"${RULE_DETAILS[@]}"}', '_', RULE, out], capture_output=True, text=True)
lines = r.stdout.splitlines()
w1 = collections.defaultdict(list)
for l in lines[2:]:
    m = re.match(r'(row-\d{4}\.md): (\w+) "', l)
    if m: w1[m.group(1)].append(m.group(2))
# W2: sk-doc validate_document, the same function the command line calls
sys.path.insert(0, '.skilled/skills/sk-doc/shared/scripts')
import validate_document as vd
w2 = {}
for row in rows:
    res = vd.validate_document(os.path.join(out, row['file']))
    w2[row['file']] = [w['message'].split(' ')[0] for w in res.get('warnings', []) if w.get('type') == 'frontmatter_value_outside_list']
def score(hits):
    tp = fp = fn = tn = 0; misses = []
    for row in rows:
        got = row['key'] in hits.get(row['file'], [])
        extra = [k for k in hits.get(row['file'], []) if k != row['key']]
        if extra: fp += 1; misses.append(('extra', row, extra))
        if got and row['expect']: tp += 1
        elif got and not row['expect']: fp += 1; misses.append(('fp', row))
        elif not got and row['expect']: fn += 1; misses.append(('fn', row))
        else: tn += 1
    return dict(tp=tp, fp=fp, fn=fn, tn=tn, recall=tp / (tp + fn) if tp + fn else None, precision=tp / (tp + fp) if tp + fp else None), misses
s1, m1 = score(w1); s2, m2 = score(w2)
res = dict(protocol='v1', seed=20261004, rows=len(rows), expected_warn=sum(r['expect'] for r in rows), w1_status=lines[:2], W1=s1, W2=s2,
           w1_misses=[(k, r['file'], r['key'], r['value'], r['quote'], r['case'], r['pos']) for k, r, *rest in m1][:50],
           w2_misses=[(k, r['file'], r['key'], r['value'], r['quote'], r['case'], r['pos']) for k, r, *rest in m2][:50], fixture_dir=out)
json.dump(res, open(P + '/scratch/matrix-result.json', 'w'), indent=1)
print(json.dumps({k: res[k] for k in ('rows', 'expected_warn', 'W1', 'W2', 'w1_status')}, indent=1))
print('w1 misses', len(m1), m1[:3] and [(k, r['value'], r['quote'], r['case'], r['pos']) for k, r, *x in m1[:5]])
print('w2 misses', len(m2), m2[:3] and [(k, r['value'], r['quote'], r['case'], r['pos']) for k, r, *x in m2[:5]])
