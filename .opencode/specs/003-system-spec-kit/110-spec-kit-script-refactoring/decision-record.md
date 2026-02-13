# Decision Record: Spec-Kit Script Refactoring

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

## ADR-001: No New JSONC Dependency (YAGNI)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-12 |
| **Deciders** | Primary Developer, @speckit |

---

### Context

The codebase has two JSONC parsers: Parser A in `config.ts` (sophisticated char-level state machine, lines 119-225) and Parser B in `content-filter.ts` (naive regex at line 126). Parser B has latent bugs: it strips `//` from URLs (e.g., `https://example.com`) and `/* */` from strings. We need a single, reliable JSONC parser for both `config.jsonc` (166 lines) and `filters.jsonc` (45 lines).

### Constraints
- Only 2 JSONC files exist, both internally controlled
- Parser A already handles all edge cases correctly (URLs in strings, nested comments, escaped quotes)
- Adding external dependency increases bundle size and maintenance burden
- TypeScript codebase in strict mode

---

### Decision

**Summary**: Extract existing Parser A logic from `config.ts` to shared utility `shared/utils/jsonc-strip.ts`, then replace Parser B's naive regex with calls to the shared utility.

**Details**: Create `stripJsoncComments(text: string): string` function in new file `scripts/shared/utils/jsonc-strip.ts`. Update `config.ts` to import and use the shared function (removing inline parser). Update `content-filter.ts` to replace regex with shared function import.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Extract Parser A (Chosen)** | Zero new dependencies, proven edge case handling, 67KB bundle savings vs jsonc-parser, already tested in production | Requires extraction work (~1.5 hrs) | 9/10 |
| Add `jsonc-parser` npm package | Well-maintained, comprehensive, TypeScript types included | 67KB bundle size, overkill for 2 files, external dependency | 6/10 |
| Add `strip-json-comments` | Lightweight (2KB), simple API | ESM-only in v5+ (breaks CJS builds), still external dependency | 5/10 |
| Keep as-is (2 parsers) | Zero work | Parser B latent bugs remain (strips URLs/strings), duplication continues | 2/10 |

**Why Chosen**: Parser A is already battle-tested, handles all edge cases, and extracting it eliminates both duplication and latent bugs with zero new dependencies. YAGNI principle applies: we don't need a general-purpose JSONC library for 2 internally controlled files.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Parser B has latent bugs affecting URL handling, consolidation prevents future issues |
| 2 | **Beyond Local Maxima?** | PASS | Explored 3 alternatives (jsonc-parser, strip-json-comments, keep as-is) |
| 3 | **Sufficient?** | PASS | Shared utility is simplest solution that fixes bugs without new dependencies |
| 4 | **Fits Goal?** | PASS | Directly addresses code quality and duplication elimination goals |
| 5 | **Open Horizons?** | PASS | Shared utility scales to future JSONC files without rework |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Zero new dependencies (bundle size unchanged)
- Single source of truth for JSONC parsing (eliminates duplication)
- Latent bugs eliminated (URLs and strings preserved correctly)
- Testable in isolation (unit tests for edge cases)

**Negative**:
- Maintenance responsibility shifts to team (vs external package) — Mitigation: Parser A is mature, edge cases covered, minimal future changes expected
- Requires extraction work — Mitigation: ~1.5 hours effort, one-time cost

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Parser A misses edge case not yet encountered | M | Add comprehensive regression tests (T020) covering URLs, strings, nested comments |
| Future JSONC spec changes | L | Monitor spec, update parser if needed (low likelihood given JSONC's stability) |

---

### Implementation

**Affected Systems**:
- `scripts/core/config.ts` (Parser A extraction, import shared utility)
- `scripts/lib/content-filter.ts` (Replace regex with shared utility)
- `scripts/shared/utils/jsonc-strip.ts` (New file, ~107 LOC)
- `scripts/tests/jsonc-strip.test.ts` (New test file for edge cases)

**Rollback**: Revert commits for T017-T020, restore inline parsers from git history

---

## ADR-002: Shell lib/ Sourcing Pattern

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-12 |
| **Deciders** | Primary Developer, @speckit |

---

### Context

`create.sh` and `validate.sh` have duplicated code: `_json_escape()` function exists in both files identically. Additionally, `create.sh` has 8 functions totaling 928 LOC, with several utilities that could be shared. No shell library directory exists for shared shell utilities.

### Constraints
- Must maintain POSIX sh compatibility (bash 3.2 on macOS)
- Existing precedent: `check-prerequisites.sh` already sources `common.sh`
- Cannot break existing script CLI interfaces

---

### Decision

**Summary**: Create `scripts/lib/` directory with three shell library modules: `shell-common.sh` (~25 LOC for _json_escape and repo root detection), `git-branch.sh` (~100 LOC for branch utilities), and `template-utils.sh` (~35 LOC for template operations).

**Details**: Extract cohesive utilities from `create.sh` and `validate.sh` into lib/ modules. Scripts source modules via `source "$(dirname "$0")/../lib/module-name.sh"` pattern. Use `SPEC_KIT_ROOT` environment variable for path resolution when needed.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Create lib/ modules (Chosen)** | Follows existing precedent (common.sh), eliminates duplication, testable in isolation | Requires path resolution logic, ~3-4 hours extraction | 9/10 |
| Expand existing common.sh | Single file simplicity | Wrong granularity (git-branch and template-utils are distinct concerns), creates monolithic file | 5/10 |
| Keep inline (no library) | Zero extraction work | Duplication continues, harder to test, violates DRY | 3/10 |
| Use external shell framework (e.g., bashunit) | Professional testing, utilities included | Overkill for simple utilities, external dependency, learning curve | 4/10 |

**Why Chosen**: Follows existing sourcing pattern established by `common.sh`, provides appropriate granularity for different concerns, and eliminates duplication with reusable modules.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `_json_escape()` duplication is real, git-branch utilities are >100 LOC that could be reused |
| 2 | **Beyond Local Maxima?** | PASS | Explored expanding common.sh, using external framework, keeping inline |
| 3 | **Sufficient?** | PASS | 3 focused modules (not monolithic common.sh expansion) |
| 4 | **Fits Goal?** | PASS | Directly addresses code duplication and modularization goals |
| 5 | **Open Horizons?** | PASS | lib/ pattern scales to future shared utilities without rework |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Eliminates duplication (`_json_escape()` in one place)
- Testable in isolation (each lib/ module can have unit tests)
- Follows existing precedent (common.sh sourcing pattern)
- Reduces `create.sh` from 928 LOC to ~450 LOC

**Negative**:
- Path resolution complexity — Mitigation: Use `dirname "$0"` relative paths, test on macOS/Linux
- Bash version compatibility risk — Mitigation: Stick to POSIX sh features, avoid bash 4.x+ features

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Path resolution breaks in edge cases (symlinks, cwd changes) | M | Use `SPEC_KIT_ROOT` env var as fallback, test with symlinked scripts |
| bash 3.2 compatibility issues | M | Test all lib/ modules on macOS bash 3.2 before commit |

---

### Implementation

**Affected Systems**:
- `scripts/lib/shell-common.sh` (New file, ~25 LOC)
- `scripts/lib/git-branch.sh` (New file, ~100 LOC)
- `scripts/lib/template-utils.sh` (New file, ~35 LOC)
- `scripts/spec/create.sh` (Source 3 modules, remove duplicated functions)
- `scripts/spec/validate.sh` (Source shell-common.sh for _json_escape)

**Rollback**: Revert T023-T026, T038, restore inline functions from git history

---

## ADR-003: workflow.ts Extraction Order

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-12 |
| **Deciders** | Primary Developer, @speckit |

---

### Context

`workflow.ts` is 866 LOC with 7 functions. `runWorkflow()` alone is 398 LOC (46% of all code). The file has 17 module imports and is difficult to test and maintain. We need to extract modules to reduce complexity, but extraction order matters for risk management and dependency resolution.

### Constraints
- Must avoid circular dependencies
- Existing tests must continue to pass after each extraction
- TypeScript strict mode requires proper type imports
- Cannot change `runWorkflow()` orchestrational logic (deferred to future work)

---

### Decision

**Summary**: Extract pure functions first (quality-scorer, topic-extractor), then I/O functions (file-writer, memory-indexer). Each extraction is atomic and independently verifiable.

**Details**: 
1. **Phase 1**: Extract `quality-scorer.ts` (QualityScore interface + scoreMemoryQuality, ~130 LOC) and `topic-extractor.ts` (DecisionForTopics + extractKeyTopics, ~90 LOC) — both are pure functions with zero I/O
2. **Phase 2** (after T6.1 catch typing fixes): Extract `file-writer.ts` (writeFilesAtomically, ~35 LOC) and `memory-indexer.ts` (DB operations, ~140 LOC)
3. Update `workflow.ts` imports after all 4 modules extracted

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Pure first, then I/O (Chosen)** | Zero risk for pure functions, atomic verifiable steps, unidirectional dependencies | Requires 4 separate extractions | 10/10 |
| Big-bang extraction (all at once) | Single commit, faster | Higher risk, harder to verify, one failure blocks all | 5/10 |
| Extract runWorkflow() internals first | Addresses largest LOC chunk | Premature (runWorkflow is orchestrational, too many dependencies to extract safely) | 4/10 |
| I/O first, pure later | Gets risky work done first | Violates dependency order (I/O depends on pure), higher failure risk | 3/10 |

**Why Chosen**: Pure functions have zero side effects and zero external dependencies — extraction risk is minimal. Each step is independently verifiable before proceeding to next. I/O functions benefit from catch typing fixes (T6.1) being complete first.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 866 LOC file is difficult to maintain, test, and review |
| 2 | **Beyond Local Maxima?** | PASS | Explored big-bang, runWorkflow internals, I/O-first alternatives |
| 3 | **Sufficient?** | PASS | 4 focused modules (not over-decomposition), workflow.ts remains orchestrator |
| 4 | **Fits Goal?** | PASS | Directly addresses maintainability and code organization goals |
| 5 | **Open Horizons?** | PASS | Sets pattern for future extractions (pure → I/O), no lock-in |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Low-risk extraction (pure functions first)
- Each step independently verifiable (atomic commits)
- workflow.ts LOC reduced by ~52% (866 → ~430)
- Unidirectional dependencies (no circular imports)

**Negative**:
- Requires 4 separate extraction steps — Mitigation: Total effort ~70 min, well worth maintainability gain
- Test import needs update — Mitigation: T035 fixes stale import in test-integration.js

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Extraction introduces circular dependency | H | Follow unidirectional order (pure → I/O), verify with `tsc --noEmit` after each step |
| Existing tests break after extraction | H | Run tests after each extraction (T040), rollback individual step if needed |

---

### Implementation

**Affected Systems**:
- `scripts/core/quality-scorer.ts` (New file, ~130 LOC)
- `scripts/core/topic-extractor.ts` (New file, ~90 LOC)
- `scripts/core/file-writer.ts` (New file, ~35 LOC)
- `scripts/core/memory-indexer.ts` (New file, ~140 LOC)
- `scripts/core/workflow.ts` (Import 4 modules, reduce to ~430 LOC)
- `scripts/tests/test-integration.js` (Fix stale import at line 324)

**Rollback**: Revert T021-T022, T032-T035, restore workflow.ts from git history

---

## ADR-004: Console.* Logging Deferred

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-12 |
| **Deciders** | Primary Developer, @speckit |

---

### Context

Code quality audit found 192 `console.*` instances across 23 files. Only ~20 use `structuredLog`. Research identified 4 batches:
- **Batch 1**: Catch typing (11 violations, 7 files) — HIGH impact, LOW effort
- **Batch 2**: Non-null assertions (7 violations, 4 files) — MEDIUM impact, LOW effort
- **Batch 3**: Console.* in core libs (~45 instances) — MEDIUM impact, MEDIUM effort (2-3 hrs)
- **Batch 4**: Console.* in CLI scripts (~147 instances) — LOW impact (legitimate user output)

Spec 110 must decide which batches to execute for highest ROI.

### Constraints
- CLI scripts legitimately use `console.log()` for user-facing output (not a violation)
- Core library console usage should use `structuredLog` for consistency
- Time budget: 8-13 hours total for all 6 tasks in spec 110

---

### Decision

**Summary**: Execute Batches 1-2 only (~75 min total). Defer Batch 3 (core lib console migration) and skip Batch 4 (CLI scripts are legitimate).

**Details**: Focus on catch typing (CAT-6) and non-null assertions (CAT-7) for immediate TypeScript quality gains. Defer console.* migration for core libraries to future work. CLI scripts retain `console.*` as acceptable user output pattern.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Batches 1-2 only (Chosen)** | High ROI (75 min → 100% CAT-6/CAT-7 compliance), focuses on real quality issues | Leaves core lib console.* for future | 9/10 |
| Execute all 4 batches | 100% console.* elimination | Low ROI (Batch 4 is legitimate, Batch 3 is 2-3 hrs for medium gain), time budget exceeded | 5/10 |
| Batches 1-3 (skip CLI only) | Core libs get `structuredLog` | Adds 2-3 hours to spec, medium impact for medium effort | 7/10 |
| Wrap CLI in logger abstraction | Centralized logging control | Over-engineering (CLI output is simple, no need for abstraction layer) | 4/10 |

**Why Chosen**: Batches 1-2 provide highest ROI (75 min investment → 100% compliance for 2 quality categories). Batch 3 is medium effort for medium impact (defer to future). Batch 4 is not a violation (CLI scripts legitimately output to console).

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Catch typing and non-null assertions are real TypeScript quality issues |
| 2 | **Beyond Local Maxima?** | PASS | Explored full migration, partial migration, logger abstraction |
| 3 | **Sufficient?** | PASS | Batches 1-2 solve stated quality problems without over-engineering |
| 4 | **Fits Goal?** | PASS | Directly addresses code quality goal within time budget |
| 5 | **Open Horizons?** | PASS | Leaves door open for Batch 3 in future spec if needed |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- 100% compliance for CAT-6 (catch typing) and CAT-7 (non-null assertions)
- High ROI: 75 min → 18 fixes across 10 files
- Time budget preserved for other critical tasks (dynamic templates, workflow extraction)

**Negative**:
- Core lib console.* remains (defer to future) — Mitigation: Not a blocker, can address in follow-up spec if user requests
- Inconsistency between CLI and core lib logging — Mitigation: Acceptable tradeoff (CLI output is different concern than library logging)

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Deferred Batch 3 becomes technical debt | L | Document in decision-record, revisit in future spec if logging unification becomes priority |

---

### Implementation

**Affected Systems**:
- **Batch 1** (T006-T012): 7 TypeScript files (data-loader, config, file-discovery, workflow, content-filter, create-spec, validate-spec)
- **Batch 2** (T013-T016): 4 TypeScript files (data-loader, file-discovery, workflow, content-filter)
- **Batch 3** (DEFERRED): ~20 core library files
- **Batch 4** (SKIPPED): CLI scripts retain console.* for user output

**Rollback**: N/A (deferral decision, no code changes to revert)

---

## ADR-005: Dynamic Template Composition via Fragment Concatenation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-12 |
| **Deciders** | Primary Developer, @speckit |

---

### Context

`compose.sh` uses hardcoded heredocs for L3/L3+ spec.md composition (386 LOC total). This creates drift: when `templates/level_3/spec.md` or `level_3+/spec.md` change, the heredocs don't update automatically. Research found only 2 of 12 composition paths are hardcoded; all other paths use dynamic file reads. All addendum files exist but aren't used for L3/L3+ spec composition.

### Constraints
- Must maintain identical output (composed templates byte-for-byte match current output)
- Section renumbering is critical (L3+ spec has more sections than L3)
- POSIX sh compatibility required (bash 3.2 on macOS)
- `compose.sh --verify` must detect drift after changes

---

### Decision

**Summary**: Split L3/L3+ spec-level3.md heredocs into prefix/suffix fragments. Compose via ordered concatenation: core body + addendum prefix + addendum suffix. Implement `renumber_sections()` helper for L3+ composition.

**Details**: 
1. Create 4 new fragment files:
   - `templates/addendum/level3-arch/spec-prefix.md` (L3 header sections)
   - `templates/addendum/level3-arch/spec-suffix.md` (L3 footer sections)
   - `templates/addendum/level3plus-govern/spec-prefix.md` (L3+ header sections)
   - `templates/addendum/level3plus-govern/spec-suffix.md` (L3+ footer sections)
2. Implement helpers: `extract_core_body()`, `renumber_sections()`, `compose_footer()`
3. Rewrite L3 case: `core_body + L3_prefix + L3_suffix`
4. Rewrite L3+ case: `core_body + renumber(L3+_prefix) + renumber(L3+_suffix)`

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fragment concatenation (Chosen)** | Matches existing plan.md dynamic approach, eliminates drift, no new parsing needed | Requires section renumbering logic (~40 min effort) | 9/10 |
| Marker-based insertion engine | More flexible for complex compositions | Over-engineering (no complex requirements), higher complexity | 6/10 |
| Section-based assembler | Granular control per section | Intermediate complexity, more moving parts than needed | 7/10 |
| Keep heredocs | Zero extraction work | Drift worsens over time, maintenance burden increases | 2/10 |

**Why Chosen**: Fragment concatenation matches existing pattern (plan.md already uses dynamic append), eliminates drift by reading actual template files, and requires no new parsing engine — just sequential concatenation with section renumbering.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Heredoc drift is real problem (386 LOC out of sync with actual templates) |
| 2 | **Beyond Local Maxima?** | PASS | Explored marker insertion, section assembler, keeping heredocs |
| 3 | **Sufficient?** | PASS | Fragment concatenation is simplest approach that eliminates drift |
| 4 | **Fits Goal?** | PASS | Directly addresses template drift and maintainability goals |
| 5 | **Open Horizons?** | PASS | Pattern scales to future template levels without rework |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Eliminates template drift (compose.sh reads actual template files)
- Reduces compose.sh LOC by ~164 (386 heredoc → ~130 dynamic logic + ~92 fragments = net -164)
- `compose.sh --verify` catches drift automatically
- Matches existing plan.md dynamic pattern (consistency)

**Negative**:
- Section renumbering adds complexity — Mitigation: Implement robust `renumber_sections()` with edge case tests (T029)
- Requires 4 new fragment files — Mitigation: One-time creation (T027-T028), ~40 min total

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Section renumbering regex fails on edge cases | H | Comprehensive test cases in `renumber_sections()`, `--verify` detects failures |
| Fragment file missing at runtime | M | compose.sh fails with clear error, `--verify` catches before production |

---

### Implementation

**Affected Systems**:
- `templates/addendum/level3-arch/spec-prefix.md` (New file, ~46 LOC)
- `templates/addendum/level3-arch/spec-suffix.md` (New file, ~46 LOC)
- `templates/addendum/level3plus-govern/spec-prefix.md` (New file, ~46 LOC)
- `templates/addendum/level3plus-govern/spec-suffix.md` (New file, ~46 LOC)
- `scripts/templates/compose.sh` (3 helpers + 2 case rewrites, net -164 LOC)

**Rollback**: Revert T027-T031, restore heredocs from git history

---

## Session Decision Log

> **Purpose**: Track all gate decisions made during this session for audit trail and learning.

| Timestamp | Gate | Decision | Confidence | Uncertainty | Evidence |
|-----------|------|----------|------------|-------------|----------|
| 2026-02-12 14:00 | Pre-Implementation | PASS | HIGH | 0.05 | All 6 tasks researched in spec 109, decisions evidence-based |
| 2026-02-12 14:15 | ADR-001 JSONC | ACCEPT | HIGH | 0.10 | Parser A proven in production, YAGNI applies (only 2 files) |
| 2026-02-12 14:30 | ADR-002 Shell Libs | ACCEPT | HIGH | 0.10 | Follows existing precedent (common.sh sourcing), duplication clear |
| 2026-02-12 14:45 | ADR-003 Extraction Order | ACCEPT | HIGH | 0.08 | Pure-first minimizes risk, atomic verification possible |
| 2026-02-12 15:00 | ADR-004 Console Defer | ACCEPT | HIGH | 0.12 | High ROI analysis clear (Batches 1-2 = 75 min, 18 fixes) |
| 2026-02-12 15:15 | ADR-005 Dynamic Templates | ACCEPT | HIGH | 0.15 | Fragment approach matches existing pattern, drift elimination critical |

**Log Instructions**:
- Record each gate decision as it occurs during the session
- Include both PASS and BLOCK decisions for completeness
- Link to relevant ADR if decision resulted in new architecture record

---

<!--
Level 3+ Decision Record (~450 lines)
Document significant technical decisions
5 ADRs for key architectural choices
Each ADR includes Five Checks evaluation
Session Decision Log for audit trail
All decisions evidence-based from spec 109 research
-->
