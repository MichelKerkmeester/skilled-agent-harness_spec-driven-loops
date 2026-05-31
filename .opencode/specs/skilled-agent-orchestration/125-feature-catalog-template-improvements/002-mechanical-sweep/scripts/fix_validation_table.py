"""
Convert 2-column '| File | Focus |' validation tables to 3-column '| File | Type | Role |'.
Type is derived from the file path extension. Idempotent. Supports --dry-run.
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

# 2-col header patterns to detect
OLD_HEADER_RE = re.compile(r'^\|\s*File\s*\|\s*Focus\s*\|', re.IGNORECASE | re.MULTILINE)
OLD_SEP_RE    = re.compile(r'^\|[-| ]+\|[-| ]+\|$')

def derive_type(file_path: str) -> str:
    p = file_path.strip().strip('`')
    if any(p.endswith(ext) for ext in ('.vitest.ts', '.test.ts', '.spec.ts', '.vitest.js', '.test.js')):
        return 'Automated test'
    if p.endswith('.md') and ('playbook' in p or 'manual' in p or 'testing' in p):
        return 'Manual playbook'
    if p.endswith('.md'):
        return 'Manual playbook'
    return 'Automated test'

def convert_table(content: str) -> tuple[str, int]:
    """Return (new_content, tables_converted)."""
    lines = content.split('\n')
    result = []
    converted = 0
    i = 0
    while i < len(lines):
        line = lines[i]
        # Detect old-style header
        if OLD_HEADER_RE.match(line.strip()):
            # Check next line is separator
            if i + 1 < len(lines) and OLD_SEP_RE.match(lines[i + 1].strip()):
                # Replace header and separator
                result.append('| File | Type | Role |')
                result.append('|---|---|---|')
                i += 2  # skip old header + old separator
                converted += 1
                # Convert data rows until we hit a non-table line
                while i < len(lines):
                    row = lines[i]
                    row_stripped = row.strip()
                    # A table row starts and ends with |, has at least 2 cells
                    if row_stripped.startswith('|') and row_stripped.endswith('|'):
                        cells = [c.strip() for c in row_stripped.strip('|').split('|')]
                        if len(cells) == 2:
                            file_path, focus = cells[0], cells[1]
                            row_type = derive_type(file_path)
                            result.append(f'| {file_path} | {row_type} | {focus} |')
                        elif len(cells) >= 3:
                            # Already 3+ cols (partially converted or separator), pass through
                            result.append(row)
                        else:
                            result.append(row)
                        i += 1
                    else:
                        break
                continue
        result.append(line)
        i += 1
    return '\n'.join(result), converted

fixed = skipped_none = skipped_already = 0

for skill in SKILLS:
    if not skill.exists():
        continue
    for f in sorted(skill.rglob('*.md')):
        if f.name == 'feature_catalog.md':
            continue
        if not re.search(r'^[0-9]+--', f.parent.name):
            continue
        text = f.read_text(encoding='utf-8')
        if not OLD_HEADER_RE.search(text):
            skipped_none += 1
            continue
        new_text, count = convert_table(text)
        if new_text == text:
            skipped_already += 1
            continue
        if DRY_RUN:
            print(f'  WOULD FIX ({count} table(s)): {f}')
        else:
            f.write_text(new_text, encoding='utf-8')
        fixed += 1

mode = '[DRY RUN] ' if DRY_RUN else ''
print(f'\n{mode}FIXED={fixed}  SKIPPED_NO_TABLE={skipped_none}  SKIPPED_ALREADY_3COL={skipped_already}')
