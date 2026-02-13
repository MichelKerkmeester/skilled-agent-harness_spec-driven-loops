# Implementation Plan

## Analysis Summary

### Releases Analyzed: 16
- v1.0.1.6 to v1.0.0.0
- Date range: Dec 29-30, 2025

### Key Findings

| Finding | Current State | Recommendation |
|---------|--------------|----------------|
| Version prefix | Inconsistent (v/no v) | Always use "v" prefix |
| Section order | Varies by release | Standardize: Breaking → New → Files → Upgrade → Stats |
| Breaking changes | Sometimes buried | Always first section when applicable |
| Tables | Used well but inconsistently | Mandate for comparisons and file changes |
| Upgrade notes | Quality varies | Require numbered steps with code |

### Release Type Classification

| Type | Example Releases | Key Sections |
|------|-----------------|--------------|
| Major | v1.0.0.0 | Full template with "What's Included" |
| Feature | v1.0.0.4, v1.0.1.0 | New features, migration tables |
| Enhancement | v1.0.0.7, v1.0.0.8 | Single feature deep-dive |
| Fix | v1.0.0.1, v1.0.1.1 | Bug tables with severity |
| Docs | v1.0.1.3, v1.0.1.5 | Documentation changes, workarounds |

## Deliverable

Single template file: `RELEASE_NOTES_TEMPLATE.md` in repository root

### Template Structure

1. Header format with type tags
2. Quick reference (type → sections mapping)
3. Full template with placeholders
4. Section catalog with examples
5. Validation checklist
6. Best practices

## Implementation Steps

1. Create spec folder structure
2. Write comprehensive template
3. Document analysis findings in implementation-summary.md
