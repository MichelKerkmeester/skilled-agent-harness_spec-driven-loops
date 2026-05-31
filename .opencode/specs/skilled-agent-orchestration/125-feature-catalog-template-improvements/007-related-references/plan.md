---
title: "Plan: Phase 007 — Related References, All Skills"
description: "Python script specification for adding prev/next neighbor links to all snippet SOURCE METADATA sections."
importance_tier: "normal"
contextType: "general"
---
# Plan: Phase 007 — Related References, All Skills

---

## 1. SCRIPT SPECIFICATION: `add_related_references.py`

```python
"""
add_related_references.py

For each category directory across all three skills:
  1. List .md snippet files (exclude feature_catalog.md), sorted by filename
  2. For each file[i]:
     - prev = files[i-1] if i > 0 else None
     - next = files[i+1] if i < len(files)-1 else None
  3. Read frontmatter title from prev and next files
  4. If file already has 'Related references:' in content: SKIP
  5. Find '## 4. SOURCE METADATA' section
  6. Append Related references block after last bullet in SOURCE METADATA
  7. Write back

Title extraction:
  Read file content, find 'title:' in frontmatter, strip quotes
  Fallback: use filename slug if title not found

Idempotency:
  Check for 'Related references:' string before writing — skip if present

Dry-run:
  --dry-run flag prints what would be written without writing
"""

SKILL_ROOTS = [
    '.opencode/skills/system-spec-kit/feature_catalog',
    '.opencode/skills/system-skill-advisor/feature_catalog',
    '.opencode/skills/system-code-graph/feature_catalog',
]

def get_title(path: Path) -> str:
    """Extract title from frontmatter, fallback to filename stem."""
    content = path.read_text()
    for line in content.split('\n'):
        if line.startswith('title:'):
            return line.split(':', 1)[1].strip().strip('"\'')
    return path.stem.replace('-', ' ').title()

def build_related_block(prev: Path | None, next: Path | None) -> str:
    lines = ['\nRelated references:']
    if prev:
        lines.append(f'- [{prev.name}]({prev.name}) — {get_title(prev)}')
    if next:
        lines.append(f'- [{next.name}]({next.name}) — {get_title(next)}')
    return '\n'.join(lines) + '\n'

# Full algorithm: iterate categories, sort files, link neighbors
```

---

## 2. EXECUTION ORDER

```
1. python add_related_references.py --dry-run | head -50   # preview
2. python add_related_references.py                        # execute
3. git diff --stat                                         # review scope
4. Run verification commands below
5. git add + commit
```

---

## 3. VERIFICATION

```bash
# Count snippets still missing Related references (excluding singletons)
python3 -c "
from pathlib import Path
missing = []
for skill_root in [
    '.opencode/skills/system-spec-kit/feature_catalog',
    '.opencode/skills/system-skill-advisor/feature_catalog',
    '.opencode/skills/system-code-graph/feature_catalog',
]:
    for cat_dir in Path(skill_root).iterdir():
        if not cat_dir.is_dir(): continue
        snippets = sorted([f for f in cat_dir.glob('*.md')
                           if f.name != 'feature_catalog.md'])
        if len(snippets) <= 1: continue  # singletons exempt
        for f in snippets:
            if 'Related references:' not in f.read_text():
                missing.append(f)
print(f'Missing related references: {len(missing)}')
for f in missing: print(f'  {f}')
"
# Expected: 0 (or only singleton categories)
```

---

## 4. EDGE CASE HANDLING

| Case | Script behavior |
|---|---|
| Singleton category | Skips silently |
| File already has references | Skips (idempotent) |
| Neighbor file missing title | Uses filename stem as fallback |
| `## 4. SOURCE METADATA` not found | Logs warning, skips file |
| Numbered gap in category (e.g., 01, 03 — no 02) | Links to actual adjacent files, not numerical sequence |
