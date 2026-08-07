---
title: "Plan: Phase 002 — Mechanical Sweep"
description: "Script specifications and execution order for the three mechanical bulk-fix scripts plus the long-section audit."
importance_tier: "normal"
contextType: "general"
---
# Plan: Phase 002 — Mechanical Sweep

---

## 1. APPROACH

Write four Python scripts to the `125/002-mechanical-sweep/scripts/` directory. Execute them sequentially. Review git diff after each. Commit only after all four pass.

All scripts:
- Accept a `--dry-run` flag to preview changes without writing
- Log a summary of files touched vs skipped
- Are idempotent (re-running them produces no diff)
- Target only files inside `*/feature_catalog/` directories

---

## 2. SCRIPT SPECIFICATIONS

### Script A: `heading_rename.py`

```
Purpose: Rename '## 2. CURRENT REALITY' to '## 2. HOW IT WORKS' in all snippet files.

Logic:
  for each .md file under */feature_catalog/*/*.md:
    if '## 2. CURRENT REALITY' in content:
      replace with '## 2. HOW IT WORKS'
      write back
      log: RENAMED {path}
    elif '## 2. HOW IT WORKS' in content:
      log: SKIP (already renamed) {path}
    else:
      log: SKIP (no section 2 heading) {path}

Safety: Only replace the exact heading line. Do not touch prose containing
the words "current reality" in any other context.
Pattern: r'^## 2\. CURRENT REALITY$' with re.MULTILINE
```

### Script B: `insert_template_marker.py`

```
Purpose: Insert '<!-- sk-doc-template: skill_asset_feature_catalog -->' 
         on the line after the first H1 heading, if not already present.

Logic:
  MARKER = '<!-- sk-doc-template: skill_asset_feature_catalog -->'
  for each .md file under */feature_catalog/*/*.md:
    skip if filename == 'feature_catalog.md'  (master catalog)
    if MARKER in content:
      log: SKIP (already has marker) {path}
      continue
    find first line matching r'^# .+' (H1)
    insert blank line + MARKER + blank line immediately after H1
    write back
    log: MARKED {path}
```

### Script C: `fix_validation_table.py`

```
Purpose: Convert 2-column '| File | Focus |' validation tables to 
         3-column '| File | Type | Role |' with Type derived from filename.

Type derivation rules (from the file path in each row):
  '.vitest.ts' or '.test.ts' or '.spec.ts'  → 'Automated test'
  '.md' anywhere in path                    → 'Manual playbook'
  default                                   → 'Automated test'

Logic:
  for each .md file under */feature_catalog/*/*.md:
    find '### Validation And Tests' section
    find table header line
    if header is '| File | Focus |' or '| File | Focus|':
      replace header with '| File | Type | Role |'
      replace separator with '|---|---|---|'
      for each data row '| filepath | focus_text |':
        derive type from filepath
        replace with '| filepath | {type} | focus_text |'
    elif header already contains 'Type' and 'Role':
      log: SKIP (already 3-col) {path}
    else:
      log: SKIP (no standard table found) {path}

Edge cases:
  - Some rows may have extra spaces or trailing pipes — normalize
  - Some files have NO validation table — skip silently
  - Some files already have 3-col — skip
```

### Script D: `audit_long_sections.py`

```
Purpose: Identify snippets where ## 2. HOW IT WORKS has >3 paragraphs.
         Output CSV for phase 005 planning.

Logic:
  for each .md file under */feature_catalog/*/*.md:
    skip if filename == 'feature_catalog.md'
    extract content between '## 2. HOW IT WORKS' and next '---' or '## 3.'
    count paragraphs (text blocks separated by blank lines)
    count H3 headings (lines starting with '### ')
    write row to audit CSV:
      filepath, paragraph_count, h3_count, needs_subheadings (para>3 and h3==0)

Output: 002-mechanical-sweep/output/long_sections_audit.csv
Columns: filepath, skill, category, paragraph_count, h3_count, needs_subheadings
```

---

## 3. EXECUTION ORDER

```
1. cd to repo root
2. python 125/002-mechanical-sweep/scripts/heading_rename.py --dry-run
3. Review output → python heading_rename.py (no dry-run)
4. python insert_template_marker.py --dry-run
5. Review output → python insert_template_marker.py
6. python fix_validation_table.py --dry-run
7. Review output → python fix_validation_table.py
8. python audit_long_sections.py  (no dry-run needed — read-only)
9. git diff --stat → review scope
10. git add + commit: "chore(125-002): mechanical sweep — heading rename, template marker, validation table"
```

---

## 4. VERIFICATION COMMANDS

```bash
# R-001: Zero CURRENT REALITY headings remaining
grep -r "## 2. CURRENT REALITY" \
  .opencode/skills/system-spec-kit/feature_catalog/ \
  .opencode/skills/system-skill-advisor/feature_catalog/ \
  .opencode/skills/system-code-graph/feature_catalog/ | wc -l
# Expected: 0

# R-002: Snippets missing template marker
grep -rL "sk-doc-template" \
  .opencode/skills/system-spec-kit/feature_catalog/ \
  .opencode/skills/system-skill-advisor/feature_catalog/ \
  .opencode/skills/system-code-graph/feature_catalog/ | \
  grep -v "feature_catalog\.md$"
# Expected: empty

# R-003: Zero old 2-col validation headers
grep -r "| File | Focus |" \
  .opencode/skills/system-spec-kit/feature_catalog/ \
  .opencode/skills/system-skill-advisor/feature_catalog/ \
  .opencode/skills/system-code-graph/feature_catalog/ | wc -l
# Expected: 0
```

---

## 5. RISKS

| Risk | Mitigation |
|---|---|
| Script corrupts file content | `--dry-run` flag; test on 5 files first before full run |
| Edge cases in table format (extra spaces, trailing pipes) | Test script C on a small sample first |
| macOS BSD vs Linux sed differences | Use Python (not bash sed) for all rewrites |
| Files with multiple H1 headings | Script B: only inserts after FIRST H1 |
