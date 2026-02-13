<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Spec Kit Script Automation & Cleanup

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## EXECUTIVE SUMMARY

This specification covers a comprehensive audit, cleanup, and automation improvement effort for all non-MCP scripts in the system-spec-kit skill. The effort addresses dead code elimination (7 instances), DRY violations (5 consolidations needed), bug fixes (5 issues), automation gaps (6 improvements), documentation accuracy (5 READMEs), and alignment with workflows-opencode TypeScript standards across 60+ script files spanning 10 directories.

**Key Decisions**: Incremental cleanup over big-bang refactor, dead code removal before DRY consolidation, preserve TypeScript project structure

**Critical Dependencies**: No external dependencies; all work is internal refactoring

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-11 |
| **Branch** | `109-spec-kit-script-automation` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
The system-spec-kit scripts directory contains dead code (shared/chunking.ts with 107 unused lines), DRY violations (validateNoLeakedPlaceholders duplicated across files), bugs (unused variables, inconsistent simulation markers), automation gaps (no dry-run mode for cleanup tools), outdated documentation (5 READMEs with wrong import paths), and architectural inconsistencies (templates/compose.sh hardcodes 800-line templates instead of composing dynamically). This technical debt reduces maintainability, creates confusion for contributors, and violates the single-source-of-truth principle.

### Purpose
Establish a clean, reliable, fully-automated script foundation where every line of code serves a verified purpose, all documentation is accurate, and AI agents can confidently consume scripts without encountering dead code, bugs, or inconsistencies.

---

## 3. SCOPE

### In Scope
- Dead code elimination across 7 modules (chunking.ts, workflow.ts exports, DataSource type, etc.)
- DRY consolidation for 5 duplication instances (validation functions, error messages, archive filters)
- Bug fixes for 5 issues (unused variables, simulation markers, section numbering, import guards)
- Automation improvements for 6 gaps (dry-run mode, import path corrections, config validation)
- Documentation accuracy fixes for 5 READMEs
- Code quality alignment with workflows-opencode TypeScript standards
- Refactoring of oversized functions (workflow.ts runWorkflow 398 lines, create.sh 928 lines)

### Out of Scope
- MCP server scripts (separate codebase)
- Functional changes to script behavior (refactor only, no new features)
- Migration to different build systems (preserve TypeScript project references)
- Performance optimization (unless discovered during refactoring)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| shared/chunking.ts | Delete or consolidate | Dead code: chunkContent has no consumers |
| core/workflow.ts | Modify | Remove 9 dead exports, consolidate duplicated validators, refactor runWorkflow |
| core/config.ts | Modify | Remove dead loadConfig export, add config validation |
| loaders/data-loader.ts | Modify | Remove DataSource type, fix _source/_isSimulation markers |
| spec-folder/directory-setup.ts | Modify | Fix existingDirs unused variable bug |
| spec-folder/folder-detector.ts | Modify | Remove SpecFolderInfo interface, consolidate error messages |
| spec-folder/alignment-validator.ts | Modify | Merge validateContentAlignment/validateFolderAlignment, fix archive regex |
| templates/compose.sh | Modify | Make Level 3/3+ templates dynamic (compose from core+addendums) |
| utils/validation-utils.ts | Investigate/remove | Confirm dead code or wire up consumers |
| memory/cleanup-orphaned-vectors.ts | Modify | Add dry-run mode, add import guard |
| memory/rank-memories.ts | Modify | Redirect imports from MCP barrel to shared/ |
| spec/create.sh | Modify | Modularize 928-line script |
| renderers/template-renderer.ts | Modify | Fix OPTIONAL_PLACEHOLDERS maintenance burden |
| core/README.md | Modify | Fix lazy loading description |
| loaders/README.md | Modify | Fix data.messages example, import paths |
| renderers/README.md | Modify | Fix import paths and function signatures |
| templates/README.md | Modify | Acknowledge L3/L3+ hardcoded templates limitation |
| All TypeScript files | Modify | Audit against workflows-opencode standards (headers, dividers, naming) |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Remove all dead code (7 instances) | shared/chunking.ts deleted or consolidated, 9 dead exports removed from workflow.ts, DataSource type removed, SpecFolderInfo removed, validation-utils.ts resolved |
| REQ-002 | Fix all critical bugs (5 issues) | existingDirs bug fixed, _source/_isSimulation inconsistency resolved, section numbering fixed, import guard added to cleanup-orphaned-vectors.ts, OPTIONAL_PLACEHOLDERS fixed |
| REQ-003 | All TypeScript files pass `tsc --build` with no errors | Build completes successfully, dist/ directory contains 177 files with 1:1 source mapping |
| REQ-004 | All existing tests pass (800+ tests) | `npm test` exits with code 0, no regressions introduced |
| REQ-005 | Templates compose.sh produces identical output for L3/L3+ | Dynamically composed templates match current hardcoded output byte-for-byte |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Consolidate all DRY violations (5 instances) | validateNoLeakedPlaceholders unified, extractKeyTopics duplication resolved, validateContentAlignment/validateFolderAlignment merged, archive regex consolidated, error messages deduplicated |
| REQ-007 | Implement all automation improvements (6 gaps) | Dry-run mode added to cleanup-orphaned-vectors.ts, rank-memories.ts imports redirected, test imports migrated to dist/, config validation added, compose.sh sed portability improved |
| REQ-008 | Fix all documentation inaccuracies (5 READMEs) | core/, loaders/, renderers/, templates/ READMEs updated with correct examples, import paths, function signatures |
| REQ-009 | Refactor oversized functions | runWorkflow() broken into <100-line functions, create.sh modularized into sourced libraries |
| REQ-010 | Align all TypeScript files with workflows-opencode standards | File headers present, section dividers consistent, naming conventions followed |

---

## 5. SUCCESS CRITERIA

- **SC-001**: Zero dead code detected by automated analysis (no unused exports, no unused functions, no unused types)
- **SC-002**: All READMEs have accurate examples verified by automated import path checking
- **SC-003**: workflows-opencode TypeScript standards compliance score of 95%+ (automated audit)
- **SC-004**: All scripts pass automated reliability checks (import guards present, dry-run modes available, error handling complete)
- **SC-005**: Build time remains under 10 seconds (no performance regression from refactoring)

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Breaking changes from dead code removal | Medium - code marked "dead" may have hidden consumers | Comprehensive grep/rg search before deletion, run full test suite after each removal |
| Risk | Template composition changes introduce regressions | High - compose.sh changes affect all future spec folders | Byte-for-byte output verification, golden file testing, manual diff review |
| Risk | Refactoring introduces bugs in core workflow | High - workflow.ts is central to all spec folder operations | Incremental refactoring with test coverage verification at each step |
| Risk | macOS/Linux sed portability issues | Medium - compose.sh changes may break on one platform | Test on both platforms before merge, consider portable alternative (node.js script) |
| Dependency | No external dependencies | None | N/A |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Build time (tsc --build) must remain under 10 seconds
- **NFR-P02**: Memory usage during build must not exceed 500MB

### Security
- **NFR-S01**: No new filesystem access patterns outside workspace boundaries
- **NFR-S02**: Path traversal protections in shared/utils/path-security.ts remain intact

### Reliability
- **NFR-R01**: All scripts must include error handling for file I/O operations
- **NFR-R02**: Cleanup tools must have dry-run mode before destructive operations

---

## 8. EDGE CASES

### Data Boundaries
- Empty chunking.ts consumers check: verify NO imports of chunkContent exist in entire workspace before deletion
- Template composition edge case: Level 3+ with custom addendums must still compose correctly

### Error Scenarios
- Build failure during refactoring: rollback mechanism via git stash + branch protection
- Test failures after DRY consolidation: revert consolidation, investigate divergence reasons
- Compose.sh sed failure on Linux: fallback to portable node.js-based composition

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 18+, LOC: ~2000 affected, Systems: 10 directories |
| Risk | 20/25 | Core workflow affected, template system changes, no breaking changes allowed |
| Research | 12/20 | Investigation needed for validation-utils.ts, extractKeyTopics divergence reasons, compose.sh alternatives |
| Multi-Agent | 10/15 | Single-agent work, but coordination with workflows-opencode standards |
| Coordination | 8/15 | Dependencies: TypeScript build system, test suite, documentation system |
| **Total** | **72/100** | **Level 3** (bumped to 3+ for governance due to core system changes) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Dead code has hidden consumers | H | L | Comprehensive workspace search, test suite verification |
| R-002 | Template composition regression | H | M | Golden file testing, byte-for-byte output comparison |
| R-003 | Refactoring breaks existing workflows | H | M | Incremental changes, test coverage at each step |
| R-004 | Platform-specific sed failures | M | M | Test on macOS + Linux, consider node.js alternative |
| R-005 | Documentation fixes introduce new errors | L | L | Automated link checking, import path validation |

---

## 11. USER STORIES

### US-001: Dead Code Elimination (Priority: P0)

**As a** system-spec-kit maintainer, **I want** all unused code removed, **so that** contributors don't waste time understanding dead code paths.

**Acceptance Criteria**:
1. Given shared/chunking.ts chunkContent function, When searching entire workspace for imports, Then zero consumers found → delete function
2. Given core/workflow.ts exports, When checking external imports, Then only runWorkflow is imported → remove 9 internal-only exports
3. Given validation-utils.ts, When searching for consumers, Then either find consumers or delete file

### US-002: DRY Consolidation (Priority: P1)

**As a** developer modifying validation logic, **I want** validation functions in one place, **so that** I don't have to update multiple copies.

**Acceptance Criteria**:
1. Given validateNoLeakedPlaceholders in workflow.ts and validation-utils.ts, When consolidating, Then single canonical version exists in utils/
2. Given validateContentAlignment and validateFolderAlignment, When merging, Then single function with domain parameter covers both cases
3. Given archive filtering regex duplicated, When consolidating, Then filterArchiveFolders function is reused everywhere

### US-003: Template Composition Fix (Priority: P0)

**As a** spec folder creator, **I want** Level 3+ templates composed dynamically, **so that** changes to core/addendum files automatically propagate.

**Acceptance Criteria**:
1. Given compose.sh script, When generating Level 3 spec.md, Then result equals current hardcoded output byte-for-byte
2. Given change to core/spec-core.md, When running compose.sh, Then Level 1/2/3/3+ all reflect the change
3. Given compose.sh execution, When running on macOS and Linux, Then identical output produced

### US-004: Automation Improvements (Priority: P1)

**As an** AI agent, **I want** all cleanup scripts to have dry-run modes, **so that** I can preview changes before executing.

**Acceptance Criteria**:
1. Given cleanup-orphaned-vectors.ts, When running with --dry-run flag, Then report orphaned vectors without deletion
2. Given rank-memories.ts imports, When redirected to shared/, Then no dependency on MCP server barrel
3. Given test files, When imports use dist/ paths, Then TypeScript migration is complete

### US-005: Documentation Accuracy (Priority: P1)

**As a** new contributor, **I want** README examples to work copy-paste, **so that** I can quickly understand how to use each module.

**Acceptance Criteria**:
1. Given core/README.md, When following import examples, Then all paths resolve correctly
2. Given loaders/README.md, When using data.messages example, Then property exists on type
3. Given renderers/README.md, When calling functions per signature, Then TypeScript accepts arguments

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | @speckit maintainer | Pending | TBD |
| Dead Code Removal | @speckit maintainer | Pending | TBD |
| Template Changes | @speckit maintainer | Pending | TBD |
| Final Review | @speckit maintainer | Pending | TBD |

---

## 13. COMPLIANCE CHECKPOINTS

### Code Compliance
- [ ] TypeScript strict mode compliance maintained
- [ ] workflows-opencode standards met (file headers, section dividers, naming)
- [ ] No new ESLint warnings introduced

### License Compliance
- [ ] No new dependencies added (internal refactoring only)

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| @speckit users | Consumers | High - reliability improvements | Release notes for breaking changes |
| system-spec-kit maintainers | Owners | High - maintainability gains | Per-task review on critical changes |
| AI agents | Consumers | High - automation improvements | Documentation updates |

---

## 15. CHANGE LOG

### v1.0 (2026-02-11)
**Initial specification**
- Identified 29 issues across 10 directories
- Categorized into 6 task groups (dead code, DRY, bugs, automation, docs, quality)
- Scoped 18+ file changes with detailed acceptance criteria

---

## 16. OPEN QUESTIONS

- Q1: Should shared/chunking.ts be deleted entirely or consolidated with mcp_server/lib/parsing/memory-parser.ts?
- Q2: Is extractKeyTopics divergence between workflow.ts and session-extractor.ts intentional? Should they be unified or documented as separate concerns?
- Q3: Should hand-rolled JSONC parser in core/config.ts be replaced with library (e.g., jsonc-parser) or kept for zero-dependency principle?
- Q4: Should compose.sh be rewritten in Node.js for portability or kept as shell script with improved sed compatibility?
- Q5: What is the actual purpose of validation-utils.ts if it has no consumers? Delete or document intended use case?

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
