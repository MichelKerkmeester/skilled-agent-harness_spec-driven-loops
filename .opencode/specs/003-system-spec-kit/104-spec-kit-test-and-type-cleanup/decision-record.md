# Decision Record: Spec Kit Test & Type Cleanup

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

## ADR-001: Gradual Vitest Migration via .vitest.ts Naming Convention

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-10 |
| **Deciders** | Established during Spec 103 REC-015 POC evaluation |

---

### Context

The project uses a custom test runner with a pass/fail/skip pattern across 104 test files. The custom runner lacks standard tooling: no coverage reports, no watch mode, no CI integration, and no describe/it structure. During Spec 103 Phase C (Wave 5), a Vitest proof-of-concept was completed — 3 files converted, 20/20 tests passing in 115ms. The migration needs to happen without disrupting the existing 1,589-test suite.

### Constraints
- 104 test files exist using the custom runner — a big-bang migration would risk regressions
- Both test runners must coexist during the transition period
- Vitest config must detect `.vitest.ts` files without interfering with the custom runner's `.test.ts` files
- The custom runner cannot be removed until ALL 104 files are migrated

---

### Decision

**Summary**: Use `.vitest.ts` file extension for new/migrated tests, allowing both runners to coexist during a gradual migration.

**Details**: New test files and migrated tests use the `.vitest.ts` extension. The `vitest.config.ts` includes pattern `**/*.vitest.ts` while the custom runner continues to pick up `**/*.test.ts`. Files are converted incrementally by difficulty tier. Once all 104 files are migrated, the custom runner is removed and the vitest config is updated to also include `**/*.test.ts`.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Gradual .vitest.ts migration** | Zero risk, incremental, both runners coexist, no big-bang switchover | Temporary dual-runner complexity, two naming conventions during transition | 9/10 |
| Big-bang migration (all at once) | Clean single cutover, no dual-runner period | High risk of regressions across 104 files, blocks all other work during migration | 3/10 |
| Keep custom runner permanently | No migration effort, no risk | Accumulates tech debt, no coverage reports, no CI integration, no watch mode | 2/10 |
| Jest instead of Vitest | Mature ecosystem, widely known | Slower execution, more configuration needed, not TS-native, heavier dependency | 5/10 |

**Why Chosen**: The gradual approach was validated by the Spec 103 POC (3 files, 20/20 tests, 115ms). It eliminates migration risk entirely — each file is converted and verified independently, and rollback is trivial (rename the file back). The dual-runner period is a manageable complexity cost for zero-risk migration.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Custom runner blocks coverage reports, CI integration, and watch mode — standard framework is required |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives evaluated; big-bang, keep custom, and Jest all scored lower |
| 3 | **Sufficient?** | PASS | Naming convention is the simplest coexistence mechanism — no build tooling changes needed |
| 4 | **Fits Goal?** | PASS | Directly enables test modernization, the primary goal of Spec 104 |
| 5 | **Open Horizons?** | PASS | Vitest is the modern standard; migration path leads to full CI/CD integration |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Zero-risk migration — each file converted independently with immediate verification
- Standard tooling unlocked: coverage reports, watch mode, CI integration, describe/it structure
- POC already validated: 20/20 tests, 115ms execution time
- Rollback is trivial per-file (rename `.vitest.ts` back to `.test.ts`)

**Negative**:
- Temporary dual-runner complexity during transition — Mitigation: Clear naming convention makes it obvious which runner a file uses
- Two test commands needed during transition (`npm test` for custom, `npx vitest` for new) — Mitigation: Package.json scripts updated to run both

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Some test patterns don't translate cleanly to Vitest | Medium | Difficulty tiers identified — complex files addressed last with patterns from easier files |
| Dual-runner confusion for contributors | Low | README documents both commands; file extension makes intent clear |
| Migration stalls partway through | Medium | Tracked in tasks.md with completion percentage; each phase independently valuable |

---

### Implementation

**Affected Systems**:
- All 104 test files in `mcp_server/test/` (gradual conversion)
- `mcp_server/vitest.config.ts` (already created in Spec 103)
- `mcp_server/package.json` (test scripts updated)
- Custom test runner (removed after full migration)

**Rollback**: Rename any `.vitest.ts` file back to `.test.ts` to revert to custom runner. No infrastructure changes needed for per-file rollback. Full rollback: revert package.json scripts and vitest.config.ts.

---

## ADR-002: simFactory Type Unification Approach

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-02-11 |
| **Deciders** | To be resolved during Phase 4 implementation |

---

### Context

Four extractor files (`decision-extractor.ts`, `diagram-extractor.ts`, `collect-session-data.ts`, `conversation-extractor.ts`) use `simFactory` with types that don't align with extractor output types. This misalignment requires double-casts (`as unknown as TargetType`) to satisfy TypeScript. During Spec 103 Phase C Wave 3, REC-020 Cluster B upgraded 4 TODO comments to detailed 6-line TECH-DEBT blocks documenting the root cause, but the underlying type mismatch was accepted as tech debt rather than resolved.

### Constraints
- simFactory is used across 4 extractor files — changes must be consistent
- Extractor output types are consumed by downstream callers — breaking changes would cascade
- Index signatures were added to `DecisionRecord`, `DecisionOption`, `DiagramOutput` in Spec 103 (REC-020 Cluster A1) as a partial fix
- The fix must maintain backwards compatibility with existing test assertions

---

### Decision

**Summary**: To be determined — design a shared interface that both simFactory and extractors can use without double-casts.

**Details**: Three options under evaluation:

**Option A — Extend existing types with index signatures**: Already partially done (REC-020 A1). Could be extended to remaining extractors. Least disruptive but doesn't fix the root cause.

**Option B — Create a new shared base type**: Define a `Simulatable` base interface that simFactory outputs and extractors extend. Clean separation but requires refactoring both sides.

**Option C — Refactor simFactory to output extractor-compatible types directly**: Make simFactory generic (`simFactory<T>`) so it produces the exact extractor output type. Most thorough fix but highest effort.

This ADR will be resolved during Phase 4 implementation based on the approach that emerges during hands-on type analysis.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| A: Extend with index signatures | Minimal disruption, partially done | Band-aid, doesn't fix root cause, `[key: string]: unknown` weakens type safety | 5/10 |
| B: Shared base type | Clean architecture, proper type hierarchy | Requires refactoring both simFactory and extractors | 7/10 |
| **C: Generic simFactory** | Root cause fix, full type safety, eliminates all double-casts | Highest effort, requires simFactory redesign | 8/10 |
| Keep TECH-DEBT annotations | Zero effort | Double-casts remain, type safety gap persists | 2/10 |

**Why Chosen**: Decision deferred — Option C scores highest but needs hands-on analysis during implementation to validate feasibility. Option B is the fallback if C proves too disruptive.

---

### Consequences

**Positive** (expected from resolution):
- Elimination of all double-casts in extractor files
- Full TypeScript type safety restored across the extractor pipeline
- Cleaner code that communicates intent without workaround annotations

**Negative** (expected):
- Implementation effort required across 4+ files — Mitigation: Scoped to Phase 4, isolated from other phases
- Potential test updates needed — Mitigation: Existing test assertions may simplify once types align

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Type unification cascades to unexpected consumers | Medium | Run full test suite after each file change |
| simFactory redesign too complex for one phase | Medium | Fall back to Option B (shared base type) |

---

### Implementation

**Affected Systems**:
- `scripts/extractors/decision-extractor.ts`
- `scripts/extractors/diagram-extractor.ts`
- `scripts/extractors/collect-session-data.ts`
- `scripts/extractors/conversation-extractor.ts`
- `scripts/lib/sim-factory.ts` (if Option C)
- Related test files

**Rollback**: Revert to TECH-DEBT annotations with double-casts (current state).

---

## ADR-003: Build Error Fix Strategy for rank-memories.ts

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-11 |
| **Deciders** | Determined by type analysis during Spec 103 Phase C |

---

### Context

`scripts/memory/rank-memories.ts` has 3 pre-existing `tsc` errors where `NormalizedMemory` is cast to `FolderMemoryInput`. These types don't overlap sufficiently — `NormalizedMemory` lacks several fields that `FolderMemoryInput` requires (and vice versa). The errors were flagged during Spec 103's final build verification but were not introduced by Spec 103 and were left as pre-existing. They are the only `tsc --build --force` errors in the entire codebase.

### Constraints
- The errors are pre-existing — not introduced by any recent spec
- `NormalizedMemory` and `FolderMemoryInput` serve different purposes but are used interchangeably
- Runtime behavior is currently correct (the casts work at runtime because JS doesn't enforce types)
- The fix must not break the `npx tsc --build --force` zero-error target

---

### Decision

**Summary**: Fix by updating the types to be compatible using proper type narrowing rather than using `as unknown as` double-cast workarounds.

**Details**: Analyze the actual fields used at each cast site. Either: (1) add the missing fields to `NormalizedMemory` that `FolderMemoryInput` requires, (2) create a type adapter function that maps between the two types with explicit field mapping, or (3) narrow `FolderMemoryInput` at the call sites to only require the fields actually used. The goal is zero `tsc` errors with no double-casts.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Proper type narrowing/adaptation** | Clean types, zero tsc errors, no workarounds | Requires understanding both types deeply | 8/10 |
| `as unknown as` double-cast | Quick fix, silences errors | Hides type mismatches, defeats TypeScript's purpose, contradicts Spec 103's REC-020 cleanup | 2/10 |
| @ts-ignore on each line | Minimal change | Same as double-cast — hides problems, contradicts @ts-nocheck removal effort | 1/10 |
| Leave as-is | No effort | 3 tsc errors persist, blocks zero-error target | 0/10 |

**Why Chosen**: After Spec 103 removed 96 `@ts-nocheck` directives, fixed ~1,100 type errors, and eliminated double-casts from extractors (REC-020), adding new workarounds would be regressive. Proper type narrowing is consistent with the project's type-safety trajectory.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Only remaining tsc errors in the codebase — blocks zero-error build target |
| 2 | **Beyond Local Maxima?** | PASS | Double-cast and @ts-ignore alternatives explicitly rejected |
| 3 | **Sufficient?** | PASS | Type narrowing is the minimal correct fix — no over-engineering |
| 4 | **Fits Goal?** | PASS | Directly supports the "type cleanup" half of Spec 104's scope |
| 5 | **Open Horizons?** | PASS | Proper types prevent future regressions and support IDE tooling |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Zero `tsc --build --force` errors achieved for the entire codebase
- Types accurately reflect runtime data flow
- Consistent with Spec 103's type-safety improvements

**Negative**:
- Requires understanding the relationship between `NormalizedMemory` and `FolderMemoryInput` — Mitigation: Both types are well-documented in `shared/types.ts`

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Type changes affect downstream consumers of rank-memories | Low | rank-memories is a standalone script with limited consumers |
| Field additions to NormalizedMemory create new required fields elsewhere | Low | Use optional fields or Partial<> where appropriate |

---

### Implementation

**Affected Systems**:
- `scripts/memory/rank-memories.ts` (primary — 3 cast sites)
- `shared/types.ts` (potential type updates)
- Related test files (if type signatures change)

**Rollback**: Revert type changes and restore original casts.

---

## ADR Index

| ADR | Title | Status | Date | Impact |
|-----|-------|--------|------|--------|
| ADR-001 | Gradual Vitest Migration via .vitest.ts Naming Convention | Accepted | 2026-02-10 | Test framework modernization |
| ADR-002 | simFactory Type Unification Approach | Proposed | 2026-02-11 | Type safety in extractor pipeline |
| ADR-003 | Build Error Fix Strategy for rank-memories.ts | Accepted | 2026-02-11 | Zero tsc error target |

---

## Session Decision Log

> **Purpose**: Track all gate decisions made during implementation sessions for audit trail and learning.

| Timestamp | Gate | Decision | Confidence | Uncertainty | Evidence |
|-----------|------|----------|------------|-------------|----------|
| | | | | | |
| | | | | | |
| | | | | | |

**Log Instructions**:
- Record each gate decision as it occurs during the implementation session
- Include both PASS and BLOCK decisions for completeness
- Link to relevant ADR if decision resulted in new architecture record

---

<!--
Level 3+ Decision Record for Spec 104
3 ADRs covering test migration, type unification, and build error strategy
ADR-001 and ADR-003 accepted; ADR-002 deferred to Phase 4 implementation
Session Decision Log ready for implementation sessions
-->
