# Checklist: Retrieval Anchors for Skill Documentation

**Spec Folder**: `specs/002-commands-and-skills/000-skills/001-anchor-implementation`  
**Level**: 3+ (Governance + Architecture)  
**Status**: Planning  
**Created**: 2026-02-17

---

## PRIORITY SYSTEM

| Priority | Meaning | Deferral Rules |
|----------|---------|----------------|
| **P0** | HARD BLOCKER | MUST complete, cannot defer |
| **P1** | Required | MUST complete OR user-approved deferral |
| **P2** | Optional | Can defer without approval |

---

## PHASE 1: FOUNDATION

### P0: Anchor Taxonomy Definition
- [ ] **Create anchor-taxonomy.md** [E:anchor-taxonomy.md]
  - [ ] Define 10-15 anchor names with purposes
  - [ ] Document anchor categories (summary, structural, operational, metadata)
  - [ ] Define placement rules and examples
  - [ ] Maximum 20 unique anchor types
  - [ ] All anchor names lowercase, hyphenated
- [ ] **Get documentation lead approval** [E:approval-email]

### P0: Template Updates
- [ ] **Update skill_md_template.md** [E:git-diff-skill_md_template.md]
  - [ ] Add "How to Use Anchors" subsection after frontmatter
  - [ ] Include ≥3 concrete anchor examples (summary, rules, examples)
  - [ ] Add validation instructions
  - [ ] Verify rendering in VS Code and GitHub
  - [ ] No breaking changes to existing structure
  
- [ ] **Update skill_reference_template.md** [E:git-diff-skill_reference_template.md]
  - [ ] Add ≥2 anchor examples
  - [ ] Demonstrate multi-anchor patterns
  - [ ] Document cross-reference patterns
  - [ ] Verify rendering
  
- [ ] **Update skill_asset_template.md** [E:git-diff-skill_asset_template.md]
  - [ ] Add ≥2 anchor examples
  - [ ] Add "When to use anchors in assets" section
  - [ ] Demonstrate checklist and workflow anchor patterns
  - [ ] Verify rendering

### P1: Template Testing
- [ ] **Create test skill from updated templates** [E:test-skill-folder/]
- [ ] **Verify anchor syntax renders correctly** [Screenshot:markdown-preview.png]
- [ ] **Peer review by documentation lead** [E:review-comments]

---

## PHASE 2: TOOLING

### P0: Migration Script Core
- [ ] **Create add-anchors-to-skills.py** [E:.opencode/skill/system-spec-kit/scripts/dist/skill/add-anchors-to-skills.py]
  - [ ] Implement `detect_anchor_opportunities()` function
  - [ ] Implement `insert_anchors()` function
  - [ ] Define anchor mapping configuration (regex patterns)
  - [ ] Implement dry-run mode
  - [ ] Preserve original formatting

### P0: Migration Script Safety Features
- [ ] **Implement migration modes** [E:CLI-help-output]
  - [ ] Dry-run mode (log changes, no writes)
  - [ ] Interactive mode (confirm per file)
  - [ ] Batch mode (process all with progress)
- [ ] **Implement backup creation** [E:backup-directory-structure]
- [ ] **Implement rollback function** [E:rollback-script-output]
- [ ] **CLI argument parsing with --help** [E:--help-output]

### P1: Validation Script Format
- [ ] **Create validate-skill-anchors.py** [E:.opencode/skill/system-spec-kit/scripts/dist/skill/validate-skill-anchors.py]
  - [ ] Implement `validate_anchors()` function
  - [ ] Detect orphaned tags
  - [ ] Detect mismatched tags
  - [ ] Detect nested anchors
  - [ ] Detect duplicate anchor names
  - [ ] Detect empty anchor content
- [ ] **JSON report generation** [E:sample-validation-report.json]
- [ ] **Exit code behavior (0=pass, 1=warn, 2=error)** [E:exit-code-test-results]

### P1: Validation Script Coverage
- [ ] **Implement coverage calculation** [E:coverage-calculation-code]
  - [ ] Per-file coverage (% sections anchored)
  - [ ] Per-skill folder summary
  - [ ] Missing anchor identification
  - [ ] Coverage targets: 80% SKILL.md, 60% references, 40% assets
- [ ] **Remediation guidance** [E:sample-remediation-output]

### P1: Script Testing
- [ ] **Unit tests for migration script** [Test:pytest-migration-results]
  - [ ] test_detect_summary_anchor()
  - [ ] test_detect_section_anchor()
  - [ ] test_insert_anchors()
  - [ ] test_dry_run_no_writes()
  - [ ] test_backup_creation()
  - [ ] test_rollback_restores_originals()
  
- [ ] **Unit tests for validation script** [Test:pytest-validation-results]
  - [ ] test_orphaned_closing_tag()
  - [ ] test_mismatched_tags()
  - [ ] test_nested_anchors()
  - [ ] test_duplicate_anchors()
  - [ ] test_coverage_calculation()

---

## PHASE 3: MIGRATION

### P0: Pre-Migration Validation
- [ ] **Run dry-run on all skills** [E:migration-dryrun.log]
  - [ ] system-spec-kit
  - [ ] workflows-documentation
  - [ ] workflows-code--web-dev
  - [ ] workflows-code--full-stack
  - [ ] workflows-git
  - [ ] workflows-chrome-devtools
  - [ ] workflows-code--opencode
  - [ ] mcp-code-mode
  - [ ] mcp-figma
- [ ] **Review proposed changes** [E:dry-run-review-summary.md]
- [ ] **Document edge cases** [E:edge-cases-list.md]
- [ ] **Test rollback procedure on sample skill** [E:rollback-test-output]

### P0: Backup Creation
- [ ] **Create timestamped backup directory** [E:backups/[YYYYMMDD_HHMM]_anchor_migration/]
- [ ] **Copy entire .opencode/skill/ to backup** [E:backup-verification-checksums]
- [ ] **Verify backup integrity** [E:backup-file-count-sizes]
  - [ ] File count matches
  - [ ] File sizes match
  - [ ] Checksums verified (sample)

### P0: Batch Migration Execution
- [ ] **Run batch migration** [E:migration-batch.log]
  - [ ] Command: `python3 add-anchors-to-skills.py --skill-path .opencode/skill --mode batch --backup-dir backups/[timestamp]`
  - [ ] Monitor progress
  - [ ] Log any errors
- [ ] **Verify migration completion** [E:migration-summary-report]
  - [ ] 100% success rate OR <5% errors
  - [ ] All modified files logged

### P0: Post-Migration Validation
- [ ] **Run format validation** [E:validation-post-migration.json]
  - [ ] Command: `python3 validate-skill-anchors.py --skill-path .opencode/skill --json-report validation-post-migration.json --fail-on error`
  - [ ] 0 errors (100% pass rate)
- [ ] **Run coverage validation** [E:coverage-post-migration.json]
  - [ ] Command: `python3 validate-skill-anchors.py --skill-path .opencode/skill --check-coverage --json-report coverage-post-migration.json`
  - [ ] ≥80% SKILL.md coverage
  - [ ] ≥60% references coverage
- [ ] **Fix any validation errors** [E:error-fixes-log.md]

### P1: Manual Review and Refinement
- [ ] **Review validation warnings** [E:warnings-analysis.md]
- [ ] **Improve key skills to ≥90% coverage** [E:improved-coverage-report]
  - [ ] system-spec-kit → 90%+
  - [ ] workflows-documentation → 90%+
  - [ ] workflows-code--full-stack → 90%+
- [ ] **Verify anchored content readable in isolation** [E:readability-review-notes.md]
- [ ] **Re-run validation after improvements** [E:validation-final.json]

### P1: Functional Testing
- [ ] **Verify skill loading works** [Test:load-all-skills]
- [ ] **Check Markdown rendering** [Screenshot:github-preview.png, vscode-preview.png]
- [ ] **No performance regressions** [E:skill-load-time-comparison]
  - [ ] Baseline load times measured
  - [ ] Post-anchor load times measured
  - [ ] Increase <10ms

---

## PHASE 4: DOCUMENTATION & HANDOVER

### P0: Migration Guide
- [ ] **Create migration-guide.md** [E:migration-guide.md]
  - [ ] Overview of anchor system
  - [ ] How to use migration script (with examples)
  - [ ] How to validate anchors
  - [ ] Rollback procedure with commands
  - [ ] Troubleshooting section (≥5 issues)
- [ ] **Guide review and approval** [E:guide-review-approval]

### P0: Update workflows-documentation Skill
- [ ] **Add "Anchor Usage Guidelines" section** [E:git-diff-workflows-documentation-SKILL.md]
- [ ] **Document anchor taxonomy with examples** [E:taxonomy-section]
- [ ] **Add validation instructions** [E:validation-section]
- [ ] **Update quick reference** [E:quick-reference-updates]
- [ ] **Documentation lead review** [E:workflows-doc-review]

### P1: Create Usage Examples
- [ ] **Create examples folder** [E:examples/]
- [ ] **Create before-after-skill.md** [E:examples/before-after-skill.md]
- [ ] **Create before-after-reference.md** [E:examples/before-after-reference.md]
- [ ] **Create before-after-asset.md** [E:examples/before-after-asset.md]
- [ ] **Create troubleshooting-examples.md** [E:examples/troubleshooting-examples.md]
  - [ ] Include ≥3 issues with solutions

### P2: CI Integration
- [ ] **Document CI integration** [E:ci-integration-section-in-guide]
- [ ] **Create sample GitHub Actions workflow** (if applicable) [E:.github/workflows/validate-skill-anchors.yml]
- [ ] **Create pre-commit hook example** (optional) [E:pre-commit-hook-example.sh]

---

## GOVERNANCE & QUALITY GATES

### P0: Gate 1 - Template Review
**Trigger**: After Phase 1 completion  
**Blocking Tasks**: T001-T004

- [ ] **All three templates updated** [E:template-update-summary]
- [ ] **Anchor guidelines section in each template** [E:guidelines-checklist]
- [ ] **Documentation lead approval received** [E:gate1-approval-email]
- [ ] **Templates render correctly** [Screenshot:all-templates-rendered.png]

**Approval Required**: Documentation Lead  
**Status**: ⏳ Pending

---

### P0: Gate 2 - Migration Dry-Run
**Trigger**: After T009  
**Blocking Tasks**: T009

- [ ] **Dry-run completes without errors** [E:dry-run-success-log]
- [ ] **Backup strategy tested** [E:backup-test-results]
- [ ] **Rollback procedure tested** [E:rollback-test-results]
- [ ] **Edge cases documented** [E:edge-cases-list.md]

**Approval Required**: Tech Lead  
**Status**: ⏳ Pending

---

### P0: Gate 3 - Validation
**Trigger**: After T011  
**Blocking Tasks**: T011

- [ ] **100% skills pass format validation** [E:validation-pass-report]
- [ ] **Coverage targets met** [E:coverage-targets-met-report]
  - [ ] ≥80% SKILL.md
  - [ ] ≥60% references
- [ ] **No functional regressions** [Test:skill-loading-tests]
- [ ] **Validation reports reviewed** [E:validation-review-summary]

**Approval Required**: QA Lead  
**Status**: ⏳ Pending

---

### P0: Gate 4 - Documentation
**Trigger**: After Phase 4  
**Blocking Tasks**: T013-T016

- [ ] **Migration guide published** [E:migration-guide.md]
- [ ] **workflows-documentation skill updated** [E:git-commit-hash]
- [ ] **Troubleshooting section complete** [E:troubleshooting-verification]
- [ ] **Before/after examples documented** [E:examples-folder-checklist]
- [ ] **CI integration documented** [E:ci-section-complete]

**Approval Required**: Documentation Lead  
**Status**: ⏳ Pending

---

## RISK MITIGATION

### P0: Backup and Rollback
- [ ] **Backup creation verified** [E:backup-checksum-report]
- [ ] **Rollback tested on sample skill** [E:rollback-sample-test]
- [ ] **Rollback SLA documented** (<1 hour) [E:rollback-sla-section]
- [ ] **Backup retention policy** (30 days) [E:retention-policy-doc]

### P1: Performance Monitoring
- [ ] **Baseline performance measured** [E:baseline-performance-report]
- [ ] **Post-migration performance measured** [E:post-migration-performance-report]
- [ ] **Performance increase <10ms** [E:performance-comparison]
- [ ] **No degradation to skill loading** [E:functional-test-results]

### P1: Edge Case Handling
- [ ] **Edge cases identified in dry-run** [E:edge-cases-list.md]
- [ ] **Manual intervention list created** [E:manual-intervention-list.md]
- [ ] **Edge cases handled or documented** [E:edge-case-resolution-log]

---

## DEPLOYMENT

### P0: Pre-Deployment Checks
- [ ] **All unit tests passing** [Test:pytest-all-results]
- [ ] **Integration tests passing** [Test:integration-test-results]
- [ ] **Manual testing checklist complete** [E:manual-test-checklist-signed]
- [ ] **Templates approved** [E:template-approval-email]
- [ ] **Git status clean** (no uncommitted changes) [E:git-status-output]

### P0: Deployment Execution
- [ ] **Commit template updates** [E:git-commit-templates]
- [ ] **Push templates to remote** [E:git-push-output]
- [ ] **Run batch migration** [E:migration-execution-log]
- [ ] **Run post-migration validation** [E:validation-execution-log]
- [ ] **Commit migration changes** [E:git-commit-migration]
- [ ] **Push migration to remote** [E:git-push-migration-output]
- [ ] **Create Git tag** `anchor-migration-v1.0` [E:git-tag-output]

### P0: Post-Deployment Verification
- [ ] **All skills load correctly** [Test:skill-loading-verification]
- [ ] **Markdown renders correctly** [Screenshot:post-deploy-rendering.png]
- [ ] **Validation passes in CI** (if integrated) [E:ci-validation-pass]
- [ ] **Team notified of anchor system** [E:team-notification-email]

---

## ROLLBACK TRIGGERS

**If any of these occur, ROLLBACK immediately**:

- [ ] ❌ Validation errors >5% of files
- [ ] ❌ Skill loading breaks (functional regression)
- [ ] ❌ Markdown rendering issues in VS Code or GitHub
- [ ] ❌ Performance degradation >10ms
- [ ] ❌ Team requests rollback within 24 hours

**Rollback Execution**:
- [ ] **Stop any in-progress operations**
- [ ] **Run rollback script** [E:rollback-execution-log]
- [ ] **Verify rollback with diff** [E:rollback-diff-verification]
- [ ] **Re-run validation on restored files** [E:rollback-validation-results]
- [ ] **Commit rollback** [E:git-commit-rollback]
- [ ] **Document rollback reason** [E:rollback-post-mortem.md]

---

## ONGOING MAINTENANCE

### P2: Regular Audits
- [ ] **Schedule monthly anchor audit** [E:calendar-invite]
- [ ] **Schedule quarterly taxonomy review** [E:calendar-invite]
- [ ] **Add validation to CI** (optional) [E:ci-integration-complete]
- [ ] **Document pre-commit hook** (optional) [E:pre-commit-docs]

### P2: Monitoring and Metrics
- [ ] **Track anchor adoption in new skills** [E:adoption-tracking-sheet]
- [ ] **Monitor coverage trends** [E:coverage-trend-chart]
- [ ] **Review validation logs monthly** [E:monthly-review-calendar]

---

## COMPLETION CRITERIA

**This spec is complete when**:

### P0: Core Deliverables
- [ ] **All templates updated with anchors** [E:template-update-complete]
- [ ] **All 9 skills migrated successfully** [E:migration-success-report]
- [ ] **100% format validation pass** [E:validation-100-pass]
- [ ] **Coverage targets met** (80/60/40) [E:coverage-targets-met]
- [ ] **Migration guide published** [E:migration-guide.md]
- [ ] **workflows-documentation skill updated** [E:workflows-doc-updated]

### P0: Quality Gates
- [ ] **All 4 quality gates passed** [E:all-gates-passed-summary]
- [ ] **All approvals received** [E:all-approvals-checklist]
- [ ] **Zero validation errors** [E:zero-errors-report]
- [ ] **No functional regressions** [Test:regression-test-results]

### P0: Deployment
- [ ] **Changes committed and pushed** [E:git-log]
- [ ] **Git tag created** `anchor-migration-v1.0` [E:git-tag-verify]
- [ ] **Backups retained (30 days)** [E:backup-retention-verified]
- [ ] **Team notified** [E:team-notification-sent]

### P1: Documentation
- [ ] **Usage examples created (4 files)** [E:examples-folder-complete]
- [ ] **Troubleshooting section complete** [E:troubleshooting-complete]
- [ ] **CI integration documented** [E:ci-docs-complete]

---

## EVIDENCE KEY

**Evidence Format**: `[E:filename]` = Evidence file, `[Test:testname]` = Test result, `[Screenshot:filename]` = Screenshot

**Storage**: All evidence stored in `specs/002-commands-and-skills/000-skills/001-anchor-implementation/evidence/`

---

## CHECKLIST STATUS SUMMARY

**Last Updated**: 2026-02-17  
**Total Items**: 150+  
**Completed**: 0  
**In Progress**: 0  
**Blocked**: 0  
**Overall Status**: ⏳ Planning Phase

---

**Next Steps**:
1. Approval of spec.md, plan.md, tasks.md, checklist.md, decision-record.md
2. Begin Phase 1: Foundation (T001-T004)
3. Obtain Gate 1 approval before proceeding to Phase 2
