---
title: "Plan: Phase 005 — Sub-headings, system-spec-kit"
description: "Execution plan for applying H3 sub-headings to long HOW IT WORKS sections in system-spec-kit, based on audit data from phase 002."
importance_tier: "normal"
contextType: "general"
---
# Plan: Phase 005 — Sub-headings, system-spec-kit

---

## 1. APPROACH

Phase 002 produces `long_sections_audit.csv`. This phase:
1. Reads the CSV to get the list of flagged files per category
2. Processes flagged files category by category with AI agents
3. Each agent adds H3 sub-headings to group related paragraphs
4. Prose is never rewritten — only headings inserted

---

## 2. READING THE AUDIT CSV

```python
import csv
from pathlib import Path

with open('002-mechanical-sweep/output/long_sections_audit.csv') as f:
    reader = csv.DictReader(f)
    flagged = [
        row for row in reader
        if row['skill'] == 'system-spec-kit'
        and row['needs_subheadings'] == 'true'
    ]

# Group by category
by_category = {}
for row in flagged:
    cat = row['category']
    by_category.setdefault(cat, []).append(row['filepath'])

print(f"Total flagged: {len(flagged)} files across {len(by_category)} categories")
```

---

## 3. AGENT EXECUTION MODEL

For each category with flagged files:

**Agent reads:**
- Each flagged snippet's HOW IT WORKS section (only — not the whole file)
- The category name and feature context

**Agent task:**
```
For each HOW IT WORKS section exceeding 3 paragraphs:
1. Read the content as a whole — understand the conceptual flow
2. Identify natural groupings of paragraphs by topic
3. Insert H3 headings between groups using standard vocabulary where it fits:
   - Entry Point & Routing | Quality Gates & Validation | PE Arbitration
   - Reconsolidation & Chunking | Configuration | Edge Cases & Caveats
   - Async & Safety | Post-Action Behavior | Core Behavior
4. If none of the standard headings fit: use a descriptive custom heading
5. RULE: Do NOT rewrite, merge, or reorder any paragraph
6. RULE: First group does NOT need a heading if it's the only "core behavior" intro
```

**Batch size guidance:**
- Flagged files per category with 1-5 flagged: single agent pass
- 6-15 flagged: two agent passes
- 15+: three passes

---

## 4. EXECUTION ORDER

Process categories with the most flagged files first (highest value):
```
1. Run: python read_audit_and_group.py → get category priority list
2. Process largest categories first (pipeline-architecture, scoring-and-calibration, etc.)
3. Process remaining categories in descending order by flagged count
4. Re-run audit script after each category batch to confirm h3_count > 0
```

---

## 5. VERIFICATION

```bash
# Re-run audit script after phase 005 completes
python3 002-mechanical-sweep/scripts/audit_long_sections.py > \
  005-subheadings-spec-kit/output/post_phase_audit.csv

# Count still-flagged files
python3 -c "
import csv
with open('005-subheadings-spec-kit/output/post_phase_audit.csv') as f:
    flagged = [r for r in csv.DictReader(f)
               if r['skill']=='system-spec-kit'
               and r['needs_subheadings']=='true']
print(f'Remaining flagged: {len(flagged)}')
"
# Expected: 0
```

---

## 6. QUALITY CHECK

After completion, spot-check 10 randomly selected previously-flagged files:
- Confirm H3 headings appear at logical paragraph group boundaries
- Confirm no prose was altered (git diff shows only `### ` additions)
- Confirm standard vocabulary used where appropriate
