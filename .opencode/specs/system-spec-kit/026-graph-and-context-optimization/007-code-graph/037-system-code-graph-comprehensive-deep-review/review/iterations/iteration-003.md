# Iteration 003 — system-code-graph: feature_catalog/feature_catalog.md completeness + sk-doc alignment + entry shape

## Summary

The feature catalog exists with 17 features across 8 groups and all expected per-feature files are present. However, the root catalog structure does not follow the sk-doc template, using simple tables instead of the required hierarchical ### Feature / #### Description / #### Current Reality / #### Source Files structure. The filename also uses lowercase instead of the expected uppercase. Per-feature files follow the required 4-section structure but include non-template ANCHOR comments.

## Files Reviewed

- `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` (lines read: 122)
- `.opencode/skills/system-code-graph/feature_catalog/01--read-path-freshness/01-ensure-code-graph-ready.md` (lines read: 66)
- `.opencode/skills/system-code-graph/feature_catalog/02--manual-scan-verify-status/01-code-graph-scan.md` (lines read: 66)
- `.opencode/skills/system-code-graph/feature_catalog/04--context-retrieval/01-code-graph-context.md` (lines read: 66)
- `.opencode/skills/system-code-graph/feature_catalog/05--coverage-graph/01-deep-loop-graph-query.md` (lines read: 64)
- `.opencode/skills/system-code-graph/feature_catalog/07--ccc-integration/01-ccc-reindex.md` (lines read: 64)
- `.opencode/skills/system-code-graph/feature_catalog/06--mcp-tool-surface/01-tool-registrations.md` (lines read: 66)

## Findings

### P0 (release-blocking)

| ID | File:line | Finding | Why P0 | Remediation |
|----|-----------|---------|--------|-------------|
| — | — | None | — | — |

### P1 (high priority)

| ID | File:line | Finding | Why P1 | Remediation |
|----|-----------|---------|--------|-------------|
| F001 | feature_catalog.md:1-122 | Root catalog uses simple table format instead of sk-doc template structure | Violates sk-doc feature_catalog_template.md which requires ### {FEATURE_NAME} / #### Description / #### Current Reality / #### Source Files hierarchy per feature | Restructure root catalog sections to match sk-doc template with hierarchical feature entries |
| F002 | feature_catalog/feature_catalog.md:1 | Filename uses lowercase instead of expected uppercase | sk-doc template specifies `FEATURE_CATALOG.md` as the canonical root filename | Rename to `FEATURE_CATALOG.md` and update all internal references |

### P2 (nice-to-have)

| ID | File:line | Finding | Why P2 | Remediation |
|----|-----------|---------|--------|-------------|
| F003 | feature_catalog.md:1-8 | Frontmatter includes non-template fields (trigger_phrases, importance_tier) | sk-doc template only requires title and description; extra fields are not standard | Remove extra frontmatter fields or justify their necessity in sk-doc alignment |
| F004 | All per-feature files:12-66 | Per-feature files include ANCHOR comments not in sk-doc template | ANCHOR comments (<!-- ANCHOR:overview -->, etc.) are not part of feature_catalog_snippet_template.md | Remove ANCHOR comments to align with sk-doc template structure |
| F005 | feature_catalog.md:1-8 | Missing last_updated field present in system-spec-kit catalog | Other catalogs include last_updated for freshness tracking; sk-doc template shows this as optional but useful | Add last_updated field to frontmatter for freshness tracking |

## Convergence Signal

newInfoRatio 0.85 vs prior iterations — this is the first review of feature catalog structure, revealing significant sk-doc template misalignment that was not visible in prior documentation-focused iterations.
