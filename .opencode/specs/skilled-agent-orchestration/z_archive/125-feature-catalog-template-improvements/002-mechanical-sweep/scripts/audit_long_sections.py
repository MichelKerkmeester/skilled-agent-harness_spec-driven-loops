"""
Read-only audit: identify snippet files where HOW IT WORKS has >3 paragraphs but no H3 sub-headings.
Writes long_sections_audit.csv to the output directory.
"""
import csv
import re
from pathlib import Path

SKILLS = [
    Path('.opencode/skills/system-spec-kit/feature_catalog'),
    Path('.opencode/skills/system-skill-advisor/feature_catalog'),
    Path('.opencode/skills/system-code-graph/feature_catalog'),
]

SECTION_RE = re.compile(
    r'^## 2\. HOW IT WORKS\n(.*?)(?=^---\s*$|^## [0-9])',
    re.MULTILINE | re.DOTALL,
)

OUTFILE = Path(
    '.opencode/specs/skilled-agent-orchestration/'
    '125-feature-catalog-template-improvements/'
    '002-mechanical-sweep/output/long_sections_audit.csv'
)

rows = []

for skill in SKILLS:
    if not skill.exists():
        print(f'WARN: {skill} not found')
        continue
    skill_name = skill.parent.name
    for f in sorted(skill.rglob('*.md')):
        if f.name == 'feature_catalog.md':
            continue
        if not re.search(r'^[0-9]+--', f.parent.name):
            continue
        text = f.read_text(encoding='utf-8')
        m = SECTION_RE.search(text)
        section = m.group(1) if m else ''

        # Count paragraphs — text blocks separated by blank lines,
        # excluding H3 headings, HTML comments, and code fences
        blocks = re.split(r'\n{2,}', section.strip())
        paras = [
            b for b in blocks
            if b.strip()
            and not b.strip().startswith('###')
            and not b.strip().startswith('<!--')
            and not b.strip().startswith('```')
        ]
        para_count = len(paras)
        h3_count = len(re.findall(r'^### ', section, re.MULTILINE))
        needs = para_count > 3 and h3_count == 0

        rows.append({
            'filepath': str(f),
            'skill': skill_name,
            'category': f.parent.name,
            'filename': f.name,
            'paragraph_count': para_count,
            'h3_count': h3_count,
            'needs_subheadings': str(needs).lower(),
        })

OUTFILE.parent.mkdir(parents=True, exist_ok=True)
with open(OUTFILE, 'w', newline='', encoding='utf-8') as fh:
    writer = csv.DictWriter(
        fh,
        fieldnames=['filepath', 'skill', 'category', 'filename',
                    'paragraph_count', 'h3_count', 'needs_subheadings'],
    )
    writer.writeheader()
    writer.writerows(rows)

print('\nAudit summary:')
for skill_name in ['system-spec-kit', 'system-skill-advisor', 'system-code-graph']:
    sr = [r for r in rows if r['skill'] == skill_name]
    needs = [r for r in sr if r['needs_subheadings'] == 'true']
    long = [r for r in sr if int(r['paragraph_count']) > 3]
    print(f'  {skill_name}: {len(sr)} files | {len(long)} have >3 paragraphs | {len(needs)} need subheadings')

total_needs = sum(1 for r in rows if r['needs_subheadings'] == 'true')
print(f'\n  TOTAL: {len(rows)} files | {total_needs} need subheadings')
print(f'\nCSV written to {OUTFILE}')
