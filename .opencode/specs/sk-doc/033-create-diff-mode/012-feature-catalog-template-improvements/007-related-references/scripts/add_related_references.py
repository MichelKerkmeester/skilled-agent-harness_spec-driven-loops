"""
Add 'Related references:' prev/next links to SOURCE METADATA in snippet files missing them.
Idempotent. Links use relative paths within the same category directory.
"""
import re
import sys
from pathlib import Path

DRY_RUN = '--dry-run' in sys.argv

SKILLS = [
    Path('.opencode/skills/system-spec-kit/feature_catalog'),
    Path('.opencode/skills/system-skill-advisor/feature_catalog'),
    Path('.opencode/skills/system-code-graph/feature_catalog'),
]

METADATA_RE = re.compile(r'^## 4\. SOURCE METADATA', re.MULTILINE)

def get_title(path: Path) -> str:
    try:
        for line in path.read_text(encoding='utf-8').split('\n'):
            if line.startswith('title:'):
                return line.split(':', 1)[1].strip().strip('"\'')
    except Exception:
        pass
    return path.stem.replace('-', ' ').title()

added = skipped_has = skipped_singleton = skipped_no_meta = 0

for skill in SKILLS:
    if not skill.exists():
        continue
    for cat_dir in sorted(skill.iterdir()):
        if not cat_dir.is_dir():
            continue
        if not re.search(r'^[0-9]+--', cat_dir.name):
            continue
        snippets = sorted([
            f for f in cat_dir.glob('*.md')
            if f.name != 'feature_catalog.md'
        ])
        if len(snippets) <= 1:
            skipped_singleton += len(snippets)
            continue

        for idx, f in enumerate(snippets):
            text = f.read_text(encoding='utf-8')

            if 'Related references:' in text:
                skipped_has += 1
                continue

            if not METADATA_RE.search(text):
                skipped_no_meta += 1
                continue

            prev_f = snippets[idx - 1] if idx > 0 else None
            next_f = snippets[idx + 1] if idx < len(snippets) - 1 else None

            ref_lines = ['\nRelated references:']
            if prev_f:
                ref_lines.append(f'- [{prev_f.name}]({prev_f.name}) — {get_title(prev_f)}')
            if next_f:
                ref_lines.append(f'- [{next_f.name}]({next_f.name}) — {get_title(next_f)}')
            ref_block = '\n'.join(ref_lines)

            # Insert after the last bullet in SOURCE METADATA (before next --- or ## or EOF)
            # Find end of SOURCE METADATA section
            meta_match = METADATA_RE.search(text)
            after_meta = text[meta_match.end():]
            # Find the end of the metadata section
            end_match = re.search(r'\n(?:---|## )', after_meta)
            if end_match:
                insert_pos = meta_match.end() + end_match.start()
                new_text = text[:insert_pos] + ref_block + '\n' + text[insert_pos:]
            else:
                # Section goes to EOF
                new_text = text.rstrip() + ref_block + '\n'

            if DRY_RUN:
                print(f'  WOULD ADD refs: {f}')
            else:
                f.write_text(new_text, encoding='utf-8')
            added += 1

mode = '[DRY RUN] ' if DRY_RUN else ''
print(f'\n{mode}ADDED={added}  SKIPPED_HAS={skipped_has}  SKIPPED_SINGLETON={skipped_singleton}  SKIPPED_NO_META={skipped_no_meta}')
