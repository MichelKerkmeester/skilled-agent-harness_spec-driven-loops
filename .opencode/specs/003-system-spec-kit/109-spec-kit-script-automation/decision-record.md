# Decision Record: Spec Kit Script Automation & Cleanup

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

## ADR-001: Incremental Cleanup Over Big-Bang Refactor

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-11 |
| **Deciders** | @speckit maintainer |

---

### Context
The system-spec-kit scripts directory requires refactoring across 60+ files in 10 directories. Two approaches considered:
1. **Big-bang refactor**: Make all changes in one large effort, test at end
2. **Incremental cleanup**: Execute in 7 sequential phases with test verification between each

System-spec-kit is critical infrastructure used by all spec folder operations. Cascading failures would be high-impact.

### Constraints
- Must maintain 100% test pass rate (800+ tests)
- TypeScript build must succeed at all times
- No breaking changes to external APIs (runWorkflow signature)
- Work may span multiple sessions requiring rollback points

---

### Decision
**Summary**: Execute incremental cleanup in 7 phases with independent commits and test verification after each phase.

**Details**: Each phase produces a clean, tested checkpoint. Phase order follows dependency graph: dead code removal → DRY consolidation → bug fixes → automation improvements (parallel: code + docs) → code quality alignment → final verification. Git commits after each phase enable rollback to last known-good state.

---

### Alternatives Considered
| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Incremental (chosen)** | Lower risk, easier debugging, rollback points | Longer timeline (41 hours), more commits | 9/10 |
| **Big-bang refactor** | Faster (25 hours), fewer commits | High risk, hard to debug, no rollback safety | 4/10 |
| **Hybrid (phases but no tests)** | Medium speed (30 hours) | Medium risk, some rollback capability | 6/10 |

---

### Five Checks Evaluation
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | Yes | 29 issues identified, technical debt blocking maintainability |
| 2 | Alternatives? | Yes | Big-bang vs incremental vs hybrid evaluated |
| 3 | Sufficient? | Yes | 7 phases cover all 29 issues comprehensively |
| 4 | Fits Goal? | Yes | Directly achieves "clean, reliable, fully-automated" objective |
| 5 | Long-term? | Yes | No tech debt created, enables future AI agent reliability |

---

### Consequences
**Positive**:
- Lower risk of cascading failures (each phase isolated)
- Easier debugging (smaller change sets)
- Incremental progress visibility (milestones M1-M7)
- Rollback safety (git commit checkpoints)
- Test coverage validation at each step

**Negative**:
- Longer timeline (41 hours vs ~25 hours for big-bang)
- More commits (7+ vs 1-2)
- Potential merge conflicts if parallel work occurs
- Context switching overhead between phases
- **Mitigation**: Use spec folder memory/ to preserve context between sessions, minimize parallel work during cleanup

---

### Implementation
**Affected Systems**: All system-spec-kit scripts directories (core/, extractors/, lib/, loaders/, renderers/, rules/, setup/, spec/, spec-folder/, templates/, types/, utils/, tests/, memory/, shared/)

**Rollback**: If any phase fails (test regression >5%, build fails, golden file mismatch):
1. `git revert` to last phase commit
2. Re-run test suite to confirm rollback success
3. Document failure in decision-record.md
4. Adjust approach (smaller increments, targeted fixes)
5. Re-attempt with revised strategy

---

## ADR-002: Dead Code Removal Before DRY Consolidation

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-11 |
| **Deciders** | @speckit maintainer |

---

### Context
Workflow requires both dead code removal (7 instances) and DRY consolidation (5 duplications). Order matters because:
- DRY consolidation requires identifying all true consumers
- Dead code creates false positives in consumer analysis
- Consolidating unused code wastes effort

Example: `validation-utils.ts` may have zero consumers. If we consolidate validators first, then discover validation-utils.ts is dead, we've wasted effort consolidating into a file that gets deleted.

### Constraints
- Must not waste effort consolidating code that will be deleted
- Must have accurate consumer analysis before consolidation
- Test suite must pass after each phase

---

### Decision
**Summary**: Execute Phase 1 (dead code removal) to completion before starting Phase 2 (DRY consolidation).

**Details**: Phase 1 establishes clean baseline with zero dead code. Phase 2 then has accurate consumer analysis (no false positives from dead code). This sequential dependency extends timeline but prevents rework.

---

### Alternatives Considered
| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Dead code first (chosen)** | Clean baseline, accurate consumers, no wasted effort | Sequential dependency extends timeline | 9/10 |
| **DRY first** | Faster start (can begin immediately) | Risk consolidating dead code, rework likely | 3/10 |
| **Parallel** | Fastest timeline (no waiting) | High risk of conflicts, complex coordination | 2/10 |

---

### Five Checks Evaluation
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | Yes | Prevents wasted effort consolidating dead code |
| 2 | Alternatives? | Yes | DRY-first and parallel approaches evaluated |
| 3 | Sufficient? | Yes | Clean baseline enables accurate consumer analysis |
| 4 | Fits Goal? | Yes | Efficiency (no rework) aligns with automation goal |
| 5 | Long-term? | Yes | Establishes pattern for future refactoring efforts |

---

### Consequences
**Positive**:
- Clean baseline for DRY consolidation (no false positives)
- No wasted effort on code that gets deleted
- Accurate consumer analysis
- Clear phase boundaries

**Negative**:
- Sequential dependency extends timeline
- Cannot parallelize early phases
- **Mitigation**: Accept timeline extension as necessary cost for correctness

---

### Implementation
**Affected Systems**: Phase 1 (T001-T013) must complete before Phase 2 (T014-T023) begins

**Rollback**: If dead code removal reveals hidden consumers, restore deleted code and document as intentional (not dead)

---

## ADR-003: Preserve TypeScript Project References

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-11 |
| **Deciders** | @speckit maintainer |

---

### Context
system-spec-kit currently uses TypeScript project references for incremental compilation. The dist/ directory contains 177 files with 1:1 source mapping. Alternative: flatten to single tsconfig.json for simpler build configuration.

### Constraints
- Must preserve existing build system during refactoring
- No breaking changes to build tooling
- Build time must remain <10 seconds

---

### Decision
**Summary**: Preserve TypeScript project references structure and dist/ output directory.

**Details**: No build system migration during this refactoring effort. All changes maintain compatibility with existing TypeScript project reference graph. Future ADR can revisit build system if needed.

---

### Alternatives Considered
| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Preserve references (chosen)** | No migration risk, existing tooling works, familiar structure | Slightly complex tsconfig management | 9/10 |
| **Flatten to single tsconfig** | Simpler config, easier to understand | Migration risk, tooling changes, potential build time regression | 5/10 |
| **Migrate to different build tool** | Modern features (esbuild, etc.) | High risk, complete rebuild, out of scope | 2/10 |

---

### Five Checks Evaluation
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | Yes | Avoids unnecessary migration risk during refactoring |
| 2 | Alternatives? | Yes | Flatten and migrate options evaluated |
| 3 | Sufficient? | Yes | Existing build system supports all refactoring needs |
| 4 | Fits Goal? | Yes | Reliability aligns with "no breaking changes" principle |
| 5 | Long-term? | Neutral | Can revisit build system in future ADR if needed |

---

### Consequences
**Positive**:
- No build system migration risk
- Existing tooling continues working (scripts/build.sh, etc.)
- Familiar structure for contributors
- Incremental compilation benefits retained

**Negative**:
- Must maintain TypeScript project reference graph
- Slightly more complex tsconfig management than single config
- **Mitigation**: Document reference graph in core/README.md if changes needed

---

### Implementation
**Affected Systems**: All TypeScript compilation (tsc --build)

**Rollback**: Not applicable (no changes to build system)

---

## ADR-004: Dynamic Template Composition (Replacing Hardcoded L3/L3+)

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-11 |
| **Deciders** | @speckit maintainer |

---

### Context
The templates/compose.sh script currently hardcodes 800+ lines of Level 3 and Level 3+ spec.md templates as literal strings. This violates the CORE + ADDENDUM v2.2 architecture principle of single-source-of-truth. Changes to core/spec-core.md or addendum files do not propagate to L3/L3+ templates.

Level 1 and Level 2 templates are correctly composed dynamically from core/ and addendum/ files. Level 3/3+ diverged from this pattern at some point in development.

### Constraints
- Must produce byte-for-byte identical output (golden file verification)
- sed portability across macOS and Linux
- Must maintain composability from core + level3-arch + level3plus-govern addendums
- Cannot break existing spec folder creation workflow

---

### Decision
**Summary**: Rewrite templates/compose.sh to dynamically read and compose Level 3/3+ templates from core/ and addendum/ files, matching the pattern used for Level 1/2.

**Details**: Replace 800-line hardcoded string blocks with dynamic file reading and merging. Template assembly reads:
- core/spec-core.md (base)
- addendum/level2-verify/*.md (verification sections)
- addendum/level3-arch/*.md (architecture sections)
- addendum/level3plus-govern/*.md (governance sections)

Merge strategy uses same sed-based approach as Level 1/2 composition.

---

### Alternatives Considered
| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Dynamic composition (chosen)** | Single source of truth, changes propagate, aligns with v2.2 | High complexity (10 hours), sed portability challenges | 9/10 |
| **Keep hardcoded** | No work, zero risk, fast | Violates single-source-of-truth, maintenance burden | 2/10 |
| **Rewrite in Node.js** | Portability, easier string manipulation | Adds Node.js dependency to shell script, different tooling | 7/10 |
| **Hybrid (L3 only)** | Lower complexity (5 hours) | L3+ still hardcoded, partial solution | 5/10 |

---

### Five Checks Evaluation
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | Yes | Violates architectural principle, creates maintenance burden |
| 2 | Alternatives? | Yes | Keep, Node.js rewrite, hybrid evaluated |
| 3 | Sufficient? | Yes | Restores single-source-of-truth for all template levels |
| 4 | Fits Goal? | Yes | Directly achieves "reliable" and "single-source-of-truth" objectives |
| 5 | Long-term? | Yes | Eliminates tech debt, enables future template evolution |

---

### Consequences
**Positive**:
- Single source of truth restored (changes to core/ propagate automatically)
- Aligns with CORE + ADDENDUM v2.2 architecture
- Reduces maintenance burden (no duplicate template content)
- Enables easier template evolution (change core once, affects all levels)

**Negative**:
- High complexity implementation (10 hours estimated)
- sed portability challenges across macOS/Linux (different regex syntax)
- Risk of golden file mismatch (requires careful verification)
- **Mitigation**: Golden file tests (byte-for-byte comparison), test on both platforms, consider Node.js fallback if sed proves too fragile

---

### Implementation
**Affected Systems**: templates/compose.sh, all Level 3/3+ spec folder creation

**Rollback**: If golden file verification fails:
1. Revert compose.sh to hardcoded version
2. Document sed portability issues
3. Evaluate Node.js rewrite alternative (ADR-006)

**Verification Requirements**:
- [ ] Golden file test: current L3 spec.md output captured before changes
- [ ] Golden file test: new dynamic composition produces identical output
- [ ] Golden file test: current L3+ spec.md output captured before changes
- [ ] Golden file test: new dynamic composition produces identical output
- [ ] Test on macOS (zsh, bash)
- [ ] Test on Linux (bash)

---

## ADR-005: JSONC Parser Evaluation (Keep or Replace)

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-02-11 |
| **Deciders** | @speckit maintainer (requires user approval) |

---

### Context
core/config.ts contains a 115-line hand-rolled JSONC parser to read opencode.json configuration files. The parser handles:
- Comments (// and /* */)
- Trailing commas
- Unquoted keys (non-standard)

Alternative: Use established library like `jsonc-parser` (npm package, ~200KB).

### Constraints
- Must handle comments and trailing commas (standard JSONC)
- Unquoted keys are non-standard JSON (may or may not be required)
- Zero-dependency principle vs maintainability trade-off

---

### Decision
**Summary**: Decision deferred to Phase 6 implementation. Evaluate during T067-T069 based on:
1. Are unquoted keys actually used in opencode.json? (check workspace)
2. Does jsonc-parser handle all actual config files? (test with real configs)
3. Is zero-dependency principle critical for system-spec-kit? (user guidance)

**Details**: If zero-dependency is critical OR jsonc-parser doesn't handle unquoted keys AND they're required, KEEP hand-rolled parser and document justification. Otherwise, REPLACE with library.

---

### Alternatives Considered
| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep hand-rolled** | Zero dependencies, full control, custom features (unquoted keys) | 115 lines to maintain, potential bugs | 6/10 |
| **Replace with jsonc-parser** | Battle-tested, maintained, less code | Adds dependency (~200KB), may not handle unquoted keys | 7/10 |
| **Replace with JSON5** | Handles unquoted keys (standard JSON5), battle-tested | Heavier dependency (~400KB) | 6/10 |
| **Defer decision (chosen)** | Gather evidence first, informed choice | Delays implementation | 8/10 (until evidence gathered) |

---

### Five Checks Evaluation
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | Unclear | Need evidence: are unquoted keys used? Is zero-dependency critical? |
| 2 | Alternatives? | Yes | jsonc-parser, JSON5, keep hand-rolled evaluated |
| 3 | Sufficient? | Unclear | Need testing: does library handle real configs? |
| 4 | Fits Goal? | Neutral | Both options work (zero-dependency OR less maintenance) |
| 5 | Long-term? | Depends | Library = less maintenance, hand-rolled = more control |

---

### Consequences
**If KEEP hand-rolled**:
- Positive: Zero dependencies, full control, custom features
- Negative: 115 lines to maintain, potential bugs in parser logic
- Mitigation: Document parser behavior, add comprehensive tests

**If REPLACE with library**:
- Positive: Less code, battle-tested, maintained by community
- Negative: Adds dependency, may require config format changes if unquoted keys used
- Mitigation: Test with all real config files before committing

---

### Implementation
**Affected Systems**: core/config.ts, package.json (if adding dependency)

**Rollback**: If library replacement fails (doesn't handle real configs), revert to hand-rolled parser

**Evaluation Plan (Phase 6, T067-T069)**:
1. Workspace search for unquoted keys in *.json, opencode.json files
2. Test jsonc-parser with real config files (dry-run parse)
3. Request user guidance on zero-dependency principle priority
4. Document decision rationale in this ADR (update status to Accepted)

---

## Session Decision Log

| Timestamp | Gate | Decision | Confidence | Uncertainty | Evidence |
|-----------|------|----------|------------|-------------|----------|
| 2026-02-11 14:00 | Planning | Incremental cleanup over big-bang | 0.95 | 0.05 | 800+ tests provide safety net, 60+ files too risky for big-bang |
| 2026-02-11 14:15 | Planning | Dead code removal before DRY | 0.90 | 0.10 | validation-utils.ts uncertain (needs workspace search), prevents rework |
| 2026-02-11 14:30 | Planning | Preserve TypeScript project references | 0.95 | 0.05 | No compelling reason to migrate, existing system works |
| 2026-02-11 14:45 | Planning | Dynamic template composition for L3/L3+ | 0.85 | 0.15 | sed portability unknown (macOS vs Linux), golden files mitigate risk |
| 2026-02-11 15:00 | Planning | Defer JSONC parser decision to Phase 6 | 0.80 | 0.20 | Need evidence (unquoted keys usage, user priority on zero-dependency) |
