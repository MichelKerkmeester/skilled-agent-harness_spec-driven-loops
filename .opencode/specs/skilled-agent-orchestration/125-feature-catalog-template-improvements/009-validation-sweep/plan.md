---
title: "Plan: Phase 009 — Validation Sweep"
description: "Validation script specification and fix workflow for the final compliance check across all 370 catalog files."
importance_tier: "normal"
contextType: "general"
---
# Plan: Phase 009 — Validation Sweep

---

## 1. VALIDATION SCRIPT SPECIFICATION: `validate_catalog_compliance.py`

```python
"""
validate_catalog_compliance.py

For each snippet .md file across all three skills, check 6 compliance dimensions.
Produce a CSV report and a summary table.

Checks:
  1. trigger_phrases_present    — 'trigger_phrases:' in frontmatter
  2. template_marker_present    — '<!-- sk-doc-template: skill_asset_feature_catalog -->' in file
  3. how_it_works_heading       — '## 2. HOW IT WORKS' present (not CURRENT REALITY)
  4. validation_table_3col      — '| File | Type | Role |' in Validation And Tests section
                                   (SKIP if no Validation And Tests section)
  5. related_references_present — 'Related references:' in SOURCE METADATA
                                   (SKIP if only file in category)
  6. subheadings_in_long_section— If HOW IT WORKS has >3 paragraphs, must have ≥1 H3

Output columns:
  filepath, skill, category, filename,
  trigger_phrases, template_marker, how_it_works, validation_table,
  related_references, subheadings, overall_pass, notes
"""

SKILL_ROOTS = {
    'system-spec-kit':      '.opencode/skills/system-spec-kit/feature_catalog',
    'system-skill-advisor': '.opencode/skills/system-skill-advisor/feature_catalog',
    'system-code-graph':    '.opencode/skills/system-code-graph/feature_catalog',
}

# Run with: python validate_catalog_compliance.py > 009-validation-sweep/validation_report.csv
# Summary:  python validate_catalog_compliance.py --summary
```

---

## 2. EXPECTED SUMMARY OUTPUT FORMAT

```
=== COMPLIANCE SUMMARY ===

system-spec-kit (313 snippets):
  1. trigger_phrases:      313/313 (100.0%)
  2. template_marker:      313/313 (100.0%)
  3. how_it_works:         313/313 (100.0%)
  4. validation_table:     280/280 (100.0%)  [33 snippets have no validation section]
  5. related_references:   305/307 (99.3%)   [6 singleton categories exempt]
  6. subheadings:          148/148 (100.0%)  [165 snippets have ≤3 paragraphs]

system-skill-advisor (40 snippets):
  ...

system-code-graph (14 snippets):
  ...

OVERALL: 367/370 files pass all applicable checks (99.2%)
```

---

## 3. FIX WORKFLOW

After running the validation script:

1. **Sort failures by check type** — fix check 1-3 failures first (hard requirements)
2. **Batch fixes** — group remaining failures by skill + category for efficient agent fixing
3. **Re-run validation** — confirm fixes resolved the issues before proceeding
4. **Document exceptions** — any files that cannot be fixed (e.g., singleton categories, files with no validation section) go into `known_exceptions.md`

---

## 4. EXECUTION ORDER

```
1. python validate_catalog_compliance.py --summary   # get overview
2. python validate_catalog_compliance.py > 009-validation-sweep/validation_report.csv
3. Review: check 1-3 zero failures? If not, fix immediately
4. Review: check 4-6 failures — batch and fix
5. Re-run validation → confirm ≥95% overall
6. Write 009-validation-sweep/known_exceptions.md
7. Update 125 spec folder status to 'complete'
8. Commit: "chore(125-009): validation sweep complete — all catalogs at 125 standard"
```

---

## 5. KNOWN EXCEPTION CATEGORIES

Acceptable gaps that do NOT count as failures:
- `validation_table` check skipped for files with no Validation And Tests section
- `related_references` check skipped for singleton category files
- `subheadings` check skipped for files with ≤3 paragraphs in HOW IT WORKS
- `template_marker` check skipped for master catalog files (`feature_catalog.md`)

---

## 6. CLOSURE

When ≥95% compliance is confirmed:
- Update `125/description.json` status → `"complete"`
- Update `125/graph-metadata.json` status → `"complete"`
- Update `125/spec.md` METADATA status → `Complete`
- Write final implementation-summary.md at 125 level summarizing all 9 phases
