# Iteration 004 — system-code-graph: manual_testing_playbook/manual_testing_playbook.md scenario coverage + structure

## Summary

The manual testing playbook is well-structured with comprehensive coverage of 22 scenarios across 10 groups, but contains classification errors where scenarios are listed in incorrect sections and one scenario (Devin hooks) uses a completely different structure and frontmatter format than the standardized template used by other scenarios.

## Files Reviewed

- `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md` (lines read: 190)
- `.opencode/skills/system-code-graph/manual_testing_playbook/01--read-path-freshness/001-ensure-ready-selective-reindex.md` (lines read: 66)
- `.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/003-code-graph-scan-incremental.md` (lines read: 66)
- `.opencode/skills/system-code-graph/manual_testing_playbook/06--mcp-tool-surface/011-tool-call-shape-validation.md` (lines read: 65)
- `.opencode/skills/system-code-graph/manual_testing_playbook/07--ccc-integration/012-ccc-reindex-binary-shell-out.md` (lines read: 65)
- `.opencode/skills/system-code-graph/manual_testing_playbook/10--devin-hooks/025-devin-session-start.md` (lines read: 164)
- `.opencode/skills/system-code-graph/manual_testing_playbook/09--post-rename-infrastructure/017-launcher-startup-prefix.md` (lines read: 65)
- `.opencode/skills/system-code-graph/manual_testing_playbook/05--coverage-graph/009-deep-loop-graph-convergence-yaml-fire.md` (lines read: 65)

## Findings

### P0 (release-blocking)

| ID | File:line | Finding | Why P0 | Remediation |
|----|-----------|---------|--------|-------------|
| — | — | None | — | — |

### P1 (high priority)

| ID | File:line | Finding | Why P1 | Remediation |
|----|-----------|---------|--------|-------------|
| 001 | manual_testing_playbook.md:148 | Scenario 024 is listed under CCC INTEGRATION section but file path shows it resides in 03--detect-changes directory, creating classification confusion | Misclassification leads to operator confusion about scenario categorization and makes the playbook unreliable as a navigation guide | Move scenario 024 listing to section 9 (DETECT CHANGES) or move the file to 07--ccc-integration directory to match the playbook classification |
| 002 | manual_testing_playbook.md:165 | Scenario 016 is listed under POST-RENAME INFRASTRUCTURE section but file path shows it resides in 06--mcp-tool-surface directory, creating classification confusion | Misclassification leads to operator confusion about scenario categorization and makes the playbook unreliable as a navigation guide | Move scenario 016 listing to section 12 (MCP TOOL SURFACE) or move the file to 09--post-rename-infrastructure directory to match the playbook classification |
| 003 | 10--devin-hooks/025-devin-session-start.md:1-164 | Devin hook scenario uses a completely different structure (164 lines with HTML anchors, scenario row table, failure modes table) compared to the standardized ~65-line template used by all other 21 scenarios | Structural inconsistency makes the playbook harder to maintain, creates confusion for operators expecting a uniform format, and suggests the Devin hook scenario may not follow the same quality standards | Refactor 025-devin-session-start.md to follow the standardized scenario template structure used by scenarios 001-024, or document why this scenario requires an exception format |

### P2 (nice-to-have)

| ID | File:line | Finding | Why P2 | Remediation |
|----|-----------|---------|--------|-------------|
| 004 | 10--devin-hooks/025-devin-session-start.md:1-9 | Devin hook scenario frontmatter is missing the importance_tier field that is present in all other scenario files | Inconsistent frontmatter reduces tooling reliability and breaks the expected schema for scenario metadata | Add importance_tier field to the frontmatter of 025-devin-session-start.md |
| 005 | manual_testing_playbook.md:161-171 | Section numbering uses 14b and 14c instead of sequential 15 and 16, creating inconsistent section numbering | Inconsistent numbering makes cross-referencing and navigation more difficult for operators | Renumber sections 14b and 14c to 15 and 16 for sequential consistency |
| 006 | manual_testing_playbook.md:180 | Scenario ID is listed as DH-001 in the playbook table but the filename uses 025, creating ID naming inconsistency | ID mismatch between playbook listing and actual filename creates confusion for operators and tooling | Either rename the file to DH-001-devin-session-start.md or update the playbook to use ID 025 for consistency with the numeric naming scheme |
| 007 | 10--devin-hooks/025-devin-session-start.md:14,19,28,42,140,154,156 | Devin hook scenario uses HTML anchor comments (<!-- ANCHOR:... -->) and sk-doc-template comment that are not present in other scenarios | Non-standard formatting elements create inconsistency and may interfere with tooling that expects uniform markdown structure | Remove HTML anchor comments and sk-doc-template references to match the plain markdown format used by other scenarios |

## Convergence Signal

newInfoRatio 0.85 vs prior iterations (substantial new findings on playbook structure and scenario classification not covered in documentation-focused iterations 1-3)
