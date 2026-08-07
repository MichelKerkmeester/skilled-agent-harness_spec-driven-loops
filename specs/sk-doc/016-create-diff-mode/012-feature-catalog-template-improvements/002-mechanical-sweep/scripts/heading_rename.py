"""
Rename '## 2. CURRENT REALITY' to '## 2. HOW IT WORKS' in all feature catalog snippet files.
Idempotent. Supports --dry-run.
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

HEADING_OLD = re.compile(r'^## 2\. CURRENT REALITY$', re.MULTILINE)
HEADING_NEW = '## 2. HOW IT WORKS'

renamed = skipped_done = skipped_none = 0

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
        if HEADING_NEW in text:
            skipped_done += 1
            continue
        if not HEADING_OLD.search(text):
            skipped_none += 1
            continue
        new_text = HEADING_OLD.sub(HEADING_NEW, text)
        if DRY_RUN:
            print(f'  WOULD RENAME: {f}')
        else:
            f.write_text(new_text, encoding='utf-8')
        renamed += 1

mode = '[DRY RUN] ' if DRY_RUN else ''
print(f'\n{mode}RENAMED={renamed}  SKIPPED_DONE={skipped_done}  SKIPPED_NONE={skipped_none}')
