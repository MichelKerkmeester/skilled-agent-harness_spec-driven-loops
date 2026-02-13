# Implementation Plan: Spec-Kit Script Refactoring

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (POSIX sh), TypeScript 5.x (strict mode), Node.js 18+ |
| **Framework** | system-spec-kit scripts ecosystem |
| **Storage** | SQLite (memory MCP server), filesystem (templates) |
| **Testing** | Node.js test runner, bash functional tests, compose.sh --verify |

### Overview
This plan refactors 6 architectural debt items across shell scripts and TypeScript modules through modular extraction, POSIX portability fixes, and code quality improvements. The approach is "Extract + Delegate" — extract cohesive modules from monolithic files, eliminate duplication, and improve testability without changing external behavior.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in spec.md
- [x] Success criteria measurable (100% POSIX compat, TypeScript quality, LOC reduction)
- [x] Dependencies identified (none — all internal refactoring)

### Definition of Done
- [ ] All acceptance criteria met (SC-001 through SC-005)
- [ ] Tests passing: `tsc --noEmit`, `npm run build`, existing test suite
- [ ] Docs updated: spec.md, plan.md, tasks.md, decision-record.md synchronized

---

## 3. ARCHITECTURE

### Pattern
**Extract + Delegate** — Modular extraction pattern with unidirectional dependencies

### Key Components
- **Shell Libraries** (`lib/` modules): Shared utilities for shell scripts (common, git-branch, template-utils)
- **TypeScript Core Modules**: Extracted from workflow.ts (quality-scorer, topic-extractor, file-writer, memory-indexer)
- **Shared Utilities**: JSONC parser consolidation (jsonc-strip.ts)
- **Template System**: Dynamic composition via fragment concatenation (compose.sh refactor)

### Data Flow
1. **Shell Scripts**: create.sh/validate.sh → source lib/ modules → execute with shared functions
2. **TypeScript**: workflow.ts → imports extracted modules → delegates to specialized functions
3. **Templates**: compose.sh → reads core templates + addendum fragments → concatenates + renumbers sections → outputs level templates

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Parallel Foundation (No interdependencies)
**Duration**: 4-6 hours

- [ ] **T4.6**: POSIX portability fixes (5 sed/grep patterns, 1 hour)
- [ ] **T6.1 Batch 1**: Catch typing fixes (11 violations in 7 files, ~45 min)
- [ ] **T6.1 Batch 2**: Non-null assertion fixes (7 violations in 4 files, ~30 min)
- [ ] **T6.3**: JSONC parser extraction + consolidation (~1.5 hours)
- [ ] **T6.4 Phase 1-2**: Shell lib setup (shell-common.sh, git-branch.sh, template-utils.sh, ~3-4 hours)
- [ ] **T6.2 Steps 1-2**: Extract quality-scorer.ts + topic-extractor.ts (pure functions, ~25 min)

**Phase Gate**: All P0 items complete, TypeScript compiles without errors

---

### Phase 2: Dependent Integration (Builds on Phase 1)
**Duration**: 3-5 hours

- [ ] **T4.5**: Dynamic template composition (depends on T4.6 sed fixes, ~2-3 hours)
- [ ] **T6.2 Steps 3-4**: Extract file-writer.ts + memory-indexer.ts (depends on T6.1 catch fixes, ~45 min)
- [ ] **T6.4 Phase 3**: Template externalization (depends on T6.4 Phase 2 lib/ modules, ~1-2 hours)

**Phase Gate**: Code quality checks pass (CHK-010, CHK-011), all modules independently verifiable

---

### Phase 3: Verification & Documentation
**Duration**: 1-2 hours

- [ ] Build verification: `tsc --noEmit`, `npm run build`
- [ ] Test suite: Run all existing tests
- [ ] Script verification: `compose.sh --verify`, `create.sh --json` output comparison
- [ ] Documentation: implementation-summary.md

**Phase Gate**: All acceptance criteria verified (CHK-020), no regressions detected

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Extracted TypeScript modules (quality-scorer, topic-extractor, file-writer, memory-indexer, jsonc-strip) | Node.js test runner |
| Integration | workflow.ts imports, shell lib sourcing, template composition | Existing test suite, compose.sh --verify |
| Functional | create.sh --json output, validate.sh behavior, JSONC parsing | Bash functional tests, JSON diff |
| Manual | POSIX portability (macOS bash 3.2 + Linux bash 5.x) | Manual execution on both platforms |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | N/A | N/A | All work is self-contained internal refactoring |

**Note**: All tasks are internally scoped. No external systems, APIs, or third-party integrations required.

---

## 7. ROLLBACK PLAN

- **Trigger**: Build failures, test regressions, POSIX compatibility issues discovered post-merge
- **Procedure**: `git revert <commit-hash>` for atomic commits, or `git reset --hard <previous-tag>` for full phase rollback

**Rollback Testing**: Each phase is independently committable, allowing granular reversion.

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Parallel Foundation) ────────┐
  ├─ T4.6: sed/grep fixes             │
  ├─ T6.1: Catch typing + non-null    ├──► Phase 2 (Integration)
  ├─ T6.3: JSONC consolidation        │     ├─ T4.5: Dynamic templates (needs T4.6)
  ├─ T6.4 P1-P2: Shell libs           │     ├─ T6.2 S3-S4: file-writer + indexer (needs T6.1)
  └─ T6.2 S1-S2: Pure extractors      │     └─ T6.4 P3: Template externalization (needs T6.4 P2)
                                      │
                                      └──► Phase 3 (Verification)
                                            └─ Build + Test + Documentation
```

| Phase | Depends On | Blocks | Duration |
|-------|------------|--------|----------|
| Phase 1 (Parallel) | None | Phase 2 | 4-6 hours |
| Phase 2 (Integration) | Phase 1 complete | Phase 3 | 3-5 hours |
| Phase 3 (Verification) | Phase 2 complete | None | 1-2 hours |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Parallel Foundation | Medium-High | 4-6 hours |
| Phase 2: Dependent Integration | Medium | 3-5 hours |
| Phase 3: Verification & Documentation | Low | 1-2 hours |
| **Total** | | **8-13 hours** |

**Breakdown by Task**:
- T4.5: 2-3 hours (dynamic templates, section renumbering)
- T4.6: 1 hour (5 POSIX fixes)
- T6.1: 1.25 hours (Batches 1-2)
- T6.2: 1.17 hours (4 module extractions + test fix)
- T6.3: 1.5 hours (JSONC parser)
- T6.4: 4-7 hours (shell libs + externalization)

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created: Git tag `pre-110-refactor` at current HEAD
- [ ] Feature flag configured: N/A (internal refactoring, no runtime flags)
- [ ] Monitoring alerts set: N/A (build-time changes only)

### Rollback Procedure
1. **Immediate action**: If build breaks, `git revert <failing-commit>`
2. **Revert code**: For phase rollback, `git reset --hard pre-110-refactor && git push --force-with-lease`
3. **Verify rollback**: Run `npm run build` and existing test suite
4. **Notify stakeholders**: Update spec folder with rollback decision in decision-record.md

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (no database schema changes, no data migrations)

---

## L3: DEPENDENCY GRAPH

```
┌─────────────────────────────────────────────────────────────┐
│                    Phase 1 (Parallel)                       │
├─────────────────────────────────────────────────────────────┤
│  T4.6        T6.1-B1     T6.1-B2     T6.3        T6.4-P1-P2  │
│  sed/grep    catch       non-null   JSONC       shell libs  │
│  fixes       typing      assertions parser                  │
│              │           │                                   │
│              └───┬───────┘                                   │
│                  │                                           │
│  T6.2-S1-S2 ────┘                                           │
│  pure funcs                                                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Phase 2 (Integration)                    │
├─────────────────────────────────────────────────────────────┤
│  T4.5                 T6.2-S3-S4           T6.4-P3           │
│  Dynamic templates    file-writer +       Template extern   │
│  (needs T4.6)         memory-indexer      (needs T6.4-P2)   │
│                       (needs T6.1)                           │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                 Phase 3 (Verification)                      │
├─────────────────────────────────────────────────────────────┤
│  Build + Test + Docs                                        │
└─────────────────────────────────────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| T4.6 sed/grep | None | POSIX-compatible compose.sh | T4.5 |
| T6.1 catch typing | None | TypeScript quality (CAT-6) | T6.2 Steps 3-4 |
| T6.1 non-null | None | TypeScript quality (CAT-7) | None |
| T6.3 JSONC | None | jsonc-strip.ts utility | None |
| T6.4 P1-P2 shell libs | None | lib/ modules | T6.4 P3 |
| T6.2 S1-S2 extractors | None | quality-scorer.ts, topic-extractor.ts | None |
| T4.5 dynamic templates | T4.6 | Dynamic compose.sh | Phase 3 |
| T6.2 S3-S4 I/O modules | T6.1 Batch 1 | file-writer.ts, memory-indexer.ts | Phase 3 |
| T6.4 P3 externalization | T6.4 P2 | sharded/ templates | Phase 3 |

---

## L3: CRITICAL PATH

1. **Phase 1: Parallel Foundation** - 4-6 hours - CRITICAL (all Phase 2 work blocked)
2. **T4.5: Dynamic Templates** - 2-3 hours - CRITICAL (longest Phase 2 task)
3. **Phase 3: Verification** - 1-2 hours - CRITICAL (final gate)

**Total Critical Path**: 7-11 hours

**Parallel Opportunities**:
- All Phase 1 tasks can run simultaneously (6 independent workstreams)
- Phase 2: T4.5, T6.2 S3-S4, and T6.4 P3 are independent after their dependencies satisfy
- Phase 3: Build and test verification can overlap (build first, tests during)

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Phase 1 Complete | All POSIX fixes in, TypeScript quality at 100% for CAT-6/7, JSONC consolidated, shell libs created | End of Phase 1 |
| M2 | Phase 2 Complete | Dynamic templates working, workflow.ts modularized, templates externalized | End of Phase 2 |
| M3 | Release Ready | All tests pass, no regressions, documentation synchronized | End of Phase 3 |

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for full ADRs. Summary:

### ADR-001: No New JSONC Dependency (YAGNI)
**Status**: Accepted  
**Decision**: Extract existing Parser A logic to shared utility instead of adding `jsonc-parser` or `strip-json-comments` dependency  
**Rationale**: Only 2 JSONC files, both internally controlled, existing parser handles all edge cases

### ADR-002: Shell lib/ Sourcing Pattern
**Status**: Accepted  
**Decision**: Create `scripts/lib/` with shell-common.sh, git-branch.sh, template-utils.sh  
**Rationale**: Follows existing sourcing precedent, eliminates duplication between create.sh and validate.sh

### ADR-003: workflow.ts Extraction Order
**Status**: Accepted  
**Decision**: Extract pure functions first (quality-scorer, topic-extractor), then I/O (file-writer, memory-indexer)  
**Rationale**: Pure functions have zero risk; each extraction is atomic and independently verifiable

### ADR-004: Console.* Logging Deferred
**Status**: Accepted  
**Decision**: Defer console migration for CLI scripts (Batches 3-4); only fix catch typing and non-null assertions  
**Rationale**: CLI scripts legitimately use console.* for user output. High ROI is in Batches 1-2.

### ADR-005: Dynamic Template Composition via Fragment Concatenation
**Status**: Accepted  
**Decision**: Split spec-level3.md into prefix/suffix fragments, compose via ordered concatenation  
**Rationale**: Matches existing plan.md approach, eliminates drift, no new parsing engine needed

---

## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: spec.md, plan.md, decision-record.md  
**Duration**: ~90 minutes  
**Agent**: @speckit (exclusive for spec folder documentation)

### Tier 2: Parallel Execution
| Agent | Focus | Files |
|-------|-------|-------|
| Shell Agent (W-A) | T4.5, T4.6, T6.4 | compose.sh, create.sh, validate.sh, lib/ modules |
| TypeScript Agent (W-B) | T6.1, T6.2, T6.3 | workflow.ts, config.ts, content-filter.ts, extracted modules |

**Duration**: ~120 minutes (parallel)

### Tier 3: Integration
**Agent**: @review  
**Task**: Verify all changes, run full test suite, validate checklist items  
**Duration**: ~60 minutes

---

## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Shell Script Modernization | Shell Agent | compose.sh, create.sh, validate.sh, lib/*.sh, templates/sharded/ | Pending |
| W-B | TypeScript Quality | TypeScript Agent | workflow.ts, config.ts, content-filter.ts, core/*.ts, shared/utils/*.ts | Pending |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | Both W-A and W-B Phase 1 complete | All agents | Integration test, tsc --noEmit, npm run build |
| SYNC-002 | All Phase 2 tasks done | All agents | Full verification suite, checklist validation |

### File Ownership Rules
- **W-A owns**: All shell scripts (*.sh), shell lib/ modules, template files
- **W-B owns**: All TypeScript files (*.ts), test files
- **Cross-workstream changes**: None expected (clean separation)
- **Conflicts**: Resolved at SYNC points via checklist verification

---

## L3+: COMMUNICATION PLAN

### Checkpoints
- **Per Task**: Update tasks.md with completion status and evidence
- **Per Phase**: Review checklist.md, verify all P0 items complete
- **Blockers**: Document in decision-record.md Session Decision Log, escalate to primary developer

### Escalation Path
1. **Technical blockers** (test failures, POSIX issues) → Primary Developer
2. **Scope changes** (new tasks discovered) → Update spec.md, get approval
3. **Resource issues** (external dependency needed) → Escalate immediately (should not occur)

---

<!--
LEVEL 3+ PLAN (~340 lines)
- Core + L2 + L3 + L3+ addendums
- AI execution framework, workstream coordination
- Full communication plan
-->
