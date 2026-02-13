# Implementation Plan: Spec Kit Script Automation & Cleanup

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript 5.x, Bash, Node.js 18+ |
| **Framework** | TypeScript Project References (incremental compilation) |
| **Storage** | Filesystem only (no database changes) |
| **Testing** | Vitest (800+ existing tests) |

### Overview
This plan executes incremental refactoring of 18+ files across 10 directories in system-spec-kit scripts. Work proceeds in dependency order: dead code removal first (eliminates false positives), then DRY consolidation (with clean baseline), then bug fixes, automation improvements, documentation updates, and finally code quality alignment. All changes preserve existing TypeScript build structure and pass full test suite.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (29 issues cataloged)
- [x] Success criteria measurable (zero dead code, 95% standards compliance, <10s build time)
- [x] Dependencies identified (none external, TypeScript build system preserved)

### Definition of Done
- [ ] All P0 requirements met (dead code removed, bugs fixed, tests pass, templates compose correctly)
- [ ] All P1 requirements met OR user-approved deferrals (DRY consolidation, automation improvements, docs fixed, refactoring complete, standards alignment)
- [ ] Test suite passing (800+ tests, npm test exits 0)
- [ ] Build completes successfully (tsc --build under 10 seconds, 177 dist/ files)
- [ ] Documentation synchronized (spec/plan/tasks/checklist/decision-record all accurate)
- [ ] No regression in existing functionality (golden file tests pass)

---

## 3. ARCHITECTURE

### Pattern
Incremental Refactoring with Safety Nets

### Key Components
- **Dead Code Analyzer**: Workspace-wide grep/rg search to confirm zero consumers before deletion
- **DRY Consolidator**: Extract duplicated logic to canonical locations (utils/, shared/)
- **Template Composer**: Dynamic composition engine to replace hardcoded 800-line templates
- **Test Harness**: Existing 800+ tests provide regression safety net
- **Build Validator**: TypeScript project references ensure type safety across changes

### Data Flow
```
Source Files (scripts/**/*.ts) 
  → TypeScript Compiler (tsc --build)
  → dist/ Output (177 files, 1:1 mapping)
  → Test Suite (800+ tests)
  → Validation (golden files, import checks)
```

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Dead Code Elimination (Foundation)
- [ ] Confirm shared/chunking.ts has zero consumers → delete or consolidate
- [ ] Remove 9 dead exports from core/workflow.ts (keep only runWorkflow)
- [ ] Remove DataSource type from loaders/data-loader.ts
- [ ] Fix existingDirs unused variable in spec-folder/directory-setup.ts
- [ ] Remove SpecFolderInfo interface from folder-detector.ts
- [ ] Investigate validation-utils.ts → delete if no consumers OR wire up if intended
- [ ] Remove dead loadConfig export from core/config.ts
- [ ] Remove vestigial lazy loading comments from core/workflow.ts
- [ ] Clean up dead exports from alignment-validator.ts and spec-folder/index.ts barrel

### Phase 2: DRY Consolidation (With Clean Baseline)
- [ ] Consolidate validateNoLeakedPlaceholders and validateAnchors (choose canonical location in utils/)
- [ ] Investigate extractKeyTopics duplication → merge if same purpose OR document divergence
- [ ] Merge validateContentAlignment and validateFolderAlignment into single domain-aware function
- [ ] Consolidate archive filtering regex with filterArchiveFolders function
- [ ] Consolidate 3 duplicate error messages in folder-detector.ts

### Phase 3: Bug Fixes
- [ ] Fix existingDirs unused variable bug (already in Phase 1, verify fix)
- [ ] Fix inconsistent _source/_isSimulation markers in data-loader.ts
- [ ] Fix section numbering collision (two "Section 6" in workflow.ts)
- [ ] Add import guard to cleanup-orphaned-vectors.ts (if require.main === module pattern)
- [ ] Fix OPTIONAL_PLACEHOLDERS maintenance burden in template-renderer.ts (make data-driven)

### Phase 4: Automation Improvements
- [ ] Add --dry-run flag to cleanup-orphaned-vectors.ts
- [ ] Redirect rank-memories.ts imports from MCP barrel to shared/ directly
- [ ] Update test imports to use dist/ paths (complete TypeScript migration)
- [ ] Add config value validation in config.ts (type guards, range checks)
- [ ] Make compose.sh Level 3/3+ templates dynamic (read from core+addendums, compose like L1/L2)
- [ ] Improve compose.sh sed portability (test on macOS + Linux, document platform differences)

### Phase 5: Documentation Fixes
- [ ] Fix core/README.md lazy loading description (remove outdated pattern)
- [ ] Fix loaders/README.md data.messages example (verify property exists)
- [ ] Fix renderers/README.md import paths and function signatures
- [ ] Fix templates/README.md to acknowledge L3/L3+ hardcoded limitation (update after Phase 4 fix)
- [ ] Update all READMEs with automated import path validation

### Phase 6: Code Quality & Standards Alignment
- [ ] Audit all TypeScript files against workflows-opencode standards (file headers, section dividers, naming)
- [ ] Refactor workflow.ts runWorkflow() function (398 lines → break into <100-line functions)
- [ ] Consider replacing hand-rolled JSONC parser with library (jsonc-parser package) OR document justification
- [ ] Modularize spec/create.sh (928 lines → source external libraries for reusable logic)
- [ ] Align console output patterns (standardize emoji unicode escapes vs literals)

### Phase 7: Verification & Validation
- [ ] Run full test suite (800+ tests, confirm zero regressions)
- [ ] Run tsc --build (confirm 177 dist/ files, <10s build time)
- [ ] Golden file testing for template composition (byte-for-byte comparison)
- [ ] Automated import path checking for all READMEs
- [ ] workflows-opencode standards compliance audit (target 95%+ score)

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | All refactored functions (validators, extractors, composers) | Vitest (existing 800+ tests) |
| Integration | Template composition end-to-end | Golden file comparison (spec.md, plan.md, etc.) |
| Regression | All existing functionality | Full test suite (npm test) |
| Build | TypeScript compilation | tsc --build (exit code 0, dist/ file count) |
| Standards | workflows-opencode compliance | Automated audit script (file headers, section dividers, naming) |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| TypeScript 5.x | Internal | Available | Cannot compile, build fails |
| Vitest | Internal | Available | Cannot verify regression safety |
| Bash (macOS/Linux) | Internal | Available | Cannot run compose.sh, create.sh |
| Node.js 18+ | Internal | Available | Cannot run TypeScript scripts |
| workflows-opencode skill | Internal | Available | Cannot verify standards compliance |

---

## 7. ROLLBACK PLAN

- **Trigger**: Test suite fails with >5% regression, build time exceeds 15 seconds, or template composition produces incorrect output
- **Procedure**: 
  1. Git revert to last passing commit (each phase commits independently)
  2. Re-run test suite to confirm rollback success
  3. Document failure reason in decision-record.md
  4. Adjust approach based on failure analysis
  5. Re-attempt with smaller incremental changes

---

## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (Dead Code) | None | Phase 2 (DRY requires clean baseline) |
| Phase 2 (DRY) | Phase 1 | Phase 3 (bug fixes may touch consolidated code) |
| Phase 3 (Bugs) | Phase 2 | Phase 4 (automation improvements build on bug-free base) |
| Phase 4 (Automation) | Phase 3 | Phase 5 (docs describe automated features) |
| Phase 5 (Docs) | Phase 4 | Phase 6 (standards alignment includes doc standards) |
| Phase 6 (Quality) | Phase 5 | Phase 7 (verification checks quality improvements) |
| Phase 7 (Verification) | Phase 6 | None (final validation) |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 | Medium | 4-6 hours (9 deletions, workspace searches, test verification) |
| Phase 2 | High | 6-8 hours (5 consolidations, divergence investigation, test updates) |
| Phase 3 | Low | 2-3 hours (5 bug fixes, straightforward changes) |
| Phase 4 | High | 8-10 hours (compose.sh rewrite most complex, dry-run mode, import redirects) |
| Phase 5 | Low | 2-3 hours (5 README updates, automated validation setup) |
| Phase 6 | High | 10-12 hours (runWorkflow refactor, create.sh modularization, standards audit) |
| Phase 7 | Medium | 4-5 hours (golden file setup, comprehensive testing, standards scoring) |
| **Total** | **N/A** | **36-47 hours** |

---

## L3: DEPENDENCY GRAPH

```
                    ┌─────────────────┐
                    │  Phase 1: Dead  │
                    │  Code Removal   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Phase 2: DRY  │
                    │  Consolidation  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Phase 3: Bug   │
                    │     Fixes       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Phase 4: Auto  │
                    │  Improvements   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Phase 5: Docs  │
                    │     Fixes       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Phase 6: Code  │
                    │    Quality      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Phase 7: Final  │
                    │  Verification   │
                    └─────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Dead Code Removal | None | Clean codebase baseline | DRY Consolidation |
| DRY Consolidation | Clean baseline | Unified validation utils | Bug Fixes |
| Bug Fixes | Consolidated code | Bug-free foundation | Automation Improvements |
| Automation Improvements | Bug-free base | Enhanced scripts | Documentation Updates |
| Documentation Updates | Automated features | Accurate guides | Standards Alignment |
| Standards Alignment | Accurate docs | Compliant codebase | Final Verification |
| Final Verification | All phases | Validated release | None |

---

## L3: CRITICAL PATH

1. **Phase 1: Dead Code Removal** - 6 hours - CRITICAL (blocks all DRY work)
2. **Phase 2: DRY Consolidation** - 8 hours - CRITICAL (blocks bug fixes touching consolidated code)
3. **Phase 4: Automation Improvements** - 10 hours - CRITICAL (compose.sh rewrite is highest complexity)
4. **Phase 6: Code Quality Alignment** - 12 hours - CRITICAL (runWorkflow + create.sh refactors are largest changes)
5. **Phase 7: Final Verification** - 5 hours - CRITICAL (must pass all gates before completion)

**Total Critical Path Duration**: 41 hours (excludes parallelizable doc work)

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1: Clean Baseline | All dead code removed | Zero unused exports detected, tests pass | End of Phase 1 |
| M2: DRY Complete | All duplication eliminated | Single source of truth for validators, archive filters, error messages | End of Phase 2 |
| M3: Bug-Free | All known bugs fixed | No unused variables, consistent markers, import guards present | End of Phase 3 |
| M4: Automation Ready | All scripts have dry-run, correct imports | cleanup-orphaned-vectors.ts has --dry-run, rank-memories.ts uses shared/ | End of Phase 4 |
| M5: Docs Accurate | All READMEs validated | Automated import checks pass, examples work copy-paste | End of Phase 5 |
| M6: Standards Compliant | 95%+ workflows-opencode score | Automated audit passes, runWorkflow <100 lines per function | End of Phase 6 |
| M7: Production Ready | All gates passed | Tests pass, build succeeds, golden files match, no regressions | End of Phase 7 |

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Incremental Cleanup Over Big-Bang Refactor
**Status**: Accepted
**Context**: 60+ files across 10 directories need changes. Big-bang refactor risks introducing cascading failures.
**Decision**: Execute in 7 phases with test verification between each phase. Commit after each successful phase for rollback safety.
**Consequences**: 
- Positive: Lower risk, easier debugging, incremental progress visibility
- Negative: Longer timeline (41 hours vs ~25 hours for big-bang), more commits, potential merge conflicts if parallel work occurs

### ADR-002: Dead Code Removal Before DRY Consolidation
**Status**: Accepted
**Context**: DRY consolidation requires knowing true consumers. Dead code creates false positives.
**Decision**: Phase 1 (dead code) must complete before Phase 2 (DRY).
**Consequences**:
- Positive: Clean baseline prevents wasting effort consolidating unused code
- Negative: Sequential dependency extends timeline, cannot parallelize early phases

### ADR-003: Preserve TypeScript Project References
**Status**: Accepted
**Context**: system-spec-kit uses TypeScript project references for incremental compilation. Alternative: flatten to single tsconfig.json.
**Decision**: Preserve project reference structure, maintain dist/ output directory.
**Consequences**:
- Positive: No build system migration risk, existing tooling continues working
- Negative: Slightly more complex tsconfig management, must maintain reference graph

### ADR-004: Dynamic Template Composition (Replacing Hardcoded L3/L3+)
**Status**: Accepted
**Context**: templates/compose.sh hardcodes 800 lines of Level 3/3+ spec.md instead of composing from core+addendums like L1/L2.
**Decision**: Rewrite compose.sh to dynamically read core/spec-core.md + addendum/level3-arch/ + addendum/level3plus-govern/ and compose like L1/L2.
**Consequences**:
- Positive: Single source of truth restored, changes to core propagate automatically, aligns with v2.2 architecture
- Negative: High complexity (10 hours), must ensure byte-for-byte output match with golden files, sed portability challenges

### ADR-005: Keep Hand-Rolled JSONC Parser (Decision Deferred)
**Status**: Proposed (requires user approval)
**Context**: core/config.ts has 115-line hand-rolled JSONC parser. Alternative: use jsonc-parser npm package.
**Decision**: Evaluate during Phase 6. If zero-dependency principle is critical, keep and document. Otherwise, replace with library.
**Consequences**:
- Keep: Zero dependencies, full control, maintenance burden
- Replace: Less code to maintain, battle-tested library, adds dependency

---

## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation (Phases 1-3)
**Rationale**: Dead code removal, DRY consolidation, and bug fixes must happen sequentially. Each phase modifies shared code that subsequent phases depend on.

**Execution Protocol**:
1. Phase 1 (Dead Code): Single-agent, file-by-file verification, workspace search before each deletion
2. Phase 2 (DRY): Single-agent, consolidate one duplication at a time, run tests after each consolidation
3. Phase 3 (Bugs): Single-agent, one bug fix per commit, verify test pass after each fix

### Tier 2: Parallel Execution (Phases 4-5)
**Rationale**: Automation improvements (Phase 4) and documentation fixes (Phase 5) can proceed in parallel once bug-free base exists.

**Execution Protocol**:
1. Phase 4 (Automation): Agent A handles compose.sh rewrite (complex), dry-run mode, import redirects
2. Phase 5 (Docs): Agent B handles README updates (independent of Phase 4 code changes)
3. Sync point: Both phases must complete before Phase 6 starts

### Tier 3: Integration (Phases 6-7)
**Rationale**: Code quality alignment (Phase 6) requires all prior changes complete. Final verification (Phase 7) validates entire effort.

**Execution Protocol**:
1. Phase 6 (Quality): Single-agent, refactor runWorkflow in sub-functions, modularize create.sh, run standards audit
2. Phase 7 (Verification): Single-agent, run all validation gates, generate compliance report

---

## L3+: WORKSTREAM COORDINATION

### Workstream Definition
| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| WS-1 | Dead Code Elimination | Agent Primary | shared/chunking.ts, core/workflow.ts, loaders/data-loader.ts, spec-folder/*.ts, utils/validation-utils.ts | Not Started |
| WS-2 | DRY Consolidation | Agent Primary | core/workflow.ts, utils/validation-utils.ts, spec-folder/alignment-validator.ts, spec-folder/folder-detector.ts | Blocked by WS-1 |
| WS-3 | Bug Fixes | Agent Primary | loaders/data-loader.ts, spec-folder/directory-setup.ts, core/workflow.ts, memory/cleanup-orphaned-vectors.ts, renderers/template-renderer.ts | Blocked by WS-2 |
| WS-4 | Automation (Code) | Agent A | memory/cleanup-orphaned-vectors.ts, memory/rank-memories.ts, core/config.ts, templates/compose.sh | Blocked by WS-3 |
| WS-5 | Automation (Docs) | Agent B | core/README.md, loaders/README.md, renderers/README.md, templates/README.md | Blocked by WS-3 |
| WS-6 | Code Quality | Agent Primary | All TypeScript files, spec/create.sh | Blocked by WS-4 + WS-5 |
| WS-7 | Final Verification | Agent Primary | All files (validation only) | Blocked by WS-6 |

### Sync Points
| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-1 | WS-1 complete (dead code removed) | Agent Primary | Clean baseline approved, WS-2 unblocked |
| SYNC-2 | WS-2 complete (DRY consolidated) | Agent Primary | Consolidated codebase approved, WS-3 unblocked |
| SYNC-3 | WS-3 complete (bugs fixed) | Agent Primary | Bug-free base approved, WS-4 + WS-5 unblocked (parallel) |
| SYNC-4 | WS-4 + WS-5 complete (automation + docs) | Agent A, Agent B | Automation ready, docs accurate, WS-6 unblocked |
| SYNC-5 | WS-6 complete (quality aligned) | Agent Primary | Standards compliant, WS-7 unblocked |
| SYNC-6 | WS-7 complete (verification passed) | Agent Primary | Production ready, release approved |

---

## L3+: COMMUNICATION PLAN

### Checkpoints
- **Daily**: Commit summaries posted to spec folder scratch/ (progress tracking)
- **Per-phase**: Milestone reports in decision-record.md (M1-M7 completion evidence)
- **Blockers**: Immediate notification in scratch/ with blocker ID, impact, proposed resolution

### Escalation Path
1. **Level 1**: Agent self-resolves (retry, alternative approach)
2. **Level 2**: Document in scratch/, request user guidance (open questions)
3. **Level 3**: HALT work, wait for user decision (critical path blocked, breaking changes needed)

**Escalation Triggers**:
- Test regression >5% (Level 3)
- Build time exceeds 15 seconds (Level 2)
- Golden file mismatch after compose.sh rewrite (Level 3)
- Standards audit score <90% after Phase 6 (Level 2)
- Open questions unanswered after 24 hours (Level 1 → Level 2)
