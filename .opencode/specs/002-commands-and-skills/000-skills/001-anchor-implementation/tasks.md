# Task Breakdown: Retrieval Anchors for Skill Documentation

**Spec Folder**: `specs/002-commands-and-skills/000-skills/001-anchor-implementation`  
**Level**: 3+ (Governance + Architecture)  
**Status**: Planning  
**Created**: 2026-02-17

---

## TASK ORGANIZATION

### Workstreams

Tasks are organized by workstream using `[W:CODE]` prefix:

- **[W:FOUNDATION]** - Template updates and anchor taxonomy
- **[W:TOOLING]** - Migration and validation scripts
- **[W:MIGRATION]** - Bulk migration execution
- **[W:DOCS]** - Documentation and handover

### Task Dependencies

Tasks use `[B:T###]` notation to indicate blocking dependencies.

---

## PHASE 1: FOUNDATION (Hours 1-8)

### [W:FOUNDATION] T001: Define Anchor Taxonomy
**Priority**: P0  
**Estimate**: 2 hours  
**Dependencies**: None  
**Assignee**: TBD

**Description**: Create comprehensive anchor taxonomy document defining all anchor names, purposes, scopes, and usage guidelines.

**Deliverables**:
- [ ] `anchor-taxonomy.md` in spec folder with 10-15 defined anchors
- [ ] Anchor categories documented (summary, structural, operational, metadata)
- [ ] Placement rules documented
- [ ] Examples for each anchor type

**Acceptance Criteria**:
- ✅ All anchor names lowercase, hyphenated
- ✅ Maximum 20 unique anchor types defined
- ✅ Each anchor documented with purpose and scope
- ✅ Taxonomy approved by documentation lead

**Testing**:
- [ ] Manual review by documentation lead
- [ ] Validate against memory ANCHOR format (consistency check)

---

### [W:FOUNDATION] T002: Update skill_md_template.md
**Priority**: P0  
**Estimate**: 2 hours  
**Dependencies**: [B:T001]  
**Assignee**: TBD

**Description**: Update main SKILL.md template with anchor examples and usage guidelines.

**Deliverables**:
- [ ] Updated `.opencode/skill/workflows-documentation/assets/opencode/skill_md_template.md`
- [ ] "How to Use Anchors" subsection added (after frontmatter section)
- [ ] ≥3 concrete anchor examples (summary, rules, examples)
- [ ] Validation instructions included

**Acceptance Criteria**:
- ✅ Template includes ≥3 anchor examples with comments
- ✅ "How to use anchors" section added with clear guidelines
- ✅ Validation commands documented
- ✅ Template renders correctly in Markdown preview
- ✅ No breaking changes to existing template structure

**Testing**:
- [ ] Render in VS Code Markdown preview
- [ ] Render in GitHub (preview in PR)
- [ ] Create test skill from template, verify anchor syntax

---

### [W:FOUNDATION] T003: Update skill_reference_template.md
**Priority**: P0  
**Estimate**: 2 hours  
**Dependencies**: [B:T001]  
**Assignee**: TBD

**Description**: Update reference document template with anchor examples for multi-section documents.

**Deliverables**:
- [ ] Updated `.opencode/skill/workflows-documentation/assets/opencode/skill_reference_template.md`
- [ ] Multi-anchor pattern examples (one doc, multiple sections)
- [ ] Cross-reference examples
- [ ] Anchor usage guidelines for reference docs

**Acceptance Criteria**:
- ✅ Template includes ≥2 anchor examples
- ✅ Multi-anchor pattern demonstrated
- ✅ Cross-reference pattern documented
- ✅ Template renders correctly

**Testing**:
- [ ] Render in Markdown preview
- [ ] Verify multi-anchor syntax correctness

---

### [W:FOUNDATION] T004: Update skill_asset_template.md
**Priority**: P0  
**Estimate**: 2 hours  
**Dependencies**: [B:T001]  
**Assignee**: TBD

**Description**: Update asset template with anchor examples for checklists, workflows, and patterns.

**Deliverables**:
- [ ] Updated `.opencode/skill/workflows-documentation/assets/opencode/skill_asset_template.md`
- [ ] Anchor examples for checklists, workflows, patterns
- [ ] Guidelines on when assets need anchors vs when to skip
- [ ] Asset-specific anchor usage documentation

**Acceptance Criteria**:
- ✅ Template includes ≥2 anchor examples
- ✅ "When to use anchors in assets" section added
- ✅ Checklist and workflow anchor patterns demonstrated
- ✅ Template renders correctly

**Testing**:
- [ ] Render in Markdown preview
- [ ] Verify anchor syntax in checklist context

---

## PHASE 2: TOOLING (Hours 9-20)

### [W:TOOLING] T005: Migration Script - Core Logic
**Priority**: P0  
**Estimate**: 4 hours  
**Dependencies**: [B:T001]  
**Assignee**: TBD

**Description**: Build core migration script logic for detecting anchor opportunities and inserting anchor tags.

**Deliverables**:
- [ ] `.opencode/skill/system-spec-kit/scripts/dist/skill/add-anchors-to-skills.py`
- [ ] `detect_anchor_opportunities()` function (section detection)
- [ ] `insert_anchors()` function (tag insertion)
- [ ] Anchor mapping configuration (heading patterns → anchor names)
- [ ] Dry-run mode implementation

**Acceptance Criteria**:
- ✅ Script parses Markdown structure (H1, H2, content blocks)
- ✅ Script maps sections to anchor types via regex patterns
- ✅ Script inserts opening/closing tags correctly
- ✅ Dry-run mode logs changes without writing files
- ✅ Original formatting preserved (line breaks, whitespace)

**Testing**:
- [ ] Unit test: `test_detect_summary_anchor()`
- [ ] Unit test: `test_detect_section_anchor()`
- [ ] Unit test: `test_insert_anchors()`
- [ ] Integration test: Dry-run on sample skill

---

### [W:TOOLING] T006: Migration Script - Modes & Safety
**Priority**: P0  
**Estimate**: 3 hours  
**Dependencies**: [B:T005]  
**Assignee**: TBD

**Description**: Implement migration modes (dry-run, interactive, batch) and safety features (backup, rollback).

**Deliverables**:
- [ ] Dry-run mode (log changes, no writes)
- [ ] Interactive mode (confirm per file)
- [ ] Batch mode (process all with progress bar)
- [ ] Backup creation (copy originals to timestamped dir)
- [ ] Rollback function (restore from backup)
- [ ] CLI argument parsing

**Acceptance Criteria**:
- ✅ Dry-run shows all proposed changes without modifying files
- ✅ Interactive mode prompts for confirmation per file
- ✅ Batch mode processes all files with progress indicator
- ✅ Backups created before any modification
- ✅ Rollback restores exact original state (verified with diff)
- ✅ CLI arguments documented in `--help`

**Testing**:
- [ ] Integration test: `test_dry_run_no_writes()`
- [ ] Integration test: `test_interactive_mode_prompts()`
- [ ] Integration test: `test_backup_creation()`
- [ ] Integration test: `test_rollback_restores_originals()`

---

### [W:TOOLING] T007: Validation Script - Format Checking
**Priority**: P1  
**Estimate**: 2 hours  
**Dependencies**: [B:T001]  
**Assignee**: TBD

**Description**: Build validation script to check anchor format correctness (tags match, no orphans, no nesting).

**Deliverables**:
- [ ] `.opencode/skill/system-spec-kit/scripts/dist/skill/validate-skill-anchors.py`
- [ ] `validate_anchors()` function
- [ ] Format checks: matching tags, no orphans, no nesting, non-empty content
- [ ] JSON report generation
- [ ] Exit code behavior (0=pass, 1=warnings, 2=errors)

**Acceptance Criteria**:
- ✅ Detects orphaned opening/closing tags
- ✅ Detects mismatched tag names
- ✅ Detects nested anchors
- ✅ Detects duplicate anchor names
- ✅ Generates JSON report with file-level details
- ✅ Returns appropriate exit codes

**Testing**:
- [ ] Unit test: `test_orphaned_closing_tag()`
- [ ] Unit test: `test_mismatched_tags()`
- [ ] Unit test: `test_nested_anchors()`
- [ ] Unit test: `test_duplicate_anchors()`

---

### [W:TOOLING] T008: Validation Script - Coverage Checking
**Priority**: P1  
**Estimate**: 2 hours  
**Dependencies**: [B:T007]  
**Assignee**: TBD

**Description**: Add coverage validation to check % of sections anchored and identify missing anchors.

**Deliverables**:
- [ ] Coverage calculation per file (% sections anchored)
- [ ] Coverage report per skill folder
- [ ] Missing anchor identification by section type
- [ ] Coverage targets (80% SKILL.md, 60% references, 40% assets)
- [ ] Remediation guidance (which sections missing anchors)

**Acceptance Criteria**:
- ✅ Calculates coverage percentage per file
- ✅ Identifies missing anchors by section name
- ✅ Reports skill-level coverage summary
- ✅ Flags files below coverage targets
- ✅ Provides actionable remediation list

**Testing**:
- [ ] Unit test: `test_coverage_calculation()`
- [ ] Integration test: Coverage report on sample skill

---

## PHASE 3: MIGRATION (Hours 21-32)

### [W:MIGRATION] T009: Dry-Run and Review
**Priority**: P0  
**Estimate**: 2 hours  
**Dependencies**: [B:T006]  
**Assignee**: TBD

**Description**: Run migration script in dry-run mode on all skills and review proposed changes.

**Deliverables**:
- [ ] Dry-run log with change proposals for all 9 skills
- [ ] Edge cases documented (sections requiring manual intervention)
- [ ] Review summary (accuracy assessment)
- [ ] Manual intervention list (files to skip or handle specially)

**Acceptance Criteria**:
- ✅ Dry-run completes without errors
- ✅ All proposed changes logged
- ✅ Edge cases identified and documented
- ✅ Review approved by lead

**Testing**:
- [ ] Dry-run on all skills: `system-spec-kit`, `workflows-documentation`, `workflows-code--web-dev`, `workflows-code--full-stack`, `workflows-git`, `workflows-chrome-devtools`, `workflows-code--opencode`, `mcp-code-mode`, `mcp-figma`
- [ ] Manual review of proposed changes for accuracy

---

### [W:MIGRATION] T010: Backup and Batch Migration
**Priority**: P0  
**Estimate**: 3 hours  
**Dependencies**: [B:T009]  
**Assignee**: TBD

**Description**: Create backups and run batch migration on all skills.

**Deliverables**:
- [ ] Backup directory created with timestamp
- [ ] All skill files backed up
- [ ] Batch migration executed
- [ ] Migration log with file-level results
- [ ] Backup integrity verified

**Acceptance Criteria**:
- ✅ Backup directory created: `backups/[YYYYMMDD_HHMM]_anchor_migration/`
- ✅ All files in `.opencode/skill/` backed up
- ✅ Batch migration completes successfully
- ✅ Migration log shows 100% success rate (or <5% errors)
- ✅ Backup verified (file count, sizes match originals)

**Testing**:
- [ ] Verify backup creation
- [ ] Run batch migration: `python3 add-anchors-to-skills.py --skill-path .opencode/skill --mode batch --backup-dir backups/[timestamp]`
- [ ] Check migration log for errors

---

### [W:MIGRATION] T011: Post-Migration Validation
**Priority**: P0  
**Estimate**: 2 hours  
**Dependencies**: [B:T010]  
**Assignee**: TBD

**Description**: Run validation suite on all migrated skills to verify format correctness and coverage.

**Deliverables**:
- [ ] Format validation report (must pass with 0 errors)
- [ ] Coverage validation report (verify targets met)
- [ ] JSON reports for review
- [ ] Fixed validation errors (if any)

**Acceptance Criteria**:
- ✅ Format validation: 0 errors (100% pass rate)
- ✅ Coverage validation: ≥80% SKILL.md, ≥60% references
- ✅ JSON reports generated
- ✅ All validation errors fixed

**Testing**:
- [ ] Run format validation: `python3 validate-skill-anchors.py --skill-path .opencode/skill --json-report validation-format.json --fail-on error`
- [ ] Run coverage validation: `python3 validate-skill-anchors.py --skill-path .opencode/skill --check-coverage --json-report validation-coverage.json`
- [ ] Review JSON reports for issues

---

### [W:MIGRATION] T012: Manual Review and Refinement
**Priority**: P1  
**Estimate**: 5 hours  
**Dependencies**: [B:T011]  
**Assignee**: TBD

**Description**: Manually review and improve anchor placement for key skills to achieve ≥90% coverage.

**Deliverables**:
- [ ] `system-spec-kit` at ≥90% coverage
- [ ] `workflows-documentation` at ≥90% coverage
- [ ] `workflows-code--full-stack` at ≥90% coverage
- [ ] Validation warnings resolved (low coverage files)
- [ ] Improved anchor placement verified in isolation (content makes sense)

**Acceptance Criteria**:
- ✅ Key skills (3 listed above) at ≥90% coverage
- ✅ Validation warnings reduced by ≥50%
- ✅ Anchored content readable in isolation
- ✅ No orphaned or malformed anchors introduced

**Testing**:
- [ ] Manual review of anchored sections (readability check)
- [ ] Re-run validation after improvements
- [ ] Verify coverage targets met

---

## PHASE 4: DOCUMENTATION & HANDOVER (Hours 33-40)

### [W:DOCS] T013: Migration Guide
**Priority**: P0  
**Estimate**: 2 hours  
**Dependencies**: [B:T012]  
**Assignee**: TBD

**Description**: Create comprehensive migration guide for future reference and team training.

**Deliverables**:
- [ ] `migration-guide.md` in spec folder
- [ ] Overview of anchor system
- [ ] How to use migration script (with examples)
- [ ] How to validate anchors
- [ ] Rollback procedure
- [ ] Troubleshooting common issues

**Acceptance Criteria**:
- ✅ Guide covers all migration script modes (dry-run, interactive, batch)
- ✅ Validation instructions included
- ✅ Rollback procedure documented with commands
- ✅ Troubleshooting section with ≥5 common issues
- ✅ Guide reviewed and approved

**Testing**:
- [ ] Follow guide to perform test migration (verify accuracy)
- [ ] Peer review by documentation lead

---

### [W:DOCS] T014: Update workflows-documentation Skill
**Priority**: P0  
**Estimate**: 3 hours  
**Dependencies**: [B:T001], [B:T012]  
**Assignee**: TBD

**Description**: Add anchor usage guidelines to workflows-documentation skill for ongoing maintenance.

**Deliverables**:
- [ ] "Anchor Usage Guidelines" section added to `workflows-documentation/SKILL.md`
- [ ] Anchor taxonomy documented with examples
- [ ] Validation instructions added
- [ ] Quick reference updated with anchor commands

**Acceptance Criteria**:
- ✅ SKILL.md includes comprehensive anchor guidelines
- ✅ Taxonomy documented with examples
- ✅ Validation commands documented
- ✅ Quick reference includes anchor tooling

**Testing**:
- [ ] Review by documentation lead
- [ ] Verify guidelines match templates

---

### [W:DOCS] T015: Create Anchor Usage Examples
**Priority**: P1  
**Estimate**: 2 hours  
**Dependencies**: [B:T012]  
**Assignee**: TBD

**Description**: Create before/after examples showing anchor transformations for different document types.

**Deliverables**:
- [ ] `examples/before-after-skill.md` (SKILL.md transformation)
- [ ] `examples/before-after-reference.md` (reference doc transformation)
- [ ] `examples/before-after-asset.md` (asset doc transformation)
- [ ] `examples/troubleshooting-examples.md` (common issues and fixes)

**Acceptance Criteria**:
- ✅ 4 example files created
- ✅ Each example shows clear before/after with annotations
- ✅ Examples cover common scenarios
- ✅ Troubleshooting examples include ≥3 issues with solutions

**Testing**:
- [ ] Manual review for clarity
- [ ] Verify examples align with taxonomy

---

### [W:DOCS] T016: CI Integration Documentation
**Priority**: P2  
**Estimate**: 1 hour  
**Dependencies**: [B:T008]  
**Assignee**: TBD

**Description**: Document how to integrate anchor validation into CI/CD pipeline.

**Deliverables**:
- [ ] CI integration instructions in migration guide
- [ ] Sample GitHub Actions workflow (if applicable)
- [ ] Pre-commit hook example (optional, warning only)

**Acceptance Criteria**:
- ✅ Instructions for CI integration documented
- ✅ Sample workflow provided (if using GitHub)
- ✅ Pre-commit hook example included

**Testing**:
- [ ] Verify sample workflow syntax (if applicable)
- [ ] Test pre-commit hook on sample skill (if implemented)

---

## QUALITY GATES

### Gate 1: Template Review (After Phase 1)
**Blocking Tasks**: T001-T004

**Exit Criteria**:
- [ ] All three templates updated with anchors
- [ ] Anchor guidelines section added to each template
- [ ] Documentation lead approval received
- [ ] Templates render correctly in Markdown preview

**Approval Required**: Documentation Lead

---

### Gate 2: Migration Dry-Run (After T009)
**Blocking Tasks**: T009

**Exit Criteria**:
- [ ] Dry-run completes without errors on all skills
- [ ] Backup strategy tested and verified
- [ ] Rollback procedure tested on sample skill
- [ ] Edge cases documented

**Approval Required**: Tech Lead

---

### Gate 3: Validation (After T011)
**Blocking Tasks**: T011

**Exit Criteria**:
- [ ] 100% of skills pass format validation (0 errors)
- [ ] Coverage targets met (≥80% SKILL.md, ≥60% references)
- [ ] No functional regressions in skill loading
- [ ] Validation reports reviewed

**Approval Required**: QA Lead

---

### Gate 4: Documentation (After Phase 4)
**Blocking Tasks**: T013-T016

**Exit Criteria**:
- [ ] Migration guide published in spec folder
- [ ] workflows-documentation skill updated
- [ ] Troubleshooting section complete
- [ ] Before/after examples documented
- [ ] CI integration documented

**Approval Required**: Documentation Lead

---

## TASK SUMMARY

### By Phase
| Phase | Tasks | Hours | Dependencies |
|-------|-------|-------|--------------|
| Phase 1: Foundation | T001-T004 | 8 | None → T001 → {T002, T003, T004} |
| Phase 2: Tooling | T005-T008 | 11 | T001 → T005 → T006, T001 → T007 → T008 |
| Phase 3: Migration | T009-T012 | 12 | T006 → T009 → T010 → T011 → T012 |
| Phase 4: Docs | T013-T016 | 8 | T012 → {T013, T014, T015, T016} |
| **Total** | **16 tasks** | **39 hours** | |

### By Priority
| Priority | Count | Tasks |
|----------|-------|-------|
| P0 | 11 | T001, T002, T003, T004, T005, T006, T009, T010, T011, T013, T014 |
| P1 | 4 | T007, T008, T012, T015 |
| P2 | 1 | T016 |

### By Workstream
| Workstream | Tasks | Hours |
|------------|-------|-------|
| [W:FOUNDATION] | 4 | 8 |
| [W:TOOLING] | 4 | 11 |
| [W:MIGRATION] | 4 | 12 |
| [W:DOCS] | 4 | 8 |

---

## CRITICAL PATH

```
T001 (Define Taxonomy) → 2h
  ├─→ T002 (Update skill_md_template) → 2h
  ├─→ T003 (Update skill_reference_template) → 2h
  ├─→ T004 (Update skill_asset_template) → 2h
  └─→ T005 (Migration Core Logic) → 4h
        └─→ T006 (Migration Modes & Safety) → 3h
              └─→ T009 (Dry-Run & Review) → 2h
                    └─→ T010 (Backup & Batch Migration) → 3h
                          └─→ T011 (Post-Migration Validation) → 2h
                                └─→ T012 (Manual Review) → 5h
                                      ├─→ T013 (Migration Guide) → 2h
                                      ├─→ T014 (Update workflows-documentation) → 3h
                                      └─→ T015 (Examples) → 2h

Total Critical Path: 32 hours (minimum completion time)
```

**Parallel Work Opportunities**:
- T002, T003, T004 can be done in parallel (after T001)
- T007, T008 (validation) can be developed in parallel with T005, T006 (migration)
- T013, T014, T015 can be done in parallel (after T012)

---

## RISK MITIGATION TASKS

### Rollback Testing (Inline with T006)
- **Task**: Test rollback procedure on sample skill
- **Time**: 30 minutes (included in T006 estimate)
- **When**: During T006 implementation
- **Verification**: Diff original vs restored files (byte-identical)

### Edge Case Handling (Inline with T009)
- **Task**: Identify and document sections that automated mapping misses
- **Time**: Included in T009 estimate
- **When**: During dry-run review
- **Action**: Create manual intervention list for T012

### Performance Monitoring (Post-Migration)
- **Task**: Verify no skill loading performance regressions
- **Time**: 30 minutes (not in estimates, done during normal usage)
- **When**: After T011 validation
- **Metric**: Skill load time increase <10ms

---

## HANDOVER CHECKLIST

**Upon Completion**:
- [ ] All tasks marked complete
- [ ] Quality gates passed
- [ ] Migration guide published
- [ ] workflows-documentation skill updated
- [ ] Backups retained (30-day retention)
- [ ] Git commits pushed to remote
- [ ] Git tag created: `anchor-migration-v1.0`
- [ ] Team notified of new anchor system
- [ ] Training session scheduled (optional)

**Ongoing Maintenance**:
- [ ] Monthly anchor audit scheduled
- [ ] Quarterly taxonomy review scheduled
- [ ] Validation script added to CI (if applicable)
- [ ] Pre-commit hook documented (optional)

---

**Document Status**: Complete  
**Total Estimated Hours**: 39 hours  
**Estimated Timeline**: 5 days (8 hours/day) with 1 developer  
**Critical Path Duration**: 32 hours (minimum with no parallelization)
