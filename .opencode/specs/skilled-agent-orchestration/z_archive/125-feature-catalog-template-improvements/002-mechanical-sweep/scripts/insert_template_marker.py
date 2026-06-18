"""
Insert '<!-- sk-doc-template: skill_asset_feature_catalog -->' after H1 in all snippet files
that do not already have it. Idempotent. Supports --dry-run.
"""
import re
import sys
from pathlib import Path

DRY_RUN = '--dry-run' in sys.argv

MARKER = '<!-- sk-doc-template: skill_asset_feature_catalog -->'
H1_RE = re.compile(r'^# .+', re.MULTILINE)

SKILLS = [
    Path('.opencode/skills/system-spec-kit/feature_catalog'),
    Path('.opencode/skills/system-skill-advisor/feature_catalog'),
    Path('.opencode/skills/system-code-graph/feature_catalog'),
]

marked = skipped_has = skipped_noh1 = 0

for skill in SKILLS:
    if not skill.exists():
        print(f'WARN: {skill} not found, skipping')
        continue
    for f in sorted(skill.rglob('*.md')):
        if f.name == 'feature_catalog.md':
            continue
        if not re.search(r'^[0-9]+--', f.parent.name):
            continue
        text = f.read_text(encoding='utf-8')
        if MARKER in text:
            skipped_has += 1
            continue
        m = H1_RE.search(text)
        if not m:
            skipped_noh1 += 1
            continue

        h1_end = m.end()
        before = text[:h1_end]
        after = text[h1_end:]

        # Strip any leading newlines from after, then rebuild cleanly
        after_stripped = after.lstrip('\n')
        new_text = before + '\n\n' + MARKER + '\n\n' + after_stripped

        if DRY_RUN:
            print(f'  WOULD MARK: {f}')
        else:
            f.write_text(new_text, encoding='utf-8')
        marked += 1

mode = '[DRY RUN] ' if DRY_RUN else ''
print(f'\n{mode}MARKED={marked}  SKIPPED_HAS={skipped_has}  SKIPPED_NOH1={skipped_noh1}')
