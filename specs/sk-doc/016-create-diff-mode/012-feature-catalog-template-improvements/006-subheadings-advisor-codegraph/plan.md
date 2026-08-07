---
title: "Plan: Phase 006 — Sub-headings, advisor + code-graph"
description: "Execution plan for applying H3 sub-headings to long HOW IT WORKS sections in system-skill-advisor and system-code-graph."
importance_tier: "normal"
contextType: "general"
---
# Plan: Phase 006 — Sub-headings, advisor + code-graph

---

## 1. APPROACH

Both skills are small enough to handle in 2-4 agent passes total. Read the audit CSV filtered to these skills, identify flagged files, process each skill in one agent pass (or two for skill-advisor if context is tight).

Same execution model and H3 vocabulary as phase 005. See phase 005 plan for the full H3 vocabulary list.

---

## 2. EXECUTION MODEL

```
1. Filter audit CSV: skill IN ('system-skill-advisor', 'system-code-graph')
                     AND needs_subheadings = true

2. system-skill-advisor: one agent reads all flagged files, adds H3 headings

3. system-code-graph: one agent reads all flagged files, adds H3 headings

4. Re-run audit for both skills → verify 0 remaining flagged
```

---

## 3. VERIFICATION

```bash
python3 002-mechanical-sweep/scripts/audit_long_sections.py > \
  006-subheadings-advisor-codegraph/output/post_phase_audit.csv

python3 -c "
import csv
with open('006-subheadings-advisor-codegraph/output/post_phase_audit.csv') as f:
    flagged = [r for r in csv.DictReader(f)
               if r['skill'] in ('system-skill-advisor','system-code-graph')
               and r['needs_subheadings']=='true']
print(f'Remaining flagged: {len(flagged)}')
"
# Expected: 0
```
