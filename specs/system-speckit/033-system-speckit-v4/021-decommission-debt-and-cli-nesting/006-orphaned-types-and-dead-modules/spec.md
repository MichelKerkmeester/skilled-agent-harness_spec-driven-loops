---
title: "Feature Specification: Phase 6: orphaned-types-and-dead-modules"
description: "Seven structural types survive in shared/types.ts with no implementer or caller, two runtime modules have no production caller, two test files sit outside every vitest include glob and never run, one catch block swallows every error, and the markdown-link checker double-counts two of its roots."
trigger_phrases:
  - "orphaned types spec"
  - "shared types database interface types"
  - "vector store types sections"
  - "two never run tests"
  - "rollout policy dead module"
  - "check-markdown-links roots"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: orphaned-types-and-dead-modules

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-05 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 6 of 7 |
| **Predecessor** | `../005-hook-fallback-failure-signal/spec.md` |
| **Successor** | `../007-memory-command-family-naming-decision/spec.md` |
| **Handoff Criteria** | `grep` proof for every deletion/re-homing decision, both orphaned tests either running in CI or deleted, the empty catch reasoned or logged, the link-checker roots deduped, and typecheck/suites green before and after |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the decommission debt fixes specification.

**Scope Boundary**: `shared/types.ts`'s seven orphaned structural types, `runtime/lib/cognitive/rollout-policy.ts`, `runtime/lib/description/repair.ts`, the two orphaned test files, `scripts/spec-folder/alignment-validator.ts`'s empty catch, and `scripts/check-markdown-links.cjs`'s duplicated roots. No other dead-code candidate outside this named set is in scope.

**Dependencies**:
- None on the other six phases.

**Deliverables**:
- Each named symbol either deleted (with grep proof of zero remaining reference) or re-homed with a stated reason.
- Both orphaned tests either wired into a vitest include glob or deleted.
- The empty catch given a reason comment or a log line.
- `check-markdown-links.cjs`'s `ROOTS` deduplicated and its printed counts corrected.
- Typecheck and the touched suites passing before and after.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/skills/system-spec-kit/shared/types.ts` still exports `IVectorStore` (line 246), `SearchOptions` (189), `SearchResult` (204), `StoreStats` (239), and the structural `Database` (171), `DatabaseExtended` (179), and `PreparedStatement` (157) interfaces; a repository-wide search finds no importer of any of these seven symbols outside `types.ts` itself and `shared/index.ts`'s barrel re-export - no implementer, no caller, no test. `runtime/lib/cognitive/rollout-policy.ts` and `runtime/lib/description/repair.ts` are each imported only by their own test files (`runtime/tests/rollout-policy.vitest.ts`; `runtime/tests/description/repair.vitest.ts`, `repair-specimens.vitest.ts`, and `description-merge.vitest.ts`, which imports `mergePreserveRepair` directly as its subject under test) - no production module calls either. `scripts/lib/completion-state.test.mjs` (371 lines) and `runtime/scripts/tests/resource-map-extractor.vitest.ts` sit outside every include glob in both vitest configs (`.opencode/skills/system-spec-kit/vitest.config.ts:9-13` matches `tests/**/*.vitest.ts`, `scripts/tests/**/*.vitest.ts`, `runtime/tests/**/*.vitest.ts`; `runtime/vitest.config.ts:16-20` matches the same three plus the deep-loop suite) - the first fails on directory (`scripts/lib/`, not `scripts/tests/`) and extension (`.test.mjs`, not `.vitest.ts`/`.test.ts`); the second fails on directory alone (`runtime/scripts/tests/`, not `runtime/tests/`). Neither has run in CI since whenever it was last moved or written. `scripts/spec-folder/alignment-validator.ts:582-586` has `catch (error: unknown) { if (error instanceof Error) { // Could not read alternatives - proceed with warning } }` - the branch does nothing: no log, no rethrow, no side effect, so any error reading alternatives disappears silently. `scripts/check-markdown-links.cjs:24-26` lists `.opencode/agents` and `.opencode/commands` twice each in its `ROOTS` array; `walk()` (line 79) pushes every matching file with no dedup, so every markdown file under those two directories is read and its links checked twice, inflating the script's own printed `${files.length} files, ${checked} links checked` summary.

### Purpose
Every named orphan is deleted with grep proof or re-homed with a stated reason, both orphaned tests run somewhere real or are removed, the empty catch says why it is empty or logs what it swallowed, and the link-checker's counts reflect the actual file set once.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- For each of `IVectorStore`, `SearchOptions`, `SearchResult`, `StoreStats`, `Database`, `DatabaseExtended`, `PreparedStatement` in `shared/types.ts`: confirm zero non-`types.ts`/`index.ts` importer with `rg`, then delete; if a decision instead re-homes one (e.g., a structural `Database`/`PreparedStatement` pair judged worth keeping as documentation of a future contract), state the reason in the same commit.
- For `runtime/lib/cognitive/rollout-policy.ts` and `runtime/lib/description/repair.ts`: confirm zero production caller with `rg`, then either delete the module and its dedicated test file(s), or state why a test-only module earns its keep (e.g., it is a fixture generator other tests import) and leave it with that reason recorded in a comment.
- Move `scripts/lib/completion-state.test.mjs` under a directory and extension a vitest include glob already matches, or delete it if its assertions are stale/superseded.
- Move `runtime/scripts/tests/resource-map-extractor.vitest.ts` under `runtime/tests/` (or add its actual directory to `runtime/vitest.config.ts`'s `include` array), or delete it if superseded.
- Give `alignment-validator.ts:582-586`'s catch block either a `console.log`/comment stating why swallowing is intentional, or a real log line reporting the caught error.
- Deduplicate `check-markdown-links.cjs:24-26`'s `ROOTS` array to one entry per directory, and confirm the corrected `files`/`checked` counts against a manual count.
- Run `npm run build`/typecheck for `shared`, `scripts`, and `runtime`, plus the touched test suites, before and after every change in this phase.

### Out of Scope
- Any dead-code candidate not named in this spec - this phase does not re-run a fresh dead-code sweep; it closes exactly the six items the parent packet's research identified.
- Behavior changes to `mergePreserveRepair`, `rollout-policy`'s exported functions, or any other symbol in the two runtime modules beyond the delete/re-home decision - if kept, the module's logic is untouched.
- `check-markdown-links.cjs`'s allowlist entries or exclusion segments - only the `ROOTS` duplication is in scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/shared/types.ts` | Modify | Delete or re-home the seven orphaned symbols |
| `.opencode/skills/system-spec-kit/runtime/lib/cognitive/rollout-policy.ts` | Delete or re-home | No production caller |
| `.opencode/skills/system-spec-kit/runtime/lib/description/repair.ts` | Delete or re-home | No production caller |
| `.opencode/skills/system-spec-kit/scripts/lib/completion-state.test.mjs` | Move or Delete | Outside every vitest include glob |
| `.opencode/skills/system-spec-kit/runtime/scripts/tests/resource-map-extractor.vitest.ts` | Move or Delete | Outside every vitest include glob |
| `.opencode/skills/system-spec-kit/scripts/spec-folder/alignment-validator.ts` | Modify | Give the empty catch a reason or a log line |
| `.opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs` | Modify | Deduplicate `ROOTS`, correct the printed counts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every one of the seven `shared/types.ts` symbols and the two runtime modules is either deleted with `rg` proof of zero remaining non-declaration reference, or kept with a stated reason recorded in a comment at the declaration site |
| REQ-002 | Both orphaned test files run in a vitest include glob after this phase, or are deleted |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `alignment-validator.ts`'s empty catch either logs the caught error or states in a comment why swallowing it is intentional |
| REQ-004 | `check-markdown-links.cjs`'s `ROOTS` array lists each directory once, and its printed `files`/`checked` counts match a manual count of the actual (deduplicated) file set |
| REQ-005 | Typecheck of `shared`, `scripts`, and `runtime`, plus every touched test suite, passes before and after this phase's changes |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n "IVectorStore|SearchOptions|SearchResult|StoreStats|DatabaseExtended|PreparedStatement" .opencode/skills/system-spec-kit --glob '*.ts'` returns zero hits outside `shared/types.ts` and `shared/index.ts` after deletion, or the decision to keep is recorded with a reason.
- **SC-002**: `rg -n "rollout-policy|description/repair" .opencode/skills/system-spec-kit/runtime --glob '*.ts'` returns zero non-test hits after deletion, or the keep decision is recorded.
- **SC-003**: Both previously-orphaned test files appear in a `vitest run` invocation's executed-file list, or no longer exist in the repository.
- **SC-004**: `check-markdown-links.cjs`'s printed `files` count, after deduplication, equals a manual `find .opencode/skills .opencode/commands .opencode/agents .claude/agents .claude/commands -name '*.md' | sort -u | wc -l`-style count (accounting for the script's own exclusions).
- **SC-005**: Typecheck and the touched suites report the same pass count before and after, modulo the tests this phase intentionally adds, moves, or removes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Deleting `IVectorStore`/`SearchOptions`/`SearchResult`/`StoreStats`/`Database`/`DatabaseExtended`/`PreparedStatement` could break a currently-unbuilt but planned consumer (e.g., a future search-lane spec referencing these types by name) | Low | `rg` the spec corpus (`specs/`) as well as source before deleting, to catch a documented-but-unimplemented dependency |
| Risk | Moving `resource-map-extractor.vitest.ts` into the include path could surface previously-unexercised failures now that it actually runs | Med | Run it standalone first (`vitest run <path>`) before wiring it into the shared config, to see its current pass/fail state in isolation |
| Dependency | `check-markdown-links.cjs`'s corrected counts must not newly report broken links that the duplicated-root version was masking by chance ordering | Low | Run the script before and after the `ROOTS` fix and diff the `broken` list, not just the summary counts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Deduplicating `check-markdown-links.cjs`'s `ROOTS` roughly halves its own runtime for the two duplicated directories - report the before/after wall-clock time.
- **NFR-P02**: Not otherwise applicable - this phase removes code, it does not add a runtime path.

### Security
- **NFR-S01**: No new environment variable or credential surface.
- **NFR-S02**: The catch-block fix must not log a secret if `error.message` ever contains one - use the same redaction convention other logged errors in this codebase already follow, if one exists.

### Reliability
- **NFR-R01**: Deleting a symbol or module must not leave a dangling `import` anywhere - the typecheck gate (REQ-005) is the authoritative proof.
- **NFR-R02**: Wiring an orphaned test into CI must not be silently skipped if it currently fails - a failing re-enabled test blocks this phase's completion until fixed or explicitly deferred with operator approval.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: not applicable - this phase deletes/moves fixed, named files and symbols.
- Maximum length: not applicable.
- Invalid format: not applicable.

### Error Scenarios
- External service failure: not applicable.
- Network timeout: not applicable.
- Concurrent access: not applicable - this is a single-session code-cleanup phase.

### State Transitions
- Partial completion: if only some of the six named items are addressed before a session ends, `implementation-summary.md` records exactly which are done and which remain, per REQ-001's "or kept with a stated reason" clause applying per-item, not packet-wide.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Six named items across five files, each independently small |
| Risk | 7/25 | Deletion risk is bounded by grep proof; re-enabling a dormant test carries a real but contained chance of surfacing a pre-existing failure |
| Research | 3/20 | Every item's zero-caller status and exact line numbers were confirmed by direct source reading before this spec was written |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open. Each of the six items has a clear default (delete unless a reason to keep surfaces during implementation), stated in Scope.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
